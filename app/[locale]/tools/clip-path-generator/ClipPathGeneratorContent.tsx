"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { clipPathTranslations } from "@/lib/i18n/tools/clip-path-generator";
import { toast } from "@/components/ui/Toast";

interface Point {
    x: number; // 0 to 100
    y: number; // 0 to 100
}

interface ShapePreset {
    id: string;
    nameKey: keyof typeof clipPathTranslations.en;
    icon: string;
    points: Point[];
}

const PRESETS: ShapePreset[] = [
    {
        id: "triangle",
        nameKey: "triangle",
        icon: "▲",
        points: [
            { x: 50, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
        ],
    },
    {
        id: "trapezoid",
        nameKey: "trapezoid",
        icon: "⏢",
        points: [
            { x: 20, y: 0 },
            { x: 80, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
        ],
    },
    {
        id: "parallelogram",
        nameKey: "parallelogram",
        icon: "▱",
        points: [
            { x: 25, y: 0 },
            { x: 100, y: 0 },
            { x: 75, y: 100 },
            { x: 0, y: 100 },
        ],
    },
    {
        id: "rhombus",
        nameKey: "rhombus",
        icon: "◆",
        points: [
            { x: 50, y: 0 },
            { x: 100, y: 50 },
            { x: 50, y: 100 },
            { x: 0, y: 50 },
        ],
    },
    {
        id: "pentagon",
        nameKey: "pentagon",
        icon: "⬟",
        points: [
            { x: 50, y: 0 },
            { x: 100, y: 38 },
            { x: 82, y: 100 },
            { x: 18, y: 100 },
            { x: 0, y: 38 },
        ],
    },
    {
        id: "hexagon",
        nameKey: "hexagon",
        icon: "⬡",
        points: [
            { x: 50, y: 0 },
            { x: 100, y: 25 },
            { x: 100, y: 75 },
            { x: 50, y: 100 },
            { x: 0, y: 75 },
            { x: 0, y: 25 },
        ],
    },
    {
        id: "octagon",
        nameKey: "octagon",
        icon: "🛑",
        points: [
            { x: 30, y: 0 },
            { x: 70, y: 0 },
            { x: 100, y: 30 },
            { x: 100, y: 70 },
            { x: 70, y: 100 },
            { x: 30, y: 100 },
            { x: 0, y: 70 },
            { x: 0, y: 30 },
        ],
    },
    {
        id: "star",
        nameKey: "star",
        icon: "★",
        points: [
            { x: 50, y: 0 },
            { x: 61, y: 35 },
            { x: 98, y: 35 },
            { x: 68, y: 57 },
            { x: 79, y: 91 },
            { x: 50, y: 70 },
            { x: 21, y: 91 },
            { x: 32, y: 57 },
            { x: 2, y: 35 },
            { x: 39, y: 35 },
        ],
    },
    {
        id: "cross",
        nameKey: "cross",
        icon: "✚",
        points: [
            { x: 35, y: 0 },
            { x: 65, y: 0 },
            { x: 65, y: 35 },
            { x: 100, y: 35 },
            { x: 100, y: 65 },
            { x: 65, y: 65 },
            { x: 65, y: 100 },
            { x: 35, y: 100 },
            { x: 35, y: 65 },
            { x: 0, y: 65 },
            { x: 0, y: 35 },
            { x: 35, y: 35 },
        ],
    },
    {
        id: "arrowRight",
        nameKey: "arrowRight",
        icon: "➔",
        points: [
            { x: 0, y: 30 },
            { x: 60, y: 30 },
            { x: 60, y: 0 },
            { x: 100, y: 50 },
            { x: 60, y: 100 },
            { x: 60, y: 70 },
            { x: 0, y: 70 },
        ],
    },
    {
        id: "chevron",
        nameKey: "chevron",
        icon: "❯",
        points: [
            { x: 75, y: 0 },
            { x: 100, y: 50 },
            { x: 75, y: 100 },
            { x: 0, y: 100 },
            { x: 25, y: 50 },
            { x: 0, y: 0 },
        ],
    },
    {
        id: "speechBubble",
        nameKey: "speechBubble",
        icon: "💬",
        points: [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 100, y: 75 },
            { x: 60, y: 75 },
            { x: 40, y: 100 },
            { x: 40, y: 75 },
            { x: 0, y: 75 },
        ],
    },
];

export default function ClipPathGeneratorContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = clipPathTranslations[locale];

    const [points, setPoints] = useState<Point[]>(PRESETS[0].points);
    const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [snapToGrid, setSnapToGrid] = useState<boolean>(false);
    const [bgType, setBgType] = useState<"gradient" | "mesh" | "dark">("gradient");
    const [codeTab, setCodeTab] = useState<"css" | "tailwind" | "svg">("css");

    const canvasRef = useRef<HTMLDivElement>(null);

    // Compute polygon string
    const polygonString = useMemo(() => {
        return points.map((p) => `${p.x}% ${p.y}%`).join(", ");
    }, [points]);

    // Handle mouse / touch drag
    const handlePointerDown = (index: number, e: React.PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setActivePointIndex(index);
        setIsDragging(true);
    };

    const updatePointFromPointer = useCallback(
        (clientX: number, clientY: number) => {
            if (!canvasRef.current || activePointIndex === null) return;
            const rect = canvasRef.current.getBoundingClientRect();
            let rawX = ((clientX - rect.left) / rect.width) * 100;
            let rawY = ((clientY - rect.top) / rect.height) * 100;

            rawX = Math.max(0, Math.min(100, rawX));
            rawY = Math.max(0, Math.min(100, rawY));

            if (snapToGrid) {
                rawX = Math.round(rawX / 5) * 5;
                rawY = Math.round(rawY / 5) * 5;
            } else {
                rawX = Math.round(rawX);
                rawY = Math.round(rawY);
            }

            setPoints((prev) => {
                const next = [...prev];
                next[activePointIndex] = { x: rawX, y: rawY };
                return next;
            });
        },
        [activePointIndex, snapToGrid]
    );

    useEffect(() => {
        if (!isDragging) return;

        const onPointerMove = (e: PointerEvent) => {
            updatePointFromPointer(e.clientX, e.clientY);
        };

        const onPointerUp = () => {
            setIsDragging(false);
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);

        return () => {
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("pointerup", onPointerUp);
        };
    }, [isDragging, updatePointFromPointer]);

    // Add new point (midpoint of last edge)
    const handleAddPoint = () => {
        if (points.length >= 20) {
            toast.info(isVi ? "Tối đa 20 điểm đỉnh" : "Max 20 vertices reached");
            return;
        }
        const last = points[points.length - 1];
        const first = points[0];
        const newPoint: Point = {
            x: Math.round((last.x + first.x) / 2),
            y: Math.round((last.y + first.y) / 2),
        };
        setPoints([...points, newPoint]);
        setActivePointIndex(points.length);
        toast.success(isVi ? "Đã thêm điểm mới" : "Point added");
    };

    // Remove active point
    const handleDeletePoint = (index: number) => {
        if (points.length <= 3) {
            toast.error(isVi ? "Đa giác cần ít nhất 3 điểm" : "A polygon needs at least 3 points");
            return;
        }
        setPoints(points.filter((_, i) => i !== index));
        setActivePointIndex(null);
        toast.info(isVi ? `Đã xóa điểm #${index + 1}` : `Deleted point #${index + 1}`);
    };

    // Reset points
    const handleReset = () => {
        setPoints(PRESETS[0].points);
        setActivePointIndex(null);
        toast.info(isVi ? "Đã khôi phục mặc định" : "Reset to default");
    };

    // Load preset
    const handleLoadPreset = (preset: ShapePreset) => {
        setPoints(preset.points);
        setActivePointIndex(null);
        toast.info(isVi ? `Đã nạp mẫu ${t[preset.nameKey]}` : `Loaded ${t[preset.nameKey]}`);
    };

    // Generated Code
    const generatedCss = useMemo(() => {
        return `/* CSS clip-path */
-webkit-clip-path: polygon(${polygonString});
clip-path: polygon(${polygonString});`;
    }, [polygonString]);

    const generatedTailwind = useMemo(() => {
        const cleanPolygon = polygonString.replace(/\s+/g, "_");
        return `<div className="[clip-path:polygon(${cleanPolygon})]">\n  <!-- Clipped content here -->\n</div>`;
    }, [polygonString]);

    const generatedSvg = useMemo(() => {
        const svgPoints = points.map((p) => `${p.x / 100} ${p.y / 100}`).join(", ");
        return `<svg viewBox="0 0 1 1">\n  <clipPath id="custom-shape" clipPathUnits="objectBoundingBox">\n    <polygon points="${svgPoints}" />\n  </clipPath>\n</svg>`;
    }, [points]);

    const handleCopy = async () => {
        const text = codeTab === "css" ? generatedCss : codeTab === "tailwind" ? generatedTailwind : generatedSvg;
        try {
            await navigator.clipboard.writeText(text);
            toast.success(t.copied);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    return (
        <div className='max-w-6xl mx-auto space-y-8'>
            {/* Header info */}
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3'>
                    <span>✂️</span> {t.name}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                    {t.description}
                </p>
            </div>

            {/* Presets Gallery Carousel */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-2'>
                <div className='flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    <span>✨ {t.presetsTitle}</span>
                    <span>{PRESETS.length} presets</span>
                </div>
                <div className='flex items-center gap-2 overflow-x-auto pb-1'>
                    {PRESETS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => handleLoadPreset(p)}
                            className='flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700/80 transition-all text-xs font-medium shrink-0 cursor-pointer'
                        >
                            <span>{p.icon}</span>
                            <span>{t[p.nameKey]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Interactive Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
                {/* Left: Interactive Canvas */}
                <div className='lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                    <div className='flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-3'>
                        <div>
                            <h2 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                                <span>🎯</span> {t.canvasTitle}
                            </h2>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>{t.canvasHint}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setSnapToGrid(!snapToGrid)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                                    snapToGrid
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                🧲 {t.snapToGrid}
                            </button>
                            <button
                                onClick={handleReset}
                                className='px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-red-500 border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer'
                            >
                                {t.resetPoints}
                            </button>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div
                        ref={canvasRef}
                        className='relative w-full aspect-square max-w-[480px] mx-auto rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 select-none'
                        style={{
                            background:
                                bgType === "gradient"
                                    ? "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)"
                                    : bgType === "mesh"
                                    ? "radial-gradient(at 0% 0%, #06b6d4 0px, transparent 50%), radial-gradient(at 100% 100%, #8b5cf6 0px, transparent 50%), #0f172a"
                                    : "#1e293b",
                        }}
                    >
                        {/* Grid lines overlay */}
                        <svg className='absolute inset-0 w-full h-full pointer-events-none opacity-20 stroke-white' viewBox='0 0 100 100' preserveAspectRatio='none'>
                            <defs>
                                <pattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'>
                                    <path d='M 10 0 L 0 0 0 10' fill='none' strokeWidth='0.5' />
                                </pattern>
                            </defs>
                            <rect width='100' height='100' fill='url(#grid)' />
                        </svg>

                        {/* Clipped Visual Preview Element */}
                        <div
                            className='absolute inset-0 w-full h-full transition-all duration-75 flex items-center justify-center'
                            style={{
                                clipPath: `polygon(${polygonString})`,
                                WebkitClipPath: `polygon(${polygonString})`,
                                backgroundColor: "rgba(255, 255, 255, 0.25)",
                                backdropFilter: "blur(4px)",
                            }}
                        >
                            <div className='text-center p-4 text-white opacity-80 pointer-events-none'>
                                <span className='text-2xl block mb-1'>✨</span>
                                <span className='font-mono font-bold text-xs uppercase tracking-wider'>
                                    {points.length} Vertices
                                </span>
                            </div>
                        </div>

                        {/* Interactive SVG Layer for Connecting Lines & Points */}
                        <svg className='absolute inset-0 w-full h-full overflow-visible pointer-events-none' viewBox='0 0 100 100' preserveAspectRatio='none'>
                            {/* Polygon outline */}
                            <polygon
                                points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                                fill='none'
                                stroke='#38bdf8'
                                strokeWidth='0.8'
                                strokeDasharray='2,2'
                            />
                        </svg>

                        {/* Draggable Point Handles */}
                        {points.map((p, idx) => {
                            const isCurrent = activePointIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    onPointerDown={(e) => handlePointerDown(idx, e)}
                                    style={{
                                        left: `${p.x}%`,
                                        top: `${p.y}%`,
                                    }}
                                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold cursor-grab active:cursor-grabbing transition-transform touch-none shadow-md ${
                                        isCurrent
                                            ? "bg-amber-400 text-black ring-4 ring-amber-300/50 scale-125 z-20"
                                            : "bg-white text-blue-700 hover:scale-110 z-10"
                                    }`}
                                >
                                    {idx + 1}
                                </div>
                            );
                        })}
                    </div>

                    {/* Canvas Controls Toolbar */}
                    <div className='flex flex-wrap items-center justify-between gap-3 pt-2'>
                        <div className='flex items-center gap-1.5'>
                            <span className='text-xs font-semibold text-gray-500'>{t.bgPreview}:</span>
                            {(["gradient", "mesh", "dark"] as const).map((bg) => (
                                <button
                                    key={bg}
                                    onClick={() => setBgType(bg)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                                        bgType === bg
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                                            : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                                    }`}
                                >
                                    {bg}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleAddPoint}
                            className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold transition-all cursor-pointer shadow-xs'
                        >
                            <span>➕</span> {t.addPoint}
                        </button>
                    </div>
                </div>

                {/* Right: Points Inspector & Code Output */}
                <div className='lg:col-span-5 space-y-6'>
                    {/* Points Inspector List */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                        <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3'>
                            <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                                <span>📍</span> {t.pointsListTitle}
                            </h3>
                            <span className='text-xs font-mono font-bold text-blue-600'>
                                {points.length} points
                            </span>
                        </div>

                        <div className='space-y-2 max-h-[220px] overflow-y-auto pr-1'>
                            {points.map((p, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActivePointIndex(idx)}
                                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                                        activePointIndex === idx
                                            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700"
                                            : "bg-gray-50/70 dark:bg-gray-900/60 border-gray-200 dark:border-gray-700/80"
                                    }`}
                                >
                                    <div className='flex items-center gap-2'>
                                        <span className='w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold flex items-center justify-center'>
                                            {idx + 1}
                                        </span>
                                        <div className='flex items-center gap-2 text-xs font-mono'>
                                            <span>
                                                X: <strong className='text-gray-900 dark:text-gray-100'>{p.x}%</strong>
                                            </span>
                                            <span className='text-gray-300'>|</span>
                                            <span>
                                                Y: <strong className='text-gray-900 dark:text-gray-100'>{p.y}%</strong>
                                            </span>
                                        </div>
                                    </div>

                                    {points.length > 3 && (
                                        <button
                                            type='button'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePoint(idx);
                                            }}
                                            className='text-gray-400 hover:text-red-500 text-xs px-1.5 py-0.5 rounded cursor-pointer'
                                            title={t.deletePoint}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Generated Code Box */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                        <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3'>
                            <div className='flex items-center gap-1.5'>
                                <button
                                    onClick={() => setCodeTab("css")}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        codeTab === "css"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                                    }`}
                                >
                                    {t.tabCss}
                                </button>
                                <button
                                    onClick={() => setCodeTab("tailwind")}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        codeTab === "tailwind"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                                    }`}
                                >
                                    {t.tabTailwind}
                                </button>
                                <button
                                    onClick={() => setCodeTab("svg")}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        codeTab === "svg"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
                                    }`}
                                >
                                    {t.tabSvg}
                                </button>
                            </div>

                            <button
                                onClick={handleCopy}
                                className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-semibold text-xs border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer shadow-xs'
                            >
                                📋 {t.copyCode}
                            </button>
                        </div>

                        {/* Code pre */}
                        <div className='bg-gray-900 text-gray-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-gray-800'>
                            <pre className='whitespace-pre-wrap select-all'>
                                {codeTab === "css" ? generatedCss : codeTab === "tailwind" ? generatedTailwind : generatedSvg}
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
                        <h4 className='font-bold text-indigo-600 dark:text-indigo-400'>{t.guide2Title}</h4>
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
