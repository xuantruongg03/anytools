import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import TypingTestContent from "./TypingTestContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "Kiểm Tra Tốc Độ Gõ Bàn Phím (WPM) - Luyện Gõ 10 Ngón Miễn Phí"
        : "Typing Speed Test (WPM) - Free Online Typing Practice & Test";
    const description = isVi
        ? "Công cụ kiểm tra tốc độ đánh máy online miễn phí. Đo số từ mỗi phút (WPM), số ký tự mỗi phút (CPM) và độ chính xác theo thời gian thực cho Tiếng Việt và Tiếng Anh."
        : "Free online typing speed test. Measure your Words Per Minute (WPM), Characters Per Minute (CPM), and typing accuracy in real time with English and Vietnamese word sets.";

    return {
        title,
        description,
        keywords: [
            "typing speed test",
            "test toc do danh may",
            "kiem tra toc do go ban phim",
            "luyen go 10 ngon",
            "wpm test",
            "words per minute test",
            "typing practice",
            "test wpm tieng viet",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/typing-test`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/typing-test`,
            languages: {
                en: "https://anytools.online/en/tools/typing-test",
                vi: "https://anytools.online/vi/tools/typing-test",
                "x-default": "https://anytools.online/en/tools/typing-test",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function TypingTestPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/typing-test", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Kiểm Tra Tốc Độ Gõ Bàn Phím" : "Typing Speed Test"}
            description={
                isVi
                    ? "Kiểm tra và rèn luyện tốc độ đánh máy 10 ngón với các bài gõ Tiếng Việt và Tiếng Anh. Đo lường chính xác chỉ số WPM, CPM và độ chính xác tức thì."
                    : "Test and improve your typing speed and accuracy with real-time metrics for Words Per Minute (WPM) and Characters Per Minute (CPM)."
            }
        >
            <TypingTestContent />

            {/* SEO & Educational Guide Section */}
            <div className='max-w-4xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 WPM Là Gì & Thang Đo Tốc Độ Đánh Máy" : "📖 What is WPM & Typing Speed Benchmarks"}
                    </h2>
                    <div className='space-y-4 text-sm md:text-base leading-relaxed'>
                        <p>
                            {isVi
                                ? "WPM (Words Per Minute - Số từ mỗi phút) là đơn vị tiêu chuẩn quốc tế dùng để đo tốc độ gõ phím. Trong tiêu chuẩn quốc tế, mỗi 'từ' được tính tương đương với 5 ký tự (bao gồm cả dấu cách). Tốc độ đánh máy càng cao giúp bạn tiết kiệm hàng trăm giờ làm việc và học tập mỗi năm."
                                : "WPM (Words Per Minute) is the international standard unit used to measure typing speed. In standard testing, one 'word' is standardized as 5 keystrokes (including spaces). Higher typing speed can save you hundreds of hours each year in work and study."}
                        </p>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2'>
                            <div className='p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60'>
                                <div className='font-bold text-amber-800 dark:text-amber-300 text-sm'>🐢 {isVi ? "Mới Bắt Đầu" : "Beginner"}</div>
                                <div className='text-2xl font-extrabold text-amber-900 dark:text-amber-200 font-mono mt-1'>&lt; 35 WPM</div>
                                <p className='text-xs text-amber-700 dark:text-amber-400 mt-1'>
                                    {isVi ? "Tốc độ của người mới làm quen hoặc gõ bằng 2-4 ngón." : "Typical for hunt-and-peck typists using 2-4 fingers."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60'>
                                <div className='font-bold text-emerald-800 dark:text-emerald-300 text-sm'>👍 {isVi ? "Trung Bình" : "Average"}</div>
                                <div className='text-2xl font-extrabold text-emerald-900 dark:text-emerald-200 font-mono mt-1'>35 - 55 WPM</div>
                                <p className='text-xs text-emerald-700 dark:text-emerald-400 mt-1'>
                                    {isVi ? "Mức độ trung bình của đa số người dùng máy tính phổ thông." : "Average speed for everyday computer users and office work."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60'>
                                <div className='font-bold text-blue-800 dark:text-blue-300 text-sm'>⚡ {isVi ? "Gõ Nhanh" : "Fast"}</div>
                                <div className='text-2xl font-extrabold text-blue-900 dark:text-blue-200 font-mono mt-1'>55 - 80 WPM</div>
                                <p className='text-xs text-blue-700 dark:text-blue-400 mt-1'>
                                    {isVi ? "Mức độ thành thạo của lập trình viên, thư ký và nhà báo." : "Proficient touch typists, programmers, and copywriters."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60'>
                                <div className='font-bold text-purple-800 dark:text-purple-300 text-sm'>🚀 {isVi ? "Thần Tốc" : "Pro Typist"}</div>
                                <div className='text-2xl font-extrabold text-purple-900 dark:text-purple-200 font-mono mt-1'>80+ WPM</div>
                                <p className='text-xs text-purple-700 dark:text-purple-400 mt-1'>
                                    {isVi ? "Top 5% người gõ nhanh nhất, phản xạ gõ gần như bản năng." : "Top 5% of typists globally, near-instinctive muscle memory."}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "💡 Mẹo Cải Thiện Tốc Độ Gõ Phím 10 Ngón" : "💡 Tips to Increase Your Typing Speed"}
                    </h2>
                    <ul className='space-y-3 text-sm md:text-base leading-relaxed list-disc pl-5'>
                        <li>
                            <strong>{isVi ? "Đặt tay đúng vị trí hàng phím cơ sở (Home Row):" : "Master the Home Row position:"}</strong>{" "}
                            {isVi
                                ? "Ngón trỏ trái đặt lên phím F, ngón trỏ phải đặt lên phím J (2 phím có gờ nổi), các ngón còn lại đặt lần lượt lên A-S-D và K-L-;."
                                : "Rest your index fingers on the F and J keys (with tactile bumps), and align remaining fingers across A-S-D and K-L-;."}
                        </li>
                        <li>
                            <strong>{isVi ? "Ưu tiên độ chính xác trước tốc độ:" : "Focus on accuracy before raw speed:"}</strong>{" "}
                            {isVi
                                ? "Khi bạn gõ chính xác trên 95%, tốc độ WPM sẽ tự nhiên tăng nhanh vì bạn không phải mất thời gian xóa lùi (Backspace)."
                                : "Maintaining 95%+ accuracy avoids costly backspace corrections, resulting in naturally higher WPM."}
                        </li>
                        <li>
                            <strong>{isVi ? "Không nhìn xuống bàn phím:" : "Do not look down at the keyboard:"}</strong>{" "}
                            {isVi
                                ? "Tập nhìn vào màn hình để hình thành phản xạ trí nhớ cơ bắp (muscle memory) cho từng ngón tay."
                                : "Look at the screen to build genuine muscle memory for finger placement."}
                        </li>
                    </ul>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/typing-test' />
        </ToolPageLayout>
    );
}
