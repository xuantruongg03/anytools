/**
 * AnyTools Extension Telemetry Client SDK
 * 
 * Copy and include this file or code into your Chrome / Edge / Firefox Extension
 * (e.g. inside background.js or content_script.js).
 * 
 * Flow quy chuẩn:
 * 1. TẢI MIỄN PHÍ (Free):
 *    - Gọi `const res = await telemetry.startInit(docId, "Tiêu đề", "free");`
 *    - Server phản hồi `res.minWaitSeconds = 30` (yêu cầu bộ đếm ngược 30 giây).
 *    - Extension hiển thị countdown 30 giây trên UI, đồng thời nạp init data.
 *    - Khi hết 30 giây và tải xong -> Gọi `await telemetry.recordDownloadSuccess("free");`
 * 
 * 2. TẢI BẰNG CREDIT (Premium / Nhanh):
 *    - Gọi `const res = await telemetry.startInit(docId, "Tiêu đề", "credit");`
 *    - Server phản hồi `res.minWaitSeconds = 0`, `res.isCredit = true`.
 *    - Extension KHÔNG CẦN CHỜ 30 GIÂY, bỏ qua hoàn toàn countdown!
 *    - Chỉ cần chờ extension nạp & khởi tạo xong dữ liệu tài liệu (init data, canvas buffer),
 *      sau đó lập tức kích hoạt tải và gọi `await telemetry.recordDownloadSuccess("credit");`
 *    - Không bị tính lỗi FAST_BYPASS gian lận.
 * 
 * Usage Example:
 * ```ts
 * const telemetry = new ExtensionTelemetryClient({
 *     extensionId: "scribd-downloader",
 *     extensionVersion: "1.0.4",
 *     apiUrl: "https://anytools.online/api/telemetry/event"
 * });
 * 
 * // Step 1: When user clicks to download (specify "free" or "credit")
 * const isUsingCredit = userCredits > 0;
 * const init = await telemetry.startInit(docId, "Document Title", isUsingCredit ? "credit" : "free");
 * 
 * if (init.minWaitSeconds > 0) {
 *     // Free download: run 30s countdown UI
 *     await start30sCountdownUI();
 * } else {
 *     // Credit download: skip 30s countdown, only wait for document init data
 *     await waitForDocumentInitDataReady();
 * }
 * 
 * // Step 2: When download completes successfully
 * await telemetry.recordDownloadSuccess(isUsingCredit ? "credit" : "free");
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
    private currentDownloadType: "free" | "credit" = "free";
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
     * Step 1: Handshake Init when user initiates download
     * @param docId - Document identifier
     * @param docTitle - Document title
     * @param downloadType - "free" (requires 30s wait) | "credit" (0s wait, init data only)
     */
    async startInit(
        docId: string,
        docTitle?: string,
        downloadType: "free" | "credit" = "free"
    ): Promise<{ sessionNonce: string; minWaitSeconds: number; isCredit: boolean }> {
        const uid = await this.getUserId();
        this.initStartTimestamp = Date.now();
        this.currentDocIdHash = "doc_" + docId.replace(/[^a-zA-Z0-9]/g, "_");
        this.currentDocTitle = docTitle || "Document";
        this.currentDownloadType = downloadType;

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
                    downloadType: downloadType,
                    meta: { downloadType },
                    browser: this.detectBrowser(),
                }),
            });

            const data = await resp.json();
            if (data.sessionNonce) {
                this.currentSessionNonce = data.sessionNonce;
            }
            return {
                sessionNonce: data.sessionNonce || "",
                minWaitSeconds: typeof data.minWaitSeconds === "number" ? data.minWaitSeconds : (downloadType === "credit" ? 0 : 30),
                isCredit: Boolean(data.isCredit || downloadType === "credit"),
            };
        } catch (err) {
            console.warn("[AnyTools Telemetry] Handshake init ping failed (offline fallback):", err);
            return {
                sessionNonce: "",
                minWaitSeconds: downloadType === "credit" ? 0 : 30,
                isCredit: downloadType === "credit",
            };
        }
    }

    /**
     * Step 2: Download Completion
     * @param downloadType - Optional override for "free" | "credit"
     */
    async recordDownloadSuccess(downloadType?: "free" | "credit"): Promise<void> {
        if (!this.initStartTimestamp) return;

        const uid = await this.getUserId();
        const elapsedSeconds = Math.round(((Date.now() - this.initStartTimestamp) / 1000) * 10) / 10;
        const effectiveDownloadType = downloadType || this.currentDownloadType || "free";

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
                    downloadType: effectiveDownloadType,
                    elapsedSeconds: elapsedSeconds,
                    meta: { downloadType: effectiveDownloadType },
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
    async recordDownloadFailed(reason: string, downloadType?: "free" | "credit"): Promise<void> {
        const uid = await this.getUserId();
        const effectiveDownloadType = downloadType || this.currentDownloadType || "free";
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
                    downloadType: effectiveDownloadType,
                    meta: { reason, downloadType: effectiveDownloadType },
                    browser: this.detectBrowser(),
                }),
            });
        } catch {
            // Silently ignore
        }
    }
}
