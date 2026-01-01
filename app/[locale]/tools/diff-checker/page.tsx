import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import DiffCheckerClient from "./DiffCheckerClient";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "So Sánh Văn Bản - Công Cụ Diff Checker Miễn Phí 2026" : "Diff Checker - Text Comparison Tool Online Free 2026";
    const description = isVi ? "So sánh hai văn bản và tìm sự khác biệt trực tuyến. Công cụ diff checker miễn phí để so sánh file, code, tài liệu." : "Compare two texts and find differences online. Free diff checker tool to compare text files, code, documents. Highlight changes instantly.";

    return {
        title,
        description,
        keywords: ["diff checker", "text comparison", "compare text", "text diff", "file comparison", "so sánh văn bản", "so sánh code", "tìm sự khác biệt"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/diff-checker`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/diff-checker`,
            languages: {
                en: "https://anytools.online/en/tools/diff-checker",
                vi: "https://anytools.online/vi/tools/diff-checker",
                "x-default": "https://anytools.online/en/tools/diff-checker",
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

export default async function DiffCheckerPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/diff-checker", 6);

    return (
        <ToolPageLayout title={isVi ? "So Sánh Văn Bản" : "Diff Checker"} description={isVi ? "So sánh hai văn bản và tìm sự khác biệt trực tuyến. Công cụ miễn phí để so sánh file, code, tài liệu." : "Compare two texts and find differences online. Free diff checker tool to compare text files, code, documents."}>
            <DiffCheckerClient />
            <RelatedTools tools={relatedTools} currentPath='/tools/diff-checker' />
        </ToolPageLayout>
    );
}
