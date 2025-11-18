import type { Metadata } from "next";
import DiffCheckerClient from "./DiffCheckerClient";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Diff Checker - Text Comparison Tool Online Free 2025",
        description: "Compare two texts and find differences online. Free diff checker tool to compare text files, code, documents. Highlight changes instantly.",
        keywords: ["diff checker", "text comparison", "compare text", "text diff", "file comparison"],
        alternates: { canonical: "https://anytools.online/tools/diff-checker" },
        robots: { index: true, follow: true },
    };
}

export default function DiffCheckerPage() {
    const relatedTools = getRelatedTools("/tools/diff-checker", 6);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-4'>Diff Checker</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>Compare two texts and find differences</p>
                </div>
                <DiffCheckerClient />
                <RelatedTools tools={relatedTools} currentPath='/tools/diff-checker' />
            </div>
        </div>
    );
}
