import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import UuidGeneratorContent from "./UuidGeneratorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Tạo UUID/GUID - Công Cụ Tạo UUID v1, v4 Miễn Phí 2025" : "UUID Generator Online - Free UUID v1, v4 GUID Generator Tool 2025";
    const description = isVi ? "Tạo UUID/GUID trực tuyến ngay lập tức. Tạo UUID v4 (ngẫu nhiên) và UUID v1 (dựa trên thời gian) với hỗ trợ tạo hàng loạt. Công cụ tạo UUID miễn phí, nhanh và an toàn cho lập trình viên." : "Generate UUID/GUID online instantly. Create UUID v4 (random) and UUID v1 (timestamp-based) with bulk generation support. Free, fast, and secure UUID generator for developers.";

    return {
        title,
        description,
        keywords: ["uuid generator", "guid generator", "uuid v4", "uuid v1", "generate uuid online", "random uuid", "unique identifier", "uuid tool", "bulk uuid generator", "free uuid generator", "universally unique identifier", "globally unique identifier", "random uuid generator", "timestamp uuid", "tạo uuid", "uuid trực tuyến", "công cụ uuid", "tạo mã uuid"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools UUID Generator",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/uuid-generator`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
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
            canonical: `https://anytools.online/${locale}/tools/uuid-generator`,
            languages: {
                en: "https://anytools.online/en/tools/uuid-generator",
                vi: "https://anytools.online/vi/tools/uuid-generator",
                "x-default": "https://anytools.online/en/tools/uuid-generator",
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

export default async function UuidGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Tạo UUID Trực Tuyến" : "UUID Generator Online",
        applicationCategory: "DeveloperApplication",
        description: isVi ? "Công cụ tạo UUID/GUID miễn phí trực tuyến. Tạo UUID v4 (ngẫu nhiên) và UUID v1 (dựa trên thời gian) với hỗ trợ tạo hàng loạt." : "Free online UUID/GUID generator. Create UUID v4 (random) and UUID v1 (timestamp-based) with bulk generation support.",
        url: `https://anytools.online/${locale}/tools/uuid-generator`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["UUID v4 (Random) Generation", "UUID v1 (Timestamp-based) Generation", "Bulk UUID Generation", "One-click Copy to Clipboard", "100% Browser-based", "No Data Sent to Server"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/uuid-generator", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Tạo UUID/GUID" : "UUID Generator"} description={isVi ? "Tạo UUID/GUID trực tuyến ngay lập tức. Tạo UUID v4 và UUID v1 với hỗ trợ tạo hàng loạt." : "Generate UUID/GUID online instantly. Create UUID v4 and v1 with bulk generation support."}>
                <UuidGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/uuid-generator' />
            </ToolPageLayout>
        </>
    );
}
