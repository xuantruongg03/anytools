"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { getTranslation } from "@/lib/i18n/translations";

type PromoImageClientProps = {
    locale: "en" | "vi";
};

export default function PromoImageClient({ locale }: PromoImageClientProps) {
    const t = getTranslation(locale);
    const tool = t.tools.promoImageGenerator;

    const [width, setWidth] = useState<number>(1280);
    const [height, setHeight] = useState<number>(800);
    const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
    const [gradientStart, setGradientStart] = useState<string>("#2980b9");
    const [gradientEnd, setGradientEnd] = useState<string>("#6dd5fa");
    const [format, setFormat] = useState<"png" | "jpeg">("png");
    const [isDragging, setIsDragging] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const drawBackground = useCallback(
        (ctx: CanvasRenderingContext2D, w: number, h: number) => {
            const gradient = ctx.createLinearGradient(0, 0, w, h);
            gradient.addColorStop(0, gradientStart);
            gradient.addColorStop(1, gradientEnd);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);
        },
        [gradientStart, gradientEnd]
    );

    const drawPromo = useCallback(
        (img: HTMLImageElement) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = width;
            canvas.height = height;
            drawBackground(ctx, width, height);

            // Calculate image size to fit within 80% of canvas
            const maxH = height * 0.8;
            const maxW = width * 0.8;
            const ratio = img.width / img.height;

            let drawW, drawH;
            if (ratio > maxW / maxH) {
                drawW = maxW;
                drawH = maxW / ratio;
            } else {
                drawH = maxH;
                drawW = maxH * ratio;
            }

            const x = (width - drawW) / 2;
            const y = (height - drawH) / 2;

            // Add shadow
            ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 10;

            ctx.drawImage(img, x, y, drawW, drawH);
            ctx.shadowColor = "transparent";
        },
        [width, height, drawBackground]
    );

    const loadImage = useCallback((file: File | Blob) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setUploadedImage(img);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) loadImage(file);
    };

    // Handle paste from clipboard
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    e.preventDefault();
                    const blob = item.getAsFile();
                    if (blob) loadImage(blob);
                    break;
                }
            }
        };

        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [loadImage]);

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith("image/")) {
            loadImage(file);
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const mimeType = format === "png" ? "image/png" : "image/jpeg";
        const link = document.createElement("a");
        link.download = `promo-${width}x${height}.${format}`;
        link.href = canvas.toDataURL(mimeType, 0.95);
        link.click();
    };

    const handleDimensionPreset = (w: number, h: number) => {
        setWidth(w);
        setHeight(h);
    };

    // Redraw when dependencies change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = width;
        canvas.height = height;

        if (uploadedImage) {
            drawPromo(uploadedImage);
        } else {
            drawBackground(ctx, width, height);
        }
    }, [width, height, uploadedImage, drawPromo, drawBackground]);

    const presets = [
        { w: 1280, h: 800, label: "1280×800", sub: "Chrome Store" },
        { w: 1920, h: 1080, label: "1920×1080", sub: "Full HD" },
        { w: 1200, h: 630, label: "1200×630", sub: "Social" },
        { w: 640, h: 400, label: "640×400", sub: "Small" },
    ];

    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6'>
            <div className='grid lg:grid-cols-[1fr,320px] gap-6'>
                {/* Left: Canvas Preview & Upload */}
                <div className='space-y-4'>
                    {/* Drop Zone / Canvas */}
                    <div
                        ref={dropZoneRef}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => !uploadedImage && fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all cursor-pointer
                            ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600"}
                            ${!uploadedImage ? "hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50" : "cursor-default"}
                        `}
                    >
                        <input ref={fileInputRef} type='file' accept='image/*' onChange={handleFileUpload} className='hidden' />

                        {!uploadedImage ? (
                            <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
                                <div className='w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
                                    <svg className='w-8 h-8 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                    </svg>
                                </div>
                                <p className='text-base font-medium text-gray-700 dark:text-gray-300 mb-1'>{tool.uploadButton}</p>
                                <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>{locale === "vi" ? "Kéo thả ảnh hoặc nhấp để chọn" : "Drag & drop or click to select"}</p>
                                <p className='text-xs text-blue-500 dark:text-blue-400'>📋 Ctrl+V {locale === "vi" ? "để dán ảnh" : "to paste image"}</p>
                            </div>
                        ) : (
                            <div className='bg-gray-100 dark:bg-gray-900 p-3 flex items-center justify-center' style={{ minHeight: "300px" }}>
                                <canvas
                                    ref={canvasRef}
                                    style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                        display: "block",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                        borderRadius: "4px",
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {uploadedImage && (
                        <div className='flex gap-3'>
                            <button onClick={() => fileInputRef.current?.click()} className='flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium'>
                                🔄 {locale === "vi" ? "Đổi ảnh" : "Change"}
                            </button>
                            <button onClick={handleDownload} className='flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium'>
                                ⬇️ {tool.downloadButton}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: Controls */}
                <div className='space-y-5'>
                    {/* Presets */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool.presetsLabel}</label>
                        <div className='grid grid-cols-2 gap-2'>
                            {presets.map((p) => (
                                <button
                                    key={p.label}
                                    onClick={() => handleDimensionPreset(p.w, p.h)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors border
                                        ${width === p.w && height === p.h ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400"}
                                    `}
                                >
                                    <div>{p.label}</div>
                                    <div className='text-[10px] opacity-70'>{p.sub}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Size */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{locale === "vi" ? "Kích thước tùy chỉnh" : "Custom Size"}</label>
                        <div className='flex gap-2 items-center'>
                            <input type='number' value={width} onChange={(e) => setWidth(Number(e.target.value))} min={100} max={5000} className='w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500' />
                            <span className='text-gray-500'>×</span>
                            <input type='number' value={height} onChange={(e) => setHeight(Number(e.target.value))} min={100} max={5000} className='w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500' />
                        </div>
                    </div>

                    {/* Gradient Colors */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{locale === "vi" ? "Màu Gradient" : "Gradient Colors"}</label>
                        <div className='space-y-2'>
                            <div className='flex gap-2 items-center'>
                                <input type='color' value={gradientStart} onChange={(e) => setGradientStart(e.target.value)} className='w-10 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer' />
                                <input type='text' value={gradientStart} onChange={(e) => setGradientStart(e.target.value)} className='flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white' placeholder='Start' />
                            </div>
                            <div className='flex gap-2 items-center'>
                                <input type='color' value={gradientEnd} onChange={(e) => setGradientEnd(e.target.value)} className='w-10 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer' />
                                <input type='text' value={gradientEnd} onChange={(e) => setGradientEnd(e.target.value)} className='flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white' placeholder='End' />
                            </div>
                        </div>
                    </div>

                    {/* Format */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool.formatLabel}</label>
                        <div className='flex gap-2'>
                            <button onClick={() => setFormat("png")} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${format === "png" ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400"}`}>
                                PNG
                            </button>
                            <button onClick={() => setFormat("jpeg")} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${format === "jpeg" ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400"}`}>
                                JPEG
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className='text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3'>
                        <p className='flex items-center gap-1.5 mb-1'>
                            <span>📏</span> {locale === "vi" ? "Kích thước hiện tại:" : "Current size:"}{" "}
                            <strong>
                                {width}×{height}
                            </strong>
                        </p>
                        <p className='flex items-center gap-1.5'>
                            <span>📋</span> {locale === "vi" ? "Dán ảnh bằng Ctrl+V" : "Paste image with Ctrl+V"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
