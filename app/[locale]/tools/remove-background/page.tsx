import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import RemoveBackgroundContent from "./RemoveBackgroundContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Xóa Phông Nền Ảnh - Công Cụ Remove Background Miễn Phí | AnyTools" : "Remove Image Background - Free AI Background Remover | AnyTools";
    const description = isVi ? "Xóa phông nền ảnh tự động bằng AI. Hỗ trợ nhiều nhà cung cấp dịch vụ. Nhanh chóng, chính xác, bảo mật. Không cần đăng ký." : "Remove image backgrounds automatically with AI. Multiple service providers supported. Fast, accurate, and secure. No registration required.";

    return {
        title,
        description,
        keywords: ["remove background", "background remover", "remove image background", "remove bg", "background eraser", "transparent background", "cutout image", "photo background removal", "ai background remover", "xóa phông nền", "tách nền ảnh", "free background remover", "online background removal", "png transparent background", "removebg alternative", "photoroom alternative"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Remove Background",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://www.anytools.online/${locale}/tools/remove-background`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://www.anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Remove Image Background Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isVi ? "Xóa Phông Nền Ảnh - Miễn Phí" : "Remove Image Background - Free Online Tool",
            description: isVi ? "Xóa phông nền ảnh tự động bằng AI. Miễn phí và bảo mật." : "Remove image backgrounds automatically with AI. Free and secure.",
            creator: "@anytools",
            images: ["https://www.anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/remove-background`,
            languages: {
                en: "https://www.anytools.online/en/tools/remove-background",
                vi: "https://www.anytools.online/vi/tools/remove-background",
                "x-default": "https://www.anytools.online/en/tools/remove-background",
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

export default async function RemoveBackgroundPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Xóa Phông Nền Ảnh" : "Remove Image Background Online",
        applicationCategory: "MultimediaApplication",
        description: isVi ? "Công cụ xóa phông nền ảnh miễn phí sử dụng AI. Hỗ trợ nhiều nhà cung cấp dịch vụ (Remove.bg, Photoroom, Clipdrop). Xử lý nhanh chóng và chính xác. Không cần đăng ký, hoàn toàn miễn phí và bảo mật." : "Free AI-powered background removal tool. Multiple service providers supported (Remove.bg, Photoroom, Clipdrop). Fast and accurate processing. No registration required, completely free and secure.",
        url: `https://www.anytools.online/${locale}/tools/remove-background`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Upload images (JPG, PNG, WEBP)", "AI-powered background removal", "Multiple service providers", "Before/After comparison preview", "High-quality transparent PNG output", "File size up to 10MB", "No registration required", "100% Free", "Secure & Private - images not stored", "Download processed image", "Fast processing (seconds)"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/remove-background", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Xóa Phông Nền Ảnh - Miễn Phí & Nhanh Chóng" : "Remove Image Background - Free & Fast"} description={isVi ? "Xóa phông nền ảnh tự động bằng AI. Hỗ trợ nhiều dịch vụ. Miễn phí, bảo mật." : "Remove image backgrounds automatically with AI. Multiple providers. Free and secure."}>
                <RemoveBackgroundContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/remove-background' />
            </ToolPageLayout>
        </>
    );
}
