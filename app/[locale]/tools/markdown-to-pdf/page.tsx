import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import MarkdownToPdfContent from "./MarkdownToPdfContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Chuyển Markdown Sang PDF Đẹp Mắt Online - Chuẩn In Ấn Vector ${getCurrentYear()}` 
            : `Markdown to PDF Converter - Beautiful Styled Vector PDF ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ chuyển đổi Markdown sang PDF online miễn phí. Hỗ trợ giao diện GitHub, báo cáo Academic và Minimalist, xuất file in PDF chất lượng vector sắc nét." 
            : "Free online Markdown to PDF converter tool. Export styled vector PDFs with GitHub, Academic, and Minimalist themes with code syntax highlighting and table formatting.",
        keywords: [
            "markdown to pdf", "chuyển markdown sang pdf", "markdown pdf converter", "export markdown to pdf",
            "in markdown thành pdf", "markdown editor to pdf", "convert md to pdf"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Markdown to PDF",
        openGraph: {
            title: locale === "vi" 
                ? `Chuyển Đổi Markdown Sang PDF Đẹp Mắt Online ${getCurrentYear()}` 
                : `Markdown to PDF Converter - Free Styled PDF Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Chuyển tài liệu Markdown thành file PDF chuyên nghiệp chỉ trong vài giây." 
                : "Transform Markdown notes and documentation into beautifully styled PDF documents.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/markdown-to-pdf",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Markdown to PDF Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Markdown to PDF Converter - Free Online Tool",
            description: "Convert Markdown to styled vector PDF documents.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/markdown-to-pdf`,
            languages: {
                en: "https://anytools.online/en/tools/markdown-to-pdf",
                vi: "https://anytools.online/vi/tools/markdown-to-pdf",
                "x-default": "https://anytools.online/en/tools/markdown-to-pdf",
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
        classification: "Text Tools",
    };
}

export default function MarkdownToPdfPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Markdown to PDF Converter Online",
        applicationCategory: "DocumentApplication",
        description: "Free online Markdown to PDF converter. Format Markdown text into styled vector PDF documents with multiple themes.",
        url: "https://anytools.online/tools/markdown-to-pdf",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Live Two-Pane Markdown Editor & Preview",
            "Multiple Document Themes (GitHub, Academic, Minimalist)",
            "Vector Printing & PDF Export (A4 standard)",
            "Full GFM Markdown Support (Tables, Code blocks, Blockquotes)",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/markdown-to-pdf", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Markdown to PDF Converter'
                description='Convert Markdown documents into beautifully styled vector PDF files with GitHub, Academic, and Minimalist themes.'
            >
                <MarkdownToPdfContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/markdown-to-pdf' />
            </ToolPageLayout>
        </>
    );
}
