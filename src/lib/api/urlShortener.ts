// URL Shortening API - Client Side
// API keys are secured on the server side (app/api/shorten/route.ts)

/**
 * Shorten a URL using the Next.js API route (secure)
 * @param longUrl - The URL to shorten
 * @returns Object containing the shortened URL and service name
 */
export const shortenUrl = async (longUrl: string): Promise<{ shortUrl: string; service: string }> => {
    const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: longUrl }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to shorten URL");
    }

    return await response.json();
};

/**
 * Validate URL format on client side
 * @param url - The URL to validate
 * @returns true if valid, false otherwise
 */
export const validateUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
        return false;
    }
};
