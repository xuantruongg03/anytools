import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
const PAGESPEED_API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

// Simple in-memory rate limiting (per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 50; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return false;
    }

    if (record.count >= RATE_LIMIT) {
        return true;
    }

    record.count++;
    return false;
}

function isValidUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

// CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function POST(request: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown";

        // Check rate limit
        if (isRateLimited(ip)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Rate limit exceeded. Please try again later.",
                },
                { status: 429, headers: corsHeaders }
            );
        }

        // Check if API key is configured
        if (!API_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    error: "PageSpeed API key is not configured.",
                },
                { status: 500, headers: corsHeaders }
            );
        }

        // Parse request body
        const body = await request.json();
        const { url, strategy = "mobile" } = body;

        // Validate URL
        if (!url) {
            return NextResponse.json(
                {
                    success: false,
                    error: "URL is required.",
                },
                { status: 400, headers: corsHeaders }
            );
        }

        if (!isValidUrl(url)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid URL format. Please provide a valid HTTP or HTTPS URL.",
                },
                { status: 400, headers: corsHeaders }
            );
        }

        // Validate strategy
        if (strategy && !["mobile", "desktop"].includes(strategy)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid strategy. Must be "mobile" or "desktop".',
                },
                { status: 400, headers: corsHeaders }
            );
        }

        // Build API URL with parameters
        const params = new URLSearchParams({
            url,
            key: API_KEY,
            strategy,
        });

        // Add multiple category parameters
        const categories = ["performance", "seo", "accessibility", "best-practices"];
        categories.forEach((category) => params.append("category", category));

        const apiUrl = `${PAGESPEED_API_URL}?${params.toString()}`;
        
        // Debug logging
        console.log("API_KEY exists:", !!API_KEY);
        console.log("API_KEY length:", API_KEY?.length);
        console.log("Full API URL:", apiUrl.replace(API_KEY || "", "***"));

        // Call Google PageSpeed Insights API
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        const data = await response.json();

        // Handle Google API errors
        if (!response.ok) {
            const errorMessage = data?.error?.message || "Failed to fetch PageSpeed data";
            const errorCode = data?.error?.code || response.status;

            // Handle specific error codes
            if (response.status === 429) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Google API rate limit exceeded. Please try again later.",
                    },
                    { status: 429, headers: corsHeaders }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    error: errorMessage,
                    code: errorCode,
                },
                { status: response.status, headers: corsHeaders }
            );
        }

        // Return successful response with formatted data
        return NextResponse.json(
            {
                success: true,
                data: {
                    lighthouseResult: {
                        requestedUrl: data.lighthouseResult?.requestedUrl,
                        finalUrl: data.lighthouseResult?.finalUrl,
                        fetchTime: data.lighthouseResult?.fetchTime,
                        categories: data.lighthouseResult?.categories,
                        audits: data.lighthouseResult?.audits,
                    },
                    loadingExperience: data.loadingExperience,
                    originLoadingExperience: data.originLoadingExperience,
                    analysisUTCTimestamp: data.analysisUTCTimestamp,
                },
            },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error("Web inspect API error:", error);

        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid request body. Please provide valid JSON.",
                },
                { status: 400, headers: corsHeaders }
            );
        }

        // Handle network errors
        if (error instanceof TypeError && error.message.includes("fetch")) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to connect to Google PageSpeed API. Please try again.",
                },
                { status: 503, headers: corsHeaders }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "An unexpected error occurred.",
            },
            { status: 500, headers: corsHeaders }
        );
    }
}
