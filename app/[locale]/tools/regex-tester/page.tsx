import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RegexTesterContent from "./RegexTesterContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Kiểm Tra Regex - Công Cụ Test Biểu Thức Chính Quy 2025" : "Regex Tester - Regular Expression Testing Tool Online 2025";
    const description = isVi ? "Kiểm tra và xác thực biểu thức chính quy trực tuyến. Công cụ kiểm tra regex miễn phí với khớp mẫu, hỗ trợ cờ và kết quả tức thì. Hoàn hảo cho lập trình viên gỡ lỗi mẫu regex. 100% xử lý phía client và an toàn." : "Test and validate regular expressions online. Free regex tester with pattern matching, flags support, and instant results. Perfect for developers debugging regex patterns. 100% client-side and secure.";

    return {
        title,
        description,
        keywords: ["regex tester", "regular expression", "regex validator", "pattern matching", "regex tool", "regex online", "test regex", "regex debugger", "regex matcher", "regexp tester", "regex checker", "regex builder", "regex generator", "regex pattern", "kiểm tra regex", "test biểu thức chính quy", "công cụ regex"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Regex Tester",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/regex-tester`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Regex Tester Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Regex Tester - Free Online Tool",
            description: "Test regular expressions instantly. Free and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/regex-tester`,
            languages: {
                en: "https://anytools.online/en/tools/regex-tester",
                vi: "https://anytools.online/vi/tools/regex-tester",
                "x-default": "https://anytools.online/en/tools/regex-tester",
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

export default async function RegexTesterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Kiểm Tra Regex" : "Regex Tester Online",
        applicationCategory: "DeveloperApplication",
        description: isVi ? "Công cụ kiểm tra regex (biểu thức chính quy) miễn phí trực tuyến. Kiểm tra và xác thực mẫu regex với kết quả khớp tức thì. Hỗ trợ tất cả cờ regex. 100% xử lý phía client." : "Free online regex (regular expression) tester. Test and validate regex patterns with instant matching results. Support all regex flags. 100% client-side processing.",
        url: `https://anytools.online/${locale}/tools/regex-tester`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Instant Pattern Matching", "All Regex Flags Support (g, i, m, s, u, y)", "Real-time Match Highlighting", "Pattern Validation", "100% Client-side Processing", "No Data Sent to Server", "Free and Unlimited Use"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/regex-tester", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Kiểm Tra Regex" : "Regex Tester"} description={isVi ? "Kiểm tra và xác thực biểu thức chính quy trực tuyến. Công cụ kiểm tra regex miễn phí." : "Test and validate regular expressions online. Free regex tester with pattern matching and instant results."}>
                <RegexTesterContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/regex-tester' />
            </ToolPageLayout>
        </>
    );
}
