"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { textToSpeechTranslations } from "@/lib/i18n/tools/text-to-speech";

export default function TextToSpeechContent() {
    const { locale } = useLanguage();
    const t = textToSpeechTranslations[locale as "en" | "vi"] || textToSpeechTranslations.en;
    const isVi = locale === "vi";

    const [text, setText] = useState<string>("");
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
    const [rate, setRate] = useState<number>(1);
    const [pitch, setPitch] = useState<number>(1);
    const [volume, setVolume] = useState<number>(1);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [highlightCharIndex, setHighlightCharIndex] = useState<number>(-1);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Load available voices
    useEffect(() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

        const updateVoices = () => {
            const available = window.speechSynthesis.getVoices();
            setVoices(available);

            // Default to preferred language
            const prefLang = isVi ? "vi" : "en";
            const defaultIdx = available.findIndex((v) => v.lang.toLowerCase().startsWith(prefLang));
            if (defaultIdx !== -1) {
                setSelectedVoiceIndex(defaultIdx);
            }
        };

        updateVoices();
        window.speechSynthesis.onvoiceschanged = updateVoices;

        return () => {
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isVi]);

    // Handle speak
    const handleSpeak = () => {
        if (!("speechSynthesis" in window) || !text.trim()) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (voices[selectedVoiceIndex]) {
            utterance.voice = voices[selectedVoiceIndex];
        }
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        utterance.onpause = () => {
            setIsPaused(true);
        };

        utterance.onresume = () => {
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setHighlightCharIndex(-1);
        };

        utterance.onerror = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setHighlightCharIndex(-1);
        };

        utterance.onboundary = (e) => {
            if (e.name === "word") {
                setHighlightCharIndex(e.charIndex);
            }
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const handlePause = () => {
        if ("speechSynthesis" in window && isPlaying) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const handleResume = () => {
        if ("speechSynthesis" in window && isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setIsPaused(false);
            setHighlightCharIndex(-1);
        }
    };

    const handleLoadSample = () => {
        const sample = isVi
            ? "Chào mừng bạn đến với AnyTools! Đây là công cụ chuyển đổi văn bản thành giọng nói trực tiếp trong trình duyệt. Bạn có thể tùy chỉnh giọng đọc, tốc độ và cao độ theo ý muốn."
            : "Welcome to AnyTools! This is an interactive Text to Speech converter running directly in your browser. You can customize voices, speaking rate, and pitch effortlessly.";
        setText(sample);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-6'>
            {/* Input Card */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-6'>
                <div className='flex items-center justify-between flex-wrap gap-2'>
                    <label className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                        <span>📝</span>
                        <span>{t.inputTextLabel}</span>
                    </label>

                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            onClick={handleLoadSample}
                            className='text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                        >
                            📋 {t.sampleText}
                        </button>
                        {text && (
                            <button
                                type='button'
                                onClick={() => {
                                    handleStop();
                                    setText("");
                                }}
                                className='text-xs font-semibold text-red-500 hover:underline cursor-pointer'
                            >
                                ✕ {t.clear}
                            </button>
                        )}
                    </div>
                </div>

                <textarea
                    rows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={t.inputPlaceholder}
                    className='w-full p-4 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-400 font-sans leading-relaxed'
                />

                {/* Voice & Modulation Controls */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80'>
                    {/* Voice Selector */}
                    <div className='sm:col-span-2 lg:col-span-1'>
                        <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                            {t.selectVoice}
                        </label>
                        <select
                            value={selectedVoiceIndex}
                            onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                            className='w-full px-3 py-2 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 truncate'
                        >
                            {voices.map((v, i) => (
                                <option key={i} value={i}>
                                    {v.name} ({v.lang})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Speed Rate */}
                    <div>
                        <div className='flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                            <span>{t.speedRate}</span>
                            <span className='font-mono'>{rate}x</span>
                        </div>
                        <input
                            type='range'
                            min='0.5'
                            max='2'
                            step='0.1'
                            value={rate}
                            onChange={(e) => setRate(Number(e.target.value))}
                            className='w-full accent-blue-600'
                        />
                    </div>

                    {/* Pitch Rate */}
                    <div>
                        <div className='flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                            <span>{t.pitchRate}</span>
                            <span className='font-mono'>{pitch}</span>
                        </div>
                        <input
                            type='range'
                            min='0.5'
                            max='1.5'
                            step='0.1'
                            value={pitch}
                            onChange={(e) => setPitch(Number(e.target.value))}
                            className='w-full accent-blue-600'
                        />
                    </div>

                    {/* Volume */}
                    <div>
                        <div className='flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                            <span>{t.volumeRate}</span>
                            <span className='font-mono'>{Math.round(volume * 100)}%</span>
                        </div>
                        <input
                            type='range'
                            min='0'
                            max='1'
                            step='0.05'
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className='w-full accent-blue-600'
                        />
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className='flex items-center gap-3 flex-wrap'>
                    {!isPlaying ? (
                        <Button
                            onClick={handleSpeak}
                            disabled={!text.trim()}
                            variant='primary'
                            size='lg'
                            className='flex-1 py-3 font-bold flex items-center justify-center gap-2'
                        >
                            <span>▶️</span>
                            <span>{t.speak}</span>
                        </Button>
                    ) : (
                        <>
                            {!isPaused ? (
                                <Button
                                    onClick={handlePause}
                                    variant='warning'
                                    size='lg'
                                    className='flex-1 py-3 font-bold flex items-center justify-center gap-2'
                                >
                                    <span>⏸️</span>
                                    <span>{t.pause}</span>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleResume}
                                    variant='success'
                                    size='lg'
                                    className='flex-1 py-3 font-bold flex items-center justify-center gap-2'
                                >
                                    <span>▶️</span>
                                    <span>{t.resume}</span>
                                </Button>
                            )}

                            <Button
                                onClick={handleStop}
                                variant='danger'
                                size='lg'
                                className='py-3 font-bold px-6 flex items-center justify-center gap-2'
                            >
                                <span>⏹️</span>
                                <span>{t.stop}</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Privacy note */}
            <div className='w-full p-4 rounded-2xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2'>
                <span>🔒</span>
                <span>{t.privacyNotice}</span>
            </div>
        </div>
    );
}
