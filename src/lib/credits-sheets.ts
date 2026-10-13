import { google, sheets_v4 } from "googleapis";
import { getDb } from "@/lib/db/mongodb";

// ============ Configuration ============
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
const SPREADSHEET_ID = process.env.CREDITS_SPREADSHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

const USERS_SHEET_NAME = "Credits_Users";
const TRANSACTIONS_SHEET_NAME = "Credits_Transactions";
const DOWNLOADS_SHEET_NAME = "Credits_Downloads";

// In-process mutex for deduplication / serialization
const deductionMutex = new Map<string, Promise<void>>();

function acquireUserMutex(userId: string): Promise<() => void> {
    let resolvePrev!: () => void;
    const prev = deductionMutex.get(userId) ?? Promise.resolve();
    const next = prev.then(() => new Promise<void>((resolve) => { resolvePrev = resolve; }));
    deductionMutex.set(userId, next);
    return prev.then(() => resolvePrev);
}

let sheetsClient: sheets_v4.Sheets | null = null;

function getSheetsClient(): sheets_v4.Sheets | null {
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !SPREADSHEET_ID) {
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
let mongoIndexesEnsured = false;

async function ensureMongoCreditsIndexes() {
    if (mongoIndexesEnsured) return;
    try {
        const db = await getDb();
        if (db) {
            await Promise.all([
                db.collection("credits_users").createIndex({ userId: 1 }, { unique: true }).catch(() => {}),
                db.collection("credits_transactions").createIndex({ transId: 1 }, { unique: true }).catch(() => {}),
                db.collection("credits_transactions").createIndex({ userId: 1 }).catch(() => {}),
                db.collection("credits_downloads").createIndex({ logId: 1 }, { unique: true }).catch(() => {}),
                db.collection("credits_downloads").createIndex({ userId: 1 }).catch(() => {}),
            ]);
            mongoIndexesEnsured = true;
        }
    } catch (_) {}
}

/**
 * Đảm bảo 3 sheet Credits_Users, Credits_Transactions và Credits_Downloads tồn tại và có header chuẩn
 */
export async function ensureCreditsSheetsExist(): Promise<void> {
    const sheets = getSheetsClient();
    if (!sheets || !SPREADSHEET_ID) return;

    if (
        verifiedSheets.has(USERS_SHEET_NAME) &&
        verifiedSheets.has(TRANSACTIONS_SHEET_NAME) &&
        verifiedSheets.has(DOWNLOADS_SHEET_NAME)
    ) {
        return;
    }

    try {
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
            fields: "sheets.properties.title",
        });

        const existingSheets = spreadsheet.data.sheets?.map((s) => s.properties?.title) || [];

        // 1. Sheet Users
        if (!existingSheets.includes(USERS_SHEET_NAME)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{ addSheet: { properties: { title: USERS_SHEET_NAME } } }],
                },
            });
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
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
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{ addSheet: { properties: { title: TRANSACTIONS_SHEET_NAME } } }],
                },
            });
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${TRANSACTIONS_SHEET_NAME}!A1:G1`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [["Trans_ID", "User_ID", "Amount", "Credits_Added", "Bank_Code", "Content", "Created_At"]],
                },
            });
        }
        verifiedSheets.add(TRANSACTIONS_SHEET_NAME);

        // 3. Sheet Downloads Log
        if (!existingSheets.includes(DOWNLOADS_SHEET_NAME)) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID,
                requestBody: {
                    requests: [{ addSheet: { properties: { title: DOWNLOADS_SHEET_NAME } } }],
                },
            });
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${DOWNLOADS_SHEET_NAME}!A1:H1`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [["Log_ID", "User_ID", "Download_Type", "Document_URL", "Document_Title", "Pages", "Client_IP", "Created_At"]],
                },
            });
        }
        verifiedSheets.add(DOWNLOADS_SHEET_NAME);
    } catch (error) {
        console.warn("[Credits Sheets] Failed to ensure sheets exist:", (error as Error).message);
    }
}

/**
 * Format date sang giờ Việt Nam (+7)
 */
export function getVnTimeString(date = new Date()): string {
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return vnDate.toISOString().replace("T", " ").substring(0, 19);
}

