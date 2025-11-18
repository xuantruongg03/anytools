"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { gpaCalculatorTranslations } from "@/lib/i18n/tools/gpa-calculator";

export default function GpaCalculatorContent() {
    const { locale } = useLanguage();
    const t = gpaCalculatorTranslations[locale].gpaCalculator.page;

    return (
        <div className='max-w-6xl mx-auto'>
            <div className='mt-12 prose prose-lg max-w-none dark:prose-invert'>
                {/* Credit System Section */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{t.creditSystemTitle}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>{t.creditSystemDesc}</p>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>{t.creditSystemFeaturesTitle}</h3>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                        <li dangerouslySetInnerHTML={{ __html: t.creditSystemFeatures.credit }} />
                        <li dangerouslySetInnerHTML={{ __html: t.creditSystemFeatures.flexibility }} />
                        <li dangerouslySetInnerHTML={{ __html: t.creditSystemFeatures.independence }} />
                        <li dangerouslySetInnerHTML={{ __html: t.creditSystemFeatures.evaluation }} />
                    </ul>
                </section>

                {/* GPA Section */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{t.gpaTitle}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>{t.gpaDesc}</p>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>{t.gpaTypesTitle}</h3>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                        <li dangerouslySetInnerHTML={{ __html: t.gpaTypes.term }} />
                        <li dangerouslySetInnerHTML={{ __html: t.gpaTypes.cumulative }} />
                        <li dangerouslySetInnerHTML={{ __html: t.gpaTypes.major }} />
                    </ul>
                </section>

                {/* Formula Section */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{t.formulaTitle}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>{t.formulaDesc}</p>

                    <div className='bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-lg mb-4'>
                        <p className='font-mono text-center text-xl mb-4 text-gray-900 dark:text-white'>GPA = (Σ (Grade × Credit)) / (Σ Credit)</p>
                        <ol className='list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
                            <li>{t.formulaSteps.step1}</li>
                            <li>{t.formulaSteps.step2}</li>
                            <li>{t.formulaSteps.step3}</li>
                        </ol>
                    </div>

                    <p className='text-sm text-gray-600 dark:text-gray-400' dangerouslySetInnerHTML={{ __html: t.formulaNote }} />
                </section>

                {/* Classification Section */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{t.classificationTitle}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>{t.classificationDesc}</p>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
                        <div className='bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg'>
                            <p className='text-gray-800 dark:text-gray-200' dangerouslySetInnerHTML={{ __html: t.classifications.excellent }} />
                        </div>
                        <div className='bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 p-4 rounded-lg'>
                            <p className='text-gray-800 dark:text-gray-200' dangerouslySetInnerHTML={{ __html: t.classifications.good }} />
                        </div>
                        <div className='bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 p-4 rounded-lg'>
                            <p className='text-gray-800 dark:text-gray-200' dangerouslySetInnerHTML={{ __html: t.classifications.fair }} />
                        </div>
                        <div className='bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 p-4 rounded-lg'>
                            <p className='text-gray-800 dark:text-gray-200' dangerouslySetInnerHTML={{ __html: t.classifications.average }} />
                        </div>
                        <div className='bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 p-4 rounded-lg'>
                            <p className='text-gray-800 dark:text-gray-200' dangerouslySetInnerHTML={{ __html: t.classifications.weak }} />
                        </div>
                    </div>

                    <p className='text-sm text-gray-600 dark:text-gray-400' dangerouslySetInnerHTML={{ __html: t.classificationNote }} />
                </section>

                {/* Importance Section */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{t.importanceTitle}</h2>
                    <ul className='space-y-3'>
                        <li className='flex items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
                            <span className='text-2xl mr-3'>🎓</span>
                            <p className='text-gray-700 dark:text-gray-300' dangerouslySetInnerHTML={{ __html: t.importanceItems.scholarship }} />
                        </li>
                        <li className='flex items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
                            <span className='text-2xl mr-3'>🎯</span>
                            <p className='text-gray-700 dark:text-gray-300' dangerouslySetInnerHTML={{ __html: t.importanceItems.graduation }} />
                        </li>
                        <li className='flex items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
                            <span className='text-2xl mr-3'>✈️</span>
                            <p className='text-gray-700 dark:text-gray-300' dangerouslySetInnerHTML={{ __html: t.importanceItems.studyAbroad }} />
                        </li>
                        <li className='flex items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
                            <span className='text-2xl mr-3'>💼</span>
                            <p className='text-gray-700 dark:text-gray-300' dangerouslySetInnerHTML={{ __html: t.importanceItems.employment }} />
                        </li>
                        <li className='flex items-start bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
                            <span className='text-2xl mr-3'>🏆</span>
                            <p className='text-gray-700 dark:text-gray-300' dangerouslySetInnerHTML={{ __html: t.importanceItems.competition }} />
                        </li>
                    </ul>
                </section>

                {/* Tips Section */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{t.tipsTitle}</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg'>
                            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>{t.tips.highCredit.title}</h4>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tips.highCredit.desc}</p>
                        </div>
                        <div className='bg-green-50 dark:bg-green-900/20 p-5 rounded-lg'>
                            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>{t.tips.maintain.title}</h4>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tips.maintain.desc}</p>
                        </div>
                        <div className='bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg'>
                            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>{t.tips.retake.title}</h4>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tips.retake.desc}</p>
                        </div>
                        <div className='bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-lg'>
                            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>{t.tips.balance.title}</h4>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tips.balance.desc}</p>
                        </div>
                    </div>
                </section>

                {/* Import Guide Section */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{t.importTitle}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>{t.importDesc}</p>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>{t.importStepsTitle}</h3>
                    <ol className='list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4'>
                        <li>{t.importSteps.step1}</li>
                        <li dangerouslySetInnerHTML={{ __html: t.importSteps.step2 }} />
                        <li>{t.importSteps.step3}</li>
                    </ol>

                    <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4'>
                        <p className='text-sm font-semibold text-gray-900 dark:text-white mb-2'>{t.importExampleTitle}</p>
                        <pre className='text-sm text-gray-800 dark:text-gray-300 overflow-x-auto'>{t.importExample}</pre>
                    </div>

                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3'>{t.importRequirementsTitle}</h3>
                    <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-4'>
                        <li dangerouslySetInnerHTML={{ __html: t.importRequirements.grade }} />
                        <li dangerouslySetInnerHTML={{ __html: t.importRequirements.credit }} />
                        <li dangerouslySetInnerHTML={{ __html: t.importRequirements.fileSize }} />
                        <li dangerouslySetInnerHTML={{ __html: t.importRequirements.format }} />
                    </ul>

                    <div className='bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg mt-4'>
                        <p className='text-sm text-gray-700 dark:text-gray-300' dangerouslySetInnerHTML={{ __html: t.importWarning }} />
                    </div>
                </section>

                {/* Conclusion Section */}
                <section className='mb-12'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{t.conclusionTitle}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-4'>{t.conclusionDesc}</p>

                    <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
                        <p className='text-sm text-gray-700 dark:text-gray-300' dangerouslySetInnerHTML={{ __html: t.conclusionTip }} />
                    </div>
                </section>
            </div>
        </div>
    );
}
