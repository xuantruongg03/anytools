import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import CssUnitConverterContent from "./CssUnitConverterContent";
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
        ? `Chuyển Đổi Đơn Vị CSS - PX sang REM, EM, VW, VH Miễn Phí ${currentYear}`
        : `CSS Unit Converter - Free PX to REM, EM, VW, VH Calculator ${currentYear}`;

    const description = isVi
        ? "Công cụ chuyển đổi đơn vị CSS online miễn phí. Đổi nhanh px sang rem, em, pt, %, vw, vh với cỡ chữ gốc tùy biến. Bảng tra cứu Tailwind CSS tương đương."
        : "Free online CSS unit converter. Convert px to rem, em, pt, %, vw, vh instantly with custom base font size. Includes Tailwind CSS class equivalents.";

    return {
        title,
        description,
        keywords: [
            "css unit converter",
            "px to rem",
            "rem to px",
            "px to em",
            "css converter",
            "tailwind font size",
            "viewport units",
            "responsive typography",
            // Vietnamese keywords
            "chuyển đổi đơn vị css",
            "đổi px sang rem",
            "đổi rem sang px",
            "công cụ css",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/css-unit-converter`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/css-unit-converter`,
            languages: {
                en: "https://anytools.online/en/tools/css-unit-converter",
                vi: "https://anytools.online/vi/tools/css-unit-converter",
                "x-default": "https://anytools.online/en/tools/css-unit-converter",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function CssUnitConverterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/css-unit-converter", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Trình Chuyển Đổi Đơn Vị CSS" : "CSS Unit Converter"}
            description={
                isVi
                    ? "Chuyển đổi tức thì giữa px, rem, em, pt, %, vw, vh với tỷ lệ cỡ chữ gốc tùy biến. Hỗ trợ tra cứu nhanh class Tailwind CSS."
                    : "Instantly convert between px, rem, em, pt, %, vw, and vh with customizable base font size. Includes quick Tailwind CSS lookup."
            }
        >
            <CssUnitConverterContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/css-unit-converter' />
        </ToolPageLayout>
    );
}
