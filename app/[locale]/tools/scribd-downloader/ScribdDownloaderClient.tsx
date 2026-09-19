"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { SCRIBD_URL_PATTERN } from "@/constants/regex";
import Button from "@/components/ui/Button";

interface DownloadResult {
    url: string;
    filename: string;
    format: string;
    title?: string;
}

export default function ScribdDownloaderClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const tool_t = (t.tools as any).scribdDownloader || {};

    const [documentUrl, setDocumentUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<DownloadResult | null>(null);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const isValidScribdUrl = useCallback((url: string): boolean => {
        return SCRIBD_URL_PATTERN.test(url.trim());
    }, []);

    const handleDownload = useCallback(async () => {
        const trimmedUrl = documentUrl.trim();
        if (!trimmedUrl) {
            setError(tool_t.error?.emptyUrl || "Please enter a Scribd URL");
            return;
        }

        if (!isValidScribdUrl(trimmedUrl)) {
            setError(
                tool_t.error?.invalidUrl ||
                "Please enter a valid Scribd document URL (e.g., https://www.scribd.com/document/...)"
            );
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);
            setDownloadSuccess(false);

            const response = await fetch("/api/scribd-download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: trimmedUrl,
                    format: "pdf",
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || tool_t.downloadFailedError || "Failed to download document");
            }

            if (data.url) {
                // If it's a direct downloadable file URL or external tab
                const link = document.createElement("a");
                link.href = data.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.download = data.filename || "scribd_document.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setError("");
                setDownloadSuccess(true);
                setResult({
                    url: data.url,
                    filename: data.filename || "scribd_document.pdf",
                    title: data.title || "Scribd Document",
                    format: "pdf",
                });
            } else {
                throw new Error(tool_t.noUrlError || "No download URL returned");
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : tool_t.genericError || "An error occurred";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [documentUrl, isValidScribdUrl, tool_t]);

    const handleClear = useCallback(() => {
        setDocumentUrl("");
        setError("");
        setResult(null);
        setDownloadSuccess(false);
    }, []);

    // Paste sample URL for quick test
    const handlePasteSample = () => {
        setDocumentUrl("https://www.scribd.com/document/512345678/Sample-Research-Paper");
        setError("");
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200 dark:border-gray-700/80 transition-all'>
            <div className='mb-6'>
                <div className='flex items-center justify-between flex-wrap gap-2 mb-2'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5'>
                        <span>📑</span>
                        <span>{tool_t.name || "Scribd Downloader"}</span>
                    </h2>
                    <button
                        type='button'
                        onClick={handlePasteSample}
                        className='text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                    >
                        {locale === "vi" ? "Thử link mẫu" : "Paste sample URL"}
                    </button>
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {tool_t.description || "Download documents from Scribd as PDF files"}
                </p>
            </div>

            {/* Input Section */}
            <div className='space-y-4'>
                <div>
                    <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                        {tool_t.urlLabel || "Scribd Document URL"}
                    </label>
                    <div className='relative'>
                        <input
                            type='url'
                            value={documentUrl}
                            onChange={(e) => setDocumentUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                            placeholder={tool_t.urlPlaceholder || "https://www.scribd.com/document/..."}
                            className='w-full pl-4 pr-12 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base'
                        />
                        {documentUrl && (
                            <button
                                type='button'
                                onClick={handleClear}
                                className='absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                                title={tool_t.clear || "Clear"}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-3 pt-2'>
                    <Button
                        onClick={handleDownload}
                        disabled={loading || !documentUrl.trim()}
                        variant='primary'
                        size='lg'
                        className='flex-1 justify-center'
                    >
                        {loading ? (
                            <div className='flex items-center justify-center gap-2'>
                                <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
                                <span>{tool_t.downloading || "Processing..."}</span>
                            </div>
                        ) : (
                            <span className='flex items-center justify-center gap-2'>
                                <span>📥</span>
                                <span>{tool_t.download || "Download PDF"}</span>
                            </span>
                        )}
                    </Button>
                    <Button
                        onClick={handleClear}
                        disabled={loading || !documentUrl}
                        variant='secondary'
                        size='lg'
                    >
                        {tool_t.clear || "Clear"}
                    </Button>
                </div>

                {/* Info Note */}
                <div className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 pt-1'>
                    <svg className='w-4 h-4 text-blue-500 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                            clipRule='evenodd'
                        />
                    </svg>
                    <span>{tool_t.infoNote || "Documents will be downloaded in high-resolution PDF format."}</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className='mt-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3 text-red-700 dark:text-red-300 text-sm'>
                    <span className='text-base'>⚠️</span>
                    <p className='flex-1'>{error}</p>
                </div>
            )}

            {/* Success Result */}
            {downloadSuccess && result && (
                <div className='mt-5 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-4 text-emerald-800 dark:text-emerald-300 text-sm flex-wrap'>
                    <div className='flex items-center gap-2.5'>
                        <span className='text-lg'>✅</span>
                        <div>
                            <div className='font-semibold'>{tool_t.successMessage || "Download ready!"}</div>
                            <div className='text-xs opacity-80'>{result.filename}</div>
                        </div>
                    </div>
                    <a
                        href={result.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        download={result.filename}
                        className='px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs transition-colors'
                    >
                        {tool_t.downloadFile || "Download File"}
                    </a>
                </div>
            )}
        </div>
    );
}
