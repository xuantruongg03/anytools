export type ExtensionId =
    | "scribd-downloader"
    | "studocu-downloader"
    | "auto-form-filler"
    | "css-inspector"
    | "audio-equalizer"
    | string;

export type TelemetryAction =
    | "INIT_REQUEST"
    | "DOWNLOAD_SUCCESS"
    | "DOWNLOAD_FAILED"
    | "HEARTBEAT";

export type AnomalyType =
    | "FAST_BYPASS"          // Tải xong < 29s (phá vỡ timer 30s)
    | "MISSING_INIT"        // Không hề gọi handshake init trước khi tải
    | "MULTI_IP"            // 1 user_id xuất hiện từ >= 3 IP khác nhau
    | "RATE_BURST"           // Quá nhiều lượt tải trong khoảng thời gian ngắn
    | "IP_FARM"             // 1 IP tạo hàng loạt user_id ảo
    | "DOC_SPAM"            // Tải lặp đi lặp lại 1 tài liệu trong vài phút
    | "TAMPERED_NONCE";     // Nonce giả mạo hoặc không hợp lệ

export type AnomalySeverity = "NORMAL" | "LOW" | "MEDIUM" | "CRITICAL";

export interface TelemetryEvent {
    id: string;
    extensionId: ExtensionId;
    extensionVersion: string;
    action: TelemetryAction;
    clientUserId: string;
    sessionNonce?: string;
    docIdHash: string;
    docTitle?: string;
    ip: string;
    country?: string;
    city?: string;
    browser: "chrome" | "edge" | "firefox" | "other";
    initTimestamp?: number;
    completeTimestamp?: number;
    elapsedSeconds: number; // Measured duration between init and complete (or consecutive downloads)
    estimatedMinSeconds?: number; // Dynamic physical minimum duration estimated from page counts
    pages?: number; // Number of document pages
    downloadType?: "free" | "credit" | string; // Free (requires 30s wait) vs Credit (skip 30s countdown, only data init)
    clientReportedSeconds?: number;
    anomalies: AnomalyType[];
    riskScore: number; // 0 - 100
    severity: AnomalySeverity;
    meta?: Record<string, any>;
    createdAt: string; // ISO
}

export interface HandshakeSession {
    sessionNonce: string;
    clientUserId: string;
    extensionId: ExtensionId;
    ip: string;
    docIdHash: string;
    initTimestamp: number;
    expiresAt: number;
}

export interface TelemetrySummaryStats {
    totalDownloads: number;
    freeDownloadsCount: number;
    creditDownloadsCount: number;
    totalInits: number;
    totalAnomalies: number;
    anomalyPercentage: number;
    activeUsersCount: number;
    flaggedUsersCount: number;
    fastBypassCount: number;
    multiIpCount: number;
    averageWaitSeconds: number;
    newUsersCount: number;
    userGrowthPercentage: number;
    conversionRate: number;
    timeline: Array<{
        time: string; // HH:00 or DD/MM
        normalDownloads: number;
        freeDownloads: number;
        creditDownloads: number;
        anomalousDownloads: number;
        fastBypassCount: number;
        newUsers: number;
    }>;
    hourlyDistribution: HourlyActivityBucket[];
    dayOfWeekDistribution: DayOfWeekActivity[];
    topDocuments: TopDocumentItem[];
    anomalyBreakdown: Record<AnomalyType, number>;
    browserBreakdown: Record<string, number>;
    topCountries: Array<{ country: string; count: number }>;
    topAbusers: Array<{
        clientUserId: string;
        riskScore: number;
        anomalies: AnomalyType[];
        ips: string[];
        totalDownloads: number;
        lastSeen: string;
    }>;
}

export interface CreditTransaction {
    id: string; // Trans_ID
    userId: string;
    amount: number;
    rawAmount?: string;
    creditsAdded: number;
    bankCode: string;
    content: string;
    createdAt: string; // ISO
}

export interface CreditTransactionSummary {
    totalRevenue: number;
    totalTransactions: number;
    totalCreditsAdded: number;
    averageTransactionValue: number;
    timeline: Array<{
        time: string;
        revenue: number;
        transactionsCount: number;
        creditsCount: number;
    }>;
    bankBreakdown: Record<string, { count: number; totalAmount: number }>;
    topSpenders: Array<{
        userId: string;
        totalSpent: number;
        totalCredits: number;
        transactionCount: number;
        lastTransaction: string;
    }>;
}

export interface UserDirectoryItem {
    userId: string;
    credits: number;
    totalDownloaded: number;
    createdIp: string;
    country?: string;
    city?: string;
    createdAt: string; // ISO
    updatedAt: string; // ISO
    isPaying: boolean;
    totalSpentVnd: number;
    transactionCount: number;
    actualDownloadsInTimeframe: number;
    isNewInTimeframe: boolean;
    riskFlags: string[];
}

export interface UserSummaryStats {
    totalUsers: number;
    newUsersCount: number;
    newUsersGrowthPercentage: number;
    activeUsersCount: number;
    payingUsersCount: number;
    conversionRate: number;
    totalCreditsInCirculation: number;
    totalDownloadsLogged: number;
    timeline: Array<{
        time: string;
        newUsers: number;
        activeUsers: number;
        cumulativeUsers?: number;
    }>;
    segmentation: {
        freeOnly: number;
        paying: number;
        highSpenders: number;
        inactive: number;
    };
    topHolders: Array<{
        userId: string;
        credits: number;
        totalDownloaded: number;
        createdIp: string;
    }>;
}

export interface HourlyActivityBucket {
    hour: number;
    label: string; // "00:00", "01:00", ...
    freeDownloads: number;
    creditDownloads: number;
    anomalousDownloads: number;
    totalDownloads: number;
    percentage: number;
}

export interface DayOfWeekActivity {
    dayIndex: number;
    dayName: string;
    downloads: number;
    revenue: number;
}

export interface TopDocumentItem {
    docIdHash: string;
    docTitle: string;
    totalDownloads: number;
    freeCount: number;
    creditCount: number;
    avgPages: number;
}


