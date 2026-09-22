import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import FaviconGeneratorContent from "./FaviconGeneratorContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Tạo Favicon & App Icon Online - Chuẩn SEO Mọi Kích Thước ${getCurrentYear()}` 
            : `Favicon & App Icon Generator - All Sizes & PWA Manifest ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ tạo favicon online miễn phí. Hỗ trợ tạo từ ảnh hoặc emoji, tự động sinh favicon 16x16, 32x32, Apple Touch Icon 180x180, Android PWA 192/512, xuất file ZIP và mã HTML." 
            : "Free online favicon generator. Create favicons from images or emojis with multi-size export (16x16, 32x32, 180x180 Apple Touch Icon, PWA 192/512), ZIP download, and HTML tags.",
        keywords: [
            "favicon generator", "tạo favicon", "apple touch icon", "pwa icon generator", "tạo icon website",
            "favicon creator", "generate favicon online", "favicon ico generator", "android chrome icon"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Favicon Generator",
        openGraph: {
            title: locale === "vi" 
                ? `Tạo Favicon Online Chuẩn SEO - Xuất ZIP & HTML ${getCurrentYear()}` 
                : `Favicon Generator - Free Online Icon Creator ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Tạo trọn bộ favicon cho website, iOS và Android PWA trong vài giây. Xem trước trực quan trên tab trình duyệt." 
                : "Generate complete favicon packages for websites, iOS, and Android PWAs in seconds. Live browser previews.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/favicon-generator",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Favicon Generator Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Favicon Generator - Free Online Tool",
            description: "Generate complete favicon packages from image or emoji with instant ZIP download.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/favicon-generator`,
            languages: {
                en: "https://anytools.online/en/tools/favicon-generator",
                vi: "https://anytools.online/vi/tools/favicon-generator",
                "x-default": "https://anytools.online/en/tools/favicon-generator",
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

export default function FaviconGeneratorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Favicon Generator Online",
        applicationCategory: "DeveloperApplication",
        description: "Free online favicon generator tool. Create favicons from logos or emojis, preview on browser tabs and iOS home screen, download full ZIP bundle.",
        url: "https://anytools.online/tools/favicon-generator",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Image & Emoji / Text Favicon Creation",
            "Multi-Size Export (16x16, 32x32, 48x48, 180x180, 192x192, 512x512)",
            "Apple Touch Icon & Android Chrome PWA Support",
            "Full ZIP Package Download with site.webmanifest",
            "Copy-paste HTML <head> code",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5 Canvas.",
    };

    const relatedTools = getRelatedTools("/tools/favicon-generator", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Favicon & App Icon Generator'
                description='Create complete favicon packages from images or emojis with multi-size export, live browser preview, and instant ZIP download.'
            >
                <FaviconGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/favicon-generator' />
            </ToolPageLayout>
        </>
    );
}
