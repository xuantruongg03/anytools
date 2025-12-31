import { getTranslation } from "@/lib/i18n/translations";
import FAQSection from "@/components/ui/FAQSection";
import PromoImageClient from "./PromoImageClient";

type PromoImageContentProps = {
    locale: "en" | "vi";
};

export default function PromoImageContent({ locale }: PromoImageContentProps) {
    const t = getTranslation(locale);
    const tool_t = t.tools.promoImageGenerator;
    const page = tool_t.page;

    const faqs = [
        {
            question: page.faq1Question,
            answer: page.faq1Answer,
        },
        {
            question: page.faq2Question,
            answer: page.faq2Answer,
        },
        {
            question: page.faq3Question,
            answer: page.faq3Answer,
        },
        {
            question: page.faq4Question,
            answer: page.faq4Answer,
        },
    ];

    return (
        <div className='space-y-6 max-w-6xl mx-auto'>
            {/* Tool Component */}
            <PromoImageClient locale={locale} />

            {/* Features */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>✨ {page.featuresTitle}</h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>📏</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.feature1Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{page.feature1Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>🎨</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.feature2Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{page.feature2Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>💾</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.feature3Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{page.feature3Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>⚡</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.feature4Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{page.feature4Desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is + Why Use - 2 columns */}
            <div className='grid md:grid-cols-2 gap-6'>
                {/* What is */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>📝 {page.whatIs}</h2>
                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed text-sm'>{page.whatIsDesc}</p>
                </div>

                {/* Why Use */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>💡 {page.whyUse}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-3 text-sm'>{page.whyUseDesc}</p>
                    <ul className='space-y-2'>
                        <li className='flex gap-2 items-start'>
                            <span className='text-blue-600 dark:text-blue-400 text-xs mt-0.5'>✓</span>
                            <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.benefit1}</span>
                        </li>
                        <li className='flex gap-2 items-start'>
                            <span className='text-blue-600 dark:text-blue-400 text-xs mt-0.5'>✓</span>
                            <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.benefit2}</span>
                        </li>
                        <li className='flex gap-2 items-start'>
                            <span className='text-blue-600 dark:text-blue-400 text-xs mt-0.5'>✓</span>
                            <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.benefit3}</span>
                        </li>
                        <li className='flex gap-2 items-start'>
                            <span className='text-blue-600 dark:text-blue-400 text-xs mt-0.5'>✓</span>
                            <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.benefit4}</span>
                        </li>
                        <li className='flex gap-2 items-start'>
                            <span className='text-blue-600 dark:text-blue-400 text-xs mt-0.5'>✓</span>
                            <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.benefit5}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* How It Works */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>⚙️ {page.howItWorks}</h2>
                <ol className='space-y-2'>
                    <li className='flex gap-2'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-5 text-sm'>1.</span>
                        <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.howStep1}</span>
                    </li>
                    <li className='flex gap-2'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-5 text-sm'>2.</span>
                        <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.howStep2}</span>
                    </li>
                    <li className='flex gap-2'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-5 text-sm'>3.</span>
                        <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.howStep3}</span>
                    </li>
                    <li className='flex gap-2'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-5 text-sm'>4.</span>
                        <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.howStep4}</span>
                    </li>
                </ol>
            </div>

            {/* Use Cases */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>🎯 {page.useCasesTitle}</h2>
                <div className='grid md:grid-cols-2 gap-3'>
                    <div className='flex gap-2 items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-blue-600 dark:text-blue-400 text-sm mt-0.5'>•</span>
                        <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.useCase1}</span>
                    </div>
                    <div className='flex gap-2 items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-blue-600 dark:text-blue-400 text-sm mt-0.5'>•</span>
                        <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.useCase2}</span>
                    </div>
                    <div className='flex gap-2 items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-blue-600 dark:text-blue-400 text-sm mt-0.5'>•</span>
                        <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.useCase3}</span>
                    </div>
                    <div className='flex gap-2 items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-blue-600 dark:text-blue-400 text-sm mt-0.5'>•</span>
                        <span className='text-gray-700 dark:text-gray-300 text-sm'>{page.useCase4}</span>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <FAQSection title={locale === "en" ? "Frequently Asked Questions" : "Câu Hỏi Thường Gặp"} faqs={faqs} />
        </div>
    );
}
