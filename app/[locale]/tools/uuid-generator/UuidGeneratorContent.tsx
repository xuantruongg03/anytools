"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import UuidGeneratorClient from "./UuidGeneratorClient";
import FAQSection from "@/components/ui/FAQSection";

export default function UuidGeneratorContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.uuidGenerator.page;

    return (
        <div className='max-w-6xl mx-auto'>
            <UuidGeneratorClient />

            <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.whatIs}</h2>
                    <p className='leading-relaxed mb-4'>{t.whatIsDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.history}</h2>
                    <p className='leading-relaxed'>{t.historyDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.structure}</h2>
                    <p className='leading-relaxed'>{t.structureDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.whyUse}</h2>
                    <ul className='space-y-2'>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>{t.features.free}</span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>{t.features.instant}</span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>{t.features.versions}</span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>{t.features.bulk}</span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>{t.features.copy}</span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>{t.features.secure}</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.versions}</h2>
                    <div className='space-y-4'>
                        <div className='bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 rounded'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.versionsList.v4.title}</h3>
                            <p className='leading-relaxed'>{t.versionsList.v4.desc}</p>
                        </div>
                        <div className='bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 p-4 rounded'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.versionsList.v1.title}</h3>
                            <p className='leading-relaxed'>{t.versionsList.v1.desc}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.performance}</h2>
                    <p className='leading-relaxed'>{t.performanceDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.security}</h2>
                    <p className='leading-relaxed'>{t.securityDesc}</p>
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
                    <ul className='space-y-2'>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.database.split(":")[0]}:</strong> {t.useCasesList.database.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.api.split(":")[0]}:</strong> {t.useCasesList.api.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.session.split(":")[0]}:</strong> {t.useCasesList.session.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.file.split(":")[0]}:</strong> {t.useCasesList.file.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.distributed.split(":")[0]}:</strong> {t.useCasesList.distributed.split(":")[1]}
                        </li>
                    </ul>
                </section>

                <FAQSection locale={locale} faqs={t.faqList} />
            </div>
        </div>
    );
}
