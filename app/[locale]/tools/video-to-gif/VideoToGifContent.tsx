"use client";

import { useState, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { videoToGifTranslations } from "@/lib/i18n/tools/video-to-gif";
import { SimpleGifBuilder } from "@/lib/utils/gif-encoder";
import { toast } from "@/components/ui/Toast";

export default function VideoToGifContent() {
    const { locale } = useLanguage();
    const t = videoToGifTranslations[locale as "en" | "vi"] || videoToGifTranslations.en;
    const isVi = locale === "vi";

    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [startTime, setStartTime] = useState<number>(0);
    const [endTime, setEndTime] = useState<number>(3);
    const [fps, setFps] = useState<number>(10);
    const [targetWidth, setTargetWidth] = useState<number>(360);

    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [generatedGifUrl, setGeneratedGifUrl] = useState<string | null>(null);
    const [gifSize, setGifSize] = useState<string>("");

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = (file: File) => {
        setFileName(file.name);
        setGeneratedGifUrl(null);
        setGifSize("");

        const url = URL.createObjectURL(file);
        setVideoSrc(url);
    };

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        const dur = videoRef.current.duration;
        setVideoDuration(dur);
        setStartTime(0);
        setEndTime(Math.min(dur, 4));
    };

    // Frame capture & GIF generation
    const handleGenerateGif = useCallback(async () => {
        if (!videoRef.current || !videoSrc) return;

        const video = videoRef.current;
        const clipDuration = Math.max(0.5, endTime - startTime);
        const totalFrames = Math.floor(clipDuration * fps);
        const step = clipDuration / totalFrames;

        const aspect = (video.videoHeight || 360) / (video.videoWidth || 640);
        const targetHeight = Math.round(targetWidth * aspect);

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        setIsConverting(true);
        setProgress(0);

        try {
            const gifBuilder = new SimpleGifBuilder(targetWidth, targetHeight);
            const delayMs = Math.round(1000 / fps);

            for (let i = 0; i < totalFrames; i++) {
                const targetTime = startTime + i * step;

                // Seek video to frame time
                await new Promise<void>((resolve) => {
                    const onSeeked = () => {
                        video.removeEventListener("seeked", onSeeked);
                        resolve();
                    };
                    video.addEventListener("seeked", onSeeked);
                    video.currentTime = targetTime;
                });

                // Draw frame to canvas
                ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
                const frameData = ctx.getImageData(0, 0, targetWidth, targetHeight);
                gifBuilder.addFrame(frameData, delayMs);

                setProgress(Math.round(((i + 1) / totalFrames) * 100));
            }

            const gifBlob = gifBuilder.buildBlob();
            const url = URL.createObjectURL(gifBlob);
            setGeneratedGifUrl(url);
            setGifSize((gifBlob.size / (1024 * 1024)).toFixed(2) + " MB");
            toast.success(isVi ? "Tạo ảnh GIF thành công!" : "GIF generated successfully!");
        } catch (err) {
            console.error("GIF conversion error:", err);
            toast.error(isVi ? "Có lỗi xảy ra khi tạo GIF" : "Failed to generate GIF");
        } finally {
            setIsConverting(false);
        }
    }, [startTime, endTime, fps, targetWidth, videoSrc, isVi]);

    const handleDownloadGif = () => {
        if (!generatedGifUrl) return;
        const link = document.createElement("a");
        link.href = generatedGifUrl;
        const name = fileName ? fileName.replace(/\.[^/.]+$/, "") + ".gif" : "animation.gif";
        link.download = name;
        link.click();
    };

    const clipLength = Math.max(0, endTime - startTime).toFixed(1);

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            <input
                type='file'
                ref={fileInputRef}
                accept='video/mp4, video/webm, video/quicktime, video/ogg'
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                }}
                className='hidden'
            />

            {!videoSrc ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className='w-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 text-center cursor-pointer transition-colors bg-white dark:bg-gray-900 shadow-sm space-y-3'
                >
                    <div className='w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-3xl mx-auto'>
                        🎬
                    </div>
                    <h3 className='text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200'>
                        {t.dropVideo}
                    </h3>
                    <p className='text-xs text-gray-400 max-w-md mx-auto'>{t.uploadHint}</p>
                </div>
            ) : (
                <div className='w-full space-y-6'>
                    {/* Video Player Card */}
                    <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center space-y-6'>
                        <div className='w-full max-w-2xl aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner border border-gray-800 relative'>
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                onLoadedMetadata={handleLoadedMetadata}
                                controls
                                playsInline
                                className='w-full h-full object-contain'
                            />
                        </div>

                        {/* Controls Toolbar */}
                        <div className='w-full max-w-2xl space-y-5'>
                            {/* Trim Sliders */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2'>
                                    <div className='flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300'>
                                        <span>⏱️ {t.startTime}</span>
                                        <span className='font-mono'>{startTime.toFixed(1)}s</span>
                                    </div>
                                    <input
                                        type='range'
                                        min={0}
                                        max={Math.max(0.1, videoDuration - 0.5)}
                                        step={0.1}
                                        value={startTime}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setStartTime(val);
                                            if (val >= endTime) setEndTime(Math.min(videoDuration, val + 1));
                                            if (videoRef.current) videoRef.current.currentTime = val;
                                        }}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>

                                <div className='p-4 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2'>
                                    <div className='flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300'>
                                        <span>⏱️ {t.endTime}</span>
                                        <span className='font-mono'>{endTime.toFixed(1)}s</span>
                                    </div>
                                    <input
                                        type='range'
                                        min={startTime + 0.5}
                                        max={videoDuration || 5}
                                        step={0.1}
                                        value={endTime}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setEndTime(val);
                                            if (videoRef.current) videoRef.current.currentTime = val;
                                        }}
                                        className='w-full accent-blue-600 cursor-pointer'
                                    />
                                </div>
                            </div>

                            {/* FPS & Width Selectors */}
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                        ⚡ {t.fps}
                                    </label>
                                    <select
                                        value={fps}
                                        onChange={(e) => setFps(parseInt(e.target.value, 10))}
                                        className='w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold cursor-pointer'
                                    >
                                        <option value={5}>5 FPS (Small file)</option>
                                        <option value={10}>10 FPS (Recommended)</option>
                                        <option value={12}>12 FPS (Smooth)</option>
                                        <option value={15}>15 FPS (High)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                        📐 {t.width}
                                    </label>
                                    <select
                                        value={targetWidth}
                                        onChange={(e) => setTargetWidth(parseInt(e.target.value, 10))}
                                        className='w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold cursor-pointer'
                                    >
                                        <option value={240}>240px (Tiny)</option>
                                        <option value={360}>360px (Standard)</option>
                                        <option value={480}>480px (Crisp)</option>
                                        <option value={600}>600px (HD)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                        ⏳ {t.duration}
                                    </label>
                                    <div className='px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-bold font-mono'>
                                        {clipLength} seconds
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-wrap items-center gap-3 pt-2'>
                                <Button
                                    onClick={handleGenerateGif}
                                    disabled={isConverting}
                                    variant='primary'
                                    size='md'
                                    className='flex-1 cursor-pointer text-xs font-bold shadow-md'
                                >
                                    {isConverting ? (
                                        <span className='flex items-center justify-center gap-2'>
                                            <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                            {t.converting} ({progress}%)
                                        </span>
                                    ) : (
                                        <span>✨ {t.convertBtn}</span>
                                    )}
                                </Button>

                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isConverting}
                                    variant='secondary'
                                    size='md'
                                    className='cursor-pointer text-xs font-bold'
                                >
                                    🔄 {t.changeVideo}
                                </Button>
                            </div>

                            {/* Progress bar */}
                            {isConverting && (
                                <div className='w-full space-y-1.5'>
                                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden'>
                                        <div
                                            className='bg-blue-600 h-2.5 rounded-full transition-all duration-150'
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className='text-[10px] text-gray-400 text-right font-mono'>
                                        {progress}%
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Result Preview Card */}
                    {generatedGifUrl && (
                        <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-6'>
                            <div className='w-full sm:w-72 aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md bg-black flex items-center justify-center'>
                                <img
                                    src={generatedGifUrl}
                                    alt='Generated animated GIF'
                                    className='max-w-full max-h-full object-contain'
                                />
                            </div>

                            <div className='flex-1 space-y-3 text-center sm:text-left'>
                                <div>
                                    <h4 className='text-base font-bold text-gray-900 dark:text-white'>
                                        🎉 {t.previewTitle}
                                    </h4>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono'>
                                        {targetWidth}px wide • {fps} FPS • {gifSize}
                                    </p>
                                </div>

                                <div>
                                    <Button
                                        onClick={handleDownloadGif}
                                        variant='primary'
                                        size='md'
                                        className='cursor-pointer text-xs font-bold px-6 shadow-md'
                                    >
                                        💾 {t.downloadGif}
                                    </Button>
                                </div>
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
