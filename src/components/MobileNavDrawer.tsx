"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface MobileNavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const pathname = usePathname();

    // Close on route change
    useEffect(() => {
        onClose();
    }, [pathname]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const navLinks = [
        { href: `/${locale}`, label: t?.header?.home || "Home", icon: "🏠" },
        { href: `/${locale}#tools`, label: t?.header?.tools || "Tools", icon: "⚡" },
        { href: `/${locale}/browser-extensions`, label: t?.header?.extensions || "Extensions", icon: "🧩" },
        { href: `/${locale}/apps`, label: t?.header?.apps || "Apps", icon: "📱" },
        { href: `/${locale}/about`, label: t?.header?.about || "About", icon: "ℹ️" },
        { href: `/${locale}/contact`, label: t?.header?.contact || "Contact", icon: "✉️" },
        { href: `/${locale}/donate`, label: locale === "vi" ? "Ủng Hộ" : "Donate", icon: "☕" },
    ];

    return (
        <div className='fixed inset-0 z-50 md:hidden'>
            {/* Backdrop */}
            <div
                className='fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity'
                onClick={onClose}
            />

            {/* Slide-over Content */}
            <div className='fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-gray-900 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto z-10 border-l border-gray-200 dark:border-gray-800 animate-fadeIn'>
                <div>
                    {/* Header */}
                    <div className='flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800'>
                        <Link
                            href={`/${locale}`}
                            onClick={onClose}
                            className='text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                        >
                            AnyTools
                        </Link>
                        <button
                            onClick={onClose}
                            className='p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg cursor-pointer'
                            aria-label='Close menu'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className='mt-6 space-y-1.5'>
                        {navLinks.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                >
                                    <span className='text-lg'>{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Controls: Language & Theme */}
                <div className='pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>
                            {locale === "vi" ? "Giao diện & Ngôn ngữ" : "Theme & Language"}
                        </span>
                        <div className='flex items-center gap-2'>
                            <ThemeToggle />
                            <LanguageSwitcher />
                        </div>
                    </div>
                    <p className='text-xs text-gray-400 text-center'>
                        100% Free & Open Source
                    </p>
                </div>
            </div>
        </div>
    );
}
