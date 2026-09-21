import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import LoanCalculatorContent from "./LoanCalculatorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "Tính Lãi Vay & Lãi Kép Ngân Hàng - Bảng Lịch Trình Trả Nợ Chi Tiết"
        : "Loan & Compound Interest Calculator - Amortization Schedule";
    const description = isVi
        ? "Công cụ tính lãi vay ngân hàng theo dư nợ giảm dần hoặc dư nợ ban đầu, tính lãi kép tiết kiệm với bảng phân bổ gốc lãi từng tháng và biểu đồ tài chính trực quan."
        : "Free online loan and compound interest calculator. Calculate mortgage repayments, monthly amortization schedules, and investment growth with visual charts.";

    return {
        title,
        description,
        keywords: [
            "tinh lai vay",
            "tinh lai vay ngan hang",
            "tinh lai kep",
            "tinh tra gop",
            "bang tra no ngan hang",
            "loan calculator",
            "compound interest calculator",
            "mortgage amortization schedule",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/loan-calculator`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/loan-calculator`,
            languages: {
                en: "https://anytools.online/en/tools/loan-calculator",
                vi: "https://anytools.online/vi/tools/loan-calculator",
                "x-default": "https://anytools.online/en/tools/loan-calculator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function LoanCalculatorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/loan-calculator", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Tính Lãi Vay & Lãi Kép" : "Loan & Interest Calculator"}
            description={
                isVi
                    ? "Công cụ tính toán tài chính cá nhân: tính lãi suất vay mua nhà, mua xe, trả góp ngân hàng theo dư nợ giảm dần và tính lãi kép tiết kiệm thông minh."
                    : "Calculate monthly loan repayments, amortization schedules, and compound interest investment growth with detailed monthly breakdowns."
            }
        >
            <LoanCalculatorContent />

            {/* SEO & Educational Guide Section */}
            <div className='max-w-4xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 So Sánh Lãi Suất Dư Nợ Giảm Dần & Dư Nợ Ban Đầu" : "📖 Reducing Balance vs Flat Rate Interest"}
                    </h2>
                    <div className='space-y-4 text-sm md:text-base leading-relaxed'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60'>
                                <h3 className='font-bold text-blue-900 dark:text-blue-200 text-base mb-2'>
                                    1. {isVi ? "Dư nợ giảm dần (Reducing Balance)" : "Reducing Balance"}
                                </h3>
                                <p className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>
                                    {isVi
                                        ? "Tiền lãi mỗi tháng được tính trên số tiền gốc thực tế còn nợ sau khi đã trừ đi phần gốc đã trả các tháng trước. Số tiền trả hàng tháng sẽ giảm dần theo thời gian. Đây là phương thức chuẩn được các ngân hàng thương mại áp dụng cho vay mua nhà, mua xe."
                                        : "Interest is calculated each period on the remaining principal balance. The monthly interest payment decreases over time as principal is paid off. This is standard for commercial mortgages and bank loans."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60'>
                                <h3 className='font-bold text-amber-900 dark:text-amber-200 text-base mb-2'>
                                    2. {isVi ? "Dư nợ ban đầu (Flat Rate)" : "Flat Rate"}
                                </h3>
                                <p className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>
                                    {isVi
                                        ? "Tiền lãi mỗi tháng được tính cố định dựa trên 100% số tiền vay ban đầu suốt toàn bộ thời hạn vay. Mặc dù lãi suất ghi trên hợp đồng có vẻ thấp, nhưng thực tế tổng số tiền lãi phải trả lại cao hơn nhiều so với dư nợ giảm dần."
                                        : "Interest is calculated on the initial principal throughout the entire loan duration. Even if the nominal rate looks low, the effective interest paid is significantly higher than reducing balance loans."}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "❓ Câu Hỏi Thường Gặp Khi Vay Vốn & Tích Lũy" : "❓ Frequently Asked Questions"}
                    </h2>
                    <div className='space-y-4'>
                        <div>
                            <h3 className='font-bold text-base text-gray-900 dark:text-white mb-1'>
                                {isVi
                                    ? "Lãi kép là gì và vì sao được gọi là kỳ quan thứ 8 của thế giới?"
                                    : "What is compound interest and why is it so powerful?"}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                {isVi
                                    ? "Lãi kép (Compound Interest) là hiện tượng 'lãi mẹ đẻ lãi con', khi tiền lãi sinh ra trong kỳ trước được cộng dồn vào tiền gốc để tiếp tục sinh lãi trong kỳ tiếp theo. Với thời gian tích lũy từ 10 năm trở lên, phần tiền lãi sinh ra có thể vượt gấp nhiều lần tổng số tiền gốc ban đầu."
                                    : "Compound interest is interest calculated on the initial principal, which also includes all accumulated interest from previous periods. Over long horizons (10-30 years), exponential compounding can grow your investment portfolio significantly beyond your deposits."}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/loan-calculator' />
        </ToolPageLayout>
    );
}
