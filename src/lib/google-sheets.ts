/**
 * Google Sheets Logger
 * Ghi log request/response vào Google Sheets để theo dõi và phân tích
 *
 * Setup:
 * 1. Tạo Google Cloud Project: https://console.cloud.google.com
 * 2. Enable Google Sheets API
 * 3. Tạo Service Account và download JSON key
 * 4. Share Google Sheet với email của Service Account (Editor permission)
 * 5. Thêm các biến môi trường vào .env.local
 */

import { google, sheets_v4 } from "googleapis";

// ============ Configuration ============

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const BASE_SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME || "Logs";

// ============ Helper: Get daily sheet name (Vietnam timezone +7) ============

function getDailySheetName(date: Date = new Date()): string {
    // Chuyển sang múi giờ +7 (Vietnam)
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const year = vnDate.getUTCFullYear();
    const month = String(vnDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(vnDate.getUTCDate()).padStart(2, "0");
    return `${BASE_SHEET_NAME}_${year}-${month}-${day}`;
}

// ============ Types ============

export interface RequestLog {
    // Thông tin request
    requestId: string;
    method: string;
    path: string;
    query?: string;
    userAgent?: string;

    // Thông tin người dùng
    ip: string;
    country?: string;
    city?: string;

    // Thời gian
    startTime: Date;
    endTime?: Date;
    duration?: number; // milliseconds

    // Kết quả
    statusCode?: number;
    status: "pending" | "success" | "error";
    errorMessage?: string;
    errorStack?: string;

    // Metadata
    referer?: string;
    locale?: string;
}

export interface LoggerOptions {
    /** Có ghi log không (mặc định: true) */
    enabled?: boolean;
    /** Có ghi chi tiết error stack không (mặc định: false trong production) */
    includeErrorStack?: boolean;
    /** Các path không cần log */
    excludePaths?: string[];
}

// ============ Google Sheets Client ============

let sheetsClient: sheets_v4.Sheets | null = null;

function getSheetsClient(): sheets_v4.Sheets | null {
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !SPREADSHEET_ID) {
        console.warn("[GoogleSheets] Missing configuration. Set GOOGLE_SHEETS_* env variables.");
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

// ============ Check if configured ============

export function isGoogleSheetsConfigured(): boolean {
    return !!(GOOGLE_CLIENT_EMAIL && GOOGLE_PRIVATE_KEY && SPREADSHEET_ID);
}

// ============ Cache for created sheets ============

const createdSheets = new Set<string>();

// ============ Ensure daily sheet exists ============

async function ensureDailySheetExists(sheets: sheets_v4.Sheets, sheetName: string): Promise<void> {
    // Kiểm tra cache trước
    if (createdSheets.has(sheetName)) {
        return;
    }

    try {
        // Lấy danh sách sheets hiện có
        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID!,
            fields: "sheets.properties.title",
        });

        const existingSheets = spreadsheet.data.sheets?.map((s) => s.properties?.title) || [];

        // Nếu sheet đã tồn tại, thêm vào cache và return
        if (existingSheets.includes(sheetName)) {
            createdSheets.add(sheetName);
            return;
        }

        // Tạo sheet mới
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID!,
            requestBody: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: sheetName,
                            },
                        },
                    },
                ],
            },
        });

        // Lấy sheetId của sheet mới tạo
        const updatedSpreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID!,
            fields: "sheets.properties",
        });

        const newSheet = updatedSpreadsheet.data.sheets?.find((s) => s.properties?.title === sheetName);
        const sheetId = newSheet?.properties?.sheetId;

        // Thêm headers
        const headers = ["Timestamp", "Request ID", "Method", "Path", "Status", "Status Code", "Duration", "IP", "Country", "User Agent", "Error", "Referer", "Locale", "Query", "End Time"];

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID!,
            range: `${sheetName}!A1:O1`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [headers],
            },
        });

        // Format header nếu có sheetId
        if (sheetId !== undefined) {
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId: SPREADSHEET_ID!,
                requestBody: {
                    requests: [
                        {
                            repeatCell: {
                                range: {
                                    sheetId: sheetId,
                                    startRowIndex: 0,
                                    endRowIndex: 1,
                                },
                                cell: {
                                    userEnteredFormat: {
                                        backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 },
                                        textFormat: {
                                            bold: true,
                                            foregroundColor: { red: 1, green: 1, blue: 1 },
                                        },
                                    },
                                },
                                fields: "userEnteredFormat(backgroundColor,textFormat)",
                            },
                        },
                        {
                            updateSheetProperties: {
                                properties: {
                                    sheetId: sheetId,
                                    gridProperties: {
                                        frozenRowCount: 1,
                                    },
                                },
                                fields: "gridProperties.frozenRowCount",
                            },
                        },
                        // Auto-resize columns
                        {
                            autoResizeDimensions: {
                                dimensions: {
                                    sheetId: sheetId,
                                    dimension: "COLUMNS",
                                    startIndex: 0,
                                    endIndex: 15,
                                },
                            },
                        },
                    ],
                },
            });
        }

        // Thêm vào cache
        createdSheets.add(sheetName);
        console.log(`[GoogleSheets] Created new daily sheet: ${sheetName}`);
    } catch (error) {
        console.error(`[GoogleSheets] Failed to ensure sheet exists: ${sheetName}`, error);
        // KHÔNG thêm vào cache khi fail - để retry lần sau
        // Throw error để caller biết
        throw error;
    }
}

// ============ Buffer for batch writing ============

interface LogBuffer {
    logs: RequestLog[];
    lastFlush: number;
    flushTimeout: NodeJS.Timeout | null;
}

const logBuffer: LogBuffer = {
    logs: [],
    lastFlush: Date.now(),
    flushTimeout: null,
};

