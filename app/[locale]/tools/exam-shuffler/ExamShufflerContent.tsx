"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";

export default function ExamShufflerContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.examShuffler.page;

    return (
        <div className='mt-12 space-y-8 print:hidden text-gray-700 dark:text-gray-300'>
            {/* What is */}
            <section className='bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm'>
                <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3'>
                    {t.whatIs}
                </h2>
                <p className='text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300'>
                    {t.whatIsDesc}
                </p>
            </section>

            {/* How to use */}
            <section className='bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm'>
                <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
                    {t.howToUse}
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {Object.values(t.steps).map((step, idx) => (
                        <div
                            key={idx}
                            className='p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col'
                        >
                            <span className='w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-2'>
                                {idx + 1}
                            </span>
                            <p className='text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-normal'>
                                {step}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features & Use cases */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <section className='bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm'>
                    <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2'>
                        <span>⭐</span> {t.featuresTitle}
                    </h2>
                    <ul className='space-y-2.5 text-xs sm:text-sm'>
                        {t.featuresList.map((item, idx) => (
                            <li key={idx} className='flex items-start gap-2.5'>
                                <span className='text-emerald-500 font-bold shrink-0'>✓</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className='bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm'>
                    <h2 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2'>
                        <span>🎯</span> {t.useCasesTitle}
                    </h2>
                    <ul className='space-y-2.5 text-xs sm:text-sm'>
                        {t.useCasesList.map((item, idx) => (
                            <li key={idx} className='flex items-start gap-2'>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* FAQ */}
            <section className='bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm'>
                <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2'>
                    <span>❓</span> {t.faqTitle}
                </h2>
                <div className='space-y-4'>
                    {t.faqList.map((faq, idx) => (
                        <div
                            key={idx}
                            className='p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700'
                        >
                            <h3 className='font-bold text-sm text-gray-900 dark:text-gray-100 mb-1.5'>
                                {faq.question}
                            </h3>
                            <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
