"use client";

import FAQSection from "@/components/ui/FAQSection";
import CodeFormatterClient from "./CodeFormatterClient";

type CodeFormatterContentProps = {
    locale: "en" | "vi";
};

const translations = {
    en: {
        features: "Features",
        feature1Title: "Multi-Language Support",
        feature1Desc: "Format JavaScript, TypeScript, HTML, CSS, JSON, SQL, Python, XML, and more",
        feature2Title: "Beautify & Minify",
        feature2Desc: "Make code readable or compress it for production",
        feature3Title: "Customizable",
        feature3Desc: "Adjust indentation, quotes style, and other formatting options",
        feature4Title: "Instant Results",
        feature4Desc: "Real-time formatting with syntax highlighting preview",
        whatIs: "What is Code Formatter?",
        whatIsDesc: "Code Formatter is a free online tool that helps developers format, beautify, and minify code in various programming languages. It automatically applies consistent indentation, spacing, and style conventions to make code more readable and maintainable. All processing happens in your browser, ensuring your code remains private.",
        whyUse: "Why Use Our Code Formatter?",
        whyUseDesc: "Our code formatter provides several advantages:",
        benefit1: "Multi-Language - Support for 10+ programming languages",
        benefit2: "Beautify & Minify - Format for readability or compress for production",
        benefit3: "Customizable - Adjust tabs vs spaces, indent size, quote style",
        benefit4: "Syntax Highlighting - Preview formatted code with colors",
        benefit5: "Copy & Download - Easy export options",
        benefit6: "100% Private - Code never leaves your browser",
        howItWorks: "How It Works",
        howItWorksSteps: "Formatting code is simple:",
        howStep1: "Select the programming language from the dropdown",
        howStep2: "Paste or type your code in the input area",
        howStep3: "Adjust formatting options like indentation",
        howStep4: "Click 'Format' to beautify or 'Minify' to compress",
        howStep5: "View the formatted result with syntax highlighting",
        howStep6: "Copy to clipboard or download the formatted code",
        useCases: "Common Use Cases",
        useCase1: "💻 Clean up messy code for better readability",
        useCase2: "📦 Minify JavaScript/CSS for production deployment",
        useCase3: "🔍 Debug code by making structure visible",
        useCase4: "📋 Standardize code style across team projects",
        useCase5: "📝 Prepare code for documentation or blog posts",
        useCase6: "🎓 Learn proper formatting conventions",
        supportedLanguages: "Supported Languages",
        tips: "Pro Tips",
        tip1: "Use 2 spaces for JavaScript and 4 spaces for Python as convention",
        tip2: "Minify JS and CSS before deploying to production",
        tip3: "JSON must be valid to format - check for missing commas or quotes",
        tip4: "Use the language auto-detect feature for quick formatting",
        tip5: "Double-check SQL formatting for complex queries with subqueries",
        faq: "Frequently Asked Questions",
        faqQ1: "Is this code formatter free?",
        faqA1: "Yes, completely free with no limits. Format as much code as you need without registration or payment.",
        faqQ2: "Is my code secure?",
        faqA2: "Absolutely! All formatting happens directly in your browser using JavaScript. Your code never leaves your device or gets uploaded to any server.",
        faqQ3: "Which languages are supported?",
        faqA3: "We support JavaScript, TypeScript, HTML, CSS, SCSS, LESS, JSON, SQL, Python, XML, Markdown, YAML, and GraphQL.",
        faqQ4: "What's the difference between Format and Minify?",
        faqA4: "Format (beautify) adds proper indentation and line breaks for readability. Minify removes all unnecessary whitespace to create compact code for production use, reducing file size.",
        faqQ5: "Can I customize the formatting style?",
        faqA5: "Yes! You can choose between tabs and spaces, set indent size (2 or 4 spaces), choose quote style for JavaScript, and more.",
        faqQ6: "Does it work offline?",
        faqA6: "Once the page is loaded, the formatter works entirely offline since all processing happens in your browser.",
    },
    vi: {
        features: "Tính Năng",
        feature1Title: "Hỗ Trợ Đa Ngôn Ngữ",
        feature1Desc: "Format JavaScript, TypeScript, HTML, CSS, JSON, SQL, Python, XML và nhiều hơn nữa",
        feature2Title: "Beautify & Minify",
        feature2Desc: "Làm code dễ đọc hoặc nén cho production",
        feature3Title: "Tùy Chỉnh",
        feature3Desc: "Điều chỉnh indentation, kiểu quotes và các tùy chọn định dạng khác",
        feature4Title: "Kết Quả Ngay Lập Tức",
        feature4Desc: "Format realtime với syntax highlighting preview",
        whatIs: "Code Formatter là gì?",
        whatIsDesc: "Code Formatter là công cụ trực tuyến miễn phí giúp lập trình viên format, beautify và minify code trong nhiều ngôn ngữ lập trình khác nhau. Công cụ tự động áp dụng indentation, spacing và style conventions nhất quán để code dễ đọc và bảo trì hơn. Tất cả xử lý diễn ra trong trình duyệt, đảm bảo code của bạn được bảo mật.",
        whyUse: "Tại Sao Sử Dụng Code Formatter Của Chúng Tôi?",
        whyUseDesc: "Công cụ format code của chúng tôi có nhiều ưu điểm:",
        benefit1: "Đa Ngôn Ngữ - Hỗ trợ hơn 10 ngôn ngữ lập trình",
        benefit2: "Beautify & Minify - Format để dễ đọc hoặc nén cho production",
        benefit3: "Tùy Chỉnh - Điều chỉnh tabs vs spaces, indent size, quote style",
        benefit4: "Syntax Highlighting - Xem trước code được format với màu sắc",
        benefit5: "Copy & Download - Các tùy chọn export dễ dàng",
        benefit6: "100% Riêng Tư - Code không bao giờ rời khỏi trình duyệt",
        howItWorks: "Cách Hoạt Động",
        howItWorksSteps: "Format code rất đơn giản:",
        howStep1: "Chọn ngôn ngữ lập trình từ dropdown",
        howStep2: "Dán hoặc nhập code vào khu vực input",
        howStep3: "Điều chỉnh các tùy chọn định dạng như indentation",
        howStep4: "Click 'Format' để beautify hoặc 'Minify' để nén",
        howStep5: "Xem kết quả được format với syntax highlighting",
        howStep6: "Copy vào clipboard hoặc tải xuống code đã format",
        useCases: "Các Trường Hợp Sử Dụng Phổ Biến",
        useCase1: "💻 Dọn dẹp code lộn xộn để dễ đọc hơn",
        useCase2: "📦 Minify JavaScript/CSS cho deployment production",
        useCase3: "🔍 Debug code bằng cách làm cấu trúc rõ ràng",
        useCase4: "📋 Chuẩn hóa code style trong các dự án nhóm",
        useCase5: "📝 Chuẩn bị code cho tài liệu hoặc bài viết blog",
        useCase6: "🎓 Học các quy ước định dạng đúng",
        supportedLanguages: "Ngôn Ngữ Hỗ Trợ",
        tips: "Mẹo Hay",
        tip1: "Sử dụng 2 spaces cho JavaScript và 4 spaces cho Python theo quy ước",
        tip2: "Minify JS và CSS trước khi deploy lên production",
        tip3: "JSON phải hợp lệ để format - kiểm tra dấu phẩy hoặc quotes thiếu",
        tip4: "Sử dụng tính năng auto-detect ngôn ngữ để format nhanh",
        tip5: "Kiểm tra kỹ SQL formatting cho các query phức tạp với subqueries",
        faq: "Câu Hỏi Thường Gặp",
        faqQ1: "Công cụ format code này có miễn phí không?",
        faqA1: "Có, hoàn toàn miễn phí không giới hạn. Format bao nhiêu code tùy thích mà không cần đăng ký hoặc thanh toán.",
        faqQ2: "Code của tôi có an toàn không?",
        faqA2: "Hoàn toàn! Tất cả formatting diễn ra trực tiếp trong trình duyệt của bạn bằng JavaScript. Code của bạn không bao giờ rời khỏi thiết bị hoặc được upload lên bất kỳ server nào.",
        faqQ3: "Những ngôn ngữ nào được hỗ trợ?",
        faqA3: "Chúng tôi hỗ trợ JavaScript, TypeScript, HTML, CSS, SCSS, LESS, JSON, SQL, Python, XML, Markdown, YAML và GraphQL.",
        faqQ4: "Sự khác biệt giữa Format và Minify là gì?",
        faqA4: "Format (beautify) thêm indentation và line breaks đúng để dễ đọc. Minify loại bỏ tất cả whitespace không cần thiết để tạo code compact cho production, giảm kích thước file.",
        faqQ5: "Tôi có thể tùy chỉnh style formatting không?",
        faqA5: "Có! Bạn có thể chọn giữa tabs và spaces, đặt indent size (2 hoặc 4 spaces), chọn quote style cho JavaScript và nhiều hơn nữa.",
        faqQ6: "Có hoạt động offline không?",
        faqA6: "Sau khi trang được tải, formatter hoạt động hoàn toàn offline vì tất cả xử lý diễn ra trong trình duyệt của bạn.",
    },
};

