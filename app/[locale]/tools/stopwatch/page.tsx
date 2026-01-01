import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import StopwatchClient from "./StopwatchClient";
import StopwatchContent from "./StopwatchContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Đồng Hồ Bấm Giây Online - Stopwatch Miễn Phí 2026" : "Online Stopwatch - Free Time Measurement Tool 2026";
    const description = isVi ? "Đo thời gian chính xác với tính năng bấm giờ từng vòng. Công cụ đồng hồ bấm giây miễn phí." : "Precise time measurement with lap tracking. Free online stopwatch tool.";

    return {
        title,
        description,
        keywords: ["stopwatch", "timer", "lap timer", "time tracking", "đồng hồ bấm giây", "bấm giờ", "đo thời gian"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/stopwatch`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/stopwatch`,
            languages: {
                en: "https://anytools.online/en/tools/stopwatch",
                vi: "https://anytools.online/vi/tools/stopwatch",
                "x-default": "https://anytools.online/en/tools/stopwatch",
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

export default async function StopwatchPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/stopwatch", 6);

    return (
        <ToolPageLayout title={isVi ? "Đồng Hồ Bấm Giây" : "Stopwatch"} description={isVi ? "Đo thời gian chính xác với tính năng bấm giờ từng vòng" : "Precise time measurement with lap tracking"}>
            <StopwatchClient />
            <StopwatchContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/stopwatch' />
        </ToolPageLayout>
    );
}
