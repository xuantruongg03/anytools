import type { Metadata } from "next";
import PasswordGeneratorClient from "./PasswordGeneratorClient";
import PasswordGeneratorContent from "./PasswordGeneratorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const metadata = {
        en: {
            title: "Password Generator & Strengthener - Create Secure Passwords 2025 | AnyTools",
            description: "Generate strong random passwords, create memorable passphrases, or strengthen existing passwords. Free online tool with entropy calculation, security analysis, and customizable options for maximum protection.",
        },
        vi: {
            title: "Trình tạo mật khẩu - Tạo mật khẩu mạnh & an toàn 2025 | AnyTools",
            description: "Tạo mật khẩu ngẫu nhiên mạnh mẽ, tạo cụm mật khẩu dễ nhớ, hoặc tăng cường mật khẩu hiện có. Công cụ miễn phí với tính toán entropy, phân tích bảo mật và tùy chọn tối đa.",
        },
    };

    const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.en;

    return {
        title: currentMetadata.title,
        description: currentMetadata.description,
        keywords: ["password generator", "random password", "secure password", "strong password", "password creator", "generate password online", "password strengthener", "memorable password", "passphrase generator", "entropy calculator", "password security", "trình tạo mật khẩu", "mật khẩu mạnh", "tạo mật khẩu ngẫu nhiên"],
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/password-generator`,
            languages: {
                en: "https://anytools.online/en/tools/password-generator",
                vi: "https://anytools.online/vi/tools/password-generator",
            },
        },
        robots: { index: true, follow: true },
    };
}

function PasswordGeneratorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Password Generator & Strengthener",
        applicationCategory: "SecurityApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description: "Generate strong random passwords, create memorable passphrases, or strengthen existing passwords with our free online tool. Features include entropy calculation, security analysis, and customizable options.",
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What makes a password strong?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "A strong password is at least 12-16 characters long, contains a mix of uppercase and lowercase letters, numbers, and symbols, and avoids common words or patterns. It should have high entropy (at least 60-80 bits) and be unique for each account.",
                },
            },
            {
                "@type": "Question",
                name: "What is password entropy?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Entropy measures password unpredictability in bits. Higher entropy means harder to crack. A password with 60+ bits is considered strong, 80+ bits is very strong, and 100+ bits is excellent.",
                },
            },
            {
                "@type": "Question",
                name: "Should I use a memorable password or random password?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Both have advantages. Random passwords are stronger but harder to remember. Memorable passwords (passphrases) using 4-6 random words with separators are easier to remember while maintaining good security. Use a password manager to store complex random passwords.",
                },
            },
            {
                "@type": "Question",
                name: "How can I strengthen my existing password?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Use our password strengthener to capitalize letters, replace characters with symbols (a→@, e→3, etc.), add numbers or symbols at the end, insert random symbols, or reverse word order. These transformations significantly increase password complexity.",
                },
            },
        ],
    };

    const relatedTools = getRelatedTools("/tools/password-generator", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className='container mx-auto px-4 py-8'>
                    <PasswordGeneratorClient />
                    <PasswordGeneratorContent />
                    <RelatedTools tools={relatedTools} currentPath='/tools/password-generator' />
                </div>
            </div>
        </>
    );
}

export default PasswordGeneratorPage;
