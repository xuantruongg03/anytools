import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import ImageCompressorContent from "./ImageCompressorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Nén Ảnh Online - Giảm Dung Lượng Ảnh Miễn Phí 2026" : "Image Compressor - Compress Images Online Free 2026";
    const description = isVi ? "Nén ảnh PNG, JPG, WebP online miễn phí. Giảm dung lượng ảnh mà không mất chất lượng. Hỗ trợ dán ảnh từ clipboard. Nhanh, bảo mật." : "Compress PNG, JPG, WebP images online for free. Reduce image file size without losing quality. Supports clipboard paste. Fast, secure.";

    return {
        title,
        description,
        keywords: [
            // English keywords
            "image compressor",
            "compress image online",
            "reduce image size",
            "image compression",
            "compress png",
            "compress jpg",
            "compress jpeg",
            "compress webp",
            "image optimizer",
            "reduce photo size",
            "compress image free",
            "online image compressor",
            "bulk image compression",
            "image size reducer",
            "optimize images",
            "tinypng alternative",
            "squoosh alternative",
            // Vietnamese keywords
            "nén ảnh online",
            "giảm dung lượng ảnh",
            "nén ảnh miễn phí",
            "công cụ nén ảnh",
            "tối ưu ảnh",
            "nén ảnh png",
            "nén ảnh jpg",
            "giảm kích thước ảnh",
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Image Compressor",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/image-compressor`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Image Compressor Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/image-compressor`,
            languages: {
                en: "https://anytools.online/en/tools/image-compressor",
                vi: "https://anytools.online/vi/tools/image-compressor",
                "x-default": "https://anytools.online/en/tools/image-compressor",
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
        classification: "Image Processing Tools",
    };
}

export default async function ImageCompressorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Nén Ảnh Online" : "Image Compressor Online",
        applicationCategory: "MultimediaApplication",
        description: isVi ? "Công cụ nén ảnh miễn phí. Giảm dung lượng ảnh PNG, JPG, WebP mà không mất chất lượng. Hỗ trợ dán từ clipboard, kéo thả, nén hàng loạt." : "Free image compression tool. Reduce PNG, JPG, WebP file sizes without losing quality. Supports clipboard paste, drag & drop, bulk compression.",
        url: `https://anytools.online/${locale}/tools/image-compressor`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Compress PNG images", "Compress JPG/JPEG images", "Compress WebP images", "Bulk compression", "Paste from clipboard", "Drag and drop upload", "Quality adjustment", "Resize option", "No file size limit", "No registration required", "100% Free", "Secure & Private - processed locally", "Download compressed images", "Download all as ZIP"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/image-compressor", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Nén Ảnh Online - Miễn Phí & Nhanh Chóng" : "Image Compressor - Free & Fast"} description={isVi ? "Nén ảnh PNG, JPG, WebP online. Giảm dung lượng mà không mất chất lượng." : "Compress PNG, JPG, WebP images online. Reduce file size without losing quality."}>
                <ImageCompressorContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/image-compressor' />
            </ToolPageLayout>
        </>
    );
}
