import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import UrlParserContent from "./UrlParserContent";
import { urlParserTranslations } from "@/lib/i18n/tools/url-parser";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Phân Tích URL & Tạo Link UTM Campaign Marketing Online ${getCurrentYear()}`
            : `Free URL Parser, Query Inspector & UTM Campaign Builder ${getCurrentYear()}`,
        description: isVi
            ? "Phân tích cấu trúc URL, bóc tách protocol, domain, đường dẫn và tham số query. Tạo liên kết gắn mã UTM theo dõi chiến dịch Google Analytics 4 chuẩn xác."
            : "Deconstruct URLs into protocol, hostname, path, and query strings. Live query editor and Google Analytics UTM campaign builder for marketers and web developers.",
        keywords: [
            "url parser", "phan tich url", "utm builder", "tao link utm",
            "query parameter editor", "decode url", "google analytics utm"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Phân Tích URL & Tạo Link UTM Marketing Online ${getCurrentYear()}`
                : `URL Parser & UTM Campaign Link Builder ${getCurrentYear()}`,
            description: isVi
                ? "Bóc tách thành phần URL và gắn thẻ UTM theo dõi chiến dịch quảng cáo."
                : "Inspect query strings and construct trackable UTM marketing links.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/url-parser",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/url-parser`,
            languages: {
                en: "https://anytools.online/en/tools/url-parser",
                vi: "https://anytools.online/vi/tools/url-parser",
                "x-default": "https://anytools.online/en/tools/url-parser",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function UrlParserPage({ params }: Props) {
    const { locale } = await params;
    const t = urlParserTranslations[locale as "en" | "vi"] || urlParserTranslations.en;
    const relatedTools = getRelatedTools("/tools/url-parser", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "DeveloperApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/url-parser`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Full URL structural decomposition (Protocol, Host, Port, Path, Anchor)",
            "Dynamic query parameter table with real-time key-value editing",
            "Google Analytics 4 UTM campaign builder with quick presets",
            "Automatic URI encoding and decoding toggle",
            "100% private in-browser client-side execution"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <UrlParserContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/url-parser' />
            </ToolPageLayout>
        </>
    );
}
