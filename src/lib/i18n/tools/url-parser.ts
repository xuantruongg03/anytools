export const urlParserTranslations = {
    en: {
        name: "URL Parser & UTM Campaign Builder",
        description: "Deconstruct URLs into protocol, host, path, and query params. Edit query strings live, build trackable marketing UTM campaign links, and encode/decode parameters.",
        category: "Network",

        // Tabs
        tabParser: "URL Parser & Query Inspector",
        tabUtm: "UTM Campaign Builder",

        // Parser Controls
        inputUrl: "Target URL",
        inputPlaceholder: "Paste any URL (e.g. https://example.com/shop/shoes?category=sneakers&sort=asc&utm_source=google#details)",
        parsedComponents: "Deconstructed Components",
        protocol: "Protocol",
        hostname: "Hostname / Domain",
        port: "Port",
        pathname: "Pathname",
        hash: "Hash / Anchor",
        origin: "Origin",

        // Query params table
        queryParams: "Query Parameters",
        paramKey: "Key",
        paramValue: "Value",
        addParam: "Add Parameter",
        deleteParam: "Delete",
        noParams: "No query parameters detected in this URL.",
        decodeUri: "Auto-decode URL encoded characters (%20, etc.)",

        // UTM Builder
        utmBuilderTitle: "Marketing UTM Campaign Tags",
        utmSource: "Campaign Source (utm_source) *",
        utmSourcePlaceholder: "e.g. google, newsletter, facebook, tiktok",
        utmMedium: "Campaign Medium (utm_medium) *",
        utmMediumPlaceholder: "e.g. cpc, email, banner, organic_social",
        utmCampaign: "Campaign Name (utm_campaign) *",
        utmCampaignPlaceholder: "e.g. spring_sale, summer_promo, launch_2026",
        utmTerm: "Campaign Term (utm_term)",
        utmTermPlaceholder: "e.g. running+shoes, best+vpn (paid search keywords)",
        utmContent: "Campaign Content (utm_content)",
        utmContentPlaceholder: "e.g. hero_banner, button_blue (for A/B testing)",

        // Output & Actions
        reconstructedUrl: "Updated / Generated URL",
        copyUrl: "Copy URL",
        copied: "Copied!",
        openLink: "Open in New Tab",
        reset: "Reset",

        // Guide
        guideTitle: "Mastering URL Anatomy & UTM Tracking",
        guide1Title: "Why Parse URLs?",
        guide1Desc: "Modern URLs contain tracking beacons, search filters, and routing tokens. Parsing clarifies obscure parameters and allows developers and marketers to audit queries accurately.",
        guide2Title: "Best Practices for UTM Tracking",
        guide2Desc: "Always keep UTM parameters lowercase, replace spaces with underscores or hyphens, and maintain a consistent naming taxonomy across Google Analytics 4.",
        guide3Title: "Safe & Client-Side",
        guide3Desc: "URLs and secret query tokens are analyzed in memory by browser URL APIs. No browsing history or campaign parameters are transmitted to any backend.",

        // FAQs
        faqTitle: "Frequently Asked Questions",
        faq1Q: "What are UTM parameters and why are they necessary?",
        faq1A: "UTM (Urchin Tracking Module) parameters are standardized query tags appended to links that allow web analytics tools (like Google Analytics, Mixpanel, and Meta Pixel) to track traffic sources accurately.",
        faq2Q: "Can I add custom query parameters beyond UTM?",
        faq2A: "Yes! Use the Query Parameters table to add, modify, or remove any arbitrary key-value pairs (such as ref, aff, id, or token) with real-time URL regeneration.",
        faq3Q: "Does URL parsing decode special characters automatically?",
        faq3A: "Yes, the inspector provides an option to toggle between decoded human-readable text and raw encoded URI strings (e.g. %2F, %20, %3D).",
    },
    vi: {
        name: "Phân Tích URL & Tạo Link UTM Marketing (URL Parser)",
        description: "Bóc tách cấu trúc URL thành protocol, domain, đường dẫn và tham số query. Chỉnh sửa tham số trực tiếp, gắn mã UTM theo dõi chiến dịch Google Analytics chuẩn SEO.",
        category: "Mạng",

        // Tabs
        tabParser: "Phân tích URL & Tham số Query",
        tabUtm: "Tạo link UTM theo dõi chiến dịch",

        // Parser Controls
        inputUrl: "Đường dẫn URL cần phân tích",
        inputPlaceholder: "Dán đường dẫn URL vào đây (VD: https://example.com/shop/shoes?category=sneakers&utm_source=facebook#details)",
        parsedComponents: "Cấu trúc thành phần URL",
        protocol: "Giao thức (Protocol)",
        hostname: "Tên miền (Domain / Host)",
        port: "Cổng (Port)",
        pathname: "Đường dẫn (Pathname)",
        hash: "Neo trang (Hash / Anchor)",
        origin: "Gốc (Origin)",

        // Query params table
        queryParams: "Danh sách tham số (Query Parameters)",
        paramKey: "Tên tham số (Key)",
        paramValue: "Giá trị (Value)",
        addParam: "Thêm tham số mới",
        deleteParam: "Xóa",
        noParams: "URL này hiện không có tham số query nào.",
        decodeUri: "Tự động giải mã ký tự đặc biệt (%20, dấu cách...)",

        // UTM Builder
        utmBuilderTitle: "Gắn thẻ UTM Tracking (Google Analytics 4)",
        utmSource: "Nguồn chiến dịch (utm_source) *",
        utmSourcePlaceholder: "VD: google, facebook, newsletter, tiktok, youtube",
        utmMedium: "Kênh tiếp thị (utm_medium) *",
        utmMediumPlaceholder: "VD: cpc, email, banner, organic_social, post",
        utmCampaign: "Tên chiến dịch (utm_campaign) *",
        utmCampaignPlaceholder: "VD: sale_tet_2026, khuyen_mai_he, launch_app",
        utmTerm: "Từ khóa quảng cáo (utm_term)",
        utmTermPlaceholder: "VD: giay+the+thao, ban+phim+co (quảng cáo Google Ads)",
        utmContent: "Nội dung phân biệt (utm_content)",
        utmContentPlaceholder: "VD: banner_top, nut_dang_ky_xanh (dùng test A/B)",

        // Output & Actions
        reconstructedUrl: "URL hoàn chỉnh sau khi xử lý",
        copyUrl: "Sao chép URL",
        copied: "Đã chép!",
        openLink: "Mở trong tab mới",
        reset: "Đặt lại",

        // Guide
        guideTitle: "Cẩm Nang Cấu Trúc URL & Theo Dõi Chiến Dịch UTM",
        guide1Title: "Tại sao cần bóc tách URL?",
        guide1Desc: "URL thường chứa rất nhiều token phức tạp và mã theo dõi. Việc bóc tách giúp kiểm tra chính xác các tham số, xóa bỏ mã rác hoặc chỉnh sửa redirect linh hoạt.",
        guide2Title: "Quy tắc vàng khi đặt tên UTM",
        guide2Desc: "Nên viết thường toàn bộ (lowercase), không dùng dấu cách (thay bằng gạch dưới hoặc gạch ngang) và đặt tên đồng nhất để báo cáo GA4 không bị phân mảnh.",
        guide3Title: "Bảo mật & chạy trực tiếp trên trình duyệt",
        guide3Desc: "Toàn bộ chuỗi URL được phân tích bằng API URL chuẩn của trình duyệt. Không có dữ liệu hay lịch sử duyệt web nào bị gửi về máy chủ.",

        // FAQs
        faqTitle: "Câu Hỏi Thường Gặp",
        faq1Q: "Mã UTM là gì và có tác dụng gì?",
        faq1A: "UTM (Urchin Tracking Module) là các tham số đặc biệt gắn vào đuôi link giúp các công cụ phân tích (Google Analytics, Meta Pixel) biết chính xác khách hàng đến từ bài viết, quảng cáo hay chiến dịch nào.",
        faq2Q: "Tôi có thể tự do thêm các tham số khác ngoài UTM không?",
        faq2A: "Hoàn toàn được! Bạn có thể thêm bất kỳ tham số nào như ref, aff, coupon, user_id vào bảng tham số để tạo link chia sẻ tùy chỉnh.",
        faq3Q: "URL có tự động mã hóa ký tự tiếng Việt không?",
        faq3A: "Có, hệ thống tự động chuẩn hóa URL chuẩn RFC 3986 giúp đường link không bị lỗi khi người dùng click trên Zalo, Messenger hay Email.",
    },
};
