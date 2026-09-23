import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import NeumorphismGeneratorContent from "./NeumorphismGeneratorContent";
import { neumorphismTranslations } from "@/lib/i18n/tools/neumorphism-generator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tạo Hiệu Ứng Neumorphism & Claymorphism 3D CSS Online ${getCurrentYear()} | AnyTools`
            : `Neumorphism & Claymorphism 3D CSS Generator ${getCurrentYear()} | AnyTools`,
        description: isVi
            ? "Tạo hiệu ứng Neumorphism (Soft UI nổi) và hiệu ứng Claymorphism 3D phồng tròn bằng CSS thuần và Tailwind CSS. Tùy chỉnh góc bóng, độ nhòe, màu sắc tức thì."
            : "Generate soft tactile Neumorphism and 3D puffy Claymorphism UI effects with pure CSS and Tailwind CSS classes. Customizable dual shadows, angles, and inset bevels.",
        keywords: [
            "neumorphism generator", "claymorphism generator", "soft ui css generator", "tao hieu ung neumorphism",
            "css box shadow generator", "3d claymorphism css", "neumorphic button generator"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tạo Hiệu Ứng Neumorphism & Claymorphism 3D CSS ${getCurrentYear()}`
                : `Neumorphism & Claymorphism 3D CSS Generator ${getCurrentYear()}`,
            description: isVi
                ? "Thiết kế giao diện Soft UI và hiệu ứng nổi khối 3D mềm mại, xuất mã CSS & Tailwind nhanh chóng."
                : "Create tactile Soft UI and 3D puffy Claymorphism styles with instant CSS / Tailwind export.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/neumorphism-generator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/neumorphism-generator`,
            languages: {
                en: "https://anytools.online/en/tools/neumorphism-generator",
                vi: "https://anytools.online/vi/tools/neumorphism-generator",
                "x-default": "https://anytools.online/en/tools/neumorphism-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function NeumorphismPage({ params }: Props) {
    const { locale } = await params;
    const t = neumorphismTranslations[locale as "en" | "vi"] || neumorphismTranslations.en;
    const relatedTools = getRelatedTools("/tools/neumorphism-generator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "DesignApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/neumorphism-generator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Neumorphism dual shadow generator with light source angles",
            "Claymorphism 3D pillowy inflated bevel generator",
            "Convex, concave, flat, and inset pressed surface shapes",
            "Instant Pure CSS and Tailwind CSS arbitrary value code generation",
            "Live interactive component preview (card, button, input)"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <NeumorphismGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/neumorphism-generator' />
            </ToolPageLayout>
        </>
    );
}
