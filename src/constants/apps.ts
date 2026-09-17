export type AppCategory = "productivity" | "developer" | "design" | "utility" | "education" | "entertainment" | "communication";

export interface AppSEO {
    en: {
        title: string;
        description: string;
        features: string[];
        useCases: string[];
    };
    vi: {
        title: string;
        description: string;
        features: string[];
        useCases: string[];
    };
}

export interface App {
    id: string;
    name: string;
    description: {
        en: string;
        vi: string;
    };
    category: AppCategory;
    windowsUrl?: string;
    iosUrl?: string;
    androidUrl?: string;
    icon?: string;
    author: string;
    tags?: string[];
    isFree: boolean;
    hasFreeTier?: boolean;
    seo?: AppSEO;
}

export const appCategoryTranslations = {
    productivity: { en: "Productivity", vi: "Năng suất" },
    developer: { en: "Developer Tools", vi: "Công cụ Dev" },
    design: { en: "Design & Creative", vi: "Thiết kế & Sáng tạo" },
    utility: { en: "Utility", vi: "Tiện ích" },
    education: { en: "Education", vi: "Giáo dục" },
    entertainment: { en: "Entertainment", vi: "Giải trí" },
    communication: { en: "Communication", vi: "Giao tiếp" },
} as const;

export const apps: App[] = [
    {
        id: "ms-office",
        name: "Microsoft Office",
        description: {
            en: "Industry-standard productivity suite including Word, Excel, PowerPoint, and more.",
            vi: "Bộ công cụ năng suất tiêu chuẩn ngành bao gồm Word, Excel, PowerPoint và nhiều hơn nữa.",
        },
        category: "productivity",
        windowsUrl: "https://www.microsoft.com/en-us/microsoft-365/get-started-with-office-2019",
        author: "Microsoft",
        tags: ["office suite", "productivity", "word", "excel", "powerpoint", "crack"],
        isFree: true,
        seo: {
            en: {
                title: "Microsoft Office - Industry Standard Productivity Suite",
                description: "Microsoft Office is the industry-standard productivity suite including Word, Excel, PowerPoint, and more.",
                features: ["Word - Word Processing", "Excel - Spreadsheets", "PowerPoint - Presentations", "Outlook - Email Management", "OneNote - Note Taking", "Teams - Communication and Collaboration"],
                useCases: ["Creating and editing documents", "Data analysis with spreadsheets", "Creating professional presentations", "Managing emails and calendars", "Taking notes and organizing information", "Effective team collaboration"],
            },
            vi: {
                title: "Microsoft Office - Bộ Công Cụ Năng Suất Tiêu Chuẩn Ngành",
                description: "Microsoft Office là bộ công cụ năng suất tiêu chuẩn ngành bao gồm Word, Excel, PowerPoint và nhiều hơn nữa.",
                features: ["Word - Soạn thảo văn bản", "Excel - Bảng tính", "PowerPoint - Trình chiếu", "Outlook - Quản lý email", "OneNote - Ghi chú", "Teams - Giao tiếp và cộng tác"],
                useCases: ["Soạn thảo và chỉnh sửa tài liệu", "Phân tích dữ liệu với bảng tính", "Tạo bài thuyết trình chuyên nghiệp", "Quản lý email và lịch làm việc", "Ghi chú và tổ chức thông tin", "Cộng tác nhóm hiệu quả"],
            },
        },
    },
    {
        id: "mika",
        name: "Mika - Block Scam Calls & Spam Messages",
        description: {
            en: "Mika is an Android application that helps you block calls and SMS.",
            vi: "Ứng dụng android giúp chặn cuộc gọi và tin nhắn hoàn toàn miễn phí.",
        },
        category: "utility",
        androidUrl: "https://apkpure.com/group/com.simple.mika",
        author: "xuantruongg03",
        tags: ["block calls", "block sms", "block scam calls", "block spam messages"],
        isFree: true,
        seo: {
            en: {
                title: "Mika - Block Scam Calls & Spam Messages",
                description: "Mika is an Android application that helps you block calls and SMS.",
                features: ["Block spam calls", "Block spam messages", "Block calls from unknown numbers", "Block messages from unknown numbers", "Block calls from numbers not in contacts", "Block messages from numbers not in contacts"],
                useCases: ["Block annoying calls", "Block spam messages", "Block calls from unknown numbers", "Block messages from unknown numbers", "Block calls from numbers not in contacts", "Block messages from numbers not in contacts"],
            },
            vi: {
                title: "Mika - Chặn cuộc gọi lừa đảo & Tin nhắn rác",
                description: "Bạn thường xuyên bị quấy rầy bởi các cuộc gọi đòi nợ, mạo danh ngân hàng, chứng khoán, hay các tin nhắn rác quảng cáo game, bất động sản? mika ra đời để giúp bạn lấy lại sự yên bình cho điện thoại với công nghệ nhận diện và chặn tự động thông minh.",
                features: ["Chặn cuộc gọi rác", "Chặn tin nhắn rác", "Chặn cuộc gọi từ số lạ", "Chặn tin nhắn từ số lạ", "Chặn cuộc gọi từ số không có trong danh bạ", "Chặn tin nhắn từ số không có trong danh bạ"],
                useCases: ["Chặn các cuộc gọi làm phiền", "Chặn các tin nhắn rác", "Chặn các cuộc gọi từ số lạ", "Chặn các tin nhắn từ số lạ", "Chặn các cuộc gọi từ số không có trong danh bạ", "Chặn các tin nhắn từ số không có trong danh bạ"],
            },
        },
    },
];

// Helper function to get apps by category
export const getAppsByCategory = (category: AppCategory): App[] => {
    return apps.filter((app) => app.category === category);
};

// Helper function to get all categories that have apps
export const getActiveAppCategories = (): AppCategory[] => {
    const categories = new Set(apps.map((app) => app.category));
    return Array.from(categories);
};

// Helper function to get app by id
export const getAppById = (id: string): App | undefined => {
    return apps.find((app) => app.id === id);
};
