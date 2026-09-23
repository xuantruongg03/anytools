"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { pomodoroTimerTranslations } from "@/lib/i18n/tools/pomodoro-timer";

interface TaskItem {
    id: string;
    text: string;
    completed: boolean;
}

// Chime alert sound via Web Audio API
function playChime() {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            gain.gain.setValueAtTime(0.2, now + i * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.8);
        });
    } catch (e) {}
}

export default function PomodoroTimerContent() {
    const { locale } = useLanguage();
    const t = pomodoroTimerTranslations[locale as "en" | "vi"] || pomodoroTimerTranslations.en;

    // Durations in minutes
    const [workDuration, setWorkDuration] = useState<number>(25);
    const [shortBreakDuration, setShortBreakDuration] = useState<number>(5);
    const [longBreakDuration, setLongBreakDuration] = useState<number>(15);

    // Current timer state
    const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work");
    const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [completedSessions, setCompletedSessions] = useState<number>(0);

    // Ambient Sound
    const [ambientType, setAmbientType] = useState<"none" | "rain" | "waves" | "wind">("none");
    const [volume, setVolume] = useState<number>(0.5);
    const audioContextRef = useRef<AudioContext | null>(null);
    const ambientGainRef = useRef<GainNode | null>(null);
    const noiseNodeRef = useRef<AudioNode | null>(null);

    // Tasks
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [newTaskText, setNewTaskText] = useState<string>("");

    // Load tasks from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("anytools_pomodoro_tasks");
            if (saved) setTasks(JSON.parse(saved));
        } catch (e) {}
    }, []);

    // Save tasks to localStorage
    const saveTasks = (newTasks: TaskItem[]) => {
        setTasks(newTasks);
        try {
            localStorage.setItem("anytools_pomodoro_tasks", JSON.stringify(newTasks));
        } catch (e) {}
    };

    // Calculate total duration of current mode
    const currentTotalSec = useMemo(() => {
        switch (mode) {
            case "work": return workDuration * 60;
            case "shortBreak": return shortBreakDuration * 60;
            case "longBreak": return longBreakDuration * 60;
        }
    }, [mode, workDuration, shortBreakDuration, longBreakDuration]);

    // Switch mode
    const switchMode = useCallback((newMode: "work" | "shortBreak" | "longBreak") => {
        setMode(newMode);
        setIsRunning(false);
        switch (newMode) {
            case "work": setTimeLeft(workDuration * 60); break;
            case "shortBreak": setTimeLeft(shortBreakDuration * 60); break;
            case "longBreak": setTimeLeft(longBreakDuration * 60); break;
        }
    }, [workDuration, shortBreakDuration, longBreakDuration]);

    // Timer tick interval
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        playChime();
                        if (mode === "work") {
                            const nextCount = completedSessions + 1;
                            setCompletedSessions(nextCount);
                            if (nextCount % 4 === 0) {
                                switchMode("longBreak");
                            } else {
                                switchMode("shortBreak");
                            }
                        } else {
                            switchMode("work");
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, mode, completedSessions, switchMode]);

    // Ambient Sound Generator via Web Audio API
    const stopAmbient = useCallback(() => {
        if (noiseNodeRef.current) {
            try {
                (noiseNodeRef.current as any).stop?.();
                noiseNodeRef.current.disconnect();
            } catch (e) {}
            noiseNodeRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => {});
            audioContextRef.current = null;
        }
    }, []);

    const startAmbient = useCallback((type: "rain" | "waves" | "wind") => {
        stopAmbient();

        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = ctx;

            // Generate 5s pink/brown noise buffer
            const bufferSize = ctx.sampleRate * 5;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0;

            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                data[i] = (b0 + b1 + b2) * 0.25;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const filter = ctx.createBiquadFilter();
            if (type === "rain") {
                filter.type = "lowpass";
                filter.frequency.setValueAtTime(800, ctx.currentTime);
            } else if (type === "waves") {
                filter.type = "bandpass";
                filter.frequency.setValueAtTime(400, ctx.currentTime);
                filter.Q.setValueAtTime(1.5, ctx.currentTime);

                // Modulate wave surge
                const lfo = ctx.createOscillator();
                const lfoGain = ctx.createGain();
                lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
                lfoGain.gain.setValueAtTime(250, ctx.currentTime);
                lfo.connect(lfoGain);
                lfoGain.connect(filter.frequency);
                lfo.start();
            } else {
                filter.type = "lowpass";
                filter.frequency.setValueAtTime(500, ctx.currentTime);
            }

            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
            ambientGainRef.current = masterGain;

            noise.connect(filter);
            filter.connect(masterGain);
            masterGain.connect(ctx.destination);

            noise.start();
            noiseNodeRef.current = noise;
        } catch (e) {
            console.error("Ambient audio error:", e);
        }
    }, [volume, stopAmbient]);

    useEffect(() => {
        if (ambientType === "none") {
            stopAmbient();
        } else {
            startAmbient(ambientType);
        }
        return () => {
            stopAmbient();
        };
    }, [ambientType, startAmbient, stopAmbient]);

    // Update volume
    useEffect(() => {
        if (ambientGainRef.current && audioContextRef.current) {
            ambientGainRef.current.gain.setValueAtTime(volume * 0.4, audioContextRef.current.currentTime);
        }
    }, [volume]);

    // Format MM:SS
    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // SVG Circular progress
    const radius = 110;
    const circumference = 2 * Math.PI * radius;
    const progressPercent = currentTotalSec > 0 ? (currentTotalSec - timeLeft) / currentTotalSec : 0;
    const strokeDashoffset = circumference - progressPercent * circumference;

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        const item: TaskItem = {
            id: Date.now().toString(),
            text: newTaskText.trim(),
            completed: false,
        };
        saveTasks([...tasks, item]);
        setNewTaskText("");
    };

    const toggleTask = (id: string) => {
        const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
        saveTasks(updated);
    };

    const deleteTask = (id: string) => {
        const updated = tasks.filter((t) => t.id !== id);
        saveTasks(updated);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-6'>
            {/* Mode Selector Tabs */}
            <div className='flex items-center p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full'>
                <button
                    onClick={() => switchMode("work")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        mode === "work"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    💼 {t.modeWork}
                </button>
                <button
                    onClick={() => switchMode("shortBreak")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        mode === "shortBreak"
                            ? "bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    ☕ {t.modeShortBreak}
                </button>
                <button
                    onClick={() => switchMode("longBreak")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        mode === "longBreak"
                            ? "bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    🌴 {t.modeLongBreak}
                </button>
            </div>

            {/* Circular Timer Display Card */}
            <div className='w-full bg-white dark:bg-gray-900 p-8 sm:p-12 rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center relative select-none'>
                {/* SVG Progress Circle */}
                <div className='relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center'>
                    <svg className='w-full h-full -rotate-90 transform' viewBox='0 0 260 260'>
                        {/* Background track */}
                        <circle
                            cx='130'
                            cy='130'
                            r={radius}
                            className='stroke-gray-100 dark:stroke-gray-800'
                            strokeWidth='12'
                            fill='transparent'
                        />
                        {/* Progress stroke */}
                        <circle
                            cx='130'
                            cy='130'
                            r={radius}
                            className={`transition-all duration-300 ${
                                mode === "work"
                                    ? "stroke-blue-600 dark:stroke-blue-500"
                                    : mode === "shortBreak"
                                    ? "stroke-emerald-500"
                                    : "stroke-purple-500"
                            }`}
                            strokeWidth='12'
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap='round'
                            fill='transparent'
                        />
                    </svg>

                    {/* Center Text */}
                    <div className='absolute flex flex-col items-center justify-center text-center'>
                        <span className='text-xs font-bold uppercase tracking-wider text-gray-400 mb-1'>
                            {mode === "work" ? "Focus Session" : "Break Time"}
                        </span>
                        <div className='text-6xl sm:text-7xl font-black font-mono tracking-tight text-gray-900 dark:text-white'>
                            {formatTime(timeLeft)}
                        </div>
                        <span className='text-xs font-semibold text-gray-400 mt-2'>
                            Cycle #{(completedSessions % 4) + 1} of 4
                        </span>
                    </div>
                </div>

                {/* Primary Action Controls */}
                <div className='flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-4 mt-8 w-full max-w-md'>
                    <Button
                        onClick={() => setIsRunning(!isRunning)}
                        variant='primary'
                        size='lg'
                        className={`flex-1 min-w-[125px] sm:min-w-[135px] h-12 flex items-center justify-center text-sm font-bold shadow-md rounded-2xl cursor-pointer transition-all ${
                            mode === "work"
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                                : mode === "shortBreak"
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25"
                                : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25"
                        }`}
                    >
                        {isRunning ? `⏸️ ${t.pause}` : `▶️ ${t.start}`}
                    </Button>

                    <Button
                        onClick={() => {
                            setIsRunning(false);
                            setTimeLeft(currentTotalSec);
                        }}
                        variant='secondary'
                        size='lg'
                        className='flex-1 min-w-[125px] sm:min-w-[135px] h-12 flex items-center justify-center text-sm font-bold rounded-2xl cursor-pointer transition-all border border-gray-200/80 dark:border-gray-700/80'
                    >
                        🔄 {t.reset}
                    </Button>

                    <Button
                        onClick={() => {
                            if (mode === "work") switchMode("shortBreak");
                            else switchMode("work");
                        }}
                        variant='secondary'
                        size='lg'
                        className='flex-1 min-w-[125px] sm:min-w-[135px] h-12 flex items-center justify-center text-sm font-bold rounded-2xl cursor-pointer transition-all border border-gray-200/80 dark:border-gray-700/80'
                    >
                        ⏭️ {t.skip}
                    </Button>
                </div>
            </div>

            {/* Ambient Sound Bar */}
            <div className='w-full bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-wrap items-center justify-between gap-4'>
                <div className='flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300'>
                    <span>🎧</span> {t.ambientSounds}:
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                    <button
                        onClick={() => setAmbientType("none")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            ambientType === "none"
                                ? "bg-gray-800 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                    >
                        {t.soundNone}
                    </button>
                    <button
                        onClick={() => setAmbientType("rain")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            ambientType === "rain"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                    >
                        🌧️ {t.soundRain}
                    </button>
                    <button
                        onClick={() => setAmbientType("waves")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            ambientType === "waves"
                                ? "bg-cyan-600 text-white shadow-sm"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                    >
                        🌊 {t.soundWaves}
                    </button>
                    <button
                        onClick={() => setAmbientType("wind")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            ambientType === "wind"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                    >
                        🌲 {t.soundWind}
                    </button>
                </div>

                {ambientType !== "none" && (
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-gray-400'>🔊</span>
                        <input
                            type='range'
                            min={0}
                            max={1}
                            step={0.05}
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className='w-20 accent-blue-600 cursor-pointer'
                        />
                    </div>
                )}
            </div>

            {/* Tasks & Todo Checklist Card */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                <div className='flex items-center justify-between'>
                    <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                        <span>🎯</span> {t.tasksTitle}
                    </h4>
                    <span className='text-xs font-mono text-gray-400'>
                        {tasks.filter((t) => t.completed).length} / {tasks.length} done
                    </span>
                </div>

                {/* Add Task Input */}
                <form onSubmit={handleAddTask} className='flex gap-2'>
                    <input
                        type='text'
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder={t.addTaskPlaceholder}
                        className='flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500'
                    />
                    <Button type='submit' variant='primary' size='sm' className='cursor-pointer text-xs font-bold'>
                        + {t.addTaskBtn}
                    </Button>
                </form>

                {/* Tasks List */}
                <div className='divide-y divide-gray-100 dark:divide-gray-800 text-xs sm:text-sm pt-2'>
                    {tasks.length === 0 ? (
                        <p className='text-xs text-gray-400 py-3 text-center'>{t.noTasks}</p>
                    ) : (
                        tasks.map((task) => (
                            <div key={task.id} className='py-2.5 flex items-center justify-between gap-3'>
                                <label className='flex items-center gap-2.5 cursor-pointer flex-1'>
                                    <input
                                        type='checkbox'
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                        className='rounded accent-blue-600 w-4 h-4'
                                    />
                                    <span className={task.completed ? "line-through text-gray-400" : "text-gray-800 dark:text-gray-200 font-medium"}>
                                        {task.text}
                                    </span>
                                </label>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className='text-gray-400 hover:text-red-500 text-xs cursor-pointer'
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* SEO & Guide */}
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
