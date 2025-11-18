"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import FAQSection from "@/components/ui/FAQSection";

export default function WorldClockContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.tools.worldClock.page;

    return (
        <div className='max-w-6xl mx-auto'>
            <div className='mt-12 prose prose-lg max-w-none dark:prose-invert'>
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.whatIs}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>{page.whatIsDesc}</p>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.howToUse}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>{page.howToUseDesc}</p>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.features}</h2>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                        {page.featuresList.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </section>

                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.useCases}</h2>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                        {page.useCasesList.map((useCase, index) => (
                            <li key={index}>{useCase}</li>
                        ))}
                    </ul>
                </section>

                <FAQSection faqs={page.faqList} title={page.faqTitle} />
            </div>
        </div>
    );
}
