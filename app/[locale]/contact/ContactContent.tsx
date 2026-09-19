"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { contactTranslations } from "@/lib/i18n/pages/contact";

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactContent() {
    const { locale } = useLanguage();
    const t = contactTranslations[locale].contact.page;
    const isVi = locale === "vi";

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        subject: "general",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [copiedEmail, setCopiedEmail] = useState(false);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText("lexuantruong0981@gmail.com");
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    const subjectOptions = [
        { key: "general", label: t.form.subjectOptions.general, icon: "💬" },
        { key: "bug", label: t.form.subjectOptions.bug, icon: "🐛" },
        { key: "suggestion", label: t.form.subjectOptions.suggestion, icon: "💡" },
        { key: "feedback", label: t.form.subjectOptions.feedback, icon: "⭐" },
        { key: "other", label: t.form.subjectOptions.other, icon: "📌" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    subject: t.form.subjectOptions[formData.subject as keyof typeof t.form.subjectOptions] || formData.subject,
                }),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", subject: "general", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Success state
    if (status === "success") {
        return (
            <div className='max-w-2xl mx-auto text-center py-20 px-4'>
                <div className='w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md'>
                    <svg className='w-10 h-10 text-emerald-600 dark:text-emerald-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
                    </svg>
                </div>
                <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white mb-3'>{t.success.title}</h2>
                <p className='text-base text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-8 leading-relaxed'>{t.success.description}</p>
                <div className='flex items-center justify-center gap-4'>
                    <button
                        onClick={() => setStatus("idle")}
                        className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md'
                    >
                        {t.success.sendAnother}
                    </button>
                    <Link
                        href={`/${locale}`}
                        className='px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition-all'
                    >
                        {isVi ? "Về trang chủ" : "Back to Home"}
                    </Link>
                </div>
            </div>
        );
    }

    // Error state
    if (status === "error") {
        return (
            <div className='max-w-2xl mx-auto text-center py-20 px-4'>
                <div className='w-20 h-20 bg-rose-100 dark:bg-rose-900/40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md'>
                    <svg className='w-10 h-10 text-rose-600 dark:text-rose-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                </div>
                <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white mb-3'>{t.error.title}</h2>
                <p className='text-base text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-8 leading-relaxed'>{t.error.description}</p>
                <div className='flex items-center justify-center gap-4'>
                    <button
                        onClick={() => setStatus("idle")}
                        className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md'
                    >
                        {t.error.retry}
                    </button>
                    <a
                        href='mailto:lexuantruong0981@gmail.com'
                        className='px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition-all'
                    >
                        {isVi ? "Gửi trực tiếp qua Email" : "Send directly via Email"}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-5xl mx-auto space-y-12 py-4'>
            {/* Header */}
            <div className='text-center max-w-3xl mx-auto'>
                <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4 shadow-2xs'>
                    <span>📬</span>
                    <span>{isVi ? "Kênh phản hồi & Hỗ trợ kỹ thuật" : "Feedback & Developer Inquiries"}</span>
                </div>
                <h1 className='text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4'>
                    {t.title}
                </h1>
                <p className='text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
                    {t.subtitle}
                </p>
            </div>

            {/* Quick Contact Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Email Direct Card */}
                <div className='p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 shadow-2xs flex flex-col justify-between group hover:border-blue-500/50 transition-all'>
                    <div>
                        <div className='w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mb-3'>
                            ✉️
                        </div>
                        <h3 className='font-bold text-gray-900 dark:text-white text-base mb-1'>
                            {isVi ? "Email Trực Tiếp" : "Direct Email"}
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed'>
                            {isVi ? "Trao đổi công việc, báo lỗi hoặc góp ý trực tiếp tới tác giả." : "Direct communication with the maintainer."}
                        </p>
                    </div>
                    <div className='flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60'>
                        <a
                            href='mailto:lexuantruong0981@gmail.com'
                            className='text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate flex-1'
                        >
                            lexuantruong0981@gmail.com
                        </a>
                        <button
                            onClick={handleCopyEmail}
                            className='px-2.5 py-1 text-[11px] font-medium rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors shrink-0'
                        >
                            {copiedEmail ? "✓ Đã copy" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* GitHub Issues Card */}
                <div className='p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 shadow-2xs flex flex-col justify-between group hover:border-blue-500/50 transition-all'>
                    <div>
                        <div className='w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-center text-xl mb-3'>
                            🐙
                        </div>
                        <h3 className='font-bold text-gray-900 dark:text-white text-base mb-1'>
                            GitHub Issues
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed'>
                            {isVi ? "Báo lỗi code, lỗi bảo mật hoặc yêu cầu tính năng mới công khai." : "Track bugs, submit bug reports or propose features openly."}
                        </p>
                    </div>
                    <a
                        href='https://github.com/xuantruongg03/anytools/issues'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2 border-t border-gray-100 dark:border-gray-700/60 inline-flex items-center gap-1'
                    >
                        <span>github.com/xuantruongg03/anytools</span>
                        <span>↗</span>
                    </a>
                </div>

                {/* Response Guarantee Card */}
                <div className='p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 shadow-2xs flex flex-col justify-between group hover:border-blue-500/50 transition-all'>
                    <div>
                        <div className='w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl mb-3'>
                            ⚡
                        </div>
                        <h3 className='font-bold text-gray-900 dark:text-white text-base mb-1'>
                            {isVi ? "Thời Gian Phản Hồi" : "Response Time"}
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed'>
                            {isVi ? "Mọi tin nhắn và đóng góp thường được xem xét trong vòng 24 giờ làm việc." : "All feedback and issues are typically addressed within 24 hours."}
                        </p>
                    </div>
                    <div className='text-xs font-semibold text-emerald-600 dark:text-emerald-400 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center gap-1.5'>
                        <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                        <span>{isVi ? "Đang trực tuyến & sẵn sàng" : "Online & Responsive"}</span>
                    </div>
                </div>
            </div>

            {/* Main Form & Sidebar Section */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Contact Form */}
                <div className='lg:col-span-2'>
                    <form
                        onSubmit={handleSubmit}
                        className='bg-white dark:bg-gray-800/90 rounded-3xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm p-6 sm:p-8 space-y-6'
                    >
                        <div>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-1'>
                                {isVi ? "Gửi tin nhắn cho chúng tôi" : "Send us a Message"}
                            </h2>
                            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
                                {isVi ? "Điền vào biểu mẫu bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể." : "Fill out the form below and we will get back to you promptly."}
                            </p>
                        </div>

                        {/* Subject Chip Selector */}
                        <div>
                            <label className='block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2.5'>
                                {t.form.subject} <span className='text-rose-500'>*</span>
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                {subjectOptions.map((opt) => (
                                    <button
                                        key={opt.key}
                                        type='button'
                                        onClick={() => setFormData((prev) => ({ ...prev, subject: opt.key }))}
                                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                            formData.subject === opt.key
                                                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                                                : "bg-gray-100 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        <span>{opt.icon}</span>
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Name & Email Fields */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <label htmlFor='name' className='block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2'>
                                    {t.form.name} <span className='text-rose-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder={t.form.namePlaceholder}
                                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all'
                                />
                            </div>

                            <div>
                                <label htmlFor='email' className='block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2'>
                                    {t.form.email} <span className='text-rose-500'>*</span>
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={t.form.emailPlaceholder}
                                    className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all'
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor='message' className='block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2'>
                                {t.form.message} <span className='text-rose-500'>*</span>
                            </label>
                            <textarea
                                id='message'
                                name='message'
                                required
                                rows={6}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={t.form.messagePlaceholder}
                                className='w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none'
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={status === "sending"}
                            className='w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer'
                        >
                            {status === "sending" ? (
                                <>
                                    <svg className='w-5 h-5 animate-spin' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    <span>{t.form.sending}</span>
                                </>
                            ) : (
                                <>
                                    <span>✉️</span>
                                    <span>{t.form.send}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Info & Policy Sidebar */}
                <div className='space-y-6'>
                    {/* Maintainer Info Card */}
                    <div className='p-6 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-4'>
                        <h3 className='font-bold text-gray-900 dark:text-white text-base'>
                            {t.info.title}
                        </h3>

                        <div className='space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300'>
                            <div className='flex items-start gap-3'>
                                <span className='text-lg shrink-0'>🛡️</span>
                                <div>
                                    <div className='font-bold text-gray-900 dark:text-white mb-0.5'>
                                        {isVi ? "Bảo Mật & Riêng Tư" : "Privacy Guaranteed"}
                                    </div>
                                    <div className='text-gray-500 dark:text-gray-400 text-xs'>
                                        {isVi ? "Chúng tôi không bao giờ chia sẻ thông tin liên lạc của bạn cho bên thứ ba." : "We will never sell or share your contact details with third parties."}
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <span className='text-lg shrink-0'>💡</span>
                                <div>
                                    <div className='font-bold text-gray-900 dark:text-white mb-0.5'>
                                        {isVi ? "Đề Xuất Công Cụ Mới" : "Suggest Tools"}
                                    </div>
                                    <div className='text-gray-500 dark:text-gray-400 text-xs'>
                                        {isVi ? "Bạn cần công cụ nào chưa có trên AnyTools? Hãy đề xuất, chúng tôi sẽ xây dựng!" : "Missing a tool you use daily? Let us know and we'll build it."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Community Banner */}
                    <div className='p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md'>
                        <div className='text-3xl mb-2'>💬</div>
                        <h4 className='font-bold text-base mb-1'>
                            {isVi ? "Lắng nghe từ cộng đồng" : "Community First"}
                        </h4>
                        <p className='text-xs text-blue-100 leading-relaxed mb-4'>
                            {locale === "vi"
                                ? "Mọi phản hồi, góp ý hay đóng góp mã nguồn đều là động lực to lớn giúp AnyTools ngày một hoàn thiện hơn."
                                : "Every message, bug report, and open-source contribution makes AnyTools better for everyone."}
                        </p>
                        <Link
                            href={`/${locale}/about`}
                            className='inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3.5 py-2 rounded-xl transition-colors'
                        >
                            <span>{isVi ? "Tìm hiểu về AnyTools" : "Learn more about us"}</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
