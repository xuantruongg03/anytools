import { useMutation } from "@tanstack/react-query";
import { shortenWithFallback } from "@/lib/api/urlShortener";

interface ShortenerResult {
    shortUrl: string;
    service: string;
}

export function useUrlShortener() {
    const mutation = useMutation({
        mutationFn: (longUrl: string) => shortenWithFallback(longUrl),
    });

    return {
        shortenUrl: mutation.mutate,
        isLoading: mutation.isPending,
        error: mutation.error ? { message: mutation.error.message } : null,
        result: mutation.data || null,
        reset: mutation.reset,
    };
}
