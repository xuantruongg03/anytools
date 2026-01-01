"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { browserExtensionsTranslations } from "@/lib/i18n/pages/browser-extensions";
import { extensions, extensionCategoryTranslations, type ExtensionCategory, type Extension } from "@/constants/extensions";

export default function ExtensionsContent() {
    const { locale } = useLanguage();
    const t = browserExtensionsTranslations[locale].browserExtensions.page;

    const [selectedCategory, setSelectedCategory] = useState<ExtensionCategory | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Get unique categories from extensions
    const activeCategories = useMemo(() => {
        const categories = new Set(extensions.map((ext) => ext.category));
        return Array.from(categories) as ExtensionCategory[];
    }, []);

    // Filter extensions based on category and search
    const filteredExtensions = useMemo(() => {
        return extensions.filter((ext) => {
            const matchesCategory = selectedCategory === "all" || ext.category === selectedCategory;
            const matchesSearch = searchQuery === "" || ext.name.toLowerCase().includes(searchQuery.toLowerCase()) || ext.description[locale].toLowerCase().includes(searchQuery.toLowerCase()) || ext.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, locale]);

    // Group extensions by category for display
    const groupedExtensions = useMemo(() => {
        if (selectedCategory !== "all") {
            return { [selectedCategory]: filteredExtensions };
        }
        return filteredExtensions.reduce(
            (acc, ext) => {
                if (!acc[ext.category]) {
                    acc[ext.category] = [];
                }
                acc[ext.category].push(ext);
                return acc;
            },
            {} as Record<ExtensionCategory, Extension[]>
        );
    }, [filteredExtensions, selectedCategory]);

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
                            {extensionCategoryTranslations[category][locale]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Extensions Grid */}
            {filteredExtensions.length === 0 ? (
                <div className='text-center py-12'>
                    <div className='text-6xl mb-4'>🔍</div>
                    <p className='text-gray-600 dark:text-gray-400 text-lg'>{t.noExtensions}</p>
                </div>
            ) : (
                <div className='space-y-12'>
                    {Object.entries(groupedExtensions).map(([category, exts]) => (
                        <section key={category}>
                            {selectedCategory === "all" && <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3'>{extensionCategoryTranslations[category as ExtensionCategory][locale]}</h2>}
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {exts.map((extension) => (
                                    <ExtensionCard key={extension.id} extension={extension} locale={locale} t={t} />
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
                        <div className='text-4xl mb-4'>🆓</div>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>{t.features.free.title}</h3>
                        <p className='text-gray-600 dark:text-gray-400'>{t.features.free.description}</p>
                    </div>
                    <div className='text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg'>
                        <div className='text-4xl mb-4'>🛡️</div>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>{t.features.safe.title}</h3>
                        <p className='text-gray-600 dark:text-gray-400'>{t.features.safe.description}</p>
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

// Extension Card Component
interface ExtensionCardProps {
    extension: Extension;
    locale: "en" | "vi";
    t: (typeof browserExtensionsTranslations)["en"]["browserExtensions"]["page"];
}

function ExtensionCard({ extension, locale, t }: ExtensionCardProps) {
    return (
        <article className='bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col h-full'>
            {/* Header */}
            <div className='flex items-start gap-4 mb-4'>
                {extension.icon ? <img src={extension.icon} alt={extension.name} className='w-12 h-12 rounded-lg object-cover' /> : <div className='w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold'>{extension.name.charAt(0)}</div>}
                <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-gray-900 dark:text-white text-lg truncate'>{extension.name}</h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {t.by} {extension.author}
                    </p>
                </div>
            </div>

            {/* Description */}
            <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 grow'>{extension.description[locale]}</p>

            {/* Tags */}
            {extension.tags && extension.tags.length > 0 && (
                <div className='flex flex-wrap gap-1 mb-4'>
                    {extension.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className='px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full'>
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Links */}
            <div className='flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700'>
                {extension.chromeUrl && (
                    <a href={extension.chromeUrl} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors' title={t.chrome}>
                        <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-3.952 6.848a12.014 12.014 0 0 0 9.229-9.606zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728z' />
                        </svg>
                        Chrome
                    </a>
                )}
                {extension.firefoxUrl && (
                    <a href={extension.firefoxUrl} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors' title={t.firefox}>
                        <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M12.006 0a12.188 12.188 0 0 0-4.126.721c.122.047.478.197.602.255 1.266.598 2.156 1.441 2.769 2.064l.098.103a9.154 9.154 0 0 1 .581.674c-.077-.025-.156-.046-.234-.072a7.428 7.428 0 0 0-2.199-.434c-.734-.035-1.29.039-1.553.074l-.013.002a8.046 8.046 0 0 0-.542.087 6.332 6.332 0 0 0-.628.161 5.352 5.352 0 0 0-.201.065 4.63 4.63 0 0 0-.108.04c-1.692.628-3.095 1.9-3.641 3.073-.074.158-.211.498-.26.631l-.016.046c-.006.02-.032.102-.032.102l.019-.052a7.086 7.086 0 0 0-.2.739l-.001.003a8.68 8.68 0 0 0-.141.749c-.037.274-.065.554-.083.83l-.007.1a10.583 10.583 0 0 0-.01.577l.004.155v.074A11.987 11.987 0 0 0 12.006 24a11.987 11.987 0 0 0 11.987-11.977l.001-.169v-.019A11.987 11.987 0 0 0 12.006 0z' />
                        </svg>
                        Firefox
                    </a>
                )}
                {extension.edgeUrl && (
                    <a href={extension.edgeUrl} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors' title={t.edge}>
                        <svg className='w-4 h-4' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M21.86 17.86q.14 0 .25.12.1.13.08.25a7.24 7.24 0 0 1-.21.86q-.86 2.88-3.54 4.63Q15.92 25.15 12.34 25q-3.07-.07-5.5-1.68T3.2 18.77a10.27 10.27 0 0 1-.86-4.35q0-5.35 4.08-8.4a11.43 11.43 0 0 1 7.3-2.65q2.79 0 5.05 1.16 2.26 1.17 3.64 3.27 1.37 2.1 1.37 4.7 0 .56-.08 1.1-.07.54-.28 1.06-.2.51-.58.95-.38.43-1.01.75-.64.31-1.5.31H9.91q-.26 0-.37.15-.1.15-.1.37v.04q.15 1.87 1.58 3.04 1.44 1.17 3.41 1.17 1.48 0 2.75-.66t2.01-1.85q.15-.23.37-.32.22-.1.47-.1zM9.91 9.84q-2.3 0-3.84 1.65-1.53 1.65-1.53 4.33v.47q0 .19.15.35.15.17.36.17h7.51q.2 0 .35-.14.14-.14.14-.34 0-1.6-.82-2.96-.82-1.37-2.09-2.15-1.28-.78-2.75-.78z' />
                        </svg>
                        Edge
                    </a>
                )}
                {extension.githubUrl && (
                    <a href={extension.githubUrl} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors' title={t.sourceCode}>
                        <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                        </svg>
                        GitHub
                    </a>
                )}
                {extension.privacyPolicyUrl && (
                    <a href={extension.privacyPolicyUrl} className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors' title={t.privacyPolicy}>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                        </svg>
                        {t.privacyPolicy}
                    </a>
                )}
            </div>
        </article>
    );
}
