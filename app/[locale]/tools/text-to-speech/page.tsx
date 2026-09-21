import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import TextToSpeechContent from "./TextToSpeechContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "Chuyển Văn Bản Thành Giọng Nói (Text To Speech) Online Miễn Phí"
        : "Text to Speech Online - Free Natural Voice Synthesis Tool";
    const description = isVi
        ? "Công cụ chuyển đổi văn bản thành giọng nói trực tuyến miễn phí. Hỗ trợ giọng đọc Tiếng Việt, Tiếng Anh và nhiều ngôn ngữ, tùy chỉnh tốc độ, cao độ và âm lượng không giới hạn."
        : "Free online text-to-speech converter. Transform written articles, documents, and notes into natural speech with custom voice selection, speed, and pitch control.";

    return {
        title,
        description,
        keywords: [
            "text to speech",
            "chuyen van ban thanh giong noi",
            "giong doc tieng viet",
            "tts online",
            "doc van ban tu dong",
            "text to speech free",
            "giong doc chi google",
            "voice generator",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/text-to-speech`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/text-to-speech`,
            languages: {
                en: "https://anytools.online/en/tools/text-to-speech",
                vi: "https://anytools.online/vi/tools/text-to-speech",
                "x-default": "https://anytools.online/en/tools/text-to-speech",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function TextToSpeechPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/text-to-speech", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Chuyển Văn Bản Thành Giọng Nói" : "Text to Speech"}
            description={
                isVi
                    ? "Chuyển đổi bài viết, đoạn văn hoặc ghi chú thành giọng đọc tự nhiên. Hỗ trợ nhiều ngôn ngữ với tùy chỉnh tốc độ và cao độ linh hoạt."
                    : "Transform any written text into natural spoken audio. Choose from multiple voices, adjust speaking rate and pitch directly in your browser."
            }
        >
            <TextToSpeechContent />

            {/* SEO & Educational Guide Section */}
            <div className='max-w-4xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 Lợi Ích Của Công Cụ Text To Speech" : "📖 Benefits of Text to Speech"}
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>🎧</div>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                {isVi ? "Nghe Tài Liệu Khi Bận Rộn" : "Multitasking & Audio Listening"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Nghe đọc báo, tài liệu học tập hoặc sách điện tử khi đang đi đường, nấu ăn hoặc tập thể dục."
                                    : "Listen to articles, reports, and study notes while commuting, exercising, or multitasking."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>🗣️</div>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                {isVi ? "Luyện Phát Âm Ngoại Ngữ" : "Language Pronunciation Practice"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Luyện nghe và kiểm tra phát âm chuẩn xác cho các từ tiếng Anh, tiếng Pháp, tiếng Nhật."
                                    : "Improve listening comprehension and verify native pronunciation for foreign languages."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>♿</div>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                {isVi ? "Hỗ Trợ Tiếp Cận (Accessibility)" : "Digital Accessibility"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Trợ thủ đắc lực cho người khiếm thị, người mỏi mắt hoặc gặp khó khăn khi đọc chữ trên màn hình."
                                    : "Empowers visually impaired individuals and users with reading difficulties to consume web content effortlessly."}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/text-to-speech' />
        </ToolPageLayout>
    );
}
