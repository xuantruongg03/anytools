"use client";

import { useState, useMemo, useRef } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { svgOptimizerTranslations } from "@/lib/i18n/tools/svg-optimizer";
import { toast } from "@/components/ui/Toast";

function optimizeSvgCode(rawSvg: string, precision: number): string {
    if (!rawSvg.trim()) return "";

    let svg = rawSvg;

    // 1. Remove XML declaration & DOCTYPE
    svg = svg.replace(/<\?xml[\s\S]*?\?>/gi, "");
    svg = svg.replace(/<!DOCTYPE[\s\S]*?>/gi, "");

    // 2. Remove XML comments
    svg = svg.replace(/<!--[\s\S]*?-->/g, "");

    // 3. Remove editor metadata blocks
    svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
    svg = svg.replace(/<sodipodi:namedview[\s\S]*?<\/sodipodi:namedview>/gi, "");
    svg = svg.replace(/<sodipodi:namedview[\s\S]*?\/>/gi, "");
    svg = svg.replace(/<inkscape:[a-z]+[\s\S]*?<\/inkscape:[a-z]+>/gi, "");
    svg = svg.replace(/<inkscape:[a-z]+[\s\S]*?\/>/gi, "");

    // 4. Remove editor attributes
    svg = svg.replace(/\s+(xmlns:inkscape|xmlns:sodipodi|xmlns:sketch|xmlns:serif|xmlns:adobe|inkscape:[a-zA-Z-]+|sodipodi:[a-zA-Z-]+|sketch:[a-zA-Z-]+)=["'][^"']*["']/gi, "");

    // 5. Remove empty groups and definitions
    svg = svg.replace(/<g\s*><\/g>/gi, "");
    svg = svg.replace(/<g\s*\/>/gi, "");
    svg = svg.replace(/<defs\s*><\/defs>/gi, "");
    svg = svg.replace(/<defs\s*\/>/gi, "");

    // 6. Round floating-point coordinates in d="..." and points="..."
    const roundCoords = (_: string, prefix: string, coords: string, quote: string) => {
        const rounded = coords.replace(/([0-9]+\.[0-9]+)/g, (match) => {
            const num = parseFloat(match);
            return parseFloat(num.toFixed(precision)).toString();
        });
        return `${prefix}=${quote}${rounded}${quote}`;
    };

    svg = svg.replace(/(d|points)=(["'])(.*?)\2/gi, roundCoords);

    // 7. Collapse unnecessary whitespace
    svg = svg.replace(/>\s+</g, "><").trim();

    return svg;
}

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" viewBox="0 0 100 100" width="100" height="100">
  <!-- Generator: Adobe Illustrator 28.0, SVG Export Plug-In -->
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:format>image/svg+xml</dc:format>
      </rdf:Description>
    </rdf:RDF>
  </metadata>
  <sodipodi:namedview id="namedview1" pagecolor="#ffffff" bordercolor="#000000" />
  <g id="Layer_1" inkscape:label="Layer 1" inkscape:groupmode="layer">
    <circle cx="50.000000" cy="50.000000" r="40.000000" fill="#3b82f6" stroke="#1d4ed8" stroke-width="4.000000" />
    <path d="M 35.542891 50.123984 L 45.981245 60.562338 L 65.123984 41.419599" fill="none" stroke="#ffffff" stroke-width="6.000000" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;

export default function SvgOptimizerContent() {
    const { locale } = useLanguage();
    const t = svgOptimizerTranslations[locale as "en" | "vi"] || svgOptimizerTranslations.en;

    const [inputSvg, setInputSvg] = useState<string>(SAMPLE_SVG);
    const [precision, setPrecision] = useState<number>(2);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const optimizedSvg = useMemo(() => {
        return optimizeSvgCode(inputSvg, precision);
    }, [inputSvg, precision]);

    // File size stats
    const originalBytes = useMemo(() => new Blob([inputSvg]).size, [inputSvg]);
    const optimizedBytes = useMemo(() => new Blob([optimizedSvg]).size, [optimizedSvg]);

    const reductionPercent = useMemo(() => {
        if (originalBytes === 0) return 0;
        const diff = originalBytes - optimizedBytes;
        return Math.max(0, parseFloat(((diff / originalBytes) * 100).toFixed(1)));
    }, [originalBytes, optimizedBytes]);

    const handleCopy = () => {
        if (!optimizedSvg) return;
        navigator.clipboard.writeText(optimizedSvg);
        toast.success(t.copied);
    };

    const handleDownload = () => {
        if (!optimizedSvg) return;
        const blob = new Blob([optimizedSvg], { type: "image/svg+xml;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "optimized.svg";
        link.click();
    };

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setInputSvg(e.target?.result as string);
        };
        reader.readAsText(file);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-6xl mx-auto space-y-6'>
            {/* Top Toolbar: Precision & Stats */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center gap-3 text-xs'>
                    {/* Precision Selector */}
                    <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>🎯 {t.precisionLabel}:</span>
                        <select
                            value={precision}
                            onChange={(e) => setPrecision(parseInt(e.target.value, 10))}
                            className='px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer'
                        >
                            <option value={2}>{t.decimals2}</option>
                            <option value={1}>{t.decimals1}</option>
                            <option value={3}>{t.decimals3}</option>
                        </select>
                    </div>

                    <input
                        type='file'
                        ref={fileInputRef}
                        accept='.svg'
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleFileUpload(f);
                        }}
                        className='hidden'
                    />

                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant='secondary'
                        size='sm'
                        className='cursor-pointer text-xs font-bold'
                    >
                        📁 {t.uploadSvg}
                    </Button>
                </div>

                {/* Savings Metric */}
                <div className='flex items-center gap-2'>
                    <span className='text-xs text-gray-400'>
                        {(originalBytes / 1024).toFixed(2)} KB → {(optimizedBytes / 1024).toFixed(2)} KB
                    </span>
                    <span className='px-3 py-1 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'>
                        -{reductionPercent}%
                    </span>
                </div>
            </div>

            {/* Dual Code View */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {/* Left: Original SVG Code */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                            <span>📄</span> {t.inputLabel}
                        </span>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setInputSvg(SAMPLE_SVG)}
                                className='text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                            >
                                ⚡ {t.presets}
                            </button>
                            {inputSvg && (
                                <button
                                    onClick={() => setInputSvg("")}
                                    className='text-xs font-semibold text-gray-400 hover:text-red-500 cursor-pointer'
                                >
                                    ✕ {t.clear}
                                </button>
                            )}
                        </div>
                    </div>
                    <textarea
                        value={inputSvg}
                        onChange={(e) => setInputSvg(e.target.value)}
                        placeholder={t.inputPlaceholder}
                        rows={14}
                        className='w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 font-mono text-xs text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed'
                    />
                </div>

                {/* Right: Optimized SVG Code */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2'>
                            <span>✨</span> {t.outputLabel}
                        </span>
                        <div className='flex items-center gap-2'>
                            <Button
                                onClick={handleCopy}
                                disabled={!optimizedSvg}
                                variant='primary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                📋 {t.copySvg}
                            </Button>
                            <Button
                                onClick={handleDownload}
                                disabled={!optimizedSvg}
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                💾 {t.downloadSvg}
                            </Button>
                        </div>
                    </div>
                    <textarea
                        readOnly
                        value={optimizedSvg}
                        rows={14}
                        className='w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-900 text-emerald-400 font-mono text-xs focus:outline-hidden resize-none leading-relaxed'
                    />
                </div>
            </div>

            {/* Visual Side-by-Side Fidelity Comparison */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>🔍</span> {t.previewTitle}
                </h4>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {/* Original Visual */}
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex flex-col items-center space-y-2'>
                        <span className='text-xs font-bold text-gray-500 dark:text-gray-400'>
                            {t.previewOriginal} ({(originalBytes / 1024).toFixed(2)} KB)
                        </span>
                        <div
                            className='w-full h-48 rounded-xl border border-gray-300 dark:border-gray-600 flex items-center justify-center p-3 bg-white dark:bg-gray-950 overflow-hidden'
                            dangerouslySetInnerHTML={{ __html: inputSvg }}
                        />
                    </div>

                    {/* Optimized Visual */}
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 flex flex-col items-center space-y-2'>
                        <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400'>
                            {t.previewOptimized} ({(optimizedBytes / 1024).toFixed(2)} KB)
                        </span>
                        <div
                            className='w-full h-48 rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center justify-center p-3 bg-white dark:bg-gray-950 overflow-hidden'
                            dangerouslySetInnerHTML={{ __html: optimizedSvg }}
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
