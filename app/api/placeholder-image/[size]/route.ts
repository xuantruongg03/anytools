import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Predefined placeholder images (base64 encoded small images that will be resized)
const PLACEHOLDER_CATEGORIES = {
    gradient: "gradient",
    solid: "solid",
    pattern: "pattern",
    nature: "nature",
    abstract: "abstract",
    tech: "tech",
} as const;

type PlaceholderCategory = keyof typeof PLACEHOLDER_CATEGORIES;

// Generate gradient placeholder
async function generateGradientPlaceholder(width: number, height: number, colors: [string, string] = ["#9ca3af", "#6b7280"]): Promise<Buffer> {
    const fontSize = Math.max(12, Math.min(width, height) / 6);
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:${colors[1]};stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
                  fill="rgba(255,255,255,0.95)">${width}×${height}</text>
        </svg>
    `;
    return Buffer.from(svg);
}

// Generate solid color placeholder
async function generateSolidPlaceholder(width: number, height: number, color: string = "#cccccc", textColor: string = "#666666"): Promise<Buffer> {
    const fontSize = Math.max(12, Math.min(width, height) / 6);
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${color}"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
                  fill="${textColor}">${width}×${height}</text>
        </svg>
    `;
    return Buffer.from(svg);
}

// Generate pattern placeholder
async function generatePatternPlaceholder(width: number, height: number, bgColor: string = "#e5e5e5", patternColor: string = "#cccccc"): Promise<Buffer> {
    const patternSize = Math.max(20, Math.min(width, height) / 10);
    const fontSize = Math.max(12, Math.min(width, height) / 6);
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse">
                    <path d="M ${patternSize} 0 L 0 0 0 ${patternSize}" fill="none" stroke="${patternColor}" stroke-width="1"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="${bgColor}"/>
            <rect width="100%" height="100%" fill="url(#grid)"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
                  fill="#374151">${width}×${height}</text>
        </svg>
    `;
    return Buffer.from(svg);
}

// Generate abstract placeholder with circles
async function generateAbstractPlaceholder(width: number, height: number): Promise<Buffer> {
    const circles = [];
    const numCircles = 5;
    const colors = ["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24"];
    const fontSize = Math.max(12, Math.min(width, height) / 6);

    for (let i = 0; i < numCircles; i++) {
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const r = Math.random() * Math.min(width, height) * 0.3 + 20;
        circles.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colors[i]}" opacity="0.6"/>`);
    }

    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#1e1b4b"/>
            ${circles.join("")}
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
                  fill="rgba(255,255,255,0.95)">${width}×${height}</text>
        </svg>
    `;
    return Buffer.from(svg);
}

// Generate tech-style placeholder
async function generateTechPlaceholder(width: number, height: number): Promise<Buffer> {
    const lines = [];
    const gridSize = 40;
    const fontSize = Math.max(12, Math.min(width, height) / 6);

    for (let x = 0; x <= width; x += gridSize) {
        lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#22d3ee" stroke-width="0.5" opacity="0.3"/>`);
    }
    for (let y = 0; y <= height; y += gridSize) {
        lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#22d3ee" stroke-width="0.5" opacity="0.3"/>`);
    }

    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#0f172a"/>
            ${lines.join("")}
            <rect x="${width * 0.1}" y="${height * 0.1}" width="${width * 0.8}" height="${height * 0.8}" 
                  fill="none" stroke="#22d3ee" stroke-width="2" rx="8"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="monospace" font-size="${fontSize}px" font-weight="bold"
                  fill="#22d3ee">${width}×${height}</text>
        </svg>
    `;
    return Buffer.from(svg);
}

// Generate nature-style placeholder
async function generateNaturePlaceholder(width: number, height: number): Promise<Buffer> {
    const fontSize = Math.max(12, Math.min(width, height) / 6);
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#E0F4FF;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#sky)"/>
            <ellipse cx="${width * 0.3}" cy="${height * 0.2}" rx="${width * 0.15}" ry="${height * 0.08}" fill="white" opacity="0.8"/>
            <ellipse cx="${width * 0.35}" cy="${height * 0.18}" rx="${width * 0.1}" ry="${height * 0.06}" fill="white" opacity="0.9"/>
            <ellipse cx="${width * 0.7}" cy="${height * 0.25}" rx="${width * 0.12}" ry="${height * 0.06}" fill="white" opacity="0.7"/>
            <path d="M 0 ${height * 0.7} Q ${width * 0.25} ${height * 0.5} ${width * 0.5} ${height * 0.65} T ${width} ${height * 0.6} V ${height} H 0 Z" fill="#228B22"/>
            <path d="M 0 ${height * 0.8} Q ${width * 0.3} ${height * 0.65} ${width * 0.6} ${height * 0.75} T ${width} ${height * 0.7} V ${height} H 0 Z" fill="#32CD32"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
                  fill="#1e3a5f">${width}×${height}</text>
        </svg>
    `;
    return Buffer.from(svg);
}

