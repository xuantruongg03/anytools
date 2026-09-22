import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import QuizletExporterContent from "./QuizletExporterContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Xuất Flashcard Quizlet Sang Anki, CSV, Notion Miễn Phí ${getCurrentYear()}` 
            : `Quizlet to Anki & CSV Exporter - Convert Flashcards Free ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ chuyển đổi và xuất bộ thẻ Quizlet sang Anki (.txt), CSV Excel, Notion và JSON online. Tùy chỉnh ký tự phân tách, đảo mặt thẻ học, xóa thẻ trùng lặp." 
            : "Free online Quizlet to Anki and CSV exporter. Convert Quizlet flashcards into Anki decks, Excel CSV, Notion tables, and JSON with custom separators and card swapping.",
        keywords: [
            "quizlet to anki", "xuất quizlet sang anki", "quizlet exporter", "quizlet to csv", "convert quizlet to anki",
            "quizlet to notion", "anki flashcard generator", "export quizlet deck"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Quizlet Exporter",
        openGraph: {
            title: locale === "vi" 
                ? `Xuất Flashcard Quizlet Sang Anki & CSV Online ${getCurrentYear()}` 
                : `Quizlet to Anki Exporter - Free Flashcard Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Chuyển đổi bộ thẻ Quizlet sang định dạng Anki, CSV và Notion chỉ trong vài giây." 
                : "Convert Quizlet flashcards to Anki, CSV, and Notion formats in seconds.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/quizlet-exporter",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Quizlet Exporter Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Quizlet to Anki & CSV Exporter - Free Online Tool",
            description: "Convert Quizlet flashcards into Anki decks and CSV spreadsheets.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/quizlet-exporter`,
            languages: {
                en: "https://anytools.online/en/tools/quizlet-exporter",
                vi: "https://anytools.online/vi/tools/quizlet-exporter",
                "x-default": "https://anytools.online/en/tools/quizlet-exporter",
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
        classification: "Education Tools",
    };
}

export default function QuizletExporterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Quizlet to Anki Exporter Online",
        applicationCategory: "EducationalApplication",
        description: "Free online Quizlet to Anki converter. Export flashcards to Anki, CSV, Notion tables, and JSON format with customizable delimiters.",
        url: "https://anytools.online/tools/quizlet-exporter",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Quizlet to Anki (.txt) Conversion",
            "CSV (Excel / Google Sheets) Export",
            "Notion / Markdown Table Export",
            "Card Swapping (Front & Back)",
            "Duplicate Removal & Delimiter Customization",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/quizlet-exporter", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Quizlet to Anki & CSV Exporter'
                description='Convert Quizlet flashcards into Anki decks, Excel CSV, and Notion tables with custom separators and instant deck download.'
            >
                <QuizletExporterContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/quizlet-exporter' />
            </ToolPageLayout>
        </>
    );
}
