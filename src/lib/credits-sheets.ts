import { google, sheets_v4 } from "googleapis";
import { Redis } from "@upstash/redis";

// ============ Configuration ============
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
const SPREADSHEET_ID = process.env.CREDITS_SPREADSHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

const USERS_SHEET_NAME = "Credits_Users";
const TRANSACTIONS_SHEET_NAME = "Credits_Transactions";

// Initialize Upstash Redis for fast rate-limiting & concurrency lock if configured
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    } catch (e) {
        console.warn("[Credits] Redis initialization failed, fallback to memory:", e);
    }
}

// In-memory fallback if Redis is unavailable
const memoryIpRateLimit = new Map<string, number>();

let sheetsClient: sheets_v4.Sheets | null = null;

function getSheetsClient(): sheets_v4.Sheets | null {
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !SPREADSHEET_ID) {
        console.warn("[Credits] Missing Google Sheets configuration.");
        return null;
    }

    if (!sheetsClient) {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: GOOGLE_CLIENT_EMAIL,
                private_key: GOOGLE_PRIVATE_KEY,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        sheetsClient = google.sheets({ version: "v4", auth });
    }

    return sheetsClient;
}

const verifiedSheets = new Set<string>();

/**
 * Đảm bảo 2 sheet Credits_Users và Credits_Transactions tồn tại và có header chuẩn
 */
export async function ensureCreditsSheetsExist(): Promise<void> {
    const sheets = getSheetsClient();
    if (!sheets) return;

    if (verifiedSheets.has(USERS_SHEET_NAME) && verifiedSheets.has(TRANSACTIONS_SHEET_NAME)) {
        return;
    }

    try {
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID!,
            fields: "sheets.properties.title",
        });

        const existingSheets = spreadsheet.data.sheets?.map((s) => s.properties?.title) || [];

        // 1. Sheet Users
        if (!existingSheets.includes(USERS_SHEET_NAME)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID!,
                requestBody: {
                    requests: [{ addSheet: { properties: { title: USERS_SHEET_NAME } } }],
                },
            });
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID!,
                range: `${USERS_SHEET_NAME}!A1:F1`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [["User_ID", "Credits", "Total_Downloaded", "Created_IP", "Created_At", "Updated_At"]],
                },
            });
        }
        verifiedSheets.add(USERS_SHEET_NAME);

        // 2. Sheet Transactions
        if (!existingSheets.includes(TRANSACTIONS_SHEET_NAME)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID!,
                requestBody: {
                    requests: [{ addSheet: { properties: { title: TRANSACTIONS_SHEET_NAME } } }],
                },
            });
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID!,
                range: `${TRANSACTIONS_SHEET_NAME}!A1:G1`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [["Trans_ID", "User_ID", "Amount", "Credits_Added", "Bank_Code", "Content", "Created_At"]],
                },
            });
        }
        verifiedSheets.add(TRANSACTIONS_SHEET_NAME);
    } catch (error) {
        console.error("[Credits] Failed to ensure sheets exist:", error);
    }
}

/**
 * Format date sang giờ Việt Nam (+7)
 */
function getVnTimeString(date = new Date()): string {
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return vnDate.toISOString().replace("T", " ").substring(0, 19);
}

/**
 * Kiểm tra IP có được nhận bonus credit không (Chống farming tài khoản mới)
 * Tối đa 2 lần nhận bonus / IP / 24h
 */
async function canReceiveBonus(ip: string): Promise<boolean> {
    if (!ip || ip === "unknown" || ip === "127.0.0.1") return true;

    const key = `bonus_ip:${ip}`;
    if (redis) {
        try {
            const count = await redis.incr(key);
            if (count === 1) {
                await redis.expire(key, 86400); // 24 hours
            }
            return count <= 2;
        } catch (e) {
            console.warn("[Credits] Redis bonus check error:", e);
        }
    }

    // In-memory fallback
    const count = (memoryIpRateLimit.get(key) || 0) + 1;
    memoryIpRateLimit.set(key, count);
    return count <= 2;
}

