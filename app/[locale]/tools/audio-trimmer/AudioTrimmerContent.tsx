"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { audioTrimmerTranslations } from "@/lib/i18n/tools/audio-trimmer";
import { toast } from "@/components/ui/Toast";

// Helper to encode AudioBuffer to standard 16-bit PCM WAV Blob
function audioBufferToWav(buffer: AudioBuffer, startSec: number, endSec: number, fadeIn: boolean, fadeOut: boolean): Blob {
    const sampleRate = buffer.sampleRate;
    const numChannels = buffer.numberOfChannels;
    const startOffset = Math.floor(startSec * sampleRate);
    const endOffset = Math.floor(endSec * sampleRate);
    const numSamples = Math.max(0, endOffset - startOffset);

    // Fade samples count (0.5s fade)
    const fadeSamples = Math.min(Math.floor(sampleRate * 0.5), Math.floor(numSamples / 2));

    const bytesPerSample = 2; // 16-bit
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * blockAlign;
    const headerSize = 44;
    const totalSize = headerSize + dataSize;

    const arrayBuffer = new ArrayBuffer(totalSize);
    const view = new DataView(arrayBuffer);

    // RIFF chunk descriptor
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + dataSize, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"

    // "fmt " sub-chunk
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // BitsPerSample (16 bits)

    // "data" sub-chunk
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, dataSize, true);

    // Interleave channels & write 16-bit samples
    let offset = 44;
    const channelData: Float32Array[] = [];
    for (let ch = 0; ch < numChannels; ch++) {
        channelData.push(buffer.getChannelData(ch));
    }

    for (let i = 0; i < numSamples; i++) {
        const sourceIndex = startOffset + i;

        // Calculate fade factor
        let gain = 1.0;
        if (fadeIn && i < fadeSamples) {
            gain = i / fadeSamples;
        } else if (fadeOut && i > numSamples - fadeSamples) {
            gain = (numSamples - i) / fadeSamples;
        }

        for (let ch = 0; ch < numChannels; ch++) {
            const rawSample = (channelData[ch][sourceIndex] || 0) * gain;
            const clamped = Math.max(-1, Math.min(1, rawSample));
            const intSample = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
            view.setInt16(offset, intSample, true);
            offset += 2;
        }
    }

    return new Blob([view], { type: "audio/wav" });
}

