"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { metaTagsPreviewTranslations } from "@/lib/i18n/tools/meta-tags-preview";
import { toast } from "@/components/ui/Toast";

type PlatformTab = "facebook" | "twitter" | "google" | "zalo";

export default function MetaTagsPreviewContent() {
    const { locale } = useLanguage();
    const t = metaTagsPreviewTranslations[locale as "en" | "vi"] || metaTagsPreviewTranslations.en;
    const isVi = locale === "vi";

    const [activePlatform, setActivePlatform] = useState<PlatformTab>("facebook");

    // Inputs
    const [title, setTitle] = useState<string>("AnyTools — Kho Công Cụ Tiện Ích Trực Tuyến Miễn Phí");
    const [description, setDescription] = useState<string>(
        "Hơn 70+ công cụ tiện ích trực tuyến mạnh mẽ, bảo mật dữ liệu tuyệt đối và chạy 100% trong trình duyệt. Không cần cài đặt, miễn phí mãi mãi."
    );
    const [url, setUrl] = useState<string>("https://anytools.online");
    const [image, setImage] = useState<string>("https://anytools.online/og-image.jpg");
    const [siteName, setSiteName] = useState<string>("AnyTools");

    // Get domain from URL
    const domain = (() => {
        try {
            const parsed = new URL(url);
            return parsed.hostname.replace("www.", "");
        } catch {
            return "anytools.online";
        }
    })();

    // Generated HTML code
    const generatedHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${image}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />
<meta property="twitter:image" content="${image}" />`;

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedHtml);
        toast.success(t.copied);
    };

    const handleLoadSample = () => {
        setTitle(isVi ? "AnyTools — Kho Công Cụ Tiện Ích Trực Tuyến Miễn Phí" : "AnyTools — Free Online Developer & Productivity Tools");
        setDescription(
            isVi
                ? "Hơn 70+ công cụ tiện ích trực tuyến mạnh mẽ, bảo mật dữ liệu tuyệt đối và chạy 100% trong trình duyệt. Không cần cài đặt, miễn phí mãi mãi."
                : "Over 70+ powerful, privacy-friendly online developer and utility tools that run 100% locally in your browser. Instant, secure, and completely free."
        );
        setUrl("https://anytools.online");
        setImage("https://anytools.online/og-image.jpg");
        setSiteName("AnyTools");
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Main 2-Column Studio Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 w-full'>
                {/* Form Input Column */}
                <div className='lg:col-span-5 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                    <div className='flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800'>
                        <h3 className='font-bold text-base text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>⚙️</span>
                            <span>{isVi ? "Nhập Thông Tin Thẻ" : "Meta Information"}</span>
                        </h3>
                        <button
                            type='button'
                            onClick={handleLoadSample}
                            className='text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                        >
                            📋 {t.loadSample}
                        </button>
                    </div>

                    <div>
                        <div className='flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                            <span>{t.inputTitle}</span>
                            <span className='font-mono text-gray-400'>{title.length}/60</span>
                        </div>
                        <input
                            type='text'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t.inputTitlePlaceholder}
                            className='w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-sans text-gray-900 dark:text-white'
                        />
                    </div>

                    <div>
                        <div className='flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                            <span>{t.inputDesc}</span>
                            <span className='font-mono text-gray-400'>{description.length}/160</span>
                        </div>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t.inputDescPlaceholder}
                            className='w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-sans text-gray-900 dark:text-white leading-relaxed'
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                            {t.inputUrl}
                        </label>
                        <input
                            type='text'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder={t.inputUrlPlaceholder}
                            className='w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-gray-900 dark:text-white'
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                            {t.inputImage}
                        </label>
                        <input
                            type='text'
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder={t.inputImagePlaceholder}
                            className='w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-gray-900 dark:text-white'
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                            {t.inputSiteName}
                        </label>
                        <input
                            type='text'
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            placeholder={t.inputSiteNamePlaceholder}
                            className='w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-sans text-gray-900 dark:text-white'
                        />
                    </div>
                </div>

                {/* Live Preview Column */}
                <div className='lg:col-span-7 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                    <div className='flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 flex-wrap gap-2'>
                        <h3 className='font-bold text-base text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>👁️</span>
                            <span>{isVi ? "Xem Trước Thực Tế" : "Live Social Preview"}</span>
                        </h3>

                        {/* Platform Selector Tabs */}
                        <div className='flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold'>
                            <button
                                type='button'
                                onClick={() => setActivePlatform("facebook")}
                                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                    activePlatform === "facebook" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-2xs" : "text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                Facebook
                            </button>
                            <button
                                type='button'
                                onClick={() => setActivePlatform("twitter")}
                                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                    activePlatform === "twitter" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-2xs" : "text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                X (Twitter)
                            </button>
                            <button
                                type='button'
                                onClick={() => setActivePlatform("google")}
                                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                    activePlatform === "google" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-2xs" : "text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                Google
                            </button>
                        </div>
                    </div>

                    {/* Facebook Mockup */}
                    {activePlatform === "facebook" && (
                        <div className='p-4 bg-slate-100 dark:bg-gray-800/60 rounded-2xl'>
                            <div className='bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm max-w-lg mx-auto'>
                                <div className='aspect-[1.91/1] w-full bg-slate-200 dark:bg-gray-800 relative overflow-hidden flex items-center justify-center text-gray-400'>
                                    {image ? (
                                        <img src={image} alt='OG Preview' className='w-full h-full object-cover' onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                    ) : (
                                        <span>1200 x 630 px</span>
                                    )}
                                </div>
                                <div className='p-3 bg-gray-50 dark:bg-gray-850 border-t border-gray-100 dark:border-gray-800'>
                                    <div className='text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate'>
                                        {domain}
                                    </div>
                                    <div className='text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mt-0.5'>
                                        {title || "Page Title"}
                                    </div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5'>
                                        {description || "Page Description"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Twitter / X Mockup */}
                    {activePlatform === "twitter" && (
                        <div className='p-4 bg-slate-100 dark:bg-gray-800/60 rounded-2xl'>
                            <div className='bg-white dark:bg-black rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm max-w-lg mx-auto'>
                                <div className='aspect-[1.91/1] w-full bg-slate-200 dark:bg-gray-900 relative overflow-hidden flex items-center justify-center text-gray-400'>
                                    {image ? (
                                        <img src={image} alt='Twitter Preview' className='w-full h-full object-cover' onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                                    ) : (
                                        <span>1200 x 628 px</span>
                                    )}
                                </div>
                                <div className='p-3.5 bg-white dark:bg-black'>
                                    <div className='text-xs text-gray-500 truncate'>
                                        {domain}
                                    </div>
                                    <div className='text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mt-0.5'>
                                        {title || "Page Title"}
                                    </div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5'>
                                        {description || "Page Description"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Google SERP Mockup */}
                    {activePlatform === "google" && (
                        <div className='p-6 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 max-w-lg mx-auto'>
                            <div className='flex items-center gap-3 mb-1'>
                                <div className='w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-blue-600'>
                                    🌐
                                </div>
                                <div>
                                    <div className='text-xs font-medium text-gray-900 dark:text-gray-200 leading-none'>
                                        {siteName || domain}
                                    </div>
                                    <div className='text-[11px] text-gray-500 truncate mt-0.5'>
                                        {url}
                                    </div>
                                </div>
                            </div>
                            <div className='text-lg text-blue-800 dark:text-blue-400 font-medium hover:underline cursor-pointer line-clamp-1 mt-1'>
                                {title || "Page Title"}
                            </div>
                            <div className='text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1 leading-relaxed'>
                                {description || "Page description..."}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Generated HTML Code Box */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                <div className='flex items-center justify-between flex-wrap gap-2'>
                    <h3 className='font-bold text-base text-gray-900 dark:text-white flex items-center gap-2'>
                        <span>💻</span>
                        <span>{t.generateHtml}</span>
                    </h3>
                    <Button onClick={handleCopy} variant='primary' size='sm' className='font-bold cursor-pointer'>
                        📋 {t.copyCode}
                    </Button>
                </div>

                <div className='p-4 bg-gray-900 rounded-xl overflow-x-auto text-xs font-mono text-emerald-400 border border-gray-800'>
                    <pre>{generatedHtml}</pre>
                </div>
            </div>
        </div>
    );
}
