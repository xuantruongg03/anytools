import { NextRequest, NextResponse } from "next/server";
import { SCRIBD_URL_PATTERN } from "@/constants/regex";
import { withErrorHandler } from "@/lib/utils/api-wrapper";
import { getClientIp } from "@/lib/utils/get-client-ip";

interface ScribdDownloadRequest {
    url: string;
    format?: "pdf" | "txt" | "docx";
}

/**
 * Skeleton downloader service for Scribd documents
 * NOTE: Cấu trúc bộ khung xử lý tải tài liệu Scribd. 
 * Bạn có thể tích hợp RapidAPI, Puppeteer backend, hoặc dịch vụ bóc tách tài liệu vào đây sau.
 */
async function downloadScribdDocument(url: string, format: string = "pdf") {
    // 1. Phân tích Document ID từ URL
    // Ví dụ URL: https://www.scribd.com/document/123456789/Title-Of-Document
    const docIdMatch = url.match(/scribd\.com\/(?:document|doc|presentation)\/(\d+)/i);
    const documentId = docIdMatch ? docIdMatch[1] : `scribd-${Date.now()}`;

    // 2. Chỗ dành cho tích hợp API bên thứ 3 hoặc Crawler
    const RAPIDAPI_KEY = process.env.NEXT_RAPIDAPI_KEY;

    if (RAPIDAPI_KEY) {
        try {
            // Ví dụ cấu trúc gọi RapidAPI (nếu có provider Scribd downloader)
            /*
            const response = await fetch("https://scribd-downloader.p.rapidapi.com/download", {
                method: "POST",
                headers: {
                    "x-rapidapi-key": RAPIDAPI_KEY,
                    "x-rapidapi-host": "scribd-downloader.p.rapidapi.com",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.downloadUrl) {
                    return {
                        url: data.downloadUrl,
                        filename: data.filename || `scribd_${documentId}.${format}`,
                        title: data.title || "Scribd Document",
                    };
                }
            }
            */
        } catch (e) {
            console.error("Scribd RapidAPI attempt failed:", e);
        }
    }

    // 3. Fallback / Bộ khung chuẩn bị xuất kết quả
    // Trả về metadata tài liệu và link tải dự phòng
    return {
        url: url, // Link chuyển tiếp hoặc link tải trực tiếp khi hoàn thiện
        filename: `scribd_document_${documentId}.${format}`,
        title: `Scribd Document ${documentId}`,
        message: "Scribd downloader scaffold ready. Integrate downloader backend here.",
    };
}

async function handleScribdDownload(request: NextRequest) {
    const body: ScribdDownloadRequest = await request.json();
    const { url, format = "pdf" } = body;

    if (!url || !url.trim()) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!SCRIBD_URL_PATTERN.test(url.trim())) {
        return NextResponse.json(
            { error: "Invalid Scribd URL. URL should match https://www.scribd.com/document/..." },
            { status: 400 }
        );
    }

    try {
        const clientIp = getClientIp(request);
        console.log(`[Scribd Downloader] Request from IP ${clientIp} for: ${url}`);

        const result = await downloadScribdDocument(url.trim(), format);

        return NextResponse.json({
            success: true,
            url: result.url,
            filename: result.filename,
            title: result.title,
            format,
        });
    } catch (error) {
        console.error("[Scribd Downloader Error]:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to process Scribd document download",
            },
            { status: 500 }
        );
    }
}

export const POST = withErrorHandler(handleScribdDownload, "/api/scribd-download");
