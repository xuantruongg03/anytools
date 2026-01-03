import type { Metadata } from "next";
import { use } from "react";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import PlaceholderImageClient from "./PlaceholderImageClient";
import PlaceholderImageContent from "./PlaceholderImageContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    const title = isVi ? "Placeholder Image Generator - Tạo Ảnh Giữ Chỗ Online Miễn Phí 2026" : "Placeholder Image Generator - Free Placeholder Images API 2026";

    const description = isVi ? "Tạo ảnh giữ chỗ với kích thước tùy chỉnh. API đơn giản: /api/placeholder-image/640x480. Hỗ trợ gradient, solid color, pattern. Miễn phí, không giới hạn." : "Generate placeholder images with custom sizes. Simple API: /api/placeholder-image/640x480. Supports gradients, solid colors, patterns. Free & unlimited.";

    const keywords = isVi
        ? ["placeholder image", "ảnh giữ chỗ", "tạo ảnh giữ chỗ", "placeholder image generator", "placeholder image api", "dummy image", "ảnh mẫu", "hình ảnh placeholder", "image placeholder online", "tạo hình ảnh kích thước tùy chỉnh"]
        : ["placeholder image", "placeholder image generator", "placeholder image api", "dummy image generator", "placeholder.com alternative", "picsum alternative", "custom size image", "generate placeholder", "image placeholder service", "free placeholder images", "developer placeholder images"];

    return {
        title,
        description,
        keywords,
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Placeholder Image Generator",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/placeholder-image`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/api/placeholder-image/1200x630?category=gradient",
                    width: 1200,
                    height: 630,
                    alt: "Placeholder Image Generator",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            creator: "@anytools",
            images: ["https://anytools.online/api/placeholder-image/1200x630?category=gradient"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/placeholder-image`,
            languages: {
                en: "https://anytools.online/en/tools/placeholder-image",
                vi: "https://anytools.online/vi/tools/placeholder-image",
                "x-default": "https://anytools.online/en/tools/placeholder-image",
            },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        category: "Web Tools",
        classification: "Developer Tools",
    };
}

export default function PlaceholderImagePage({ params }: Props) {
    const { locale: urlLocale } = use(params);
    const locale = (urlLocale === "en" || urlLocale === "vi" ? urlLocale : "en") as "en" | "vi";
    const relatedTools = getRelatedTools("/tools/placeholder-image", 6);
    const isVi = locale === "vi";

    return (
        <ToolPageLayout title={isVi ? "Placeholder Image Generator" : "Placeholder Image Generator"} description={isVi ? "Tạo ảnh giữ chỗ với kích thước tùy chỉnh. API đơn giản, miễn phí, không giới hạn." : "Generate placeholder images with custom sizes. Simple API, free, unlimited."}>
            <PlaceholderImageClient />
            <PlaceholderImageContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/placeholder-image' />
        </ToolPageLayout>
    );
}
