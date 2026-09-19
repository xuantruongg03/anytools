"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { toast } from "@/components/ui/Toast";

type CountdownItem = {
    id: string;
    name: string;
    seconds: number;
    startTime: number;
    isPaused?: boolean;
    remainingSeconds?: number;
};

export default function CountdownClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = getTranslation(locale);
    const page = t.tools.countdown.page;

    const [countdowns, setCountdowns] = useState<CountdownItem[]>([]);
    const [newCountdownName, setNewCountdownName] = useState("");
    const [newCountdownSeconds, setNewCountdownSeconds] = useState<number>(60);
    const [timeRemaining, setTimeRemaining] = useState<{
        [key: string]: { hours: number; minutes: number; seconds: number; totalRemaining: number; expired: boolean };
    }>({});
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [examModeId, setExamModeId] = useState<string | null>(null);

    const prevExpiredRef = useRef<{ [key: string]: boolean }>({});
    const warnedFiveMinRef = useRef<{ [key: string]: boolean }>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Audio Context Getter
    const getAudioContext = useCallback(() => {
        if (!audioCtxRef.current) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
                audioCtxRef.current = new AudioCtx();
            }
        }
        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);

    // Web Audio API Exam Alarm Sound (when expired)
    const playAlarmSound = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const playTone = (freq: number, start: number, dur: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "square";
                osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
                gain.gain.setValueAtTime(0, ctx.currentTime + start);
                gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + start + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + dur);
            };

            // Distinctive 3-chime exam end bell
            playTone(880, 0, 0.25);
            playTone(880, 0.35, 0.25);
            playTone(1174.66, 0.7, 0.6);
        } catch {
            // Audio error ignore
        }
    }, [soundEnabled, getAudioContext]);

    // 5-Minute Warning Soft Chime
    const playWarningChime = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const playSoft = (freq: number, start: number, dur: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
                gain.gain.setValueAtTime(0, ctx.currentTime + start);
                gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + dur);
            };

            playSoft(587.33, 0, 0.3); // D5
            playSoft(739.99, 0.35, 0.5); // F#5
        } catch {
            // Audio error ignore
        }
    }, [soundEnabled, getAudioContext]);

    // Load from localStorage
    useEffect(() => {
        const savedCountdowns = localStorage.getItem("countdowns");
        if (savedCountdowns) {
            try {
                const parsed = JSON.parse(savedCountdowns);
                const now = Date.now();
                const activeCountdowns = parsed.filter((countdown: CountdownItem) => {
                    if (countdown.isPaused) {
                        return (countdown.remainingSeconds || 0) > 0;
                    } else {
                        const elapsed = Math.floor((now - countdown.startTime) / 1000);
                        const remaining = countdown.seconds - elapsed;
                        return remaining > 0;
                    }
                });
                setCountdowns(activeCountdowns);
            } catch {
                // Ignore parse errors
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (countdowns.length > 0) {
            localStorage.setItem("countdowns", JSON.stringify(countdowns));
        } else {
            localStorage.removeItem("countdowns");
        }
    }, [countdowns]);

    // Timer calculation loop
    useEffect(() => {
        const calculateTimeRemaining = () => {
            const times: {
                [key: string]: { hours: number; minutes: number; seconds: number; totalRemaining: number; expired: boolean };
            } = {};
            const now = Date.now();

            countdowns.forEach((countdown) => {
                let remaining: number;

                if (countdown.isPaused) {
                    remaining = countdown.remainingSeconds || 0;
                } else {
                    const elapsed = Math.floor((now - countdown.startTime) / 1000);
                    remaining = countdown.seconds - elapsed;
                }

                if (remaining <= 0) {
                    times[countdown.id] = { hours: 0, minutes: 0, seconds: 0, totalRemaining: 0, expired: true };
                    if (!prevExpiredRef.current[countdown.id]) {
                        playAlarmSound();
                        prevExpiredRef.current[countdown.id] = true;
                    }
                } else {
                    // Check 5-minute warning (300 seconds)
                    if (remaining <= 300 && remaining > 298 && !warnedFiveMinRef.current[countdown.id]) {
                        warnedFiveMinRef.current[countdown.id] = true;
                        playWarningChime();
                        toast.warning(page.fiveMinWarning);
                    }

                    times[countdown.id] = {
                        hours: Math.floor(remaining / 3600),
                        minutes: Math.floor((remaining % 3600) / 60),
                        seconds: remaining % 60,
                        totalRemaining: remaining,
                        expired: false,
                    };
                }
            });
            setTimeRemaining(times);
        };

        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);
        return () => clearInterval(interval);
    }, [countdowns, playAlarmSound, playWarningChime, page.fiveMinWarning]);

    // Add manual countdown
    const addCountdown = useCallback(() => {
        if (!newCountdownName.trim() || !newCountdownSeconds || newCountdownSeconds <= 0) {
            toast.error(page.errors.fillFields);
            return;
        }

        const newCountdown: CountdownItem = {
            id: Date.now().toString(),
            name: newCountdownName.trim(),
            seconds: newCountdownSeconds,
            startTime: Date.now(),
        };

        setCountdowns((prev) => [newCountdown, ...prev]);
        setNewCountdownName("");
        toast.success(isVi ? `Đã tạo: ${newCountdown.name}` : `Created timer: ${newCountdown.name}`);
    }, [newCountdownName, newCountdownSeconds, page.errors.fillFields, isVi]);

    // Quick add
    const addQuickCountdown = useCallback(
        (name: string, seconds: number) => {
            const newCountdown: CountdownItem = {
                id: Date.now().toString() + Math.random().toString().slice(2, 6),
                name,
                seconds,
                startTime: Date.now(),
            };
            setCountdowns((prev) => [newCountdown, ...prev]);
            toast.success(isVi ? `Đã bắt đầu: ${name}` : `Started: ${name}`);
        },
        [isVi]
    );

    // Remove countdown
    const removeCountdown = useCallback((id: string) => {
        setCountdowns((prev) => prev.filter((c) => c.id !== id));
        setExamModeId((curr) => (curr === id ? null : curr));
    }, []);

    // Toggle pause
    const togglePause = useCallback((id: string) => {
        setCountdowns((prev) =>
            prev.map((countdown) => {
                if (countdown.id === id) {
                    if (countdown.isPaused) {
                        return {
                            ...countdown,
                            isPaused: false,
                            startTime: Date.now(),
                            seconds: countdown.remainingSeconds || countdown.seconds,
                        };
                    } else {
                        const now = Date.now();
                        const elapsed = Math.floor((now - countdown.startTime) / 1000);
                        const remaining = countdown.seconds - elapsed;
                        return {
                            ...countdown,
                            isPaused: true,
                            remainingSeconds: remaining > 0 ? remaining : 0,
                        };
                    }
                }
                return countdown;
            })
        );
    }, []);

    // Restart timer
    const restartCountdown = useCallback((id: string) => {
        setCountdowns((prev) =>
            prev.map((c) => {
                if (c.id === id) {
                    warnedFiveMinRef.current[id] = false;
                    prevExpiredRef.current[id] = false;
                    return {
                        ...c,
                        startTime: Date.now(),
                        isPaused: false,
                        remainingSeconds: c.seconds,
                    };
                }
                return c;
            })
        );
        toast.info(isVi ? "Đã đặt lại đồng hồ!" : "Timer restarted!");
    }, [isVi]);

    // Toggle fullscreen for presentation mode
    const toggleFullscreenPresentation = useCallback((id: string) => {
        setExamModeId(id);
        if (containerRef.current && !document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => {});
        }
    }, []);

    const exitPresentation = useCallback(() => {
        setExamModeId(null);
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
    }, []);

    // Active exam countdown object
    const activeExam = useMemo(() => {
        if (!examModeId) return null;
        return countdowns.find((c) => c.id === examModeId) || null;
    }, [examModeId, countdowns]);

    const activeExamTime = activeExam ? timeRemaining[activeExam.id] : null;

    // Quick exam & study presets
    const examPresets = useMemo(
        () => [
            { name: page.examPresets.m15, seconds: 15 * 60, icon: "⚡" },
            { name: page.examPresets.m45, seconds: 45 * 60, icon: "📝" },
            { name: page.examPresets.m60, seconds: 60 * 60, icon: "⏱️" },
            { name: page.examPresets.m90, seconds: 90 * 60, icon: "📚" },
            { name: page.examPresets.m120, seconds: 120 * 60, icon: "🎓" },
            { name: page.examPresets.pomodoro, seconds: 25 * 60, icon: "🍅" },
        ],
        [page.examPresets]
    );

    const standardQuick = useMemo(
        () =>
            isVi
                ? [
                      { name: "⚡ 10 giây", seconds: 10 },
                      { name: "⏱️ 30 giây", seconds: 30 },
                      { name: "🕐 1 phút", seconds: 60 },
                      { name: "🕑 2 phút", seconds: 120 },
                      { name: "🕔 5 phút", seconds: 300 },
                      { name: "🕙 10 phút", seconds: 600 },
                  ]
                : [
                      { name: "⚡ 10 sec", seconds: 10 },
                      { name: "⏱️ 30 sec", seconds: 30 },
                      { name: "🕐 1 min", seconds: 60 },
                      { name: "🕑 2 min", seconds: 120 },
                      { name: "🕔 5 min", seconds: 300 },
                      { name: "🕙 10 min", seconds: 600 },
                  ],
        [isVi]
    );

    return (
        <div ref={containerRef} className='space-y-6 max-w-6xl mx-auto'>
            {/* FULLSCREEN EXAM PRESENTATION MODE OVERLAY */}
            {activeExam && activeExamTime && (
                <div className='fixed inset-0 z-50 bg-gray-950 text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none'>
                    {/* Top Presentation Bar */}
                    <div className='flex items-center justify-between border-b border-gray-800 pb-4'>
                        <div className='flex items-center gap-3'>
                            <span className='px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/40 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse'>
                                <span className='w-2 h-2 rounded-full bg-red-500'></span>
                                {page.examMode}
                            </span>
                            <h2 className='text-xl sm:text-2xl font-black text-gray-100 tracking-tight'>
                                {activeExam.name}
                            </h2>
                        </div>

                        <div className='flex items-center gap-3'>
                            <button
                                type='button'
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 cursor-pointer flex items-center gap-1.5'
                            >
                                <span>{soundEnabled ? "🔊" : "🔇"}</span>
                                <span>{soundEnabled ? page.soundOn : page.soundOff}</span>
                            </button>
                            <button
                                type='button'
                                onClick={exitPresentation}
                                className='px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 cursor-pointer transition-colors flex items-center gap-1.5'
                            >
                                <span>✕</span> {page.exitExamMode}
                            </button>
                        </div>
                    </div>

                    {/* Center Giant Timer Display */}
                    <div className='flex-1 flex flex-col items-center justify-center text-center my-8'>
                        {/* 5-Min Warning Badge */}
                        {activeExamTime.totalRemaining <= 300 && !activeExamTime.expired && (
                            <div className='mb-6 px-6 py-2.5 bg-red-950/80 border-2 border-red-500 text-red-200 rounded-2xl animate-bounce shadow-2xl flex items-center gap-2 text-sm sm:text-lg font-black'>
                                <span>{page.fiveMinWarning}</span>
                                <span className='text-xs opacity-80 font-normal hidden sm:inline'>
                                    ({page.warningNotice})
                                </span>
                            </div>
                        )}

                        {activeExamTime.expired ? (
                            <div className='space-y-4 animate-bounce'>
                                <div className='text-7xl sm:text-9xl'>🔔</div>
                                <div className='text-5xl sm:text-7xl font-black text-red-500 tracking-wider'>
                                    {page.expired}
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center'>
                                <div
                                    className={`font-mono text-6xl sm:text-8xl md:text-9xl font-black tracking-tight drop-shadow-2xl transition-colors ${
                                        activeExamTime.totalRemaining <= 300
                                            ? "text-red-500 animate-pulse"
                                            : "text-white"
                                    }`}
                                >
                                    {activeExamTime.hours > 0 && (
                                        <span>{String(activeExamTime.hours).padStart(2, "0")}:</span>
                                    )}
                                    <span>{String(activeExamTime.minutes).padStart(2, "0")}</span>:
                                    <span>{String(activeExamTime.seconds).padStart(2, "0")}</span>
                                </div>

                                {/* Progress Bar */}
                                <div className='w-full max-w-2xl bg-gray-800/80 rounded-full h-3.5 mt-8 overflow-hidden border border-gray-700 p-0.5'>
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                            activeExamTime.totalRemaining <= 300
                                                ? "bg-red-500"
                                                : "bg-gradient-to-r from-blue-500 to-emerald-400"
                                        }`}
                                        style={{
                                            width: `${Math.max(
                                                0,
                                                Math.min(
                                                    100,
                                                    ((activeExam.seconds - activeExamTime.totalRemaining) /
                                                        activeExam.seconds) *
                                                        100
                                                )
                                            )}%`,
                                        }}
                                    />
                                </div>

                                <div className='mt-4 text-xs sm:text-sm text-gray-400 font-medium'>
                                    {page.totalTimeLabel}: {Math.floor(activeExam.seconds / 60)} {page.minutes.toLowerCase()}
                                    {activeExam.isPaused && (
                                        <span className='ml-3 text-amber-400 font-bold'>
                                            ({page.pause})
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Controls */}
                    <div className='flex items-center justify-center gap-4 pt-4 border-t border-gray-800'>
                        {!activeExamTime.expired && (
                            <button
                                type='button'
                                onClick={() => togglePause(activeExam.id)}
                                className={`px-6 py-3 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 ${
                                    activeExam.isPaused
                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30"
                                        : "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/30"
                                }`}
                            >
                                <span>{activeExam.isPaused ? "▶" : "⏸"}</span>
                                <span>{activeExam.isPaused ? page.resume : page.pause}</span>
                            </button>
                        )}
                        <button
                            type='button'
                            onClick={() => restartCountdown(activeExam.id)}
                            className='px-6 py-3 rounded-2xl font-bold text-sm sm:text-base bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 cursor-pointer transition-transform hover:scale-105 flex items-center gap-2'
                        >
                            <span>🔄</span>
                            <span>{page.reset}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Top Exam & Study Presets */}
            <div className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-md p-6 text-white'>
                <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
                    <h2 className='text-lg sm:text-xl font-bold flex items-center gap-2'>
                        <span>🎓</span>
                        <span>{page.examPresetsTitle}</span>
                    </h2>
                    <button
                        type='button'
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className='px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-semibold backdrop-blur-sm cursor-pointer transition-colors flex items-center gap-1.5'
                    >
                        <span>{soundEnabled ? "🔊" : "🔇"}</span>
                        <span>{soundEnabled ? page.soundOn : page.soundOff}</span>
                    </button>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
                    {examPresets.map((preset, idx) => (
                        <button
                            key={idx}
                            type='button'
                            onClick={() => addQuickCountdown(preset.name, preset.seconds)}
                            className='p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-left transition-all hover:scale-[1.03] backdrop-blur-sm cursor-pointer flex flex-col justify-between h-22'
                        >
                            <span className='text-2xl'>{preset.icon}</span>
                            <span className='text-xs font-bold leading-snug'>{preset.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Short Presets */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm'>
                <h3 className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5'>
                    <span>⚡</span> {isVi ? "Tùy chọn nhanh" : "Quick Timers"}
                </h3>
                <div className='grid grid-cols-3 sm:grid-cols-6 gap-2'>
                    {standardQuick.map((item, idx) => (
                        <button
                            key={idx}
                            type='button'
                            onClick={() => addQuickCountdown(item.name, item.seconds)}
                            className='px-3 py-2 bg-gray-50 dark:bg-gray-700/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer'
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add Custom Countdown */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm'>
                <h2 className='text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                    <span>➕</span> {page.createNew}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-3'>
                    <div className='md:col-span-6'>
                        <input
                            type='text'
                            value={newCountdownName}
                            onChange={(e) => setNewCountdownName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addCountdown()}
                            placeholder={page.eventName}
                            className='w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none'
                        />
                    </div>
                    <div className='md:col-span-4 flex gap-2'>
                        <input
                            type='number'
                            value={newCountdownSeconds || ""}
                            onChange={(e) => setNewCountdownSeconds(parseInt(e.target.value) || 0)}
                            onKeyDown={(e) => e.key === "Enter" && addCountdown()}
                            placeholder={page.secondsPlaceholder}
                            min='1'
                            className='flex-1 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white outline-none'
                        />
                        <span className='flex items-center px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold'>
                            {page.secondsLabel}
                        </span>
                    </div>
                    <div className='md:col-span-2'>
                        <button
                            type='button'
                            onClick={addCountdown}
                            className='w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-sm shadow-blue-500/30'
                        >
                            {page.addButton}
                        </button>
                    </div>
                </div>
            </div>

            {/* Countdowns List */}
            <div className='grid grid-cols-1 gap-4'>
                {countdowns.map((countdown) => {
                    const time = timeRemaining[countdown.id];
                    if (!time) return null;

                    const isNearEnd = time.totalRemaining <= 300 && !time.expired;

                    return (
                        <div
                            key={countdown.id}
                            className={`rounded-2xl border p-5 sm:p-6 transition-all shadow-sm ${
                                time.expired
                                    ? "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800"
                                    : isNearEnd
                                    ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700"
                                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            }`}
                        >
                            <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
                                <div className='flex items-center gap-3'>
                                    <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                        {countdown.name}
                                        {countdown.isPaused && (
                                            <span className='text-xs px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full font-semibold'>
                                                {page.pause}
                                            </span>
                                        )}
                                        {isNearEnd && (
                                            <span className='text-xs px-2.5 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 rounded-full font-bold animate-pulse'>
                                                {page.fiveMinWarning}
                                            </span>
                                        )}
                                    </h3>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex items-center gap-2'>
                                    {/* Exam Fullscreen Mode */}
                                    <button
                                        type='button'
                                        onClick={() => toggleFullscreenPresentation(countdown.id)}
                                        className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer flex items-center gap-1'
                                        title={page.examMode}
                                    >
                                        <span>🖥️</span>
                                        <span className='hidden sm:inline'>{page.examMode}</span>
                                    </button>

                                    {/* Pause / Resume */}
                                    {!time.expired && (
                                        <button
                                            type='button'
                                            onClick={() => togglePause(countdown.id)}
                                            className='p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer transition-colors'
                                            title={countdown.isPaused ? page.resume : page.pause}
                                        >
                                            {countdown.isPaused ? "▶" : "⏸"}
                                        </button>
                                    )}

                                    {/* Restart */}
                                    <button
                                        type='button'
                                        onClick={() => restartCountdown(countdown.id)}
                                        className='p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer transition-colors'
                                        title={page.reset}
                                    >
                                        🔄
                                    </button>

                                    {/* Remove */}
                                    <button
                                        type='button'
                                        onClick={() => removeCountdown(countdown.id)}
                                        className='p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 cursor-pointer transition-colors'
                                        title={page.remove}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Digital Display Cards */}
                            {time.expired ? (
                                <div className='text-center py-6 bg-red-100/50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800'>
                                    <div className='text-4xl mb-2 animate-bounce'>🎉</div>
                                    <div className='text-3xl font-black text-red-600 dark:text-red-400 animate-pulse'>
                                        {page.expired}
                                    </div>
                                </div>
                            ) : (
                                <div className='grid grid-cols-3 gap-3 max-w-lg mx-auto'>
                                    <div className='bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl p-3 text-center shadow-md'>
                                        <div className='text-3xl sm:text-4xl font-bold font-mono'>
                                            {String(time.hours).padStart(2, "0")}
                                        </div>
                                        <div className='text-[10px] uppercase tracking-wider font-semibold opacity-80'>
                                            {page.hours}
                                        </div>
                                    </div>
                                    <div className='bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-3 text-center shadow-md'>
                                        <div className='text-3xl sm:text-4xl font-bold font-mono'>
                                            {String(time.minutes).padStart(2, "0")}
                                        </div>
                                        <div className='text-[10px] uppercase tracking-wider font-semibold opacity-80'>
                                            {page.minutes}
                                        </div>
                                    </div>
                                    <div
                                        className={`bg-gradient-to-br text-white rounded-xl p-3 text-center shadow-md ${
                                            isNearEnd ? "from-red-600 to-rose-700 animate-pulse" : "from-purple-600 to-pink-600"
                                        }`}
                                    >
                                        <div className='text-3xl sm:text-4xl font-bold font-mono'>
                                            {String(time.seconds).padStart(2, "0")}
                                        </div>
                                        <div className='text-[10px] uppercase tracking-wider font-semibold opacity-80'>
                                            {page.seconds}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {countdowns.length === 0 && (
                <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                    <div className='text-4xl mb-3'>⏱️</div>
                    <p className='text-gray-500 dark:text-gray-400 text-base font-medium'>
                        {page.noCountdowns}
                    </p>
                </div>
            )}
        </div>
    );
}
