"use client";

import { getTranslation } from "@/lib/i18n";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function TextCaseClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    const [input, setInput] = useState("");

    const toUpperCase = () => setInput(input.toUpperCase());
    const toLowerCase = () => setInput(input.toLowerCase());

    const toTitleCase = () => {
        const result = input.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
        setInput(result);
    };

    const toSentenceCase = () => {
        const result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase());
        setInput(result);
    };

    const toCamelCase = () => {
        const result = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
        setInput(result);
    };

    const toSnakeCase = () => {
        const result = input
            .replace(/\s+/g, "_")
            .replace(/[A-Z]/g, (char) => "_" + char.toLowerCase())
            .replace(/^_/, "")
            .replace(/_+/g, "_");
        setInput(result);
    };

    const toKebabCase = () => {
        const result = input
            .replace(/\s+/g, "-")
            .replace(/[A-Z]/g, (char) => "-" + char.toLowerCase())
            .replace(/^-/, "")
            .replace(/-+/g, "-")
            .toLowerCase();
        setInput(result);
    };

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(input);
                alert(locale === "en" ? "Copied to clipboard!" : "Đã sao chép vào clipboard!");
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = input;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                alert(locale === "en" ? "Copied to clipboard!" : "Đã sao chép vào clipboard!");
            }
        } catch (e) {
            alert(locale === "en" ? "Failed to copy" : "Sao chép thất bại");
        }
    };

    return (
        <div className='max-w-4xl mx-auto'>
            <div className='space-y-6'>
                <div>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.tools.textCase.yourText}</label>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={locale === "en" ? "Enter your text here..." : "Nhập văn bản của bạn vào đây..."} className='w-full h-48 p-4 border rounded-lg text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' />
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    <button onClick={toUpperCase} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'>
                        {t.tools.textCase.uppercase}
                    </button>
                    <button onClick={toLowerCase} className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'>
                        {t.tools.textCase.lowercase}
                    </button>
                    <button onClick={toTitleCase} className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium'>
                        {t.tools.textCase.titleCase}
                    </button>
                    <button onClick={toSentenceCase} className='px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium'>
                        {t.tools.textCase.sentenceCase}
                    </button>
                    <button onClick={toCamelCase} className='px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium'>
                        {t.tools.textCase.camelCase}
                    </button>
                    <button onClick={toSnakeCase} className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium'>
                        {t.tools.textCase.snakeCase}
                    </button>
                    <button onClick={toKebabCase} className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium'>
                        {t.tools.textCase.kebabCase}
                    </button>
                    <button onClick={copyToClipboard} className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium'>
                        {t.common.copy}
                    </button>
                </div>

                {input && (
                    <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {t.tools.textCase.characterCount}: <strong className='text-gray-900 dark:text-gray-100'>{input.length}</strong> | {t.tools.textCase.wordCount}:{" "}
                            <strong className='text-gray-900 dark:text-gray-100'>
                                {
                                    input
                                        .trim()
                                        .split(/\s+/)
                                        .filter((w) => w).length
                                }
                            </strong>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
