"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { ToolsDropdown } from "./ToolsDropdown";

export function Header() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    return (
        <header className='border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900 sticky top-0 z-50 backdrop-blur-md'>
            <div className='max-w-7xl mx-auto px-4'>
                <nav className='flex items-center justify-between h-16'>
                    {/* Logo */}
                    <Link href={`/${locale}`} className='text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity'>
                        AnyTools
                    </Link>

                    {/* Navigation Links - Center */}
                    <div className='flex items-center gap-2 absolute left-1/2 -translate-x-1/2'>
                        {/* Home Link - Hidden on mobile */}
                        <Link href={`/${locale}`} className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:block font-medium'>
                            {t?.header.home}
                        </Link>

                        {/* Tools Dropdown */}
                        <ToolsDropdown />

                        {/* About Link */}
                        <Link href={`/${locale}/about`} className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:block font-medium'>
                            {t?.header.about}
                        </Link>

                        {/* Extensions Link */}
                        <Link href={`/${locale}/browser-extensions`} className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:block font-medium'>
                            {t?.header.extensions}
                        </Link>

                        {/* Apps Link */}
                        <Link href={`/${locale}/apps`} className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:block font-medium'>
                            {t?.header.apps}
                        </Link>

                        {/* Contact Link */}
                        <Link href={`/${locale}/contact`} className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:block font-medium'>
                            {t?.header.contact}
                        </Link>
                    </div>

                    {/* Theme & Language - Right */}
                    <div className='flex items-center gap-2'>
                        {/* Divider */}
                        <div className='w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 hidden md:block'></div>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Language Switcher */}
                        <LanguageSwitcher />
                    </div>
                </nav>
            </div>
        </header>
    );
}
