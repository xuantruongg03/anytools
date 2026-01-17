"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import CodeMinifierClient from "./CodeMinifierClient";
import FAQSection from "@/components/ui/FAQSection";

export default function CodeMinifierContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.tools.codeMinifier.page;

    return (
        <div className='max-w-6xl mx-auto'>
            <CodeMinifierClient />

            <section className='mt-12 max-w-none'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.whatIs}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>{page.whatIsDesc}</p>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{page.whyUse}</h3>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    <li><strong className='text-gray-900 dark:text-gray-100'>{page.features.free.split(":")[0]}:</strong> {page.features.free.split(":")[1]}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>{page.features.multiFormat.split(":")[0]}:</strong> {page.features.multiFormat.split(":")[1]}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>{page.features.stats.split(":")[0]}:</strong> {page.features.stats.split(":")[1]}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>{page.features.beautify.split(":")[0]}:</strong> {page.features.beautify.split(":")[1]}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>{page.features.secure.split(":")[0]}:</strong> {page.features.secure.split(":")[1]}</li>
                </ul>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{page.useCases}</h3>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    <li><strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.performance.split(":")[0]}:</strong> {page.useCasesList.performance.split(":")[1]}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.production.split(":")[0]}:</strong> {page.useCasesList.production.split(":")[1]}</li>
                    <li><strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.bandwidth.split(":")[0]}:</strong> {page.useCasesList.bandwidth.split(":")[1]}</li>
                </ul>
            </section>

            <FAQSection
                locale={locale}
                faqs={[
                    { question: page.faqList.q1, answer: page.faqList.a1 },
                    { question: page.faqList.q2, answer: page.faqList.a2 },
                    { question: page.faqList.q3, answer: page.faqList.a3 },
                    { question: page.faqList.q4, answer: page.faqList.a4 },
                ]}
            />
        </div>
    );
}
