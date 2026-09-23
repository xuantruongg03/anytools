import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import GlassmorphismGeneratorContent from "./GlassmorphismGeneratorContent";
import { glassmorphismGeneratorTranslations } from "@/lib/i18n/tools/glassmorphism-generator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tạo Hiệu Ứng Kính Mờ (Glassmorphism CSS) Online Miễn Phí ${getCurrentYear()}`
            : `Free Glassmorphism CSS & Tailwind Generator Online ${getCurrentYear()}`,
        description: isVi
            ? "Thiết kế hiệu ứng kính mờ frosted glass chuyên nghiệp, tùy chỉnh blur, độ trong suốt, bo góc và bóng đổ. Xuất mã CSS thuần, Tailwind CSS và React style."
            : "Generate modern Glassmorphism UI styles in real-time. Customize backdrop blur, opacity, border, and shadows. Copy pure CSS, Tailwind CSS, or React styles.",
        keywords: [
            "glassmorphism generator", "tao hieu ung kinh mo", "glassmorphism css",
            "frosted glass css", "tailwind backdrop blur", "neumorphism generator", "glass ui generator"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tạo Hiệu Ứng Kính Mờ Glassmorphism CSS ${getCurrentYear()}`
                : `Glassmorphism CSS Generator Online ${getCurrentYear()}`,
            description: isVi
                ? "Bộ công cụ trực quan tạo giao diện kính mờ hiện đại và xuất mã nhanh."
                : "Real-time frosted glass UI design tool with CSS and Tailwind code export.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/glassmorphism-generator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/glassmorphism-generator`,
            languages: {
                en: "https://anytools.online/en/tools/glassmorphism-generator",
                vi: "https://anytools.online/vi/tools/glassmorphism-generator",
                "x-default": "https://anytools.online/en/tools/glassmorphism-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function GlassmorphismGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const t = glassmorphismGeneratorTranslations[locale as "en" | "vi"] || glassmorphismGeneratorTranslations.en;
    const relatedTools = getRelatedTools("/tools/glassmorphism-generator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "DesignApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/glassmorphism-generator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Real-time Interactive Glass Preview with Vivid Backdrops",
            "Backdrop Blur, Opacity, Saturation, Border, and Shadow Sliders",
            "One-Click Code Export for CSS, Tailwind CSS, and React",
            "Frosted, Smoked Dark, Glossy, and Neon Presets"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <GlassmorphismGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/glassmorphism-generator' />
            </ToolPageLayout>
        </>
    );
}
