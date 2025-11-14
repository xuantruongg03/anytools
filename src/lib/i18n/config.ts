export const locales = ["en", "vi"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}
