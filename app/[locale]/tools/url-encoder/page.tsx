import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import UrlEncoderContent from "./UrlEncoderContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Mã Hóa & Giải Mã URL - Công Cụ Encode URL Miễn Phí 2025" : "URL Encoder & Decoder Online - Free URL Encoding Tool 2025";
    const description = isVi ? "Công cụ mã hóa và giải mã URL miễn phí trực tuyến. Mã hóa ký tự đặc biệt trong URL và giải mã chuỗi URL ngay lập tức." : "Free online URL encoder and decoder. Encode special characters for URLs and decode URL-encoded strings instantly. Perfect for web developers working with query parameters and API calls.";

    return {
        title,
        description,
        keywords: ["url encoder", "url decoder", "encode url", "decode url", "url escape", "url unescape", "percent encoding", "url encoding online", "encode uri component", "query string encoder", "special characters url", "url safe encoding", "mã hóa url", "giải mã url", "encode url trực tuyến", "url encoder miễn phí", "mã hóa ký tự đặc biệt url", "công cụ mã hóa url"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://www.anytools.online/${locale}/tools/url-encoder`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/url-encoder`,
            languages: {
                en: "https://www.anytools.online/en/tools/url-encoder",
                vi: "https://www.anytools.online/vi/tools/url-encoder",
                "x-default": "https://www.anytools.online/en/tools/url-encoder",
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

export default async function UrlEncoderPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/url-encoder", 6);

    return (
        <ToolPageLayout title={isVi ? "Mã Hóa & Giải Mã URL" : "URL Encoder & Decoder"} description={isVi ? "Công cụ mã hóa và giải mã URL miễn phí. Mã hóa ký tự đặc biệt trong URL ngay lập tức." : "Free online URL encoder and decoder. Encode special characters for URLs and decode URL-encoded strings instantly."}>
            <UrlEncoderContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/url-encoder' />
        </ToolPageLayout>
    );
}
