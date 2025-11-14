"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Link from "next/link";
import { useState } from "react";

export function FloatingButtons() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3'>
            {/* Expanded Buttons */}
            {isExpanded && (
                <div className='flex flex-col gap-3 animate-fadeIn'>
                    {/* GitHub Contribute Button */}
                    <a href={t.github.url} target='_blank' rel='noopener noreferrer' className='flex items-center gap-2 px-4 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-all hover:scale-105' title={t.github.contribute}>
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                            <path
                                fillRule='evenodd'
                                d='M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z'
                                clipRule='evenodd'
                            />
                        </svg>
                        <span className='font-medium whitespace-nowrap'>{t.github.contribute}</span>
                    </a>

                    {/* Donate Button */}
                    <Link href={t.donate.url} className='flex items-center gap-2 px-4 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg hover:from-pink-600 hover:to-rose-600 transition-all hover:scale-105' title={t.donate.title}>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
                        </svg>
                        <span className='font-medium whitespace-nowrap'>{t.donate.title}</span>
                    </Link>
                </div>
            )}

            {/* Toggle Button */}
            <button onClick={() => setIsExpanded(!isExpanded)} className='flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110' aria-label='Toggle actions'>
                {isExpanded ? (
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                ) : (
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                    </svg>
                )}
            </button>
        </div>
    );
}
