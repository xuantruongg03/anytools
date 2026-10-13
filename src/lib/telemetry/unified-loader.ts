import {
    getRealGoogleSheetsStats
} from "./google-sheets-loader";
import {
    getRealMongoStats
} from "./mongodb-loader";
import { StatsFilterOptions } from "./stats";
import {
    DashboardStatsResult,
    RawSheetUser
} from "./stats-calculator";
import { CreditTransaction, TelemetryEvent } from "./types";

/**
 * Hợp nhất và loại trùng danh sách người dùng từ Google Sheets và MongoDB:
 * - Khóa chính: userId (case-insensitive)
 * - Số dư credit: Ưu tiên dữ liệu từ MongoDB (hệ thống xử lý trừ/cộng credit thực tế) hoặc bản ghi có updatedAt mới hơn
 * - Tổng lượt tải: Lấy giá trị lớn nhất (Math.max)
 * - Thời gian tạo: Lấy mốc thời gian sớm nhất
 * - Thời gian cập nhật: Lấy mốc thời gian mới nhất
 */
export function mergeUsers(sheetUsers: RawSheetUser[], mongoUsers: RawSheetUser[]): RawSheetUser[] {
    const userMap = new Map<string, RawSheetUser>();

    // 1. Nạp users từ Google Sheets trước
    sheetUsers.forEach((u) => {
        const key = u.userId.trim().toUpperCase();
        userMap.set(key, { ...u });
    });

    // 2. Hợp nhất users từ MongoDB (MongoDB là Primary)
    mongoUsers.forEach((mu) => {
        const key = mu.userId.trim().toUpperCase();
        const existing = userMap.get(key);

        if (!existing) {
            userMap.set(key, { ...mu });
        } else {
            const isMongoUpdatedNewer =
                new Date(mu.updatedAt).getTime() >= new Date(existing.updatedAt).getTime();
            const earliestCreatedAt =
                new Date(mu.createdAt).getTime() <= new Date(existing.createdAt).getTime()
                    ? mu.createdAt
                    : existing.createdAt;
            const latestUpdatedAt = isMongoUpdatedNewer ? mu.updatedAt : existing.updatedAt;

            userMap.set(key, {
                userId: existing.userId || mu.userId,
                // Ưu tiên credit của MongoDB vì mọi giao dịch & trừ credit thời gian thực diễn ra tại Mongo
                credits: mu.credits !== undefined ? mu.credits : existing.credits,
                totalDownloaded: Math.max(existing.totalDownloaded, mu.totalDownloaded),
                createdIp: mu.createdIp && mu.createdIp !== "unknown" ? mu.createdIp : existing.createdIp,
                createdAt: earliestCreatedAt,
                updatedAt: latestUpdatedAt,
            });
        }
    });

    const result = Array.from(userMap.values());
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
}

/**
 * Hợp nhất và loại trùng giao dịch (Transactions):
 * - Khóa chính: id / transId (case-insensitive)
 * - Tránh cộng trùng doanh thu
 */
export function mergeTransactions(
    sheetTxs: CreditTransaction[],
    mongoTxs: CreditTransaction[]
): CreditTransaction[] {
    const txMap = new Map<string, CreditTransaction>();

    sheetTxs.forEach((tx) => {
        const key = tx.id.trim().toUpperCase();
        txMap.set(key, tx);
    });

    mongoTxs.forEach((mtx) => {
        const key = mtx.id.trim().toUpperCase();
        // Ghi đè bằng dữ liệu MongoDB nếu trùng ID
        txMap.set(key, mtx);
    });

    const result = Array.from(txMap.values());
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
}

/**
 * Hợp nhất và loại trùng sự kiện tải (Telemetry Events):
 * - Khóa chính: e.id (case-insensitive)
 * - Nếu không có id thì dùng tổ hợp (clientUserId + createdAt)
 */
export function mergeTelemetryEvents(
    sheetEvents: TelemetryEvent[],
    mongoEvents: TelemetryEvent[]
): TelemetryEvent[] {
    const eventMap = new Map<string, TelemetryEvent>();

    sheetEvents.forEach((e) => {
        const key = (e.id || `${e.clientUserId}_${e.createdAt}`).trim().toUpperCase();
        eventMap.set(key, e);
    });

    mongoEvents.forEach((me) => {
        const key = (me.id || `${me.clientUserId}_${me.createdAt}`).trim().toUpperCase();
        // Ưu tiên MongoDB vì có thể chứa telemetry chi tiết
        eventMap.set(key, me);
    });

    const result = Array.from(eventMap.values());
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
}

/**
 * Phương thức lấy dữ liệu thống kê hợp nhất cho Dashboard theo yêu cầu:
 * - Khi timeframe === "all" ("Toàn bộ"): Lấy data cả từ Google Sheets VÀ MongoDB, sau đó hợp nhất & loại trừ trùng lặp.
 * - Khi timeframe !== "all" ("1h", "24h", "7d", "30d"): CHỈ lấy data từ MongoDB, KHÔNG gọi Google Sheets (bảo vệ hạn ngạch API Sheet).
 * - Trường hợp MongoDB gặp sự cố kết nối, tự động fallback sang Google Sheets để đảm bảo Dashboard không sập.
 */
export async function getUnifiedDashboardStats(
    options: StatsFilterOptions = {}
): Promise<DashboardStatsResult> {
    // Toàn bộ dữ liệu lịch sử đã được migrate sang MongoDB.
    // Đọc trực tiếp từ MongoDB cho mọi khung thời gian (1h, 24h, 7d, 30d, all).
    // Không đọc từ Google Sheets để tối ưu hiệu năng và bảo vệ hạn mức API.
    try {
        console.log(`⚡ [Unified Stats] Fetching strictly from MongoDB for timeframe [${options.timeframe || "24h"}]...`);
        const mongoStats = await getRealMongoStats(options);
        return mongoStats;
    } catch (mongoErr: any) {
        console.warn(
            "⚠️ [Unified Stats] MongoDB fetch failed, activating emergency fallback to Google Sheets:",
            mongoErr.message
        );
        const fallback = await getRealGoogleSheetsStats(options);
        return {
            ...fallback,
            source: "google_sheets_fallback",
        };
    }
}
