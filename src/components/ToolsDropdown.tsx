"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { toolsConfig } from "@/config/tools";
import { useIsMobile } from "@/lib/hooks";

export function ToolsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const isMobile = useIsMobile();
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const mainTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setExpandedCategory(null);
                setHoveredCategory(null);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleMainMouseEnter = () => {
        if (isMobile) return;
        if (mainTimeoutRef.current) {
            clearTimeout(mainTimeoutRef.current);
        }
        setIsOpen(true);
    };

    const handleMainMouseLeave = () => {
        if (isMobile) return;
        mainTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
            setHoveredCategory(null);
        }, 100);
    };

    const handleButtonClick = () => {
        if (isMobile) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                setExpandedCategory(null);
            }
        }
    };

    const handleCategoryClick = (categoryKey: string) => {
        if (isMobile) {
            setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey);
        }
    };

    useEffect(() => {
        return () => {
            if (mainTimeoutRef.current) {
                clearTimeout(mainTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div ref={dropdownRef} className='relative' onMouseEnter={handleMainMouseEnter} onMouseLeave={handleMainMouseLeave}>
            {/* Trigger Button */}
            <button onClick={handleButtonClick} className='flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium'>
                <span>{t.header.tools}</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
            </button>

            {/* Dropdown Menu - Categories */}
            {isOpen && (
                <div className={`absolute top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-fadeIn ${isMobile ? "left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-md max-h-[80vh] overflow-y-auto" : "left-0 w-56"}`}>
                    {toolsConfig.map((category) => (
                        <div key={category.key} className='relative group/item'>
                            {/* Category Item */}
                            <div className='flex items-center justify-between px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer' onMouseEnter={() => !isMobile && setHoveredCategory(category.key)} onClick={() => handleCategoryClick(category.key)}>
                                <div className='flex items-center gap-3'>
                                    <span className='text-xl'>{category.icon}</span>
                                    <span className='font-medium text-sm text-gray-900 dark:text-gray-100 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400'>{t.home.categories[category.key as keyof typeof t.home.categories]}</span>
                                </div>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isMobile && expandedCategory === category.key ? "rotate-90" : ""}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                                </svg>
                            </div>

                            {/* Submenu - Tools (Desktop: Flyout, Mobile: Accordion) */}
                            {((isMobile && expandedCategory === category.key) || (!isMobile && hoveredCategory === category.key)) && (
                                <div className={isMobile ? "bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700" : "absolute left-full top-0 ml-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl animate-fadeIn z-50"} onMouseEnter={() => !isMobile && setHoveredCategory(category.key)} onMouseLeave={() => !isMobile && setHoveredCategory(null)}>
                                    <div className={`py-1 ${isMobile ? "" : "max-h-[60vh] overflow-y-auto"}`} style={isMobile ? {} : { scrollbarWidth: "thin", scrollbarColor: "rgb(156 163 175) transparent" }}>
                                        {category.tools.map((tool) => {
                                            const toolData = t.tools[tool.key as keyof typeof t.tools] as any;
                                            const name = toolData.name || toolData.page?.title || tool.key;
                                            const description = toolData.description || toolData.page?.subtitle || "";
                                            return (
                                                <Link
                                                    key={tool.href}
                                                    href={`/${locale}${tool.href}`}
                                                    className='flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group'
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        setExpandedCategory(null);
                                                        setHoveredCategory(null);
                                                    }}
                                                >
                                                    <span className='text-xl shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors'>{tool.icon}</span>
                                                    <div className='flex-1 min-w-0'>
                                                        <div className='font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate'>{name}</div>
                                                        <div className='text-xs text-gray-500 dark:text-gray-400 truncate' title={description}>
                                                            {description}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* View All Tools Link */}
                    {/* <div className='border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'>
                        <Link href={`/${locale}/#tools`} className='block px-4 py-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'>
                            {t.header.viewAllTools} →
                        </Link>
                    </div> */}
                </div>
            )}
        </div>
    );
}
