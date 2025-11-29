import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import CountdownClient from "./CountdownClient";
import CountdownContent from "./CountdownContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Đếm Ngược Thời Gian - Countdown Timer Online Miễn Phí 2025" : "Countdown Timer Online - Free Event Countdown Tool 2025";
    const description = isVi ? "Đếm ngược đến các sự kiện quan trọng của bạn. Công cụ hẹn giờ đếm ngược miễn phí với cập nhật trực tiếp." : "Count down to your important events with live updates. Free online countdown timer tool.";

    return {
        title,
        description,
        keywords: ["countdown timer", "event countdown", "timer online", "countdown clock", "đếm ngược", "hẹn giờ", "đồng hồ đếm ngược"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://www.anytools.online/${locale}/tools/countdown`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/countdown`,
            languages: {
                en: "https://www.anytools.online/en/tools/countdown",
                vi: "https://www.anytools.online/vi/tools/countdown",
                "x-default": "https://www.anytools.online/en/tools/countdown",
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

export default async function CountdownPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/countdown", 6);

    return (
        <ToolPageLayout title={isVi ? "Đếm Ngược Thời Gian" : "Countdown Timer"} description={isVi ? "Đếm ngược đến các sự kiện quan trọng của bạn" : "Count down to your important events with live updates"}>
            <CountdownClient />
            <CountdownContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/countdown' />
        </ToolPageLayout>
    );
}
