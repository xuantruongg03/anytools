import { MetadataRoute } from "next";
import { apps } from "@/constants/apps";
import { allTools } from "@/config/tools";

export const revalidate = 86400; // Refresh sitemap daily

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://anytools.online";
    const locales = ["en", "vi"];
    const defaultLocale = "en";

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
    allTools.forEach((tool) => {
        const slug = tool.href.replace("/tools/", "");
        const lastMod = tool.updatedAt ? new Date(tool.updatedAt) : new Date();
        locales.forEach((locale) => {
            sitemap.push({
                url: `${baseUrl}/${locale}/tools/${slug}`,
                lastModified: lastMod,
                changeFrequency: "weekly",
                priority: 0.9,
                alternates: {
                    languages: {
                        en: `${baseUrl}/en/tools/${slug}`,
                        vi: `${baseUrl}/vi/tools/${slug}`,
                        "x-default": `${baseUrl}/${defaultLocale}/tools/${slug}`,
                    },
                },
            });
        });
    });

    return sitemap;
}
