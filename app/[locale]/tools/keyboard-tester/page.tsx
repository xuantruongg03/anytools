import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import KeyboardTesterContent from "./KeyboardTesterContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import { keyboardTesterTranslations } from "@/lib/i18n/tools/keyboard-tester";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    const title = isVi
        ? "Test Bàn Phím Online - Kiểm Tra Liệt Phím, NKRO & Đúp Phím Miễn Phí"
        : "Keyboard Tester Online - Test Broken Keys, NKRO & Key Chatter Free";
    const description = isVi
        ? "Công cụ kiểm tra bàn phím máy tính trực tuyến miễn phí. Kiểm tra liệt phím, kẹt phím, đo N-Key Rollover (NKRO) anti-ghosting, phát hiện đúp phím (key chatter) và mô phỏng âm thanh switch cơ."
        : "Free online keyboard testing tool. Test for broken, stuck, or sticky keys, verify N-Key Rollover (NKRO) anti-ghosting, detect mechanical switch key chatter, and inspect real-time key codes.";

    return {
        title,
        description,
        keywords: [
            "test ban phim",
            "kiem tra ban phim online",
            "test ban phim online",
            "keyboard tester",
            "test keyboard online",
            "check keyboard",
            "anti ghosting test",
            "nkro test",
            "key chatter test",
            "test dup phim",
            "test liet phim",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/keyboard-tester`,
            locale: isVi ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/keyboard-tester`,
            languages: {
                en: "https://anytools.online/en/tools/keyboard-tester",
                vi: "https://anytools.online/vi/tools/keyboard-tester",
                "x-default": "https://anytools.online/en/tools/keyboard-tester",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function KeyboardTesterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const t = keyboardTesterTranslations[locale as "en" | "vi"] || keyboardTesterTranslations.en;
    const relatedTools = getRelatedTools("/tools/keyboard-tester", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Test Bàn Phím Trực Tuyến AnyTools" : "AnyTools Online Keyboard Tester",
        applicationCategory: "UtilityApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/keyboard-tester`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Interactive 3D Virtual Keyboard",
            "Full 104-Key, 87-Key TKL, and 60% Layouts",
            "Windows and macOS Layout Support",
            "N-Key Rollover (NKRO) & Anti-Ghosting Real-time Measurement",
            "Key Chatter & Debounce Detection (<35ms)",
            "Web Audio API Mechanical Switch Sound Synthesizer",
            "Key Event Inspector Log (Code, KeyCode, Location, Duration)",
            "100% Client-Side Privacy",
        ],
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: t.faq1Q,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: t.faq1A,
                },
            },
            {
                "@type": "Question",
                name: t.faq2Q,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: t.faq2A,
                },
            },
            {
                "@type": "Question",
                name: t.faq3Q,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: t.faq3A,
                },
            },
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <KeyboardTesterContent />

                {/* SEO & Educational Guide Section */}
                <div className='max-w-5xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                    {/* Concept Cards */}
                    <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-6'>
                        <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>
                            📖 {t.guideTitle}
                        </h2>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2'>
                                <h3 className='font-bold text-blue-950 dark:text-blue-200 text-base'>
                                    🕹️ {t.whatIsGhosting}
                                </h3>
                                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                    {t.whatIsGhostingDesc}
                                </p>
                            </div>

                            <div className='p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-2'>
                                <h3 className='font-bold text-purple-950 dark:text-purple-200 text-base'>
                                    ⚡ {t.whatIsChatter}
                                </h3>
                                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                    {t.whatIsChatterDesc}
                                </p>
                            </div>
                        </div>

                        {/* Troubleshooting Tips */}
                        <div className='pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4'>
                            <h3 className='font-bold text-base text-gray-900 dark:text-white'>
                                🛠️ {t.howToFix}
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm'>
                                <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                                    <div className='font-bold text-gray-900 dark:text-white mb-1.5'>
                                        1. {t.tip1Title}
                                    </div>
                                    <p className='text-gray-500 dark:text-gray-400 text-xs leading-relaxed'>
                                        {t.tip1Desc}
                                    </p>
                                </div>

                                <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                                    <div className='font-bold text-gray-900 dark:text-white mb-1.5'>
                                        2. {t.tip2Title}
                                    </div>
                                    <p className='text-gray-500 dark:text-gray-400 text-xs leading-relaxed'>
                                        {t.tip2Desc}
                                    </p>
                                </div>

                                <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                                    <div className='font-bold text-gray-900 dark:text-white mb-1.5'>
                                        3. {t.tip3Title}
                                    </div>
                                    <p className='text-gray-500 dark:text-gray-400 text-xs leading-relaxed'>
                                        {t.tip3Desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQs Section */}
                    <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                        <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white'>
                            ❓ {t.faqTitle}
                        </h2>
                        <div className='space-y-4'>
                            <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-1.5'>
                                <h3 className='font-bold text-sm text-gray-900 dark:text-white'>
                                    {t.faq1Q}
                                </h3>
                                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                    {t.faq1A}
                                </p>
                            </div>

                            <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-1.5'>
                                <h3 className='font-bold text-sm text-gray-900 dark:text-white'>
                                    {t.faq2Q}
                                </h3>
                                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                    {t.faq2A}
                                </p>
                            </div>

                            <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-1.5'>
                                <h3 className='font-bold text-sm text-gray-900 dark:text-white'>
                                    {t.faq3Q}
                                </h3>
                                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                    {t.faq3A}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <RelatedTools tools={relatedTools} currentPath='/tools/keyboard-tester' />
            </ToolPageLayout>
        </>
    );
}
