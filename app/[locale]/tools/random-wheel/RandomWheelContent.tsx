"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import RandomWheelClient from "./RandomWheelClient";
import FAQSection from "@/components/ui/FAQSection";

export default function RandomWheelContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.randomWheel.page;

    return (
        <div className='w-full max-w-6xl mx-auto overflow-x-hidden'>
            <RandomWheelClient />

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
                        <li>{t.useCasesList.decision}</li>
                        <li>{t.useCasesList.contest}</li>
                        <li>{t.useCasesList.game}</li>
                        <li>{t.useCasesList.classroom}</li>
                        <li>{t.useCasesList.team}</li>
                    </ul>
                </section>

                <FAQSection locale={locale} faqs={t.faqList} />
            </div>
        </div>
    );
}
