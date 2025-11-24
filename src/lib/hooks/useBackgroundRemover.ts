import { useState, useCallback } from "react";

export type ServiceProvider = "auto" | "removebg" | "photoroom" | "clipdrop";

interface UseBackgroundRemoverReturn {
    resultImage: string | null;
    isProcessing: boolean;
    error: string | null;
    success: string | null;
    removeBackground: (file: File, provider?: ServiceProvider) => Promise<void>;
    clearResult: () => void;
}

export const useBackgroundRemover = (): UseBackgroundRemoverReturn => {
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const removeBackground = useCallback(async (file: File, provider: ServiceProvider = "auto") => {
        try {
            setIsProcessing(true);
            setError(null);
            setSuccess(null);

            const formData = new FormData();
            formData.append("image", file);
            formData.append("provider", provider);

            const response = await fetch("/api/remove-background", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to remove background");
            }

            // Response is binary image data, create blob URL
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            setResultImage(imageUrl);
            setSuccess("Background removed successfully!");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            console.error("Error removing background:", err);
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const clearResult = useCallback(() => {
        if (resultImage) {
            // Clean up object URL if it was created locally
            if (resultImage.startsWith("blob:")) {
                URL.revokeObjectURL(resultImage);
            }
        }
        setResultImage(null);
        setError(null);
        setSuccess(null);
    }, [resultImage]);

    return {
        resultImage,
        isProcessing,
        error,
        success,
        removeBackground,
        clearResult,
    };
};
