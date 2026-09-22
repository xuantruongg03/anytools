import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import NumberToWordsContent from "./NumberToWordsContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Đọc Số Thành Chữ Chuẩn Online - Kế Toán, Hóa Đơn, Tiền Tệ ${getCurrentYear()}` 
            : `Number to Words Converter Online - English & Vietnamese ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ chuyển đổi và đọc số thành chữ online chuẩn xác. Hỗ trợ tiền tệ VNĐ (đồng chẵn), USD, đọc số hàng tỷ, số thập phân, giọng đọc phát âm và sao chép 1 click." 
            : "Free online number to words converter. Convert numbers to words in English and Vietnamese, financial currency formatting (USD, VND), decimals, and voice pronunciation.",
        keywords: [
            "đọc số thành chữ", "chuyển số thành chữ", "number to words", "đọc tiền thành chữ", "số thành chữ online",
            "đọc số tiếng việt", "đọc số tiếng anh", "convert number to text", "đọc số hóa đơn", "đọc số ngân hàng"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Number To Words",
        openGraph: {
            title: locale === "vi" 
                ? `Đọc Số Thành Chữ Chuẩn - Hóa Đơn & Tiền Tệ ${getCurrentYear()}` 
                : `Number to Words Converter - Free Online Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Chuyển số thành chữ tiếng Việt và tiếng Anh chuẩn quy tắc ngữ pháp và kế toán tài chính. Có phát âm giọng đọc." 
                : "Convert numbers into words with proper grammatical rules and financial currency format. Includes voice playback.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/number-to-words",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Number to Words Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Number to Words Converter - Free Online Tool",
            description: "Convert numbers to words in English and Vietnamese with financial currency formatting.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/number-to-words`,
            languages: {
                en: "https://anytools.online/en/tools/number-to-words",
                vi: "https://anytools.online/vi/tools/number-to-words",
                "x-default": "https://anytools.online/en/tools/number-to-words",
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
        category: "Web Tools",
        classification: "Text Tools",
    };
}

export default function NumberToWordsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Number to Words Converter Online",
        applicationCategory: "UtilityApplication",
        description: "Free online number to words converter. Convert numbers into Vietnamese and English words, supports financial currency format, decimals, and voice synthesis.",
        url: "https://anytools.online/tools/number-to-words",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Vietnamese Number to Words (Linh / Lẻ, Mốt, Lăm, Đồng chẵn)",
            "English Number to Words (Hyphenated, USD currency format)",
            "Text Casing Options (Sentence case, Title Case, UPPERCASE, lowercase)",
            "Voice Speech Pronunciation",
            "Support for Large Numbers (Trillions, Billions) & Decimals",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/number-to-words", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Number to Words Converter'
                description='Convert numbers to words in English and Vietnamese with financial currency formatting and voice pronunciation.'
            >
                <NumberToWordsContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/number-to-words' />
            </ToolPageLayout>
        </>
    );
}
