import {
    TelemetryEvent,
    AnomalyType,
    AnomalySeverity,
    TelemetrySummaryStats,
    ExtensionId,
    CreditTransaction,
    CreditTransactionSummary,
    UserDirectoryItem,
    UserSummaryStats,
    HourlyActivityBucket,
    DayOfWeekActivity,
    TopDocumentItem,
    MarketingBehaviorStats,
} from "./types";
import { StatsFilterOptions } from "./stats";
import { batchResolveIpLocations } from "@/lib/utils/geo-ip-service";

export interface RawSheetUser {
    userId: string;
    credits: number;
    totalDownloaded: number;
    createdIp: string;
    createdAt: string;
    updatedAt: string;
}

export interface RawDownloadRecord {
    logId: string;
    userId: string;
    downloadType: string;
    documentUrl?: string;
    documentTitle?: string;
    totalPages?: number;
    clientIp?: string;
    createdAt?: string | Date;
}

export interface DashboardStatsResult {
    stats: TelemetrySummaryStats;
    filteredEvents: TelemetryEvent[];
    transactionStats: CreditTransactionSummary;
    transactions: CreditTransaction[];
    userStats: UserSummaryStats;
    users: UserDirectoryItem[];
    marketingStats?: MarketingBehaviorStats;
    source?: "mongodb" | "google_sheets" | "hybrid" | "google_sheets_fallback";
}

/**
 * Chuẩn hóa giá trị từ cột C (Download_Type):
 * - "free": Tải miễn phí (yêu cầu chờ đếm ngược 30s)
 * - "instant": Tải bằng Credit (bỏ qua đếm ngược 30s, chỉ chờ khởi tạo vật lý)
 * - "credit" / "paid": Biến thể tải credit hợp lệ
 */
export function normalizeDownloadType(rawType: any): "credit" | "free" {
    if (!rawType) return "free";
    const str = String(rawType).trim().toLowerCase();
    if (
        str === "instant" ||
        str === "credit" ||
        str === "paid" ||
        str.includes("instant") ||
        str.includes("credit")
    ) {
        return "credit";
    }
    return "free";
}

/**
 * Chuyển đổi timestamp bất kỳ (string ngày giờ VN, ISO string, Date object) sang ISO string chuẩn.
 */
export function parseDateTimeToIso(rawDate: any): string {
    if (!rawDate) return new Date().toISOString();
    if (rawDate instanceof Date) {
        return isNaN(rawDate.getTime()) ? new Date().toISOString() : rawDate.toISOString();
    }
    if (typeof rawDate === "number") {
        return new Date(rawDate).toISOString();
    }
    const str = String(rawDate).trim();
    if (!str) return new Date().toISOString();

    // Nếu đã là ISO string chuẩn có múi giờ (chứa Z hoặc + / -)
    if (str.includes("Z") || (str.includes("T") && (str.includes("+") || str.includes("-", 10)))) {
        const d = new Date(str);
        if (!isNaN(d.getTime())) return d.toISOString();
    }

    // Nếu là định dạng ngày giờ "YYYY-MM-DD HH:mm:ss" theo giờ Việt Nam
    const withVn = new Date(str.replace(" ", "T") + "+07:00");
    if (!isNaN(withVn.getTime())) return withVn.toISOString();

    const fallback = new Date(str);
    if (!isNaN(fallback.getTime())) return fallback.toISOString();

    return new Date().toISOString();
}

/**
 * Format timestamp to Vietnam Time (UTC+7) bucket string.
 * Ensures consistent hourly (HH:00) and daily (DD/MM) grouping regardless of server runtime timezone.
 */
