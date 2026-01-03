"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Category = "gradient" | "solid" | "pattern" | "abstract" | "tech" | "nature";

interface PresetSize {
    label: string;
    width: number;
    height: number;
}

const PRESET_SIZES: PresetSize[] = [
    { label: "Square S", width: 150, height: 150 },
    { label: "Square M", width: 300, height: 300 },
    { label: "Square L", width: 600, height: 600 },
    { label: "Banner", width: 728, height: 90 },
    { label: "Leaderboard", width: 970, height: 250 },
    { label: "Rectangle", width: 300, height: 250 },
    { label: "Skyscraper", width: 160, height: 600 },
    { label: "Social Post", width: 1080, height: 1080 },
    { label: "Facebook Cover", width: 820, height: 312 },
    { label: "Twitter Header", width: 1500, height: 500 },
    { label: "YouTube Thumb", width: 1280, height: 720 },
    { label: "OG Image", width: 1200, height: 630 },
    { label: "HD", width: 1920, height: 1080 },
    { label: "4K", width: 3840, height: 2160 },
];

const CATEGORIES: { key: Category; label: string; labelVi: string; icon: string }[] = [
    { key: "gradient", label: "Gradient", labelVi: "Gradient", icon: "🌈" },
    { key: "solid", label: "Solid Color", labelVi: "Màu đơn", icon: "🎨" },
    { key: "pattern", label: "Pattern", labelVi: "Pattern", icon: "📐" },
    { key: "abstract", label: "Abstract", labelVi: "Trừu tượng", icon: "🔮" },
    { key: "tech", label: "Tech", labelVi: "Công nghệ", icon: "💻" },
    { key: "nature", label: "Nature", labelVi: "Thiên nhiên", icon: "🌿" },
];

