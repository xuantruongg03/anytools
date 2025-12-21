import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import SvgPreviewContent from "./SvgPreviewContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const metadata = {
        en: {
            title: "SVG Preview - Free Online SVG Viewer & Editor Tool 2025 | AnyTools",
            description: "Free online SVG preview tool. View, edit, format, minify and convert SVG files instantly. Real-time preview with zoom, grid overlay, and PNG export. Best SVG viewer for developers and designers.",
            keywords: "svg preview, svg viewer, svg editor online, svg formatter, svg minifier, svg to png, svg validator, view svg online, svg code editor, svg optimizer, free svg tool, scalable vector graphics, svg converter",
        },
        vi: {
            title: "Xem trước SVG - Công cụ xem & chỉnh sửa SVG trực tuyến miễn phí 2025 | AnyTools",
            description: "Công cụ xem trước SVG trực tuyến miễn phí. Xem, chỉnh sửa, định dạng, nén và chuyển đổi file SVG ngay lập tức. Xem trước thời gian thực với zoom, lưới hỗ trợ và xuất PNG. Trình xem SVG tốt nhất cho lập trình viên và nhà thiết kế.",
            keywords: "xem trước svg, svg viewer, chỉnh sửa svg online, định dạng svg, nén svg, svg sang png, xác thực svg, xem svg trực tuyến, trình soạn svg, tối ưu svg, công cụ svg miễn phí, đồ họa vector",
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
            url: `https://anytools.online/${locale}/tools/svg-preview`,
        },
        twitter: {
            card: "summary_large_image",
            title: currentMetadata.title,
            description: currentMetadata.description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/svg-preview`,
            languages: {
                en: "https://anytools.online/en/tools/svg-preview",
                vi: "https://anytools.online/vi/tools/svg-preview",
                "x-default": "https://anytools.online/en/tools/svg-preview",
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

export default async function SvgPreviewPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/svg-preview", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Xem trước SVG - Trình xem & chỉnh sửa SVG" : "SVG Preview - SVG Viewer & Editor",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description: isVi ? "Công cụ xem trước SVG trực tuyến miễn phí. Xem, chỉnh sửa, định dạng, nén và chuyển đổi file SVG ngay lập tức với xem trước thời gian thực." : "Free online SVG preview tool. View, edit, format, minify and convert SVG files instantly with real-time preview.",
        featureList: ["Real-time SVG preview", "SVG validation", "Code formatting", "SVG minification", "Custom background color", "Grid overlay", "Zoom control", "Export to PNG", "Download SVG"],
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "Is my SVG code stored on your servers?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "No, all processing happens entirely in your browser. Your SVG code never leaves your device, ensuring complete privacy and security.",
                },
            },
            {
                "@type": "Question",
                name: "What's the maximum SVG size I can preview?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "There's no hard limit, but very large SVGs (millions of elements) may slow down your browser. For best performance, keep SVGs under 1MB.",
                },
            },
            {
                "@type": "Question",
                name: "Can I preview animated SVGs?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes! SVG animations using CSS or SMIL will play in the preview. However, JavaScript-based animations require the full HTML context.",
                },
            },
            {
                "@type": "Question",
                name: "How do I convert SVG to PNG?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Simply paste your SVG code, verify the preview looks correct, then click the 'Download PNG' button. The tool will convert your SVG to a PNG file automatically.",
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
                name: "SVG Preview",
                item: `https://anytools.online/${locale}/tools/svg-preview`,
            },
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <ToolPageLayout title={isVi ? "Xem trước SVG" : "SVG Preview"} description={isVi ? "Xem, chỉnh sửa và tối ưu hóa file SVG theo thời gian thực. Hỗ trợ zoom, lưới và xuất PNG." : "View, edit and optimize SVG files in real-time. Support zoom, grid overlay and PNG export."}>
                <SvgPreviewContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/svg-preview' />
            </ToolPageLayout>
        </>
    );
}
