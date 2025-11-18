import type { Metadata } from "next";
import TextCaseContent from "./TextCaseContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Text Case Converter - Convert to Uppercase, Lowercase, Title Case, camelCase, snake_case 2025",
        description: "Free online text case converter. Instantly convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case. Fast, secure, and works entirely in your browser.",
        keywords: ["text case converter", "uppercase converter", "lowercase converter", "title case converter", "camelCase converter", "snake_case converter", "kebab-case converter", "convert text case", "case changer", "text formatter", "programming case converter", "chuyển đổi chữ hoa thường", "công cụ chuyển đổi chữ", "camelCase snake_case"],
        openGraph: {
            title: "Text Case Converter - Free Online Tool",
            description: "Convert text between different cases: uppercase, lowercase, title case, camelCase, snake_case, and more.",
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title: "Text Case Converter - Free Online Tool",
            description: "Convert text between different cases: uppercase, lowercase, title case, camelCase, and more.",
        },
        alternates: {
            canonical: "https://anytools.online/tools/text-case",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}

export default function TextCasePage() {
    const relatedTools = getRelatedTools("/tools/text-case", 6);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <TextCaseContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/text-case' />
            </div>
        </div>
    );
}
