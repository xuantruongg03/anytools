"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ToolsSidebar from "./ToolsSidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toolsConfig, allTools } from "@/config/tools";
import { categoryTranslations } from "@/constants";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";
import { toast } from "@/components/ui/Toast";
import SuggestToolBanner from "@/components/SuggestToolBanner";
import { openSuggestModal } from "@/components/SuggestModal";

interface ToolPageLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

/**
 * Standard professional layout for all tool pages
 * Features a modern studio header, ambient lighting, quick action bar,
 * breadcrumbs with icons, and automatic JSON-LD SEO schema.
 */
export default function ToolPageLayout({ title, description, children }: ToolPageLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    // Find current tool & category
    const currentTool = allTools.find((tool) => pathname?.includes(tool.href));
    const currentCategory = toolsConfig.find((cat) =>
        cat.tools.some((tool) => pathname?.includes(tool.href))
    );

    const [isFav, setIsFav] = useState(false);

    // Sync favorite state
    useEffect(() => {
        if (!currentTool) return;
        try {
            const saved = localStorage.getItem("anytools_favorites");
            if (saved) {
                const list: string[] = JSON.parse(saved);
                setIsFav(list.includes(currentTool.key));
            }
        } catch {}
    }, [currentTool]);

    const toggleFavorite = () => {
        if (!currentTool) return;
        try {
            const saved = localStorage.getItem("anytools_favorites");
            const list: string[] = saved ? JSON.parse(saved) : [];
            const next = list.includes(currentTool.key)
                ? list.filter((k) => k !== currentTool.key)
                : [...list, currentTool.key];

            localStorage.setItem("anytools_favorites", JSON.stringify(next));
            setIsFav(next.includes(currentTool.key));

            if (next.includes(currentTool.key)) {
                toast.success(
                    locale === "vi" ? "Đã thêm vào danh sách yêu thích! ⭐" : "Added to favorites! ⭐"
                );
            } else {
                toast.info(
                    locale === "vi" ? "Đã xóa khỏi danh sách yêu thích" : "Removed from favorites"
                );
            }
        } catch {}
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success(
                isVi ? "Đã sao chép liên kết công cụ! 🔗" : "Tool URL copied to clipboard! 🔗"
            );
        } catch {
            toast.error(isVi ? "Không thể sao chép liên kết" : "Failed to copy link");
        }
    };

    const canonicalUrl = `https://anytools.online${pathname}`;

    return (
        <div className='relative min-h-screen bg-slate-50/70 dark:bg-gray-950 transition-colors'>
            {/* Ambient Lighting / Mesh Glow */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent dark:from-blue-600/15 dark:via-purple-600/10 dark:to-transparent blur-3xl -z-10 pointer-events-none' />

            {/* Automatic SEO Structured Data */}
            <ToolJsonLd
                name={title}
                description={description}
                url={canonicalUrl}
                categoryName={currentCategory?.key || "Tools"}
                categoryUrl={`https://anytools.online/${locale}#tools`}
                locale={locale}
            />

            {/* Flex container for Sticky Sidebar & Studio Content */}
            <div className='flex items-start'>
                {/* Sidebar for Navigation (In-flow sticky on desktop, stops above footer) */}
                <ToolsSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Studio Content */}
                <div className='flex-1 min-w-0 transition-all duration-300'>
                    <div className='container max-w-6xl mx-auto px-4 py-6 md:py-8'>
                    {/* Top Bar: Breadcrumbs & Mobile Sidebar Button */}
                    <div className='flex items-center justify-between gap-3 mb-6 flex-wrap'>
                        {/* Breadcrumbs */}
                        <nav
                            aria-label={isVi ? "Điều hướng trang" : "Breadcrumb"}
                            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200/80 dark:border-gray-800/80 text-xs text-gray-500 dark:text-gray-400 shadow-2xs flex-wrap'
                        >
                            <Link
                                href={`/${locale}`}
                                className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-medium'
                            >
                                <span>🏠</span>
                                <span>{isVi ? "Trang chủ" : "Home"}</span>
                            </Link>

                            <span className='text-gray-300 dark:text-gray-600'>/</span>

                            {currentCategory && (
                                <>
                                    <Link
                                        href={`/${locale}#tools`}
                                        className='capitalize font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1'
                                    >
                                        <span>{currentCategory.icon}</span>
                                        <span>
                                            {categoryTranslations[currentCategory.key as keyof typeof categoryTranslations]?.[locale as "en" | "vi"] || currentCategory.key}
                                        </span>
                                    </Link>
                                    <span className='text-gray-300 dark:text-gray-600'>/</span>
                                </>
                            )}

                            <span className='font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[200px]'>
                                {title}
                            </span>
                        </nav>

                        {/* Top Action Bar */}
                        <div className='flex items-center gap-2'>
                            {/* Suggest Feature / Tool Button */}
                            <button
                                onClick={() => openSuggestModal("suggest")}
                                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer shadow-2xs'
                                title={isVi ? "Đề xuất tính năng hoặc công cụ mới" : "Suggest a new tool or feature"}
                            >
                                <span>💡</span>
                                <span className='hidden sm:inline'>{isVi ? "Gợi ý" : "Suggest"}</span>
                            </button>

                            {/* Favorite Button */}
                            {currentTool && (
                                <button
                                    onClick={toggleFavorite}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                                        isFav
                                            ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400"
                                            : "bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                    title={
                                        isFav
                                            ? isVi
                                                ? "Xóa khỏi danh sách yêu thích"
                                                : "Remove from favorites"
                                            : isVi
                                            ? "Thêm vào danh sách yêu thích"
                                            : "Add to favorites"
                                    }
                                >
                                    <span>{isFav ? "⭐" : "☆"}</span>
                                    <span className='hidden sm:inline'>
                                        {isFav
                                            ? isVi
                                                ? "Đã thích"
                                                : "Saved"
                                            : isVi
                                            ? "Yêu thích"
                                            : "Favorite"}
                                    </span>
                                </button>
                            )}

                            {/* Share Tool Button */}
                            <button
                                onClick={handleShare}
                                className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer shadow-2xs'
                                title={isVi ? "Sao chép liên kết công cụ" : "Share tool URL"}
                            >
                                <span>🔗</span>
                                <span className='hidden sm:inline'>{isVi ? "Chia sẻ" : "Share"}</span>
                            </button>

                            {/* Mobile Sidebar Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className='lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl shadow-xs text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer'
                                aria-label={isVi ? "Mở danh sách công cụ" : "Open tools sidebar"}
                            >
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M4 6h16M4 12h16M4 18h16'
                                    />
                                </svg>
                                <span>{isVi ? "Kho công cụ" : "All Tools"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Tool Studio Hero Header */}
                    <header className='text-center mb-8 pt-2'>
                        {/* Tool Icon & Badge */}
                        {currentTool && (
                            <div className='inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border border-blue-500/20 dark:border-blue-400/30 text-3xl mb-4 shadow-sm font-bold text-blue-600 dark:text-blue-400 font-mono'>
                                <span>{currentTool.icon}</span>
                            </div>
                        )}

                        <h1 className='text-3xl md:text-5xl font-extrabold mb-3 text-gray-900 dark:text-white tracking-tight leading-tight'>
                            {title}
                        </h1>

                        <p className='text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-4'>
                            {description}
                        </p>

                        {/* Feature Badges */}
                        <div className='flex items-center justify-center gap-2 flex-wrap text-[11px] font-medium text-gray-500 dark:text-gray-400'>
                            <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300'>
                                <span>⚡</span>
                                <span>{locale === "vi" ? "Chạy Trong Trình Duyệt" : "100% Client-Side"}</span>
                            </span>
                            <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300'>
                                <span>🔒</span>
                                <span>{locale === "vi" ? "Không Lưu Dữ Liệu" : "Zero Data Tracking"}</span>
                            </span>
                            <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300'>
                                <span>✨</span>
                                <span>{locale === "vi" ? "Miễn Phí & Không Quảng Cáo" : "Free & No Ads"}</span>
                            </span>
                        </div>
                    </header>

                    {/* Tool Workspace Container */}
                    <main className='relative z-10'>
                        {children}
                    </main>

                    {/* Community Tool & Extension Suggestion Banner */}
                    <SuggestToolBanner />
                </div>
            </div>
        </div>
    </div>
    );
}
