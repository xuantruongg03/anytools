"use client";

import { useState, useMemo, useRef } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { markdownToPdfTranslations } from "@/lib/i18n/tools/markdown-to-pdf";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { toast } from "@/components/ui/Toast";

const SAMPLE_DOCS = `# Project Architecture & API Guide

Welcome to the **AnyTools Project Documentation**. This document outlines the core technical architecture, API standards, and coding conventions.

---

## 1. System Overview

AnyTools is a next-generation suite of web development utilities designed for:
- **Maximum Privacy**: 100% Client-side execution without external telemetry.
- **High Performance**: Built on Next.js 16 and modern Web APIs.
- **Internationalization**: Full bilingual English and Vietnamese coverage.

### Core Feature Comparison
| Feature | Legacy Tools | AnyTools |
| :--- | :--- | :--- |
| **Server Uploads** | Required | **Zero (Client-side)** |
| **Mobile UX** | Poor | **Responsive & Touch-first** |
| **Offline Support** | No | **Yes (PWA ready)** |

---

## 2. Code Sample

\`\`\`typescript
export async function calculateMetrics(data: number[]): Promise<MetricResult> {
    const sum = data.reduce((acc, val) => acc + val, 0);
    const avg = sum / (data.length || 1);
    return { sum, avg, count: data.length };
}
\`\`\`

> **Note**: Always ensure that audio contexts and media streams are properly disposed upon component unmount to prevent memory leaks.

### Checklist
- [x] Web Audio API Integration
- [x] Client-side GIF89a LZW encoding
- [x] Responsive layout optimization
`;

function getThemeCss(theme: "github" | "academic" | "minimal"): string {
    const baseCss = `
        body { font-size: 14px; line-height: 1.6; color: #24292f; }
        h1, h2, h3, h4 { font-weight: 700; margin-top: 24px; margin-bottom: 12px; }
        h1 { font-size: 28px; border-bottom: 1px solid #d0d7de; padding-bottom: 8px; }
        h2 { font-size: 20px; border-bottom: 1px solid #d0d7de; padding-bottom: 6px; }
        h3 { font-size: 16px; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { border: 1px solid #d0d7de; padding: 8px 12px; text-align: left; }
        th { background-color: #f6f8fa; font-weight: 600; }
        blockquote { margin: 16px 0; padding: 0 16px; color: #57601a; border-left: 4px solid #d0d7de; }
        code { font-family: monospace; background: #f6f8fa; padding: 2px 4px; border-radius: 4px; font-size: 85%; }
        pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
        pre code { background: transparent; padding: 0; }
        ul, ol { padding-left: 24px; }
        li { margin-bottom: 4px; }
    `;

    if (theme === "academic") {
        return `
            body { font-family: "Times New Roman", Times, Georgia, serif; font-size: 13pt; line-height: 1.8; color: #111; }
            h1, h2, h3 { font-family: "Times New Roman", Times, serif; text-align: center; }
            h1 { font-size: 20pt; border-bottom: none; margin-bottom: 24px; }
            h2 { font-size: 15pt; border-bottom: none; text-align: left; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; border-top: 2px solid #000; border-bottom: 2px solid #000; }
            th, td { border: none; border-bottom: 1px solid #ddd; padding: 8px; font-size: 11pt; }
            th { border-bottom: 1.5px solid #000; background: none; }
            blockquote { font-style: italic; border-left: 2px solid #333; margin: 18px 0; }
        `;
    }

    if (theme === "minimal") {
        return `
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #1e293b; }
            h1, h2, h3 { font-weight: 800; letter-spacing: -0.02em; }
            h1 { font-size: 26px; border: none; }
            h2 { font-size: 19px; border: none; }
            table { border-collapse: separate; border-spacing: 0; width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 10px 14px; }
            th { background: #f8fafc; color: #475569; }
            pre { background: #0f172a; color: #38bdf8; border-radius: 12px; padding: 16px; }
            pre code { color: inherit; }
        `;
    }

    return `body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; } ${baseCss}`;
}

