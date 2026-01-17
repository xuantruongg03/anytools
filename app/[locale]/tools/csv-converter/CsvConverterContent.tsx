"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import CsvConverterClient from "./CsvConverterClient";
import FAQSection from "@/components/ui/FAQSection";

export default function CsvConverterContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.tools.csvConverter.page;

    return (
        <div className='max-w-6xl mx-auto'>
            {/* Tool Section */}
            <CsvConverterClient />

            {/* SEO Content Section */}
            <section className='mt-12 max-w-none'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.whatIs}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>{page.whatIsDesc}</p>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{page.whyUse}</h3>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.free.split(":")[0]}:</strong> {page.features.free.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.instant.split(":")[0]}:</strong> {page.features.instant.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.editable.split(":")[0]}:</strong> {page.features.editable.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.convert.split(":")[0]}:</strong> {page.features.convert.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.secure.split(":")[0]}:</strong> {page.features.secure.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.unlimited.split(":")[0]}:</strong> {page.features.unlimited.split(":")[1]}
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
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.dataAnalysis.split(":")[0]}:</strong> {page.useCasesList.dataAnalysis.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.apiDev.split(":")[0]}:</strong> {page.useCasesList.apiDev.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.database.split(":")[0]}:</strong> {page.useCasesList.database.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.excel.split(":")[0]}:</strong> {page.useCasesList.excel.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.migration.split(":")[0]}:</strong> {page.useCasesList.migration.split(":")[1]}
                    </li>
                </ul>
            </section>

            <FAQSection
                locale={locale}
                faqs={[
                    { question: page.faqList.q1, answer: page.faqList.a1 },
                    { question: page.faqList.q2, answer: page.faqList.a2 },
                    { question: page.faqList.q3, answer: page.faqList.a3 },
                    { question: page.faqList.q4, answer: page.faqList.a4 },
                    { question: page.faqList.q5, answer: page.faqList.a5 },
                ]}
            />
        </div>
    );
}
