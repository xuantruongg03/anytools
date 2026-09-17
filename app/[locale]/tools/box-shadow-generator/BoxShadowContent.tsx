"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ShadowLayer {
    id: string;
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    opacity: number;
    inset: boolean;
}

export default function BoxShadowContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const toolT = (t.tools as any).boxShadowGenerator;
    const ui = toolT?.ui || {};
    const page = toolT?.page || {};

    const [mode, setMode] = useState<"shadow" | "glass">("shadow");
    const [previewBg, setPreviewBg] = useState<"light" | "dark" | "gradient">("gradient");
    const [copiedCss, setCopiedCss] = useState<boolean>(false);
    const [copiedTw, setCopiedTw] = useState<boolean>(false);

    // Multi-layer shadow state
    const [layers, setLayers] = useState<ShadowLayer[]>([
        { id: "1", x: 0, y: 10, blur: 25, spread: -5, color: "#000000", opacity: 0.1, inset: false },
        { id: "2", x: 0, y: 8, blur: 10, spread: -6, color: "#000000", opacity: 0.1, inset: false },
    ]);

    // Glassmorphism state
    const [glassBlur, setGlassBlur] = useState<number>(16);
    const [glassOpacity, setGlassOpacity] = useState<number>(0.25);
    const [glassBorder, setGlassBorder] = useState<number>(0.2);

    // Helpers to convert hex to rgba
    const hexToRgba = (hex: string, alpha: number) => {
        let cleanHex = hex.replace("#", "");
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split("").map((c) => c + c).join("");
        }
        const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
        const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
        const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Computed CSS string
    const shadowCssValue = useMemo(() => {
        return layers
            .map((l) => `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color, l.opacity)}`)
            .join(", ");
    }, [layers]);

    const glassStyle = useMemo(() => {
        return {
            backgroundColor: `rgba(255, 255, 255, ${glassOpacity})`,
            backdropFilter: `blur(${glassBlur}px)`,
            WebkitBackdropFilter: `blur(${glassBlur}px)`,
            border: `1px solid rgba(255, 255, 255, ${glassBorder})`,
            boxShadow: shadowCssValue,
        };
    }, [glassOpacity, glassBlur, glassBorder, shadowCssValue]);

    const generatedCss = useMemo(() => {
        if (mode === "glass") {
            return `background: rgba(255, 255, 255, ${glassOpacity});\nbackdrop-filter: blur(${glassBlur}px);\n-webkit-backdrop-filter: blur(${glassBlur}px);\nborder: 1px solid rgba(255, 255, 255, ${glassBorder});\nbox-shadow: ${shadowCssValue};`;
        }
        return `box-shadow: ${shadowCssValue};`;
    }, [mode, glassOpacity, glassBlur, glassBorder, shadowCssValue]);

    const generatedTailwind = useMemo(() => {
        if (mode === "glass") {
            return `bg-white/[${glassOpacity}] backdrop-blur-[${glassBlur}px] border border-white/[${glassBorder}] shadow-[${shadowCssValue.replace(/\s+/g, "_")}]`;
        }
        return `shadow-[${shadowCssValue.replace(/\s+/g, "_")}]`;
    }, [mode, glassOpacity, glassBlur, glassBorder, shadowCssValue]);

    const applyPreset = (presetKey: string) => {
        switch (presetKey) {
            case "soft":
                setLayers([
                    { id: "1", x: 0, y: 4, blur: 20, spread: 0, color: "#000000", opacity: 0.08, inset: false },
                ]);
                break;
            case "medium":
                setLayers([
                    { id: "1", x: 0, y: 10, blur: 25, spread: -5, color: "#000000", opacity: 0.1, inset: false },
                    { id: "2", x: 0, y: 8, blur: 10, spread: -6, color: "#000000", opacity: 0.1, inset: false },
                ]);
                break;
            case "hard":
                setLayers([
                    { id: "1", x: 6, y: 6, blur: 0, spread: 0, color: "#111827", opacity: 1, inset: false },
                ]);
                break;
            case "float":
                setLayers([
                    { id: "1", x: 0, y: 20, blur: 35, spread: -10, color: "#000000", opacity: 0.25, inset: false },
                    { id: "2", x: 0, y: 10, blur: 15, spread: -5, color: "#000000", opacity: 0.15, inset: false },
                ]);
                break;
            case "neon":
                setLayers([
                    { id: "1", x: 0, y: 0, blur: 15, spread: 2, color: "#3b82f6", opacity: 0.8, inset: false },
                    { id: "2", x: 0, y: 0, blur: 30, spread: 6, color: "#8b5cf6", opacity: 0.4, inset: false },
                ]);
                break;
            case "inner":
                setLayers([
                    { id: "1", x: 0, y: 4, blur: 12, spread: 0, color: "#000000", opacity: 0.2, inset: true },
                ]);
                break;
        }
    };

    const addLayer = () => {
        const newLayer: ShadowLayer = {
            id: String(Date.now()),
            x: 0,
            y: 10,
            blur: 20,
            spread: 0,
            color: "#000000",
            opacity: 0.1,
            inset: false,
        };
        setLayers([...layers, newLayer]);
    };

    const removeLayer = (id: string) => {
        if (layers.length <= 1) return;
        setLayers(layers.filter((l) => l.id !== id));
    };

    const updateLayer = (id: string, field: keyof ShadowLayer, value: any) => {
        setLayers(layers.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
    };

    return (
        <div className='space-y-8 max-w-6xl mx-auto'>
            {/* Mode & Presets Header */}
            <div className='flex flex-wrap items-center justify-between gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => setMode("shadow")}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            mode === "shadow"
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                        ✨ {ui.modeShadow || "Box Shadow"}
                    </button>
                    <button
                        onClick={() => setMode("glass")}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            mode === "glass"
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                    >
                        🪟 {ui.modeGlass || "Glassmorphism"}
                    </button>
                </div>

                {/* Presets Chips */}
                <div className='flex items-center gap-1.5 flex-wrap text-xs'>
                    <span className='font-semibold text-gray-500 dark:text-gray-400 mr-1'>{ui.presets || "Presets"}:</span>
                    <button onClick={() => applyPreset("soft")} className='px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer'>
                        {ui.presetSoft || "Soft"}
                    </button>
                    <button onClick={() => applyPreset("medium")} className='px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer'>
                        {ui.presetMedium || "Medium"}
                    </button>
                    <button onClick={() => applyPreset("float")} className='px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer'>
                        {ui.presetFloat || "Floating"}
                    </button>
                    <button onClick={() => applyPreset("neon")} className='px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer'>
                        {ui.presetNeon || "Neon"}
                    </button>
                    <button onClick={() => applyPreset("hard")} className='px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer'>
                        {ui.presetHard || "Hard"}
                    </button>
                    <button onClick={() => applyPreset("inner")} className='px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer'>
                        {ui.presetInner || "Inner"}
                    </button>
                </div>
            </div>

            {/* Split Editor: Left Sliders, Right Live Preview */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                {/* Left Controls */}
                <div className='lg:col-span-6 space-y-6'>
                    {mode === "glass" && (
                        <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4'>
                            <h4 className='text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400'>
                                🪟 Glassmorphism Settings
                            </h4>
                            <div>
                                <div className='flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                    <span>{ui.glassBlur || "Backdrop Blur"}</span>
                                    <span>{glassBlur}px</span>
                                </div>
                                <input
                                    type='range'
                                    min='0'
                                    max='40'
                                    value={glassBlur}
                                    onChange={(e) => setGlassBlur(Number(e.target.value))}
                                    className='w-full accent-purple-600 cursor-pointer'
                                />
                            </div>

                            <div>
                                <div className='flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                    <span>{ui.glassOpacity || "Background Opacity"}</span>
                                    <span>{Math.round(glassOpacity * 100)}%</span>
                                </div>
                                <input
                                    type='range'
                                    min='0'
                                    max='1'
                                    step='0.01'
                                    value={glassOpacity}
                                    onChange={(e) => setGlassOpacity(Number(e.target.value))}
                                    className='w-full accent-purple-600 cursor-pointer'
                                />
                            </div>

                            <div>
                                <div className='flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                    <span>{ui.glassBorder || "Border Opacity"}</span>
                                    <span>{Math.round(glassBorder * 100)}%</span>
                                </div>
                                <input
                                    type='range'
                                    min='0'
                                    max='1'
                                    step='0.01'
                                    value={glassBorder}
                                    onChange={(e) => setGlassBorder(Number(e.target.value))}
                                    className='w-full accent-purple-600 cursor-pointer'
                                />
                            </div>
                        </Card>
                    )}

                    {/* Shadow Layers */}
                    {layers.map((layer, idx) => (
                        <Card
                            key={layer.id}
                            className='p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4'
                        >
                            <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2'>
                                <span className='text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400'>
                                    Layer #{idx + 1}
                                </span>
                                <div className='flex items-center gap-3'>
                                    <label className='flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer font-medium'>
                                        <input
                                            type='checkbox'
                                            checked={layer.inset}
                                            onChange={(e) => updateLayer(layer.id, "inset", e.target.checked)}
                                            className='rounded text-blue-600 accent-blue-600 cursor-pointer'
                                        />
                                        {ui.inset || "Inset"}
                                    </label>
                                    {layers.length > 1 && (
                                        <button
                                            onClick={() => removeLayer(layer.id)}
                                            className='text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer'
                                        >
                                            {ui.removeLayer || "Remove"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <div className='flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300 mb-1'>
                                        <span>{ui.horizontal || "X Offset"}</span>
                                        <span>{layer.x}px</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='-50'
                                        max='50'
                                        value={layer.x}
                                        onChange={(e) => updateLayer(layer.id, "x", Number(e.target.value))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                                <div>
                                    <div className='flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300 mb-1'>
                                        <span>{ui.vertical || "Y Offset"}</span>
                                        <span>{layer.y}px</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='-50'
                                        max='50'
                                        value={layer.y}
                                        onChange={(e) => updateLayer(layer.id, "y", Number(e.target.value))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <div className='flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300 mb-1'>
                                        <span>{ui.blur || "Blur"}</span>
                                        <span>{layer.blur}px</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        value={layer.blur}
                                        onChange={(e) => updateLayer(layer.id, "blur", Number(e.target.value))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                                <div>
                                    <div className='flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300 mb-1'>
                                        <span>{ui.spread || "Spread"}</span>
                                        <span>{layer.spread}px</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='-30'
                                        max='50'
                                        value={layer.spread}
                                        onChange={(e) => updateLayer(layer.id, "spread", Number(e.target.value))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4 items-center'>
                                <div>
                                    <label className='block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1'>
                                        {ui.color || "Shadow Color"}
                                    </label>
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='color'
                                            value={layer.color}
                                            onChange={(e) => updateLayer(layer.id, "color", e.target.value)}
                                            className='w-9 h-9 rounded-lg border border-gray-300 dark:border-gray-600 p-0.5 cursor-pointer'
                                        />
                                        <span className='font-mono text-xs uppercase font-semibold text-gray-800 dark:text-gray-200'>
                                            {layer.color}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className='flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300 mb-1'>
                                        <span>{ui.opacity || "Opacity"}</span>
                                        <span>{Math.round(layer.opacity * 100)}%</span>
                                    </div>
                                    <input
                                        type='range'
                                        min='0'
                                        max='1'
                                        step='0.01'
                                        value={layer.opacity}
                                        onChange={(e) => updateLayer(layer.id, "opacity", Number(e.target.value))}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}

                    <button
                        onClick={addLayer}
                        className='w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors cursor-pointer'
                    >
                        {ui.addLayer || "+ Add Shadow Layer"}
                    </button>
                </div>

                {/* Right Live Preview & Code */}
                <div className='lg:col-span-6 space-y-6'>
                    {/* Preview Box with Background Switcher */}
                    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-md'>
                        <div className='flex items-center justify-between mb-4'>
                            <span className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                                {ui.previewTitle || "Live Preview"}
                            </span>
                            {/* Background Selector */}
                            <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg text-xs'>
                                <button
                                    onClick={() => setPreviewBg("light")}
                                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                                        previewBg === "light"
                                            ? "bg-white dark:bg-gray-800 shadow-xs text-gray-900 dark:text-white"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    {ui.bgLight || "Light"}
                                </button>
                                <button
                                    onClick={() => setPreviewBg("dark")}
                                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                                        previewBg === "dark"
                                            ? "bg-white dark:bg-gray-800 shadow-xs text-gray-900 dark:text-white"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    {ui.bgDark || "Dark"}
                                </button>
                                <button
                                    onClick={() => setPreviewBg("gradient")}
                                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                                        previewBg === "gradient"
                                            ? "bg-white dark:bg-gray-800 shadow-xs text-gray-900 dark:text-white"
                                            : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    {ui.bgGradient || "Gradient"}
                                </button>
                            </div>
                        </div>

                        {/* Viewport Canvas */}
                        <div
                            className={`min-h-[340px] rounded-xl flex items-center justify-center p-8 transition-colors ${
                                previewBg === "light"
                                    ? "bg-gray-100"
                                    : previewBg === "dark"
                                    ? "bg-gray-950"
                                    : "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500"
                            }`}
                        >
                            {/* Preview Card */}
                            <div
                                style={mode === "glass" ? glassStyle : { boxShadow: shadowCssValue }}
                                className={`w-full max-w-xs p-6 rounded-2xl transition-all duration-150 ${
                                    mode === "glass"
                                        ? "text-white"
                                        : previewBg === "dark"
                                        ? "bg-gray-900 text-white border border-gray-800"
                                        : "bg-white text-gray-900 border border-gray-100"
                                }`}
                            >
                                <div className='w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center text-2xl mb-4 font-bold'>
                                    ✨
                                </div>
                                <h3 className='text-lg font-bold mb-1'>{ui.cardText || "Preview Card"}</h3>
                                <p className='text-xs opacity-80 leading-relaxed'>
                                    {ui.cardDesc || "Adjust the controls on the left to see live box-shadow & glass changes."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Export Code Box */}
                    <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4'>
                        <div className='flex items-center justify-between'>
                            <span className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                                CSS Output
                            </span>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedCss);
                                        setCopiedCss(true);
                                        setTimeout(() => setCopiedCss(false), 2000);
                                    }}
                                    className='px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-sm'
                                >
                                    {copiedCss ? (ui.copied || "Copied!") : (ui.copyCss || "Copy CSS")}
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedTailwind);
                                        setCopiedTw(true);
                                        setTimeout(() => setCopiedTw(false), 2000);
                                    }}
                                    className='px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 rounded-lg transition-colors cursor-pointer shadow-sm'
                                >
                                    {copiedTw ? (ui.copied || "Copied!") : (ui.copyTailwind || "Copy Tailwind")}
                                </button>
                            </div>
                        </div>

                        <pre className='p-4 bg-gray-900 text-green-400 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed'>
                            <code>{generatedCss}</code>
                        </pre>

                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                            <span className='font-semibold'>Tailwind arbitrary class:</span>
                            <pre className='mt-1 p-2 bg-gray-100 dark:bg-gray-900/60 rounded-lg font-mono text-xs overflow-x-auto text-purple-600 dark:text-purple-400'>
                                <code>{generatedTailwind}</code>
                            </pre>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Rich SEO Content */}
            {page.whatIs && (
                <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                    <section className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.whatIs}</h2>
                        <p className='leading-relaxed mb-6'>{page.whatIsDesc}</p>

                        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                            {locale === "vi" ? "Tính Năng Nổi Bật" : "Key Features"}
                        </h3>
                        <ul className='list-disc pl-5 space-y-2 text-sm leading-relaxed'>
                            {Object.values(page.features || {}).map((feat: any, idx: number) => (
                                <li key={idx}>{feat}</li>
                            ))}
                        </ul>
                    </section>

                    {/* FAQ */}
                    {page.faq && (
                        <section className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                                {locale === "vi" ? "Câu Hỏi Thường Gặp" : "Frequently Asked Questions"}
                            </h2>
                            <div className='space-y-4'>
                                {[1, 2, 3].map((i) => {
                                    const q = page.faq[`q${i}`];
                                    const a = page.faq[`a${i}`];
                                    if (!q) return null;
                                    return (
                                        <details key={i} className='group border border-gray-200 dark:border-gray-700 rounded-xl p-4 open:bg-gray-50 dark:open:bg-gray-900/50 transition-colors'>
                                            <summary className='font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between'>
                                                <span>{q}</span>
                                                <span className='transition group-open:rotate-180 text-gray-400'>▼</span>
                                            </summary>
                                            <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>{a}</p>
                                        </details>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
