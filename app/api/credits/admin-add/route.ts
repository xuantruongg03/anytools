import { NextRequest, NextResponse } from "next/server";
import { processPaymentWebhook } from "@/lib/credits-sheets";

const ADMIN_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || process.env.ADMIN_SECRET || "super_secret_webhook_key_2026";

export async function GET(request: NextRequest) {
    return handleAdminAdd(request);
}

export async function POST(request: NextRequest) {
    return handleAdminAdd(request);
}

async function handleAdminAdd(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const userId = searchParams.get("userId");
    const creditsStr = searchParams.get("credits");

    if (secret !== ADMIN_SECRET) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!userId || !creditsStr) {
        return NextResponse.json(
            { success: false, error: "Missing userId or credits parameter" },
            { status: 400 }
        );
    }

    const credits = parseInt(creditsStr, 10);
    if (isNaN(credits) || credits <= 0) {
        return NextResponse.json(
            { success: false, error: "Invalid credits amount" },
            { status: 400 }
        );
    }

    const transId = `ADMIN_${Date.now()}`;
    const result = await processPaymentWebhook({
        transId,
        userId: userId.trim().toUpperCase(),
        amount: 0,
        creditsOverride: credits,
        bankCode: "ADMIN_MANUAL",
        content: `Manual credit add by Admin (+${credits} credits)`,
    });

    return NextResponse.json(result);
}
