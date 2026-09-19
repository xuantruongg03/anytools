import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import CurlConverterContent from "./CurlConverterContent";
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
        ? `Chuyển Đổi cURL Sang Code - Fetch, Axios, Python, Go, PHP Miễn Phí ${year}`
        : `cURL to Code Converter - Convert cURL to Fetch, Axios, Python, Go, PHP ${year}`;

    const description = isVi
        ? "Công cụ chuyển đổi lệnh cURL sang mã nguồn JavaScript Fetch, Axios, Python Requests, Go HTTP và PHP cURL miễn phí. An toàn bảo mật 100% client-side."
        : "Free online tool to convert cURL commands into JavaScript Fetch, Axios, Python Requests, Go net/http, and PHP cURL code snippets. 100% client-side.";

    return {
        title,
        description,
        keywords: [
            "curl to code",
            "curl converter",
            "convert curl to fetch",
            "curl to python requests",
            "curl to axios",
            "curl to go",
            "curl to php",
            "curl generator",
            "cURL to code online",
            "free curl converter",
            // Vietnamese keywords
            "chuyển curl sang code",
            "công cụ curl",
            "convert curl sang javascript",
            "chuyển đổi curl",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/curl-converter`,
            locale: isVi ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/curl-converter`,
            languages: {
                en: "https://anytools.online/en/tools/curl-converter",
                vi: "https://anytools.online/vi/tools/curl-converter",
            },
        },
    };
}

export default async function CurlConverterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/curl-converter", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Chuyển Đổi cURL Sang Code" : "cURL to Code Converter"}
            description={
                isVi
                    ? "Chuyển đổi câu lệnh cURL sang JavaScript Fetch, Axios, Python Requests, Go HTTP và PHP cURL."
                    : "Convert cURL commands to JavaScript Fetch, Axios, Python Requests, Go net/http, and PHP cURL."
            }
        >
            <CurlConverterContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/curl-converter' />
        </ToolPageLayout>
    );
}
