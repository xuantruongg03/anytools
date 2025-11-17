import type { Metadata } from "next";
import CountdownClient from "./CountdownClient";
import CountdownContent from "./CountdownContent";
import { RelatedTools } from "@/components";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" ? "Đếm Ngược Thời Gian | AnyTools" : "Countdown Timer | AnyTools",
        description: locale === "vi" ? "Đếm ngược đến các sự kiện quan trọng của bạn" : "Count down to your important events with live updates",
    };
}

function CountdownPage() {
    const relatedTools = [
        {
            href: "/tools/world-clock",
            icon: "🌍",
            nameEn: "World Clock",
            nameVi: "Đồng Hồ Thế Giới",
            descriptionEn: "Check current time across multiple time zones worldwide",
            descriptionVi: "Xem giờ hiện tại của các thành phố trên thế giới",
        },
        {
            href: "/tools/stopwatch",
            icon: "⏱️",
            nameEn: "Stopwatch",
            nameVi: "Đồng Hồ Bấm Giây",
            descriptionEn: "Precise time measurement with lap tracking",
            descriptionVi: "Đo thời gian chính xác với tính năng bấm giờ từng vòng",
        },
    ];

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8 max-w-6xl'>
                <CountdownClient />
                <CountdownContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/countdown' />
            </div>
        </div>
    );
}

export default CountdownPage;
