import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import HashGeneratorContent from "./HashGeneratorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Tạo Hash & Mã Hóa - MD5, SHA-256, SHA-512, AES 2026" : "Hash Generator - MD5, SHA-256, SHA-512, AES Online 2026";
    const description = isVi ? "Công cụ tạo hash và mã hóa văn bản miễn phí. Tạo hash SHA-1, SHA-256, SHA-512 hoặc mã hóa AES-256. An toàn và nhanh." : "Free online hash generator and encryptor. Generate SHA-1, SHA-256, SHA-512 hashes or encrypt with AES-256. Secure and fast.";

    return {
        title,
        description,
        keywords: ["hash generator", "md5 generator", "sha1", "sha256", "sha512", "hash calculator", "checksum", "cryptographic hash", "aes encryption", "text encryptor", "encrypt decrypt", "password hash", "tạo hash", "mã hóa văn bản", "giải mã", "công cụ mã hóa", "aes encryption online"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/hash-generator`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/hash-generator`,
            languages: {
                en: "https://anytools.online/en/tools/hash-generator",
                vi: "https://anytools.online/vi/tools/hash-generator",
                "x-default": "https://anytools.online/en/tools/hash-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}

export default async function HashGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/hash-generator", 6);

    return (
        <ToolPageLayout title={isVi ? "Tạo Hash & Mã Hóa Văn Bản" : "Hash Generator & Text Encryptor"} description={isVi ? "Công cụ tạo hash và mã hóa văn bản miễn phí. Tạo hash SHA-1, SHA-256, SHA-512 hoặc mã hóa/giải mã với AES-256." : "Free hash generator and text encryptor. Generate SHA-1, SHA-256, SHA-512 hashes or encrypt/decrypt with AES-256."}>
            <HashGeneratorContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/hash-generator' />
        </ToolPageLayout>
    );
}
