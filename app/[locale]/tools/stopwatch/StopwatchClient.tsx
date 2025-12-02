"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { useState, useEffect, useRef } from "react";

type LapTime = {
    id: number;
    time: number;
    displayTime: string;
};

export default function StopwatchClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.tools.stopwatch.page;

    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<LapTime[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const formatTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);

        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
    };

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    };

    const handleLap = () => {
        if (time > 0) {
            const newLap: LapTime = {
                id: laps.length + 1,
                time: time,
                displayTime: formatTime(time),
            };
            setLaps([newLap, ...laps]);
        }
    };

    return (
        <div className='space-y-4'>

            {/* Stopwatch Display */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6'>
                <div className='text-center mb-8'>
                    <div className='text-7xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-6'>{formatTime(time)}</div>

                    <div className='flex justify-center gap-4'>
                        <button onClick={handleStartPause} className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${isRunning ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}`}>
                            {isRunning ? page.pause : page.start}
                        </button>

                        <button onClick={handleLap} disabled={!isRunning} className='px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors'>
                            {page.lap}
                        </button>

                        <button onClick={handleReset} className='px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors'>
                            {page.reset}
                        </button>
                    </div>
                </div>

                {/* Lap Times */}
                {laps.length > 0 && (
                    <div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>{page.lapTimes}</h3>
                        <div className='max-h-64 overflow-y-auto'>
                            <table className='w-full'>
                                <thead className='bg-gray-50 dark:bg-gray-700 sticky top-0'>
                                    <tr>
                                        <th className='px-4 py-2 text-left text-gray-900 dark:text-white'>{page.lapNumber}</th>
                                        <th className='px-4 py-2 text-right text-gray-900 dark:text-white'>{page.time}</th>
                                        <th className='px-4 py-2 text-right text-gray-900 dark:text-white'>{page.difference}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {laps.map((lap, index) => {
                                        const prevLapTime = index < laps.length - 1 ? laps[index + 1].time : 0;
                                        const diff = lap.time - prevLapTime;

                                        return (
                                            <tr key={lap.id} className='border-b border-gray-200 dark:border-gray-700'>
                                                <td className='px-4 py-2 text-gray-900 dark:text-white'>
                                                    {page.lap} {lap.id}
                                                </td>
                                                <td className='px-4 py-2 text-right font-mono text-gray-900 dark:text-white'>{lap.displayTime}</td>
                                                <td className='px-4 py-2 text-right font-mono text-gray-600 dark:text-gray-400'>+{formatTime(diff)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
