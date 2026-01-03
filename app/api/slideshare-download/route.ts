import { NextRequest, NextResponse } from "next/server";
import { SLIDESHARE_URL_PATTERN } from "@/constants/regex";
import { withErrorHandler } from "@/lib/utils/api-wrapper";
import { tryServicesWithFallback } from "@/lib/utils/service-fallback";
import { getClientIp } from "@/lib/utils/get-client-ip";

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

async function downloadWithSlideSaver(url: string, format: string) {
    // Step 1: Get images from SlideSaver
    const getImagesResponse = await fetch(`https://slidesaver.app/api/get-images?url=${encodeURIComponent(url)}`);

    if (!getImagesResponse.ok) {
        throw new Error(`SlideSaver get-images failed: ${getImagesResponse.status}`);
    }

    const imagesData = await getImagesResponse.json();

    if (!imagesData.all_slides || imagesData.all_slides.length === 0) {
        throw new Error("No slides found");
    }

    // Use quality 638 (medium quality) - balance between quality and size
    const selectedSlides = imagesData.all_slides.find((slide: any) => slide.quality === "638") || imagesData.all_slides[1] || imagesData.all_slides[0];

    if (!selectedSlides || !selectedSlides.images || selectedSlides.images.length === 0) {
        throw new Error("No images found in slides");
    }

    // Step 2: Request file generation from SlideSaver
    const getSlideResponse = await fetch("https://slidesaver.app/api/get-slide", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            images: selectedSlides.images,
            type: format,
        }),
    });

    if (!getSlideResponse.ok) {
        throw new Error(`SlideSaver get-slide failed: ${getSlideResponse.status}`);
    }

    const slideResult = await getSlideResponse.json();

    if (!slideResult.download_url) {
        throw new Error("No download URL returned from SlideSaver");
    }

    // Return URL directly instead of downloading
    const title = imagesData.title || "slideshare";
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9-_]/g, "-").substring(0, 50);
    const filename = `anytools-${sanitizedTitle}-${Date.now()}.${format}`;

    return { url: slideResult.download_url, filename };
}

