import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import HtmlToJsxContent from "./HtmlToJsxContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Chuyển Đổi HTML Sang React JSX Online - Tự Động Chuẩn Hóa Cú Pháp ${getCurrentYear()}` 
            : `HTML to JSX Converter - Clean React JSX / TSX Generator ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ chuyển đổi mã HTML sang React JSX / TSX online miễn phí. Tự động sửa class thành className, chuyển đổi inline styles sang object, chuẩn hóa thuộc tính SVG và thẻ tự đóng." 
            : "Free online HTML to React JSX converter. Automatically converts class to className, transforms inline styles into JS objects, fixes self-closing tags and SVG camelCase attributes.",
        keywords: [
            "html to jsx", "chuyển html sang jsx", "html to react", "convert html to jsx", "jsx converter",
            "react jsx generator", "html to tsx", "convert style to jsx"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools HTML to JSX",
        openGraph: {
            title: locale === "vi" 
                ? `Chuyển Đổi HTML Sang JSX Online - Miễn Phí ${getCurrentYear()}` 
                : `HTML to JSX Converter Online - Free Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Chuyển đổi bất kỳ đoạn mã HTML, Bootstrap hay SVG sang React JSX hợp lệ chỉ với 1 click." 
                : "Convert any HTML snippet, Bootstrap UI, or SVG into clean, valid React JSX in seconds.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/html-to-jsx",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "HTML to JSX Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "HTML to JSX Converter - Free Online Tool",
            description: "Convert HTML to clean, valid React JSX or TSX instantly.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/html-to-jsx`,
            languages: {
                en: "https://anytools.online/en/tools/html-to-jsx",
                vi: "https://anytools.online/vi/tools/html-to-jsx",
                "x-default": "https://anytools.online/en/tools/html-to-jsx",
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

export default function HtmlToJsxPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "HTML to JSX Converter Online",
        applicationCategory: "DeveloperApplication",
        description: "Free online HTML to JSX converter. Convert HTML strings into valid React JSX elements or TypeScript functional components.",
        url: "https://anytools.online/tools/html-to-jsx",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "HTML to JSX / TSX Conversion",
            "Automatic class to className & for to htmlFor",
            "Inline CSS string to React style object",
            "Self-closing void tags (<img />, <input />, <br />)",
            "SVG camelCase attribute conversion (strokeWidth, viewBox)",
            "Component Wrapping (Function Component & TypeScript FC)",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/html-to-jsx", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='HTML to JSX Converter'
                description='Convert raw HTML code into clean, valid React JSX or TSX with automatic inline style parsing and component wrappers.'
            >
                <HtmlToJsxContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/html-to-jsx' />
            </ToolPageLayout>
        </>
    );
}
