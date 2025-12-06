"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

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
    const t = getTranslation(locale);
    const page = t.tools.countdown.page;

    const [countdowns, setCountdowns] = useState<CountdownItem[]>([]);
    const [newCountdownName, setNewCountdownName] = useState("");
    const [newCountdownSeconds, setNewCountdownSeconds] = useState<number>(60);
    const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: { hours: number; minutes: number; seconds: number; expired: boolean } }>({});
    const prevExpiredRef = useRef<{ [key: string]: boolean }>({});

    // Function to play alarm sound using Web Audio API
    const playAlarmSound = useCallback(() => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Create a more pleasant alarm sound with multiple beeps
            const playBeep = (frequency: number, startTime: number, duration: number) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = "sine";

                gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);

                oscillator.start(audioContext.currentTime + startTime);
                oscillator.stop(audioContext.currentTime + startTime + duration);
            };

            // Play three beeps with increasing frequency
            playBeep(800, 0, 0.15);
            playBeep(1000, 0.2, 0.15);
            playBeep(1200, 0.4, 0.3);
        } catch (error) {
            console.log("Audio not supported");
        }
    }, []);

    useEffect(() => {
        const savedCountdowns = localStorage.getItem("countdowns");
        if (savedCountdowns) {
            const parsed = JSON.parse(savedCountdowns);
            const now = Date.now();

            // Filter out expired countdowns on load
            const activeCountdowns = parsed.filter((countdown: CountdownItem) => {
                if (countdown.isPaused) {
                    // Keep paused countdowns if they have remaining time
                    return (countdown.remainingSeconds || 0) > 0;
                } else {
                    // Check if countdown is still running
                    const elapsed = Math.floor((now - countdown.startTime) / 1000);
                    const remaining = countdown.seconds - elapsed;
                    return remaining > 0;
                }
            });

            setCountdowns(activeCountdowns);

            // Update localStorage with filtered countdowns
            if (activeCountdowns.length > 0) {
                localStorage.setItem("countdowns", JSON.stringify(activeCountdowns));
            } else {
                localStorage.removeItem("countdowns");
            }
        }
    }, []);

    useEffect(() => {
        if (countdowns.length > 0) {
            localStorage.setItem("countdowns", JSON.stringify(countdowns));
        } else {
            localStorage.removeItem("countdowns");
        }
    }, [countdowns]);

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const times: { [key: string]: { hours: number; minutes: number; seconds: number; expired: boolean } } = {};
            const now = Date.now();

            countdowns.forEach((countdown) => {
                let remaining: number;

                if (countdown.isPaused) {
                    // Use stored remaining seconds when paused
                    remaining = countdown.remainingSeconds || 0;
                } else {
                    // Calculate remaining time when running
                    const elapsed = Math.floor((now - countdown.startTime) / 1000);
                    remaining = countdown.seconds - elapsed;
                }

                if (remaining <= 0) {
                    times[countdown.id] = { hours: 0, minutes: 0, seconds: 0, expired: true };
                    // Play sound when countdown just expired
                    if (!prevExpiredRef.current[countdown.id]) {
                        playAlarmSound();
                    }
                    prevExpiredRef.current[countdown.id] = true;
                } else {
                    times[countdown.id] = {
                        hours: Math.floor(remaining / 3600),
                        minutes: Math.floor((remaining % 3600) / 60),
                        seconds: remaining % 60,
                        expired: false,
                    };
                }
            });
            setTimeRemaining(times);
        };

        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);
        return () => clearInterval(interval);
    }, [countdowns, playAlarmSound]);

    const addCountdown = useCallback(() => {
        if (!newCountdownName || !newCountdownSeconds || newCountdownSeconds <= 0) {
            alert(page.errors.fillFields);
            return;
        }

        const newCountdown: CountdownItem = {
            id: Date.now().toString(),
            name: newCountdownName,
            seconds: newCountdownSeconds,
            startTime: Date.now(),
        };

        setCountdowns((prev) => [...prev, newCountdown]);
        setNewCountdownName("");
    }, [newCountdownName, newCountdownSeconds, page.errors.fillFields]);

    const removeCountdown = useCallback((id: string) => {
        setCountdowns((prev) => prev.filter((c) => c.id !== id));
    }, []);

    const togglePause = useCallback((id: string) => {
        setCountdowns((prev) =>
            prev.map((countdown) => {
                if (countdown.id === id) {
                    if (countdown.isPaused) {
                        // Resume: set new startTime based on remaining seconds
                        return {
                            ...countdown,
                            isPaused: false,
                            startTime: Date.now(),
                            seconds: countdown.remainingSeconds || countdown.seconds,
                        };
                    } else {
                        // Pause: store current remaining seconds
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

    const addQuickCountdown = useCallback((name: string, seconds: number) => {
        const newCountdown: CountdownItem = {
            id: Date.now().toString() + Math.random(),
            name,
            seconds,
            startTime: Date.now(),
        };
        setCountdowns((prev) => [...prev, newCountdown]);
    }, []);

    // Quick countdown options - memoized
    const quickCountdowns = useMemo(() => {
        return locale === "vi"
            ? [
                  { name: "⚡ 10 giây", seconds: 10 },
                  { name: "⏱️ 30 giây", seconds: 30 },
                  { name: "🕐 1 phút", seconds: 60 },
                  { name: "🕑 2 phút", seconds: 120 },
                  { name: "🕔 5 phút", seconds: 300 },
                  { name: "🕙 10 phút", seconds: 600 },
                  { name: "🕛 15 phút", seconds: 900 },
                  { name: "🕐 30 phút", seconds: 1800 },
                  { name: "⏰ 1 giờ", seconds: 3600 },
              ]
            : [
                  { name: "⚡ 10 seconds", seconds: 10 },
                  { name: "⏱️ 30 seconds", seconds: 30 },
                  { name: "🕐 1 minute", seconds: 60 },
                  { name: "🕑 2 minutes", seconds: 120 },
                  { name: "🕔 5 minutes", seconds: 300 },
                  { name: "🕙 10 minutes", seconds: 600 },
                  { name: "🕛 15 minutes", seconds: 900 },
                  { name: "🕐 30 minutes", seconds: 1800 },
                  { name: "⏰ 1 hour", seconds: 3600 },
              ];
    }, [locale]);

    return (
        <div className='space-y-4 max-w-6xl mx-auto'>

            {/* Quick Countdowns */}
            <div className='bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-lg p-6 mb-6 border border-blue-200 dark:border-blue-800'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                    <span>⚡</span>
                    {locale === "vi" ? "Tùy chọn nhanh" : "Quick Options"}
                </h2>
                <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3'>
                    {quickCountdowns.map((item, index) => (
                        <button key={index} onClick={() => addQuickCountdown(item.name, item.seconds)} className='px-4 py-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 border-2 border-blue-200 dark:border-blue-700 rounded-lg transition-all hover:scale-105 hover:shadow-md text-sm font-medium text-gray-700 dark:text-gray-300 text-center'>
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add Countdown */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>{page.createNew}</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                    <input type='text' value={newCountdownName} onChange={(e) => setNewCountdownName(e.target.value)} placeholder={page.eventName} className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white' />
                    <div className='flex gap-2'>
                        <input type='number' value={newCountdownSeconds} onChange={(e) => setNewCountdownSeconds(parseInt(e.target.value) || 0)} placeholder={page.secondsPlaceholder} min='1' className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white' />
                        <span className='flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium'>{page.secondsLabel}</span>
                    </div>
                </div>
                <button onClick={addCountdown} className='w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors'>
                    {page.addButton}
                </button>
            </div>

            {/* Countdown Display */}
            <div className='grid grid-cols-1 gap-6'>
                {countdowns.map((countdown) => {
                    const time = timeRemaining[countdown.id];
                    if (!time) return null;

                    return (
                        <div key={countdown.id} className={`bg-linear-to-br ${time.expired ? "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-300 dark:border-red-700" : "from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"} rounded-xl shadow-xl p-8 relative transition-all duration-300 hover:shadow-2xl`}>
                            <div className='absolute top-4 right-4 flex gap-2'>
                                {!time.expired && (
                                    <button onClick={() => togglePause(countdown.id)} className='p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40 text-blue-600 dark:text-blue-400 transition-colors' title={countdown.isPaused ? (locale === "vi" ? "Tiếp tục" : "Resume") : locale === "vi" ? "Tạm dừng" : "Pause"}>
                                        {countdown.isPaused ? (
                                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                                <path d='M8 5v14l11-7z' />
                                            </svg>
                                        ) : (
                                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                                <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' />
                                            </svg>
                                        )}
                                    </button>
                                )}
                                <button onClick={() => removeCountdown(countdown.id)} className='p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-600 dark:text-red-400 transition-colors' title={page.remove}>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                </button>
                            </div>

                            <div className='pr-24'>
                                <h3 className='text-3xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-3'>
                                    {countdown.name}
                                    {countdown.isPaused && <span className='text-sm px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full font-medium'>{locale === "vi" ? "Đã tạm dừng" : "Paused"}</span>}
                                </h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mb-6 flex items-center gap-2'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                    {locale === "vi" ? `Tổng thời gian: ${countdown.seconds} giây` : `Total time: ${countdown.seconds} seconds`}
                                </p>
                            </div>

                            {time.expired ? (
                                <div className='text-center py-8'>
                                    <div className='text-5xl mb-4 animate-bounce'>🎉</div>
                                    <div className='text-4xl font-bold text-red-600 dark:text-red-400 animate-pulse'>{page.expired}</div>
                                </div>
                            ) : (
                                <div className='grid grid-cols-3 gap-4'>
                                    <div className='bg-linear-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl p-4 text-white text-center shadow-lg transform hover:scale-105 transition-transform'>
                                        <div className='text-5xl font-bold mb-2'>{String(time.hours).padStart(2, "0")}</div>
                                        <div className='text-sm font-medium uppercase tracking-wider opacity-90'>{page.hours}</div>
                                    </div>
                                    <div className='bg-linear-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 rounded-xl p-4 text-white text-center shadow-lg transform hover:scale-105 transition-transform'>
                                        <div className='text-5xl font-bold mb-2'>{String(time.minutes).padStart(2, "0")}</div>
                                        <div className='text-sm font-medium uppercase tracking-wider opacity-90'>{page.minutes}</div>
                                    </div>
                                    <div className='bg-linear-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-xl p-4 text-white text-center shadow-lg transform hover:scale-105 transition-transform'>
                                        <div className='text-5xl font-bold mb-2'>{String(time.seconds).padStart(2, "0")}</div>
                                        <div className='text-sm font-medium uppercase tracking-wider opacity-90'>{page.seconds}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {countdowns.length === 0 && (
                <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg'>
                    <p className='text-gray-500 dark:text-gray-400 text-lg'>{page.noCountdowns}</p>
                </div>
            )}
        </div>
    );
}