export default function MarkdownToPdfContent() {
    const { locale } = useLanguage();
    const t = markdownToPdfTranslations[locale as "en" | "vi"] || markdownToPdfTranslations.en;

    const [markdownText, setMarkdownText] = useState<string>(SAMPLE_DOCS);
    const [theme, setTheme] = useState<"github" | "academic" | "minimal">("github");

    // Render HTML
    const renderedHtml = useMemo(() => {
        if (!markdownText) return "";
        try {
            const raw = marked.parse(markdownText) as string;
            return DOMPurify.sanitize(raw);
        } catch (e) {
            return "<p>Error parsing markdown</p>";
        }
    }, [markdownText]);

    // Print / Vector PDF
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const css = getThemeCss(theme);

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Document</title>
                <style>
                    ${css}
                    @page {
                        size: A4;
                        margin: 20mm 15mm 20mm 15mm;
                    }
                    @media print {
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="content-wrapper">
                    ${renderedHtml}
                </div>
                <script>
                    window.onload = function() {
                        window.focus();
                        window.print();
                        setTimeout(function() { window.close(); }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleCopyHtml = () => {
        navigator.clipboard.writeText(renderedHtml);
        toast.success(t.copied);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-6xl mx-auto space-y-6'>
            {/* Top Toolbar */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center gap-3 text-xs'>
                    {/* Theme Selector */}
                    <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>🎨 {t.themeLabel}:</span>
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value as any)}
                            className='px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer'
                        >
                            <option value='github'>{t.themeGithub}</option>
                            <option value='academic'>{t.themeAcademic}</option>
                            <option value='minimal'>{t.themeMinimal}</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setMarkdownText(SAMPLE_DOCS)}
                        className='px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 cursor-pointer border border-gray-200 dark:border-gray-700'
                    >
                        ⚡ {t.presets}
                    </button>
                </div>

                <div className='flex items-center gap-2'>
                    <Button
                        onClick={handleCopyHtml}
                        variant='secondary'
                        size='sm'
                        className='cursor-pointer text-xs font-bold'
                    >
                        📋 {t.copyHtml}
                    </Button>

                    <Button
                        onClick={handlePrint}
                        variant='primary'
                        size='md'
                        className='cursor-pointer text-xs font-bold shadow-md'
                    >
                        🖨️ {t.printPdf}
                    </Button>
                </div>
            </div>

            {/* Dual Split Editor & Live Print Preview */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {/* Left: Markdown Editor */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                            <span>📝</span> {t.editorLabel}
                        </span>
                        {markdownText && (
                            <button
                                onClick={() => setMarkdownText("")}
                                className='text-xs font-semibold text-gray-400 hover:text-red-500 cursor-pointer'
                            >
                                ✕ {t.clear}
                            </button>
                        )}
                    </div>
                    <textarea
                        value={markdownText}
                        onChange={(e) => setMarkdownText(e.target.value)}
                        placeholder='Type your markdown here...'
                        rows={22}
                        className='w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed'
                    />
                </div>

                {/* Right: Live Formatted Preview */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2'>
                            <span>📄</span> {t.previewLabel}
                        </span>
                        <span className='text-[10px] font-mono text-gray-400 capitalize'>
                            {theme} Theme
                        </span>
                    </div>

                    <div className='w-full p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 max-h-[500px] overflow-y-auto shadow-inner text-gray-900 dark:text-gray-100'>
                        <div
                            dangerouslySetInnerHTML={{ __html: renderedHtml }}
                            className='prose dark:prose-invert max-w-none text-xs sm:text-sm'
                        />
                    </div>
                </div>
            </div>

            {/* SEO & Guide */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>💡</span> {t.guideTitle}
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>1. {t.guide1Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide1Desc}</p>
                    </div>

                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>2. {t.guide2Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide2Desc}</p>
                    </div>

                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>3. {t.guide3Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
