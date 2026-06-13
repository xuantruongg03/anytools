import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import AutoSearchContent from "./AutoSearchContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Tự Động Tìm Kiếm Bing - Công Cụ Tìm Kiếm Tự Động" : "Auto Bing Search - Automate Bing Searches";
    const description = isVi ? "Công cụ tự động thực hiện tìm kiếm trên Bing để nhận điểm Microsoft Rewards dễ dàng trên PC và di động." : "A tool to automatically perform Bing searches to effortlessly earn Microsoft Rewards points on PC and mobile.";

    return {
        title,
        description,
        keywords: ["auto search", "bing search", "automated search", "search tool", "microsoft rewards bot", "bing search bot"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/auto-search`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/auto-search`,
            languages: {
                en: "https://anytools.online/en/tools/auto-search",
                vi: "https://anytools.online/vi/tools/auto-search",
                "x-default": "https://anytools.online/en/tools/auto-search",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function AutoSearchPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/auto-search", 6);

    return (
        <ToolPageLayout title={isVi ? "Tự Động Tìm Kiếm Bing" : "Auto Bing Search"} description={isVi ? "Công cụ tự động tìm kiếm trên Bing để nhận điểm Microsoft Rewards dễ dàng trên PC và di động. Tự động tìm kiếm với độ trễ tùy chỉnh." : "Automate your Bing searches on both PC and mobile to effortlessly earn Microsoft Rewards points. Customizable search delay."}>
            <AutoSearchContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/auto-search' />
        </ToolPageLayout>
    );
}
