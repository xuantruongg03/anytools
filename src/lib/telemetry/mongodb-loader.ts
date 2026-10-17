import { getDb } from "@/lib/db/mongodb";
import {
    TelemetryEvent,
    CreditTransaction,
} from "./types";
import { StatsFilterOptions } from "./stats";
import {
    RawSheetUser,
    RawDownloadRecord,
    DashboardStatsResult,
    parseDateTimeToIso,
    processRawDownloadsIntoTelemetryEvents,
    computeDashboardStats,
} from "./stats-calculator";

// Keep the dashboard responsive while allowing a short freshness window.
let cachedMongoEvents: TelemetryEvent[] | null = null;
let lastMongoEventsCache = 0;
let cachedMongoEventsKey = "";
let cachedMongoTransactions: CreditTransaction[] | null = null;
let lastMongoTxCache = 0;
let cachedMongoTransactionsKey = "";
let cachedMongoUsers: RawSheetUser[] | null = null;
let lastMongoUsersCache = 0;
const MONGO_CACHE_TTL_MS = 60_000;

function timeframeToDate(timeframe: StatsFilterOptions["timeframe"]): Date | null {
    const now = Date.now();
    switch (timeframe) {
        case "1h": return new Date(now - 60 * 60 * 1000);
        case "24h": return new Date(now - 24 * 60 * 60 * 1000);
        case "7d": return new Date(now - 7 * 24 * 60 * 60 * 1000);
        case "30d": return new Date(now - 30 * 24 * 60 * 60 * 1000);
        default: return null;
    }
}

function createdAtFilter(timeframe: StatsFilterOptions["timeframe"]): Record<string, unknown> {
    const since = timeframeToDate(timeframe);
    if (!since) return {};
    const legacyVn = new Date(since.getTime() + 7 * 60 * 60 * 1000)
        .toISOString().replace("T", " ").slice(0, 19);
    const isoString = since.toISOString();
    return {
        $or: [
            { createdAt: { $gte: since } },
            { createdAt: { $gte: isoString } },
            { createdAt: { $gte: legacyVn } },
        ],
    };
}

/**
 * Lấy danh sách users từ MongoDB (collection credits_users)
 */
export async function fetchMongoUsers(options: StatsFilterOptions = {}): Promise<RawSheetUser[]> {
    const now = Date.now();
    if (!options.forceRefresh && cachedMongoUsers && now - lastMongoUsersCache < MONGO_CACHE_TTL_MS) {
        return cachedMongoUsers;
    }

    try {
        const db = await getDb();
        if (!db) {
            console.warn("⚠️ [MongoDB Loader] Database instance unavailable for users fetch.");
            return cachedMongoUsers || [];
        }

        const rawDocs = await db
            .collection("credits_users")
            .find({})
            .project({ userId: 1, credits: 1, totalDownloaded: 1, createdIp: 1, createdAt: 1, updatedAt: 1 })
            .sort({ createdAt: -1 })
            .limit(10000)
            .toArray();

        const userMap = new Map<string, RawSheetUser>();

        rawDocs.forEach((doc: any, idx: number) => {
            const rawId = (doc.userId || "").toString().trim();
            const userId = rawId || `MONGO_USER_${idx}`;
            const credits = typeof doc.credits === "number" ? doc.credits : parseInt(doc.credits || "0", 10) || 0;
            const totalDownloaded =
                typeof doc.totalDownloaded === "number"
                    ? doc.totalDownloaded
                    : parseInt(doc.totalDownloaded || "0", 10) || 0;
            const createdIp = (doc.createdIp || "unknown").toString().trim();
            const createdAt = parseDateTimeToIso(doc.createdAt);
            const updatedAt = parseDateTimeToIso(doc.updatedAt || doc.createdAt);

            const existing = userMap.get(userId);
            if (existing) {
                const isNewer = new Date(updatedAt).getTime() >= new Date(existing.updatedAt).getTime();
                userMap.set(userId, {
                    userId,
                    credits: isNewer ? credits : Math.max(existing.credits, credits),
                    totalDownloaded: Math.max(existing.totalDownloaded, totalDownloaded),
                    createdIp: existing.createdIp !== "unknown" ? existing.createdIp : createdIp,
                    createdAt:
                        new Date(existing.createdAt).getTime() <= new Date(createdAt).getTime()
                            ? existing.createdAt
                            : createdAt,
                    updatedAt: isNewer ? updatedAt : existing.updatedAt,
                });
            } else {
                userMap.set(userId, {
                    userId,
                    credits,
                    totalDownloaded,
                    createdIp,
                    createdAt,
                    updatedAt,
                });
            }
        });

        const users: RawSheetUser[] = Array.from(userMap.values());
        users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        cachedMongoUsers = users;
        lastMongoUsersCache = now;
        return users;
    } catch (err: any) {
        console.error("❌ [MongoDB Loader] Failed to fetch users from MongoDB:", err.message);
        return cachedMongoUsers || [];
    }
}

