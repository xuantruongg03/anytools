import type { Metadata } from "next";
import { RelatedTools } from "@/components";
import MicrophoneTestClient from "./MicrophoneTestClient";
import MicrophoneTestContent from "./MicrophoneTestContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" ? "Test Microphone - Kiểm Tra Mic Online Miễn Phí 2025 | AnyTools" : "Microphone Test - Free Online Mic Testing Tool 2025 | AnyTools",
        description: locale === "vi" ? "Công cụ test microphone online miễn phí. Kiểm tra mic, xem sóng âm thanh real-time, ghi âm và phát lại, đánh giá chất lượng âm thanh. 100% miễn phí và bảo mật." : "Free online microphone testing tool. Test your mic, view real-time audio waveform, record and playback, analyze audio quality. 100% free and secure.",
        keywords: ["microphone test", "mic test", "test mic online", "audio test", "microphone check", "mic check", "sound test", "audio quality test", "test microphone", "kiểm tra mic", "test mic", "kiểm tra microphone", "test âm thanh"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Microphone Test",
        openGraph: {
            title: locale === "vi" ? "Test Microphone Online - Kiểm Tra Mic Miễn Phí 2025" : "Microphone Test Online - Free Mic Testing Tool 2025",
            description: locale === "vi" ? "Kiểm tra microphone miễn phí. Xem sóng âm thanh, ghi âm, phát lại, đánh giá chất lượng. 100% client-side." : "Free microphone testing. View waveform, record, playback, analyze quality. 100% client-side.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/microphone-test",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Microphone Test Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Microphone Test - Free Online Tool",
            description: "Test your microphone instantly. Free and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: "https://anytools.online/tools/microphone-test",
            languages: {
                "en-US": "https://anytools.online/en/tools/microphone-test",
                "vi-VN": "https://anytools.online/vi/tools/microphone-test",
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

function MicrophoneTestPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Microphone Test Online",
        applicationCategory: "UtilityApplication",
        description: "Free online microphone testing tool. Test your mic, view real-time audio waveform visualization, record and playback audio, analyze sound quality and volume levels. 100% client-side processing.",
        url: "https://anytools.online/tools/microphone-test",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Real-time Audio Waveform Visualization", "Microphone Recording", "Audio Playback", "Volume Level Meter", "Audio Quality Analysis", "Noise Detection", "Frequency Analysis", "100% Client-side Processing", "No Data Sent to Server", "Free and Unlimited Use"],
        browserRequirements: "Requires JavaScript. Requires HTML5. Requires microphone access.",
    };

    const relatedTools = [
        {
            href: "/tools/stopwatch",
            icon: "⏱️",
            nameEn: "Stopwatch",
            nameVi: "Đồng Hồ Bấm Giây",
            descriptionEn: "Precise time measurement with lap tracking",
            descriptionVi: "Đo thời gian chính xác với tính năng bấm giờ từng vòng",
        },
        {
            href: "/tools/qr-code-generator",
            icon: "📱",
            nameEn: "QR Code Generator",
            nameVi: "Tạo mã QR",
            descriptionEn: "Generate QR codes for text, URLs, contact information and more",
            descriptionVi: "Tạo mã QR cho văn bản, URL, thông tin liên hệ và nhiều hơn nữa",
        },
    ];

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className='container mx-auto px-4 py-8 max-w-6xl'>
                    <MicrophoneTestClient />
                    <MicrophoneTestContent />
                    <RelatedTools tools={relatedTools} currentPath='/tools/microphone-test' />
                </div>
            </div>
        </>
    );
}

export default MicrophoneTestPage;
