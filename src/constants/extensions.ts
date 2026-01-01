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
    privacyPolicyUrl?: string;
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
        chromeUrl: "https://chromewebstore.google.com/detail/auto-form-filler/ojdhfbmhdohbhfjcejdclcpbbhaggonc",
        githubUrl: "https://github.com/xuantruongg03/auto-form-filler-extension",
        author: "xuantruongg03",
        tags: ["auto", "form", "filler"],
    },
    {
        id: "css-inspector",
        name: "CSS Inspector",
        description: {
            en: "An extension that allows you to inspect and analyze CSS styles on any webpage.",
            vi: "Một extension cho phép bạn kiểm tra và phân tích các kiểu CSS trên bất kỳ trang web nào.",
        },
        category: "developer",
        chromeUrl: "",
        githubUrl: "https://github.com/xuantruongg03/css-inspector-extension",
        privacyPolicyUrl: "/privacy/css-inspector",
        author: "xuantruongg03",
        tags: ["css", "inspector", "developer"],
    },
    {
        id: "web-inspector",
        name: "Web Inspector",
        description: {
            en: "An extension that provides web inspection tools for developers to debug and analyze web pages.",
            vi: "Một extension cung cấp các công cụ kiểm tra web cho các nhà phát triển để gỡ lỗi và phân tích các trang web.",
        },
        category: "developer",
        chromeUrl: "",
        githubUrl: "https://github.com/xuantruongg03/web-inspector-extension",
        author: "xuantruongg03",
        tags: ["web", "inspector", "developer"],
    },
    {
        id: "audio-equalizer-booster-pro",
        name: "Audio Equalizer & Booster Pro",
        description: {
            en: "Professional 10-band equalizer with 30+ presets, volume boost up to 800%, 7D auto-pan, spatial audio, per-site settings.",
            vi: "Bộ cân bằng 10 băng tần chuyên nghiệp với hơn 30 cài đặt trước, tăng âm lượng lên đến 800%, tự động pan 7D, âm thanh không gian, cài đặt theo trang web.",
        },
        category: "utility",
        chromeUrl: "",
        githubUrl: "https://github.com/xuantruongg03/audio-equalizer-booster-extension",
        author: "xuantruongg03",
        tags: ["audio", "equalizer", "booster"],
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
