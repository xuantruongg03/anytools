import { NextRequest, NextResponse } from "next/server";
import { submitUrlsToIndexNow, generateToolUrls, submitUrlToIndexNow } from "@/lib/indexnow";

// Secret key to protect the API (set in environment variables)
const API_SECRET = process.env.INDEXNOW_API_SECRET || "your-secret-key";

/**
 * POST /api/indexnow
 * Submit URLs to IndexNow
 *
 * Body options:
 * - { submitAll: true } - Submit all tool URLs
 * - { urls: ["https://..."] } - Submit specific URLs
 * - { url: "https://..." } - Submit a single URL
 */
export async function POST(request: NextRequest) {
    // Verify authorization
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${API_SECRET}`) {
        console.log("Unauthorized access attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Submit all tool URLs
        if (body.submitAll) {
            const urls = generateToolUrls();
            const result = await submitUrlsToIndexNow(urls);
            return NextResponse.json({
                ...result,
                urlCount: urls.length,
            });
        }

        // Submit multiple URLs
        if (body.urls && Array.isArray(body.urls)) {
            const result = await submitUrlsToIndexNow(body.urls);
            return NextResponse.json({
                ...result,
                urlCount: body.urls.length,
            });
        }

        // Submit single URL
        if (body.url && typeof body.url === "string") {
            const result = await submitUrlToIndexNow(body.url);
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: "Invalid request body. Provide 'submitAll', 'urls', or 'url'" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

/**
 * GET /api/indexnow?url=...
 * Quick way to submit a single URL (requires secret in query)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const secret = searchParams.get("secret");

    if (secret !== API_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!url) {
        return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    const result = await submitUrlToIndexNow(url);
    return NextResponse.json(result);
}
