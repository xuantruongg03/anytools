import type { Metadata } from "next";
import HashGeneratorClient from "./HashGeneratorClient";

export const metadata: Metadata = {
    title: "Hash Generator - MD5, SHA-1, SHA-256 Hash Calculator",
    description: "Free online hash generator. Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text. Secure and fast hash calculator for developers.",
    keywords: ["hash generator", "md5 generator", "sha1", "sha256", "hash calculator", "checksum", "cryptographic hash"],
    openGraph: {
        title: "Hash Generator - Generate MD5, SHA-1, SHA-256 Hashes",
        description: "Generate cryptographic hashes from text. Supports MD5, SHA-1, SHA-256, and SHA-512.",
        type: "website",
    },
};

export default function HashGeneratorPage() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <header className='mb-8'>
                    <h1 className='text-4xl font-bold mb-4'>Hash Generator</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>Generate cryptographic hashes from text. Supports MD5, SHA-1, SHA-256, and SHA-512 algorithms.</p>
                </header>

                <HashGeneratorClient />

                <section className='mt-12 prose dark:prose-invert max-w-none'>
                    <h2 className='text-2xl font-semibold mb-4'>About Hash Functions</h2>

                    <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                        <p>A hash function is a cryptographic algorithm that converts input data of any size into a fixed-size string of characters, which is typically a hash value or digest.</p>

                        <h3 className='text-xl font-semibold mb-3'>Common Hash Algorithms:</h3>

                        <div className='space-y-3'>
                            <div>
                                <h4 className='font-semibold'>MD5 (128-bit)</h4>
                                <p className='text-sm'>Fast but considered cryptographically broken. Still used for checksums.</p>
                            </div>

                            <div>
                                <h4 className='font-semibold'>SHA-1 (160-bit)</h4>
                                <p className='text-sm'>More secure than MD5 but also deprecated for security purposes.</p>
                            </div>

                            <div>
                                <h4 className='font-semibold'>SHA-256 (256-bit)</h4>
                                <p className='text-sm'>Part of SHA-2 family. Widely used and considered secure.</p>
                            </div>

                            <div>
                                <h4 className='font-semibold'>SHA-512 (512-bit)</h4>
                                <p className='text-sm'>Longer hash, more secure. Used for high-security applications.</p>
                            </div>
                        </div>

                        <h3 className='text-xl font-semibold mb-3 mt-6'>Use Cases:</h3>
                        <ul className='list-disc list-inside space-y-2'>
                            <li>Verify file integrity and checksums</li>
                            <li>Password hashing (with salt)</li>
                            <li>Digital signatures</li>
                            <li>Data deduplication</li>
                            <li>Blockchain and cryptocurrency</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
