/**
 * Internal API để nhận logs từ middleware
 * Middleware chạy trên Edge Runtime không thể dùng googleapis trực tiếp
 */

import { NextRequest } from "next/server";
import { logger, isGoogleSheetsConfigured } from "@/lib/google-sheets";

// Chỉ cho phép internal requests
const INTERNAL_SECRET = process.env.INTERNAL_LOG_SECRET;

export async function POST(request: NextRequest) {
    // Nếu không set INTERNAL_LOG_SECRET, disable logging
    if (!INTERNAL_SECRET) {
        return Response.json({ error: "Logging disabled" }, { status: 503 });
    }

    // Verify internal request
    const secret = request.headers.get("x-internal-secret");
    if (secret !== INTERNAL_SECRET) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isGoogleSheetsConfigured()) {
        return Response.json({ error: "Not configured" }, { status: 503 });
    }

    try {
        const data = await request.json();

        const log = logger.createLog({
            method: data.method || "GET",
            path: data.path || "/",
            query: data.query,
            ip: data.ip || "unknown",
            userAgent: data.userAgent,
            referer: data.referer,
            locale: data.locale,
            country: data.country,
            city: data.city,
        });

        const completedLog = logger.completeLog(log, {
            statusCode: data.statusCode || 200,
            error: null,
        });

        // Fire and forget
        logger.writeLog(completedLog).catch(console.error);

        return Response.json({ success: true });
    } catch (error) {
        console.error("[Internal Log] Error:", error);
        return Response.json({ error: "Failed to log" }, { status: 500 });
    }
}