// =========================================================================
// ASYNC GOOGLE SHEETS BACKUP HELPERS (Non-blocking Background Tasks)
// =========================================================================

async function asyncBackupUserToSheets(userId: string, credits: number, totalDownloaded: number, createdIp: string, now: string) {
    try {
        const sheets = getSheetsClient();
        if (!sheets || !SPREADSHEET_ID) return;
        await ensureCreditsSheetsExist();
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${USERS_SHEET_NAME}!A:F`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[userId, credits, totalDownloaded, createdIp, now, now]],
            },
        });
    } catch (err) {
        console.warn("⚠️ [Sheets Backup] User append skipped:", (err as Error).message);
    }
}

async function asyncBackupDeductionToSheets(userId: string, newCredits: number, newDownloaded: number, now: string) {
    try {
        const sheets = getSheetsClient();
        if (!sheets || !SPREADSHEET_ID) return;
        await ensureCreditsSheetsExist();
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${USERS_SHEET_NAME}!A:A`,
        });
        const rows = res.data.values || [];
        let rowIndex = -1;
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0]?.toString().trim().toUpperCase() === userId.trim().toUpperCase()) {
                rowIndex = i + 1;
                break;
            }
        }
        if (rowIndex !== -1) {
            await Promise.all([
                sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${USERS_SHEET_NAME}!B${rowIndex}:C${rowIndex}`,
                    valueInputOption: "USER_ENTERED",
                    requestBody: { values: [[newCredits, newDownloaded]] },
                }),
                sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${USERS_SHEET_NAME}!F${rowIndex}`,
                    valueInputOption: "USER_ENTERED",
                    requestBody: { values: [[now]] },
                }),
            ]);
        }
    } catch (err) {
        console.warn("⚠️ [Sheets Backup] Deduction sync skipped:", (err as Error).message);
    }
}

async function asyncBackupTransactionToSheets(trans: {
    transId: string;
    userId: string;
    amount: number;
    creditsAdded: number;
    bankCode?: string;
    content: string;
}, now: string) {
    try {
        const sheets = getSheetsClient();
        if (!sheets || !SPREADSHEET_ID) return;
        await ensureCreditsSheetsExist();
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${TRANSACTIONS_SHEET_NAME}!A:G`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[trans.transId, trans.userId, trans.amount, trans.creditsAdded, trans.bankCode || "BANK", trans.content, now]],
            },
        });
    } catch (err) {
        console.warn("⚠️ [Sheets Backup] Transaction sync skipped:", (err as Error).message);
    }
}

async function asyncBackupDownloadToSheets(log: {
    logId: string;
    userId: string;
    downloadType: string;
    documentUrl?: string;
    documentTitle?: string;
    totalPages?: number;
    clientIp?: string;
}, now: string) {
    try {
        const sheets = getSheetsClient();
        if (!sheets || !SPREADSHEET_ID) return;
        await ensureCreditsSheetsExist();
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${DOWNLOADS_SHEET_NAME}!A:H`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[
                    log.logId,
                    log.userId,
                    log.downloadType,
                    log.documentUrl || "",
                    log.documentTitle || "",
                    log.totalPages || 0,
                    log.clientIp || "unknown",
                    now,
                ]],
            },
        });
    } catch (err) {
        console.warn("⚠️ [Sheets Backup] Download log sync skipped:", (err as Error).message);
    }
}

// =========================================================================
// 1. GET USER CREDITS (MongoDB Primary -> Google Sheets Backup)
// =========================================================================

