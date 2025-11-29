export const categoryTranslations = {
    developer: { en: "Developer", vi: "Công cụ Dev" },
    design: { en: "Design", vi: "Thiết kế" },
    text: { en: "Text", vi: "Công cụ Văn bản" },
    security: { en: "Security", vi: "Bảo mật" },
    downloader: { en: "Downloader", vi: "Tải xuống" },
    education: { en: "Education", vi: "Giáo dục" },
    productivity: { en: "Productivity", vi: "Năng suất" },
    multimedia: { en: "Multimedia", vi: "Đa phương tiện" },
    fun: { en: "Fun & Games", vi: "Giải trí" },
    weather: { en: "Weather", vi: "Thời tiết" },
} as const;

export type CategoryKey = keyof typeof categoryTranslations;
