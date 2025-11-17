import type { Metadata } from "next";
import WorldClockClient from "./WorldClockClient";
import WorldClockContent from "./WorldClockContent";
import { RelatedTools } from "@/components";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" ? "Đồng Hồ Thế Giới | AnyTools" : "World Clock | AnyTools",
        description: locale === "vi" ? "Xem giờ hiện tại của các thành phố trên thế giới" : "Check current time across multiple time zones worldwide",
    };
}

function WorldClockPage() {
    const relatedTools = [
        {
            href: "/tools/timestamp-converter",
            icon: "⏰",
            nameEn: "Timestamp Converter",
            nameVi: "Chuyển đổi Timestamp",
            descriptionEn: "Convert between Unix timestamp and human-readable date/time formats",
            descriptionVi: "Chuyển đổi giữa Unix timestamp và định dạng ngày giờ dễ đọc",
        },
        {
            href: "/tools/qr-code-generator",
            icon: "📱",
            nameEn: "QR Code Generator",
            nameVi: "Tạo mã QR",
            descriptionEn: "Generate QR codes for text, URLs, contact information and more",
            descriptionVi: "Tạo mã QR cho văn bản, URL, thông tin liên hệ và nhiều hơn nữa",
        },
    ];

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8 max-w-6xl'>
                <WorldClockClient />
                <WorldClockContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/world-clock' />
            </div>
        </div>
    );
}

export default WorldClockPage;
