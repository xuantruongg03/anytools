import { useState, useCallback } from "react";

interface UseImageToTextReturn {
    extractedText: string | null;
    isProcessing: boolean;
    error: string | null;
    success: string | null;
    usedService: string | null;
    extractText: (file: File, language?: string, provider?: string) => Promise<void>;
    clearResult: () => void;
}

export const useImageToText = (): UseImageToTextReturn => {
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [usedService, setUsedService] = useState<string | null>(null);

    const extractText = useCallback(async (file: File, language: string = "en", provider: string = "auto") => {
        try {
            setIsProcessing(true);
            setError(null);
            setSuccess(null);
            setUsedService(null);

            const formData = new FormData();
            formData.append("image", file);
            formData.append("language", language);
            formData.append("provider", provider);

            const response = await fetch("/api/image-to-text", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to extract text from image");
            }

            setExtractedText(data.text || "");
            setUsedService(data.usedService || null);
            setSuccess(data.text ? "Text extracted successfully!" : "No text found in the image.");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            console.error("Error extracting text:", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const clearResult = useCallback(() => {
        setExtractedText(null);
        setError(null);
        setSuccess(null);
        setUsedService(null);
    }, []);

    return {
        extractedText,
        isProcessing,
        error,
        success,
        usedService,
        extractText,
        clearResult,
    };
};
