"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ambientNoiseTranslations } from "@/lib/i18n/tools/ambient-noise-generator";
import { toast } from "@/components/ui/Toast";

interface TrackState {
    id: string;
    icon: string;
    nameKey: keyof typeof ambientNoiseTranslations.en;
    descKey: keyof typeof ambientNoiseTranslations.en;
    volume: number; // 0 to 1
    isPlaying: boolean;
}

export default function AmbientNoiseContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = ambientNoiseTranslations[locale];

    const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
    const [masterVolume, setMasterVolume] = useState<number>(0.7);
    const [timerMinutes, setTimerMinutes] = useState<number>(0);
    const [timerRemaining, setTimerRemaining] = useState<number>(0);

    const [tracks, setTracks] = useState<TrackState[]>([
        { id: "brown", icon: "🐻", nameKey: "trackBrown", descKey: "trackBrownDesc", volume: 0.65, isPlaying: true },
        { id: "rain", icon: "🌧️", nameKey: "trackRain", descKey: "trackRainDesc", volume: 0.45, isPlaying: false },
        { id: "binaural", icon: "🧠", nameKey: "trackBinaural", descKey: "trackBinauralDesc", volume: 0.35, isPlaying: false },
        { id: "pink", icon: "🌸", nameKey: "trackPink", descKey: "trackPinkDesc", volume: 0.0, isPlaying: false },
        { id: "campfire", icon: "🪵", nameKey: "trackCampfire", descKey: "trackCampfireDesc", volume: 0.0, isPlaying: false },
        { id: "white", icon: "📻", nameKey: "trackWhite", descKey: "trackWhiteDesc", volume: 0.0, isPlaying: false },
    ]);

    // Web Audio API references
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const trackNodesRef = useRef<Record<string, { gain: GainNode; stop: () => void }>>({});
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number | null>(null);

    // Initialize AudioContext on first user interaction
    const getAudioContext = () => {
        if (!audioCtxRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            const masterGain = ctx.createGain();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;

            masterGain.connect(analyser);
            analyser.connect(ctx.destination);

            masterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);

            audioCtxRef.current = ctx;
            masterGainRef.current = masterGain;
            analyserRef.current = analyser;
        }
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    // Synthesize White Noise Buffer
    const createWhiteNoiseBuffer = (ctx: AudioContext) => {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    };

    // Synthesize Pink Noise Buffer (Paul Kellet's filter)
    const createPinkNoiseBuffer = (ctx: AudioContext) => {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
        }
        return buffer;
    };

    // Synthesize Brown Noise Buffer
    const createBrownNoiseBuffer = (ctx: AudioContext) => {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut + 0.02 * white) / 1.02;
            data[i] = lastOut * 3.5;
        }
        return buffer;
    };

    // Start a sound track generator
    const startTrackAudio = (trackId: string, volume: number) => {
        const ctx = getAudioContext();
        if (!masterGainRef.current) return;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.connect(masterGainRef.current);

        if (trackId === "white" || trackId === "pink" || trackId === "brown") {
            const buffer =
                trackId === "white"
                    ? createWhiteNoiseBuffer(ctx)
                    : trackId === "pink"
                    ? createPinkNoiseBuffer(ctx)
                    : createBrownNoiseBuffer(ctx);

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;
            source.connect(gainNode);
            source.start(0);

            trackNodesRef.current[trackId] = {
                gain: gainNode,
                stop: () => {
                    try {
                        source.stop();
                        source.disconnect();
                    } catch {}
                },
            };
        } else if (trackId === "rain") {
            // Rain: filtered pink noise with subtle lowpass bandpass
            const buffer = createPinkNoiseBuffer(ctx);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(1400, ctx.currentTime);

            source.connect(filter);
            filter.connect(gainNode);
            source.start(0);

            trackNodesRef.current[trackId] = {
                gain: gainNode,
                stop: () => {
                    try {
                        source.stop();
                        source.disconnect();
                    } catch {}
                },
            };
        } else if (trackId === "campfire") {
            // Campfire: low brown rumble + soft bandpass
            const buffer = createBrownNoiseBuffer(ctx);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.setValueAtTime(450, ctx.currentTime);
            filter.Q.setValueAtTime(1.5, ctx.currentTime);

            source.connect(filter);
            filter.connect(gainNode);
            source.start(0);

            trackNodesRef.current[trackId] = {
                gain: gainNode,
                stop: () => {
                    try {
                        source.stop();
                        source.disconnect();
                    } catch {}
                },
            };
        } else if (trackId === "binaural") {
            // Binaural Beats: 210Hz Left, 224Hz Right (14Hz Alpha/Beta differential)
            const oscL = ctx.createOscillator();
            const oscR = ctx.createOscillator();
            oscL.type = "sine";
            oscR.type = "sine";
            oscL.frequency.setValueAtTime(210, ctx.currentTime);
            oscR.frequency.setValueAtTime(224, ctx.currentTime);

            const merger = ctx.createChannelMerger(2);
            oscL.connect(merger, 0, 0); // left channel
            oscR.connect(merger, 0, 1); // right channel

            merger.connect(gainNode);
            oscL.start();
            oscR.start();

            trackNodesRef.current[trackId] = {
                gain: gainNode,
                stop: () => {
                    try {
                        oscL.stop();
                        oscR.stop();
                        oscL.disconnect();
                        oscR.disconnect();
                    } catch {}
                },
            };
        }
    };

    const stopTrackAudio = (trackId: string) => {
        if (trackNodesRef.current[trackId]) {
            trackNodesRef.current[trackId].stop();
            delete trackNodesRef.current[trackId];
        }
    };

    // Play / Pause Master Toggle
    const handleTogglePlayAll = () => {
        if (isPlayingAll) {
            // Stop all
            Object.keys(trackNodesRef.current).forEach((id) => stopTrackAudio(id));
            setIsPlayingAll(false);
        } else {
            // Start all active tracks
            getAudioContext();
            tracks.forEach((t) => {
                if (t.isPlaying && t.volume > 0) {
                    startTrackAudio(t.id, t.volume);
                }
            });
            setIsPlayingAll(true);
            toast.success(isVi ? "Đang phát âm thanh thư giãn" : "Ambient sounds playing");
        }
    };

    // Individual Track Volume & Toggle
    const handleVolumeChange = (trackId: string, newVol: number) => {
        setTracks((prev) =>
            prev.map((t) => (t.id === trackId ? { ...t, volume: newVol, isPlaying: newVol > 0 } : t))
        );

        if (isPlayingAll) {
            if (newVol > 0) {
                if (!trackNodesRef.current[trackId]) {
                    startTrackAudio(trackId, newVol);
                } else if (audioCtxRef.current) {
                    trackNodesRef.current[trackId].gain.gain.setValueAtTime(
                        newVol,
                        audioCtxRef.current.currentTime
                    );
                }
            } else {
                stopTrackAudio(trackId);
            }
        }
    };

    const handleToggleTrack = (trackId: string) => {
        setTracks((prev) =>
            prev.map((t) => {
                if (t.id === trackId) {
                    const nextPlaying = !t.isPlaying;
                    const nextVol = nextPlaying && t.volume === 0 ? 0.5 : t.volume;
                    if (isPlayingAll) {
                        if (nextPlaying) {
                            startTrackAudio(trackId, nextVol);
                        } else {
                            stopTrackAudio(trackId);
                        }
                    }
                    return { ...t, isPlaying: nextPlaying, volume: nextVol };
                }
                return t;
            })
        );
    };

    // Master Volume Update
    useEffect(() => {
        if (masterGainRef.current && audioCtxRef.current) {
            masterGainRef.current.gain.setValueAtTime(masterVolume, audioCtxRef.current.currentTime);
        }
    }, [masterVolume]);

    // Presets
    const applyPreset = (presetName: string) => {
        let newTracks = [...tracks];
        if (presetName === "coding") {
            newTracks = newTracks.map((t) => ({
                ...t,
                isPlaying: t.id === "brown" || t.id === "binaural",
                volume: t.id === "brown" ? 0.7 : t.id === "binaural" ? 0.35 : 0,
            }));
        } else if (presetName === "rainy") {
            newTracks = newTracks.map((t) => ({
                ...t,
                isPlaying: t.id === "rain" || t.id === "campfire",
                volume: t.id === "rain" ? 0.6 : t.id === "campfire" ? 0.35 : 0,
            }));
        } else if (presetName === "sleep") {
            newTracks = newTracks.map((t) => ({
                ...t,
                isPlaying: t.id === "pink" || t.id === "rain",
                volume: t.id === "pink" ? 0.5 : t.id === "rain" ? 0.3 : 0,
            }));
        } else if (presetName === "tinnitus") {
            newTracks = newTracks.map((t) => ({
                ...t,
                isPlaying: t.id === "white" || t.id === "pink",
                volume: t.id === "white" ? 0.4 : t.id === "pink" ? 0.5 : 0,
            }));
        }

        setTracks(newTracks);

        if (isPlayingAll) {
            Object.keys(trackNodesRef.current).forEach((id) => stopTrackAudio(id));
            newTracks.forEach((t) => {
                if (t.isPlaying && t.volume > 0) {
                    startTrackAudio(t.id, t.volume);
                }
            });
        }
        toast.info(isVi ? "Đã áp dụng mẫu âm thanh" : "Preset applied");
    };

    // Sleep Timer countdown
    const handleSetTimer = (minutes: number) => {
        setTimerMinutes(minutes);
        setTimerRemaining(minutes * 60);
        if (minutes > 0) {
            toast.info(isVi ? `Đã đặt hẹn giờ tắt sau ${minutes} phút` : `Timer set for ${minutes} min`);
        }
    };

    useEffect(() => {
        if (timerRemaining <= 0 || !isPlayingAll) return;
        const interval = setInterval(() => {
            setTimerRemaining((prev) => {
                if (prev <= 1) {
                    // Turn off sound
                    Object.keys(trackNodesRef.current).forEach((id) => stopTrackAudio(id));
                    setIsPlayingAll(false);
                    toast.info(isVi ? "Hẹn giờ đã hết, âm thanh đã dừng" : "Timer expired, playback stopped");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timerRemaining, isPlayingAll, isVi]);

    // Canvas Audio Visualizer
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const drawVisualizer = () => {
            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            if (!analyserRef.current || !isPlayingAll) {
                // Flat idle line
                ctx.beginPath();
                ctx.moveTo(0, height / 2);
                ctx.lineTo(width, height / 2);
                ctx.strokeStyle = "rgba(100, 116, 139, 0.25)";
                ctx.lineWidth = 2;
                ctx.stroke();
                animFrameRef.current = requestAnimationFrame(drawVisualizer);
                return;
            }

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyserRef.current.getByteFrequencyData(dataArray);

            const barWidth = (width / bufferLength) * 2.2;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * height * 0.85;

                const gradient = ctx.createLinearGradient(0, height, 0, 0);
                gradient.addColorStop(0, "#3b82f6");
                gradient.addColorStop(0.5, "#8b5cf6");
                gradient.addColorStop(1, "#ec4899");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, 3);
                } else {
                    ctx.rect(x, height - barHeight, barWidth - 2, barHeight);
                }
                ctx.fill();

                x += barWidth;
            }

            animFrameRef.current = requestAnimationFrame(drawVisualizer);
        };

        animFrameRef.current = requestAnimationFrame(drawVisualizer);
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isPlayingAll]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close().catch(() => {});
            }
        };
    }, []);

    return (
        <div className='max-w-6xl mx-auto space-y-8'>
            {/* Header info */}
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3'>
                    <span>🎧</span> {t.name}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                    {t.description}
                </p>
            </div>

            {/* Presets Bar */}
            <div className='flex items-center justify-center gap-2 flex-wrap'>
                <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>
                    ✨ {t.presetsTitle}:
                </span>
                <button
                    onClick={() => applyPreset("coding")}
                    className='px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-medium transition-colors cursor-pointer'
                >
                    🚀 {t.presetCoding}
                </button>
                <button
                    onClick={() => applyPreset("rainy")}
                    className='px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-medium transition-colors cursor-pointer'
                >
                    🌧️ {t.presetRainy}
                </button>
                <button
                    onClick={() => applyPreset("sleep")}
                    className='px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-medium transition-colors cursor-pointer'
                >
                    🌙 {t.presetSleep}
                </button>
                <button
                    onClick={() => applyPreset("tinnitus")}
                    className='px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-medium transition-colors cursor-pointer'
                >
                    🛡️ {t.presetTinnitus}
                </button>
            </div>

            {/* Master Control Deck & Audio Visualizer */}
            <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6'>
                {/* Visualizer canvas */}
                <div className='w-full h-24 bg-gray-950 rounded-2xl overflow-hidden p-3 flex items-center justify-center border border-gray-800 relative'>
                    <canvas ref={canvasRef} width={600} height={80} className='w-full h-full' />
                    {isPlayingAll && (
                        <div className='absolute right-4 top-3 flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400'>
                            <span className='w-2 h-2 rounded-full bg-emerald-400 animate-ping' />
                            LIVE SYNTH
                        </div>
                    )}
                </div>

                {/* Master Toolbar */}
                <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-center'>
                    {/* Play / Pause Main Button */}
                    <div className='md:col-span-4 flex items-center gap-3'>
                        <button
                            onClick={handleTogglePlayAll}
                            className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto ${
                                isPlayingAll
                                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25"
                                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25"
                            }`}
                        >
                            <span className='text-lg'>{isPlayingAll ? "⏸️" : "▶️"}</span>
                            <span>{isPlayingAll ? t.pauseAll : t.playAll}</span>
                        </button>
                    </div>

                    {/* Master Volume Slider */}
                    <div className='md:col-span-4 space-y-1.5'>
                        <div className='flex justify-between text-xs font-semibold'>
                            <span className='text-gray-700 dark:text-gray-300'>{t.masterVolume}</span>
                            <span className='font-mono font-bold text-blue-600'>{Math.round(masterVolume * 100)}%</span>
                        </div>
                        <input
                            type='range'
                            min='0'
                            max='1'
                            step='0.01'
                            value={masterVolume}
                            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                            className='w-full accent-blue-600 cursor-pointer'
                        />
                    </div>

                    {/* Timer Selector */}
                    <div className='md:col-span-4 space-y-1.5'>
                        <div className='flex justify-between text-xs font-semibold'>
                            <span className='text-gray-700 dark:text-gray-300'>{t.sleepTimer}</span>
                            {timerRemaining > 0 && (
                                <span className='font-mono font-bold text-emerald-600 dark:text-emerald-400'>
                                    {Math.floor(timerRemaining / 60)}:{(timerRemaining % 60).toString().padStart(2, "0")}
                                </span>
                            )}
                        </div>
                        <div className='flex items-center gap-1.5'>
                            {[
                                { min: 0, label: "Off" },
                                { min: 15, label: "15m" },
                                { min: 30, label: "30m" },
                                { min: 45, label: "45m" },
                                { min: 60, label: "60m" },
                            ].map((tm) => (
                                <button
                                    key={tm.min}
                                    onClick={() => handleSetTimer(tm.min)}
                                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                        timerMinutes === tm.min
                                            ? "bg-blue-600 text-white shadow-xs"
                                            : "bg-gray-100 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                                    }`}
                                >
                                    {tm.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Individual Sound Mixer Track Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {tracks.map((track) => {
                    const isActive = track.isPlaying && track.volume > 0;
                    return (
                        <div
                            key={track.id}
                            className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                                isActive
                                    ? "bg-white dark:bg-gray-800 border-blue-400 dark:border-blue-600 shadow-md shadow-blue-500/10"
                                    : "bg-gray-50/70 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800"
                            }`}
                        >
                            <div className='space-y-1.5'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2.5'>
                                        <span className='text-2xl'>{track.icon}</span>
                                        <h3 className='font-bold text-sm text-gray-900 dark:text-gray-100'>
                                            {t[track.nameKey]}
                                        </h3>
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => handleToggleTrack(track.id)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-xs"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                        }`}
                                    >
                                        {isActive ? "✓" : "○"}
                                    </button>
                                </div>
                                <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2'>
                                    {t[track.descKey]}
                                </p>
                            </div>

                            {/* Slider */}
                            <div className='space-y-1 pt-2 border-t border-gray-100 dark:border-gray-800'>
                                <div className='flex justify-between text-[11px] font-mono text-gray-400'>
                                    <span>Volume</span>
                                    <span>{Math.round(track.volume * 100)}%</span>
                                </div>
                                <input
                                    type='range'
                                    min='0'
                                    max='1'
                                    step='0.02'
                                    value={track.volume}
                                    onChange={(e) => handleVolumeChange(track.id, parseFloat(e.target.value))}
                                    className='w-full accent-blue-600 cursor-pointer'
                                />
                            </div>
                        </div>
                    );
                })}
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
