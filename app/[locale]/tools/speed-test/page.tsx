import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import SpeedTestContent from "./SpeedTestContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "Kiểm Tra Tốc Độ Mạng Online - Đo Ping, Download, Upload Chính Xác"
        : "Internet Speed Test Online - Test Ping, Download & Upload Speed";
    const description = isVi
        ? "Công cụ kiểm tra tốc độ mạng internet trực tuyến miễn phí. Đo tốc độ tải xuống (Download), tải lên (Upload), độ trễ (Ping) và Jitter với đồng hồ đo trực quan, chính xác."
        : "Free online internet speed test. Measure your real-time download and upload bandwidth, network latency (Ping), and jitter with an animated gauge meter.";

    return {
        title,
        description,
        keywords: [
            "speed test",
            "kiem tra toc do mang",
            "test mang",
            "do toc do wifi",
            "ping test",
            "download upload speed",
            "internet speed test online",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/speed-test`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/speed-test`,
            languages: {
                en: "https://anytools.online/en/tools/speed-test",
                vi: "https://anytools.online/vi/tools/speed-test",
                "x-default": "https://anytools.online/en/tools/speed-test",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function SpeedTestPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/speed-test", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Kiểm Tra Tốc Độ Mạng" : "Internet Speed Test"}
            description={
                isVi
                    ? "Đo tốc độ truyền tải thực tế của đường truyền internet (Wi-Fi, 4G/5G, mạng dây LAN). Phân tích chi tiết tốc độ Tải xuống, Tải lên và độ trễ Ping."
                    : "Accurately measure your real-world download, upload speeds, and connection latency directly in your browser without any plugins or installations."
            }
        >
            <SpeedTestContent />

            {/* SEO & Educational Guide Section */}
            <div className='max-w-4xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 Ý Nghĩa Của Các Chỉ Số Tốc Độ Mạng" : "📖 Understanding Internet Speed Metrics"}
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-blue-600 dark:text-blue-400 mb-1'>
                                ⬇️ Download Speed ({isVi ? "Tốc độ Tải xuống" : "Download Speed"})
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Tốc độ truyền dữ liệu từ internet về thiết bị của bạn. Chỉ số này quyết định độ mượt khi xem video 4K, lướt web và tải file."
                                    : "The speed data travels from the internet to your device. Essential for smooth 4K streaming, web surfing, and file downloads."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-indigo-600 dark:text-indigo-400 mb-1'>
                                ⬆️ Upload Speed ({isVi ? "Tốc độ Tải lên" : "Upload Speed"})
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Tốc độ gửi dữ liệu từ thiết bị của bạn lên mạng. Quan trọng đối với việc livestream, gọi video Zoom/Google Meet và gửi file đính kèm."
                                    : "The speed data travels from your device to the internet. Crucial for video conferencing, livestreaming, and cloud backups."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-emerald-600 dark:text-emerald-400 mb-1'>
                                ⚡ Ping ({isVi ? "Độ trễ" : "Latency"})
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Thời gian cần thiết để một gói tin gửi đi và nhận lại phản hồi (tính bằng mili-giây ms). Ping càng thấp (&lt; 30ms) thì chơi game online càng mượt, không giật lag."
                                    : "Round-trip time for a data packet measured in milliseconds (ms). Lower ping (< 30ms) ensures responsive online gaming."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-purple-600 dark:text-purple-400 mb-1'>
                                〰️ Jitter ({isVi ? "Độ biến thiên độ trễ" : "Jitter"})
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Mức độ dao động thất thường của thời gian Ping giữa các lần đo. Jitter càng nhỏ (&lt; 5ms) thì kết nối mạng càng ổn định, không bị ngắt quãng cuộc gọi."
                                    : "The variation in ping latency over time. Low jitter (< 5ms) guarantees consistent voice and video quality without stutter."}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/speed-test' />
        </ToolPageLayout>
    );
}
