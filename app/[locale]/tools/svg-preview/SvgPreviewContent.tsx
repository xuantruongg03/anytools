"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import SvgPreviewClient from "./SvgPreviewClient";
import FAQSection from "@/components/ui/FAQSection";

export default function SvgPreviewContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const content = {
        en: {
            whatIs: "What is SVG Preview?",
            whatIsDesc: "SVG Preview is a free online tool that allows you to view, edit, and optimize SVG (Scalable Vector Graphics) files in real-time. Simply paste your SVG code in the editor and instantly see how it renders. Perfect for web developers, designers, and anyone working with vector graphics.",
            whyUse: "Why Use Our SVG Preview Tool?",
            features: {
                realtime: "Real-time Preview: See changes instantly as you edit your SVG code",
                validation: "SVG Validation: Automatically validates your SVG and shows syntax errors",
                format: "Code Formatting: Format and beautify your SVG code for better readability",
                minify: "Minification: Reduce SVG file size by removing unnecessary whitespace",
                background: "Custom Background: Change background color to test different contexts",
                grid: "Grid Overlay: Toggle grid to help with alignment and positioning",
                zoom: "Zoom Control: Zoom in/out to inspect SVG details",
                export: "Export Options: Download as SVG or convert to PNG format",
            },
            howToUse: "How to Use SVG Preview",
            steps: {
                step1: "Paste your SVG code in the editor on the left",
                step2: "The preview will update automatically on the right",
                step3: "Use Format/Minify buttons to optimize your code",
                step4: "Adjust background color and zoom as needed",
                step5: "Download as SVG or export as PNG",
            },
            useCases: "Common Use Cases",
            useCasesList: {
                webDev: "Web Development: Preview and debug SVG icons and graphics before using in projects",
                design: "Design Work: Test SVG exports from design tools like Figma, Sketch, or Illustrator",
                optimization: "Optimization: Minify SVG files to reduce page load times",
                learning: "Learning: Understand SVG structure by experimenting with code",
                conversion: "Conversion: Convert SVG to PNG for use in contexts that don't support SVG",
            },
            whatIsSvg: "What is SVG?",
            whatIsSvgDesc: "SVG (Scalable Vector Graphics) is an XML-based vector image format for the web. Unlike raster images (PNG, JPG), SVGs can scale to any size without losing quality. They're perfect for logos, icons, illustrations, and interactive graphics. SVG files are text-based, meaning they can be edited with code and are typically smaller than equivalent raster images.",
            faq: "Frequently Asked Questions",
            faqList: [
                {
                    question: "Is my SVG code stored on your servers?",
                    answer: "No, all processing happens entirely in your browser. Your SVG code never leaves your device, ensuring complete privacy and security.",
                },
                {
                    question: "What's the maximum SVG size I can preview?",
                    answer: "There's no hard limit, but very large SVGs (millions of elements) may slow down your browser. For best performance, keep SVGs under 1MB.",
                },
                {
                    question: "Can I preview animated SVGs?",
                    answer: "Yes! SVG animations using CSS or SMIL will play in the preview. However, JavaScript-based animations require the full HTML context.",
                },
                {
                    question: "Why does my SVG look different than in my design tool?",
                    answer: "Some design tools use non-standard features or proprietary attributes. Make sure your SVG follows W3C standards for best compatibility.",
                },
                {
                    question: "How do I fix SVG validation errors?",
                    answer: "Common issues include missing xmlns attribute, unclosed tags, or invalid characters. The error message will point to the specific problem.",
                },
            ],
        },
        vi: {
            whatIs: "SVG Preview là gì?",
            whatIsDesc: "SVG Preview là công cụ trực tuyến miễn phí cho phép bạn xem, chỉnh sửa và tối ưu hóa các file SVG (Scalable Vector Graphics) theo thời gian thực. Chỉ cần dán mã SVG vào trình soạn thảo và xem ngay kết quả hiển thị. Hoàn hảo cho các nhà phát triển web, nhà thiết kế và bất kỳ ai làm việc với đồ họa vector.",
            whyUse: "Tại sao sử dụng công cụ SVG Preview?",
            features: {
                realtime: "Xem trước thời gian thực: Xem thay đổi ngay lập tức khi bạn chỉnh sửa mã SVG",
                validation: "Xác thực SVG: Tự động xác thực SVG và hiển thị lỗi cú pháp",
                format: "Định dạng mã: Format và làm đẹp mã SVG để dễ đọc hơn",
                minify: "Nén tối ưu: Giảm kích thước file SVG bằng cách loại bỏ khoảng trắng không cần thiết",
                background: "Tùy chỉnh nền: Thay đổi màu nền để kiểm tra trong các ngữ cảnh khác nhau",
                grid: "Lưới hỗ trợ: Bật/tắt lưới để hỗ trợ căn chỉnh và định vị",
                zoom: "Điều khiển zoom: Phóng to/thu nhỏ để kiểm tra chi tiết SVG",
                export: "Tùy chọn xuất: Tải về dạng SVG hoặc chuyển đổi sang định dạng PNG",
            },
            howToUse: "Cách sử dụng SVG Preview",
            steps: {
                step1: "Dán mã SVG vào trình soạn thảo bên trái",
                step2: "Bản xem trước sẽ tự động cập nhật bên phải",
                step3: "Sử dụng nút Format/Minify để tối ưu mã",
                step4: "Điều chỉnh màu nền và zoom theo nhu cầu",
                step5: "Tải về dạng SVG hoặc xuất ra PNG",
            },
            useCases: "Các trường hợp sử dụng phổ biến",
            useCasesList: {
                webDev: "Phát triển Web: Xem trước và debug icon và đồ họa SVG trước khi sử dụng trong dự án",
                design: "Thiết kế: Kiểm tra SVG xuất từ các công cụ thiết kế như Figma, Sketch, hoặc Illustrator",
                optimization: "Tối ưu hóa: Nén file SVG để giảm thời gian tải trang",
                learning: "Học tập: Hiểu cấu trúc SVG bằng cách thử nghiệm với mã",
                conversion: "Chuyển đổi: Chuyển SVG sang PNG cho các ngữ cảnh không hỗ trợ SVG",
            },
            whatIsSvg: "SVG là gì?",
            whatIsSvgDesc: "SVG (Scalable Vector Graphics) là định dạng hình ảnh vector dựa trên XML cho web. Không giống như hình ảnh raster (PNG, JPG), SVG có thể phóng to đến bất kỳ kích thước nào mà không mất chất lượng. Chúng hoàn hảo cho logo, icon, minh họa và đồ họa tương tác. File SVG dựa trên văn bản, có nghĩa là chúng có thể được chỉnh sửa bằng mã và thường nhỏ hơn hình ảnh raster tương đương.",
            faq: "Câu hỏi thường gặp",
            faqList: [
                {
                    question: "Mã SVG của tôi có được lưu trên máy chủ không?",
                    answer: "Không, tất cả quá trình xử lý diễn ra hoàn toàn trong trình duyệt của bạn. Mã SVG của bạn không bao giờ rời khỏi thiết bị, đảm bảo quyền riêng tư và bảo mật hoàn toàn.",
                },
                {
                    question: "Kích thước SVG tối đa tôi có thể xem trước là bao nhiêu?",
                    answer: "Không có giới hạn cố định, nhưng SVG rất lớn (hàng triệu phần tử) có thể làm chậm trình duyệt của bạn. Để có hiệu suất tốt nhất, hãy giữ SVG dưới 1MB.",
                },
                {
                    question: "Tôi có thể xem trước SVG có animation không?",
                    answer: "Có! Animation SVG sử dụng CSS hoặc SMIL sẽ chạy trong bản xem trước. Tuy nhiên, animation dựa trên JavaScript cần ngữ cảnh HTML đầy đủ.",
                },
                {
                    question: "Tại sao SVG của tôi trông khác so với trong công cụ thiết kế?",
                    answer: "Một số công cụ thiết kế sử dụng tính năng không chuẩn hoặc thuộc tính độc quyền. Hãy đảm bảo SVG của bạn tuân theo tiêu chuẩn W3C để có khả năng tương thích tốt nhất.",
                },
                {
                    question: "Làm thế nào để sửa lỗi xác thực SVG?",
                    answer: "Các vấn đề phổ biến bao gồm thiếu thuộc tính xmlns, thẻ chưa đóng hoặc ký tự không hợp lệ. Thông báo lỗi sẽ chỉ ra vấn đề cụ thể.",
                },
            ],
        },
    };

    const t = content[isVi ? "vi" : "en"];

    return (
        <div className='max-w-6xl mx-auto'>
            {/* Tool Section */}
            <SvgPreviewClient />

            {/* SEO Content Section */}
            <section className='mt-12 max-w-none'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{t.whatIs}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-6'>{t.whatIsDesc}</p>

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

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.useCases}</h3>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 mb-6'>
                    {Object.values(t.useCasesList).map((useCase, index) => (
                        <li key={index}>
                            <strong className='text-gray-900 dark:text-gray-100'>{useCase.split(":")[0]}:</strong> {useCase.split(":")[1]}
                        </li>
                    ))}
                </ul>

                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100'>{t.whatIsSvg}</h3>
                <p className='text-gray-600 dark:text-gray-400 mb-6'>{t.whatIsSvgDesc}</p>
            </section>

            <FAQSection locale={locale} faqs={t.faqList} />
        </div>
    );
}
