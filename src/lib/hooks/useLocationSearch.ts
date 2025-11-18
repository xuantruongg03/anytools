import { useState, useEffect, useCallback } from "react";
import { LocationAddress } from "./useGeolocation";

export const useLocationSearch = (debounceMs: number = 500) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<LocationAddress[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchQuery.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/geocode?query=${encodeURIComponent(searchQuery)}`);

                if (!response.ok) {
                    throw new Error("Failed to search locations");
                }

                const locationSuggestions: LocationAddress[] = await response.json();
                setSuggestions(locationSuggestions);
                setShowSuggestions(true);
            } catch (err) {
                console.error("Search error:", err);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, debounceMs);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, debounceMs]);

    const clearSearch = useCallback(() => {
        setSearchQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
    }, []);

    const hideSuggestions = useCallback(() => {
        setShowSuggestions(false);
    }, []);

    return {
        searchQuery,
        suggestions,
        showSuggestions,
        loading,
        setSearchQuery,
        setSuggestions,
        setShowSuggestions,
        clearSearch,
        hideSuggestions,
    };
};
