import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://anytools.online";
    const locales = ["en", "vi"];
    const defaultLocale = "en";

    // All tools - synced with tools.ts
    const tools = [
        "api-tester",
        "base64",
        "color-picker",
        "countdown",
        "css-unit-converter",
        "diff-checker",
        "gpa-calculator",
        "hash-generator",
        "html-entity-encoder",
        "image-to-text",
        "json-formatter",
        "jwt-decoder",
        "microphone-test",
        "number-converter",
        "password-generator",
        "qr-code-generator",
        "random-race",
        "random-wheel",
        "regex-tester",
        "remove-background",
        "repo-tree",
        "slideshare-downloader",
        "speech-to-text",
        "stopwatch",
        "studocu-downloader",
        "stun-turn-test",
        "tailwind-css",
        "text-case",
        "timestamp-converter",
        "url-encoder",
        "url-shortener",
        "uuid-generator",
        "weather",
        "world-clock",
    ];

    const sitemap: MetadataRoute.Sitemap = [];

    // Add homepage for each locale
    locales.forEach((locale) => {
        sitemap.push({
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
            alternates: {
                languages: {
                    en: `${baseUrl}/en`,
                    vi: `${baseUrl}/vi`,
                    "x-default": `${baseUrl}/${defaultLocale}`,
                },
            },
        });
    });

    // Add about page for each locale
    locales.forEach((locale) => {
        sitemap.push({
            url: `${baseUrl}/${locale}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/about`,
                    vi: `${baseUrl}/vi/about`,
                    "x-default": `${baseUrl}/${defaultLocale}/about`,
                },
            },
        });
    });

    // Add donate page for each locale
    locales.forEach((locale) => {
        sitemap.push({
            url: `${baseUrl}/${locale}/donate`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/donate`,
                    vi: `${baseUrl}/vi/donate`,
                    "x-default": `${baseUrl}/${defaultLocale}/donate`,
                },
            },
        });
    });

    // Add all tools for each locale
    tools.forEach((tool) => {
        locales.forEach((locale) => {
            sitemap.push({
                url: `${baseUrl}/${locale}/tools/${tool}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.9,
                alternates: {
                    languages: {
                        en: `${baseUrl}/en/tools/${tool}`,
                        vi: `${baseUrl}/vi/tools/${tool}`,
                        "x-default": `${baseUrl}/${defaultLocale}/tools/${tool}`,
                    },
                },
            });
        });
    });

    return sitemap;
}
