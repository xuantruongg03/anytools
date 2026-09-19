"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import CurlConverterClient from "./CurlConverterClient";
import FAQSection from "@/components/ui/FAQSection";

export default function CurlConverterContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const faqItems = [
        {
            question: isVi ? "cURL to Code Converter là gì?" : "What is cURL to Code Converter?",
            answer: isVi
                ? "Đây là công cụ chuyển đổi câu lệnh cURL dòng lệnh sang các ngôn ngữ lập trình phổ biến như JavaScript (Fetch, Axios), Python (requests), Go (net/http), và PHP (curl) hoàn toàn tự động."
                : "It is a developer tool that automatically converts command-line cURL commands into production-ready code snippets in JavaScript (Fetch, Axios), Python (requests), Go (net/http), and PHP (curl).",
        },
        {
            question: isVi ? "Dữ liệu lệnh cURL và Token bí mật của tôi có an toàn không?" : "Is my cURL data and auth token secure?",
            answer: isVi
                ? "Tuyệt đối an toàn 100%! Quá trình phân tích cú pháp cURL diễn ra hoàn toàn trên trình duyệt của bạn (Client-Side), không có bất kỳ dữ liệu nào được gửi về máy chủ."
                : "100% secure! The parsing process runs entirely in your browser (Client-Side). No sensitive requests, headers, or tokens are transmitted over any network or server.",
        },
        {
            question: isVi ? "Công cụ hỗ trợ những cú pháp cURL nào?" : "Which cURL syntax features are supported?",
            answer: isVi
                ? "Công cụ hỗ trợ các phương thức HTTP (GET, POST, PUT, DELETE, PATCH), Headers (-H), Request Body JSON & Form Data (-d, --data-raw), Basic Authentication (-u), Cookies (-b), và User-Agent."
                : "The converter supports HTTP methods (GET, POST, PUT, DELETE, PATCH), Custom Headers (-H), JSON & Form Data bodies (-d, --data-raw), Basic Auth (-u), Cookies (-b), and User-Agent flags.",
        },
    ];

    return (
        <div className='max-w-6xl mx-auto'>
            {/* Main Interactive Studio */}
            <CurlConverterClient />

            {/* SEO Overview & Guides */}
            <section className='mt-16 space-y-8'>
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                        {isVi ? "Giới thiệu về Công Cụ Chuyển Đổi cURL sang Code" : "About cURL to Code Converter"}
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                        {isVi
                            ? "cURL là công cụ dòng lệnh tiêu chuẩn để tương tác với các API HTTP. Tuy nhiên, khi chuyển một request từ DevTools hoặc tài liệu API vào dự án thực tế, việc viết lại headers, payload và phương thức HTTP thủ công thường mất nhiều thời gian và dễ xảy ra lỗi cú pháp. Công cụ này giúp bạn chuyển đổi tức thì câu lệnh cURL sang các framework và ngôn ngữ phổ biến nhất."
                            : "cURL is the de facto command-line standard for testing and transferring data across HTTP APIs. However, manually translating a cURL snippet into application code often takes unnecessary developer time. This converter instantly transforms cURL commands into clean, ready-to-use HTTP client code in modern languages."}
                    </p>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-4'>
                        <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>⚡</div>
                            <h3 className='font-bold text-sm text-gray-900 dark:text-gray-100 mb-1'>
                                {isVi ? "Chuyển Đổi Tức Thì" : "Instant Conversion"}
                            </h3>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi ? "Tự động phân tích và sinh mã theo thời gian thực ngay khi nhập hoặc dán lệnh." : "Parses syntax and outputs production-grade code in real-time as you type."}
                            </p>
                        </div>
                        <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>🔒</div>
                            <h3 className='font-bold text-sm text-gray-900 dark:text-gray-100 mb-1'>
                                {isVi ? "Bảo Mật Client-Side" : "Client-Side Privacy"}
                            </h3>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi ? "API keys, Bearer tokens và dữ liệu nhạy cảm không bao giờ rời khỏi trình duyệt." : "Secrets, API keys, and authorization headers never leave your machine."}
                            </p>
                        </div>
                        <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>💻</div>
                            <h3 className='font-bold text-sm text-gray-900 dark:text-gray-100 mb-1'>
                                {isVi ? "Đa Dạng Ngôn Ngữ" : "Multiple Languages"}
                            </h3>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi ? "Hỗ trợ Fetch, Axios, Python Requests, Go net/http và PHP cURL." : "Generate snippets for JavaScript, Python, Go, PHP, and more."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <FAQSection locale={locale} faqs={faqItems} />
            </section>
        </div>
    );
}
