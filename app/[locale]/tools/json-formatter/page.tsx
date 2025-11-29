import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import JsonFormatterContent from "./JsonFormatterContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Định Dạng JSON - Công Cụ Format & Validate JSON Miễn Phí 2025" : "JSON Formatter Online - Free JSON Beautifier & Validator Tool 2025";
    const description = isVi ? "Công cụ định dạng, xác thực và làm đẹp JSON miễn phí trực tuyến. Định dạng, xác thực, thu gọn JSON ngay lập tức. Trình chỉnh sửa JSON tốt nhất với làm nổi bật cú pháp. Không cần cài đặt. Dùng thử ngay!" : "Free online JSON formatter, validator and beautifier. Format, validate, minify JSON instantly. Best JSON editor with syntax highlighting. No installation required. Try now!";

    return {
        title,
        description,
        keywords: [
            "json formatter",
            "json validator",
            "json beautifier",
            "json minifier",
            "format json online",
            "validate json",
            "json syntax checker",
            "json editor online",
            "json pretty print",
            "json viewer",
            "free json formatter",
            "json tool",
            "json parser",
            "online json editor",
            "json formatter online free",
            // Vietnamese keywords
            "định dạng json",
            "công cụ json",
            "json online",
            "validate json tiếng việt",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://www.anytools.online/${locale}/tools/json-formatter`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/json-formatter`,
            languages: {
                en: "https://www.anytools.online/en/tools/json-formatter",
                vi: "https://www.anytools.online/vi/tools/json-formatter",
                "x-default": "https://www.anytools.online/en/tools/json-formatter",
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

export default async function JsonFormatterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/json-formatter", 6);

    return (
        <ToolPageLayout title={isVi ? "Định Dạng JSON" : "JSON Formatter"} description={isVi ? "Công cụ định dạng, xác thực và làm đẹp JSON miễn phí trực tuyến. Định dạng, xác thực, thu gọn JSON ngay lập tức." : "Free online JSON formatter, validator and beautifier. Format, validate, minify JSON instantly."}>
            <JsonFormatterContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/json-formatter' />
        </ToolPageLayout>
    );
}
