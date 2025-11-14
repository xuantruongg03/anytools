"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, defaultLocale } from "@/lib/i18n/config";

type LanguageContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(defaultLocale);

    useEffect(() => {
        // Load saved language from localStorage
        const saved = localStorage.getItem("locale") as Locale;
        if (saved && (saved === "en" || saved === "vi")) {
            setLocaleState(saved);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("locale", newLocale);
    };

    return <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
