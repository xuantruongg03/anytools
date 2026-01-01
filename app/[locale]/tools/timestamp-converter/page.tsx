import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import TimestampConverterContent from "./TimestampConverterContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Chuyển Đổi Timestamp - Convert Unix Timestamp Miễn Phí 2026" : "Timestamp Converter - Unix Timestamp to Date Online 2026";
    const description = isVi ? "Chuyển đổi Unix timestamp sang ngày tháng và ngược lại. Công cụ chuyển đổi epoch time miễn phí cho lập trình viên." : "Convert Unix timestamps to human-readable dates and vice versa. Free online timestamp converter tool for developers.";

    return {
        title,
        description,
        keywords: ["timestamp converter", "unix timestamp", "epoch converter", "timestamp to date", "date to timestamp", "chuyển đổi timestamp", "unix timestamp trực tuyến", "epoch time converter"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/timestamp-converter`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/timestamp-converter`,
            languages: {
                en: "https://anytools.online/en/tools/timestamp-converter",
                vi: "https://anytools.online/vi/tools/timestamp-converter",
                "x-default": "https://anytools.online/en/tools/timestamp-converter",
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

export default async function TimestampConverterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Timestamp Converter Online",
        applicationCategory: "DeveloperApplication",
        description: "Free online Unix timestamp converter. Convert between Unix epoch timestamps and human-readable dates instantly. Support milliseconds and timezone handling. 100% client-side processing.",
        url: "https://anytools.online/tools/timestamp-converter",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Unix Timestamp to Date Conversion", "Date to Unix Timestamp Conversion", "Current Timestamp Display", "Milliseconds Support", "100% Client-side Processing", "No Data Sent to Server", "Free and Unlimited Use"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/timestamp-converter", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title='Timestamp Converter' description='Convert Unix timestamps to human-readable dates and vice versa. Free online tool for epoch time conversion.'>
                <TimestampConverterContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/timestamp-converter' />
            </ToolPageLayout>
        </>
    );
}
