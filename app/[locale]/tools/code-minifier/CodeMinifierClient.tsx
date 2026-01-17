"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Button from "@/components/ui/Button";

type CodeType = "html" | "css" | "js";

export default function CodeMinifierClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    
    const [codeType, setCodeType] = useState<CodeType>("html");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [stats, setStats] = useState({ original: 0, minified: 0, saved: 0, percent: 0 });

    const calculateStats = (original: string, minified: string) => {
        const originalSize = new Blob([original]).size;
        const minifiedSize = new Blob([minified]).size;
        const saved = originalSize - minifiedSize;
        const percent = originalSize > 0 ? ((saved / originalSize) * 100) : 0;

        setStats({
            original: originalSize,
            minified: minifiedSize,
            saved,
            percent,
        });
    };

    // Simple browser-based minification (no external libraries)
    const minifyHTML = (html: string): string => {
        return html
            .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/>\s+</g, '><') // Remove whitespace between tags
            .replace(/\s+(>)/g, '$1') // Remove whitespace before >
            .replace(/(<)\s+/g, '$1') // Remove whitespace after <
            .trim();
    };

    const minifyCSS = (css: string): string => {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/\s*{\s*/g, '{') // Remove whitespace around {
            .replace(/\s*}\s*/g, '}') // Remove whitespace around }
            .replace(/\s*:\s*/g, ':') // Remove whitespace around :
            .replace(/\s*;\s*/g, ';') // Remove whitespace around ;
            .replace(/;\s*}/g, '}') // Remove last semicolon
            .replace(/,\s*/g, ',') // Remove whitespace after comma
            .trim();
    };

    const minifyJS = (js: string): string => {
        return js
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
            .replace(/\/\/.*/g, '') // Remove single-line comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*\(\s*/g, '(')
            .replace(/\s*\)\s*/g, ')')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*,\s*/g, ',')
            .replace(/\s*=\s*/g, '=')
            .replace(/\s*\+\s*/g, '+')
            .replace(/\s*-\s*/g, '-')
            .replace(/\s*\*\s*/g, '*')
            .replace(/\s*\/\s*/g, '/')
            .trim();
    };

    const handleMinify = () => {
        if (!input.trim()) {
            setError("Please enter code to minify");
            return;
        }

        try {
            let minified = "";

            switch (codeType) {
                case "html":
                    minified = minifyHTML(input);
                    break;
                case "css":
                    minified = minifyCSS(input);
                    break;
                case "js":
                    minified = minifyJS(input);
                    break;
            }

            setOutput(minified);
            calculateStats(input, minified);
            setError("");
        } catch (e: any) {
            setError(`Minification error: ${e.message || "Unknown error"}`);
            setOutput("");
        }
    };

    const handleBeautify = () => {
        if (!input.trim()) {
            setError("Please enter code to beautify");
            return;
        }

        try {
            let beautified = "";

            switch (codeType) {
                case "html":
                    beautified = input
                        .replace(/></g, '>\n<')
                        .replace(/(<\w+[^>]*>)([^<]+)(<\/\w+>)/g, '$1\n  $2\n$3');
                    break;

                case "css":
                    beautified = input
                        .replace(/}/g, '}\n')
                        .replace(/{/g, ' {\n  ')
                        .replace(/;/g, ';\n  ')
                        .replace(/\n\s*\n/g, '\n');
                    break;

                case "js":
                    beautified = input
                        .replace(/{/g, ' {\n  ')
                        .replace(/}/g, '\n}')
                        .replace(/;/g, ';\n  ');
                    break;
            }

            setOutput(beautified);
            setError("");
            setStats({ original: 0, minified: 0, saved: 0, percent: 0 });
        } catch (e: any) {
            setError(`Beautify error: ${e.message || "Unknown error"}`);
            setOutput("");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output).then(
            () => alert(t.common.copied),
            () => alert(t.common.failedToCopy)
        );
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
        setError("");
        setStats({ original: 0, minified: 0, saved: 0, percent: 0 });
    };

    return (
        <div className='space-y-6'>
            {/* Code Type Selection */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
                    {t.tools.codeMinifier.selectType}
                </h2>

                <div className='grid grid-cols-3 gap-3'>
                    {(['html', 'css', 'js'] as CodeType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setCodeType(type)}
                            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                codeType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input/Output */}
            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Input */}
                <div>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                        {t.tools.codeMinifier.input}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.tools.codeMinifier.inputPlaceholder[codeType]}
                        className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    />
                    <div className='flex flex-wrap gap-2 mt-4'>
                        <Button onClick={handleMinify} variant='primary'>
                            {t.tools.codeMinifier.minify}
                        </Button>
                        <Button onClick={handleBeautify} variant='success'>
                            {t.tools.codeMinifier.beautify}
                        </Button>
                        <Button onClick={clearAll} variant='gray'>
                            {t.common.clear}
                        </Button>
                    </div>
                </div>

                {/* Output */}
                <div>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                        {t.tools.codeMinifier.output}
                    </label>
                    <textarea
                        value={output}
                        readOnly
                        placeholder={t.tools.codeMinifier.outputPlaceholder}
                        className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    />
                    {error && (
                        <div className='mt-2 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>
                            {error}
                        </div>
                    )}
                    {output && (
                        <div className='mt-4'>
                            <Button onClick={copyToClipboard} variant='dark'>
                                {t.common.copy}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Statistics */}
            {stats.original > 0 && (
                <div className='bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800'>
                    <h3 className='text-lg font-semibold mb-3 text-green-900 dark:text-green-100'>
                        {t.tools.codeMinifier.sizeReduction}
                    </h3>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                        <div>
                            <div className='text-gray-600 dark:text-gray-400'>{t.tools.codeMinifier.originalSize}</div>
                            <div className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                                {(stats.original / 1024).toFixed(2)} KB
                            </div>
                        </div>
                        <div>
                            <div className='text-gray-600 dark:text-gray-400'>{t.tools.codeMinifier.minifiedSize}</div>
                            <div className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                                {(stats.minified / 1024).toFixed(2)} KB
                            </div>
                        </div>
                        <div>
                            <div className='text-gray-600 dark:text-gray-400'>{t.tools.codeMinifier.saved}</div>
                            <div className='text-lg font-semibold text-green-600 dark:text-green-400'>
                                {(stats.saved / 1024).toFixed(2)} KB
                            </div>
                        </div>
                        <div>
                            <div className='text-gray-600 dark:text-gray-400'>{t.tools.codeMinifier.reduction}</div>
                            <div className='text-lg font-semibold text-green-600 dark:text-green-400'>
                                {stats.percent.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
