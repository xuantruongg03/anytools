export type ExtensionCategory = "productivity" | "developer" | "privacy" | "social" | "utility" | "entertainment";

export interface Extension {
    id: string;
    name: string;
    description: {
        en: string;
        vi: string;
    };
    category: ExtensionCategory;
    chromeUrl?: string;
    firefoxUrl?: string;
    edgeUrl?: string;
    githubUrl?: string;
    icon?: string;
    author: string;
    tags?: string[];
}

export const extensionCategoryTranslations = {
    productivity: { en: "Productivity", vi: "Năng suất" },
    developer: { en: "Developer Tools", vi: "Công cụ Dev" },
    privacy: { en: "Privacy & Security", vi: "Bảo mật & Riêng tư" },
    social: { en: "Social & Communication", vi: "Mạng xã hội" },
    utility: { en: "Utility", vi: "Tiện ích" },
    entertainment: { en: "Entertainment", vi: "Giải trí" },
} as const;

export const extensions: Extension[] = [
    {
        id: "auto-form-filler",
        name: "Auto Form Filler",
        description: {
            en: "This is an extension that automatically fills out forms for you. It saves time by populating fields with predefined data.",
            vi: "Đây là một extension tự động điền các biểu mẫu cho bạn. Nó giúp tiết kiệm thời gian bằng cách điền các trường với dữ liệu đã được định nghĩa trước.",
        },
        category: "productivity",
        chromeUrl: "",
        githubUrl: "https://github.com/xuantruongg03/auto-form-filler-extension",
        author: "xuantruongg03",
        tags: ["auto", "form", "filler"],
    },
];

// Helper function to get extensions by category
export const getExtensionsByCategory = (category: ExtensionCategory): Extension[] => {
    return extensions.filter((ext) => ext.category === category);
};

// Helper function to get all categories that have extensions
export const getActiveCategories = (): ExtensionCategory[] => {
    const categories = new Set(extensions.map((ext) => ext.category));
    return Array.from(categories);
};
