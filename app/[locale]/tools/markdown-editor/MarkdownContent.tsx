import { getTranslation } from "@/lib/i18n/translations";
import FAQSection from "@/components/ui/FAQSection";
import MarkdownClient from "./MarkdownClient";

type MarkdownContentProps = {
    locale: "en" | "vi";
};

export default function MarkdownContent({ locale }: MarkdownContentProps) {
    const t = getTranslation(locale);
    const tool_t = t.tools.markdownEditor;
    const page = tool_t.page;

    return (
        <div className='space-y-6 max-w-7xl mx-auto'>
            {/* Tool Component */}
            <MarkdownClient/>

            {/* Features */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>✨ {page.featuresTitle}</h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>👁️</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.feature1Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{page.feature1Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>📤</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.feature2Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{page.feature2Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>🛠️</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.feature3Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{page.feature3Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>💾</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{page.feature4Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{page.feature4Desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is Markdown */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>📖 {page.whatIs}</h2>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>{page.whatIsDesc}</p>
            </div>

            {/* Why Use */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>🎯 {page.whyUse}</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>{page.whyUseDesc}</p>
                <ul className='space-y-2'>
                    {[page.benefit1, page.benefit2, page.benefit3, page.benefit4, page.benefit5].map((benefit, i) => (
                        <li key={i} className='flex items-start gap-2 text-gray-700 dark:text-gray-300'>
                            <span className='text-green-500 mt-1'>✓</span>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* How to Use */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>📋 {page.howItWorks}</h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    {[page.howStep1, page.howStep2, page.howStep3, page.howStep4].map((step, i) => (
                        <div key={i} className='flex gap-3 items-start'>
                            <span className='shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold'>{i + 1}</span>
                            <p className='text-gray-700 dark:text-gray-300 pt-1'>{step}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Use Cases */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>💼 {page.useCases}</h2>
                <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-3'>
                    {[page.useCase1, page.useCase2, page.useCase3, page.useCase4, page.useCase5, page.useCase6].map((useCase, i) => (
                        <div key={i} className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm'>
                            {useCase}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>💡 {page.tips}</h2>
                <div className='space-y-3'>
                    {[page.tip1, page.tip2, page.tip3, page.tip4, page.tip5].map((tip, i) => (
                        <div key={i} className='flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500'>
                            <span className='text-yellow-600 dark:text-yellow-400'>💡</span>
                            <p className='text-gray-700 dark:text-gray-300 text-sm'>{tip}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <FAQSection
                locale={locale}
                faqs={[
                    { question: page.faqQ1, answer: page.faqA1 },
                    { question: page.faqQ2, answer: page.faqA2 },
                    { question: page.faqQ3, answer: page.faqA3 },
                    { question: page.faqQ4, answer: page.faqA4 },
                    { question: page.faqQ5, answer: page.faqA5 },
                ]}
            />
        </div>
    );
}
