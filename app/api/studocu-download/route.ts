import { NextRequest, NextResponse } from "next/server";
import { SLIDESHARE_URL_PATTERN } from "@/constants/regex";
import { withErrorHandler } from "@/lib/utils/api-wrapper";

const RAPIDAPI_KEY = process.env.NEXT_RAPIDAPI_KEY;

interface SlideShareDownloadRequest {
    url: string;
    format: "pdf" | "ppt";
}

// Try RapidAPI SlideShare Downloader
async function downloadWithRapidAPI(url: string, format: string) {
    if (!RAPIDAPI_KEY) {
        throw new Error("RapidAPI key not configured");
    }

    const response = await fetch("https://slideshare-downloader-pro.p.rapidapi.com/slideshare.php", {
        method: "POST",
        headers: {
            "x-rapidapi-key": RAPIDAPI_KEY,
            "x-rapidapi-host": "slideshare-downloader-pro.p.rapidapi.com",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `url=${encodeURIComponent(url)}`,
    });

    if (!response.ok) {
        throw new Error(`RapidAPI request failed: ${response.status}`);
    }

    const result = await response.json();

    // Extract download URL from various possible response formats
    const downloadUrl = result.downloadUrl || result.download_url || result.url || result.link;
    const filename = result.filename || result.title || `anytools-slideshare-${Date.now()}.${format}`;

    if (!downloadUrl) {
        throw new Error("No download URL in RapidAPI response");
    }

    return { url: downloadUrl, filename };
}

async function handleStudocuDownload(request: NextRequest) {
    const body: SlideShareDownloadRequest = await request.json();
    const { url, format } = body;

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!SLIDESHARE_URL_PATTERN.test(url)) {
        return NextResponse.json({ error: "Invalid SlideShare URL" }, { status: 400 });
    }

    let result: { url?: string; blob?: Blob; filename: string } | null = null;
    const errors: string[] = [];

    // Try RapidAPI first if key is available
    if (RAPIDAPI_KEY) {
        try {
            console.log("[Download] Trying RapidAPI...");
            result = await downloadWithRapidAPI(url, format);
            console.log("[Download] RapidAPI succeeded");
        } catch (rapidError) {
            const errorMsg = rapidError instanceof Error ? rapidError.message : "Unknown error";
            console.log("[Download] RapidAPI failed:", errorMsg);
            errors.push(`RapidAPI: ${errorMsg}`);
        }
    }

    // If all methods failed, throw error
    if (!result) {
        throw new Error(`All download methods failed. Details: ${errors.join(", ")}`);
    }

    // Check if result has URL or blob
    if (result.url) {
        // Return JSON with URL for frontend to open
        return NextResponse.json({
            url: result.url,
            filename: result.filename,
            format: format,
        });
    } else if (result.blob) {
        // Return file directly
        return new NextResponse(result.blob, {
            headers: {
                "Content-Type": format === "pdf" ? "application/pdf" : "application/vnd.ms-powerpoint",
                "Content-Disposition": `attachment; filename="${result.filename}"`,
            },
        });
    } else {
        throw new Error("No URL or blob returned from download method");
    }
}

export const POST = withErrorHandler(handleStudocuDownload, "/api/studocu-download");
