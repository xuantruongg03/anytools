"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import HashGeneratorClient from "./HashGeneratorClient";
import { getTranslation } from "@/lib/i18n";
import FAQSection from "@/components/ui/FAQSection";

export default function HashGeneratorContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <header className='mb-8'>
                    <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.title}</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>{t.tools.hashGenerator.page.subtitle}</p>
                </header>

                <HashGeneratorClient />

                {/* What is Hashing */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.whatIsHashing}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{t.tools.hashGenerator.page.whatIsHashingDesc}</p>
                </section>

                {/* What is Encryption */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.whatIsEncryption}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{t.tools.hashGenerator.page.whatIsEncryptionDesc}</p>
                </section>

                {/* Why Use */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.whyUse}</h2>
                    <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.features.free.split(":")[0] || t.tools.hashGenerator.page.features.free.split(" ")[0]}:</strong> {t.tools.hashGenerator.page.features.free.split(":")[1] || t.tools.hashGenerator.page.features.free.substring(t.tools.hashGenerator.page.features.free.indexOf(" "))}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.features.multiHash.split(":")[0]}:</strong> {t.tools.hashGenerator.page.features.multiHash.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.features.encryption.split(":")[0] || t.tools.hashGenerator.page.features.encryption.split(" ")[0]}:</strong> {t.tools.hashGenerator.page.features.encryption.split(":")[1] || t.tools.hashGenerator.page.features.encryption.substring(t.tools.hashGenerator.page.features.encryption.indexOf(" "))}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.features.instant.split(":")[0] || t.tools.hashGenerator.page.features.instant.split("-")[0]}:</strong> {t.tools.hashGenerator.page.features.instant.split(":")[1] || t.tools.hashGenerator.page.features.instant.substring(t.tools.hashGenerator.page.features.instant.indexOf("-") + 1)}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.features.secure.split(":")[0] || t.tools.hashGenerator.page.features.secure.split("-")[0]}:</strong> {t.tools.hashGenerator.page.features.secure.split(":")[1] || t.tools.hashGenerator.page.features.secure.substring(t.tools.hashGenerator.page.features.secure.indexOf("-") + 1)}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.features.copy.split(":")[0] || t.tools.hashGenerator.page.features.copy.split(" ")[0]}:</strong> {t.tools.hashGenerator.page.features.copy.split(":")[1] || t.tools.hashGenerator.page.features.copy.substring(t.tools.hashGenerator.page.features.copy.indexOf(" "))}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* How to Use */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.howToUse}</h2>
                    <div className='grid md:grid-cols-2 gap-6'>
                        <div className='p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.hashingSteps.title}</h3>
                            <ol className='space-y-2 text-gray-600 dark:text-gray-400 list-decimal list-inside'>
                                <li>{t.tools.hashGenerator.page.hashingSteps.step1}</li>
                                <li>{t.tools.hashGenerator.page.hashingSteps.step2}</li>
                                <li>{t.tools.hashGenerator.page.hashingSteps.step3}</li>
                                <li>{t.tools.hashGenerator.page.hashingSteps.step4}</li>
                            </ol>
                            <p className='mt-4 text-sm text-blue-600 dark:text-blue-400 italic'>{t.tools.hashGenerator.page.hashingSteps.note}</p>
                        </div>
                        <div className='p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.encryptionSteps.title}</h3>
                            <ol className='space-y-2 text-gray-600 dark:text-gray-400 list-decimal list-inside'>
                                <li>{t.tools.hashGenerator.page.encryptionSteps.step1}</li>
                                <li>{t.tools.hashGenerator.page.encryptionSteps.step2}</li>
                                <li>{t.tools.hashGenerator.page.encryptionSteps.step3}</li>
                                <li>{t.tools.hashGenerator.page.encryptionSteps.step4}</li>
                            </ol>
                            <p className='mt-4 text-sm text-red-600 dark:text-red-400 font-semibold italic'>{t.tools.hashGenerator.page.encryptionSteps.note}</p>
                        </div>
                    </div>
                </section>

                {/* Use Cases */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.useCases}</h2>
                    <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.useCasesList.passwords.split(":")[0]}:</strong> {t.tools.hashGenerator.page.useCasesList.passwords.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.useCasesList.fileIntegrity.split(":")[0]}:</strong> {t.tools.hashGenerator.page.useCasesList.fileIntegrity.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.useCasesList.dataEncryption.split(":")[0]}:</strong> {t.tools.hashGenerator.page.useCasesList.dataEncryption.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.useCasesList.digitalSignatures.split(":")[0]}:</strong> {t.tools.hashGenerator.page.useCasesList.digitalSignatures.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.useCasesList.blockchain.split(":")[0]}:</strong> {t.tools.hashGenerator.page.useCasesList.blockchain.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.useCasesList.messageEncryption.split(":")[0]}:</strong> {t.tools.hashGenerator.page.useCasesList.messageEncryption.split(":").slice(1).join(":")}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* Algorithms */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.algorithms}</h2>
                    <div className='space-y-4'>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>SHA-1 (160-bit)</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.hashGenerator.page.algorithmsList.sha1}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>SHA-256 (256-bit)</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.hashGenerator.page.algorithmsList.sha256}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>SHA-512 (512-bit)</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.hashGenerator.page.algorithmsList.sha512}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>AES Encryption</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.tools.hashGenerator.page.algorithmsList.aes}</p>
                        </div>
                    </div>
                </section>

                {/* Hash vs Encryption */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.tools.hashGenerator.page.hashVsEncryption}</h2>
                    <div className='grid md:grid-cols-2 gap-6'>
                        <div className='p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                            <h3 className='text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100'>{t.tools.hashGenerator.hashing}</h3>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tools.hashGenerator.page.hashVsEncryptionDesc.hashing}</p>
                        </div>
                        <div className='p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                            <h3 className='text-lg font-semibold mb-3 text-green-900 dark:text-green-100'>{t.tools.hashGenerator.encryption}</h3>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{t.tools.hashGenerator.page.hashVsEncryptionDesc.encryption}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <FAQSection
                    title={t.tools.hashGenerator.page.faq}
                    faqs={[
                        { question: t.tools.hashGenerator.page.faqList.q1, answer: t.tools.hashGenerator.page.faqList.a1 },
                        { question: t.tools.hashGenerator.page.faqList.q2, answer: t.tools.hashGenerator.page.faqList.a2 },
                        { question: t.tools.hashGenerator.page.faqList.q3, answer: t.tools.hashGenerator.page.faqList.a3 },
                        { question: t.tools.hashGenerator.page.faqList.q4, answer: t.tools.hashGenerator.page.faqList.a4 },
                        { question: t.tools.hashGenerator.page.faqList.q5, answer: t.tools.hashGenerator.page.faqList.a5 },
                    ]}
                />
            </div>
        </div>
    );
}
