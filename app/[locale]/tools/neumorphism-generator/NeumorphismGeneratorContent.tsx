"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { neumorphismTranslations } from "@/lib/i18n/tools/neumorphism-generator";
import { toast } from "@/components/ui/Toast";

type Mode = "neumorphism" | "claymorphism";
type LightDirection = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type SurfaceShape = "flat" | "convex" | "concave" | "pressed";

// Helper color utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(cleanHex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
    };
}

function adjustBrightness(hex: string, percent: number): string {
    const { r, g, b } = hexToRgb(hex);
    const amount = Math.round(2.55 * percent);
    const clamp = (val: number) => Math.max(0, Math.min(255, val));
    const newR = clamp(r + amount).toString(16).padStart(2, "0");
    const newG = clamp(g + amount).toString(16).padStart(2, "0");
    const newB = clamp(b + amount).toString(16).padStart(2, "0");
    return `#${newR}${newG}${newB}`;
}

export default function NeumorphismGeneratorContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = neumorphismTranslations[locale];

    const [mode, setMode] = useState<Mode>("neumorphism");
    const [color, setColor] = useState<string>("#e0e5ec");
    const [size, setSize] = useState<number>(240);
    const [radius, setRadius] = useState<number>(36);
    const [distance, setDistance] = useState<number>(14);
    const [blur, setBlur] = useState<number>(28);
    const [intensity, setIntensity] = useState<number>(0.18);
    const [direction, setDirection] = useState<LightDirection>("top-left");
    const [shape, setShape] = useState<SurfaceShape>("flat");

    // Claymorphism specific states
    const [clayDepth, setClayDepth] = useState<number>(12);
    const [clayOuterBlur, setClayOuterBlur] = useState<number>(24);
    const [clayOuterDistance, setClayOuterDistance] = useState<number>(16);
    const [clayShadowColor, setClayShadowColor] = useState<string>("#90a4ae");
    const [clayHighlightOpacity, setClayHighlightOpacity] = useState<number>(0.75);
    const [clayShadowOpacity, setClayShadowOpacity] = useState<number>(0.2);

    const [codeTab, setCodeTab] = useState<"css" | "tailwind">("css");
    const [previewType, setPreviewType] = useState<"card" | "button" | "input">("card");

    // Color presets
    const colorPresets = [
        { name: "Soft Slate", hex: "#e0e5ec" },
        { name: "Warm Cream", hex: "#f0ece1" },
        { name: "Mint Fresh", hex: "#e2ede9" },
        { name: "Lavender", hex: "#eae6f4" },
        { name: "Pastel Pink", hex: "#fae8e8" },
        { name: "Dark Neumorph", hex: "#2b2f38" },
        { name: "Midnight Blue", hex: "#1c2438" },
    ];

    // Calculate shadow coordinates based on direction
    const coords = useMemo(() => {
        let darkX = distance;
        let darkY = distance;
        let lightX = -distance;
        let lightY = -distance;

        if (direction === "top-right") {
            darkX = -distance;
            darkY = distance;
            lightX = distance;
            lightY = -distance;
        } else if (direction === "bottom-left") {
            darkX = distance;
            darkY = -distance;
            lightX = -distance;
            lightY = distance;
        } else if (direction === "bottom-right") {
            darkX = -distance;
            darkY = -distance;
            lightX = distance;
            lightY = distance;
        }

        return { darkX, darkY, lightX, lightY };
    }, [distance, direction]);

    // Compute styles
    const computedStyles = useMemo(() => {
        if (mode === "neumorphism") {
            const darkShadowColor = adjustBrightness(color, -intensity * 100);
            const lightShadowColor = adjustBrightness(color, intensity * 85);

            let boxShadow = "";
            let background = color;

            if (shape === "pressed") {
                boxShadow = `inset ${coords.darkX}px ${coords.darkY}px ${blur}px ${darkShadowColor}, inset ${coords.lightX}px ${coords.lightY}px ${blur}px ${lightShadowColor}`;
            } else {
                boxShadow = `${coords.darkX}px ${coords.darkY}px ${blur}px ${darkShadowColor}, ${coords.lightX}px ${coords.lightY}px ${blur}px ${lightShadowColor}`;
            }

            if (shape === "convex") {
                const angle = direction === "top-left" ? "145deg" : direction === "top-right" ? "225deg" : direction === "bottom-left" ? "45deg" : "315deg";
                background = `linear-gradient(${angle}, ${lightShadowColor}, ${darkShadowColor})`;
            } else if (shape === "concave") {
                const angle = direction === "top-left" ? "145deg" : direction === "top-right" ? "225deg" : direction === "bottom-left" ? "45deg" : "315deg";
                background = `linear-gradient(${angle}, ${darkShadowColor}, ${lightShadowColor})`;
            }

            return {
                borderRadius: `${radius}px`,
                background,
                boxShadow,
            };
        } else {
            // Claymorphism: outer shadow + dual inner inset shadows
            const outerRgb = hexToRgb(clayShadowColor);
            const outerShadow = `0 ${clayOuterDistance}px ${clayOuterBlur}px rgba(${outerRgb.r}, ${outerRgb.g}, ${outerRgb.b}, 0.35)`;
            const insetHighlight = `inset -${clayDepth}px -${clayDepth}px ${clayDepth * 1.5}px rgba(255, 255, 255, ${clayHighlightOpacity})`;
            const insetShadow = `inset ${clayDepth}px ${clayDepth}px ${clayDepth * 1.5}px rgba(0, 0, 0, ${clayShadowOpacity})`;

            const boxShadow = `${outerShadow}, ${insetHighlight}, ${insetShadow}`;

            return {
                borderRadius: `${radius}px`,
                background: color,
                boxShadow,
            };
        }
    }, [
        mode,
        color,
        radius,
        blur,
        intensity,
        coords,
        shape,
        direction,
        clayDepth,
        clayOuterDistance,
        clayOuterBlur,
        clayShadowColor,
        clayHighlightOpacity,
        clayShadowOpacity,
    ]);

    // Generated Code
    const generatedCss = useMemo(() => {
        return `/* ${mode === "neumorphism" ? "Neumorphism (Soft UI)" : "Claymorphism (3D Clay)"} */
border-radius: ${computedStyles.borderRadius};
background: ${computedStyles.background};
box-shadow: ${computedStyles.boxShadow};`;
    }, [computedStyles, mode]);

    const generatedTailwind = useMemo(() => {
        // Tailwind arbitrary classes
        const cleanBg = computedStyles.background.includes("gradient")
            ? `bg-[${computedStyles.background.replace(/\s+/g, "_")}]`
            : `bg-[${computedStyles.background}]`;
        const cleanShadow = `shadow-[${computedStyles.boxShadow.replace(/\s+/g, "_")}]`;
        const cleanRounded = `rounded-[${computedStyles.borderRadius}]`;

        return `<div className="${cleanRounded} ${cleanBg} ${cleanShadow}">\n  <!-- Content here -->\n</div>`;
    }, [computedStyles]);

    const handleCopy = async () => {
        const text = codeTab === "css" ? generatedCss : generatedTailwind;
        try {
            await navigator.clipboard.writeText(text);
            toast.success(t.copied);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    // Apply Presets
    const applyPreset = (presetName: string) => {
        if (presetName === "flat") {
            setMode("neumorphism");
            setShape("flat");
            setDistance(12);
            setBlur(24);
            setRadius(32);
        } else if (presetName === "convex") {
            setMode("neumorphism");
            setShape("convex");
            setDistance(14);
            setBlur(28);
            setRadius(36);
        } else if (presetName === "concave") {
            setMode("neumorphism");
            setShape("concave");
            setDistance(14);
            setBlur(28);
            setRadius(36);
        } else if (presetName === "pressed") {
            setMode("neumorphism");
            setShape("pressed");
            setDistance(8);
            setBlur(16);
            setRadius(24);
        } else if (presetName === "clayCard") {
            setMode("claymorphism");
            setColor("#a5b4fc");
            setClayShadowColor("#6366f1");
            setRadius(40);
            setClayDepth(12);
            setClayOuterDistance(16);
            setClayOuterBlur(28);
        } else if (presetName === "clayPuffy") {
            setMode("claymorphism");
            setColor("#f472b6");
            setClayShadowColor("#db2777");
            setRadius(50);
            setClayDepth(16);
            setClayOuterDistance(20);
            setClayOuterBlur(32);
        } else if (presetName === "clayVibrant") {
            setMode("claymorphism");
            setColor("#34d399");
            setClayShadowColor("#059669");
            setRadius(32);
            setClayDepth(10);
            setClayOuterDistance(14);
            setClayOuterBlur(24);
        } else if (presetName === "clayDark") {
            setMode("claymorphism");
            setColor("#334155");
            setClayShadowColor("#0f172a");
            setRadius(36);
            setClayDepth(14);
            setClayOuterDistance(18);
            setClayOuterBlur(30);
            setClayHighlightOpacity(0.35);
            setClayShadowOpacity(0.4);
        }
        toast.info(isVi ? `Đã áp dụng mẫu thiết kế` : `Preset applied`);
    };

    return (
        <div className='max-w-6xl mx-auto space-y-8'>
            {/* Header info */}
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3'>
                    <span>🫧</span> {t.name}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                    {t.description}
                </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className='flex justify-center'>
                <div className='inline-flex p-1.5 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-inner'>
                    <button
                        onClick={() => setMode("neumorphism")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            mode === "neumorphism"
                                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                    >
                        <span>⚪</span> {t.tabNeumorphism}
                    </button>
                    <button
                        onClick={() => setMode("claymorphism")}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                            mode === "claymorphism"
                                ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                    >
                        <span>🧸</span> {t.tabClaymorphism}
                    </button>
                </div>
            </div>

            {/* Presets Bar */}
            <div className='flex items-center gap-2 flex-wrap justify-center'>
                <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>
                    ✨ {t.presetsTitle}:
                </span>
                {mode === "neumorphism" ? (
                    <>
                        <button onClick={() => applyPreset("flat")} className='px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer'>
                            {t.presetFlat}
                        </button>
                        <button onClick={() => applyPreset("convex")} className='px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer'>
                            {t.presetConvex}
                        </button>
                        <button onClick={() => applyPreset("concave")} className='px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer'>
                            {t.presetConcave}
                        </button>
                        <button onClick={() => applyPreset("pressed")} className='px-3 py-1 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer'>
                            {t.presetPressed}
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => applyPreset("clayCard")} className='px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-xs font-medium text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer'>
                            {t.presetClayCard}
                        </button>
                        <button onClick={() => applyPreset("clayPuffy")} className='px-3 py-1 rounded-xl bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 text-xs font-medium text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 transition-colors cursor-pointer'>
                            {t.presetClayPuffy}
                        </button>
                        <button onClick={() => applyPreset("clayVibrant")} className='px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer'>
                            {t.presetClayVibrant}
                        </button>
                        <button onClick={() => applyPreset("clayDark")} className='px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors cursor-pointer'>
                            {t.presetClayDark}
                        </button>
                    </>
                )}
            </div>

            {/* Main Interactive Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
                {/* Controls Column */}
                <div className='lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6'>
                    <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3'>
                        <h2 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                            <span>🎛️</span> {t.controlsTitle}
                        </h2>
                        <span className='text-xs uppercase font-mono font-bold text-blue-600 dark:text-blue-400'>
                            {mode}
                        </span>
                    </div>

                    {/* Color selection */}
                    <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                            <label className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                                {t.baseColor}
                            </label>
                            <span className='text-xs font-mono font-bold text-gray-500 uppercase'>
                                {color}
                            </span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <input
                                type='color'
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className='w-12 h-10 rounded-xl cursor-pointer border border-gray-300 dark:border-gray-600 p-0.5 bg-transparent'
                            />
                            <input
                                type='text'
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-bold text-gray-900 dark:text-gray-100'
                            />
                        </div>

                        {/* Palette pills */}
                        <div className='flex flex-wrap gap-1.5 pt-1'>
                            {colorPresets.map((cp) => (
                                <button
                                    key={cp.hex}
                                    onClick={() => setColor(cp.hex)}
                                    title={cp.name}
                                    style={{ backgroundColor: cp.hex }}
                                    className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 cursor-pointer ${
                                        color.toLowerCase() === cp.hex.toLowerCase()
                                            ? "ring-2 ring-blue-500 scale-110"
                                            : "border-gray-300 dark:border-gray-600"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Shape / Subtype (for Neumorphism) */}
                    {mode === "neumorphism" && (
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                                {t.shapeType}
                            </label>
                            <div className='grid grid-cols-2 gap-2'>
                                {[
                                    { id: "flat", label: t.shapeFlat },
                                    { id: "convex", label: t.shapeConvex },
                                    { id: "concave", label: t.shapeConcave },
                                    { id: "pressed", label: t.shapePressed },
                                ].map((sh) => (
                                    <button
                                        key={sh.id}
                                        onClick={() => setShape(sh.id as SurfaceShape)}
                                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                            shape === sh.id
                                                ? "bg-blue-600 text-white shadow-xs"
                                                : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                        }`}
                                    >
                                        {sh.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Light Direction */}
                    <div className='space-y-2'>
                        <label className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                            {t.lightDirection}
                        </label>
                        <div className='grid grid-cols-2 gap-2'>
                            {[
                                { id: "top-left", label: t.dirTopLeft, icon: "↖️" },
                                { id: "top-right", label: t.dirTopRight, icon: "↗️" },
                                { id: "bottom-left", label: t.dirBottomLeft, icon: "↙️" },
                                { id: "bottom-right", label: t.dirBottomRight, icon: "↘️" },
                            ].map((dir) => (
                                <button
                                    key={dir.id}
                                    onClick={() => setDirection(dir.id as LightDirection)}
                                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                        direction === dir.id
                                            ? "bg-blue-600 text-white shadow-xs"
                                            : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                    }`}
                                >
                                    <span>{dir.icon}</span>
                                    <span>{dir.label.split(" ")[0]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Slider Controls */}
                    <div className='space-y-4 pt-2'>
                        {/* Size */}
                        <div className='space-y-1.5'>
                            <div className='flex justify-between text-xs'>
                                <span className='font-semibold text-gray-600 dark:text-gray-400'>{t.size}</span>
                                <span className='font-mono font-bold text-gray-900 dark:text-gray-100'>{size}px</span>
                            </div>
                            <input
                                type='range'
                                min='140'
                                max='380'
                                value={size}
                                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                                className='w-full accent-blue-600 cursor-pointer'
                            />
                        </div>

                        {/* Radius */}
                        <div className='space-y-1.5'>
                            <div className='flex justify-between text-xs'>
                                <span className='font-semibold text-gray-600 dark:text-gray-400'>{t.radius}</span>
                                <span className='font-mono font-bold text-gray-900 dark:text-gray-100'>{radius}px</span>
                            </div>
                            <input
                                type='range'
                                min='0'
                                max='80'
                                value={radius}
                                onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                                className='w-full accent-blue-600 cursor-pointer'
                            />
                        </div>

                        {mode === "neumorphism" ? (
                            <>
                                {/* Distance */}
                                <div className='space-y-1.5'>
                                    <div className='flex justify-between text-xs'>
                                        <span className='font-semibold text-gray-600 dark:text-gray-400'>{t.distance}</span>
                                        <span className='font-mono font-bold text-gray-900 dark:text-gray-100'>{distance}px</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='3'
                                        max='40'
                                        value={distance}
                                        onChange={(e) => setDistance(parseInt(e.target.value, 10))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>

                                {/* Blur */}
                                <div className='space-y-1.5'>
                                    <div className='flex justify-between text-xs'>
                                        <span className='font-semibold text-gray-600 dark:text-gray-400'>{t.blur}</span>
                                        <span className='font-mono font-bold text-gray-900 dark:text-gray-100'>{blur}px</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='4'
                                        max='60'
                                        value={blur}
                                        onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>

                                {/* Intensity */}
                                <div className='space-y-1.5'>
                                    <div className='flex justify-between text-xs'>
                                        <span className='font-semibold text-gray-600 dark:text-gray-400'>{t.intensity}</span>
                                        <span className='font-mono font-bold text-gray-900 dark:text-gray-100'>{Math.round(intensity * 100)}%</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='5'
                                        max='40'
                                        value={Math.round(intensity * 100)}
                                        onChange={(e) => setIntensity(parseInt(e.target.value, 10) / 100)}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Clay Depth (3D Puffiness) */}
                                <div className='space-y-1.5'>
                                    <div className='flex justify-between text-xs'>
                                        <span className='font-semibold text-gray-600 dark:text-gray-400'>{t.clayDepth}</span>
                                        <span className='font-mono font-bold text-gray-900 dark:text-gray-100'>{clayDepth}px</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='4'
                                        max='30'
                                        value={clayDepth}
                                        onChange={(e) => setClayDepth(parseInt(e.target.value, 10))}
                                        className='w-full accent-purple-600 cursor-pointer'
                                    />
                                </div>

                                {/* Clay Outer Drop Distance */}
                                <div className='space-y-1.5'>
                                    <div className='flex justify-between text-xs'>
                                        <span className='font-semibold text-gray-600 dark:text-gray-400'>{t.clayDropShadow}</span>
                                        <span className='font-mono font-bold text-gray-900 dark:text-gray-100'>{clayOuterDistance}px / blur {clayOuterBlur}px</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='4'
                                        max='40'
                                        value={clayOuterDistance}
                                        onChange={(e) => {
                                            const v = parseInt(e.target.value, 10);
                                            setClayOuterDistance(v);
                                            setClayOuterBlur(v * 1.8);
                                        }}
                                        className='w-full accent-purple-600 cursor-pointer'
                                    />
                                </div>

                                {/* Clay Outer Shadow Color */}
                                <div className='space-y-1.5'>
                                    <div className='flex justify-between text-xs'>
                                        <span className='font-semibold text-gray-600 dark:text-gray-400'>Shadow Color</span>
                                        <span className='font-mono font-bold text-gray-900 dark:text-gray-100'>{clayShadowColor}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='color'
                                            value={clayShadowColor}
                                            onChange={(e) => setClayShadowColor(e.target.value)}
                                            className='w-8 h-8 rounded-lg cursor-pointer bg-transparent'
                                        />
                                        <input
                                            type='text'
                                            value={clayShadowColor}
                                            onChange={(e) => setClayShadowColor(e.target.value)}
                                            className='w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-mono font-semibold'
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Preview & Code Column */}
                <div className='lg:col-span-7 space-y-6'>
                    {/* Live Preview Container */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                                <span>👁️</span> {t.previewTitle}
                            </h2>
                            <div className='flex items-center gap-1.5'>
                                {(["card", "button", "input"] as const).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setPreviewType(type)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                                            previewType === type
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                                                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Canvas Canvas */}
                        <div
                            className='w-full rounded-2xl p-10 flex items-center justify-center min-h-[360px] transition-colors relative overflow-hidden'
                            style={{
                                backgroundColor: mode === "neumorphism" ? color : "#f1f5f9",
                            }}
                        >
                            {/* Rendered Preview Element */}
                            <div
                                style={{
                                    width: `${size}px`,
                                    minHeight: previewType === "button" ? "60px" : previewType === "input" ? "54px" : `${size}px`,
                                    borderRadius: computedStyles.borderRadius,
                                    background: computedStyles.background,
                                    boxShadow: computedStyles.boxShadow,
                                }}
                                className={`flex flex-col items-center justify-center p-6 text-center select-none transition-all duration-200 cursor-pointer ${
                                    previewType === "button" ? "hover:scale-105 active:scale-95" : ""
                                }`}
                            >
                                {previewType === "card" && (
                                    <div className='space-y-3'>
                                        <div className='w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl bg-black/5 dark:bg-white/10'>
                                            ✨
                                        </div>
                                        <h4 className='font-bold text-sm text-gray-800 dark:text-gray-200'>
                                            {mode === "neumorphism" ? "Neumorphic Card" : "3D Clay Pill"}
                                        </h4>
                                        <p className='text-xs opacity-75 max-w-[180px] mx-auto line-clamp-2'>
                                            Tactile soft shadows & 3D bevels rendered via pure CSS.
                                        </p>
                                    </div>
                                )}

                                {previewType === "button" && (
                                    <span className='font-bold text-sm tracking-wide text-gray-800 dark:text-gray-200'>
                                        🚀 Click Me!
                                    </span>
                                )}

                                {previewType === "input" && (
                                    <input
                                        type='text'
                                        placeholder='Type here...'
                                        readOnly
                                        className='bg-transparent text-center font-medium text-xs text-gray-800 dark:text-gray-200 outline-none w-full'
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Generated Code Card */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                        <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3'>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => setCodeTab("css")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        codeTab === "css"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                                    }`}
                                >
                                    {t.tabCss}
                                </button>
                                <button
                                    onClick={() => setCodeTab("tailwind")}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        codeTab === "tailwind"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                                    }`}
                                >
                                    {t.tabTailwind}
                                </button>
                            </div>

                            <button
                                onClick={handleCopy}
                                className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-semibold text-xs border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer shadow-xs'
                            >
                                📋 {t.copyCode}
                            </button>
                        </div>

                        {/* Code box */}
                        <div className='bg-gray-900 text-gray-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-gray-800'>
                            <pre className='whitespace-pre-wrap select-all'>
                                {codeTab === "css" ? generatedCss : generatedTailwind}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guide Section */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <h2 className='text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <span>📖</span> {t.guideTitle}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-blue-600 dark:text-blue-400'>{t.guide1Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-purple-600 dark:text-purple-400'>{t.guide2Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-emerald-600 dark:text-emerald-400'>{t.guide3Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <span>❓</span> {t.faqTitle}
                </h3>
                <div className='space-y-3 text-xs'>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq1Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq1A}</p>
                    </div>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq2Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq2A}</p>
                    </div>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq3Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq3A}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
