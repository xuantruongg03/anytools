export const autoBingSearchTranslations = {
    en: {
        name: "Auto Bing Search",
        description: "Automate Bing searches effortlessly to earn Microsoft Rewards points on PC and Mobile with human-like timing.",
        category: "Productivity",

        // Controls & Options
        searchCount: "Number of Searches",
        searchCountDesc: "Microsoft Rewards typically allows 30 searches on PC and 20 on Mobile per day.",
        delayTime: "Delay Between Searches (seconds)",
        delayTimeDesc: "Recommended: 8 - 14s with Random Jitter to avoid Microsoft cooldowns.",
        randomJitter: "Random Jitter (+/- 2-4s)",
        randomJitterDesc: "Adds random variance to delays to simulate natural human browsing.",

        // Modes
        searchMode: "Search Execution Mode",
        modeSingleWindow: "Auto Window (Single Window)",
        modeSingleWindowDesc: "Opens a dedicated popup and automatically navigates each search.",
        modeSequentialTabs: "New Tabs (Multi-Tab)",
        modeSequentialTabsDesc: "Opens a fresh tab for each search query.",
        modeSemiAuto: "Semi-Auto (Space / Enter)",
        modeSemiAutoDesc: "100% Rewards guaranteed! Press Spacebar or Next to trigger searches naturally.",

        // Topic Sources
        topicSource: "Topic Generation Source",
        sourceInstant: "Instant Engine (0ms - Recommended)",
        sourceInstantDesc: "Instantly picks from 1,000+ natural daily search queries without waiting.",
        sourceCustom: "Custom Keywords List",
        sourceCustomDesc: "Paste your own keywords or phrases (one per line).",
        sourceGemini: "Gemini AI (Smart Generator)",
        sourceGeminiDesc: "Generate creative, unique queries using Gemini AI.",

        // Actions
        startSearch: "Start Auto Search",
        pauseSearch: "Pause",
        resumeSearch: "Resume",
        stopSearch: "Stop Search",
        nextSearch: "Next Search (Spacebar)",
        generateAITopics: "Generate AI Topics",
        generatingAI: "Generating with Gemini...",
        shuffleQueue: "Shuffle Topics",
        clearQueue: "Clear Queue",
        customKeywordsPlaceholder: "Enter search terms here, one per line:\ne.g.\nweather in Tokyo\nhow to make sourdough bread\nlatest tech news",

        // Progress & Status
        statusReady: "Ready to start",
        statusSearching: "Searching...",
        statusPaused: "Paused",
        statusComplete: "Search completed successfully!",
        currentTopic: "Current Search",
        nextTopic: "Up Next",
        countdownNext: "Next search in",
        seconds: "seconds",
        estimatedPoints: "Est. Rewards Points",
        searchesDone: "Completed",
        queueCount: "Queue Items",
        searchHistory: "Recent Search History",
        clearHistory: "Clear History",
        noHistory: "No search history recorded yet.",

        // Guidance & Warnings
        importantNotice: "Important Tips for Microsoft Rewards",
        tip1: "Log into your Microsoft Account on Bing before starting.",
        tip2: "Keep delay at 8s or higher with Random Jitter enabled to prevent the 15-minute search cooldown.",
        tip3: "For Mobile search points: press F12, toggle Device Toolbar (Mobile Emulation) in Edge/Chrome, or run directly on your smartphone.",
        tip4: "Use Semi-Auto mode if your account is experiencing cooldown restrictions.",
        popupWarning: "If your browser blocks the search window, please click 'Always allow pop-ups for this site' in the address bar.",
    },
    vi: {
        name: "Tự Động Tìm Kiếm Bing",
        description: "Tự động thực hiện tìm kiếm trên Bing để nhận điểm Microsoft Rewards dễ dàng trên PC và Di động với thời gian giãn cách tự nhiên.",
        category: "Productivity",

        // Controls & Options
        searchCount: "Số lượt tìm kiếm",
        searchCountDesc: "Microsoft Rewards thường cho phép 30 lượt trên PC (90 điểm) và 20 lượt trên Di động (60 điểm) mỗi ngày.",
        delayTime: "Thời gian chờ giữa các lượt (giây)",
        delayTimeDesc: "Khuyên dùng: 8 - 14 giây kèm Độ trễ ngẫu nhiên (Jitter) để tránh bị dính Cooldown Bing.",
        randomJitter: "Độ trễ ngẫu nhiên (+/- 2-4 giây)",
        randomJitterDesc: "Tạo sự ngẫu nhiên giữa các lượt tìm kiếm để mô phỏng hành vi lướt web của người thật.",

        // Modes
        searchMode: "Chế độ tìm kiếm",
        modeSingleWindow: "Cửa sổ tự động (1 Cửa sổ)",
        modeSingleWindowDesc: "Mở 1 cửa sổ phụ riêng biệt và tự động chuyển trang sau mỗi lượt.",
        modeSequentialTabs: "Mở từng Tab mới",
        modeSequentialTabsDesc: "Mở một tab mới riêng cho từng từ khóa tìm kiếm.",
        modeSemiAuto: "Bán tự động (Phím Space / Enter)",
        modeSemiAutoDesc: "Đảm bảo 100% được cộng điểm! Nhấn phím Space hoặc nút Tiếp theo để mở tìm kiếm tự nhiên.",

        // Topic Sources
        topicSource: "Nguồn từ khóa tìm kiếm",
        sourceInstant: "Tức thì (0ms - Khuyên dùng)",
        sourceInstantDesc: "Khởi động ngay trong 0ms từ ngân hàng hơn 1,000+ từ khóa đời sống, khoa học tự nhiên.",
        sourceCustom: "Tùy chỉnh danh sách từ khóa",
        sourceCustomDesc: "Tự dán danh sách từ khóa bạn muốn tìm (mỗi dòng một từ).",
        sourceGemini: "AI Gemini (Sáng tạo)",
        sourceGeminiDesc: "Sử dụng trí tuệ nhân tạo Gemini để tạo ra danh sách từ khóa độc lạ.",

        // Actions
        startSearch: "Bắt đầu tìm kiếm",
        pauseSearch: "Tạm dừng",
        resumeSearch: "Tiếp tục",
        stopSearch: "Dừng lại",
        nextSearch: "Lượt tiếp theo (Spacebar)",
        generateAITopics: "Tạo trước bằng AI",
        generatingAI: "Đang tạo chủ đề với Gemini...",
        shuffleQueue: "Xáo trộn từ khóa",
        clearQueue: "Xóa danh sách",
        customKeywordsPlaceholder: "Nhập các từ khóa tìm kiếm, mỗi dòng một từ:\nVí dụ:\nthời tiết hà nội hôm nay\ncách làm bánh mì tại nhà\ntin tức công nghệ mới nhất",

        // Progress & Status
        statusReady: "Sẵn sàng bắt đầu",
        statusSearching: "Đang tìm kiếm...",
        statusPaused: "Đang tạm dừng",
        statusComplete: "Đã hoàn thành phiên tìm kiếm!",
        currentTopic: "Từ khóa hiện tại",
        nextTopic: "Từ khóa tiếp theo",
        countdownNext: "Lượt tiếp theo sau",
        seconds: "giây",
        estimatedPoints: "Điểm Rewards ước tính",
        searchesDone: "Đã hoàn thành",
        queueCount: "Từ khóa trong hàng đợi",
        searchHistory: "Lịch sử tìm kiếm gần đây",
        clearHistory: "Xóa lịch sử",
        noHistory: "Chưa có lịch sử tìm kiếm nào.",

        // Guidance & Warnings
        importantNotice: "Lưu ý quan trọng để nhận tối đa điểm Microsoft Rewards",
        tip1: "Hãy đăng nhập tài khoản Microsoft trên Bing (bing.com) trước khi bắt đầu.",
        tip2: "Nên đặt thời gian chờ từ 8 giây trở lên và bật Độ trễ ngẫu nhiên để không bị phạt Cooldown 15 phút.",
        tip3: "Để kiếm điểm tìm kiếm trên Di động (Mobile): bấm F12 trên Edge/Chrome -> bật chế độ giả lập điện thoại (Device Toggle) hoặc chạy trực tiếp trên smartphone.",
        tip4: "Nếu tài khoản của bạn đang bị dính Cooldown, hãy dùng chế độ Bán tự động (cách mỗi 15 phút bấm 3-4 lượt).",
        popupWarning: "Nếu trình duyệt hiển thị thông báo chặn cửa sổ bật lên (Pop-up blocked), hãy bấm vào biểu tượng trên thanh địa chỉ và chọn 'Luôn cho phép'.",
    },
};

// Backwards compatibility export
export const autoBingSearch = autoBingSearchTranslations.en;
