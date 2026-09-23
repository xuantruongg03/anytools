import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import AspectRatioContent from "./AspectRatioContent";
import { aspectRatioTranslations } from "@/lib/i18n/tools/aspect-ratio-calculator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tính Tỉ Lệ Khung Hình & Mật Độ Điểm Ảnh PPI Màn Hình Online ${getCurrentYear()}`
            : `Aspect Ratio & Screen PPI Density Calculator ${getCurrentYear()}`,
        description: isVi
            ? "Tính tỉ lệ màn hình (16:9, 4:3, 9:16, 21:9), quy đổi kích thước ảnh/video chuẩn không bị méo và tính mật độ điểm ảnh PPI màn hình online chính xác."
            : "Calculate and simplify aspect ratios (16:9, 4:3, 9:16, 21:9), solve proportional resize dimensions, and compute display PPI pixel density online.",
        keywords: [
            "aspect ratio calculator", "tinh ti le man hinh", "tinh ppi", "screen ppi calculator",
            "resize dimension ratio", "ti le 16 9", "ti le anh video"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tính Tỉ Lệ Khung Hình & PPI Màn Hình Online ${getCurrentYear()}`
                : `Aspect Ratio & Screen PPI Calculator ${getCurrentYear()}`,
            description: isVi
                ? "Tính tỉ lệ khung hình chuẩn và độ nét màn hình PPI không bị méo ảnh."
                : "Simplify aspect ratios and compute display pixel density.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/aspect-ratio-calculator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/aspect-ratio-calculator`,
            languages: {
                en: "https://anytools.online/en/tools/aspect-ratio-calculator",
                vi: "https://anytools.online/vi/tools/aspect-ratio-calculator",
                "x-default": "https://anytools.online/en/tools/aspect-ratio-calculator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function AspectRatioPage({ params }: Props) {
    const { locale } = await params;
    const t = aspectRatioTranslations[locale as "en" | "vi"] || aspectRatioTranslations.en;
    const relatedTools = getRelatedTools("/tools/aspect-ratio-calculator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "MultimediaApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/aspect-ratio-calculator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Automatic aspect ratio simplification using Greatest Common Divisor (GCD)",
            "Bidirectional proportional resize solver with locked ratio",
            "Real-time visual rectangle geometric aspect ratio preview",
            "Display screen pixel density (PPI) and dot pitch calculator with device presets",
            "100% Client-side privacy and instant calculation"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <AspectRatioContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/aspect-ratio-calculator' />
            </ToolPageLayout>
        </>
    );
}
