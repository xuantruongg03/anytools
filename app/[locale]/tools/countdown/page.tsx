import type { Metadata } from "next";
import CountdownClient from "./CountdownClient";
import CountdownContent from "./CountdownContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

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
    const relatedTools = getRelatedTools("/tools/countdown", 6);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <CountdownClient />
                <CountdownContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/countdown' />
            </div>
        </div>
    );
}

export default CountdownPage;
