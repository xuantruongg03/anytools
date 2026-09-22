"use client";

import { useState, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { audioConverterTranslations } from "@/lib/i18n/tools/audio-converter";
import { toast } from "@/components/ui/Toast";

// Encode AudioBuffer to 16-bit PCM WAV Blob
function audioBufferToWav(buffer: AudioBuffer, targetChannels: 1 | 2): Blob {
    const numChannels = targetChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    let leftChannel = buffer.getChannelData(0);
    let rightChannel = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : leftChannel;

    let samplesLength = buffer.length;
    let dataLength = samplesLength * numChannels * 2;
    let bufferLength = 44 + dataLength;

    let arrayBuffer = new ArrayBuffer(bufferLength);
    let view = new DataView(arrayBuffer);

    // Write WAV header
    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    writeString(36, "data");
    view.setUint32(40, dataLength, true);

    // Interleave samples & write 16-bit PCM
    let offset = 44;
    for (let i = 0; i < samplesLength; i++) {
        if (numChannels === 1) {
            // Downmix to mono
            let sample = buffer.numberOfChannels > 1 ? (leftChannel[i] + rightChannel[i]) / 2 : leftChannel[i];
            sample = Math.max(-1, Math.min(1, sample));
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
            offset += 2;
        } else {
            // Stereo
            let sL = Math.max(-1, Math.min(1, leftChannel[i]));
            let sR = Math.max(-1, Math.min(1, rightChannel[i]));
            view.setInt16(offset, sL < 0 ? sL * 0x8000 : sL * 0x7fff, true);
            view.setInt16(offset + 2, sR < 0 ? sR * 0x8000 : sR * 0x7fff, true);
            offset += 4;
        }
    }

    return new Blob([view], { type: "audio/wav" });
}

export default function AudioConverterContent() {
    const { locale } = useLanguage();
    const t = audioConverterTranslations[locale as "en" | "vi"] || audioConverterTranslations.en;
    const isVi = locale === "vi";

    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [fileSize, setFileSize] = useState<string>("");
    const [duration, setDuration] = useState<number>(0);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

    // Options
    const [targetFormat, setTargetFormat] = useState<"wav" | "webm">("wav");
    const [channels, setChannels] = useState<1 | 2>(2);
    const [targetSampleRate, setTargetSampleRate] = useState<number>(44100);

    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [convertedAudioUrl, setConvertedAudioUrl] = useState<string | null>(null);
    const [convertedSize, setConvertedSize] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = async (file: File) => {
        setFileName(file.name);
        setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");
        setConvertedAudioUrl(null);
        setConvertedSize("");

        const audioUrl = URL.createObjectURL(file);
        setAudioSrc(audioUrl);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const decoded = await audioCtx.decodeAudioData(arrayBuffer);
            setAudioBuffer(decoded);
            setDuration(decoded.duration);
        } catch (e) {
            console.error("Audio decode error:", e);
            toast.error(isVi ? "Không thể giải mã file âm thanh này" : "Failed to decode this audio file");
        }
    };

    const handleConvert = useCallback(async () => {
        if (!audioBuffer) return;
        setIsConverting(true);

        try {
            // Resample if sample rate differs
            let processedBuffer = audioBuffer;
            if (audioBuffer.sampleRate !== targetSampleRate) {
                const offlineCtx = new OfflineAudioContext(
                    channels,
                    Math.ceil(audioBuffer.duration * targetSampleRate),
                    targetSampleRate
                );
                const source = offlineCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(offlineCtx.destination);
                source.start();
                processedBuffer = await offlineCtx.startRendering();
            }

            // Export as WAV Blob
            const wavBlob = audioBufferToWav(processedBuffer, channels);
            const url = URL.createObjectURL(wavBlob);
            setConvertedAudioUrl(url);
            setConvertedSize((wavBlob.size / (1024 * 1024)).toFixed(2) + " MB");
            toast.success(t.convertedSuccess);
        } catch (err) {
            console.error("Audio conversion error:", err);
            toast.error(isVi ? "Có lỗi xảy ra khi chuyển đổi" : "Failed to convert audio");
        } finally {
            setIsConverting(false);
        }
    }, [audioBuffer, targetSampleRate, channels, t, isVi]);

    const handleDownload = () => {
        if (!convertedAudioUrl) return;
        const link = document.createElement("a");
        link.href = convertedAudioUrl;
        const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "audio";
        link.download = `${baseName}_converted.wav`;
        link.click();
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            <input
                type='file'
                ref={fileInputRef}
                accept='audio/*'
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                }}
                className='hidden'
            />

            {!audioSrc ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className='w-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 text-center cursor-pointer transition-colors bg-white dark:bg-gray-900 shadow-sm space-y-3'
                >
                    <div className='w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-3xl mx-auto'>
                        🎵
                    </div>
                    <h3 className='text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200'>
                        {t.dropAudio}
                    </h3>
                    <p className='text-xs text-gray-400 max-w-md mx-auto'>{t.uploadHint}</p>
                </div>
            ) : (
                <div className='w-full space-y-6'>
                    {/* Audio Player & Specs Card */}
                    <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-6'>
                        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800'>
                            <div>
                                <h4 className='text-base font-bold text-gray-900 dark:text-white truncate max-w-md'>
                                    {fileName}
                                </h4>
                                <p className='text-xs text-gray-400 font-mono mt-0.5'>
                                    {fileSize} • {duration > 0 ? `${duration.toFixed(1)}s` : "Loading..."} • {audioBuffer ? `${audioBuffer.numberOfChannels} ch, ${audioBuffer.sampleRate}Hz` : ""}
                                </p>
                            </div>

                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                🔄 {t.changeAudio}
                            </Button>
                        </div>

                        {/* Player */}
                        <div className='w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700'>
                            <audio controls src={audioSrc} className='w-full' />
                        </div>

                        {/* Conversion Controls */}
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2'>
                            {/* Format */}
                            <div>
                                <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    📦 {t.targetFormat}
                                </label>
                                <select
                                    value={targetFormat}
                                    onChange={(e) => setTargetFormat(e.target.value as any)}
                                    className='w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold cursor-pointer'
                                >
                                    <option value='wav'>{t.formatWav}</option>
                                </select>
                            </div>

                            {/* Channels */}
                            <div>
                                <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    🔊 {t.channels}
                                </label>
                                <select
                                    value={channels}
                                    onChange={(e) => setChannels(parseInt(e.target.value, 10) as 1 | 2)}
                                    className='w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold cursor-pointer'
                                >
                                    <option value={2}>{t.channelStereo}</option>
                                    <option value={1}>{t.channelMono}</option>
                                </select>
                            </div>

                            {/* Sample Rate */}
                            <div>
                                <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    ⚡ {t.sampleRate}
                                </label>
                                <select
                                    value={targetSampleRate}
                                    onChange={(e) => setTargetSampleRate(parseInt(e.target.value, 10))}
                                    className='w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold cursor-pointer'
                                >
                                    <option value={48000}>{t.rate48k}</option>
                                    <option value={44100}>{t.rate44k}</option>
                                    <option value={22050}>{t.rate22k}</option>
                                </select>
                            </div>
                        </div>

                        {/* Convert Button */}
                        <div className='flex justify-center pt-2'>
                            <Button
                                onClick={handleConvert}
                                disabled={isConverting || !audioBuffer}
                                variant='primary'
                                size='md'
                                className='w-full sm:w-auto px-8 cursor-pointer text-xs font-bold shadow-md'
                            >
                                {isConverting ? (
                                    <span className='flex items-center gap-2'>
                                        <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                        {t.converting}
                                    </span>
                                ) : (
                                    <span>✨ {t.convertBtn}</span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Result Card */}
                    {convertedAudioUrl && (
                        <div className='w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-blue-200 dark:border-gray-700 space-y-4'>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2'>
                                    <span>🎉</span> {t.convertedSuccess}
                                </span>
                                <span className='text-xs font-mono font-bold text-gray-500 dark:text-gray-400'>
                                    {convertedSize}
                                </span>
                            </div>

                            <audio controls src={convertedAudioUrl} className='w-full' />

                            <div className='flex justify-start'>
                                <Button
                                    onClick={handleDownload}
                                    variant='primary'
                                    size='md'
                                    className='cursor-pointer text-xs font-bold shadow-md'
                                >
                                    💾 {t.downloadAudio}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

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
