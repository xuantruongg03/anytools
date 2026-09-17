interface ToolJsonLdProps {
    name: string;
    description: string;
    url: string;
    categoryName?: string;
    categoryUrl?: string;
    keywords?: string[];
    locale?: string;
}

export function ToolJsonLd({
    name,
    description,
    url,
    categoryName = "Tools",
    categoryUrl,
    keywords,
    locale = "en",
}: ToolJsonLdProps) {
    const baseUrl = "https://anytools.online";
    const homeUrl = `${baseUrl}/${locale}`;

    const appSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: name,
        description: description,
        url: url,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        ...(keywords && keywords.length > 0 && { keywords: keywords.join(", ") }),
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: locale === "vi" ? "Trang chủ" : "Home",
                item: homeUrl,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: categoryName,
                item: categoryUrl || `${homeUrl}#tools`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: name,
                item: url,
            },
        ],
    };

    return (
        <>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
            />
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}
