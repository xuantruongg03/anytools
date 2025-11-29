"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { useWeatherData, useGeolocation, useLocationSearch, type LocationAddress } from "@/lib/hooks";
import { ServiceProviderSelector, ServiceProviderOption } from "@/components";

export default function WeatherClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const weather_t = t.tools.weather;

    // Custom hooks
    const { weather, forecast, hourlyForecast, loading, error: weatherError, unit, provider, setUnit, setProvider, fetchWeatherByCoords, fetchWeatherByCity, clearError: clearWeatherError } = useWeatherData();

    const { address, loading: geoLoading, error: geoError, setAddress, reverseGeocode, getCurrentPosition } = useGeolocation();

    const { searchQuery, suggestions, showSuggestions, loading: searchLoading, setSearchQuery, setShowSuggestions, clearSearch } = useLocationSearch(500);

    const error = useMemo(() => weatherError || geoError, [weatherError, geoError]);

    // Weather provider options
    const providerOptions: ServiceProviderOption<"openweather" | "weatherapi" | "accuweather" | "vietnam">[] = useMemo(
        () => [
            { value: "openweather", label: "OpenWeather", icon: "🌍" },
            { value: "weatherapi", label: "WeatherAPI", icon: "🌤️" },
            { value: "accuweather", label: "AccuWeather", icon: "⚡" },
            { value: "vietnam", label: "Vietnam Weather", icon: "🇻🇳" },
        ],
        []
    );

    // Memoized helper functions
    const getWeatherIcon = useCallback((iconCode: string) => {
        return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    }, []);

    const formatTime = useCallback((timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }, []);

    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
    }, []);

    // Memoized event handlers
    const getCurrentLocationWeather = useCallback(async () => {
        try {
            clearWeatherError();
            const position = await getCurrentPosition();
            await reverseGeocode(position.latitude, position.longitude);
            await fetchWeatherByCoords(position.latitude, position.longitude);
        } catch (err) {
            console.error("Geolocation error:", err);
        }
    }, [clearWeatherError, getCurrentPosition, reverseGeocode, fetchWeatherByCoords]);

    const handleSearchSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            // If there are suggestions, use the first one
            if (suggestions.length > 0) {
                const suggestion = suggestions[0];
                setAddress(suggestion);
                clearSearch();
                await fetchWeatherByCoords(suggestion.lat, suggestion.lon);
                return;
            }

            if (!searchQuery.trim()) return;

            try {
                await fetchWeatherByCity(searchQuery);
                clearSearch();
            } catch (err) {
                console.error("Search error:", err);
            }
        },
        [suggestions, searchQuery, setAddress, clearSearch, fetchWeatherByCoords, fetchWeatherByCity]
    );

    const handleSelectSuggestion = useCallback(
        async (suggestion: LocationAddress) => {
            setAddress(suggestion);
            clearSearch();
            await fetchWeatherByCoords(suggestion.lat, suggestion.lon);
        },
        [setAddress, clearSearch, fetchWeatherByCoords]
    );

    const handleUnitChange = useCallback(
        (newUnit: "metric" | "imperial") => {
            setUnit(newUnit);
        },
        [setUnit]
    );

    const handleProviderChange = useCallback(
        (newProvider: "openweather" | "weatherapi" | "accuweather" | "vietnam") => {
            setProvider(newProvider);
        },
        [setProvider]
    );

    // Tự động lấy vị trí khi component mount
    useEffect(() => {
        getCurrentLocationWeather();
    }, [getCurrentLocationWeather]);

    return (
        <div className='space-y-6'>
            {/* Header & Search */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>{weather_t.name}</h1>
                        <p className='text-gray-600 dark:text-gray-400'>{weather_t.description}</p>
                    </div>

                    {/* Unit Toggle */}
                    <div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1'>
                        <button onClick={() => handleUnitChange("metric")} className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${unit === "metric" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                            °C
                        </button>
                        <button onClick={() => handleUnitChange("imperial")} className={`px-4 py-2 rounded-md transition-colors cursor-pointer ${unit === "imperial" ? "bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                            °F
                        </button>
                    </div>
                </div>

                {/* Weather Provider Selection */}
                <ServiceProviderSelector value={provider} onChange={handleProviderChange} options={providerOptions} label={weather_t.weatherProvider || "Weather Data Provider"} hint={weather_t.providerNote || "Different providers may show slightly different results. Vietnam Weather is optimized for Vietnamese locations."} className='mt-4' />

                {/* Search Form */}
                <div className='mt-6 relative'>
                    <form onSubmit={handleSearchSubmit} className='flex gap-2'>
                        <div className='flex-1 relative'>
                            <input
                                type='text'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder={weather_t.searchPlaceholder}
                                className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
                            />
                            {searchLoading && (
                                <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                                    <div className='animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full'></div>
                                </div>
                            )}

                            {/* Search Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className='absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto'>
                                    {suggestions.map((suggestion, index) => (
                                        <button key={index} type='button' onClick={() => handleSelectSuggestion(suggestion)} className='w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer transition-colors'>
                                            <p className='font-medium text-gray-900 dark:text-white text-sm'>
                                                📍 {suggestion.city}, {suggestion.country}
                                            </p>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 truncate'>{suggestion.display}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button type='submit' disabled={loading || searchLoading} className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer'>
                            {loading ? (
                                <div className='flex items-center gap-2'>
                                    <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
                                    <span>{weather_t.loading || "Loading..."}</span>
                                </div>
                            ) : (
                                <>🔍 {weather_t.search}</>
                            )}
                        </button>
                        <button type='button' onClick={getCurrentLocationWeather} disabled={loading} className='px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer'>
                            {loading ? <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div> : <>📍 {weather_t.useMyLocation}</>}
                        </button>
                    </form>
                </div>

                {/* Current Address Display */}
                {address && (
                    <div className='mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                        <p className='text-sm font-medium text-blue-900 dark:text-blue-300 mb-1'>📌 {weather_t.currentLocation || "Current Location"}:</p>
                        <p className='text-sm text-blue-700 dark:text-blue-400'>{address.display}</p>
                    </div>
                )}

                {error && (
                    <div className='mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                        <p className='text-red-600 dark:text-red-400'>❌ {error}</p>
                    </div>
                )}
            </div>

            {/* Loading State */}
            {loading && (
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center'>
                    <div className='animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>{weather_t.loading}</p>
                </div>
            )}

            {/* Current Weather */}
            {weather && !loading && (
                <>
                    <div className='bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-xl shadow-lg p-8 text-white'>
                        <div className='flex flex-col md:flex-row items-center justify-between'>
                            <div className='text-center md:text-left'>
                                <h2 className='text-4xl font-bold mb-2'>
                                    {address?.city || weather.location}
                                    {(address?.city || weather.location) && (address?.country || weather.country) ? ", " : ""}
                                    {address?.country || weather.country}
                                </h2>
                                {address && <p className='text-sm opacity-75 mb-2 max-w-md'>📍 {address.display}</p>}
                                <p className='text-6xl font-bold my-4'>
                                    {Math.round(weather.temperature)}°{unit === "metric" ? "C" : "F"}
                                </p>
                                <p className='text-xl capitalize opacity-90'>{weather.description}</p>
                                <p className='text-sm opacity-75 mt-2'>
                                    {weather_t.feelsLike}: {Math.round(weather.feelsLike)}°{unit === "metric" ? "C" : "F"}
                                </p>
                            </div>
                            <div className='mt-6 md:mt-0'>
                                <img src={getWeatherIcon(weather.icon)} alt={weather.description} className='w-48 h-48 drop-shadow-2xl' />
                            </div>
                        </div>

                        {/* Weather Details Grid */}
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8'>
                            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                                <p className='text-sm opacity-75'>{weather_t.humidity}</p>
                                <p className='text-2xl font-bold'>{weather.humidity}%</p>
                            </div>
                            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                                <p className='text-sm opacity-75'>{weather_t.wind}</p>
                                <p className='text-2xl font-bold'>
                                    {weather.windSpeed.toFixed(1)} {unit === "metric" ? "m/s" : "mph"}
                                </p>
                            </div>
                            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                                <p className='text-sm opacity-75'>{weather_t.pressure}</p>
                                <p className='text-2xl font-bold'>{Math.round(weather.pressure)} hPa</p>
                            </div>
                            <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4'>
                                <p className='text-sm opacity-75'>{weather_t.visibility}</p>
                                <p className='text-2xl font-bold'>{(weather.visibility / 1000).toFixed(1)} km</p>
                            </div>
                        </div>

                        {/* Sunrise & Sunset */}
                        <div className='flex justify-around mt-6 pt-6 border-t border-white/20'>
                            <div className='text-center'>
                                <p className='text-sm opacity-75'>🌅 {weather_t.sunrise}</p>
                                <p className='text-xl font-semibold'>{formatTime(weather.sunrise)}</p>
                            </div>
                            <div className='text-center'>
                                <p className='text-sm opacity-75'>🕐 {weather_t.currentTime || "Current Time"}</p>
                                <p className='text-xl font-semibold'>{formatTime(weather.timestamp)}</p>
                            </div>
                            <div className='text-center'>
                                <p className='text-sm opacity-75'>🌇 {weather_t.sunset}</p>
                                <p className='text-xl font-semibold'>{formatTime(weather.sunset)}</p>
                            </div>
                        </div>
                    </div>

                    {/* 12-Hour Forecast */}
                    {hourlyForecast.length > 0 && (
                        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                            <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>{weather_t.hourlyForecast || "12-Hour Forecast"}</h3>
                            <div className='overflow-x-auto'>
                                <div className='flex gap-4 pb-2' style={{ minWidth: "max-content" }}>
                                    {hourlyForecast.map((hour, index) => {
                                        const hourTime = new Date(hour.time * 1000);
                                        const timeStr = hourTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                                        const dateStr = hourTime.toLocaleDateString([], { month: "short", day: "numeric" });

                                        return (
                                            <div key={index} className='shrink-0 w-32 bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center hover:shadow-lg transition-all hover:scale-105'>
                                                <p className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>{timeStr}</p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400 mb-3'>{dateStr}</p>
                                                <img src={getWeatherIcon(hour.icon)} alt={hour.description} className='w-16 h-16 mx-auto' />
                                                <p className='text-2xl font-bold text-gray-900 dark:text-white my-2'>
                                                    {Math.round(hour.temp)}°{unit === "metric" ? "C" : "F"}
                                                </p>
                                                <p className='text-xs text-gray-600 dark:text-gray-400 capitalize mb-2'>{hour.description}</p>
                                                <div className='flex items-center justify-center gap-3 text-xs text-gray-600 dark:text-gray-400'>
                                                    <span>💧 {hour.humidity}%</span>
                                                    <span>💨 {hour.windSpeed.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-4'>← {weather_t.scrollToView || "Scroll to view all hours"} →</p>
                        </div>
                    )}

                    {/* 5-Day Forecast */}
                    {forecast.length > 0 && (
                        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                            <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>{weather_t.forecast}</h3>
                            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
                                {forecast.map((day, index) => (
                                    <div key={index} className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow'>
                                        <p className='font-semibold text-gray-900 dark:text-white mb-2'>{formatDate(day.date)}</p>
                                        <img src={getWeatherIcon(day.icon)} alt={day.description} className='w-20 h-20 mx-auto' />
                                        <p className='text-2xl font-bold text-gray-900 dark:text-white my-2'>
                                            {Math.round(day.temp)}°{unit === "metric" ? "C" : "F"}
                                        </p>
                                        <p className='text-sm text-gray-600 dark:text-gray-400 capitalize'>{day.description}</p>
                                        <p className='text-xs text-gray-500 dark:text-gray-500 mt-2'>💧 {day.humidity}%</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
