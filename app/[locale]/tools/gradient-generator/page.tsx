import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import GradientGeneratorContent from "./GradientGeneratorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi
        ? "Tạo Dải Màu CSS Gradient Online - Linear, Radial, Conic & Presets"
        : "CSS Gradient Generator - Beautiful Linear, Radial & Conic Gradients";
    const description = isVi
        ? "Công cụ tạo mã CSS gradient trực tuyến miễn phí. Hỗ trợ gradient tuyến tính, tỏa tròn và hình nón với bảng màu phối sẵn thịnh hành, tùy chỉnh góc độ và xuất mã 1 click."
        : "Free online CSS gradient generator. Design modern linear, radial, and conic gradients with curated trending palettes, angle sliders, and one-click CSS code export.";

    return {
        title,
        description,
        keywords: [
            "css gradient generator",
            "tao gradient css",
            "linear gradient css",
            "radial gradient",
            "conic gradient",
            "css background gradient",
            "gradient color palette",
            "web design gradient",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/gradient-generator`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/gradient-generator`,
            languages: {
                en: "https://anytools.online/en/tools/gradient-generator",
                vi: "https://anytools.online/vi/tools/gradient-generator",
                "x-default": "https://anytools.online/en/tools/gradient-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function GradientGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/gradient-generator", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Tạo Dải Màu Gradient CSS" : "CSS Gradient Generator"}
            description={
                isVi
                    ? "Tạo dải màu gradient sắc nét cho thiết kế website. Tùy biến góc xoay, điểm dừng màu sắc hoặc chọn nhanh các bộ màu phối sẵn thịnh hành."
                    : "Generate vibrant CSS gradients for web design. Customize angles, color stops, or pick from curated color presets with one-click code copy."
            }
        >
            <GradientGeneratorContent />

            {/* SEO & Educational Guide Section */}
            <div className='max-w-5xl mx-auto mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                <section className='bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800'>
                    <h2 className='text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isVi ? "📖 Các Loại Gradient Phổ Biến Trong Thiết Kế Web" : "📖 Types of CSS Gradients Explained"}
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                1. Linear Gradient ({isVi ? "Tuyến tính" : "Linear"})
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Màu sắc chuyển tiếp mượt mà theo một đường thẳng theo góc độ xác định (ví dụ: từ trái sang phải 90° hoặc từ góc trên xuống dưới 135°)."
                                    : "Colors transition along a straight line based on a specific angle (e.g. left to right 90° or diagonal 135°)."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                2. Radial Gradient ({isVi ? "Tỏa tròn" : "Radial"})
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Màu sắc lan tỏa từ một điểm tâm hình tròn hoặc hình elip ra ngoài theo các đường đồng tâm, tạo chiều sâu thị giác ấn tượng."
                                    : "Colors radiate outward from a central point in circular or elliptical patterns, creating dramatic visual depth."}
                            </p>
                        </div>

                        <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700'>
                            <div className='font-bold text-gray-900 dark:text-white mb-1'>
                                3. Conic Gradient ({isVi ? "Hình nón" : "Conic"})
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {isVi
                                    ? "Màu sắc xoay 360 độ quanh một điểm tâm giống như chuyển động của kim đồng hồ hoặc bánh xe màu sắc."
                                    : "Colors rotate 360 degrees around a center origin, reminiscent of a color wheel or clock hands."}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <RelatedTools tools={relatedTools} currentPath='/tools/gradient-generator' />
        </ToolPageLayout>
    );
}
