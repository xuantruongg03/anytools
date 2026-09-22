import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import QrScannerContent from "./QrScannerContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Quét Mã QR & Barcode Online - Bằng Camera & Ảnh Tải Lên ${getCurrentYear()}` 
            : `QR Code & Barcode Scanner Online - Camera & Image Reader ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ quét mã QR online miễn phí. Quét trực tiếp bằng camera điện thoại/máy tính hoặc tải ảnh có mã QR, tự động nhận diện đường link, Wi-Fi và văn bản. 100% bảo mật." 
            : "Free online QR code and barcode scanner. Scan instantly with your device camera or upload image files. Auto-detect URLs, Wi-Fi credentials, and contact cards without server uploads.",
        keywords: [
            "qr scanner", "quét mã qr online", "đọc mã qr", "qr code reader", "scan qr code",
            "quét qr bằng camera", "quét qr từ ảnh", "barcode scanner online"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools QR Scanner",
        openGraph: {
            title: locale === "vi" 
                ? `Quét Mã QR Online Bằng Camera & Ảnh ${getCurrentYear()}` 
                : `QR Code Scanner Online - Free Web Scanner ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Quét mã QR trực tiếp qua camera hoặc tải ảnh. Nhanh chóng, chuẩn xác, không cần cài app." 
                : "Scan QR codes directly via webcam or image upload without installing any apps.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/qr-scanner",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "QR Scanner Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "QR Code Scanner Online - Free Tool",
            description: "Scan QR codes with your camera or from image files instantly.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/qr-scanner`,
            languages: {
                en: "https://anytools.online/en/tools/qr-scanner",
                vi: "https://anytools.online/vi/tools/qr-scanner",
                "x-default": "https://anytools.online/en/tools/qr-scanner",
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
        classification: "Productivity Tools",
    };
}

export default function QrScannerPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "QR Code & Barcode Scanner Online",
        applicationCategory: "ProductivityApplication",
        description: "Free online QR code scanner tool. Decode QR codes using device cameras or image files with instant URL and Wi-Fi parsing.",
        url: "https://anytools.online/tools/qr-scanner",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Live Camera Video Scanning (Front & Back)",
            "Image File Drag & Drop Upload",
            "URL, Wi-Fi, and Text Auto-Parsing",
            "Audio Beep Confirmation",
            "Scan History Tracking",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires camera access for live scanning.",
    };

    const relatedTools = getRelatedTools("/tools/qr-scanner", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='QR Code & Barcode Scanner'
                description='Scan QR codes and barcodes instantly using your device camera or by uploading image files.'
            >
                <QrScannerContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/qr-scanner' />
            </ToolPageLayout>
        </>
    );
}
