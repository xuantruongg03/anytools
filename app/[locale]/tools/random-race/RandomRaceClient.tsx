"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";

const ANIMALS = [
    { emoji: "🐎", name: "Horse", nameVi: "Ngựa" },
    { emoji: "🐇", name: "Rabbit", nameVi: "Thỏ" },
    { emoji: "🦘", name: "Kangaroo", nameVi: "Kangaroo" },
    { emoji: "🐆", name: "Leopard", nameVi: "Báo" },
    { emoji: "🐕", name: "Dog", nameVi: "Chó" },
    { emoji: "🐈", name: "Cat", nameVi: "Mèo" },
    { emoji: "🦊", name: "Fox", nameVi: "Cáo" },
    { emoji: "🐿️", name: "Squirrel", nameVi: "Sóc" },
    { emoji: "🦁", name: "Lion", nameVi: "Sư tử" },
    { emoji: "🐅", name: "Tiger", nameVi: "Hổ" },
    { emoji: "🐻", name: "Bear", nameVi: "Gấu" },
    { emoji: "🐺", name: "Wolf", nameVi: "Sói" },
    { emoji: "🦝", name: "Raccoon", nameVi: "Gấu trúc" },
    { emoji: "🦌", name: "Deer", nameVi: "Hươu" },
    { emoji: "🐐", name: "Goat", nameVi: "Dê" },
    { emoji: "🐖", name: "Pig", nameVi: "Lợn" },
    { emoji: "🦓", name: "Zebra", nameVi: "Ngựa vằn" },
    { emoji: "🦒", name: "Giraffe", nameVi: "Hươu cao cổ" },
    { emoji: "🦏", name: "Rhino", nameVi: "Tê giác" },
    { emoji: "🦛", name: "Hippo", nameVi: "Hà mã" },
];

type Racer = {
    emoji: string;
    customName: string;
    animalName: string;
};

