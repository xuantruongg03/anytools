import type { Metadata } from "next";
import { use } from "react";
import { ToolPageLayout } from "@/components/layout";
import UrlShortenerContent from "./UrlShortenerContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const titles = {
        en: "URL Shortener - Free Link Shortener Online with Multiple Services 2025",
        vi: "Rút Gọn Link - Công Cụ Rút Gọn URL Online Miễn Phí 2025",
    };

    const descriptions = {
        en: "Shorten long URLs instantly for free. Multiple reliable services with automatic fallback. No registration required. Perfect for social media, SMS, print materials, and email campaigns.",
        vi: "Rút gọn URL dài ngay lập tức miễn phí. Nhiều dịch vụ đáng tin cậy với hệ thống dự phòng tự động. Không cần đăng ký. Hoàn hảo cho mạng xã hội, SMS, tài liệu in và chiến dịch email.",
    };

    const keywords = {
        en: ["url shortener", "link shortener", "shorten url", "short link", "free url shortener", "tiny url", "bitly alternative", "url shortening service", "shorten link online"],
        vi: ["rút gọn link", "rút gọn url", "công cụ rút gọn link", "link ngắn", "rút gọn url miễn phí", "tiny url", "bitly việt nam", "dịch vụ rút gọn link"],
    };

    const currentLocale = (locale === "en" || locale === "vi" ? locale : "en") as "en" | "vi";

    return {
        title: titles[currentLocale],
        description: descriptions[currentLocale],
        keywords: keywords[currentLocale],
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/url-shortener`,
            languages: {
                en: "https://www.anytools.online/en/tools/url-shortener",
                vi: "https://www.anytools.online/vi/tools/url-shortener",
                "x-default": "https://www.anytools.online/en/tools/url-shortener",
            },
        },
        robots: { index: true, follow: true },
        openGraph: {
            title: titles[currentLocale],
            description: descriptions[currentLocale],
            url: `https://www.anytools.online/${locale}/tools/url-shortener`,
            type: "website",
        },
    };
}

export default function UrlShortenerPage({ params }: Props) {
    const { locale: urlLocale } = use(params);
    const locale = (urlLocale === "en" || urlLocale === "vi" ? urlLocale : "en") as "en" | "vi";
    const relatedTools = getRelatedTools("/tools/url-shortener", 6);
    const isVi = locale === "vi";

    return (
        <ToolPageLayout title={isVi ? "Rút Gọn Link" : "URL Shortener"} description={isVi ? "Rút gọn URL dài ngay lập tức miễn phí. Nhiều dịch vụ đáng tin cậy." : "Shorten long URLs instantly for free. Multiple reliable services with automatic fallback."}>
            <UrlShortenerContent locale={locale} />
            <RelatedTools tools={relatedTools} currentPath='/tools/url-shortener' />
        </ToolPageLayout>
    );
}