export default function CodeFormatterContent({ locale }: CodeFormatterContentProps) {
    const t = translations[locale];

    const languages = [
        { name: "JavaScript", icon: "🟨" },
        { name: "TypeScript", icon: "🔷" },
        { name: "HTML", icon: "🟧" },
        { name: "CSS", icon: "🟦" },
        { name: "JSON", icon: "📋" },
        { name: "SQL", icon: "🗃️" },
        { name: "Python", icon: "🐍" },
        { name: "XML", icon: "📄" },
        { name: "Markdown", icon: "📝" },
        { name: "YAML", icon: "⚙️" },
    ];

    return (
        <div className='space-y-6 max-w-6xl mx-auto'>
            {/* Tool Component */}
            <CodeFormatterClient locale={locale} />

            {/* Features */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>✨ {t.features}</h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>🌐</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature1Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature1Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>✨</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature2Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature2Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>⚙️</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature3Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature3Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>⚡</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature4Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature4Desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Supported Languages */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>🌐 {t.supportedLanguages}</h2>
                <div className='flex flex-wrap gap-3'>
                    {languages.map((lang) => (
                        <div key={lang.name} className='flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full'>
                            <span>{lang.icon}</span>
                            <span className='text-gray-700 dark:text-gray-300 text-sm font-medium'>{lang.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* What is + Why Use - 2 columns */}
            <div className='grid md:grid-cols-2 gap-6'>
                {/* What is */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>💻 {t.whatIs}</h2>
                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed text-sm'>{t.whatIsDesc}</p>
                </div>

                {/* Why Use */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>💡 {t.whyUse}</h2>
                    <p className='text-gray-700 dark:text-gray-300 mb-3 text-sm'>{t.whyUseDesc}</p>
                    <ul className='space-y-2'>
                        {[t.benefit1, t.benefit2, t.benefit3, t.benefit4, t.benefit5, t.benefit6].map((benefit, i) => (
                            <li key={i} className='flex gap-2 items-start'>
                                <span className='text-blue-600 dark:text-blue-400 text-xs mt-0.5'>✓</span>
                                <span className='text-gray-700 dark:text-gray-300 text-sm'>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* How It Works */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>⚙️ {t.howItWorks}</h2>
                <p className='text-gray-700 dark:text-gray-300 mb-3 text-sm'>{t.howItWorksSteps}</p>
                <ol className='space-y-2'>
                    {[t.howStep1, t.howStep2, t.howStep3, t.howStep4, t.howStep5, t.howStep6].map((step, i) => (
                        <li key={i} className='flex gap-2'>
                            <span className='font-bold text-blue-600 dark:text-blue-400 min-w-5 text-sm'>{i + 1}.</span>
                            <span className='text-gray-700 dark:text-gray-300 text-sm'>{step}</span>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Use Cases */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>🎯 {t.useCases}</h2>
                <div className='grid md:grid-cols-2 gap-3'>
                    {[t.useCase1, t.useCase2, t.useCase3, t.useCase4, t.useCase5, t.useCase6].map((useCase, i) => (
                        <div key={i} className='flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                            <p className='text-gray-700 dark:text-gray-300 text-sm'>{useCase}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className='bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>💡 {t.tips}</h2>
                <ul className='grid md:grid-cols-2 gap-x-6 gap-y-2'>
                    {[t.tip1, t.tip2, t.tip3, t.tip4, t.tip5].map((tip, i) => (
                        <li key={i} className='flex gap-2 items-start'>
                            <span className='text-blue-600 dark:text-blue-400 text-sm mt-0.5'>•</span>
                            <span className='text-gray-700 dark:text-gray-300 text-sm'>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* FAQ */}
            <div className='rounded-xl shadow-lg p-6'>
                <FAQSection
                    locale={locale}
                    faqs={[
                        { question: t.faqQ1, answer: t.faqA1 },
                        { question: t.faqQ2, answer: t.faqA2 },
                        { question: t.faqQ3, answer: t.faqA3 },
                        { question: t.faqQ4, answer: t.faqA4 },
                        { question: t.faqQ5, answer: t.faqA5 },
                        { question: t.faqQ6, answer: t.faqA6 },
                    ]}
                />
            </div>
        </div>
    );
}