export default function RandomRaceClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.randomRace;
    const [racers, setRacers] = useState<Racer[]>([]);
    const [racing, setRacing] = useState(false);
    const [positions, setPositions] = useState<number[]>([]);
    const [winner, setWinner] = useState<number | null>(null);
    const [showBulkInput, setShowBulkInput] = useState(false);
    const [bulkNames, setBulkNames] = useState("");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Calculate dynamic sizes based on number of racers
    const trackHeight = useMemo(() => {
        if (racers.length <= 3) return "h-12";
        if (racers.length <= 5) return "h-10";
        if (racers.length <= 8) return "h-8";
        if (racers.length <= 12) return "h-6";
        if (racers.length <= 16) return "h-5";
        return "h-4";
    }, [racers.length]);

    const emojiSize = useMemo(() => {
        if (racers.length <= 3) return "text-2xl";
        if (racers.length <= 5) return "text-xl";
        if (racers.length <= 8) return "text-lg";
        if (racers.length <= 12) return "text-base";
        return "text-sm";
    }, [racers.length]);

    const spacing = useMemo(() => {
        if (racers.length <= 3) return "space-y-3";
        if (racers.length <= 5) return "space-y-2.5";
        if (racers.length <= 8) return "space-y-2";
        if (racers.length <= 12) return "space-y-1.5";
        if (racers.length <= 16) return "space-y-1";
        return "space-y-0.5";
    }, [racers.length]);

    // Initialize with 4 racers
    useEffect(() => {
        if (racers.length === 0) {
            addRacers(4);
        }
    }, []);

    const getRandomAnimal = useCallback(() => {
        return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    }, []);

    const addRacers = useCallback(
        (count: number) => {
            const newRacers: Racer[] = [];
            for (let i = 0; i < count; i++) {
                const animal = getRandomAnimal();
                newRacers.push({
                    emoji: animal.emoji,
                    customName: `${locale === "vi" ? "Người chơi" : "Player"} ${racers.length + i + 1}`,
                    animalName: locale === "vi" ? animal.nameVi : animal.name,
                });
            }
            setRacers((prev) => [...prev, ...newRacers]);
        },
        [racers.length, locale, getRandomAnimal]
    );

    const addBulkRacers = useCallback(() => {
        if (!bulkNames.trim()) return;
        const names = bulkNames
            .split("\n")
            .map((n) => n.trim())
            .filter((n) => n.length > 0);
        if (names.length === 0) return;

        const newRacers: Racer[] = names.map((name) => {
            const animal = getRandomAnimal();
            return {
                emoji: animal.emoji,
                customName: name,
                animalName: locale === "vi" ? animal.nameVi : animal.name,
            };
        });
        setRacers((prev) => [...prev, ...newRacers]);
        setBulkNames("");
        setShowBulkInput(false);
    }, [bulkNames, locale, getRandomAnimal]);

    const removeRacer = useCallback(
        (index: number) => {
            if (racing) return;
            setRacers((prev) => prev.filter((_, i) => i !== index));
            setWinner(null);
        },
        [racing]
    );

    const updateRacerName = useCallback((index: number, newName: string) => {
        setRacers((prev) => prev.map((r, i) => (i === index ? { ...r, customName: newName } : r)));
    }, []);

    const resetRace = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setPositions(Array(racers.length).fill(0));
        setWinner(null);
        setRacing(false);
    }, [racers.length]);

    const startRace = useCallback(() => {
        if (racing || racers.length < 2) return;

        setRacing(true);
        setWinner(null);
        setPositions(Array(racers.length).fill(0));

        const startTime = Date.now();
        const raceDuration = 30000; // 30 seconds
        const updateInterval = 100; // Update every 100ms

        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / raceDuration;

            setPositions((prev) => {
                const newPositions = prev.map((pos) => {
                    if (pos >= 100) return 100;
                    // Slower speed increment (0.2-1.5% per 100ms for 30s race)
                    const speedVariation = 0.2 + Math.random() * 1.3;
                    return Math.min(100, pos + speedVariation);
                });

                // Check if any racer finished
                const finishedIndex = newPositions.findIndex((pos) => pos >= 100);
                if (finishedIndex !== -1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    setRacing(false);
                    setWinner(finishedIndex);
                    newPositions[finishedIndex] = 100;
                }

                return newPositions;
            });
        }, updateInterval);
    }, [racing, racers.length]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6'>
            {/* Layout 2 cột: Controls bên trái, Race track bên phải */}
            <div className='grid lg:grid-cols-[350px,1fr] gap-4 md:gap-6'>
                {/* Left Column - Controls & Racer List */}
                <div className='space-y-4'>
                    {/* Title */}
                    <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100 border-b pb-2'>{locale === "vi" ? "⚙️ Điều khiển" : "⚙️ Controls"}</h3>

                    {/* Action Buttons */}
                    {!racing && (
                        <div className='space-y-2'>
                            <div className='flex gap-2'>
                                <button onClick={() => addRacers(1)} disabled={racers.length >= 20} className='flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors font-medium'>
                                    + 1 {locale === "vi" ? "Người chơi" : "Racer"}
                                </button>
                                <button onClick={() => setShowBulkInput(!showBulkInput)} className='flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors font-medium'>
                                    {showBulkInput ? "✕" : "📝"} {locale === "vi" ? "Nhập nhiều" : "Bulk Input"}
                                </button>
                                {racers.length > 0 && (
                                    <button onClick={() => setRacers([])} className='flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer transition-colors font-medium'>
                                        🗑️ {locale === "vi" ? "Xóa tất cả" : "Clear All"}
                                    </button>
                                )}
                            </div>

                            {showBulkInput && (
                                <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2'>
                                    <textarea value={bulkNames} onChange={(e) => setBulkNames(e.target.value)} placeholder={locale === "vi" ? "Nhập tên (mỗi dòng)..." : "Names (one per line)..."} rows={4} className='w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none' />
                                    <button onClick={addBulkRacers} disabled={!bulkNames.trim()} className='w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors font-medium'>
                                        ✓ {locale === "vi" ? "Thêm" : "Add"}
                                    </button>
                                </div>
                            )}

                            <button onClick={startRace} disabled={racers.length < 2} className='w-full px-4 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all shadow-lg'>
                                🏁 {t.start} {racers.length >= 2 ? `(${racers.length})` : ""}
                            </button>
                            {racers.length < 2 && <p className='text-xs text-center text-gray-500 dark:text-gray-400'>{locale === "vi" ? "Cần ít nhất 2 người" : "Need at least 2"}</p>}
                        </div>
                    )}

                    {/* Reset Button when racing or finished */}
                    {(racing || winner !== null) && (
                        <button onClick={resetRace} className='w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer transition-colors shadow-lg'>
                            🔄 {t.reset}
                        </button>
                    )}
                </div>

                {/* Right Column - Race Track */}
                <div className='space-y-3'>
                    {/* Title & Status */}
                    <div className='flex items-center justify-between border-b pb-2'>
                        <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100'>{locale === "vi" ? "🏁 Đường đua" : "🏁 Race Track"}</h3>
                        {racing && <span className='text-sm font-bold text-green-600 dark:text-green-400 animate-pulse'>⚡ {t.racing}</span>}
                    </div>

                    {/* Winner Banner */}
                    {winner !== null && racers[winner] && (
                        <div className='p-4 bg-linear-to-r from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900 rounded-lg border-2 border-yellow-400 text-center shadow-lg animate-pulse'>
                            <p className='text-xl font-bold text-yellow-800 dark:text-yellow-200'>
                                🏆 {racers[winner].emoji} {racers[winner].customName} {t.wins}!
                            </p>
                        </div>
                    )}

                    {/* Race Tracks - More compact */}
                    {racers.length > 0 ? (
                        <div className={spacing}>
                            {racers.map((racer, index) => (
                                <div key={index} className='group'>
                                    <div className='flex items-center gap-2 mb-0.5'>
                                        <span className={emojiSize}>{racer.emoji}</span>
                                        {!racing ? (
                                            <input type='text' value={racer.customName} onChange={(e) => updateRacerName(index, e.target.value)} className={`${racers.length > 8 ? "text-[10px]" : "text-xs"} font-semibold text-gray-700 dark:text-gray-300 flex-1 bg-transparent border-none focus:outline-none focus:ring-0 p-0 cursor-text hover:bg-white/50 dark:hover:bg-gray-600/50 rounded px-1 transition-colors`} />
                                        ) : (
                                            <span className={`${racers.length > 8 ? "text-[10px]" : "text-xs"} font-semibold text-gray-700 dark:text-gray-300 truncate flex-1`}>{racer.customName}</span>
                                        )}
                                        {winner === index && <span className={`px-1.5 py-0.5 bg-yellow-400 text-yellow-900 ${racers.length > 12 ? "text-[8px]" : racers.length > 8 ? "text-[9px]" : "text-[10px]"} font-bold rounded`}>🏆</span>}
                                        {!racing && (
                                            <button onClick={() => removeRacer(index)} className='px-1.5 py-0.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded opacity-0 group-hover:opacity-100 cursor-pointer transition-all'>
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    <div className={`relative ${trackHeight} bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-inner`}>
                                        {/* Track lines */}
                                        <div className='absolute inset-0 flex'>
                                            {[...Array(10)].map((_, i) => (
                                                <div key={i} className='flex-1 border-r border-gray-300 dark:border-gray-600 last:border-r-0' />
                                            ))}
                                        </div>
                                        {/* Progress Bar */}
                                        <div
                                            className='absolute top-0 left-0 h-full flex items-center justify-end pr-1'
                                            style={{
                                                width: `${Math.max(4, positions[index] || 0)}%`,
                                                background: winner === index ? "linear-gradient(90deg, #fbbf24, #f59e0b)" : positions[index] > 0 ? "linear-gradient(90deg, #3b82f6, #2563eb)" : "transparent",
                                                transition: "width 0.1s linear",
                                                boxShadow: positions[index] > 0 ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none",
                                            }}
                                        >
                                            {(positions[index] || 0) > 4 && <span className={`${racers.length > 12 ? "text-sm" : racers.length > 8 ? "text-base" : racers.length > 6 ? "text-lg" : "text-xl"} drop-shadow-lg`}>{racer.emoji}</span>}
                                        </div>
                                        {/* Finish line */}
                                        <div className='absolute right-0 top-0 h-full w-1 bg-red-500 shadow-lg' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='h-64 flex items-center justify-center text-gray-400 dark:text-gray-500'>
                            <div className='text-center'>
                                <p className='text-4xl mb-2'>🏁</p>
                                <p className='text-sm'>{locale === "vi" ? "Thêm người đua để bắt đầu" : "Add racers to start"}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
