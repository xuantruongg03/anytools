import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import ImageToTextContent from "./ImageToTextContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Chuyển Ảnh Thành Văn Bản - OCR Miễn Phí Online 2025" : "Image to Text - Free Online OCR Converter 2025";
    const description = isVi ? "Chuyển đổi ảnh thành văn bản miễn phí bằng công nghệ OCR. Hỗ trợ nhiều ngôn ngữ, nhận dạng chữ in và chữ viết tay. Nhanh chóng, chính xác." : "Convert images to text for free using OCR technology. Support multiple languages, recognize printed and handwritten text. Fast and accurate.";

    return {
        title,
        description,
        keywords: ["image to text", "ocr", "optical character recognition", "extract text from image", "photo to text", "picture to text", "scan text", "text recognition", "chuyển ảnh thành văn bản", "nhận dạng chữ", "ocr tiếng việt", "trích xuất văn bản", "free ocr", "online ocr", "image text extractor", "copy text from image"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Image to Text",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/image-to-text`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Image to Text OCR Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isVi ? "Chuyển Ảnh Thành Văn Bản - OCR Miễn Phí" : "Image to Text - Free Online OCR",
            description: isVi ? "Chuyển đổi ảnh thành văn bản bằng OCR. Miễn phí và bảo mật." : "Convert images to text using OCR. Free and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/image-to-text`,
            languages: {
                en: "https://anytools.online/en/tools/image-to-text",
                vi: "https://anytools.online/vi/tools/image-to-text",
                "x-default": "https://anytools.online/en/tools/image-to-text",
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
        classification: "Image Processing Tools",
    };
}

export default async function ImageToTextPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công Cụ Chuyển Ảnh Thành Văn Bản" : "Image to Text OCR Online",
        applicationCategory: "MultimediaApplication",
        description: isVi ? "Công cụ chuyển đổi ảnh thành văn bản miễn phí sử dụng công nghệ OCR. Hỗ trợ nhiều ngôn ngữ, nhận dạng chữ in và chữ viết tay. Không cần đăng ký, hoàn toàn miễn phí và bảo mật." : "Free image to text conversion tool using OCR technology. Support multiple languages, recognize printed and handwritten text. No registration required, completely free and secure.",
        url: `https://anytools.online/${locale}/tools/image-to-text`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Upload images (JPG, PNG, WEBP, GIF, BMP)", "OCR text recognition", "Multiple language support", "Handwritten text recognition", "Copy extracted text", "File size up to 10MB", "No registration required", "100% Free", "Secure & Private - images not stored", "Fast processing"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/image-to-text", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Chuyển Ảnh Thành Văn Bản (OCR)" : "Image to Text (OCR)"} description={isVi ? "Trích xuất văn bản từ ảnh bằng công nghệ OCR. Miễn phí, nhanh chóng." : "Extract text from images using OCR technology. Free and fast."}>
                <ImageToTextContent locale={locale as "en" | "vi"} />
                <RelatedTools tools={relatedTools} currentPath='/tools/image-to-text' />
            </ToolPageLayout>
        </>
    );
}
