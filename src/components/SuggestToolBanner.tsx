"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { openSuggestModal } from "@/components/SuggestModal";

export default function SuggestToolBanner() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const mailtoLink = `mailto:lexuantruong0981@gmail.com?subject=${encodeURIComponent(
        isVi ? "[AnyTools] Đề xuất công cụ / Tính năng mới" : "[AnyTools] Tool / Feature Suggestion"
    )}&body=${encodeURIComponent(
        isVi
            ? "Chào xuantruongg03,\n\nMình có ý tưởng về công cụ/app/extension này muốn đề xuất cho AnyTools:\n\n- Tên công cụ / tính năng:\n- Mô tả chi tiết cách hoạt động:\n- Link ví dụ hoặc tài liệu tham khảo (nếu có):\n\nCảm ơn bạn!"
            : "Hi xuantruongg03,\n\nI have an idea for a tool/app/extension I'd like to suggest for AnyTools:\n\n- Tool name / feature:\n- Detailed description:\n- Reference link or example (if any):\n\nThanks!"
    )}`;

    return (
        <section className='my-12 px-4'>
            <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-blue-200/80 dark:border-blue-900/60 p-8 sm:p-10 shadow-lg backdrop-blur-md max-w-5xl mx-auto'>
                {/* Ambient glow decoration */}
                <div className='absolute -right-20 -top-20 w-64 h-64 bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none' />
                <div className='absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none' />

                <div className='relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8'>
                    {/* Left: Content */}
                    <div className='text-center lg:text-left max-w-2xl'>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4'>
                            <span>💡</span>
                            <span>{isVi ? "Đóng Góp Ý Tưởng & Mã Nguồn" : "Suggest Features & Open Source"}</span>
                        </div>

                        <h2 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight'>
                            {isVi
                                ? "Bạn cần thêm công cụ, app hay extension nào?"
                                : "Need a specific tool, app, or extension?"}
                        </h2>

                        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6'>
                            {isVi
                                ? "AnyTools là dự án mã nguồn mở vì cộng đồng hoàn toàn miễn phí. Nếu bạn có ý tưởng về một tiện ích giúp ích cho công việc học tập hay lập trình, hãy cho chúng tôi biết qua email. Nếu bạn là Developer và muốn cùng chung tay đóng góp code (Pull Request), chúng tôi luôn nhiệt liệt hoan nghênh!"
                                : "AnyTools is a 100% free open-source project for creators and developers. If you have an idea for a missing tool, extension, or productivity feature, let us know via email. If you're a developer and want to contribute code, our GitHub repository is always open for pull requests!"}
                        </p>

                        {/* Feature Badges */}
                        <div className='flex items-center justify-center lg:justify-start gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400'>
                            <span className='inline-flex items-center gap-1.5'>
                                <span className='text-emerald-500'>✓</span>
                                <span>{isVi ? "Phản hồi nhanh qua Email" : "Fast Email Responses"}</span>
                            </span>
                            <span className='inline-flex items-center gap-1.5'>
                                <span className='text-blue-500'>✓</span>
                                <span>{isVi ? "Mã nguồn mở MIT trên GitHub" : "MIT Open Source on GitHub"}</span>
                            </span>
                            <span className='inline-flex items-center gap-1.5'>
                                <span className='text-purple-500'>✓</span>
                                <span>{isVi ? "Hoàn toàn miễn phí" : "100% Free Forever"}</span>
                            </span>
                        </div>
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className='flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0'>
                        {/* Interactive Suggestion Modal Trigger */}
                        <button
                            type='button'
                            onClick={() => openSuggestModal("suggest")}
                            className='inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all text-center cursor-pointer'
                        >
                            <span>💡</span>
                            <span>{isVi ? "Gợi Ý Ý Tưởng Mới" : "Suggest an Idea Now"}</span>
                        </button>

                        {/* Developer Contribution Trigger */}
                        <button
                            type='button'
                            onClick={() => openSuggestModal("dev")}
                            className='inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md transition-all text-center cursor-pointer'
                        >
                            <span>👩‍💻</span>
                            <span>{isVi ? "Dành Cho Developer" : "For Developers & Code"}</span>
                        </button>

                        {/* Secondary Links */}
                        <div className='flex items-center justify-center gap-3 pt-1 text-xs'>
                            <a
                                href={mailtoLink}
                                className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline'
                            >
                                ✉️ {isVi ? "Gửi mail" : "Email"}
                            </a>
                            <span className='text-gray-300 dark:text-gray-600'>•</span>
                            <a
                                href='https://github.com/xuantruongg03/anytools'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline'
                            >
                                🐙 GitHub
                            </a>
                            <span className='text-gray-300 dark:text-gray-600'>•</span>
                            <Link
                                href={`/${locale}/contact`}
                                className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline'
                            >
                                💬 {isVi ? "Liên hệ" : "Contact"}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
