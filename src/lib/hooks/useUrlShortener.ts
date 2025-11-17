import { useMutation } from "@tanstack/react-query";
import { shortenUrl } from "@/lib/api/urlShortener";

export function useUrlShortener() {
    const mutation = useMutation({
        mutationFn: (longUrl: string) => shortenUrl(longUrl),
    });

    return {
        shortenUrl: mutation.mutate,
        isLoading: mutation.isPending,
        error: mutation.error ? { message: mutation.error.message } : null,
        result: mutation.data || null,
        reset: mutation.reset,
    };
}
