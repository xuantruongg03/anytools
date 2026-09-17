"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface UnitValues {
    px: number;
    rem: number;
    em: number;
    pt: number;
    percent: number;
    vw: number;
    vh: number;
}

export default function CssUnitConverterContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const toolT = (t.tools as any).cssUnitConverter;
    const ui = toolT?.ui || {};
    const page = toolT?.page || {};

    const [pxInput, setPxInput] = useState<string>("16");
    const [baseSizeInput, setBaseSizeInput] = useState<string>("16");
    const [viewportWidth, setViewportWidth] = useState<number>(1920);
    const [viewportHeight, setViewportHeight] = useState<number>(1080);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const baseSize = parseFloat(baseSizeInput) || 16;
    const pxValue = parseFloat(pxInput) || 0;

    const units: UnitValues = useMemo(() => {
        const rem = baseSize > 0 ? pxValue / baseSize : 0;
        const em = rem; // Standard parent context
        const pt = pxValue * 0.75;
        const percent = baseSize > 0 ? (pxValue / baseSize) * 100 : 0;
        const vw = viewportWidth > 0 ? (pxValue / viewportWidth) * 100 : 0;
        const vh = viewportHeight > 0 ? (pxValue / viewportHeight) * 100 : 0;

        return {
            px: pxValue,
            rem: Number(rem.toFixed(4)),
            em: Number(em.toFixed(4)),
            pt: Number(pt.toFixed(2)),
            percent: Number(percent.toFixed(2)),
            vw: Number(vw.toFixed(3)),
            vh: Number(vh.toFixed(3)),
        };
    }, [pxValue, baseSize, viewportWidth, viewportHeight]);

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const tailwindPresets = [
        { px: 12, tw: "text-xs / p-3", rem: "0.75rem" },
        { px: 14, tw: "text-sm / p-3.5", rem: "0.875rem" },
        { px: 16, tw: "text-base / p-4", rem: "1rem" },
        { px: 18, tw: "text-lg / p-4.5", rem: "1.125rem" },
        { px: 20, tw: "text-xl / p-5", rem: "1.25rem" },
        { px: 24, tw: "text-2xl / p-6", rem: "1.5rem" },
        { px: 32, tw: "text-3xl / p-8", rem: "2rem" },
        { px: 40, tw: "text-4xl / p-10", rem: "2.5rem" },
        { px: 48, tw: "text-5xl / p-12", rem: "3rem" },
    ];

    const conversionCards = [
        { key: "rem", label: "REM", val: `${units.rem}rem`, css: `font-size: ${units.rem}rem;` },
        { key: "em", label: "EM", val: `${units.em}em`, css: `font-size: ${units.em}em;` },
        { key: "pt", label: "Points (pt)", val: `${units.pt}pt`, css: `font-size: ${units.pt}pt;` },
        { key: "percent", label: "Percent (%)", val: `${units.percent}%`, css: `font-size: ${units.percent}%;` },
        { key: "vw", label: "Viewport Width (vw)", val: `${units.vw}vw`, css: `width: ${units.vw}vw;` },
        { key: "vh", label: "Viewport Height (vh)", val: `${units.vh}vh`, css: `height: ${units.vh}vh;` },
    ];

    return (
        <div className='space-y-8 max-w-5xl mx-auto'>
            {/* Main Interactive Converter */}
            <Card className='p-6 md:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-700 rounded-2xl'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                    <div>
                        <label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200'>
                            {ui.pixelLabel || "Pixel Value (px)"}
                        </label>
                        <div className='relative'>
                            <input
                                type='number'
                                value={pxInput}
                                onChange={(e) => setPxInput(e.target.value)}
                                className='w-full px-4 py-3 text-2xl font-bold bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white'
                                placeholder='16'
                            />
                            <span className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg'>px</span>
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200'>
                            {ui.baseLabel || "Base Font Size (px)"}
                        </label>
                        <div className='relative'>
                            <input
                                type='number'
                                value={baseSizeInput}
                                onChange={(e) => setBaseSizeInput(e.target.value)}
                                className='w-full px-4 py-3 text-2xl font-bold bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white'
                                placeholder='16'
                            />
                            <span className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-lg'>px (root)</span>
                        </div>
                    </div>
                </div>

                {/* Live Preview Box */}
                <div className='p-5 mb-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900/60 dark:to-blue-950/40 border border-blue-100 dark:border-blue-900/50'>
                    <div className='text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2'>Live Preview</div>
                    <div className='flex items-center gap-4 flex-wrap'>
                        <div
                            style={{ fontSize: `${Math.min(Math.max(pxValue, 8), 64)}px` }}
                            className='font-bold text-gray-900 dark:text-white transition-all duration-150 truncate max-w-full'
                        >
                            Typography Preview ({pxValue}px)
                        </div>
                        <div
                            style={{
                                width: `${Math.min(Math.max(pxValue, 12), 120)}px`,
                                height: `${Math.min(Math.max(pxValue, 12), 120)}px`,
                            }}
                            className='bg-blue-600/80 rounded-lg shadow-sm shrink-0 transition-all duration-150 flex items-center justify-center text-white text-xs font-semibold'
                        >
                            Box
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {conversionCards.map((item) => (
                        <div
                            key={item.key}
                            className='p-4 bg-gray-50 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700/80 rounded-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all flex flex-col justify-between'
                        >
                            <div>
                                <div className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1'>{item.label}</div>
                                <div className='text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono'>{item.val}</div>
                            </div>
                            <div className='mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between'>
                                <code className='text-xs text-gray-600 dark:text-gray-300 font-mono truncate mr-2'>{item.css}</code>
                                <button
                                    onClick={() => copyToClipboard(item.val, item.key)}
                                    className='px-2.5 py-1 text-xs font-medium bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 rounded border border-gray-200 dark:border-gray-700 cursor-pointer shrink-0'
                                >
                                    {copiedKey === item.key ? (ui.copiedButton || "Copied!") : (ui.copyButton || "Copy")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Quick Reference Table with Tailwind */}
            <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md border border-gray-200 dark:border-gray-700 rounded-2xl'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                    <span>⚡</span> {ui.commonValues || "Common Values & Tailwind Equivalents (Base 16px)"}
                </h3>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left text-sm'>
                        <thead className='bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-semibold'>
                            <tr>
                                <th className='p-3 rounded-l-lg'>Pixels (px)</th>
                                <th className='p-3'>REM</th>
                                <th className='p-3'>Tailwind Class</th>
                                <th className='p-3 rounded-r-lg text-right'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                            {tailwindPresets.map((row) => (
                                <tr key={row.px} className='hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors'>
                                    <td className='p-3 font-semibold font-mono'>{row.px}px</td>
                                    <td className='p-3 font-mono text-blue-600 dark:text-blue-400 font-semibold'>{row.rem}</td>
                                    <td className='p-3 font-mono text-xs text-purple-600 dark:text-purple-400'>{row.tw}</td>
                                    <td className='p-3 text-right'>
                                        <button
                                            onClick={() => setPxInput(String(row.px))}
                                            className='text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium'
                                        >
                                            {locale === "vi" ? "Sử dụng" : "Use"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Rich SEO Content Section */}
            {page.whatIs && (
                <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                    <section className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.whatIs}</h2>
                        <p className='leading-relaxed mb-6'>{page.whatIsDesc}</p>

                        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>{page.whyImportant}</h3>
                        <p className='leading-relaxed'>{page.whyImportantDesc}</p>
                    </section>

                    {/* FAQ Section */}
                    {page.faq && (
                        <section className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>{page.faq}</h2>
                            <div className='space-y-4'>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                                    const q = page[`q${i}`];
                                    const a = page[`a${i}`];
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
