"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import PngToSvgClient from "./PngToSvgClient";
import FAQSection from "@/components/ui/FAQSection";

export default function PngToSvgContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const content = {
        en: {
            whatIs: "What is PNG to SVG Converter?",
            whatIsDesc: "PNG to SVG Converter is a free online tool that transforms raster images (PNG, JPG, etc.) into scalable vector graphics (SVG). Unlike raster images that pixelate when scaled, SVG files maintain crisp quality at any size, making them perfect for logos, icons, and web graphics.",
            modes: "Two Conversion Modes",
            modesList: {
                trace: "Trace Mode (Vectorization): Analyzes your image and creates true vector paths. Best for logos, icons, line art, and images with solid colors. The resulting SVG is fully scalable and usually smaller in file size.",
                embed: "Embed Mode (Base64): Wraps your original image inside an SVG container as base64 data. Preserves exact image quality but doesn't create true vectors. Useful when you need SVG format but want to keep photographic detail.",
            },
            whyUse: "Why Convert PNG to SVG?",
            features: {
                scalability: "Infinite Scalability: SVG graphics can be scaled to any size without losing quality",
                fileSize: "Smaller File Size: Traced SVGs are often smaller than the original PNG for simple graphics",
                editability: "Easy to Edit: SVG files can be edited with code or design software",
                animation: "Animation Support: SVGs can be animated with CSS or JavaScript",
                seo: "SEO Friendly: Search engines can read SVG content and alt text",
                responsive: "Responsive Design: SVGs adapt perfectly to different screen sizes",
            },
            howToUse: "How to Use",
            steps: {
                step1: "Upload your PNG, JPG, or other image file (drag & drop or click to select)",
                step2: "Choose conversion mode: Trace for vectorization or Embed for base64",
                step3: "If using Trace mode, select a preset or adjust advanced options",
                step4: "Click 'Convert to SVG' and wait for processing",
                step5: "Preview the result and download your SVG file",
            },
            bestFor: "Best Images for Tracing",
            bestForList: {
                logos: "Logos and brand marks with solid colors",
                icons: "Icons and simple illustrations",
                lineArt: "Line art and sketches",
                text: "Text and typography",
                cartoons: "Cartoon-style graphics",
            },
            notIdeal: "Not Ideal for Tracing",
            notIdealList: {
                photos: "Photographs - use Embed mode instead",
                gradients: "Complex gradients and shadows",
                detailed: "Highly detailed artwork",
                textures: "Images with textures or patterns",
            },
            faq: "Frequently Asked Questions",
            faqList: [
                {
                    question: "Is my image uploaded to a server?",
                    answer: "No, all processing happens entirely in your browser using JavaScript. Your images never leave your device, ensuring complete privacy.",
                },
                {
                    question: "Why is my traced SVG larger than the original PNG?",
                    answer: "Complex images with many colors or details create many vector paths, resulting in larger files. Try reducing the number of colors, using a simpler preset, or switch to Embed mode for photographs.",
                },
                {
                    question: "What's the difference between Trace and Embed mode?",
                    answer: "Trace mode creates true vector graphics by analyzing and recreating shapes as paths - ideal for logos and icons. Embed mode simply wraps the original image in SVG format using base64 encoding - better for photos where you need SVG format but want to preserve all details.",
                },
                {
                    question: "Why doesn't my traced SVG look exactly like the original?",
                    answer: "Tracing converts pixels to mathematical paths, which involves simplification. For best results, use images with clear edges, solid colors, and minimal detail. Adjust the number of colors and other settings to improve results.",
                },
                {
                    question: "Can I trace photographs?",
                    answer: "Technically yes, but results are usually not ideal. Photos have millions of colors and subtle gradients that don't convert well to vectors. For photos, use Embed mode or consider using the image as-is.",
                },
            ],
        },
        vi: {
            whatIs: "PNG to SVG Converter là gì?",
            whatIsDesc: "PNG to SVG Converter là công cụ trực tuyến miễn phí chuyển đổi hình ảnh raster (PNG, JPG, v.v.) thành đồ họa vector có thể mở rộng (SVG). Không giống như hình ảnh raster bị vỡ pixel khi phóng to, file SVG giữ nguyên chất lượng sắc nét ở mọi kích thước, hoàn hảo cho logo, icon và đồ họa web.",
            modes: "Hai chế độ chuyển đổi",
            modesList: {
                trace: "Chế độ Trace (Vector hóa): Phân tích hình ảnh và tạo các đường path vector thực sự. Tốt nhất cho logo, icon, line art và hình ảnh có màu đặc. SVG kết quả có thể mở rộng hoàn toàn và thường nhỏ hơn về kích thước file.",
                embed: "Chế độ Embed (Base64): Bọc hình ảnh gốc trong container SVG dưới dạng dữ liệu base64. Giữ nguyên chất lượng hình ảnh chính xác nhưng không tạo vector thực sự. Hữu ích khi bạn cần định dạng SVG nhưng muốn giữ chi tiết ảnh chụp.",
            },
            whyUse: "Tại sao chuyển đổi PNG sang SVG?",
            features: {
                scalability: "Khả năng mở rộng vô hạn: Đồ họa SVG có thể được phóng to đến bất kỳ kích thước nào mà không mất chất lượng",
                fileSize: "Kích thước file nhỏ hơn: SVG được trace thường nhỏ hơn PNG gốc cho đồ họa đơn giản",
                editability: "Dễ chỉnh sửa: File SVG có thể được chỉnh sửa bằng code hoặc phần mềm thiết kế",
                animation: "Hỗ trợ Animation: SVG có thể được animation bằng CSS hoặc JavaScript",
                seo: "Thân thiện SEO: Công cụ tìm kiếm có thể đọc nội dung SVG và alt text",
                responsive: "Thiết kế Responsive: SVG thích ứng hoàn hảo với các kích thước màn hình khác nhau",
            },
            howToUse: "Cách sử dụng",
            steps: {
                step1: "Tải lên file PNG, JPG hoặc hình ảnh khác (kéo thả hoặc nhấp để chọn)",
                step2: "Chọn chế độ chuyển đổi: Trace để vector hóa hoặc Embed để base64",
                step3: "Nếu dùng chế độ Trace, chọn preset hoặc điều chỉnh tùy chọn nâng cao",
                step4: "Nhấp 'Convert to SVG' và đợi xử lý",
                step5: "Xem trước kết quả và tải về file SVG của bạn",
            },
            bestFor: "Hình ảnh tốt nhất để Trace",
            bestForList: {
                logos: "Logo và nhãn hiệu với màu đặc",
                icons: "Icon và minh họa đơn giản",
                lineArt: "Line art và phác thảo",
                text: "Text và typography",
                cartoons: "Đồ họa kiểu cartoon",
            },
            notIdeal: "Không lý tưởng để Trace",
            notIdealList: {
                photos: "Ảnh chụp - sử dụng chế độ Embed thay thế",
                gradients: "Gradient và shadow phức tạp",
                detailed: "Tác phẩm nghệ thuật chi tiết cao",
                textures: "Hình ảnh có texture hoặc pattern",
            },
            faq: "Câu hỏi thường gặp",
            faqList: [
                {
                    question: "Hình ảnh của tôi có được tải lên server không?",
                    answer: "Không, tất cả quá trình xử lý diễn ra hoàn toàn trong trình duyệt của bạn sử dụng JavaScript. Hình ảnh của bạn không bao giờ rời khỏi thiết bị, đảm bảo quyền riêng tư hoàn toàn.",
                },
                {
                    question: "Tại sao SVG được trace lớn hơn PNG gốc?",
                    answer: "Hình ảnh phức tạp với nhiều màu hoặc chi tiết tạo ra nhiều đường path vector, dẫn đến file lớn hơn. Thử giảm số màu, sử dụng preset đơn giản hơn, hoặc chuyển sang chế độ Embed cho ảnh chụp.",
                },
                {
                    question: "Sự khác biệt giữa chế độ Trace và Embed là gì?",
                    answer: "Chế độ Trace tạo đồ họa vector thực sự bằng cách phân tích và tái tạo hình dạng dưới dạng path - lý tưởng cho logo và icon. Chế độ Embed chỉ đơn giản bọc hình ảnh gốc trong định dạng SVG sử dụng mã hóa base64 - tốt hơn cho ảnh chụp khi bạn cần định dạng SVG nhưng muốn giữ tất cả chi tiết.",
                },
                {
                    question: "Tại sao SVG được trace không giống hệt bản gốc?",
                    answer: "Tracing chuyển đổi pixel thành đường path toán học, điều này liên quan đến việc đơn giản hóa. Để có kết quả tốt nhất, sử dụng hình ảnh có cạnh rõ ràng, màu đặc và ít chi tiết. Điều chỉnh số màu và các cài đặt khác để cải thiện kết quả.",
                },
                {
                    question: "Tôi có thể trace ảnh chụp không?",
                    answer: "Về mặt kỹ thuật có thể, nhưng kết quả thường không lý tưởng. Ảnh chụp có hàng triệu màu và gradient tinh tế không chuyển đổi tốt sang vector. Với ảnh chụp, sử dụng chế độ Embed hoặc cân nhắc sử dụng hình ảnh nguyên bản.",
                },
            ],
        },
    };

    const t = content[isVi ? "vi" : "en"];

    return (
        <div className='max-w-6xl mx-auto'>
            {/* Tool Section */}
            <PngToSvgClient />

            {/* SEO Content Section */}
            <section className='mt-12 max-w-none'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.whatIs}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-6'>{t.whatIsDesc}</p>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.modes}</h3>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    {Object.values(t.modesList).map((mode, index) => (
                        <li key={index}>
                            <strong className='text-gray-900 dark:text-gray-100'>{mode.split(":")[0]}:</strong> {mode.split(":")[1]}
                        </li>
                    ))}
                </ul>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.whyUse}</h3>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    {Object.values(t.features).map((feature, index) => (
                        <li key={index}>
                            <strong className='text-gray-900 dark:text-gray-100'>{feature.split(":")[0]}:</strong> {feature.split(":")[1]}
                        </li>
                    ))}
                </ul>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.howToUse}</h3>
                <ol className='list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    {Object.values(t.steps).map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>

                <div className='grid md:grid-cols-2 gap-6 mb-6'>
                    <div>
                        <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>✅ {t.bestFor}</h3>
                        <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1'>
                            {Object.values(t.bestForList).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>⚠️ {t.notIdeal}</h3>
                        <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1'>
                            {Object.values(t.notIdealList).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <FAQSection locale={locale} faqs={t.faqList} />
        </div>
    );
}
