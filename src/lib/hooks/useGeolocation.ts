import { useState, useCallback } from "react";

export interface LocationAddress {
    display: string;
    city: string;
    country: string;
    lat: number;
    lon: number;
}

export const useGeolocation = () => {
    const [address, setAddress] = useState<LocationAddress | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const reverseGeocode = useCallback(async (lat: number, lon: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);

            if (!response.ok) {
                throw new Error("Failed to get address");
            }

            const locationAddress: LocationAddress = await response.json();
            setAddress(locationAddress);
            return locationAddress;
        } catch (err) {
            console.error("Reverse geocode error:", err);
            setError("Failed to get address");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurrentPosition = useCallback((): Promise<{ latitude: number; longitude: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported by your browser"));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }, []);

    const clearAddress = () => setAddress(null);
    const clearError = () => setError("");

    return {
        address,
        loading,
        error,
        setAddress,
        reverseGeocode,
        getCurrentPosition,
        clearAddress,
        clearError,
    };
};
