"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import FAQSection from "@/components/ui/FAQSection";

export default function MicrophoneTestContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.microphoneTest.page;

    const faqs = [
        {
            question: t.faq1Q,
            answer: t.faq1A,
        },
        {
            question: t.faq2Q,
            answer: t.faq2A,
        },
        {
            question: t.faq3Q,
            answer: t.faq3A,
        },
        {
            question: t.faq4Q,
            answer: t.faq4A,
        },
        {
            question: t.faq5Q,
            answer: t.faq5A,
        },
    ];

    return (
        <div className='space-y-8 text-gray-700 dark:text-gray-300'>
            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.whatIs}</h2>
                <p className='leading-relaxed mb-4'>{t.whatIsDesc1}</p>
                <p className='leading-relaxed'>{t.whatIsDesc2}</p>
            </section>

            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.features}</h2>
                <ul className='space-y-3'>
                    <li className='flex items-start'>
                        <span className='text-blue-600 dark:text-blue-400 mr-2'>✓</span>
                        <span>{t.feature1}</span>
                    </li>
                    <li className='flex items-start'>
                        <span className='text-blue-600 dark:text-blue-400 mr-2'>✓</span>
                        <span>{t.feature2}</span>
                    </li>
                    <li className='flex items-start'>
                        <span className='text-blue-600 dark:text-blue-400 mr-2'>✓</span>
                        <span>{t.feature3}</span>
                    </li>
                    <li className='flex items-start'>
                        <span className='text-blue-600 dark:text-blue-400 mr-2'>✓</span>
                        <span>{t.feature4}</span>
                    </li>
                    <li className='flex items-start'>
                        <span className='text-blue-600 dark:text-blue-400 mr-2'>✓</span>
                        <span>{t.feature5}</span>
                    </li>
                    <li className='flex items-start'>
                        <span className='text-blue-600 dark:text-blue-400 mr-2'>✓</span>
                        <span>{t.feature6}</span>
                    </li>
                </ul>
            </section>

            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.howToUse}</h2>
                <ol className='space-y-3 list-decimal list-inside'>
                    <li className='leading-relaxed'>{t.step1}</li>
                    <li className='leading-relaxed'>{t.step2}</li>
                    <li className='leading-relaxed'>{t.step3}</li>
                    <li className='leading-relaxed'>{t.step4}</li>
                    <li className='leading-relaxed'>{t.step5}</li>
                </ol>
            </section>

            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.qualityMetrics}</h2>
                <div className='space-y-4'>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t.volumeMetric}</h3>
                        <p>{t.volumeDesc}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t.qualityMetric}</h3>
                        <p>{t.qualityDesc}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t.noiseMetric}</h3>
                        <p>{t.noiseDesc}</p>
                    </div>
                </div>
            </section>

            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.commonIssues}</h2>
                <ul className='space-y-2 list-disc list-inside'>
                    <li>{t.issue1}</li>
                    <li>{t.issue2}</li>
                    <li>{t.issue3}</li>
                    <li>{t.issue4}</li>
                    <li>{t.issue5}</li>
                </ul>
            </section>

            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.privacy}</h2>
                <p className='leading-relaxed mb-4'>{t.privacyDesc1}</p>
                <p className='leading-relaxed'>{t.privacyDesc2}</p>
            </section>

            <FAQSection title={locale === "vi" ? "Câu Hỏi Thường Gặp" : "Frequently Asked Questions"} faqs={faqs} />
        </div>
    );
}
