/**
 * IndexNow API Integration
 * Protocol to instantly notify search engines about content changes
 * Supported by: Bing, Yandex, Seznam, Naver
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "e8f5b2c7a9d1456789abcdef12345678";
const SITE_HOST = "anytools.online";

interface IndexNowResponse {
    success: boolean;
    statusCode?: number;
    message?: string;
}

/**
 * Submit a single URL to IndexNow
 */
export async function submitUrlToIndexNow(url: string): Promise<IndexNowResponse> {
    return submitUrlsToIndexNow([url]);
}

/**
 * Submit multiple URLs to IndexNow (max 10,000 URLs per request)
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<IndexNowResponse> {
    if (urls.length === 0) {
        return { success: false, message: "No URLs provided" };
    }

    if (urls.length > 10000) {
        return { success: false, message: "Maximum 10,000 URLs per request" };
    }

    const payload = {
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
    };

    try {
        // Submit to Bing's IndexNow endpoint (will propagate to other search engines)
        const response = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(payload),
        });

        // IndexNow returns different status codes:
        // 200 - OK, URL submitted successfully
        // 202 - Accepted, URL received but not yet processed
        // 400 - Bad request, invalid format
        // 403 - Forbidden, key not valid
        // 422 - Unprocessable Entity, URLs don't match host
        // 429 - Too many requests

        if (response.status === 200 || response.status === 202) {
            return {
                success: true,
                statusCode: response.status,
                message: response.status === 200 ? "URLs submitted successfully" : "URLs accepted for processing",
            };
        }

        return {
            success: false,
            statusCode: response.status,
            message: `IndexNow returned status ${response.status}`,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Generate all tool URLs for IndexNow submission
 */
export function generateToolUrls(): string[] {
    const baseUrl = "https://anytools.online";
    const locales = ["en", "vi"];

    const tools = [
        "api-tester",
        "base64",
        "color-picker",
        "countdown",
        "css-unit-converter",
        "diff-checker",
        "gpa-calculator",
        "hash-generator",
        "html-entity-encoder",
        "image-to-text",
        "json-formatter",
        "jwt-decoder",
        "microphone-test",
        "number-converter",
        "password-generator",
        "qr-code-generator",
        "random-race",
        "random-wheel",
        "regex-tester",
        "remove-background",
        "repo-tree",
        "slideshare-downloader",
        "speech-to-text",
        "stopwatch",
        "studocu-downloader",
        "stun-turn-test",
        "tailwind-css",
        "text-case",
        "timestamp-converter",
        "url-encoder",
        "url-shortener",
        "uuid-generator",
        "weather",
        "world-clock",
        "svg-preview",
        "png-to-svg",
        "latex-editor",
        "markdown-editor",
        "promo-image-generator",
        "pdf-converter",
    ];

    const urls: string[] = [];

    // Add homepage for each locale
    locales.forEach((locale) => {
        const prefix = locale === "en" ? "" : `/${locale}`;
        urls.push(`${baseUrl}${prefix}`);

        // Add tools page
        urls.push(`${baseUrl}${prefix}/tools`);

        // Add each tool
        tools.forEach((tool) => {
            urls.push(`${baseUrl}${prefix}/tools/${tool}`);
        });
    });

    return urls;
}
