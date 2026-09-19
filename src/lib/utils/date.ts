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
