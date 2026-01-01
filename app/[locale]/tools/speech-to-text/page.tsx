import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import SpeechToTextContent from "./SpeechToTextContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Chuyển Giọng Nói Thành Văn Bản - Speech to Text Miễn Phí 2026" : "Speech to Text Converter - Free Audio Transcription 2026";
    const description = isVi ? "Chuyển đổi giọng nói thành văn bản miễn phí. Hỗ trợ tải file âm thanh và ghi âm trực tiếp từ micro. Chính xác, nhanh chóng, bảo mật. Không cần đăng ký." : "Convert speech to text for free. Upload audio files or record directly from your microphone. Accurate, fast, and secure. No registration required.";

    return {
        title,
        description,
        keywords: ["speech to text", "audio to text", "voice to text", "transcribe audio", "audio transcription", "voice transcription", "speech recognition", "audio converter", "microphone to text", "recording to text", "chuyển giọng nói thành văn bản", "chuyển đổi âm thanh", "free speech to text", "online audio transcription", "voice recognition tool"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Speech to Text Converter",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/speech-to-text`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Speech to Text Converter Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isVi ? "Chuyển Giọng Nói Thành Văn Bản - Miễn Phí" : "Speech to Text Converter - Free Online Tool",
            description: isVi ? "Chuyển đổi giọng nói và âm thanh thành văn bản ngay lập tức. Miễn phí và bảo mật." : "Convert speech and audio to text instantly. Free and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/speech-to-text`,
            languages: {
                en: "https://anytools.online/en/tools/speech-to-text",
                vi: "https://anytools.online/vi/tools/speech-to-text",
                "x-default": "https://anytools.online/en/tools/speech-to-text",
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

export default async function SpeechToTextPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Chuyển Giọng Nói Thành Văn Bản" : "Speech to Text Converter Online",
        applicationCategory: "MultimediaApplication",
        description: isVi ? "Công cụ chuyển đổi giọng nói thành văn bản miễn phí. Hỗ trợ tải file âm thanh (MP3, WAV, M4A, OGG) và ghi âm trực tiếp từ micro. Chuyển đổi chính xác, nhanh chóng và bảo mật. Không cần đăng ký, hoàn toàn miễn phí." : "Free online speech to text converter tool. Upload audio files (MP3, WAV, M4A, OGG) or record directly from microphone. Accurate, fast and secure transcription. No registration required, completely free.",
        url: `https://anytools.online/${locale}/tools/speech-to-text`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Upload audio files (MP3, WAV, M4A, OGG)", "Record audio from microphone", "Real-time transcription", "High accuracy speech recognition", "Multiple language support", "No file size limit (up to 25MB)", "No registration required", "100% Free forever", "Secure & Private - audio not stored", "Copy or download transcribed text", "Pause and resume recording"],
        browserRequirements: "Requires JavaScript. Requires HTML5. Requires microphone access for live recording.",
    };

    const relatedTools = getRelatedTools("/tools/speech-to-text", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Chuyển Giọng Nói Thành Văn Bản - Miễn Phí & Nhanh Chóng" : "Speech to Text Converter - Free & Fast"} description={isVi ? "Chuyển đổi giọng nói thành văn bản ngay lập tức. Hỗ trợ file âm thanh và ghi âm trực tiếp. Miễn phí, bảo mật." : "Convert speech to text instantly. Upload audio files or record live. Free and secure."}>
                <SpeechToTextContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/speech-to-text' />
            </ToolPageLayout>
        </>
    );
}
