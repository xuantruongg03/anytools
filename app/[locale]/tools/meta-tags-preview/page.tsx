import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import MetaTagsPreviewContent from "./MetaTagsPreviewContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "Xem Trước Thẻ Meta & OpenGraph Mạng Xã Hội (Facebook, X, Google)"
        : "Meta Tags & OpenGraph Previewer - Social Share Card Tester";
    const description = isVi
        ? "Công cụ kiểm tra và xem trước hiển thị thẻ meta tags, OpenGraph trên Facebook, X (Twitter), LinkedIn, Zalo và Google Tìm Kiếm. Tự động sinh mã HTML meta tags chuẩn SEO."
        : "Test and preview Open Graph and Twitter Card meta tags for Facebook, X (Twitter), LinkedIn, and Google Search. Generate clean HTML meta tags with one click.";

    return {
        title,
        description,
        keywords: [
            "meta tags preview",
            "opengraph previewer",
            "kiem tra the meta",
            "facebook card preview",
            "twitter card validator",
            "x card preview",
            "tao the meta tags",
            "social share preview",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/meta-tags-preview`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/meta-tags-preview`,
            languages: {
                en: "https://anytools.online/en/tools/meta-tags-preview",
                vi: "https://anytools.online/vi/tools/meta-tags-preview",
                "x-default": "https://anytools.online/en/tools/meta-tags-preview",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function MetaTagsPreviewPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/meta-tags-preview", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Xem Trước Thẻ Meta & Mạng Xã Hội" : "Meta Tags & Social Preview"}
            description={
                isVi
                    ? "Kiểm tra và xem trước chính xác hình ảnh, tiêu đề và mô tả khi chia sẻ liên kết lên Facebook, X (Twitter) và Google. Tự động sinh thẻ HTML chuẩn SEO."
                    : "Inspect and preview how your website appears across Facebook, X (Twitter), and Google Search. Automatically generate production-ready HTML meta tags."
            }
        >
            <MetaTagsPreviewContent />

            {/* SEO & Educational Guide Section */}
            <div className='max-w-5xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 Tại Sao Thẻ OpenGraph & Meta Tags Quan Trọng?" : "📖 Why Open Graph & Meta Tags Matter?"}
                    </h2>
                    <div className='space-y-4 text-sm md:text-base leading-relaxed'>
                        <p>
                            {isVi
                                ? "Khi người dùng chia sẻ liên kết trang web của bạn lên mạng xã hội (Facebook, Zalo, Twitter/X, LinkedIn), các trình thu thập thông tin (crawlers) sẽ đọc các thẻ Meta và OpenGraph để hiển thị thẻ hình ảnh lớn, tiêu đề và tóm tắt nội dung. Một bài chia sẻ có ảnh đẹp và tiêu đề cuốn hút có thể tăng tỷ lệ nhấp chuột (CTR) lên hơn 300% so với một liên kết văn bản trần."
                                : "When users share your web links across social networks, social media crawlers inspect your Open Graph and Twitter meta tags to render rich media cards with large preview images, titles, and snippets. Well-crafted social cards can increase click-through rates (CTR) by over 300%."}
                        </p>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-2'>
                            <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                                <div className='font-bold text-gray-900 dark:text-white text-sm mb-1'>
                                    📐 {isVi ? "Kích Thước Ảnh Chuẩn" : "Optimal Image Size"}
                                </div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    {isVi
                                        ? "Kích thước khuyến nghị là 1200 x 630 pixels (tỷ lệ 1.91:1) để hiển thị sắc nét nhất trên cả màn hình điện thoại và máy tính."
                                        : "Recommended resolution is 1200 x 630 pixels (1.91:1 aspect ratio) for crisp display on high-DPI screens."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                                <div className='font-bold text-gray-900 dark:text-white text-sm mb-1'>
                                    ✍️ {isVi ? "Độ Dài Tiêu Đề Lý Tưởng" : "Title Length"}
                                </div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    {isVi
                                        ? "Tiêu đề nên nằm trong khoảng 50 đến 60 ký tự để không bị cắt bớt dấu ba chấm (...) trên Facebook và Google."
                                        : "Keep titles between 50 and 60 characters to avoid truncation across search engines and social feeds."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                                <div className='font-bold text-gray-900 dark:text-white text-sm mb-1'>
                                    📝 {isVi ? "Độ Dài Mô Tả" : "Description Length"}
                                </div>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    {isVi
                                        ? "Mô tả nên từ 120 đến 160 ký tự, tóm tắt rõ giá trị mà người đọc sẽ nhận được khi bấm vào liên kết."
                                        : "Descriptions should be between 120 and 160 characters, concisely stating the core value proposition."}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/meta-tags-preview' />
        </ToolPageLayout>
    );
}
