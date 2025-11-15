// URL Shortening API Configuration and Services

interface ShortenerService {
    name: string;
    shorten: (url: string) => Promise<string>;
}

// Configure all URL shortening services
export const urlShortenerServices: ShortenerService[] = [
    // Nhóm 1: Priority (No API key required)
    {
        name: "TinyURL",
        shorten: async (url: string): Promise<string> => {
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error("TinyURL service unavailable");
            return await response.text();
        },
    },
    {
        name: "is.gd",
        shorten: async (url: string): Promise<string> => {
            const response = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error("is.gd service unavailable");
            const result = await response.text();
            if (result.includes("Error")) throw new Error(result);
            return result;
        },
    },
    {
        name: "v.gd",
        shorten: async (url: string): Promise<string> => {
            const response = await fetch(`https://v.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error("v.gd service unavailable");
            const result = await response.text();
            if (result.includes("Error")) throw new Error(result);
            return result;
        },
    },
    // Nhóm 2: Optional API key services
    {
        name: "T.ly",
        shorten: async (url: string): Promise<string> => {
            const apiKey = process.env.NEX_TLY_API_KEY;
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
            if (apiKey) {
                headers["Authorization"] = `Bearer ${apiKey}`;
            }

            const response = await fetch("https://t.ly/api/v1/link/shorten", {
                method: "POST",
                headers,
                body: JSON.stringify({ long_url: url }),
            });

            if (!response.ok) throw new Error("T.ly service unavailable");
            const data = await response.json();
            return data.short_url || data.url;
        },
    },
    {
        name: "Cutt.ly",
        shorten: async (url: string): Promise<string> => {
            const apiKey = process.env.NEXT_CUTTLY_API_KEY || "free";
            const response = await fetch(`https://cutt.ly/api/api.php?key=${apiKey}&short=${encodeURIComponent(url)}`);

            if (!response.ok) throw new Error("Cutt.ly service unavailable");
            const data = await response.json();
            if (data.url?.status === 7) {
                return data.url.shortLink;
            }
            throw new Error(data.url?.title || "Cutt.ly failed");
        },
    },
    // Nhóm 3: Fallback
    {
        name: "CleanURI",
        shorten: async (url: string): Promise<string> => {
            const response = await fetch("https://cleanuri.com/api/v1/shorten", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `url=${encodeURIComponent(url)}`,
            });

            if (!response.ok) throw new Error("CleanURI service unavailable");
            const data = await response.json();
            if (data.result_url) return data.result_url;
            throw new Error("CleanURI failed");
        },
    },
];

// Validate URL format
export const validateUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
        return false;
    }
};

// Try shortening with fallback logic
export const shortenWithFallback = async (longUrl: string): Promise<{ shortUrl: string; service: string }> => {
    if (!validateUrl(longUrl)) {
        throw new Error("Please enter a valid URL (must start with http:// or https://)");
    }

    let lastError: Error | null = null;

    for (const service of urlShortenerServices) {
        try {
            console.log(`Trying ${service.name}...`);
            const shortUrl = await service.shorten(longUrl);
            return {
                shortUrl: shortUrl.trim(),
                service: service.name,
            };
        } catch (err) {
            console.warn(`${service.name} failed:`, err);
            lastError = err as Error;
            // Continue to next service
        }
    }

    throw new Error(lastError?.message || "All shortening services are currently unavailable. Please try again later.");
};
