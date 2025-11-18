import type { Metadata } from "next";
import { use } from "react";
import QrCodeGeneratorContent from "./QrCodeGeneratorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const titles = {
        en: "QR Code Generator Online - Free Custom QR Code Maker with Logo 2025",
        vi: "Tạo Mã QR Online - Công Cụ Tạo QR Code Miễn Phí Có Logo 2025",
    };

    const descriptions = {
        en: "Generate customizable QR codes online for free. Add logos, change colors, adjust size and style. Create QR codes for URLs, text, WiFi, contact info, and more. Download as PNG or SVG.",
        vi: "Tạo mã QR tùy chỉnh online miễn phí. Thêm logo, đổi màu sắc, điều chỉnh kích thước và phong cách. Tạo mã QR cho URL, văn bản, WiFi, thông tin liên hệ. Tải về PNG hoặc SVG.",
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

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <QrCodeGeneratorContent locale={locale} />
                <RelatedTools tools={relatedTools} currentPath='/tools/qr-code-generator' />
            </div>
        </div>
    );
}
