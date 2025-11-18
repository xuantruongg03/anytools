import type { Metadata } from "next";
import TailwindCssContent from "./TailwindCssContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Tailwind CSS to CSS Converter - Convert Tailwind Classes to Vanilla CSS 2025",
        description: "Free online Tailwind CSS to vanilla CSS converter. Convert Tailwind utility classes to CSS styles and vice versa. Perfect for learning Tailwind, debugging, and project migration. Works offline in your browser.",
        keywords: [
            // English keywords
            "tailwind to css",
            "css to tailwind",
            "tailwind converter",
            "tailwind css converter",
            "utility classes converter",
            "tailwind to vanilla css",
            "css converter online",
            "tailwind class to css",
            "tailwind migration tool",
            "learn tailwind css",
            "tailwind css cheat sheet",
            "tailwind utility converter",
            "css to tailwind classes",
            "tailwind debugging tool",
            // Vietnamese keywords
            "chuyển tailwind sang css",
            "chuyển css sang tailwind",
            "công cụ chuyển đổi tailwind",
            "học tailwind css",
            "tailwind converter tiếng việt",
            "công cụ tailwind",
        ],
        openGraph: {
            title: "Tailwind CSS ↔ Vanilla CSS Converter - Free Online Tool",
            description: "Convert between Tailwind utility classes and vanilla CSS styles. Perfect for learning Tailwind or migrating projects.",
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title: "Tailwind CSS ↔ CSS Converter - Free Tool",
            description: "Convert Tailwind classes to CSS and vice versa. Learn Tailwind or migrate projects easily.",
        },
        alternates: {
            canonical: "https://www.anytools.online/tools/tailwind-css",
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

export default function TailwindCssPage() {
    const relatedTools = getRelatedTools("/tools/tailwind-css", 6);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <TailwindCssContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/tailwind-css' />
            </div>
        </div>
    );
}
