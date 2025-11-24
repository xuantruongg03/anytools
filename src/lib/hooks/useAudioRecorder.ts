import { useState, useRef, useCallback, useEffect } from "react";

interface UseAudioRecorderReturn {
    isRecording: boolean;
    isPaused: boolean;
    recordingTime: number;
    audioBlob: Blob | null;
    audioUrl: string | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
    clearRecording: () => void;
    error: string | null;
}

export const useAudioRecorder = (): UseAudioRecorderReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Start recording timer
    const startTimer = useCallback(() => {
        timerRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
        }, 1000);
    }, []);

    // Stop recording timer
    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            setError(null);
            chunksRef.current = [];

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            });

            streamRef.current = stream;

            // Create MediaRecorder
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4",
            });

            mediaRecorderRef.current = mediaRecorder;

            // Handle data available
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            // Handle recording stop
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));

                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                }
            };

            // Start recording
            mediaRecorder.start(100); // Collect data every 100ms
            setIsRecording(true);
            setIsPaused(false);
            setRecordingTime(0);
            startTimer();
        } catch (err) {
            console.error("Error starting recording:", err);
            setError(err instanceof Error ? err.message : "Failed to start recording");
        }
    }, [startTimer]);

    // Stop recording
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            stopTimer();
        }
    }, [isRecording, stopTimer]);

    // Pause recording
    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && !isPaused) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            stopTimer();
        }
    }, [isRecording, isPaused, stopTimer]);

    // Resume recording
    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && isPaused) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
            startTimer();
        }
    }, [isRecording, isPaused, startTimer]);

    // Clear recording
    const clearRecording = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
        chunksRef.current = [];
    }, [audioUrl]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTimer();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl, stopTimer]);

    return {
        isRecording,
        isPaused,
        recordingTime,
        audioBlob,
        audioUrl,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        clearRecording,
        error,
    };
};
