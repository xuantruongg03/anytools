import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import AutoSearchContent from "./AutoSearchContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "Tự Động Tìm Kiếm Bing - Nhận Điểm Microsoft Rewards Dễ Dàng"
        : "Auto Bing Search - Earn Microsoft Rewards Points Effortlessly";
    const description = isVi
        ? "Công cụ tự động tìm kiếm trên Bing an toàn, chống cooldown và giả lập hành vi người thật để tối đa điểm Microsoft Rewards trên PC và Di động."
        : "Automate Bing searches safely with anti-cooldown timing, natural human-like jitter, and instant topic generation to maximize Microsoft Rewards points on PC and Mobile.";

    return {
        title,
        description,
        keywords: [
            "auto bing search",
            "bing rewards bot",
            "microsoft rewards auto search",
            "tự động tìm kiếm bing",
            "cày điểm microsoft rewards",
            "bing search automation",
            "kiếm điểm rewards trên pc và mobile",
            "anti cooldown bing search",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/auto-bing-search`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/auto-bing-search`,
            languages: {
                en: "https://anytools.online/en/tools/auto-bing-search",
                vi: "https://anytools.online/vi/tools/auto-bing-search",
                "x-default": "https://anytools.online/en/tools/auto-bing-search",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function AutoSearchPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/auto-bing-search", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Tự Động Tìm Kiếm Bing" : "Auto Bing Search"}
            description={
                isVi
                    ? "Tự động thực hiện tìm kiếm trên Bing để nhận điểm Microsoft Rewards dễ dàng trên PC và Di động. Khởi động tức thì, chống cooldown với độ trễ ngẫu nhiên mô phỏng người thật."
                    : "Automate your Bing searches on both PC and mobile to effortlessly earn Microsoft Rewards points. Instant start, anti-cooldown randomized delays, and human-like browsing simulation."
            }
        >
            <AutoSearchContent />

            {/* Comprehensive SEO & Educational Guide Section */}
            <div className='max-w-4xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                {/* How it works */}
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 Hướng Dẫn Sử Dụng & Tối Ưu Điểm Microsoft Rewards" : "📖 How It Works & Maximizing Microsoft Rewards"}
                    </h2>
                    <div className='space-y-4 text-sm md:text-base leading-relaxed'>
                        <p>
                            {isVi
                                ? "Microsoft Rewards là chương trình tích lũy điểm thưởng khi tìm kiếm trên Bing, có thể đổi sang thẻ quà tặng (Gift Cards), mã nạp game hoặc quyên góp từ thiện. Mỗi ngày, người dùng có thể kiếm từ 90 đến 150 điểm trên máy tính (PC) và 60 đến 100 điểm trên điện thoại (Mobile)."
                                : "Microsoft Rewards is a loyalty program where users earn points for searching on Bing, redeemable for gift cards, gaming credits, and donations. Every day, users can earn 90-150 points on PC and 60-100 points on Mobile."}
                        </p>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-2'>
                            <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/70 border border-slate-200 dark:border-gray-700'>
                                <div className='text-lg font-bold text-blue-600 dark:text-blue-400 mb-1'>1. {isVi ? "Đăng Nhập Bing" : "Log Into Bing"}</div>
                                <p className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>
                                    {isVi
                                        ? "Mở bing.com và đảm bảo bạn đã đăng nhập tài khoản Microsoft trước khi bắt đầu phiên tìm kiếm."
                                        : "Open bing.com and make sure your Microsoft account is logged in before initiating searches."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/70 border border-slate-200 dark:border-gray-700'>
                                <div className='text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-1'>2. {isVi ? "Cài Đặt Độ Trễ" : "Set Safe Delays"}</div>
                                <p className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>
                                    {isVi
                                        ? "Đặt thời gian chờ từ 8-14 giây và bật 'Độ trễ ngẫu nhiên' để tránh bị hệ thống Microsoft kích hoạt Cooldown 15 phút."
                                        : "Set delay to 8-14s and keep 'Random Jitter' enabled to prevent Microsoft's 15-minute search cooldown penalty."}
                                </p>
                            </div>

                            <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/70 border border-slate-200 dark:border-gray-700'>
                                <div className='text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-1'>3. {isVi ? "Tận Hưởng Điểm" : "Earn Points"}</div>
                                <p className='text-xs md:text-sm text-gray-600 dark:text-gray-400'>
                                    {isVi
                                        ? "Theo dõi tiến độ trực tiếp trên AnyTools và kiểm tra bảng điều khiển Rewards để xác nhận điểm được cộng."
                                        : "Monitor live progress on AnyTools and check rewards.bing.com to confirm your points are credited."}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Anti-Cooldown FAQ */}
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "❓ Câu Hỏi Thường Gặp (FAQs)" : "❓ Frequently Asked Questions"}
                    </h2>
                    <div className='space-y-4'>
                        <div>
                            <h3 className='font-bold text-base text-gray-900 dark:text-white mb-1'>
                                {isVi
                                    ? "Tại sao tài khoản của tôi không được cộng điểm hoặc chỉ cộng 3-4 lần rồi dừng?"
                                    : "Why are my searches not awarding points or capping after 3-4 searches?"}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                {isVi
                                    ? "Microsoft áp dụng cơ chế chống bot gọi là 'Search Cooldown'. Khi hệ thống phát hiện các lượt tìm kiếm diễn ra quá nhanh (< 6 giây) hoặc cố định thời gian, tài khoản sẽ bị hạn chế chỉ được nhận điểm cho tối đa 3-4 lượt mỗi 15 phút. Để khắc phục, hãy chuyển sang chế độ Bán tự động (Semi-Auto) và tăng thời gian chờ lên từ 10 giây trở lên."
                                    : "Microsoft implements a 'Search Cooldown' algorithm. If searches are triggered too rapidly (< 6s) or at rigid intervals, your account gets limited to 3-4 rewarded searches every 15 minutes. To resolve this, switch to Semi-Auto mode or increase your delay to 10s+ with Random Jitter enabled."}
                            </p>
                        </div>

                        <div className='border-t border-gray-100 dark:border-gray-800 pt-4'>
                            <h3 className='font-bold text-base text-gray-900 dark:text-white mb-1'>
                                {isVi
                                    ? "Làm thế nào để kiếm điểm tìm kiếm trên Di động (Mobile Searches) ngay trên máy tính?"
                                    : "How do I earn Mobile search points directly on a desktop PC?"}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                {isVi
                                    ? "Trên trình duyệt Microsoft Edge hoặc Google Chrome, bạn hãy nhấn phím F12 (DevTools) -> bấm vào biểu tượng điện thoại/máy tính bảng (Toggle Device Emulation) -> chọn một thiết bị di động (ví dụ iPhone hoặc Pixel). Sau đó bắt đầu phiên tìm kiếm, Bing sẽ nhận diện bạn đang tìm kiếm trên thiết bị di động và cộng điểm Mobile!"
                                    : "In Microsoft Edge or Chrome, press F12 (Developer Tools) -> click the mobile phone icon (Toggle Device Toolbar) -> select a mobile device preset like iPhone or Pixel. When searches run, Bing detects the mobile user agent and awards Mobile search points!"}
                            </p>
                        </div>

                        <div className='border-t border-gray-100 dark:border-gray-800 pt-4'>
                            <h3 className='font-bold text-base text-gray-900 dark:text-white mb-1'>
                                {isVi
                                    ? "Công cụ này có lưu trữ thông tin tài khoản của tôi không?"
                                    : "Does this tool store my account credentials?"}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                                {isVi
                                    ? "Không. AnyTools hoạt động 100% trên trình duyệt phía người dùng (Client-Side). Công cụ chỉ gửi truy vấn tìm kiếm sang Bing thông qua cửa sổ trình duyệt của chính bạn mà không hề truy cập hay lưu trữ bất kỳ thông tin đăng nhập hoặc cookie nào."
                                    : "No. AnyTools operates 100% client-side in your browser. The tool only opens search queries in Bing using your own browser session and never accesses, transmits, or stores your credentials or cookies."}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/auto-bing-search' />
        </ToolPageLayout>
    );
}
