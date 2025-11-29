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
        other: [
            { name: t.tools.colorPicker.name, href: `/${locale}/tools/color-picker` },
            {
                name: t.tools.tailwindCss.name,
                href: `/${locale}/tools/tailwind-css`,
            },
            {
                name: t.tools.regexTester.name,
                href: `/${locale}/tools/regex-tester`,
            },
        ],
    };

    return (
        <footer className='border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto relative z-40'>
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
                            {toolCategories.other.map((tool) => (
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
                            <li>
                                <Link href={`/${locale}/feedback`} className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                    {locale === "en" ? "Feedback" : "Phản Hồi"}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${locale}/donate`} className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                    {locale === "en" ? "Donate" : "Ủng Hộ"}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social & Info Section */}
                <div className='border-t border-gray-200 dark:border-gray-800 mt-8 pt-8'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                        {/* Contact Info */}
                        <div>
                            <h5 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm'>{locale === "en" ? "Contact" : "Liên Hệ"}</h5>
                            <div className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                                <p className='flex items-center gap-2'>
                                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                        <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                                        <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                                    </svg>
                                    <a href='mailto:lexuantruong098@gmail.com' className='hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        lexuantruong098@gmail.com
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h5 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm'>{locale === "en" ? "Follow Us" : "Theo Dõi"}</h5>
                            <div className='flex gap-3'>
                                <a href='https://github.com/xuantruongg03' target='_blank' rel='noopener noreferrer' className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                    <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                        <path
                                            fillRule='evenodd'
                                            d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </a>
                                {/* <a href='https://twitter.com/anytools' target='_blank' rel='noopener noreferrer' className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                    <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                                    </svg> */}
                                {/* </a> */}
                            </div>
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <h5 className='font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm'>{locale === "en" ? "Built With" : "Xây Dựng Với"}</h5>
                            <div className='flex flex-wrap gap-2'>
                                <span className='text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded'>Next.js</span>
                                <span className='text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded'>TypeScript</span>
                                <span className='text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded'>Tailwind CSS</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className='border-t border-gray-200 dark:border-gray-800 pt-8 text-center'>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                        © {new Date().getFullYear()} AnyTools. {t.home.footer}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-500'>{locale === "en" ? "Made with ❤️ for developers and creators worldwide" : "Được tạo ra với ❤️ cho các lập trình viên và người sáng tạo trên toàn thế giới"}</p>
                </div>
            </div>
        </footer>
    );
}
