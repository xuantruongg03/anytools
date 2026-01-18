import type { Metadata } from "next";
import { use } from "react";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import MockApiGeneratorClient from "./MockApiGeneratorClient";
import MockApiGeneratorContent from "./MockApiGeneratorContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    const title = isVi ? "Mock API Generator - Tạo API Giả Lập Miễn Phí 2026" : "Mock API Generator - Create Free Mock APIs Online 2026";

    const description = isVi ? "Tạo Mock API miễn phí với JSON response tùy chỉnh, dynamic data, chia sẻ endpoint. Hoàn hảo cho frontend dev, testing và prototyping." : "Free Mock API Generator. Create REST APIs with custom JSON responses, dynamic data, shareable endpoints. Perfect for frontend development and testing.";

    const keywords = [
        "mock api generator",
        "mock api",
        "fake api",
        "rest api mock",
        "api testing",
        "mock server",
        "json placeholder",
        "api simulator",
        "mock data generator",
        "fake rest api",
        "test api",
        "api prototyping",
        "mock backend",
        "api development tool",
        // Vietnamese keywords
        "tạo mock api",
        "api giả lập",
        "công cụ test api",
        "mock api miễn phí",
        "fake json api",
        "dummy api",
    ];

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/mock-api-generator`,
            locale: isVi ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/mock-api-generator`,
            languages: {
                en: "https://anytools.online/en/tools/mock-api-generator",
                vi: "https://anytools.online/vi/tools/mock-api-generator",
                "x-default": "https://anytools.online/en/tools/mock-api-generator",
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

export default function MockApiGeneratorPage({ params }: Props) {
    const { locale: urlLocale } = use(params);
    const locale = urlLocale === "vi" ? "vi" : "en";
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/mock-api-generator", 6);

    return (
        <ToolPageLayout title={isVi ? "Mock API Generator" : "Mock API Generator"} description={isVi ? "Tạo Mock API tùy chỉnh ngay lập tức. Tạo endpoint giả lập với dynamic data, custom response và URL có thể chia sẻ. Hoàn hảo cho frontend development, testing và prototyping." : "Create custom mock REST APIs instantly. Generate fake endpoints with dynamic data, custom responses, and shareable URLs. Perfect for frontend development, testing, and prototyping."}>
            <MockApiGeneratorClient />
            <MockApiGeneratorContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/mock-api-generator' />
        </ToolPageLayout>
    );
}
