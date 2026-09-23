import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import TextFancyFontContent from "./TextFancyFontContent";
import { textFancyFontTranslations } from "@/lib/i18n/tools/text-fancy-font";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tạo Chữ Đẹp, Kí Tự Đặc Biệt & ASCII Text Online ${getCurrentYear()}`
            : `Fancy Font Generator, Aesthetic Text & ASCII Art ${getCurrentYear()}`,
        description: isVi
            ? "Đổi font chữ đẹp, viết chữ kiểu aesthetic, chữ in nghiêng/đậm Unicode và chữ nghệ thuật ASCII cho Bio Instagram, Facebook, TikTok và tên game ngầu."
            : "Convert normal text into aesthetic fancy fonts, stylish Unicode symbols, and retro ASCII art banners. Copy and paste into Instagram bio, Discord, and game names.",
        keywords: [
            "fancy font generator", "chu dep", "ki tu dac biet", "font chu nghieng facebook",
            "aesthetic text maker", "ascii text generator", "zalgo text"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tạo Chữ Kiểu Đẹp & Kí Tự Đặc Biệt Online ${getCurrentYear()}`
                : `Fancy Font & Aesthetic Unicode Text Generator ${getCurrentYear()}`,
            description: isVi
                ? "Tạo chữ kiểu, font nghệ thuật và chữ đặc biệt cho mạng xã hội."
                : "Generate aesthetic Unicode fonts and ASCII banners with 1-click copy.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/text-fancy-font",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/text-fancy-font`,
            languages: {
                en: "https://anytools.online/en/tools/text-fancy-font",
                vi: "https://anytools.online/vi/tools/text-fancy-font",
                "x-default": "https://anytools.online/en/tools/text-fancy-font",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function TextFancyFontPage({ params }: Props) {
    const { locale } = await params;
    const t = textFancyFontTranslations[locale as "en" | "vi"] || textFancyFontTranslations.en;
    const relatedTools = getRelatedTools("/tools/text-fancy-font", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "UtilityApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/text-fancy-font`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Over 25+ aesthetic Unicode font styles (Cursive, Gothic, Monospace, Bubble)",
            "Retro ASCII block and isometric text banner generator",
            "Customizable Zalgo glitch distortion controls",
            "Instant one-click copy to clipboard with real-time preview",
            "Mobile-friendly and compatible across all social media platforms"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <TextFancyFontContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/text-fancy-font' />
            </ToolPageLayout>
        </>
    );
}