/**
 * Lấy danh sách giao dịch từ MongoDB (collection credits_transactions)
 */
export async function fetchMongoTransactions(options: StatsFilterOptions = {}): Promise<CreditTransaction[]> {
    const now = Date.now();
    const cacheKey = options.timeframe || "all";
    if (!options.forceRefresh && cachedMongoTransactions && cachedMongoTransactionsKey === cacheKey && now - lastMongoTxCache < MONGO_CACHE_TTL_MS) {
        return cachedMongoTransactions;
    }

    try {
        const db = await getDb();
        if (!db) {
            console.warn("⚠️ [MongoDB Loader] Database instance unavailable for transactions fetch.");
            return cachedMongoTransactions || [];
        }

        const rawDocs = await db
            .collection("credits_transactions")
            .find(createdAtFilter(options.timeframe))
            .project({ transId: 1, id: 1, userId: 1, amount: 1, creditsAdded: 1, bankCode: 1, content: 1, createdAt: 1 })
            .sort({ createdAt: -1 })
            .limit(5000)
            .toArray();

        const transactions: CreditTransaction[] = rawDocs.map((doc: any, idx: number) => {
            const id = (doc.transId || doc.id || `TX_${idx}`).toString().trim();
            const userId = (doc.userId || "ANONYMOUS").toString().trim();
            const numericAmount =
                typeof doc.amount === "number" ? doc.amount : parseFloat(String(doc.amount || "0").replace(/[^0-9.-]+/g, "")) || 0;
            const creditsAdded =
                typeof doc.creditsAdded === "number"
                    ? doc.creditsAdded
                    : parseInt(String(doc.creditsAdded || "0"), 10) || 0;
            const bankCode = (doc.bankCode || "NGAN_HANG").toString().trim().toUpperCase();
            const content = (doc.content || "").toString().trim();
            const createdAt = parseDateTimeToIso(doc.createdAt);

            return {
                id,
                userId,
                amount: numericAmount,
                rawAmount: String(doc.amount || numericAmount),
                creditsAdded,
                bankCode,
                content,
                createdAt,
            };
        });

        transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        cachedMongoTransactions = transactions;
        cachedMongoTransactionsKey = cacheKey;
        lastMongoTxCache = now;
        return transactions;
    } catch (err: any) {
        console.error("❌ [MongoDB Loader] Failed to fetch transactions from MongoDB:", err.message);
        return cachedMongoTransactions || [];
    }
}

/**
 * Lấy và xử lý dữ liệu Telemetry / Lượt tải từ MongoDB (collection credits_downloads và telemetry_events)
 */
