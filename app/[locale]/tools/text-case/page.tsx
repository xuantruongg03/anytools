import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import TextCaseContent from "./TextCaseContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Chuyển Đổi Kiểu Chữ - Đổi Chữ Hoa Thường Miễn Phí 2026" : "Text Case Converter - Uppercase, Lowercase, Title Case 2026";
    const description = isVi ? "Chuyển đổi văn bản sang CHỮ HOA, chữ thường, Kiểu Tiêu Đề, camelCase, snake_case và kebab-case ngay lập tức." : "Free online text case converter. Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case instantly.";

    return {
        title,
        description,
        keywords: ["text case converter", "uppercase converter", "lowercase converter", "title case converter", "camelCase converter", "snake_case converter", "chuyển đổi chữ hoa thường", "công cụ chuyển đổi chữ"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/text-case`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/text-case`,
            languages: {
                en: "https://anytools.online/en/tools/text-case",
                vi: "https://anytools.online/vi/tools/text-case",
                "x-default": "https://anytools.online/en/tools/text-case",
            },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}

export default async function TextCasePage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/text-case", 6);

    return (
        <ToolPageLayout title={isVi ? "Chuyển Đổi Kiểu Chữ" : "Text Case Converter"} description={isVi ? "Chuyển đổi văn bản sang CHỮ HOA, chữ thường, Kiểu Tiêu Đề, camelCase, snake_case và kebab-case." : "Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case instantly."}>
            <TextCaseContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/text-case' />
        </ToolPageLayout>
    );
}
