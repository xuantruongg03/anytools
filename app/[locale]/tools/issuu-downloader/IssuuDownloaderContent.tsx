"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { issuuDownloaderTranslations } from "@/lib/i18n/tools/issuu-downloader";
import IssuuDownloaderClient from "./IssuuDownloaderClient";

export default function IssuuDownloaderContent() {
    const { locale } = useLanguage();
    const t = issuuDownloaderTranslations[locale as "en" | "vi"] || issuuDownloaderTranslations.en;

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Tool Client */}
            <IssuuDownloaderClient />

            {/* How to Use Instructions */}
            <div className='w-full bg-white dark:bg-gray-900 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>📖</span> {t.howToUse}
                </h3>
                <ol className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300'>
                    <li className='flex gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800'>
                        <span className='font-black text-blue-600 dark:text-blue-400'>1.</span>
                        <span>{t.step1}</span>
                    </li>
                    <li className='flex gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800'>
                        <span className='font-black text-blue-600 dark:text-blue-400'>2.</span>
                        <span>{t.step2}</span>
                    </li>
                    <li className='flex gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800'>
                        <span className='font-black text-blue-600 dark:text-blue-400'>3.</span>
                        <span>{t.step3}</span>
                    </li>
                    <li className='flex gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800'>
                        <span className='font-black text-blue-600 dark:text-blue-400'>4.</span>
                        <span>{t.step4}</span>
                    </li>
                </ol>
            </div>

            {/* Features Grid */}
            <div className='w-full bg-white dark:bg-gray-900 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>✨</span> {t.features}
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5'>
                        <div className='font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>📄</span> {t.feature1Title}
                        </div>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.feature1Desc}</p>
                    </div>

                    <div className='p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5'>
                        <div className='font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>🔓</span> {t.feature2Title}
                        </div>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.feature2Desc}</p>
                    </div>

                    <div className='p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5'>
                        <div className='font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>⚡</span> {t.feature3Title}
                        </div>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.feature3Desc}</p>
                    </div>

                    <div className='p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-1.5'>
                        <div className='font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>💯</span> {t.feature4Title}
                        </div>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.feature4Desc}</p>
                    </div>
                </div>
            </div>

            {/* Guide & FAQ */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>💡</span> {t.guideTitle}
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>1. {t.guide1Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide1Desc}</p>
                    </div>

                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>2. {t.guide2Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide2Desc}</p>
                    </div>

                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>3. {t.guide3Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
