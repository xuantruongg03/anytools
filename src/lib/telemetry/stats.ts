import { getAllEvents } from "./storage";
import { TelemetryEvent, TelemetrySummaryStats, AnomalyType, ExtensionId } from "./types";

export interface StatsFilterOptions {
    extensionId?: string; // "all" or specific
    timeframe?: "1h" | "24h" | "7d" | "30d" | "all";
    status?: "all" | "credit_only" | "free_only" | "anomalies_only" | "fast_bypass" | "multi_ip";
    searchQuery?: string;
}

export async function getTelemetryStats(options: StatsFilterOptions = {}): Promise<{
    stats: TelemetrySummaryStats;
    filteredEvents: TelemetryEvent[];
}> {
    const rawEvents = await getAllEvents();
    const now = Date.now();

    // 1. Filter by timeframe
    let cutoffTime = 0;
    if (options.timeframe === "1h") cutoffTime = now - 3600 * 1000;
    else if (options.timeframe === "24h" || !options.timeframe) cutoffTime = now - 24 * 3600 * 1000;
    else if (options.timeframe === "7d") cutoffTime = now - 7 * 24 * 3600 * 1000;
    else if (options.timeframe === "30d") cutoffTime = now - 30 * 24 * 3600 * 1000;

    let events = rawEvents.filter((e) => {
        if (cutoffTime > 0 && new Date(e.createdAt).getTime() < cutoffTime) {
            return false;
        }
        if (options.extensionId && options.extensionId !== "all" && e.extensionId !== options.extensionId) {
            return false;
        }
        return true;
    });

    // 2. Compute Summary Metrics
    const downloadEvents = events.filter((e) => e.action === "DOWNLOAD_SUCCESS");
    const totalDownloads = downloadEvents.length;
    const anomalousDownloads = downloadEvents.filter((e) => e.anomalies.length > 0);
    const totalAnomalies = anomalousDownloads.length;
    const anomalyPercentage = totalDownloads > 0 ? Math.round((totalAnomalies / totalDownloads) * 1000) / 10 : 0;

    const uniqueUsers = new Set(events.map((e) => e.clientUserId));
    const flaggedUsers = new Set(anomalousDownloads.map((e) => e.clientUserId));

    const fastBypassCount = downloadEvents.filter((e) => e.anomalies.includes("FAST_BYPASS")).length;
    const multiIpCount = downloadEvents.filter((e) => e.anomalies.includes("MULTI_IP")).length;

    // Average wait time for non-bypassed downloads
    const validWaitTimes = downloadEvents
        .filter((e) => e.elapsedSeconds > 0 && !e.anomalies.includes("FAST_BYPASS"))
        .map((e) => e.elapsedSeconds);
    const averageWaitSeconds =
        validWaitTimes.length > 0
            ? Math.round((validWaitTimes.reduce((a, b) => a + b, 0) / validWaitTimes.length) * 10) / 10
            : 32.5;

    // 3. Hourly / Timeline Breakdown
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

    const freeDownloadsCount = downloadEvents.filter((e) => e.downloadType !== "credit").length;
    const creditDownloadsCount = downloadEvents.filter((e) => e.downloadType === "credit").length;

    downloadEvents.forEach((e) => {
        const d = new Date(e.createdAt);
        const bucket =
            options.timeframe === "7d" || options.timeframe === "30d"
                ? `${d.getMonth() + 1}/${d.getDate()}`
                : `${String(d.getHours()).padStart(2, "0")}:00`;

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

    const timeline = Object.entries(timelineMap).map(([time, data]) => ({
        time,
        ...data,
    }));

    // 24-Hour Peak Activity Heatmap
    const hourlyMap: Record<number, { free: number; credit: number; anomaly: number; total: number }> = {};
    for (let h = 0; h < 24; h++) {
        hourlyMap[h] = { free: 0, credit: 0, anomaly: 0, total: 0 };
    }
    downloadEvents.forEach((e) => {
        const h = new Date(e.createdAt).getHours();
        if (hourlyMap[h]) {
            hourlyMap[h].total++;
            if (e.downloadType === "credit") hourlyMap[h].credit++;
            else hourlyMap[h].free++;
            if (e.anomalies.length > 0) hourlyMap[h].anomaly++;
        }
    });

    const hourlyDistribution = Object.entries(hourlyMap).map(([hStr, data]) => {
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

    // Day of week
    const dayNamesVi = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dowMap: Record<number, number> = {};
    for (let d = 0; d < 7; d++) dowMap[d] = 0;
    downloadEvents.forEach((e) => {
        const d = new Date(e.createdAt).getDay();
        if (dowMap[d] !== undefined) dowMap[d]++;
    });
    const dayOfWeekDistribution = [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => ({
        dayIndex,
        dayName: dayNamesVi[dayIndex],
        downloads: dowMap[dayIndex] || 0,
        revenue: 0,
    }));

    // Top documents
    const docMap = new Map<string, { docIdHash: string; docTitle: string; totalDownloads: number; freeCount: number; creditCount: number; totalPages: number }>();
    downloadEvents.forEach((e) => {
        const key = e.docTitle || e.docIdHash || "Document";
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
        item.totalPages += (e.pages || 1);
    });

    const topDocuments = Array.from(docMap.values())
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

    // 4. Anomaly Breakdown
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

    // 5. Browser Breakdown
    const browserBreakdown: Record<string, number> = {
        chrome: 0,
        edge: 0,
        firefox: 0,
        other: 0,
    };
    downloadEvents.forEach((e) => {
        const b = e.browser || "other";
        browserBreakdown[b] = (browserBreakdown[b] || 0) + 1;
    });

    // 6. Country Breakdown
    const countryMap: Record<string, number> = {};
    downloadEvents.forEach((e) => {
        const c = e.country || "Unknown";
        countryMap[c] = (countryMap[c] || 0) + 1;
    });
    const topCountries = Object.entries(countryMap)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7);

    // 7. Top Abusers Ranking
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

    // 8. Filtered Events for Live Table
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

    return {
        stats: {
            totalDownloads,
            freeDownloadsCount,
            creditDownloadsCount,
            totalInits: events.filter((e) => e.action === "INIT_REQUEST").length,
            totalAnomalies,
            anomalyPercentage,
            activeUsersCount: uniqueUsers.size,
            flaggedUsersCount: flaggedUsers.size,
            fastBypassCount,
            multiIpCount,
            averageWaitSeconds,
            newUsersCount: 0,
            userGrowthPercentage: 0,
            conversionRate: 0,
            timeline,
            hourlyDistribution,
            dayOfWeekDistribution,
            topDocuments,
            anomalyBreakdown,
            browserBreakdown,
            topCountries,
            topAbusers,
        },
        filteredEvents: tableEvents.slice(0, 150),
    };
}
