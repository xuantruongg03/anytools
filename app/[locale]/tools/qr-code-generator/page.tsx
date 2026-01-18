import type { Metadata } from "next";
import { use } from "react";
import { ToolPageLayout } from "@/components/layout";
import QrCodeGeneratorContent from "./QrCodeGeneratorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const titles = {
        en: "QR Code Generator - Free Custom QR Code with Logo 2026",
        vi: "Tạo Mã QR Online - Công Cụ Tạo QR Code Có Logo 2026",
    };

    const descriptions = {
        en: "Free QR code generator with logo. Customize colors, size, style. Create QR for URLs, text, WiFi, contacts. Download PNG or SVG.",
        vi: "Tạo mã QR miễn phí có logo. Tùy chỉnh màu sắc, kích thước, phong cách. Tạo QR cho URL, WiFi, liên hệ. Tải PNG hoặc SVG.",
    };

    const keywords = {
        en: ["qr code generator", "custom qr code", "qr code with logo", "free qr code maker", "generate qr code online", "qr code colors", "download qr code png", "qr code svg", "styled qr code"],
        vi: ["tạo mã qr", "qr code tùy chỉnh", "mã qr có logo", "tạo qr code miễn phí", "tạo mã qr online", "qr code màu sắc", "tải qr code png", "qr code svg", "mã qr đẹp"],
    };

    const currentLocale = (locale === "en" || locale === "vi" ? locale : "en") as "en" | "vi";

    return {
        title: titles[currentLocale],
        description: descriptions[currentLocale],
        keywords: keywords[currentLocale],
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/qr-code-generator`,
            languages: {
                en: "https://anytools.online/en/tools/qr-code-generator",
                vi: "https://anytools.online/vi/tools/qr-code-generator",
                "x-default": "https://anytools.online/en/tools/qr-code-generator",
            },
        },
        robots: { index: true, follow: true },
        openGraph: {
            title: titles[currentLocale],
            description: descriptions[currentLocale],
            url: `https://anytools.online/${locale}/tools/qr-code-generator`,
            type: "website",
        },
    };
}

export default function QrCodeGeneratorPage({ params }: Props) {
    const { locale: urlLocale } = use(params);
    const locale = (urlLocale === "en" || urlLocale === "vi" ? urlLocale : "en") as "en" | "vi";
    const relatedTools = getRelatedTools("/tools/qr-code-generator", 6);
    const isVi = locale === "vi";

    return (
        <ToolPageLayout title={isVi ? "Tạo Mã QR" : "QR Code Generator"} description={isVi ? "Tạo mã QR tùy chỉnh online miễn phí. Thêm logo, đổi màu sắc, điều chỉnh kích thước và phong cách." : "Generate customizable QR codes online for free. Add logos, change colors, adjust size and style."}>
            <QrCodeGeneratorContent locale={locale} />
            <RelatedTools tools={relatedTools} currentPath='/tools/qr-code-generator' />
        </ToolPageLayout>
    );
}
