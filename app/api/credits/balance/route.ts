import { NextRequest, NextResponse } from "next/server";
import { getUserCredits } from "@/lib/credits-sheets";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
        return NextResponse.json(
            { error: "Missing or invalid userId parameter" },
            { status: 400, headers: CORS_HEADERS }
        );
    }

    // Lấy IP của client
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "unknown";

    try {
        const result = await getUserCredits(userId.trim(), clientIp);
        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200, headers: CORS_HEADERS }
        );
    } catch (error: any) {
        console.error("[API credits/balance] Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
