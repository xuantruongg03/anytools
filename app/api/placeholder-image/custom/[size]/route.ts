import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Handle custom uploaded images and resize them
export async function POST(request: NextRequest, { params }: { params: Promise<{ size: string }> }) {
    try {
        const { size: sizeParam } = await params;
        const { width, height } = parseSize(sizeParam);

        const formData = await request.formData();
        const imageFile = formData.get("image") as File;
        const format = (formData.get("format") as string) || "png";
        const fit = (formData.get("fit") as string) || "cover"; // cover, contain, fill

        if (!imageFile) {
            return NextResponse.json({ error: "No image file provided" }, { status: 400 });
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(imageFile.type)) {
            return NextResponse.json({ error: "Invalid file type. Supported: JPG, PNG, WebP, GIF" }, { status: 400 });
        }

        // Validate file size (max 10MB)
        if (imageFile.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large. Maximum size is 10MB" }, { status: 400 });
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Resize image with sharp
        let sharpInstance = sharp(buffer).resize(width, height, {
            fit: fit as "cover" | "contain" | "fill",
            position: "center",
            background: { r: 255, g: 255, b: 255, alpha: 0 },
        });

        let outputBuffer: Buffer;
        let contentType: string;

        if (format === "jpeg" || format === "jpg") {
            outputBuffer = await sharpInstance.jpeg({ quality: 90 }).toBuffer();
            contentType = "image/jpeg";
        } else if (format === "webp") {
            outputBuffer = await sharpInstance.webp({ quality: 90 }).toBuffer();
            contentType = "image/webp";
        } else {
            outputBuffer = await sharpInstance.png().toBuffer();
            contentType = "image/png";
        }

        // Return as base64 data URL for client-side display
        const base64 = outputBuffer.toString("base64");
        const dataUrl = `data:${contentType};base64,${base64}`;

        return NextResponse.json({
            success: true,
            dataUrl,
            width,
            height,
            format,
            size: outputBuffer.length,
        });
    } catch (error) {
        console.error("Image resize error:", error);
        return NextResponse.json({ error: "Failed to resize image" }, { status: 500 });
    }
}

// Parse size from route parameter
function parseSize(sizeParam: string): { width: number; height: number } {
    const maxSize = 2000;
    const minSize = 10;

    if (sizeParam.includes("x")) {
        const [w, h] = sizeParam.split("x").map(Number);
        return {
            width: Math.min(Math.max(w || 300, minSize), maxSize),
            height: Math.min(Math.max(h || 300, minSize), maxSize),
        };
    }

    const size = Math.min(Math.max(Number(sizeParam) || 300, minSize), maxSize);
    return { width: size, height: size };
}
