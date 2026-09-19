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
    isUnpublished?: boolean;
    zipDownloadUrl?: string;
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
            en: "Automatically detect and fill out online registration forms, test inputs, and repetitive fields with custom profiles, smart mock data, or saved credentials in a single click.",
            vi: "Tự động phát hiện và điền các biểu mẫu trực tuyến, form kiểm thử hoặc dữ liệu lặp lại chỉ với 1 cú click chuột dựa trên hồ sơ mẫu cấu hình sẵn hoặc dữ liệu ngẫu nhiên thông minh.",
        },
        category: "productivity",
        chromeUrl: "https://chromewebstore.google.com/detail/auto-form-filler/ojdhfbmhdohbhfjcejdclcpbbhaggonc",
        githubUrl: "https://github.com/xuantruongg03/auto-form-filler-extension",
        author: "xuantruongg03",
        tags: ["auto", "form", "productivity", "automation"],
    },
    {
        id: "css-inspector",
        name: "CSS Inspector",
        description: {
            en: "Inspect CSS properties, typography, box model metrics, margins, paddings, and color palettes of any element on hover. Copy computed rules directly to clipboard and preview layout tweaks live.",
            vi: "Kiểm tra thuộc tính CSS, font chữ, box model padding/margin và bảng màu của bất kỳ phần tử web nào chỉ bằng thao tác rê chuột. Sao chép nhanh mã CSS vào clipboard và xem trước thay đổi trực tiếp.",
        },
        category: "developer",
        chromeUrl: "https://chromewebstore.google.com/detail/css-inspector/jphlhfamggkfipndpgkihpbcbdnddkdc",
        githubUrl: "https://github.com/xuantruongg03/css-inspector-extension",
        privacyPolicyUrl: "/privacy/css-inspector",
        author: "xuantruongg03",
        tags: ["css", "inspector", "developer", "styles"],
    },
    {
        id: "web-inspector",
        name: "Web Inspector",
        description: {
            en: "Advanced client-side debugging toolkit for frontend engineers. Inspect live DOM trees, monitor mutation events, analyze LocalStorage/Session state, check HTTP response headers, and audit rendering performance directly within your viewport.",
            vi: "Bộ công cụ gỡ lỗi frontend mạnh mẽ chạy trực tiếp trên trang. Phân tích cấu trúc DOM, theo dõi sự kiện DOM Mutation, kiểm tra LocalStorage/Session, phân tích HTTP response headers và đo hiệu năng render thời gian thực.",
        },
        category: "developer",
        chromeUrl: "",
        githubUrl: "https://github.com/xuantruongg03/web-inspector-extension",
        zipDownloadUrl: "https://github.com/xuantruongg03/web-inspector-extension/archive/refs/heads/main.zip",
        isUnpublished: true,
        author: "xuantruongg03",
        tags: ["web", "inspector", "developer", "debug", "devtools"],
    },
    {
        id: "audio-equalizer-booster-pro",
        name: "Audio Equalizer & Booster Pro",
        description: {
            en: "Professional 10-band audio equalizer with 30+ acoustic presets, clean volume boost up to 800% without distortion, 7D auto-pan surround effects, spatial sound virtualizer, and automatic per-website memory.",
            vi: "Bộ cân bằng âm thanh 10 băng tần chuyên nghiệp với hơn 30 preset tối ưu, khuếch đại âm lượng lên đến 800% chống rè tiếng, hiệu ứng xoay vòm 7D Auto-pan, âm thanh không gian và tự động nhớ cấu hình cho từng trang web.",
        },
        category: "utility",
        chromeUrl: "https://chromewebstore.google.com/detail/audio-equalizer-booster-p/afjahjpokoljjendbbacaldjaakncpdn",
        githubUrl: "https://github.com/xuantruongg03/audio-equalizer-booster-extension",
        author: "xuantruongg03",
        tags: ["audio", "equalizer", "booster", "sound", "volume"],
    },
    {
        id: "studocu-downloader",
        name: "StudoCu Downloader",
        description: {
            en: "One-click utility to save, convert, and view educational lecture notes, study guides, and university materials from Studocu into clean, high-resolution PDF documents effortlessly.",
            vi: "Công cụ hỗ trợ tải, chuyển đổi và lưu trữ tài liệu học tập, bài giảng, giáo trình từ Studocu thành file PDF độ nét cao phục vụ nghiên cứu và ôn tập một cách thuận tiện.",
        },
        category: "utility",
        githubUrl: "https://github.com/xuantruongg03/studocu-downloader",
        edgeUrl: "https://microsoftedge.microsoft.com/addons/detail/smartdoc-document-reade/ebgmdonkmcfmfpnafihgppnnbeljgegd",
        privacyPolicyUrl: "/privacy/studocu-downloader",
        author: "xuantruongg03",
        tags: ["studocu", "downloader", "education", "pdf"],
    },
    {
        id: "scribd-downloader",
        name: "Scribd Downloader",
        description: {
            en: "Download educational lecture notes, study guides, and university materials from Scribd into clean, high-resolution PDF documents effortlessly.",
            vi: "Công cụ hỗ trợ tải, chuyển đổi và lưu trữ tài liệu học tập, bài giảng, giáo trình từ Scribd thành file PDF độ nét cao phục vụ nghiên cứu và ôn tập một cách thuận tiện.",
        },
        category: "utility",
        githubUrl: "https://github.com/xuantruongg03/scribd-downloader",
        edgeUrl: "",
        zipDownloadUrl: "https://github.com/xuantruongg03/scribd-downloader/archive/refs/heads/main.zip",
        isUnpublished: true,
        author: "xuantruongg03",
        tags: ["scribd", "downloader", "education", "pdf"],
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
