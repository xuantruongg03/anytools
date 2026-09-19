import { NextRequest, NextResponse } from "next/server";
import { deductUserCredit } from "@/lib/credits-sheets";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: "Missing or invalid userId parameter" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        const result = await deductUserCredit(userId.trim());

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || "Không đủ credit để tải ngay" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        return NextResponse.json(
            {
                success: true,
                remainingCredits: result.remainingCredits,
                message: "Trừ 1 credit thành công",
            },
            { status: 200, headers: CORS_HEADERS }
        );
    } catch (error: any) {
        console.error("[API credits/deduct] Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
