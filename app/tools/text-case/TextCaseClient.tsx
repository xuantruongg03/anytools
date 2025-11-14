"use client";

import { useState } from "react";

export default function TextCaseClient() {
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
            await navigator.clipboard.writeText(input);
            alert("Copied to clipboard!");
        } catch (e) {
            alert("Failed to copy");
        }
    };

    return (
        <div className='max-w-4xl mx-auto'>
            <div className='space-y-6'>
                <div>
                    <label className='block text-sm font-medium mb-2'>Your Text</label>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Enter your text here...' className='w-full h-48 p-4 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700' />
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    <button onClick={toUpperCase} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'>
                        UPPERCASE
                    </button>
                    <button onClick={toLowerCase} className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm'>
                        lowercase
                    </button>
                    <button onClick={toTitleCase} className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm'>
                        Title Case
                    </button>
                    <button onClick={toSentenceCase} className='px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm'>
                        Sentence case
                    </button>
                    <button onClick={toCamelCase} className='px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm'>
                        camelCase
                    </button>
                    <button onClick={toSnakeCase} className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm'>
                        snake_case
                    </button>
                    <button onClick={toKebabCase} className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm'>
                        kebab-case
                    </button>
                    <button onClick={copyToClipboard} className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm'>
                        Copy
                    </button>
                </div>

                {input && (
                    <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Character count: <strong>{input.length}</strong> | Word count:{" "}
                            <strong>
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