export async function getUserCredits(userId: string, clientIp: string = "unknown"): Promise<{
    userId: string;
    credits: number;
    totalDownloaded: number;
    isNew: boolean;
}> {
    const cleanId = userId.trim();
    const now = getVnTimeString();

    // 1. Thử lấy từ MongoDB (Chính - siêu tốc ~2ms)
    try {
        const db = await getDb();
        if (db) {
            await ensureMongoCreditsIndexes();
            const user = await db.collection("credits_users").findOne({ userId: cleanId });
            if (user) {
                return {
                    userId: cleanId,
                    credits: typeof user.credits === "number" ? user.credits : 0,
                    totalDownloaded: typeof user.totalDownloaded === "number" ? user.totalDownloaded : 0,
                    isNew: false,
                };
            }

            // User mới: kiểm tra số lượng tài khoản cùng IP
            let ipCount = 0;
            if (clientIp && clientIp !== "unknown") {
                ipCount = await db.collection("credits_users").countDocuments({ createdIp: clientIp });
            }

            const initialCredits = ipCount < 2 ? 3 : 0;
            const newUserDoc = {
                userId: cleanId,
                credits: initialCredits,
                totalDownloaded: 0,
                createdIp: clientIp,
                createdAt: now,
                updatedAt: now,
            };

            await db.collection("credits_users").insertOne(newUserDoc);

            // Backup ngầm sang Google Sheets
            asyncBackupUserToSheets(cleanId, initialCredits, 0, clientIp, now);

            return {
                userId: cleanId,
                credits: initialCredits,
                totalDownloaded: 0,
                isNew: true,
            };
        }
    } catch (mongoErr) {
        console.warn("⚠️ [Credits Mongo] getUserCredits fallback to Sheets:", (mongoErr as Error).message);
    }

    // 2. Fallback Google Sheets nếu MongoDB chưa kết nối
    const sheets = getSheetsClient();
    if (!sheets || !SPREADSHEET_ID) {
        return { userId: cleanId, credits: 0, totalDownloaded: 0, isNew: false };
    }

    await ensureCreditsSheetsExist();

    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${USERS_SHEET_NAME}!A:F`,
        });

        const rows = res.data.values || [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row[0]?.toString().trim().toUpperCase() === cleanId.toUpperCase()) {
                return {
                    userId: cleanId,
                    credits: parseInt(row[1] || "0", 10),
                    totalDownloaded: parseInt(row[2] || "0", 10),
                    isNew: false,
                };
            }
        }

        let ipCount = 0;
        if (clientIp && clientIp !== "unknown") {
            for (let i = 1; i < rows.length; i++) {
                if (rows[i][3] === clientIp) ipCount++;
            }
        }

        const initialCredits = ipCount < 2 ? 3 : 0;
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${USERS_SHEET_NAME}!A:F`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[cleanId, initialCredits, 0, clientIp, now, now]],
            },
        });

        return {
            userId: cleanId,
            credits: initialCredits,
            totalDownloaded: 0,
            isNew: true,
        };
    } catch (error) {
        console.error("[Credits Sheets] Failed to get user credits:", error);
        return { userId: cleanId, credits: 0, totalDownloaded: 0, isNew: false };
    }
}

// =========================================================================
// 2. DEDUCT USER CREDIT (MongoDB Primary -> Google Sheets Backup)
// =========================================================================

