"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";

export default function WeatherContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const weather_t = t.tools.weather;
    const page = weather_t.page;

    return (
        <div className='mt-8 space-y-8 max-w-6xl mx-auto'>
            {/* What is Weather Tool */}
            <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.whatIs}</h2>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{page.whatIsDesc}</p>
            </section>

            {/* Features */}
            <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.features.title}</h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='flex items-start gap-3'>
                        <span className='text-2xl'>📍</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.features.geolocation.title}</h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm'>{page.features.geolocation.desc}</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-3'>
                        <span className='text-2xl'>🔍</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.features.search.title}</h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm'>{page.features.search.desc}</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-3'>
                        <span className='text-2xl'>📅</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.features.forecast.title}</h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm'>{page.features.forecast.desc}</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-3'>
                        <span className='text-2xl'>🌡️</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.features.details.title}</h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm'>{page.features.details.desc}</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-3'>
                        <span className='text-2xl'>🌓</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.features.units.title}</h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm'>{page.features.units.desc}</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-3'>
                        <span className='text-2xl'>⚡</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.features.realtime.title}</h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm'>{page.features.realtime.desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Use */}
            <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.howToUse}</h2>
                <div className='space-y-4'>
                    <div className='flex items-start gap-3'>
                        <div className='shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold'>1</div>
                        <p className='text-gray-700 dark:text-gray-300 pt-1'>{page.step1}</p>
                    </div>
                    <div className='flex items-start gap-3'>
                        <div className='shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold'>2</div>
                        <p className='text-gray-700 dark:text-gray-300 pt-1'>{page.step2}</p>
                    </div>
                    <div className='flex items-start gap-3'>
                        <div className='shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold'>3</div>
                        <p className='text-gray-700 dark:text-gray-300 pt-1'>{page.step3}</p>
                    </div>
                    <div className='flex items-start gap-3'>
                        <div className='shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold'>4</div>
                        <p className='text-gray-700 dark:text-gray-300 pt-1'>{page.step4}</p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>{page.faq}</h2>
                <div className='space-y-6'>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>❓ {page.faqList.q1}</h3>
                        <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a1}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>❓ {page.faqList.q2}</h3>
                        <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a2}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>❓ {page.faqList.q3}</h3>
                        <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a3}</p>
                    </div>
                    <div>
                        <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>❓ {page.faqList.q4}</h3>
                        <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a4}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
