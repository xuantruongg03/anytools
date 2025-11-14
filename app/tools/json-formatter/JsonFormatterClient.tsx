"use client";

import { useState } from "react";

export default function JsonFormatterClient() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    const formatJson = () => {
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            setOutput(formatted);
            setError("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setOutput("");
        }
    };

    const minifyJson = () => {
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setError("");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setOutput("");
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(output);
            alert("Copied to clipboard!");
        } catch (e) {
            alert("Failed to copy");
            console.log("Fail to copy: " + e);
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
                <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>Input JSON</label>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='{"name": "John", "age": 30}' className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 resize-none placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                <div className='flex gap-2 mt-4'>
                    <button onClick={formatJson} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                        Format
                    </button>
                    <button onClick={minifyJson} className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
                        Minify
                    </button>
                    <button onClick={clearAll} className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'>
                        Clear
                    </button>
                </div>
            </div>

            {/* Output Section */}
            <div>
                <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>Output</label>
                <textarea value={output} readOnly placeholder='Formatted JSON will appear here...' className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                {error && <div className='mt-2 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>Error: {error}</div>}
                {output && (
                    <button onClick={copyToClipboard} className='mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'>
                        Copy to Clipboard
                    </button>
                )}
            </div>
        </div>
    );
}
