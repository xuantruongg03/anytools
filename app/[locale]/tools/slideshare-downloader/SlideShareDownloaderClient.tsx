"use client";

import { useState, useCallback, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";

interface DownloadResult {
    url: string;
    filename: string;
    format: string;
    title?: string;
    thumbnail?: string;
}

export default function SlideShareDownloaderClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const tool_t = t.tools.slideshareDownloader;

    const [slideUrl, setSlideUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<DownloadResult | null>(null);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    const isValidSlideShareUrl = useCallback((url: string): boolean => {
        const patterns = [/^https?:\/\/(www\.)?slideshare\.net\/.+/i, /^https?:\/\/(www\.)?linkedin\.com\/posts\/.+/i];
        return patterns.some((pattern) => pattern.test(url));
    }, []);

    const handleDownload = useCallback(async () => {
        if (!slideUrl.trim()) {
            setError(tool_t.error?.emptyUrl || "Please enter a SlideShare URL");
            return;
        }

        if (!isValidSlideShareUrl(slideUrl)) {
            setError(tool_t.error?.invalidUrl || "Please enter a valid SlideShare URL");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);
            setDownloadSuccess(false);

            const response = await fetch("/api/slideshare-download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: slideUrl,
                    format: "pdf",
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || (tool_t as any).downloadFailedError || "Failed to download");
            }

            // Check response type
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                // JSON response with URL - open in new tab
                const data = await response.json();

                if (data.url) {
                    // Open URL in new tab using <a> element
                    const link = document.createElement("a");
                    link.href = data.url;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    setError("");
                    setDownloadSuccess(true);
                    setResult({
                        url: data.url,
                        filename: data.filename,
                        format: "pdf",
                    });
                } else {
                    throw new Error((tool_t as any).noUrlError || "No download URL returned");
                }
            } else {
                // File blob - download directly (fallback)
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);

                const contentDisposition = response.headers.get("content-disposition");
                let filename = `slideshare_presentation.pdf`;
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1];
                    }
                }

                // Open in new tab using <a> element
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setError("");
                setDownloadSuccess(true);
                setResult({
                    url: downloadUrl,
                    filename: filename,
                    format: "pdf",
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : (tool_t as any).genericError || "An error occurred";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [slideUrl, isValidSlideShareUrl, tool_t.error]);

    const handleClear = useCallback(() => {
        setSlideUrl("");
        setError("");
        setResult(null);
        setDownloadSuccess(false);
    }, []);

    return (
        <div className='space-y-6 max-w-6xl mx-auto'>
            {/* Header */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                <div className='mb-4'>
                    <h1 className='text-2xl font-bold mb-2 text-gray-900 dark:text-white'>{tool_t.name}</h1>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.description}</p>
                </div>

                {/* Input Section */}
                <div className='space-y-4'>
                    {/* URL Input */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool_t.urlLabel || "SlideShare URL"}</label>
                        <input type='text' value={slideUrl} onChange={(e) => setSlideUrl(e.target.value)} placeholder={tool_t.urlPlaceholder || "https://www.slideshare.net/..."} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-2'>
                        <button onClick={handleDownload} disabled={loading || !slideUrl.trim()} className='flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'>
                            {loading ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
                                    <span>{tool_t.downloading || "Downloading..."}</span>
                                </div>
                            ) : (
                                <span>📥 {tool_t.download || "Download PDF"}</span>
                            )}
                        </button>
                        <button onClick={handleClear} disabled={loading} className='px-4 py-2.5 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'>
                            {tool_t.clear || "Clear"}
                        </button>
                    </div>

                    {/* Info Note */}
                    <div className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                        <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                        </svg>
                        <span>{(tool_t as any).infoNote || "Files will be downloaded as PDF format"}</span>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className='mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                        <p className='text-red-600 dark:text-red-400'>❌ {error}</p>
                    </div>
                )}

                {/* Success Result */}
                {result && (
                    <div className='mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                        <p className='text-green-700 dark:text-green-300 font-medium text-sm'>✅ {(tool_t as any).successMessage || tool_t.success || "File opened successfully!"}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
