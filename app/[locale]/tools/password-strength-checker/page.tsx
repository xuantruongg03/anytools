import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import PasswordStrengthContent from "./PasswordStrengthContent";
import { passwordStrengthTranslations } from "@/lib/i18n/tools/password-strength-checker";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Kiểm Tra Độ Mạnh Mật Khẩu & Đo Entropy Online ${getCurrentYear()} | AnyTools`
            : `Password Strength & Entropy Analyzer Online ${getCurrentYear()} | AnyTools`,
        description: isVi
            ? "Phân tích độ an toàn mật khẩu theo thang đo Shannon Entropy. Dự đoán thời gian bẻ khóa bằng GPU (RTX 4090), phát hiện chuỗi quy luật và sinh mật khẩu ngẫu nhiên an toàn 100% offline."
            : "Analyze password security and Shannon entropy bits with offline GPU brute-force crack time estimations, pattern checks, and built-in cryptographically secure password generator.",
        keywords: [
            "password strength checker", "kiem tra do manh mat khau", "password entropy analyzer", "shannon entropy password",
            "time to crack password", "brute force crack time", "tao mat khau an toan"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Kiểm Tra Độ Mạnh Mật Khẩu & Đo Entropy ${getCurrentYear()}`
                : `Password Strength & Entropy Analyzer ${getCurrentYear()}`,
            description: isVi
                ? "Đo lường độ khó đoán và thời gian bẻ khóa của mật khẩu bằng lý thuyết thông tin Shannon."
                : "Analyze password entropy and estimate brute-force cracking times instantly.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/password-strength-checker",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/password-strength-checker`,
            languages: {
                en: "https://anytools.online/en/tools/password-strength-checker",
                vi: "https://anytools.online/vi/tools/password-strength-checker",
                "x-default": "https://anytools.online/en/tools/password-strength-checker",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function PasswordStrengthPage({ params }: Props) {
    const { locale } = await params;
    const t = passwordStrengthTranslations[locale as "en" | "vi"] || passwordStrengthTranslations.en;
    const relatedTools = getRelatedTools("/tools/password-strength-checker", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "SecurityApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/password-strength-checker`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Information-theoretic Shannon entropy calculation in bits",
            "Multi-vector brute-force crack time estimates (Online & Offline GPU clusters)",
            "NIST SP 800-63B compliant security checklist and leak pattern detection",
            "Cryptographically secure CSPRNG password generator",
            "100% Client-side local memory processing with zero network transmission"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <PasswordStrengthContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/password-strength-checker' />
            </ToolPageLayout>
        </>
    );
}
