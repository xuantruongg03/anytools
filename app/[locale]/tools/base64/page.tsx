import type { Metadata } from "next";
import Base64Content from "./Base64Content";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import { ToolPageLayout } from "@/components/layout";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Mã Hóa & Giải Mã Base64 - Công Cụ Chuyển Đổi Miễn Phí 2026" : "Base64 Encoder & Decoder - Free Online Converter 2026";
    const description = isVi ? "Công cụ mã hóa và giải mã Base64 miễn phí. Chuyển đổi văn bản, hình ảnh sang Base64 ngay lập tức. Nhanh, an toàn, dễ sử dụng." : "Free online Base64 encoder and decoder. Convert text and images to Base64 instantly. Fast, secure, and easy to use.";

    return {
        title,
        description,
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
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/base64`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/base64`,
            languages: {
                en: "https://anytools.online/en/tools/base64",
                vi: "https://anytools.online/vi/tools/base64",
                "x-default": "https://anytools.online/en/tools/base64",
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

export default async function Base64Page({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/base64", 6);

    return (
        <ToolPageLayout title={isVi ? "Mã Hóa & Giải Mã Base64" : "Base64 Encoder & Decoder"} description={isVi ? "Công cụ mã hóa và giải mã Base64 miễn phí. Chuyển đổi văn bản và hình ảnh sang Base64 và giải mã chuỗi Base64 ngay lập tức. Nhanh, an toàn và dễ sử dụng. Hoàn hảo cho lập trình viên!" : "Free online Base64 encoder and decoder. Convert text and images to Base64 and decode Base64 strings instantly. Fast, secure, and easy to use. Perfect for developers!"}>
            <Base64Content />
            <RelatedTools tools={relatedTools} currentPath='/tools/base64' />
        </ToolPageLayout>
    );
}
