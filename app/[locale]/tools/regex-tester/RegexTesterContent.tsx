"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import RegexTesterClient from "./RegexTesterClient";
import FAQSection from "@/components/ui/FAQSection";

export default function RegexTesterContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.regexTester.page;

    return (
        <div className='w-full max-w-6xl mx-auto overflow-x-hidden'>
            <RegexTesterClient />

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
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.syntax}</h2>
                    <p className='leading-relaxed'>{t.syntaxDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.metacharacters}</h2>
                    <ul className='space-y-2'>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.dot}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.caret}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.dollar}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.star}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.plus}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.question}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.brackets}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.pipe}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.parens}</li>
                        <li className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded'>{t.metacharactersList.braces}</li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.characterClasses}</h2>
                    <ul className='space-y-2'>
                        <li className='font-mono text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-4 border-blue-500'>{t.characterClassesList.digit}</li>
                        <li className='font-mono text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-4 border-blue-500'>{t.characterClassesList.notDigit}</li>
                        <li className='font-mono text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded border-l-4 border-green-500'>{t.characterClassesList.word}</li>
                        <li className='font-mono text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded border-l-4 border-green-500'>{t.characterClassesList.notWord}</li>
                        <li className='font-mono text-sm bg-purple-50 dark:bg-purple-900/20 p-2 rounded border-l-4 border-purple-500'>{t.characterClassesList.whitespace}</li>
                        <li className='font-mono text-sm bg-purple-50 dark:bg-purple-900/20 p-2 rounded border-l-4 border-purple-500'>{t.characterClassesList.notWhitespace}</li>
                        <li className='font-mono text-sm bg-orange-50 dark:bg-orange-900/20 p-2 rounded border-l-4 border-orange-500'>{t.characterClassesList.boundary}</li>
                        <li className='font-mono text-sm bg-orange-50 dark:bg-orange-900/20 p-2 rounded border-l-4 border-orange-500'>{t.characterClassesList.notBoundary}</li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.flags}</h2>
                    <ul className='space-y-2'>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.g.split(":")[0]}:</strong> {t.flagsList.g.split(":").slice(1).join(":")}
                        </li>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.i.split(":")[0]}:</strong> {t.flagsList.i.split(":").slice(1).join(":")}
                        </li>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.m.split(":")[0]}:</strong> {t.flagsList.m.split(":").slice(1).join(":")}
                        </li>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.s.split(":")[0]}:</strong> {t.flagsList.s.split(":").slice(1).join(":")}
                        </li>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.u.split(":")[0]}:</strong> {t.flagsList.u.split(":").slice(1).join(":")}
                        </li>
                        <li className='bg-gray-50 dark:bg-gray-800 p-3 rounded'>
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>{t.flagsList.y.split(":")[0]}:</strong> {t.flagsList.y.split(":").slice(1).join(":")}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.commonPatterns}</h2>
                    <div className='space-y-3'>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.email.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.email.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.url.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.url.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.phone.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.phone.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.ipv4.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.ipv4.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.date.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.date.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.hexColor.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.hexColor.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.username.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.username.split(":").slice(1).join(":")}</code>
                        </div>
                        <div className='bg-gray-50 dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700'>
                            <div className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>{t.patternsList.password.split(":")[0]}</div>
                            <code className='text-xs text-blue-600 dark:text-blue-400 break-all'>{t.patternsList.password.split(":").slice(1).join(":")}</code>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.useCases}</h2>
                    <ul className='space-y-2'>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.validation.split(":")[0]}:</strong> {t.useCasesList.validation.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.extraction.split(":")[0]}:</strong> {t.useCasesList.extraction.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.searchReplace.split(":")[0]}:</strong> {t.useCasesList.searchReplace.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.parsing.split(":")[0]}:</strong> {t.useCasesList.parsing.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.routing.split(":")[0]}:</strong> {t.useCasesList.routing.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.filtering.split(":")[0]}:</strong> {t.useCasesList.filtering.split(":")[1]}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.bestPractices}</h2>
                    <ul className='space-y-2'>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.simple.split(":")[0]}:</strong> {t.bestPracticesList.simple.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.specific.split(":")[0]}:</strong> {t.bestPracticesList.specific.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.anchor.split(":")[0]}:</strong> {t.bestPracticesList.anchor.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.escape.split(":")[0]}:</strong> {t.bestPracticesList.escape.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.test.split(":")[0]}:</strong> {t.bestPracticesList.test.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.comment.split(":")[0]}:</strong> {t.bestPracticesList.comment.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.performance.split(":")[0]}:</strong> {t.bestPracticesList.performance.split(":")[1]}
                            </span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-green-600 dark:text-green-400 mt-1'>→</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.bestPracticesList.alternative.split(":")[0]}:</strong> {t.bestPracticesList.alternative.split(":")[1]}
                            </span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.performance}</h2>
                    <p className='leading-relaxed'>{t.performanceDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.howToUse}</h2>
                    <ol className='space-y-2 list-decimal list-inside'>
                        <li>{t.steps.pattern}</li>
                        <li>{t.steps.flags}</li>
                        <li>{t.steps.text}</li>
                        <li>{t.steps.test}</li>
                        <li>{t.steps.iterate}</li>
                    </ol>
                </section>

                <FAQSection title={t.faq} faqs={t.faqList} />
            </div>
        </div>
    );
}
