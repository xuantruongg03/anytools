"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { colorConverterTranslations } from "@/lib/i18n/tools/color-converter";
import { toast } from "@/components/ui/Toast";

// --- COLOR CONVERSION MATH ---
function hexToRgb(hexStr: string): { r: number; g: number; b: number } | null {
    let clean = hexStr.replace(/^#/, "").trim();
    if (clean.length === 3) {
        clean = clean.split("").map((c) => c + c).join("");
    }
    if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) {
        return null;
    }
    const num = parseInt(clean, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100),
    };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }

    const c = (1 - rNorm - k) / (1 - k);
    const m = (1 - gNorm - k) / (1 - k);
    const y = (1 - bNorm - k) / (1 - k);

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100),
    };
}

// WCAG Luminance & Contrast
function getLuminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
    const rgb1 = hexToRgb(hex1) || { r: 0, g: 0, b: 0 };
    const rgb2 = hexToRgb(hex2) || { r: 255, g: 255, b: 255 };

    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

const PRESET_COLORS = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6",
    "#EC4899", "#06B6D4", "#64748B", "#1E293B", "#FFFFFF"
];

export default function ColorConverterContent() {
    const { locale } = useLanguage();
    const t = colorConverterTranslations[locale as "en" | "vi"] || colorConverterTranslations.en;

    const [activeTab, setActiveTab] = useState<"converter" | "contrast">("converter");

    // Converter Color state
    const [hexColor, setHexColor] = useState<string>("#3B82F6");

    // Contrast Checker states
    const [textColor, setTextColor] = useState<string>("#FFFFFF");
    const [bgColor, setBgColor] = useState<string>("#1E293B");

    // Compute active color spaces
    const colorSpaces = useMemo(() => {
        const rgb = hexToRgb(hexColor) || { r: 59, g: 130, b: 246 };
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
        const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

        return {
            hex: hexColor.toUpperCase(),
            rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
            hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
            cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
        };
    }, [hexColor]);

    // Compute Contrast
    const contrastRatio = useMemo(() => {
        return getContrastRatio(textColor, bgColor);
    }, [textColor, bgColor]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(t.copied);
    };

    const handleSwapContrast = () => {
        const temp = textColor;
        setTextColor(bgColor);
        setBgColor(temp);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Mode Tabs */}
            <div className='flex items-center p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full'>
                <button
                    onClick={() => setActiveTab("converter")}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "converter"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    🎨 {t.tabConverter}
                </button>
                <button
                    onClick={() => setActiveTab("contrast")}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "contrast"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    ⚖️ {t.tabContrast}
                </button>
            </div>

            {/* TAB 1: COLOR CONVERTER */}
            {activeTab === "converter" && (
                <div className='w-full space-y-6'>
                    {/* Main Picker Card */}
                    <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-6'>
                        <div
                            className='w-full sm:w-48 h-36 sm:h-48 rounded-3xl shadow-inner border border-gray-300 dark:border-gray-700 flex items-center justify-center relative overflow-hidden'
                            style={{ backgroundColor: hexColor }}
                        >
                            <input
                                type='color'
                                value={hexColor}
                                onChange={(e) => setHexColor(e.target.value)}
                                className='absolute inset-0 opacity-0 w-full h-full cursor-pointer'
                            />
                        </div>

                        <div className='flex-1 space-y-4 w-full'>
                            <div>
                                <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    🎨 {t.hexLabel}
                                </label>
                                <div className='flex items-center gap-2'>
                                    <input
                                        type='text'
                                        value={hexColor}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setHexColor(val.startsWith("#") ? val : `#${val}`);
                                        }}
                                        className='flex-1 px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono font-bold text-lg'
                                    />
                                    <input
                                        type='color'
                                        value={hexColor}
                                        onChange={(e) => setHexColor(e.target.value)}
                                        className='w-12 h-12 rounded-xl cursor-pointer p-0.5 border border-gray-300 dark:border-gray-700'
                                    />
                                </div>
                            </div>

                            {/* Preset Swatches */}
                            <div className='space-y-1.5'>
                                <span className='text-xs font-semibold text-gray-400'>{t.presets}:</span>
                                <div className='flex flex-wrap items-center gap-2'>
                                    {PRESET_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setHexColor(c)}
                                            style={{ backgroundColor: c }}
                                            className='w-7 h-7 rounded-lg border border-gray-300 dark:border-gray-700 shadow-xs cursor-pointer transition-transform hover:scale-110'
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Converted Color Space Cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                        {Object.entries(colorSpaces).map(([key, val]) => (
                            <div
                                key={key}
                                className='p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs flex items-center justify-between'
                            >
                                <div>
                                    <div className='text-[10px] font-extrabold uppercase tracking-wider text-gray-400'>
                                        {key}
                                    </div>
                                    <div className='text-sm font-mono font-bold text-gray-900 dark:text-white mt-0.5 truncate max-w-[200px]'>
                                        {val}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCopy(val)}
                                    className='px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors cursor-pointer'
                                >
                                    {t.copyValue}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 2: WCAG CONTRAST CHECKER */}
            {activeTab === "contrast" && (
                <div className='w-full space-y-6'>
                    {/* Color Input Controls */}
                    <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-5'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-center'>
                            {/* Text Color */}
                            <div>
                                <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    ✏️ {t.textColorLabel}
                                </label>
                                <div className='flex items-center gap-2'>
                                    <input
                                        type='color'
                                        value={textColor}
                                        onChange={(e) => setTextColor(e.target.value)}
                                        className='w-11 h-11 rounded-xl cursor-pointer p-0.5 border border-gray-300 dark:border-gray-700'
                                    />
                                    <input
                                        type='text'
                                        value={textColor}
                                        onChange={(e) => setTextColor(e.target.value)}
                                        className='flex-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono font-bold text-sm'
                                    />
                                </div>
                            </div>

                            {/* Background Color */}
                            <div>
                                <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    🖼️ {t.bgColorLabel}
                                </label>
                                <div className='flex items-center gap-2'>
                                    <input
                                        type='color'
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className='w-11 h-11 rounded-xl cursor-pointer p-0.5 border border-gray-300 dark:border-gray-700'
                                    />
                                    <input
                                        type='text'
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className='flex-1 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono font-bold text-sm'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex justify-center'>
                            <Button
                                onClick={handleSwapContrast}
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                🔄 {t.swapColors}
                            </Button>
                        </div>
                    </div>

                    {/* Big Ratio Gauge & Badges */}
                    <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-6'>
                        <div className='text-center sm:text-left'>
                            <div className='text-xs font-semibold text-gray-400'>{t.contrastRatio}</div>
                            <div className='text-5xl sm:text-6xl font-black text-gray-900 dark:text-white font-mono mt-1'>
                                {contrastRatio} <span className='text-2xl text-gray-400 font-normal'>: 1</span>
                            </div>
                        </div>

                        {/* WCAG Criteria Badges */}
                        <div className='grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs'>
                            <div className='p-3 rounded-2xl border bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-center space-y-1'>
                                <div className='text-[10px] font-bold text-gray-400'>Normal AA</div>
                                <div className={`font-black ${contrastRatio >= 4.5 ? "text-emerald-500" : "text-red-500"}`}>
                                    {contrastRatio >= 4.5 ? `✓ ${t.pass}` : `✕ ${t.fail}`}
                                </div>
                            </div>

                            <div className='p-3 rounded-2xl border bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-center space-y-1'>
                                <div className='text-[10px] font-bold text-gray-400'>Normal AAA</div>
                                <div className={`font-black ${contrastRatio >= 7.0 ? "text-emerald-500" : "text-red-500"}`}>
                                    {contrastRatio >= 7.0 ? `✓ ${t.pass}` : `✕ ${t.fail}`}
                                </div>
                            </div>

                            <div className='p-3 rounded-2xl border bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-center space-y-1'>
                                <div className='text-[10px] font-bold text-gray-400'>Large AA</div>
                                <div className={`font-black ${contrastRatio >= 3.0 ? "text-emerald-500" : "text-red-500"}`}>
                                    {contrastRatio >= 3.0 ? `✓ ${t.pass}` : `✕ ${t.fail}`}
                                </div>
                            </div>

                            <div className='p-3 rounded-2xl border bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-center space-y-1'>
                                <div className='text-[10px] font-bold text-gray-400'>Large AAA</div>
                                <div className={`font-black ${contrastRatio >= 4.5 ? "text-emerald-500" : "text-red-500"}`}>
                                    {contrastRatio >= 4.5 ? `✓ ${t.pass}` : `✕ ${t.fail}`}
                                </div>
                            </div>

                            <div className='p-3 rounded-2xl border bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 text-center space-y-1 col-span-2 sm:col-span-1'>
                                <div className='text-[10px] font-bold text-gray-400'>UI Components</div>
                                <div className={`font-black ${contrastRatio >= 3.0 ? "text-emerald-500" : "text-red-500"}`}>
                                    {contrastRatio >= 3.0 ? `✓ ${t.pass}` : `✕ ${t.fail}`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Visual Typography Preview */}
                    <div
                        className='w-full p-8 sm:p-12 rounded-[32px] sm:rounded-[40px] shadow-sm border space-y-3 transition-colors duration-200'
                        style={{ backgroundColor: bgColor, color: textColor, borderColor: `${textColor}20` }}
                    >
                        <h3 className='text-2xl sm:text-3xl font-black leading-tight'>
                            {t.previewHeadline}
                        </h3>
                        <p className='text-sm sm:text-base leading-relaxed opacity-90 max-w-2xl'>
                            {t.previewParagraph}
                        </p>
                    </div>
                </div>
            )}

            {/* SEO & Guide */}
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
