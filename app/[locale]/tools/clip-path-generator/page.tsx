import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import ClipPathGeneratorContent from "./ClipPathGeneratorContent";
import { clipPathTranslations } from "@/lib/i18n/tools/clip-path-generator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tạo Hình Khối Đa Giác & CSS Clip-Path Online ${getCurrentYear()} | AnyTools`
            : `CSS Clip-Path & Shape Generator ${getCurrentYear()} | AnyTools`,
        description: isVi
            ? "Công cụ tạo hình khối và đường cắt đa giác polygon bằng CSS clip-path trực quan. Kéo thả điểm đỉnh linh hoạt, hỗ trợ xuất mã Tailwind CSS và SVG clipPath."
            : "Generate custom polygon geometric shapes and CSS clip-path cutouts with an interactive draggable canvas. Export clean CSS, Tailwind, and SVG clipPath.",
        keywords: [
            "css clip path generator", "clip path polygon generator", "tao hieu ung clip path", "polygon css generator",
            "tailwind clip path", "svg clippath generator", "cat hinh css"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tạo Hình Khối & CSS Clip-Path ${getCurrentYear()}`
                : `CSS Clip-Path Generator ${getCurrentYear()}`,
            description: isVi
                ? "Kéo thả định hình đa giác và xuất mã clip-path tức thì."
                : "Create custom geometric polygon shapes with interactive draggable canvas.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/clip-path-generator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/clip-path-generator`,
            languages: {
                en: "https://anytools.online/en/tools/clip-path-generator",
                vi: "https://anytools.online/vi/tools/clip-path-generator",
                "x-default": "https://anytools.online/en/tools/clip-path-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ClipPathPage({ params }: Props) {
    const { locale } = await params;
    const t = clipPathTranslations[locale as "en" | "vi"] || clipPathTranslations.en;
    const relatedTools = getRelatedTools("/tools/clip-path-generator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "DesignApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/clip-path-generator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Interactive draggable polygon vertex editor with touch and mouse support",
            "12+ standard and creative geometric shape presets",
            "5% grid snapping and vertex coordinate inspector",
            "Instant CSS clip-path, Tailwind arbitrary class, and SVG clipPath generation",
            "100% Client-side high performance processing"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <ClipPathGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/clip-path-generator' />
            </ToolPageLayout>
        </>
    );
}