export default function AudioTrimmerContent() {
    const { locale } = useLanguage();
    const t = audioTrimmerTranslations[locale as "en" | "vi"] || audioTrimmerTranslations.en;
    const isVi = locale === "vi";

    const [file, setFile] = useState<File | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [fadeIn, setFadeIn] = useState<boolean>(true);
    const [fadeOut, setFadeOut] = useState<boolean>(true);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isTrimming, setIsTrimming] = useState<boolean>(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

    // Format seconds into MM:SS.S
    const formatTime = (sec: number) => {
        const mins = Math.floor(sec / 60);
        const secs = (sec % 60).toFixed(1);
        return `${mins.toString().padStart(2, "0")}:${Number(secs) < 10 ? "0" : ""}${secs}`;
    };

    // Draw waveform on canvas
    const drawWaveform = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !audioBuffer) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        const data = audioBuffer.getChannelData(0);
        const step = Math.ceil(data.length / width);
        const amp = height / 2;

        // Draw waveform bars
        ctx.fillStyle = "#94a3b8"; // Slate-400
        for (let i = 0; i < width; i++) {
            let min = 1.0;
            let max = -1.0;
            for (let j = 0; j < step; j++) {
                const datum = data[i * step + j] || 0;
                if (datum < min) min = datum;
                if (datum > max) max = datum;
            }
            const barHeight = Math.max(2, (max - min) * amp * 0.9);
            ctx.fillRect(i, amp - barHeight / 2, 1.5, barHeight);
        }

        // Highlight selected region
        if (duration > 0) {
            const startX = (startTime / duration) * width;
            const endX = (endTime / duration) * width;
            const selWidth = Math.max(1, endX - startX);

            ctx.fillStyle = "rgba(59, 130, 246, 0.25)"; // Blue highlight
            ctx.fillRect(startX, 0, selWidth, height);

            // Left boundary line
            ctx.fillStyle = "#3b82f6";
            ctx.fillRect(startX, 0, 3, height);

            // Right boundary line
            ctx.fillStyle = "#3b82f6";
            ctx.fillRect(endX - 3, 0, 3, height);
        }
    }, [audioBuffer, startTime, endTime, duration]);

    useEffect(() => {
        drawWaveform();
    }, [drawWaveform]);

    // Handle File select
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioCtx;

            const arrayBuffer = await selectedFile.arrayBuffer();
            const decoded = await audioCtx.decodeAudioData(arrayBuffer);

            setFile(selectedFile);
            setAudioBuffer(decoded);
            const totalSec = decoded.duration;
            setDuration(totalSec);
            setStartTime(0);
            setEndTime(Math.min(30, totalSec)); // Default 30s selection for ringtone
        } catch (err) {
            console.error("Audio decode error:", err);
            toast.error(isVi ? "Không thể giải mã file âm thanh này!" : "Could not decode this audio file!");
        }
    };

    // Play selected portion
    const handlePlaySelection = () => {
        if (!audioBuffer) return;

        if (activeSourceRef.current) {
            try {
                activeSourceRef.current.stop();
            } catch {}
            activeSourceRef.current = null;
        }

        const audioCtx = audioContextRef.current || new AudioContext();
        audioContextRef.current = audioCtx;

        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);

        const selDuration = Math.max(0.1, endTime - startTime);
        source.start(0, startTime, selDuration);
        activeSourceRef.current = source;
        setIsPlaying(true);

        source.onended = () => {
            setIsPlaying(false);
            activeSourceRef.current = null;
        };
    };

    const handlePause = () => {
        if (activeSourceRef.current) {
            try {
                activeSourceRef.current.stop();
            } catch {}
            activeSourceRef.current = null;
            setIsPlaying(false);
        }
    };

    // Export trimmed WAV
    const handleTrimAndDownload = () => {
        if (!audioBuffer || !file) return;

        setIsTrimming(true);
        try {
            const wavBlob = audioBufferToWav(audioBuffer, startTime, endTime, fadeIn, fadeOut);
            const url = URL.createObjectURL(wavBlob);

            const a = document.createElement("a");
            a.href = url;
            const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            a.download = `${originalName}_trimmed.wav`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success(isVi ? "Đã cắt và tải về file âm thanh thành công!" : "Trimmed audio downloaded successfully!");
        } catch (err) {
            console.error("Trim error:", err);
            toast.error(isVi ? "Có lỗi xảy ra khi cắt âm thanh!" : "Failed to cut audio!");
        } finally {
            setIsTrimming(false);
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (activeSourceRef.current) {
                try {
                    activeSourceRef.current.stop();
                } catch {}
            }
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(() => {});
            }
        };
    }, []);

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-6'>
            {/* Upload Box */}
            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className='w-full p-10 sm:p-12 rounded-3xl border-2 border-dashed border-blue-300 dark:border-blue-700/60 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-all text-center cursor-pointer space-y-3'
                >
                    <input
                        ref={fileInputRef}
                        type='file'
                        accept='audio/*,.mp3,.wav,.ogg,.m4a,.aac'
                        onChange={handleFileSelect}
                        className='hidden'
                    />
                    <div className='text-5xl'>🎵</div>
                    <div className='font-bold text-lg text-gray-900 dark:text-white'>
                        {t.dropAudioTitle}
                    </div>
                    <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                        {t.dropAudioSubtitle}
                    </p>
                </div>
            ) : (
                <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-6'>
                    {/* Header: File info & clear button */}
                    <div className='flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-gray-100 dark:border-gray-800'>
                        <div className='flex items-center gap-3 truncate'>
                            <span className='text-2xl'>🎶</span>
                            <div className='truncate'>
                                <div className='font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate max-w-sm sm:max-w-md'>
                                    {file.name}
                                </div>
                                <div className='text-xs text-gray-500 font-mono'>
                                    {isVi ? "Tổng thời lượng:" : "Total length:"} {formatTime(duration)}
                                </div>
                            </div>
                        </div>

                        <button
                            type='button'
                            onClick={() => {
                                handlePause();
                                setFile(null);
                                setAudioBuffer(null);
                            }}
                            className='text-xs font-semibold text-red-500 hover:underline cursor-pointer'
                        >
                            ✕ {t.clearAudio}
                        </button>
                    </div>

                    {/* Interactive Waveform Canvas */}
                    <div className='relative w-full h-36 bg-gray-50 dark:bg-gray-800/70 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner flex items-center justify-center'>
                        <canvas ref={canvasRef} width={800} height={140} className='w-full h-full' />
                    </div>

                    {/* Range Sliders */}
                    <div className='space-y-3 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/60'>
                        <div className='flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300'>
                            <span>
                                {t.startTime}: <strong className='font-mono text-blue-600'>{formatTime(startTime)}</strong>
                            </span>
                            <span>
                                {t.endTime}: <strong className='font-mono text-blue-600'>{formatTime(endTime)}</strong>
                            </span>
                            <span>
                                {t.duration}: <strong className='font-mono text-emerald-600'>{formatTime(Math.max(0, endTime - startTime))}</strong>
                            </span>
                        </div>

                        {/* Start Slider */}
                        <div className='flex items-center gap-3'>
                            <span className='text-xs text-gray-500 w-12'>Start:</span>
                            <input
                                type='range'
                                min='0'
                                max={duration}
                                step='0.1'
                                value={startTime}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setStartTime(Math.min(val, endTime - 0.5));
                                }}
                                className='flex-1 accent-blue-600'
                            />
                        </div>

                        {/* End Slider */}
                        <div className='flex items-center gap-3'>
                            <span className='text-xs text-gray-500 w-12'>End:</span>
                            <input
                                type='range'
                                min='0'
                                max={duration}
                                step='0.1'
                                value={endTime}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setEndTime(Math.max(val, startTime + 0.5));
                                }}
                                className='flex-1 accent-blue-600'
                            />
                        </div>

                        {/* Fade Checkboxes */}
                        <div className='flex items-center gap-6 pt-2 border-t border-gray-200 dark:border-gray-700/60 text-xs'>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={fadeIn}
                                    onChange={(e) => setFadeIn(e.target.checked)}
                                    className='rounded text-blue-600'
                                />
                                <span>{t.fadeIn}</span>
                            </label>

                            <label className='flex items-center gap-2 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={fadeOut}
                                    onChange={(e) => setFadeOut(e.target.checked)}
                                    className='rounded text-blue-600'
                                />
                                <span>{t.fadeOut}</span>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center gap-3 flex-wrap'>
                        {!isPlaying ? (
                            <Button onClick={handlePlaySelection} variant='secondary' size='lg' className='px-6 py-3.5 font-bold cursor-pointer'>
                                ▶️ {t.playSelection}
                            </Button>
                        ) : (
                            <Button onClick={handlePause} variant='warning' size='lg' className='px-6 py-3.5 font-bold cursor-pointer'>
                                ⏸️ {t.pauseAudio}
                            </Button>
                        )}

                        <Button
                            onClick={handleTrimAndDownload}
                            disabled={isTrimming}
                            variant='primary'
                            size='lg'
                            className='flex-1 py-3.5 font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2'
                        >
                            <span>💾</span>
                            <span>{isTrimming ? t.trimming : t.trimAndDownload}</span>
                        </Button>
                    </div>
                </div>
            )}

            {/* Privacy note */}
            <div className='w-full p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2'>
                <span>🔒</span>
                <span>{t.privacyNotice}</span>
            </div>
        </div>
    );
}
