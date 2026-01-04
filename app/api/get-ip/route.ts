import { NextRequest, NextResponse } from "next/server";
import { getClientIp, debugIpHeaders } from "@/lib/utils/get-client-ip";

/**
 * API endpoint to get client IP using server-side detection
 * GET /api/get-ip
 */
export async function GET(request: NextRequest) {
    const ipHeaders = debugIpHeaders(request);
    
    // Get all headers for debugging
    const allHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
        allHeaders[key] = value;
    });

    // Try to get IP from various sources
    let clientIp = getClientIp(request);
    
    // If still unknown, try NextRequest's ip property (available in Vercel)
    if (clientIp === "Unknown IP") {
        // @ts-ignore - ip property exists on NextRequest in Vercel environment
        if (request.ip) {
            // @ts-ignore
            clientIp = request.ip;
        }
    }

    // If still unknown and we have x-forwarded-for with ::1, it's localhost
    if (clientIp === "Unknown IP") {
        const forwarded = request.headers.get("x-forwarded-for");
        if (forwarded) {
            // Even if it's ::1 or 127.0.0.1, return it for localhost testing
            const ip = forwarded.split(",")[0]?.trim();
            if (ip) {
                clientIp = ip === "::1" ? "127.0.0.1 (localhost)" : ip;
            }
        }
    }

    return NextResponse.json({
        ip: clientIp,
        headers: ipHeaders,
        allHeaders: allHeaders,
        timestamp: new Date().toISOString(),
    });
}
