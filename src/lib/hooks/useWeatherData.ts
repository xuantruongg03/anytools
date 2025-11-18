import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface WeatherData {
    location: string;
    country: string;
    temperature: number;
    feelsLike: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    sunrise: number;
    sunset: number;
    timestamp: number;
}

interface ForecastData {
    date: string;
    temp: number;
    description: string;
    icon: string;
    humidity: number;
}

interface HourlyForecast {
    time: number;
    temp: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
}

interface WeatherResponse {
    current: WeatherData;
    forecast: ForecastData[];
    hourly: HourlyForecast[];
}

type WeatherProvider = "openweather" | "weatherapi" | "accuweather" | "vietnam";

interface WeatherQueryParams {
    lat?: number;
    lon?: number;
    city?: string;
    unit: "metric" | "imperial";
    provider: WeatherProvider;
}

const fetchWeather = async (params: WeatherQueryParams): Promise<WeatherResponse> => {
    const { lat, lon, city, unit, provider } = params;

    let url = `/api/weather?units=${unit}&provider=${provider}`;

    if (city) {
        url += `&city=${encodeURIComponent(city)}`;
    } else if (lat !== undefined && lon !== undefined) {
        url += `&lat=${lat}&lon=${lon}`;
    } else {
        throw new Error("Please provide either city name or coordinates");
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather");
    }

    return data;
};

export const useWeatherData = () => {
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");
    const [provider, setProvider] = useState<WeatherProvider>("openweather");
    const [queryParams, setQueryParams] = useState<WeatherQueryParams | null>(null);

    const { data, isLoading, error, refetch } = useQuery<WeatherResponse, Error>({
        queryKey: ["weather", queryParams, unit, provider],
        queryFn: () => fetchWeather({ ...queryParams!, unit, provider }),
        enabled: !!queryParams,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 2,
        refetchOnWindowFocus: true,
    });

    const fetchWeatherByCoords = async (lat: number, lon: number) => {
        setQueryParams({ lat, lon, unit, provider });
        return refetch();
    };

    const fetchWeatherByCity = async (city: string) => {
        setQueryParams({ city, unit, provider });
        return refetch();
    };

    return {
        weather: data?.current || null,
        forecast: data?.forecast || [],
        hourlyForecast: data?.hourly || [],
        loading: isLoading,
        error: error?.message || "",
        unit,
        provider,
        setUnit,
        setProvider,
        fetchWeatherByCoords,
        fetchWeatherByCity,
        clearError: () => {}, // Error auto-clears on successful refetch
    };
};
