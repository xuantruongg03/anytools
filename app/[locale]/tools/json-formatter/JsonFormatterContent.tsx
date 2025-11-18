"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import JsonFormatterClient from "./JsonFormatterClient";
import FAQSection from "@/components/ui/FAQSection";

export default function JsonFormatterContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.tools.jsonFormatter.page;

    return (
        <div className='max-w-6xl mx-auto'>
            {/* Header Section - Tiêu đề và mô tả */}
            <header className='mb-8'>
                <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{page.title}</h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>{page.subtitle}</p>
            </header>

            {/* Tool Section - Công cụ chính */}
            <JsonFormatterClient />

            {/* SEO Content Section - Phần giới thiệu, hướng dẫn, FAQ */}
            <section className='mt-12 max-w-none'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.whatIs}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>{page.whatIsDesc}</p>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{page.whyUse}</h3>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.free.split(":")[0]}:</strong> {page.features.free.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.validation.split(":")[0]}:</strong> {page.features.validation.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.format.split(":")[0]}:</strong> {page.features.format.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.minify.split(":")[0]}:</strong> {page.features.minify.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.copy.split(":")[0]}:</strong> {page.features.copy.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.secure.split(":")[0]}:</strong> {page.features.secure.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.mobile.split(":")[0]}:</strong> {page.features.mobile.split(":")[1]}
                    </li>
                </ul>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{page.howToUse}</h3>
                <ol className='list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    <li>{page.steps.step1}</li>
                    <li>{page.steps.step2}</li>
                    <li>{page.steps.step3}</li>
                    <li>{page.steps.step4}</li>
                    <li>{page.steps.step5}</li>
                </ol>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{page.useCases}</h3>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.api.split(":")[0]}:</strong> {page.useCasesList.api.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.debug.split(":")[0]}:</strong> {page.useCasesList.debug.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.config.split(":")[0]}:</strong> {page.useCasesList.config.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.analysis.split(":")[0]}:</strong> {page.useCasesList.analysis.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.learning.split(":")[0]}:</strong> {page.useCasesList.learning.split(":")[1]}
                    </li>
                </ul>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{page.whatIsJson}</h3>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>{page.whatIsJsonDesc}</p>
            </section>

            <FAQSection
                title={page.faq}
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
