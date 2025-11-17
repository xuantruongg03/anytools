"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, defaultLocale } from "@/lib/i18n/config";

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        // Initialize from localStorage if available (client-side only)
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("locale") as Locale;
            if (saved && (saved === "en" || saved === "vi")) {
                return saved;
            }
        }
        return defaultLocale;
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("locale", newLocale);
        // Set cookie for middleware
        document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year
    };

    // Prevent hydration mismatch by not rendering children until mounted
    if (!mounted) {
        return <LanguageContext.Provider value={{ locale: defaultLocale, setLocale }}>{children}</LanguageContext.Provider>;
    }

    return <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
