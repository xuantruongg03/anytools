"use client";

import { usePathname, useRouter } from "next/navigation";
import { Locale, locales } from "@/lib/i18n";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();

    const handleLanguageChange = (newLocale: Locale) => {
        setLocale(newLocale);

        // Replace current locale in pathname with new locale
        const segments = pathname.split("/");
        if (segments[1] === "en" || segments[1] === "vi") {
            segments[1] = newLocale;
        } else {
            segments.splice(1, 0, newLocale);
        }

        const newPath = segments.join("/");
        router.push(newPath);
    };

    return (
        <div className='flex items-center gap-2'>
            {locales.map((lang) => (
                <button key={lang} onClick={() => handleLanguageChange(lang)} className={`px-3 hover:cursor-pointer py-1.5 rounded text-sm font-medium transition-colors ${locale === lang ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-gray-100"}`}>
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
