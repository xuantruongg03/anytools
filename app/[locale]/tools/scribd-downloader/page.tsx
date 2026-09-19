import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import ScribdDownloaderContent from "./ScribdDownloaderContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? `Tải Tài Liệu Scribd PDF Miễn Phí - Công Cụ Tải Nhanh ${getCurrentYear()}`
        : `Scribd to PDF Downloader - Free & Fast ${getCurrentYear()}`;
    const description = isVi
        ? "Tải tài liệu, sách và bài thuyết trình Scribd thành PDF chất lượng cao ngay lập tức. Miễn phí, nhanh, không cần đăng ký tài khoản."
        : "Download Scribd documents, books, and presentations as high-quality PDF instantly. Free, fast, no registration required.";

    return {
        title,
        description,
        keywords: [
            "scribd downloader",
            "scribd to pdf",
            "download scribd pdf",
            "free scribd downloader",
            "scribd pdf converter",
            "scribd download tool",
            "download documents from scribd",
            "tải scribd",
            "tải tài liệu scribd",
            "tải scribd pdf miễn phí",
            "convert scribd to pdf",
            "scribd saver",
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Scribd Downloader",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/scribd-downloader`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Scribd Downloader Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Scribd Downloader - Free Online Tool",
            description: "Download Scribd documents and presentations instantly. Free and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/scribd-downloader`,
            languages: {
                en: "https://anytools.online/en/tools/scribd-downloader",
                vi: "https://anytools.online/vi/tools/scribd-downloader",
                "x-default": "https://anytools.online/en/tools/scribd-downloader",
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
        classification: "Utility Tools",
    };
}

export default async function ScribdDownloaderPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Tải Tài Liệu Scribd" : "Scribd Downloader Online",
        applicationCategory: "UtilityApplication",
        description: isVi
            ? "Công cụ tải tài liệu, bài giảng và sách từ Scribd thành PDF miễn phí chất lượng cao. Nhanh chóng, an toàn, không cần đăng ký tài khoản."
            : "Free online Scribd to PDF downloader tool. Download documents in high quality, fast and secure. No registration required, completely free.",
        url: `https://anytools.online/${locale}/tools/scribd-downloader`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Download Scribd to PDF",
            "High-resolution PDF output",
            "Fast processing speed",
            "No registration required",
            "100% Free forever",
            "Secure & Private",
            "Compatible with all devices",
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/scribd-downloader", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={isVi ? "Tải Tài Liệu Scribd PDF Miễn Phí" : "Free Scribd to PDF Downloader"}
                description={
                    isVi
                        ? "Tải tài liệu, bài viết và slide từ Scribd thành PDF chất lượng cao ngay lập tức. Miễn phí, nhanh chóng, không cần đăng ký."
                        : "Download Scribd documents, books, and presentations as high-quality PDF files instantly. Free, fast, and no registration required."
                }
            >
                <ScribdDownloaderContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/scribd-downloader' />
            </ToolPageLayout>
        </>
    );
}
