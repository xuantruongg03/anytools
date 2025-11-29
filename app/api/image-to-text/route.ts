import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/utils/api-wrapper";
import { tryServicesWithFallback } from "@/lib/utils/service-fallback";

interface OCRResult {
    text: string;
    confidence?: number;
}

// OCR.space API call
async function callOCRSpace(imageFile: File, language: string): Promise<OCRResult> {
    const apiKey = process.env.OCR_SPACE_API_KEY;

    if (!apiKey) {
        throw new Error("OCR_SPACE_API_KEY is not configured");
    }

    // Map language codes
    const languageMap: Record<string, string> = {
        en: "eng",
        vi: "vie",
        zh: "chs",
        ja: "jpn",
        ko: "kor",
        fr: "fre",
        de: "ger",
        es: "spa",
        pt: "por",
        it: "ita",
        ru: "rus",
        ar: "ara",
        th: "tai",
    };

    const ocrLanguage = languageMap[language] || "eng";

    try {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("language", ocrLanguage);
        formData.append("isOverlayRequired", "false");
        formData.append("detectOrientation", "true");
        formData.append("scale", "true");
        formData.append("OCREngine", "2"); // Use OCR Engine 2 for better accuracy

        const response = await fetch("https://api.ocr.space/parse/image", {
            method: "POST",
            headers: {
                apikey: apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OCR.space error response:", errorText);
            throw new Error(`OCR.space API failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.IsErroredOnProcessing) {
            throw new Error(data.ErrorMessage?.[0] || "OCR processing failed");
        }

        const parsedResults = data.ParsedResults;
        if (!parsedResults || parsedResults.length === 0) {
            return { text: "", confidence: 0 };
        }

        const text = parsedResults.map((result: { ParsedText: string }) => result.ParsedText).join("\n");
        const confidence = parsedResults[0]?.TextOverlay?.Lines?.[0]?.Words?.[0]?.WordText ? 100 : 0;

        return { text: text.trim(), confidence };
    } catch (error) {
        console.error("OCR.space error:", error);
        throw error;
    }
}

// Optiic API call (alternative)
async function callOptiic(imageFile: File): Promise<OCRResult> {
    const apiKey = process.env.OPTIIC_API_KEY;

    if (!apiKey) {
        throw new Error("OPTIIC_API_KEY is not configured");
    }

    try {
        // Convert file to base64
        const arrayBuffer = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");
        const base64DataUrl = `data:${imageFile.type};base64,${base64Image}`;

        const response = await fetch("https://api.optiic.dev/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                apiKey: apiKey,
                image: base64DataUrl,
                mode: "ocr",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Optiic error response:", errorText);
            throw new Error(`Optiic API failed with status ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || "Optiic processing failed");
        }

        return {
            text: (data.text || "").trim(),
            confidence: 95,
        };
    } catch (error) {
        console.error("Optiic error:", error);
        throw error;
    }
}

async function handleImageToText(request: NextRequest) {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const language = (formData.get("language") as string) || "en";
    const provider = (formData.get("provider") as string) || "auto";

    if (!imageFile) {
        return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/bmp"];
    if (!validTypes.includes(imageFile.type)) {
        return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, WEBP, GIF, and BMP are supported." }, { status: 400 });
    }

    // Validate file size (10MB max)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (imageFile.size > MAX_SIZE) {
        return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    // Build service list based on available API keys and provider selection
    const services: Array<{ name: string; handler: () => Promise<OCRResult> }> = [];

    // If specific provider selected, only use that provider
    if (provider !== "auto") {
        if (provider === "ocr-space" && process.env.OCR_SPACE_API_KEY) {
            services.push({ name: "ocr.space", handler: () => callOCRSpace(imageFile, language) });
        } else if (provider === "optiic" && process.env.OPTIIC_API_KEY) {
            services.push({ name: "optiic", handler: () => callOptiic(imageFile) });
        }
    } else {
        // Auto mode: add all available services
        if (process.env.OCR_SPACE_API_KEY) {
            services.push({ name: "ocr.space", handler: () => callOCRSpace(imageFile, language) });
        }
        if (process.env.OPTIIC_API_KEY) {
            services.push({ name: "optiic", handler: () => callOptiic(imageFile) });
        }
    }

    if (services.length === 0) {
        return NextResponse.json({ error: "No OCR service is configured. Please contact the administrator." }, { status: 503 });
    }

    // Try services with automatic fallback
    const result = await tryServicesWithFallback<OCRResult>(services, {
        endpoint: "/api/image-to-text",
        method: request.method,
        userAgent: request.headers.get("user-agent") || undefined,
        additionalParams: {
            fileName: imageFile.name,
            fileSize: imageFile.size,
            fileType: imageFile.type,
            language,
        },
    });

    return NextResponse.json({
        text: result.data?.text || "",
        confidence: result.data?.confidence,
        usedService: result.usedService,
        failedServices: result.failedServices.map((f) => f.service),
    });
}

// Wrap with error handler
export const POST = withErrorHandler(handleImageToText, "/api/image-to-text");
