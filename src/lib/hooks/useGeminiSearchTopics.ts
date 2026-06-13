import { useState, useCallback } from "react";

interface UseGeminiSearchTopics {
    isLoading: boolean;
    error: string | null;
    generateTopics: (existingTopics: string[]) => Promise<string[]>;
}

export const useGeminiSearchTopics = (): UseGeminiSearchTopics => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateTopics = useCallback(async (existingTopics: string[]): Promise<string[]> => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/generate-topics", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ existingTopics }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch topics from the server.");
            }

            const data = await response.json();
            return data.topics || [];
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { isLoading, error, generateTopics };
};
