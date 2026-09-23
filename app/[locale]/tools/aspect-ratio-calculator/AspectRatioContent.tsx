"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { aspectRatioTranslations } from "@/lib/i18n/tools/aspect-ratio-calculator";

// Lightweight Inline Icons
const MaximizeIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
);
const MonitorIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const SparklesIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);
const LockIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);
const BookOpenIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);
const HelpCircleIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ChevronDownIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
const ChevronUpIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

// GCD (Greatest Common Divisor)
function getGcd(a: number, b: number): number {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x || 1;
}

export default function AspectRatioContent() {
    const { locale } = useLanguage();
    const t = aspectRatioTranslations[locale as "en" | "vi"] || aspectRatioTranslations.en;

    const [activeTab, setActiveTab] = useState<"ratio" | "ppi">("ratio");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Tab 1: Aspect Ratio State
    const [origWidth, setOrigWidth] = useState(1920);
    const [origHeight, setOrigHeight] = useState(1080);
    const [newWidth, setNewWidth] = useState(1280);
    const [newHeight, setNewHeight] = useState(720);

    // Ratio Calculations
    const ratioInfo = useMemo(() => {
        const w = Math.max(1, origWidth);
        const h = Math.max(1, origHeight);
        const gcd = getGcd(w, h);
        const rw = w / gcd;
        const rh = h / gcd;
        const decimal = (w / h).toFixed(3);

        return {
            rw,
            rh,
            ratioStr: `${rw}:${rh}`,
            decimalStr: `${decimal}:1`,
            factor: w / h,
        };
    }, [origWidth, origHeight]);

    // Handle New Width change
    const handleNewWidthChange = (val: number) => {
        setNewWidth(val);
        if (ratioInfo.factor > 0) {
            setNewHeight(Math.round(val / ratioInfo.factor));
        }
    };

    // Handle New Height change
    const handleNewHeightChange = (val: number) => {
        setNewHeight(val);
        if (ratioInfo.factor > 0) {
            setNewWidth(Math.round(val * ratioInfo.factor));
        }
    };

    // Set Preset Ratio
    const setRatioPreset = (w: number, h: number) => {
        setOrigWidth(w);
        setOrigHeight(h);
        const factor = w / h;
        setNewHeight(Math.round(newWidth / factor));
    };

    // Tab 2: PPI Calculator State
    const [ppiWidth, setPpiWidth] = useState(2560);
    const [ppiHeight, setPpiHeight] = useState(1440);
    const [diagonal, setDiagonal] = useState(27);

    // PPI Calculations
    const ppiInfo = useMemo(() => {
        const w = Math.max(1, ppiWidth);
        const h = Math.max(1, ppiHeight);
        const diag = Math.max(0.1, diagonal);

        const diagonalPixels = Math.sqrt(w * w + h * h);
        const ppi = Math.round((diagonalPixels / diag) * 10) / 10;
        const dotPitch = Math.round((25.4 / ppi) * 1000) / 1000; // mm
        const totalPixels = w * h;
        const megapixels = (totalPixels / 1000000).toFixed(2);

        let rating = t.desktopClass;
        let ratingColor = "text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800";
        if (ppi >= 200) {
            rating = t.retinaClass;
            ratingColor = "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
        } else if (ppi < 90) {
            rating = t.tvClass;
            ratingColor = "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
        }

        return {
            ppi,
            dotPitch,
            megapixels,
            totalPixels,
            rating,
            ratingColor,
        };
    }, [ppiWidth, ppiHeight, diagonal, t]);

    // PPI Presets
    const setDevicePreset = (w: number, h: number, diag: number) => {
        setPpiWidth(w);
        setPpiHeight(h);
        setDiagonal(diag);
    };

    return (
        <div className='space-y-8'>
            {/* Tabs */}
            <div className='flex flex-wrap gap-2 p-1.5 rounded-2xl border border-slate-200/80 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900/60 w-fit'>
                <button
                    onClick={() => setActiveTab("ratio")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                        activeTab === "ratio"
                            ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                >
                    <MaximizeIcon className='h-4 w-4' />
                    <span>{t.tabRatio}</span>
                </button>
                <button
                    onClick={() => setActiveTab("ppi")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                        activeTab === "ppi"
                            ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                >
                    <MonitorIcon className='h-4 w-4' />
                    <span>{t.tabPpi}</span>
                </button>
            </div>

            {/* TAB 1: ASPECT RATIO */}
            {activeTab === "ratio" && (
                <div className='space-y-6'>
                    {/* Input dimensions & simplified ratio */}
                    <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none sm:p-7 space-y-6'>
                        <div>
                            <h3 className='text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2'>
                                <MaximizeIcon className='h-4 w-4 text-indigo-500' />
                                <span>{t.originalDimensions}</span>
                            </h3>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.width}</label>
                                <input
                                    type='number'
                                    min='1'
                                    value={origWidth}
                                    onChange={(e) => setOrigWidth(Math.max(1, parseInt(e.target.value) || 1))}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 font-mono text-base font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.height}</label>
                                <input
                                    type='number'
                                    min='1'
                                    value={origHeight}
                                    onChange={(e) => setOrigHeight(Math.max(1, parseInt(e.target.value) || 1))}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 font-mono text-base font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>
                        </div>

                        {/* Presets */}
                        <div className='pt-2'>
                            <div className='text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5'>
                                <SparklesIcon className='h-3.5 w-3.5' />
                                <span>{t.commonPresets}:</span>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {[
                                    { label: "16:9 (Widescreen)", w: 1920, h: 1080 },
                                    { label: "9:16 (TikTok / Reels)", w: 1080, h: 1920 },
                                    { label: "4:3 (Classic TV)", w: 1440, h: 1080 },
                                    { label: "1:1 (Square)", w: 1080, h: 1080 },
                                    { label: "21:9 (Ultrawide)", w: 2560, h: 1080 },
                                    { label: "3:2 (DSLR)", w: 1500, h: 1000 },
                                    { label: "16:10 (MacBook)", w: 1920, h: 1200 },
                                ].map(p => (
                                    <button
                                        key={p.label}
                                        onClick={() => setRatioPreset(p.w, p.h)}
                                        className='rounded-xl border border-slate-200 bg-slate-100/70 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400'
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Result Badges */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                        <div className='rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 text-white shadow-xl shadow-indigo-500/20'>
                            <div className='text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2'>
                                {t.simplifiedRatio}
                            </div>
                            <div className='text-5xl font-black tracking-tight'>
                                {ratioInfo.ratioStr}
                            </div>
                            <div className='mt-2 text-xs text-indigo-100 font-mono'>
                                {t.decimalRatio}: {ratioInfo.decimalStr}
                            </div>
                        </div>

                        {/* Interactive Proportional Preview Box */}
                        <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800/80 dark:bg-slate-900/80 flex flex-col justify-between'>
                            <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-2'>
                                {t.visualPreview}
                            </div>
                            <div className='flex items-center justify-center p-3 h-36 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-100 dark:border-slate-800/60'>
                                <div
                                    className='max-h-full max-w-full rounded-lg border-2 border-indigo-500 bg-indigo-500/10 flex items-center justify-center transition-all duration-300 shadow-sm'
                                    style={{
                                        aspectRatio: `${origWidth} / ${origHeight}`,
                                        width: origWidth >= origHeight ? "160px" : "auto",
                                        height: origWidth < origHeight ? "110px" : "auto",
                                    }}
                                >
                                    <span className='font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 p-1'>
                                        {ratioInfo.ratioStr}
                                    </span>
                                </div>
                            </div>
                            <div className='text-center text-[11px] text-slate-400 dark:text-slate-500 mt-2'>
                                {origWidth} × {origHeight} px
                            </div>
                        </div>
                    </div>

                    {/* Proportional Resize Solver */}
                    <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none sm:p-7 space-y-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2'>
                                <LockIcon className='h-4 w-4 text-emerald-500' />
                                <span>{t.resizeSolverTitle}</span>
                            </h3>
                            <span className='rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 px-2.5 py-0.5 text-xs font-semibold'>
                                {t.lockRatio} ({ratioInfo.ratioStr})
                            </span>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.newWidth}</label>
                                <input
                                    type='number'
                                    min='1'
                                    value={newWidth}
                                    onChange={(e) => handleNewWidthChange(Math.max(1, parseInt(e.target.value) || 1))}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 font-mono text-base font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.newHeight}</label>
                                <input
                                    type='number'
                                    min='1'
                                    value={newHeight}
                                    onChange={(e) => handleNewHeightChange(Math.max(1, parseInt(e.target.value) || 1))}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 font-mono text-base font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: SCREEN PPI & DENSITY */}
            {activeTab === "ppi" && (
                <div className='space-y-6'>
                    <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none sm:p-7 space-y-6'>
                        <div>
                            <h3 className='text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2'>
                                <MonitorIcon className='h-4 w-4 text-indigo-500' />
                                <span>{t.screenResolution}</span>
                            </h3>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.horizontalPixels}</label>
                                <input
                                    type='number'
                                    min='1'
                                    value={ppiWidth}
                                    onChange={(e) => setPpiWidth(Math.max(1, parseInt(e.target.value) || 1))}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 font-mono text-base font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.verticalPixels}</label>
                                <input
                                    type='number'
                                    min='1'
                                    value={ppiHeight}
                                    onChange={(e) => setPpiHeight(Math.max(1, parseInt(e.target.value) || 1))}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 font-mono text-base font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.diagonalInches}</label>
                                <input
                                    type='number'
                                    step='0.1'
                                    min='0.1'
                                    value={diagonal}
                                    onChange={(e) => setDiagonal(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 font-mono text-base font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>
                        </div>

                        {/* Device Presets */}
                        <div className='pt-2'>
                            <div className='text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5'>
                                <SparklesIcon className='h-3.5 w-3.5' />
                                <span>Device Quick Presets:</span>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {[
                                    { label: "24\" 1080p FHD", w: 1920, h: 1080, d: 24 },
                                    { label: "27\" 1440p QHD", w: 2560, h: 1440, d: 27 },
                                    { label: "27\" 4K UHD", w: 3840, h: 2160, d: 27 },
                                    { label: "32\" 4K UHD", w: 3840, h: 2160, d: 32 },
                                    { label: "14\" MacBook Pro", w: 3024, h: 1964, d: 14.2 },
                                    { label: "6.1\" iPhone Pro", w: 2556, h: 1179, d: 6.1 },
                                ].map(p => (
                                    <button
                                        key={p.label}
                                        onClick={() => setDevicePreset(p.w, p.h, p.d)}
                                        className='rounded-xl border border-slate-200 bg-slate-100/70 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400'
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PPI Result Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        {/* Main PPI Badge */}
                        <div className='rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-between'>
                            <div>
                                <div className='text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2'>
                                    {t.ppiResult}
                                </div>
                                <div className='text-5xl font-black tracking-tight'>
                                    {ppiInfo.ppi}
                                </div>
                                <div className='text-xs text-indigo-100 mt-2'>
                                    Pixels Per Inch
                                </div>
                            </div>

                            <div className='mt-5 pt-3 border-t border-indigo-400/40 text-xs'>
                                <span className='font-semibold'>{ppiWidth} × {ppiHeight}</span> on {diagonal}&quot; screen
                            </div>
                        </div>

                        {/* Sharpness Rating */}
                        <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-6 dark:border-slate-800/80 dark:bg-slate-900/80 flex flex-col justify-between'>
                            <div>
                                <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-2'>
                                    {t.displayCategory}
                                </div>
                                <div className={`inline-block rounded-2xl border px-3 py-1.5 text-sm font-bold ${ppiInfo.ratingColor}`}>
                                    {ppiInfo.rating}
                                </div>
                            </div>

                            <div className='mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400'>
                                Viewing distance matters: closer viewing requires higher PPI to eliminate visible pixels.
                            </div>
                        </div>

                        {/* Pixel Details */}
                        <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-6 dark:border-slate-800/80 dark:bg-slate-900/80 flex flex-col justify-between'>
                            <div>
                                <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-2'>
                                    {t.dotPitch}
                                </div>
                                <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                                    {ppiInfo.dotPitch} mm
                                </div>
                            </div>

                            <div className='mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between'>
                                <span>{t.totalPixels}:</span>
                                <span className='font-bold text-slate-800 dark:text-slate-200'>{ppiInfo.megapixels} MP</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Guide & Tips */}
            <div className='rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-8'>
                <div className='flex items-center gap-3 mb-6'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'>
                        <BookOpenIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                        {t.guideTitle}
                    </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm'>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide1Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide2Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide3Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>

            {/* FAQs Accordion */}
            <div className='rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-8'>
                <div className='flex items-center gap-3 mb-6'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'>
                        <HelpCircleIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                        {t.faqTitle}
                    </h3>
                </div>

                <div className='space-y-3'>
                    {[
                        { q: t.faq1Q, a: t.faq1A },
                        { q: t.faq2Q, a: t.faq2A },
                        { q: t.faq3Q, a: t.faq3A },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className='overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/60 transition-all dark:border-slate-800/70 dark:bg-slate-800/30'
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className='flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 dark:text-white'
                            >
                                <span>{item.q}</span>
                                {openFaq === idx ? (
                                    <ChevronUpIcon className='h-4 w-4 shrink-0 text-indigo-500' />
                                ) : (
                                    <ChevronDownIcon className='h-4 w-4 shrink-0 text-slate-400' />
                                )}
                            </button>
                            {openFaq === idx && (
                                <div className='px-4 pb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
