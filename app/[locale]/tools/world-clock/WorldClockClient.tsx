"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { useState, useEffect } from "react";

type TimezoneData = {
    city: string;
    timezone: string;
    utcOffset: string;
};

const TIMEZONES: TimezoneData[] = [
    { city: "New York", timezone: "America/New_York", utcOffset: "UTC-5" },
    { city: "London", timezone: "Europe/London", utcOffset: "UTC+0" },
    { city: "Tokyo", timezone: "Asia/Tokyo", utcOffset: "UTC+9" },
    { city: "Sydney", timezone: "Australia/Sydney", utcOffset: "UTC+10" },
    { city: "Paris", timezone: "Europe/Paris", utcOffset: "UTC+1" },
    { city: "Dubai", timezone: "Asia/Dubai", utcOffset: "UTC+4" },
    { city: "Singapore", timezone: "Asia/Singapore", utcOffset: "UTC+8" },
    { city: "Hong Kong", timezone: "Asia/Hong_Kong", utcOffset: "UTC+8" },
    { city: "Los Angeles", timezone: "America/Los_Angeles", utcOffset: "UTC-8" },
    { city: "Moscow", timezone: "Europe/Moscow", utcOffset: "UTC+3" },
    { city: "Beijing", timezone: "Asia/Shanghai", utcOffset: "UTC+8" },
    { city: "Mumbai", timezone: "Asia/Kolkata", utcOffset: "UTC+5:30" },
    { city: "Bangkok", timezone: "Asia/Bangkok", utcOffset: "UTC+7" },
    { city: "Seoul", timezone: "Asia/Seoul", utcOffset: "UTC+9" },
    { city: "Istanbul", timezone: "Europe/Istanbul", utcOffset: "UTC+3" },
    { city: "Berlin", timezone: "Europe/Berlin", utcOffset: "UTC+1" },
    { city: "Toronto", timezone: "America/Toronto", utcOffset: "UTC-5" },
    { city: "Chicago", timezone: "America/Chicago", utcOffset: "UTC-6" },
    { city: "Mexico City", timezone: "America/Mexico_City", utcOffset: "UTC-6" },
    { city: "São Paulo", timezone: "America/Sao_Paulo", utcOffset: "UTC-3" },
    { city: "Ho Chi Minh City", timezone: "Asia/Ho_Chi_Minh", utcOffset: "UTC+7" },
    { city: "Hanoi", timezone: "Asia/Ho_Chi_Minh", utcOffset: "UTC+7" },
];

export default function WorldClockClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.tools.worldClock.page;

    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedTimezones, setSelectedTimezones] = useState<TimezoneData[]>([
        TIMEZONES[0], // New York
        TIMEZONES[1], // London
        TIMEZONES[2], // Tokyo
        TIMEZONES[20], // Ho Chi Minh City
    ]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (timezone: string) => {
        return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(currentTime);
    };

    const formatDate = (timezone: string) => {
        return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
            timeZone: timezone,
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(currentTime);
    };

    const addTimezone = (tz: TimezoneData) => {
        if (!selectedTimezones.find((t) => t.timezone === tz.timezone)) {
            setSelectedTimezones([...selectedTimezones, tz]);
        }
        setSearchQuery("");
    };

    const removeTimezone = (timezone: string) => {
        setSelectedTimezones(selectedTimezones.filter((tz) => tz.timezone !== timezone));
    };

    const filteredTimezones = TIMEZONES.filter((tz) => tz.city.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedTimezones.find((t) => t.timezone === tz.timezone));

    return (
        <div className='max-w-6xl mx-auto'>

            {/* Add Timezone */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>{page.addCity}</h2>
                <input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={page.searchPlaceholder} className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4' />

                {searchQuery && (
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                        {filteredTimezones.map((tz) => (
                            <button key={tz.timezone} onClick={() => addTimezone(tz)} className='px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg transition-colors'>
                                {tz.city}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Clock Display */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {selectedTimezones.map((tz) => (
                    <div key={tz.timezone} className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative'>
                        <button onClick={() => removeTimezone(tz.timezone)} className='absolute top-4 right-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300' title={page.remove}>
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>

                        <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>{tz.city}</h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>{tz.utcOffset}</p>

                        <div className='text-5xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-4'>{formatTime(tz.timezone)}</div>

                        <p className='text-sm text-gray-600 dark:text-gray-400'>{formatDate(tz.timezone)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
