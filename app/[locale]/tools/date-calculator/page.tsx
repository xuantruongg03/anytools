import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import DateCalculatorContent from "./DateCalculatorContent";
import { dateCalculatorTranslations } from "@/lib/i18n/tools/date-calculator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tính Số Ngày Giữa 2 Ngày, Đếm Ngày Đi Làm & Tính Tuổi Online ${getCurrentYear()}`
            : `Date & Age Calculator (Days Between & Business Days) ${getCurrentYear()}`,
        description: isVi
            ? "Tính khoảng cách giữa 2 ngày, đếm số ngày đi làm loại trừ Thứ 7 và Chủ Nhật, cộng trừ ngày tháng năm và tính tuổi chính xác kèm cung hoàng đạo chuẩn xác."
            : "Calculate exact days between two dates, exclude weekends for working business days, add/subtract calendar duration, and compute exact chronological age online.",
        keywords: [
            "date calculator", "tinh khoang cach 2 ngay", "dem ngay lam viec",
            "business days calculator", "tinh tuoi", "age calculator online"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tính Ngày & Tính Tuổi Chính Xác Online ${getCurrentYear()}`
                : `Accurate Date & Age Calculator ${getCurrentYear()}`,
            description: isVi
                ? "Đếm số ngày giữa hai mốc thời gian, lọc ngày làm việc và tính tuổi chi tiết."
                : "Compute days between dates, working days, and exact chronological age.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/date-calculator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/date-calculator`,
            languages: {
                en: "https://anytools.online/en/tools/date-calculator",
                vi: "https://anytools.online/vi/tools/date-calculator",
                "x-default": "https://anytools.online/en/tools/date-calculator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function DateCalculatorPage({ params }: Props) {
    const { locale } = await params;
    const t = dateCalculatorTranslations[locale as "en" | "vi"] || dateCalculatorTranslations.en;
    const relatedTools = getRelatedTools("/tools/date-calculator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "UtilityApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/date-calculator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Calculate calendar days and duration between two dates",
            "Automatic business / working days exclusion (filters Saturdays and Sundays)",
            "Date addition and subtraction arithmetic by years, months, weeks, and days",
            "Exact chronological age breakdown with birthday countdown and zodiac stats",
            "100% private client-side calendar calculations"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <DateCalculatorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/date-calculator' />
            </ToolPageLayout>
        </>
    );
}