export async function deductUserCredit(userId: string): Promise<{
    success: boolean;
    remainingCredits: number;
    error?: string;
}> {
    const cleanId = userId.trim();
    const now = getVnTimeString();

    // 1. Thao tác chính trên MongoDB (Atomic ACID Concurrency)
    try {
        const db = await getDb();
        if (db) {
            await ensureMongoCreditsIndexes();
            const updateRes = await db.collection("credits_users").findOneAndUpdate(
                { userId: cleanId, credits: { $gte: 1 } },
                {
                    $inc: { credits: -1, totalDownloaded: 1 },
                    $set: { updatedAt: now },
                },
                { returnDocument: "after" }
            );

            if (updateRes) {
                const remaining = (updateRes as any).credits ?? 0;
                const downloaded = (updateRes as any).totalDownloaded ?? 1;

                // Backup ngầm sang Google Sheet (không làm chậm người dùng)
                asyncBackupDeductionToSheets(cleanId, remaining, downloaded, now);

                return { success: true, remainingCredits: remaining };
            }

            // Kiểm tra user có tồn tại hay do hết credit
            const existingUser = await db.collection("credits_users").findOne({ userId: cleanId });
            if (!existingUser) {
                return { success: false, remainingCredits: 0, error: "Tài khoản không tồn tại" };
            }
            return {
                success: false,
                remainingCredits: existingUser.credits || 0,
                error: "Bạn đã hết lượt tải nhanh (0 credit)",
            };
        }
    } catch (mongoErr) {
        console.warn("⚠️ [Credits Mongo] deductUserCredit fallback to Sheets:", (mongoErr as Error).message);
    }

    // 2. Fallback Google Sheets
    const sheets = getSheetsClient();
    if (!sheets || !SPREADSHEET_ID) {
        return { success: false, remainingCredits: 0, error: "Hệ thống cơ sở dữ liệu tạm gián đoạn" };
    }

    await ensureCreditsSheetsExist();
    const releaseUserMutex = await acquireUserMutex(cleanId);

    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${USERS_SHEET_NAME}!A:F`,
        });

        const rows = res.data.values || [];
        let rowIndex = -1;
        let currentCredits = 0;
        let totalDownloaded = 0;

        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0]?.toString().trim().toUpperCase() === cleanId.toUpperCase()) {
                rowIndex = i + 1;
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

        await Promise.all([
            sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${USERS_SHEET_NAME}!B${rowIndex}:C${rowIndex}`,
                valueInputOption: "USER_ENTERED",
                requestBody: { values: [[newCredits, newDownloaded]] },
            }),
            sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${USERS_SHEET_NAME}!F${rowIndex}`,
                valueInputOption: "USER_ENTERED",
                requestBody: { values: [[now]] },
            }),
        ]);

        return { success: true, remainingCredits: newCredits };
    } catch (error) {
        console.error("[Credits Sheets] Failed to deduct credit:", error);
        return { success: false, remainingCredits: 0, error: "Lỗi hệ thống khi trừ credit" };
    } finally {
        releaseUserMutex();
    }
}

export function calculateCreditsFromAmount(amount: number): number {
    if (amount >= 200000) return 800;
    if (amount >= 100000) return 350;
    if (amount >= 50000) return 150;
    if (amount >= 20000) return 55;
    if (amount >= 10000) return 25;
    if (amount >= 5000) return 7;
    if (amount >= 2000) return 3;
    if (amount >= 1000) return 1;
    return 0;
}

export function calculateCreditsFromUsd(usd: number, coffees: number = 0): number {
    const count = coffees > 0 ? coffees : Math.round(usd);
    if (count >= 10 || usd >= 10) return 900;
    if (count >= 5 || usd >= 5) return 400;
    if (count >= 3 || usd >= 3) return 200;
    if (count >= 1 || usd >= 1) return 60;
    return 60;
}

// =========================================================================
// 3. PROCESS PAYMENT WEBHOOK (MongoDB Primary -> Google Sheets Backup)
// =========================================================================

export async function processPaymentWebhook(data: {
    transId: string;
    userId: string;
    amount: number;
    currency?: string;
    coffees?: number;
    creditsOverride?: number;
    bankCode?: string;
    content: string;
}): Promise<{ success: boolean; creditsAdded: number; message: string }> {
    const cleanId = data.userId.trim();
    const now = getVnTimeString();

    let creditsToAdd = data.creditsOverride || 0;
    if (creditsToAdd <= 0) {
        if (data.currency === "USD") {
            creditsToAdd = calculateCreditsFromUsd(data.amount, data.coffees);
        } else {
            creditsToAdd = calculateCreditsFromAmount(data.amount);
        }
    }

    if (creditsToAdd <= 0) {
        return { success: false, creditsAdded: 0, message: `Số tiền (${data.amount}) không đủ để quy đổi credit` };
    }

    // 1. Thao tác chính trên MongoDB
    try {
        const db = await getDb();
        if (db) {
            await ensureMongoCreditsIndexes();

            // Chống trùng lặp transId
            const existingTrans = await db.collection("credits_transactions").findOne({ transId: data.transId });
            if (existingTrans) {
                return { success: false, creditsAdded: 0, message: "Giao dịch này đã được xử lý trước đó" };
            }

            // Ghi transaction
            await db.collection("credits_transactions").insertOne({
                transId: data.transId,
                userId: cleanId,
                amount: data.amount,
                creditsAdded: creditsToAdd,
                bankCode: data.bankCode || "BANK",
                content: data.content,
                createdAt: now,
            });

            // Cộng dồn credits cho user
            await db.collection("credits_users").updateOne(
                { userId: cleanId },
                {
                    $inc: { credits: creditsToAdd },
                    $set: { updatedAt: now },
                    $setOnInsert: {
                        totalDownloaded: 0,
                        createdIp: "via_payment",
                        createdAt: now,
                    },
                },
                { upsert: true }
            );

            // Backup ngầm sang Google Sheets
            asyncBackupTransactionToSheets({ ...data, creditsAdded: creditsToAdd }, now);
            // Cập nhật ngầm sheet Users
            (async () => {
                const user = await db.collection("credits_users").findOne({ userId: cleanId });
                if (user) {
                    asyncBackupDeductionToSheets(cleanId, user.credits, user.totalDownloaded || 0, now);
                }
            })().catch(() => {});

            return {
                success: true,
                creditsAdded: creditsToAdd,
                message: `Cộng thành công ${creditsToAdd} credits cho ${cleanId}`,
            };
        }
    } catch (mongoErr) {
        console.warn("⚠️ [Payment Mongo] processPaymentWebhook fallback to Sheets:", (mongoErr as Error).message);
    }

    // 2. Fallback Google Sheets
    const sheets = getSheetsClient();
    if (!sheets || !SPREADSHEET_ID) {
        return { success: false, creditsAdded: 0, message: "Hệ thống cơ sở dữ liệu tạm gián đoạn" };
    }

    await ensureCreditsSheetsExist();

    try {
        const transRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${TRANSACTIONS_SHEET_NAME}!A:A`,
        });

        const existingTransIds = (transRes.data.values || []).map((r) => r[0]);
        if (existingTransIds.includes(data.transId)) {
            return { success: false, creditsAdded: 0, message: "Giao dịch này đã được xử lý trước đó" };
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${TRANSACTIONS_SHEET_NAME}!A:G`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[data.transId, cleanId, data.amount, creditsToAdd, data.bankCode || "BANK", data.content, now]],
            },
        });

        const usersRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${USERS_SHEET_NAME}!A:F`,
        });

        const rows = usersRes.data.values || [];
        let userRowIndex = -1;
        let currentCredits = 0;

        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0]?.toString().trim().toUpperCase() === cleanId.toUpperCase()) {
                userRowIndex = i + 1;
                currentCredits = parseInt(rows[i][1] || "0", 10);
                break;
            }
        }

        if (userRowIndex !== -1) {
            const updatedCredits = currentCredits + creditsToAdd;
            await Promise.all([
                sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${USERS_SHEET_NAME}!B${userRowIndex}`,
                    valueInputOption: "USER_ENTERED",
                    requestBody: { values: [[updatedCredits]] },
                }),
                sheets.spreadsheets.values.update({
                    spreadsheetId: SPREADSHEET_ID,
                    range: `${USERS_SHEET_NAME}!F${userRowIndex}`,
                    valueInputOption: "USER_ENTERED",
                    requestBody: { values: [[now]] },
                }),
            ]);
        } else {
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: `${USERS_SHEET_NAME}!A:F`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [[cleanId, creditsToAdd, 0, "via_payment", now, now]],
                },
            });
        }

        return {
            success: true,
            creditsAdded: creditsToAdd,
            message: `Cộng thành công ${creditsToAdd} credits cho ${cleanId}`,
        };
    } catch (error) {
        console.error("[Credits Sheets] Webhook processing failed:", error);
        return { success: false, creditsAdded: 0, message: "Lỗi hệ thống khi xử lý webhook" };
    }
}

// =========================================================================
// 4. RECORD DOWNLOAD EVENT (MongoDB Primary -> Google Sheets Backup)
// =========================================================================

export async function recordDownloadEvent(data: {
    userId: string;
    downloadType: "free" | "instant";
    documentUrl?: string;
    documentTitle?: string;
    totalPages?: number;
    clientIp?: string;
}): Promise<{
    success: boolean;
    totalDownloaded?: number;
    error?: string;
}> {
    const cleanId = data.userId.trim();
    const now = getVnTimeString();
    const logId = `DL_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 1. Thao tác chính trên MongoDB
    try {
        const db = await getDb();
        if (db) {
            await ensureMongoCreditsIndexes();

            await db.collection("credits_downloads").insertOne({
                logId,
                userId: cleanId,
                downloadType: data.downloadType,
                documentUrl: data.documentUrl || "",
                documentTitle: data.documentTitle || "",
                totalPages: data.totalPages || 0,
                clientIp: data.clientIp || "unknown",
                createdAt: now,
            });

            let newTotalDownloaded = 0;
            if (data.downloadType === "free") {
                const updatedUser = await db.collection("credits_users").findOneAndUpdate(
                    { userId: cleanId },
                    {
                        $inc: { totalDownloaded: 1 },
                        $set: { updatedAt: now },
                        $setOnInsert: { credits: 0, createdIp: data.clientIp || "unknown", createdAt: now },
                    },
                    { upsert: true, returnDocument: "after" }
                );
                newTotalDownloaded = (updatedUser as any)?.totalDownloaded || 1;
            } else {
                const u = await db.collection("credits_users").findOne({ userId: cleanId });
                newTotalDownloaded = u?.totalDownloaded || 0;
            }

            // Backup ngầm sang Google Sheets
            asyncBackupDownloadToSheets({ ...data, logId }, now);

            return { success: true, totalDownloaded: newTotalDownloaded };
        }
    } catch (mongoErr) {
        console.warn("⚠️ [Record Download Mongo] Fallback to Sheets:", (mongoErr as Error).message);
    }

    // 2. Fallback Google Sheets
    const sheets = getSheetsClient();
    if (!sheets || !SPREADSHEET_ID) {
        return { success: false, error: "Google Sheets chưa được cấu hình" };
    }

    await ensureCreditsSheetsExist();

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${DOWNLOADS_SHEET_NAME}!A:H`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[
                    logId,
                    cleanId,
                    data.downloadType,
                    data.documentUrl || "",
                    data.documentTitle || "",
                    data.totalPages || 0,
                    data.clientIp || "unknown",
                    now,
                ]],
            },
        });

        const usersRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${USERS_SHEET_NAME}!A:F`,
        });

        const rows = usersRes.data.values || [];
        let rowIndex = -1;
        let totalDownloaded = 0;

        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0]?.toString().trim().toUpperCase() === cleanId.toUpperCase()) {
                rowIndex = i + 1;
                totalDownloaded = parseInt(rows[i][2] || "0", 10);
                break;
            }
        }

        if (rowIndex !== -1) {
            if (data.downloadType === "free") {
                const newDownloaded = totalDownloaded + 1;
                await Promise.all([
                    sheets.spreadsheets.values.update({
                        spreadsheetId: SPREADSHEET_ID,
                        range: `${USERS_SHEET_NAME}!C${rowIndex}`,
                        valueInputOption: "USER_ENTERED",
                        requestBody: { values: [[newDownloaded]] },
                    }),
                    sheets.spreadsheets.values.update({
                        spreadsheetId: SPREADSHEET_ID,
                        range: `${USERS_SHEET_NAME}!F${rowIndex}`,
                        valueInputOption: "USER_ENTERED",
                        requestBody: { values: [[now]] },
                    }),
                ]);
                return { success: true, totalDownloaded: newDownloaded };
            }
            return { success: true, totalDownloaded };
        } else {
            const newDownloaded = 1;
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: `${USERS_SHEET_NAME}!A:F`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: [[cleanId, 0, newDownloaded, data.clientIp || "unknown", now, now]],
                },
            });
            return { success: true, totalDownloaded: newDownloaded };
        }
    } catch (error: any) {
        console.error("[Credits Sheets] Failed to record download event:", error);
        return { success: false, error: error.message || "Lỗi hệ thống khi ghi nhận lượt tải" };
    }
}

