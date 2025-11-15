import type { Metadata } from "next";
import JsonFormatterContent from "./JsonFormatterContent";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "JSON Formatter Online - Free JSON Beautifier & Validator Tool 2025",
        description: "Free online JSON formatter, validator and beautifier. Format, validate, minify JSON instantly. Best JSON editor with syntax highlighting. No installation required. Try now!",
        keywords: [
            "json formatter",
            "json validator",
            "json beautifier",
            "json minifier",
            "format json online",
            "validate json",
            "json syntax checker",
            "json editor online",
            "json pretty print",
            "json viewer",
            "free json formatter",
            "json tool",
            "json parser",
            "online json editor",
            "json formatter online free",
            // Vietnamese keywords
            "định dạng json",
            "công cụ json",
            "json online",
            "validate json tiếng việt",
        ],
        openGraph: {
            title: "JSON Formatter Online - Free JSON Beautifier & Validator 2025",
            description: "Format, validate, and beautify JSON data online. Free JSON formatter with syntax highlighting. Fast, secure, and easy to use.",
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title: "JSON Formatter Online - Free JSON Beautifier & Validator",
            description: "Format, validate, and beautify JSON data online. Free JSON formatter with syntax highlighting.",
        },
        alternates: {
            canonical: "https://anytools.online/tools/json-formatter",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

export default function JsonFormatterPage() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <JsonFormatterContent />
            </div>
        </div>
    );
}
