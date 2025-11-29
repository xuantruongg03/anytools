"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toolsConfig } from "@/config/tools";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { categoryTranslations } from "@/constants";

interface ToolsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ToolsSidebar({ isOpen, onClose }: ToolsSidebarProps) {
    const pathname = usePathname();
    const { locale } = useLanguage();
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    // Auto-expand category containing active tool
    useEffect(() => {
        const activeCategory = toolsConfig.find((category) => category.tools.some((tool) => pathname?.includes(tool.href)));
        if (activeCategory) {
            setExpandedCategories((prev) => new Set(prev).add(activeCategory.key));
        }
    }, [pathname]);

    const toggleCategory = (categoryKey: string) => {
        setExpandedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(categoryKey)) {
                newSet.delete(categoryKey);
            } else {
                newSet.add(categoryKey);
            }
            return newSet;
        });
    };

    const getCategoryLabel = (key: string) => {
        return categoryTranslations[key as keyof typeof categoryTranslations]?.[locale as "en" | "vi"] || key;
    };

    const getToolLabel = (key: string) => {
        return key
            .split(/(?=[A-Z])/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // Filter tools based on search query
    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return toolsConfig;

        const query = searchQuery.toLowerCase();
        return toolsConfig
            .map((category) => ({
                ...category,
                tools: category.tools.filter((tool) => {
                    const label = getToolLabel(tool.key).toLowerCase();
                    return label.includes(query);
                }),
            }))
            .filter((category) => category.tools.length > 0);
    }, [searchQuery, locale]);

    // Auto-expand categories when searching
    useEffect(() => {
        if (searchQuery.trim()) {
            const allCategoryKeys = filteredCategories.map((c) => c.key);
            setExpandedCategories(new Set(allCategoryKeys));
        }
    }, [searchQuery, filteredCategories]);

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && <div className='fixed inset-0 bg-black/50 z-40 lg:hidden' onClick={onClose} />}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 bottom-0 bg-white dark:bg-gray-800 
                    border-r border-gray-200 dark:border-gray-700
                    transition-all duration-300 ease-in-out z-30
                    overflow-y-auto w-64
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Header */}
                <div className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 pt-8 z-10 shrink-0'>
                    <div className='flex items-center justify-between mb-3'>
                        <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>{locale === "vi" ? "Công cụ" : "Tools"}</h2>
                        <button onClick={onClose} className='lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer dark:text-gray-100' aria-label='Close sidebar'>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className='relative'>
                        <input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={locale === "vi" ? "Tìm kiếm công cụ..." : "Search tools..."} className='w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        <svg className='absolute left-3 top-2.5 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className='absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Categories */}
                <nav className='p-4 space-y-2 pb-20'>
                    {searchQuery && filteredCategories.length === 0 && (
                        <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                            <svg className='w-12 h-12 mx-auto mb-2 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                            <p className='text-sm'>{locale === "vi" ? "Không tìm thấy công cụ" : "No tools found"}</p>
                        </div>
                    )}

                    {filteredCategories.map((category) => {
                        const isExpanded = expandedCategories.has(category.key);
                        const hasActiveTool = category.tools.some((tool) => pathname?.includes(tool.href));

                        return (
                            <div key={category.key} className='space-y-1'>
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(category.key)}
                                    className={`
                                        w-full flex items-center justify-between p-2.5 rounded-lg
                                        transition-colors text-left cursor-pointer
                                        ${hasActiveTool ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}
                                    `}
                                >
                                    <div className='flex items-center gap-3'>
                                        <span className='text-xl'>{category.icon}</span>
                                        <span className='font-medium text-sm'>{getCategoryLabel(category.key)}</span>
                                        <span className='text-xs text-gray-500 dark:text-gray-400'>({category.tools.length})</span>
                                    </div>
                                    <svg className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                    </svg>
                                </button>

                                {/* Tools List - Expanded */}
                                {isExpanded && (
                                    <div className='ml-6 space-y-1 animate-in slide-in-from-top-2 duration-200'>
                                        {category.tools.map((tool) => {
                                            const isActive = pathname?.includes(tool.href);
                                            return (
                                                <Link
                                                    key={tool.key}
                                                    href={`/${locale}${tool.href}`}
                                                    onClick={onClose}
                                                    className={`
                                                        flex items-center gap-2.5 p-2.5 rounded-lg
                                                        transition-colors group cursor-pointer
                                                        ${isActive ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"}
                                                    `}
                                                >
                                                    <span className='text-base shrink-0'>{tool.icon}</span>
                                                    <div className='flex-1 min-w-0'>
                                                        <div className={`text-sm font-medium ${isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"}`}>{getToolLabel(tool.key)}</div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
