"use client";

import { useState, useRef, useId } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { socialPostTranslations } from "@/lib/i18n/tools/social-post-generator";
import { toast } from "@/components/ui/Toast";

type Platform = "twitter" | "threads" | "linkedin";
type Theme = "light" | "dim" | "dark";
type VerifiedType = "none" | "blue" | "gold";

export default function SocialPostGeneratorContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = socialPostTranslations[locale];

    const [platform, setPlatform] = useState<Platform>("twitter");
    const [theme, setTheme] = useState<Theme>("dark");
    const [name, setName] = useState<string>("Alex Rivera");
    const [handle, setHandle] = useState<string>("alexrivera_dev");
    const [verified, setVerified] = useState<VerifiedType>("blue");
    const [avatarText, setAvatarText] = useState<string>("⚡");
    const [postText, setPostText] = useState<string>(
        "Just shipped our new web tools suite! 🚀 Over 20+ utilities running 100% client-side in the browser. Zero servers, zero data tracking, pure developer bliss. #buildinpublic #webdev"
    );
    const [timestamp, setTimestamp] = useState<string>("10:24 AM · Sep 23, 2026");
    const [replies, setReplies] = useState<string>("142");
    const [reposts, setReposts] = useState<string>("896");
    const [likes, setLikes] = useState<string>("4.8K");
    const [views, setViews] = useState<string>("128.4K");

    const mockupRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Theme style mapping
    const themeStyles = {
        light: {
            bg: "bg-white",
            text: "text-gray-900",
            subText: "text-gray-500",
            border: "border-gray-200",
            icon: "text-gray-500",
            canvasBg: "#ffffff",
            canvasText: "#0f1419",
            canvasSubText: "#536471",
            canvasBorder: "#eff3f4",
        },
        dim: {
            bg: "bg-[#15202b]",
            text: "text-gray-100",
            subText: "text-gray-400",
            border: "border-[#38444d]",
            icon: "text-gray-400",
            canvasBg: "#15202b",
            canvasText: "#f7f9f9",
            canvasSubText: "#8b98a5",
            canvasBorder: "#38444d",
        },
        dark: {
            bg: "bg-black",
            text: "text-white",
            subText: "text-gray-500",
            border: "border-gray-800",
            icon: "text-gray-500",
            canvasBg: "#000000",
            canvasText: "#e7e9ea",
            canvasSubText: "#71767b",
            canvasBorder: "#2f3336",
        },
    };

    const currentTheme = themeStyles[theme];

    // High-Resolution 2X Canvas Exporter
    const handleExportPng = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const scale = 2; // Retina 2x
        const width = 640;
        const padding = 32;

        // Calculate text lines for post text
        ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
        const maxTextWidth = width - padding * 2;
        const words = postText.split(" ");
        const lines: string[] = [];
        let currentLine = "";

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxTextWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);

        const lineHeight = 24;
        const contentHeight = lines.length * lineHeight;
        const totalHeight = padding * 2 + 60 + contentHeight + 40 + 40;

        canvas.width = width * scale;
        canvas.height = totalHeight * scale;

        ctx.save();
        ctx.scale(scale, scale);

        // Draw Card Background
        ctx.fillStyle = currentTheme.canvasBg;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(0, 0, width, totalHeight, 20);
        } else {
            ctx.rect(0, 0, width, totalHeight);
        }
        ctx.fill();

        // Border
        ctx.strokeStyle = currentTheme.canvasBorder;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 1. Draw Avatar Circle
        const avatarX = padding;
        const avatarY = padding;
        const avatarRadius = 22;
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.arc(avatarX + avatarRadius, avatarY + avatarRadius, avatarRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(avatarText, avatarX + avatarRadius, avatarY + avatarRadius);

        // 2. Draw Name, Handle & Verified Badge
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = currentTheme.canvasText;
        ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(name, avatarX + 54, avatarY + 3);

        const nameWidth = ctx.measureText(name).width;

        if (verified !== "none") {
            ctx.fillStyle = verified === "gold" ? "#eab308" : "#3b82f6";
            ctx.beginPath();
            ctx.arc(avatarX + 54 + nameWidth + 12, avatarY + 11, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 9px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("✓", avatarX + 54 + nameWidth + 12, avatarY + 11);
        }

        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = currentTheme.canvasSubText;
        ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillText(`@${handle}`, avatarX + 54, avatarY + 25);

        // Platform logo watermark in top right
        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = currentTheme.canvasSubText;
        ctx.textAlign = "right";
        ctx.fillText(platform === "twitter" ? "𝕏" : platform === "threads" ? "@" : "in", width - padding, avatarY + 4);

        // 3. Draw Post Text
        let textY = avatarY + 56;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.font = "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

        for (const line of lines) {
            // Highlight hashtags or mentions
            ctx.fillStyle = currentTheme.canvasText;
            ctx.fillText(line, padding, textY);
            textY += lineHeight;
        }

        // 4. Timestamp
        textY += 12;
        ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillStyle = currentTheme.canvasSubText;
        ctx.fillText(`${timestamp} · AnyTools Web Client`, padding, textY);

        // Divider
        textY += 24;
        ctx.strokeStyle = currentTheme.canvasBorder;
        ctx.beginPath();
        ctx.moveTo(padding, textY);
        ctx.lineTo(width - padding, textY);
        ctx.stroke();

        // 5. Metrics
        textY += 14;
        const metricsStr = `💬 ${replies}   🔁 ${reposts}   ❤️ ${likes}   📊 ${views}`;
        ctx.font = "13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillStyle = currentTheme.canvasSubText;
        ctx.fillText(metricsStr, padding, textY);

        ctx.restore();

        // Convert to Download
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${platform}-mockup-${Date.now()}.png`;
        a.click();
        toast.success(t.exported);
    };

    return (
        <div className='max-w-6xl mx-auto space-y-8'>
            {/* Header info */}
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3'>
                    <span>📱</span> {t.name}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                    {t.description}
                </p>
            </div>

            {/* Hidden export canvas */}
            <canvas ref={canvasRef} className='hidden' />

            {/* Platform & Theme Switcher Bar */}
            <div className='flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
                {/* Platform tabs */}
                <div className='flex items-center gap-1.5'>
                    {[
                        { id: "twitter", label: t.tabTwitter, icon: "𝕏" },
                        { id: "threads", label: t.tabThreads, icon: "@" },
                        { id: "linkedin", label: t.tabLinkedIn, icon: "💼" },
                    ].map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setPlatform(p.id as Platform)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                platform === p.id
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                            <span>{p.icon}</span>
                            <span>{p.label}</span>
                        </button>
                    ))}
                </div>

                {/* Theme tabs */}
                <div className='flex items-center gap-1.5'>
                    {[
                        { id: "light", label: t.themeLight, icon: "☀️" },
                        { id: "dim", label: t.themeDim, icon: "🌌" },
                        { id: "dark", label: t.themeDark, icon: "🌑" },
                    ].map((th) => (
                        <button
                            key={th.id}
                            onClick={() => setTheme(th.id as Theme)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                theme === th.id
                                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                            }`}
                        >
                            <span>{th.icon}</span>
                            <span>{th.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Studio Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
                {/* Controls Column */}
                <div className='lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-5'>
                    {/* Author Details */}
                    <div className='space-y-3'>
                        <h2 className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2'>
                            {t.authorTitle}
                        </h2>

                        <div className='grid grid-cols-2 gap-3'>
                            <div className='space-y-1'>
                                <label className='text-xs font-semibold text-gray-700 dark:text-gray-300'>{t.nameLabel}</label>
                                <input
                                    type='text'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-gray-100'
                                />
                            </div>

                            <div className='space-y-1'>
                                <label className='text-xs font-semibold text-gray-700 dark:text-gray-300'>{t.handleLabel}</label>
                                <div className='flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5'>
                                    <span className='text-gray-400 text-xs font-mono'>@</span>
                                    <input
                                        type='text'
                                        value={handle}
                                        onChange={(e) => setHandle(e.target.value)}
                                        className='w-full bg-transparent border-none text-xs font-mono font-semibold text-gray-900 dark:text-gray-100 focus:outline-none pl-1'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-3 pt-1'>
                            <div className='space-y-1'>
                                <label className='text-xs font-semibold text-gray-700 dark:text-gray-300'>{t.avatarLabel}</label>
                                <input
                                    type='text'
                                    value={avatarText}
                                    onChange={(e) => setAvatarText(e.target.value)}
                                    maxLength={4}
                                    className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-center'
                                />
                            </div>

                            <div className='space-y-1'>
                                <label className='text-xs font-semibold text-gray-700 dark:text-gray-300'>{t.verifiedLabel}</label>
                                <select
                                    value={verified}
                                    onChange={(e) => setVerified(e.target.value as VerifiedType)}
                                    className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold cursor-pointer'
                                >
                                    <option value='none'>{t.verifiedNone}</option>
                                    <option value='blue'>✓ {t.verifiedBlue}</option>
                                    <option value='gold'>✓ {t.verifiedGold}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className='space-y-3 pt-2'>
                        <h2 className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2'>
                            {t.contentTitle}
                        </h2>

                        <div className='space-y-1'>
                            <div className='flex justify-between text-xs'>
                                <label className='font-semibold text-gray-700 dark:text-gray-300'>{t.postTextLabel}</label>
                                <span className='text-gray-400 font-mono'>{postText.length} chars</span>
                            </div>
                            <textarea
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                rows={4}
                                placeholder={t.postTextPlaceholder}
                                className='w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs leading-relaxed text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>

                        <div className='space-y-1'>
                            <label className='text-xs font-semibold text-gray-700 dark:text-gray-300'>{t.timeLabel}</label>
                            <input
                                type='text'
                                value={timestamp}
                                onChange={(e) => setTimestamp(e.target.value)}
                                className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono'
                            />
                        </div>
                    </div>

                    {/* Metrics Controls */}
                    <div className='space-y-3 pt-2'>
                        <h2 className='text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2'>
                            Metrics & Engagement
                        </h2>

                        <div className='grid grid-cols-2 gap-3'>
                            <div className='space-y-1'>
                                <label className='text-xs text-gray-600 dark:text-gray-400'>{t.likesLabel}</label>
                                <input
                                    type='text'
                                    value={likes}
                                    onChange={(e) => setLikes(e.target.value)}
                                    className='w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-semibold'
                                />
                            </div>

                            <div className='space-y-1'>
                                <label className='text-xs text-gray-600 dark:text-gray-400'>{t.retweetsLabel}</label>
                                <input
                                    type='text'
                                    value={reposts}
                                    onChange={(e) => setReposts(e.target.value)}
                                    className='w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-semibold'
                                />
                            </div>

                            <div className='space-y-1'>
                                <label className='text-xs text-gray-600 dark:text-gray-400'>{t.repliesLabel}</label>
                                <input
                                    type='text'
                                    value={replies}
                                    onChange={(e) => setReplies(e.target.value)}
                                    className='w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-semibold'
                                />
                            </div>

                            <div className='space-y-1'>
                                <label className='text-xs text-gray-600 dark:text-gray-400'>{t.viewsLabel}</label>
                                <input
                                    type='text'
                                    value={views}
                                    onChange={(e) => setViews(e.target.value)}
                                    className='w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono font-semibold'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Mockup Column */}
                <div className='lg:col-span-7 space-y-6'>
                    {/* Preview wrapper */}
                    <div className='bg-gray-100 dark:bg-gray-900/60 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center min-h-[440px]'>
                        {/* THE MOCKUP CARD */}
                        <div
                            ref={mockupRef}
                            className={`w-full max-w-lg rounded-2xl p-6 border shadow-xl transition-all duration-200 ${currentTheme.bg} ${currentTheme.border} ${currentTheme.text}`}
                        >
                            {/* Author Row */}
                            <div className='flex items-start justify-between mb-3'>
                                <div className='flex items-center gap-3'>
                                    {/* Avatar */}
                                    <div className='w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md'>
                                        {avatarText}
                                    </div>
                                    <div className='min-w-0'>
                                        <div className='flex items-center gap-1.5 flex-wrap'>
                                            <span className='font-bold text-sm tracking-tight truncate'>
                                                {name}
                                            </span>
                                            {verified === "blue" && (
                                                <svg className='w-4 h-4 text-blue-500 fill-current' viewBox='0 0 24 24'>
                                                    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
                                                </svg>
                                            )}
                                            {verified === "gold" && (
                                                <svg className='w-4 h-4 text-yellow-500 fill-current' viewBox='0 0 24 24'>
                                                    <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
                                                </svg>
                                            )}
                                        </div>
                                        <div className={`text-xs ${currentTheme.subText} font-mono`}>
                                            @{handle}
                                        </div>
                                    </div>
                                </div>

                                {/* Platform Logo */}
                                <div className={`text-base font-black ${currentTheme.subText}`}>
                                    {platform === "twitter" && "𝕏"}
                                    {platform === "threads" && "@"}
                                    {platform === "linkedin" && "in"}
                                </div>
                            </div>

                            {/* Post Text */}
                            <p className='text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words mb-4 font-normal'>
                                {postText}
                            </p>

                            {/* Timestamp & Client */}
                            <div className={`text-xs ${currentTheme.subText} pb-3 border-b ${currentTheme.border}`}>
                                {timestamp} · <span className='hover:underline cursor-pointer'>AnyTools Web Client</span>
                            </div>

                            {/* Metrics Row */}
                            <div className={`flex items-center justify-between pt-3 text-xs ${currentTheme.subText}`}>
                                <div className='flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer'>
                                    <span>💬</span>
                                    <span>{replies}</span>
                                </div>
                                <div className='flex items-center gap-1.5 hover:text-emerald-500 transition-colors cursor-pointer'>
                                    <span>🔁</span>
                                    <span>{reposts}</span>
                                </div>
                                <div className='flex items-center gap-1.5 hover:text-pink-500 transition-colors cursor-pointer'>
                                    <span>❤️</span>
                                    <span>{likes}</span>
                                </div>
                                <div className='flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer'>
                                    <span>📊</span>
                                    <span>{views}</span>
                                </div>
                                <div className='flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer'>
                                    <span>🔖</span>
                                </div>
                            </div>
                        </div>

                        {/* Export Action Button */}
                        <div className='mt-6 flex items-center gap-3'>
                            <button
                                onClick={handleExportPng}
                                className='flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer'
                            >
                                <span>📥</span> {t.exportPng}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guide Section */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <h2 className='text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <span>📖</span> {t.guideTitle}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-blue-600 dark:text-blue-400'>{t.guide1Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-indigo-600 dark:text-indigo-400'>{t.guide2Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-emerald-600 dark:text-emerald-400'>{t.guide3Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <span>❓</span> {t.faqTitle}
                </h3>
                <div className='space-y-3 text-xs'>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq1Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq1A}</p>
                    </div>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq2Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq2A}</p>
                    </div>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq3Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq3A}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
