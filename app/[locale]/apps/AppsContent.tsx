"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { appsTranslations } from "@/lib/i18n/pages/apps";
import { apps, appCategoryTranslations, type AppCategory, type App } from "@/constants/apps";

export default function AppsContent() {
    const { locale } = useLanguage();
    const t = appsTranslations[locale].apps.page;

    const [selectedCategory, setSelectedCategory] = useState<AppCategory | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedApp, setExpandedApp] = useState<string | null>(null);

    // Get unique categories from apps
    const activeCategories = useMemo(() => {
        const categories = new Set(apps.map((app) => app.category));
        return Array.from(categories) as AppCategory[];
    }, []);

    // Filter apps based on category and search
    const filteredApps = useMemo(() => {
        return apps.filter((app) => {
            const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
            const matchesSearch = searchQuery === "" || app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.description[locale].toLowerCase().includes(searchQuery.toLowerCase()) || app.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, locale]);

    // Group apps by category for display
    const groupedApps = useMemo(() => {
        if (selectedCategory !== "all") {
            return { [selectedCategory]: filteredApps };
        }
        return filteredApps.reduce(
            (acc, app) => {
                if (!acc[app.category]) {
                    acc[app.category] = [];
                }
                acc[app.category].push(app);
                return acc;
            },
            {} as Record<AppCategory, App[]>,
        );
    }, [filteredApps, selectedCategory]);

    return (
        <div className='max-w-7xl mx-auto'>
            {/* Hero Section */}
            <div className='text-center mb-12'>
                <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>{t.title}</h1>
                <p className='text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>{t.subtitle}</p>
            </div>

            {/* Search and Filter */}
            <div className='mb-8 space-y-4'>
                {/* Search Bar */}
                <div className='relative max-w-md mx-auto'>
                    <input type='text' placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all' />
                    <svg className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                </div>

                {/* Category Tabs */}
                <div className='flex flex-wrap justify-center gap-2'>
                    <button onClick={() => setSelectedCategory("all")} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === "all" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                        {t.allCategories}
                    </button>
                    {activeCategories.map((category) => (
                        <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                            {appCategoryTranslations[category][locale]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Apps Grid */}
            {filteredApps.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='text-6xl mb-4'>🔍</div>
                    <p className='text-gray-600 dark:text-gray-400 text-lg'>{t.noApps}</p>
                </div>
            ) : (
                <div className='space-y-12'>
                    {Object.entries(groupedApps).map(([category, categoryApps]) => (
                        <section key={category}>
                            {selectedCategory === "all" && <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3'>{appCategoryTranslations[category as AppCategory][locale]}</h2>}
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {categoryApps.map((app) => (
                                    <AppCard key={app.id} app={app} locale={locale} t={t} expanded={expandedApp === app.id} onToggleExpand={() => setExpandedApp(expandedApp === app.id ? null : app.id)} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}

            {/* Features Section */}
            <div className='mt-16 py-12 border-t border-gray-200 dark:border-gray-700'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white text-center mb-8'>{t.features.title}</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <div className='text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg'>
                        <div className='text-4xl mb-4'>✨</div>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>{t.features.curated.title}</h3>
                        <p className='text-gray-600 dark:text-gray-400'>{t.features.curated.description}</p>
                    </div>
                    <div className='text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg'>
                        <div className='text-4xl mb-4'>🌐</div>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>{t.features.cross.title}</h3>
                        <p className='text-gray-600 dark:text-gray-400'>{t.features.cross.description}</p>
                    </div>
                    <div className='text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg'>
                        <div className='text-4xl mb-4'>🛡️</div>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>{t.features.trusted.title}</h3>
                        <p className='text-gray-600 dark:text-gray-400'>{t.features.trusted.description}</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className='mt-12 text-center p-8 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>{t.cta.title}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>{t.cta.description}</p>
                <a href={`/${locale}/contact`} className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                    {t.cta.button}
                </a>
            </div>
        </div>
    );
}

// App Card Component
interface AppCardProps {
    app: App;
    locale: "en" | "vi";
    t: (typeof appsTranslations)["en"]["apps"]["page"];
    expanded: boolean;
    onToggleExpand: () => void;
}

function AppCard({ app, locale, t, expanded, onToggleExpand }: AppCardProps) {
    const router = useRouter();

    // Helper function để redirect qua trang trung gian
    const handleRedirect = (targetUrl: string) => {
        router.push(`/${locale}/redirect?url=${encodeURIComponent(targetUrl)}`);
    };

    // Get pricing badge
    const getPricingBadge = () => {
        if (app.isFree) {
            return <span className='px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full'>{t.free}</span>;
        } else if (app.hasFreeTier) {
            return <span className='px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full'>{t.freeTier}</span>;
        } else {
            return <span className='px-2 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full'>{t.paid}</span>;
        }
    };

    return (
        <article className='bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col h-full'>
            {/* Header */}
            <div className='flex items-start gap-4 mb-4'>
                {app.icon ? <img src={app.icon} alt={app.name} className='w-12 h-12 rounded-lg object-cover' /> : <div className='w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold'>{app.name.charAt(0)}</div>}
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                        <h3 className='font-semibold text-gray-900 dark:text-white text-lg truncate'>{app.name}</h3>
                        {getPricingBadge()}
                    </div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {t.by} {app.author}
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 grow'>{app.description[locale]}</p>

            {/* SEO Content (Expandable) */}
            {app.seo && (
                <div className='mb-4'>
                    <button onClick={onToggleExpand} className='text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1'>
                        {expanded ? "Hide details" : "Show details"}
                        <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                    </button>
                    {expanded && (
                        <div className='mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm space-y-3'>
                            <div>
                                <h4 className='font-medium text-gray-900 dark:text-white mb-1'>{t.seoSection.featuresTitle}</h4>
                                <ul className='list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1'>
                                    {app.seo[locale].features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className='font-medium text-gray-900 dark:text-white mb-1'>{t.seoSection.useCasesTitle}</h4>
                                <ul className='list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1'>
                                    {app.seo[locale].useCases.map((useCase, idx) => (
                                        <li key={idx}>{useCase}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tags */}
            {app.tags && app.tags.length > 0 && (
                <div className='flex flex-wrap gap-1 mb-4'>
                    {app.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className='px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full'>
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Platform Links */}
            <div className='flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700'>
                {/* View Details Button */}
                <Link href={`/${locale}/apps/${app.id}`} className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    {t.viewDetails}
                </Link>
                {app.windowsUrl && (
                    <button onClick={() => handleRedirect(app.windowsUrl!)} className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors cursor-pointer' title={t.windows}>
                        <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801' />
                        </svg>
                        {t.windows}
                    </button>
                )}
                {app.iosUrl && (
                    <button onClick={() => handleRedirect(app.iosUrl!)} className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer' title={t.ios}>
                        <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
                        </svg>
                        {t.ios}
                    </button>
                )}
            </div>
        </article>
    );
}
