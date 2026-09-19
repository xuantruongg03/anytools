import { NextRequest, NextResponse } from "next/server";
import { processPaymentWebhook } from "@/lib/credits-sheets";
import crypto from "crypto";

const BMAC_SECRET = 
    process.env.BUYMEACOFFEE_WEBHOOK_SECRET || 
    process.env.PAYMENT_WEBHOOK_SECRET || 
    process.env.ADMIN_SECRET || 
    "";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-webhook-secret, x-bmac-signature, x-signature",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Trích xuất User ID từ nội dung tin nhắn (VD: "NAP USER_123456" hoặc "USER_123456")
 */
function extractUserId(text: string): string | null {
    if (!text) return null;
    const match = text.match(/USER_[A-Za-z0-9_]+/i);
    return match ? match[0].toUpperCase() : null;
}

export async function POST(request: NextRequest) {
    const rawBody = await request.text();
    
    // 1. Kiểm tra secret xác thực từ Buy Me a Coffee
    if (BMAC_SECRET) {
        const { searchParams } = new URL(request.url);
        const querySecret = searchParams.get("secret");
        const secretHeader = request.headers.get("x-webhook-secret") || request.headers.get("x-secret");
        const authHeader = request.headers.get("authorization");
        const signatureHeader = request.headers.get("x-bmac-signature") || request.headers.get("x-signature");

        const directSecret =
            secretHeader ||
            querySecret ||
            (authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "").trim() : "") ||
            (authHeader?.startsWith("Apikey ") ? authHeader.replace("Apikey ", "").trim() : "");

        let isVerified = false;

        // Cách 1: So khớp trực tiếp secret token
        if (directSecret && directSecret === BMAC_SECRET) {
            isVerified = true;
        }

        // Cách 2: So khớp chữ ký HMAC SHA-256 mà BMAC gửi kèm
        if (!isVerified && signatureHeader) {
            try {
                const computedSignature = crypto
                    .createHmac("sha256", BMAC_SECRET)
                    .update(rawBody)
                    .digest("hex");

                if (
                    signatureHeader === computedSignature ||
                    signatureHeader === `sha256=${computedSignature}`
                ) {
                    isVerified = true;
                }
            } catch (e) {
                console.warn("[BuyMeACoffee Webhook] Signature verification error:", e);
            }
        }

        if (!isVerified && (directSecret || signatureHeader)) {
            console.warn("[BuyMeACoffee Webhook] Unauthorized secret or signature mismatch.");
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
        }
    }

    try {
        const body = JSON.parse(rawBody);

        // Buy Me a Coffee payload có thể nằm ở body.data, body.response hoặc trực tiếp ở body
        const payload = body.data || body.response || body;

        // Trích xuất nội dung tin nhắn ủng hộ
        const content = String(
            payload.support_note ||
            payload.note ||
            payload.message ||
            payload.support_message ||
            body.message ||
            ""
        );

        // Số tiền USD hoặc số ly cà phê
        const coffees = parseInt(payload.support_coffees || payload.coffees || "0", 10);
        const rawPrice = parseFloat(payload.support_price || payload.amount || payload.price || "1");
        const amount = isNaN(rawPrice) || rawPrice <= 0 ? (coffees > 0 ? coffees : 1) : rawPrice;

        // Mã giao dịch từ BMAC
        const transId = String(
            payload.transaction_id ||
            payload.id ||
            body.transaction_id ||
            `BMAC_${Date.now()}`
        );

        // Tìm User ID
        const userId = extractUserId(content);

        if (!userId) {
            console.warn("[BuyMeACoffee Webhook] No valid USER_ID found in note:", content);
            return NextResponse.json(
                {
                    success: false,
                    error: "No USER_ID found in note. Please ensure note contains NAP USER_XXXX",
                    receivedContent: content,
                    transId,
                },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        const supporterName = payload.supporter_name || body.supporter_name || "Supporter";
        const supporterEmail = payload.supporter_email || body.supporter_email || "";

        // 2. Ghi nhận giao dịch và cộng credit vào Google Sheet
        const result = await processPaymentWebhook({
            transId: `BMAC_${transId}`,
            userId,
            amount,
            currency: "USD",
            bankCode: "BUYMEACOFFEE",
            content: `BMAC: ${content} (${supporterName}${supporterEmail ? ` - ${supporterEmail}` : ""})`,
        });

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.message },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        console.log(`[BuyMeACoffee Webhook] Successfully credited ${result.creditsAdded} credits to ${userId}`);

        return NextResponse.json(
            {
                success: true,
                message: result.message,
                userId,
                creditsAdded: result.creditsAdded,
                transId,
            },
            { status: 200, headers: CORS_HEADERS }
        );
    } catch (error: any) {
        console.error("[BuyMeACoffee Webhook] Processing error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
