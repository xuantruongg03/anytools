import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import ImageWatermarkContent from "./ImageWatermarkContent";
import { imageWatermarkTranslations } from "@/lib/i18n/tools/image-watermark";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Chèn Watermark Đóng Dấu Bản Quyền Ảnh Hàng Loạt Online ${getCurrentYear()}`
            : `Batch Image Watermark Adder (Text & Logo) Online ${getCurrentYear()}`,
        description: isVi
            ? "Đóng dấu logo, chèn chữ bản quyền ảnh hàng loạt trực tuyến. Hỗ trợ hoa văn phủ kín ảnh (Tile Pattern), chỉnh độ mờ, góc xoay và tải file ZIP miễn phí."
            : "Protect your photos with custom text and logo watermarks in batch. Full-bleed diagonal tile patterns, opacity adjustments, and fast ZIP downloads 100% in your browser.",
        keywords: [
            "image watermark", "dong dau anh", "chen logo vao anh", "watermark batch",
            "chen chu vao anh", "add watermark online", "protect photos"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Đóng Dấu Bản Quyền Ảnh & Chèn Logo Online ${getCurrentYear()}`
                : `Batch Image Watermark & Logo Overlay ${getCurrentYear()}`,
            description: isVi
                ? "Bảo vệ hình ảnh sản phẩm với chữ hoặc logo chìm không lo bị sao chép."
                : "Watermark multiple photos at once with text and PNG logo overlays.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/image-watermark",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/image-watermark`,
            languages: {
                en: "https://anytools.online/en/tools/image-watermark",
                vi: "https://anytools.online/vi/tools/image-watermark",
                "x-default": "https://anytools.online/en/tools/image-watermark",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ImageWatermarkPage({ params }: Props) {
    const { locale } = await params;
    const t = imageWatermarkTranslations[locale as "en" | "vi"] || imageWatermarkTranslations.en;
    const relatedTools = getRelatedTools("/tools/image-watermark", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "MultimediaApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/image-watermark`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Text and PNG logo watermark overlays",
            "9-point spatial positioning and full-canvas diagonal tile repetition",
            "Batch image processing with instant ZIP archive download",
            "Client-side Canvas rendering preserving original resolution"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
                maxWidth='max-w-[1440px]'
            >
                <ImageWatermarkContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/image-watermark' />
            </ToolPageLayout>
        </>
    );
}