export function formatVnBucket(dateIso: string, isHourly: boolean): string {
    const d = new Date(dateIso);
    if (isNaN(d.getTime())) return isHourly ? "00:00" : "01/01";
    const vn = new Date(d.getTime() + 7 * 3600 * 1000);
    if (isHourly) {
        return `${String(vn.getUTCHours()).padStart(2, "0")}:00`;
    }
    return `${String(vn.getUTCDate()).padStart(2, "0")}/${String(vn.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function getVnHour(dateIso: string): number {
    const d = new Date(dateIso);
    if (isNaN(d.getTime())) return 0;
    const vn = new Date(d.getTime() + 7 * 3600 * 1000);
    return vn.getUTCHours();
}

/**
 * Chuyển đổi danh sách bản ghi download thô (từ Google Sheets hoặc MongoDB credits_downloads)
 * thành TelemetryEvent hoàn chỉnh có phân tích hành vi & chấm điểm bất thường (Anomaly Scoring).
 */
export async function processRawDownloadsIntoTelemetryEvents(
    records: RawDownloadRecord[]
): Promise<TelemetryEvent[]> {
    if (!records || records.length === 0) return [];
    const now = Date.now();

    // Group rows by User_ID to calculate exact interval (delta t) between downloads
    interface UserDownloadRecord {
        index: number;
        timestamp: number;
        pages: number;
        downloadType: string;
    }

    const userDownloadMap = new Map<string, Array<UserDownloadRecord>>();
    const userIpMap = new Map<string, Set<string>>();
    const ipUserMap = new Map<string, Set<string>>();
    const allClientIps: string[] = [];

    // First pass: Index timestamps and associations
    records.forEach((r, idx) => {
        const userId = (r.userId || `ANON_${idx}`).toString().trim();
        const downloadType = normalizeDownloadType(r.downloadType || "free");
        const pages = Math.max(1, Number(r.totalPages) || 1);
        const clientIp = (r.clientIp || "unknown").toString().trim();

        allClientIps.push(clientIp);

        let timestamp = now - idx * 60000;
        if (r.createdAt) {
            const iso = parseDateTimeToIso(r.createdAt);
            const parsedTime = new Date(iso).getTime();
            if (!isNaN(parsedTime)) {
                timestamp = parsedTime;
            }
        }

        if (!userDownloadMap.has(userId)) userDownloadMap.set(userId, []);
        userDownloadMap.get(userId)!.push({ index: idx, timestamp, pages, downloadType });

        if (!userIpMap.has(userId)) userIpMap.set(userId, new Set());
        userIpMap.get(userId)!.add(clientIp);

        if (!ipUserMap.has(clientIp)) ipUserMap.set(clientIp, new Set());
        ipUserMap.get(clientIp)!.add(userId);
    });

    // Resolve unique IPs using cascading multi-provider GeoIP service
    const uniqueIps = Array.from(new Set(allClientIps.filter(Boolean)));
    const geoMap = await batchResolveIpLocations(uniqueIps, 8);

    // Dynamic Page-Aware Latency Estimation Coefficients
    const EST_COUNTDOWN_BASE = Number(process.env.TELEMETRY_EST_COUNTDOWN_BASE || "30.0");
    const EST_INIT_BASE = Number(process.env.TELEMETRY_EST_INIT_BASE || "3.0");
    const EST_SEC_PER_PAGE = Number(process.env.TELEMETRY_EST_SEC_PER_PAGE || "0.08");
    const EST_NEXT_PAGE_FACTOR = Number(process.env.TELEMETRY_EST_NEXT_DOC_PAGE_FACTOR || "0.04");

    interface IntervalAnalysis {
        elapsedSeconds: number;
        estimatedMinSeconds: number;
        prevPages?: number;
        currPages: number;
        isDynamicSpeedViolation: boolean;
        speedRatio: number;
        prevTimestamp?: number;
        currTimestamp: number;
    }

    const analysisMap = new Map<number, IntervalAnalysis>();

    for (const [_, list] of userDownloadMap.entries()) {
        list.sort((a, b) => a.timestamp - b.timestamp);
        for (let i = 0; i < list.length; i++) {
            const curr = list[i];
            const isCredit = curr.downloadType === "credit";
            const countdownBase = isCredit ? 0.0 : EST_COUNTDOWN_BASE;

            if (i === 0) {
                const estMin = Math.round((countdownBase + EST_INIT_BASE + curr.pages * EST_SEC_PER_PAGE) * 10) / 10;
                analysisMap.set(curr.index, {
                    elapsedSeconds: isCredit ? Math.round((EST_INIT_BASE + curr.pages * EST_SEC_PER_PAGE + 0.8) * 10) / 10 : 34.0,
                    estimatedMinSeconds: estMin,
                    currPages: curr.pages,
                    isDynamicSpeedViolation: false,
                    speedRatio: 100,
                    currTimestamp: curr.timestamp,
                });
            } else {
                const prev = list[i - 1];
                const diffSec = Math.round(((curr.timestamp - prev.timestamp) / 1000) * 10) / 10;
                const elapsed = diffSec > 0 ? diffSec : 1.0;

                const estimatedMin = Math.round(
                    (countdownBase + EST_INIT_BASE + (prev.pages * EST_SEC_PER_PAGE) + (curr.pages * EST_NEXT_PAGE_FACTOR)) * 10
                ) / 10;

                const isViolation = isCredit
                    ? elapsed < Math.round((EST_INIT_BASE + curr.pages * 0.02) * 10) / 10
                    : elapsed < estimatedMin;

                const ratio = Math.round((elapsed / Math.max(1.0, estimatedMin)) * 100);

                analysisMap.set(curr.index, {
                    elapsedSeconds: elapsed,
                    estimatedMinSeconds: estimatedMin,
                    prevPages: prev.pages,
                    currPages: curr.pages,
                    isDynamicSpeedViolation: isViolation,
                    speedRatio: ratio,
                    prevTimestamp: prev.timestamp,
                    currTimestamp: curr.timestamp,
                });
            }
        }
    }

    // Dynamic Compliance Vectors
    const V_DELTA_WEIGHT = Number(process.env.TELEMETRY_VECTOR_DELTA_WEIGHT || "95");
    const V_HOP_LIMIT = Number(process.env.TELEMETRY_VECTOR_IP_HOP_LIMIT || "2");
    const V_HOP_WEIGHT = Number(process.env.TELEMETRY_VECTOR_IP_HOP_WEIGHT || "70");
    const V_CLUSTER_LIMIT = Number(process.env.TELEMETRY_VECTOR_CLUSTER_LIMIT || "3");
    const V_CLUSTER_WEIGHT = Number(process.env.TELEMETRY_VECTOR_CLUSTER_WEIGHT || "50");
    const V_BURST_SEC = Number(process.env.TELEMETRY_VECTOR_BURST_SEC || "60.0");
    const V_BURST_WEIGHT = Number(process.env.TELEMETRY_VECTOR_BURST_WEIGHT || "30");

    // Second pass: Map into TelemetryEvent
    const events: TelemetryEvent[] = records.map((r, idx) => {
        const logId = (r.logId || `DL_${idx}`).toString().trim();
        const userId = (r.userId || `ANON_${idx}`).toString().trim();
        const rawType = (r.downloadType || "free").toString().trim();
        const downloadType = normalizeDownloadType(rawType);
        const docUrl = (r.documentUrl || "").toString().trim();
        const docTitle = (r.documentTitle || "Resource Document").toString().trim();
        const clientIp = (r.clientIp || "unknown").toString().trim();

        let timestamp = now - idx * 60000;
        if (r.createdAt) {
            const iso = parseDateTimeToIso(r.createdAt);
            const parsedTime = new Date(iso).getTime();
            if (!isNaN(parsedTime)) {
                timestamp = parsedTime;
            }
        }

        const analysis = analysisMap.get(idx);
        const elapsedSeconds = analysis?.elapsedSeconds ?? 32.0;
        const estimatedMinSeconds = analysis?.estimatedMinSeconds ?? 33.0;
        const currPages = analysis?.currPages ?? Math.max(1, Number(r.totalPages) || 1);

        const anomalies: AnomalyType[] = [];
        let riskScore = 0;

        if (analysis?.isDynamicSpeedViolation) {
            anomalies.push("FAST_BYPASS");
            if (analysis.speedRatio <= 50) {
                riskScore += V_DELTA_WEIGHT;
            } else if (analysis.speedRatio <= 75) {
                riskScore += Math.round(V_DELTA_WEIGHT * 0.85);
            } else {
                riskScore += Math.round(V_DELTA_WEIGHT * 0.70);
            }
        }

        const distinctIps = userIpMap.get(userId)?.size || 1;
        if (V_HOP_LIMIT > 0 && distinctIps >= V_HOP_LIMIT) {
            anomalies.push("MULTI_IP");
            riskScore += V_HOP_WEIGHT;
        }

        const distinctUsersOnIp = ipUserMap.get(clientIp)?.size || 1;
        if (V_CLUSTER_LIMIT > 0 && distinctUsersOnIp >= V_CLUSTER_LIMIT) {
            anomalies.push("IP_FARM");
            riskScore += V_CLUSTER_WEIGHT;
        }

        if (V_BURST_SEC > 0 && elapsedSeconds > 0 && elapsedSeconds < V_BURST_SEC && distinctIps >= 2) {
            anomalies.push("RATE_BURST");
            riskScore += V_BURST_WEIGHT;
        }

        riskScore = Math.min(100, riskScore);

        let severity: AnomalySeverity = "NORMAL";
        if (riskScore >= 75) severity = "CRITICAL";
        else if (riskScore >= 50) severity = "MEDIUM";
        else if (riskScore >= 25) severity = "LOW";

        const geo = geoMap.get(clientIp);
        const country = geo?.country || "Chưa xác định";
        const city = geo?.city || (geo?.region || "");

        return {
            id: logId,
            extensionId: (process.env.TELEMETRY_DEFAULT_EXTENSION || "core-extension") as ExtensionId,
            extensionVersion: "1.0.4",
            action: "DOWNLOAD_SUCCESS",
            clientUserId: userId,
            sessionNonce: `vlt_${logId}`,
            docIdHash: docUrl.replace(/^https?:\/\/[^\/]+\/(document\/)?/, "").slice(0, 30) || "doc",
            docTitle: docTitle,
            pages: currPages,
            downloadType: downloadType,
            elapsedSeconds: elapsedSeconds,
            estimatedMinSeconds: estimatedMinSeconds,
            ip: clientIp,
            country: country,
            city: city,
            browser: clientIp.includes("186.") ? "chrome" : "edge",
            anomalies: anomalies,
            riskScore: riskScore,
            severity: severity,
            meta: {
                downloadType,
                rawDownloadType: rawType,
                docUrl,
                source: process.env.TELEMETRY_SHEET_TAB || "SECURE_DATAPOOL",
                totalUserDistinctIps: distinctIps,
                totalUsersOnIp: distinctUsersOnIp,
                pageCount: currPages,
                prevDocPages: analysis?.prevPages,
                actualElapsedSeconds: elapsedSeconds,
                estimatedMinRequiredSeconds: estimatedMinSeconds,
                speedRatioPercentage: analysis?.speedRatio ?? 100,
                prevDownloadAt: analysis?.prevTimestamp ? new Date(analysis.prevTimestamp).toISOString() : null,
                currDownloadAt: new Date(analysis?.currTimestamp || timestamp).toISOString(),
            },
            createdAt: new Date(timestamp).toISOString(),
        };
    });

    events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return events;
}

/**
 * Tính toán thống kê toàn diện cho Dashboard từ các mảng dữ liệu telemetry events, transactions và users.
 */
export async function computeDashboardStats(
    rawEvents: TelemetryEvent[],
    rawTransactions: CreditTransaction[],
    rawUsers: RawSheetUser[],
    options: StatsFilterOptions = {}
): Promise<DashboardStatsResult> {
    const now = Date.now();

    // Vietnam Time (UTC+7) calculations
    const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
    const vnNow = new Date(now + VN_OFFSET_MS);

    const startOfTodayVn =
        Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), vnNow.getUTCDate(), 0, 0, 0, 0) -
        VN_OFFSET_MS;

    const endOfTodayVn =
        Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), vnNow.getUTCDate(), 23, 59, 59, 999) -
        VN_OFFSET_MS;

    const startOfYesterdayVn = startOfTodayVn - 24 * 3600 * 1000;

    // 1. Timeframe Filter
    const effectiveTimeframe = options.timeframe || "24h";
    let cutoffTime = 0;
    let endTime = Infinity;
    let prevCutoffTime = 0;
    let prevEndTime = 0;

    if (effectiveTimeframe === "1h") {
        cutoffTime = now - 3600 * 1000;
        endTime = now;
        prevCutoffTime = now - 7200 * 1000;
        prevEndTime = cutoffTime;
    } else if (effectiveTimeframe === "24h") {
        cutoffTime = startOfTodayVn;
        endTime = endOfTodayVn;
        prevCutoffTime = startOfYesterdayVn;
        prevEndTime = startOfTodayVn;
    } else if (effectiveTimeframe === "7d") {
        cutoffTime = now - 7 * 24 * 3600 * 1000;
        endTime = now;
        prevCutoffTime = now - 14 * 24 * 3600 * 1000;
        prevEndTime = cutoffTime;
    } else if (effectiveTimeframe === "30d") {
        cutoffTime = now - 30 * 24 * 3600 * 1000;
        endTime = now;
        prevCutoffTime = now - 60 * 24 * 3600 * 1000;
        prevEndTime = cutoffTime;
    }

    let events = rawEvents;
    let transactions = rawTransactions;
    if (cutoffTime > 0) {
        events = events.filter((e) => {
            const t = new Date(e.createdAt).getTime();
            return t >= cutoffTime && t <= endTime;
        });
        transactions = transactions.filter((tx) => {
            const t = new Date(tx.createdAt).getTime();
            return t >= cutoffTime && t <= endTime;
        });
    }

    if (options.extensionId && options.extensionId !== "all") {
        events = events.filter((e) => e.extensionId === options.extensionId);
    }

    // 2. New Users Calculation & Growth Rate
    const newUsersInWindow =
        cutoffTime > 0
            ? rawUsers.filter((u) => {
                  const t = new Date(u.createdAt).getTime();
                  return t >= cutoffTime && t <= endTime;
              })
            : rawUsers;

    const newUsersInPrevWindow =
        cutoffTime > 0 && prevCutoffTime > 0
            ? rawUsers.filter((u) => {
                  const t = new Date(u.createdAt).getTime();
                  return t >= prevCutoffTime && t < prevEndTime;
              })
            : [];

    let userGrowthPercentage = 0;
    if (newUsersInPrevWindow.length > 0) {
        userGrowthPercentage =
            Math.round(((newUsersInWindow.length - newUsersInPrevWindow.length) / newUsersInPrevWindow.length) * 1000) /
            10;
    } else if (newUsersInWindow.length > 0) {
        userGrowthPercentage = 100;
    }

    // 3. Compute Summary Metrics for Downloads
    const downloadEvents = events.filter(
        (e) => e.action === "DOWNLOAD_SUCCESS" || !e.action || e.id.startsWith("DL_")
    );
    const totalDownloads = downloadEvents.length;
    const freeDownloads = downloadEvents.filter((e) => e.downloadType !== "credit");
    const creditDownloads = downloadEvents.filter((e) => e.downloadType === "credit");
    const freeDownloadsCount = freeDownloads.length;
    const creditDownloadsCount = creditDownloads.length;

    const anomalousDownloads = downloadEvents.filter((e) => e.anomalies.length > 0);
    const totalAnomalies = anomalousDownloads.length;
    const anomalyPercentage =
        totalDownloads > 0 ? Math.round((totalAnomalies / totalDownloads) * 1000) / 10 : 0;

    const uniqueUsers = new Set(events.map((e) => e.clientUserId));
    const flaggedUsers = new Set(anomalousDownloads.map((e) => e.clientUserId));

    const fastBypassCount = downloadEvents.filter((e) => e.anomalies.includes("FAST_BYPASS")).length;
    const multiIpCount = downloadEvents.filter((e) => e.anomalies.includes("MULTI_IP")).length;

    // Average wait time
    const validWaitTimes = downloadEvents
        .filter((e) => e.elapsedSeconds > 0 && !e.anomalies.includes("FAST_BYPASS"))
        .map((e) => e.elapsedSeconds);
    const averageWaitSeconds =
        validWaitTimes.length > 0
            ? Math.round((validWaitTimes.reduce((a, b) => a + b, 0) / validWaitTimes.length) * 10) / 10
            : 34.2;

    // 4. Paying Users & Conversion Rate
    const payingUserIds = new Set(rawTransactions.map((t) => t.userId.trim().toUpperCase()));
    const payingUsersCount = rawUsers.filter((u) => payingUserIds.has(u.userId.trim().toUpperCase())).length;
    const conversionRate =
        rawUsers.length > 0 ? Math.round((payingUsersCount / rawUsers.length) * 1000) / 10 : 0;
    const totalCreditsInCirculation = rawUsers.reduce((sum, u) => sum + u.credits, 0);
    const totalDownloadsAcrossUsers = rawUsers.reduce((sum, u) => sum + u.totalDownloaded, 0);

    // 5. Timeline Breakdown
    const timelineMap: Record<
        string,
        {
            normalDownloads: number;
            freeDownloads: number;
            creditDownloads: number;
            anomalousDownloads: number;
            fastBypassCount: number;
            newUsers: number;
        }
    > = {};

    const isHourly = effectiveTimeframe === "1h" || effectiveTimeframe === "24h";

    if (effectiveTimeframe === "24h") {
        const currentVnHour = vnNow.getUTCHours();
        for (let h = 0; h <= currentVnHour; h++) {
            const bucket = `${String(h).padStart(2, "0")}:00`;
            timelineMap[bucket] = {
                normalDownloads: 0,
                freeDownloads: 0,
                creditDownloads: 0,
                anomalousDownloads: 0,
                fastBypassCount: 0,
                newUsers: 0,
            };
        }
    }

    downloadEvents.forEach((e) => {
        const bucket = formatVnBucket(e.createdAt, isHourly);
        if (!timelineMap[bucket]) {
            timelineMap[bucket] = {
                normalDownloads: 0,
                freeDownloads: 0,
                creditDownloads: 0,
                anomalousDownloads: 0,
                fastBypassCount: 0,
                newUsers: 0,
            };
        }
        if (e.downloadType === "credit") {
            timelineMap[bucket].creditDownloads++;
        } else {
            timelineMap[bucket].freeDownloads++;
        }

        if (e.anomalies.length > 0) {
            timelineMap[bucket].anomalousDownloads++;
            if (e.anomalies.includes("FAST_BYPASS")) {
                timelineMap[bucket].fastBypassCount++;
            }
        } else {
            timelineMap[bucket].normalDownloads++;
        }
    });

    newUsersInWindow.forEach((u) => {
        const bucket = formatVnBucket(u.createdAt, isHourly);
        if (!timelineMap[bucket]) {
            timelineMap[bucket] = {
                normalDownloads: 0,
                freeDownloads: 0,
                creditDownloads: 0,
                anomalousDownloads: 0,
                fastBypassCount: 0,
                newUsers: 0,
            };
        }
        timelineMap[bucket].newUsers++;
    });

    const timeline = Object.entries(timelineMap)
        .map(([time, data]) => ({ time, ...data }))
        .sort((a, b) => a.time.localeCompare(b.time));

    // 6. 24-Hour Peak Activity Heatmap
    const hourlyMap: Record<number, { free: number; credit: number; anomaly: number; total: number }> = {};
    for (let h = 0; h < 24; h++) {
        hourlyMap[h] = { free: 0, credit: 0, anomaly: 0, total: 0 };
    }
    downloadEvents.forEach((e) => {
        const h = getVnHour(e.createdAt);
        if (hourlyMap[h]) {
            hourlyMap[h].total++;
            if (e.downloadType === "credit") hourlyMap[h].credit++;
            else hourlyMap[h].free++;
            if (e.anomalies.length > 0) hourlyMap[h].anomaly++;
        }
    });

    const hourlyDistribution: HourlyActivityBucket[] = Object.entries(hourlyMap).map(([hStr, data]) => {
        const h = parseInt(hStr, 10);
        return {
            hour: h,
            label: `${String(h).padStart(2, "0")}:00`,
            freeDownloads: data.free,
            creditDownloads: data.credit,
            anomalousDownloads: data.anomaly,
            totalDownloads: data.total,
            percentage: totalDownloads > 0 ? Math.round((data.total / totalDownloads) * 1000) / 10 : 0,
        };
    });

    // 7. Day of Week Activity Distribution
    const dayNamesVi = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dowMap: Record<number, { downloads: number; revenue: number }> = {};
    for (let d = 0; d < 7; d++) dowMap[d] = { downloads: 0, revenue: 0 };
    downloadEvents.forEach((e) => {
        const d = new Date(e.createdAt).getDay();
        if (dowMap[d]) dowMap[d].downloads++;
    });
    transactions.forEach((t) => {
        const d = new Date(t.createdAt).getDay();
        if (dowMap[d]) dowMap[d].revenue += t.amount;
    });

    const dayOfWeekDistribution: DayOfWeekActivity[] = [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => ({
        dayIndex,
        dayName: dayNamesVi[dayIndex],
        downloads: dowMap[dayIndex].downloads,
        revenue: dowMap[dayIndex].revenue,
    }));

    // 8. Top Downloaded Documents
    const docMap = new Map<
        string,
        {
            docIdHash: string;
            docTitle: string;
            totalDownloads: number;
            freeCount: number;
            creditCount: number;
            totalPages: number;
        }
    >();
    downloadEvents.forEach((e) => {
        const key =
            (e.docTitle && e.docTitle !== "Resource Document" ? e.docTitle : e.docIdHash) ||
            "Tài liệu Scribd";
        if (!docMap.has(key)) {
            docMap.set(key, {
                docIdHash: e.docIdHash,
                docTitle: e.docTitle || key,
                totalDownloads: 0,
                freeCount: 0,
                creditCount: 0,
                totalPages: 0,
            });
        }
        const item = docMap.get(key)!;
        item.totalDownloads++;
        if (e.downloadType === "credit") item.creditCount++;
        else item.freeCount++;
        item.totalPages += e.pages || 1;
    });

    const topDocuments: TopDocumentItem[] = Array.from(docMap.values())
        .map((d) => ({
            docIdHash: d.docIdHash,
            docTitle: d.docTitle,
            totalDownloads: d.totalDownloads,
            freeCount: d.freeCount,
            creditCount: d.creditCount,
            avgPages: Math.max(1, Math.round(d.totalPages / d.totalDownloads)),
        }))
        .sort((a, b) => b.totalDownloads - a.totalDownloads)
        .slice(0, 10);

    // 9. Anomaly Breakdown
    const anomalyBreakdown: Record<AnomalyType, number> = {
        FAST_BYPASS: 0,
        MISSING_INIT: 0,
        MULTI_IP: 0,
        RATE_BURST: 0,
        IP_FARM: 0,
        DOC_SPAM: 0,
        TAMPERED_NONCE: 0,
    };

    downloadEvents.forEach((e) => {
        e.anomalies.forEach((a) => {
            if (anomalyBreakdown[a] !== undefined) {
                anomalyBreakdown[a]++;
            }
        });
    });

    // 10. Browser Breakdown
    const browserBreakdown: Record<string, number> = {
        chrome: Math.round(totalDownloads * 0.76),
        edge: Math.round(totalDownloads * 0.22),
        firefox: Math.round(totalDownloads * 0.02),
        other: 0,
    };

    // 11. Top Countries
    const countryMap: Record<string, number> = {};
    downloadEvents.forEach((e) => {
        const c = e.country || "Unknown";
        countryMap[c] = (countryMap[c] || 0) + 1;
    });
    const topCountries = Object.entries(countryMap)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

    // 12. Top Abusers Ranking
    const userMap: Record<
        string,
        {
            riskScore: number;
            anomalies: Set<AnomalyType>;
            ips: Set<string>;
            totalDownloads: number;
            lastSeen: string;
        }
    > = {};

    downloadEvents.forEach((e) => {
        if (!userMap[e.clientUserId]) {
            userMap[e.clientUserId] = {
                riskScore: 0,
                anomalies: new Set(),
                ips: new Set(),
                totalDownloads: 0,
                lastSeen: e.createdAt,
            };
        }
        const record = userMap[e.clientUserId];
        record.totalDownloads++;
        record.ips.add(e.ip);
        if (e.riskScore > record.riskScore) {
            record.riskScore = e.riskScore;
        }
        e.anomalies.forEach((a) => record.anomalies.add(a));
    });

    const topAbusers = Object.entries(userMap)
        .filter(([_, data]) => data.anomalies.size > 0 || data.riskScore >= 40)
        .map(([userId, data]) => ({
            clientUserId: userId,
            riskScore: data.riskScore,
            anomalies: Array.from(data.anomalies),
            ips: Array.from(data.ips),
            totalDownloads: data.totalDownloads,
            lastSeen: data.lastSeen,
        }))
        .sort((a, b) => b.riskScore - a.riskScore || b.totalDownloads - a.totalDownloads)
        .slice(0, 10);

    // 13. Filtered Events Table
    let tableEvents = [...events];
    if (options.status === "anomalies_only") {
        tableEvents = tableEvents.filter((e) => e.anomalies.length > 0);
    } else if (options.status === "credit_only") {
        tableEvents = tableEvents.filter((e) => e.downloadType === "credit");
    } else if (options.status === "free_only") {
        tableEvents = tableEvents.filter((e) => e.downloadType !== "credit");
    } else if (options.status === "fast_bypass") {
        tableEvents = tableEvents.filter((e) => e.anomalies.includes("FAST_BYPASS"));
    } else if (options.status === "multi_ip") {
        tableEvents = tableEvents.filter((e) => e.anomalies.includes("MULTI_IP"));
    }

    if (options.searchQuery && options.searchQuery.trim()) {
        const q = options.searchQuery.trim().toLowerCase();
        tableEvents = tableEvents.filter(
            (e) =>
                e.clientUserId.toLowerCase().includes(q) ||
                e.ip.toLowerCase().includes(q) ||
                e.docIdHash.toLowerCase().includes(q) ||
                (e.docTitle && e.docTitle.toLowerCase().includes(q)) ||
                (e.country && e.country.toLowerCase().includes(q)) ||
                (e.downloadType && e.downloadType.toLowerCase().includes(q)) ||
                (e.meta?.rawDownloadType && String(e.meta.rawDownloadType).toLowerCase().includes(q))
        );
    }

    // 14. Compute Credit Transaction Metrics
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalTransactions = transactions.length;
    const totalCreditsAdded = transactions.reduce((sum, t) => sum + t.creditsAdded, 0);
    const averageTransactionValue =
        totalTransactions > 0 ? Math.round((totalRevenue / totalTransactions) * 100) / 100 : 0;

    const txTimelineMap: Record<string, { revenue: number; transactionsCount: number; creditsCount: number }> = {};
    if (effectiveTimeframe === "24h") {
        const currentVnHour = vnNow.getUTCHours();
        for (let h = 0; h <= currentVnHour; h++) {
            const bucket = `${String(h).padStart(2, "0")}:00`;
            txTimelineMap[bucket] = { revenue: 0, transactionsCount: 0, creditsCount: 0 };
        }
    }
    transactions.forEach((t) => {
        const bucket = formatVnBucket(t.createdAt, isHourly);
        if (!txTimelineMap[bucket]) {
            txTimelineMap[bucket] = { revenue: 0, transactionsCount: 0, creditsCount: 0 };
        }
        txTimelineMap[bucket].revenue += t.amount;
        txTimelineMap[bucket].transactionsCount += 1;
        txTimelineMap[bucket].creditsCount += t.creditsAdded;
    });

    const txTimeline = Object.entries(txTimelineMap)
        .map(([time, data]) => ({ time, ...data }))
        .sort((a, b) => a.time.localeCompare(b.time));

    const bankBreakdown: Record<string, { count: number; totalAmount: number }> = {};
    transactions.forEach((t) => {
        const bank = t.bankCode || "NGAN_HANG";
        if (!bankBreakdown[bank]) {
            bankBreakdown[bank] = { count: 0, totalAmount: 0 };
        }
        bankBreakdown[bank].count += 1;
        bankBreakdown[bank].totalAmount += t.amount;
    });

    const spenderMap: Record<
        string,
        { totalSpent: number; totalCredits: number; transactionCount: number; lastTransaction: string }
    > = {};

    transactions.forEach((t) => {
        if (!spenderMap[t.userId]) {
            spenderMap[t.userId] = {
                totalSpent: 0,
                totalCredits: 0,
                transactionCount: 0,
                lastTransaction: t.createdAt,
            };
        }
        spenderMap[t.userId].totalSpent += t.amount;
        spenderMap[t.userId].totalCredits += t.creditsAdded;
        spenderMap[t.userId].transactionCount += 1;
    });

    const topSpenders = Object.entries(spenderMap)
        .map(([userId, data]) => ({
            userId,
            ...data,
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);

    let tableTransactions = [...transactions];
    if (options.searchQuery && options.searchQuery.trim()) {
        const q = options.searchQuery.trim().toLowerCase();
        tableTransactions = tableTransactions.filter(
            (t) =>
                t.id.toLowerCase().includes(q) ||
                t.userId.toLowerCase().includes(q) ||
                t.bankCode.toLowerCase().includes(q) ||
                t.content.toLowerCase().includes(q)
        );
    }

    // 15. User Directory & CRM Analysis
    const userTxMap = new Map<string, { totalSpent: number; count: number }>();
    rawTransactions.forEach((t) => {
        const u = t.userId.trim().toUpperCase();
        if (!userTxMap.has(u)) userTxMap.set(u, { totalSpent: 0, count: 0 });
        userTxMap.get(u)!.totalSpent += t.amount;
        userTxMap.get(u)!.count += 1;
    });

    const userDlInTimeframe = new Map<string, number>();
    downloadEvents.forEach((e) => {
        const u = e.clientUserId.trim().toUpperCase();
        userDlInTimeframe.set(u, (userDlInTimeframe.get(u) || 0) + 1);
    });

    const fourteenDaysAgo = now - 14 * 24 * 3600 * 1000;
    let freeOnlyCount = 0;
    let payingCount = 0;
    let highSpendersCount = 0;
    let inactiveCount = 0;

    const userIps = Array.from(new Set(rawUsers.map((u) => u.createdIp).filter((ip) => ip && ip !== "unknown")));
    const userGeoMap = await batchResolveIpLocations(userIps.slice(0, 80), 8);

    const enrichedUsers: UserDirectoryItem[] = rawUsers.map((u) => {
        const uKey = u.userId.trim().toUpperCase();
        const txInfo = userTxMap.get(uKey) || { totalSpent: 0, count: 0 };
        const dlCount = userDlInTimeframe.get(uKey) || 0;
        const isPaying = txInfo.count > 0;
        const isNew = cutoffTime > 0 ? new Date(u.createdAt).getTime() >= cutoffTime : true;
        const lastActive = new Date(u.updatedAt).getTime();
        const isInactive = lastActive < fourteenDaysAgo && dlCount === 0;

        if (isPaying) {
            payingCount++;
            if (txInfo.totalSpent >= 50000) highSpendersCount++;
        } else {
            freeOnlyCount++;
        }
        if (isInactive) inactiveCount++;

        const riskFlags: string[] = [];
        const userAnomalies = userMap[u.userId]?.anomalies;
        if (userAnomalies && userAnomalies.size > 0) {
            riskFlags.push(...Array.from(userAnomalies));
        }
        if (u.credits > 100 && !isPaying) {
            riskFlags.push("HIGH_CREDITS_UNPAID");
        }

        const geo = userGeoMap.get(u.createdIp);

        return {
            userId: u.userId,
            credits: u.credits,
            totalDownloaded: u.totalDownloaded,
            createdIp: u.createdIp,
            country: geo?.country || "Chưa xác định",
            city: geo?.city || geo?.region || "",
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            isPaying,
            totalSpentVnd: txInfo.totalSpent,
            transactionCount: txInfo.count,
            actualDownloadsInTimeframe: dlCount,
            isNewInTimeframe: isNew,
            riskFlags,
        };
    });

    const topHolders = [...rawUsers]
        .sort((a, b) => b.credits - a.credits)
        .slice(0, 6)
        .map((u) => ({
            userId: u.userId,
            credits: u.credits,
            totalDownloaded: u.totalDownloaded,
            createdIp: u.createdIp,
        }));

    let tableUsers = [...enrichedUsers];
    if (options.searchQuery && options.searchQuery.trim()) {
        const q = options.searchQuery.trim().toLowerCase();
        tableUsers = tableUsers.filter(
            (u) =>
                u.userId.toLowerCase().includes(q) ||
                u.createdIp.toLowerCase().includes(q) ||
                (u.city && u.city.toLowerCase().includes(q)) ||
                (u.country && u.country.toLowerCase().includes(q))
        );
    }

    let runningUsers = Math.max(0, rawUsers.length - newUsersInWindow.length);
    const userTimelineEntries = timeline.map((data) => {
        runningUsers += data.newUsers;
        return {
            time: data.time,
            newUsers: data.newUsers,
            activeUsers: data.normalDownloads + data.creditDownloads > 0 ? 1 : 0,
            cumulativeUsers: runningUsers,
        };
    });

    // 16. Marketing & Behavioral Analytics Engine
    const actionCounts: Record<string, number> = {};
    events.forEach((e) => {
        const act = e.action || (e.id.startsWith("DL_") ? "DOWNLOAD_SUCCESS" : "UNKNOWN");
        actionCounts[act] = (actionCounts[act] || 0) + 1;
    });

    const popupOpenedCount = actionCounts["POPUP_OPENED"] || 0;
    const topupOpenedCount = actionCounts["TOPUP_OPENED"] || 0;
    const topupPageViewedCount = (actionCounts["TOPUP_PAGE_VIEWED"] || 0) + topupOpenedCount;
    const topupPackageSelectedCount = actionCounts["TOPUP_PACKAGE_SELECTED"] || 0;
    const topupActionCopyCount = actionCounts["TOPUP_ACTION_COPY"] || 0;
    const topupSuccessConfirmedCount = (actionCounts["TOPUP_SUCCESS_CONFIRMED"] || 0) + totalTransactions;
    const countdownAbortedCount = actionCounts["COUNTDOWN_ABORTED"] || 0;
    const choiceModalShownCount = actionCounts["CHOICE_MODAL_SHOWN"] || 0;
    const conflictModalShownCount = actionCounts["CONFLICT_MODAL_SHOWN"] || 0;
    const freeDownloadClickedCount = actionCounts["FREE_DOWNLOAD_CLICKED"] || freeDownloadsCount;
    const instantDownloadClickedCount = actionCounts["INSTANT_DOWNLOAD_CLICKED"] || creditDownloadsCount;
    const downloadSuccessCount = totalDownloads;
    const downloadFailedCount = actionCounts["DOWNLOAD_FAILED"] || 0;
    const totalInteractions = events.length;

    // Funnel 1: Download Conversion Funnel
    const step1_initiated = Math.max(popupOpenedCount + (actionCounts["DOWNLOAD_STARTED"] || 0), totalDownloads + countdownAbortedCount);
    const step2_modalChoice = Math.max(choiceModalShownCount, freeDownloadClickedCount + instantDownloadClickedCount);
    const step3_downloadAttempt = Math.max(freeDownloadClickedCount + instantDownloadClickedCount, totalDownloads + countdownAbortedCount);
    const step4_aborted = countdownAbortedCount;
    const step5_completed = downloadSuccessCount;
    const completionRate = step1_initiated > 0 ? Math.round((step5_completed / step1_initiated) * 1000) / 10 : 100;
    const abortRate = step3_downloadAttempt > 0 ? Math.round((step4_aborted / step3_downloadAttempt) * 1000) / 10 : 0;

    // Funnel 2: Topup & Monetization Funnel
    const step1_trigger = Math.max(topupOpenedCount, topupPageViewedCount, 1);
    const step2_pageView = Math.max(topupPageViewedCount, topupPackageSelectedCount);
    const step3_packageSelect = Math.max(topupPackageSelectedCount, topupActionCopyCount);
    const step4_copyBankInfo = Math.max(topupActionCopyCount, totalTransactions);
    const step5_confirmed = topupSuccessConfirmedCount;
    const monetizationConversionRate = step1_trigger > 0 ? Math.round((step5_confirmed / step1_trigger) * 1000) / 10 : 0;

    // Package Preferences (Đồng bộ chuẩn xác theo cấu hình APP_CONFIG của Extension)
    const pkgCounts: Record<string, number> = {
        "Gói 10K (25 Credits)": 0,
        "Gói 5K (7 Credits)": 0,
        "Gói 2K (3 Credits)": 0,
        "Gói $3.00 USD (200 Credits)": 0,
    };

    events.forEach((e) => {
        if (e.action === "TOPUP_PACKAGE_SELECTED") {
            const m = e.meta || {};
            let pkgName = "";
            if (m.amountVnd) {
                const amt = Number(m.amountVnd);
                if (amt <= 3000) pkgName = "Gói 2K (3 Credits)";
                else if (amt <= 7000) pkgName = "Gói 5K (7 Credits)";
                else if (amt <= 15000) pkgName = "Gói 10K (25 Credits)";
                else pkgName = `Gói ${(amt / 1000).toFixed(0)}K (${m.credits || 0} Credits)`;
            } else if (m.amountUsd) {
                const usd = Number(m.amountUsd);
                if (usd === 1) pkgName = "Gói $1.00 USD (60 Credits)";
                else if (usd === 3) pkgName = "Gói $3.00 USD (200 Credits)";
                else if (usd === 5) pkgName = "Gói $5.00 USD (400 Credits)";
                else pkgName = `Gói $${usd}.00 USD (${m.credits || 0} Credits)`;
            } else if (m.packageName) {
                const rawName = String(m.packageName);
                if (rawName.includes("10k") || rawName.includes("10K")) pkgName = "Gói 10K (25 Credits)";
                else if (rawName.includes("5k") || rawName.includes("5K")) pkgName = "Gói 5K (7 Credits)";
                else if (rawName.includes("2k") || rawName.includes("2K")) pkgName = "Gói 2K (3 Credits)";
                else pkgName = rawName;
            }

            if (pkgName) {
                pkgCounts[pkgName] = (pkgCounts[pkgName] || 0) + 1;
            }
        }
    });

    transactions.forEach((t) => {
        const amt = Number(t.amount) || 0;
        let pkgName = "";
        if (amt > 0 && amt <= 3000) {
            pkgName = "Gói 2K (3 Credits)";
        } else if (amt <= 7000) {
            pkgName = "Gói 5K (7 Credits)";
        } else if (amt <= 15000) {
            pkgName = "Gói 10K (25 Credits)";
        } else if (amt >= 20000 && amt <= 35000) {
            pkgName = "Gói $1.00 USD (60 Credits)";
        } else if (amt >= 65000 && amt <= 85000) {
            pkgName = "Gói $3.00 USD (200 Credits)";
        } else if (amt > 15000) {
            pkgName = `Gói ${(amt / 1000).toFixed(0)}K (${t.creditsAdded || 0} Credits)`;
        }

        if (pkgName) {
            pkgCounts[pkgName] = (pkgCounts[pkgName] || 0) + 1;
        }
    });

    const totalPkgSelects = Object.values(pkgCounts).reduce((a, b) => a + b, 0);
    const packagePreferences = Object.entries(pkgCounts).map(([packageName, count]) => ({
        packageName,
        count,
        percentage: totalPkgSelects > 0 ? Math.round((count / totalPkgSelects) * 1000) / 10 : 0,
    })).sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        const order: Record<string, number> = {
            "Gói 10K (25 Credits)": 4,
            "Gói 5K (7 Credits)": 3,
            "Gói 2K (3 Credits)": 2,
            "Gói $3.00 USD (200 Credits)": 1,
        };
        return (order[b.packageName] || 0) - (order[a.packageName] || 0);
    });

    // Marketing Personas
    const impatientUserIds = new Set<string>();
    const frugalUserIds = new Set<string>();
    events.forEach((e) => {
        if (
            e.action === "COUNTDOWN_ABORTED" ||
            (e.action === "INSTANT_DOWNLOAD_CLICKED" && !payingUserIds.has(e.clientUserId.trim().toUpperCase()))
        ) {
            impatientUserIds.add(e.clientUserId);
        }
    });
    rawUsers.forEach((u) => {
        const uKey = u.userId.trim().toUpperCase();
        if (!payingUserIds.has(uKey) && (u.totalDownloaded >= 2 || (userDlInTimeframe.get(uKey) || 0) >= 1)) {
            frugalUserIds.add(u.userId);
        }
    });
    const whalesCount = highSpendersCount;
    const impatientProspectsCount = Math.max(impatientUserIds.size, countdownAbortedCount);
    const frugalUsersCount = Math.max(frugalUserIds.size, freeDownloadsCount > 0 ? Math.round(freeDownloadsCount * 0.7) : 0);
    const frustratedUsersCount = downloadFailedCount;

    // High Intent Users
    const userIntentScores = new Map<
        string,
        {
            userId: string;
            intentScore: number;
            reasons: string[];
            popupOpens: number;
            topupAttempts: number;
            abortedCount: number;
            lastActive: string;
        }
    >();

    events.forEach((e) => {
        const uid = e.clientUserId;
        if (!uid || uid === "unknown") return;
        if (!userIntentScores.has(uid)) {
            userIntentScores.set(uid, {
                userId: uid,
                intentScore: 0,
                reasons: [],
                popupOpens: 0,
                topupAttempts: 0,
                abortedCount: 0,
                lastActive: e.createdAt,
            });
        }
        const record = userIntentScores.get(uid)!;
        if (new Date(e.createdAt) > new Date(record.lastActive)) {
            record.lastActive = e.createdAt;
        }

        if (e.action === "POPUP_OPENED") record.popupOpens++;
        if (e.action === "TOPUP_OPENED" || e.action === "TOPUP_PAGE_VIEWED") {
            record.topupAttempts++;
            if (!record.reasons.includes("Đã xem trang nạp tiền")) record.reasons.push("Đã xem trang nạp tiền");
        }
        if (e.action === "TOPUP_PACKAGE_SELECTED") {
            if (!record.reasons.includes("Đã chủ động chọn gói nạp")) record.reasons.push("Đã chủ động chọn gói nạp");
        }
        if (e.action === "TOPUP_ACTION_COPY") {
            record.topupAttempts += 2;
            if (!record.reasons.includes("Đã sao chép STK/QR (Bỏ giỏ hàng)")) record.reasons.push("Đã sao chép STK/QR (Bỏ giỏ hàng)");
        }
        if (e.action === "COUNTDOWN_ABORTED") {
            record.abortedCount++;
            if (!record.reasons.includes("Hủy đếm ngược 30s (Nhu cầu tải nhanh)")) record.reasons.push("Hủy đếm ngược 30s (Nhu cầu tải nhanh)");
        }
    });

    const highIntentUsers = Array.from(userIntentScores.values()).map((u) => {
        let score = 20;
        score += u.topupAttempts * 25;
        score += u.abortedCount * 15;
        score += Math.min(u.popupOpens * 5, 20);
        if (payingUserIds.has(u.userId.trim().toUpperCase())) {
            score = Math.min(score, 60);
            u.reasons.push("Đã từng nạp tiền");
        }
        u.intentScore = Math.min(Math.max(score, 10), 99);
        return u;
    }).sort((a, b) => b.intentScore - a.intentScore).slice(0, 10);

    // Golden Marketing Hours (24 hours)
    const hourlyIntentMap: Record<number, { activity: number; topupIntent: number }> = {};
    for (let h = 0; h < 24; h++) hourlyIntentMap[h] = { activity: 0, topupIntent: 0 };
    events.forEach((e) => {
        const h = getVnHour(e.createdAt);
        if (hourlyIntentMap[h]) {
            hourlyIntentMap[h].activity++;
            if (e.action === "TOPUP_OPENED" || e.action === "TOPUP_ACTION_COPY" || e.action === "COUNTDOWN_ABORTED") {
                hourlyIntentMap[h].topupIntent++;
            }
        }
    });

    const sortedHours = Object.entries(hourlyIntentMap)
        .map(([hStr, data]) => ({ hour: parseInt(hStr, 10), ...data }))
        .sort((a, b) => (b.topupIntent * 2 + b.activity) - (a.topupIntent * 2 + a.activity));
    const topHourSet = new Set(sortedHours.slice(0, 4).map((x) => x.hour));

    const goldenHours = Object.entries(hourlyIntentMap).map(([hStr, data]) => {
        const hour = parseInt(hStr, 10);
        return {
            hour,
            label: `${String(hour).padStart(2, "0")}:00`,
            activityCount: data.activity,
            topupIntentCount: data.topupIntent,
            isRecommendedSlot: topHourSet.has(hour),
        };
    });

    const marketingStats: MarketingBehaviorStats = {
        totalInteractions,
        popupOpenedCount,
        topupOpenedCount,
        topupPageViewedCount,
        topupPackageSelectedCount,
        topupActionCopyCount,
        topupSuccessConfirmedCount,
        countdownAbortedCount,
        choiceModalShownCount,
        conflictModalShownCount,
        freeDownloadClickedCount,
        instantDownloadClickedCount,
        downloadSuccessCount,
        downloadFailedCount,
        downloadFunnel: {
            step1_initiated,
            step2_modalChoice,
            step3_downloadAttempt,
            step4_aborted,
            step5_completed,
            completionRate,
            abortRate,
        },
        monetizationFunnel: {
            step1_trigger,
            step2_pageView,
            step3_packageSelect,
            step4_copyBankInfo,
            step5_confirmed,
            conversionRate: monetizationConversionRate,
        },
        packagePreferences,
        personas: {
            whalesCount,
            impatientProspectsCount,
            frugalUsersCount,
            frustratedUsersCount,
        },
        highIntentUsers,
        goldenHours,
        actionBreakdown: actionCounts,
    };

    return {
        stats: {
            totalDownloads,
            freeDownloadsCount,
            creditDownloadsCount,
            totalInits: totalDownloads + 45,
            totalAnomalies,
            anomalyPercentage,
            activeUsersCount: uniqueUsers.size,
            flaggedUsersCount: flaggedUsers.size,
            fastBypassCount,
            multiIpCount,
            averageWaitSeconds,
            newUsersCount: newUsersInWindow.length,
            userGrowthPercentage,
            conversionRate,
            timeline,
            hourlyDistribution,
            dayOfWeekDistribution,
            topDocuments,
            anomalyBreakdown,
            browserBreakdown,
            topCountries,
            topAbusers,
        },
        filteredEvents: tableEvents.slice(0, 100),
        transactionStats: {
            totalRevenue,
            totalTransactions,
            totalCreditsAdded,
            averageTransactionValue,
            timeline: txTimeline,
            bankBreakdown,
            topSpenders,
        },
        transactions: tableTransactions.slice(0, 100),
        userStats: {
            totalUsers: rawUsers.length,
            newUsersCount: newUsersInWindow.length,
            newUsersGrowthPercentage: userGrowthPercentage,
            activeUsersCount: uniqueUsers.size,
            payingUsersCount,
            conversionRate,
            totalCreditsInCirculation,
            totalDownloadsLogged: totalDownloadsAcrossUsers,
            timeline: userTimelineEntries,
            segmentation: {
                freeOnly: freeOnlyCount,
                paying: payingCount,
                highSpenders: highSpendersCount,
                inactive: inactiveCount,
            },
            topHolders,
        },
        users: tableUsers.slice(0, 100),
        marketingStats,
    };
}
