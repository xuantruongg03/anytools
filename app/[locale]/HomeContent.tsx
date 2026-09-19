"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { useState, useEffect, useRef, useMemo } from "react";
import { allTools, toolsConfig } from "@/config/tools";
import { categoryTranslations } from "@/constants";
import Button from "@/components/ui/Button";
import { getCurrentYear } from "@/lib/utils/date";
import SuggestToolBanner from "@/components/SuggestToolBanner";

interface HomeContentProps {
    locale: "en" | "vi";
}

export default function HomeContent({ locale }: HomeContentProps) {
    const { setLocale } = useLanguage();
    const hasSynced = useRef(false);

    // Sync locale from URL only once
    useEffect(() => {
        if (!hasSynced.current) {
            setLocale(locale);
            hasSynced.current = true;
        }
    }, [locale, setLocale]);

    const t = getTranslation(locale);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"all" | "featured" | "favorites">("all");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [recents, setRecents] = useState<string[]>([]);

    // Load favorites and recents from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("anytools_favorites");
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
            const savedRecents = localStorage.getItem("anytools_recents");
            if (savedRecents) {
                setRecents(JSON.parse(savedRecents));
            }
        } catch (e) {
            // Ignore localStorage errors
        }
    }, []);

    const addRecent = (toolKey: string) => {
        setRecents((prev) => {
            const next = [toolKey, ...prev.filter((k) => k !== toolKey)].slice(0, 6);
            try {
                localStorage.setItem("anytools_recents", JSON.stringify(next));
            } catch (err) {}
            return next;
        });
    };

    // Toggle favorite tool
    const toggleFavorite = (toolKey: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setFavorites((prev) => {
            const next = prev.includes(toolKey)
                ? prev.filter((k) => k !== toolKey)
                : [...prev, toolKey];
            try {
                localStorage.setItem("anytools_favorites", JSON.stringify(next));
            } catch (err) {}
            return next;
        });
    };

    // Featured tool keys
    const featuredToolKeys = [
        "jsonFormatter",
        "cssUnitConverter",
        "wordCounter",
        "boxShadowGenerator",
        "cronGenerator",
        "jsonToTypes",
        "base64",
        "colorPicker",
        "hashGenerator",
        "chmodCalculator",
        "qrCodeGenerator",
        "passwordGenerator",
    ];

    // Build categories list directly from toolsConfig to prevent broken filters
    const categories = useMemo(() => {
        return toolsConfig.map((cat) => ({
            key: cat.key,
            icon: cat.icon,
            label: categoryTranslations[cat.key as keyof typeof categoryTranslations]?.[locale] || cat.key,
            count: cat.tools.length,
        }));
    }, [locale]);

    // Filter tools based on search, category, and view mode
    const filteredTools = useMemo(() => {
        return allTools.filter((tool) => {
            const toolData = t.tools[tool.key as keyof typeof t.tools] as {
                name?: string;
                description?: string;
            };

            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !query ||
                toolData?.name?.toLowerCase().includes(query) ||
                toolData?.description?.toLowerCase().includes(query) ||
                tool.key.toLowerCase().includes(query);

            // Find category
            const toolCategory = toolsConfig.find((cat) => cat.tools.some((t) => t.key === tool.key));
            const matchesCategory = !selectedCategory || toolCategory?.key === selectedCategory;

            // View mode filter
            if (viewMode === "favorites") {
                return matchesSearch && matchesCategory && favorites.includes(tool.key);
            }
            if (viewMode === "featured" && !selectedCategory && !searchQuery) {
                return featuredToolKeys.includes(tool.key);
            }

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory, viewMode, favorites, t]);

    const openCommandPalette = () => {
        window.dispatchEvent(new CustomEvent("toggle-command-palette"));
    };

    return (
        <>
            {/* Hero Section */}
            <section className='relative overflow-hidden py-16 md:py-24 px-4 text-center'>
                {/* Background ambient glow */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-600/15 dark:via-purple-600/15 dark:to-pink-600/15 blur-3xl -z-10 rounded-full pointer-events-none' />

                {/* Hero Badge */}
                <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6 shadow-2xs backdrop-blur-md'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                    <span>
                        {locale === "vi"
                            ? `${allTools.length}+ Công Cụ Miễn Phí • Cập Nhật Năm ${getCurrentYear()}`
                            : `${allTools.length}+ Free Online Tools • Updated for ${getCurrentYear()}`}
                    </span>
                </div>

                <h1 className='text-4xl md:text-6xl font-extrabold mb-5 text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight tracking-tight'>
                    {t.home.title}
                </h1>
                <p className='text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed'>
                    {t.home.subtitle}
                </p>

                {/* Search Input with Ctrl+K shortcut badge */}
                <div className='max-w-2xl mx-auto mb-8'>
                    <div className='relative group'>
                        <svg
                            className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                        <input
                            type='text'
                            placeholder={t.home.searchPlaceholder || "Search for any tool you need..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full pl-12 pr-28 py-4 text-base md:text-lg border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-400 shadow-md transition-all'
                        />
                        <button
                            onClick={openCommandPalette}
                            className='absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer hidden sm:block'
                            title={locale === "vi" ? "Mở bảng lệnh nhanh (Ctrl+K)" : "Open Command Palette (Ctrl+K)"}
                        >
                            Ctrl+K
                        </button>
                    </div>

                    {/* Recently Used Bar */}
                    {recents.length > 0 && !searchQuery && (
                        <div className='flex items-center justify-center gap-2 mt-3 flex-wrap text-xs animate-fadeIn'>
                            <span className='text-gray-400 dark:text-gray-500 flex items-center gap-1 font-medium'>
                                <span>🕒</span>
                                <span>{locale === "vi" ? "Gần đây:" : "Recent:"}</span>
                            </span>
                            {recents.map((toolKey) => {
                                const tool = allTools.find((t) => t.key === toolKey);
                                const toolData = (t.tools as any)?.[toolKey];
                                if (!tool || !toolData) return null;

                                return (
                                    <Link
                                        key={tool.href}
                                        href={`/${locale}${tool.href}`}
                                        className='inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-colors shadow-2xs hover:border-blue-500/50'
                                    >
                                        <span>{tool.icon}</span>
                                        <span className='font-medium truncate max-w-[140px]'>{toolData.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Category Pills (Dynamically generated & accurately mapped) */}
                <div className='flex items-center justify-center gap-2 flex-wrap max-w-4xl mx-auto'>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            selectedCategory === null
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                        {locale === "vi" ? "Tất cả" : "All Categories"} ({allTools.length})
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                                selectedCategory === cat.key
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                            <span className='opacity-60 text-[11px] font-mono'>({cat.count})</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Tools Catalog Main Section */}
            <main id='tools' className='container mx-auto px-4 py-8 max-w-6xl'>
                {/* View Tabs & Header */}
                <div className='flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800 flex-wrap gap-4'>
                    <div className='flex items-center gap-2'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                            {selectedCategory
                                ? `${categoryTranslations[selectedCategory as keyof typeof categoryTranslations]?.[locale] || selectedCategory} (${filteredTools.length})`
                                : searchQuery
                                ? `${filteredTools.length} ${t.home.availableTools}`
                                : viewMode === "favorites"
                                ? (locale === "vi" ? `Công cụ yêu thích (${filteredTools.length})` : `Favorites (${filteredTools.length})`)
                                : viewMode === "featured"
                                ? (locale === "vi" ? "Công cụ nổi bật" : "Featured Tools")
                                : (locale === "vi" ? `Tất cả công cụ (${allTools.length})` : `All Tools (${allTools.length})`)}
                        </h2>
                    </div>

                    {/* View mode toggle (All / Featured / Favorites) */}
                    <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold'>
                        <button
                            onClick={() => {
                                setViewMode("all");
                                setSelectedCategory(null);
                            }}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                viewMode === "all" && !selectedCategory
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            {locale === "vi" ? "Tất cả" : "All"}
                        </button>
                        <button
                            onClick={() => {
                                setViewMode("featured");
                                setSelectedCategory(null);
                            }}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                viewMode === "featured" && !selectedCategory
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            ⚡ {locale === "vi" ? "Nổi bật" : "Featured"}
                        </button>
                        <button
                            onClick={() => {
                                setViewMode("favorites");
                                setSelectedCategory(null);
                            }}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                                viewMode === "favorites"
                                    ? "bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            ⭐ {locale === "vi" ? "Yêu thích" : "Favorites"} ({favorites.length})
                        </button>
                    </div>

                    {(searchQuery || selectedCategory) && (
                        <Button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory(null);
                                setViewMode("all");
                            }}
                            variant='secondary'
                            size='sm'
                        >
                            {locale === "vi" ? "Xóa bộ lọc" : "Clear filters"}
                        </Button>
                    )}
                </div>

                {/* Tools Grid */}
                {filteredTools.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {filteredTools.map((tool) => {
                            const toolData = t.tools[tool.key as keyof typeof t.tools] as {
                                name?: string;
                                description?: string;
                                category?: string;
                            };
                            if (!toolData) return null;

                            const isFav = favorites.includes(tool.key);
                            const isNew = ["scribdDownloader", "boxShadowGenerator", "cssUnitConverter", "wordCounter", "cronGenerator", "jsonToTypes", "chmodCalculator"].includes(tool.key);

                            return (
                                <Link
                                    key={tool.href}
                                    href={`/${locale}${tool.href}`}
                                    onClick={() => addRecent(tool.key)}
                                    className='group relative block p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700/80 rounded-2xl hover:border-blue-500/60 dark:hover:border-blue-500/60 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200'
                                >
                                    <div className='flex items-start gap-4'>
                                        {/* Icon */}
                                        <div className='text-2xl shrink-0 w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 rounded-xl transition-colors'>
                                            {tool.icon}
                                        </div>

                                        {/* Content */}
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center justify-between gap-1 mb-1'>
                                                <span className='text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate'>
                                                    {toolData.category}
                                                </span>

                                                <div className='flex items-center gap-1.5'>
                                                    {isNew && (
                                                        <span className='px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-md uppercase'>
                                                            {locale === "vi" ? "Mới" : "New"}
                                                        </span>
                                                    )}

                                                    {/* Favorite Star Button */}
                                                    <button
                                                        onClick={(e) => toggleFavorite(tool.key, e)}
                                                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                                                            isFav
                                                                ? "text-amber-500 hover:text-amber-600"
                                                                : "text-gray-300 dark:text-gray-600 hover:text-amber-400"
                                                        }`}
                                                        aria-label={
                                                            isFav
                                                                ? locale === "vi"
                                                                    ? "Xóa khỏi danh sách yêu thích"
                                                                    : "Remove from favorites"
                                                                : locale === "vi"
                                                                ? "Thêm vào danh sách yêu thích"
                                                                : "Add to favorites"
                                                        }
                                                    >
                                                        ★
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className='text-base font-bold text-gray-900 dark:text-white mb-1.5 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                                                {toolData.name}
                                            </h3>

                                            <p className='text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'>
                                                {toolData.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className='text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700'>
                        <div className='text-4xl mb-3'>🔍</div>
                        <p className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
                            {locale === "vi" ? "Không tìm thấy công cụ phù hợp" : "No tools found matching your criteria"}
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                            {locale === "vi" ? "Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc." : "Try searching with different keywords or reset your filters."}
                        </p>
                        <Button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory(null);
                                setViewMode("all");
                            }}
                            variant='primary'
                            size='sm'
                        >
                            {locale === "vi" ? "Xem tất cả công cụ" : "View All Tools"}
                        </Button>
                    </div>
                )}
            </main>

            {/* Tool & Extension Suggestion Section */}
            <SuggestToolBanner />

            {/* Value Propositions Section */}
            <section className='container mx-auto px-4 py-16 max-w-5xl'>
                <div className='grid md:grid-cols-3 gap-6 text-center'>
                    <div className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs'>
                        <div className='text-3xl mb-3'>⚡</div>
                        <h3 className='font-bold mb-2 text-gray-900 dark:text-white'>{t.home.features.fast.title}</h3>
                        <p className='text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>{t.home.features.fast.description}</p>
                    </div>
                    <div className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs'>
                        <div className='text-3xl mb-3'>🔒</div>
                        <h3 className='font-bold mb-2 text-gray-900 dark:text-white'>{t.home.features.secure.title}</h3>
                        <p className='text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>{t.home.features.secure.description}</p>
                    </div>
                    <div className='p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs'>
                        <div className='text-3xl mb-3'>✨</div>
                        <h3 className='font-bold mb-2 text-gray-900 dark:text-white'>{t.home.features.free.title}</h3>
                        <p className='text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>{t.home.features.free.description}</p>
                    </div>
                </div>
            </section>
        </>
    );
}
