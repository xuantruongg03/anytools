import type { Metadata } from "next";
import HashGeneratorContent from "./HashGeneratorContent";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Hash Generator & Text Encryptor - MD5, SHA-256, SHA-512, AES Encryption 2025",
        description: "Free online hash generator and text encryptor. Generate SHA-1, SHA-256, SHA-512 hashes or encrypt/decrypt text with AES-256 encryption. Secure, fast, and works entirely in your browser.",
        keywords: ["hash generator", "md5 generator", "sha1", "sha256", "sha512", "hash calculator", "checksum", "cryptographic hash", "aes encryption", "text encryptor", "encrypt decrypt", "password hash", "tạo hash", "mã hóa văn bản", "giải mã", "công cụ mã hóa", "aes encryption online"],
        openGraph: {
            title: "Hash Generator & Encryptor - Generate Hashes & Encrypt Text",
            description: "Generate cryptographic hashes or encrypt/decrypt text with AES-256. Supports SHA-1, SHA-256, SHA-512 hash algorithms.",
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title: "Hash Generator & Encryptor - Generate Hashes & Encrypt Text",
            description: "Generate cryptographic hashes or encrypt/decrypt text with AES-256. Supports SHA-1, SHA-256, SHA-512.",
        },
        alternates: {
            canonical: "https://anytools.online/tools/hash-generator",
            languages: {
                "x-default": "https://anytools.online/tools/hash-generator",
                en: "https://anytools.online/tools/hash-generator",
                vi: "https://anytools.online/tools/hash-generator",
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

export default function HashGeneratorPage() {
    return <HashGeneratorContent />;
}
