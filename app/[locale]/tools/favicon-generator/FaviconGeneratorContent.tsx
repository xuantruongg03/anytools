"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { faviconGeneratorTranslations } from "@/lib/i18n/tools/favicon-generator";
import { toast } from "@/components/ui/Toast";
import JSZip from "jszip";

interface FaviconSize {
    name: string;
    filename: string;
    width: number;
    height: number;
    description: string;
}

const FAVICON_SIZES: FaviconSize[] = [
    { name: "Favicon 16x16", filename: "favicon-16x16.png", width: 16, height: 16, description: "Standard browser tabs" },
    { name: "Favicon 32x32", filename: "favicon-32x32.png", width: 32, height: 32, description: "Retina / High DPI browser tabs" },
    { name: "Favicon 48x48", filename: "favicon-48x48.png", width: 48, height: 48, description: "Windows desktop shortcuts" },
    { name: "Apple Touch Icon", filename: "apple-touch-icon.png", width: 180, height: 180, description: "iOS Safari home screen" },
    { name: "Android Chrome 192", filename: "android-chrome-192x192.png", width: 192, height: 192, description: "PWA home screen" },
    { name: "Android Chrome 512", filename: "android-chrome-512x512.png", width: 512, height: 512, description: "PWA splash screen" },
];

