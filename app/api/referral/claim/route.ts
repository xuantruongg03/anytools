import { NextRequest, NextResponse } from "next/server";
import { claimReferralCode } from "@/lib/referral";
import { getClientIp } from "@/lib/utils/get-client-ip";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/referral/claim
 * Body: { userId: string, referralCode: string }
 * 
 * Người dùng mới nhập mã giới thiệu (= User ID của người mời) để nhận +3 Credits.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, referralCode } = body;

        if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: "Missing or invalid userId parameter" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        if (!referralCode || typeof referralCode !== "string" || referralCode.trim().length < 4) {
            return NextResponse.json(
                { success: false, error: "Missing or invalid referralCode parameter" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        const clientIp = getClientIp(request);

        const result = await claimReferralCode({
            refereeId: userId.trim(),
            referralCode: referralCode.trim(),
            refereeIp: clientIp,
        });

        return NextResponse.json(
            {
                success: result.success,
                creditsAwarded: result.creditsAwarded,
                message: result.message,
                error: result.error || undefined,
            },
            { status: result.success ? 200 : 400, headers: CORS_HEADERS }
        );
    } catch (error: any) {
        console.error("[API referral/claim] Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
