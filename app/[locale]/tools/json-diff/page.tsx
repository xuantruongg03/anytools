import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import JsonDiffContent from "./JsonDiffContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "So Sánh Hai File JSON Online - So Sánh Cạnh Nhau Trực Quan"
        : "JSON Diff & Visual Comparator - Compare Two JSON Files Online";
    const description = isVi
        ? "Công cụ so sánh JSON trực tuyến miễn phí. So sánh hai đối tượng hoặc tài liệu JSON cạnh nhau với đánh dấu màu sắc trực quan cho các trường thêm mới, bị xóa hoặc thay đổi giá trị."
        : "Free online JSON diff and comparison tool. Compare two JSON objects side-by-side with color-coded highlights for added, removed, and modified keys.";

    return {
        title,
        description,
        keywords: [
            "json diff",
            "so sanh json",
            "compare json online",
            "json comparator",
            "json diff online",
            "json visual diff",
            "diff checker json",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/json-diff`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/json-diff`,
            languages: {
                en: "https://anytools.online/en/tools/json-diff",
                vi: "https://anytools.online/vi/tools/json-diff",
                "x-default": "https://anytools.online/en/tools/json-diff",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function JsonDiffPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/json-diff", 6);

    return (
        <ToolPageLayout
            title={isVi ? "So Sánh Hai File JSON" : "JSON Diff & Comparator"}
            description={
                isVi
                    ? "So sánh sự khác biệt giữa hai cấu trúc JSON với đánh dấu màu sắc trực quan. Tự động phát hiện các thuộc tính được thêm mới, bị xóa hoặc thay đổi giá trị."
                    : "Inspect differences between two JSON structures side-by-side with clear visual highlights for added, removed, and modified values."
            }
        >
            <JsonDiffContent />

            {/* SEO & Educational Guide Section */}
            <div className='max-w-5xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 Khi Nào Bạn Cần Sử Dụng JSON Diff?" : "📖 When to Use a JSON Diff Tool?"}
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                📡 {isVi ? "Kiểm Thử & Debug API" : "API Testing & Debugging"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "So sánh phản hồi (response) giữa môi trường Staging và Production để đảm bảo không có trường dữ liệu nào bị thiếu hoặc lỗi kiểu dữ liệu."
                                    : "Compare responses between staging and production environments to spot regression bugs and schema drift."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                ⚙️ {isVi ? "So Sánh Cấu Hình" : "Configuration Auditing"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Kiểm tra nhanh các thay đổi trong file `package.json`, `tsconfig.json`, hoặc các file cấu hình microservices phức tạp."
                                    : "Audit changes in configuration files like `package.json` or microservice settings before deployments."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                🔒 {isVi ? "100% Bảo Mật Cục Bộ" : "Local Data Privacy"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Dữ liệu JSON của bạn chỉ được phân tích trong bộ nhớ RAM trình duyệt, an toàn tuyệt đối cho dữ liệu doanh nghiệp nhạy cảm."
                                    : "Sensitive payloads are never transmitted to external servers. All comparison is performed client-side."}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/json-diff' />
        </ToolPageLayout>
    );
}
