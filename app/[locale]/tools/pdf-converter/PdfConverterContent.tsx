"use client";

import dynamic from "next/dynamic";
import FAQSection from "@/components/ui/FAQSection";

// Dynamic import with ssr: false to avoid DOMMatrix error during SSR
const PdfConverterClient = dynamic(() => import("./PdfConverterClient"), {
    ssr: false,
    loading: () => (
        <div className='flex items-center justify-center min-h-[400px]'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
    ),
});

type PdfConverterContentProps = {
    locale: "en" | "vi";
};

const translations = {
    en: {
        features: "Features",
        feature1Title: "PDF to Image",
        feature1Desc: "Convert PDF pages to high-quality PNG or JPG images",
        feature2Title: "Image to PDF",
        feature2Desc: "Combine multiple images into a single PDF file",
        feature3Title: "Fast & Secure",
        feature3Desc: "All processing happens in your browser - files never leave your device",
        feature4Title: "Free Forever",
        feature4Desc: "No registration, no watermarks, completely free",
        whatIs: "What is PDF Converter?",
        whatIsDesc: "PDF Converter is a free online tool that allows you to convert PDF files to images (PNG, JPG) and convert images back to PDF. All conversions happen directly in your browser, ensuring your files remain private and secure. No uploads to external servers required.",
        whyUse: "Why Use Our PDF Converter?",
        whyUseDesc: "Our PDF converter offers several advantages:",
        benefit1: "100% Free - No hidden costs or premium features",
        benefit2: "Privacy First - Files processed locally in your browser",
        benefit3: "High Quality - Maintain original quality in conversions",
        benefit4: "No Limits - Convert as many files as you need",
        benefit5: "No Registration - Start converting immediately",
        benefit6: "Works Offline - Once loaded, works without internet",
        howItWorks: "How It Works",
        howItWorksSteps: "Converting files is simple:",
        howStep1: "Select conversion type (PDF to Image or Image to PDF)",
        howStep2: "Upload your file(s) by drag & drop or click to browse",
        howStep3: "Adjust settings like format, quality, and page range",
        howStep4: "Click Convert to process your files",
        howStep5: "Download individual images or all as a ZIP file",
        howStep6: "For Image to PDF, arrange images and create PDF",
        useCases: "Common Use Cases",
        useCase1: "📄 Extract images from PDF documents for presentations",
        useCase2: "📸 Create PDF portfolios from image collections",
        useCase3: "📱 Share PDF pages as images on social media",
        useCase4: "🖨️ Prepare images for printing from PDF files",
        useCase5: "📧 Email individual PDF pages as image attachments",
        useCase6: "📚 Convert scanned documents to organized PDFs",
        tips: "Pro Tips",
        tip1: "Use PNG format for text-heavy documents to preserve clarity",
        tip2: "Use JPG format for photos to reduce file size",
        tip3: "Higher DPI settings produce larger but sharper images",
        tip4: "Drag to reorder images before creating PDF",
        tip5: "Use page range to convert only specific pages",
        faq: "Frequently Asked Questions",
        faqQ1: "Is this PDF converter really free?",
        faqA1: "Yes, completely free with no hidden costs. No registration, no watermarks, no limits on the number of conversions.",
        faqQ2: "Are my files secure?",
        faqA2: "Absolutely! All processing happens directly in your browser. Your files never leave your device or get uploaded to any server.",
        faqQ3: "What image formats are supported?",
        faqA3: "For PDF to Image: PNG and JPG. For Image to PDF: PNG, JPG, JPEG, WebP, GIF, and BMP are supported.",
        faqQ4: "Is there a file size limit?",
        faqA4: "There's no strict limit, but very large files may take longer to process depending on your device's capabilities.",
        faqQ5: "Can I convert password-protected PDFs?",
        faqA5: "Currently, password-protected PDFs are not supported. Please remove the password protection first.",
        faqQ6: "Will the quality be preserved?",
        faqA6: "Yes, you can choose the output quality. Higher quality settings preserve more details but result in larger file sizes.",
    },
    vi: {
        features: "Tính Năng",
        feature1Title: "PDF sang Ảnh",
        feature1Desc: "Chuyển các trang PDF thành ảnh PNG hoặc JPG chất lượng cao",
        feature2Title: "Ảnh sang PDF",
        feature2Desc: "Kết hợp nhiều ảnh thành một file PDF duy nhất",
        feature3Title: "Nhanh & Bảo Mật",
        feature3Desc: "Tất cả xử lý diễn ra trong trình duyệt - file không rời khỏi thiết bị của bạn",
        feature4Title: "Miễn Phí Mãi Mãi",
        feature4Desc: "Không cần đăng ký, không watermark, hoàn toàn miễn phí",
        whatIs: "PDF Converter là gì?",
        whatIsDesc: "PDF Converter là công cụ trực tuyến miễn phí cho phép bạn chuyển đổi file PDF sang ảnh (PNG, JPG) và ngược lại. Tất cả chuyển đổi diễn ra trực tiếp trong trình duyệt, đảm bảo file của bạn riêng tư và an toàn. Không cần upload lên server bên ngoài.",
        whyUse: "Tại Sao Sử Dụng PDF Converter Của Chúng Tôi?",
        whyUseDesc: "Công cụ chuyển đổi PDF của chúng tôi có nhiều ưu điểm:",
        benefit1: "100% Miễn Phí - Không có chi phí ẩn hoặc tính năng cao cấp",
        benefit2: "Riêng Tư Trước Tiên - File được xử lý cục bộ trong trình duyệt",
        benefit3: "Chất Lượng Cao - Giữ nguyên chất lượng gốc khi chuyển đổi",
        benefit4: "Không Giới Hạn - Chuyển đổi bao nhiêu file tùy thích",
        benefit5: "Không Cần Đăng Ký - Bắt đầu chuyển đổi ngay lập tức",
        benefit6: "Hoạt Động Offline - Sau khi tải, hoạt động không cần internet",
        howItWorks: "Cách Hoạt Động",
        howItWorksSteps: "Chuyển đổi file rất đơn giản:",
        howStep1: "Chọn loại chuyển đổi (PDF sang Ảnh hoặc Ảnh sang PDF)",
        howStep2: "Tải file lên bằng kéo thả hoặc click để chọn",
        howStep3: "Điều chỉnh cài đặt như định dạng, chất lượng, phạm vi trang",
        howStep4: "Click Chuyển Đổi để xử lý file",
        howStep5: "Tải ảnh riêng lẻ hoặc tất cả dưới dạng file ZIP",
        howStep6: "Với Ảnh sang PDF, sắp xếp ảnh và tạo PDF",
        useCases: "Các Trường Hợp Sử Dụng Phổ Biến",
        useCase1: "📄 Trích xuất ảnh từ tài liệu PDF cho bài thuyết trình",
        useCase2: "📸 Tạo portfolio PDF từ bộ sưu tập ảnh",
        useCase3: "📱 Chia sẻ trang PDF dưới dạng ảnh trên mạng xã hội",
        useCase4: "🖨️ Chuẩn bị ảnh để in từ file PDF",
        useCase5: "📧 Gửi email các trang PDF riêng lẻ dưới dạng ảnh đính kèm",
        useCase6: "📚 Chuyển đổi tài liệu quét thành PDF có tổ chức",
        tips: "Mẹo Hay",
        tip1: "Sử dụng định dạng PNG cho tài liệu nhiều chữ để giữ độ rõ nét",
        tip2: "Sử dụng định dạng JPG cho ảnh để giảm kích thước file",
        tip3: "Cài đặt DPI cao hơn tạo ra ảnh lớn hơn nhưng sắc nét hơn",
        tip4: "Kéo để sắp xếp lại ảnh trước khi tạo PDF",
        tip5: "Sử dụng phạm vi trang để chỉ chuyển đổi các trang cụ thể",
        faq: "Câu Hỏi Thường Gặp",
        faqQ1: "Công cụ chuyển đổi PDF này có thực sự miễn phí không?",
        faqA1: "Có, hoàn toàn miễn phí không có chi phí ẩn. Không cần đăng ký, không watermark, không giới hạn số lần chuyển đổi.",
        faqQ2: "File của tôi có an toàn không?",
        faqA2: "Hoàn toàn! Tất cả xử lý diễn ra trực tiếp trong trình duyệt của bạn. File của bạn không bao giờ rời khỏi thiết bị hoặc được upload lên bất kỳ server nào.",
        faqQ3: "Những định dạng ảnh nào được hỗ trợ?",
        faqA3: "Với PDF sang Ảnh: PNG và JPG. Với Ảnh sang PDF: PNG, JPG, JPEG, WebP, GIF và BMP được hỗ trợ.",
        faqQ4: "Có giới hạn kích thước file không?",
        faqA4: "Không có giới hạn nghiêm ngặt, nhưng file rất lớn có thể mất nhiều thời gian hơn để xử lý tùy thuộc vào khả năng của thiết bị.",
        faqQ5: "Tôi có thể chuyển đổi PDF được bảo vệ bằng mật khẩu không?",
        faqA5: "Hiện tại, PDF được bảo vệ bằng mật khẩu không được hỗ trợ. Vui lòng gỡ bỏ bảo vệ mật khẩu trước.",
        faqQ6: "Chất lượng có được bảo toàn không?",
        faqA6: "Có, bạn có thể chọn chất lượng đầu ra. Cài đặt chất lượng cao hơn giữ nhiều chi tiết hơn nhưng tạo ra file lớn hơn.",
    },
};

export default function PdfConverterContent({ locale }: PdfConverterContentProps) {
    const t = translations[locale];

    return (
        <div className='space-y-6 max-w-6xl'>
            {/* Tool Component */}
            <PdfConverterClient locale={locale} />

            {/* Features */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>✨ {t.features}</h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>📄</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature1Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature1Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>🖼️</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature2Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature2Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>⚡</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature3Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature3Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>🆓</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature4Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature4Desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is + Why Use - 2 columns */}
            <div className='grid md:grid-cols-2 gap-6'>
                {/* What is */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>📋 {t.whatIs}</h2>
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
            <div className='rounded-xl shadow-lg'>
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
