import { MetadataRoute } from "next";
import { apps } from "@/constants/apps";

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
        "svg-preview",
        "png-to-svg",
        "latex-editor",
        "markdown-editor",
        "promo-image-generator",
        "pdf-converter",
        "image-compressor",
        "code-formatter",
        "mock-api-generator",
        "placeholder-image",
        "ip-lookup",
        "csv-converter",
        "text-encryption",
        "code-minifier",
        "dns-lookup",
        "fake-data-generator",
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

    locales.forEach((locale) => {
        sitemap.push({
            url: `${baseUrl}/${locale}/browser-extensions`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/browser-extensions`,
                    vi: `${baseUrl}/vi/browser-extensions`,
                    "x-default": `${baseUrl}/${defaultLocale}/browser-extensions`,
                },
            },
        });
    });

    // Add apps page for each locale
    locales.forEach((locale) => {
        sitemap.push({
            url: `${baseUrl}/${locale}/apps`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/apps`,
                    vi: `${baseUrl}/vi/apps`,
                    "x-default": `${baseUrl}/${defaultLocale}/apps`,
                },
            },
        });
    });

    // Add individual app detail pages for each locale
    apps.forEach((app) => {
        locales.forEach((locale) => {
            sitemap.push({
                url: `${baseUrl}/${locale}/apps/${app.id}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.6,
                alternates: {
                    languages: {
                        en: `${baseUrl}/en/apps/${app.id}`,
                        vi: `${baseUrl}/vi/apps/${app.id}`,
                        "x-default": `${baseUrl}/${defaultLocale}/apps/${app.id}`,
                    },
                },
            });
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
