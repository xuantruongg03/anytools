"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { browserExtensionsTranslations } from "@/lib/i18n/pages/browser-extensions";
import { extensions, extensionCategoryTranslations, type ExtensionCategory, type Extension } from "@/constants/extensions";

export default function ExtensionsContent() {
    const { locale } = useLanguage();
    const t = browserExtensionsTranslations[locale].browserExtensions.page;
    const isVi = locale === "vi";

    const [selectedCategory, setSelectedCategory] = useState<ExtensionCategory | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedUrl(key);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    // Get unique categories from extensions
    const activeCategories = useMemo(() => {
        const categories = new Set(extensions.map((ext) => ext.category));
        return Array.from(categories) as ExtensionCategory[];
    }, []);

    // Filter extensions based on category and search
    const filteredExtensions = useMemo(() => {
        return extensions.filter((ext) => {
            const matchesCategory = selectedCategory === "all" || ext.category === selectedCategory;
            const matchesSearch =
                searchQuery === "" ||
                ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ext.description[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
                ext.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
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

    const scrollToDevGuide = () => {
        const el = document.getElementById("dev-mode-guide");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className='max-w-7xl mx-auto space-y-12 py-4'>
            {/* Hero Header */}
            <div className='text-center max-w-3xl mx-auto'>
                <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4 shadow-2xs'>
                    <span>🧩</span>
                    <span>{isVi ? "Tiện ích mở rộng cho Chrome, Edge & Firefox" : "Extensions for Chrome, Edge & Firefox"}</span>
                </div>
                <h1 className='text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4'>
                    {t.title}
                </h1>
                <p className='text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
                    {t.subtitle}
                </p>
            </div>

            {/* Search and Filter */}
            <div className='space-y-4 max-w-2xl mx-auto'>
                {/* Search Bar */}
                <div className='relative'>
                    <input
                        type='text'
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='w-full px-4 py-3 pl-11 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-xs text-sm'
                    />
                    <svg
                        className='absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                </div>

                {/* Category Pills */}
                <div className='flex flex-wrap justify-center gap-2'>
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            selectedCategory === "all"
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                    >
                        {t.allCategories} ({extensions.length})
                    </button>
                    {activeCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                selectedCategory === category
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                            {extensionCategoryTranslations[category][locale]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Extensions Catalog Grid (Displayed at the top) */}
            {filteredExtensions.length === 0 ? (
                <div className='text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 max-w-xl mx-auto'>
                    <div className='text-5xl mb-3'>🔍</div>
                    <p className='text-gray-800 dark:text-gray-200 font-bold text-lg mb-1'>{t.noExtensions}</p>
                    <p className='text-gray-500 dark:text-gray-400 text-xs mb-4'>
                        {isVi ? "Hãy thử tìm kiếm với từ khóa khác." : "Try searching with other keywords."}
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("all");
                        }}
                        className='px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl'
                    >
                        {isVi ? "Xem tất cả tiện ích" : "View all extensions"}
                    </button>
                </div>
            ) : (
                <div className='space-y-10'>
                    {Object.entries(groupedExtensions).map(([category, exts]) => (
                        <section key={category}>
                            {selectedCategory === "all" && (
                                <h2 className='text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2'>
                                    <span className='w-2 h-2 rounded-full bg-blue-600' />
                                    <span>{extensionCategoryTranslations[category as ExtensionCategory][locale]}</span>
                                    <span className='text-xs font-normal text-gray-500 dark:text-gray-400'>({exts.length})</span>
                                </h2>
                            )}
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {exts.map((extension) => (
                                    <ExtensionCard
                                        key={extension.id}
                                        extension={extension}
                                        locale={locale}
                                        t={t}
                                        onScrollToGuide={scrollToDevGuide}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}

            {/* Visual Developer Mode Installation Guide */}
            <section id='dev-mode-guide' className='mt-16 pt-12 border-t border-gray-200 dark:border-gray-800 space-y-8 scroll-mt-20'>
                <div className='max-w-3xl'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-bold mb-3 border border-amber-300 dark:border-amber-700/50'>
                        <span>🛠️</span>
                        <span>{isVi ? "Dành cho Extension chưa publish (Bản thử nghiệm)" : "For Unpublished Extensions (Developer Mode)"}</span>
                    </div>
                    <h2 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3'>
                        {isVi ? "Hướng dẫn cài đặt Extension trực tiếp qua Chế độ Nhà phát triển" : "How to Install Unpublished Extensions via Developer Mode"}
                    </h2>
                    <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed'>
                        {isVi
                            ? "Đối với các tiện ích đang trong giai đoạn thử nghiệm (như Web Inspector) chưa được đăng tải lên Chrome Web Store, bạn có thể dễ dàng cài đặt và trải nghiệm ngay trên Chrome, Edge, Brave, Cốc Cốc theo các bước trực quan dưới đây."
                            : "For extensions under active development that have not yet been listed on official stores, you can quickly run them locally using Chromium Developer Mode."}
                    </p>
                </div>

                {/* Interactive Browser Window Mockup */}
                <div className='rounded-2xl sm:rounded-3xl bg-gray-900 border border-gray-700/80 shadow-2xl overflow-hidden'>
                    {/* Browser Chrome Window Header */}
                    <div className='px-4 py-3 bg-gray-950/80 border-b border-gray-800 flex items-center justify-between gap-4 flex-wrap'>
                        {/* Traffic light dots */}
                        <div className='flex items-center gap-2'>
                            <span className='w-3 h-3 rounded-full bg-rose-500 inline-block' />
                            <span className='w-3 h-3 rounded-full bg-amber-500 inline-block' />
                            <span className='w-3 h-3 rounded-full bg-emerald-500 inline-block' />
                            <span className='ml-2 text-xs font-mono text-gray-400 font-medium hidden sm:inline'>
                                Extensions Manager
                            </span>
                        </div>

                        {/* URL Omnibox */}
                        <div className='flex-1 max-w-md mx-auto flex items-center justify-between px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-xs font-mono text-gray-300'>
                            <div className='flex items-center gap-2 truncate'>
                                <span className='text-emerald-400'>🔒</span>
                                <span className='truncate text-blue-400 font-semibold'>chrome://extensions</span>
                            </div>
                            <button
                                onClick={() => handleCopy("chrome://extensions", "chromeUrl")}
                                className='ml-2 text-[11px] font-sans px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors shrink-0'
                            >
                                {copiedUrl === "chromeUrl" ? "✓ Copied" : "Copy"}
                            </button>
                        </div>

                        <div className='text-xs text-gray-400 font-sans hidden sm:block'>
                            Edge: <code className='text-gray-300'>edge://extensions</code>
                        </div>
                    </div>

                    {/* Mockup Inside Page View */}
                    <div className='p-5 sm:p-8 bg-gray-900 text-gray-100 space-y-6'>
                        {/* Mockup Top Toolbar */}
                        <div className='p-4 rounded-xl bg-gray-800/80 border border-gray-700/80 flex items-center justify-between flex-wrap gap-4'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg font-bold'>
                                    🧩
                                </div>
                                <div>
                                    <div className='font-bold text-sm text-white'>Extensions</div>
                                    <div className='text-[11px] text-gray-400'>Quản lý tiện ích mở rộng</div>
                                </div>
                            </div>

                            {/* Developer mode switch mockup */}
                            <div className='flex items-center gap-3 bg-gray-900/90 px-3.5 py-2 rounded-xl border border-blue-500/50 shadow-inner'>
                                <span className='text-xs font-semibold text-gray-200'>
                                    {isVi ? "Chế độ dành cho nhà phát triển" : "Developer mode"}
                                </span>
                                <div className='w-10 h-5 bg-blue-600 rounded-full flex items-center justify-end px-0.5'>
                                    <div className='w-4 h-4 bg-white rounded-full shadow-sm' />
                                </div>
                                <span className='text-[11px] font-bold text-blue-400 uppercase'>ON</span>
                            </div>
                        </div>

                        {/* Action buttons with highlight */}
                        <div className='p-4 rounded-xl bg-gray-950/60 border border-dashed border-blue-500/40 space-y-3'>
                            <div className='text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2'>
                                <span className='text-amber-400'>⚡</span>
                                <span>{isVi ? "Thanh công cụ xuất hiện sau khi bật Developer Mode:" : "Action buttons visible after toggling ON:"}</span>
                            </div>

                            <div className='flex flex-wrap items-center gap-2.5'>
                                <div className='px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center gap-2 ring-2 ring-blue-400/50 shadow-lg shadow-blue-600/30 animate-pulse'>
                                    <span>📂</span>
                                    <span>{isVi ? "Tải tiện ích đã giải nén (Load unpacked)" : "Load unpacked"}</span>
                                    <span className='ml-1 text-[10px] bg-white/20 px-1 rounded font-normal'>Bước 3</span>
                                </div>
                                <div className='px-3 py-2 rounded-lg bg-gray-800 text-gray-400 text-xs opacity-60'>
                                    <span>Đóng gói tiện ích (Pack)</span>
                                </div>
                                <div className='px-3 py-2 rounded-lg bg-gray-800 text-gray-400 text-xs opacity-60'>
                                    <span>Cập nhật (Update)</span>
                                </div>
                            </div>
                        </div>

                        {/* Step Details Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 pt-2'>
                            <div className='p-4 rounded-xl bg-gray-800/60 border border-gray-700/60'>
                                <div className='w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-2'>
                                    1
                                </div>
                                <h4 className='font-bold text-xs sm:text-sm text-white mb-1'>
                                    {isVi ? "Mở Quản lý Tiện ích" : "Open Extensions"}
                                </h4>
                                <p className='text-xs text-gray-400 leading-relaxed'>
                                    {isVi ? "Gõ chrome://extensions vào thanh địa chỉ của trình duyệt." : "Navigate to chrome://extensions in your browser address bar."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-gray-800/60 border border-gray-700/60'>
                                <div className='w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-2'>
                                    2
                                </div>
                                <h4 className='font-bold text-xs sm:text-sm text-white mb-1'>
                                    {isVi ? "Bật Developer mode" : "Toggle Developer Mode"}
                                </h4>
                                <p className='text-xs text-gray-400 leading-relaxed'>
                                    {isVi ? "Gạt công tắc ở góc trên bên phải màn hình sang trạng thái BẬT." : "Enable the 'Developer mode' toggle in the top-right corner."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-gray-800/60 border border-gray-700/60'>
                                <div className='w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-2'>
                                    3
                                </div>
                                <h4 className='font-bold text-xs sm:text-sm text-white mb-1'>
                                    {isVi ? "Tải & Giải nén ZIP" : "Download & Unzip"}
                                </h4>
                                <p className='text-xs text-gray-400 leading-relaxed'>
                                    {isVi ? "Tải mã nguồn từ GitHub hoặc nút 'Tải .ZIP' rồi giải nén thư mục." : "Download the repository source ZIP and extract it to a local folder."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-gray-800/60 border border-gray-700/60'>
                                <div className='w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-2'>
                                    4
                                </div>
                                <h4 className='font-bold text-xs sm:text-sm text-white mb-1'>
                                    {isVi ? "Bấm Load Unpacked" : "Click Load Unpacked"}
                                </h4>
                                <p className='text-xs text-gray-400 leading-relaxed'>
                                    {isVi ? "Bấm nút 'Tải tiện ích đã giải nén' và chọn thư mục vừa giải nén để chạy." : "Click 'Load unpacked', select the extracted directory, and enjoy!"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features & Value Propositions Section */}
            <section className='pt-12 border-t border-gray-200 dark:border-gray-800'>
                <h2 className='text-2xl font-extrabold text-gray-900 dark:text-white text-center mb-8'>
                    {t.features.title}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='text-center p-6 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs'>
                        <div className='text-3xl mb-3'>✨</div>
                        <h3 className='text-base font-bold text-gray-900 dark:text-white mb-2'>
                            {t.features.curated.title}
                        </h3>
                        <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                            {t.features.curated.description}
                        </p>
                    </div>
                    <div className='text-center p-6 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs'>
                        <div className='text-3xl mb-3'>🆓</div>
                        <h3 className='text-base font-bold text-gray-900 dark:text-white mb-2'>
                            {t.features.free.title}
                        </h3>
                        <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                            {t.features.free.description}
                        </p>
                    </div>
                    <div className='text-center p-6 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs'>
                        <div className='text-3xl mb-3'>🛡️</div>
                        <h3 className='text-base font-bold text-gray-900 dark:text-white mb-2'>
                            {t.features.safe.title}
                        </h3>
                        <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                            {t.features.safe.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <div className='text-center p-8 sm:p-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/10 dark:to-purple-900/20 rounded-3xl border border-blue-100 dark:border-blue-800/40'>
                <h2 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2'>
                    {t.cta.title}
                </h2>
                <p className='text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-6'>
                    {t.cta.description}
                </p>
                <Link
                    href={`/${locale}/contact`}
                    className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/25'
                >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                    <span>{t.cta.button}</span>
                </Link>
            </div>
        </div>
    );
}

// Extension Card Component
interface ExtensionCardProps {
    extension: Extension;
    locale: "en" | "vi";
    t: (typeof browserExtensionsTranslations)["en"]["browserExtensions"]["page"];
    onScrollToGuide: () => void;
}

function ExtensionCard({ extension, locale, t, onScrollToGuide }: ExtensionCardProps) {
    const router = useRouter();
    const isVi = locale === "vi";

    const handleRedirect = (targetUrl: string) => {
        router.push(`/${locale}/redirect?url=${encodeURIComponent(targetUrl)}`);
    };

    const isUnpublished = extension.isUnpublished || (!extension.chromeUrl && !extension.firefoxUrl && !extension.edgeUrl);

    return (
        <article className='bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-2xs hover:shadow-xl hover:-translate-y-0.5 transition-all p-5 sm:p-6 flex flex-col h-full group'>
            {/* Header */}
            <div className='flex items-start gap-3.5 mb-3'>
                {extension.icon ? (
                    <img src={extension.icon} alt={extension.name} className='w-11 h-11 rounded-xl object-cover' />
                ) : (
                    <div className='w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-xs'>
                        {extension.name.charAt(0)}
                    </div>
                )}
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between gap-1'>
                        <h3 className='font-bold text-gray-900 dark:text-white text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                            {extension.name}
                        </h3>
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                        {t.by} {extension.author}
                    </p>
                </div>
            </div>

            {/* Unpublished Badge if applicable */}
            {isUnpublished && (
                <div className='mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 text-[11px] font-bold'>
                    <span>🧪</span>
                    <span>{isVi ? "Bản thử nghiệm (Cài qua Dev Mode)" : "In Development (Load Unpacked)"}</span>
                </div>
            )}

            {/* Description */}
            <p className='text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 grow leading-relaxed'>
                {extension.description[locale]}
            </p>

            {/* Tags */}
            {extension.tags && extension.tags.length > 0 && (
                <div className='flex flex-wrap gap-1.5 mb-4'>
                    {extension.tags.map((tag) => (
                        <span
                            key={tag}
                            className='px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-400 rounded-md'
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Action Links */}
            <div className='flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700/80 mt-auto'>
                {/* Published Store Buttons */}
                {extension.chromeUrl && (
                    <button
                        onClick={() => handleRedirect(extension.chromeUrl!)}
                        className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer'
                        title={t.chrome}
                    >
                        <svg className='w-3.5 h-3.5' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-3.952 6.848a12.014 12.014 0 0 0 9.229-9.606zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728z' />
                        </svg>
                        Chrome
                    </button>
                )}

                {extension.edgeUrl && (
                    <button
                        onClick={() => handleRedirect(extension.edgeUrl!)}
                        className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors cursor-pointer'
                        title={t.edge}
                    >
                        <svg className='w-3.5 h-3.5' viewBox='0 0 24 24' fill='currentColor'>
                            <path d='M21.86 17.86q.14 0 .25.12.1.13.08.25a7.24 7.24 0 0 1-.21.86q-.86 2.88-3.54 4.63Q15.92 25.15 12.34 25q-3.07-.07-5.5-1.68T3.2 18.77a10.27 10.27 0 0 1-.86-4.35q0-5.35 4.08-8.4a11.43 11.43 0 0 1 7.3-2.65q2.79 0 5.05 1.16 2.26 1.17 3.64 3.27 1.37 2.1 1.37 4.7 0 .56-.08 1.10-.07.54-.28 1.06-.2.51-.58.95-.38.43-1.01.75-.64.31-1.5.31H9.91q-.26 0-.37.15-.1.15-.1.37v.04q.15 1.87 1.58 3.04 1.44 1.17 3.41 1.17 1.48 0 2.75-.66t2.01-1.85q.15-.23.37-.32.22-.1.47-.10zM9.91 9.84q-2.3 0-3.84 1.65-1.53 1.65-1.53 4.33v.47q0 .19.15.35.15.17.36.17h7.51q.2 0 .35-.14.14-.14.14-.34 0-1.6-.82-2.96-.82-1.37-2.09-2.15-1.28-.78-2.75-.78z' />
                        </svg>
                        Edge
                    </button>
                )}

                {/* Unpublished direct helper action */}
                {isUnpublished && (
                    <>
                        <button
                            onClick={onScrollToGuide}
                            className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors cursor-pointer'
                        >
                            <span>⚡</span>
                            <span>{isVi ? "Cách cài đặt" : "How to install"}</span>
                        </button>
                        {extension.zipDownloadUrl && (
                            <a
                                href={extension.zipDownloadUrl}
                                download
                                className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors'
                            >
                                <span>📥</span>
                                <span>.ZIP</span>
                            </a>
                        )}
                    </>
                )}

                {/* GitHub Code */}
                {extension.githubUrl && (
                    <button
                        onClick={() => handleRedirect(extension.githubUrl!)}
                        className='inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer ml-auto'
                        title={t.sourceCode}
                    >
                        <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                        </svg>
                        <span>Git</span>
                    </button>
                )}

                {/* Privacy Policy */}
                {extension.privacyPolicyUrl && (
                    <Link
                        href={extension.privacyPolicyUrl}
                        className='text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors'
                    >
                        {t.privacyPolicy}
                    </Link>
                )}
            </div>
        </article>
    );
}
