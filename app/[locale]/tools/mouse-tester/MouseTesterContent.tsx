"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { mouseTesterTranslations } from "@/lib/i18n/tools/mouse-tester";

interface ClickLogItem {
    id: number;
    buttonName: string;
    intervalMs: number | null;
    isChatter: boolean;
    timestamp: string;
}

export default function MouseTesterContent() {
    const { locale } = useLanguage();
    const t = mouseTesterTranslations[locale as "en" | "vi"] || mouseTesterTranslations.en;
    const isVi = locale === "vi";

    // Mode: 'buttons' | 'cps'
    const [activeTab, setActiveTab] = useState<"buttons" | "cps">("buttons");

    // Button states
    const [pressedButtons, setPressedButtons] = useState<{ [key: string]: boolean }>({
        left: false,
        middle: false,
        right: false,
        back: false,
        forward: false,
    });
    const [clickCounts, setClickCounts] = useState<{ [key: string]: number }>({
        left: 0,
        middle: 0,
        right: 0,
        back: 0,
        forward: 0,
    });

    // Scroll states
    const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
    const [totalScrollDelta, setTotalScrollDelta] = useState<number>(0);
    const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Double-click / Chatter detection
    const [chatterDetected, setChatterDetected] = useState<boolean>(false);
    const [lastClickTime, setLastClickTime] = useState<number | null>(null);
    const [lastInterval, setLastInterval] = useState<number | null>(null);
    const [clickLogs, setClickLogs] = useState<ClickLogItem[]>([]);

    // CPS Test states
    const [cpsDuration, setCpsDuration] = useState<5 | 10 | 0>(5); // 0 = free
    const [cpsActive, setCpsActive] = useState<boolean>(false);
    const [cpsFinished, setCpsFinished] = useState<boolean>(false);
    const [cpsClicks, setCpsClicks] = useState<number>(0);
    const [cpsTimeLeft, setCpsTimeLeft] = useState<number>(5);
    const [peakCps, setPeakCps] = useState<number>(0);
    const [finalCps, setFinalCps] = useState<number>(0);

    const cpsStartTimeRef = useRef<number | null>(null);
    const cpsTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const cpsClickTimestampsRef = useRef<number[]>([]);

    // Handle button down
    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        const now = performance.now();
        let btnKey = "";
        let btnLabel = "";

        switch (e.button) {
            case 0:
                btnKey = "left";
                btnLabel = t.leftClick;
                break;
            case 1:
                btnKey = "middle";
                btnLabel = t.middleClick;
                break;
            case 2:
                btnKey = "right";
                btnLabel = t.rightClick;
                break;
            case 3:
                btnKey = "back";
                btnLabel = t.backButton;
                break;
            case 4:
                btnKey = "forward";
                btnLabel = t.forwardButton;
                break;
            default:
                btnKey = "left";
                btnLabel = t.leftClick;
        }

        setPressedButtons((prev) => ({ ...prev, [btnKey]: true }));
        setClickCounts((prev) => ({ ...prev, [btnKey]: (prev[btnKey] || 0) + 1 }));

        // Chatter / double-click interval test
        let interval: number | null = null;
        let isChatter = false;
        if (lastClickTime !== null) {
            interval = Math.round(now - lastClickTime);
            setLastInterval(interval);
            if (interval < 80 && interval > 2) {
                isChatter = true;
                setChatterDetected(true);
            }
        }
        setLastClickTime(now);

        const newLogItem: ClickLogItem = {
            id: Date.now() + Math.random(),
            buttonName: btnLabel,
            intervalMs: interval,
            isChatter,
            timestamp: new Date().toLocaleTimeString(),
        };

        setClickLogs((prev) => [newLogItem, ...prev.slice(0, 19)]);
    }, [lastClickTime, t]);

    // Handle button up
    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        let btnKey = "";
        switch (e.button) {
            case 0: btnKey = "left"; break;
            case 1: btnKey = "middle"; break;
            case 2: btnKey = "right"; break;
            case 3: btnKey = "back"; break;
            case 4: btnKey = "forward"; break;
            default: btnKey = "left";
        }
        setPressedButtons((prev) => ({ ...prev, [btnKey]: false }));
    }, []);

    // Handle scroll wheel
    const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const dir = e.deltaY < 0 ? "up" : "down";
        setScrollDirection(dir);
        setTotalScrollDelta((prev) => prev + Math.abs(Math.round(e.deltaY)));

        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = setTimeout(() => {
            setScrollDirection(null);
        }, 300);
    }, []);

    // Reset button tester
    const handleResetButtons = () => {
        setPressedButtons({ left: false, middle: false, right: false, back: false, forward: false });
        setClickCounts({ left: 0, middle: 0, right: 0, back: 0, forward: 0 });
        setScrollDirection(null);
        setTotalScrollDelta(0);
        setChatterDetected(false);
        setLastClickTime(null);
        setLastInterval(null);
        setClickLogs([]);
    };

    // CPS Test Click Handler
    const handleCpsClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const now = performance.now();

        if (!cpsActive && !cpsFinished) {
            // First click starts the test
            setCpsActive(true);
            setCpsClicks(1);
            cpsStartTimeRef.current = now;
            cpsClickTimestampsRef.current = [now];
            setPeakCps(1);

            if (cpsDuration > 0) {
                setCpsTimeLeft(cpsDuration);
                cpsTimerIntervalRef.current = setInterval(() => {
                    const elapsed = (performance.now() - (cpsStartTimeRef.current || performance.now())) / 1000;
                    const remaining = Math.max(0, cpsDuration - elapsed);
                    setCpsTimeLeft(parseFloat(remaining.toFixed(1)));

                    // Calculate live CPS (window of last 1000ms)
                    const currentWindowClicks = cpsClickTimestampsRef.current.filter((ts) => performance.now() - ts <= 1000).length;
                    setPeakCps((prev) => Math.max(prev, currentWindowClicks));

                    if (remaining <= 0) {
                        finishCpsTest();
                    }
                }, 100);
            }
            return;
        }

        if (cpsActive) {
            setCpsClicks((prev) => prev + 1);
            cpsClickTimestampsRef.current.push(now);

            // Calculate live CPS over last 1 second
            const recentClicks = cpsClickTimestampsRef.current.filter((ts) => now - ts <= 1000).length;
            setPeakCps((prev) => Math.max(prev, recentClicks));
        }
    };

    const finishCpsTest = useCallback(() => {
        if (cpsTimerIntervalRef.current) clearInterval(cpsTimerIntervalRef.current);
        setCpsActive(false);
        setCpsFinished(true);

        const durationSec = cpsDuration > 0 ? cpsDuration : Math.max(1, ((performance.now() - (cpsStartTimeRef.current || performance.now())) / 1000));
        const total = cpsClickTimestampsRef.current.length;
        const score = parseFloat((total / durationSec).toFixed(2));
        setFinalCps(score);
    }, [cpsDuration]);

    const resetCpsTest = () => {
        if (cpsTimerIntervalRef.current) clearInterval(cpsTimerIntervalRef.current);
        setCpsActive(false);
        setCpsFinished(false);
        setCpsClicks(0);
        setCpsTimeLeft(cpsDuration);
        setPeakCps(0);
        setFinalCps(0);
        cpsStartTimeRef.current = null;
        cpsClickTimestampsRef.current = [];
    };

    useEffect(() => {
        resetCpsTest();
    }, [cpsDuration]);

    // CPS Rank determination
    const getCpsRank = (score: number) => {
        if (score < 5) return { title: t.rankTurtle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-300" };
        if (score < 8) return { title: t.rankCasual, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-300" };
        if (score < 11) return { title: t.rankGamer, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300" };
        if (score <= 14) return { title: t.rankPro, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-300" };
        return { title: t.rankCheater, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/40 border-red-300" };
    };

    const totalClicksSum = Object.values(clickCounts).reduce((a, b) => a + b, 0);

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Mode Switcher Tabs */}
            <div className='flex items-center p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full'>
                <button
                    onClick={() => setActiveTab("buttons")}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "buttons"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    🖱️ {t.modeButtonTest}
                </button>
                <button
                    onClick={() => setActiveTab("cps")}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "cps"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    ⚡ {t.modeCpsTest}
                </button>
            </div>

            {/* TAB 1: MOUSE BUTTON & CHATTER TESTER */}
            {activeTab === "buttons" && (
                <div className='w-full space-y-6'>
                    {/* Interactive Click Pad with Chassis */}
                    <div
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onWheel={handleWheel}
                        onContextMenu={(e) => e.preventDefault()}
                        className='w-full bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center relative overflow-hidden select-none cursor-crosshair min-h-[420px] transition-colors hover:border-blue-400 dark:hover:border-blue-600'
                    >
                        <div className='text-xs sm:text-sm text-gray-400 font-semibold mb-6 text-center pointer-events-none'>
                            🎯 {t.clickHereToTest} <br />
                            <span className='text-[11px] opacity-75'>({t.preventContextMenuNote})</span>
                        </div>

                        {/* Visual Mouse Chassis */}
                        <div className='relative w-48 sm:w-56 h-72 sm:h-80 bg-gray-100 dark:bg-gray-800 rounded-[50px] sm:rounded-[60px] p-3 shadow-inner border border-gray-300 dark:border-gray-700 flex flex-col items-center pointer-events-none'>
                            {/* Top Half (Left & Right Buttons + Wheel) */}
                            <div className='w-full h-36 sm:h-40 grid grid-cols-2 gap-2 relative'>
                                {/* Left Button */}
                                <div
                                    className={`rounded-tl-[40px] sm:rounded-tl-[50px] rounded-tr-sm rounded-bl-sm rounded-br-sm border transition-all duration-75 flex flex-col items-center justify-center p-2 text-center ${
                                        pressedButtons.left
                                            ? "bg-blue-500 border-blue-600 text-white shadow-lg scale-95"
                                            : "bg-white dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                                    }`}
                                >
                                    <span className='text-xs font-bold'>{t.leftClick}</span>
                                    <span className='text-[10px] font-mono mt-1 opacity-80'>
                                        {clickCounts.left}
                                    </span>
                                </div>

                                {/* Right Button */}
                                <div
                                    className={`rounded-tr-[40px] sm:rounded-tr-[50px] rounded-tl-sm rounded-bl-sm rounded-br-sm border transition-all duration-75 flex flex-col items-center justify-center p-2 text-center ${
                                        pressedButtons.right
                                            ? "bg-blue-500 border-blue-600 text-white shadow-lg scale-95"
                                            : "bg-white dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                                    }`}
                                >
                                    <span className='text-xs font-bold'>{t.rightClick}</span>
                                    <span className='text-[10px] font-mono mt-1 opacity-80'>
                                        {clickCounts.right}
                                    </span>
                                </div>

                                {/* Middle Scroll Wheel Floating Center */}
                                <div className='absolute left-1/2 top-4 -translate-x-1/2 w-8 h-16 bg-gray-200 dark:bg-gray-900 rounded-full border border-gray-400 dark:border-gray-600 shadow-md flex flex-col items-center justify-center z-10'>
                                    <div
                                        className={`w-6 h-14 rounded-full transition-all flex flex-col items-center justify-center ${
                                            pressedButtons.middle
                                                ? "bg-emerald-500 text-white scale-90"
                                                : scrollDirection === "up"
                                                ? "bg-amber-400 text-black -translate-y-1"
                                                : scrollDirection === "down"
                                                ? "bg-amber-400 text-black translate-y-1"
                                                : "bg-gray-300 dark:bg-gray-800 text-gray-500"
                                        }`}
                                    >
                                        <span className='text-[9px] font-bold'>
                                            {scrollDirection === "up" ? "▲" : scrollDirection === "down" ? "▼" : "•"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Mouse Body (Lower Half) */}
                            <div className='w-full flex-1 flex flex-col items-center justify-center text-center mt-2'>
                                <div className='w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-[10px] text-gray-400 font-bold opacity-60'>
                                    ANY
                                </div>
                            </div>

                            {/* Side Buttons (Mouse 4 & Mouse 5) */}
                            <div className='absolute -left-3 top-24 flex flex-col gap-2'>
                                <div
                                    className={`w-3.5 h-8 rounded-l-md border transition-all ${
                                        pressedButtons.forward
                                            ? "bg-purple-500 border-purple-600 scale-105"
                                            : "bg-gray-300 dark:bg-gray-700 border-gray-400"
                                    }`}
                                    title={t.forwardButton}
                                />
                                <div
                                    className={`w-3.5 h-8 rounded-l-md border transition-all ${
                                        pressedButtons.back
                                            ? "bg-purple-500 border-purple-600 scale-105"
                                            : "bg-gray-300 dark:bg-gray-700 border-gray-400"
                                    }`}
                                    title={t.backButton}
                                />
                            </div>
                        </div>

                        {/* Reset button inside test area */}
                        <div className='mt-6 z-20'>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleResetButtons();
                                }}
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                🔄 {t.resetTest}
                            </Button>
                        </div>
                    </div>

                    {/* Hardware Metrics Grid */}
                    <div className='w-full grid grid-cols-2 sm:grid-cols-4 gap-3'>
                        <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                            <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                                🖱️ {t.totalClicks}
                            </div>
                            <div className='text-2xl font-black text-blue-600 dark:text-blue-400 font-mono'>
                                {totalClicksSum}
                            </div>
                        </div>

                        <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                            <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                                ⏱️ {t.lastInterval}
                            </div>
                            <div className={`text-2xl font-black font-mono ${
                                lastInterval !== null && lastInterval < 80 ? "text-red-500" : "text-emerald-500"
                            }`}>
                                {lastInterval !== null ? `${lastInterval} ms` : "-"}
                            </div>
                        </div>

                        <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                            <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                                📜 {t.scrollDelta}
                            </div>
                            <div className='text-2xl font-black text-purple-600 dark:text-purple-400 font-mono'>
                                {totalScrollDelta} px
                            </div>
                        </div>

                        <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                            <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                                🛡️ {t.chatterDetector}
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded-lg mt-1 ${
                                chatterDetected
                                    ? "bg-red-50 dark:bg-red-950/50 text-red-600 border border-red-200 dark:border-red-800"
                                    : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800"
                            }`}>
                                {chatterDetected ? "⚠️ Faulty / Chatter" : "✅ Normal / Healthy"}
                            </div>
                        </div>
                    </div>

                    {/* Chatter Warning Box if detected */}
                    {chatterDetected && (
                        <div className='w-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-4 rounded-2xl text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3'>
                            <span className='text-xl'>⚠️</span>
                            <div>
                                <div className='font-bold mb-1'>{t.chatterWarning}</div>
                                <div className='opacity-90'>{t.chatterThresholdNote}</div>
                            </div>
                        </div>
                    )}

                    {/* Click History Log */}
                    <div className='w-full bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xs'>
                        <h4 className='text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-between'>
                            <span>📋 {t.clickLog}</span>
                            <span className='text-xs text-gray-400 font-normal'>20 events</span>
                        </h4>

                        {clickLogs.length === 0 ? (
                            <p className='text-xs text-gray-400 py-3 text-center'>{t.noClicksYet}</p>
                        ) : (
                            <div className='overflow-x-auto max-h-48 overflow-y-auto'>
                                <table className='w-full text-left text-xs'>
                                    <thead>
                                        <tr className='text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-2'>
                                            <th className='py-1.5 font-medium'>Button</th>
                                            <th className='py-1.5 font-medium'>Interval</th>
                                            <th className='py-1.5 font-medium'>Status</th>
                                            <th className='py-1.5 font-medium'>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-gray-100 dark:divide-gray-800 font-mono'>
                                        {clickLogs.map((log) => (
                                            <tr key={log.id} className={log.isChatter ? "bg-red-50/50 dark:bg-red-950/20" : ""}>
                                                <td className='py-1.5 font-bold text-gray-800 dark:text-gray-200'>{log.buttonName}</td>
                                                <td className='py-1.5'>{log.intervalMs !== null ? `${log.intervalMs}ms` : "-"}</td>
                                                <td className='py-1.5'>
                                                    {log.isChatter ? (
                                                        <span className='text-red-500 font-bold'>⚠️ Chatter (&lt;80ms)</span>
                                                    ) : (
                                                        <span className='text-emerald-500'>OK</span>
                                                    )}
                                                </td>
                                                <td className='py-1.5 text-gray-400'>{log.timestamp}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: CPS SPEED TEST */}
            {activeTab === "cps" && (
                <div className='w-full space-y-6'>
                    {/* Duration Selectors */}
                    <div className='flex items-center justify-center gap-2'>
                        <button
                            disabled={cpsActive}
                            onClick={() => setCpsDuration(5)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                cpsDuration === 5
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            ⏱️ {t.time5s}
                        </button>
                        <button
                            disabled={cpsActive}
                            onClick={() => setCpsDuration(10)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                cpsDuration === 10
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            ⏱️ {t.time10s}
                        </button>
                        <button
                            disabled={cpsActive}
                            onClick={() => setCpsDuration(0)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                cpsDuration === 0
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            ♾️ {t.timeFree}
                        </button>
                    </div>

                    {/* Giant Click Zone */}
                    <div
                        onClick={handleCpsClick}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`w-full h-80 sm:h-96 rounded-[36px] sm:rounded-[48px] shadow-sm border-2 flex flex-col items-center justify-center text-center select-none cursor-pointer transition-all duration-100 ${
                            cpsActive
                                ? "bg-gradient-to-b from-blue-500 to-indigo-600 border-blue-400 text-white active:scale-[0.99]"
                                : cpsFinished
                                ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                                : "bg-white dark:bg-gray-900 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500"
                        }`}
                    >
                        {!cpsActive && !cpsFinished && (
                            <div className='space-y-3 pointer-events-none p-6'>
                                <div className='w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-3xl mx-auto'>
                                    ⚡
                                </div>
                                <h3 className='text-lg sm:text-xl font-black text-gray-900 dark:text-white'>
                                    {t.startCps}
                                </h3>
                                <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm'>
                                    {t.cpsSubtitle}
                                </p>
                            </div>
                        )}

                        {cpsActive && (
                            <div className='space-y-2 pointer-events-none'>
                                <span className='text-xs font-extrabold uppercase tracking-wider text-blue-100 animate-pulse'>
                                    {t.clickFast}
                                </span>
                                <div className='text-7xl sm:text-9xl font-black font-mono tracking-tight'>
                                    {cpsClicks}
                                </div>
                                <div className='text-sm sm:text-base font-bold text-blue-100'>
                                    {cpsDuration > 0 ? `${t.timeLeft}: ${cpsTimeLeft}s` : "Free Practice"}
                                </div>
                            </div>
                        )}

                        {cpsFinished && (
                            <div className='space-y-4 p-6 pointer-events-none'>
                                {(() => {
                                    const rank = getCpsRank(finalCps);
                                    return (
                                        <>
                                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black border ${rank.bg} ${rank.color}`}>
                                                {rank.title}
                                            </span>
                                            <div className='text-6xl sm:text-8xl font-black text-gray-900 dark:text-white font-mono'>
                                                {finalCps} <span className='text-xl sm:text-2xl font-bold text-gray-400'>CPS</span>
                                            </div>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                {cpsClicks} clicks in {cpsDuration}s (Peak: {peakCps} CPS)
                                            </p>
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    {/* Bottom Action / Try Again */}
                    {cpsFinished && (
                        <div className='flex justify-center'>
                            <Button
                                onClick={resetCpsTest}
                                variant='primary'
                                size='md'
                                className='cursor-pointer text-xs font-bold px-8 shadow-md'
                            >
                                🔄 {t.tryAgain}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* SEO & Troubleshooting Guide */}
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
