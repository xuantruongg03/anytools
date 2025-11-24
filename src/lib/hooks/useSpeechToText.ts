import { useState, useCallback } from "react";

export type ServiceProvider = "auto" | "fpt-ai" | "azure";

interface UseSpeechToTextReturn {
    transcription: string;
    isLoading: boolean;
    error: string | null;
    convertFileToText: (file: File, provider?: ServiceProvider) => Promise<void>;
    convertAudioToText: (audioBlob: Blob, provider?: ServiceProvider) => Promise<void>;
    clearTranscription: () => void;
}

export const useSpeechToText = (): UseSpeechToTextReturn => {
    const [transcription, setTranscription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const convertFileToText = useCallback(async (file: File, provider: ServiceProvider = "auto") => {
        try {
            setIsLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("audio", file);
            formData.append("mode", "file");
            formData.append("provider", provider);

            const response = await fetch("/api/speech-to-text", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to convert audio to text");
            }

            const data = await response.json();
            setTranscription(data.text || "");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            console.error("Error converting file to text:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const convertAudioToText = useCallback(async (audioBlob: Blob, provider: ServiceProvider = "auto") => {
        try {
            setIsLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.webm");
            formData.append("mode", "recording");
            formData.append("provider", provider);

            const response = await fetch("/api/speech-to-text", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to convert audio to text");
            }

            const data = await response.json();
            setTranscription(data.text || "");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            console.error("Error converting audio to text:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearTranscription = useCallback(() => {
        setTranscription("");
        setError(null);
    }, []);

    return {
        transcription,
        isLoading,
        error,
        convertFileToText,
        convertAudioToText,
        clearTranscription,
    };
};
