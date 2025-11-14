"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";

export default function AboutContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.about.page;

    return (
        <>
            <h1 className='text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100'>{t.about.title}</h1>

            <div className='prose dark:prose-invert max-w-none'>
                <p className='text-lg mb-6 text-gray-600 dark:text-gray-400'>{page.welcome}</p>

                <section className='mb-10'>
                    <h2 className='text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.missionTitle}</h2>
                    <p className='text-gray-600 dark:text-gray-400'>{page.missionDesc}</p>
                </section>

                <section className='mb-10'>
                    <h2 className='text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.whyTitle}</h2>
                    <div className='grid md:grid-cols-2 gap-6'>
                        <div className='p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.whyCards.fast.title}</h3>
                            <p className='text-gray-600 dark:text-gray-400'>{page.whyCards.fast.desc}</p>
                        </div>
                        <div className='p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.whyCards.secure.title}</h3>
                            <p className='text-gray-600 dark:text-gray-400'>{page.whyCards.secure.desc}</p>
                        </div>
                        <div className='p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.whyCards.free.title}</h3>
                            <p className='text-gray-600 dark:text-gray-400'>{page.whyCards.free.desc}</p>
                        </div>
                        <div className='p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.whyCards.clean.title}</h3>
                            <p className='text-gray-600 dark:text-gray-400'>{page.whyCards.clean.desc}</p>
                        </div>
                    </div>
                </section>

                <section className='mb-10'>
                    <h2 className='text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.toolsTitle}</h2>
                    <p className='text-gray-600 dark:text-gray-400 mb-4'>{page.toolsDesc}</p>
                    <ul className='list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400'>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{page.toolsList.developer.split(":")[0]}:</strong> {page.toolsList.developer.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{page.toolsList.text.split(":")[0]}:</strong> {page.toolsList.text.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{page.toolsList.design.split(":")[0]}:</strong> {page.toolsList.design.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{page.toolsList.more.split("!")[0]}!</strong> {page.toolsList.more.split("!")[1]}
                        </li>
                    </ul>
                </section>

                <section className='mb-10'>
                    <h2 className='text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.openSourceTitle}</h2>
                    <p className='text-gray-600 dark:text-gray-400 mb-4'>{page.openSourceDesc1}</p>
                    <p className='text-gray-600 dark:text-gray-400 mb-4'>{page.openSourceDesc2}</p>
                </section>

                <section className='mb-10'>
                    <h2 className='text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.contributeTitle}</h2>
                    <p className='text-gray-600 dark:text-gray-400 mb-4'>{page.contributeDesc}</p>

                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 border border-gray-200 dark:border-gray-700'>
                        <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.contributeSteps.title}</h3>
                        <ol className='list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-400'>
                            <li>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.contributeSteps.step1.split(":")[0]}:</strong> {page.contributeSteps.step1.split(":")[1]}
                            </li>
                            <li>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.contributeSteps.step2}</strong>
                                <code className='block mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono text-gray-800 dark:text-gray-200'>git clone https://github.com/xuantruongg03/anytools.git</code>
                            </li>
                            <li>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.contributeSteps.step3}</strong>
                                <code className='block mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono text-gray-800 dark:text-gray-200'>git checkout -b feature/your-new-tool</code>
                            </li>
                            <li>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.contributeSteps.step4.split(":")[0]}:</strong> {page.contributeSteps.step4.split(":")[1]}
                            </li>
                            <li>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.contributeSteps.step5.split(":")[0]}:</strong> {page.contributeSteps.step5.split(":")[1]}
                            </li>
                            <li>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.contributeSteps.step6}</strong>
                                <code className='block mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono text-gray-800 dark:text-gray-200'>
                                    git add .
                                    <br />
                                    git commit -m "Add: Your descriptive commit message"
                                </code>
                            </li>
                            <li>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.contributeSteps.step7}</strong>
                                <code className='block mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-sm font-mono text-gray-800 dark:text-gray-200'>git push origin feature/your-new-tool</code>
                            </li>
                            <li>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.contributeSteps.step8.split(":")[0]}:</strong> {page.contributeSteps.step8.split(":")[1]}
                            </li>
                        </ol>
                    </div>

                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4'>
                        <p className='text-sm text-blue-800 dark:text-blue-300'>{page.contributeSteps.tip}</p>
                    </div>
                </section>

                <section className='mb-10'>
                    <h2 className='text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.supportTitle}</h2>
                    <p className='text-gray-600 dark:text-gray-400 mb-4'>{page.supportDesc1}</p>
                    <p className='text-gray-600 dark:text-gray-400 mb-6'>{page.supportDesc2}</p>
                    <ul className='list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6'>
                        <li>{page.supportList.item1}</li>
                        <li>{page.supportList.item2}</li>
                        <li>{page.supportList.item3}</li>
                        <li>{page.supportList.item4}</li>
                    </ul>
                    <a href='/donate' className='inline-block px-6 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl'>
                        {page.supportButton}
                    </a>
                </section>

                <section>
                    <h2 className='text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.contactTitle}</h2>
                    <p className='text-gray-600 dark:text-gray-400'>{page.contactDesc}</p>
                </section>
            </div>
        </>
    );
}
