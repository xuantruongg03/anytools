import { NextRequest, NextResponse } from "next/server";
import { recordDownloadEvent } from "@/lib/credits-sheets";
import { getClientIp } from "@/lib/utils/get-client-ip";

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
        const {
            userId,
            downloadType = "free",
            documentUrl,
            documentTitle,
            totalPages,
        } = body;

        if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: "Missing or invalid userId parameter" },
                { status: 400, headers: CORS_HEADERS }
            );
        }

        const validDownloadType = downloadType === "instant" ? "instant" : "free";
        const clientIp = getClientIp(request);
        const cleanUserId = userId.trim();

        // Ghi nhận lượt tải vào MongoDB (Primary) và đồng bộ backup ngầm sang Google Sheets
        const result = await recordDownloadEvent({
            userId: cleanUserId,
            downloadType: validDownloadType,
            documentUrl: typeof documentUrl === "string" ? documentUrl.slice(0, 500) : undefined,
            documentTitle: typeof documentTitle === "string" ? documentTitle.slice(0, 300) : undefined,
            totalPages: typeof totalPages === "number" ? totalPages : 0,
            clientIp,
        });

        return NextResponse.json(
            {
                success: result.success,
                totalDownloaded: result.totalDownloaded,
                message: "Ghi nhận lượt tải thành công vào hệ thống",
            },
            { status: 200, headers: CORS_HEADERS }
        );
    } catch (error: any) {
        console.error("[API credits/record-download] Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500, headers: CORS_HEADERS }
        );
    }
}
