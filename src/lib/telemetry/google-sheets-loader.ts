import { google, sheets_v4 } from "googleapis";
import {
    TelemetryEvent,
    CreditTransaction,
} from "./types";
import { StatsFilterOptions } from "./stats";
import { batchResolveIpLocations } from "@/lib/utils/geo-ip-service";
import {
    RawDownloadRecord,
    DashboardStatsResult,
    processRawDownloadsIntoTelemetryEvents,
    computeDashboardStats,
} from "./stats-calculator";

let sheetsClient: sheets_v4.Sheets | null = null;

function getSheets(): sheets_v4.Sheets | null {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!clientEmail || !privateKey) {
        return null;
    }
    if (!sheetsClient) {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });
        sheetsClient = google.sheets({ version: "v4", auth });
    }
    return sheetsClient;
}

// In-memory cache for Google Sheet data (TTL: 25 seconds)
let cachedEvents: TelemetryEvent[] | null = null;
let lastCacheTime = 0;
let cachedTransactions: CreditTransaction[] | null = null;
let lastTxCacheTime = 0;
let cachedUsers: RawSheetUser[] | null = null;
let lastUsersCacheTime = 0;
const CACHE_TTL_MS = 25000;

export interface RawSheetUser {
    userId: string;
    credits: number;
    totalDownloaded: number;
    createdIp: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * Chuẩn hóa giá trị từ cột C (Download_Type) trong sheet Credits_Downloads:
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
 * Format timestamp to Vietnam Time (UTC+7) bucket string.
 * Ensures consistent hourly (HH:00) and daily (DD/MM) grouping regardless of server runtime timezone.
 */
function formatVnBucket(dateIso: string, isHourly: boolean): string {
    const d = new Date(dateIso);
    if (isNaN(d.getTime())) return isHourly ? "00:00" : "01/01";
    const vn = new Date(d.getTime() + 7 * 3600 * 1000);
    if (isHourly) {
        return `${String(vn.getUTCHours()).padStart(2, "0")}:00`;
    }
    return `${String(vn.getUTCDate()).padStart(2, "0")}/${String(vn.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getVnHour(dateIso: string): number {
    const d = new Date(dateIso);
    if (isNaN(d.getTime())) return 0;
    const vn = new Date(d.getTime() + 7 * 3600 * 1000);
    return vn.getUTCHours();
}

/**
 * Fetch and parse real users directly from Google Sheets (Credits_Users)
 */
export async function fetchRealGoogleSheetsUsers(): Promise<RawSheetUser[]> {
    const now = Date.now();
    if (cachedUsers && now - lastUsersCacheTime < CACHE_TTL_MS) {
        return cachedUsers;
    }

    const sheets = getSheets();
    const spreadsheetId = process.env.CREDITS_SPREADSHEET_ID;

    if (!sheets || !spreadsheetId) {
        return [];
    }

    try {
        const usersRange = process.env.TELEMETRY_USERS_SHEET_RANGE || "Credits_Users!A:F";
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: usersRange,
        });

        const rows = response.data.values;
        if (!rows || rows.length <= 1) {
            cachedUsers = [];
            lastUsersCacheTime = now;
            return [];
        }

        // Header: [User_ID, Credits, Total_Downloaded, Created_IP, Created_At, Updated_At]
        const dataRows = rows.slice(1);
        const userMap = new Map<string, RawSheetUser>();

        dataRows.forEach((r, idx) => {
            const rawId = (r[0] || "").toString().trim();
            const userId = rawId || `USER_${idx}`;
            const credits = parseInt(r[1] || "0", 10) || 0;
            const totalDownloaded = parseInt(r[2] || "0", 10) || 0;
            const createdIp = (r[3] || "unknown").toString().trim();
            const createdAtRaw = (r[4] || "").toString().trim();
            const updatedAtRaw = (r[5] || "").toString().trim();

            let createdAt = new Date(now - idx * 120000).toISOString();
            if (createdAtRaw) {
                const parsed = new Date(createdAtRaw.replace(" ", "T") + "+07:00");
                if (!isNaN(parsed.getTime())) {
                    createdAt = parsed.toISOString();
                }
            }

            let updatedAt = createdAt;
            if (updatedAtRaw) {
                const parsed = new Date(updatedAtRaw.replace(" ", "T") + "+07:00");
                if (!isNaN(parsed.getTime())) {
                    updatedAt = parsed.toISOString();
                }
            }

            const existing = userMap.get(userId);
            if (existing) {
                // If duplicate row exists, keep latest update and merge metrics
                const isNewer = new Date(updatedAt).getTime() >= new Date(existing.updatedAt).getTime();
                userMap.set(userId, {
                    userId,
                    credits: isNewer ? credits : Math.max(existing.credits, credits),
                    totalDownloaded: Math.max(existing.totalDownloaded, totalDownloaded),
                    createdIp: existing.createdIp !== "unknown" ? existing.createdIp : createdIp,
                    createdAt: new Date(existing.createdAt).getTime() <= new Date(createdAt).getTime() ? existing.createdAt : createdAt,
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
        cachedUsers = users;
        lastUsersCacheTime = now;
        return users;
    } catch (err: any) {
        console.error("❌ [Telemetry Engine] Users stream read failed:", err.message);
        return cachedUsers || [];
    }
}

/**
 * Fetch and parse real credit purchase transactions directly from Google Sheets (Credits_Transactions)
 */
export async function fetchRealGoogleSheetsTransactions(): Promise<CreditTransaction[]> {
    const now = Date.now();
    if (cachedTransactions && now - lastTxCacheTime < CACHE_TTL_MS) {
        return cachedTransactions;
    }

    const sheets = getSheets();
    const spreadsheetId = process.env.CREDITS_SPREADSHEET_ID;

    if (!sheets || !spreadsheetId) {
        return [];
    }

    try {
        const txRange =
            process.env.TELEMETRY_TRANSACTIONS_SHEET_RANGE || "Credits_Transactions!A:G";

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: txRange,
        });

        const rows = response.data.values;
        if (!rows || rows.length <= 1) {
            cachedTransactions = [];
            lastTxCacheTime = now;
            return [];
        }

        // Row format: [Trans_ID, User_ID, Amount, Credits_Added, Bank_Code, Content, Created_At]
        const dataRows = rows.slice(1);

        const transactions: CreditTransaction[] = dataRows.map((r, idx) => {
            const id = (r[0] || `TXN_${idx}`).toString().trim();
            const userId = (r[1] || "ANONYMOUS").toString().trim();
            const rawAmount = (r[2] || "0").toString().trim();
            const numericAmount = parseFloat(rawAmount.replace(/[^0-9.-]+/g, "")) || 0;
            const creditsAdded = parseInt(r[3] || "0", 10) || 0;
            const bankCode = (r[4] || "NGAN_HANG").toString().trim().toUpperCase();
            const content = (r[5] || "").toString().trim();
            const dateStr = (r[6] || "").toString().trim();

            let timestamp = now - idx * 60000;
            if (dateStr) {
                const parsed = new Date(dateStr.replace(" ", "T") + "+07:00").getTime();
                if (!isNaN(parsed)) {
                    timestamp = parsed;
                }
            }

            return {
                id,
                userId,
                amount: numericAmount,
                rawAmount,
                creditsAdded,
                bankCode,
                content,
                createdAt: new Date(timestamp).toISOString(),
            };
        });

        // Sort newest first
        transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        cachedTransactions = transactions;
        lastTxCacheTime = now;
        return transactions;
    } catch (err: any) {
        console.error("❌ [Telemetry Engine] Transaction stream read failed:", err.message);
        return cachedTransactions || [];
    }
}

/**
 * Fetch and parse real download records directly from Google Sheets (Credits_Downloads)
 */
export async function fetchRealGoogleSheetsTelemetry(): Promise<TelemetryEvent[]> {
    const now = Date.now();
    if (cachedEvents && now - lastCacheTime < CACHE_TTL_MS) {
        return cachedEvents;
    }

    const sheets = getSheets();
    const spreadsheetId = process.env.CREDITS_SPREADSHEET_ID;

    if (!sheets || !spreadsheetId) {
        console.warn("⚠️ [Google Sheets Loader] Missing CREDITS_SPREADSHEET_ID or credentials.");
        return [];
    }

    try {
        const range =
            process.env.TELEMETRY_SHEET_RANGE ||
            process.env.CREDITS_SHEET_RANGE ||
            "Credits_Downloads!A:H";
        if (!range) {
            console.warn("⚠️ [Telemetry Engine] Missing secure range configuration in environment.");
            return [];
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });

        const rows = response.data.values;
        if (!rows || rows.length <= 1) {
            return [];
        }

        // Row format: [Log_ID, User_ID, Download_Type, Document_URL, Document_Title, Pages, Client_IP, Created_At]
        const dataRows = rows.slice(1);

        const rawRecords: RawDownloadRecord[] = dataRows.map((r, idx) => ({
            logId: (r[0] || `DL_${idx}`).toString().trim(),
            userId: (r[1] || `ANON_${idx}`).toString().trim(),
            downloadType: (r[2] || "free").toString().trim(),
            documentUrl: (r[3] || "").toString().trim(),
            documentTitle: (r[4] || "Resource Document").toString().trim(),
            totalPages: Math.max(1, parseInt(r[5] || "1", 10) || 1),
            clientIp: (r[6] || "unknown").toString().trim(),
            createdAt: (r[7] || "").toString().trim(),
        }));

        const events = await processRawDownloadsIntoTelemetryEvents(rawRecords);
        cachedEvents = events;
        lastCacheTime = now;
        return events;
    } catch (err: any) {
        console.error("❌ [Telemetry Engine] Secure stream read failed:", err.message);
        return cachedEvents || [];
    }
}

/**
 * Compute full statistics from Real Google Sheets telemetry, transactions, and users
 */
export async function getRealGoogleSheetsStats(options: StatsFilterOptions = {}): Promise<DashboardStatsResult> {
    const [rawEvents, rawTransactions, rawUsers] = await Promise.all([
        fetchRealGoogleSheetsTelemetry(),
        fetchRealGoogleSheetsTransactions(),
        fetchRealGoogleSheetsUsers(),
    ]);

    const result = await computeDashboardStats(rawEvents, rawTransactions, rawUsers, options);
    return {
        ...result,
        source: "google_sheets",
    };
}

