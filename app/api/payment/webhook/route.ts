import { NextRequest, NextResponse } from "next/server";
import { processPaymentWebhook } from "@/lib/credits-sheets";

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || process.env.ADMIN_SECRET || "adminsupersecretkey123456";

/**
 * Trích xuất User ID từ nội dung chuyển khoản (VD: "NAP USER_abc123" hoặc "USER_abc123")
 */
function extractUserId(content: string): string | null {
    if (!content) return null;
    // Tìm USER_xxxx
    const match = content.match(/USER_[A-Za-z0-9_]+/i);
    return match ? match[0].toUpperCase() : null;
}

export async function POST(request: NextRequest) {
    // 1. Kiểm tra bảo mật Webhook Secret
    const authHeader = request.headers.get("authorization");
    const secretHeader = request.headers.get("x-webhook-secret");
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get("secret");

    const providedSecret =
        secretHeader ||
        querySecret ||
        (authHeader?.startsWith("Apikey ") ? authHeader.replace("Apikey ", "").trim() : "") ||
        (authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "").trim() : "");

    if (providedSecret !== WEBHOOK_SECRET) {
        console.warn("[Webhook] Unauthorized attempt with secret:", providedSecret);
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // 2. Chuẩn hóa dữ liệu từ SePay / Casso / Custom
        let transactions: Array<{
            transId: string;
            amount: number;
            content: string;
            bankCode?: string;
        }> = [];

        // SePay format: { id, transferType: 'in', transferAmount, content, referenceCode }
        if (body.transferAmount !== undefined && body.content !== undefined) {
            if (body.transferType === "in" || !body.transferType) {
                transactions.push({
                    transId: String(body.referenceCode || body.id || Date.now()),
                    amount: Number(body.transferAmount),
                    content: String(body.content),
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
                results.push({
                    transId: tx.transId,
                    success: false,
                    message: `Không tìm thấy mã User (USER_XXXX) trong nội dung: "${tx.content}"`,
                });
                continue;
            }

            const res = await processPaymentWebhook({
                transId: tx.transId,
                userId: userId,
                amount: tx.amount,
                content: tx.content,
                bankCode: tx.bankCode,
            });

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
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
