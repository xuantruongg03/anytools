import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import MarkdownContent from "./MarkdownContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Trình Soạn Markdown Online - Xuất PDF, Word Miễn Phí 2026" : "Markdown Editor Online - Export to PDF, Word Free 2026";
    const description = isVi ? "Trình soạn Markdown miễn phí với xem trước thời gian thực. Xuất sang PDF, Word. Hỗ trợ bảng, code, danh sách, và nhiều hơn nữa." : "Free online Markdown editor with real-time preview. Export to PDF and Word. Supports tables, code blocks, lists, and more.";

    return {
        title,
        description,
        keywords: ["markdown editor", "markdown online", "markdown to pdf", "markdown to word", "markdown preview", "markdown converter", "md editor", "github markdown", "markdown formatter", "markdown viewer", "online markdown", "free markdown editor", "trình soạn markdown", "markdown tiếng việt", "chuyển markdown sang pdf", "markdown miễn phí", "soạn thảo markdown", "xem trước markdown", "markdown to docx", "markdown export", "readme editor", "documentation editor"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Markdown Editor",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/markdown-editor`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Markdown Editor Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isVi ? "Trình Soạn Markdown - Xuất PDF, Word Miễn Phí" : "Markdown Editor - Export to PDF, Word Free",
            description: isVi ? "Viết Markdown với xem trước thời gian thực. Xuất PDF, Word miễn phí." : "Write Markdown with real-time preview. Export to PDF, Word for free.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/markdown-editor`,
            languages: {
                en: "https://anytools.online/en/tools/markdown-editor",
                vi: "https://anytools.online/vi/tools/markdown-editor",
                "x-default": "https://anytools.online/en/tools/markdown-editor",
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

export default async function MarkdownEditorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/markdown-editor", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Trình Soạn Markdown Online" : "Online Markdown Editor",
        description: isVi ? "Trình soạn Markdown miễn phí với xem trước thời gian thực và xuất PDF, Word" : "Free Markdown editor with real-time preview and PDF, Word export",
        url: `https://anytools.online/${locale}/tools/markdown-editor`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Real-time Markdown preview", "Export to PDF", "Export to Word", "GitHub Flavored Markdown support", "Formatting toolbar", "Auto-save to browser"],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Trình Soạn Markdown Online" : "Markdown Editor Online"} description={isVi ? "Viết, xem trước và xuất Markdown sang PDF hoặc Word. Miễn phí." : "Write, preview, and export Markdown to PDF or Word. Free."}>
                <MarkdownContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/markdown-editor' />
            </ToolPageLayout>
        </>
    );
}
