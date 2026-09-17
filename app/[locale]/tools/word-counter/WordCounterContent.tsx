"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function WordCounterContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const toolT = (t.tools as any).wordCounter;
    const ui = toolT?.ui || {};
    const page = toolT?.page || {};

    const [text, setText] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);

    const stats = useMemo(() => {
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
        const characters = text.length;
        const charsNoSpaces = text.replace(/\s/g, "").length;

        // Sentences count: split by . ! ? or \n
        const sentences = trimmed
            ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (words > 0 ? 1 : 0)
            : 0;

        // Paragraphs count: split by double newlines or single newlines with content
        const paragraphs = trimmed
            ? text.split(/\n+/).filter((p) => p.trim().length > 0).length
            : 0;

        // Lines count
        const lines = text.length > 0 ? text.split("\n").length : 0;

        // Reading time: 225 wpm
        const readMins = Math.ceil(words / 225);
        const readTimeStr = words === 0 ? "0m" : readMins < 1 ? "< 1 min" : `~${readMins} min`;

        // Speaking time: 130 wpm
        const speakMins = Math.ceil(words / 130);
        const speakTimeStr = words === 0 ? "0m" : speakMins < 1 ? "< 1 min" : `~${speakMins} min`;

        return {
            words,
            characters,
            charsNoSpaces,
            sentences,
            paragraphs,
            lines,
            readingTime: readTimeStr,
            speakingTime: speakTimeStr,
        };
    }, [text]);

    // Top keyword density
    const keywordDensity = useMemo(() => {
        if (!text.trim()) return [];

        const stopWords = new Set([
            "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from",
            "is", "are", "was", "were", "it", "this", "that", "these", "those", "i", "you", "he", "she", "we", "they",
            "và", "hoặc", "nhưng", "là", "ở", "tại", "cho", "của", "với", "từ", "các", "những", "một", "này", "đó", "thì", "mà", "được", "có"
        ]);

        const rawWords = text
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, "")
            .split(/\s+/)
            .filter((w) => w.length > 2 && !stopWords.has(w));

        const frequency: Record<string, number> = {};
        rawWords.forEach((word) => {
            frequency[word] = (frequency[word] || 0) + 1;
        });

        const totalWords = rawWords.length;
        if (totalWords === 0) return [];

        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([word, count]) => ({
                word,
                count,
                percentage: ((count / totalWords) * 100).toFixed(1),
            }));
    }, [text]);

    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLoadSample = () => {
        const sampleEn =
            "AnyTools is a suite of fast, privacy-friendly online utilities created for developers, designers, and creators.\n\nAll tools run directly in your web browser with zero server latency. You can format JSON, convert CSS units, generate safe passwords, test regular expressions, and inspect cron expressions without worrying about data tracking.\n\nSimplicity, speed, and modern design make AnyTools your daily go-to web companion.";
        const sampleVi =
            "AnyTools là bộ công cụ trực tuyến tiện lợi, tốc độ cao và bảo mật dành cho lập trình viên, designer và người sáng tạo nội dung.\n\nTất cả các công cụ đều được xử lý trực tiếp ngay trong trình duyệt của bạn với độ trễ bằng 0. Bạn có thể định dạng JSON, chuyển đổi đơn vị CSS, tạo mật khẩu an toàn, kiểm tra regex và phân tích lịch cron mà không lo bị thu thập dữ liệu.\n\nĐơn giản, mượt mà và giao diện hiện đại là tiêu chí hàng đầu của AnyTools.";

        setText(locale === "vi" ? sampleVi : sampleEn);
    };

    return (
        <div className='space-y-8 max-w-5xl mx-auto'>
            {/* Quick KPI Stat Bar */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                <div className='p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-900/30 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/60 rounded-2xl text-center shadow-sm'>
                    <div className='text-3xl md:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono'>
                        {stats.words.toLocaleString()}
                    </div>
                    <div className='text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-gray-300 mt-1'>
                        {ui.stats?.words || "Words"}
                    </div>
                </div>

                <div className='p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-900/30 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800/60 rounded-2xl text-center shadow-sm'>
                    <div className='text-3xl md:text-4xl font-extrabold text-purple-600 dark:text-purple-400 font-mono'>
                        {stats.characters.toLocaleString()}
                    </div>
                    <div className='text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-gray-300 mt-1'>
                        {ui.stats?.characters || "Characters"}
                    </div>
                </div>

                <div className='p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/30 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-center shadow-sm'>
                    <div className='text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono'>
                        {stats.sentences.toLocaleString()}
                    </div>
                    <div className='text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-gray-300 mt-1'>
                        {ui.stats?.sentences || "Sentences"}
                    </div>
                </div>

                <div className='p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-900/30 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-center shadow-sm'>
                    <div className='text-3xl md:text-4xl font-extrabold text-amber-600 dark:text-amber-400 font-mono'>
                        {stats.readingTime}
                    </div>
                    <div className='text-xs uppercase tracking-wider font-semibold text-gray-600 dark:text-gray-300 mt-1'>
                        {ui.stats?.readingTime || "Reading Time"}
                    </div>
                </div>
            </div>

            {/* Main Textarea Card */}
            <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl'>
                <div className='flex items-center justify-between mb-3 flex-wrap gap-2'>
                    <div className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                        {locale === "vi" ? "Nội dung phân tích" : "Text Content"}
                    </div>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={handleLoadSample}
                            className='px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors cursor-pointer'
                        >
                            {ui.sampleText || "Load Sample"}
                        </button>
                        <button
                            onClick={() => setText("")}
                            className='px-3 py-1 text-xs font-medium bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors cursor-pointer'
                        >
                            {ui.clear || "Clear"}
                        </button>
                        <button
                            onClick={handleCopy}
                            className='px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors cursor-pointer'
                        >
                            {copied ? (ui.copied || "Copied!") : (ui.copy || "Copy")}
                        </button>
                    </div>
                </div>

                <textarea
                    rows={10}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={ui.textareaPlaceholder || "Type or paste your text here..."}
                    className='w-full p-4 font-mono text-base bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white leading-relaxed resize-y'
                />

                {/* Detailed Secondary Metrics */}
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs text-gray-600 dark:text-gray-400'>
                    <div>
                        <span className='font-semibold'>{ui.stats?.charsNoSpaces || "No Spaces"}:</span>{" "}
                        <span className='font-mono font-bold text-gray-900 dark:text-white'>{stats.charsNoSpaces}</span>
                    </div>
                    <div>
                        <span className='font-semibold'>{ui.stats?.paragraphs || "Paragraphs"}:</span>{" "}
                        <span className='font-mono font-bold text-gray-900 dark:text-white'>{stats.paragraphs}</span>
                    </div>
                    <div>
                        <span className='font-semibold'>{ui.stats?.lines || "Lines"}:</span>{" "}
                        <span className='font-mono font-bold text-gray-900 dark:text-white'>{stats.lines}</span>
                    </div>
                    <div>
                        <span className='font-semibold'>{ui.stats?.speakingTime || "Speaking"}:</span>{" "}
                        <span className='font-mono font-bold text-gray-900 dark:text-white'>{stats.speakingTime}</span>
                    </div>
                </div>
            </Card>

            {/* Keyword Density Analysis */}
            <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md border border-gray-200 dark:border-gray-700 rounded-2xl'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                    <span>🔍</span> {ui.densityTitle || "Top Keyword Density"}
                </h3>

                {keywordDensity.length > 0 ? (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
                        {keywordDensity.map((item) => (
                            <div
                                key={item.word}
                                className='p-3 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-between'
                            >
                                <div className='font-medium text-gray-900 dark:text-white truncate mr-2 font-mono text-sm'>
                                    {item.word}
                                </div>
                                <div className='text-right shrink-0'>
                                    <span className='text-xs font-bold text-blue-600 dark:text-blue-400'>{item.count}x</span>
                                    <span className='text-xs text-gray-400 ml-1'>({item.percentage}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-sm text-gray-500 dark:text-gray-400 italic'>
                        {ui.noKeywords || "Type some text to see keyword density."}
                    </p>
                )}
            </Card>

            {/* SEO Content & FAQ Section */}
            {page.whatIs && (
                <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                    <section className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.whatIs}</h2>
                        <p className='leading-relaxed mb-6'>{page.whatIsDesc}</p>

                        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                            {locale === "vi" ? "Tính Năng Nổi Bật" : "Key Features"}
                        </h3>
                        <ul className='list-disc pl-5 space-y-2 text-sm leading-relaxed'>
                            {Object.values(page.features || {}).map((feat: any, idx: number) => (
                                <li key={idx}>{feat}</li>
                            ))}
                        </ul>
                    </section>

                    {/* FAQ */}
                    {page.faq && (
                        <section className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                                {locale === "vi" ? "Câu Hỏi Thường Gặp" : "Frequently Asked Questions"}
                            </h2>
                            <div className='space-y-4'>
                                {[1, 2, 3].map((i) => {
                                    const q = page.faq[`q${i}`];
                                    const a = page.faq[`a${i}`];
                                    if (!q) return null;
                                    return (
                                        <details key={i} className='group border border-gray-200 dark:border-gray-700 rounded-xl p-4 open:bg-gray-50 dark:open:bg-gray-900/50 transition-colors'>
                                            <summary className='font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between'>
                                                <span>{q}</span>
                                                <span className='transition group-open:rotate-180 text-gray-400'>▼</span>
                                            </summary>
                                            <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>{a}</p>
                                        </details>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