/**
 * Lấy số dư credit của người dùng. Nếu user chưa tồn tại, tạo mới và tặng 2 credits (nếu IP hợp lệ)
 */
export async function getUserCredits(userId: string, clientIp: string = "unknown"): Promise<{
    userId: string;
    credits: number;
    totalDownloaded: number;
    isNew: boolean;
}> {
    const sheets = getSheetsClient();
    if (!sheets) {
        return { userId, credits: 0, totalDownloaded: 0, isNew: false };
    }

    await ensureCreditsSheetsExist();

    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID!,
            range: `${USERS_SHEET_NAME}!A:F`,
        });

        const rows = res.data.values || [];
        // Header: User_ID (0), Credits (1), Total_Downloaded (2), Created_IP (3), Created_At (4), Updated_At (5)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row[0] === userId) {
                return {
                    userId,
                    credits: parseInt(row[1] || "0", 10),
                    totalDownloaded: parseInt(row[2] || "0", 10),
                    isNew: false,
                };
            }
        }

        // Nếu user chưa tồn tại -> Tạo mới (Mặc định 0 credit, cần nạp hoặc chờ 10s)
        const initialCredits = 0;
        const now = getVnTimeString();

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID!,
            range: `${USERS_SHEET_NAME}!A:F`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[userId, initialCredits, 0, clientIp, now, now]],
            },
        });

        return {
            userId,
            credits: initialCredits,
            totalDownloaded: 0,
            isNew: true,
        };
    } catch (error) {
        console.error("[Credits] Failed to get user credits:", error);
        return { userId, credits: 0, totalDownloaded: 0, isNew: false };
    }
}

/**
 * Trừ 1 credit khi người dùng chọn Tải ngay tức thì
 */
export async function deductUserCredit(userId: string): Promise<{
    success: boolean;
    remainingCredits: number;
    error?: string;
}> {
    const sheets = getSheetsClient();
    if (!sheets) {
        return { success: false, remainingCredits: 0, error: "Hệ thống cơ sở dữ liệu tạm gián đoạn" };
    }

    await ensureCreditsSheetsExist();

    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID!,
            range: `${USERS_SHEET_NAME}!A:F`,
        });

        const rows = res.data.values || [];
        let rowIndex = -1;
        let currentCredits = 0;
        let totalDownloaded = 0;

        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === userId) {
                rowIndex = i + 1; // 1-based index cho Sheets
                currentCredits = parseInt(rows[i][1] || "0", 10);
                totalDownloaded = parseInt(rows[i][2] || "0", 10);
                break;
            }
        }

        if (rowIndex === -1) {
            return { success: false, remainingCredits: 0, error: "Tài khoản không tồn tại" };
        }

        if (currentCredits < 1) {
            return { success: false, remainingCredits: currentCredits, error: "Bạn đã hết lượt tải nhanh (0 credit)" };
        }

        const newCredits = currentCredits - 1;
        const newDownloaded = totalDownloaded + 1;
        const now = getVnTimeString();

        // Cập nhật lại cột Credits (B), Total_Downloaded (C), Updated_At (F)
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID!,
            range: `${USERS_SHEET_NAME}!B${rowIndex}:C${rowIndex}`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[newCredits, newDownloaded]],
            },
        });

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID!,
            range: `${USERS_SHEET_NAME}!F${rowIndex}`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[now]],
            },
        });

        return {
            success: true,
            remainingCredits: newCredits,
        };
    } catch (error) {
        console.error("[Credits] Failed to deduct credit:", error);
        return { success: false, remainingCredits: 0, error: "Lỗi hệ thống khi trừ credit" };
    }
}

/**
 * Quy đổi số tiền thành số credit tương ứng:
 * - 2.000đ  = 3 lượt
 * - 5.000đ  = 7 lượt
 * - 10.000đ = 25 lượt
 * - Lớn hơn: tỷ lệ ưu đãi
 */
export function calculateCreditsFromAmount(amount: number): number {
    if (amount >= 50000) return 150;
    if (amount >= 20000) return 55;
    if (amount >= 10000) return 25;
    if (amount >= 5000) return 7;
    if (amount >= 2000) return 3;
    if (amount >= 1000) return 1;
    return 0;
}

