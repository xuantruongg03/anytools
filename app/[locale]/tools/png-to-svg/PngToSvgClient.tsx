"use client";

import { useState, useCallback, useRef } from "react";
import Button from "@/components/ui/Button";
import ImageTracer from "imagetracerjs";

type ConversionMode = "trace" | "embed";

interface TraceOptions {
    colorsampling: number;
    numberofcolors: number;
    blurradius: number;
    blurdelta: number;
    strokewidth: number;
    linefilter: boolean;
    pathomit: number;
    roundcoords: number;
}

const DEFAULT_OPTIONS: TraceOptions = {
    colorsampling: 2,
    numberofcolors: 16,
    blurradius: 0,
    blurdelta: 20,
    strokewidth: 1,
    linefilter: false,
    pathomit: 8,
    roundcoords: 1,
};

const PRESETS = {
    default: { ...DEFAULT_OPTIONS },
    posterized1: { colorsampling: 0, numberofcolors: 2 },
    posterized2: { colorsampling: 0, numberofcolors: 4 },
    posterized3: { colorsampling: 0, numberofcolors: 8 },
    curvy: { colorsampling: 1, numberofcolors: 16, blurradius: 5 },
    sharp: { colorsampling: 0, numberofcolors: 16, blurradius: 0 },
    detailed: { colorsampling: 2, numberofcolors: 64, pathomit: 0 },
    smoothed: { colorsampling: 1, numberofcolors: 16, blurradius: 5, blurdelta: 64 },
    grayscale: { colorsampling: 0, numberofcolors: 7 },
    artistic: { colorsampling: 2, numberofcolors: 32, blurradius: 2 },
};

