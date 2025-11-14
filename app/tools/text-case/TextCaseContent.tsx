"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import TextCaseClient from "./TextCaseClient";
import { getTranslation } from "@/lib/i18n";

export default function TextCaseContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <header className='mb-8'>
                    <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.title}</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.subtitle}</p>
                </header>

                <TextCaseClient />

                {/* What is Text Case Conversion */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.whatIsTextCase}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{t.tools.textCase.page.whatIsTextCaseDesc}</p>
                </section>

                {/* Why Use */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.whyUse}</h2>
                    <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.features.free.split(":")[0] || t.tools.textCase.page.features.free.split(" ")[0]}:</strong> {t.tools.textCase.page.features.free.split(":")[1] || t.tools.textCase.page.features.free.substring(t.tools.textCase.page.features.free.indexOf(" "))}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.features.instant.split(":")[0] || t.tools.textCase.page.features.instant.split(" ")[0]}:</strong> {t.tools.textCase.page.features.instant.split(":")[1] || t.tools.textCase.page.features.instant.substring(t.tools.textCase.page.features.instant.indexOf(" "))}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.features.multiFormat.split(":")[0] || t.tools.textCase.page.features.multiFormat.split(" ")[0]}:</strong> {t.tools.textCase.page.features.multiFormat.split(":")[1] || t.tools.textCase.page.features.multiFormat.substring(t.tools.textCase.page.features.multiFormat.indexOf(" "))}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.features.copy.split(":")[0] || t.tools.textCase.page.features.copy.split(" ")[0]}:</strong> {t.tools.textCase.page.features.copy.split(":")[1] || t.tools.textCase.page.features.copy.substring(t.tools.textCase.page.features.copy.indexOf(" "))}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.features.secure.split(":")[0] || t.tools.textCase.page.features.secure.split(" ")[0]}:</strong> {t.tools.textCase.page.features.secure.split(":")[1] || t.tools.textCase.page.features.secure.substring(t.tools.textCase.page.features.secure.indexOf(" "))}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.features.stats.split(":")[0] || t.tools.textCase.page.features.stats.split(" ")[0]}:</strong> {t.tools.textCase.page.features.stats.split(":")[1] || t.tools.textCase.page.features.stats.substring(t.tools.textCase.page.features.stats.indexOf(" "))}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* How to Use */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.howToUse}</h2>
                    <ol className='space-y-2 text-gray-600 dark:text-gray-400 list-decimal list-inside'>
                        <li>{t.tools.textCase.page.steps.step1}</li>
                        <li>{t.tools.textCase.page.steps.step2}</li>
                        <li>{t.tools.textCase.page.steps.step3}</li>
                        <li>{t.tools.textCase.page.steps.step4}</li>
                    </ol>
                </section>

                {/* Use Cases */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.useCases}</h2>
                    <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.useCasesList.programming.split(":")[0]}:</strong> {t.tools.textCase.page.useCasesList.programming.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.useCasesList.writing.split(":")[0]}:</strong> {t.tools.textCase.page.useCasesList.writing.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.useCasesList.data.split(":")[0]}:</strong> {t.tools.textCase.page.useCasesList.data.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.useCasesList.seo.split(":")[0]}:</strong> {t.tools.textCase.page.useCasesList.seo.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.useCasesList.documentation.split(":")[0]}:</strong> {t.tools.textCase.page.useCasesList.documentation.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.useCasesList.design.split(":")[0]}:</strong> {t.tools.textCase.page.useCasesList.design.split(":").slice(1).join(":")}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* Case Types */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.caseTypes}</h2>
                    <div className='grid md:grid-cols-2 gap-6'>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.uppercase}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.caseTypesList.uppercase}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.lowercase}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.caseTypesList.lowercase}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.titleCase}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.caseTypesList.titleCase}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.sentenceCase}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.caseTypesList.sentenceCase}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.camelCase}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.caseTypesList.camelCase}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.snakeCase}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.caseTypesList.snakeCase}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.kebabCase}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.caseTypesList.kebabCase}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.faq}</h2>
                    <div className='space-y-6'>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.faqList.q1}</h3>
                            <p className='text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.faqList.a1}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.faqList.q2}</h3>
                            <p className='text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.faqList.a2}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.faqList.q3}</h3>
                            <p className='text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.faqList.a3}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.faqList.q4}</h3>
                            <p className='text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.faqList.a4}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.page.faqList.q5}</h3>
                            <p className='text-gray-600 dark:text-gray-400'>{t.tools.textCase.page.faqList.a5}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
