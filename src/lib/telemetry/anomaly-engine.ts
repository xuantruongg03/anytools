import crypto from "crypto";
import {
    TelemetryEvent,
    TelemetryAction,
    AnomalyType,
    AnomalySeverity,
    HandshakeSession,
    ExtensionId,
} from "./types";
import {
    createHandshakeSession,
    consumeHandshakeSession,
    getHandshakeSession,
    getAllEvents,
    saveTelemetryEvent,
} from "./storage";

export interface TelemetryIngestInput {
    extensionId: ExtensionId;
    extensionVersion?: string;
    action: TelemetryAction;
    clientUserId: string;
    sessionNonce?: string;
    docIdHash: string;
    docTitle?: string;
    elapsedSeconds?: number;
    browser?: "chrome" | "edge" | "firefox" | "other";
    clientIp: string;
    country?: string;
    city?: string;
    meta?: Record<string, any>;
}

/**
 * Minimum mandatory wait time for Scribd Downloader in seconds
 */
export const MANDATORY_WAIT_SECONDS = 30;

/**
 * Handle INIT_REQUEST
 * Generates an encrypted session nonce and records init timestamp
 */
export async function handleInitHandshake(input: TelemetryIngestInput): Promise<{
    sessionNonce: string;
    minWaitSeconds: number;
    timestamp: number;
    isCredit: boolean;
}> {
    const now = Date.now();
    const nonce = `vlt_hsk_${crypto.randomBytes(16).toString("hex")}`;
    const isCredit = input.meta?.downloadType === "credit" || input.meta?.isCredit === true;
    // Tải bằng Credit: minWaitSeconds = 0 (bỏ qua đếm ngược 30s, chỉ chờ tải init data)
    // Tải Free: minWaitSeconds = 30 (bắt buộc đếm ngược)
    const minWaitSeconds = isCredit ? 0 : MANDATORY_WAIT_SECONDS;

    const session: HandshakeSession = {
        sessionNonce: nonce,
        clientUserId: input.clientUserId,
        extensionId: input.extensionId,
        ip: input.clientIp,
        docIdHash: input.docIdHash,
        initTimestamp: now,
        expiresAt: now + 15 * 60 * 1000, // 15 mins expiry
    };

    createHandshakeSession(session);

    return {
        sessionNonce: nonce,
        minWaitSeconds,
        timestamp: now,
        isCredit,
    };
}

/**
 * Process DOWNLOAD_SUCCESS or other completion actions
 * Runs deep anomaly inspection across multiple dimensions
 */
