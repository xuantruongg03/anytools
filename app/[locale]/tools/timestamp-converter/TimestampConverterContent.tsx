"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import TimestampConverterClient from "./TimestampConverterClient";

export default function TimestampConverterContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.timestampConverter.page;

    return (
        <div className='w-full max-w-6xl mx-auto overflow-x-hidden'>
            <div className='text-center mb-8'>
                <h1 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.title}</h1>
                <p className='text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>{t.subtitle}</p>
            </div>

            <TimestampConverterClient />

            <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300 wrap-break-word'>
                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.whatIs}</h2>
                    <p className='leading-relaxed mb-4'>{t.whatIsDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.history}</h2>
                    <p className='leading-relaxed'>{t.historyDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.howWorks}</h2>
                    <p className='leading-relaxed'>{t.howWorksDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.formats}</h2>
                    <ul className='space-y-2'>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.formatsList.seconds.split(":")[0]}:</strong> {t.formatsList.seconds.split(":").slice(1).join(":")}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.formatsList.milliseconds.split(":")[0]}:</strong> {t.formatsList.milliseconds.split(":").slice(1).join(":")}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.formatsList.microseconds.split(":")[0]}:</strong> {t.formatsList.microseconds.split(":").slice(1).join(":")}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.formatsList.iso8601.split(":")[0]}:</strong> {t.formatsList.iso8601.split(":").slice(1).join(":")}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.formatsList.rfc2822.split(":")[0]}:</strong> {t.formatsList.rfc2822.split(":").slice(1).join(":")}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.useCases}</h2>
                    <ul className='space-y-2'>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.database.split(":")[0]}:</strong> {t.useCasesList.database.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.api.split(":")[0]}:</strong> {t.useCasesList.api.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.logging.split(":")[0]}:</strong> {t.useCasesList.logging.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.caching.split(":")[0]}:</strong> {t.useCasesList.caching.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.scheduling.split(":")[0]}:</strong> {t.useCasesList.scheduling.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.authentication.split(":")[0]}:</strong> {t.useCasesList.authentication.split(":")[1]}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.advantages}</h2>
                    <ul className='space-y-2'>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.advantagesList.simple.split(":")[0]}:</strong> {t.advantagesList.simple.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.advantagesList.universal.split(":")[0]}:</strong> {t.advantagesList.universal.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.advantagesList.sortable.split(":")[0]}:</strong> {t.advantagesList.sortable.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.advantagesList.compact.split(":")[0]}:</strong> {t.advantagesList.compact.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.advantagesList.calculation.split(":")[0]}:</strong> {t.advantagesList.calculation.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.advantagesList.language.split(":")[0]}:</strong> {t.advantagesList.language.split(":")[1]}
                            </span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.timezone}</h2>
                    <p className='leading-relaxed'>{t.timezoneDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.y2038Problem}</h2>
                    <p className='leading-relaxed'>{t.y2038Desc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.bestPractices}</h2>
                    <ul className='space-y-2'>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.utc.split(":")[0]}:</strong> {t.bestPracticesList.utc.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.precision.split(":")[0]}:</strong> {t.bestPracticesList.precision.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.validation.split(":")[0]}:</strong> {t.bestPracticesList.validation.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.timezone.split(":")[0]}:</strong> {t.bestPracticesList.timezone.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.libraries.split(":")[0]}:</strong> {t.bestPracticesList.libraries.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.future.split(":")[0]}:</strong> {t.bestPracticesList.future.split(":")[1]}
                            </span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.howToUse}</h2>
                    <ol className='space-y-2 list-decimal list-inside'>
                        <li>{t.steps.current}</li>
                        <li>{t.steps.toDate}</li>
                        <li>{t.steps.toTimestamp}</li>
                        <li>{t.steps.formats}</li>
                    </ol>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.faq}</h2>
                    <div className='space-y-4'>
                        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.faqList.q1}</h3>
                            <p className='leading-relaxed'>{t.faqList.a1}</p>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.faqList.q2}</h3>
                            <p className='leading-relaxed'>{t.faqList.a2}</p>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.faqList.q3}</h3>
                            <p className='leading-relaxed'>{t.faqList.a3}</p>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.faqList.q4}</h3>
                            <p className='leading-relaxed'>{t.faqList.a4}</p>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.faqList.q5}</h3>
                            <p className='leading-relaxed'>{t.faqList.a5}</p>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.faqList.q6}</h3>
                            <p className='leading-relaxed'>{t.faqList.a6}</p>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.faqList.q7}</h3>
                            <p className='leading-relaxed'>{t.faqList.a7}</p>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.faqList.q8}</h3>
                            <p className='leading-relaxed'>{t.faqList.a8}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
