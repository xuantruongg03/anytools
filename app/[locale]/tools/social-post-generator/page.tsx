import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import SocialPostGeneratorContent from "./SocialPostGeneratorContent";
import { socialPostTranslations } from "@/lib/i18n/tools/social-post-generator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tạo Ảnh Mockup Tweet & Bài Đăng Mạng Xã Hội Online ${getCurrentYear()} | AnyTools`
            : `Social Post & Tweet Mockup Generator ${getCurrentYear()} | AnyTools`,
        description: isVi
            ? "Tạo ảnh mockup bài đăng Twitter (X), Threads và LinkedIn sắc nét với avatar, tích xanh, số lượt tương tác và tải ảnh PNG miễn phí không logo."
            : "Generate pixel-perfect mockups for X (Twitter), Threads, and LinkedIn with custom avatars, verified badges, engagement metrics, and instant high-res PNG export.",
        keywords: [
            "fake tweet generator", "tweet mockup generator", "social post mockup", "tao anh tweet gia",
            "twitter post maker", "threads mockup generator", "linkedin post preview"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tạo Ảnh Mockup Tweet & Bài Đăng Mạng Xã Hội ${getCurrentYear()}`
                : `Social Post & Tweet Mockup Generator ${getCurrentYear()}`,
            description: isVi
                ? "Thiết kế ảnh chụp bài đăng mạng xã hội siêu nét, hỗ trợ X, Threads và LinkedIn."
                : "Create realistic social media post mockups with instant 2x PNG download.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/social-post-generator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/social-post-generator`,
            languages: {
                en: "https://anytools.online/en/tools/social-post-generator",
                vi: "https://anytools.online/vi/tools/social-post-generator",
                "x-default": "https://anytools.online/en/tools/social-post-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function SocialPostPage({ params }: Props) {
    const { locale } = await params;
    const t = socialPostTranslations[locale as "en" | "vi"] || socialPostTranslations.en;
    const relatedTools = getRelatedTools("/tools/social-post-generator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "MultimediaApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/social-post-generator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Realistic templates for X (Twitter), Threads, and LinkedIn",
            "Custom author names, handles, avatars, and verified badges (Blue & Gold)",
            "Configurable engagement counters (Likes, Reposts, Replies, Views)",
            "Light, Dim (Navy), and Pure Dark (OLED) color themes",
            "High-DPI 2x lossless PNG export rendered 100% in-browser"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <SocialPostGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/social-post-generator' />
            </ToolPageLayout>
        </>
    );
}
