import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import StudocuDownloaderContent from "./StudocuDownloaderContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Tải SlideShare PDF Miễn Phí - Công Cụ Tải Nhanh 2025 | AnyTools" : "Free SlideShare to PDF Downloader - Fast & Easy 2025 | AnyTools";
    const description = isVi ? "Tải bài thuyết trình SlideShare thành PDF chất lượng cao ngay lập tức. Miễn phí, nhanh chóng, không cần đăng ký. Hỗ trợ tải từ SlideShare và LinkedIn SlideShare." : "Download SlideShare presentations as high-quality PDF files instantly. Free, fast, and no registration required. Works with SlideShare and LinkedIn SlideShare.";

    return {
        title,
        description,
        keywords: ["slideshare downloader", "slideshare to pdf", "download slideshare pdf", "free slideshare downloader", "slideshare pdf converter", "slideshare download tool", "linkedin slideshare downloader", "tải slideshare", "tải slideshare pdf", "convert slideshare to pdf", "slideshare saver", "slideshare pdf online"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools StuDocu Downloader",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://www.anytools.online/${locale}/tools/studocu-downloader`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://www.anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "StuDocu Downloader Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "StuDocu Downloader - Free Online Tool",
            description: "Download StuDocu study documents instantly. Free and secure.",
            creator: "@anytools",
            images: ["https://www.anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/studocu-downloader`,
            languages: {
                "en-US": "https://www.anytools.online/en/tools/studocu-downloader",
                "vi-VN": "https://www.anytools.online/vi/tools/studocu-downloader",
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

export default async function StudocuDownloaderPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Tải StuDocu" : "StuDocu Downloader Online",
        applicationCategory: "UtilityApplication",
        description: isVi ? "Công cụ tải tài liệu học tập từ StuDocu miễn phí. Tải xuống chất lượng cao, nhanh chóng và bảo mật. Không cần đăng ký, hoàn toàn miễn phí. Hỗ trợ tất cả định dạng tài liệu." : "Free online StuDocu document downloader tool. Download study materials in high quality, fast and secure. No registration required, completely free. Supports all document formats.",
        url: `https://www.anytools.online/${locale}/tools/studocu-downloader`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Download StuDocu documents", "High-quality output", "Multiple format support", "Fast processing speed", "No registration required", "100% Free forever", "Secure & Private", "Offline access", "Auto open in new tab"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/studocu-downloader", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Tải Tài Liệu StuDocu Miễn Phí - Công Cụ Tải Nhanh" : "Free StuDocu Document Downloader - Fast & Easy"} description={isVi ? "Tải tài liệu học tập từ StuDocu ngay lập tức. Miễn phí, nhanh chóng, không cần đăng ký." : "Download study documents from StuDocu instantly. Free, fast, and no registration required."}>
                <StudocuDownloaderContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/studocu-downloader' />
            </ToolPageLayout>
        </>
    );
}
