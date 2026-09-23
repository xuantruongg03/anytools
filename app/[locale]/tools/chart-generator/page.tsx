import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import ChartGeneratorContent from "./ChartGeneratorContent";
import { chartGeneratorTranslations } from "@/lib/i18n/tools/chart-generator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tạo Biểu Đồ & Đồ Thị Trực Tuyến Nhanh ${getCurrentYear()} | AnyTools`
            : `Quick Chart & Graph Maker Online ${getCurrentYear()} | AnyTools`,
        description: isVi
            ? "Tạo biểu đồ hình cột, đường gấp khúc, miền diện tích, biểu đồ tròn và bánh donut online miễn phí. Đổi màu sắc linh hoạt, xuất ảnh PNG 2X hoặc vector SVG sắc nét."
            : "Create presentations-ready charts online: Bar, Horizontal Bar, Line, Area, Pie, and Donut charts. Customizable color palettes with high-res PNG and vector SVG download.",
        keywords: [
            "chart generator", "graph maker", "tao bieu do online", "ve bieu do cot", "ve bieu do tron",
            "pie chart maker", "bar chart generator", "svg chart generator"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tạo Biểu Đồ & Đồ Thị Online ${getCurrentYear()}`
                : `Quick Chart & Graph Maker ${getCurrentYear()}`,
            description: isVi
                ? "Thiết kế biểu đồ cột, đường, tròn đẹp mắt và xuất ảnh PNG / SVG tức thì."
                : "Create custom presentation-ready charts with instant PNG and SVG export.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/chart-generator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/chart-generator`,
            languages: {
                en: "https://anytools.online/en/tools/chart-generator",
                vi: "https://anytools.online/vi/tools/chart-generator",
                "x-default": "https://anytools.online/en/tools/chart-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ChartGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const t = chartGeneratorTranslations[locale as "en" | "vi"] || chartGeneratorTranslations.en;
    const relatedTools = getRelatedTools("/tools/chart-generator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "BusinessApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/chart-generator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "6 essential chart types: Column Bar, Horizontal Bar, Line, Area, Pie, and Donut",
            "Harmonious designer color palettes with individual color pickers",
            "Interactive live data editor table with customizable row values and labels",
            "Lossless 2x Retina PNG export and clean scalable SVG vector export",
            "100% Client-side browser calculation with full privacy"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <ChartGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/chart-generator' />
            </ToolPageLayout>
        </>
    );
}
