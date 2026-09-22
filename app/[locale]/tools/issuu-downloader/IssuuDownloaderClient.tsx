"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { issuuDownloaderTranslations } from "@/lib/i18n/tools/issuu-downloader";
import Button from "@/components/ui/Button";

interface DownloadResult {
    url: string;
    filename: string;
    format: string;
    title?: string;
    author?: string;
    thumbnail?: string;
}

export default function IssuuDownloaderClient() {
    const { locale } = useLanguage();
    const t = issuuDownloaderTranslations[locale as "en" | "vi"] || issuuDownloaderTranslations.en;

    const [docUrl, setDocUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<DownloadResult | null>(null);

    const isValidIssuuUrl = useCallback((url: string): boolean => {
        return /^https?:\/\/(www\.)?issuu\.com\/[a-zA-Z0-9_-]+\/docs\/[a-zA-Z0-9_-]+/i.test(url);
    }, []);

    const handleDownload = useCallback(async () => {
        if (!docUrl.trim()) {
            setError(t.emptyUrl);
            return;
        }

        if (!isValidIssuuUrl(docUrl)) {
            setError(t.invalidUrl);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const response = await fetch("/api/issuu-download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: docUrl.trim(),
                    format: "pdf",
                }),
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Failed to process Issuu publication");
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || "An error occurred while downloading");
        } finally {
            setLoading(false);
        }
    }, [docUrl, isValidIssuuUrl, t]);

    const handleClear = useCallback(() => {
        setDocUrl("");
        setError("");
        setResult(null);
    }, []);

    return (
        <div className='w-full space-y-6'>
            {/* Input Card */}
            <div className='bg-white dark:bg-gray-900 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800 space-y-5'>
                <div>
                    <label className='block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2'>
                        📚 {t.urlLabel}
                    </label>
                    <input
                        type='text'
                        value={docUrl}
                        onChange={(e) => setDocUrl(e.target.value)}
                        placeholder={t.urlPlaceholder}
                        className='w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all'
                    />
                </div>

                <div className='flex flex-wrap items-center gap-3'>
                    <Button
                        onClick={handleDownload}
                        disabled={loading || !docUrl.trim()}
                        variant='primary'
                        size='md'
                        className='flex-1 cursor-pointer text-xs font-bold'
                    >
                        {loading ? (
                            <span className='flex items-center justify-center gap-2'>
                                <span className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                {t.downloading}
                            </span>
                        ) : (
                            <span>📥 {t.downloadBtn}</span>
                        )}
                    </Button>

                    <Button
                        onClick={handleClear}
                        disabled={loading}
                        variant='secondary'
                        size='md'
                        className='cursor-pointer text-xs font-bold'
                    >
                        ✕ {t.clear}
                    </Button>
                </div>

                <div className='text-xs text-gray-400 flex items-center gap-1.5'>
                    <span>ℹ️</span>
                    <span>{t.infoNote}</span>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className='p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl text-xs text-red-600 dark:text-red-300 flex items-center gap-2'>
                        <span>❌</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Result Card */}
                {result && (
                    <div className='p-5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800 rounded-3xl flex flex-col sm:flex-row items-center gap-5'>
                        {result.thumbnail && (
                            <img
                                src={result.thumbnail}
                                alt={result.title}
                                className='w-24 sm:w-28 h-32 sm:h-36 object-cover rounded-xl shadow-md border border-gray-200 dark:border-gray-700'
                            />
                        )}

                        <div className='flex-1 space-y-2 text-center sm:text-left'>
                            <span className='inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white uppercase tracking-wider'>
                                Ready to download
                            </span>
                            <h4 className='text-base font-bold text-gray-900 dark:text-white leading-snug'>
                                {result.title}
                            </h4>
                            {result.author && (
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    Author / Publisher: <span className='font-semibold'>{result.author}</span>
                                </p>
                            )}

                            <div className='pt-2'>
                                <a
                                    href={result.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer'
                                >
                                    <span>💾</span>
                                    <span>Download PDF Now</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
