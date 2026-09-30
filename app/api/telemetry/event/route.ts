import { NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/utils/get-client-ip";
import { handleInitHandshake, processTelemetryEvent } from "@/lib/telemetry/anomaly-engine";
import { TelemetryAction, ExtensionId } from "@/lib/telemetry/types";

// CORS headers to permit extension requests
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-extension-id",
};

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const clientIp = getClientIp(request);

        const country =
            request.headers.get("x-vercel-ip-country") ||
            request.headers.get("cf-ipcountry") ||
            request.headers.get("x-country-code") ||
            "Vietnam";
        const city =
            request.headers.get("x-vercel-ip-city") ||
            request.headers.get("cf-ipcity") ||
            "Hanoi";

        const {
            extensionId = "scribd-downloader",
            extensionVersion = "1.0.0",
            action,
            clientUserId,
            sessionNonce,
            docIdHash,
            docTitle,
            elapsedSeconds,
            browser = "chrome",
            downloadType = "free",
            meta,
        } = body;

        const mergedMeta = { ...(meta || {}), downloadType: meta?.downloadType || downloadType };

        if (!action || !clientUserId) {
            return NextResponse.json(
                { error: "Missing required fields: action and clientUserId are required." },
                { status: 400, headers: corsHeaders }
            );
        }

        // Action 1: INIT HANDSHAKE
        if (action === "INIT_REQUEST") {
            const initResult = await handleInitHandshake({
                extensionId: extensionId as ExtensionId,
                extensionVersion,
                action: "INIT_REQUEST",
                clientUserId,
                docIdHash: docIdHash || "unknown_doc",
                docTitle,
                clientIp,
                country,
                city,
                browser,
                meta: mergedMeta,
            });

            return NextResponse.json(
                {
                    success: true,
                    sessionNonce: initResult.sessionNonce,
                    minWaitSeconds: initResult.minWaitSeconds,
                    isCredit: initResult.isCredit,
                    timestamp: initResult.timestamp,
                },
                { status: 200, headers: corsHeaders }
            );
        }

        // Action 2: DOWNLOAD COMPLETION OR ERROR
        if (action === "DOWNLOAD_SUCCESS" || action === "DOWNLOAD_FAILED") {
            const processedEvent = await processTelemetryEvent({
                extensionId: extensionId as ExtensionId,
                extensionVersion,
                action: action as TelemetryAction,
                clientUserId,
                sessionNonce,
                docIdHash: docIdHash || "unknown_doc",
                docTitle,
                elapsedSeconds: typeof elapsedSeconds === "number" ? elapsedSeconds : undefined,
                clientIp,
                country,
                city,
                browser,
                meta: mergedMeta,
            });

            return NextResponse.json(
                {
                    success: true,
                    eventId: processedEvent.id,
                    riskScore: processedEvent.riskScore,
                    anomalies: processedEvent.anomalies,
                    elapsedSeconds: processedEvent.elapsedSeconds,
                },
                { status: 200, headers: corsHeaders }
            );
        }

        return NextResponse.json({ error: "Unsupported telemetry action" }, { status: 400, headers: corsHeaders });
    } catch (err: any) {
        console.error("❌ [Telemetry API] Ingest error:", err);
        return NextResponse.json(
            { error: "Internal telemetry ingest failure", details: err?.message },
            { status: 500, headers: corsHeaders }
        );
    }
}
