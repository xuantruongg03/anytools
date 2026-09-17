"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { ToolsDropdown } from "./ToolsDropdown";
import { MobileNavDrawer } from "./MobileNavDrawer";

export function Header() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const openCommandPalette = () => {
        window.dispatchEvent(new CustomEvent("toggle-command-palette"));
    };

    return (
        <>
            <header className='border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 sticky top-0 z-40 backdrop-blur-md'>
                <div className='max-w-7xl mx-auto px-4'>
                    <nav className='flex items-center justify-between h-16 gap-4'>
                        {/* Left: Logo */}
                        <div className='flex items-center gap-6'>
                            <Link
                                href={`/${locale}`}
                                className='text-2xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-85 transition-opacity tracking-tight'
                            >
                                AnyTools
                            </Link>

                            {/* Search Trigger Button */}
                            <button
                                onClick={openCommandPalette}
                                className='hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800/90 hover:bg-gray-200 dark:hover:bg-gray-700/80 border border-gray-200/80 dark:border-gray-700/80 rounded-xl text-xs text-gray-500 dark:text-gray-400 transition-all cursor-pointer shadow-2xs'
                                aria-label='Quick Search'
                            >
                                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                                <span>{locale === "vi" ? "Tìm kiếm..." : "Quick search..."}</span>
                                <kbd className='px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 font-semibold'>
                                    Ctrl+K
                                </kbd>
                            </button>
                        </div>

                        {/* Navigation Links - Desktop */}
                        <div className='hidden lg:flex items-center gap-1 text-sm font-medium'>
                            <Link
                                href={`/${locale}`}
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                            >
                                {t?.header.home}
                            </Link>

                            <ToolsDropdown />

                            <Link
                                href={`/${locale}/browser-extensions`}
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                            >
                                {t?.header.extensions}
                            </Link>

                            <Link
                                href={`/${locale}/apps`}
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                            >
                                {t?.header.apps}
                            </Link>

                            <Link
                                href={`/${locale}/about`}
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                            >
                                {t?.header.about}
                            </Link>

                            <Link
                                href={`/${locale}/contact`}
                                className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                            >
                                {t?.header.contact}
                            </Link>
                        </div>

                        {/* Right: Theme, Language, Search Mobile & Mobile Menu */}
                        <div className='flex items-center gap-2'>
                            {/* Mobile search icon button */}
                            <button
                                onClick={openCommandPalette}
                                className='sm:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer'
                                aria-label='Search'
                            >
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                            </button>

                            <ThemeToggle />
                            <div className='hidden sm:block'>
                                <LanguageSwitcher />
                            </div>

                            {/* Mobile Hamburger Button */}
                            <button
                                onClick={() => setMobileDrawerOpen(true)}
                                className='lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer'
                                aria-label='Open Navigation Menu'
                            >
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                                </svg>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Mobile Slide-Over Drawer */}
            <MobileNavDrawer
                isOpen={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
            />
        </>
    );
}
