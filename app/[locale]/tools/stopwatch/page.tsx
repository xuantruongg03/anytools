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
            href: "/tools/countdown",
            icon: "⏳",
            nameEn: "Countdown Timer",
            nameVi: "Đếm Ngược Thời Gian",
            descriptionEn: "Count down to your important events with live updates",
            descriptionVi: "Đếm ngược đến các sự kiện quan trọng của bạn",
        },
        {
            href: "/tools/world-clock",
            icon: "🌍",
            nameEn: "World Clock",
            nameVi: "Đồng Hồ Thế Giới",
            descriptionEn: "Check current time across multiple time zones worldwide",
            descriptionVi: "Xem giờ hiện tại của các thành phố trên thế giới",
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