export default function FaviconGeneratorContent() {
    const { locale } = useLanguage();
    const t = faviconGeneratorTranslations[locale as "en" | "vi"] || faviconGeneratorTranslations.en;
    const isVi = locale === "vi";

    const [activeTab, setActiveTab] = useState<"upload" | "emoji">("emoji");
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    // Emoji/Text generator states
    const [emojiChar, setEmojiChar] = useState<string>("⚡");
    const [bgShape, setBgShape] = useState<"square" | "rounded" | "circle">("rounded");
    const [bgColor, setBgColor] = useState<string>("#3b82f6");
    const [textColor, setTextColor] = useState<string>("#ffffff");

    // Previews & Generated Blobs
    const [generatedPreviews, setGeneratedPreviews] = useState<{ [key: string]: string }>({});
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);

    // 1. Draw source canvas based on mode
    const renderSourceToCanvas = useCallback(() => {
        const canvas = sourceCanvasRef.current || document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, 512, 512);

        if (activeTab === "upload" && imageSrc) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                // Center crop / fit
                const minDim = Math.min(img.width, img.height);
                const sx = (img.width - minDim) / 2;
                const sy = (img.height - minDim) / 2;
                ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 512, 512);
                generateAllSizes(canvas);
            };
            img.src = imageSrc;
        } else if (activeTab === "emoji") {
            // Draw background shape
            ctx.fillStyle = bgColor;
            if (bgShape === "circle") {
                ctx.beginPath();
                ctx.arc(256, 256, 256, 0, Math.PI * 2);
                ctx.fill();
            } else if (bgShape === "rounded") {
                const radius = 96;
                ctx.beginPath();
                ctx.roundRect(0, 0, 512, 512, radius);
                ctx.fill();
            } else {
                ctx.fillRect(0, 0, 512, 512);
            }

            // Draw character / emoji
            ctx.fillStyle = textColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "280px 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif";
            ctx.fillText(emojiChar, 256, 275);

            generateAllSizes(canvas);
        }
    }, [activeTab, imageSrc, emojiChar, bgShape, bgColor, textColor]);

    // 2. Generate all target sizes
    const generateAllSizes = (sourceCanvas: HTMLCanvasElement) => {
        setIsGenerating(true);
        const previews: { [key: string]: string } = {};

        FAVICON_SIZES.forEach((size) => {
            const targetCanvas = document.createElement("canvas");
            targetCanvas.width = size.width;
            targetCanvas.height = size.height;
            const ctx = targetCanvas.getContext("2d");
            if (ctx) {
                ctx.imageSmoothingQuality = "high";
                ctx.imageSmoothingEnabled = true;
                ctx.drawImage(sourceCanvas, 0, 0, size.width, size.height);
                previews[size.filename] = targetCanvas.toDataURL("image/png");
            }
        });

        // Also create favicon.ico preview (based on 32x32)
        if (previews["favicon-32x32.png"]) {
            previews["favicon.ico"] = previews["favicon-32x32.png"];
        }

        setGeneratedPreviews(previews);
        setIsGenerating(false);
    };

    useEffect(() => {
        renderSourceToCanvas();
    }, [renderSourceToCanvas]);

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImageSrc(event.target?.result as string);
            setActiveTab("upload");
        };
        reader.readAsDataURL(file);
    };

    // Download single asset
    const handleDownloadSingle = (filename: string, dataUrl: string) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = filename;
        link.click();
    };

    // Download All as ZIP
    const handleDownloadZip = async () => {
        if (Object.keys(generatedPreviews).length === 0) return;

        const zip = new JSZip();

        // Add all image files
        for (const [filename, dataUrl] of Object.entries(generatedPreviews)) {
            const base64Data = dataUrl.replace(/^data:image\/(png|ico);base64,/, "");
            zip.file(filename, base64Data, { base64: true });
        }

        // Add site.webmanifest
        const manifestContent = JSON.stringify(
            {
                name: "My Website",
                short_name: "Website",
                icons: [
                    { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
                    { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
                ],
                theme_color: bgColor,
                background_color: "#ffffff",
                display: "standalone",
            },
            null,
            2
        );
        zip.file("site.webmanifest", manifestContent);

        // Generate and download zip
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "favicons_package.zip";
        link.click();
        toast.success(isVi ? "Đã tải xuống trọn bộ favicons_package.zip!" : "Downloaded favicons_package.zip successfully!");
    };

    // HTML Code snippet
    const htmlCode = `<link rel="icon" type="image/x-icon" href="/favicon.ico">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">`;

    const handleCopyHtml = () => {
        navigator.clipboard.writeText(htmlCode);
        toast.success(t.copiedHtml);
    };

    const handleCopyManifest = () => {
        const manifest = JSON.stringify(
            {
                name: "My Website",
                short_name: "Website",
                icons: [
                    { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
                    { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
                ],
                theme_color: bgColor,
                background_color: "#ffffff",
                display: "standalone",
            },
            null,
            2
        );
        navigator.clipboard.writeText(manifest);
        toast.success(t.copiedManifest);
    };

    const previewIconSrc = generatedPreviews["favicon-32x32.png"] || generatedPreviews["apple-touch-icon.png"] || "";

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Mode Switcher */}
            <div className='flex items-center p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full'>
                <button
                    onClick={() => setActiveTab("emoji")}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "emoji"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    ✨ {t.tabEmoji}
                </button>
                <button
                    onClick={() => setActiveTab("upload")}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "upload"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    📁 {t.tabUpload}
                </button>
            </div>

            {/* Input & Design Controls */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-6'>
                {activeTab === "emoji" ? (
                    <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
                        {/* Emoji / Character input */}
                        <div>
                            <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                🔤 {t.emojiLabel}
                            </label>
                            <input
                                type='text'
                                value={emojiChar}
                                maxLength={2}
                                onChange={(e) => setEmojiChar(e.target.value)}
                                className='w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-center font-bold text-lg'
                            />
                        </div>

                        {/* Shape Selector */}
                        <div>
                            <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                📐 {t.bgShape}
                            </label>
                            <select
                                value={bgShape}
                                onChange={(e) => setBgShape(e.target.value as any)}
                                className='w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold cursor-pointer'
                            >
                                <option value='rounded'>{t.shapeRounded}</option>
                                <option value='circle'>{t.shapeCircle}</option>
                                <option value='square'>{t.shapeSquare}</option>
                            </select>
                        </div>

                        {/* Background Color */}
                        <div>
                            <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                🎨 {t.bgColor}
                            </label>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='color'
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className='w-10 h-10 rounded-xl cursor-pointer border border-gray-300 dark:border-gray-700 p-0.5'
                                />
                                <input
                                    type='text'
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className='flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs'
                                />
                            </div>
                        </div>

                        {/* Text Color */}
                        <div>
                            <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                🖋️ {t.textColor}
                            </label>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='color'
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className='w-10 h-10 rounded-xl cursor-pointer border border-gray-300 dark:border-gray-700 p-0.5'
                                />
                                <input
                                    type='text'
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className='flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs'
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <input
                            type='file'
                            ref={fileInputRef}
                            accept='image/png, image/jpeg, image/svg+xml, image/webp'
                            onChange={handleFileChange}
                            className='hidden'
                        />
                        {!imageSrc ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className='w-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-colors bg-gray-50 dark:bg-gray-800/40 space-y-2'
                            >
                                <div className='text-4xl'>📤</div>
                                <div className='text-sm font-bold text-gray-800 dark:text-gray-200'>
                                    {t.dropImage}
                                </div>
                                <div className='text-xs text-gray-400'>{t.uploadHint}</div>
                            </div>
                        ) : (
                            <div className='flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                                <div className='flex items-center gap-3'>
                                    <img src={imageSrc} alt='Uploaded source' className='w-12 h-12 object-contain rounded-lg border' />
                                    <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>Uploaded Logo</span>
                                </div>
                                <Button
                                    onClick={() => setImageSrc(null)}
                                    variant='secondary'
                                    size='sm'
                                    className='cursor-pointer text-xs font-bold text-red-500'
                                >
                                    🗑️ {t.removeImage}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Live Device Mockup Previews */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-6'>
                <h3 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>📱</span> {t.previewTitle}
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Browser Light Tab */}
                    <div className='p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-2'>
                        <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>{t.browserTabLight}</span>
                        <div className='bg-gray-200 p-1.5 rounded-t-xl flex items-center gap-2 border-b border-gray-300'>
                            <div className='flex gap-1.5 ml-1'>
                                <span className='w-2.5 h-2.5 rounded-full bg-red-400' />
                                <span className='w-2.5 h-2.5 rounded-full bg-yellow-400' />
                                <span className='w-2.5 h-2.5 rounded-full bg-green-400' />
                            </div>
                            <div className='bg-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-xs text-xs font-medium text-gray-800 max-w-[200px]'>
                                {previewIconSrc && <img src={previewIconSrc} alt='tab icon' className='w-4 h-4 rounded-xs' />}
                                <span className='truncate'>{t.tabTitlePlaceholder}</span>
                                <span className='text-[10px] text-gray-400 ml-auto'>✕</span>
                            </div>
                        </div>
                    </div>

                    {/* Browser Dark Tab */}
                    <div className='p-4 rounded-2xl bg-gray-900 border border-gray-800 space-y-2'>
                        <span className='text-xs font-semibold text-gray-400'>{t.browserTabDark}</span>
                        <div className='bg-gray-950 p-1.5 rounded-t-xl flex items-center gap-2 border-b border-gray-800'>
                            <div className='flex gap-1.5 ml-1'>
                                <span className='w-2.5 h-2.5 rounded-full bg-red-500' />
                                <span className='w-2.5 h-2.5 rounded-full bg-yellow-500' />
                                <span className='w-2.5 h-2.5 rounded-full bg-green-500' />
                            </div>
                            <div className='bg-gray-800 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-xs text-xs font-medium text-gray-100 max-w-[200px]'>
                                {previewIconSrc && <img src={previewIconSrc} alt='tab icon' className='w-4 h-4 rounded-xs' />}
                                <span className='truncate'>{t.tabTitlePlaceholder}</span>
                                <span className='text-[10px] text-gray-400 ml-auto'>✕</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generated Favicon Assets & Download Grid */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-6'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h3 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>📦</span> {t.generatedAssetsTitle}
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                            All standard modern sizes (16px to 512px) generated client-side.
                        </p>
                    </div>

                    <Button
                        onClick={handleDownloadZip}
                        variant='primary'
                        size='md'
                        className='cursor-pointer text-xs font-bold shadow-md'
                    >
                        💾 {t.downloadZip}
                    </Button>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {FAVICON_SIZES.map((size) => {
                        const preview = generatedPreviews[size.filename];
                        return (
                            <div
                                key={size.filename}
                                className='p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center justify-between space-y-2'
                            >
                                <div className='w-16 h-16 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center p-1 shadow-inner'>
                                    {preview && (
                                        <img
                                            src={preview}
                                            alt={size.name}
                                            style={{
                                                maxWidth: Math.min(size.width, 56),
                                                maxHeight: Math.min(size.height, 56),
                                            }}
                                            className='object-contain'
                                        />
                                    )}
                                </div>

                                <div>
                                    <div className='text-xs font-bold text-gray-800 dark:text-gray-200'>
                                        {size.name}
                                    </div>
                                    <div className='text-[10px] text-gray-400 font-mono'>
                                        {size.width} × {size.height}
                                    </div>
                                </div>

                                {preview && (
                                    <button
                                        onClick={() => handleDownloadSingle(size.filename, preview)}
                                        className='text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                                    >
                                        ⬇️ {t.downloadSingle}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Code Snippets Card */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                <div className='flex items-center justify-between'>
                    <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                        <span>💻</span> HTML & Web Manifest Integration
                    </h4>
                    <div className='flex gap-2'>
                        <Button
                            onClick={handleCopyHtml}
                            variant='secondary'
                            size='sm'
                            className='cursor-pointer text-xs font-bold'
                        >
                            📋 {t.copyHtml}
                        </Button>
                        <Button
                            onClick={handleCopyManifest}
                            variant='secondary'
                            size='sm'
                            className='cursor-pointer text-xs font-bold'
                        >
                            📋 {t.copyManifest}
                        </Button>
                    </div>
                </div>

                <div className='p-4 rounded-2xl bg-gray-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-gray-800'>
                    <pre>{htmlCode}</pre>
                </div>
            </div>

            {/* SEO & Best Practice Guide */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
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
