"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { screenTesterTranslations } from "@/lib/i18n/tools/screen-tester";
import { toast } from "@/components/ui/Toast";

type TestMode = "deadPixels" | "gradients" | "contrast" | "ghosting" | "sharpness";

const SOLID_COLORS = [
    { name: "Black", hex: "#000000", textColor: "#ffffff" },
    { name: "White", hex: "#ffffff", textColor: "#000000" },
    { name: "Red", hex: "#ff0000", textColor: "#ffffff" },
    { name: "Green", hex: "#00ff00", textColor: "#000000" },
    { name: "Blue", hex: "#0000ff", textColor: "#ffffff" },
    { name: "Cyan", hex: "#00ffff", textColor: "#000000" },
    { name: "Magenta", hex: "#ff00ff", textColor: "#ffffff" },
    { name: "Yellow", hex: "#ffff00", textColor: "#000000" },
];

export default function ScreenTesterContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = screenTesterTranslations[locale];

    const [testMode, setTestMode] = useState<TestMode>("deadPixels");
    const [colorIndex, setColorIndex] = useState<number>(0);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isAutoCycle, setIsAutoCycle] = useState<boolean>(false);
    const [showExerciser, setShowExerciser] = useState<boolean>(false);
    const [exerciserColor, setExerciserColor] = useState<string>("#ff0000");
    const [exerciserPos, setExerciserPos] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
    const [ghostSpeed, setGhostSpeed] = useState<number>(480); // px/sec

    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const ghostPosRef = useRef<number>(0);
    const [ghostPos, setGhostPos] = useState<number>(0);

    // Fullscreen toggle
    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            try {
                if (containerRef.current) {
                    await containerRef.current.requestFullscreen();
                    setIsFullscreen(true);
                }
            } catch {
                toast.error(isVi ? "Trình duyệt không cho phép toàn màn hình" : "Fullscreen request failed");
            }
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === " ") {
                setColorIndex((prev) => (prev + 1) % SOLID_COLORS.length);
            } else if (e.key === "ArrowLeft") {
                setColorIndex((prev) => (prev - 1 + SOLID_COLORS.length) % SOLID_COLORS.length);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Auto cycle solid colors
    useEffect(() => {
        if (!isAutoCycle) return;
        const interval = setInterval(() => {
            setColorIndex((prev) => (prev + 1) % SOLID_COLORS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isAutoCycle]);

    // Stuck Pixel Exerciser rapid flasher (60Hz color alternation)
    useEffect(() => {
        if (!showExerciser) return;
        const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffffff", "#000000"];
        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % colors.length;
            setExerciserColor(colors[idx]);
        }, 1000 / 30);
        return () => clearInterval(interval);
    }, [showExerciser]);

    // Motion ghosting animation loop
    useEffect(() => {
        if (testMode !== "ghosting") return;

        let lastTime = performance.now();
        const animate = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            ghostPosRef.current += ghostSpeed * dt;
            if (ghostPosRef.current > 800) ghostPosRef.current = -100;
            setGhostPos(ghostPosRef.current);

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [testMode, ghostSpeed]);

    return (
        <div className='max-w-6xl mx-auto space-y-8'>
            {/* Header info */}
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3'>
                    <span>🖥️</span> {t.name}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                    {t.description}
                </p>
            </div>

            {/* Test Mode Selector Tabs */}
            <div className='flex justify-center'>
                <div className='inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm'>
                    {[
                        { id: "deadPixels", label: t.tabDeadPixels, icon: "🎯" },
                        { id: "gradients", label: t.tabColorBanding, icon: "🌈" },
                        { id: "contrast", label: t.tabContrast, icon: "🌓" },
                        { id: "ghosting", label: t.tabGhosting, icon: "🚀" },
                        { id: "sharpness", label: t.tabSharpness, icon: "📐" },
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setTestMode(mode.id as TestMode)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                testMode === mode.id
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            <span>{mode.icon}</span>
                            <span>{mode.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Interactive Stage Container */}
            <div
                ref={containerRef}
                className={`relative rounded-3xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-all select-none ${
                    isFullscreen ? "fixed inset-0 z-50 rounded-none border-none w-screen h-screen" : "w-full min-h-[460px]"
                }`}
                style={{
                    backgroundColor: testMode === "deadPixels" ? SOLID_COLORS[colorIndex].hex : "#000000",
                }}
            >
                {/* STAGE CONTENT BY TEST MODE */}

                {/* 1. DEAD PIXEL CHECKER */}
                {testMode === "deadPixels" && (
                    <div
                        onClick={() => setColorIndex((prev) => (prev + 1) % SOLID_COLORS.length)}
                        className='w-full h-full flex-1 flex flex-col items-center justify-center p-8 cursor-pointer relative min-h-[420px]'
                    >
                        {!isFullscreen && (
                            <div
                                className='px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md text-white text-xs font-semibold shadow-lg text-center space-y-1'
                            >
                                <p>Click anywhere to cycle colors (or press Space / Arrow keys)</p>
                                <p className='text-[11px] opacity-75'>Color: {SOLID_COLORS[colorIndex].name}</p>
                            </div>
                        )}

                        {/* Draggable Stuck Pixel Fixer Box */}
                        {showExerciser && (
                            <div
                                style={{
                                    left: `${exerciserPos.x}px`,
                                    top: `${exerciserPos.y}px`,
                                    backgroundColor: exerciserColor,
                                }}
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    const startX = e.clientX - exerciserPos.x;
                                    const startY = e.clientY - exerciserPos.y;
                                    const onMove = (ev: PointerEvent) => {
                                        setExerciserPos({ x: ev.clientX - startX, y: ev.clientY - startY });
                                    };
                                    const onUp = () => {
                                        window.removeEventListener("pointermove", onMove);
                                        window.removeEventListener("pointerup", onUp);
                                    };
                                    window.addEventListener("pointermove", onMove);
                                    window.addEventListener("pointerup", onUp);
                                }}
                                className='absolute w-14 h-14 rounded-lg shadow-2xl border-2 border-white cursor-grab active:cursor-grabbing z-30 flex items-center justify-center text-[10px] font-bold font-mono text-black bg-white/70'
                                title='Drag over stuck pixel'
                            >
                                🎯 Fix
                            </div>
                        )}
                    </div>
                )}

                {/* 2. GRADIENT & BANDING TEST */}
                {testMode === "gradients" && (
                    <div className='w-full h-full flex-1 flex flex-col justify-center p-8 space-y-6 bg-black min-h-[420px]'>
                        {/* 256 Smooth Grayscale */}
                        <div className='space-y-1'>
                            <div className='flex justify-between text-xs text-gray-400 font-mono'>
                                <span>0% Pure Black (RGB 0)</span>
                                <span>Smooth Grayscale Ramp (256-bit)</span>
                                <span>100% White (RGB 255)</span>
                            </div>
                            <div
                                className='w-full h-14 rounded-xl border border-gray-800'
                                style={{ background: "linear-gradient(to right, #000000, #ffffff)" }}
                            />
                        </div>

                        {/* Primary Color Ramps */}
                        <div className='space-y-2'>
                            <div className='w-full h-8 rounded-lg' style={{ background: "linear-gradient(to right, #000000, #ff0000)" }} />
                            <div className='w-full h-8 rounded-lg' style={{ background: "linear-gradient(to right, #000000, #00ff00)" }} />
                            <div className='w-full h-8 rounded-lg' style={{ background: "linear-gradient(to right, #000000, #0000ff)" }} />
                        </div>
                    </div>
                )}

                {/* 3. CONTRAST & DYNAMIC RANGE (BLACK CRUSH) */}
                {testMode === "contrast" && (
                    <div className='w-full h-full flex-1 flex flex-col justify-center p-8 space-y-8 bg-black min-h-[420px]'>
                        {/* Near Black Matrix */}
                        <div className='space-y-2'>
                            <span className='text-xs font-semibold text-gray-400 block'>
                                Dark Level Discrimination (Can you distinguish each square from pure black?)
                            </span>
                            <div className='grid grid-cols-10 gap-2'>
                                {[0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 7, 10].map((pct, idx) => {
                                    const val = Math.round((pct / 100) * 255);
                                    return (
                                        <div
                                            key={idx}
                                            style={{ backgroundColor: `rgb(${val}, ${val}, ${val})` }}
                                            className='aspect-square rounded-xl border border-gray-800 flex items-center justify-center text-[10px] font-mono text-gray-500'
                                        >
                                            {pct}%
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Near White Matrix */}
                        <div className='space-y-2'>
                            <span className='text-xs font-semibold text-gray-400 block'>
                                Bright Highlight Discrimination (Can you distinguish each square from pure white?)
                            </span>
                            <div className='grid grid-cols-10 gap-2'>
                                {[90, 92, 94, 95, 96, 97, 98, 98.5, 99, 99.5].map((pct, idx) => {
                                    const val = Math.round((pct / 100) * 255);
                                    return (
                                        <div
                                            key={idx}
                                            style={{ backgroundColor: `rgb(${val}, ${val}, ${val})` }}
                                            className='aspect-square rounded-xl border border-gray-300 flex items-center justify-center text-[10px] font-mono text-gray-700'
                                        >
                                            {pct}%
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. MOTION BLUR & GHOSTING TEST */}
                {testMode === "ghosting" && (
                    <div className='w-full h-full flex-1 flex flex-col justify-center p-8 space-y-6 bg-slate-900 min-h-[420px] overflow-hidden'>
                        <div className='space-y-1 text-xs text-gray-400 font-mono'>
                            <p>Speed: {ghostSpeed} px/sec. Inspect leading and trailing edges for ghosting trails or inverse overshoot coronas.</p>
                        </div>

                        {/* Lane 1: Light block on dark */}
                        <div className='relative w-full h-20 bg-slate-950 rounded-xl overflow-hidden border border-slate-800'>
                            <div
                                style={{ transform: `translateX(${ghostPos}px)` }}
                                className='absolute top-2 w-28 h-16 bg-cyan-400 rounded-lg shadow-lg flex items-center justify-center text-xs font-bold text-slate-950'
                            >
                                🛸 UFO 1
                            </div>
                        </div>

                        {/* Lane 2: Dark block on medium */}
                        <div className='relative w-full h-20 bg-slate-800 rounded-xl overflow-hidden border border-slate-700'>
                            <div
                                style={{ transform: `translateX(${ghostPos * 0.8}px)` }}
                                className='absolute top-2 w-28 h-16 bg-amber-400 rounded-lg shadow-lg flex items-center justify-center text-xs font-bold text-slate-950'
                            >
                                🛸 UFO 2
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. SHARPNESS & PIXEL CONVERGENCE */}
                {testMode === "sharpness" && (
                    <div className='w-full h-full flex-1 flex flex-col justify-center items-center p-8 bg-white min-h-[420px]'>
                        <div className='space-y-4 max-w-lg text-center text-black'>
                            <h3 className='text-lg font-bold'>Pixel Sharpness & Subpixel Anti-Aliasing</h3>
                            <p className='text-xs text-gray-600'>
                                Text should be ultra-sharp with zero colored fringing or blurry halos.
                            </p>
                            <div className='space-y-1 font-mono text-xs'>
                                <p className='text-base font-extrabold'>THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG (16px)</p>
                                <p className='text-sm font-semibold'>1234567890 !@#$%^&*()_+-=[]{}|;:,.&lt;&gt;? (14px)</p>
                                <p className='text-xs'>AnyTools Ultra-High Precision 1:1 Pixel Mapping Test (12px)</p>
                                <p className='text-[10px]'>Fine text 10px: Crisp glyph rendering without blur or smearing.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Interactive HUD Overlay */}
                <div className='p-4 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 flex flex-wrap items-center justify-between gap-4 text-white z-20'>
                    <div className='flex items-center gap-3'>
                        {/* Fullscreen Button */}
                        <button
                            onClick={toggleFullscreen}
                            className='flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer'
                        >
                            <span>{isFullscreen ? "🗗" : "⛶"}</span>
                            <span>{isFullscreen ? t.exitFullscreen : t.fullscreenBtn}</span>
                        </button>

                        {testMode === "deadPixels" && (
                            <>
                                <button
                                    onClick={() => setIsAutoCycle(!isAutoCycle)}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                        isAutoCycle
                                            ? "bg-emerald-600 text-white border-emerald-500"
                                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                                    }`}
                                >
                                    🔄 {t.autoCycle}
                                </button>
                                <button
                                    onClick={() => setShowExerciser(!showExerciser)}
                                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                        showExerciser
                                            ? "bg-amber-600 text-white border-amber-500"
                                            : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                                    }`}
                                >
                                    ⚡ {t.stuckPixelFixer}
                                </button>
                            </>
                        )}

                        {testMode === "ghosting" && (
                            <div className='flex items-center gap-2 text-xs'>
                                <span>{t.speedLabel}:</span>
                                {[240, 480, 960].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setGhostSpeed(s)}
                                        className={`px-2.5 py-1 rounded-lg font-mono font-bold cursor-pointer ${
                                            ghostSpeed === s ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
                                        }`}
                                    >
                                        {s}px/s
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='text-xs text-gray-400 hidden sm:block font-mono'>
                        {testMode === "deadPixels" && `Color #${colorIndex + 1}/${SOLID_COLORS.length}: ${SOLID_COLORS[colorIndex].name}`}
                        {testMode === "gradients" && "256-bit Linear Gradients"}
                        {testMode === "contrast" && "Dynamic Range 0.5% - 99.5%"}
                        {testMode === "ghosting" && "Frame Rate Synced Motion"}
                        {testMode === "sharpness" && "1:1 Native Geometry"}
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
