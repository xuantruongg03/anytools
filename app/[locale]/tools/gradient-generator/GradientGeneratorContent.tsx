"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { gradientGeneratorTranslations } from "@/lib/i18n/tools/gradient-generator";
import { toast } from "@/components/ui/Toast";

type GradientType = "linear" | "radial" | "conic";

interface ColorStop {
    id: string;
    color: string;
    position: number;
}

const PRESETS: Array<{ nameKey: string; type: GradientType; angle: number; stops: ColorStop[] }> = [
    {
        nameKey: "presetSunset",
        type: "linear",
        angle: 90,
        stops: [
            { id: "1", color: "#ff512f", position: 0 },
            { id: "2", color: "#f09819", position: 100 },
        ],
    },
    {
        nameKey: "presetCyberpunk",
        type: "linear",
        angle: 135,
        stops: [
            { id: "1", color: "#ff007f", position: 0 },
            { id: "2", color: "#7928ca", position: 50 },
            { id: "3", color: "#00f0ff", position: 100 },
        ],
    },
    {
        nameKey: "presetOcean",
        type: "linear",
        angle: 180,
        stops: [
            { id: "1", color: "#2b5876", position: 0 },
            { id: "2", color: "#4e4376", position: 100 },
        ],
    },
    {
        nameKey: "presetAurora",
        type: "linear",
        angle: 45,
        stops: [
            { id: "1", color: "#00c6ff", position: 0 },
            { id: "2", color: "#0072ff", position: 100 },
        ],
    },
    {
        nameKey: "presetPeach",
        type: "linear",
        angle: 90,
        stops: [
            { id: "1", color: "#ed4264", position: 0 },
            { id: "2", color: "#ffedbc", position: 100 },
        ],
    },
    {
        nameKey: "presetMidnight",
        type: "linear",
        angle: 120,
        stops: [
            { id: "1", color: "#0f0c29", position: 0 },
            { id: "2", color: "#302b63", position: 50 },
            { id: "3", color: "#24243e", position: 100 },
        ],
    },
    {
        nameKey: "presetEmerald",
        type: "linear",
        angle: 90,
        stops: [
            { id: "1", color: "#0ba360", position: 0 },
            { id: "2", color: "#3cba92", position: 100 },
        ],
    },
    {
        nameKey: "presetNeon",
        type: "linear",
        angle: 135,
        stops: [
            { id: "1", color: "#11998e", position: 0 },
            { id: "2", color: "#38ef7d", position: 100 },
        ],
    },
];

