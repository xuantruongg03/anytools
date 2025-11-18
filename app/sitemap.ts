import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://anytools.online";
    const locales = ["en", "vi"];

    const tools = ["json-formatter", "base64", "url-encoder", 
        "text-case", "color-picker", "hash-generator", "tailwind-css", 
        "stun-turn-test", "uuid-generator", "password-generator", "qr-code-generator", 
        "url-shortener", "timestamp-converter", "jwt-decoder", "diff-checker", "regex-tester", 
        "html-entity-encoder", "number-converter", "gpa-calculator", "lorem-ipsum", "repo-tree", 
        "api-tester", "microphone-test", "world-clock", "countdown", "stopwatch"];

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
                    },
                },
            });
        });
    });

    return sitemap;
}
