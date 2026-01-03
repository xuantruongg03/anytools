"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import FAQSection from "@/components/ui/FAQSection";

export default function ApiTesterContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.apiTester.page;

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
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.httpMethods}</h2>
                <div className='space-y-4'>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>GET</h3>
                        <p>{t.getDesc}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>POST</h3>
                        <p>{t.postDesc}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>PUT</h3>
                        <p>{t.putDesc}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>DELETE</h3>
                        <p>{t.deleteDesc}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>PATCH</h3>
                        <p>{t.patchDesc}</p>
                    </div>
                </div>
            </section>

            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.commonUseCases}</h2>
                <ul className='space-y-2 list-disc list-inside'>
                    <li>{t.useCase1}</li>
                    <li>{t.useCase2}</li>
                    <li>{t.useCase3}</li>
                    <li>{t.useCase4}</li>
                    <li>{t.useCase5}</li>
                </ul>
            </section>

            <section className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
                <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.security}</h2>
                <p className='leading-relaxed mb-4'>{t.securityDesc1}</p>
                <p className='leading-relaxed'>{t.securityDesc2}</p>
            </section>

            <FAQSection locale ={locale} faqs={faqs} />
        </div>
    );
}
