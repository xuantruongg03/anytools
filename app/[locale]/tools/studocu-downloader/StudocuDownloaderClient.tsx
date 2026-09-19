"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";

export default function StudocuDownloaderClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const tool_t = t.tools.studocuDownloader;
    const maintenance = (tool_t as any).maintenanceNotice || {};

    const [docUrl, setDocUrl] = useState("");

    // Tool is under maintenance — all download functionality is disabled
    const isUnderMaintenance = true;

    const extensionUrl = `/${locale}/browser-extensions#studocu-downloader`;

    return (
        <div className='space-y-6'>
            {/* ====== HIGH-VISIBILITY MAINTENANCE BANNER ====== */}
            {isUnderMaintenance && (
                <div className='relative overflow-hidden rounded-2xl border-2 border-amber-400 dark:border-amber-500/70 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/60 dark:via-orange-950/40 dark:to-yellow-950/30 p-5 sm:p-6 shadow-lg shadow-amber-200/30 dark:shadow-amber-900/20'>
                    {/* Decorative pulse dot */}
                    <div className='absolute top-4 right-4'>
                        <span className='relative flex h-3.5 w-3.5'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75'></span>
                            <span className='relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500'></span>
                        </span>
                    </div>

                    {/* Badge */}
                    <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 dark:bg-amber-500/25 border border-amber-400/50 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs font-bold mb-3'>
                        <span>{maintenance.badge || "⚠️ Maintenance"}</span>
                    </div>

                    {/* Title */}
                    <h3 className='text-lg sm:text-xl font-extrabold text-amber-900 dark:text-amber-200 mb-2'>
                        {maintenance.title || "This tool is temporarily unavailable"}
                    </h3>

                    {/* Description */}
                    <p className='text-sm sm:text-base text-amber-800/90 dark:text-amber-300/90 leading-relaxed mb-4'>
                        {maintenance.description || "Our online StuDocu downloader is currently experiencing technical issues. We have developed a browser extension as a reliable alternative."}
                    </p>

                    {/* CTA Button */}
                    <a
                        href={extensionUrl}
                        className='inline-flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0'
                    >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                        </svg>
                        <span>{maintenance.ctaText || "Use StuDocu Downloader Extension (Recommended)"}</span>
                    </a>
                </div>
            )}

            {/* ====== ORIGINAL TOOL UI (DISABLED) ====== */}
            <div className={isUnderMaintenance ? 'opacity-50 pointer-events-none select-none' : ''}>
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                    <div className='mb-4'>
                        <h1 className='text-2xl font-bold mb-2 text-gray-900 dark:text-white'>{tool_t.name}</h1>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.description}</p>
                    </div>

                    {/* Input Section */}
                    <div className='space-y-4'>
                        {/* URL Input */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool_t.urlLabel || "StuDocu URL"}</label>
                            <input
                                type='text'
                                value={docUrl}
                                onChange={(e) => setDocUrl(e.target.value)}
                                placeholder={isUnderMaintenance ? (maintenance.inputPlaceholder || "Download temporarily unavailable") : (tool_t.urlPlaceholder || "https://www.studocu.com/...")}
                                disabled={isUnderMaintenance}
                                className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900/50'
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className='flex gap-2'>
                            <button
                                disabled={true}
                                className='flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                            >
                                <span>📚 {tool_t.download || "Download Document"}</span>
                            </button>
                            <button
                                disabled={true}
                                className='px-4 py-2.5 bg-gray-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                            >
                                {tool_t.clear || "Clear"}
                            </button>
                        </div>

                        {/* Info Note */}
                        <div className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                            <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                            </svg>
                            <span>{(tool_t as any).infoNote || "Documents will be downloaded in their original format"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
