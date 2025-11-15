"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { passwordGeneratorTranslations } from "@/lib/i18n/tools/password-generator";
import FAQSection from "@/components/ui/FAQSection";

export default function PasswordGeneratorContent() {
    const { locale } = useLanguage();
    const t = passwordGeneratorTranslations[locale].passwordGenerator.page;

    return (
        <div className='mt-12 prose prose-gray dark:prose-invert max-w-none'>
            {/* What Is */}
            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>{t.whatIs}</h2>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{t.whatIsDesc}</p>
            </section>

            {/* Why Strong */}
            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>{t.whyStrong}</h2>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{t.whyStrongDesc}</p>
            </section>

            {/* Features */}
            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.features}</h2>
                <div className='grid md:grid-cols-2 gap-6'>
                    <div className='bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800'>
                        <h3 className='text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2'>🎲 {t.randomGen}</h3>
                        <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.randomGenDesc}</p>
                    </div>

                    <div className='bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800'>
                        <h3 className='text-lg font-semibold text-green-900 dark:text-green-100 mb-2'>💭 {t.memorableGen}</h3>
                        <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.memorableGenDesc}</p>
                    </div>

                    <div className='bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800'>
                        <h3 className='text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2'>⚡ {t.strengthen}</h3>
                        <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.strengthenDesc}</p>
                    </div>

                    <div className='bg-orange-50 dark:bg-orange-900/20 p-5 rounded-lg border border-orange-200 dark:border-orange-800'>
                        <h3 className='text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2'>📊 {t.strengthAnalysis}</h3>
                        <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.strengthAnalysisDesc}</p>
                    </div>

                    <div className='bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg border border-indigo-200 dark:border-indigo-800'>
                        <h3 className='text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2'>⚙️ {t.customizable}</h3>
                        <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.customizableDesc}</p>
                    </div>

                    <div className='bg-teal-50 dark:bg-teal-900/20 p-5 rounded-lg border border-teal-200 dark:border-teal-800'>
                        <h3 className='text-lg font-semibold text-teal-900 dark:text-teal-100 mb-2'>🔒 {t.secure}</h3>
                        <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.secureDesc}</p>
                    </div>
                </div>
            </section>

            {/* How to Use */}
            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.howToUse}</h2>
                <div className='space-y-4'>
                    <div className='flex gap-4'>
                        <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>1</div>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t.step1}</h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.step1Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>2</div>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t.step2}</h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.step2Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>3</div>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t.step3}</h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.step3Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>4</div>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>{t.step4}</h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.step4Desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Password Types */}
            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.passwordTypes}</h2>
                <div className='grid md:grid-cols-2 gap-6'>
                    <div className='border border-gray-200 dark:border-gray-700 p-5 rounded-lg'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t.randomPassword}</h3>
                        <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.randomPasswordDesc}</p>
                    </div>
                    <div className='border border-gray-200 dark:border-gray-700 p-5 rounded-lg'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t.memorablePassword}</h3>
                        <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.memorablePasswordDesc}</p>
                    </div>
                    <div className='border border-gray-200 dark:border-gray-700 p-5 rounded-lg'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t.strengthenedPassword}</h3>
                        <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.strengthenedPasswordDesc}</p>
                    </div>
                    <div className='border border-gray-200 dark:border-gray-700 p-5 rounded-lg'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>{t.passphrasePassword}</h3>
                        <p className='text-gray-600 dark:text-gray-400 text-sm'>{t.passphrasePasswordDesc}</p>
                    </div>
                </div>
            </section>

            {/* Best Practices */}
            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.bestPractices}</h2>
                <ul className='space-y-2'>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.practice1}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.practice2}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.practice3}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.practice4}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.practice5}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.practice6}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.practice7}</span>
                    </li>
                    <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                        <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                        <span>{t.practice8}</span>
                    </li>
                </ul>
            </section>

            {/* Security Tips */}
            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.securityTips}</h2>
                <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6'>
                    <ul className='space-y-2'>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-yellow-600 dark:text-yellow-400 mt-1'>💡</span>
                            <span>{t.tip1}</span>
                        </li>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-yellow-600 dark:text-yellow-400 mt-1'>💡</span>
                            <span>{t.tip2}</span>
                        </li>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-yellow-600 dark:text-yellow-400 mt-1'>💡</span>
                            <span>{t.tip3}</span>
                        </li>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-yellow-600 dark:text-yellow-400 mt-1'>💡</span>
                            <span>{t.tip4}</span>
                        </li>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-yellow-600 dark:text-yellow-400 mt-1'>💡</span>
                            <span>{t.tip5}</span>
                        </li>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-yellow-600 dark:text-yellow-400 mt-1'>💡</span>
                            <span>{t.tip6}</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Common Mistakes */}
            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>{t.commonMistakes}</h2>
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6'>
                    <ul className='space-y-2'>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-red-600 dark:text-red-400 mt-1'>✗</span>
                            <span>{t.mistake1}</span>
                        </li>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-red-600 dark:text-red-400 mt-1'>✗</span>
                            <span>{t.mistake2}</span>
                        </li>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-red-600 dark:text-red-400 mt-1'>✗</span>
                            <span>{t.mistake3}</span>
                        </li>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-red-600 dark:text-red-400 mt-1'>✗</span>
                            <span>{t.mistake4}</span>
                        </li>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-red-600 dark:text-red-400 mt-1'>✗</span>
                            <span>{t.mistake5}</span>
                        </li>
                        <li className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-red-600 dark:text-red-400 mt-1'>✗</span>
                            <span>{t.mistake6}</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Entropy Explained */}
            <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>{t.entropyExplained}</h2>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-6'>{t.entropyDesc}</p>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded'>
                        <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.entropyLow}</p>
                    </div>
                    <div className='bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded'>
                        <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.entropyMedium}</p>
                    </div>
                    <div className='bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded'>
                        <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.entropyHigh}</p>
                    </div>
                    <div className='bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded'>
                        <p className='text-gray-700 dark:text-gray-300 text-sm'>{t.entropyVeryHigh}</p>
                    </div>
                </div>
            </section>

            {/* Entropy Explanation */}
            <section className='mb-8'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>{t.entropyExplained}</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>{t.entropyDesc}</p>
                <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2'>
                    <div className='flex items-center'>
                        <div className='w-32 font-medium text-gray-900 dark:text-gray-100'>{t.entropyLow}</div>
                        <div className='flex-1 h-2 bg-red-200 dark:bg-red-900 rounded-full'></div>
                    </div>
                    <div className='flex items-center'>
                        <div className='w-32 font-medium text-gray-900 dark:text-gray-100'>{t.entropyMedium}</div>
                        <div className='flex-1 h-2 bg-yellow-200 dark:bg-yellow-900 rounded-full'></div>
                    </div>
                    <div className='flex items-center'>
                        <div className='w-32 font-medium text-gray-900 dark:text-gray-100'>{t.entropyHigh}</div>
                        <div className='flex-1 h-2 bg-green-200 dark:bg-green-900 rounded-full'></div>
                    </div>
                    <div className='flex items-center'>
                        <div className='w-32 font-medium text-gray-900 dark:text-gray-100'>{t.entropyVeryHigh}</div>
                        <div className='flex-1 h-2 bg-blue-200 dark:bg-blue-900 rounded-full'></div>
                    </div>
                </div>
            </section>

            {/* Time to Crack Explanation */}
            <section className='mb-8'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>{t.timeToCrackExplained}</h2>
                <p className='text-gray-700 dark:text-gray-300'>{t.timeToCrackDesc}</p>
            </section>

            {/* FAQ */}
            <FAQSection
                title={t.faq}
                faqs={[
                    { question: t.q1, answer: t.a1 },
                    { question: t.q2, answer: t.a2 },
                    { question: t.q3, answer: t.a3 },
                    { question: t.q4, answer: t.a4 },
                    { question: t.q5, answer: t.a5 },
                    { question: t.q6, answer: t.a6 },
                    { question: t.q7, answer: t.a7 },
                    { question: t.q8, answer: t.a8 },
                ]}
            />
        </div>
    );
}
