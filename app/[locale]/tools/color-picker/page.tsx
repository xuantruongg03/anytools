import type { Metadata } from "next";
import ColorPickerContent from "./ColorPickerContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import { ToolPageLayout } from "@/components/layout";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Bảng Chọn Màu & Chuyển Đổi - HEX, RGB, HSL 2025" : "Color Picker & Converter - HEX, RGB, HSL Color Tool 2025";
    const description = isVi ? "Công cụ chọn màu và chuyển đổi miễn phí. Chọn màu từ bảng màu hoặc trích xuất từ ảnh. Chuyển đổi giữa HEX, RGB, HSL, RGBA ngay lập tức." : "Free online color picker and converter. Pick colors from color wheel or extract colors from uploaded images. Convert between HEX, RGB, HSL, and RGBA formats instantly. Perfect for web designers and developers.";

    return {
        title,
        description,
        keywords: ["color picker", "image color picker", "extract color from image", "hex to rgb", "rgb to hex", "hsl converter", "color converter", "color palette", "web colors", "pick color from image", "bảng chọn màu", "chọn màu từ ảnh", "chuyển đổi màu", "công cụ chọn màu"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://www.anytools.online/${locale}/tools/color-picker`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/color-picker`,
            languages: {
                en: "https://www.anytools.online/en/tools/color-picker",
                vi: "https://www.anytools.online/vi/tools/color-picker",
                "x-default": "https://www.anytools.online/en/tools/color-picker",
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

export default async function ColorPickerPage({ params }: Props) {
    const { locale } = await params;
    const relatedTools = getRelatedTools("/tools/color-picker", 6);
    const isVi = locale === "vi";

    return (
        <ToolPageLayout title={isVi ? "Bảng Chọn Màu & Chuyển Đổi" : "Color Picker & Converter"} description={isVi ? "Chọn màu từ ảnh hoặc bảng màu. Chuyển đổi giữa HEX, RGB, HSL, RGBA. Công cụ hoàn hảo cho nhà thiết kế và lập trình viên." : "Pick colors from images or color wheel. Convert between HEX, RGB, HSL, RGBA formats. Perfect tool for designers and developers."}>
            <ColorPickerContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/color-picker' />
        </ToolPageLayout>
    );
}