// =========================================================================
// 5. MIGRATION: ĐỒNG BỘ TOÀN BỘ DATA TỪ GOOGLE SHEETS SANG MONGODB
// =========================================================================

export async function migrateAllSheetsDataToMongo(): Promise<{
    success: boolean;
    migratedUsers: number;
    migratedTransactions: number;
    migratedDownloads: number;
    message: string;
}> {
    const db = await getDb();
    if (!db) {
        throw new Error("Không thể kết nối MongoDB để thực hiện migration.");
    }

    const sheets = getSheetsClient();
    if (!sheets || !SPREADSHEET_ID) {
        throw new Error("Google Sheets chưa được cấu hình hoặc thiếu SPREADSHEET_ID.");
    }

    await ensureMongoCreditsIndexes();

    let migratedUsers = 0;
    let migratedTransactions = 0;
    let migratedDownloads = 0;

    // 1. Migrate Credits_Users
    try {
        const usersRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${USERS_SHEET_NAME}!A:F`,
        });
        const userRows = (usersRes.data.values || []).slice(1); // Bỏ qua header
        if (userRows.length > 0) {
            const userOps = userRows
                .filter((r) => r[0] && r[0].toString().trim().length > 0)
                .map((r) => ({
                    updateOne: {
                        filter: { userId: r[0].toString().trim() },
                        update: {
                            $set: {
                                userId: r[0].toString().trim(),
                                credits: parseInt(r[1] || "0", 10) || 0,
                                totalDownloaded: parseInt(r[2] || "0", 10) || 0,
                                createdIp: (r[3] || "unknown").toString().trim(),
                                createdAt: (r[4] || getVnTimeString()).toString().trim(),
                                updatedAt: (r[5] || getVnTimeString()).toString().trim(),
                            },
                        },
                        upsert: true,
                    },
                }));

            if (userOps.length > 0) {
                const res = await db.collection("credits_users").bulkWrite(userOps, { ordered: false });
                migratedUsers = (res.upsertedCount || 0) + (res.modifiedCount || 0);
            }
        }
    } catch (uErr) {
        console.warn("⚠️ [Migration Users] Warning:", (uErr as Error).message);
    }

    // 2. Migrate Credits_Transactions
    try {
        const transRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${TRANSACTIONS_SHEET_NAME}!A:G`,
        });
        const transRows = (transRes.data.values || []).slice(1);
        if (transRows.length > 0) {
            const transOps = transRows
                .filter((r) => r[0] && r[0].toString().trim().length > 0)
                .map((r) => ({
                    updateOne: {
                        filter: { transId: r[0].toString().trim() },
                        update: {
                            $set: {
                                transId: r[0].toString().trim(),
                                userId: (r[1] || "").toString().trim(),
                                amount: parseInt(r[2] || "0", 10) || 0,
                                creditsAdded: parseInt(r[3] || "0", 10) || 0,
                                bankCode: (r[4] || "BANK").toString().trim(),
                                content: (r[5] || "").toString().trim(),
                                createdAt: (r[6] || getVnTimeString()).toString().trim(),
                            },
                        },
                        upsert: true,
                    },
                }));

            if (transOps.length > 0) {
                const res = await db.collection("credits_transactions").bulkWrite(transOps, { ordered: false });
                migratedTransactions = (res.upsertedCount || 0) + (res.modifiedCount || 0);
            }
        }
    } catch (tErr) {
        console.warn("⚠️ [Migration Transactions] Warning:", (tErr as Error).message);
    }

    // 3. Migrate Credits_Downloads
    try {
        const dlRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${DOWNLOADS_SHEET_NAME}!A:H`,
        });
        const dlRows = (dlRes.data.values || []).slice(1);
        if (dlRows.length > 0) {
            const dlOps = dlRows
                .filter((r) => r[0] && r[0].toString().trim().length > 0)
                .map((r) => ({
                    updateOne: {
                        filter: { logId: r[0].toString().trim() },
                        update: {
                            $set: {
                                logId: r[0].toString().trim(),
                                userId: (r[1] || "").toString().trim(),
                                downloadType: (r[2] || "free").toString().trim(),
                                documentUrl: (r[3] || "").toString().trim(),
                                documentTitle: (r[4] || "").toString().trim(),
                                totalPages: parseInt(r[5] || "0", 10) || 0,
                                clientIp: (r[6] || "unknown").toString().trim(),
                                createdAt: (r[7] || getVnTimeString()).toString().trim(),
                            },
                        },
                        upsert: true,
                    },
                }));

            if (dlOps.length > 0) {
                const res = await db.collection("credits_downloads").bulkWrite(dlOps, { ordered: false });
                migratedDownloads = (res.upsertedCount || 0) + (res.modifiedCount || 0);
            }
        }
    } catch (dErr) {
        console.warn("⚠️ [Migration Downloads] Warning:", (dErr as Error).message);
    }

    return {
        success: true,
        migratedUsers,
        migratedTransactions,
        migratedDownloads,
        message: `Đồng bộ thành công từ Google Sheets sang MongoDB: ${migratedUsers} người dùng, ${migratedTransactions} giao dịch, ${migratedDownloads} lượt tải.`,
    };
}
