"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ipLookupTranslations } from "@/lib/i18n/tools/ip-lookup";
import FAQSection from "@/components/ui/FAQSection";

export default function IpLookupContent() {
    const { locale } = useLanguage();
    const t = ipLookupTranslations[locale].ipLookup.page;

    return (
        <div className='max-w-6xl mx-auto'>
            <div className='mt-12 prose prose-gray dark:prose-invert max-w-none'>
                {/* What Is */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>{t.whatIs}</h2>
                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{t.whatIsDesc}</p>
                </section>

                {/* Why Use */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>{t.whyUse}</h2>
                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{t.whyUseDesc}</p>
                </section>

                {/* Features */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.features}</h2>
                    <div className='grid md:grid-cols-2 gap-6'>
                        <div className='bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800'>
                            <h3 className='text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2'>🌍 {t.publicIp}</h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.publicIpDesc}</p>
                        </div>

                        <div className='bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800'>
                            <h3 className='text-lg font-semibold text-green-900 dark:text-green-100 mb-2'>🏠 {t.localIp}</h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.localIpDesc}</p>
                        </div>

                        <div className='bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800'>
                            <h3 className='text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2'>🔢 {t.ipVersions}</h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.ipVersionsDesc}</p>
                        </div>

                        <div className='bg-orange-50 dark:bg-orange-900/20 p-5 rounded-lg border border-orange-200 dark:border-orange-800'>
                            <h3 className='text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2'>📍 {t.geolocation}</h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.geolocationDesc}</p>
                        </div>

                        <div className='bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg border border-indigo-200 dark:border-indigo-800'>
                            <h3 className='text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2'>🏢 {t.ispInfo}</h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.ispInfoDesc}</p>
                        </div>

                        <div className='bg-teal-50 dark:bg-teal-900/20 p-5 rounded-lg border border-teal-200 dark:border-teal-800'>
                            <h3 className='text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2'>🔒 {t.privacy}</h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.privacyDesc}</p>
                        </div>
                    </div>
                </section>

                {/* IP Types */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.ipTypes}</h2>
                    <div className='grid md:grid-cols-2 gap-6'>
                        <div className='bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t.ipv4Title}</h3>
                            <ul className='space-y-2 text-gray-700 dark:text-gray-300 text-sm'>
                                <li>• {t.ipv4Point1}</li>
                                <li>• {t.ipv4Point2}</li>
                                <li>• {t.ipv4Point3}</li>
                            </ul>
                            <code className='block mt-3 p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs'>192.168.1.1</code>
                        </div>

                        <div className='bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t.ipv6Title}</h3>
                            <ul className='space-y-2 text-gray-700 dark:text-gray-300 text-sm'>
                                <li>• {t.ipv6Point1}</li>
                                <li>• {t.ipv6Point2}</li>
                                <li>• {t.ipv6Point3}</li>
                            </ul>
                            <code className='block mt-3 p-2 bg-gray-200 dark:bg-gray-700 rounded text-xs'>2001:0db8:85a3::8a2e:0370:7334</code>
                        </div>

                        <div className='bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800'>
                            <h3 className='text-lg font-semibold text-green-900 dark:text-green-100 mb-3'>{t.publicIpTitle}</h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>{t.publicIpPoint}</p>
                            <p className='text-gray-600 dark:text-gray-400 text-xs'>{t.publicIpExample}</p>
                        </div>

                        <div className='bg-amber-50 dark:bg-amber-900/20 p-5 rounded-lg border border-amber-200 dark:border-amber-800'>
                            <h3 className='text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3'>{t.privateIpTitle}</h3>
                            <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>{t.privateIpPoint}</p>
                            <p className='text-gray-600 dark:text-gray-400 text-xs'>{t.privateIpExample}</p>
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.useCases}</h2>
                    <div className='space-y-4'>
                        <div className='flex gap-4'>
                            <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>1</div>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t.useCase1}</h3>
                                <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.useCase1Desc}</p>
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>2</div>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t.useCase2}</h3>
                                <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.useCase2Desc}</p>
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>3</div>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t.useCase3}</h3>
                                <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.useCase3Desc}</p>
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>4</div>
                            <div>
                                <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t.useCase4}</h3>
                                <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.useCase4Desc}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <FAQSection
                    locale={locale}
                    faqs={[
                        { question: t.faq1Q, answer: t.faq1A },
                        { question: t.faq2Q, answer: t.faq2A },
                        { question: t.faq3Q, answer: t.faq3A },
                        { question: t.faq4Q, answer: t.faq4A },
                    ]}
                />
            </div>
        </div>
    );
}
