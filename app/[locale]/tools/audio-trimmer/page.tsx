import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import AudioTrimmerContent from "./AudioTrimmerContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "Cắt Nhạc Online & Làm Nhạc Chuông Miễn Phí (MP3, WAV, M4A)"
        : "Audio Trimmer & Cutter Online - Free Ringtone Maker";
    const description = isVi
        ? "Công cụ cắt nhạc trực tuyến miễn phí. Cắt bài hát, tạo nhạc chuông MP3, WAV, M4A với biểu đồ sóng âm thanh trực quan và hiệu ứng Fade in/out. 100% Client-side."
        : "Free online audio trimmer and ringtone maker. Cut and trim MP3, WAV, and M4A audio files with interactive waveform display and fade effects. 100% private.";

    return {
        title,
        description,
        keywords: [
            "cat nhac online",
            "audio trimmer online",
            "cat nhac chuong",
            "mp3 cutter",
            "cat file am thanh",
            "ringtone maker online",
            "free audio cutter",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/audio-trimmer`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/audio-trimmer`,
            languages: {
                en: "https://anytools.online/en/tools/audio-trimmer",
                vi: "https://anytools.online/vi/tools/audio-trimmer",
                "x-default": "https://anytools.online/en/tools/audio-trimmer",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function AudioTrimmerPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/audio-trimmer", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Cắt Nhạc & Làm Nhạc Chuông" : "Audio Trimmer & Cutter"}
            description={
                isVi
                    ? "Cắt bài hát hoặc file ghi âm để làm nhạc chuông điện thoại, âm thanh thông báo. Biểu đồ sóng âm trực quan, nghe thử trước khi tải về và bảo mật tuyệt đối."
                    : "Easily trim songs or voice recordings to create custom ringtones and sound clips. Features live waveform visualization and zero server uploads."
            }
        >
            <AudioTrimmerContent />

            {/* SEO & Educational Guide Section */}
            <div className='max-w-4xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 Hướng Dẫn Cắt Nhạc Làm Nhạc Chuông Trong 3 Bước" : "📖 How to Cut Audio & Make Ringtones in 3 Steps"}
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                1. {isVi ? "Tải File Âm Thanh" : "Upload Audio"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Kéo thả bài hát (MP3, WAV, M4A, OGG) từ máy tính của bạn vào khung tải lên."
                                    : "Drag and drop your audio file (MP3, WAV, M4A, OGG) into the upload area."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                2. {isVi ? "Chọn Điểm Bắt Đầu & Kết Thúc" : "Select Region"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Kéo thanh trượt Start và End để chọn đoạn điệp khúc ưng ý. Bạn có thể bật hiệu ứng Fade In/Out để âm thanh êm tai hơn."
                                    : "Adjust Start and End sliders to highlight your favorite part. Toggle Fade In/Out for smooth transitions."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                3. {isVi ? "Nghe Thử & Tải Về" : "Preview & Save"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Bấm 'Nghe Đoạn Đã Chọn' để kiểm tra, sau đó nhấn 'Cắt & Tải Về Máy' để nhận file âm thanh ngay tức thì."
                                    : "Preview the trimmed selection with one click, then hit Download to save your new audio file."}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/audio-trimmer' />
        </ToolPageLayout>
    );
}
