import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import WorldClockClient from "./WorldClockClient";
import WorldClockContent from "./WorldClockContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Đồng Hồ Thế Giới - Xem Giờ Trực Tuyến Miễn Phí 2026" : "World Clock - Free Online Time Zone Checker 2026";
    const description = isVi ? "Xem giờ hiện tại của các thành phố trên thế giới. Công cụ đồng hồ thế giới miễn phí." : "Check current time across multiple time zones worldwide. Free online world clock tool.";

    return {
        title,
        description,
        keywords: ["world clock", "time zones", "current time", "international clock", "đồng hồ thế giới", "múi giờ", "giờ quốc tế"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/world-clock`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/world-clock`,
            languages: {
                en: "https://anytools.online/en/tools/world-clock",
                vi: "https://anytools.online/vi/tools/world-clock",
                "x-default": "https://anytools.online/en/tools/world-clock",
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

export default async function WorldClockPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/world-clock", 6);

    return (
        <ToolPageLayout title={isVi ? "Đồng Hồ Thế Giới" : "World Clock"} description={isVi ? "Xem giờ hiện tại của các thành phố trên thế giới" : "Check current time across multiple time zones worldwide"}>
            <WorldClockClient />
            <WorldClockContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/world-clock' />
        </ToolPageLayout>
    );
}
