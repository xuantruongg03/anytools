"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Button from "@/components/ui/Button";

export default function Base64Client() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    const encode = () => {
        try {
            const encoded = btoa(unescape(encodeURIComponent(input)));
            setOutput(encoded);
            setError("");
        } catch (e) {
            setError("Error encoding: " + (e instanceof Error ? e.message : "Unknown error"));
            setOutput("");
        }
    };

    const decode = () => {
        try {
            // Check if input is a Data URL (like data:image/png;base64,...)
            if (input.startsWith("data:")) {
                // For Data URLs, just set it as output (it's already decoded for display)
                setOutput(input);
                setError("");
            } else {
                // For regular Base64 text, decode it
                const decoded = decodeURIComponent(escape(atob(input)));
                setOutput(decoded);
                setError("");
            }
        } catch (e) {
            setError("Invalid Base64 string");
            setOutput("");
        }
    };

    const encodeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target?.result as string;
            setOutput(base64String);
            setError("");
        };
        reader.onerror = () => {
            setError("Error reading file");
        };
        reader.readAsDataURL(file);
    };

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(output);
                alert("Copied to clipboard!");
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
                    alert("Copied to clipboard!");
                } else {
                    alert("Failed to copy. Please copy manually.");
                }
            }
        } catch (e) {
            console.error("Copy error:", e);
            alert("Failed to copy. Please copy manually.");
        }
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
        setError("");
    };

    return (
        <div className='grid lg:grid-cols-2 gap-6'>
            {/* Input Section */}
            <div>
                <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.tools.base64.input}</label>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Enter text to encode or Base64 to decode...' className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' />
                <div className='flex flex-wrap gap-2 mt-4'>
                    <Button onClick={encode} variant='primary'>
                        {t.tools.base64.encode}
                    </Button>
                    <Button onClick={decode} variant='success'>
                        {t.tools.base64.decode}
                    </Button>
                    <label className='inline-block cursor-pointer'>
                        <input type='file' accept='image/*' onChange={encodeImage} className='hidden' />
                        <span className='inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors cursor-pointer bg-purple-600 hover:bg-purple-700 text-white'>{t.tools.base64.encodeImage}</span>
                    </label>
                    <Button onClick={clearAll} variant='gray'>
                        {t.common.clear}
                    </Button>
                </div>
            </div>

            {/* Output Section */}
            <div>
                <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.tools.base64.output}</label>
                <textarea value={output} readOnly placeholder='Result will appear here...' className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' />
                {error && <div className='mt-2 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>Error: {error}</div>}
                {output && (
                    <div className='mt-4 flex gap-2'>
                        <Button onClick={copyToClipboard} variant='dark'>
                            {t.common.copy}
                        </Button>
                        {output.startsWith("data:image") && (
                            <Button
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = output;
                                    link.download = "decoded-image.png";
                                    link.click();
                                }}
                                variant='info'
                            >
                                {t.tools.base64.downloadImage}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
