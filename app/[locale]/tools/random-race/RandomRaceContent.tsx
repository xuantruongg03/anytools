"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import RandomRaceClient from "./RandomRaceClient";
import FAQSection from "@/components/ui/FAQSection";

export default function RandomRaceContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.randomRace.page;

    return (
        <div className='w-full max-w-6xl mx-auto overflow-x-hidden'>
            <div className='text-center mb-8'>
                <h1 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.title}</h1>
                <p className='text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>{t.subtitle}</p>
            </div>

            <RandomRaceClient />

            <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300 wrap-break-word'>
                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.whatIs}</h2>
                    <p className='leading-relaxed mb-4'>{t.whatIsDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.howToUse}</h2>
                    <ol className='space-y-2 list-decimal list-inside'>
                        <li>{t.steps.step1}</li>
                        <li>{t.steps.step2}</li>
                        <li>{t.steps.step3}</li>
                        <li>{t.steps.step4}</li>
                    </ol>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.useCases}</h2>
                    <ul className='space-y-2 list-disc list-inside'>
                        <li>{t.useCasesList.fun}</li>
                        <li>{t.useCasesList.contest}</li>
                        <li>{t.useCasesList.classroom}</li>
                        <li>{t.useCasesList.party}</li>
                    </ul>
                </section>

                <FAQSection title={t.faq} faqs={t.faqList} />
            </div>
        </div>
    );
}
