"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import TailwindCssClient from "./TailwindCssClient";

export default function TailwindCssContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <header className='mb-8'>
                    <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.title}</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>{t.tools.tailwindCss.page.subtitle}</p>
                </header>

                <TailwindCssClient />

                {/* What is Tailwind CSS */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.whatIsTailwind}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{t.tools.tailwindCss.page.whatIsTailwindDesc}</p>
                </section>

                {/* Why Use */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.whyUse}</h2>
                    <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.features.learn.split(":")[0]}:</strong> {t.tools.tailwindCss.page.features.learn.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.features.migrate.split(":")[0]}:</strong> {t.tools.tailwindCss.page.features.migrate.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.features.understand.split(":")[0]}:</strong> {t.tools.tailwindCss.page.features.understand.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.features.quick.split(":")[0]}:</strong> {t.tools.tailwindCss.page.features.quick.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.features.bidirectional.split(":")[0]}:</strong> {t.tools.tailwindCss.page.features.bidirectional.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.features.instant.split(":")[0]}:</strong> {t.tools.tailwindCss.page.features.instant.split(":").slice(1).join(":")}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* How to Use */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.howToUse}</h2>
                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
                        <ol className='space-y-3 text-gray-700 dark:text-gray-300 list-decimal list-inside'>
                            <li>{t.tools.tailwindCss.page.howToSteps.step1}</li>
                            <li>{t.tools.tailwindCss.page.howToSteps.step2}</li>
                            <li>{t.tools.tailwindCss.page.howToSteps.step3}</li>
                            <li>{t.tools.tailwindCss.page.howToSteps.step4}</li>
                        </ol>
                    </div>
                </section>

                {/* Use Cases */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.useCases}</h2>
                    <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.useCasesList.learning.split(":")[0]}:</strong> {t.tools.tailwindCss.page.useCasesList.learning.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.useCasesList.migration.split(":")[0]}:</strong> {t.tools.tailwindCss.page.useCasesList.migration.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.useCasesList.debugging.split(":")[0]}:</strong> {t.tools.tailwindCss.page.useCasesList.debugging.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.useCasesList.documentation.split(":")[0]}:</strong> {t.tools.tailwindCss.page.useCasesList.documentation.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.useCasesList.team.split(":")[0]}:</strong> {t.tools.tailwindCss.page.useCasesList.team.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.useCasesList.reference.split(":")[0]}:</strong> {t.tools.tailwindCss.page.useCasesList.reference.split(":").slice(1).join(":")}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* Common Tailwind Classes */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.commonClasses}</h2>
                    <div className='grid md:grid-cols-2 gap-4'>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.commonClassesList.layout}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.commonClassesList.spacing}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.commonClassesList.sizing}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.commonClassesList.colors}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.commonClassesList.typography}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.commonClassesList.effects}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.faq}</h2>
                    <div className='space-y-6'>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.faqList.q1}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.faqList.a1}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.faqList.q2}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.faqList.a2}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.faqList.q3}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.faqList.a3}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.faqList.q4}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.faqList.a4}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.tools.tailwindCss.page.faqList.q5}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{t.tools.tailwindCss.page.faqList.a5}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
