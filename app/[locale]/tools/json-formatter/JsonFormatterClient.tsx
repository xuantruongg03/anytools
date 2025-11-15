"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

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
                    <Button onClick={formatJson} variant='primary'>
                        Format
                    </Button>
                    <Button onClick={minifyJson} variant='success'>
                        Minify
                    </Button>
                    <Button onClick={clearAll} variant='gray'>
                        Clear
                    </Button>
                </div>
            </div>

            {/* Output Section */}
            <div>
                <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>Output</label>
                <textarea value={output} readOnly placeholder='Formatted JSON will appear here...' className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 resize-none dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                {error && <div className='mt-2 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>Error: {error}</div>}
                {output && (
                    <Button onClick={copyToClipboard} variant='purple' className='mt-4'>
                        Copy to Clipboard
                    </Button>
                )}
            </div>
        </div>
    );
}
