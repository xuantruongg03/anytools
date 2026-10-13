import { NextRequest, NextResponse } from "next/server";
import { recordDownloadEvent } from "@/lib/credits-sheets";
import { getClientIp } from "@/lib/utils/get-client-ip";
import { getDb } from "@/lib/db/mongodb";

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

        // 1. Ghi REAL-TIME vào MongoDB (Chính - Tốc độ cao < 15ms)
        try {
            const db = await getDb();
            if (db) {
                await db.collection("credits_downloads").insertOne({
                    userId: cleanUserId,
                    downloadType: validDownloadType,
                    documentUrl: typeof documentUrl === "string" ? documentUrl.slice(0, 500) : "",
                    documentTitle: typeof documentTitle === "string" ? documentTitle.slice(0, 300) : "",
                    totalPages: typeof totalPages === "number" ? totalPages : 0,
                    clientIp,
                    createdAt: new Date().toISOString(),
                });
            }
        } catch (dbErr) {
            console.warn("⚠️ [Mongo Record Download] Insert warning:", (dbErr as Error).message);
        }

        // 2. Backup sang Google Sheets ngầm (Không block luồng người dùng để tránh nghẽn & tránh lỗi 429)
        recordDownloadEvent({
            userId: cleanUserId,
            downloadType: validDownloadType,
            documentUrl: typeof documentUrl === "string" ? documentUrl.slice(0, 500) : undefined,
            documentTitle: typeof documentTitle === "string" ? documentTitle.slice(0, 300) : undefined,
            totalPages: typeof totalPages === "number" ? totalPages : undefined,
            clientIp,
        }).catch((sheetErr) => {
            console.warn("⚠️ [Google Sheets Backup] Skipped or delayed:", sheetErr?.message);
        });

        return NextResponse.json(
            {
                success: true,
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