export default function PngToSvgClient() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [svgOutput, setSvgOutput] = useState<string>("");
    const [isConverting, setIsConverting] = useState(false);
    const [error, setError] = useState("");
    const [mode, setMode] = useState<ConversionMode>("trace");
    const [options, setOptions] = useState<TraceOptions>(DEFAULT_OPTIONS);
    const [selectedPreset, setSelectedPreset] = useState<string>("default");
    const [isDragging, setIsDragging] = useState(false);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Handle file selection
    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file (PNG, JPG, etc.)");
            return;
        }

        setImageFile(file);
        setError("");
        setSvgOutput("");

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = "";
    };

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    // Convert to SVG using embed mode (base64)
    const convertEmbed = useCallback(async () => {
        if (!imagePreview) return;

        const img = new Image();
        img.onload = () => {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">
  <image href="${imagePreview}" width="${img.width}" height="${img.height}" />
</svg>`;
            setSvgOutput(svg);
            setIsConverting(false);
        };
        img.onerror = () => {
            setError("Failed to load image");
            setIsConverting(false);
        };
        img.src = imagePreview;
    }, [imagePreview]);

    // Convert to SVG using tracing
    const convertTrace = useCallback(async () => {
        if (!imagePreview || !canvasRef.current) return;

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            try {
                const canvas = canvasRef.current!;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    setError("Canvas not supported");
                    setIsConverting(false);
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                const traceOptions = {
                    ...options,
                    qtres: 1,
                    ltres: 1,
                    rightangleenhance: true,
                };

                // Use ImageTracer to trace the image
                const svgString = ImageTracer.imagedataToSVG(imageData, traceOptions);
                setSvgOutput(svgString);
                setIsConverting(false);
            } catch (err) {
                console.error("Trace error:", err);
                setError("Failed to trace image. Try a different preset or simpler image.");
                setIsConverting(false);
            }
        };

        img.onerror = () => {
            setError("Failed to load image for tracing");
            setIsConverting(false);
        };

        img.src = imagePreview;
    }, [imagePreview, options]);

    // Main convert function
    const handleConvert = useCallback(async () => {
        if (!imagePreview) {
            setError("Please select an image first");
            return;
        }

        setIsConverting(true);
        setError("");

        if (mode === "embed") {
            await convertEmbed();
        } else {
            await convertTrace();
        }
    }, [imagePreview, mode, convertEmbed, convertTrace]);

    // Apply preset
    const applyPreset = (presetName: string) => {
        setSelectedPreset(presetName);
        const preset = PRESETS[presetName as keyof typeof PRESETS];
        if (preset) {
            setOptions({ ...DEFAULT_OPTIONS, ...preset });
        }
    };

    // Copy SVG to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(svgOutput);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setError("Failed to copy to clipboard");
        }
    };

    // Download SVG
    const downloadSvg = () => {
        const blob = new Blob([svgOutput], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = imageFile?.name.replace(/\.[^/.]+$/, "") + ".svg" || "converted.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Clear all
    const clearAll = () => {
        setImageFile(null);
        setImagePreview("");
        setSvgOutput("");
        setError("");
    };

    return (
        <div className='space-y-6'>
            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} className='hidden' />

            {/* Mode Selection */}
            <div className='flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Mode:</label>
                    <select value={mode} onChange={(e) => setMode(e.target.value as ConversionMode)} className='text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'>
                        <option value='trace'>Trace (Vectorize)</option>
                        <option value='embed'>Embed (Base64)</option>
                    </select>
                </div>

                {mode === "trace" && (
                    <div className='flex items-center gap-2'>
                        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Preset:</label>
                        <select value={selectedPreset} onChange={(e) => applyPreset(e.target.value)} className='text-sm px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'>
                            <option value='default'>Default (16 colors)</option>
                            <option value='posterized1'>Posterized (2 colors)</option>
                            <option value='posterized2'>Posterized (4 colors)</option>
                            <option value='posterized3'>Posterized (8 colors)</option>
                            <option value='detailed'>Detailed (64 colors)</option>
                            <option value='curvy'>Curvy</option>
                            <option value='sharp'>Sharp</option>
                            <option value='smoothed'>Smoothed</option>
                            <option value='grayscale'>Grayscale</option>
                            <option value='artistic'>Artistic</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Advanced Options for Trace Mode */}
            {mode === "trace" && (
                <details className='p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700'>
                    <summary className='cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300'>⚙️ Advanced Options</summary>
                    <div className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4'>
                        <div>
                            <label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>Number of Colors</label>
                            <input type='number' min='2' max='256' value={options.numberofcolors} onChange={(e) => setOptions({ ...options, numberofcolors: Number(e.target.value) })} className='w-full text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100' />
                        </div>
                        <div>
                            <label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>Blur Radius</label>
                            <input type='number' min='0' max='10' value={options.blurradius} onChange={(e) => setOptions({ ...options, blurradius: Number(e.target.value) })} className='w-full text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100' />
                        </div>
                        <div>
                            <label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>Path Omit (px)</label>
                            <input type='number' min='0' max='100' value={options.pathomit} onChange={(e) => setOptions({ ...options, pathomit: Number(e.target.value) })} className='w-full text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100' />
                        </div>
                        <div>
                            <label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>Color Sampling</label>
                            <select value={options.colorsampling} onChange={(e) => setOptions({ ...options, colorsampling: Number(e.target.value) })} className='w-full text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'>
                                <option value={0}>Disabled</option>
                                <option value={1}>Random</option>
                                <option value={2}>Deterministic</option>
                            </select>
                        </div>
                    </div>
                </details>
            )}

            {/* Main Content */}
            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Input Section */}
                <div>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>Input Image (PNG, JPG, etc.)</label>
                    <input ref={fileInputRef} type='file' accept='image/*' onChange={handleFileInputChange} className='hidden' />

                    <div
                        onClick={() => !imagePreview && fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`w-full h-80 border-2 border-dashed rounded-lg overflow-hidden relative transition-all cursor-pointer ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600 hover:border-blue-400"} ${imagePreview ? "cursor-default" : ""}`}
                    >
                        {imagePreview ? (
                            <div className='w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4'>
                                <img src={imagePreview} alt='Preview' className='max-w-full max-h-full object-contain' />
                            </div>
                        ) : (
                            <div className='w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500'>
                                <svg className='w-16 h-16 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                </svg>
                                <p className='text-sm font-medium'>Drop image here or click to upload</p>
                                <p className='text-xs mt-1'>Supports PNG, JPG, GIF, WebP</p>
                            </div>
                        )}
                    </div>

                    {imageFile && (
                        <div className='mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                            <span className='truncate'>{imageFile.name}</span>
                            <span>{(imageFile.size / 1024).toFixed(1)} KB</span>
                        </div>
                    )}

                    {error && <div className='mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>{error}</div>}

                    <div className='flex flex-wrap gap-2 mt-4'>
                        <Button onClick={() => fileInputRef.current?.click()} variant='dark'>
                            Select Image
                        </Button>
                        <Button onClick={handleConvert} variant='primary' disabled={!imagePreview || isConverting}>
                            {isConverting ? "Converting..." : "Convert to SVG"}
                        </Button>
                        <Button onClick={clearAll} variant='gray' disabled={!imageFile}>
                            Clear
                        </Button>
                    </div>
                </div>

                {/* Output Section */}
                <div>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>SVG Output</label>
                    <div className='w-full h-80 border rounded-lg overflow-hidden bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'>
                        {svgOutput ? (
                            <div className='w-full h-full flex items-center justify-center p-4 bg-[url(&quot;data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2720%27%20height%3D%2720%27%3E%3Crect%20width%3D%2710%27%20height%3D%2710%27%20fill%3D%27%23f0f0f0%27%2F%3E%3Crect%20x%3D%2710%27%20y%3D%2710%27%20width%3D%2710%27%20height%3D%2710%27%20fill%3D%27%23f0f0f0%27%2F%3E%3C%2Fsvg%3E&quot;)]'>
                                <div dangerouslySetInnerHTML={{ __html: svgOutput }} className='max-w-full max-h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block' />
                            </div>
                        ) : (
                            <div className='w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500'>
                                <svg className='w-16 h-16 mb-2 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                </svg>
                                <p>SVG output will appear here</p>
                            </div>
                        )}
                    </div>

                    {svgOutput && (
                        <div className='mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400'>
                            <span>SVG Size: {(new Blob([svgOutput]).size / 1024).toFixed(1)} KB</span>
                            {imageFile && <span className={new Blob([svgOutput]).size > imageFile.size ? "text-orange-500" : "text-green-500"}>{new Blob([svgOutput]).size > imageFile.size ? "⚠️ Larger than original" : "✅ Smaller than original"}</span>}
                        </div>
                    )}

                    <div className='flex flex-wrap gap-2 mt-4'>
                        <Button onClick={copyToClipboard} variant='purple' disabled={!svgOutput}>
                            {copied ? "Copied!" : "Copy SVG"}
                        </Button>
                        <Button onClick={downloadSvg} variant='success' disabled={!svgOutput}>
                            Download SVG
                        </Button>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                <h3 className='text-sm font-medium text-blue-800 dark:text-blue-300 mb-2'>💡 Tips</h3>
                <ul className='text-sm text-blue-700 dark:text-blue-400 space-y-1'>
                    <li>
                        • <strong>Trace Mode</strong>: Best for logos, icons, and simple graphics. Creates true vector paths.
                    </li>
                    <li>
                        • <strong>Embed Mode</strong>: Keeps original quality but larger file size. Good for complex photos.
                    </li>
                    <li>• For best tracing results, use images with clear edges and limited colors.</li>
                    <li>• Try different presets to find the best result for your image.</li>
                </ul>
            </div>
        </div>
    );
}
