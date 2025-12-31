import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import PromoImageContent from "./PromoImageContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Tạo Ảnh Promo - Thiết Kế Banner Online Miễn Phí 2025 | AnyTools" : "Promo Image Generator - Free Online Banner Design Tool 2025 | AnyTools";
    const description = isVi ? "Tạo ảnh quảng cáo chuyên nghiệp với kích thước tùy chỉnh. Ghép ảnh vào khung gradient đẹp mắt, hỗ trợ xuất PNG/JPEG chất lượng cao. Miễn phí, không cần đăng nhập." : "Create professional promotional images with custom dimensions. Combine images with beautiful gradient backgrounds, export high-quality PNG/JPEG. Free, no login required.";

    return {
        title,
        description,
        keywords: ["promo image generator", "banner creator", "promotional image", "image editor", "gradient background", "chrome web store promo", "extension banner", "tạo ảnh quảng cáo", "thiết kế banner", "ảnh promo", "gradient nền", "công cụ thiết kế", "free banner maker", "online image creator", "custom size image", "1280x800", "chrome store image", "app promo"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Promo Image Generator",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/promo-image-generator`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Promo Image Generator Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isVi ? "Tạo Ảnh Promo - Thiết Kế Banner Miễn Phí" : "Promo Image Generator - Free Banner Design",
            description: isVi ? "Công cụ tạo ảnh quảng cáo chuyên nghiệp online. Miễn phí và dễ sử dụng." : "Professional promo image creator online. Free and easy to use.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/promo-image-generator`,
            languages: {
                en: "https://anytools.online/en/tools/promo-image-generator",
                vi: "https://anytools.online/vi/tools/promo-image-generator",
            },
        },
    };
}

export default async function PromoImageGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/promo-image-generator");

    return (
        <ToolPageLayout title={isVi ? "Tạo Ảnh Quảng Cáo" : "Promo Image Generator"} description={isVi ? "Tạo ảnh quảng cáo chuyên nghiệp với kích thước tùy chỉnh" : "Create professional promotional images with custom dimensions"}>
            <PromoImageContent locale={locale as "en" | "vi"} />
            <RelatedTools tools={relatedTools} currentPath='/tools/promo-image-generator' />
        </ToolPageLayout>
    );
}
