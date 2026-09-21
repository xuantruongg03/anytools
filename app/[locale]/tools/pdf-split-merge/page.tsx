import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import PdfSplitMergeContent from "./PdfSplitMergeContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "Tách & Ghép File PDF Online Miễn Phí - 100% Bảo Mật Trong Trình Duyệt"
        : "PDF Split & Merge Online - 100% Free & Private Client-Side";
    const description = isVi
        ? "Công cụ ghép nhiều file PDF thành 1 hoặc tách riêng từng trang PDF trực tuyến. Xử lý 100% trên trình duyệt của bạn, bảo mật tuyệt đối, không giới hạn dung lượng."
        : "Free online PDF split and merge tool. Combine multiple PDFs into one document or extract specific page ranges directly in your browser with zero data uploads.";

    return {
        title,
        description,
        keywords: [
            "ghep file pdf",
            "tach file pdf",
            "merge pdf online",
            "split pdf online",
            "noi file pdf",
            "cat trang pdf",
            "pdf split and merge",
            "combine pdf free",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/pdf-split-merge`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/pdf-split-merge`,
            languages: {
                en: "https://anytools.online/en/tools/pdf-split-merge",
                vi: "https://anytools.online/vi/tools/pdf-split-merge",
                "x-default": "https://anytools.online/en/tools/pdf-split-merge",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function PdfSplitMergePage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/pdf-split-merge", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Tách & Ghép File PDF" : "PDF Split & Merge"}
            description={
                isVi
                    ? "Ghép nhiều file PDF thành một tài liệu duy nhất hoặc trích xuất các trang cần thiết từ file PDF. Xử lý an toàn 100% trên thiết bị của bạn."
                    : "Combine multiple PDF documents into a single file or extract specific pages with total privacy. 100% processed locally in your browser."
            }
        >
            <PdfSplitMergeContent />

            {/* SEO & Educational Guide Section */}
            <div className='max-w-4xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 Tại Sao Nên Dùng Công Cụ PDF Của AnyTools?" : "📖 Why Choose AnyTools PDF Split & Merge?"}
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>🔒</div>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                {isVi ? "Bảo Mật Tuyệt Đối" : "Zero Server Uploads"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Tài liệu của bạn không bao giờ được gửi lên bất kỳ máy chủ nào. Mọi thao tác tách và ghép đều diễn ra trong bộ nhớ RAM của trình duyệt."
                                    : "Your documents never leave your device. All parsing and manipulation happen entirely within your browser's local sandbox."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>⚡</div>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                {isVi ? "Tốc Độ Tức Thì" : "Blazing Fast"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Không mất thời gian upload file lên mạng hay đợi hàng đợi server. Quá trình ghép hoặc tách trang chỉ mất vài giây."
                                    : "No upload queues or bandwidth bottlenecks. Split and merge operations finish in seconds."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='text-xl mb-1'>♾️</div>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                {isVi ? "Không Giới Hạn" : "Unlimited & Free"}
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Không giới hạn số lần sử dụng, không yêu cầu đăng ký tài khoản và hoàn toàn miễn phí mãi mãi."
                                    : "No daily limits, no registration required, and completely free forever."}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/pdf-split-merge' />
        </ToolPageLayout>
    );
}
