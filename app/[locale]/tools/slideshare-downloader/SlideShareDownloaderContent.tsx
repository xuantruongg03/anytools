"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import FAQSection from "@/components/ui/FAQSection";

interface DownloadResult {
    url: string;
    filename: string;
    format: string;
    title?: string;
    thumbnail?: string;
}

type SlideShareDownloaderContentProps = {
    locale: "en" | "vi";
};

export default function SlideShareDownloaderContent({ locale: propLocale }: SlideShareDownloaderContentProps) {
    const { locale, setLocale } = useLanguage();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (!hasSynced.current) {
            setLocale(propLocale);
            hasSynced.current = true;
        }
    }, [propLocale, setLocale]);

    const t = getTranslation(locale);
    const tool_t = t.tools.slideshareDownloader;
    const page = tool_t.page;

    const [slideUrl, setSlideUrl] = useState("");
    const [format, setFormat] = useState<"pdf" | "ppt">("pdf");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<DownloadResult | null>(null);

    const isValidSlideShareUrl = useCallback((url: string): boolean => {
        const patterns = [/^https?:\/\/(www\.)?slideshare\.net\/.+/i, /^https?:\/\/(www\.)?linkedin\.com\/posts\/.+/i];
        return patterns.some((pattern) => pattern.test(url));
    }, []);

    const handleDownload = useCallback(async () => {
        if (!slideUrl.trim()) {
            setError(tool_t.error.emptyUrl || "Please enter a SlideShare URL");
            return;
        }

        if (!isValidSlideShareUrl(slideUrl)) {
            setError(tool_t.error.invalidUrl || "Please enter a valid SlideShare URL");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const response = await fetch("/api/slideshare-download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: slideUrl,
                    format: format,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to download");
            }

            setResult(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [slideUrl, format, isValidSlideShareUrl, tool_t.error]);

    const handleClear = useCallback(() => {
        setSlideUrl("");
        setError("");
        setResult(null);
    }, []);

    const formatOptions = useMemo(
        () => [
            { value: "pdf" as const, label: "PDF", icon: "📄" },
            { value: "ppt" as const, label: "PPT", icon: "📊" },
        ],
        []
    );

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <div className='flex items-center gap-3 mb-4'>
                    <span className='text-4xl'>📥</span>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{tool_t.name}</h1>
                        <p className='text-gray-600 dark:text-gray-400 mt-1'>{tool_t.description}</p>
                    </div>
                </div>

                {/* Input Section */}
                <div className='space-y-4'>
                    {/* URL Input */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool_t.urlLabel || "SlideShare URL"}</label>
                        <input type='text' value={slideUrl} onChange={(e) => setSlideUrl(e.target.value)} placeholder={tool_t.urlPlaceholder || "https://www.slideshare.net/..."} className='w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent' />
                    </div>

                    {/* Format Selection */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool_t.formatLabel || "Download Format"}</label>
                        <div className='flex gap-3'>
                            {formatOptions.map((option) => (
                                <button key={option.value} type='button' onClick={() => setFormat(option.value)} className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${format === option.value ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                    <span className='mr-2'>{option.icon}</span>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-3'>
                        <button onClick={handleDownload} disabled={loading || !slideUrl.trim()} className='flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer'>
                            {loading ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <div className='animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full'></div>
                                    <span>{tool_t.downloading || "Downloading..."}</span>
                                </div>
                            ) : (
                                <span>📥 {tool_t.download || "Download"}</span>
                            )}
                        </button>
                        <button onClick={handleClear} disabled={loading} className='px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer'>
                            🗑️ {tool_t.clear || "Clear"}
                        </button>
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
                    <div className='mt-4 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                        <div className='flex items-start gap-4'>
                            {result.thumbnail && <img src={result.thumbnail} alt={result.title || "Presentation"} className='w-32 h-24 object-cover rounded-lg' />}
                            <div className='flex-1'>
                                <p className='text-green-700 dark:text-green-300 font-semibold mb-2'>✅ {tool_t.success || "Download ready!"}</p>
                                {result.title && <p className='text-gray-700 dark:text-gray-300 mb-3'>{result.title}</p>}
                                <a href={result.url} download={result.filename} className='inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium cursor-pointer'>
                                    💾 {tool_t.downloadFile || "Download File"} ({result.format.toUpperCase()})
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>📖 {tool_t.howToUse || "How to Use"}</h2>
                <ol className='space-y-3 text-gray-700 dark:text-gray-300'>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>1.</span>
                        <span>{tool_t.step1 || "Copy the URL of the SlideShare presentation you want to download"}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>2.</span>
                        <span>{tool_t.step2 || "Paste the URL in the input field above"}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>3.</span>
                        <span>{tool_t.step3 || "Select your preferred format (PDF or PPT)"}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>4.</span>
                        <span>{tool_t.step4 || "Click Download and wait for the file to be ready"}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>5.</span>
                        <span>{tool_t.step5 || "Click the download link to save the file to your device"}</span>
                    </li>
                </ol>
            </div>

            {/* Features */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>✨ {tool_t.features || "Features"}</h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>📄</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{tool_t.feature1Title || "Multiple Formats"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.feature1Desc || "Download as PDF or PPT format"}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>⚡</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{tool_t.feature2Title || "Fast Processing"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.feature2Desc || "Quick download processing"}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>🔒</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{tool_t.feature3Title || "Secure & Private"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.feature3Desc || "No data stored on our servers"}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>💯</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{tool_t.feature4Title || "100% Free"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.feature4Desc || "No registration or payment required"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is SlideShare Downloader */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>📚 {page.whatIs}</h2>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{page.whatIsDesc}</p>
            </div>

            {/* Why Use Our Tool */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>💡 {page.whyUse}</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>{page.whyUseDesc}</p>
                <ul className='space-y-3'>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit1}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit2}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit3}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit4}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit5}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit6}</span>
                    </li>
                </ul>
            </div>

            {/* How It Works */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>⚙️ {page.howItWorks}</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>{page.howItWorksSteps}</p>
                <ol className='space-y-3'>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>1.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep1}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>2.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep2}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>3.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep3}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>4.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep4}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>5.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep5}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>6.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep6}</span>
                    </li>
                </ol>
            </div>

            {/* Use Cases */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>🎯 {page.useCases}</h2>
                <div className='space-y-3'>
                    <div className='flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-xl'>🎓</span>
                        <p className='text-gray-700 dark:text-gray-300'>{page.useCase1}</p>
                    </div>
                    <div className='flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-xl'>🔬</span>
                        <p className='text-gray-700 dark:text-gray-300'>{page.useCase2}</p>
                    </div>
                    <div className='flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-xl'>💼</span>
                        <p className='text-gray-700 dark:text-gray-300'>{page.useCase3}</p>
                    </div>
                    <div className='flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-xl'>👨‍🏫</span>
                        <p className='text-gray-700 dark:text-gray-300'>{page.useCase4}</p>
                    </div>
                    <div className='flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-xl'>✍️</span>
                        <p className='text-gray-700 dark:text-gray-300'>{page.useCase5}</p>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <FAQSection
                    title={`❓ ${page.faq}`}
                    faqs={[
                        { question: page.faqQ1, answer: page.faqA1 },
                        { question: page.faqQ2, answer: page.faqA2 },
                        { question: page.faqQ3, answer: page.faqA3 },
                        { question: page.faqQ4, answer: page.faqA4 },
                        { question: page.faqQ5, answer: page.faqA5 },
                        { question: page.faqQ6, answer: page.faqA6 },
                    ]}
                />
            </div>

            {/* Tips */}
            <div className='bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>💡 {page.tips}</h2>
                <ul className='space-y-2'>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>•</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.tip1}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>•</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.tip2}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>•</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.tip3}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>•</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.tip4}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