export async function fetchMongoTelemetry(options: StatsFilterOptions = {}): Promise<TelemetryEvent[]> {
    const now = Date.now();
    const cacheKey = `${options.extensionId || "all"}_${options.timeframe || "all"}`;
    if (!options.forceRefresh && cachedMongoEvents && cachedMongoEventsKey === cacheKey && now - lastMongoEventsCache < MONGO_CACHE_TTL_MS) {
        return cachedMongoEvents;
    }

    try {
        const db = await getDb();
        if (!db) {
            console.warn("⚠️ [MongoDB Loader] Database instance unavailable for telemetry fetch.");
            return cachedMongoEvents || [];
        }

        // 1. Lấy lượt tải từ credits_downloads
        const dlDocs = await db
            .collection("credits_downloads")
            .find(createdAtFilter(options.timeframe))
            .project({ logId: 1, userId: 1, downloadType: 1, documentUrl: 1, documentTitle: 1, totalPages: 1, clientIp: 1, createdAt: 1 })
            .sort({ createdAt: -1 })
            .limit(10000)
            .toArray();

        const rawRecords: RawDownloadRecord[] = dlDocs.map((doc: any, idx: number) => ({
            logId: (doc.logId || `DL_${idx}`).toString().trim(),
            userId: (doc.userId || "").toString().trim(),
            downloadType: (doc.downloadType || "free").toString().trim(),
            documentUrl: (doc.documentUrl || "").toString().trim(),
            documentTitle: (doc.documentTitle || "Resource Document").toString().trim(),
            totalPages: Number(doc.totalPages) || 1,
            clientIp: (doc.clientIp || "unknown").toString().trim(),
            createdAt: doc.createdAt,
        }));

        // Chuyển đổi thành TelemetryEvent đầy đủ các vectors phân tích
        const processedEvents = await processRawDownloadsIntoTelemetryEvents(rawRecords);

        // 2. Lấy thêm telemetry_events nếu có (các event giàu thông tin do extension gửi)
        let directEvents: TelemetryEvent[] = [];
        try {
            const teFilter: Record<string, unknown> = createdAtFilter(options.timeframe);
            if (options.extensionId && options.extensionId !== "all") {
                teFilter.extensionId = options.extensionId;
            }
            const teDocs = await db
                .collection("telemetry_events")
                .find(teFilter)
                .project({ _id: 1, id: 1, sessionNonce: 1, clientUserId: 1, extensionId: 1, extensionVersion: 1, action: 1, docIdHash: 1, docTitle: 1, pages: 1, downloadType: 1, elapsedSeconds: 1, estimatedMinSeconds: 1, ip: 1, country: 1, city: 1, browser: 1, anomalies: 1, riskScore: 1, severity: 1, meta: 1, createdAt: 1 })
                .sort({ createdAt: -1 })
                .limit(10000)
                .toArray();

            directEvents = teDocs.map((doc: any) => {
                const { _id, ...rest } = doc;
                return {
                    ...rest,
                    id: rest.id || String(_id),
                    createdAt: parseDateTimeToIso(rest.createdAt),
                } as TelemetryEvent;
            });
        } catch {
            // telemetry_events có thể chưa có index hoặc rỗng, không ảnh hưởng
        }

        // 3. Hợp nhất và loại trừ trùng lặp giữa directEvents và processedEvents
        const eventMap = new Map<string, TelemetryEvent>();

        // Cho processedEvents vào trước
        processedEvents.forEach((e) => {
            eventMap.set(e.id, e);
        });

        // Ưu tiên directEvents nếu cùng ID hoặc cùng sessionNonce
        directEvents.forEach((e) => {
            const key = e.id || e.sessionNonce || `${e.clientUserId}_${e.createdAt}`;
            eventMap.set(key, e);
        });

        const mergedEvents = Array.from(eventMap.values());
        mergedEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        cachedMongoEvents = mergedEvents;
        cachedMongoEventsKey = cacheKey;
        lastMongoEventsCache = now;
        return mergedEvents;
    } catch (err: any) {
        console.error("❌ [MongoDB Loader] Failed to fetch telemetry from MongoDB:", err.message);
        return cachedMongoEvents || [];
    }
}

/**
 * Tính toán thống kê toàn diện dựa hoàn toàn trên MongoDB
 */
export async function getRealMongoStats(
    options: StatsFilterOptions = {}
): Promise<DashboardStatsResult> {
    const [rawEvents, rawTransactions, rawUsers] = await Promise.all([
        fetchMongoTelemetry(options),
        fetchMongoTransactions(options),
        fetchMongoUsers(options),
    ]);

    const result = await computeDashboardStats(rawEvents, rawTransactions, rawUsers, options);
    return {
        ...result,
        source: "mongodb",
    };
}
