"use client";

import { Locale, locales } from "@/lib/i18n";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();

    return (
        <div className='flex items-center gap-2'>
            {locales.map((lang) => (
                <button key={lang} onClick={() => setLocale(lang)} className={`px-3 hover:cursor-pointer py-1.5 rounded text-sm font-medium transition-colors ${locale === lang ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"}`}>
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
