import type { Metadata } from "next";
import UrlEncoderContent from "./UrlEncoderContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "URL Encoder & Decoder Online - Free URL Encoding Tool 2025",
        description: "Free online URL encoder and decoder. Encode special characters for URLs and decode URL-encoded strings instantly. Perfect for web developers working with query parameters and API calls.",
        keywords: [
            // English keywords
            "url encoder",
            "url decoder",
            "encode url",
            "decode url",
            "url escape",
            "url unescape",
            "percent encoding",
            "url encoding online",
            "encode uri component",
            "query string encoder",
            "special characters url",
            "url safe encoding",
            // Vietnamese keywords
            "mã hóa url",
            "giải mã url",
            "encode url trực tuyến",
            "url encoder miễn phí",
            "mã hóa ký tự đặc biệt url",
            "công cụ mã hóa url",
        ],
        openGraph: {
            title: "URL Encoder & Decoder Online - Free URL Encoding Tool 2025",
            description: "Encode and decode URL strings online. Handle special characters in URLs safely and instantly.",
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title: "URL Encoder & Decoder - Free Online Tool",
            description: "Free URL encoder/decoder for web developers. Encode query parameters instantly.",
        },
        alternates: {
            canonical: "https://anytools.online/tools/url-encoder",
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

export default function UrlEncoderPage() {
    const relatedTools = getRelatedTools("/tools/url-encoder", 6);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <UrlEncoderContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/url-encoder' />
            </div>
        </div>
    );
}
