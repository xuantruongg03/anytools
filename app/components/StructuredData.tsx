"use client";

interface StructuredDataProps {
    type: "WebApplication" | "SoftwareApplication" | "Article";
    name: string;
    description: string;
    url: string;
    keywords?: string[];
    inLanguage?: string[];
}

export function StructuredData({ type, name, description, url, keywords, inLanguage = ["en", "vi"] }: StructuredDataProps) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": type,
        name: name,
        description: description,
        url: url,
        inLanguage: inLanguage,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web Browser",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        ...(keywords && { keywords: keywords.join(", ") }),
    };

    return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />;
}
