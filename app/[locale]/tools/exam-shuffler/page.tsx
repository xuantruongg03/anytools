import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import ExamShufflerClient from "./ExamShufflerClient";
import ExamShufflerContent from "./ExamShufflerContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const metadata = {
        en: {
            title: `Multiple Choice Exam Shuffler - Generate Multi-Code Tests ${getCurrentYear()}`,
            description: "Free online multiple choice exam shuffler. Shuffle questions and answer choices (A, B, C, D) to generate multiple test variants with an automatic Answer Key Matrix.",
            keywords: "exam shuffler, test shuffler, multiple choice test maker, shuffle exam questions, answer key matrix, test variant generator, trộn đề trắc nghiệm, tạo mã đề thi",
        },
        vi: {
            title: `Trộn Đề Thi Trắc Nghiệm Online - Tạo Nhiều Mã Đề Kèm Đáp Án ${getCurrentYear()}`,
            description: "Công cụ trộn đề thi trắc nghiệm online miễn phí. Đảo thứ tự câu hỏi và phương án A, B, C, D để tạo nhiều mã đề kèm bảng ma trận đáp án chấm điểm.",
            keywords: "trộn đề trắc nghiệm, xáo đề thi, phần mềm trộn đề trắc nghiệm, tạo mã đề, bảng đáp án trắc nghiệm, đảo câu hỏi trắc nghiệm, exam shuffler, đề thi trắc nghiệm online",
        },
    };

    const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.en;

    return {
        title: currentMetadata.title,
        description: currentMetadata.description,
        keywords: currentMetadata.keywords,
        openGraph: {
            title: currentMetadata.title,
            description: currentMetadata.description,
            type: "website",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            url: `https://anytools.online/${locale}/tools/exam-shuffler`,
        },
        twitter: {
            card: "summary_large_image",
            title: currentMetadata.title,
            description: currentMetadata.description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/exam-shuffler`,
            languages: {
                en: "https://anytools.online/en/tools/exam-shuffler",
                vi: "https://anytools.online/vi/tools/exam-shuffler",
                "x-default": "https://anytools.online/en/tools/exam-shuffler",
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
    };
}

export default async function ExamShufflerPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/exam-shuffler");

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: isVi ? "Trộn Đề Thi Trắc Nghiệm" : "Multiple Choice Exam Shuffler",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description: isVi
            ? "Công cụ đảo câu hỏi và đáp án trắc nghiệm tạo nhiều mã đề thi kèm ma trận đáp án chấm điểm."
            : "Free multiple choice exam shuffler to generate test variants and answer key matrix.",
        url: `https://anytools.online/${locale}/tools/exam-shuffler`,
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://anytools.online",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Tools",
                item: "https://anytools.online/#tools",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: isVi ? "Trộn Đề Thi Trắc Nghiệm" : "Multiple Choice Exam Shuffler",
                item: `https://anytools.online/${locale}/tools/exam-shuffler`,
            },
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <ToolPageLayout
                title={isVi ? "Trộn Đề Thi Trắc Nghiệm" : "Multiple Choice Exam Shuffler"}
                description={
                    isVi
                        ? "Tự động đảo câu hỏi và đáp án để tạo nhiều mã đề thi kèm bảng ma trận đáp án chấm thi nhanh chóng."
                        : "Shuffle questions and choices to generate multiple exam test codes with automatic answer key matrix."
                }
            >
                <ExamShufflerClient />
                <ExamShufflerContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/exam-shuffler' />
            </ToolPageLayout>
        </>
    );
}
