"use client";

import FAQSection from "@/components/ui/FAQSection";
import ImageCompressorClient from "./ImageCompressorClient";

type ImageCompressorContentProps = {
    locale: "en" | "vi";
};

const translations = {
    en: {
        features: "Features",
        feature1Title: "Smart Compression",
        feature1Desc: "Reduce file size up to 80% while maintaining visual quality",
        feature2Title: "Clipboard Paste",
        feature2Desc: "Paste images directly from clipboard with Ctrl+V",
        feature3Title: "Bulk Processing",
        feature3Desc: "Compress multiple images at once, download as ZIP",
        feature4Title: "100% Private",
        feature4Desc: "All processing in browser - your images never leave your device",
        whatIs: "What is Image Compressor?",
        whatIsDesc: "Image Compressor is a free online tool that reduces image file sizes without significantly affecting visual quality. It uses advanced compression algorithms to optimize PNG, JPG, and WebP images. All processing happens directly in your browser, ensuring complete privacy and security of your images.",
        whyUse: "Why Use Our Image Compressor?",
        whyUseDesc: "Our image compressor offers the best balance of compression and quality:",
        benefit1: "100% Free - No watermarks, no limits, no registration",
        benefit2: "Privacy First - Images processed locally in your browser",
        benefit3: "Multiple Formats - PNG, JPG, JPEG, WebP supported",
        benefit4: "Bulk Compression - Process many images simultaneously",
        benefit5: "Clipboard Support - Paste screenshots directly",
        benefit6: "Adjustable Quality - Fine-tune compression level",
        howItWorks: "How It Works",
        howItWorksSteps: "Compressing images is simple:",
        howStep1: "Upload images by drag & drop, file picker, or paste from clipboard",
        howStep2: "Adjust quality slider to balance size vs quality",
        howStep3: "Optionally resize images to reduce dimensions",
        howStep4: "Click Compress to process all images",
        howStep5: "Preview before/after comparison",
        howStep6: "Download individual images or all as ZIP",
        useCases: "Common Use Cases",
        useCase1: "🌐 Optimize website images for faster page load",
        useCase2: "📧 Reduce image size for email attachments",
        useCase3: "📱 Compress photos for mobile apps",
        useCase4: "💾 Save storage space on devices",
        useCase5: "📤 Meet upload size limits on social media",
        useCase6: "🎨 Prepare images for web publishing",
        tips: "Pro Tips",
        tip1: "For photos, 80-85% quality usually gives the best size/quality ratio",
        tip2: "PNG works better for graphics with text or sharp edges",
        tip3: "JPG is ideal for photographs with many colors",
        tip4: "WebP offers the best compression but check browser support",
        tip5: "Use resize option to further reduce file size",
        faq: "Frequently Asked Questions",
        faqQ1: "Does compression reduce image quality?",
        faqA1: "Smart compression minimizes quality loss. At 80-90% quality, most people cannot notice any difference. You can preview the result before downloading.",
        faqQ2: "What image formats are supported?",
        faqA2: "We support PNG, JPG/JPEG, and WebP formats. You can also convert between formats during compression.",
        faqQ3: "Is there a file size limit?",
        faqA3: "There's no strict limit, but very large images may take longer to process. Processing happens in your browser, so performance depends on your device.",
        faqQ4: "How do I paste images from clipboard?",
        faqA4: "Simply copy an image (screenshot, from browser, etc.) and press Ctrl+V (Cmd+V on Mac) while on the tool page, or click the 'Paste from Clipboard' button.",
        faqQ5: "Are my images uploaded to a server?",
        faqA5: "No! All compression happens directly in your browser using JavaScript. Your images never leave your device, ensuring complete privacy.",
        faqQ6: "How much can images be compressed?",
        faqA6: "Typically 50-80% reduction in file size is achievable. The exact amount depends on the image content and chosen quality level.",
    },
    vi: {
        features: "Tính Năng",
        feature1Title: "Nén Thông Minh",
        feature1Desc: "Giảm dung lượng đến 80% mà vẫn giữ chất lượng hình ảnh",
        feature2Title: "Dán từ Clipboard",
        feature2Desc: "Dán ảnh trực tiếp từ bộ nhớ tạm bằng Ctrl+V",
        feature3Title: "Xử Lý Hàng Loạt",
        feature3Desc: "Nén nhiều ảnh cùng lúc, tải xuống dạng ZIP",
        feature4Title: "100% Riêng Tư",
        feature4Desc: "Tất cả xử lý trong trình duyệt - ảnh không rời khỏi thiết bị",
        whatIs: "Image Compressor là gì?",
        whatIsDesc: "Image Compressor là công cụ trực tuyến miễn phí giúp giảm dung lượng file ảnh mà không ảnh hưởng đáng kể đến chất lượng hình ảnh. Công cụ sử dụng thuật toán nén tiên tiến để tối ưu hóa ảnh PNG, JPG và WebP. Tất cả xử lý diễn ra trực tiếp trong trình duyệt, đảm bảo quyền riêng tư và bảo mật hoàn toàn cho ảnh của bạn.",
        whyUse: "Tại Sao Sử Dụng Công Cụ Nén Ảnh Của Chúng Tôi?",
        whyUseDesc: "Công cụ nén ảnh của chúng tôi cung cấp sự cân bằng tốt nhất giữa nén và chất lượng:",
        benefit1: "100% Miễn Phí - Không watermark, không giới hạn, không cần đăng ký",
        benefit2: "Riêng Tư Trước Tiên - Ảnh được xử lý cục bộ trong trình duyệt",
        benefit3: "Nhiều Định Dạng - Hỗ trợ PNG, JPG, JPEG, WebP",
        benefit4: "Nén Hàng Loạt - Xử lý nhiều ảnh cùng lúc",
        benefit5: "Hỗ Trợ Clipboard - Dán ảnh chụp màn hình trực tiếp",
        benefit6: "Chất Lượng Điều Chỉnh Được - Tinh chỉnh mức độ nén",
        howItWorks: "Cách Hoạt Động",
        howItWorksSteps: "Nén ảnh rất đơn giản:",
        howStep1: "Tải ảnh lên bằng kéo thả, chọn file, hoặc dán từ clipboard",
        howStep2: "Điều chỉnh thanh trượt chất lượng để cân bằng kích thước và chất lượng",
        howStep3: "Tùy chọn thay đổi kích thước ảnh để giảm chiều",
        howStep4: "Click Nén để xử lý tất cả ảnh",
        howStep5: "Xem trước so sánh trước/sau",
        howStep6: "Tải ảnh riêng lẻ hoặc tất cả dạng ZIP",
        useCases: "Các Trường Hợp Sử Dụng Phổ Biến",
        useCase1: "🌐 Tối ưu ảnh website để tải trang nhanh hơn",
        useCase2: "📧 Giảm kích thước ảnh cho file đính kèm email",
        useCase3: "📱 Nén ảnh cho ứng dụng di động",
        useCase4: "💾 Tiết kiệm không gian lưu trữ trên thiết bị",
        useCase5: "📤 Đáp ứng giới hạn kích thước upload trên mạng xã hội",
        useCase6: "🎨 Chuẩn bị ảnh để xuất bản web",
        tips: "Mẹo Hay",
        tip1: "Với ảnh chụp, chất lượng 80-85% thường cho tỷ lệ kích thước/chất lượng tốt nhất",
        tip2: "PNG tốt hơn cho đồ họa có chữ hoặc cạnh sắc",
        tip3: "JPG lý tưởng cho ảnh chụp có nhiều màu sắc",
        tip4: "WebP có nén tốt nhất nhưng cần kiểm tra hỗ trợ trình duyệt",
        tip5: "Sử dụng tùy chọn thay đổi kích thước để giảm dung lượng thêm",
        faq: "Câu Hỏi Thường Gặp",
        faqQ1: "Nén ảnh có làm giảm chất lượng không?",
        faqA1: "Nén thông minh giảm thiểu mất chất lượng. Ở chất lượng 80-90%, hầu hết người dùng không thể nhận ra sự khác biệt. Bạn có thể xem trước kết quả trước khi tải xuống.",
        faqQ2: "Những định dạng ảnh nào được hỗ trợ?",
        faqA2: "Chúng tôi hỗ trợ định dạng PNG, JPG/JPEG và WebP. Bạn cũng có thể chuyển đổi giữa các định dạng trong quá trình nén.",
        faqQ3: "Có giới hạn kích thước file không?",
        faqA3: "Không có giới hạn nghiêm ngặt, nhưng ảnh rất lớn có thể mất nhiều thời gian hơn để xử lý. Xử lý diễn ra trong trình duyệt, nên hiệu suất phụ thuộc vào thiết bị của bạn.",
        faqQ4: "Làm thế nào để dán ảnh từ clipboard?",
        faqA4: "Đơn giản chỉ cần sao chép một ảnh (ảnh chụp màn hình, từ trình duyệt, v.v.) và nhấn Ctrl+V (Cmd+V trên Mac) khi ở trang công cụ, hoặc click nút 'Dán từ Clipboard'.",
        faqQ5: "Ảnh của tôi có được upload lên server không?",
        faqA5: "Không! Tất cả nén diễn ra trực tiếp trong trình duyệt của bạn sử dụng JavaScript. Ảnh của bạn không bao giờ rời khỏi thiết bị, đảm bảo quyền riêng tư hoàn toàn.",
        faqQ6: "Ảnh có thể được nén bao nhiêu?",
        faqA6: "Thường có thể giảm 50-80% kích thước file. Mức độ chính xác phụ thuộc vào nội dung ảnh và mức chất lượng được chọn.",
    },
};

export default function ImageCompressorContent({ locale }: ImageCompressorContentProps) {
    const t = translations[locale];

    return (
        <div className='space-y-6 max-w-6xl mx-auto'>
            {/* Tool Component */}
            <ImageCompressorClient locale={locale} />

            {/* Features */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>✨ {t.features}</h2>
                <div className='grid md:grid-cols-2 gap-4'>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>🗜️</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature1Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature1Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>📋</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature2Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature2Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>📦</span>
                        <div>
                            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{t.feature3Title}</h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>{t.feature3Desc}</p>
                        </div>
                    </div>
                    <div className='flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                        <span className='text-2xl'>🔒</span>
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
                    <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>🗜️ {t.whatIs}</h2>
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
                    title={`❓ ${t.faq}`}
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