export default function PlaceholderImageClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    // State
    const [width, setWidth] = useState(640);
    const [height, setHeight] = useState(480);
    const [category, setCategory] = useState<Category>("solid");
    const [bgColor, setBgColor] = useState("#cccccc");
    const [textColor, setTextColor] = useState("#666666");
    const [color1, setColor1] = useState("#9ca3af");
    const [color2, setColor2] = useState("#6b7280");
    const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
    const [showText, setShowText] = useState(true);
    const [customText, setCustomText] = useState("");
    const [copied, setCopied] = useState(false);

    // Default values for comparison
    const DEFAULTS = {
        category: "solid" as Category,
        bgColor: "#cccccc",
        textColor: "#666666",
        color1: "#9ca3af",
        color2: "#6b7280",
        format: "png" as const,
    };

    // Generate API URL - only add params if different from defaults
    const generateUrl = useCallback(() => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://anytools.online";
        const sizeParam = width === height ? `${width}` : `${width}x${height}`;

        const params = new URLSearchParams();

        // Only add category if not default
        if (category !== DEFAULTS.category) {
            params.append("category", category);
        }

        // Only add format if not default
        if (format !== DEFAULTS.format) {
            params.append("format", format);
        }

        // Only add colors if they differ from defaults
        if (category === "solid" || category === "pattern") {
            if (bgColor !== DEFAULTS.bgColor) {
                params.append("bg", bgColor.replace("#", ""));
            }
            if (textColor !== DEFAULTS.textColor) {
                params.append("text", textColor.replace("#", ""));
            }
        }
        if (category === "gradient") {
            if (color1 !== DEFAULTS.color1) {
                params.append("color1", color1.replace("#", ""));
            }
            if (color2 !== DEFAULTS.color2) {
                params.append("color2", color2.replace("#", ""));
            }
        }

        if (!showText) {
            params.append("showText", "false");
        }
        if (customText) {
            params.append("customText", customText);
        }

        const queryString = params.toString();
        return queryString ? `${baseUrl}/api/placeholder-image/${sizeParam}?${queryString}` : `${baseUrl}/api/placeholder-image/${sizeParam}`;
    }, [width, height, category, format, bgColor, textColor, color1, color2, showText, customText]);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        setPreviewUrl(generateUrl());
    }, [generateUrl]);

    // Copy URL to clipboard
    const copyUrl = async () => {
        if (!previewUrl) return;
        try {
            await navigator.clipboard.writeText(previewUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            console.error("Failed to copy");
        }
    };

    // Handle preset size selection
    const handlePresetSelect = (preset: PresetSize) => {
        setWidth(preset.width);
        setHeight(preset.height);
    };

    const downloadImage = () => {
        if (!previewUrl) return;
        const link = document.createElement("a");
        link.href = previewUrl;
        link.download = `placeholder-${width}x${height}.${format}`;
        link.click();
    };

    return (
        <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Left Column - Settings */}
                <div className='space-y-6'>
                    {/* Size Settings */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "📐 Kích thước" : "📐 Size"}</h3>

                        {/* Custom Size Inputs */}
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <div>
                                <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>{isVi ? "Chiều rộng" : "Width"}</label>
                                <input type='number' min={10} max={2000} value={width} onChange={(e) => setWidth(Math.min(2000, Math.max(10, Number(e.target.value))))} className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100' />
                            </div>
                            <div>
                                <label className='block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300'>{isVi ? "Chiều cao" : "Height"}</label>
                                <input type='number' min={10} max={2000} value={height} onChange={(e) => setHeight(Math.min(2000, Math.max(10, Number(e.target.value))))} className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100' />
                            </div>
                        </div>

                        {/* Preset Sizes */}
                        <div className='flex flex-wrap gap-2'>
                            {PRESET_SIZES.map((preset) => (
                                <button key={preset.label} onClick={() => handlePresetSelect(preset)} className={`px-3 py-1.5 text-xs rounded-full transition-colors ${width === preset.width && height === preset.height ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                    {preset.label} ({preset.width}×{preset.height})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "🎭 Kiểu placeholder" : "🎭 Placeholder Style"}</h3>
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
                            {CATEGORIES.map((cat) => (
                                <button key={cat.key} onClick={() => setCategory(cat.key)} className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${category === cat.key ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                    <span>{cat.icon}</span>
                                    <span>{isVi ? cat.labelVi : cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Options */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "🎨 Màu sắc" : "🎨 Colors"}</h3>

                        {category === "gradient" && (
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>{isVi ? "Màu 1" : "Color 1"}</label>
                                    <div className='flex items-center gap-2'>
                                        <input type='color' value={color1} onChange={(e) => setColor1(e.target.value)} className='w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer' />
                                        <input type='text' value={color1} onChange={(e) => setColor1(e.target.value)} className='flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100' />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>{isVi ? "Màu 2" : "Color 2"}</label>
                                    <div className='flex items-center gap-2'>
                                        <input type='color' value={color2} onChange={(e) => setColor2(e.target.value)} className='w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer' />
                                        <input type='text' value={color2} onChange={(e) => setColor2(e.target.value)} className='flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100' />
                                    </div>
                                </div>
                            </div>
                        )}

                        {(category === "solid" || category === "pattern") && (
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>{isVi ? "Màu nền" : "Background"}</label>
                                    <div className='flex items-center gap-2'>
                                        <input type='color' value={bgColor} onChange={(e) => setBgColor(e.target.value)} className='w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer' />
                                        <input type='text' value={bgColor} onChange={(e) => setBgColor(e.target.value)} className='flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100' />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>{isVi ? "Màu chữ" : "Text Color"}</label>
                                    <div className='flex items-center gap-2'>
                                        <input type='color' value={textColor} onChange={(e) => setTextColor(e.target.value)} className='w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer' />
                                        <input type='text' value={textColor} onChange={(e) => setTextColor(e.target.value)} className='flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100' />
                                    </div>
                                </div>
                            </div>
                        )}

                        {category !== "gradient" && category !== "solid" && category !== "pattern" && <p className='text-gray-500 dark:text-gray-400 text-sm'>{isVi ? "Kiểu này sử dụng màu cố định" : "This style uses fixed colors"}</p>}
                    </div>

                    {/* Text Options */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "✏️ Text" : "✏️ Text"}</h3>

                        <div className='space-y-4'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input type='checkbox' checked={showText} onChange={(e) => setShowText(e.target.checked)} className='w-4 h-4 text-blue-500 rounded' />
                                <span className='text-gray-700 dark:text-gray-300'>{isVi ? "Hiển thị kích thước" : "Show size text"}</span>
                            </label>

                            <div>
                                <label className='block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300'>{isVi ? "Text tùy chỉnh (tùy chọn)" : "Custom text (optional)"}</label>
                                <input type='text' value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder={isVi ? "Để trống để hiển thị kích thước" : "Leave empty to show size"} className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100' />
                            </div>
                        </div>
                    </div>

                    {/* Format Selection */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "📁 Định dạng" : "📁 Format"}</h3>
                        <div className='flex gap-2'>
                            {(["png", "jpeg", "webp"] as const).map((fmt) => (
                                <button key={fmt} onClick={() => setFormat(fmt)} className={`px-4 py-2 rounded-lg font-medium transition-colors ${format === fmt ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                    {fmt.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Preview & API */}
                <div className='space-y-6'>
                    {/* Preview */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "👁️ Xem trước" : "👁️ Preview"}</h3>
                        <div className='relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]'>
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt='Placeholder preview'
                                    className='max-w-full max-h-[400px] object-contain'
                                    style={{
                                        maxWidth: Math.min(width, 500),
                                        maxHeight: Math.min(height, 400),
                                    }}
                                />
                            ) : (
                                <div className='text-gray-400'>{isVi ? "Đang tải..." : "Loading..."}</div>
                            )}
                        </div>
                        <div className='mt-4 flex gap-2'>
                            <button onClick={downloadImage} className='flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors'>
                                {isVi ? "⬇️ Tải về" : "⬇️ Download"}
                            </button>
                            <button onClick={copyUrl} className='flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors'>
                                {copied ? (isVi ? "✅ Đã copy!" : "✅ Copied!") : isVi ? "📋 Copy URL" : "📋 Copy URL"}
                            </button>
                        </div>
                    </div>

                    {/* API URL */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "🔗 API URL" : "🔗 API URL"}</h3>
                        <div className='bg-gray-100 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm break-all text-gray-800 dark:text-gray-200'>{previewUrl}</div>
                        <div className='mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                            <p>
                                <strong>{isVi ? "Cách sử dụng:" : "Usage:"}</strong>
                            </p>
                            <code className='block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs'>{`<img src="${previewUrl}" alt="placeholder" />`}</code>
                        </div>
                    </div>

                    {/* API Documentation */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "📖 API Documentation" : "📖 API Documentation"}</h3>
                        <div className='space-y-4 text-sm text-gray-600 dark:text-gray-400'>
                            <div>
                                <p className='font-medium text-gray-800 dark:text-gray-200 mb-1'>{isVi ? "Cú pháp:" : "Syntax:"}</p>
                                <code className='block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs'>/api/placeholder-image/[width]x[height]</code>
                            </div>
                            <div>
                                <p className='font-medium text-gray-800 dark:text-gray-200 mb-1'>{isVi ? "Ví dụ:" : "Examples:"}</p>
                                <ul className='space-y-1 text-xs font-mono'>
                                    <li>/api/placeholder-image/640x480</li>
                                    <li>/api/placeholder-image/300 (300x300)</li>
                                    <li>/api/placeholder-image/800x600?category=nature</li>
                                    <li>/api/placeholder-image/400x400?bg=ff5733&text=ffffff</li>
                                </ul>
                            </div>
                            <div>
                                <p className='font-medium text-gray-800 dark:text-gray-200 mb-1'>{isVi ? "Tham số:" : "Parameters:"}</p>
                                <ul className='space-y-1 text-xs'>
                                    <li>
                                        <code className='bg-gray-200 dark:bg-gray-700 px-1 rounded'>category</code>: gradient, solid, pattern, abstract, tech, nature
                                    </li>
                                    <li>
                                        <code className='bg-gray-200 dark:bg-gray-700 px-1 rounded'>format</code>: png, jpeg, webp
                                    </li>
                                    <li>
                                        <code className='bg-gray-200 dark:bg-gray-700 px-1 rounded'>bg</code>: {isVi ? "màu nền (hex không có #)" : "background color (hex without #)"}
                                    </li>
                                    <li>
                                        <code className='bg-gray-200 dark:bg-gray-700 px-1 rounded'>text</code>: {isVi ? "màu chữ" : "text color"}
                                    </li>
                                    <li>
                                        <code className='bg-gray-200 dark:bg-gray-700 px-1 rounded'>color1, color2</code>: {isVi ? "màu gradient" : "gradient colors"}
                                    </li>
                                    <li>
                                        <code className='bg-gray-200 dark:bg-gray-700 px-1 rounded'>showText</code>: true/false
                                    </li>
                                    <li>
                                        <code className='bg-gray-200 dark:bg-gray-700 px-1 rounded'>customText</code>: {isVi ? "text tùy chỉnh" : "custom text"}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
