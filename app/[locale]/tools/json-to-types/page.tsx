import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import JsonToTypesContent from "./JsonToTypesContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const currentYear = new Date().getFullYear();

    const title = isVi
        ? `Chuyển JSON Sang TypeScript & YAML - Tự Động Tạo Interface ${currentYear}`
        : `JSON to TypeScript & YAML Converter - Free Type Inference Tool ${currentYear}`;

    const description = isVi
        ? "Công cụ chuyển đổi JSON sang TypeScript interface, Type aliases hoặc YAML trực tuyến miễn phí. Tự động suy luận kiểu dữ liệu, tùy chỉnh thuộc tính tùy chọn."
        : "Free online JSON to TypeScript interface and YAML converter. Automatically infers nested objects, arrays, and types with custom root interface naming.";

    return {
        title,
        description,
        keywords: [
            "json to typescript",
            "json to ts interface",
            "json to type",
            "json to yaml",
            "typescript interface generator",
            "json type inference",
            // Vietnamese keywords
            "chuyển json sang typescript",
            "tạo interface typescript từ json",
            "chuyển json sang yaml",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/json-to-types`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/json-to-types`,
            languages: {
                en: "https://anytools.online/en/tools/json-to-types",
                vi: "https://anytools.online/vi/tools/json-to-types",
                "x-default": "https://anytools.online/en/tools/json-to-types",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function JsonToTypesPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/json-to-types", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Chuyển JSON Sang TypeScript & Types" : "JSON to TypeScript & Types"}
            description={
                isVi
                    ? "Chuyển đổi dữ liệu JSON sang TypeScript Interface, Type hoặc YAML tự động với nhận diện cấu trúc lồng nhau."
                    : "Automatically convert raw JSON payloads into clean TypeScript interfaces, types, or YAML with deep type inference."
            }
        >
            <JsonToTypesContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/json-to-types' />
        </ToolPageLayout>
    );
}
