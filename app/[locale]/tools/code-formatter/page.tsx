import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import CodeFormatterContent from "./CodeFormatterContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Format Code Online - Beautify JavaScript, CSS, HTML, SQL, Python 2026" : "Code Formatter Online - Beautify JavaScript, CSS, HTML, SQL, Python 2026";
    const description = isVi ? "Format và beautify code miễn phí. Hỗ trợ JavaScript, TypeScript, CSS, HTML, JSON, SQL, Python, XML, Markdown. Minify code nhanh chóng." : "Free online code formatter and beautifier. Support JavaScript, TypeScript, CSS, HTML, JSON, SQL, Python, XML, Markdown. Minify code instantly.";

    return {
        title,
        description,
        keywords: [
            // English keywords
            "code formatter",
            "code beautifier",
            "format code online",
            "javascript formatter",
            "html formatter",
            "css formatter",
            "sql formatter",
            "python formatter",
            "json formatter",
            "xml formatter",
            "typescript formatter",
            "code beautify",
            "pretty print code",
            "minify code",
            "code minifier",
            "online code formatter",
            "free code beautifier",
            "format javascript",
            "format html",
            "format css",
            "format sql",
            "format python",
            "prettier online",
            // Vietnamese keywords
            "format code",
            "định dạng code",
            "làm đẹp code",
            "công cụ format code",
            "format javascript online",
            "format html online",
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Code Formatter",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/code-formatter`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Code Formatter Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/code-formatter`,
            languages: {
                en: "https://anytools.online/en/tools/code-formatter",
                vi: "https://anytools.online/vi/tools/code-formatter",
                "x-default": "https://anytools.online/en/tools/code-formatter",
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

export default async function CodeFormatterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Format Code Online" : "Code Formatter Online",
        applicationCategory: "DeveloperApplication",
        description: isVi ? "Công cụ format và beautify code miễn phí. Hỗ trợ JavaScript, TypeScript, CSS, HTML, JSON, SQL, Python, XML. Minify code nhanh chóng." : "Free code formatter and beautifier. Support JavaScript, TypeScript, CSS, HTML, JSON, SQL, Python, XML. Minify code instantly.",
        url: `https://anytools.online/${locale}/tools/code-formatter`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Format JavaScript/TypeScript", "Format HTML", "Format CSS/SCSS/LESS", "Format JSON", "Format SQL", "Format Python", "Format XML", "Format Markdown", "Minify code", "Syntax highlighting", "Custom indentation", "No registration required", "100% Free", "Secure & Private - processed locally"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/code-formatter", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Format Code Online - Miễn Phí" : "Code Formatter Online - Free"} description={isVi ? "Format và beautify code JavaScript, CSS, HTML, SQL, Python, JSON, XML miễn phí." : "Format and beautify JavaScript, CSS, HTML, SQL, Python, JSON, XML code for free."}>
                <CodeFormatterContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/code-formatter' />
            </ToolPageLayout>
        </>
    );
}
