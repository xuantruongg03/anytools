import { NextRequest, NextResponse } from "next/server";
import { processPaymentWebhook } from "@/lib/credits-sheets";
import { sendPaymentErrorEmail } from "@/lib/utils/email-service";

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || process.env.ADMIN_SECRET || "adminsupersecretkey123456";

/**
 * Trích xuất User ID từ nội dung chuyển khoản
 * Hỗ trợ cả 2 định dạng ID song song trong hệ thống:
 *   - Legacy (popup.js / topup.js / content.js): USER_XXXXXX  (6 ký tự viết hoa)
 *   - Mới   (tracker.js):                       usr_xxxxxxxx_mv6xxxxxxx (8 chars + timestamp base36)
 * 
 * VD nội dung chuyển khoản hợp lệ:
 *   "NAP USER_40RA71"
 *   "NAP usr_8s81edbt_mv6u0d9m"
 *   "USER 40RA71"
 *   "usr-8s81edbt-mv6u0d9m"
 */
function extractUserId(content: string): string | null {
    if (!content) return null;

    // 1. Định dạng mới từ tracker.js: usr_xxxxxxxx_xxxxxxxx (giữ nguyên lowercase vì MongoDB lưu lowercase)
    let match = content.match(/usr_[a-z0-9]{6,10}_[a-z0-9]{6,12}/i);
    if (match) return match[0].toLowerCase();

    // 2. Dự phòng usr_ với dấu gạch ngang / dấu cách thay vì underscore: usr-xxxx-xxxx hoặc usr xxxx xxxx
    match = content.match(/usr[- ]([a-z0-9]{6,10})[- _]([a-z0-9]{6,12})/i);
    if (match) return `usr_${match[1].toLowerCase()}_${match[2].toLowerCase()}`;

    // 3. Định dạng legacy chuẩn: USER_XXXXXX
    match = content.match(/USER_[A-Za-z0-9_]+/i);
    if (match) return match[0].toUpperCase();

    // 4. Dự phòng USER với dấu gạch ngang / dấu cách: USER-XXXX hoặc USER XXXX
    match = content.match(/USER[- ]([A-Za-z0-9]{4,10})/i);
    if (match) return `USER_${match[1].toUpperCase()}`;

    return null;
}

export async function POST(request: NextRequest) {
    // 1. Kiểm tra bảo mật Webhook Secret
    const signature = request.headers.get("x-sepay-signature") || "";
    const timestamp = request.headers.get("x-sepay-timestamp") || "";

    // Kiểm tra cấu hình
    if (!WEBHOOK_SECRET || !signature || !timestamp) {
        return NextResponse.json(
            { success: false, error: "Missing authentication data" },
            { status: 401 }
        );
    }

    // Chống gửi lại webhook cũ: cho phép lệch tối đa 5 phút
    const timestampNumber = Number(timestamp);

    if (
        !Number.isFinite(timestampNumber) ||
        Math.abs(Date.now() / 1000 - timestampNumber) > 300
    ) {
        return NextResponse.json(
            { success: false, error: "Invalid timestamp" },
            { status: 401 }
        );
    }

    // Đọc nguyên văn body trước khi parse JSON
    const rawBody = await request.text();

    // Chuỗi cần ký: timestamp.rawBody
    const message = `${timestamp}.${rawBody}`;

    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(WEBHOOK_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(message)
    );

    const hash = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    const expectedSignature = `sha256=${hash}`;

    if (signature !== expectedSignature) {
        console.warn("[Webhook] Invalid HMAC signature");

        return NextResponse.json(
            { success: false, error: "Invalid signature" },
            { status: 401 }
        );
    }

    try {
        const body = JSON.parse(rawBody);

        // 2. Chuẩn hóa dữ liệu từ SePay / Casso / Custom
        let transactions: Array<{
            transId: string;
            amount: number;
            content: string;
            bankCode?: string;
        }> = [];

        // SePay format: { id, transferType: 'in', transferAmount, content, description, referenceCode, gateway }
        if (body.transferAmount !== undefined && (body.content !== undefined || body.description !== undefined)) {
            if (body.transferType === "in" || !body.transferType) {
                const combinedContent = `${body.content || ""} ${body.description || ""}`.trim();
                transactions.push({
                    transId: String(body.id || body.referenceCode || Date.now()),
                    amount: Number(body.transferAmount),
                    content: combinedContent,
                    bankCode: String(body.gateway || "BANK"),
                });
            }
        }
        // Casso format: { error: 0, data: [ { id, tid, amount, description } ] }
        else if (Array.isArray(body.data)) {
            for (const item of body.data) {
                if (item.amount > 0) {
                    transactions.push({
                        transId: String(item.tid || item.id || Date.now()),
                        amount: Number(item.amount),
                        content: String(item.description),
                        bankCode: "CASSO",
                    });
                }
            }
        }
        // Generic format: { transId, amount, content }
        else if (body.amount && body.content) {
            transactions.push({
                transId: String(body.transId || body.id || Date.now()),
                amount: Number(body.amount),
                content: String(body.content),
                bankCode: String(body.bankCode || "MANUAL"),
            });
        }

        if (transactions.length === 0) {
            return NextResponse.json({ success: true, message: "No valid incoming transactions found" });
        }

        const results = [];
        for (const tx of transactions) {
            const userId = extractUserId(tx.content);
            if (!userId) {
                const failureMsg = `Không tìm thấy mã User (USER_XXXX) trong nội dung: "${tx.content}"`;
                results.push({
                    transId: tx.transId,
                    success: false,
                    message: failureMsg,
                });

                // Tự động gửi mail thông báo cho Admin để can thiệp hỗ trợ khách
                sendPaymentErrorEmail({
                    transId: tx.transId,
                    amount: tx.amount,
                    currency: "VND",
                    content: tx.content,
                    bankCode: tx.bankCode,
                    userId: null,
                    reason: failureMsg,
                    gateway: tx.bankCode || "SePay/Casso",
                }).catch((err) => console.error("[Payment Email Error]:", err));

                continue;
            }

            const res = await processPaymentWebhook({
                transId: tx.transId,
                userId: userId,
                amount: tx.amount,
                content: tx.content,
                bankCode: tx.bankCode,
            });

            if (!res.success) {
                // Nếu lỗi thật sự (không phải do trùng lặp lặp lại của webhook)
                if (res.message !== "Giao dịch này đã được xử lý trước đó") {
                    sendPaymentErrorEmail({
                        transId: tx.transId,
                        amount: tx.amount,
                        currency: "VND",
                        content: tx.content,
                        bankCode: tx.bankCode,
                        userId: userId,
                        reason: res.message,
                        gateway: tx.bankCode || "SePay/Casso",
                    }).catch((err) => console.error("[Payment Email Error]:", err));
                }
            }

            results.push({
                transId: tx.transId,
                userId,
                ...res,
            });
        }

        return NextResponse.json({
            success: true,
            processedCount: results.length,
            details: results,
        });
    } catch (error: any) {
        console.error("[Webhook Error]:", error);

        sendPaymentErrorEmail({
            transId: "SYSTEM_EXCEPTION",
            content: "Lỗi hệ thống khi nhận webhook thanh toán",
            reason: error?.message || "Internal server error",
            gateway: "Webhook",
        }).catch((err) => console.error("[Payment Email Error]:", err));

        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
