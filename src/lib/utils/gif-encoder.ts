/**
 * Lightweight Client-Side GIF89a Encoder
 * Converts HTMLCanvasElement frames into an animated GIF Blob directly in the browser.
 */

export interface GifFrameOptions {
    delayMs: number; // Delay in milliseconds (e.g. 100ms for 10fps)
}

// Simple color quantizer to reduce RGBA to <= 256 colors
function quantizeFrame(rgba: Uint8ClampedArray, width: number, height: number): {
    indexedPixels: Uint8Array;
    colorTable: number[];
} {
    const totalPixels = width * height;
    const indexedPixels = new Uint8Array(totalPixels);
    const colorMap = new Map<number, number>();
    const colorTable: number[] = [];

    for (let i = 0; i < totalPixels; i++) {
        const offset = i * 4;
        // 5-bit color reduction (32 levels per channel = max 32768 colors)
        const r = rgba[offset] & 0xf8;
        const g = rgba[offset + 1] & 0xf8;
        const b = rgba[offset + 2] & 0xf8;
        const key = (r << 16) | (g << 8) | b;

        let index = colorMap.get(key);
        if (index === undefined) {
            if (colorTable.length / 3 < 256) {
                index = colorTable.length / 3;
                colorMap.set(key, index);
                colorTable.push(r, g, b);
            } else {
                // Find closest color in existing palette
                let minDist = Infinity;
                index = 0;
                for (let c = 0; c < colorTable.length; c += 3) {
                    const dr = r - colorTable[c];
                    const dg = g - colorTable[c + 1];
                    const db = b - colorTable[c + 2];
                    const dist = dr * dr + dg * dg + db * db;
                    if (dist < minDist) {
                        minDist = dist;
                        index = c / 3;
                    }
                }
            }
        }
        indexedPixels[i] = index;
    }

    // Pad color table to nearest power of 2 (up to 256)
    while (colorTable.length < 768) {
        colorTable.push(0);
    }

    return { indexedPixels, colorTable };
}

// LZW Compression for GIF
function lzwEncode(minCodeSize: number, indexedPixels: Uint8Array): Uint8Array {
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;

    let codeSize = minCodeSize + 1;
    let nextCode = eoiCode + 1;

    const dictionary = new Map<string, number>();

    const resetDictionary = () => {
        dictionary.clear();
        codeSize = minCodeSize + 1;
        nextCode = eoiCode + 1;
    };

    const output: number[] = [];
    let curAccum = 0;
    let curBits = 0;

    const writeCode = (code: number) => {
        curAccum |= code << curBits;
        curBits += codeSize;
        while (curBits >= 8) {
            output.push(curAccum & 0xff);
            curAccum >>= 8;
            curBits -= 8;
        }

        if (nextCode >= 1 << codeSize && codeSize < 12) {
            codeSize++;
        }
    };

    writeCode(clearCode);

    let prefix = String(indexedPixels[0]);

    for (let i = 1; i < indexedPixels.length; i++) {
        const char = String(indexedPixels[i]);
        const combined = prefix + "," + char;

        if (dictionary.has(combined)) {
            prefix = combined;
        } else {
            const prefixCode = prefix.includes(",")
                ? dictionary.get(prefix)!
                : parseInt(prefix, 10);
            writeCode(prefixCode);

            if (nextCode < 4096) {
                dictionary.set(combined, nextCode++);
            } else {
                writeCode(clearCode);
                resetDictionary();
            }

            prefix = char;
        }
    }

    const lastCode = prefix.includes(",") ? dictionary.get(prefix)! : parseInt(prefix, 10);
    writeCode(lastCode);
    writeCode(eoiCode);

    if (curBits > 0) {
        output.push(curAccum & 0xff);
    }

    // Package output into sub-blocks of max 255 bytes
    const subBlocks: number[] = [];
    let ptr = 0;
    while (ptr < output.length) {
        const blockSize = Math.min(255, output.length - ptr);
        subBlocks.push(blockSize);
        for (let b = 0; b < blockSize; b++) {
            subBlocks.push(output[ptr + b]);
        }
        ptr += blockSize;
    }
    subBlocks.push(0); // Block terminator

    return new Uint8Array(subBlocks);
}

export class SimpleGifBuilder {
    private width: number;
    private height: number;
    private bytes: number[] = [];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        // GIF89a Header
        this.writeString("GIF89a");

        // Logical Screen Descriptor
        this.writeU16(width);
        this.writeU16(height);
        this.bytes.push(0x70); // GCT Flag = 0, Color Resolution = 7, Sort = 0, Size = 0
        this.bytes.push(0);    // Background Color Index
        this.bytes.push(0);    // Pixel Aspect Ratio

        // Netscape Application Extension (for infinite loop)
        this.bytes.push(0x21, 0xff, 0x0b);
        this.writeString("NETSCAPE2.0");
        this.bytes.push(0x03, 0x01, 0x00, 0x00, 0x00);
    }

    private writeString(str: string) {
        for (let i = 0; i < str.length; i++) {
            this.bytes.push(str.charCodeAt(i));
        }
    }

    private writeU16(val: number) {
        this.bytes.push(val & 0xff, (val >> 8) & 0xff);
    }

    public addFrame(imageData: ImageData, delayMs: number = 100) {
        const { indexedPixels, colorTable } = quantizeFrame(
            imageData.data,
            this.width,
            this.height
        );

        const delayCentiseconds = Math.max(2, Math.round(delayMs / 10));

        // Graphic Control Extension
        this.bytes.push(0x21, 0xf9, 0x04);
        this.bytes.push(0x04); // Packed: Disposal = 1 (do not dispose), user input = 0, transparent = 0
        this.writeU16(delayCentiseconds);
        this.bytes.push(0);    // Transparent color index
        this.bytes.push(0);    // Block terminator

        // Image Descriptor
        this.bytes.push(0x2c);
        this.writeU16(0);      // Left
        this.writeU16(0);      // Top
        this.writeU16(this.width);
        this.writeU16(this.height);
        this.bytes.push(0x87); // Local Color Table flag = 1, Size = 7 (256 colors)

        // Local Color Table
        for (let i = 0; i < colorTable.length; i++) {
            this.bytes.push(colorTable[i]);
        }

        // Image Data (LZW)
        const minCodeSize = 8;
        this.bytes.push(minCodeSize);
        const lzwData = lzwEncode(minCodeSize, indexedPixels);
        for (let i = 0; i < lzwData.length; i++) {
            this.bytes.push(lzwData[i]);
        }
    }

    public buildBlob(): Blob {
        this.bytes.push(0x3b); // GIF Trailer
        return new Blob([new Uint8Array(this.bytes)], { type: "image/gif" });
    }
}
