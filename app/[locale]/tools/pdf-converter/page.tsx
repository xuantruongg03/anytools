import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import PdfConverterContent from "./PdfConverterContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Chuyển Đổi PDF - PDF sang Ảnh, Word Miễn Phí 2026" : "PDF Converter - Convert PDF to Image, Word Free 2026";
    const description = isVi ? "Chuyển đổi PDF sang ảnh (PNG, JPG), Word miễn phí. Hỗ trợ chuyển ảnh sang PDF. Nhanh, bảo mật, không cần đăng ký." : "Convert PDF to images (PNG, JPG), Word for free. Support image to PDF conversion. Fast, secure, no registration required.";

    return {
        title,
        description,
        keywords: [
            // English keywords
            "pdf converter",
            "pdf to image",
            "pdf to png",
            "pdf to jpg",
            "pdf to word",
            "image to pdf",
            "convert pdf online",
            "free pdf converter",
            "pdf converter online",
            "pdf to image converter",
            "convert pdf to png",
            "convert pdf to jpg",
            "pdf extractor",
            "pdf to doc",
            "online pdf tool",
            // Vietnamese keywords
            "chuyển đổi pdf",
            "pdf sang ảnh",
            "pdf sang word",
            "ảnh sang pdf",
            "chuyển pdf miễn phí",
            "công cụ pdf online",
            "pdf sang png",
            "pdf sang jpg",
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools PDF Converter",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/pdf-converter`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "PDF Converter Online Tool",
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
            canonical: `https://anytools.online/${locale}/tools/pdf-converter`,
            languages: {
                en: "https://anytools.online/en/tools/pdf-converter",
                vi: "https://anytools.online/vi/tools/pdf-converter",
                "x-default": "https://anytools.online/en/tools/pdf-converter",
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
        classification: "Document Processing Tools",
    };
}

export default async function PdfConverterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Chuyển Đổi PDF" : "PDF Converter Online",
        applicationCategory: "UtilitiesApplication",
        description: isVi ? "Công cụ chuyển đổi PDF miễn phí. Chuyển PDF sang ảnh, Word và ngược lại. Xử lý nhanh, bảo mật, không cần đăng ký." : "Free PDF converter tool. Convert PDF to images, Word and vice versa. Fast processing, secure, no registration required.",
        url: `https://anytools.online/${locale}/tools/pdf-converter`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["PDF to PNG conversion", "PDF to JPG conversion", "Image to PDF conversion", "Multiple page support", "High quality output", "No file size limit", "No registration required", "100% Free", "Secure & Private - files processed locally", "Fast processing"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/pdf-converter", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Chuyển Đổi PDF - Miễn Phí & Nhanh Chóng" : "PDF Converter - Free & Fast"} description={isVi ? "Chuyển đổi PDF sang ảnh, Word và ngược lại. Miễn phí, bảo mật." : "Convert PDF to images, Word and vice versa. Free and secure."}>
                <PdfConverterContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/pdf-converter' />
            </ToolPageLayout>
        </>
    );
}
