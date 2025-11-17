"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import FAQSection from "@/components/ui/FAQSection";

export default function RepoTreeContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const content = t.tools.repoTree.content;

    return (
        <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
            {/* What is */}
            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{content.whatIsTitle}</h2>
                <p className='mb-4'>{content.whatIsDesc1}</p>
                <p>{content.whatIsDesc2}</p>
            </section>

            {/* Why Use */}
            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{content.whyUseTitle}</h2>
                <ul className='space-y-3'>
                    {Object.entries(content.whyUse).map(([key, value]) => (
                        <li key={key} className='flex items-start gap-3'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <div dangerouslySetInnerHTML={{ __html: value as string }} />
                        </li>
                    ))}
                </ul>
            </section>

            {/* How to Use */}
            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{content.howToTitle}</h2>
                <div className='space-y-4'>
                    <div>
                        <h3 className='font-semibold text-lg mb-2'>{content.howTo.step1Title}</h3>
                        <p>{content.howTo.step1Desc}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg mb-2'>{content.howTo.step2Title}</h3>
                        <p>{content.howTo.step2Desc}</p>
                        <ol className='list-decimal list-inside ml-4 mt-2 space-y-1'>
                            {content.howTo.step2List.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ol>
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg mb-2'>{content.howTo.step3Title}</h3>
                        <p>{content.howTo.step3Desc}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg mb-2'>{content.howTo.step4Title}</h3>
                        <p>{content.howTo.step4Desc}</p>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{content.useCasesTitle}</h2>
                <ul className='space-y-3'>
                    {Object.entries(content.useCases).map(([key, value]) => (
                        <li key={key} className='flex items-start gap-3'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>→</span>
                            <div dangerouslySetInnerHTML={{ __html: value as string }} />
                        </li>
                    ))}
                </ul>
            </section>

            {/* FAQ */}
            <FAQSection title={content.faqTitle} faqs={content.faqs} />

            {/* Tips */}
            <section className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{content.tipsTitle}</h2>
                <ul className='space-y-2'>
                    {content.tips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
