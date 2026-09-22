import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import SqlToTypesContent from "./SqlToTypesContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Chuyển Đổi SQL Sang TypeScript, Zod, Go Struct Online ${getCurrentYear()}` 
            : `SQL to TypeScript, Zod & Go Struct Generator Online ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ chuyển đổi câu lệnh SQL CREATE TABLE sang TypeScript Interface, Zod Schema, Go Struct và C# Class online miễn phí. Hỗ trợ PostgreSQL, MySQL, SQLite." 
            : "Free online SQL to types generator. Convert SQL CREATE TABLE queries into TypeScript interfaces, Zod validation schemas, Go structs, and C# models with PostgreSQL/MySQL support.",
        keywords: [
            "sql to typescript", "sql to zod", "sql to go struct", "sql to types", "convert sql to interface",
            "sql to csharp", "chuyển sql sang typescript", "create table to typescript"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools SQL to Types",
        openGraph: {
            title: locale === "vi" 
                ? `Chuyển Đổi SQL Sang TypeScript & Zod Online ${getCurrentYear()}` 
                : `SQL to Types & Schema Generator - Free Online Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Tự động sinh TypeScript interfaces, Zod schemas và Go structs từ câu lệnh SQL DDL." 
                : "Instantly generate TypeScript interfaces, Zod schemas, and Go structs from SQL CREATE TABLE DDL.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/sql-to-types",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "SQL to Types Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "SQL to Types & Schema Generator - Free Online Tool",
            description: "Convert SQL CREATE TABLE to TypeScript, Zod, Go structs, and C# classes.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/sql-to-types`,
            languages: {
                en: "https://anytools.online/en/tools/sql-to-types",
                vi: "https://anytools.online/vi/tools/sql-to-types",
                "x-default": "https://anytools.online/en/tools/sql-to-types",
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

export default function SqlToTypesPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "SQL to Types Generator Online",
        applicationCategory: "DeveloperApplication",
        description: "Free online SQL to types generator. Convert SQL CREATE TABLE queries into TypeScript interfaces, Zod validation schemas, and Go structs.",
        url: "https://anytools.online/tools/sql-to-types",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "SQL CREATE TABLE DDL Parsing",
            "TypeScript Interface Generation",
            "Zod Schema Generation with Validations",
            "Go Struct Generation with JSON and DB tags",
            "C# Class Model Generation",
            "CamelCase & Nullable Column Handling",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/sql-to-types", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='SQL to TypeScript & Schema Generator'
                description='Convert SQL CREATE TABLE statements into TypeScript interfaces, Zod validation schemas, and Go structs with full type safety.'
            >
                <SqlToTypesContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/sql-to-types' />
            </ToolPageLayout>
        </>
    );
}
