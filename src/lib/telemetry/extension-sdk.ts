/**
 * AnyTools Extension Telemetry Client SDK
 * 
 * Copy and include this file or code into your Chrome / Edge / Firefox Extension
 * (e.g. inside background.js or content_script.js).
 * 
 * Usage Example:
 * ```ts
 * const telemetry = new ExtensionTelemetryClient({
 *     extensionId: "scribd-downloader",
 *     extensionVersion: "1.0.4",
 *     apiUrl: "https://anytools.online/api/telemetry/event"
 * });
 * 
 * // Step 1: When user clicks to download a Scribd document
 * await telemetry.startInit(docId, "Document Title");
 * 
 * // Step 2: 30-second countdown in UI
 * // ...
 * 
 * // Step 3: When download completes successfully
 * await telemetry.recordDownloadSuccess();
 * ```
 */

declare const chrome: any;

export interface TelemetryConfig {
    extensionId: string;
    extensionVersion: string;
    apiUrl?: string;
}

export class ExtensionTelemetryClient {
    private extensionId: string;
    private extensionVersion: string;
    private apiUrl: string;
    private clientUserId: string | null = null;
    private currentSessionNonce: string | null = null;
    private currentDocIdHash: string | null = null;
    private currentDocTitle: string | null = null;
    private initStartTimestamp: number | null = null;

    constructor(config: TelemetryConfig) {
        this.extensionId = config.extensionId;
        this.extensionVersion = config.extensionVersion;
        this.apiUrl = config.apiUrl || "https://anytools.online/api/telemetry/event";
    }

    /**
     * Get or create anonymous UUID stored in chrome.storage.local
     */
    private async getUserId(): Promise<string> {
        if (this.clientUserId) return this.clientUserId;

        // Try chrome.storage.local
        if (typeof chrome !== "undefined" && chrome?.storage?.local) {
            return new Promise((resolve) => {
                chrome.storage.local.get(["anytools_uid"], (res: any) => {
                    if (res && res.anytools_uid) {
                        this.clientUserId = res.anytools_uid;
                        resolve(res.anytools_uid);
                    } else {
                        const newUid = "usr_" + Math.random().toString(36).substring(2, 12);
                        chrome.storage.local.set({ anytools_uid: newUid });
                        this.clientUserId = newUid;
                        resolve(newUid);
                    }
                });
            });
        }

        // Fallback for non-extension or testing environments
        const fallbackUid = "usr_" + Math.random().toString(36).substring(2, 12);
        this.clientUserId = fallbackUid;
        return fallbackUid;
    }

    /**
     * Detect browser type
     */
    private detectBrowser(): "chrome" | "edge" | "firefox" | "other" {
        if (typeof navigator === "undefined") return "other";
        const ua = navigator.userAgent.toLowerCase();
        if (ua.includes("edg/")) return "edge";
        if (ua.includes("firefox/")) return "firefox";
        if (ua.includes("chrome/")) return "chrome";
        return "other";
    }

    /**
     * Step 1: Handshake Init when user initiates Scribd download
     */
    async startInit(docId: string, docTitle?: string): Promise<{ sessionNonce: string; minWaitSeconds: number }> {
        const uid = await this.getUserId();
        this.initStartTimestamp = Date.now();
        this.currentDocIdHash = "doc_" + docId.replace(/[^a-zA-Z0-9]/g, "_");
        this.currentDocTitle = docTitle || "Scribd Document";

        try {
            const resp = await fetch(this.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    extensionId: this.extensionId,
                    extensionVersion: this.extensionVersion,
                    action: "INIT_REQUEST",
                    clientUserId: uid,
                    docIdHash: this.currentDocIdHash,
                    docTitle: this.currentDocTitle,
                    browser: this.detectBrowser(),
                }),
            });

            const data = await resp.json();
            if (data.sessionNonce) {
                this.currentSessionNonce = data.sessionNonce;
            }
            return {
                sessionNonce: data.sessionNonce,
                minWaitSeconds: data.minWaitSeconds || 30,
            };
        } catch (err) {
            console.warn("[AnyTools Telemetry] Handshake init ping failed (offline fallback):", err);
            return { sessionNonce: "", minWaitSeconds: 30 };
        }
    }

    /**
     * Step 2: Download Completion
     */
    async recordDownloadSuccess(): Promise<void> {
        if (!this.initStartTimestamp) return;

        const uid = await this.getUserId();
        const elapsedSeconds = Math.round(((Date.now() - this.initStartTimestamp) / 1000) * 10) / 10;

        try {
            await fetch(this.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    extensionId: this.extensionId,
                    extensionVersion: this.extensionVersion,
                    action: "DOWNLOAD_SUCCESS",
                    clientUserId: uid,
                    sessionNonce: this.currentSessionNonce,
                    docIdHash: this.currentDocIdHash,
                    docTitle: this.currentDocTitle,
                    elapsedSeconds: elapsedSeconds,
                    browser: this.detectBrowser(),
                }),
            });
        } catch (err) {
            console.warn("[AnyTools Telemetry] Download completion ping failed:", err);
        } finally {
            this.currentSessionNonce = null;
            this.initStartTimestamp = null;
        }
    }

    /**
     * Record failure if user cancelled or error occurred
     */
    async recordDownloadFailed(reason: string): Promise<void> {
        const uid = await this.getUserId();
        try {
            await fetch(this.apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    extensionId: this.extensionId,
                    extensionVersion: this.extensionVersion,
                    action: "DOWNLOAD_FAILED",
                    clientUserId: uid,
                    sessionNonce: this.currentSessionNonce,
                    docIdHash: this.currentDocIdHash,
                    meta: { reason },
                    browser: this.detectBrowser(),
                }),
            });
        } catch {
            // Silently ignore
        }
    }
}
