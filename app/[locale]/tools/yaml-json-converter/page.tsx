import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import YamlJsonConverterContent from "./YamlJsonConverterContent";
import { yamlJsonConverterTranslations } from "@/lib/i18n/tools/yaml-json-converter";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Chuyển Đổi YAML Sang JSON & JSON Sang YAML Online Miễn Phí ${getCurrentYear()}`
            : `Free YAML to JSON & JSON to YAML Converter Online ${getCurrentYear()}`,
        description: isVi
            ? "Công cụ chuyển đổi 2 chiều giữa YAML và JSON trực tuyến. Tự động kiểm tra lỗi cú pháp, tùy chỉnh thụt dòng 2/4 spaces, nén JSON và tải file về máy."
            : "Convert seamlessly between YAML and JSON online with live real-time bidirectional parsing, syntax validation, indent spacing, and file download.",
        keywords: [
            "yaml to json", "json to yaml", "chuyen yaml sang json",
            "convert yaml to json", "yaml parser online", "yaml validator", "docker compose to json"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Chuyển Đổi YAML & JSON Trực Tuyến ${getCurrentYear()}`
                : `YAML to JSON & JSON to YAML Converter ${getCurrentYear()}`,
            description: isVi
                ? "Chuyển đổi 2 chiều siêu tốc giữa YAML và JSON, kiểm tra lỗi cú pháp chuẩn xác."
                : "Fast bidirectional YAML & JSON conversion with syntax checking and file export.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/yaml-json-converter",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/yaml-json-converter`,
            languages: {
                en: "https://anytools.online/en/tools/yaml-json-converter",
                vi: "https://anytools.online/vi/tools/yaml-json-converter",
                "x-default": "https://anytools.online/en/tools/yaml-json-converter",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function YamlJsonConverterPage({ params }: Props) {
    const { locale } = await params;
    const t = yamlJsonConverterTranslations[locale as "en" | "vi"] || yamlJsonConverterTranslations.en;
    const relatedTools = getRelatedTools("/tools/yaml-json-converter", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "DeveloperApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/yaml-json-converter`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Bidirectional YAML to JSON and JSON to YAML parsing",
            "Syntax validation with real-time error line reporting",
            "2-space and 4-space indentation formatting",
            "Minified single-line JSON export",
            "Direct .yaml and .json file download"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <YamlJsonConverterContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/yaml-json-converter' />
            </ToolPageLayout>
        </>
    );
}
