import type { Metadata } from "next";
import CsvConverterContent from "./CsvConverterContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import { ToolPageLayout } from "@/components/layout";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Chuyển Đổi CSV - Công Cụ Xem & Convert CSV/JSON/Excel Miễn Phí 2026" : "CSV Converter - Free CSV to JSON, Excel Viewer & Editor 2026";
    const description = isVi ? "Công cụ xem, chỉnh sửa và chuyển đổi CSV miễn phí. Chuyển CSV sang JSON, chỉnh sửa bảng online. Nhanh, an toàn." : "Free CSV viewer and converter. Convert CSV to JSON, edit tables online. Download in multiple formats. Fast and secure.";

    return {
        title,
        description,
        keywords: [
            // English keywords
            "csv converter",
            "csv to json",
            "csv viewer",
            "csv editor online",
            "csv parser",
            "excel to csv",
            "json to csv",
            "csv online tool",
            "csv file converter",
            "free csv converter",
            "csv table editor",
            "parse csv online",
            "csv data converter",
            // Vietnamese keywords
            "chuyển đổi csv",
            "csv sang json",
            "xem file csv",
            "chỉnh sửa csv trực tuyến",
            "công cụ csv",
            "chuyển csv miễn phí",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/csv-converter`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/csv-converter`,
            languages: {
                en: "https://anytools.online/en/tools/csv-converter",
                vi: "https://anytools.online/vi/tools/csv-converter",
                "x-default": "https://anytools.online/en/tools/csv-converter",
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

export default async function CsvConverterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/csv-converter", 6);

    return (
        <ToolPageLayout title={isVi ? "Chuyển Đổi CSV" : "CSV Converter"} description={isVi ? "Xem, chỉnh sửa và chuyển đổi file CSV sang JSON hoặc các định dạng khác. Công cụ miễn phí, nhanh chóng và bảo mật hoàn toàn trong trình duyệt." : "View, edit, and convert CSV files to JSON or other formats. Free online tool with instant results, all processing happens in your browser."}>
            <CsvConverterContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/csv-converter' />
        </ToolPageLayout>
    );
}
