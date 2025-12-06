"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function DiffCheckerClient() {
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [differences, setDifferences] = useState<string[]>([]);

    const compareTexts = () => {
        const lines1 = text1.split("\n");
        const lines2 = text2.split("\n");
        const maxLines = Math.max(lines1.length, lines2.length);
        const diffs: string[] = [];

        for (let i = 0; i < maxLines; i++) {
            const line1 = lines1[i] || "";
            const line2 = lines2[i] || "";

            if (line1 !== line2) {
                if (line1 && !line2) {
                    diffs.push(`Line ${i + 1}: Removed - "${line1}"`);
                } else if (!line1 && line2) {
                    diffs.push(`Line ${i + 1}: Added - "${line2}"`);
                } else {
                    diffs.push(`Line ${i + 1}: Changed from "${line1}" to "${line2}"`);
                }
            }
        }

        setDifferences(diffs);
    };

    return (
        <div className='max-w-6xl mx-auto'>
            <div className='grid md:grid-cols-2 gap-4'>
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>Original Text</h3>
                    <textarea value={text1} onChange={(e) => setText1(e.target.value)} placeholder='Enter original text...' rows={15} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm' />
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>Modified Text</h3>
                    <textarea value={text2} onChange={(e) => setText2(e.target.value)} placeholder='Enter modified text...' rows={15} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm' />
                </div>
            </div>

            <Button onClick={compareTexts} variant='primary' size='lg' fullWidth>
                Compare Texts
            </Button>

            {differences.length > 0 && (
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>Differences Found: {differences.length}</h3>
                    <div className='space-y-2'>
                        {differences.map((diff, index) => (
                            <div key={index} className='p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-sm text-gray-900 dark:text-gray-100'>
                                {diff}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {differences.length === 0 && text1 && text2 && (
                <div className='bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-lg p-4 text-center'>
                    <p className='text-green-700 dark:text-green-300'>No differences found! Texts are identical.</p>
                </div>
            )}
        </div>
    );
}
