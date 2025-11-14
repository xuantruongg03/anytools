"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";

export default function UrlEncoderClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const encode = () => {
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
    };

    const decode = () => {
        try {
            const decoded = decodeURIComponent(input);
            setOutput(decoded);
        } catch (e) {
            alert("Error decoding: Invalid URL-encoded string");
        }
    };

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(output);
                alert(t.common.copied);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = output;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                const successful = document.execCommand("copy");
                document.body.removeChild(textarea);
                if (successful) {
                    alert(t.common.copied);
                } else {
                    alert(t.common.failedToCopy);
                }
            }
        } catch (e) {
            console.error("Copy error:", e);
            alert(t.common.failedToCopy);
        }
    };

    return (
        <div className='grid lg:grid-cols-2 gap-6'>
            {/* Input Section */}
            <div>
                <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.tools.urlEncoder.input}</label>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Enter text to encode or URL-encoded text to decode...' className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' />
                <div className='flex flex-wrap gap-2 mt-4'>
                    <button onClick={encode} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                        {t.tools.urlEncoder.encode}
                    </button>
                    <button onClick={decode} className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
                        {t.tools.urlEncoder.decode}
                    </button>
                    <button
                        onClick={() => {
                            setInput("");
                            setOutput("");
                        }}
                        className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                    >
                        {t.common.clear}
                    </button>
                </div>
            </div>

            {/* Output Section */}
            <div>
                <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.tools.urlEncoder.output}</label>
                <textarea value={output} readOnly placeholder='Result will appear here...' className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' />
                {output && (
                    <button onClick={copyToClipboard} className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'>
                        {t.common.copy}
                    </button>
                )}
            </div>
        </div>
    );
}
