import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/utils/api-wrapper";
import { getClientIp } from "@/lib/utils/get-client-ip";

const ISSUU_URL_PATTERN = /^https?:\/\/(www\.)?issuu\.com\/[a-zA-Z0-9_-]+\/docs\/[a-zA-Z0-9_-]+/i;

interface IssuuDownloadRequest {
    url: string;
    format?: "pdf";
}

async function fetchIssuuMetadata(url: string) {
    // 1. Try Issuu oEmbed API
    const oembedUrl = `https://issuu.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Issuu publication metadata: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

async function handleIssuuDownload(request: NextRequest) {
    const body: IssuuDownloadRequest = await request.json();
    const { url, format = "pdf" } = body;

    if (!url || !url.trim()) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!ISSUU_URL_PATTERN.test(url.trim())) {
        return NextResponse.json(
            { error: "Invalid Issuu URL. Format should be: https://issuu.com/<user>/docs/<document-name>" },
            { status: 400 }
        );
    }

    try {
        const clientIp = getClientIp(request);
        console.log(`[Issuu Downloader] Request from IP ${clientIp} for: ${url}`);

        let metadata: any = null;
        try {
            metadata = await fetchIssuuMetadata(url.trim());
        } catch (e) {
            console.warn("oEmbed fetch failed, continuing with fallback metadata:", e);
        }

        const match = url.match(/issuu\.com\/([a-zA-Z0-9_-]+)\/docs\/([a-zA-Z0-9_-]+)/i);
        const user = match ? match[1] : "author";
        const docSlug = match ? match[2] : "publication";

        const title = metadata?.title || docSlug.replace(/[-_]/g, " ");
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9-_]/g, "-").substring(0, 50);
        const filename = `anytools-${sanitizedTitle}-${Date.now()}.${format}`;
        const thumbnail = metadata?.thumbnail_url || "";

        return NextResponse.json({
            success: true,
            title,
            author: metadata?.author_name || user,
            thumbnail,
            url: url.trim(),
            filename,
            format,
            message: "Issuu publication processed successfully.",
        });
    } catch (error) {
        console.error("[Issuu Downloader Error]:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to process Issuu download",
            },
            { status: 500 }
        );
    }
}

export const POST = withErrorHandler(handleIssuuDownload, "/api/issuu-download");
