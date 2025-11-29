"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import JwtDecoderClient from "./JwtDecoderClient";

export default function JwtDecoderContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.jwtDecoder.page;

    return (
        <div className='w-full max-w-6xl mx-auto overflow-x-hidden'>
            <JwtDecoderClient />

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
                            <span>{t.features.offline}</span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>{t.features.noServer}</span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>{t.features.multiAlgo}</span>
                        </li>
                        <li className='flex items-start gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 mt-1'>✓</span>
                            <span>{t.features.validation}</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.claims}</h2>
                    <ul className='space-y-2'>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.claimsList.iss.split(":")[0]}:</strong> {t.claimsList.iss.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.claimsList.sub.split(":")[0]}:</strong> {t.claimsList.sub.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.claimsList.aud.split(":")[0]}:</strong> {t.claimsList.aud.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.claimsList.exp.split(":")[0]}:</strong> {t.claimsList.exp.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.claimsList.nbf.split(":")[0]}:</strong> {t.claimsList.nbf.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.claimsList.iat.split(":")[0]}:</strong> {t.claimsList.iat.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.claimsList.jti.split(":")[0]}:</strong> {t.claimsList.jti.split(":")[1]}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.algorithms}</h2>
                    <div className='space-y-4'>
                        <div className='bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-4 rounded'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.algorithmsList.hs256.title}</h3>
                            <p className='leading-relaxed'>{t.algorithmsList.hs256.desc}</p>
                        </div>
                        <div className='bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 p-4 rounded'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.algorithmsList.rs256.title}</h3>
                            <p className='leading-relaxed'>{t.algorithmsList.rs256.desc}</p>
                        </div>
                        <div className='bg-purple-50 dark:bg-purple-900/10 border-l-4 border-purple-500 p-4 rounded'>
                            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-2'>{t.algorithmsList.es256.title}</h3>
                            <p className='leading-relaxed'>{t.algorithmsList.es256.desc}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.useCases}</h2>
                    <ul className='space-y-2'>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.auth.split(":")[0]}:</strong> {t.useCasesList.auth.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.api.split(":")[0]}:</strong> {t.useCasesList.api.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.sso.split(":")[0]}:</strong> {t.useCasesList.sso.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.oauth.split(":")[0]}:</strong> {t.useCasesList.oauth.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.microservices.split(":")[0]}:</strong> {t.useCasesList.microservices.split(":")[1]}
                        </li>
                        <li>
                            <strong className='text-gray-900 dark:text-gray-100'>{t.useCasesList.mobile.split(":")[0]}:</strong> {t.useCasesList.mobile.split(":")[1]}
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.security}</h2>
                    <p className='leading-relaxed'>{t.securityDesc}</p>
                </section>

                <section>
                    <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.performance}</h2>
                    <p className='leading-relaxed'>{t.performanceDesc}</p>
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
