import type { Metadata } from "next";
import TextEncryptionContent from "./TextEncryptionContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import { ToolPageLayout } from "@/components/layout";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Mã Hóa & Giải Mã Văn Bản - AES Encryption Tool Miễn Phí 2026" : "Text Encryption & Decryption - Free AES Encryption Tool 2026";
    const description = isVi ? "Công cụ mã hóa văn bản miễn phí với AES-256, ROT13, Caesar cipher. Bảo vệ dữ liệu an toàn, xử lý 100% trên trình duyệt." : "Free text encryption tool with AES-256, ROT13, Caesar cipher. Secure your data with strong encryption. 100% browser-based.";

    return {
        title,
        description,
        keywords: [
            // English keywords
            "text encryption",
            "aes encryption online",
            "encrypt text free",
            "decrypt text",
            "aes 256 encryption",
            "text cipher",
            "rot13 cipher",
            "caesar cipher",
            "online encryption tool",
            "secure text encryption",
            "encrypt decrypt online",
            // Vietnamese keywords
            "mã hóa văn bản",
            "aes encryption",
            "mã hóa miễn phí",
            "giải mã văn bản",
            "công cụ mã hóa",
            "bảo mật dữ liệu",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/text-encryption`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/text-encryption`,
            languages: {
                en: "https://anytools.online/en/tools/text-encryption",
                vi: "https://anytools.online/vi/tools/text-encryption",
                "x-default": "https://anytools.online/en/tools/text-encryption",
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

export default async function TextEncryptionPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/text-encryption", 6);

    return (
        <ToolPageLayout title={isVi ? "Mã Hóa & Giải Mã Văn Bản" : "Text Encryption & Decryption"} description={isVi ? "Mã hóa và giải mã văn bản với AES-256, ROT13, và Caesar cipher. Bảo mật tuyệt đối, xử lý hoàn toàn trên trình duyệt của bạn." : "Encrypt and decrypt text with AES-256, ROT13, and Caesar cipher. Completely secure, all processing happens in your browser."}>
            <TextEncryptionContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/text-encryption' />
        </ToolPageLayout>
    );
}
