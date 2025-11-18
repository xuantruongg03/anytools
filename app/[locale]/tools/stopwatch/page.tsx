import type { Metadata } from "next";
import StopwatchClient from "./StopwatchClient";
import StopwatchContent from "./StopwatchContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

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
    const relatedTools = getRelatedTools("/tools/stopwatch", 6);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <StopwatchClient />
                <StopwatchContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/stopwatch' />
            </div>
        </div>
    );
}

export default StopwatchPage;
