import { getTranslation } from "@/lib/i18n/translations";
import FAQSection from "@/components/ui/FAQSection";
import ScribdDownloaderClient from "./ScribdDownloaderClient";

type ScribdDownloaderContentProps = {
    locale: "en" | "vi";
};

export default function ScribdDownloaderContent({ locale }: ScribdDownloaderContentProps) {
    const t = getTranslation(locale);
    const tool_t = (t.tools as any).scribdDownloader || {};
    const page = tool_t.page || {};

    const faqItems = [
        {
            question: page.faqQ1 || "Is this Scribd downloader free to use?",
            answer: page.faqA1 || "Yes, our Scribd downloader is 100% free with unlimited usage.",
        },
        {
            question: page.faqQ2 || "What file format will I receive?",
            answer: page.faqA2 || "Documents are processed and delivered in standard PDF format, compatible with all devices.",
        },
        {
            question: page.faqQ3 || "Do I need a Scribd account to use this tool?",
            answer: page.faqA3 || "No, you do not need any Scribd account or membership. Simply provide the document URL.",
        },
        {
            question: page.faqQ4 || "Is it safe and legal to download documents from Scribd?",
            answer: page.faqA4 || "You should download documents solely for personal study, research, or educational purposes, and always respect copyright laws.",
        },
        {
            question: page.faqQ5 || "Does this work on mobile devices?",
            answer: page.faqA5 || "Yes, our web application is fully responsive and works smoothly on iOS, Android, macOS, and Windows.",
        },
    ];

    return (
        <div className='space-y-6 max-w-6xl mx-auto'>
            {/* Tool Client Component */}
            <ScribdDownloaderClient />

            {/* Instructions */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-200 dark:border-gray-700/80 p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                    📖 {tool_t.howToUse || "How to Use"}
                </h2>
                <ol className='space-y-3 text-gray-700 dark:text-gray-300'>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>1.</span>
                        <span>{tool_t.step1 || "Copy the URL of the Scribd document you want to download"}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>2.</span>
                        <span>{tool_t.step2 || "Paste the URL in the input field above"}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>3.</span>
                        <span>{tool_t.step3 || "Click 'Download PDF' and wait for the document to be processed"}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='font-bold text-blue-600 dark:text-blue-400'>4.</span>
                        <span>{tool_t.step4 || "The document will be downloaded or opened in a new tab"}</span>
                    </li>
                </ol>
            </div>

            {/* Features Grid */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-200 dark:border-gray-700/80 p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
                    ✨ {tool_t.features || "Features"}
                </h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700/50'>
                        <span className='text-2xl'>📄</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                                {tool_t.feature1Title || "High-Quality PDF"}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {tool_t.feature1Desc || "Download complete documents in crisp, high-resolution PDF format"}
                            </p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700/50'>
                        <span className='text-2xl'>⚡</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                                {tool_t.feature2Title || "Fast Processing"}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {tool_t.feature2Desc || "Quick document parsing and download pipeline"}
                            </p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700/50'>
                        <span className='text-2xl'>🔒</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                                {tool_t.feature3Title || "Secure & Private"}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {tool_t.feature3Desc || "No personal documents or logs stored on our servers"}
                            </p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700/50'>
                        <span className='text-2xl'>💯</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                                {tool_t.feature4Title || "100% Free"}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {tool_t.feature4Desc || "Unlimited downloads with no subscriptions or fees"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is Scribd Downloader */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-200 dark:border-gray-700/80 p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                    📚 {page.whatIs || "What is Scribd Downloader?"}
                </h2>
                <div className='space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed'>
                    <p>{page.whatIsDesc}</p>
                    {page.whatIsDesc2 && <p>{page.whatIsDesc2}</p>}
                </div>
            </div>

            {/* Why Use Our Tool */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-200 dark:border-gray-700/80 p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                    💡 {page.whyUse || "Why Use Our Scribd Downloader?"}
                </h2>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>{page.whyUseDesc}</p>
                <ul className='space-y-3'>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400 font-bold'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit1}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400 font-bold'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit2}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400 font-bold'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit3}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400 font-bold'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit4}</span>
                    </li>
                    <li className='flex gap-3'>
                        <span className='text-blue-600 dark:text-blue-400 font-bold'>✓</span>
                        <span className='text-gray-700 dark:text-gray-300'>{page.benefit5}</span>
                    </li>
                </ul>
            </div>

            {/* FAQ Section */}
            <FAQSection locale={locale} faqs={faqItems} />
        </div>
    );
}
