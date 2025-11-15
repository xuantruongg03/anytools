"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { numberConverterTranslations } from "@/lib/i18n/tools/number-converter";
import NumberConverterClient from "./NumberConverterClient";

export default function NumberConverterContent() {
    const { locale } = useLanguage();
    const t = numberConverterTranslations[locale].numberConverter.page;

    return (
        <div className='w-full max-w-6xl mx-auto overflow-x-hidden'>
            <div className='text-center mb-8'>
                <h1 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.title}</h1>
                <p className='text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>{t.subtitle}</p>
            </div>

            <NumberConverterClient />

            <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.whatIs}</h2>
                    <p className='leading-relaxed'>{t.whatIsDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.whyImportant}</h2>
                    <p className='leading-relaxed'>{t.whyImportantDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.numberSystems}</h2>
                    <div className='space-y-3'>
                        <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500'>
                            <p className='leading-relaxed font-mono'>{t.binary}</p>
                        </div>
                        <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500'>
                            <p className='leading-relaxed font-mono'>{t.decimal}</p>
                        </div>
                        <div className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500'>
                            <p className='leading-relaxed font-mono'>{t.hexadecimal}</p>
                        </div>
                        <div className='p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500'>
                            <p className='leading-relaxed font-mono'>{t.octal}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.bitwiseOps}</h2>
                    <p className='leading-relaxed mb-4'>{t.bitwiseDesc}</p>
                    <div className='grid md:grid-cols-2 gap-3'>
                        {[
                            { text: t.andOp, color: "blue" },
                            { text: t.orOp, color: "green" },
                            { text: t.xorOp, color: "purple" },
                            { text: t.notOp, color: "red" },
                            { text: t.leftShiftOp, color: "indigo" },
                            { text: t.rightShiftOp, color: "pink" },
                            { text: t.unsignedRightShiftOp, color: "teal" },
                        ].map((item, idx) => (
                            <div key={idx} className={`p-3 bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded border-l-4 border-${item.color}-500`}>
                                <p className='text-sm font-mono'>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.numberRepresentation}</h2>
                    <p className='leading-relaxed mb-4'>{t.representationDesc}</p>
                    <div className='space-y-3'>
                        <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500'>
                            <p className='leading-relaxed font-mono text-sm'>{t.unsignedInt}</p>
                        </div>
                        <div className='p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500'>
                            <p className='leading-relaxed font-mono text-sm'>{t.signedMagnitude}</p>
                        </div>
                        <div className='p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500'>
                            <p className='leading-relaxed font-mono text-sm'>{t.onesComplement}</p>
                        </div>
                        <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500'>
                            <p className='leading-relaxed font-mono text-sm'>
                                <strong>✓ {t.twosComplement}</strong>
                            </p>
                        </div>
                        <div className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500'>
                            <p className='leading-relaxed font-mono text-sm'>{t.excessK}</p>
                        </div>
                        <div className='p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-l-4 border-pink-500'>
                            <p className='leading-relaxed font-mono text-sm'>{t.ieee754}</p>
                        </div>
                    </div>

                    <div className='mt-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-gray-300 dark:border-gray-600'>
                        <h3 className='font-bold text-lg text-gray-900 dark:text-gray-100 mb-3'>{t.twosComplementSteps}</h3>
                        <div className='space-y-2'>
                            <p className='text-green-600 dark:text-green-400'>• {t.step1}</p>
                            <p className='text-blue-600 dark:text-blue-400'>• {t.step2}</p>
                            <p className='text-purple-600 dark:text-purple-400'>• {t.step3}</p>
                        </div>
                        <pre className='mt-4 p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre'>{t.step4Example}</pre>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.cpuArithmetic}</h2>
                    <p className='leading-relaxed mb-4'>{t.cpuDesc}</p>
                    <div className='space-y-3'>
                        <div className='p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-500'>
                            <h4 className='font-bold text-indigo-900 dark:text-indigo-100 mb-2'>ALU</h4>
                            <p className='text-sm text-indigo-800 dark:text-indigo-200'>{t.aluDescription}</p>
                        </div>
                        <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500'>
                            <h4 className='font-bold text-green-900 dark:text-green-100 mb-2'>Full Adder</h4>
                            <p className='text-sm text-green-800 dark:text-green-200 font-mono'>{t.fullAdder}</p>
                        </div>
                        <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500'>
                            <h4 className='font-bold text-blue-900 dark:text-blue-100 mb-2'>Carry Look-ahead</h4>
                            <p className='text-sm text-blue-800 dark:text-blue-200'>{t.carryLookahead}</p>
                        </div>
                        <div className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500'>
                            <h4 className='font-bold text-purple-900 dark:text-purple-100 mb-2'>Multiplication</h4>
                            <p className='text-sm text-purple-800 dark:text-purple-200 font-mono'>{t.boothMultiplier}</p>
                        </div>
                        <div className='p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500'>
                            <h4 className='font-bold text-orange-900 dark:text-orange-100 mb-2'>Division</h4>
                            <p className='text-sm text-orange-800 dark:text-orange-200'>{t.divisionAlgo}</p>
                        </div>
                        <div className='p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-l-4 border-pink-500'>
                            <h4 className='font-bold text-pink-900 dark:text-pink-100 mb-2'>Floating-Point</h4>
                            <p className='text-sm text-pink-800 dark:text-pink-200'>{t.floatingPoint}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.useCases}</h2>
                    <ul className='space-y-2'>
                        {[t.use1, t.use2, t.use3, t.use4, t.use5, t.use6, t.use7, t.use8].map((use, idx) => (
                            <li key={idx} className='flex gap-3'>
                                <span className='text-blue-600 dark:text-blue-400 mt-1'>→</span>
                                <span>{use}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.conversions}</h2>
                    <div className='space-y-2'>
                        {[t.conv1, t.conv2, t.conv3, t.conv4, t.conv5, t.conv6].map((conv, idx) => (
                            <div key={idx} className='p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700'>
                                <code className='text-sm text-green-600 dark:text-green-400'>{conv}</code>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.bestPractices}</h2>
                    <ul className='space-y-2'>
                        {[t.practice1, t.practice2, t.practice3, t.practice4, t.practice5, t.practice6, t.practice7, t.practice8].map((practice, idx) => (
                            <li key={idx} className='flex gap-3'>
                                <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                                <span>{practice}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className='bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border-l-4 border-indigo-500'>
                    <h2 className='text-2xl font-bold mb-4 text-indigo-900 dark:text-indigo-100'>{t.performance}</h2>
                    <p className='leading-relaxed text-indigo-900 dark:text-indigo-100'>{t.performanceDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.applications}</h2>
                    <div className='space-y-3'>
                        {[t.app1, t.app2, t.app3, t.app4, t.app5, t.app6].map((app, idx) => (
                            <div key={idx} className='p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-500'>
                                <p className='text-sm font-mono'>{app}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.tips}</h2>
                    <div className='grid md:grid-cols-2 gap-3'>
                        {[t.tip1, t.tip2, t.tip3, t.tip4, t.tip5, t.tip6].map((tip, idx) => (
                            <div key={idx} className='p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded border border-cyan-200 dark:border-cyan-800'>
                                <p className='text-sm'>💡 {tip}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.faq}</h2>
                    <div className='space-y-4'>
                        {[
                            { q: t.q1, a: t.a1 },
                            { q: t.q2, a: t.a2 },
                            { q: t.q3, a: t.a3 },
                            { q: t.q4, a: t.a4 },
                            { q: t.q5, a: t.a5 },
                            { q: t.q6, a: t.a6 },
                            { q: t.q7, a: t.a7 },
                            { q: t.q8, a: t.a8 },
                        ].map((faq, idx) => (
                            <div key={idx} className='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700'>
                                <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{faq.q}</h3>
                                <p className='leading-relaxed'>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