export async function processTelemetryEvent(input: TelemetryIngestInput): Promise<TelemetryEvent> {
    const now = Date.now();
    const anomalies: AnomalyType[] = [];
    let riskScore = 0;
    let actualElapsedSeconds = 0;
    let initTimestamp: number | undefined = undefined;

    const isCredit = input.meta?.downloadType === "credit" || input.meta?.isCredit === true;

    // 1. Verify Handshake & Elapsed Wait Time
    if (input.action === "DOWNLOAD_SUCCESS") {
        if (!input.sessionNonce) {
            anomalies.push("MISSING_INIT");
            riskScore += 80;
            actualElapsedSeconds = input.elapsedSeconds || 0;
        } else {
            const session = consumeHandshakeSession(input.sessionNonce);
            if (!session) {
                anomalies.push("TAMPERED_NONCE");
                riskScore += 75;
                actualElapsedSeconds = input.elapsedSeconds || 0;
            } else {
                initTimestamp = session.initTimestamp;
                const serverMeasuredElapsed = Math.round(((now - session.initTimestamp) / 1000) * 10) / 10;
                // In production, server clock is the single source of truth.
                // In simulation/testing mode (meta.simulation = true), allow custom elapsedSeconds.
                actualElapsedSeconds =
                    input.meta?.simulation && typeof input.elapsedSeconds === "number"
                        ? input.elapsedSeconds
                        : serverMeasuredElapsed;

                // FAST_BYPASS chỉ áp dụng cho lượt tải Free (yêu cầu chờ 30s)
                // Lượt tải bằng Credit không bị tính là vi phạm tốc độ
                const minThreshold = isCredit ? 0 : Number(process.env.TELEMETRY_VECTOR_DELTA_MIN || "0");
                const deltaWeight = Number(process.env.TELEMETRY_VECTOR_DELTA_WEIGHT || "90");
                if (minThreshold > 0 && actualElapsedSeconds < minThreshold) {
                    anomalies.push("FAST_BYPASS");
                    riskScore += deltaWeight;
                }
            }
        }
    }

    // 2. Multi-Vector Context Evaluation
    const allEvents = await getAllEvents();
    const past24hCutoff = now - 24 * 3600 * 1000;
    const past5mCutoff = now - 5 * 60 * 1000;

    const userRecentEvents = allEvents.filter(
        (e) => e.clientUserId === input.clientUserId && new Date(e.createdAt).getTime() >= past24hCutoff
    );

    const distinctIps = new Set(userRecentEvents.map((e) => e.ip));
    distinctIps.add(input.clientIp);

    const hopLimit = Number(process.env.TELEMETRY_VECTOR_IP_HOP_LIMIT || "2");
    const hopWeight = Number(process.env.TELEMETRY_VECTOR_IP_HOP_WEIGHT || "70");
    if (distinctIps.size >= hopLimit) {
        anomalies.push("MULTI_IP");
        riskScore += hopWeight;
    }

    // Check Rate Burst (> 5 downloads in 5 minutes by same user or same IP)
    const recent5mEvents = allEvents.filter(
        (e) =>
            (e.clientUserId === input.clientUserId || e.ip === input.clientIp) &&
            new Date(e.createdAt).getTime() >= past5mCutoff
    );
    if (recent5mEvents.length >= 5) {
        anomalies.push("RATE_BURST");
        riskScore += 50;
    }

    // Check IP Farm (1 IP with >= 8 distinct user IDs)
    const ipRecentEvents = allEvents.filter(
        (e) => e.ip === input.clientIp && new Date(e.createdAt).getTime() >= past24hCutoff
    );
    const distinctUsersOnIp = new Set(ipRecentEvents.map((e) => e.clientUserId));
    distinctUsersOnIp.add(input.clientUserId);

    if (distinctUsersOnIp.size >= 8) {
        anomalies.push("IP_FARM");
        riskScore += 65;
    }

    // Check Repeated Doc Spam (same docId downloaded >= 3 times in 5 mins)
    const sameDocDownloads = recent5mEvents.filter((e) => e.docIdHash === input.docIdHash);
    if (sameDocDownloads.length >= 3) {
        anomalies.push("DOC_SPAM");
        riskScore += 35;
    }

    // Normalize risk score to max 100
    riskScore = Math.min(100, riskScore);

    // Determine Severity
    let severity: AnomalySeverity = "NORMAL";
    if (riskScore >= 75) {
        severity = "CRITICAL";
    } else if (riskScore >= 50) {
        severity = "MEDIUM";
    } else if (riskScore >= 25) {
        severity = "LOW";
    }

    const event: TelemetryEvent = {
        id: `evt_${Date.now()}_${crypto.randomBytes(6).toString("hex")}`,
        extensionId: input.extensionId,
        extensionVersion: input.extensionVersion || "1.0.0",
        action: input.action,
        clientUserId: input.clientUserId,
        sessionNonce: input.sessionNonce,
        docIdHash: input.docIdHash,
        docTitle: input.docTitle,
        ip: input.clientIp,
        country: input.country || "Unknown",
        city: input.city || "Unknown",
        browser: input.browser || "chrome",
        initTimestamp: initTimestamp,
        completeTimestamp: now,
        elapsedSeconds: actualElapsedSeconds,
        estimatedMinSeconds: isCredit ? (input.meta?.estimatedMinSeconds || 3.0) : (input.meta?.estimatedMinSeconds || 30.0),
        pages: input.meta?.pages || 1,
        downloadType: isCredit ? "credit" : "free",
        clientReportedSeconds: input.elapsedSeconds,
        anomalies: anomalies,
        riskScore: riskScore,
        severity: severity,
        meta: {
            ...input.meta,
            downloadType: isCredit ? "credit" : "free",
            totalUserDistinctIps: distinctIps.size,
        },
        createdAt: new Date(now).toISOString(),
    };

    await saveTelemetryEvent(event);
    return event;
}
