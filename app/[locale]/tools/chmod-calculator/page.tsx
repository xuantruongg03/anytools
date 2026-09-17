import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import ChmodCalculatorContent from "./ChmodCalculatorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const currentYear = new Date().getFullYear();

    const title = isVi
        ? `Bảng Tính Quyền Chmod Linux - Mã Quyền 755, 644 Chuẩn ${currentYear}`
        : `Linux Chmod Permissions Calculator - Octal & Symbolic 755, 644 ${currentYear}`;

    const description = isVi
        ? "Bảng tính quyền tập tin chmod Linux trực tuyến miễn phí. Tính mã octal (755, 644, 777), ký hiệu rwxr-xr-x và tạo lệnh shell nhanh chóng."
        : "Free online Linux chmod file permissions calculator. Easily convert between octal values (755, 644, 777), symbolic notation, and shell commands.";

    return {
        title,
        description,
        keywords: [
            "chmod calculator",
            "linux permissions calculator",
            "chmod 755",
            "chmod 644",
            "octal permissions",
            "symbolic permissions",
            // Vietnamese keywords
            "bảng tính quyền chmod",
            "phân quyền linux",
            "quyền 755",
            "quyền 644",
            "lệnh chmod",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/chmod-calculator`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/chmod-calculator`,
            languages: {
                en: "https://anytools.online/en/tools/chmod-calculator",
                vi: "https://anytools.online/vi/tools/chmod-calculator",
                "x-default": "https://anytools.online/en/tools/chmod-calculator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ChmodCalculatorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/chmod-calculator", 6);

    return (
        <ToolPageLayout
            title={isVi ? "Bảng Tính Quyền Chmod Linux" : "Chmod Permissions Calculator"}
            description={
                isVi
                    ? "Chuyển đổi và tính toán quyền tập tin Linux giữa mã số octal, ký hiệu rwx và câu lệnh shell trực quan."
                    : "Visually calculate and convert Linux file permissions between numeric octal codes, symbolic notations, and shell commands."
            }
        >
            <ChmodCalculatorContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/chmod-calculator' />
        </ToolPageLayout>
    );
}
