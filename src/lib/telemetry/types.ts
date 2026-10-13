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
    | "HEARTBEAT"
    // Popup & Navigation
    | "POPUP_OPENED"
    | "NAVIGATE_SCRIBD_CLICKED"
    | "DOWNLOAD_INITIATED_FROM_POPUP"
    | "FOOTER_LINK_CLICKED"
    // Download Flow
    | "DOWNLOAD_STARTED"
    | "CONFLICT_MODAL_SHOWN"
    | "CHOICE_MODAL_SHOWN"
    | "INSTANT_DOWNLOAD_CLICKED"
    | "FREE_DOWNLOAD_CLICKED"
    | "CONFLICT_INSTANT_CLICKED"
    | "COUNTDOWN_ABORTED"
    | "DOWNLOAD_SCAN_CANCELLED"
    // Topup & Monetization
    | "TOPUP_OPENED"
    | "TOPUP_PAGE_VIEWED"
    | "TOPUP_PACKAGE_SELECTED"
    | "BUY_ME_A_COFFEE_CLICKED"
    | "TOPUP_ACTION_COPY"
    | "TOPUP_MANUAL_CHECK_CLICKED"
    | "TOPUP_SUCCESS_CONFIRMED"
    // Settings
    | "SETTING_SCROLL_DELAY_CHANGED";

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

export interface MarketingBehaviorStats {
    // Action counts
    totalInteractions: number;
    popupOpenedCount: number;
    topupOpenedCount: number;
    topupPageViewedCount: number;
    topupPackageSelectedCount: number;
    topupActionCopyCount: number;
    topupSuccessConfirmedCount: number;
    countdownAbortedCount: number;
    choiceModalShownCount: number;
    conflictModalShownCount: number;
    freeDownloadClickedCount: number;
    instantDownloadClickedCount: number;
    downloadSuccessCount: number;
    downloadFailedCount: number;

    // Funnel 1: Download Conversion Funnel
    downloadFunnel: {
        step1_initiated: number;      // POPUP_OPENED + DOWNLOAD_STARTED
        step2_modalChoice: number;    // CHOICE_MODAL_SHOWN
        step3_downloadAttempt: number;// FREE_DOWNLOAD_CLICKED + INSTANT_DOWNLOAD_CLICKED
        step4_aborted: number;        // COUNTDOWN_ABORTED
        step5_completed: number;      // DOWNLOAD_SUCCESS
        completionRate: number;       // %
        abortRate: number;            // %
    };

    // Funnel 2: Topup & Monetization Funnel
    monetizationFunnel: {
        step1_trigger: number;        // TOPUP_OPENED
        step2_pageView: number;       // TOPUP_PAGE_VIEWED
        step3_packageSelect: number;  // TOPUP_PACKAGE_SELECTED
        step4_copyBankInfo: number;   // TOPUP_ACTION_COPY
        step5_confirmed: number;      // TOPUP_SUCCESS_CONFIRMED (hoặc giao dịch thực tế)
        conversionRate: number;       // %
    };

    // Package Popularity Breakdown
    packagePreferences: Array<{
        packageName: string;
        count: number;
        percentage: number;
    }>;

    // Behavioral Segments / Marketing Personas
    personas: {
        whalesCount: number;            // Khách VIP chi tiêu nhiều
        impatientProspectsCount: number;// Người thiếu kiên nhẫn (bỏ đếm ngược 30s hoặc bấm instant khi hết credit) -> Khách hàng nóng nhất để chào mời nạp mini
        frugalUsersCount: number;       // Người chăm chỉ kiên nhẫn chờ 30s, tải đều
        frustratedUsersCount: number;   // Gặp lỗi download failed
    };

    // Top Intent Users (Danh sách khách hàng tiềm năng nạp tiền cao nhất)
    highIntentUsers: Array<{
        userId: string;
        intentScore: number;            // 0 - 100
        reasons: string[];
        popupOpens: number;
        topupAttempts: number;
        abortedCount: number;
        lastActive: string;
    }>;

    // Optimal Marketing Hours (Khung giờ vàng tiếp thị)
    goldenHours: Array<{
        hour: number;
        label: string;
        activityCount: number;
        topupIntentCount: number;
        isRecommendedSlot: boolean;
    }>;

    // Raw action frequency breakdown
    actionBreakdown: Record<string, number>;
}


