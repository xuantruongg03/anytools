import { getTranslation } from "@/lib/i18n/translations";
import FAQSection from "@/components/ui/FAQSection";
import StudocuDownloaderClient from "./StudocuDownloaderClient";

type StudocuDownloaderContentProps = {
    locale: "en" | "vi";
};

export default function StudocuDownloaderContent({ locale }: StudocuDownloaderContentProps) {
    const t = getTranslation(locale);
    const tool_t = t.tools.studocuDownloader;
    const page = tool_t.page;

    return (
        <div className='space-y-6'>
            {/* Tool Component */}
            <StudocuDownloaderClient />

            {/* Instructions */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>📖 {tool_t.howToUse || "How to Use"}</h2>
                <ol className='space-y-3 text-gray-700 dark:text-gray-300'>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>1.</span>
                        <span>{tool_t.step1 || "Copy the URL of the SlideShare presentation you want to download"}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>2.</span>
                        <span>{tool_t.step2 || "Paste the URL in the input field above"}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>3.</span>
                        <span>{tool_t.step4 || "Click Download and wait for processing"}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>4.</span>
                        <span>{tool_t.step5 || "The file will open in a new tab automatically"}</span>
                    </li>
                </ol>
            </div>

            {/* Features */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>✨ {tool_t.features || "Features"}</h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>{tool_t.feature1Title?.split(" ")[0] || "📚"}</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{tool_t.feature1Title || "Study Materials"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.feature1Desc || "Download lecture notes and study guides"}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>{tool_t.feature2Title?.split(" ")[0] || "⚡"}</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{tool_t.feature2Title || "Quick Access"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.feature2Desc || "Fast download processing"}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>{tool_t.feature3Title?.split(" ")[0] || "🔐"}</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{tool_t.feature3Title || "Secure Download"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.feature3Desc || "Safe and private downloads"}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>{tool_t.feature4Title?.split(" ")[0] || "💯"}</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{tool_t.feature4Title || "Free to Use"}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.feature4Desc || "No registration required"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is StuDocu Downloader */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>📚 {page.whatIs}</h2>
                <div className='space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed'>
                    <p>{page.whatIsDesc}</p>
                    {(page as any).whatIsDesc2 && <p className='text-sm'>{(page as any).whatIsDesc2}</p>}
                </div>
            </div>

            {/* Why Use Our Tool */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>💡 {page.whyUse}</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>{page.whyUseDesc}</p>
                <ul className='space-y-3'>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit1}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit2}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit3}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit4}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit5}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit6}</span>
                    </li>
                </ul>
            </div>

            {/* How It Works */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>⚙️ {page.howItWorks}</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>{page.howItWorksSteps}</p>
                <ol className='space-y-3'>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>1.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep1}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>2.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep2}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>3.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep3}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>4.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep4}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>5.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep5}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400 min-w-6'>6.</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.howStep6}</span>
                    </li>
                </ol>
            </div>

            {/* Use Cases */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>🎯 {page.useCases}</h2>
                <div className='space-y-3'>
                    <div className='flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-xl'>🎓</span>
                        <p className='text-gray-700 dark:text-gray-300'>{page.useCase1}</p>
                    </div>
                    <div className='flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-xl'>🔬</span>
                        <p className='text-gray-700 dark:text-gray-300'>{page.useCase2}</p>
                    </div>
                    <div className='flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-xl'>💼</span>
                        <p className='text-gray-700 dark:text-gray-300'>{page.useCase3}</p>
                    </div>
                    <div className='flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-xl'>👨‍🏫</span>
                        <p className='text-gray-700 dark:text-gray-300'>{page.useCase4}</p>
                    </div>
                    <div className='flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <span className='text-xl'>✍️</span>
                        <p className='text-gray-700 dark:text-gray-300'>{page.useCase5}</p>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className=' rounded-xl shadow-lg p-6'>
                <FAQSection
                    title={`❓ ${page.faq}`}
                    faqs={[
                        { question: page.faqQ1, answer: page.faqA1 },
                        { question: page.faqQ2, answer: page.faqA2 },
                        { question: page.faqQ3, answer: page.faqA3 },
                        { question: page.faqQ4, answer: page.faqA4 },
                        { question: page.faqQ5, answer: page.faqA5 },
                        { question: page.faqQ6, answer: page.faqA6 },
                    ]}
                />
            </div>

            {/* Tips */}
            <div className='bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>💡 {page.tips}</h2>
                <ul className='space-y-2'>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>•</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.tip1}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>•</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.tip2}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>•</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.tip3}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400'>•</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.tip4}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
