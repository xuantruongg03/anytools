import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import AudioConverterContent from "./AudioConverterContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Chuyển Đổi Âm Thanh Online - WAV, MP3, WebM & Tùy Chỉnh Kênh ${getCurrentYear()}` 
            : `Audio Converter Online - Convert WAV, MP3, WebM Free ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ chuyển đổi âm thanh online miễn phí. Đổi định dạng file sang WAV lossless, nén WebM, tùy chỉnh tần số lấy mẫu (Sample Rate) và kênh Mono/Stereo trực tiếp trên trình duyệt." 
            : "Free online audio converter tool. Convert audio files to lossless WAV, WebM, adjust sample rates and channels (Mono/Stereo) with 100% private browser processing.",
        keywords: [
            "audio converter", "chuyển đổi âm thanh online", "mp3 to wav", "convert audio online",
            "wav converter", "webm to wav", "đổi đuôi nhạc", "mono stereo converter"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Audio Converter",
        openGraph: {
            title: locale === "vi" 
                ? `Chuyển Đổi Định Dạng Âm Thanh Online - Miễn Phí ${getCurrentYear()}` 
                : `Audio Converter Online - Free & Fast Audio Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Chuyển đổi các định dạng âm thanh phổ biến sang WAV và tối ưu hóa dung lượng." 
                : "Convert popular audio formats to lossless WAV and optimize audio channels.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/audio-converter",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Audio Converter Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Audio Converter Online - Free Tool",
            description: "Convert audio formats with sample rate and channel controls.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/audio-converter`,
            languages: {
                en: "https://anytools.online/en/tools/audio-converter",
                vi: "https://anytools.online/vi/tools/audio-converter",
                "x-default": "https://anytools.online/en/tools/audio-converter",
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

export default function AudioConverterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Audio Converter Online",
        applicationCategory: "MultimediaApplication",
        description: "Free online audio converter tool. Decode and re-encode audio files to WAV with custom sample rates and channel settings.",
        url: "https://anytools.online/tools/audio-converter",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Audio File Decoding (MP3, WAV, OGG, WebM, M4A)",
            "16-bit Lossless PCM WAV Encoding",
            "Stereo to Mono Downmixing (50% size reduction)",
            "Sample Rate Resampling (22kHz, 44.1kHz, 48kHz)",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires Web Audio API.",
    };

    const relatedTools = getRelatedTools("/tools/audio-converter", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Audio Converter'
                description='Convert audio files to lossless WAV format with custom sample rates and channel downmixing directly in your browser.'
            >
                <AudioConverterContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/audio-converter' />
            </ToolPageLayout>
        </>
    );
}
