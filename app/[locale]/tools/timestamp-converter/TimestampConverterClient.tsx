"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function TimestampConverterClient() {
    const [timestamp, setTimestamp] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        setCurrentTime(Date.now());
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const convertToDate = () => {
        const ts = parseInt(timestamp);
        if (isNaN(ts)) return;
        const date = new Date(ts * (timestamp.length === 10 ? 1000 : 1));
        setDateTime(date.toLocaleString());
    };

    const convertToTimestamp = () => {
        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return;
        setTimestamp(Math.floor(date.getTime() / 1000).toString());
    };

    const getCurrentTimestamp = () => {
        const now = Math.floor(Date.now() / 1000);
        setTimestamp(now.toString());
        convertToDate();
    };

    return (
        <div className='space-y-6'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>Current Timestamp</h2>
                <div className='text-3xl font-mono text-blue-600 dark:text-blue-400 mb-4'>{Math.floor(currentTime / 1000)}</div>
                <Button onClick={getCurrentTimestamp} variant='primary'>
                    Get Current Timestamp
                </Button>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>Timestamp to Date</h2>
                <input type='text' value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder='Enter Unix timestamp (e.g., 1700000000)' className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 mb-4' />
                <Button onClick={convertToDate} variant='primary' size='lg' fullWidth className='mb-4'>
                    Convert to Date
                </Button>
                {dateTime && (
                    <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                        <div className='font-mono text-gray-900 dark:text-gray-100'>{dateTime}</div>
                    </div>
                )}
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>Date to Timestamp</h2>
                <input type='datetime-local' value={dateTime} onChange={(e) => setDateTime(e.target.value)} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 mb-4' />
                <Button onClick={convertToTimestamp} variant='primary' size='lg' fullWidth>
                    Convert to Timestamp
                </Button>
            </div>
        </div>
    );
}
