import type { Metadata } from "next";
import SlideShareDownloaderContent from "./SlideShareDownloaderContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Tải SlideShare - Tải PPT & PDF | Công Cụ Online Miễn Phí" : "SlideShare Downloader - Download PPT & PDF | Free Online Tool";
    const description = isVi ? "Tải bài thuyết trình SlideShare dưới dạng PDF hoặc PPT ngay lập tức. Công cụ tải SlideShare miễn phí với chất lượng cao. Không cần đăng ký!" : "Download SlideShare presentations as PDF or PPT files instantly. Free online SlideShare downloader with high-quality output. No registration required!";

    return {
        title,
        description,
        keywords: ["slideshare downloader", "download slideshare", "slideshare to pdf", "slideshare to ppt", "presentation downloader", "slideshare tool", "free slideshare downloader", "tải slideshare", "download ppt", "download pdf"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools SlideShare Downloader",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://www.anytools.online/${locale}/tools/slideshare-downloader`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://www.anytools.online/og-image.png",
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
            images: ["https://www.anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/slideshare-downloader`,
            languages: {
                "en-US": "https://www.anytools.online/en/tools/slideshare-downloader",
                "vi-VN": "https://www.anytools.online/vi/tools/slideshare-downloader",
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
        description: isVi ? "Công cụ tải bài thuyết trình SlideShare miễn phí. Tải xuống dưới dạng PDF hoặc PPT với chất lượng cao. Không cần đăng ký, hoàn toàn miễn phí." : "Free online SlideShare downloader tool. Download presentations as PDF or PPT with high quality. No registration required, completely free.",
        url: `https://www.anytools.online/${locale}/tools/slideshare-downloader`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Download SlideShare presentations", "PDF format support", "PPT/PPTX format support", "High-quality downloads", "Fast processing", "No registration required", "100% Free", "Secure & Private"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/slideshare-downloader", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden'>
                <div className='container mx-auto px-4 py-8'>
                    <SlideShareDownloaderContent locale={locale as "en" | "vi"} />
                    <RelatedTools tools={relatedTools} currentPath='/tools/slideshare-downloader' />
                </div>
            </div>
        </>
    );
}
