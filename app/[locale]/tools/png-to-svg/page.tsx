import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import PngToSvgContent from "./PngToSvgContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const metadata = {
        en: {
            title: "PNG to SVG Converter - Image to Vector 2026",
            description: "Free online PNG to SVG converter. Transform raster images to vector graphics instantly. Supports tracing and embedding. 100% client-side.",
            keywords: "png to svg, image to svg, convert png to svg, png to svg converter, image to vector, raster to vector, vectorize image, svg converter, free svg converter, online image converter, png to svg online",
        },
        vi: {
            title: "PNG Sang SVG - Chuyển Ảnh Sang Vector 2026",
            description: "Công cụ chuyển đổi PNG sang SVG miễn phí. Chuyển ảnh raster thành đồ họa vector ngay lập tức. Hỗ trợ trace và embed.",
            keywords: "png sang svg, ảnh sang svg, chuyển png sang svg, công cụ chuyển đổi png svg, ảnh sang vector, raster sang vector, vector hóa ảnh, chuyển đổi svg, công cụ svg miễn phí",
        },
    };

    const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.en;

    return {
        title: currentMetadata.title,
        description: currentMetadata.description,
        keywords: currentMetadata.keywords,
        openGraph: {
            title: currentMetadata.title,
            description: currentMetadata.description,
            type: "website",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            url: `https://anytools.online/${locale}/tools/png-to-svg`,
        },
        twitter: {
            card: "summary_large_image",
            title: currentMetadata.title,
            description: currentMetadata.description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/png-to-svg`,
            languages: {
                en: "https://anytools.online/en/tools/png-to-svg",
                vi: "https://anytools.online/vi/tools/png-to-svg",
                "x-default": "https://anytools.online/en/tools/png-to-svg",
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
    };
}

export default async function PngToSvgPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/png-to-svg", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Chuyển đổi PNG sang SVG" : "PNG to SVG Converter",
        applicationCategory: "DesignApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description: isVi ? "Công cụ chuyển đổi PNG sang SVG trực tuyến miễn phí. Hỗ trợ trace (vector hóa) và embed. Xử lý 100% phía client." : "Free online PNG to SVG converter. Supports tracing (vectorization) and embedding modes. 100% client-side processing.",
        featureList: ["Image tracing/vectorization", "Base64 embedding", "Multiple presets", "Advanced options", "Drag and drop upload", "Instant preview", "Download SVG", "Privacy focused"],
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "Is my image uploaded to a server?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "No, all processing happens entirely in your browser using JavaScript. Your images never leave your device, ensuring complete privacy.",
                },
            },
            {
                "@type": "Question",
                name: "What's the difference between Trace and Embed mode?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Trace mode creates true vector graphics by analyzing and recreating shapes as paths - ideal for logos and icons. Embed mode simply wraps the original image in SVG format using base64 encoding - better for photos where you need SVG format but want to preserve all details.",
                },
            },
            {
                "@type": "Question",
                name: "Can I convert photographs to SVG?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Technically yes, but tracing results are usually not ideal for photographs. Photos have millions of colors and subtle gradients that don't convert well to vectors. For photos, use Embed mode to preserve quality.",
                },
            },
            {
                "@type": "Question",
                name: "Why is my traced SVG larger than the original PNG?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Complex images with many colors or details create many vector paths, resulting in larger files. Try reducing the number of colors, using a simpler preset, or switch to Embed mode for photographs.",
                },
            },
        ],
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://anytools.online",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Tools",
                item: "https://anytools.online/#tools",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: "PNG to SVG",
                item: `https://anytools.online/${locale}/tools/png-to-svg`,
            },
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <ToolPageLayout title={isVi ? "Chuyển đổi PNG sang SVG" : "PNG to SVG Converter"} description={isVi ? "Chuyển đổi hình ảnh PNG, JPG sang định dạng SVG vector. Hỗ trợ trace và embed." : "Convert PNG, JPG images to SVG vector format. Supports tracing and embedding modes."}>
                <PngToSvgContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/png-to-svg' />
            </ToolPageLayout>
        </>
    );
}
