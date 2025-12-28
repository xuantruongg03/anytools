import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import LaTeXContent from "./LaTeXContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Trình Soạn LaTeX Online - Viết Công Thức Toán Học Miễn Phí 2025" : "LaTeX Editor Online - Free Math Equation Editor 2025";
    const description = isVi ? "Trình soạn LaTeX miễn phí với xem trước thời gian thực. Viết công thức toán học, phương trình, ký hiệu khoa học. Có bảng ký hiệu, mẫu công thức sẵn có." : "Free online LaTeX editor with real-time preview. Write math equations, formulas, scientific notation. Includes symbol palette, templates, and instant rendering.";

    return {
        title,
        description,
        keywords: [
            "latex editor",
            "latex online",
            "latex equation editor",
            "math equation editor",
            "latex formula",
            "latex math",
            "katex editor",
            "mathjax editor",
            "latex preview",
            "latex renderer",
            "mathematical notation",
            "scientific formula",
            "trình soạn latex",
            "công thức toán học",
            "latex tiếng việt",
            "viết công thức latex",
            "latex miễn phí",
            "soạn thảo công thức",
            "ký hiệu toán học",
            "phương trình latex",
            "free latex editor",
            "online equation editor",
            "latex generator",
            "math formula maker",
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools LaTeX Editor",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/latex-editor`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "LaTeX Equation Editor Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isVi ? "Trình Soạn LaTeX - Công Thức Toán Học Miễn Phí" : "LaTeX Editor - Free Math Equation Editor",
            description: isVi ? "Viết công thức toán học với LaTeX. Xem trước thời gian thực, miễn phí." : "Write math equations with LaTeX. Real-time preview, completely free.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/latex-editor`,
            languages: {
                en: "https://anytools.online/en/tools/latex-editor",
                vi: "https://anytools.online/vi/tools/latex-editor",
                "x-default": "https://anytools.online/en/tools/latex-editor",
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
        classification: "Education Tools",
    };
}

export default async function LaTeXEditorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Trình Soạn Công Thức LaTeX Online" : "LaTeX Equation Editor Online",
        applicationCategory: "EducationalApplication",
        description: isVi ? "Trình soạn LaTeX miễn phí với xem trước thời gian thực. Viết công thức toán học, phương trình, ký hiệu khoa học dễ dàng. Có bảng ký hiệu và mẫu công thức sẵn có." : "Free online LaTeX editor with real-time preview. Write math equations, formulas, and scientific notation easily. Includes symbol palette and ready-to-use templates.",
        url: `https://anytools.online/${locale}/tools/latex-editor`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Real-time LaTeX preview", "Symbol palette with 200+ symbols", "Greek letters and operators", "Matrix and equation templates", "Copy LaTeX code", "Copy MathML", "Equation history", "Dark mode support", "No registration required", "100% Free", "Mobile responsive"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/latex-editor", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Trình Soạn Công Thức LaTeX" : "LaTeX Equation Editor"} description={isVi ? "Viết, xem trước và sao chép công thức toán học LaTeX. Miễn phí và dễ sử dụng." : "Write, preview, and copy LaTeX mathematical equations. Free and easy to use."}>
                <LaTeXContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/latex-editor' />
            </ToolPageLayout>
        </>
    );
}
