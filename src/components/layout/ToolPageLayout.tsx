"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ToolsSidebar from "./ToolsSidebar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toolsConfig } from "@/config/tools";
import { ToolJsonLd } from "@/components/seo/ToolJsonLd";

interface ToolPageLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

/**
 * Standard layout for tool pages
 * Provides consistent heading style with breadcrumbs and centered title
 * Includes responsive sidebar with all tools categorized and automatic JSON-LD schema
 */
export default function ToolPageLayout({ title, description, children }: ToolPageLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { locale } = useLanguage();

    // Find category for breadcrumbs
    const currentCategory = toolsConfig.find((cat) =>
        cat.tools.some((tool) => pathname?.includes(tool.href))
    );

    const canonicalUrl = `https://anytools.online${pathname}`;

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden'>
            {/* Automatic SEO Structured Data */}
            <ToolJsonLd
                name={title}
                description={description}
                url={canonicalUrl}
                categoryName={currentCategory?.key || "Tools"}
                categoryUrl={`https://anytools.online/${locale}#tools`}
                locale={locale}
            />

            {/* Sidebar */}
            <ToolsSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className='lg:pl-64 transition-all duration-300'>
                <div className='container max-w-6xl mx-auto px-4 py-6 md:py-8'>
                    {/* Mobile Sidebar Trigger & Breadcrumbs */}
                    <div className='flex items-center justify-between gap-3 mb-6 flex-wrap'>
                        {/* Breadcrumbs */}
                        <nav aria-label='Breadcrumb' className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 flex-wrap'>
                            <Link href={`/${locale}`} className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                {locale === "vi" ? "Trang chủ" : "Home"}
                            </Link>
                            <span>/</span>
                            {currentCategory && (
                                <>
                                    <span className='capitalize font-medium text-gray-700 dark:text-gray-300'>
                                        {currentCategory.key}
                                    </span>
                                    <span>/</span>
                                </>
                            )}
                            <span className='font-semibold text-blue-600 dark:text-blue-400 truncate max-w-[200px]'>
                                {title}
                            </span>
                        </nav>

                        {/* Mobile Sidebar Button */}
                        <div className='lg:hidden'>
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className='flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors cursor-pointer'
                                aria-label='Open tools sidebar'
                            >
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                                </svg>
                                <span>{locale === "vi" ? "Kho công cụ" : "Tools List"}</span>
                            </button>
                        </div>
                    </div>

                    {/* Centered Heading Section */}
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl md:text-4xl font-extrabold mb-3 text-gray-900 dark:text-gray-100 tracking-tight'>
                            {title}
                        </h1>
                        <p className='text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'>
                            {description}
                        </p>
                    </div>

                    {/* Tool Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}

