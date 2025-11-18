import type { Metadata } from "next";
import HashGeneratorContent from "./HashGeneratorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Tạo Hash & Mã Hóa Văn Bản - MD5, SHA-256, SHA-512, AES 2025" : "Hash Generator & Text Encryptor - MD5, SHA-256, SHA-512, AES Encryption 2025";
    const description = isVi ? "Công cụ tạo hash và mã hóa văn bản miễn phí trực tuyến. Tạo hash SHA-1, SHA-256, SHA-512 hoặc mã hóa/giải mã văn bản với mã hóa AES-256. An toàn, nhanh và hoạt động hoàn toàn trên trình duyệt của bạn." : "Free online hash generator and text encryptor. Generate SHA-1, SHA-256, SHA-512 hashes or encrypt/decrypt text with AES-256 encryption. Secure, fast, and works entirely in your browser.";

    return {
        title,
        description,
        keywords: ["hash generator", "md5 generator", "sha1", "sha256", "sha512", "hash calculator", "checksum", "cryptographic hash", "aes encryption", "text encryptor", "encrypt decrypt", "password hash", "tạo hash", "mã hóa văn bản", "giải mã", "công cụ mã hóa", "aes encryption online"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://www.anytools.online/${locale}/tools/hash-generator`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/hash-generator`,
            languages: {
                "en-US": "https://www.anytools.online/en/tools/hash-generator",
                "vi-VN": "https://www.anytools.online/vi/tools/hash-generator",
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
    const relatedTools = getRelatedTools("/tools/hash-generator", 6);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <HashGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/hash-generator' />
            </div>
        </div>
    );
}
