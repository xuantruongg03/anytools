"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import StunTurnClient from "./StunTurnClient";

export default function StunTurnContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.stunTurnTest;

    return (
        <div className='max-w-6xl mx-auto'>

            {/* Tool */}
            <StunTurnClient />

            {/* What is */}
            <section className='mt-12 prose dark:prose-invert max-w-none'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.page.whatIsTitle}</h2>
                <p className='text-gray-600 dark:text-gray-400'>{t.page.whatIsDesc}</p>
            </section>

            {/* Why use */}
            <section className='mt-12'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.page.whyUseTitle}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>{t.page.whyUse}</p>
                <ul className='grid md:grid-cols-2 gap-4'>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.page.features.validate}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.page.features.diagnose}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.page.features.candidates}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.page.features.realtime}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.page.features.summary}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.page.features.free}</span>
                    </li>
                </ul>
            </section>

            {/* How to Use */}
            <section className='mt-12'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.page.howToTitle}</h2>
                <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
                    <ol className='list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300'>
                        <li>{t.page.howToSteps.step1}</li>
                        <li>{t.page.howToSteps.step2}</li>
                        <li>{t.page.howToSteps.step3}</li>
                        <li>{t.page.howToSteps.step4}</li>
                        <li>{t.page.howToSteps.step5}</li>
                    </ol>
                </div>
            </section>

            {/* Use Cases */}
            <section className='mt-12'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.page.useCasesTitle}</h2>
                <ul className='space-y-2'>
                    <li className='text-gray-700 dark:text-gray-300'>
                        <strong>•</strong> {t.page.useCases.case1}
                    </li>
                    <li className='text-gray-700 dark:text-gray-300'>
                        <strong>•</strong> {t.page.useCases.case2}
                    </li>
                    <li className='text-gray-700 dark:text-gray-300'>
                        <strong>•</strong> {t.page.useCases.case3}
                    </li>
                    <li className='text-gray-700 dark:text-gray-300'>
                        <strong>•</strong> {t.page.useCases.case4}
                    </li>
                    <li className='text-gray-700 dark:text-gray-300'>
                        <strong>•</strong> {t.page.useCases.case5}
                    </li>
                    <li className='text-gray-700 dark:text-gray-300'>
                        <strong>•</strong> {t.page.useCases.case6}
                    </li>
                </ul>
            </section>

            {/* Candidate Types */}
            <section className='mt-12'>
                <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100'>{t.page.candidateTypesTitle}</h2>
                <div className='grid md:grid-cols-3 gap-6'>
                    <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6'>
                        <h3 className='font-semibold mb-2 text-green-800 dark:text-green-300'>{t.page.candidateTypes.host.name}</h3>
                        <p className='text-sm text-gray-700 dark:text-gray-300'>{t.page.candidateTypes.host.desc}</p>
                    </div>
                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
                        <h3 className='font-semibold mb-2 text-blue-800 dark:text-blue-300'>{t.page.candidateTypes.srflx.name}</h3>
                        <p className='text-sm text-gray-700 dark:text-gray-300'>{t.page.candidateTypes.srflx.desc}</p>
                    </div>
                    <div className='bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6'>
                        <h3 className='font-semibold mb-2 text-purple-800 dark:text-purple-300'>{t.page.candidateTypes.relay.name}</h3>
                        <p className='text-sm text-gray-700 dark:text-gray-300'>{t.page.candidateTypes.relay.desc}</p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className='mt-12 mb-12'>
                <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100'>{t.page.faqTitle}</h2>
                <div className='space-y-6'>
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                        <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.page.faqList.q1}</h3>
                        <p className='text-gray-700 dark:text-gray-300'>{t.page.faqList.a1}</p>
                    </div>
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                        <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.page.faqList.q2}</h3>
                        <p className='text-gray-700 dark:text-gray-300'>{t.page.faqList.a2}</p>
                    </div>
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                        <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.page.faqList.q3}</h3>
                        <p className='text-gray-700 dark:text-gray-300'>{t.page.faqList.a3}</p>
                    </div>
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                        <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.page.faqList.q4}</h3>
                        <p className='text-gray-700 dark:text-gray-300'>{t.page.faqList.a4}</p>
                    </div>
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                        <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.page.faqList.q5}</h3>
                        <p className='text-gray-700 dark:text-gray-300'>{t.page.faqList.a5}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
