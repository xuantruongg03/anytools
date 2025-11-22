import { NextRequest, NextResponse } from "next/server";
import { SLIDESHARE_URL_PATTERN } from "@/constants/regex";

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

    return await response.json();
}

export async function POST(request: NextRequest) {
    try {
        const body: SlideShareDownloadRequest = await request.json();
        const { url, format } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        if (!SLIDESHARE_URL_PATTERN.test(url)) {
            return NextResponse.json({ error: "Invalid SlideShare URL" }, { status: 400 });
        }

        if (!RAPIDAPI_KEY) {
            return NextResponse.json({ error: "API key not configured" }, { status: 503 });
        }

        // Get download URL from RapidAPI
        const result = await downloadWithRapidAPI(url, format);

        // Check various possible response formats
        const downloadUrl = result.downloadUrl || result.download_url || result.url || result.link;

        if (!downloadUrl) {
            throw new Error("No download URL in API response");
        }

        // Fetch the file from the download URL
        const fileResponse = await fetch(downloadUrl);

        if (!fileResponse.ok) {
            throw new Error("Failed to download file from source");
        }

        const blob = await fileResponse.blob();
        const filename = result.filename || result.title || `slideshare-${Date.now()}.${format}`;

        // Return file directly to user
        return new NextResponse(blob, {
            headers: {
                "Content-Type": format === "pdf" ? "application/pdf" : "application/vnd.ms-powerpoint",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}