// Parse size from route parameter (e.g., "640x480" or "300")
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

// Parse hex color from query param
function parseColor(color: string | null, defaultColor: string): string {
    if (!color) return defaultColor;
    // Remove # if present and validate hex
    const hex = color.replace(/^#/, "");
    if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
        return `#${hex}`;
    }
    return defaultColor;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ size: string }> }) {
    try {
        const { size: sizeParam } = await params;
        const { width, height } = parseSize(sizeParam);

        const searchParams = request.nextUrl.searchParams;
        const category = (searchParams.get("category") || "solid") as PlaceholderCategory;
        const bgColor = parseColor(searchParams.get("bg"), "#cccccc");
        const textColor = parseColor(searchParams.get("text"), "#666666");
        const color1 = parseColor(searchParams.get("color1"), "#9ca3af");
        const color2 = parseColor(searchParams.get("color2"), "#6b7280");
        const format = (searchParams.get("format") || "png") as "png" | "jpeg" | "webp";
        const showText = searchParams.get("showText") !== "false";
        const customText = searchParams.get("customText");

        let svgBuffer: Buffer;

        switch (category) {
            case "solid":
                svgBuffer = await generateSolidPlaceholder(width, height, bgColor, textColor);
                break;
            case "pattern":
                svgBuffer = await generatePatternPlaceholder(width, height, bgColor, textColor);
                break;
            case "abstract":
                svgBuffer = await generateAbstractPlaceholder(width, height);
                break;
            case "tech":
                svgBuffer = await generateTechPlaceholder(width, height);
                break;
            case "nature":
                svgBuffer = await generateNaturePlaceholder(width, height);
                break;
            case "gradient":
            default:
                svgBuffer = await generateGradientPlaceholder(width, height, [color1, color2]);
                break;
        }

        // If custom text or hiding text, regenerate with modifications
        if (customText || !showText) {
            const displayText = showText ? customText || `${width}×${height}` : "";
            // Replace ALL text elements in SVG
            const svgString = svgBuffer.toString();
            const modifiedSvg = svgString.replace(/<text[^>]*>[^<]*<\/text>/g, "").replace(
                /<\/svg>/,
                displayText
                    ? `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                      font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 8}px" 
                      fill="${textColor}">${displayText}</text></svg>`
                    : "</svg>"
            );
            svgBuffer = Buffer.from(modifiedSvg);
        }

        // Convert SVG to desired format
        let outputBuffer: Buffer;
        let contentType: string;

        if (format === "jpeg") {
            outputBuffer = await sharp(svgBuffer).resize(width, height).jpeg({ quality: 90 }).toBuffer();
            contentType = "image/jpeg";
        } else if (format === "webp") {
            outputBuffer = await sharp(svgBuffer).resize(width, height).webp({ quality: 90 }).toBuffer();
            contentType = "image/webp";
        } else {
            outputBuffer = await sharp(svgBuffer).resize(width, height).png().toBuffer();
            contentType = "image/png";
        }

        return new NextResponse(new Uint8Array(outputBuffer), {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error("Placeholder image error:", error);
        return NextResponse.json({ error: "Failed to generate placeholder image" }, { status: 500 });
    }
}
