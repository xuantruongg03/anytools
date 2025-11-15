"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { useUrlShortener } from "@/lib/hooks/useUrlShortener";
import Button from "@/components/ui/Button";

type UrlShortenerContentProps = {
    locale: "en" | "vi";
};

export default function UrlShortenerContent({ locale }: UrlShortenerContentProps) {
    const { setLocale } = useLanguage();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (!hasSynced.current) {
            setLocale(locale);
            hasSynced.current = true;
        }
    }, [locale, setLocale]);

    const t = getTranslation(locale);
    const ui = t.tools.urlShortener.ui;
    const page = t.tools.urlShortener.page;

    const [longUrl, setLongUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const { shortenUrl, isLoading, error, result, reset } = useUrlShortener();

    const handleShorten = async () => {
        if (!longUrl.trim()) {
            return;
        }
        await shortenUrl(longUrl.trim());
    };

    const handleCopy = async () => {
        if (result?.shortUrl) {
            try {
                await navigator.clipboard.writeText(result.shortUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    const handleReset = () => {
        setLongUrl("");
        reset();
        setCopied(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isLoading && longUrl.trim()) {
            handleShorten();
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                {/* Header */}
                <header className='mb-8'>
                    <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{page.title}</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>{page.subtitle}</p>
                </header>

                {/* Tool Section */}
                <div className='max-w-3xl mx-auto mb-12'>
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                        {!result ? (
                            <>
                                {/* Input Section */}
                                <div className='space-y-4'>
                                    <div>
                                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{ui.inputLabel}</label>
                                        <input type='url' value={longUrl} onChange={(e) => setLongUrl(e.target.value)} onKeyPress={handleKeyPress} placeholder={ui.inputPlaceholder} disabled={isLoading} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50' />
                                    </div>

                                    {error && (
                                        <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                                            <p className='text-sm text-red-600 dark:text-red-400'>{error.message}</p>
                                        </div>
                                    )}

                                    <Button onClick={handleShorten} disabled={isLoading || !longUrl.trim()} variant='primary' size='lg' fullWidth>
                                        {isLoading ? (
                                            <span className='flex items-center justify-center gap-2'>
                                                <svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                                </svg>
                                                {ui.shortening}
                                            </span>
                                        ) : (
                                            ui.shorten
                                        )}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Result Section */}
                                <div className='space-y-4'>
                                    <div className='text-center'>
                                        <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4'>
                                            <svg className='w-8 h-8 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                            </svg>
                                        </div>
                                        <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2'>{ui.result}</h3>
                                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                                            {ui.service}: <span className='font-medium text-blue-600 dark:text-blue-400'>{result.service}</span>
                                        </p>
                                    </div>

                                    <div className='bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>Original URL:</p>
                                        <p className='text-sm text-gray-900 dark:text-gray-100 break-all mb-4'>{longUrl}</p>

                                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>Shortened URL:</p>
                                        <div className='flex items-center gap-2'>
                                            <input type='text' value={result.shortUrl} readOnly className='flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-blue-600 dark:text-blue-400 font-medium' />
                                            <Button onClick={handleCopy} variant='primary' className='whitespace-nowrap'>
                                                {copied ? ui.copied : ui.copy}
                                            </Button>
                                        </div>
                                    </div>

                                    <Button onClick={handleReset} variant='gray' size='lg' fullWidth>
                                        {ui.reset}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* What is URL Shortener */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.whatIsUrlShortener}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{page.whatIsUrlShortenerDesc}</p>
                </section>

                {/* How It Works */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.howItWorks}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{page.howItWorksDesc}</p>
                </section>

                {/* Why Use */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.whyUse}</h2>
                    <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.multipleServices.split(":")[0]}:</strong> {page.features.multipleServices.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.noRegistration.split(":")[0]}:</strong> {page.features.noRegistration.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.instantResults.split(":")[0]}:</strong> {page.features.instantResults.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.reliable.split(":")[0]}:</strong> {page.features.reliable.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.copyToClipboard.split(":")[0]}:</strong> {page.features.copyToClipboard.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.privacy.split(":")[0]}:</strong> {page.features.privacy.split(":").slice(1).join(":")}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* How to Use */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.howToUse}</h2>
                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
                        <ol className='space-y-3 text-gray-700 dark:text-gray-300 list-decimal list-inside'>
                            <li>{page.howToSteps.step1}</li>
                            <li>{page.howToSteps.step2}</li>
                            <li>{page.howToSteps.step3}</li>
                            <li>{page.howToSteps.step4}</li>
                        </ol>
                    </div>
                </section>

                {/* Use Cases */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.useCases}</h2>
                    <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.socialMedia.split(":")[0]}:</strong> {page.useCasesList.socialMedia.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.sms.split(":")[0]}:</strong> {page.useCasesList.sms.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.printMaterials.split(":")[0]}:</strong> {page.useCasesList.printMaterials.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.email.split(":")[0]}:</strong> {page.useCasesList.email.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.analytics.split(":")[0]}:</strong> {page.useCasesList.analytics.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.branding.split(":")[0]}:</strong> {page.useCasesList.branding.split(":").slice(1).join(":")}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* Services Grid */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.servicesUsed}</h2>
                    <div className='grid md:grid-cols-2 gap-4'>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.servicesGrid.tly}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.servicesGrid.cuttly}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.servicesGrid.tinyurl}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.servicesGrid.isgd}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.servicesGrid.vgd}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.servicesGrid.cleanuri}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100'>{page.faq}</h2>
                    <div className='space-y-6'>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.faqList.q1}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a1}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.faqList.q2}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a2}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.faqList.q3}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a3}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.faqList.q4}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a4}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.faqList.q5}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a5}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
