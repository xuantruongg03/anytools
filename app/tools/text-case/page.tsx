import type { Metadata } from "next";
import TextCaseClient from "./TextCaseClient";

export const metadata: Metadata = {
    title: "Text Case Converter - Convert to Uppercase, Lowercase, Title Case",
    description: "Free text case converter. Convert text to uppercase, lowercase, title case, camelCase, snake_case, and more. Fast and easy to use.",
    keywords: ["text case converter", "uppercase", "lowercase", "title case", "camelCase", "snake_case", "convert case"],
    openGraph: {
        title: "Text Case Converter - Free Online Tool",
        description: "Convert text between different cases: uppercase, lowercase, title case, and more.",
        type: "website",
    },
};

export default function TextCasePage() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <header className='mb-8'>
                    <h1 className='text-4xl font-bold mb-4'>Text Case Converter</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>Convert text between different cases: uppercase, lowercase, title case, camelCase, and more.</p>
                </header>

                <TextCaseClient />

                <section className='mt-12 prose dark:prose-invert max-w-none'>
                    <h2 className='text-2xl font-semibold mb-4'>Text Case Types</h2>

                    <div className='grid md:grid-cols-2 gap-6 text-gray-600 dark:text-gray-400'>
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>UPPERCASE</h3>
                            <p className='text-sm'>All letters are capitalized</p>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>lowercase</h3>
                            <p className='text-sm'>All letters are lowercase</p>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Title Case</h3>
                            <p className='text-sm'>First Letter Of Each Word Is Capitalized</p>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Sentence case</h3>
                            <p className='text-sm'>First letter of sentence is capitalized</p>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>camelCase</h3>
                            <p className='text-sm'>Used in programming, no spaces</p>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>snake_case</h3>
                            <p className='text-sm'>Words separated by underscores</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
