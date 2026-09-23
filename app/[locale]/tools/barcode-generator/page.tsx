import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import BarcodeGeneratorContent from "./BarcodeGeneratorContent";
import { barcodeGeneratorTranslations } from "@/lib/i18n/tools/barcode-generator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tạo & Quét Mã Vạch Barcode Online Miễn Phí - Code 128, EAN-13 ${getCurrentYear()}`
            : `Free Online Barcode Generator & Scanner - Code 128, EAN-13 ${getCurrentYear()}`,
        description: isVi
            ? "Tạo mã vạch barcode online chuyên nghiệp chuẩn Code 128, EAN-13, UPC, Code 39. Tải ảnh PNG, vector SVG sắc nét để in ấn và quét mã vạch trực tiếp bằng camera."
            : "Generate free high-resolution barcodes in Code 128, EAN-13, UPC-A, and Code 39. Download printable SVG/PNG or scan barcodes directly with camera.",
        keywords: [
            "barcode generator", "tao ma vach", "tao barcode online", "quet ma vach",
            "code 128 generator", "ean 13 barcode", "in ma vach", "barcode scanner online"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tạo & Quét Mã Vạch Barcode Online ${getCurrentYear()}`
                : `Barcode Generator & Scanner Online ${getCurrentYear()}`,
            description: isVi
                ? "Tạo mã vạch đa định dạng chuẩn quốc tế, xuất file vector in ấn sắc nét."
                : "Generate and scan standard barcodes for logistics, retail, and inventory.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/barcode-generator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/barcode-generator`,
            languages: {
                en: "https://anytools.online/en/tools/barcode-generator",
                vi: "https://anytools.online/vi/tools/barcode-generator",
                "x-default": "https://anytools.online/en/tools/barcode-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function BarcodeGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const t = barcodeGeneratorTranslations[locale as "en" | "vi"] || barcodeGeneratorTranslations.en;
    const relatedTools = getRelatedTools("/tools/barcode-generator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "BusinessApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/barcode-generator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Code 128, EAN-13, UPC-A, Code 39, ITF-14, MSI, Codabar Support",
            "Real-time Live Preview & Custom Sizing",
            "Vector SVG and High-Res PNG Download",
            "Direct Thermal & Inkjet Printing Dialog",
            "Webcam & Upload Barcode Scanner"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <BarcodeGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/barcode-generator' />
            </ToolPageLayout>
        </>
    );
}
