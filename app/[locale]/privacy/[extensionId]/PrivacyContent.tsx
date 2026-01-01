"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { privacyTranslations, type PrivacyPolicyData } from "@/lib/i18n/pages/privacy";

interface PrivacyContentProps {
    privacyData: PrivacyPolicyData;
    chromeUrl?: string;
    githubUrl?: string;
}

export default function PrivacyContent({ privacyData, chromeUrl, githubUrl }: PrivacyContentProps) {
    const { locale } = useLanguage();
    const t = privacyTranslations[locale].privacy.page;

    // Helper function to replace placeholders
    const replacePlaceholder = (text: string) => {
        return text.replace(/{extensionName}/g, privacyData.extensionName);
    };

    return (
        <div className='max-w-4xl mx-auto'>
            {/* Back Link */}
            <Link href='/browser-extensions' className='inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors'>
                {t.backToExtensions}
            </Link>

            {/* Header */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8'>
                <div className='flex items-center gap-4 mb-4'>
                    <div className='w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
                        <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
                        </svg>
                    </div>
                    <div>
                        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                            {t.title} - {privacyData.extensionName}
                        </h1>
                        <p className='text-gray-500 dark:text-gray-400 mt-1'>
                            {t.lastUpdated}: {privacyData.lastUpdated}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap gap-3 mt-6'>
                    {chromeUrl && (
                        <a href={chromeUrl} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'>
                            <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                                <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8a7.2 7.2 0 110 14.4 7.2 7.2 0 010-14.4z' />
                            </svg>
                            {t.viewOnStore}
                        </a>
                    )}
                    {githubUrl && (
                        <a href={githubUrl} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors'>
                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                <path
                                    fillRule='evenodd'
                                    d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            {t.viewSourceCode}
                        </a>
                    )}
                </div>
            </div>

            {/* Privacy Policy Content */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8'>
                {/* Section 1: Information We Collect */}
                <section>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>{t.sections.informationCollect.title}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{replacePlaceholder(t.sections.informationCollect.content)}</p>
                </section>

                {/* Section 2: Data Usage */}
                <section>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>{t.sections.dataUsage.title}</h2>
                    <ul className='space-y-2'>
                        {t.sections.dataUsage.items.map((item, index) => (
                            <li key={index} className='flex items-start gap-3 text-gray-600 dark:text-gray-400'>
                                <svg className='w-5 h-5 text-green-500 mt-0.5 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>
                    {privacyData.additionalInfo && (
                        <p className='mt-4 text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                            <span className='font-medium text-blue-700 dark:text-blue-400'>Note: </span>
                            {privacyData.additionalInfo[locale]}
                        </p>
                    )}
                </section>

                {/* Section 3: Storage */}
                <section>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>{t.sections.storage.title}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{t.sections.storage.content}</p>
                </section>

                {/* Section 4: Third-Party Services */}
                <section>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>{t.sections.thirdParty.title}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{replacePlaceholder(t.sections.thirdParty.content)}</p>
                </section>

                {/* Section 5: Permissions Usage */}
                <section>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>{t.sections.permissions.title}</h2>
                    <p className='text-gray-600 dark:text-gray-400 mb-4'>{t.sections.permissions.description}</p>
                    <div className='space-y-3'>
                        {privacyData.permissions.map((permission, index) => (
                            <div key={index} className='flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                                <div className='w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center shrink-0'>
                                    <svg className='w-4 h-4 text-purple-600 dark:text-purple-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className='font-semibold text-gray-900 dark:text-white'>{permission.name}</h3>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>{permission.description[locale]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 6: Contact */}
                <section>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>{t.sections.contact.title}</h2>
                    <p className='text-gray-600 dark:text-gray-400 mb-2'>{t.sections.contact.content}</p>
                    <div className='space-y-2'>
                        <p className='text-gray-600 dark:text-gray-400'>
                            <span className='font-medium'>Email: </span>
                            <a href={`mailto:${t.sections.contact.email}`} className='text-blue-600 dark:text-blue-400 hover:underline'>
                                {t.sections.contact.email}
                            </a>
                        </p>
                        <p className='text-gray-600 dark:text-gray-400'>
                            <span className='font-medium'>Website: </span>
                            <a href={t.sections.contact.website} target='_blank' rel='noopener noreferrer' className='text-blue-600 dark:text-blue-400 hover:underline'>
                                {t.sections.contact.website}
                            </a>
                        </p>
                    </div>
                </section>

                {/* Section 7: Changes */}
                <section>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>{t.sections.changes.title}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{t.sections.changes.content}</p>
                </section>
            </div>

            {/* Footer */}
            <div className='text-center mt-8 text-gray-500 dark:text-gray-400'>
                <p>© {new Date().getFullYear()} AnyTools. All rights reserved.</p>
            </div>
        </div>
    );
}
