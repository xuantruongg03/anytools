import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import IssuuDownloaderContent from "./IssuuDownloaderContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Tải Tài Liệu Issuu PDF Miễn Phí - Tải Tạp Chí, Sách Báo ${getCurrentYear()}` 
            : `Issuu to PDF Downloader - Download Magazines & Books Free ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ tải tài liệu, tạp chí, sách báo từ Issuu thành file PDF chất lượng cao online. Miễn phí 100%, tốc độ cao, không cần đăng nhập hay cài đặt phần mềm." 
            : "Free online Issuu to PDF downloader tool. Download magazines, portfolios, newspapers, and catalogs from Issuu in high resolution without registration.",
        keywords: [
            "issuu downloader", "tải issuu", "download issuu pdf", "issuu to pdf", "tải sách issuu",
            "tải tạp chí issuu", "issuu pdf download online", "issuu viewer to pdf"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Issuu Downloader",
        openGraph: {
            title: locale === "vi" 
                ? `Tải Issuu PDF Miễn Phí - Chất Lượng Cao ${getCurrentYear()}` 
                : `Issuu to PDF Downloader - Free Online Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Tải tài liệu và tạp chí Issuu thành PDF chất lượng cao nhanh chóng và an toàn." 
                : "Download publications, magazines, and catalogs from Issuu as high-quality PDF files.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/issuu-downloader",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Issuu Downloader Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Issuu to PDF Downloader - Free Online Tool",
            description: "Download publications from Issuu as high-quality PDF files instantly.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/issuu-downloader`,
            languages: {
                en: "https://anytools.online/en/tools/issuu-downloader",
                vi: "https://anytools.online/vi/tools/issuu-downloader",
                "x-default": "https://anytools.online/en/tools/issuu-downloader",
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
        classification: "Downloader Tools",
    };
}

export default function IssuuDownloaderPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Issuu to PDF Downloader Online",
        applicationCategory: "DownloaderApplication",
        description: "Free online Issuu to PDF downloader tool. Convert and download magazines, portfolios, and publications from Issuu as high-quality PDF files.",
        url: "https://anytools.online/tools/issuu-downloader",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Download Issuu Publications to PDF",
            "High-resolution vector/page image rendering",
            "No account or login required",
            "100% Free and unlimited use",
            "Fast cloud extraction"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/issuu-downloader", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Issuu to PDF Downloader'
                description='Download magazines, portfolios, catalogs, and publications from Issuu as high-quality PDF files easily and securely.'
            >
                <IssuuDownloaderContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/issuu-downloader' />
            </ToolPageLayout>
        </>
    );
}
