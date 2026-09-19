import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import SqlFormatterContent from "./SqlFormatterContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const year = getCurrentYear();

    const title = isVi
        ? `Định Dạng SQL - Format & Làm Đẹp Câu Lệnh SQL Online Miễn Phí ${year}`
        : `SQL Formatter Online - Beautify & Format SQL Queries ${year}`;

    const description = isVi
        ? "Công cụ định dạng câu lệnh SQL miễn phí. Format, làm đẹp, thụt dòng và viết hoa từ khóa SQL cho PostgreSQL, MySQL, SQLite, BigQuery, T-SQL."
        : "Free online SQL formatter and beautifier. Format, indent, and uppercase keywords for PostgreSQL, MySQL, SQLite, BigQuery, SQL Server queries instantly.";

    return {
        title,
        description,
        keywords: [
            "sql formatter",
            "format sql online",
            "beautify sql",
            "sql pretty print",
            "postgres formatter",
            "mysql formatter",
            "sqlite formatter",
            "bigquery formatter",
            "sql minifier",
            "free sql formatter",
            // Vietnamese keywords
            "định dạng sql",
            "format sql online tiếng việt",
            "làm đẹp câu lệnh sql",
            "công cụ sql",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/sql-formatter`,
            locale: isVi ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/sql-formatter`,
            languages: {
                en: "https://anytools.online/en/tools/sql-formatter",
                vi: "https://anytools.online/vi/tools/sql-formatter",
            },
        },
    };
}

export default async function SqlFormatterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/sql-formatter", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Định Dạng SQL" : "SQL Formatter"}
            description={
                isVi
                    ? "Định dạng, làm đẹp, thụt dòng và chuẩn hóa câu lệnh SQL cho PostgreSQL, MySQL, SQLite, BigQuery, T-SQL."
                    : "Format, beautify, indent, and uppercase SQL queries for PostgreSQL, MySQL, SQLite, BigQuery, and T-SQL."
            }
        >
            <SqlFormatterContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/sql-formatter' />
        </ToolPageLayout>
    );
}
