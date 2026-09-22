import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import WebcamTestContent from "./WebcamTestContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Test Webcam - Kiểm Tra Camera Online Miễn Phí ${getCurrentYear()}` 
            : `Webcam Test - Free Online Camera Testing Tool ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ test webcam và kiểm tra camera online miễn phí. Kiểm tra hình ảnh, đo FPS thực tế, độ phân giải HD/4K, chụp ảnh thử nghiệm. 100% bảo mật client-side." 
            : "Free online webcam and camera testing tool. Check live video, measure real-time FPS, test resolution up to 4K, take snapshot test. 100% private and client-side.",
        keywords: [
            "webcam test", "camera test", "test webcam online", "kiểm tra camera", "test camera online",
            "webcam checker", "camera quality test", "fps test camera", "chụp ảnh webcam", "test camera laptop"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Webcam Test",
        openGraph: {
            title: locale === "vi" 
                ? `Test Webcam Online - Kiểm Tra Camera Miễn Phí ${getCurrentYear()}` 
                : `Webcam Test Online - Free Camera Testing Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Kiểm tra camera online, đo FPS thực, độ phân giải cảm biến, chế độ gương và chụp ảnh test. Không lưu trữ dữ liệu." 
                : "Test webcam online, measure real-time FPS, sensor resolution, mirror mode and capture test snapshots. Zero data stored.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/webcam-test",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Webcam Test Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Webcam Test - Free Online Tool",
            description: "Test your camera and webcam instantly. Free, secure, and accurate.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/webcam-test`,
            languages: {
                en: "https://anytools.online/en/tools/webcam-test",
                vi: "https://anytools.online/vi/tools/webcam-test",
                "x-default": "https://anytools.online/en/tools/webcam-test",
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

export default function WebcamTestPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Webcam Test Online",
        applicationCategory: "UtilityApplication",
        description: "Free online webcam testing tool. Test video stream, measure real-time FPS, check resolution, mirror mode, take test photos. 100% client-side processing.",
        url: "https://anytools.online/tools/webcam-test",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Live Camera Stream Testing",
            "Real-time FPS Counter",
            "Resolution & Aspect Ratio Detection",
            "Multi-Camera Device Switching",
            "Mirror Mode Toggle",
            "Snapshot Photo Capture with Countdown Timer",
            "100% Client-side Processing",
            "No Video Stream Stored or Transmitted"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5. Requires camera access.",
    };

    const relatedTools = getRelatedTools("/tools/webcam-test", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Webcam Test'
                description='Test your camera, check real-time FPS, measure resolution, preview mirror mode, and capture test photos.'
            >
                <WebcamTestContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/webcam-test' />
            </ToolPageLayout>
        </>
    );
}
