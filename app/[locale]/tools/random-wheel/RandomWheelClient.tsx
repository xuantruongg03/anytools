"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { toast } from "@/components/ui/Toast";

const COLORS = [
    "#EF4444", // Red
    "#3B82F6", // Blue
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#14B8A6", // Teal
    "#6366F1", // Indigo
    "#84CC16", // Lime
    "#D946EF", // Fuchsia
];

export default function RandomWheelClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = getTranslation(locale).tools.randomWheel;

    const defaultStudents = useMemo(() => {
        return isVi
            ? ["Nguyễn An", "Trần Bình", "Lê Cường", "Phạm Dũng", "Hoàng Giang", "Vũ Hoa", "Đặng Hùng", "Bùi Linh", "Đỗ Mai", "Ngô Nam"]
            : ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry", "Ivy", "Jack"];
    }, [isVi]);

    const [options, setOptions] = useState<string[]>(defaultStudents);
    const [newOption, setNewOption] = useState("");
    const [bulkOptions, setBulkOptions] = useState("");
    const [showBulkInput, setShowBulkInput] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const confettiAnimRef = useRef<number | null>(null);
    const lastTickSectorRef = useRef<number>(-1);

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

    // Web Audio API Ticking Click Sound
    const playTickSound = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(550, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.035);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        } catch {
            // Audio ignore
        }
    }, [soundEnabled, getAudioContext]);

    // Celebration Fanfare Melody
    const playCelebrationSound = useCallback(() => {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "sine";
                const start = ctx.currentTime + idx * 0.1;
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0.25, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.45);
            });
        } catch {
            // Audio ignore
        }
    }, [soundEnabled, getAudioContext]);

    // Canvas Confetti Celebration
    const triggerConfetti = useCallback(() => {
        const canvas = confettiCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = canvas.parentElement?.clientWidth || 500;
        canvas.height = canvas.parentElement?.clientHeight || 500;

        const particles: {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            rotation: number;
            vRot: number;
        }[] = [];

        const colors = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#FBBF24"];
        for (let i = 0; i < 90; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.8) * 14,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10,
            });
        }

        let frame = 0;
        const render = () => {
            frame++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.25; // gravity
                p.rotation += p.vRot;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            });

            if (frame < 120) {
                confettiAnimRef.current = requestAnimationFrame(render);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };
        if (confettiAnimRef.current) cancelAnimationFrame(confettiAnimRef.current);
        confettiAnimRef.current = requestAnimationFrame(render);
    }, []);

    // Draw Wheel Canvas
    const drawWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const size = Math.min(canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = size / 2 - 18;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (options.length === 0) return;

        const sliceAngle = (2 * Math.PI) / options.length;

        // Outer Shadow Rim
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = "#1E293B";
        ctx.fill();
        ctx.restore();

        // Draw Slices
        options.forEach((option, index) => {
            const startAngle = index * sliceAngle - Math.PI / 2 + (rotation * Math.PI) / 180;
            const endAngle = (index + 1) * sliceAngle - Math.PI / 2 + (rotation * Math.PI) / 180;

            // Draw slice arc
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = COLORS[index % COLORS.length];
            ctx.fill();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Slice Text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#FFFFFF";
            ctx.font = `bold ${options.length > 20 ? 11 : options.length > 12 ? 13 : 15}px system-ui, sans-serif`;
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 4;
            // Truncate if long
            const textToDraw = option.length > 18 ? option.slice(0, 16) + "..." : option;
            ctx.fillText(textToDraw, radius - 24, 5);
            ctx.restore();
        });

        // Center Chrome Hub
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
        ctx.fillStyle = "#F8FAFC";
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#3B82F6";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
        ctx.fillStyle = "#3B82F6";
        ctx.fill();
        ctx.restore();

        // Indicator Needle Pointer (Right pointing left)
        ctx.save();
        ctx.beginPath();
        const pointerX = centerX + radius + 4;
        const pointerY = centerY;
        ctx.moveTo(pointerX - 16, pointerY); // Sharp tip into wheel
        ctx.lineTo(pointerX + 16, pointerY - 14);
        ctx.lineTo(pointerX + 16, pointerY + 14);
        ctx.closePath();
        ctx.fillStyle = "#EF4444";
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
        ctx.restore();
    }, [options, rotation]);

    // Redraw upon change
    useEffect(() => {
        drawWheel();
    }, [drawWheel]);

    // Spin Action
    const spinWheel = useCallback(() => {
        if (spinning || options.length < 2) return;

        setSpinning(true);
        setWinner(null);
        getAudioContext();

        const spins = 6 + Math.random() * 4;
        const extraDegrees = Math.random() * 360;
        const totalRotation = spins * 360 + extraDegrees;

        const duration = 4500;
        const startTime = performance.now();
        const startRotation = rotation;

        lastTickSectorRef.current = -1;

        const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth cubic ease-out
            const easeOut = 1 - Math.pow(1 - progress, 3.5);
            const currentRotation = startRotation + totalRotation * easeOut;
            const currentDegree = currentRotation % 360;

            setRotation(currentDegree);

            // Tick sound on sector line pass
            const sliceDeg = 360 / options.length;
            const currentSector = Math.floor(currentRotation / sliceDeg);
            if (currentSector !== lastTickSectorRef.current) {
                lastTickSectorRef.current = currentSector;
                playTickSound();
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setSpinning(false);
                const normalizedRotation = (360 - (currentDegree % 360)) % 360;
                const sliceAngle = 360 / options.length;
                const winnerIndex = Math.floor(normalizedRotation / sliceAngle);
                const winningName = options[winnerIndex];
                setWinner(winningName);
                playCelebrationSound();
                triggerConfetti();
            }
        };

        requestAnimationFrame(animate);
    }, [spinning, options, rotation, playTickSound, playCelebrationSound, triggerConfetti, getAudioContext]);

    // Add option
    const addOption = useCallback(() => {
        if (newOption.trim() && !spinning) {
            setOptions((prev) => [...prev, newOption.trim()]);
            setNewOption("");
        }
    }, [newOption, spinning]);

    // Add bulk options
    const addBulkOptions = useCallback(() => {
        if (bulkOptions.trim() && !spinning) {
            const newOpts = bulkOptions
                .split("\n")
                .map((opt) => opt.trim())
                .filter((opt) => opt.length > 0);
            if (newOpts.length > 0) {
                setOptions((prev) => [...prev, ...newOpts]);
                setBulkOptions("");
                setShowBulkInput(false);
                toast.success(isVi ? `Đã thêm ${newOpts.length} mục!` : `Added ${newOpts.length} options!`);
            }
        }
    }, [bulkOptions, spinning, isVi]);

    // Remove single option
    const removeOption = useCallback(
        (index: number) => {
            if (options.length > 2 && !spinning) {
                setOptions((prev) => prev.filter((_, i) => i !== index));
            }
        },
        [options.length, spinning]
    );

    // Remove Winner from list
    const handleRemoveWinner = useCallback(() => {
        if (!winner) return;
        setOptions((prev) => prev.filter((opt) => opt !== winner));
        toast.info(isVi ? `Đã loại bỏ: ${winner}` : `Removed winner: ${winner}`);
        setWinner(null);
    }, [winner, isVi]);

    // Quick Presets
    const applyPreset = useCallback(
        (presetType: "classroom" | "numbers" | "yesNo" | "food") => {
            if (spinning) return;
            let list: string[] = [];
            if (presetType === "classroom") {
                list = defaultStudents;
            } else if (presetType === "numbers") {
                list = Array.from({ length: 50 }, (_, i) => String(i + 1));
            } else if (presetType === "yesNo") {
                list = isVi ? ["Có (Yes)", "Không (No)", "Quay lại"] : ["Yes", "No", "Spin Again"];
            } else if (presetType === "food") {
                list = isVi
                    ? ["Phở Bò", "Bún Chả", "Cơm Tấm", "Bánh Mì", "Gà Rán", "Lẩu Thái", "Pizza", "Cơm Trưa Văn Phòng"]
                    : ["Pizza", "Burger", "Sandwich", "Salad", "Sushi", "Pasta", "Tacos", "Fried Chicken"];
            }
            setOptions(list);
            setWinner(null);
            toast.success(isVi ? "Đã áp dụng mẫu thành công!" : "Preset loaded successfully!");
        },
        [spinning, defaultStudents, isVi]
    );

    // Shuffle options
    const shuffleOptions = useCallback(() => {
        if (spinning) return;
        setOptions((prev) => [...prev].sort(() => Math.random() - 0.5));
        toast.info(isVi ? "Đã xáo trộn danh sách!" : "Shuffled list!");
    }, [spinning, isVi]);

    // Clear all
    const clearAll = useCallback(() => {
        if (spinning) return;
        setOptions([isVi ? "Tùy chọn 1" : "Option 1", isVi ? "Tùy chọn 2" : "Option 2"]);
        setWinner(null);
    }, [spinning, isVi]);

    // Toggle Fullscreen
    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(() => {});
            setIsFullscreen(true);
        } else {
            document.exitFullscreen().catch(() => {});
            setIsFullscreen(false);
        }
    }, []);

    useEffect(() => {
        const onFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", onFsChange);
        return () => document.removeEventListener("fullscreenchange", onFsChange);
    }, []);

    return (
        <div ref={containerRef} className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative transition-colors'>
            {/* Top Toolbar */}
            <div className='flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700'>
                <div className='flex items-center gap-2'>
                    <span className='text-2xl'>🎡</span>
                    <div>
                        <h2 className='text-lg font-bold text-gray-900 dark:text-gray-100'>
                            {t.name}
                        </h2>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {t.description} ({options.length} {isVi ? "mục" : "options"})
                        </p>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    {/* Audio Toggle */}
                    <button
                        type='button'
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                            soundEnabled
                                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 border-gray-200 dark:border-gray-600"
                        }`}
                        title={soundEnabled ? t.soundOff : t.soundOn}
                    >
                        <span>{soundEnabled ? "🔊" : "🔇"}</span>
                        <span>{soundEnabled ? t.soundOn : t.soundOff}</span>
                    </button>

                    {/* Fullscreen Button */}
                    <button
                        type='button'
                        onClick={toggleFullscreen}
                        className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer flex items-center gap-1.5 border border-gray-200 dark:border-gray-600'
                        title={isFullscreen ? t.exitFullscreen : t.fullscreen}
                    >
                        <span>{isFullscreen ? "🪟" : "⛶"}</span>
                        <span>{isFullscreen ? t.exitFullscreen : t.fullscreen}</span>
                    </button>
                </div>
            </div>

            {/* Quick Presets Bar */}
            <div className='mb-6 p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-2'>
                <span className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1'>
                    ⚡ {t.presetsTitle}:
                </span>
                <button
                    type='button'
                    onClick={() => applyPreset("classroom")}
                    disabled={spinning}
                    className='px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-gray-200 dark:border-gray-700 cursor-pointer disabled:opacity-50'
                >
                    🎓 {t.presets.classroom}
                </button>
                <button
                    type='button'
                    onClick={() => applyPreset("numbers")}
                    disabled={spinning}
                    className='px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-gray-200 dark:border-gray-700 cursor-pointer disabled:opacity-50'
                >
                    🔢 {t.presets.numbers}
                </button>
                <button
                    type='button'
                    onClick={() => applyPreset("yesNo")}
                    disabled={spinning}
                    className='px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-gray-200 dark:border-gray-700 cursor-pointer disabled:opacity-50'
                >
                    ⚖️ {t.presets.yesNo}
                </button>
                <button
                    type='button'
                    onClick={() => applyPreset("food")}
                    disabled={spinning}
                    className='px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-gray-200 dark:border-gray-700 cursor-pointer disabled:opacity-50'
                >
                    🍕 {t.presets.food}
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
                {/* Left Column: Wheel & Confetti Canvas (7 Cols) */}
                <div className='lg:col-span-7 flex flex-col items-center justify-center relative min-h-[440px]'>
                    {/* Confetti Overlay */}
                    <canvas
                        ref={confettiCanvasRef}
                        className='absolute inset-0 pointer-events-none z-10 w-full h-full'
                    />

                    {/* Wheel Canvas */}
                    <div className='relative p-2 flex items-center justify-center'>
                        <canvas
                            ref={canvasRef}
                            width={420}
                            height={420}
                            className='max-w-full drop-shadow-xl transition-transform'
                        />
                    </div>

                    {/* Big Spin Button */}
                    <div className='mt-6 w-full max-w-xs flex justify-center'>
                        <button
                            onClick={spinWheel}
                            disabled={spinning || options.length < 2}
                            className='w-full py-3.5 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 justify-center'
                        >
                            {spinning ? (
                                <>
                                    <svg className='animate-spin h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    <span>{t.spinning}</span>
                                </>
                            ) : (
                                <>
                                    <span>🎲</span>
                                    <span>{t.spin}</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Winner Celebration Banner */}
                    {winner && (
                        <div className='mt-5 w-full max-w-md p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-2 border-emerald-500 dark:border-emerald-400 rounded-2xl text-center space-y-3 shadow-md animate-bounce'>
                            <div>
                                <span className='text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300'>
                                    {t.winnerCongratulations}
                                </span>
                                <div className='text-2xl font-black text-gray-900 dark:text-white mt-1 break-all'>
                                    {winner}
                                </div>
                            </div>

                            <div className='flex items-center justify-center gap-2 pt-1'>
                                <button
                                    type='button'
                                    onClick={handleRemoveWinner}
                                    className='px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm'
                                >
                                    🗑️ {t.removeWinner}
                                </button>
                                <button
                                    type='button'
                                    onClick={spinWheel}
                                    disabled={spinning}
                                    className='px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm'
                                >
                                    🔄 {t.spinAgain}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Options & Controls (5 Cols) */}
                <div className='lg:col-span-5 bg-gray-50/70 dark:bg-gray-900/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4'>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                            <span>📋</span> {t.options} ({options.length})
                        </h3>
                        <div className='flex gap-1.5'>
                            <button
                                type='button'
                                onClick={shuffleOptions}
                                disabled={spinning}
                                className='p-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer'
                                title={t.shuffle}
                            >
                                🔀
                            </button>
                            <button
                                type='button'
                                onClick={() => setShowBulkInput(!showBulkInput)}
                                disabled={spinning}
                                className='px-2.5 py-1 text-xs font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 transition-colors cursor-pointer'
                            >
                                {showBulkInput ? t.singleAdd : t.bulkAdd}
                            </button>
                            <button
                                type='button'
                                onClick={clearAll}
                                disabled={spinning}
                                className='p-1.5 text-xs text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer'
                                title={t.clearAll}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>

                    {!showBulkInput ? (
                        <div className='flex gap-2'>
                            <input
                                type='text'
                                value={newOption}
                                onChange={(e) => setNewOption(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addOption()}
                                placeholder={t.addPlaceholder}
                                className='flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                disabled={spinning}
                            />
                            <button
                                onClick={addOption}
                                disabled={spinning || !newOption.trim()}
                                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl disabled:opacity-50 cursor-pointer transition-colors shrink-0'
                            >
                                {t.add}
                            </button>
                        </div>
                    ) : (
                        <div className='space-y-2'>
                            <textarea
                                value={bulkOptions}
                                onChange={(e) => setBulkOptions(e.target.value)}
                                placeholder={t.bulkPlaceholder}
                                rows={4}
                                className='w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none'
                                disabled={spinning}
                            />
                            <button
                                onClick={addBulkOptions}
                                disabled={spinning || !bulkOptions.trim()}
                                className='w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl disabled:opacity-50 cursor-pointer transition-colors shadow-sm'
                            >
                                ➕ {t.addAll}
                            </button>
                        </div>
                    )}

                    {/* Options List */}
                    <div className='space-y-1.5 max-h-[320px] overflow-y-auto pr-1'>
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className='flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/80 group text-xs'
                            >
                                <div
                                    className='w-3.5 h-3.5 rounded-full shrink-0'
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className='flex-1 font-medium text-gray-800 dark:text-gray-200 truncate'>
                                    {option}
                                </span>
                                <button
                                    onClick={() => removeOption(index)}
                                    disabled={spinning || options.length <= 2}
                                    className='p-1 text-gray-400 hover:text-red-500 rounded-lg cursor-pointer transition-colors opacity-60 hover:opacity-100'
                                    title={t.remove}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