export default function GradientGeneratorContent() {
    const { locale } = useLanguage();
    const t = gradientGeneratorTranslations[locale as "en" | "vi"] || gradientGeneratorTranslations.en;
    const isVi = locale === "vi";

    const [type, setType] = useState<GradientType>("linear");
    const [angle, setAngle] = useState<number>(90);
    const [stops, setStops] = useState<ColorStop[]>([
        { id: "1", color: "#3b82f6", position: 0 },
        { id: "2", color: "#8b5cf6", position: 50 },
        { id: "3", color: "#ec4899", position: 100 },
    ]);

    // Construct CSS gradient string
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsString = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");

    const cssGradient = (() => {
        if (type === "linear") return `linear-gradient(${angle}deg, ${stopsString})`;
        if (type === "radial") return `radial-gradient(circle at center, ${stopsString})`;
        return `conic-gradient(from ${angle}deg at 50% 50%, ${stopsString})`;
    })();

    const fullCssRule = `background: ${cssGradient};`;

    // Add color stop
    const addStop = () => {
        if (stops.length >= 6) return;
        const randomHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
        const nextPos = Math.min(100, (stops[stops.length - 1]?.position || 50) + 15);
        setStops((prev) => [
            ...prev,
            { id: Math.random().toString(36).substring(2, 9), color: randomHex, position: nextPos },
        ]);
    };

    // Remove color stop
    const removeStop = (id: string) => {
        if (stops.length <= 2) return;
        setStops((prev) => prev.filter((s) => s.id !== id));
    };

    // Update stop color
    const updateStopColor = (id: string, color: string) => {
        setStops((prev) => prev.map((s) => (s.id === id ? { ...s, color } : s)));
    };

    // Update stop position
    const updateStopPosition = (id: string, position: number) => {
        setStops((prev) => prev.map((s) => (s.id === id ? { ...s, position } : s)));
    };

    // Randomize
    const handleRandomize = () => {
        const randomAngle = Math.floor(Math.random() * 360);
        const randomColors = Array.from({ length: 3 }, () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));
        setAngle(randomAngle);
        setStops([
            { id: "1", color: randomColors[0], position: 0 },
            { id: "2", color: randomColors[1], position: 50 },
            { id: "3", color: randomColors[2], position: 100 },
        ]);
    };

    // Apply preset
    const applyPreset = (preset: typeof PRESETS[0]) => {
        setType(preset.type);
        setAngle(preset.angle);
        setStops(preset.stops);
    };

    const handleCopyCss = () => {
        navigator.clipboard.writeText(fullCssRule);
        toast.success(t.copied);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Live Gradient Preview Display */}
            <div
                style={{ background: cssGradient }}
                className='w-full h-64 sm:h-80 rounded-3xl shadow-lg border border-white/20 relative overflow-hidden transition-all flex items-end justify-end p-4'
            >
                <button
                    type='button'
                    onClick={handleRandomize}
                    className='px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5'
                >
                    <span>🎲</span>
                    <span>{t.randomize}</span>
                </button>
            </div>

            {/* Controls & Color Stops Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 w-full'>
                {/* Controls Column */}
                <div className='lg:col-span-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5'>
                    <div>
                        <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                            {t.gradientType}
                        </label>
                        <div className='grid grid-cols-3 gap-2'>
                            {(["linear", "radial", "conic"] as GradientType[]).map((gt) => (
                                <button
                                    key={gt}
                                    type='button'
                                    onClick={() => setType(gt)}
                                    className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                                        type === gt
                                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                            : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                    }`}
                                >
                                    {gt === "linear" && t.typeLinear}
                                    {gt === "radial" && t.typeRadial}
                                    {gt === "conic" && t.typeConic}
                                </button>
                            ))}
                        </div>
                    </div>

                    {type !== "radial" && (
                        <div>
                            <div className='flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                <span>{t.angle}</span>
                                <span className='font-mono font-bold text-blue-600'>{angle}°</span>
                            </div>
                            <input
                                type='range'
                                min='0'
                                max='360'
                                value={angle}
                                onChange={(e) => setAngle(Number(e.target.value))}
                                className='w-full accent-blue-600'
                            />
                        </div>
                    )}

                    {/* Color Stops */}
                    <div>
                        <div className='flex items-center justify-between mb-3'>
                            <label className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
                                {t.colorStops} ({stops.length}/6)
                            </label>
                            {stops.length < 6 && (
                                <button
                                    type='button'
                                    onClick={addStop}
                                    className='text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                                >
                                    + {t.addColor}
                                </button>
                            )}
                        </div>

                        <div className='space-y-3'>
                            {stops.map((stop) => (
                                <div
                                    key={stop.id}
                                    className='flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700'
                                >
                                    <input
                                        type='color'
                                        value={stop.color}
                                        onChange={(e) => updateStopColor(stop.id, e.target.value)}
                                        className='w-8 h-8 rounded-lg border-0 cursor-pointer p-0 bg-transparent'
                                    />
                                    <span className='text-xs font-mono text-gray-700 dark:text-gray-300 uppercase w-16'>
                                        {stop.color}
                                    </span>
                                    <input
                                        type='range'
                                        min='0'
                                        max='100'
                                        value={stop.position}
                                        onChange={(e) => updateStopPosition(stop.id, Number(e.target.value))}
                                        className='flex-1 accent-blue-600'
                                    />
                                    <span className='text-xs font-mono text-gray-500 w-8 text-right'>
                                        {stop.position}%
                                    </span>
                                    {stops.length > 2 && (
                                        <button
                                            type='button'
                                            onClick={() => removeStop(stop.id)}
                                            className='text-gray-400 hover:text-red-500 text-xs px-1 cursor-pointer'
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Presets Column */}
                <div className='lg:col-span-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                    <h3 className='font-bold text-base text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800'>
                        {t.presets}
                    </h3>

                    <div className='grid grid-cols-2 gap-3'>
                        {PRESETS.map((preset, idx) => {
                            const pStops = preset.stops.map((s) => `${s.color} ${s.position}%`).join(", ");
                            const bgStyle = `linear-gradient(${preset.angle}deg, ${pStops})`;
                            const title = (t as any)[preset.nameKey] || preset.nameKey;

                            return (
                                <button
                                    key={idx}
                                    type='button'
                                    onClick={() => applyPreset(preset)}
                                    className='group flex flex-col p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all text-left cursor-pointer'
                                >
                                    <div
                                        style={{ background: bgStyle }}
                                        className='w-full h-14 rounded-lg shadow-inner mb-2 group-hover:scale-[1.02] transition-transform'
                                    />
                                    <span className='text-xs font-semibold text-gray-800 dark:text-gray-200 truncate'>
                                        {title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Generated CSS Code Card */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                <div className='flex items-center justify-between flex-wrap gap-2'>
                    <h3 className='font-bold text-base text-gray-900 dark:text-white flex items-center gap-2'>
                        <span>🎨</span>
                        <span>{t.cssCode}</span>
                    </h3>
                    <Button onClick={handleCopyCss} variant='primary' size='sm' className='font-bold cursor-pointer'>
                        📋 {t.copyCss}
                    </Button>
                </div>

                <div className='p-4 bg-gray-900 rounded-xl overflow-x-auto text-xs font-mono text-emerald-400 border border-gray-800'>
                    <code>{fullCssRule}</code>
                </div>
            </div>
        </div>
    );
}
