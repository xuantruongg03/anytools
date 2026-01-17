import type { Metadata } from "next";
import CodeMinifierContent from "./CodeMinifierContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import { ToolPageLayout } from "@/components/layout";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi 
        ? "Minify Code - Nén HTML, CSS, JavaScript Online Miễn Phí 2026" 
        : "Code Minifier - Minify HTML, CSS, JavaScript Online Free 2026";
    const description = isVi 
        ? "Công cụ nén code miễn phí. Minify HTML, CSS, JavaScript để giảm kích thước file và tăng tốc website. Beautify code ngược lại. Nhanh, an toàn." 
        : "Free online code minifier. Minify HTML, CSS, and JavaScript to reduce file size and speed up your website. Beautify code too. Fast and secure.";

    return {
        title,
        description,
        keywords: [
            // English keywords
            "code minifier",
            "minify html",
            "minify css",
            "minify javascript",
            "js minifier",
            "css compressor",
            "html minifier online",
            "code optimizer",
            "beautify code",
            "code formatter",
            "reduce file size",
            "website optimization",
            // Vietnamese keywords
            "nén code",
            "minify code",
            "tối ưu code",
            "nén html css js",
            "giảm dung lượng code",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/code-minifier`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/code-minifier`,
            languages: {
                en: "https://anytools.online/en/tools/code-minifier",
                vi: "https://anytools.online/vi/tools/code-minifier",
                "x-default": "https://anytools.online/en/tools/code-minifier",
            },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

export default async function CodeMinifierPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/code-minifier", 6);

    return (
        <ToolPageLayout 
            title={isVi ? "Nén Code (Minifier)" : "Code Minifier"} 
            description={isVi 
                ? "Nén HTML, CSS, JavaScript để giảm kích thước file và tăng tốc độ tải trang. Công cụ miễn phí với báo cáo giảm dung lượng chi tiết." 
                : "Minify HTML, CSS, and JavaScript to reduce file size and improve page load speed. Free tool with detailed size reduction statistics."
            }
        >
            <CodeMinifierContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/code-minifier' />
        </ToolPageLayout>
    );
}
