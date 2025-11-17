import type { Metadata } from "next";
import StopwatchClient from "./StopwatchClient";
import StopwatchContent from "./StopwatchContent";
import { RelatedTools } from "@/components";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" ? "Đồng Hồ Bấm Giây | AnyTools" : "Stopwatch | AnyTools",
        description: locale === "vi" ? "Đo thời gian chính xác với tính năng bấm giờ từng vòng" : "Precise time measurement with lap tracking",
    };
}

function StopwatchPage() {
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
                <StopwatchClient />
                <StopwatchContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/stopwatch' />
            </div>
        </div>
    );
}

export default StopwatchPage;
