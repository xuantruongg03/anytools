/**
 * Common date & time utilities for AnyTools
 */

/**
 * Returns the current calendar year dynamically
 * Use this in metadata, page titles, descriptions, and SEO tags instead of hardcoding years
 */
export function getCurrentYear(): number {
    return new Date().getFullYear();
}

/**
 * Helper to append current year to SEO titles
 */
export function withCurrentYear(title: string): string {
    const year = getCurrentYear();
    // If title already has 2024, 2025, 2026..., replace it with current year
    return title.replace(/\b202[0-9]\b/g, String(year));
}

/**
 * Formats a YYYY-MM-DD date string nicely according to locale
 */
export function formatUpdateDate(dateStr?: string, locale: string = "vi"): string {
    if (!dateStr) return "";
    try {
        const [year, month, day] = dateStr.split("-");
        if (!year || !month || !day) return dateStr;
        if (locale === "vi") {
            return `${day}/${month}/${year}`;
        }
        return `${month}/${day}/${year}`;
    } catch {
        return dateStr;
    }
}

