import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import BoxShadowContent from "./BoxShadowContent";
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
        ? `Tạo CSS Box Shadow & Glassmorphism - Thiết Kế Bóng Đổ Trực Quan ${currentYear}`
        : `CSS Box Shadow & Glassmorphism Generator - Free Multi-layer UI Tool ${currentYear}`;

    const description = isVi
        ? "Công cụ tạo bóng đổ CSS (box-shadow) đa tầng và hiệu ứng kính mờ glassmorphism trực quan. Xuất mã CSS thuần và Tailwind CSS nhanh chóng."
        : "Free online CSS box shadow & glassmorphism generator. Design smooth multi-layer shadows and frosted glass effects with instant CSS & Tailwind copy.";

    return {
        title,
        description,
        keywords: [
            "css box shadow generator",
            "glassmorphism generator",
            "multi layer box shadow",
            "tailwind shadow generator",
            "css shadow maker",
            "frosted glass css",
            // Vietnamese keywords
            "tạo box shadow css",
            "hiệu ứng kính mờ css",
            "bóng đổ css",
            "công cụ thiết kế css",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/box-shadow-generator`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/box-shadow-generator`,
            languages: {
                en: "https://anytools.online/en/tools/box-shadow-generator",
                vi: "https://anytools.online/vi/tools/box-shadow-generator",
                "x-default": "https://anytools.online/en/tools/box-shadow-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function BoxShadowPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/box-shadow-generator", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Tạo CSS Box Shadow & Kính Mờ" : "Box Shadow & Glassmorphism"}
            description={
                isVi
                    ? "Thiết kế bóng đổ đa tầng mượt mà và hiệu ứng kính mờ hiện đại với điều khiển trực quan. Xuất mã CSS & class Tailwind tức thì."
                    : "Create modern multi-layer CSS box shadows and sleek glassmorphism effects with live preview and Tailwind CSS export."
            }
        >
            <BoxShadowContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/box-shadow-generator' />
        </ToolPageLayout>
    );
}
