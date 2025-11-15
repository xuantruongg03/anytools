"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { htmlEntityEncoderTranslations } from "@/lib/i18n/tools/html-entity-encoder";
import Button from "@/components/ui/Button";

export default function HtmlEntityClient() {
    const { locale } = useLanguage();
    const t = htmlEntityEncoderTranslations[locale].htmlEntityEncoder;

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const encode = () => {
        const encoded = input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        setOutput(encoded);
    };

    const decode = () => {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = input;
        setOutput(textarea.value);
    };

    const clear = () => {
        setInput("");
        setOutput("");
        setCopied(false);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const commonEntities = [
        { label: t.page.ampersand, char: "&", entity: "&amp;" },
        { label: t.page.lessThan, char: "<", entity: "&lt;" },
        { label: t.page.greaterThan, char: ">", entity: "&gt;" },
        { label: t.page.quote, char: '"', entity: "&quot;" },
        { label: t.page.apostrophe, char: "'", entity: "&#39;" },
        { label: t.page.nbsp, char: " ", entity: "&nbsp;" },
        { label: t.page.copyright, char: "©", entity: "&copy;" },
        { label: t.page.registered, char: "®", entity: "&reg;" },
        { label: t.page.trademark, char: "™", entity: "&trade;" },
        { label: t.page.euro, char: "€", entity: "&euro;" },
        { label: t.page.pound, char: "£", entity: "&pound;" },
        { label: t.page.yen, char: "¥", entity: "&yen;" },
    ];

    return (
        <div className='space-y-6'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors'>
                <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.ui.inputLabel}</label>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.ui.inputPlaceholder} rows={6} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors' />

                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-4'>
                    <Button onClick={encode} variant='primary' size='lg' className='shadow-sm hover:shadow-md'>
                        {t.ui.encodeButton}
                    </Button>
                    <Button onClick={decode} variant='success' size='lg' className='shadow-sm hover:shadow-md'>
                        {t.ui.decodeButton}
                    </Button>
                    <Button onClick={clear} variant='gray' size='lg' className='shadow-sm hover:shadow-md'>
                        {t.ui.clearButton}
                    </Button>
                    <Button onClick={copyToClipboard} disabled={!output} variant='purple' size='lg' className='shadow-sm hover:shadow-md'>
                        {copied ? t.ui.copiedButton : t.ui.copyButton}
                    </Button>
                </div>
            </div>

            {output && (
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors'>
                    <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>{t.ui.outputLabel}</label>
                    <pre className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm border border-gray-200 dark:border-gray-700'>
                        <code className='text-gray-900 dark:text-gray-100 break-all whitespace-pre-wrap'>{output}</code>
                    </pre>
                </div>
            )}

            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>{t.ui.commonEntities}</h3>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                    {commonEntities.map((item, idx) => (
                        <div key={idx} className='p-3 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md hover:scale-105 transition-all'>
                            <div className='text-center text-3xl mb-2 font-bold text-gray-800 dark:text-gray-100'>{item.char}</div>
                            <div className='text-xs text-blue-600 dark:text-blue-400 font-mono text-center mb-1 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded'>{item.entity}</div>
                            <div className='text-xs text-gray-600 dark:text-gray-300 text-center font-medium'>{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