/**
 * Quy đổi tiền USD (Buy Me a Coffee / International) thành credits:
 * - $1 (1 coffee) = 30 credits
 * - $3 (3 coffees) = 100 credits
 * - $5 (5 coffees) = 200 credits
 */
export function calculateCreditsFromUsd(usd: number, coffees: number = 0): number {
    const count = coffees > 0 ? coffees : Math.round(usd);
    if (count >= 5 || usd >= 5) return 200;
    if (count >= 3 || usd >= 3) return 100;
    if (count >= 1 || usd >= 1) return 30;
    return 30;
}

/**
 * Xử lý webhook nạp tiền:
 * 1. Chống Replay attack (kiểm tra transId)
 * 2. Lưu vào Sheet Transactions
 * 3. Cộng credit vào Sheet Users
 */
export async function processPaymentWebhook(data: {
    transId: string;
    userId: string;
    amount: number;
    currency?: string;
    creditsOverride?: number;
    bankCode?: string;
    content: string;
}): Promise<{ success: boolean; creditsAdded: number; message: string }> {
    const sheets = getSheetsClient();
    if (!sheets) {
        return { success: false, creditsAdded: 0, message: "Google Sheets chưa được cấu hình" };
    }

    await ensureCreditsSheetsExist();

    try {
        // 1. Kiểm tra transId trong Transactions sheet để chống trùng lặp
        const transRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID!,
            range: `${TRANSACTIONS_SHEET_NAME}!A:A`,
        });

        const existingTransIds = (transRes.data.values || []).map((r) => r[0]);
        if (existingTransIds.includes(data.transId)) {
            return { success: false, creditsAdded: 0, message: "Giao dịch này đã được xử lý trước đó" };
        }

        let creditsToAdd = data.creditsOverride || 0;
        if (creditsToAdd <= 0) {
            if (data.currency === "USD") {
                creditsToAdd = calculateCreditsFromUsd(data.amount);
            } else {
                creditsToAdd = calculateCreditsFromAmount(data.amount);
            }
        }

        if (creditsToAdd <= 0) {
            return { success: false, creditsAdded: 0, message: `Số tiền (${data.amount}) không đủ để quy đổi credit` };
        }

        const now = getVnTimeString();

        // 2. Ghi vào Transactions Sheet
        // Headers: Trans_ID, User_ID, Amount, Credits_Added, Bank_Code, Content, Created_At
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID!,
            range: `${TRANSACTIONS_SHEET_NAME}!A:G`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[data.transId, data.userId, data.amount, creditsToAdd, data.bankCode || "BANK", data.content, now]],
            },
        });

        // 3. Cộng credit cho User trong Users Sheet
        const usersRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID!,
            range: `${USERS_SHEET_NAME}!A:F`,
        });

        const rows = usersRes.data.values || [];
        let userRowIndex = -1;
        let currentCredits = 0;

        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === data.userId) {
                userRowIndex = i + 1;
                currentCredits = parseInt(rows[i][1] || "0", 10);
                break;
            }
        }

        if (userRowIndex !== -1) {
            // Cập nhật user có sẵn
            const updatedCredits = currentCredits + creditsToAdd;
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID!,
                range: `${USERS_SHEET_NAME}!B${userRowIndex}`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [[updatedCredits]],
                },
            });
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID!,
                range: `${USERS_SHEET_NAME}!F${userRowIndex}`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [[now]],
                },
            });
        } else {
            // User chưa có trong sheet -> Tạo mới với số credit được nạp
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID!,
                range: `${USERS_SHEET_NAME}!A:F`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [[data.userId, creditsToAdd, 0, "via_payment", now, now]],
                },
            });
        }

        return {
            success: true,
            creditsAdded: creditsToAdd,
            message: `Cộng thành công ${creditsToAdd} credits cho ${data.userId}`,
        };
    } catch (error) {
        console.error("[Credits] Webhook processing failed:", error);
        return { success: false, creditsAdded: 0, message: "Lỗi hệ thống khi xử lý webhook" };
    }
}
