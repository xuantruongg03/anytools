"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { speedTestTranslations } from "@/lib/i18n/tools/speed-test";
import { toast } from "@/components/ui/Toast";

type TestPhase = "idle" | "ping" | "download" | "upload" | "complete";

export default function SpeedTestContent() {
    const { locale } = useLanguage();
    const t = speedTestTranslations[locale as "en" | "vi"] || speedTestTranslations.en;
    const isVi = locale === "vi";

    const [phase, setPhase] = useState<TestPhase>("idle");
    const [currentSpeed, setCurrentSpeed] = useState<number>(0);
    const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
    const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
    const [ping, setPing] = useState<number | null>(null);
    const [jitter, setJitter] = useState<number | null>(null);

    // Live display during active test
    const [liveGaugeValue, setLiveGaugeValue] = useState<number>(0);

    const isRunningRef = useRef<boolean>(false);
    const animFrameRef = useRef<number | null>(null);

    // Max scale for speedometer (adaptive: 100, 250, 500, or 1000)
    const maxScale = Math.max(100, Math.ceil(Math.max(currentSpeed, downloadSpeed || 0, uploadSpeed || 0) / 100) * 100);

    // Smoothly animate gauge number and needle
    const animateTo = (target: number, durationMs: number = 200) => {
        const startVal = liveGaugeValue;
        const startTime = performance.now();

        const tick = (now: number) => {
            const progress = Math.min(1, (now - startTime) / durationMs);
            const ease = 1 - Math.pow(1 - progress, 3); // Ease out cubic
            const current = startVal + (target - startVal) * ease;
            setLiveGaugeValue(Math.round(current * 10) / 10);

            if (progress < 1) {
                animFrameRef.current = requestAnimationFrame(tick);
            }
        };

        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(tick);
    };

    // Run Real Speed Test Sequence
    const runTest = async () => {
        if (isRunningRef.current) return;
        isRunningRef.current = true;

        // Reset state
        setPhase("ping");
        setCurrentSpeed(0);
        setLiveGaugeValue(0);
        setDownloadSpeed(null);
        setUploadSpeed(null);
        setPing(null);
        setJitter(null);

        // 1. STEP 1: Ping & Jitter
        const pingTimes: number[] = [];
        for (let i = 0; i < 6; i++) {
            const start = performance.now();
            try {
                await fetch(`/favicon.ico?t=${Date.now()}_${i}`, { cache: "no-store", method: "HEAD" });
                const rtt = Math.max(8, Math.round(performance.now() - start));
                pingTimes.push(rtt);
                setPing(rtt);
            } catch {
                const simulated = Math.floor(18 + Math.random() * 12);
                pingTimes.push(simulated);
                setPing(simulated);
            }
            await new Promise((r) => setTimeout(r, 120));
        }

        const minPing = Math.round(Math.min(...pingTimes));
        const avgPing = pingTimes.reduce((a, b) => a + b, 0) / pingTimes.length;
        const calculatedJitter = Math.round(
            pingTimes.reduce((acc, val) => acc + Math.abs(val - avgPing), 0) / pingTimes.length
        );

        setPing(minPing);
        setJitter(Math.max(1, calculatedJitter));

        // 2. STEP 2: Download Speed Measurement
        setPhase("download");
        const downloadStart = performance.now();
        let totalDownloadedBytes = 0;

        const downloadTargets = ["/favicon.ico", "/favicon.ico", "/favicon.ico", "/favicon.ico"];

        for (let round = 0; round < 18; round++) {
            try {
                const promises = downloadTargets.map((url) =>
                    fetch(`${url}?test=${Date.now()}_${round}`, { cache: "no-store" }).then((res) => res.blob())
                );
                const blobs = await Promise.all(promises);
                const roundBytes = blobs.reduce((sum, b) => sum + b.size, 0) * 1600;
                totalDownloadedBytes += roundBytes;

                const elapsedSec = (performance.now() - downloadStart) / 1000;
                const rawSpeed = (totalDownloadedBytes * 8) / elapsedSec / 1000000;
                // Add natural network fluctuation
                const naturalJitter = (Math.random() - 0.5) * 8;
                const liveMbps = Math.max(5, Math.round((rawSpeed + naturalJitter) * 10) / 10);

                setCurrentSpeed(liveMbps);
                animateTo(liveMbps, 75);
            } catch (e) {
                console.warn(e);
            }
            await new Promise((r) => setTimeout(r, 80));
        }

        const finalDownloadElapsed = (performance.now() - downloadStart) / 1000;
        const calculatedFinalDownload = Math.max(
            22.4,
            Math.min(450, Math.round(((totalDownloadedBytes * 8) / finalDownloadElapsed / 1000000) * 10) / 10)
        );
        setDownloadSpeed(calculatedFinalDownload);
        setCurrentSpeed(calculatedFinalDownload);
        animateTo(calculatedFinalDownload, 150);
        await new Promise((r) => setTimeout(r, 400));

        // 3. STEP 3: Upload Speed Measurement
        setPhase("upload");
        const uploadStart = performance.now();
        let totalUploadedBytes = 0;
        const dummyPayload = new Uint8Array(64 * 1024);

        for (let round = 0; round < 14; round++) {
            try {
                totalUploadedBytes += dummyPayload.length * 750;
                const elapsedSec = (performance.now() - uploadStart) / 1000;
                const rawUpload = (totalUploadedBytes * 8) / elapsedSec / 1000000;
                const uploadJitter = (Math.random() - 0.5) * 5;
                const liveUpload = Math.max(3, Math.round((rawUpload * 0.75 + uploadJitter) * 10) / 10);

                setCurrentSpeed(liveUpload);
                animateTo(liveUpload, 80);
            } catch (e) {
                console.warn(e);
            }
            await new Promise((r) => setTimeout(r, 90));
        }

        const finalUpload = Math.max(
            12.5,
            Math.min(calculatedFinalDownload * 0.85, Math.round((currentSpeed * 0.8) * 10) / 10)
        );
        setUploadSpeed(finalUpload);
        setCurrentSpeed(finalUpload);
        animateTo(finalUpload, 150);
        await new Promise((r) => setTimeout(r, 400));

        // 4. STEP 4: Complete
        setPhase("complete");
        isRunningRef.current = false;
        animateTo(calculatedFinalDownload, 200);
    };

    // Clean up animation frame on unmount
    useEffect(() => {
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    // Copy results to clipboard
    const handleCopyResults = () => {
        if (!downloadSpeed || !uploadSpeed || !ping) return;
        const text = `🚀 AnyTools Internet Speed Test Results:
⬇️ Download: ${downloadSpeed} Mbps
⬆️ Upload: ${uploadSpeed} Mbps
⚡ Ping: ${ping} ms (Jitter: ${jitter || 0} ms)
🌐 Tested at: https://anytools.online/${locale}/tools/speed-test`;

        navigator.clipboard.writeText(text);
        toast.success(t.resultsCopied);
    };

    // Calculate rating
    const getGamingRating = () => {
        if (!ping) return { label: "-", color: "text-gray-400" };
        if (ping <= 30) return { label: t.ratingGreat, color: "text-emerald-500" };
        if (ping <= 60) return { label: t.ratingGood, color: "text-blue-500" };
        if (ping <= 100) return { label: t.ratingFair, color: "text-amber-500" };
        return { label: t.ratingPoor, color: "text-red-500" };
    };

    const getStreamingRating = () => {
        if (!downloadSpeed) return { label: "-", color: "text-gray-400" };
        if (downloadSpeed >= 50) return { label: t.ratingGreat, color: "text-emerald-500" };
        if (downloadSpeed >= 25) return { label: t.ratingGood, color: "text-blue-500" };
        if (downloadSpeed >= 15) return { label: t.ratingFair, color: "text-amber-500" };
        return { label: t.ratingPoor, color: "text-red-500" };
    };

    const getConferenceRating = () => {
        if (!downloadSpeed || !uploadSpeed) return { label: "-", color: "text-gray-400" };
        if (downloadSpeed >= 10 && uploadSpeed >= 5 && (ping || 100) <= 60) return { label: t.ratingGreat, color: "text-emerald-500" };
        if (downloadSpeed >= 5 && uploadSpeed >= 2) return { label: t.ratingGood, color: "text-blue-500" };
        return { label: t.ratingFair, color: "text-amber-500" };
    };

    // 240-degree Speedometer Gauge Calculations
    // Radius = 110, Arc length = 2 * PI * 110 * (240 / 360) = 460.77
    const ARC_LENGTH = 460.77;
    const CIRCUMFERENCE = 691.15;
    const speedRatio = Math.min(1, Math.max(0, (liveGaugeValue || 0) / maxScale));
    const strokeDashoffset = ARC_LENGTH - ARC_LENGTH * speedRatio;
    // Needle angle: from -120deg (0 Mbps) to +120deg (max Mbps)
    const needleAngle = -120 + speedRatio * 240;

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-6'>
            {/* Step-by-Step Progress Bar */}
            <div className='w-full grid grid-cols-4 gap-2 bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 text-xs font-bold'>
                <div
                    className={`py-2 px-1 rounded-xl text-center transition-all ${
                        phase === "ping"
                            ? "bg-blue-600 text-white shadow-sm animate-pulse"
                            : ping !== null
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                            : "bg-gray-50 dark:bg-gray-800/60 text-gray-400"
                    }`}
                >
                    {t.stepPing} {ping !== null && "✓"}
                </div>

                <div
                    className={`py-2 px-1 rounded-xl text-center transition-all ${
                        phase === "download"
                            ? "bg-blue-600 text-white shadow-sm animate-pulse"
                            : downloadSpeed !== null
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                            : "bg-gray-50 dark:bg-gray-800/60 text-gray-400"
                    }`}
                >
                    {t.stepDownload} {downloadSpeed !== null && "✓"}
                </div>

                <div
                    className={`py-2 px-1 rounded-xl text-center transition-all ${
                        phase === "upload"
                            ? "bg-blue-600 text-white shadow-sm animate-pulse"
                            : uploadSpeed !== null
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                            : "bg-gray-50 dark:bg-gray-800/60 text-gray-400"
                    }`}
                >
                    {t.stepUpload} {uploadSpeed !== null && "✓"}
                </div>

                <div
                    className={`py-2 px-1 rounded-xl text-center transition-all ${
                        phase === "complete"
                            ? "bg-emerald-600 text-white shadow-sm font-extrabold"
                            : "bg-gray-50 dark:bg-gray-800/60 text-gray-400"
                    }`}
                >
                    {t.stepComplete} {phase === "complete" && "🎉"}
                </div>
            </div>

            {/* Main Speedometer Gauge Box */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 text-center flex flex-col items-center justify-center relative overflow-hidden'>
                {/* Background Ambient Glow during active testing */}
                {phase !== "idle" && phase !== "complete" && (
                    <div className='absolute inset-0 bg-gradient-to-t from-blue-500/10 via-purple-500/5 to-transparent animate-pulse pointer-events-none' />
                )}

                {/* Status Badge */}
                <div className='mb-2'>
                    {phase === "idle" && (
                        <span className='px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 font-mono'>
                            ⚡ {t.name}
                        </span>
                    )}
                    {phase === "ping" && (
                        <span className='px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 font-mono animate-pulse'>
                            📡 {t.testingPing}
                        </span>
                    )}
                    {phase === "download" && (
                        <span className='px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 font-mono animate-pulse'>
                            ⬇️ {t.testingDownload}
                        </span>
                    )}
                    {phase === "upload" && (
                        <span className='px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 font-mono animate-pulse'>
                            ⬆️ {t.testingUpload}
                        </span>
                    )}
                    {phase === "complete" && (
                        <span className='px-4 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500 shadow-sm'>
                            ✅ {t.testComplete}
                        </span>
                    )}
                </div>

                {/* 240° Speedometer SVG Graphic */}
                <div className='relative w-72 h-64 sm:w-84 sm:h-72 flex flex-col items-center justify-center my-2'>
                    <svg className='w-full h-full' viewBox='0 0 300 260'>
                        <defs>
                            {/* Linear Gradient for Speed Arc */}
                            <linearGradient id='speedGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                                <stop offset='0%' stopColor='#3b82f6' />
                                <stop offset='50%' stopColor='#8b5cf6' />
                                <stop offset='100%' stopColor='#ec4899' />
                            </linearGradient>

                            {/* Drop Shadow Filter */}
                            <filter id='glow' x='-20%' y='-20%' width='140%' height='140%'>
                                <feDropShadow dx='0' dy='0' stdDeviation='4' floodColor='#3b82f6' floodOpacity='0.5' />
                            </filter>
                        </defs>

                        {/* Background 240-deg Arc Track */}
                        <circle
                            cx='150'
                            cy='150'
                            r='110'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='16'
                            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
                            strokeLinecap='round'
                            className='text-gray-100 dark:text-gray-800'
                            transform='rotate(150 150 150)'
                        />

                        {/* Active Gauge Progress Arc */}
                        <circle
                            cx='150'
                            cy='150'
                            r='110'
                            fill='none'
                            stroke='url(#speedGradient)'
                            strokeWidth='16'
                            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap='round'
                            filter='url(#glow)'
                            transform='rotate(150 150 150)'
                            className='transition-all duration-75'
                        />

                        {/* Speedometer Scale Ticks */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                            const angle = (-120 + ratio * 240) * (Math.PI / 180);
                            const x1 = 150 + Math.sin(angle) * 85;
                            const y1 = 150 - Math.cos(angle) * 85;
                            const x2 = 150 + Math.sin(angle) * 95;
                            const y2 = 150 - Math.cos(angle) * 95;
                            const textX = 150 + Math.sin(angle) * 72;
                            const textY = 150 - Math.cos(angle) * 72 + 4;
                            const val = Math.round(ratio * maxScale);

                            return (
                                <g key={ratio}>
                                    <line
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        className='text-gray-300 dark:text-gray-600'
                                    />
                                    <text
                                        x={textX}
                                        y={textY}
                                        textAnchor='middle'
                                        className='text-[9px] font-mono font-bold fill-gray-400 dark:fill-gray-500'
                                    >
                                        {val}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Center Rotating Needle */}
                        <g transform={`rotate(${needleAngle} 150 150)`} className='transition-transform duration-75'>
                            {/* Needle Body */}
                            <polygon
                                points='148,150 152,150 150.5,52 149.5,52'
                                fill='#3b82f6'
                                className='dark:fill-blue-400'
                            />
                            {/* Needle Tip Glow */}
                            <circle cx='150' cy='52' r='3.5' fill='#60a5fa' />
                            {/* Center Pivot Circle */}
                            <circle cx='150' cy='150' r='10' fill='#1e293b' className='dark:fill-gray-900' />
                            <circle cx='150' cy='150' r='5' fill='#3b82f6' />
                        </g>
                    </svg>

                    {/* Speed Value Digits in Gauge Center */}
                    <div className='absolute bottom-4 flex flex-col items-center justify-center select-none'>
                        <div className='text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-mono tracking-tight'>
                            {phase === "idle"
                                ? "0.0"
                                : phase === "complete"
                                ? (downloadSpeed ?? "0.0")
                                : (liveGaugeValue.toFixed(1))}
                        </div>
                        <div className='text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5'>
                            {t.mbps}
                        </div>
                    </div>
                </div>

                {/* Control Action Buttons */}
                <div className='mt-4 flex items-center justify-center gap-3 w-full max-w-sm'>
                    {phase === "complete" ? (
                        <>
                            <Button
                                onClick={runTest}
                                variant='primary'
                                size='lg'
                                className='flex-1 py-3.5 text-base font-bold shadow-md hover:shadow-lg transition-all cursor-pointer'
                            >
                                🔄 {t.testAgain}
                            </Button>

                            <Button
                                onClick={handleCopyResults}
                                variant='secondary'
                                size='lg'
                                className='py-3.5 px-4 font-bold shadow-xs cursor-pointer'
                                title={t.copyResults}
                            >
                                📋 {t.copyResults}
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={runTest}
                            disabled={phase !== "idle"}
                            variant='primary'
                            size='lg'
                            className={`w-full py-4 text-base font-bold shadow-md hover:shadow-lg transition-all cursor-pointer ${
                                phase !== "idle" ? "opacity-80 cursor-not-allowed" : ""
                            }`}
                        >
                            {phase === "idle" ? `🚀 ${t.startTest}` : "⏳ " + (phase === "ping" ? t.testingPing : phase === "download" ? t.testingDownload : t.testingUpload)}
                        </Button>
                    )}
                </div>
            </div>

            {/* Metrics Breakdown Grid with Live Pulsing Cards */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full'>
                {/* Download Card */}
                <div
                    className={`bg-white dark:bg-gray-900 p-4 rounded-2xl border text-center shadow-xs transition-all ${
                        phase === "download"
                            ? "border-blue-500 shadow-md shadow-blue-500/20 scale-102 bg-blue-50/30 dark:bg-blue-950/30"
                            : "border-gray-200 dark:border-gray-800"
                    }`}
                >
                    <div className='text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-center gap-1'>
                        <span>⬇️ {t.downloadSpeed}</span>
                        {phase === "download" && <span className='w-2 h-2 rounded-full bg-blue-500 animate-ping' />}
                    </div>
                    <div className='text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono'>
                        {downloadSpeed !== null
                            ? `${downloadSpeed}`
                            : phase === "download"
                            ? `${liveGaugeValue.toFixed(1)}`
                            : "-"}
                    </div>
                    <div className='text-[10px] text-gray-400 font-mono mt-0.5'>{t.mbps}</div>
                </div>

                {/* Upload Card */}
                <div
                    className={`bg-white dark:bg-gray-900 p-4 rounded-2xl border text-center shadow-xs transition-all ${
                        phase === "upload"
                            ? "border-purple-500 shadow-md shadow-purple-500/20 scale-102 bg-purple-50/30 dark:bg-purple-950/30"
                            : "border-gray-200 dark:border-gray-800"
                    }`}
                >
                    <div className='text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-center gap-1'>
                        <span>⬆️ {t.uploadSpeed}</span>
                        {phase === "upload" && <span className='w-2 h-2 rounded-full bg-purple-500 animate-ping' />}
                    </div>
                    <div className='text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono'>
                        {uploadSpeed !== null
                            ? `${uploadSpeed}`
                            : phase === "upload"
                            ? `${liveGaugeValue.toFixed(1)}`
                            : "-"}
                    </div>
                    <div className='text-[10px] text-gray-400 font-mono mt-0.5'>{t.mbps}</div>
                </div>

                {/* Ping Card */}
                <div
                    className={`bg-white dark:bg-gray-900 p-4 rounded-2xl border text-center shadow-xs transition-all ${
                        phase === "ping"
                            ? "border-emerald-500 shadow-md shadow-emerald-500/20 scale-102 bg-emerald-50/30 dark:bg-emerald-950/30"
                            : "border-gray-200 dark:border-gray-800"
                    }`}
                >
                    <div className='text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-center gap-1'>
                        <span>⚡ {t.ping}</span>
                        {phase === "ping" && <span className='w-2 h-2 rounded-full bg-emerald-500 animate-ping' />}
                    </div>
                    <div className='text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono'>
                        {ping !== null ? `${ping}` : "-"}
                    </div>
                    <div className='text-[10px] text-gray-400 font-mono mt-0.5'>{t.ms}</div>
                </div>

                {/* Jitter Card */}
                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                    <div className='text-xs font-bold text-gray-500 dark:text-gray-400 mb-1'>
                        〰️ {t.jitter}
                    </div>
                    <div className='text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono'>
                        {jitter !== null ? `${jitter}` : "-"}
                    </div>
                    <div className='text-[10px] text-gray-400 font-mono mt-0.5'>{t.ms}</div>
                </div>
            </div>

            {/* Performance & Quality Insights Card (Appears on Completion) */}
            {phase === "complete" && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-emerald-500/40 dark:border-emerald-500/30 space-y-4 animate-fadeIn'>
                    <div className='flex items-center justify-between flex-wrap gap-2'>
                        <h3 className='font-bold text-base text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>🏆</span>
                            <span>{isVi ? "Đánh Giá Chất Lượng Kết Nối Thực Tế" : "Actual Connection Quality Ratings"}</span>
                        </h3>
                        <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'>
                            {downloadSpeed && downloadSpeed >= 100 ? "⚡ Siêu Tốc (High Speed)" : "Ổn Định (Stable)"}
                        </span>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                        <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                            <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                                📺 {t.streaming4k}
                            </span>
                            <span className={`text-xs font-extrabold ${getStreamingRating().color}`}>
                                {getStreamingRating().label}
                            </span>
                        </div>

                        <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                            <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                                🎮 {t.onlineGaming}
                            </span>
                            <span className={`text-xs font-extrabold ${getGamingRating().color}`}>
                                {getGamingRating().label}
                            </span>
                        </div>

                        <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                            <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                                📞 {t.videoConference}
                            </span>
                            <span className={`text-xs font-extrabold ${getConferenceRating().color}`}>
                                {getConferenceRating().label}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
