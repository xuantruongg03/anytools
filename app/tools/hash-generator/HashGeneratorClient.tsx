"use client";

import { useState } from "react";

export default function HashGeneratorClient() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState({
        md5: "",
        sha1: "",
        sha256: "",
        sha512: "",
    });

    const generateHashes = async () => {
        if (!input) return;

        const encoder = new TextEncoder();
        const data = encoder.encode(input);

        try {
            // Generate SHA-256
            const sha256Buffer = await crypto.subtle.digest("SHA-256", data);
            const sha256Hash = Array.from(new Uint8Array(sha256Buffer))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

            // Generate SHA-512
            const sha512Buffer = await crypto.subtle.digest("SHA-512", data);
            const sha512Hash = Array.from(new Uint8Array(sha512Buffer))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

            // Generate SHA-1
            const sha1Buffer = await crypto.subtle.digest("SHA-1", data);
            const sha1Hash = Array.from(new Uint8Array(sha1Buffer))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

            setHashes({
                md5: "MD5 requires external library - SHA algorithms shown",
                sha1: sha1Hash,
                sha256: sha256Hash,
                sha512: sha512Hash,
            });
        } catch (error) {
            alert("Error generating hashes");
        }
    };

    const copyToClipboard = async (text: string, algorithm: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert(`Copied ${algorithm} hash to clipboard!`);
        } catch (e) {
            alert("Failed to copy");
        }
    };

    return (
        <div className='max-w-4xl mx-auto'>
            <div className='space-y-6'>
                <div>
                    <label className='block text-sm font-medium mb-2'>Input Text</label>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Enter text to hash...' className='w-full h-32 p-4 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-700' />
                </div>

                <button onClick={generateHashes} className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'>
                    Generate Hashes
                </button>

                {hashes.sha256 && (
                    <div className='space-y-4'>
                        <div className='p-4 bg-white dark:bg-gray-800 border rounded-lg'>
                            <div className='flex justify-between items-center mb-2'>
                                <h3 className='font-semibold'>SHA-1</h3>
                                <button onClick={() => copyToClipboard(hashes.sha1, "SHA-1")} className='text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600'>
                                    Copy
                                </button>
                            </div>
                            <code className='text-xs break-all'>{hashes.sha1}</code>
                        </div>

                        <div className='p-4 bg-white dark:bg-gray-800 border rounded-lg'>
                            <div className='flex justify-between items-center mb-2'>
                                <h3 className='font-semibold'>SHA-256</h3>
                                <button onClick={() => copyToClipboard(hashes.sha256, "SHA-256")} className='text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600'>
                                    Copy
                                </button>
                            </div>
                            <code className='text-xs break-all'>{hashes.sha256}</code>
                        </div>

                        <div className='p-4 bg-white dark:bg-gray-800 border rounded-lg'>
                            <div className='flex justify-between items-center mb-2'>
                                <h3 className='font-semibold'>SHA-512</h3>
                                <button onClick={() => copyToClipboard(hashes.sha512, "SHA-512")} className='text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600'>
                                    Copy
                                </button>
                            </div>
                            <code className='text-xs break-all'>{hashes.sha512}</code>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
