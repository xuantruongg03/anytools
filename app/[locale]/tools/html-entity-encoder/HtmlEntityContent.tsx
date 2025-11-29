"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { htmlEntityEncoderTranslations } from "@/lib/i18n/tools/html-entity-encoder";
import HtmlEntityClient from "./HtmlEntityClient";

export default function HtmlEntityContent() {
    const { locale } = useLanguage();
    const t = htmlEntityEncoderTranslations[locale].htmlEntityEncoder.page;

    const commonEntities = [
        { char: "&", entity: "&amp;", desc: t.ampersand },
        { char: "<", entity: "&lt;", desc: t.lessThan },
        { char: ">", entity: "&gt;", desc: t.greaterThan },
        { char: '"', entity: "&quot;", desc: t.quote },
        { char: "'", entity: "&#39;", desc: t.apostrophe },
        { char: " ", entity: "&nbsp;", desc: t.nbsp },
        { char: "©", entity: "&copy;", desc: t.copyright },
        { char: "®", entity: "&reg;", desc: t.registered },
        { char: "™", entity: "&trade;", desc: t.trademark },
        { char: "€", entity: "&euro;", desc: t.euro },
        { char: "£", entity: "&pound;", desc: t.pound },
        { char: "¥", entity: "&yen;", desc: t.yen },
    ];

    return (
        <div className='w-full max-w-4xl mx-auto overflow-x-hidden'>

            <HtmlEntityClient />

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
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.commonEntities}</h2>
                    <div className='overflow-x-auto'>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='bg-gray-100 dark:bg-gray-800'>
                                    <th className='border border-gray-300 dark:border-gray-700 px-4 py-2 text-left'>Character</th>
                                    <th className='border border-gray-300 dark:border-gray-700 px-4 py-2 text-left'>Entity</th>
                                    <th className='border border-gray-300 dark:border-gray-700 px-4 py-2 text-left'>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commonEntities.map((item, idx) => (
                                    <tr key={idx} className='hover:bg-gray-50 dark:hover:bg-gray-800/50'>
                                        <td className='border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-xl text-center'>{item.char}</td>
                                        <td className='border border-gray-300 dark:border-gray-700 px-4 py-2 font-mono text-blue-600 dark:text-blue-400'>{item.entity}</td>
                                        <td className='border border-gray-300 dark:border-gray-700 px-4 py-2'>{item.desc}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.types}</h2>
                    <div className='space-y-3'>
                        <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500'>
                            <p className='leading-relaxed'>{t.namedEntities}</p>
                        </div>
                        <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500'>
                            <p className='leading-relaxed'>{t.numericEntities}</p>
                        </div>
                        <div className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500'>
                            <p className='leading-relaxed'>{t.hexEntities}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.whenToUse}</h2>
                    <ul className='space-y-3'>
                        <li className='flex gap-3'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>→</span>
                            <span>{t.use1}</span>
                        </li>
                        <li className='flex gap-3'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>→</span>
                            <span>{t.use2}</span>
                        </li>
                        <li className='flex gap-3'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>→</span>
                            <span>{t.use3}</span>
                        </li>
                        <li className='flex gap-3'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>→</span>
                            <span>{t.use4}</span>
                        </li>
                        <li className='flex gap-3'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>→</span>
                            <span>{t.use5}</span>
                        </li>
                        <li className='flex gap-3'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>→</span>
                            <span>{t.use6}</span>
                        </li>
                    </ul>
                </section>

                <section className='bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-500'>
                    <h2 className='text-2xl font-bold mb-4 text-red-900 dark:text-red-100'>{t.security}</h2>
                    <p className='leading-relaxed text-red-900 dark:text-red-100'>{t.securityDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.bestPractices}</h2>
                    <ul className='space-y-3'>
                        {[t.practice1, t.practice2, t.practice3, t.practice4, t.practice5, t.practice6, t.practice7, t.practice8].map((practice, idx) => (
                            <li key={idx} className='flex gap-3'>
                                <span className='text-green-600 dark:text-green-400 mt-1'>✓</span>
                                <span>{practice}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.encoding}</h2>
                    <p className='leading-relaxed'>{t.encodingDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.decoding}</h2>
                    <p className='leading-relaxed'>{t.decodingDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.specialCases}</h2>
                    <ul className='space-y-2'>
                        {[t.case1, t.case2, t.case3, t.case4, t.case5, t.case6].map((caseText, idx) => (
                            <li key={idx} className='p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-500'>
                                ⚠️ {caseText}
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.tools}</h2>
                    <div className='grid md:grid-cols-2 gap-3'>
                        {[t.tool1, t.tool2, t.tool3, t.tool4, t.tool5, t.tool6].map((tool, idx) => (
                            <div key={idx} className='p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700'>
                                <code className='text-sm text-blue-600 dark:text-blue-400'>{tool}</code>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.examples}</h2>
                    <div className='space-y-3'>
                        {[t.example1, t.example2, t.example3, t.example4].map((example, idx) => (
                            <div key={idx} className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                                <pre className='text-sm overflow-x-auto whitespace-pre-wrap'>
                                    <code className='text-green-600 dark:text-green-400'>{example}</code>
                                </pre>
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
