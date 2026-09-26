"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { bulkIpLookupTranslations } from "@/lib/i18n/tools/bulk-ip-lookup";
import FAQSection from "@/components/ui/FAQSection";

export default function BulkIpLookupContent() {
    const { locale } = useLanguage();
    const t = bulkIpLookupTranslations[locale as "en" | "vi"]?.bulkIpLookup?.page || bulkIpLookupTranslations.vi.bulkIpLookup.page;

    return (
        <div className='max-w-6xl mx-auto'>
            <div className='mt-12 prose prose-gray dark:prose-invert max-w-none'>
                {/* What Is */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>{t.whatIs}</h2>
                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{t.whatIsDesc}</p>
                </section>

                {/* Why Use */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>{t.whyUse}</h2>
                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{t.whyUseDesc}</p>
                </section>

                {/* Features */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.features}</h2>
                    <div className='grid md:grid-cols-3 gap-5'>
                        <div className='bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800'>
                            <h3 className='text-base font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2'>
                                <span>⚡</span>
                                <span>{t.batchLookup}</span>
                            </h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>{t.batchLookupDesc}</p>
                        </div>

                        <div className='bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-200 dark:border-indigo-800'>
                            <h3 className='text-base font-semibold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2'>
                                <span>🗺️</span>
                                <span>{t.interactiveMap}</span>
                            </h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>{t.interactiveMapDesc}</p>
                        </div>

                        <div className='bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl border border-purple-200 dark:border-purple-800'>
                            <h3 className='text-base font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2'>
                                <span>📊</span>
                                <span>{t.countryRanking}</span>
                            </h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>{t.countryRankingDesc}</p>
                        </div>

                        <div className='bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800'>
                            <h3 className='text-base font-semibold text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2'>
                                <span>🔍</span>
                                <span>{t.smartExtraction}</span>
                            </h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>{t.smartExtractionDesc}</p>
                        </div>

                        <div className='bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-800'>
                            <h3 className='text-base font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2'>
                                <span>📥</span>
                                <span>{t.exportData}</span>
                            </h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>{t.exportDataDesc}</p>
                        </div>

                        <div className='bg-teal-50 dark:bg-teal-900/20 p-5 rounded-xl border border-teal-200 dark:border-teal-800'>
                            <h3 className='text-base font-semibold text-teal-900 dark:text-teal-100 mb-2 flex items-center gap-2'>
                                <span>🔒</span>
                                <span>{t.privacyFocused}</span>
                            </h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>{t.privacyFocusedDesc}</p>
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.useCases}</h2>
                    <div className='space-y-4'>
                        <div className='flex gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                            <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm'>
                                1
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.useCase1}</h3>
                                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>{t.useCase1Desc}</p>
                            </div>
                        </div>

                        <div className='flex gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                            <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm'>
                                2
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.useCase2}</h3>
                                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>{t.useCase2Desc}</p>
                            </div>
                        </div>

                        <div className='flex gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                            <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm'>
                                3
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.useCase3}</h3>
                                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>{t.useCase3Desc}</p>
                            </div>
                        </div>

                        <div className='flex gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                            <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm'>
                                4
                            </div>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.useCase4}</h3>
                                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>{t.useCase4Desc}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <FAQSection
                    locale={locale}
                    faqs={[
                        { question: t.faq1Q, answer: t.faq1A },
                        { question: t.faq2Q, answer: t.faq2A },
                        { question: t.faq3Q, answer: t.faq3A },
                        { question: t.faq4Q, answer: t.faq4A },
                    ]}
                />
            </div>
        </div>
    );
}
