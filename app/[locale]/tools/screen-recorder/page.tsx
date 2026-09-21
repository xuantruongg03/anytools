import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import ScreenRecorderContent from "./ScreenRecorderContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "Quay Màn Hình & Webcam Online Miễn Phí - Không Cần Cài Đặt"
        : "Free Online Screen & Webcam Recorder - No Software Needed";
    const description = isVi
        ? "Công cụ quay video màn hình máy tính và webcam trực tuyến miễn phí. Thu âm giọng nói qua micro hoặc âm thanh hệ thống, xuất video WebM chất lượng cao không có watermark."
        : "Free browser-based screen and webcam recorder. Capture video presentations, tutorials, and bugs with microphone audio. 100% private, no watermark, no software required.";

    return {
        title,
        description,
        keywords: [
            "screen recorder online",
            "quay man hinh online",
            "quay man hinh may tinh",
            "quay video webcam",
            "free screen recorder no watermark",
            "ghi man hinh tren chrome",
            "webcam recorder online",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/screen-recorder`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/screen-recorder`,
            languages: {
                en: "https://anytools.online/en/tools/screen-recorder",
                vi: "https://anytools.online/vi/tools/screen-recorder",
                "x-default": "https://anytools.online/en/tools/screen-recorder",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ScreenRecorderPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/screen-recorder", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Quay Màn Hình & Webcam" : "Screen & Webcam Recorder"}
            description={
                isVi
                    ? "Quay lại toàn bộ màn hình, cửa sổ ứng dụng hoặc webcam trực tiếp trong trình duyệt. Không giới hạn thời gian, không gắn logo watermark và hoàn toàn miễn phí."
                    : "Record your screen, application window, or webcam with audio directly in your browser. Zero downloads, no watermark, and completely free."
            }
        >
            <ScreenRecorderContent />

            {/* SEO & Educational Guide Section */}
            <div className='max-w-4xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 Các Trường Hợp Sử Dụng Phổ Biến" : "📖 Common Use Cases for Screen Recording"}
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>🎓</div>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                {isVi ? "Bài Giảng & Thuyết Trình" : "Lectures & Tutorials"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Giáo viên và học sinh dễ dàng ghi lại slide bài giảng kèm lời thuyết minh qua micro để chia sẻ tài liệu học tập."
                                    : "Teachers and students can easily record presentation slides with voiceover narration for distance learning."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>🐞</div>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                {isVi ? "Báo Cáo Lỗi Phần Mềm" : "Bug & Issue Reporting"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Lập trình viên và kiểm thử viên (QA) quay lại các bước tái hiện bug trong vài giây để đính kèm vào Jira/GitHub."
                                    : "Developers and QA testers can quickly record bug reproduction steps and attach videos directly to tickets."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>💼</div>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                {isVi ? "Hướng Dẫn Thao Tác (SOP)" : "Product Demos & SOPs"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Ghi lại quy trình hướng dẫn sử dụng phần mềm nội bộ cho nhân viên mới mà không cần cài phần mềm quay màn hình phức tạp."
                                    : "Create quick onboarding walkthroughs and software demo videos for teammates and clients."}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/screen-recorder' />
        </ToolPageLayout>
    );
}
