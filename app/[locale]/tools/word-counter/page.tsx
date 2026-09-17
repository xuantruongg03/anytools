import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import WordCounterContent from "./WordCounterContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const currentYear = new Date().getFullYear();

    const title = isVi
        ? `Đếm Số Từ & Ký Tự Online - Ước Tính Thời Gian Đọc Miễn Phí ${currentYear}`
        : `Word & Character Counter Online - Free Reading Time Estimator ${currentYear}`;

    const description = isVi
        ? "Công cụ đếm từ, đếm ký tự, câu văn, đoạn văn trực tuyến miễn phí. Phân tích mật độ từ khóa chuẩn SEO và ước tính thời gian đọc, thời gian nói."
        : "Free online word and character counter. Real-time counts for words, characters, sentences, paragraphs, reading time, speaking time, and keyword density.";

    return {
        title,
        description,
        keywords: [
            "word counter",
            "character counter",
            "reading time estimator",
            "keyword density checker",
            "count words online",
            "letter counter",
            // Vietnamese keywords
            "đếm số từ",
            "đếm ký tự",
            "đếm chữ",
            "ước tính thời gian đọc",
            "mật độ từ khóa",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/word-counter`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/word-counter`,
            languages: {
                en: "https://anytools.online/en/tools/word-counter",
                vi: "https://anytools.online/vi/tools/word-counter",
                "x-default": "https://anytools.online/en/tools/word-counter",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function WordCounterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/word-counter", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Đếm Số Từ & Ký Tự" : "Word & Character Counter"}
            description={
                isVi
                    ? "Đếm số từ, ký tự (có/không khoảng trắng), câu, đoạn văn và ước tính thời gian đọc, phân tích mật độ từ khóa theo thời gian thực."
                    : "Real-time word, character, sentence, and paragraph counter with reading time estimates and keyword density analysis."
            }
        >
            <WordCounterContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/word-counter' />
        </ToolPageLayout>
    );
}
