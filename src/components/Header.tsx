"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    return (
        <header className='border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-40 backdrop-blur'>
            <div className='container mx-auto px-4'>
                <nav className='flex items-center justify-between h-16'>
                    {/* Logo */}
                    <Link href={t.home.url} className='text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                        AnyTools
                    </Link>

                    {/* Navigation Links */}
                    <div className='flex items-center gap-4'>
                        <Link href={t.about.url} className='text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden md:block'>
                            {t.about.title}
                        </Link>

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