const BUFFER_SIZE = 10; // Số log trước khi ghi
const BUFFER_TIMEOUT = 5000; // 5 giây timeout

// ============ Main Logger Class ============

export class GoogleSheetsLogger {
    private options: Required<LoggerOptions>;

    constructor(options: LoggerOptions = {}) {
        this.options = {
            enabled: options.enabled ?? true,
            includeErrorStack: options.includeErrorStack ?? process.env.NODE_ENV !== "production",
            excludePaths: options.excludePaths ?? ["/api/health", "/api/ping", "/_next", "/favicon.ico"],
        };
    }

    /**
     * Tạo log entry mới khi bắt đầu request
     */
    createLog(request: { method: string; path: string; query?: string; ip: string; userAgent?: string; referer?: string; locale?: string; country?: string; city?: string }): RequestLog {
        return {
            requestId: this.generateRequestId(),
            method: request.method,
            path: request.path,
            query: request.query,
            ip: request.ip,
            userAgent: request.userAgent,
            referer: request.referer,
            locale: request.locale,
            country: request.country,
            city: request.city,
            startTime: new Date(),
            status: "pending",
        };
    }

    /**
     * Cập nhật log khi request hoàn thành
     */
    completeLog(
        log: RequestLog,
        result: {
            statusCode: number;
            error?: Error | null;
        },
    ): RequestLog {
        const endTime = new Date();
        const duration = endTime.getTime() - log.startTime.getTime();

        return {
            ...log,
            endTime,
            duration,
            statusCode: result.statusCode,
            status: result.error ? "error" : "success",
            errorMessage: result.error?.message,
            errorStack: this.options.includeErrorStack ? result.error?.stack : undefined,
        };
    }

    /**
     * Ghi log vào Google Sheets
     */
    async writeLog(log: RequestLog): Promise<void> {
        if (!this.options.enabled || !isGoogleSheetsConfigured()) {
            return;
        }

        // Kiểm tra exclude paths
        if (this.options.excludePaths.some((path) => log.path.startsWith(path))) {
            return;
        }

        // Thêm vào buffer
        logBuffer.logs.push(log);

        // Flush nếu buffer đầy
        if (logBuffer.logs.length >= BUFFER_SIZE) {
            await this.flushLogs();
        } else if (!logBuffer.flushTimeout) {
            // Set timeout để flush sau một khoảng thời gian
            logBuffer.flushTimeout = setTimeout(() => this.flushLogs(), BUFFER_TIMEOUT);
        }
    }

    /**
     * Ghi tất cả logs trong buffer vào Google Sheets
     */
    async flushLogs(): Promise<void> {
        if (logBuffer.logs.length === 0) return;

        // Clear timeout
        if (logBuffer.flushTimeout) {
            clearTimeout(logBuffer.flushTimeout);
            logBuffer.flushTimeout = null;
        }

        const logsToWrite = [...logBuffer.logs];
        logBuffer.logs = [];
        logBuffer.lastFlush = Date.now();

        const sheets = getSheetsClient();
        if (!sheets) return;

        try {
            // Lấy tên sheet theo ngày (theo múi giờ +7)
            const sheetName = getDailySheetName();

            // Đảm bảo sheet tồn tại và có headers
            await ensureDailySheetExists(sheets, sheetName);

            const rows = logsToWrite.map((log) => this.formatLogRow(log));

            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID!,
                range: `${sheetName}!A:O`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    values: rows,
                },
            });
        } catch (error) {
            console.error("[GoogleSheets] Failed to write logs:", error);
        }
    }

    /**
     * Format log thành row cho Google Sheets
     * Các cột: Timestamp | Request ID | Method | Path | Status | Status Code | Duration | IP | Country | User Agent | Error | Referer | Locale | Query | End Time
     */
    private formatLogRow(log: RequestLog): (string | number)[] {
        return [
            // A: Timestamp (formatted đẹp)
            this.formatDate(log.startTime),
            // B: Request ID
            log.requestId,
            // C: Method
            log.method,
            // D: Path
            log.path,
            // E: Status (với emoji)
            this.formatStatus(log.status),
            // F: Status Code
            log.statusCode ?? "",
            // G: Duration (ms)
            log.duration ? `${log.duration}ms` : "",
            // H: IP
            log.ip,
            // I: Country
            log.country ?? "",
            // J: User Agent (truncated)
            this.truncateUserAgent(log.userAgent),
            // K: Error Message
            log.errorMessage ?? "",
            // L: Referer
            log.referer ?? "",
            // M: Locale
            log.locale ?? "",
            // N: Query String
            log.query ?? "",
            // O: End Time
            log.endTime ? this.formatDate(log.endTime) : "",
        ];
    }

    private formatDate(date: Date): string {
        // Chuyển sang múi giờ +7 (Vietnam)
        const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        const year = vnDate.getUTCFullYear();
        const month = String(vnDate.getUTCMonth() + 1).padStart(2, "0");
        const day = String(vnDate.getUTCDate()).padStart(2, "0");
        const hours = String(vnDate.getUTCHours()).padStart(2, "0");
        const minutes = String(vnDate.getUTCMinutes()).padStart(2, "0");
        const seconds = String(vnDate.getUTCSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    private formatStatus(status: RequestLog["status"]): string {
        switch (status) {
            case "success":
                return "✅ Success";
            case "error":
                return "❌ Error";
            case "pending":
                return "⏳ Pending";
            default:
                return status;
        }
    }

    private truncateUserAgent(ua?: string): string {
        if (!ua) return "";
        // Lấy thông tin browser chính
        const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/);
        return match ? match[0] : ua.slice(0, 50);
    }

    private generateRequestId(): string {
        return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    }
}

// ============ Singleton Instance ============

export const logger = new GoogleSheetsLogger();
