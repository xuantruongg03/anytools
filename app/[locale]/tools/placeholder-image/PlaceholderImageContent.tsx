"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import FAQSection from "@/components/ui/FAQSection";

export default function PlaceholderImageContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const faqs = [
        {
            question: isVi ? "Công cụ này có miễn phí không?" : "Is this tool free?",
            answer: isVi ? "Có! Công cụ này hoàn toàn miễn phí, không cần đăng ký." : "Yes! This tool is completely free with no registration required.",
        },
        {
            question: isVi ? "Hỗ trợ những định dạng nào?" : "What formats are supported?",
            answer: isVi ? "Chúng tôi hỗ trợ PNG, JPEG, và WebP." : "We support PNG, JPEG, and WebP formats.",
        },
        {
            question: isVi ? "Kích thước ảnh tối đa là bao nhiêu?" : "What is the maximum image size?",
            answer: isVi ? "Kích thước tối đa là 2000x2000 pixels." : "Maximum size is 2000x2000 pixels.",
        },
        {
            question: isVi ? "Có thể upload ảnh của mình không?" : "Can I use uploaded images?",
            answer: isVi ? "Có! Bạn có thể upload ảnh và resize theo bất kỳ kích thước nào đến 2000x2000." : "Yes! You can upload your own image and resize it to any size up to 2000x2000.",
        },
        {
            question: isVi ? "API có giới hạn request không?" : "Are there any API rate limits?",
            answer: isVi ? "Không có giới hạn cứng, nhưng vui lòng sử dụng hợp lý. Nếu bạn cần sử dụng nhiều, hãy cache ảnh ở phía client." : "There are no hard limits, but please use responsibly. For heavy usage, consider caching images on your end.",
        },
    ];

    return (
        <section className='mt-12 max-w-none space-y-8'>
            {/* What is Placeholder Image Generator */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "Placeholder Image Generator là gì?" : "What is Placeholder Image Generator?"}</h2>
                <p className='text-gray-600 dark:text-gray-400 mb-4'>{isVi ? "Placeholder Image Generator là công cụ miễn phí giúp bạn tạo ảnh giữ chỗ với kích thước tùy chỉnh. Lý tưởng cho developers và designers khi cần ảnh demo trong quá trình phát triển website, ứng dụng hoặc mockup." : "Placeholder Image Generator is a free tool to create placeholder images with custom sizes. Ideal for developers and designers who need demo images during website, app, or mockup development."}</p>
                <p className='text-gray-600 dark:text-gray-400'>{isVi ? "Với API đơn giản, bạn có thể tích hợp trực tiếp vào dự án chỉ bằng một URL. Không cần đăng ký, không giới hạn sử dụng." : "With our simple API, you can integrate directly into your project with just a URL. No registration required, unlimited usage."}</p>
            </div>

            {/* Why Use Placeholder Images */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "Tại sao sử dụng Placeholder Images?" : "Why Use Placeholder Images?"}</h2>
                <ul className='list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2'>
                    <li>{isVi ? "Phát triển nhanh hơn - không cần tìm ảnh thật" : "Faster development - no need to find real images"}</li>
                    <li>{isVi ? "Kích thước chính xác cho layout" : "Exact dimensions for layouts"}</li>
                    <li>{isVi ? "Hiển thị kích thước trên ảnh để dễ debug" : "Size displayed on image for easy debugging"}</li>
                    <li>{isVi ? "API đơn giản, dễ tích hợp" : "Simple API, easy to integrate"}</li>
                    <li>{isVi ? "Miễn phí, không giới hạn sử dụng" : "Free, unlimited usage"}</li>
                </ul>
            </div>

            {/* Key Features */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "Các tính năng nổi bật" : "Key Features"}</h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>🎨 {isVi ? "Nhiều kiểu placeholder" : "Multiple Styles"}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>Gradient, solid color, pattern, abstract, tech, nature</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>📐 {isVi ? "Kích thước tùy chỉnh" : "Custom Sizes"}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Từ 10x10 đến 2000x2000 pixels" : "From 10x10 to 2000x2000 pixels"}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>📤 Upload & Resize</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Upload ảnh của bạn và resize theo kích thước mong muốn" : "Upload your image and resize to desired dimensions"}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>🔗 {isVi ? "API đơn giản" : "Simple API"}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Dễ dàng tích hợp vào dự án với URL trực tiếp" : "Easy integration with direct URL"}</p>
                    </div>
                </div>
            </div>

            {/* How to Use */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "Cách sử dụng" : "How to Use"}</h2>
                <ol className='list-decimal list-inside text-gray-600 dark:text-gray-400 space-y-2'>
                    <li>{isVi ? "Chọn kích thước ảnh mong muốn hoặc sử dụng preset có sẵn" : "Choose your desired image size or use a preset"}</li>
                    <li>{isVi ? "Chọn kiểu placeholder: gradient, solid, pattern, v.v." : "Select placeholder style: gradient, solid, pattern, etc."}</li>
                    <li>{isVi ? "Tùy chỉnh màu sắc nếu cần" : "Customize colors if needed"}</li>
                    <li>{isVi ? "Copy URL API hoặc tải ảnh về" : "Copy the API URL or download the image"}</li>
                    <li>{isVi ? "Dùng URL trực tiếp trong thẻ img của bạn" : "Use the URL directly in your img tag"}</li>
                </ol>
            </div>

            {/* Use Cases */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "Các trường hợp sử dụng" : "Use Cases"}</h2>
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>🎨 {isVi ? "Thiết kế Mockup" : "Mockup Design"}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Tạo mockup nhanh chóng với các placeholder có kích thước chính xác" : "Create mockups quickly with precisely sized placeholders"}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>💻 Frontend Development</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Phát triển UI mà không cần chờ ảnh từ backend hoặc designer" : "Develop UI without waiting for images from backend or designer"}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>📱 Responsive Testing</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Test responsive với nhiều kích thước ảnh khác nhau" : "Test responsiveness with various image sizes"}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>📝 Documentation</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Minh họa cho tài liệu API hoặc hướng dẫn sử dụng" : "Illustrate API documentation or user guides"}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>🎯 Prototyping</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Tạo prototype nhanh với placeholder có kích thước chuẩn" : "Create quick prototypes with standard-sized placeholders"}</p>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4'>
                        <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>🧪 Testing</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{isVi ? "Test image loading, lazy loading, và các tính năng liên quan" : "Test image loading, lazy loading, and related features"}</p>
                    </div>
                </div>
            </div>

            {/* API Examples */}
            <div>
                <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{isVi ? "Ví dụ API" : "API Examples"}</h2>
                <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3'>
                    <div>
                        <p className='font-medium text-gray-800 dark:text-gray-200 mb-1'>{isVi ? "Ảnh 640x480 với gradient:" : "640x480 image with gradient:"}</p>
                        <code className='block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs text-gray-700 dark:text-gray-300'>/api/placeholder-image/640x480?category=gradient</code>
                    </div>
                    <div>
                        <p className='font-medium text-gray-800 dark:text-gray-200 mb-1'>{isVi ? "Ảnh vuông 300x300:" : "Square 300x300 image:"}</p>
                        <code className='block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs text-gray-700 dark:text-gray-300'>/api/placeholder-image/300</code>
                    </div>
                    <div>
                        <p className='font-medium text-gray-800 dark:text-gray-200 mb-1'>{isVi ? "Màu tùy chỉnh:" : "Custom colors:"}</p>
                        <code className='block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs text-gray-700 dark:text-gray-300'>/api/placeholder-image/400x300?category=solid&bg=ff5733&text=ffffff</code>
                    </div>
                    <div>
                        <p className='font-medium text-gray-800 dark:text-gray-200 mb-1'>{isVi ? "Text tùy chỉnh:" : "Custom text:"}</p>
                        <code className='block bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs text-gray-700 dark:text-gray-300'>/api/placeholder-image/800x600?customText=Logo+Here</code>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <FAQSection locale={locale} faqs={faqs} />
        </section>
    );
}
