"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { toast } from "@/components/ui/Toast";

// Helper function to programmatically open the modal from anywhere
export function openSuggestModal(initialTab: "suggest" | "dev" = "suggest") {
    if (typeof window !== "undefined") {
        window.dispatchEvent(
            new CustomEvent("open-suggest-modal", {
                detail: { tab: initialTab },
            })
        );
    }
}

export default function SuggestModal() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"suggest" | "dev">("suggest");
    const [category, setCategory] = useState<"tool" | "extension" | "app" | "other">("tool");
    const [toolName, setToolName] = useState("");
    const [description, setDescription] = useState("");
    const [refUrl, setRefUrl] = useState("");

    // Listen to custom open event
    useEffect(() => {
        const handleOpen = (e: CustomEvent<{ tab?: "suggest" | "dev" }>) => {
            if (e.detail?.tab) {
                setActiveTab(e.detail.tab);
            }
            setIsOpen(true);
        };

        window.addEventListener("open-suggest-modal" as any, handleOpen);
        return () => window.removeEventListener("open-suggest-modal" as any, handleOpen);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const getCategoryName = useCallback(
        (cat: string) => {
            switch (cat) {
                case "tool":
                    return isVi ? "Công cụ Web (Web Tool)" : "Web Tool";
                case "extension":
                    return isVi ? "Tiện ích mở rộng (Browser Extension)" : "Browser Extension";
                case "app":
                    return isVi ? "Ứng dụng (Mobile/Desktop App)" : "App (Mobile/Desktop)";
                default:
                    return isVi ? "Ý tưởng khác" : "Other Idea";
            }
        },
        [isVi]
    );

    const emailSubject = `[AnyTools] ${isVi ? "Đề xuất tính năng/công cụ mới" : "New Tool/Feature Suggestion"}: ${
        toolName || (isVi ? "Ý tưởng từ người dùng" : "User Idea")
    }`;

    const emailBody = `${isVi ? "Xin chào đội ngũ AnyTools," : "Hello AnyTools Team,"}

${isVi ? "Tôi có ý tưởng muốn đề xuất cho AnyTools như sau:" : "I would like to suggest a new tool/feature for AnyTools:"}

• ${isVi ? "Loại tiện ích" : "Type"}: ${getCategoryName(category)}
• ${isVi ? "Tên công cụ / tính năng" : "Name"}: ${toolName || (isVi ? "[Chưa đặt tên]" : "[Not specified]")}
• ${isVi ? "Mô tả chi tiết cách hoạt động" : "Description"}:
${description || (isVi ? "[Nhập mô tả của bạn vào đây]" : "[Enter description here]")}

• ${isVi ? "Link tài liệu / ví dụ tham khảo" : "Reference link / example"}: ${refUrl || "N/A"}

${isVi ? "Rất mong ý tưởng này có thể hữu ích cho cộng đồng AnyTools!" : "Hope this idea helps the AnyTools community!"}

${isVi ? "Trân trọng," : "Best regards,"}`;

    const mailtoUrl = `mailto:lexuantruong0981@gmail.com?subject=${encodeURIComponent(
        emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(emailBody);
            toast.success(
                isVi
                    ? "Đã sao chép nội dung email! Bạn có thể dán vào hộp thư của mình. 📋"
                    : "Copied email draft to clipboard! You can paste it into your mail client. 📋"
            );
        } catch {
            toast.error(isVi ? "Không thể sao chép nội dung" : "Failed to copy text");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn'
            onClick={() => setIsOpen(false)}
            role='dialog'
            aria-modal='true'
            aria-labelledby='suggest-modal-title'
        >
            <div
                className='relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with gradient bar */}
                <div className='relative px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-gradient-to-r from-blue-50/50 via-purple-50/30 to-transparent dark:from-blue-950/20 dark:via-purple-950/10 dark:to-transparent'>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                            <div className='w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl shadow-md shrink-0'>
                                💡
                            </div>
                            <div>
                                <h3
                                    id='suggest-modal-title'
                                    className='text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight'
                                >
                                    {isVi
                                        ? "Đề Xuất Công Cụ & Đóng Góp Phát Triển"
                                        : "Suggest Tools & Open Source Contribution"}
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                    {isVi
                                        ? "Góp ý công cụ, tiện ích mở rộng hoặc tham gia đóng góp mã nguồn"
                                        : "Suggest web tools, extensions, or contribute code to AnyTools"}
                                </p>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className='p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer'
                            aria-label={isVi ? "Đóng cửa sổ" : "Close dialog"}
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className='flex gap-2 mt-4'>
                        <button
                            onClick={() => setActiveTab("suggest")}
                            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeTab === "suggest"
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                            <span>✉️</span>
                            <span>{isVi ? "Gợi Ý Qua Email" : "Suggest via Email"}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("dev")}
                            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeTab === "dev"
                                    ? "bg-purple-600 text-white shadow-sm shadow-purple-500/30"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                            <span>👩‍💻</span>
                            <span>{isVi ? "Dành Cho Developer" : "For Developers"}</span>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className='p-6 overflow-y-auto space-y-5'>
                    {activeTab === "suggest" ? (
                        <>
                            {/* Category Selector */}
                            <div>
                                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                                    {isVi ? "1. Bạn muốn đề xuất loại tiện ích nào?" : "1. What type of tool are you suggesting?"}
                                </label>
                                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                                    {[
                                        { key: "tool", label: isVi ? "Công Cụ Web" : "Web Tool", icon: "🌐" },
                                        { key: "extension", label: isVi ? "Extension" : "Extension", icon: "🧩" },
                                        { key: "app", label: isVi ? "Ứng Dụng App" : "Desktop/App", icon: "📱" },
                                        { key: "other", label: isVi ? "Ý Tưởng Khác" : "Other Idea", icon: "💡" },
                                    ].map((item) => (
                                        <button
                                            key={item.key}
                                            type='button'
                                            onClick={() => setCategory(item.key as any)}
                                            className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                                category === item.key
                                                    ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20"
                                                    : "bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <span className='text-lg'>{item.icon}</span>
                                            <span className='truncate w-full text-center'>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name Input */}
                            <div>
                                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    {isVi ? "2. Tên công cụ / tiện ích" : "2. Tool or feature name"}
                                </label>
                                <input
                                    type='text'
                                    value={toolName}
                                    onChange={(e) => setToolName(e.target.value)}
                                    placeholder={
                                        isVi
                                            ? "Ví dụ: Công cụ chuyển đổi cURL sang Code, SQL Formatter..."
                                            : "E.g., cURL to Code Converter, SQL Formatter..."
                                    }
                                    className='w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white'
                                />
                            </div>

                            {/* Description Input */}
                            <div>
                                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    {isVi
                                        ? "3. Mô tả tính năng hoặc vấn đề cần giải quyết"
                                        : "3. Feature description or problem to solve"}
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder={
                                        isVi
                                            ? "Mô tả công cụ nên có chức năng gì, hỗ trợ định dạng nào, tại sao người dùng cần nó..."
                                            : "Describe what the tool should do, supported formats, why users need it..."
                                    }
                                    className='w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white leading-relaxed'
                                />
                            </div>

                            {/* Reference URL Input */}
                            <div>
                                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5'>
                                    {isVi ? "4. Link tham khảo (nếu có)" : "4. Reference URL or sample (optional)"}
                                </label>
                                <input
                                    type='url'
                                    value={refUrl}
                                    onChange={(e) => setRefUrl(e.target.value)}
                                    placeholder='https://...'
                                    className='w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white'
                                />
                            </div>
                        </>
                    ) : (
                        /* Developer Contribution Tab */
                        <div className='space-y-4'>
                            <div className='p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs sm:text-sm text-purple-900 dark:text-purple-200 leading-relaxed'>
                                <p className='font-bold text-sm mb-1'>
                                    {isVi
                                        ? "🚀 Bạn là Developer và muốn cùng đóng góp mã nguồn?"
                                        : "🚀 Are you a developer interested in contributing code?"}
                                </p>
                                <p>
                                    {isVi
                                        ? "AnyTools là dự án mã nguồn mở vì cộng đồng hoàn toàn miễn phí. Chúng tôi xây dựng bằng Next.js 16 App Router, Tailwind CSS v4 và TypeScript. Mọi công cụ mới hoặc cải tiến từ bạn đều được trân trọng và chào đón!"
                                        : "AnyTools is a 100% free open-source community platform built with Next.js 16 App Router, Tailwind CSS v4, and TypeScript. All new tools, performance fixes, and UI improvements are warmly welcomed!"}
                                </p>
                            </div>

                            {/* Tech Stack Chips */}
                            <div>
                                <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider'>
                                    {isVi ? "Công nghệ sử dụng" : "Tech Stack"}
                                </div>
                                <div className='flex items-center gap-2 flex-wrap text-xs font-mono font-medium'>
                                    <span className='px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'>
                                        Next.js 16 (App Router)
                                    </span>
                                    <span className='px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'>
                                        React 19
                                    </span>
                                    <span className='px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'>
                                        TypeScript
                                    </span>
                                    <span className='px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'>
                                        Tailwind CSS v4
                                    </span>
                                    <span className='px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'>
                                        100% Client-Side Privacy
                                    </span>
                                </div>
                            </div>

                            {/* Step-by-step guidance */}
                            <div className='bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200/80 dark:border-gray-700/80 text-xs space-y-2.5'>
                                <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                    {isVi ? "Các bước đóng góp một công cụ mới:" : "How to contribute a new tool:"}
                                </div>
                                <div className='flex gap-2.5'>
                                    <span className='w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold shrink-0'>
                                        1
                                    </span>
                                    <span className='text-gray-600 dark:text-gray-300'>
                                        {isVi
                                            ? "Fork repository `xuantruongg03/anytools` trên GitHub về tài khoản của bạn."
                                            : "Fork the `xuantruongg03/anytools` GitHub repository to your account."}
                                    </span>
                                </div>
                                <div className='flex gap-2.5'>
                                    <span className='w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold shrink-0'>
                                        2
                                    </span>
                                    <span className='text-gray-600 dark:text-gray-300'>
                                        {isVi
                                            ? "Tạo thư mục tool trong `app/[locale]/tools/ten-tool/` với Page & Client component."
                                            : "Create tool files in `app/[locale]/tools/your-tool-name/` with Page & Client component."}
                                    </span>
                                </div>
                                <div className='flex gap-2.5'>
                                    <span className='w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold shrink-0'>
                                        3
                                    </span>
                                    <span className='text-gray-600 dark:text-gray-300'>
                                        {isVi
                                            ? "Thêm cấu hình công cụ vào `src/config/tools.ts` và bản dịch EN/VI vào `src/lib/i18n/`."
                                            : "Register tool in `src/config/tools.ts` and add EN/VI strings in `src/lib/i18n/`."}
                                    </span>
                                </div>
                                <div className='flex gap-2.5'>
                                    <span className='w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold shrink-0'>
                                        4
                                    </span>
                                    <span className='text-gray-600 dark:text-gray-300'>
                                        {isVi
                                            ? "Tạo Pull Request. Chúng tôi cam kết review và phản hồi nhanh chóng trong 24 giờ!"
                                            : "Open a Pull Request. We review and merge PRs within 24 hours!"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action Buttons */}
                <div className='p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/70 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3'>
                    {activeTab === "suggest" ? (
                        <>
                            <div className='flex items-center gap-2 w-full sm:w-auto'>
                                <button
                                    onClick={handleCopyEmail}
                                    className='px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto'
                                >
                                    <span>📋</span>
                                    <span>{isVi ? "Sao Chép Mẫu" : "Copy Template"}</span>
                                </button>
                                <Link
                                    href={`/${locale}/contact`}
                                    onClick={() => setIsOpen(false)}
                                    className='px-3 py-2.5 rounded-xl text-gray-500 hover:text-blue-600 text-xs font-medium transition-colors text-center hidden sm:inline-block'
                                >
                                    {isVi ? "Form liên hệ →" : "Contact page →"}
                                </Link>
                            </div>

                            <a
                                href={mailtoUrl}
                                className='px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all text-center cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto'
                            >
                                <span>✉️</span>
                                <span>{isVi ? "Mở Ứng Dụng Mail Để Gửi" : "Send via Email Client"}</span>
                            </a>
                        </>
                    ) : (
                        <>
                            <a
                                href='mailto:lexuantruong0981@gmail.com?subject=[AnyTools]%20Developer%20Contribution'
                                className='px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto'
                            >
                                <span>📫</span>
                                <span>{isVi ? "Email Hợp Tác Làm Dev" : "Email for Dev Collab"}</span>
                            </a>

                            <a
                                href='https://github.com/xuantruongg03/anytools'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-all text-center cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto'
                            >
                                <svg className='w-4 h-4 fill-current' viewBox='0 0 24 24'>
                                    <path
                                        fillRule='evenodd'
                                        d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                                <span>{isVi ? "Mở GitHub AnyTools" : "Open AnyTools GitHub"}</span>
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
