import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import BmiCalculatorContent from "./BmiCalculatorContent";
import { bmiCalculatorTranslations } from "@/lib/i18n/tools/bmi-calculator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tính Chỉ Số BMI & Nhu Cầu Calo / TDEE Chuẩn Y Khoa ${getCurrentYear()}`
            : `BMI & Calorie Calculator - Calculate BMI, BMR, TDEE Online ${getCurrentYear()}`,
        description: isVi
            ? "Tính chỉ số khối cơ thể BMI, BMR và nhu cầu calo mỗi ngày (TDEE) theo chuẩn y khoa WHO và chuẩn Châu Á. Hỗ trợ mục tiêu giảm cân, tăng cân và tỉ lệ dinh dưỡng Macro."
            : "Free online BMI & Calorie Calculator. Calculate your Body Mass Index (BMI), Basal Metabolic Rate (BMR), and Total Daily Energy Expenditure (TDEE) with WHO standards.",
        keywords: [
            "tinh bmi", "tinh chi so bmi", "bmi calculator", "tinh calo",
            "tinh tdee", "tinh bmr", "tinh thâm hut calo", "giam can tinh calo"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tính Chỉ Số BMI & Nhu Cầu Calo Chuẩn Y Khoa ${getCurrentYear()}`
                : `BMI & Daily Calorie Calculator Online ${getCurrentYear()}`,
            description: isVi
                ? "Đánh giá thể trạng chuẩn xác, gợi ý lượng calo và thực đơn dinh dưỡng cá nhân hóa."
                : "Accurately assess your body mass index and daily caloric needs for health goals.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/bmi-calculator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/bmi-calculator`,
            languages: {
                en: "https://anytools.online/en/tools/bmi-calculator",
                vi: "https://anytools.online/vi/tools/bmi-calculator",
                "x-default": "https://anytools.online/en/tools/bmi-calculator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function BmiCalculatorPage({ params }: Props) {
    const { locale } = await params;
    const t = bmiCalculatorTranslations[locale as "en" | "vi"] || bmiCalculatorTranslations.en;
    const relatedTools = getRelatedTools("/tools/bmi-calculator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "HealthApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/bmi-calculator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Metric and Imperial Unit System Support",
            "Mifflin-St Jeor Basal Metabolic Rate (BMR) Estimation",
            "Total Daily Energy Expenditure (TDEE) Calculation",
            "Deficit & Surplus Calorie Targets for Weight Management",
            "Macronutrient Split (Protein, Carbs, Fats) Guidance"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <BmiCalculatorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/bmi-calculator' />
            </ToolPageLayout>
        </>
    );
}
