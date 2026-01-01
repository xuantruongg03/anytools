import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import HtmlEntityContent from "./HtmlEntityContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Mã Hóa/Giải Mã HTML Entity - Ký Tự Đặc Biệt 2026" : "HTML Entity Encoder/Decoder - Convert Special Characters 2026";
    const description = isVi ? "Công cụ mã hóa và giải mã HTML entity miễn phí. Chuyển đổi ký tự đặc biệt thành HTML entities. Ngăn chặn XSS." : "Free HTML entity encoder and decoder. Convert special characters to HTML entities for security. Prevent XSS attacks.";

    return {
        title,
        description,
        keywords: ["html entity encoder", "html entity decoder", "html entities", "encode html", "decode html", "xss prevention", "html special characters", "html escape", "mã hóa html", "giải mã html", "ký tự đặc biệt html", "bảo mật html", "ngăn chặn xss"],
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/html-entity-encoder`,
            languages: {
                en: "https://anytools.online/en/tools/html-entity-encoder",
                vi: "https://anytools.online/vi/tools/html-entity-encoder",
                "x-default": "https://anytools.online/en/tools/html-entity-encoder",
            },
        },
        openGraph: {
            title,
            description,
            url: `https://anytools.online/${locale}/tools/html-entity-encoder`,
            siteName: "AnyTools",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        robots: { index: true, follow: true },
    };
}

export default async function HtmlEntityPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "HTML Entity Encoder/Decoder",
        description: "Free online tool to encode and decode HTML entities. Convert special characters to HTML entities for security and prevent XSS attacks.",
        url: "https://anytools.online/tools/html-entity-encoder",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Encode HTML entities", "Decode HTML entities", "Support named entities (&amp;, &lt;, &gt;)", "Support numeric entities (&#38;, &#60;)", "Support hex entities (&#x26;, &#x3C;)", "XSS prevention", "Common entities reference", "Security best practices", "Fast encoding/decoding", "Copy to clipboard", "Free to use"],
        browserRequirements: "Requires JavaScript",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What are HTML entities?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "HTML entities are special codes that represent reserved characters in HTML. They start with & and end with ;, like &amp; for &, &lt; for <, and &gt; for >. They prevent browser interpretation errors and security vulnerabilities.",
                },
            },
            {
                "@type": "Question",
                name: "Why should I encode HTML entities?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Encoding HTML entities is crucial for security and proper display. It prevents XSS attacks, ensures special characters display correctly, maintains HTML validity, protects against injection vulnerabilities, and ensures cross-browser compatibility.",
                },
            },
            {
                "@type": "Question",
                name: "What's the difference between named and numeric entities?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Named entities use descriptive names (&amp;, &copy;, &euro;), numeric entities use decimal codes (&#38;, &#169;), and hex entities use hexadecimal (&#x26;, &#xA9;). Named entities are more readable but numeric/hex entities support all Unicode characters.",
                },
            },
            {
                "@type": "Question",
                name: "When must I encode HTML entities?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Always encode entities when displaying user input, showing code examples, inserting dynamic content, using special characters in attributes, displaying XML/HTML source code, and preventing XSS attacks in web applications.",
                },
            },
        ],
    };

    const relatedTools = getRelatedTools("/tools/html-entity-encoder", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <ToolPageLayout title='HTML Entity Encoder/Decoder' description='Convert special characters to HTML entities for security. Prevent XSS attacks with proper encoding.'>
                <HtmlEntityContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/html-entity-encoder' />
            </ToolPageLayout>
        </>
    );
}
