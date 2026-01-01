import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import TailwindCssContent from "./TailwindCssContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Chuyển Đổi Tailwind CSS Sang CSS - Công Cụ Miễn Phí 2026" : "Tailwind CSS to CSS Converter - Free Online Tool 2026";
    const description = isVi ? "Chuyển đổi Tailwind CSS sang CSS thuần và ngược lại. Hoàn hảo để học Tailwind, debug và migrate dự án." : "Free online Tailwind CSS to vanilla CSS converter. Convert Tailwind utility classes to CSS styles and vice versa.";

    return {
        title,
        description,
        keywords: ["tailwind to css", "css to tailwind", "tailwind converter", "tailwind css converter", "utility classes converter", "tailwind to vanilla css", "chuyển tailwind sang css", "chuyển css sang tailwind", "công cụ chuyển đổi tailwind", "học tailwind css"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/tailwind-css`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/tailwind-css`,
            languages: {
                en: "https://anytools.online/en/tools/tailwind-css",
                vi: "https://anytools.online/vi/tools/tailwind-css",
                "x-default": "https://anytools.online/en/tools/tailwind-css",
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

export default async function TailwindCssPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/tailwind-css", 6);

    return (
        <ToolPageLayout title={isVi ? "Chuyển Đổi Tailwind CSS ↔ CSS" : "Tailwind CSS ↔ CSS Converter"} description={isVi ? "Chuyển đổi giữa Tailwind utility classes và CSS thuần. Hoàn hảo để học Tailwind hoặc migrate dự án." : "Convert Tailwind utility classes to vanilla CSS and vice versa. Perfect for learning Tailwind or migrating projects."}>
            <TailwindCssContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/tailwind-css' />
        </ToolPageLayout>
    );
}
