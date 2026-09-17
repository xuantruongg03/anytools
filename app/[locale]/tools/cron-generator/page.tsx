import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import CronGeneratorContent from "./CronGeneratorContent";
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
        ? `Tạo Biểu Thức Cron Online - Trình Dịch & Kiểm Tra Lịch Cron ${currentYear}`
        : `Cron Expression Generator & Explainer Online - Free Syntax Builder ${currentYear}`;

    const description = isVi
        ? "Công cụ tạo và kiểm tra biểu thức cron trực tuyến miễn phí. Dịch cron sang tiếng Việt dễ hiểu, tính toán lịch chạy tiếp theo cho Linux crontab và GitHub Actions."
        : "Free online cron expression generator and validator. Build 5-part cron schedules with plain-English explanations and next run previews.";

    return {
        title,
        description,
        keywords: [
            "cron generator",
            "cron expression builder",
            "crontab syntax",
            "cron explainer",
            "cron validator",
            "github actions cron",
            // Vietnamese keywords
            "tạo biểu thức cron",
            "cú pháp cron",
            "dịch biểu thức cron",
            "hướng dẫn crontab",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/cron-generator`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/cron-generator`,
            languages: {
                en: "https://anytools.online/en/tools/cron-generator",
                vi: "https://anytools.online/vi/tools/cron-generator",
                "x-default": "https://anytools.online/en/tools/cron-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function CronGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/cron-generator", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Tạo Biểu Thức Cron" : "Cron Expression Generator"}
            description={
                isVi
                    ? "Trình tạo biểu thức cron trực quan, dịch biểu thức thành câu văn tự nhiên và xem trước 5 mốc thời gian chạy tiếp theo."
                    : "Visually generate standard cron schedules, read plain language explanations, and preview the next 5 upcoming executions."
            }
        >
            <CronGeneratorContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/cron-generator' />
        </ToolPageLayout>
    );
}
