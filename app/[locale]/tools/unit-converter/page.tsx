import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import UnitConverterContent from "./UnitConverterContent";
import { unitConverterTranslations } from "@/lib/i18n/tools/unit-converter";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Quy Đổi Đơn Vị Đo Lường Trực Tuyến Toàn Diện ${getCurrentYear()} | AnyTools`
            : `All-in-One Unit Converter Online ${getCurrentYear()} | AnyTools`,
        description: isVi
            ? "Công cụ chuyển đổi đơn vị đo lường toàn diện: Chiều dài, khối lượng, nhiệt độ, diện tích, thể tích, tốc độ, thời gian, dung lượng số, năng lượng và áp suất."
            : "Free universal all-in-one unit converter: Length, mass/weight, temperature, area, volume, speed, time, digital storage, energy, and pressure.",
        keywords: [
            "unit converter", "chuyen doi don vi", "doi don vi do luong", "metric to imperial converter",
            "celsius to fahrenheit", "kg to lb", "km to miles", "unit converter online"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Công Cụ Quy Đổi Đơn Vị Đo Lường ${getCurrentYear()}`
                : `All-in-One Unit Converter ${getCurrentYear()}`,
            description: isVi
                ? "Chuyển đổi tức thì mọi đơn vị đo lường khoa học và đời sống."
                : "Convert measurement units across 10 categories with instant precision.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/unit-converter",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/unit-converter`,
            languages: {
                en: "https://anytools.online/en/tools/unit-converter",
                vi: "https://anytools.online/vi/tools/unit-converter",
                "x-default": "https://anytools.online/en/tools/unit-converter",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function UnitConverterPage({ params }: Props) {
    const { locale } = await params;
    const t = unitConverterTranslations[locale as "en" | "vi"] || unitConverterTranslations.en;
    const relatedTools = getRelatedTools("/tools/unit-converter", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "UtilityApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/unit-converter`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "10 scientific and daily measurement categories",
            "Simultaneous category comparison matrix for all units",
            "Real-time bidirectional formula explanation display",
            "Configurable floating point decimal precision and scientific notation",
            "100% Client-side instant calculation with privacy"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <UnitConverterContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/unit-converter' />
            </ToolPageLayout>
        </>
    );
}
