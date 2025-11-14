import type { Metadata } from "next";
import Base64Content from "./Base64Content";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Base64 Encoder & Decoder Online - Free Base64 Converter Tool 2025",
        description: "Free online Base64 encoder and decoder. Convert text and images to Base64 and decode Base64 strings instantly. Fast, secure, and easy to use. Perfect for developers!",
        keywords: [
            // English keywords
            "base64 encoder",
            "base64 decoder",
            "encode base64",
            "decode base64",
            "base64 converter",
            "base64 online",
            "base64 tool",
            "text to base64",
            "base64 to text",
            "free base64",
            "image to base64",
            "base64 image encoder",
            "base64 image decoder",
            "encode image to base64",
            "base64 data uri",
            "convert image to base64",
            // Vietnamese keywords
            "mã hóa base64",
            "giải mã base64",
            "base64 trực tuyến",
            "công cụ base64",
            "chuyển đổi base64",
            "mã hóa hình ảnh base64",
            "giải mã hình ảnh base64",
            "chuyển hình ảnh sang base64",
        ],
        openGraph: {
            title: "Base64 Encoder & Decoder Online - Free Base64 Converter Tool 2025",
            description: "Free online Base64 encoder and decoder. Convert text and images to Base64 and decode Base64 strings instantly.",
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title: "Base64 Encoder & Decoder - Free Online Tool",
            description: "Encode and decode Base64 strings and images online. Fast and secure Base64 converter.",
        },
        alternates: {
            canonical: "/tools/base64",
            languages: {
                en: "/tools/base64?lang=en",
                vi: "/tools/base64?lang=vi",
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
    };
}

export default function Base64Page() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <Base64Content />
            </div>
        </div>
    );
}
