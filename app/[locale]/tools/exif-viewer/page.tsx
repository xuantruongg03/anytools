import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import ExifViewerContent from "./ExifViewerContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Xem & Xóa EXIF Ảnh Online - Kiểm Tra Tọa Độ GPS & Thông Số Máy Ảnh ${getCurrentYear()}` 
            : `EXIF Viewer & Metadata Cleaner - Check GPS & Camera Settings ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ xem và xóa thông tin EXIF ảnh online miễn phí. Đọc thông số máy ảnh, khẩu độ, ISO, tốc độ chụp, tọa độ GPS và xóa metadata để bảo vệ quyền riêng tư. 100% client-side." 
            : "Free online EXIF viewer and metadata cleaner. Inspect camera model, lens, ISO, shutter speed, GPS location, and strip sensitive metadata to protect privacy before sharing.",
        keywords: [
            "exif viewer", "xóa exif ảnh", "xem thông tin ảnh", "xóa metadata ảnh", "exif cleaner",
            "gps photo viewer", "check camera settings", "remove exif online", "strip photo metadata"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools EXIF Viewer",
        openGraph: {
            title: locale === "vi" 
                ? `Xem & Xóa EXIF Ảnh Online - Bảo Vệ Quyền Riêng Tư ${getCurrentYear()}` 
                : `EXIF Viewer & Cleaner - Free Online Photo Metadata Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Xem chi tiết thông số chụp ảnh và xóa sạch metadata, vị trí GPS chỉ với 1 click." 
                : "Inspect camera settings, focal length, GPS coordinates, and strip EXIF data before sharing photos.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/exif-viewer",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "EXIF Viewer Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "EXIF Viewer & Cleaner - Free Online Tool",
            description: "Inspect EXIF metadata and strip geolocation data from your photos.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/exif-viewer`,
            languages: {
                en: "https://anytools.online/en/tools/exif-viewer",
                vi: "https://anytools.online/vi/tools/exif-viewer",
                "x-default": "https://anytools.online/en/tools/exif-viewer",
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
        classification: "Multimedia Tools",
    };
}

export default function ExifViewerPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "EXIF Viewer & Metadata Cleaner Online",
        applicationCategory: "MultimediaApplication",
        description: "Free online EXIF viewer and metadata stripper tool. Read camera specs, exposure settings, GPS coordinates, and remove private metadata.",
        url: "https://anytools.online/tools/exif-viewer",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Binary Client-side EXIF Parsing",
            "Camera Make, Model, Lens & Software Extraction",
            "Shutter Speed, Aperture, ISO & Focal Length Analysis",
            "GPS Latitude, Longitude & Google Maps Link",
            "One-Click EXIF Stripping & Privacy Scrubbing",
            "100% Client-side Processing (Zero uploads)"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5 Canvas.",
    };

    const relatedTools = getRelatedTools("/tools/exif-viewer", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='EXIF Viewer & Metadata Cleaner'
                description='Inspect detailed camera settings, lens specs, and GPS coordinates in your photos, and strip sensitive metadata to protect privacy.'
            >
                <ExifViewerContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/exif-viewer' />
            </ToolPageLayout>
        </>
    );
}
