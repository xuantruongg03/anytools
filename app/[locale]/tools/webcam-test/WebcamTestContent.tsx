"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { webcamTestTranslations } from "@/lib/i18n/tools/webcam-test";
import { toast } from "@/components/ui/Toast";

interface VideoDevice {
    deviceId: string;
    label: string;
}

export default function WebcamTestContent() {
    const { locale } = useLanguage();
    const t = webcamTestTranslations[locale as "en" | "vi"] || webcamTestTranslations.en;
    const isVi = locale === "vi";

    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [devices, setDevices] = useState<VideoDevice[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [isMirror, setIsMirror] = useState<boolean>(true);
    const [resolution, setResolution] = useState<{ width: number; height: number } | null>(null);
    const [fps, setFps] = useState<number>(0);
    const [aspectRatio, setAspectRatio] = useState<string>("");
    const [facingMode, setFacingMode] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isFlashing, setIsFlashing] = useState<boolean>(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fpsTimerRef = useRef<number | null>(null);
    const frameCountRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(performance.now());

    // 1. Enumerate video devices
    const getDevices = useCallback(async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                return;
            }
            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const videoInputs = allDevices
                .filter((d) => d.kind === "videoinput")
                .map((d, index) => ({
                    deviceId: d.deviceId,
                    label: d.label || (isVi ? `Camera ${index + 1}` : `Camera ${index + 1}`),
                }));
            setDevices(videoInputs);
            if (videoInputs.length > 0 && !selectedDeviceId) {
                setSelectedDeviceId(videoInputs[0].deviceId);
            }
        } catch (e) {
            console.warn("Device enumeration error:", e);
        }
    }, [selectedDeviceId, isVi]);

    // 2. Start Camera Stream
    const startCamera = async (deviceId?: string) => {
        stopCamera();
        setErrorMsg(null);

        try {
            const targetDeviceId = deviceId || selectedDeviceId;
            const constraints: MediaStreamConstraints = {
                video: {
                    deviceId: targetDeviceId ? { exact: targetDeviceId } : undefined,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 60, min: 24 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play().catch(() => {});
            }

            setIsStreaming(true);
            toast.success(t.cameraReady);

            // Re-enumerate to get full labels after permission is granted
            getDevices();
        } catch (err: any) {
            console.error("Camera access error:", err);
            setIsStreaming(false);
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setErrorMsg(t.permissionDenied);
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                setErrorMsg(t.noCameraFound);
            } else {
                setErrorMsg(err.message || "Failed to access webcam.");
            }
        }
    };

    // 3. Stop Camera Stream
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (fpsTimerRef.current) {
            cancelAnimationFrame(fpsTimerRef.current);
            fpsTimerRef.current = null;
        }
        setIsStreaming(false);
        setResolution(null);
        setFps(0);
    };

    // 4. Track Video Metadata (Resolution & Aspect Ratio)
    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        const width = videoRef.current.videoWidth;
        const height = videoRef.current.videoHeight;
        setResolution({ width, height });

        // Calculate aspect ratio string
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        const divisor = gcd(width, height);
        const ratioW = width / divisor;
        const ratioH = height / divisor;
        setAspectRatio(`${ratioW}:${ratioH}`);

        // Read active track capabilities
        if (streamRef.current) {
            const track = streamRef.current.getVideoTracks()[0];
            if (track) {
                const settings = track.getSettings();
                if (settings.facingMode) {
                    setFacingMode(settings.facingMode);
                }
            }
        }
    };

    // 5. Measure Real-time FPS
    useEffect(() => {
        if (!isStreaming) return;

        const countFrame = () => {
            frameCountRef.current++;
            const now = performance.now();
            const elapsed = now - lastTimeRef.current;

            if (elapsed >= 1000) {
                const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
                setFps(currentFps);
                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }

            fpsTimerRef.current = requestAnimationFrame(countFrame);
        };

        fpsTimerRef.current = requestAnimationFrame(countFrame);

        return () => {
            if (fpsTimerRef.current) cancelAnimationFrame(fpsTimerRef.current);
        };
    }, [isStreaming]);

    // Initial check for devices
    useEffect(() => {
        getDevices();
        return () => {
            stopCamera();
        };
    }, [getDevices]);

    // 6. Snapshot / Take Photo
    const takeSnapshot = (withTimer: boolean = false) => {
        if (!videoRef.current || !isStreaming) return;

        if (withTimer) {
            let count = 3;
            setCountdown(count);
            const interval = setInterval(() => {
                count--;
                if (count > 0) {
                    setCountdown(count);
                } else {
                    clearInterval(interval);
                    setCountdown(null);
                    captureCanvas();
                }
            }, 1000);
        } else {
            captureCanvas();
        }
    };

    const captureCanvas = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Apply mirror if enabled
        if (isMirror) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Flash animation effect
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 250);

        const dataUrl = canvas.toDataURL("image/png");
        setCapturedImage(dataUrl);
        toast.success(isVi ? "Đã chụp ảnh test thành công!" : "Snapshot captured successfully!");
    };

    // Download captured image
    const downloadSnapshot = () => {
        if (!capturedImage) return;
        const link = document.createElement("a");
        link.href = capturedImage;
        link.download = `webcam_snapshot_${Date.now()}.png`;
        link.click();
    };

    // Quality Rating badge
    const getQualityRating = () => {
        if (!resolution) return null;
        const { width, height } = resolution;
        if (width >= 3840 || height >= 2160) return { label: t.rating4k, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50 border-purple-300" };
        if (width >= 1920 || height >= 1080) return { label: t.rating1080p, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300" };
        if (width >= 1280 || height >= 720) return { label: t.rating720p, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-300" };
        return { label: t.ratingSD, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-300" };
    };

    const quality = getQualityRating();

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Top Controls Toolbar */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center gap-3 text-xs'>
                    {/* Device Selector */}
                    {devices.length > 0 && (
                        <div className='flex items-center gap-1.5'>
                            <span className='font-bold text-gray-700 dark:text-gray-300'>📷 {t.selectCamera}:</span>
                            <select
                                value={selectedDeviceId}
                                onChange={(e) => {
                                    setSelectedDeviceId(e.target.value);
                                    if (isStreaming) {
                                        startCamera(e.target.value);
                                    }
                                }}
                                className='px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer max-w-[200px] truncate'
                            >
                                {devices.map((d) => (
                                    <option key={d.deviceId} value={d.deviceId}>
                                        {d.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Mirror View Toggle */}
                    <label className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700'>
                        <input
                            type='checkbox'
                            checked={isMirror}
                            onChange={(e) => setIsMirror(e.target.checked)}
                            className='rounded accent-blue-600'
                        />
                        <span>🪞 {t.mirrorMode}</span>
                    </label>
                </div>

                <div className='flex items-center gap-2.5'>
                    {!isStreaming ? (
                        <Button
                            onClick={() => startCamera()}
                            variant='primary'
                            size='md'
                            className='cursor-pointer text-xs font-bold shadow-md hover:shadow-lg'
                        >
                            ▶️ {t.startCamera}
                        </Button>
                    ) : (
                        <Button
                            onClick={stopCamera}
                            variant='secondary'
                            size='md'
                            className='cursor-pointer text-xs font-bold text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40'
                        >
                            ⏹️ {t.stopCamera}
                        </Button>
                    )}
                </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
                <div className='w-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-4 rounded-2xl text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3'>
                    <span className='text-lg'>⚠️</span>
                    <div className='flex-1 leading-relaxed'>{errorMsg}</div>
                </div>
            )}

            {/* Main Video Viewport Card */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-7 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center relative overflow-hidden'>
                {/* Flash Overlay when taking photo */}
                {isFlashing && (
                    <div className='absolute inset-0 bg-white z-50 animate-fade pointer-events-none' />
                )}

                {/* Video Container */}
                <div className='relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner flex items-center justify-center border border-gray-800'>
                    {/* Live Video Element */}
                    <video
                        ref={videoRef}
                        onLoadedMetadata={handleLoadedMetadata}
                        playsInline
                        muted
                        className={`w-full h-full object-cover transition-transform duration-200 ${
                            isMirror ? "scale-x-[-1]" : "scale-x-100"
                        } ${!isStreaming ? "hidden" : "block"}`}
                    />

                    {/* Camera Off Placeholder */}
                    {!isStreaming && (
                        <div className='flex flex-col items-center justify-center text-center p-6 space-y-3 select-none'>
                            <div className='w-16 h-16 rounded-2xl bg-gray-800/80 border border-gray-700 flex items-center justify-center text-2xl text-gray-400 shadow-inner'>
                                📷
                            </div>
                            <div className='text-sm font-bold text-gray-300'>{t.cameraOff}</div>
                            <Button
                                onClick={() => startCamera()}
                                variant='primary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                ▶️ {t.startCamera}
                            </Button>
                        </div>
                    )}

                    {/* Countdown Overlay */}
                    {countdown !== null && (
                        <div className='absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-40'>
                            <span className='text-7xl sm:text-9xl font-black text-white font-mono animate-ping'>
                                {countdown}
                            </span>
                        </div>
                    )}

                    {/* Live HUD Badges on Top of Video */}
                    {isStreaming && (
                        <div className='absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10'>
                            <div className='flex items-center gap-2'>
                                <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30'>
                                    <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                                    <span>LIVE</span>
                                </span>

                                {fps > 0 && (
                                    <span className='px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-bold border border-white/20'>
                                        {fps} FPS
                                    </span>
                                )}
                            </div>

                            {resolution && (
                                <span className='px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-bold border border-white/20'>
                                    {resolution.width} × {resolution.height}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Video Action Bar */}
                {isStreaming && (
                    <div className='w-full flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800'>
                        <div className='flex items-center gap-2'>
                            <Button
                                onClick={() => takeSnapshot(false)}
                                variant='primary'
                                size='md'
                                className='cursor-pointer text-xs font-bold'
                            >
                                📸 {t.takeSnapshot}
                            </Button>

                            <Button
                                onClick={() => takeSnapshot(true)}
                                variant='secondary'
                                size='md'
                                className='cursor-pointer text-xs font-bold'
                            >
                                ⏱️ {t.timer3s}
                            </Button>
                        </div>

                        {quality && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${quality.color}`}>
                                {quality.label}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Real-time Hardware Capabilities HUD */}
            <div className='w-full grid grid-cols-2 sm:grid-cols-4 gap-3'>
                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                        📐 {t.resolution}
                    </div>
                    <div className='text-lg sm:text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono'>
                        {resolution ? `${resolution.width} × ${resolution.height}` : "-"}
                    </div>
                    <div className='text-[10px] text-gray-400'>
                        {resolution ? (resolution.width >= 1920 ? "Full HD" : resolution.width >= 1280 ? "HD" : "SD") : "No stream"}
                    </div>
                </div>

                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                        ⚡ {t.realFps}
                    </div>
                    <div className='text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono'>
                        {fps > 0 ? `${fps} FPS` : "-"}
                    </div>
                    <div className='text-[10px] text-gray-400'>{fps >= 30 ? "Smooth (30+ FPS)" : "Normal"}</div>
                </div>

                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                        📺 {t.aspectRatio}
                    </div>
                    <div className='text-lg sm:text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono'>
                        {aspectRatio || "16:9"}
                    </div>
                    <div className='text-[10px] text-gray-400'>Widescreen</div>
                </div>

                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                        🧭 {t.facingMode}
                    </div>
                    <div className='text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono capitalize truncate'>
                        {facingMode || (isVi ? "Trước (User)" : "Front (User)")}
                    </div>
                    <div className='text-[10px] text-gray-400'>Webcam Sensor</div>
                </div>
            </div>

            {/* Captured Image Preview Modal / Card */}
            {capturedImage && (
                <div className='w-full bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-5'>
                    <div className='w-full sm:w-64 aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm'>
                        <img src={capturedImage} alt='Captured snapshot' className='w-full h-full object-cover' />
                    </div>

                    <div className='flex-1 flex flex-col justify-between space-y-3 text-center sm:text-left'>
                        <div>
                            <h4 className='text-sm font-bold text-gray-900 dark:text-white'>
                                📸 {isVi ? "Ảnh chụp thử nghiệm thành công" : "Test Snapshot Ready"}
                            </h4>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                {resolution ? `${resolution.width} × ${resolution.height} PNG` : "High-resolution snapshot"}
                            </p>
                        </div>

                        <div className='flex flex-wrap items-center gap-2 justify-center sm:justify-start'>
                            <Button
                                onClick={downloadSnapshot}
                                variant='primary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                💾 {t.downloadPhoto}
                            </Button>

                            <Button
                                onClick={() => setCapturedImage(null)}
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                ✕ {isVi ? "Đóng" : "Dismiss"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Comprehensive SEO & Troubleshooting Guide */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>💡</span> {t.guideTitle}
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>1. {t.tip1Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.tip1Desc}</p>
                    </div>

                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>2. {t.tip2Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.tip2Desc}</p>
                    </div>

                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>3. {t.tip3Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.tip3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
