"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { qrScannerTranslations } from "@/lib/i18n/tools/qr-scanner";
import { toast } from "@/components/ui/Toast";
import jsQR from "jsqr";

interface ScanHistoryItem {
    id: string;
    text: string;
    type: "url" | "wifi" | "text";
    timestamp: string;
}

// Web Audio API beep sound
function playBeep() {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
        // Audio not allowed or unsupported
    }
}

export default function QrScannerContent() {
    const { locale } = useLanguage();
    const t = qrScannerTranslations[locale as "en" | "vi"] || qrScannerTranslations.en;
    const isVi = locale === "vi";

    const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [scannedResult, setScannedResult] = useState<string | null>(null);
    const [scannedType, setScannedType] = useState<"url" | "wifi" | "text">("text");
    const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
    const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
    const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [history, setHistory] = useState<ScanHistoryItem[]>([]);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Parse Result Type
    const detectType = (data: string): "url" | "wifi" | "text" => {
        if (/^https?:\/\//i.test(data)) return "url";
        if (/^WIFI:/i.test(data)) return "wifi";
        return "text";
    };

    // Add to history
    const addToHistory = (text: string) => {
        const type = detectType(text);
        const item: ScanHistoryItem = {
            id: Date.now().toString(),
            text,
            type,
            timestamp: new Date().toLocaleTimeString(),
        };
        setHistory((prev) => [item, ...prev.slice(0, 9)]);
    };

    // Stop camera
    const stopCamera = useCallback(() => {
        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
    }, []);

    // Frame scan loop
    const tick = useCallback(() => {
        if (!videoRef.current || !isScanning) return;
        const video = videoRef.current;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            if (!canvasRef.current) {
                canvasRef.current = document.createElement("canvas");
            }
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });

            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code && code.data) {
                    if (soundEnabled) playBeep();
                    setScannedResult(code.data);
                    const type = detectType(code.data);
                    setScannedType(type);
                    addToHistory(code.data);
                    stopCamera();
                    toast.success(isVi ? "Đã quét mã QR thành công!" : "QR code scanned successfully!");
                    return;
                }
            }
        }

        animFrameRef.current = requestAnimationFrame(tick);
    }, [isScanning, soundEnabled, isVi, stopCamera]);

    useEffect(() => {
        if (isScanning) {
            animFrameRef.current = requestAnimationFrame(tick);
        }
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [isScanning, tick]);

    // Start camera
    const startCamera = async (facing: "environment" | "user" = cameraFacing) => {
        stopCamera();
        setErrorMsg(null);
        setScannedResult(null);

        try {
            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: facing,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.setAttribute("playsinline", "true");
                await videoRef.current.play();
            }

            setIsScanning(true);
        } catch (err: any) {
            console.error("Camera access error:", err);
            setErrorMsg(t.cameraDenied);
            setIsScanning(false);
        }
    };

    // Toggle Camera (Front / Back)
    const toggleCamera = () => {
        const next = cameraFacing === "environment" ? "user" : "environment";
        setCameraFacing(next);
        if (isScanning) {
            startCamera(next);
        }
    };

    // Handle Upload Image
    const handleFileUpload = (file: File) => {
        setErrorMsg(null);
        setScannedResult(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target?.result as string;
            setUploadedImageSrc(src);

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "attemptBoth",
                });

                if (code && code.data) {
                    if (soundEnabled) playBeep();
                    setScannedResult(code.data);
                    const type = detectType(code.data);
                    setScannedType(type);
                    addToHistory(code.data);
                    toast.success(isVi ? "Đã đọc mã QR thành công!" : "QR Code decoded successfully!");
                } else {
                    setErrorMsg(t.noQrFound);
                }
            };
            img.src = src;
        };
        reader.readAsDataURL(file);
    };

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    const handleCopy = () => {
        if (!scannedResult) return;
        navigator.clipboard.writeText(scannedResult);
        toast.success(t.copied);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Mode Tabs */}
            <div className='flex items-center p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full'>
                <button
                    onClick={() => {
                        setActiveTab("camera");
                        setErrorMsg(null);
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "camera"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    📷 {t.tabCamera}
                </button>
                <button
                    onClick={() => {
                        setActiveTab("upload");
                        stopCamera();
                        setErrorMsg(null);
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "upload"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    📁 {t.tabUpload}
                </button>
            </div>

            {/* TAB 1: CAMERA SCAN */}
            {activeTab === "camera" && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center space-y-5'>
                    {/* Viewport Card */}
                    <div className='relative w-full max-w-md aspect-square bg-black rounded-3xl overflow-hidden shadow-inner border border-gray-800 flex items-center justify-center'>
                        <video
                            ref={videoRef}
                            className={`w-full h-full object-cover ${!isScanning ? "hidden" : "block"}`}
                        />

                        {/* Scanner Viewfinder Box */}
                        {isScanning && (
                            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                                <div className='relative w-64 h-64 border-2 border-emerald-500 rounded-2xl shadow-lg'>
                                    {/* Corner Accents */}
                                    <div className='absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg' />
                                    <div className='absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg' />
                                    <div className='absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg' />
                                    <div className='absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg' />

                                    {/* Animated Scan Line */}
                                    <div className='w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent absolute top-0 animate-[bounce_2s_infinite]' />
                                </div>
                            </div>
                        )}

                        {!isScanning && (
                            <div className='p-6 text-center space-y-3'>
                                <div className='w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-3xl mx-auto text-gray-400'>
                                    📷
                                </div>
                                <div className='text-xs sm:text-sm font-bold text-gray-300'>
                                    Ready to scan QR Code
                                </div>
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
                    </div>

                    {/* Camera Action Toolbar */}
                    <div className='flex flex-wrap items-center justify-center gap-2.5 text-xs'>
                        {isScanning ? (
                            <>
                                <Button
                                    onClick={stopCamera}
                                    variant='secondary'
                                    size='sm'
                                    className='cursor-pointer text-xs font-bold text-red-500 border-red-200 dark:border-red-900'
                                >
                                    ⏹️ {t.stopCamera}
                                </Button>
                                <Button
                                    onClick={toggleCamera}
                                    variant='secondary'
                                    size='sm'
                                    className='cursor-pointer text-xs font-bold'
                                >
                                    🔄 {t.switchCamera}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => startCamera()}
                                variant='primary'
                                size='md'
                                className='cursor-pointer text-xs font-bold shadow-md'
                            >
                                ▶️ {t.startCamera}
                            </Button>
                        )}

                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className='px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold cursor-pointer'
                        >
                            {soundEnabled ? `🔊 ${t.soundOn}` : `🔇 ${t.soundOff}`}
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 2: UPLOAD IMAGE */}
            {activeTab === "upload" && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center space-y-4'>
                    <input
                        type='file'
                        ref={fileInputRef}
                        accept='image/png, image/jpeg, image/webp'
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileUpload(f);
                        }}
                        className='hidden'
                    />

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className='w-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-colors bg-gray-50 dark:bg-gray-800/40 space-y-3'
                    >
                        <div className='w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-3xl mx-auto'>
                            📁
                        </div>
                        <h3 className='text-base font-bold text-gray-800 dark:text-gray-200'>
                            {t.dropImage}
                        </h3>
                        <p className='text-xs text-gray-400'>{t.uploadHint}</p>
                    </div>

                    {uploadedImageSrc && (
                        <div className='max-w-xs aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm'>
                            <img src={uploadedImageSrc} alt='Uploaded' className='w-full h-full object-contain' />
                        </div>
                    )}
                </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
                <div className='w-full p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl text-xs text-red-600 dark:text-red-300 flex items-center gap-2'>
                    <span>⚠️</span>
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Scanned Result Card */}
            {scannedResult && (
                <div className='w-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-emerald-200 dark:border-emerald-800 space-y-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <span className='px-2.5 py-1 rounded-full text-xs font-black bg-emerald-600 text-white uppercase tracking-wider'>
                                {scannedType === "url" ? t.typeUrl : scannedType === "wifi" ? t.typeWifi : t.typeText}
                            </span>
                            <span className='text-xs font-bold text-gray-500 dark:text-gray-400'>
                                {t.scannedResult}
                            </span>
                        </div>
                    </div>

                    <div className='p-4 rounded-2xl bg-white dark:bg-gray-800 border border-emerald-100 dark:border-gray-700 shadow-inner'>
                        <p className='text-sm sm:text-base font-mono font-bold text-gray-900 dark:text-white break-all select-all leading-relaxed'>
                            {scannedResult}
                        </p>
                    </div>

                    <div className='flex flex-wrap items-center gap-3'>
                        {scannedType === "url" && (
                            <a
                                href={scannedResult}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-colors inline-flex items-center gap-1.5'
                            >
                                🔗 {t.openLink}
                            </a>
                        )}

                        <Button
                            onClick={handleCopy}
                            variant='primary'
                            size='md'
                            className='cursor-pointer text-xs font-bold'
                        >
                            📋 {t.copyContent}
                        </Button>

                        <Button
                            onClick={() => {
                                setScannedResult(null);
                                if (activeTab === "camera") startCamera();
                            }}
                            variant='secondary'
                            size='md'
                            className='cursor-pointer text-xs font-bold'
                        >
                            🔄 {t.scanAgain}
                        </Button>
                    </div>
                </div>
            )}

            {/* Scan History */}
            {history.length > 0 && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                    <div className='flex items-center justify-between'>
                        <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>📋</span> {t.historyTitle}
                        </h4>
                        <button
                            onClick={() => setHistory([])}
                            className='text-xs font-semibold text-gray-400 hover:text-red-500 cursor-pointer'
                        >
                            ✕ {t.clearHistory}
                        </button>
                    </div>

                    <div className='divide-y divide-gray-100 dark:divide-gray-800 text-xs'>
                        {history.map((item) => (
                            <div key={item.id} className='py-2.5 flex items-center justify-between gap-4'>
                                <div className='flex-1 truncate'>
                                    <span className='font-mono font-semibold text-gray-800 dark:text-gray-200 mr-2'>
                                        {item.text}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2 shrink-0'>
                                    <span className='text-[10px] text-gray-400 font-mono'>{item.timestamp}</span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(item.text);
                                            toast.success(t.copied);
                                        }}
                                        className='text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer'
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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