// Fetch fresh nonce from SlideSilo homepage
async function getSlideSiloNonce(): Promise<string> {
    const response = await fetch("https://slidesilo.com/", {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch SlideSilo homepage: ${response.status}`);
    }

    const html = await response.text();

    // Look for nonce in various patterns
    const noncePatterns = [/nonce["'\s:]+["']?([a-f0-9]{10})["']?/i, /ajax_nonce["'\s:]+["']?([a-f0-9]{10})["']?/i, /"nonce":"([a-f0-9]{10})"/i];

    for (const pattern of noncePatterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    // Fallback to hardcoded nonce if extraction fails
    console.warn("Could not extract SlideSilo nonce, using fallback");
    return "ef601f88b6";
}

async function downloadWithSlideSilo(url: string, format: string) {
    const SLIDESILO_BASE = "https://slidesilo.com/wp-admin/admin-ajax.php";

    // Fetch fresh nonce
    const NONCE = await getSlideSiloNonce();

    // Step 1: Cancel any previous generation
    const cancelResponse = await fetch(SLIDESILO_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `action=cancel_generation&nonce=${NONCE}`,
    });

    if (!cancelResponse.ok) {
        throw new Error(`SlideSilo cancel failed: ${cancelResponse.status}`);
    }

    // Step 2: Fetch slides from SlideShare
    const quality = "sd"; // standard definition
    const fetchParams = new URLSearchParams({
        action: "fetch_slideshare",
        nonce: NONCE,
        url: url,
        quality: quality,
    });

    const fetchResponse = await fetch(SLIDESILO_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: fetchParams.toString(),
    });

    if (!fetchResponse.ok) {
        throw new Error(`SlideSilo fetch failed: ${fetchResponse.status}`);
    }

    const fetchData = await fetchResponse.json();

    if (!fetchData.success || !fetchData.data || !fetchData.data.slides) {
        throw new Error("Failed to fetch slides from SlideSilo");
    }

    const { title, slides } = fetchData.data;

    // Step 3: Build slides array for PDF generation
    // Transform slides to the format expected by generate_pdf
    const slidesForGeneration = slides.map((slide: any) => ({
        slideNumber: slide.slide_number,
        url: slide.url,
        primaryUrl: slide.url,
        fallback1Url: slide.url.replace("-638.jpg", "-320.jpg"), // fallback to lower quality
    }));

    // Generate PDF/PPT
    const generateParams = new URLSearchParams({
        action: "generate_pdf",
        nonce: NONCE,
        title: title || "SlideShare",
        quality: quality,
    });

    // Add slides as JSON string
    generateParams.append("slides", JSON.stringify(slidesForGeneration));

    const generateResponse = await fetch(SLIDESILO_BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: generateParams.toString(),
    });

    if (!generateResponse.ok) {
        throw new Error(`SlideSilo generate failed: ${generateResponse.status}`);
    }

    // Check content type - might return file directly or JSON
    const contentType = generateResponse.headers.get("content-type");
    let blob: Blob;
    let filename: string;

    if (contentType && contentType.includes("application/json")) {
        const generateData = await generateResponse.json();

        // Response format: { "success": true, "data": { "url": "...", "filename": "..." } }
        const data = generateData.data || generateData;
        const downloadUrl = data.url || data.download_url || data.file_url;

        if (!downloadUrl) {
            console.error("SlideSilo response:", generateData);
            throw new Error("No download URL in SlideSilo response");
        }

        // Return URL directly instead of downloading
        filename = data.filename || `anytools-${(title || "slideshare").replace(/[^a-zA-Z0-9-_]/g, "-").substring(0, 50)}-${Date.now()}.${format}`;

        return { url: downloadUrl, filename };
    } else {
        // Response is the PDF file directly - need to upload somewhere or return blob
        blob = await generateResponse.blob();

        // Generate filename
        const sanitizedTitle = (title || "slideshare").replace(/[^a-zA-Z0-9-_]/g, "-").substring(0, 50);
        filename = `anytools-${sanitizedTitle}-${Date.now()}.${format}`;

        return { blob, filename };
    }
}

async function handleSlideshareDownload(request: NextRequest) {
    try {
        const body: SlideShareDownloadRequest = await request.json();
        const { url, format } = body;

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        if (!SLIDESHARE_URL_PATTERN.test(url)) {
            return NextResponse.json({ error: "Invalid SlideShare URL" }, { status: 400 });
        }

        const services = [];

        // Add RapidAPI if key is available
        // if (RAPIDAPI_KEY) {
        //     services.push({ name: "RapidAPI", handler: () => downloadWithRapidAPI(url, format) });
        // }

        services.push({ name: "SlideSilo", handler: () => downloadWithSlideSilo(url, format) }, { name: "SlideSaver", handler: () => downloadWithSlideSaver(url, format) });

        const result = await tryServicesWithFallback<{ url?: string; blob?: Blob; filename: string }>(services, {
            endpoint: "/api/slideshare-download",
            method: request.method,
            userAgent: request.headers.get("user-agent") || undefined,
            ip: getClientIp(request),
            additionalParams: {
                slideshareUrl: url,
                format,
            },
        });

        // Check if result has URL or blob
        if (result.data?.url) {
            return NextResponse.json({
                url: result.data.url,
                filename: result.data.filename,
                format: format,
            });
        } else if (result.data?.blob) {
            return new NextResponse(result.data.blob, {
                headers: {
                    "Content-Type": format === "pdf" ? "application/pdf" : "application/vnd.ms-powerpoint",
                    "Content-Disposition": `attachment; filename="${result.data.filename}"`,
                },
            });
        } else {
            throw new Error("No URL or blob returned from download method");
        }
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}

export const POST = withErrorHandler(handleSlideshareDownload, "/api/slideshare-download");
