"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function JwtDecoderClient() {
    const [jwt, setJwt] = useState("");
    const [header, setHeader] = useState("");
    const [payload, setPayload] = useState("");
    const [error, setError] = useState("");

    const decodeJWT = () => {
        try {
            const parts = jwt.split(".");
            if (parts.length !== 3) {
                setError("Invalid JWT format");
                return;
            }

            const decodedHeader = JSON.parse(atob(parts[0]));
            const decodedPayload = JSON.parse(atob(parts[1]));

            setHeader(JSON.stringify(decodedHeader, null, 2));
            setPayload(JSON.stringify(decodedPayload, null, 2));
            setError("");
        } catch (err) {
            setError("Failed to decode JWT");
            setHeader("");
            setPayload("");
        }
    };

    return (
        <div className='space-y-6'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                <textarea value={jwt} onChange={(e) => setJwt(e.target.value)} placeholder='Paste your JWT token here...' rows={6} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm' />
                <Button onClick={decodeJWT} variant='primary' size='lg' fullWidth className='mt-4'>
                    Decode JWT
                </Button>
                {error && <div className='mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg'>{error}</div>}
            </div>

            {header && (
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>Header</h3>
                    <pre className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm wrap-break-word whitespace-pre-wrap'>
                        <code className='text-gray-900 dark:text-gray-100'>{header}</code>
                    </pre>
                </div>
            )}

            {payload && (
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>Payload</h3>
                    <pre className='p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm wrap-break-word whitespace-pre-wrap'>
                        <code className='text-gray-900 dark:text-gray-100'>{payload}</code>
                    </pre>
                </div>
            )}
        </div>
    );
}
