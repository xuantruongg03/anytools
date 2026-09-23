"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { imageWatermarkTranslations } from "@/lib/i18n/tools/image-watermark";
import { toast } from "@/components/ui/Toast";

interface UploadedPhoto {
    id: string;
    file: File;
    name: string;
    url: string;
}

type WatermarkPos = "top-left" | "top-center" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";

export default function ImageWatermarkContent() {
    const { locale } = useLanguage();
    const t = imageWatermarkTranslations[locale as "en" | "vi"] || imageWatermarkTranslations.en;

    const [mode, setMode] = useState<"text" | "logo">("text");

    // Photos state
    const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

    // Text Watermark Settings
    const [wmText, setWmText] = useState<string>("© AnyTools 2026");
    const [fontSize, setFontSize] = useState<number>(36);
    const [textColor, setTextColor] = useState<string>("#ffffff");
    const [opacity, setOpacity] = useState<number>(0.6);
    const [rotation, setRotation] = useState<number>(-20);
    const [position, setPosition] = useState<WatermarkPos>("bottom-right");
    const [isTile, setIsTile] = useState<boolean>(false);

    // Logo Watermark Settings
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoScale, setLogoScale] = useState<number>(20); // 20% width of base image
    const [logoOpacity, setLogoOpacity] = useState<number>(0.75);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Load sample image if empty
    useEffect(() => {
        // Initial setup
    }, []);

    // Handle Image Upload
    const handleFilesUpload = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const newPhotos: UploadedPhoto[] = Array.from(files).map((f) => ({
            id: Math.random().toString(36).substring(2, 9),
            file: f,
            name: f.name,
            url: URL.createObjectURL(f),
        }));

        setPhotos((prev) => [...prev, ...newPhotos]);
        toast.success(locale === "vi" ? `Đã thêm ${newPhotos.length} ảnh!` : `Added ${newPhotos.length} photos!`);
    };

    // Handle Logo Upload
    const handleLogoUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setLogoUrl(e.target?.result as string);
            toast.success(locale === "vi" ? "Đã tải logo thành công!" : "Logo uploaded!");
        };
        reader.readAsDataURL(file);
    };

    // Calculate watermark coordinate
    const getCoordinates = (
        pos: WatermarkPos,
        canvasW: number,
        canvasH: number,
        itemW: number,
        itemH: number,
        padding: number = 30
    ) => {
        let x = padding;
        let y = padding;

        if (pos.includes("right")) x = canvasW - itemW - padding;
        else if (pos.includes("center") && !pos.startsWith("center")) x = (canvasW - itemW) / 2;

        if (pos.includes("bottom")) y = canvasH - itemH - padding;
        else if (pos.startsWith("center")) y = (canvasH - itemH) / 2;

        return { x, y };
    };

    // Draw Watermark on Canvas
    const drawCanvas = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const currentPhoto = photos[selectedPhotoIndex];
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // If no photo uploaded, draw placeholder demo
        if (!currentPhoto) {
            canvas.width = 700;
            canvas.height = 420;
            const grad = ctx.createLinearGradient(0, 0, 700, 420);
            grad.addColorStop(0, "#3b82f6");
            grad.addColorStop(1, "#8b5cf6");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 700, 420);
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(locale === "vi" ? "Tải ảnh lên để bắt đầu đóng dấu" : "Upload photos to preview watermark", 350, 210);
            return;
        }

        const baseImg = new Image();
        baseImg.src = currentPhoto.url;
        await new Promise((resolve) => {
            baseImg.onload = resolve;
        });

        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImg, 0, 0);

        // Apply Text Watermark
        if (mode === "text" && wmText.trim()) {
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = textColor;
            ctx.font = `bold ${fontSize}px sans-serif`;

            if (isTile) {
                // Repeating Tile pattern
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);

                const stepX = ctx.measureText(wmText).width + 120;
                const stepY = fontSize * 3.5;

                for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
                    for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
                        ctx.fillText(wmText, x, y);
                    }
                }
            } else {
                // Single positioned text
                const textMetrics = ctx.measureText(wmText);
                const textWidth = textMetrics.width;
                const textHeight = fontSize;

                const { x, y } = getCoordinates(position, canvas.width, canvas.height, textWidth, textHeight, 40);

                ctx.translate(x + textWidth / 2, y + textHeight / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.fillText(wmText, -textWidth / 2, textHeight / 3);
            }
            ctx.restore();
        }

        // Apply Logo Watermark
        if (mode === "logo" && logoUrl) {
            const logoImg = new Image();
            logoImg.src = logoUrl;
            await new Promise((resolve) => {
                logoImg.onload = resolve;
            });

            ctx.save();
            ctx.globalAlpha = logoOpacity;

            const logoW = (canvas.width * logoScale) / 100;
            const logoH = (logoImg.height / logoImg.width) * logoW;

            const { x, y } = getCoordinates(position, canvas.width, canvas.height, logoW, logoH, 40);
            ctx.drawImage(logoImg, x, y, logoW, logoH);
            ctx.restore();
        }
    }, [
        photos,
        selectedPhotoIndex,
        mode,
        wmText,
        fontSize,
        textColor,
        opacity,
        rotation,
        position,
        isTile,
        logoUrl,
        logoScale,
        logoOpacity,
        locale,
    ]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    // Download Single Photo
    const handleDownloadSingle = () => {
        if (!canvasRef.current || photos.length === 0) return;
        const currentPhoto = photos[selectedPhotoIndex];
        const dataUrl = canvasRef.current.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `watermarked_${currentPhoto.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success(locale === "vi" ? "Đã tải xuống ảnh có bản quyền!" : "Downloaded watermarked photo!");
    };

    // Download All as ZIP
    const handleDownloadZip = async () => {
        if (photos.length === 0) return;
        try {
            const JSZip = (await import("jszip")).default;
            const zip = new JSZip();
            toast.info(locale === "vi" ? "Đang xử lý xuất ZIP hàng loạt..." : "Processing batch ZIP...");

            for (let i = 0; i < photos.length; i++) {
                setSelectedPhotoIndex(i);
                // Allow state & canvas render
                await new Promise((r) => setTimeout(r, 120));
                if (canvasRef.current) {
                    const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.95);
                    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, "");
                    zip.file(`watermarked_${photos[i].name}`, base64Data, { base64: true });
                }
            }

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = `watermarked_photos_${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success(locale === "vi" ? "Đã xuất xong file ZIP!" : "Downloaded batch ZIP successfully!");
        } catch (e) {
            toast.error("Failed to generate ZIP");
        }
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Mode Switcher */}
            <div className='flex items-center p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full'>
                <button
                    onClick={() => setMode("text")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        mode === "text"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    ✍️ {t.tabText}
                </button>
                <button
                    onClick={() => setMode("logo")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        mode === "logo"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    🖼️ {t.tabLogo}
                </button>
            </div>

            {/* Main Interactive Grid */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* Settings Column */}
                <div className='lg:col-span-5 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4'>
                    {/* TEXT WATERMARK SETTINGS */}
                    {mode === "text" && (
                        <>
                            <div>
                                <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    {t.watermarkText}
                                </label>
                                <input
                                    type='text'
                                    value={wmText}
                                    onChange={(e) => setWmText(e.target.value)}
                                    placeholder={t.watermarkPlaceholder}
                                    className='w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                                        {t.fontSize}: {fontSize}px
                                    </label>
                                    <input
                                        type='range'
                                        min='16'
                                        max='90'
                                        value={fontSize}
                                        onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                                        {t.color}
                                    </label>
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='color'
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className='w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer bg-transparent'
                                        />
                                        <span className='text-xs font-mono text-gray-500 uppercase'>{textColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                                        {t.opacity}: {Math.round(opacity * 100)}%
                                    </label>
                                    <input
                                        type='range'
                                        min='0.1'
                                        max='1'
                                        step='0.05'
                                        value={opacity}
                                        onChange={(e) => setOpacity(parseFloat(e.target.value))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                                        {t.rotation}: {rotation}°
                                    </label>
                                    <input
                                        type='range'
                                        min='-90'
                                        max='90'
                                        step='5'
                                        value={rotation}
                                        onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                            </div>

                            <div className='pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3'>
                                <label className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        checked={isTile}
                                        onChange={(e) => setIsTile(e.target.checked)}
                                        className='rounded accent-blue-600 w-4 h-4'
                                    />
                                    <span>🛡️ {t.tilePattern}</span>
                                </label>
                            </div>
                        </>
                    )}

                    {/* LOGO WATERMARK SETTINGS */}
                    {mode === "logo" && (
                        <>
                            <div className='space-y-2'>
                                <label className='block text-xs font-bold text-gray-700 dark:text-gray-300'>
                                    {t.uploadLogo}
                                </label>
                                <label className='flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all'>
                                    {logoUrl ? (
                                        <img src={logoUrl} alt='Logo' className='h-14 object-contain mb-1' />
                                    ) : (
                                        <span className='text-3xl mb-1'>🖼️</span>
                                    )}
                                    <span className='text-xs font-semibold text-blue-600'>Select PNG/SVG Logo</span>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                                        className='hidden'
                                    />
                                </label>
                            </div>

                            <div className='grid grid-cols-2 gap-3 pt-2'>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                                        {t.scaleLogo}: {logoScale}%
                                    </label>
                                    <input
                                        type='range'
                                        min='5'
                                        max='60'
                                        value={logoScale}
                                        onChange={(e) => setLogoScale(parseInt(e.target.value, 10))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                                        {t.opacity}: {Math.round(logoOpacity * 100)}%
                                    </label>
                                    <input
                                        type='range'
                                        min='0.1'
                                        max='1'
                                        step='0.05'
                                        value={logoOpacity}
                                        onChange={(e) => setLogoOpacity(parseFloat(e.target.value))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* 9-Grid Position Selector (When not tile) */}
                    {!isTile && (
                        <div className='pt-2 border-t border-gray-100 dark:border-gray-800'>
                            <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2'>
                                🎯 {t.position}:
                            </label>
                            <div className='grid grid-cols-3 gap-1.5 w-36 mx-auto'>
                                {[
                                    "top-left", "top-center", "top-right",
                                    "center-left", "center", "center-right",
                                    "bottom-left", "bottom-center", "bottom-right",
                                ].map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={() => setPosition(pos as WatermarkPos)}
                                        className={`h-9 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                                            position === pos
                                                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                                : "bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        •
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload Base Photos Dropzone */}
                    <div className='pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2'>
                        <label className='flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'>
                            <span className='text-2xl mb-1'>📸</span>
                            <span className='text-xs font-bold text-gray-700 dark:text-gray-200'>
                                {t.dragDrop}
                            </span>
                            <input
                                type='file'
                                accept='image/*'
                                multiple
                                onChange={(e) => handleFilesUpload(e.target.files)}
                                className='hidden'
                            />
                        </label>
                    </div>
                </div>

                {/* Live Canvas Preview & Photo Strip Column */}
                <div className='lg:col-span-7 flex flex-col justify-between bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5'>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                <span>👁️</span> Preview
                            </h4>
                            {photos.length > 0 && (
                                <span className='text-xs text-gray-500 font-mono'>
                                    {selectedPhotoIndex + 1} / {photos.length} photos
                                </span>
                            )}
                        </div>

                        {/* Interactive Canvas Viewport */}
                        <div className='w-full min-h-[320px] max-h-[500px] flex items-center justify-center rounded-2xl bg-gray-950 p-2 overflow-hidden shadow-inner'>
                            <canvas
                                ref={canvasRef}
                                className='max-w-full max-h-[480px] object-contain rounded-xl'
                            />
                        </div>

                        {/* Photos Thumbnail Strip */}
                        {photos.length > 1 && (
                            <div className='flex items-center gap-2 overflow-x-auto py-1'>
                                {photos.map((photo, idx) => (
                                    <button
                                        key={photo.id}
                                        onClick={() => setSelectedPhotoIndex(idx)}
                                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                                            selectedPhotoIndex === idx
                                                ? "border-blue-600 scale-105 shadow-md"
                                                : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                    >
                                        <img src={photo.url} alt={photo.name} className='w-full h-full object-cover' />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className='flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-800'>
                        <Button
                            onClick={handleDownloadSingle}
                            disabled={photos.length === 0}
                            variant='primary'
                            size='md'
                            className='h-11 px-6 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer shadow-md'
                        >
                            💾 {t.downloadCurrent}
                        </Button>

                        {photos.length > 1 && (
                            <Button
                                onClick={handleDownloadZip}
                                variant='secondary'
                                size='md'
                                className='h-11 px-6 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer border border-gray-200 dark:border-gray-700'
                            >
                                📦 {t.downloadZip}
                            </Button>
                        )}

                        {photos.length > 0 && (
                            <button
                                onClick={() => {
                                    setPhotos([]);
                                    setSelectedPhotoIndex(0);
                                }}
                                className='text-xs text-red-500 hover:text-red-600 font-bold px-2 py-1 cursor-pointer'
                            >
                                {t.clearImages}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Guide & Knowledge */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>💡</span> {t.guideTitle}
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>1. {t.guide1Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>2. {t.guide2Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>3. {t.guide3Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
