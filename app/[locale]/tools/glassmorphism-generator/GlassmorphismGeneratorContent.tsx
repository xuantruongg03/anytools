"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { glassmorphismGeneratorTranslations } from "@/lib/i18n/tools/glassmorphism-generator";
import { toast } from "@/components/ui/Toast";

export default function GlassmorphismGeneratorContent() {
    const { locale } = useLanguage();
    const t = glassmorphismGeneratorTranslations[locale as "en" | "vi"] || glassmorphismGeneratorTranslations.en;

    // Glass Properties
    const [blur, setBlur] = useState<number>(16);
    const [opacity, setOpacity] = useState<number>(0.25);
    const [colorMode, setColorMode] = useState<"white" | "black" | "custom">("white");
    const [customColor, setCustomColor] = useState<string>("#3b82f6");
    const [borderRadius, setBorderRadius] = useState<number>(24);
    const [borderWidth, setBorderWidth] = useState<number>(1);
    const [borderOpacity, setBorderOpacity] = useState<number>(0.3);
    const [shadowDepth, setShadowDepth] = useState<number>(25);
    const [saturation, setSaturation] = useState<number>(180);

    // Preview Background Theme
    const [previewBg, setPreviewBg] = useState<"mesh" | "sunset" | "cyber" | "dark">("mesh");
    const [codeTab, setCodeTab] = useState<"css" | "tailwind" | "react">("css");

    // Compute RGB from mode
    const rgb = useMemo(() => {
        if (colorMode === "white") return "255, 255, 255";
        if (colorMode === "black") return "15, 23, 42";
        // Convert hex to rgb
        const hex = customColor.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        return `${r}, ${g}, ${b}`;
    }, [colorMode, customColor]);

    // Compute styles
    const glassStyle = useMemo(() => {
        return {
            backgroundColor: `rgba(${rgb}, ${opacity})`,
            backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
            borderRadius: `${borderRadius}px`,
            border: `${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})`,
            boxShadow: `0 8px ${shadowDepth}px 0 rgba(0, 0, 0, ${Math.min(0.35, shadowDepth / 80)})`,
        };
    }, [rgb, opacity, blur, saturation, borderRadius, borderWidth, borderOpacity, shadowDepth]);

    // Generated Code Strings
    const cssCode = useMemo(() => {
        return `/* Glassmorphism Effect */
background: rgba(${rgb}, ${opacity});
border-radius: ${borderRadius}px;
box-shadow: 0 8px ${shadowDepth}px 0 rgba(0, 0, 0, ${(shadowDepth / 90).toFixed(2)});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: ${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity});`;
    }, [rgb, opacity, borderRadius, shadowDepth, blur, saturation, borderWidth, borderOpacity]);

    const tailwindCode = useMemo(() => {
        const blurClass = blur >= 24 ? "backdrop-blur-2xl" : blur >= 16 ? "backdrop-blur-xl" : blur >= 12 ? "backdrop-blur-lg" : "backdrop-blur-md";
        const roundedClass = borderRadius >= 32 ? "rounded-3xl" : borderRadius >= 24 ? "rounded-2xl" : borderRadius >= 16 ? "rounded-xl" : "rounded-lg";
        const bgClass = colorMode === "white" ? `bg-white/[${opacity}]` : colorMode === "black" ? `bg-gray-900/[${opacity}]` : `bg-[${customColor}]/[${opacity}]`;

        return `<div className="${bgClass} ${blurClass} ${roundedClass} border border-white/[${borderOpacity}] shadow-xl">\n  {/* Card Content */}\n</div>`;
    }, [blur, borderRadius, colorMode, opacity, customColor, borderOpacity]);

    const reactCode = useMemo(() => {
        return `const glassStyle = {
  background: "rgba(${rgb}, ${opacity})",
  backdropFilter: "blur(${blur}px) saturate(${saturation}%)",
  WebkitBackdropFilter: "blur(${blur}px) saturate(${saturation}%)",
  borderRadius: "${borderRadius}px",
  border: "${borderWidth}px solid rgba(255, 255, 255, ${borderOpacity})",
  boxShadow: "0 8px ${shadowDepth}px 0 rgba(0, 0, 0, ${(shadowDepth / 90).toFixed(2)})",
};`;
    }, [rgb, opacity, blur, saturation, borderRadius, borderWidth, borderOpacity, shadowDepth]);

    // Presets
    const applyPreset = (preset: "frosted" | "smoked" | "glossy" | "neon") => {
        if (preset === "frosted") {
            setColorMode("white");
            setBlur(16);
            setOpacity(0.2);
            setBorderRadius(24);
            setBorderOpacity(0.3);
            setShadowDepth(25);
            setSaturation(180);
        } else if (preset === "smoked") {
            setColorMode("black");
            setBlur(20);
            setOpacity(0.45);
            setBorderRadius(28);
            setBorderOpacity(0.15);
            setShadowDepth(35);
            setSaturation(150);
        } else if (preset === "glossy") {
            setColorMode("white");
            setBlur(8);
            setOpacity(0.12);
            setBorderRadius(32);
            setBorderOpacity(0.5);
            setShadowDepth(20);
            setSaturation(200);
        } else if (preset === "neon") {
            setColorMode("custom");
            setCustomColor("#8b5cf6");
            setBlur(24);
            setOpacity(0.28);
            setBorderRadius(24);
            setBorderOpacity(0.4);
            setShadowDepth(40);
            setSaturation(220);
        }
    };

    const copyCode = (content: string) => {
        navigator.clipboard.writeText(content);
        toast.success(t.copied);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Presets Bar */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-wrap items-center justify-between gap-3'>
                <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                    ✨ {t.presets}:
                </span>
                <div className='flex flex-wrap gap-2'>
                    <button
                        onClick={() => applyPreset("frosted")}
                        className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all cursor-pointer'
                    >
                        ❄️ {t.presetFrosted}
                    </button>
                    <button
                        onClick={() => applyPreset("smoked")}
                        className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all cursor-pointer'
                    >
                        🌑 {t.presetSmoked}
                    </button>
                    <button
                        onClick={() => applyPreset("glossy")}
                        className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all cursor-pointer'
                    >
                        💎 {t.presetGlossy}
                    </button>
                    <button
                        onClick={() => applyPreset("neon")}
                        className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-all cursor-pointer'
                    >
                        ⚡ {t.presetNeon}
                    </button>
                </div>
            </div>

            {/* Main Interactive Grid */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-12 gap-6'>
                {/* Controls Settings Column */}
                <div className='lg:col-span-5 bg-white dark:bg-gray-900 p-6 sm:p-7 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4'>
                    <h3 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                        <span>🎛️</span> Controls
                    </h3>

                    {/* Color Theme Selector */}
                    <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                            {t.glassColor}
                        </label>
                        <div className='grid grid-cols-3 gap-2'>
                            <button
                                onClick={() => setColorMode("white")}
                                className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                    colorMode === "white"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                ⚪ {t.colorWhite.split(" ")[0]}
                            </button>
                            <button
                                onClick={() => setColorMode("black")}
                                className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                    colorMode === "black"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                ⚫ {t.colorBlack.split(" ")[0]}
                            </button>
                            <button
                                onClick={() => setColorMode("custom")}
                                className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                    colorMode === "custom"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                🎨 {t.colorCustom}
                            </button>
                        </div>
                        {colorMode === "custom" && (
                            <div className='flex items-center gap-2 mt-2'>
                                <input
                                    type='color'
                                    value={customColor}
                                    onChange={(e) => setCustomColor(e.target.value)}
                                    className='w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer bg-transparent'
                                />
                                <span className='text-xs font-mono text-gray-500 uppercase'>{customColor}</span>
                            </div>
                        )}
                    </div>

                    {/* Blur Slider */}
                    <div>
                        <div className='flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                            <span>{t.blur}</span>
                            <span className='font-mono'>{blur}px</span>
                        </div>
                        <input
                            type='range'
                            min='0'
                            max='40'
                            value={blur}
                            onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                            className='w-full accent-blue-600 cursor-pointer'
                        />
                    </div>

                    {/* Opacity Slider */}
                    <div>
                        <div className='flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                            <span>{t.opacity}</span>
                            <span className='font-mono'>{Math.round(opacity * 100)}%</span>
                        </div>
                        <input
                            type='range'
                            min='0.05'
                            max='0.9'
                            step='0.02'
                            value={opacity}
                            onChange={(e) => setOpacity(parseFloat(e.target.value))}
                            className='w-full accent-blue-600 cursor-pointer'
                        />
                    </div>

                    {/* Border Radius */}
                    <div>
                        <div className='flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                            <span>{t.borderRadius}</span>
                            <span className='font-mono'>{borderRadius}px</span>
                        </div>
                        <input
                            type='range'
                            min='0'
                            max='50'
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(parseInt(e.target.value, 10))}
                            className='w-full accent-blue-600 cursor-pointer'
                        />
                    </div>

                    {/* Border Light Opacity */}
                    <div>
                        <div className='flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                            <span>{t.borderOpacity}</span>
                            <span className='font-mono'>{Math.round(borderOpacity * 100)}%</span>
                        </div>
                        <input
                            type='range'
                            min='0'
                            max='0.8'
                            step='0.05'
                            value={borderOpacity}
                            onChange={(e) => setBorderOpacity(parseFloat(e.target.value))}
                            className='w-full accent-blue-600 cursor-pointer'
                        />
                    </div>

                    {/* Shadow Depth */}
                    <div>
                        <div className='flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                            <span>{t.shadow}</span>
                            <span className='font-mono'>{shadowDepth}px</span>
                        </div>
                        <input
                            type='range'
                            min='0'
                            max='60'
                            value={shadowDepth}
                            onChange={(e) => setShadowDepth(parseInt(e.target.value, 10))}
                            className='w-full accent-blue-600 cursor-pointer'
                        />
                    </div>
                </div>

                {/* Interactive Preview & Code Output Column */}
                <div className='lg:col-span-7 flex flex-col justify-between space-y-6'>
                    {/* Live Preview Canvas */}
                    <div className='relative w-full rounded-3xl overflow-hidden p-6 sm:p-10 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center min-h-[360px]'>
                        {/* Background Themes */}
                        <div
                            className={`absolute inset-0 transition-all duration-300 ${
                                previewBg === "mesh"
                                    ? "bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-700"
                                    : previewBg === "sunset"
                                    ? "bg-gradient-to-tr from-amber-500 via-rose-600 to-violet-800"
                                    : previewBg === "cyber"
                                    ? "bg-gradient-to-br from-cyan-500 via-blue-700 to-fuchsia-700"
                                    : "bg-radial from-slate-800 via-gray-950 to-black"
                            }`}
                        >
                            {/* Decorative ambient elements behind the glass card */}
                            <div className='absolute top-6 left-12 w-28 h-28 rounded-full bg-yellow-400/40 blur-xl animate-pulse pointer-events-none' />
                            <div className='absolute bottom-6 right-12 w-36 h-36 rounded-full bg-pink-500/40 blur-2xl pointer-events-none' />
                        </div>

                        {/* Background Switcher floating badge */}
                        <div className='absolute top-3 right-3 z-20 flex gap-1 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/20 text-[11px] font-semibold text-white'>
                            <button
                                onClick={() => setPreviewBg("mesh")}
                                className={`px-2 py-0.5 rounded-lg cursor-pointer ${previewBg === "mesh" ? "bg-white/30" : ""}`}
                            >
                                Mesh
                            </button>
                            <button
                                onClick={() => setPreviewBg("sunset")}
                                className={`px-2 py-0.5 rounded-lg cursor-pointer ${previewBg === "sunset" ? "bg-white/30" : ""}`}
                            >
                                Sunset
                            </button>
                            <button
                                onClick={() => setPreviewBg("cyber")}
                                className={`px-2 py-0.5 rounded-lg cursor-pointer ${previewBg === "cyber" ? "bg-white/30" : ""}`}
                            >
                                Cyber
                            </button>
                            <button
                                onClick={() => setPreviewBg("dark")}
                                className={`px-2 py-0.5 rounded-lg cursor-pointer ${previewBg === "dark" ? "bg-white/30" : ""}`}
                            >
                                Dark
                            </button>
                        </div>

                        {/* THE FROSTED GLASS CARD */}
                        <div
                            style={glassStyle}
                            className='relative z-10 w-full max-w-sm p-6 sm:p-7 flex flex-col items-start gap-4 transition-all duration-150 select-none'
                        >
                            <div className='w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl shadow-inner'>
                                🔮
                            </div>
                            <div>
                                <h4 className='text-lg font-black text-white drop-shadow-xs'>
                                    Glassmorphism UI
                                </h4>
                                <p className='text-xs text-white/80 leading-relaxed drop-shadow-xs mt-1'>
                                    Ultra modern frosted glass effect with high-refractive lighting and multi-layered depth.
                                </p>
                            </div>
                            <div className='w-full flex items-center justify-between pt-2 border-t border-white/20 text-xs font-bold text-white'>
                                <span>Preview Card</span>
                                <span className='px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[10px]'>
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Code Output Card */}
                    <div className='bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3'>
                        {/* Tab Switcher */}
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-bold'>
                                <button
                                    onClick={() => setCodeTab("css")}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                        codeTab === "css"
                                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    CSS
                                </button>
                                <button
                                    onClick={() => setCodeTab("tailwind")}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                        codeTab === "tailwind"
                                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    Tailwind CSS
                                </button>
                                <button
                                    onClick={() => setCodeTab("react")}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                        codeTab === "react"
                                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    React JSX
                                </button>
                            </div>

                            <Button
                                onClick={() =>
                                    copyCode(
                                        codeTab === "css"
                                            ? cssCode
                                            : codeTab === "tailwind"
                                            ? tailwindCode
                                            : reactCode
                                    )
                                }
                                variant='primary'
                                size='sm'
                                className='h-9 px-4 rounded-xl text-xs font-bold cursor-pointer shadow-xs'
                            >
                                📋 {locale === "vi" ? "Sao chép" : "Copy Code"}
                            </Button>
                        </div>

                        {/* Code snippet display */}
                        <div className='relative'>
                            <pre className='p-4 rounded-2xl bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto leading-relaxed border border-gray-800'>
                                <code>
                                    {codeTab === "css"
                                        ? cssCode
                                        : codeTab === "tailwind"
                                        ? tailwindCode
                                        : reactCode}
                                </code>
                            </pre>
                        </div>
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
