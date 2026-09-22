import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import VideoToGifContent from "./VideoToGifContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Chuyển Video Sang Ảnh Động GIF Online - Cắt Đoạn & Chỉnh FPS ${getCurrentYear()}` 
            : `Video to GIF Converter - Convert MP4, WebM to Animated GIF ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ chuyển video sang ảnh động GIF online miễn phí. Hỗ trợ MP4, WebM, MOV, tùy chỉnh cắt thời gian, FPS và kích thước trực tiếp trên trình duyệt." 
            : "Free online video to GIF converter. Convert MP4, WebM, and MOV to high-quality animated GIFs with custom trimming, FPS, and resolution without server uploads.",
        keywords: [
            "video to gif", "chuyển video sang gif", "tạo ảnh gif từ video", "mp4 to gif", "webm to gif",
            "animated gif maker", "convert video to gif online", "cắt video làm gif"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Video to GIF",
        openGraph: {
            title: locale === "vi" 
                ? `Chuyển Video Sang GIF Online - Nhanh Chóng & Miễn Phí ${getCurrentYear()}` 
                : `Video to GIF Converter - Free Online Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Tạo ảnh động GIF chất lượng cao từ video MP4, WebM trực tiếp trên trình duyệt." 
                : "Create high-quality animated GIFs from MP4 and WebM videos directly in your browser.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/video-to-gif",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Video to GIF Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Video to GIF Converter - Free Online Tool",
            description: "Convert videos to animated GIFs with trimming and FPS control.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/video-to-gif`,
            languages: {
                en: "https://anytools.online/en/tools/video-to-gif",
                vi: "https://anytools.online/vi/tools/video-to-gif",
                "x-default": "https://anytools.online/en/tools/video-to-gif",
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
        classification: "Multimedia Tools",
    };
}

export default function VideoToGifPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Video to GIF Converter Online",
        applicationCategory: "MultimediaApplication",
        description: "Free online video to GIF converter. Convert MP4, WebM, and MOV videos into animated GIFs with custom start/end time trimming and resolution control.",
        url: "https://anytools.online/tools/video-to-gif",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Video to Animated GIF Conversion (MP4, WebM, MOV)",
            "Precision Start & End Time Trimming",
            "Custom Frame Rate (5 to 15 FPS)",
            "Resolution Resizing (240px to 600px)",
            "100% Client-side Processing (Zero video uploads)"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5 Video & Canvas.",
    };

    const relatedTools = getRelatedTools("/tools/video-to-gif", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Video to GIF Converter'
                description='Convert videos into high-quality animated GIFs directly in your browser with precise trimming, FPS control, and instant download.'
            >
                <VideoToGifContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/video-to-gif' />
            </ToolPageLayout>
        </>
    );
}
