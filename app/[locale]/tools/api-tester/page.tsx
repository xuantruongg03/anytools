import type { Metadata } from "next";
import { RelatedTools } from "@/components";
import ApiTesterClient from "./ApiTesterClient";
import ApiTesterContent from "./ApiTesterContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" ? "Test API Online - Công cụ Test API Miễn Phí 2025 | AnyTools" : "API Tester Online - Free API Testing Tool 2025 | AnyTools",
        description: locale === "vi" ? "Công cụ test API online miễn phí. Gửi HTTP requests (GET, POST, PUT, DELETE), kiểm tra response, headers, body. Giống Postman nhưng chạy trên web. 100% client-side và bảo mật." : "Free online API testing tool. Send HTTP requests (GET, POST, PUT, DELETE), check responses, headers, body. Like Postman but runs in browser. 100% client-side and secure.",
        keywords: ["api tester", "api testing tool", "rest api tester", "http client", "api testing online", "postman alternative", "rest client", "api debugger", "http request tool", "api testing", "test api", "api endpoint tester", "rest api testing", "công cụ test api", "test api online", "kiểm tra api", "gửi http request"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools API Tester",
        openGraph: {
            title: locale === "vi" ? "Test API Online - Công cụ Test API Miễn Phí 2025" : "API Tester Online - Free API Testing Tool 2025",
            description: locale === "vi" ? "Công cụ test API miễn phí. Hỗ trợ GET, POST, PUT, DELETE. Kiểm tra headers, body, response. 100% client-side." : "Free API testing tool. Support GET, POST, PUT, DELETE. Check headers, body, response. 100% client-side.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/api-tester",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "API Tester Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "API Tester - Free Online Tool",
            description: "Test APIs instantly. Free and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: "https://anytools.online/tools/api-tester",
            languages: {
                "en-US": "https://anytools.online/en/tools/api-tester",
                "vi-VN": "https://anytools.online/vi/tools/api-tester",
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
        category: "Web Tools",
        classification: "Developer Tools",
    };
}

function ApiTesterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "API Tester Online",
        applicationCategory: "DeveloperApplication",
        description: "Free online API testing tool. Send HTTP requests (GET, POST, PUT, DELETE, PATCH), test REST APIs, check responses and headers. Perfect alternative to Postman for quick API testing. 100% client-side processing.",
        url: "https://anytools.online/tools/api-tester",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["All HTTP Methods (GET, POST, PUT, DELETE, PATCH)", "Custom Headers Support", "Request Body Editor (JSON, XML, Form Data)", "Query Parameters", "Response Viewer", "Status Code Display", "Response Headers", "Response Time Tracking", "100% Client-side Processing", "No Data Sent to Server", "Free and Unlimited Use"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = [
        {
            href: "/tools/json-formatter",
            icon: "📋",
            nameEn: "JSON Formatter",
            nameVi: "Định dạng JSON",
            descriptionEn: "Format, validate and beautify JSON data",
            descriptionVi: "Định dạng, kiểm tra và làm đẹp dữ liệu JSON",
        },
        {
            href: "/tools/base64",
            icon: "🔐",
            nameEn: "Base64 Encode/Decode",
            nameVi: "Mã hóa/Giải mã Base64",
            descriptionEn: "Encode and decode Base64 strings",
            descriptionVi: "Mã hóa và giải mã chuỗi Base64",
        },
    ];

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className='container mx-auto px-4 py-8 max-w-6xl'>
                    <ApiTesterClient />
                    <ApiTesterContent />
                    <RelatedTools tools={relatedTools} currentPath='/tools/api-tester' />
                </div>
            </div>
        </>
    );
}

export default ApiTesterPage;
