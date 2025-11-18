"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Base64Client from "./Base64Client";
import FAQSection from "@/components/ui/FAQSection";

export default function Base64Content() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.tools.base64.page;

    return (
        <div className='max-w-6xl mx-auto'>
            {/* Header Section */}
            <header className='mb-8'>
                <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{page.title}</h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>{page.subtitle}</p>
            </header>

            {/* Tool Section */}
            <Base64Client />

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
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.bidirectional.split(":")[0]}:</strong> {page.features.bidirectional.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.image.split(":")[0]}:</strong> {page.features.image.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.copy.split(":")[0]}:</strong> {page.features.copy.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.secure.split(":")[0]}:</strong> {page.features.secure.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.features.unlimited.split(":")[0]}:</strong> {page.features.unlimited.split(":")[1]}
                    </li>
                </ul>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{page.howToUse}</h3>
                <div className='mb-6'>
                    <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t.tools.base64.encodeTitle}:</h4>
                    <ol className='list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2'>
                        <li>{page.steps.encode1}</li>
                        <li>{page.steps.encode2}</li>
                        <li>{page.steps.encode3}</li>
                    </ol>
                </div>
                <div className='mb-6'>
                    <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t.tools.base64.decodeTitle}:</h4>
                    <ol className='list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2'>
                        <li>{page.steps.decode1}</li>
                        <li>{page.steps.decode2}</li>
                        <li>{page.steps.decode3}</li>
                    </ol>
                </div>
                <div className='mb-6'>
                    <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t.tools.base64.encodeImage}:</h4>
                    <ol className='list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2'>
                        <li>{page.steps.image1}</li>
                        <li>{page.steps.image2}</li>
                        <li>{page.steps.image3}</li>
                    </ol>
                </div>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{page.useCases}</h3>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.images.split(":")[0]}:</strong> {page.useCasesList.images.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.api.split(":")[0]}:</strong> {page.useCasesList.api.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.data.split(":")[0]}:</strong> {page.useCasesList.data.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.email.split(":")[0]}:</strong> {page.useCasesList.email.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.urls.split(":")[0]}:</strong> {page.useCasesList.urls.split(":")[1]}
                    </li>
                    <li>
                        <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.webdev.split(":")[0]}:</strong> {page.useCasesList.webdev.split(":")[1]}
                    </li>
                </ul>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{page.whatIsBase64}</h3>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>{page.whatIsBase64Desc}</p>
            </section>

            <FAQSection
                title={page.faq}
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
