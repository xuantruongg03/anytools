"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { appsTranslations } from "@/lib/i18n/pages/apps";
import { appCategoryTranslations, type App } from "@/constants/apps";

interface AppDetailContentProps {
    app: App;
}

export default function AppDetailContent({ app }: AppDetailContentProps) {
    const { locale } = useLanguage();
    const router = useRouter();
    const t = appsTranslations[locale].apps.page;

    // Helper function để redirect qua trang trung gian
    const handleRedirect = (targetUrl: string) => {
        router.push(`/${locale}/redirect?url=${encodeURIComponent(targetUrl)}`);
    };

    // Get pricing info
    const getPricingInfo = () => {
        if (app.isFree) {
            return { label: t.free, className: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" };
        } else if (app.hasFreeTier) {
            return { label: t.freeTier, className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" };
        } else {
            return { label: t.paid, className: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300" };
        }
    };

    const pricing = getPricingInfo();

    return (
        <div className='max-w-4xl mx-auto'>
            {/* Back Link */}
            <Link href={`/${locale}/apps`} className='inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
                {t.backToApps}
            </Link>

            {/* Header Card */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8'>
                <div className='flex items-start gap-6 mb-6'>
                    {/* App Icon */}
                    {app.icon ? <img src={app.icon} alt={app.name} className='w-20 h-20 rounded-2xl object-cover shadow-md' /> : <div className='w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md'>{app.name.charAt(0)}</div>}

                    <div className='flex-1'>
                        <div className='flex items-center gap-3 flex-wrap mb-2'>
                            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>{app.name}</h1>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${pricing.className}`}>{pricing.label}</span>
                        </div>
                        <p className='text-gray-500 dark:text-gray-400'>
                            {t.by} {app.author}
                        </p>
                        <div className='mt-2'>
                            <span className='inline-flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full'>{appCategoryTranslations[app.category][locale]}</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className='text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed'>{app.description[locale]}</p>

                {/* Download Buttons */}
                <div className='flex flex-wrap gap-4'>
                    {app.windowsUrl && (
                        <button onClick={() => handleRedirect(app.windowsUrl!)} className='inline-flex items-center gap-3 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl cursor-pointer'>
                            <svg className='w-6 h-6' viewBox='0 0 24 24' fill='currentColor'>
                                <path d='M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801' />
                            </svg>
                            {t.downloadFor} Windows
                        </button>
                    )}
                    {app.iosUrl && (
                        <button onClick={() => handleRedirect(app.iosUrl!)} className='inline-flex items-center gap-3 px-6 py-3 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl cursor-pointer'>
                            <svg className='w-6 h-6' viewBox='0 0 24 24' fill='currentColor'>
                                <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
                            </svg>
                            {t.downloadFor} iOS
                        </button>
                    )}
                </div>
            </div>

            {/* SEO Content */}
            {app.seo && (
                <>
                    {/* About Section */}
                    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{t.aboutApp}</h2>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{app.seo[locale].description}</p>
                    </div>

                    {/* Features Section */}
                    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>{t.seoSection.featuresTitle}</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {app.seo[locale].features.map((feature, idx) => (
                                <div key={idx} className='flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl'>
                                    <div className='w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0'>
                                        <svg className='w-5 h-5 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                        </svg>
                                    </div>
                                    <span className='text-gray-700 dark:text-gray-300'>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Use Cases Section */}
                    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>{t.seoSection.useCasesTitle}</h2>
                        <div className='space-y-4'>
                            {app.seo[locale].useCases.map((useCase, idx) => (
                                <div key={idx} className='flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl'>
                                    <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0'>
                                        <span className='text-blue-600 dark:text-blue-400 font-bold'>{idx + 1}</span>
                                    </div>
                                    <span className='text-gray-700 dark:text-gray-300'>{useCase}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Tags Section */}
            {app.tags && app.tags.length > 0 && (
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{t.tags}</h2>
                    <div className='flex flex-wrap gap-2'>
                        {app.tags.map((tag) => (
                            <span key={tag} className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm'>
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <div className='bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-center text-white'>
                <h2 className='text-2xl font-bold mb-4'>{t.readyToDownload}</h2>
                <p className='mb-6 opacity-90'>{t.downloadCta}</p>
                <div className='flex flex-wrap justify-center gap-4'>
                    {app.windowsUrl && (
                        <button onClick={() => handleRedirect(app.windowsUrl!)} className='inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-xl hover:bg-gray-100 transition-colors cursor-pointer'>
                            <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                                <path d='M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801' />
                            </svg>
                            Windows
                        </button>
                    )}
                    {app.iosUrl && (
                        <button onClick={() => handleRedirect(app.iosUrl!)} className='inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors cursor-pointer'>
                            <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                                <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z' />
                            </svg>
                            iOS
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
