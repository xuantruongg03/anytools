"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { toolsConfig } from "@/config/tools";

export default function AboutContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.about.page;
    const isVi = locale === "vi";

    const [copiedStep, setCopiedStep] = useState<string | null>(null);

    const handleCopy = (text: string, stepKey: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStep(stepKey);
        setTimeout(() => setCopiedStep(null), 2000);
    };

    const stats = [
        { value: "50+", label: isVi ? "Công cụ trực tuyến" : "Online Tools", icon: "⚡" },
        { value: "100%", label: isVi ? "Bảo mật Client-side" : "Client-side Privacy", icon: "🔒" },
        { value: "0đ", label: isVi ? "Miễn phí vĩnh viễn" : "Free Forever", icon: "✨" },
        { value: "MIT", label: isVi ? "Mã nguồn mở" : "Open Source", icon: "🌐" },
    ];

    const pillars = [
        {
            icon: "⚡",
            title: page.whyCards.fast.title,
            desc: page.whyCards.fast.desc,
            badge: isVi ? "Tốc độ tức thì" : "Instant Speed",
            color: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20",
            borderColor: "border-amber-500/20 dark:border-amber-500/30",
        },
        {
            icon: "🔒",
            title: page.whyCards.secure.title,
            desc: page.whyCards.secure.desc,
            badge: isVi ? "Quyền riêng tư" : "Zero Tracking",
            color: "from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20",
            borderColor: "border-blue-500/20 dark:border-blue-500/30",
        },
        {
            icon: "✨",
            title: page.whyCards.free.title,
            desc: page.whyCards.free.desc,
            badge: isVi ? "Không chi phí" : "No Subscription",
            color: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20",
            borderColor: "border-emerald-500/20 dark:border-emerald-500/30",
        },
        {
            icon: "🎨",
            title: page.whyCards.clean.title,
            desc: page.whyCards.clean.desc,
            badge: isVi ? "Trải nghiệm mượt" : "Distraction-Free",
            color: "from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20",
            borderColor: "border-purple-500/20 dark:border-purple-500/30",
        },
    ];

    return (
        <div className='max-w-5xl mx-auto space-y-16 py-4'>
            {/* Hero Section */}
            <section className='text-center relative py-8 md:py-12'>
                <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 shadow-2xs'>
                    <span>🚀</span>
                    <span>{isVi ? "Nền tảng tiện ích đa năng & Mã nguồn mở" : "All-in-one Developer Utility Platform"}</span>
                </div>

                <h1 className='text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 leading-tight'>
                    {isVi ? "Công cụ số thông minh cho" : "Smart Digital Tools for"}{" "}
                    <span className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent'>
                        {isVi ? "Lập trình viên & Người sáng tạo" : "Developers & Creators"}
                    </span>
                </h1>

                <p className='text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10'>
                    {page.welcome}
                </p>

                {/* Stats Bar */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto'>
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className='p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 shadow-2xs hover:shadow-md transition-all'
                        >
                            <div className='text-2xl sm:text-3xl mb-1'>{stat.icon}</div>
                            <div className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
                                {stat.value}
                            </div>
                            <div className='text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5'>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className='p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800/90 dark:via-gray-800/60 dark:to-gray-900/90 border border-blue-100 dark:border-gray-700 shadow-sm'>
                <div className='max-w-3xl'>
                    <div className='inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-3'>
                        <span>🎯</span>
                        <span>{page.missionTitle}</span>
                    </div>
                    <h2 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "Chúng tôi tin rằng công cụ cần thiết phải luôn mở và an toàn" : "Essential tools should be open, private, and accessible"}
                    </h2>
                    <p className='text-base text-gray-600 dark:text-gray-300 leading-relaxed'>
                        {page.missionDesc}
                    </p>
                </div>
            </section>

            {/* Why Choose AnyTools (Core Pillars) */}
            <section className='space-y-6'>
                <div className='text-center max-w-2xl mx-auto'>
                    <h2 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3'>
                        {page.whyTitle}
                    </h2>
                    <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                        {isVi ? "Những nguyên lý cốt lõi tạo nên sự tin cậy của AnyTools đối với cộng đồng." : "The architectural principles that make AnyTools beloved by creators."}
                    </p>
                </div>

                <div className='grid sm:grid-cols-2 gap-5'>
                    {pillars.map((item, idx) => (
                        <div
                            key={idx}
                            className={`p-6 rounded-2xl bg-white dark:bg-gray-800/90 border ${item.borderColor} shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group`}
                        >
                            <div>
                                <div className='flex items-center justify-between mb-4'>
                                    <div className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gray-100 dark:bg-gray-700/60 group-hover:scale-110 transition-transform'>
                                        {item.icon}
                                    </div>
                                    <span className='text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'>
                                        {item.badge}
                                    </span>
                                </div>
                                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
                                    {item.title}
                                </h3>
                                <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ecosystem & Tool Categories */}
            <section className='p-8 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-xs space-y-6'>
                <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
                    <div>
                        <div className='inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-2'>
                            <span>🧩</span>
                            <span>{page.toolsTitle}</span>
                        </div>
                        <h2 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white'>
                            {isVi ? "Hệ sinh thái công cụ phong phú" : "Comprehensive Tool Ecosystem"}
                        </h2>
                    </div>
                    <Link
                        href={`/${locale}`}
                        className='inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
                    >
                        <span>{isVi ? "Khám phá tất cả công cụ" : "Explore all tools"}</span>
                        <span>→</span>
                    </Link>
                </div>

                <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed'>
                    {page.toolsDesc}
                </p>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3'>
                    {toolsConfig.map((cat) => (
                        <Link
                            key={cat.key}
                            href={`/${locale}#tools`}
                            className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-100 dark:border-gray-700 transition-all group'
                        >
                            <div className='text-2xl mb-1.5 group-hover:scale-110 transition-transform'>
                                {cat.icon}
                            </div>
                            <div className='font-bold text-xs text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 capitalize truncate'>
                                {cat.key}
                            </div>
                            <div className='text-[11px] text-gray-500 dark:text-gray-400'>
                                {cat.tools.length} {isVi ? "công cụ" : "tools"}
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Open Source & Contribution Guide */}
            <section className='p-8 sm:p-10 rounded-3xl bg-gray-900 text-white shadow-xl relative overflow-hidden'>
                <div className='absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none' />
                <div className='absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none' />

                <div className='relative z-10 space-y-8'>
                    <div>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-500/30'>
                            <span>⭐</span>
                            <span>{page.openSourceTitle}</span>
                        </div>
                        <h2 className='text-2xl sm:text-4xl font-extrabold text-white mb-3'>
                            {isVi ? "Dự án mã nguồn mở vì cộng đồng" : "100% Free & Open Source for Everyone"}
                        </h2>
                        <p className='text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl mb-4'>
                            {page.openSourceDesc1}
                        </p>
                        <p className='text-gray-400 text-xs sm:text-sm leading-relaxed max-w-3xl'>
                            {page.openSourceDesc2}
                        </p>
                    </div>

                    {/* GitHub Quick Action Box */}
                    <div className='flex flex-wrap items-center gap-4 pt-2'>
                        <a
                            href='https://github.com/xuantruongg03/anytools'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-sm hover:bg-gray-100 transition-all shadow-md'
                        >
                            <svg className='w-5 h-5 fill-current' viewBox='0 0 24 24'>
                                <path fillRule='evenodd' d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' />
                            </svg>
                            <span>GitHub xuantruongg03/anytools</span>
                        </a>

                        <a
                            href='https://github.com/xuantruongg03/anytools/fork'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-gray-200 border border-gray-700 font-semibold text-sm hover:bg-gray-700 transition-all'
                        >
                            <span>🍴</span>
                            <span>{isVi ? "Fork kho lưu trữ" : "Fork Repository"}</span>
                        </a>
                    </div>

                    {/* Step-by-Step Contribution Terminal */}
                    <div className='p-6 rounded-2xl bg-gray-950 border border-gray-800 space-y-4 text-xs sm:text-sm font-mono'>
                        <div className='flex items-center justify-between pb-3 border-b border-gray-800'>
                            <span className='font-bold text-emerald-400 font-sans text-sm sm:text-base'>
                                🤝 {page.contributeSteps.title}
                            </span>
                            <span className='text-gray-500 text-xs font-sans'>
                                git workflow
                            </span>
                        </div>

                        {/* Step 1 */}
                        <div className='space-y-1 font-sans text-gray-300'>
                            <span className='text-blue-400 font-bold'>1.</span> {page.contributeSteps.step1}
                        </div>

                        {/* Step 2 - clone */}
                        <div className='flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-gray-800'>
                            <code className='text-gray-200 truncate'>git clone https://github.com/xuantruongg03/anytools.git</code>
                            <button
                                onClick={() => handleCopy("git clone https://github.com/xuantruongg03/anytools.git", "clone")}
                                className='ml-2 shrink-0 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-sans text-xs transition-colors'
                            >
                                {copiedStep === "clone" ? "✓ Copied" : "Copy"}
                            </button>
                        </div>

                        {/* Step 3 - branch */}
                        <div className='flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-gray-800'>
                            <code className='text-gray-200 truncate'>git checkout -b feature/your-new-tool</code>
                            <button
                                onClick={() => handleCopy("git checkout -b feature/your-new-tool", "branch")}
                                className='ml-2 shrink-0 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-sans text-xs transition-colors'
                            >
                                {copiedStep === "branch" ? "✓ Copied" : "Copy"}
                            </button>
                        </div>

                        {/* Step 4 & 5 */}
                        <div className='space-y-2 font-sans text-gray-300 pt-1'>
                            <p><span className='text-blue-400 font-bold'>4.</span> {page.contributeSteps.step4}</p>
                            <p><span className='text-blue-400 font-bold'>5.</span> {page.contributeSteps.step5}</p>
                        </div>

                        {/* Step 6 - commit & push */}
                        <div className='flex items-center justify-between p-3 rounded-lg bg-gray-900 border border-gray-800'>
                            <code className='text-gray-200 truncate'>git add . && git commit -m &quot;Add: New Tool&quot; && git push origin feature/your-new-tool</code>
                            <button
                                onClick={() => handleCopy("git add . && git commit -m \"Add: New Tool\" && git push origin feature/your-new-tool", "push")}
                                className='ml-2 shrink-0 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-sans text-xs transition-colors'
                            >
                                {copiedStep === "push" ? "✓ Copied" : "Copy"}
                            </button>
                        </div>

                        <div className='font-sans text-gray-300 pt-1'>
                            <span className='text-blue-400 font-bold'>7.</span> {page.contributeSteps.step8}
                        </div>
                    </div>

                    <div className='p-4 rounded-xl bg-blue-900/30 border border-blue-800/60 text-blue-200 text-xs sm:text-sm'>
                        {page.contributeSteps.tip}
                    </div>
                </div>
            </section>

            {/* Support & Community Section */}
            <section className='grid md:grid-cols-2 gap-6'>
                {/* Donate Card */}
                <div className='p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 dark:from-pink-900/20 dark:via-rose-900/10 dark:to-purple-900/20 border border-pink-200 dark:border-pink-800/50 flex flex-col justify-between shadow-xs'>
                    <div>
                        <div className='text-3xl mb-3'>💖</div>
                        <h3 className='text-2xl font-extrabold text-gray-900 dark:text-white mb-2'>
                            {page.supportTitle}
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4'>
                            {page.supportDesc1}
                        </p>
                        <ul className='space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6'>
                            <li className='flex items-center gap-2'>
                                <span className='text-emerald-500 font-bold'>✓</span> {page.supportList.item1}
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='text-emerald-500 font-bold'>✓</span> {page.supportList.item2}
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='text-emerald-500 font-bold'>✓</span> {page.supportList.item3}
                            </li>
                            <li className='flex items-center gap-2'>
                                <span className='text-emerald-500 font-bold'>✓</span> {page.supportList.item4}
                            </li>
                        </ul>
                    </div>
                    <Link
                        href={`/${locale}/donate`}
                        className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/25 transition-all'
                    >
                        <span>☕</span>
                        <span>{page.supportButton}</span>
                    </Link>
                </div>

                {/* Contact Card */}
                <div className='p-8 rounded-3xl bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 flex flex-col justify-between shadow-xs'>
                    <div>
                        <div className='text-3xl mb-3'>📬</div>
                        <h3 className='text-2xl font-extrabold text-gray-900 dark:text-white mb-2'>
                            {page.contactTitle}
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6'>
                            {page.contactDesc}
                        </p>
                        <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/60 dark:border-gray-600/60 mb-6 space-y-2 text-xs sm:text-sm'>
                            <div className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
                                <span className='font-bold'>Email:</span>
                                <a href='mailto:lexuantruong0981@gmail.com' className='text-blue-600 dark:text-blue-400 hover:underline'>
                                    lexuantruong0981@gmail.com
                                </a>
                            </div>
                            <div className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
                                <span className='font-bold'>GitHub:</span>
                                <a href='https://github.com/xuantruongg03/anytools' target='_blank' rel='noopener noreferrer' className='text-blue-600 dark:text-blue-400 hover:underline'>
                                    github.com/xuantruongg03/anytools
                                </a>
                            </div>
                        </div>
                    </div>
                    <Link
                        href={`/${locale}/contact`}
                        className='inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all'
                    >
                        <span>✉️</span>
                        <span>{isVi ? "Gửi phản hồi / Liên hệ ngay" : "Get in Touch"}</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
