import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import ScreenTesterContent from "./ScreenTesterContent";
import { screenTesterTranslations } from "@/lib/i18n/tools/screen-tester";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Kiểm Tra Màn Hình, Điểm Chết & Bóng Mờ Ghosting Online ${getCurrentYear()} | AnyTools`
            : `Screen & Monitor Tester - Dead Pixels, Banding & Ghosting ${getCurrentYear()} | AnyTools`,
        description: isVi
            ? "Công cụ kiểm tra màn hình máy tính và TV online: Kiểm tra điểm chết (dead pixel), điểm kẹt màu (stuck pixel), độ tương phản black crush, dải màu gradient và bóng ma chuyển động (ghosting) ở chế độ toàn màn hình."
            : "Free display test online: Check for dead pixels, stuck subpixels, color banding, contrast dynamic range, and motion blur ghosting in full screen.",
        keywords: [
            "screen tester", "kiem tra man hinh", "kiem tra diem chet man hinh", "dead pixel test online",
            "monitor ghosting test", "test man hinh moi mua", "stuck pixel fixer"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Kiểm Tra Màn Hình & Điểm Chết Monitor Tester ${getCurrentYear()}`
                : `Screen & Monitor Tester ${getCurrentYear()}`,
            description: isVi
                ? "Kiểm tra toàn diện điểm chết, độ tương phản và bóng ma màn hình chế độ toàn màn hình."
                : "Diagnose dead pixels, contrast, and ghosting on any display.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/screen-tester",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/screen-tester`,
            languages: {
                en: "https://anytools.online/en/tools/screen-tester",
                vi: "https://anytools.online/vi/tools/screen-tester",
                "x-default": "https://anytools.online/en/tools/screen-tester",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ScreenTesterPage({ params }: Props) {
    const { locale } = await params;
    const t = screenTesterTranslations[locale as "en" | "vi"] || screenTesterTranslations.en;
    const relatedTools = getRelatedTools("/tools/screen-tester", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "HardwareApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/screen-tester`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Full screen pure color cycling for dead and stuck subpixel detection",
            "High-frequency stuck pixel exerciser for unsticking liquid crystal subpixels",
            "256-bit smooth color gradient and banding diagnostic ramps",
            "0.5% - 99.5% dynamic range contrast matrix for black crush detection",
            "Frame-rate synchronized motion blur and ghosting test"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <ScreenTesterContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/screen-tester' />
            </ToolPageLayout>
        </>
    );
}
