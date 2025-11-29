import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/utils/api-wrapper";
import { tryServicesWithFallback } from "@/lib/utils/service-fallback";

type ServiceProvider = "auto" | "removebg" | "photoroom" | "clipdrop";

// Service call functions
async function callRemoveBg(imageFile: File): Promise<Blob> {
    const apiKey = process.env.REMOVEBG_API_KEY;

    if (!apiKey) {
        throw new Error("REMOVEBG_API_KEY is not configured");
    }

    try {
        const formData = new FormData();
        formData.append("image_file", imageFile);
        formData.append("size", "auto");

        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Remove.bg error response:", errorText);
            throw new Error(`Remove.bg API failed with status ${response.status}`);
        }

        return await response.blob();
    } catch (error) {
        console.error("Remove.bg error:", error);
        throw error;
    }
}

async function callClipdrop(imageFile: File): Promise<Blob> {
    const apiKey = process.env.CLIPDROP_API_KEY;

    if (!apiKey) {
        throw new Error("CLIPDROP_API_KEY is not configured");
    }

    const formData = new FormData();
    formData.append("image_file", imageFile);

    const response = await fetch("https://clipdrop-api.co/remove-background/v1", {
        method: "POST",
        headers: {
            "x-api-key": apiKey,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Clipdrop API failed with status ${response.status}`);
    }

    return await response.blob();
}

async function handleRemoveBackground(request: NextRequest) {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const provider = (formData.get("provider") as ServiceProvider) || "auto";

    if (!imageFile) {
        return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(imageFile.type)) {
        return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WEBP are supported." }, { status: 400 });
    }

    // Validate file size (10MB max)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (imageFile.size > MAX_SIZE) {
        return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    // Try services with automatic fallback and error reporting
    const result = await tryServicesWithFallback<Blob>(
        [
            { name: "removebg", handler: () => callRemoveBg(imageFile) },
            { name: "clipdrop", handler: () => callClipdrop(imageFile) },
        ],
        {
            endpoint: "/api/remove-background",
            method: request.method,
            userAgent: request.headers.get("user-agent") || undefined,
            additionalParams: {
                fileName: imageFile.name,
                fileSize: imageFile.size,
                fileType: imageFile.type,
                requestedProvider: provider,
            },
        }
    );

    // Convert blob to buffer and return
    const buffer = Buffer.from(await result.data!.arrayBuffer());

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            "Content-Type": "image/png",
            "Content-Disposition": `attachment; filename="${imageFile.name.replace(/\.[^.]+$/, "")}_no_bg.png"`,
            "X-Used-Provider": result.usedService || "unknown",
            "X-Failed-Providers": result.failedServices.map((f) => f.service).join(", ") || "none",
        },
    });
}

// Wrap with error handler for automatic error monitoring
export const POST = withErrorHandler(handleRemoveBackground, "/api/remove-background");

// Optional: Add GET endpoint for health check
export async function GET() {
    return NextResponse.json({
        status: "ok",
        message: "Remove background API is ready",
        supportedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
        maxFileSize: "10MB",
        providers: ["removebg"],
    });
}
