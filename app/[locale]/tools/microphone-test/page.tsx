import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import MicrophoneTestClient from "./MicrophoneTestClient";
import MicrophoneTestContent from "./MicrophoneTestContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" ? "Test Microphone - Kiểm Tra Mic Online Miễn Phí 2026" : "Microphone Test - Free Online Mic Testing Tool 2026",
        description: locale === "vi" ? "Công cụ test microphone online miễn phí. Kiểm tra mic, xem sóng âm thanh real-time, ghi âm và phát lại. 100% bảo mật." : "Free online microphone testing tool. Test mic, view real-time waveform, record and playback. 100% free and secure.",
        keywords: ["microphone test", "mic test", "test mic online", "audio test", "microphone check", "mic check", "sound test", "audio quality test", "test microphone", "kiểm tra mic", "test mic", "kiểm tra microphone", "test âm thanh"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Microphone Test",
        openGraph: {
            title: locale === "vi" ? "Test Microphone Online - Kiểm Tra Mic Miễn Phí 2026" : "Microphone Test Online - Free Mic Testing Tool 2026",
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
            canonical: `https://anytools.online/${locale}/tools/microphone-test`,
            languages: {
                en: "https://anytools.online/en/tools/microphone-test",
                vi: "https://anytools.online/vi/tools/microphone-test",
                "x-default": "https://anytools.online/en/tools/microphone-test",
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

    const relatedTools = getRelatedTools("/tools/microphone-test", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title='Microphone Test' description='Test your microphone, view real-time audio waveform, record and playback, analyze audio quality.'>
                <MicrophoneTestClient />
                <MicrophoneTestContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/microphone-test' />
            </ToolPageLayout>
        </>
    );
}

export default MicrophoneTestPage;
