"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record";

export default function MicrophoneTestClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.microphoneTest.client;

    const [isRecording, setIsRecording] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioQuality, setAudioQuality] = useState<{
        volume: string;
        quality: string;
        noiseLevel: string;
    } | null>(null);

    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const recordPluginRef = useRef<RecordPlugin | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            stopTesting();
        };
    }, []);

    useEffect(() => {
        if (isTesting && waveformRef.current && !wavesurferRef.current) {
            initWaveSurfer();
        }
    }, [isTesting]);

    const initWaveSurfer = async () => {
        if (!waveformRef.current) return;

        try {
            // Create WaveSurfer instance
            const wavesurfer = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: "#3b82f6",
                progressColor: "#1e40af",
                cursorColor: "#60a5fa",
                barWidth: 2,
                barGap: 1,
                barRadius: 2,
                height: 300,
                normalize: true,
            });

            wavesurferRef.current = wavesurfer;

            // Create Record plugin
            const record = wavesurfer.registerPlugin(
                RecordPlugin.create({
                    scrollingWaveform: true,
                    renderRecordedAudio: false,
                })
            );

            recordPluginRef.current = record;

            // Listen for recorded audio
            record.on("record-end", (blob: Blob) => {
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            });

            // Start recording/monitoring
            await record.startMic();

            // Get the media stream for analysis
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioDevice = devices.find((device) => device.kind === "audioinput");

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: audioDevice?.deviceId,
                    echoCancellation: true,
                    noiseSuppression: false,
                    autoGainControl: false,
                },
            });

            mediaStreamRef.current = stream;

            // Setup audio analysis
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.8;
            analyserRef.current = analyser;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            monitorAudioLevel();
            analyzeAudioQuality();
        } catch (err) {
            console.error("WaveSurfer init error:", err);
        }
    };

    const startTesting = async () => {
        try {
            setHasPermission(true);
            setIsTesting(true);
        } catch (err) {
            console.error("Microphone access error:", err);
            alert(locale === "vi" ? "Không thể truy cập microphone. Vui lòng cho phép quyền truy cập." : "Cannot access microphone. Please allow microphone access.");
        }
    };

    const stopTesting = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (recordPluginRef.current) {
            try {
                recordPluginRef.current.stopMic();
            } catch (err) {
                console.log("Record plugin already stopped");
            }
            recordPluginRef.current = null;
        }

        if (wavesurferRef.current) {
            try {
                wavesurferRef.current.destroy();
            } catch (err) {
                console.log("WaveSurfer already destroyed");
            }
            wavesurferRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
        }

        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        analyserRef.current = null;
        setIsTesting(false);
        setAudioLevel(0);
        setAudioQuality(null);
    };

    const monitorAudioLevel = () => {
        if (!analyserRef.current) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const monitor = () => {
            if (!analyserRef.current) return;

            animationFrameRef.current = requestAnimationFrame(monitor);
            analyser.getByteTimeDomainData(dataArray);

            // Calculate RMS audio level
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                const normalized = (dataArray[i] - 128) / 128;
                sum += normalized * normalized;
            }
            const rms = Math.sqrt(sum / bufferLength);
            const level = Math.min(100, rms * 500); // More sensitive
            setAudioLevel(level);
        };

        monitor();
    };

    const analyzeAudioQuality = () => {
        if (!analyserRef.current) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const analyze = () => {
            if (!analyserRef.current) return;

            analyser.getByteFrequencyData(dataArray);

            const sum = dataArray.reduce((a, b) => a + b, 0);
            const average = sum / bufferLength;

            let volume = "Low";
            let quality = "Poor";
            let noiseLevel = "High";

            if (average > 50) {
                volume = "Good";
                quality = "Good";
                noiseLevel = "Low";
            } else if (average > 30) {
                volume = "Medium";
                quality = "Fair";
                noiseLevel = "Medium";
            }

            setAudioQuality({ volume, quality, noiseLevel });

            setTimeout(analyze, 1000);
        };

        analyze();
    };

    const startRecording = () => {
        if (!recordPluginRef.current) return;

        try {
            recordPluginRef.current.startRecording();
            setIsRecording(true);
        } catch (err) {
            console.error("Recording error:", err);
        }
    };

    const stopRecording = () => {
        if (!recordPluginRef.current || !isRecording) return;

        try {
            recordPluginRef.current.stopRecording();
            setIsRecording(false);
        } catch (err) {
            console.error("Stop recording error:", err);
            setIsRecording(false);
        }
    };

    const downloadRecording = () => {
        if (!audioUrl) return;

        const a = document.createElement("a");
        a.href = audioUrl;
        a.download = `microphone-test-${Date.now()}.webm`;
        a.click();
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 max-w-6xl mx-auto'>

            {/* Control Buttons */}
            <div className='flex flex-wrap gap-3 justify-center mb-6'>
                {!isTesting ? (
                    <button onClick={startTesting} className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2'>
                        🎤 {t.startTest || "Start Test"}
                    </button>
                ) : (
                    <>
                        <button onClick={stopTesting} className='px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2'>
                            ⏹️ {t.stopTest || "Stop Test"}
                        </button>
                        {!isRecording ? (
                            <button onClick={startRecording} className='px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2'>
                                🔴 {t.startRecording || "Start Recording"}
                            </button>
                        ) : (
                            <button onClick={stopRecording} className='px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2'>
                                ⏸️ {t.stopRecording || "Stop Recording"}
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Audio Visualizer */}
            {isTesting && (
                <div className='mb-6'>
                    <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.waveform || "Audio Waveform"}</h3>
                    <div className='bg-gray-900 rounded-lg p-4'>
                        <div ref={waveformRef} className='w-full' />
                    </div>
                </div>
            )}

            {/* Audio Level Meter */}
            {isTesting && (
                <div className='mb-6'>
                    <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.volumeLevel || "Volume Level"}</h3>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden'>
                        <div className={`h-full transition-all duration-150 ${audioLevel > 70 ? "bg-red-500" : audioLevel > 40 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${audioLevel}%` }}></div>
                    </div>
                    <p className='text-center mt-2 text-gray-600 dark:text-gray-400'>{Math.round(audioLevel)}%</p>
                </div>
            )}

            {/* Audio Quality Analysis */}
            {isTesting && audioQuality && (
                <div className='mb-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                        <h4 className='font-semibold text-blue-900 dark:text-blue-300 mb-2'>{t.volume || "Volume"}</h4>
                        <p className='text-2xl font-bold text-blue-700 dark:text-blue-400'>{audioQuality.volume}</p>
                    </div>
                    <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4'>
                        <h4 className='font-semibold text-green-900 dark:text-green-300 mb-2'>{t.quality || "Quality"}</h4>
                        <p className='text-2xl font-bold text-green-700 dark:text-green-400'>{audioQuality.quality}</p>
                    </div>
                    <div className='bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4'>
                        <h4 className='font-semibold text-purple-900 dark:text-purple-300 mb-2'>{t.noiseLevel || "Noise Level"}</h4>
                        <p className='text-2xl font-bold text-purple-700 dark:text-purple-400'>{audioQuality.noiseLevel}</p>
                    </div>
                </div>
            )}

            {/* Recorded Audio Playback */}
            {audioUrl && (
                <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.recording || "Recording"}</h3>
                    <audio controls src={audioUrl} className='w-full mb-4' />
                    <button onClick={downloadRecording} className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-2'>
                        💾 {t.download || "Download Recording"}
                    </button>
                </div>
            )}

            {/* Info Message */}
            {!hasPermission && !isTesting && (
                <div className='mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
                    <p className='text-yellow-800 dark:text-yellow-300'>
                        <strong>ℹ️ {t.note || "Note"}:</strong> {t.permissionNote || "This tool requires microphone access. Click 'Start Test' and allow microphone permission when prompted."}
                    </p>
                </div>
            )}
        </div>
    );
}
