import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import SlideShareDownloaderContent from "./SlideShareDownloaderContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

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
        applicationName: "AnyTools SlideShare Downloader",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/slideshare-downloader`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "SlideShare Downloader Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "SlideShare Downloader - Free Online Tool",
            description: "Download SlideShare presentations instantly. Free and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/slideshare-downloader`,
            languages: {
                en: "https://anytools.online/en/tools/slideshare-downloader",
                vi: "https://anytools.online/vi/tools/slideshare-downloader",
                "x-default": "https://anytools.online/en/tools/slideshare-downloader",
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

export default async function SlideShareDownloaderPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Tải SlideShare" : "SlideShare Downloader Online",
        applicationCategory: "UtilityApplication",
        description: isVi ? "Công cụ tải bài thuyết trình SlideShare thành PDF miễn phí. Tải xuống chất lượng cao, nhanh chóng và bảo mật. Không cần đăng ký, hoàn toàn miễn phí. Hỗ trợ SlideShare và LinkedIn." : "Free online SlideShare to PDF downloader tool. Download presentations in high quality, fast and secure. No registration required, completely free. Supports SlideShare and LinkedIn.",
        url: `https://anytools.online/${locale}/tools/slideshare-downloader`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Download SlideShare to PDF", "High-quality PDF output", "LinkedIn SlideShare support", "Fast processing speed", "No registration required", "100% Free forever", "Secure & Private", "Multiple API fallback", "Auto open in new tab"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/slideshare-downloader", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Tải SlideShare PDF Miễn Phí - Công Cụ Tải Nhanh" : "Free SlideShare to PDF Downloader - Fast & Easy"} description={isVi ? "Tải bài thuyết trình SlideShare thành PDF chất lượng cao ngay lập tức. Miễn phí, nhanh chóng, không cần đăng ký." : "Download SlideShare presentations as high-quality PDF files instantly. Free, fast, and no registration required."}>
                <SlideShareDownloaderContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/slideshare-downloader' />
            </ToolPageLayout>
        </>
    );
}
