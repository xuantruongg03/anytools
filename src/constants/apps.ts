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
