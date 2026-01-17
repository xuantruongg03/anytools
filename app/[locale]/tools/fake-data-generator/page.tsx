import type { Metadata } from "next";
import FakeDataGeneratorContent from "./FakeDataGeneratorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import { ToolPageLayout } from "@/components/layout";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi 
        ? "Tạo Dữ Liệu Giả - Lorem Ipsum & Fake Data Generator Miễn Phí 2026" 
        : "Fake Data Generator - Lorem Ipsum & Test Data Generator Free 2026";
    const description = isVi 
        ? "Công cụ tạo dữ liệu giả miễn phí. Lorem Ipsum, tên người, email, địa chỉ, số điện thoại, UUID, ngày tháng. Hoàn hảo cho testing và development." 
        : "Free fake data generator tool. Create Lorem Ipsum, names, emails, addresses, phone numbers, UUIDs, dates. Perfect for testing and development.";

    return {
        title,
        description,
        keywords: [
            // English keywords
            "fake data generator",
            "lorem ipsum generator",
            "test data generator",
            "random data generator",
            "fake name generator",
            "dummy data",
            "placeholder text",
            "mock data",
            "sample data generator",
            "faker js online",
            // Vietnamese keywords
            "tạo dữ liệu giả",
            "lorem ipsum",
            "dữ liệu test",
            "tạo dữ liệu mẫu",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/fake-data-generator`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/fake-data-generator`,
            languages: {
                en: "https://anytools.online/en/tools/fake-data-generator",
                vi: "https://anytools.online/vi/tools/fake-data-generator",
                "x-default": "https://anytools.online/en/tools/fake-data-generator",
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

export default async function FakeDataGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/fake-data-generator", 6);

    return (
        <ToolPageLayout 
            title={isVi ? "Tạo Dữ Liệu Giả" : "Fake Data Generator"} 
            description={isVi 
                ? "Tạo dữ liệu giả cho testing và development. Lorem Ipsum, tên, email, địa chỉ, số điện thoại, UUID và nhiều loại dữ liệu khác." 
                : "Generate fake data for testing and development. Lorem Ipsum, names, emails, addresses, phone numbers, UUIDs, and more data types."
            }
        >
            <FakeDataGeneratorContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/fake-data-generator' />
        </ToolPageLayout>
    );
}
