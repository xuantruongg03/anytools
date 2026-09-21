"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { screenRecorderTranslations } from "@/lib/i18n/tools/screen-recorder";
import { toast } from "@/components/ui/Toast";

type RecordMode = "screen" | "camera" | "both";
type AudioMode = "mic" | "system" | "mute";

export default function ScreenRecorderContent() {
    const { locale } = useLanguage();
    const t = screenRecorderTranslations[locale as "en" | "vi"] || screenRecorderTranslations.en;
    const isVi = locale === "vi";

    const [recordMode, setRecordMode] = useState<RecordMode>("screen");
    const [audioMode, setAudioMode] = useState<AudioMode>("mic");

    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);

    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const liveVideoRef = useRef<HTMLVideoElement>(null);

    // Format seconds into MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Clean up streams
    const stopStreamTracks = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    };

    // Start Recording
    const handleStart = async () => {
        chunksRef.current = [];
        setRecordedUrl(null);
        setElapsedTime(0);

        try {
            let combinedStream: MediaStream;

            if (recordMode === "camera") {
                combinedStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: audioMode === "mic",
                });
            } else {
                // Screen or Screen+Camera
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: audioMode === "system" || audioMode === "mic",
                });

                if (audioMode === "mic") {
                    try {
                        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        micStream.getAudioTracks().forEach((track) => screenStream.addTrack(track));
                    } catch (err) {
                        console.warn("Microphone not added:", err);
                    }
                }

                combinedStream = screenStream;
            }

            streamRef.current = combinedStream;

            if (liveVideoRef.current) {
                liveVideoRef.current.srcObject = combinedStream;
                liveVideoRef.current.play().catch(() => {});
            }

            // Handle user clicking "Stop sharing" on browser native bar
            combinedStream.getVideoTracks()[0].onended = () => {
                handleStop();
            };

            // Setup MediaRecorder
            const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
                ? "video/webm;codecs=vp9,opus"
                : "video/webm";

            const recorder = new MediaRecorder(combinedStream, { mimeType });

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                const url = URL.createObjectURL(blob);
                setRecordedUrl(url);
                stopStreamTracks();
                if (timerRef.current) clearInterval(timerRef.current);
                setIsRecording(false);
                setIsPaused(false);
            };

            recorder.start(1000); // 1-second chunks
            recorderRef.current = recorder;
            setIsRecording(true);
            setIsPaused(false);

            // Start timer
            timerRef.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Recording error:", err);
            toast.error(isVi ? "Không thể truy cập màn hình hoặc camera!" : "Could not access screen or camera!");
            setIsRecording(false);
        }
    };

    const handlePause = () => {
        if (recorderRef.current && recorderRef.current.state === "recording") {
            recorderRef.current.pause();
            setIsPaused(true);
        }
    };

    const handleResume = () => {
        if (recorderRef.current && recorderRef.current.state === "paused") {
            recorderRef.current.resume();
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
            recorderRef.current.stop();
        }
    };

    useEffect(() => {
        return () => {
            stopStreamTracks();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-6'>
            {/* Setup Controls (when not recording & no finished video) */}
            {!isRecording && !recordedUrl && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-6'>
                    <div>
                        <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                            {isVi ? "Chọn Chế Độ Ghi Hình" : "Capture Mode"}
                        </label>
                        <div className='grid grid-cols-2 gap-3'>
                            <button
                                type='button'
                                onClick={() => setRecordMode("screen")}
                                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                                    recordMode === "screen"
                                        ? "bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-900 dark:text-blue-200 font-bold shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                                }`}
                            >
                                <div className='text-3xl mb-1'>🖥️</div>
                                <div>{t.modeScreen}</div>
                            </button>

                            <button
                                type='button'
                                onClick={() => setRecordMode("camera")}
                                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                                    recordMode === "camera"
                                        ? "bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-900 dark:text-blue-200 font-bold shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                                }`}
                            >
                                <div className='text-3xl mb-1'>📹</div>
                                <div>{t.modeCamera}</div>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                            {t.audioSource}
                        </label>
                        <div className='grid grid-cols-3 gap-2'>
                            <button
                                type='button'
                                onClick={() => setAudioMode("mic")}
                                className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                                    audioMode === "mic"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                🎙️ {t.audioMic}
                            </button>

                            <button
                                type='button'
                                onClick={() => setAudioMode("system")}
                                className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                                    audioMode === "system"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                🔊 {t.audioSystem}
                            </button>

                            <button
                                type='button'
                                onClick={() => setAudioMode("mute")}
                                className={`py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                                    audioMode === "mute"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                                }`}
                            >
                                🔇 {t.audioMute}
                            </button>
                        </div>
                    </div>

                    <Button
                        onClick={handleStart}
                        variant='primary'
                        size='lg'
                        className='w-full py-4 text-base font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2'
                    >
                        <span>🔴</span>
                        <span>{t.startRecording}</span>
                    </Button>
                </div>
            )}

            {/* Live Recording HUD */}
            {isRecording && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                    <div className='flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-100 dark:border-gray-800'>
                        <div className='flex items-center gap-2'>
                            <span className='w-3 h-3 rounded-full bg-red-500 animate-pulse' />
                            <span className='font-bold text-sm text-gray-900 dark:text-white'>
                                {isPaused ? t.statusPaused : t.statusRecording}
                            </span>
                        </div>
                        <div className='text-xl font-extrabold font-mono text-red-500'>
                            ⏱️ {formatTime(elapsedTime)}
                        </div>
                    </div>

                    {/* Live Video Preview Frame */}
                    <div className='w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center relative'>
                        <video ref={liveVideoRef} autoPlay muted playsInline className='w-full h-full object-contain' />
                    </div>

                    {/* Controls Bar */}
                    <div className='flex items-center gap-3 justify-center pt-2'>
                        {!isPaused ? (
                            <Button onClick={handlePause} variant='warning' size='lg' className='px-6 py-3 font-bold'>
                                ⏸️ {t.pauseRecording}
                            </Button>
                        ) : (
                            <Button onClick={handleResume} variant='success' size='lg' className='px-6 py-3 font-bold'>
                                ▶️ {t.resumeRecording}
                            </Button>
                        )}
                        <Button onClick={handleStop} variant='danger' size='lg' className='px-8 py-3 font-bold'>
                            ⏹️ {t.stopRecording}
                        </Button>
                    </div>
                </div>
            )}

            {/* Playback & Download Card */}
            {recordedUrl && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-6 text-center animate-fadeIn'>
                    <div className='flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-lg'>
                        <span>🎉</span>
                        <span>{t.statusComplete}</span>
                        <span className='text-sm font-mono text-gray-500'>({formatTime(elapsedTime)})</span>
                    </div>

                    <div className='w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-md max-w-2xl mx-auto'>
                        <video src={recordedUrl} controls className='w-full h-full object-contain' />
                    </div>

                    <div className='flex items-center justify-center gap-3 flex-wrap'>
                        <a
                            href={recordedUrl}
                            download={`recording_${Date.now()}.webm`}
                            className='inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all'
                        >
                            <span>💾</span>
                            <span>{t.downloadVideo}</span>
                        </a>

                        <Button
                            onClick={() => {
                                setRecordedUrl(null);
                                setElapsedTime(0);
                            }}
                            variant='secondary'
                            size='lg'
                            className='px-6 py-3.5 font-bold cursor-pointer'
                        >
                            🔄 {t.recordAgain}
                        </Button>
                    </div>
                </div>
            )}

            {/* Privacy Guarantee Note */}
            <div className='w-full p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2'>
                <span>🔒</span>
                <span>{t.privacyNotice}</span>
            </div>
        </div>
    );
}
