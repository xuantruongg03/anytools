/**
 * Internal API để nhận logs từ middleware
 * Middleware chạy trên Edge Runtime không thể dùng googleapis trực tiếp
 */

import { NextRequest } from "next/server";

// Chỉ cho phép internal requests
const INTERNAL_SECRET = process.env.INTERNAL_LOG_SECRET;

export async function POST(request: NextRequest) {
    console.log("[Internal Log] Request received");

    // Nếu không set INTERNAL_LOG_SECRET, disable logging
    if (!INTERNAL_SECRET) {
        console.log("[Internal Log] INTERNAL_LOG_SECRET not set");
        return Response.json({ error: "Logging disabled", reason: "INTERNAL_LOG_SECRET not set" }, { status: 503 });
    }

    // Verify internal request
    const secret = request.headers.get("x-internal-secret");
    if (secret !== INTERNAL_SECRET) {
        console.log("[Internal Log] Unauthorized - secret mismatch");
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Dynamic import để tránh crash khi import
    let logger, isGoogleSheetsConfigured;
    try {
        const googleSheets = await import("@/lib/google-sheets");
        logger = googleSheets.logger;
        isGoogleSheetsConfigured = googleSheets.isGoogleSheetsConfigured;
        console.log("[Internal Log] Google Sheets module loaded");
    } catch (importError) {
        console.error("[Internal Log] Failed to import google-sheets:", importError);
        return Response.json(
            {
                error: "Module import failed",
                details: String(importError),
            },
            { status: 503 },
        );
    }

    if (!isGoogleSheetsConfigured()) {
        console.log("[Internal Log] Google Sheets not configured");
        return Response.json(
            {
                error: "Not configured",
                reason: "Google Sheets not configured",
                missing: {
                    clientEmail: !process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                    privateKey: !process.env.GOOGLE_SHEETS_PRIVATE_KEY,
                    spreadsheetId: !process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
                },
            },
            { status: 503 },
        );
    }

    try {
        const data = await request.json();
        console.log("[Internal Log] Processing log for path:", data.path);

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
        logger.writeLog(completedLog).catch((err) => {
            console.error("[Internal Log] Write failed:", err);
        });

        console.log("[Internal Log] Log queued successfully");
        return Response.json({ success: true });
    } catch (error) {
        console.error("[Internal Log] Error:", error);
        return Response.json({ error: "Failed to log", details: String(error) }, { status: 500 });
    }
}
