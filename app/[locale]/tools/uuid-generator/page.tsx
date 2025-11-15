import type { Metadata } from "next";
import UuidGeneratorContent from "./UuidGeneratorContent";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "UUID Generator Online - Free UUID v1, v4 GUID Generator Tool 2025",
        description: "Generate UUID/GUID online instantly. Create UUID v4 (random) and UUID v1 (timestamp-based) with bulk generation support. Free, fast, and secure UUID generator for developers.",
        keywords: ["uuid generator", "guid generator", "uuid v4", "uuid v1", "generate uuid online", "random uuid", "unique identifier", "uuid tool", "bulk uuid generator", "free uuid generator", "universally unique identifier", "globally unique identifier", "random uuid generator", "timestamp uuid", "tạo uuid", "uuid trực tuyến", "công cụ uuid", "tạo mã uuid"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools UUID Generator",
        openGraph: {
            title: "UUID Generator Online - Free UUID/GUID Generator Tool 2025",
            description: "Generate UUID v4 and v1 instantly. Bulk generation support. Free online UUID/GUID generator for developers.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/uuid-generator",
            locale: "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "UUID Generator Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "UUID Generator - Free Online Tool",
            description: "Generate UUID v4 and v1 with bulk support. Fast and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: "https://anytools.online/tools/uuid-generator",
            languages: {
                "en-US": "https://anytools.online/tools/uuid-generator",
                "vi-VN": "https://anytools.online/tools/uuid-generator",
            },
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
        category: "Web Tools",
        classification: "Developer Tools",
    };
}

export default function UuidGeneratorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "UUID Generator Online",
        applicationCategory: "DeveloperApplication",
        description: "Free online UUID/GUID generator. Create UUID v4 (random) and UUID v1 (timestamp-based) with bulk generation support.",
        url: "https://anytools.online/tools/uuid-generator",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["UUID v4 (Random) Generation", "UUID v1 (Timestamp-based) Generation", "Bulk UUID Generation", "One-click Copy to Clipboard", "100% Browser-based", "No Data Sent to Server"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
                <div className='container mx-auto px-4 py-8'>
                    <UuidGeneratorContent />
                </div>
            </div>
        </>
    );
}
