"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";

export function Footer() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    const toolCategories = {
        developer: [
            { name: t.tools.jsonFormatter.name, href: `/${locale}/tools/json-formatter` },
            { name: t.tools.base64.name, href: `/${locale}/tools/base64` },
            { name: t.tools.urlEncoder.name, href: `/${locale}/tools/url-encoder` },
            { name: t.tools.hashGenerator.name, href: `/${locale}/tools/hash-generator` },
        ],
        text: [{ name: t.tools.textCase.name, href: `/${locale}/tools/text-case` }],
        design: [{ name: t.tools.colorPicker.name, href: `/${locale}/tools/color-picker` }],
    };

    return (
        <footer className='border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto'>
            <div className='container mx-auto px-4 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                    {/* About */}
                    <div>
                        <h3 className='text-lg font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>AnyTools</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>{locale === "en" ? "Free online tools for developers, designers, and content creators. Fast, secure, and privacy-friendly utilities running entirely in your browser." : "Công cụ trực tuyến miễn phí cho lập trình viên, nhà thiết kế và người sáng tạo nội dung. Tiện ích nhanh, bảo mật và thân thiện với quyền riêng tư chạy hoàn toàn trong trình duyệt của bạn."}</p>
                        <p className='text-xs text-gray-500 dark:text-gray-500'>{locale === "en" ? "JSON formatter, Base64 encoder/decoder, URL encoder, text tools, and more - 100% free & open-source." : "Định dạng JSON, mã hóa/giải mã Base64, mã hóa URL, công cụ văn bản và nhiều hơn nữa - 100% miễn phí & mã nguồn mở."}</p>
                    </div>

                    {/* Developer Tools */}
                    <div>
                        <h4 className='font-semibold mb-4 text-gray-900 dark:text-gray-100'>{locale === "en" ? "Developer Tools" : "Công Cụ Lập Trình"}</h4>
                        <ul className='space-y-2'>
                            {toolCategories.developer.map((tool) => (
                                <li key={tool.href}>
                                    <Link href={tool.href} className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        {tool.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Other Tools */}
                    <div>
                        <h4 className='font-semibold mb-4 text-gray-900 dark:text-gray-100'>{locale === "en" ? "Other Tools" : "Công Cụ Khác"}</h4>
                        <ul className='space-y-2'>
                            {toolCategories.text.map((tool) => (
                                <li key={tool.href}>
                                    <Link href={tool.href} className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        {tool.name}
                                    </Link>
                                </li>
                            ))}
                            {toolCategories.design.map((tool) => (
                                <li key={tool.href}>
                                    <Link href={tool.href} className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        {tool.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className='font-semibold mb-4 text-gray-900 dark:text-gray-100'>{locale === "en" ? "Links" : "Liên Kết"}</h4>
                        <ul className='space-y-2'>
                            <li>
                                <Link href={`/${locale}`} className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                    {locale === "en" ? "Home" : "Trang Chủ"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${locale}/about`} className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                    {t.about.title}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className='border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center'>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                        © {new Date().getFullYear()} AnyTools. {t.home.footer}
                    </p>
                </div>
            </div>
        </footer>
    );
}
