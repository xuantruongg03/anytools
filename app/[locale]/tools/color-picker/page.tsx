import type { Metadata } from "next";
import ColorPickerContent from "./ColorPickerContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Color Picker & Converter - HEX, RGB, HSL Color Tool 2025",
        description: "Free online color picker and converter. Pick colors from color wheel or extract colors from uploaded images. Convert between HEX, RGB, HSL, and RGBA formats instantly. Perfect for web designers and developers.",
        keywords: ["color picker", "image color picker", "extract color from image", "hex to rgb", "rgb to hex", "hsl converter", "color converter", "color palette", "web colors", "pick color from image", "bảng chọn màu", "chọn màu từ ảnh", "chuyển đổi màu", "công cụ chọn màu"],
        openGraph: {
            title: "Color Picker & Converter - Free Online Tool",
            description: "Pick colors from images or color wheel and convert between HEX, RGB, and HSL formats.",
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title: "Color Picker & Converter - Free Online Tool",
            description: "Pick colors from images or color wheel and convert between HEX, RGB, and HSL formats.",
        },
        alternates: {
            canonical: "https://anytools.online/tools/color-picker",
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

export default function ColorPickerPage() {
    const relatedTools = getRelatedTools("/tools/color-picker", 6);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <ColorPickerContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/color-picker' />
            </div>
        </div>
    );
}
