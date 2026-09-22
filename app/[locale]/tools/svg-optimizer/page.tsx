import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import SvgOptimizerContent from "./SvgOptimizerContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Nén & Tối Ưu Hóa SVG Online - Giảm Dung Lượng File SVG ${getCurrentYear()}` 
            : `SVG Optimizer & Minifier - Clean & Compress SVG Online ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ tối ưu hóa và nén file SVG online miễn phí. Xóa sạch metadata thừa từ Illustrator/Inkscape, làm gọn tọa độ, giảm dung lượng tệp SVG tối đa mà không giảm chất lượng." 
            : "Free online SVG optimizer and minifier. Strip bloated editor metadata, round coordinate decimals, clean unused tags, and compress SVG files without losing visual fidelity.",
        keywords: [
            "svg optimizer", "nén file svg", "svg minifier", "tối ưu hóa svg", "compress svg online",
            "clean svg code", "svgo online", "svg size reducer"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools SVG Optimizer",
        openGraph: {
            title: locale === "vi" 
                ? `Nén File SVG Online Chuẩn Web - Giảm Dung Lượng Tức Thì ${getCurrentYear()}` 
                : `SVG Optimizer & Minifier - Free Online Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Dọn sạch mã rác và nén file SVG từ 30% đến 60% trực tiếp trên trình duyệt." 
                : "Clean bloated vector metadata and compress SVGs by 30% to 60% in your browser.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/svg-optimizer",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "SVG Optimizer Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "SVG Optimizer & Minifier - Free Online Tool",
            description: "Compress SVG files and clean vector metadata instantly.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/svg-optimizer`,
            languages: {
                en: "https://anytools.online/en/tools/svg-optimizer",
                vi: "https://anytools.online/vi/tools/svg-optimizer",
                "x-default": "https://anytools.online/en/tools/svg-optimizer",
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
        classification: "Design Tools",
    };
}

export default function SvgOptimizerPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "SVG Optimizer & Minifier Online",
        applicationCategory: "DesignApplication",
        description: "Free online SVG optimizer and minifier. Clean editor metadata, round coordinate decimals, and compress SVG files.",
        url: "https://anytools.online/tools/svg-optimizer",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "SVG XML Declaration and DOCTYPE Removal",
            "Illustrator and Inkscape Metadata Stripping",
            "Path Coordinate Decimal Rounding",
            "Side-by-Side Visual Comparison",
            "Compression Percentage Calculation",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/svg-optimizer", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='SVG Optimizer & Minifier'
                description='Minify and clean bloated SVG files online with side-by-side visual comparison and coordinate precision control.'
            >
                <SvgOptimizerContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/svg-optimizer' />
            </ToolPageLayout>
        </>
    );
}
