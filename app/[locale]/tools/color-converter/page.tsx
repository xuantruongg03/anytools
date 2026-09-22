import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import ColorConverterContent from "./ColorConverterContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Chuyển Đổi Hệ Màu & Đo Độ Tương Phản WCAG 2.1 Online ${getCurrentYear()}` 
            : `Color Space Converter & WCAG 2.1 Contrast Checker ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ chuyển đổi mã màu HEX, RGB, HSL, HSV, CMYK và kiểm tra độ tương phản màu chuẩn WCAG 2.1 (AA/AAA) trực tuyến. Tối ưu cho thiết kế web và UI/UX." 
            : "Free online color converter and WCAG 2.1 contrast ratio checker. Convert between HEX, RGB, HSL, HSV, CMYK and test web accessibility standards (AA/AAA compliance).",
        keywords: [
            "color converter", "chuyển đổi mã màu", "wcag contrast checker", "đo độ tương phản màu",
            "hex to rgb", "rgb to cmyk", "rgb to hsl", "color contrast ratio", "web accessibility contrast"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Color Converter",
        openGraph: {
            title: locale === "vi" 
                ? `Chuyển Đổi Hệ Màu & Kiểm Tra Tương Phản WCAG Online ${getCurrentYear()}` 
                : `Color Space Converter & Contrast Checker - Free Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Chuyển đổi HEX, RGB, HSL, CMYK và kiểm tra độ tương phản màu chuẩn WCAG 2.1." 
                : "Convert HEX, RGB, HSL, CMYK and test WCAG 2.1 color contrast compliance.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/color-converter",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Color Converter Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Color Space Converter & WCAG Contrast Checker",
            description: "Convert color formats and test accessibility contrast ratios.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/color-converter`,
            languages: {
                en: "https://anytools.online/en/tools/color-converter",
                vi: "https://anytools.online/vi/tools/color-converter",
                "x-default": "https://anytools.online/en/tools/color-converter",
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
        category: "Web Tools",
        classification: "Design Tools",
    };
}

export default function ColorConverterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Color Space & Contrast Ratio Checker Online",
        applicationCategory: "DesignApplication",
        description: "Free online color converter and WCAG 2.1 contrast ratio checker. Convert between HEX, RGB, HSL, HSV, CMYK and test web accessibility standards.",
        url: "https://anytools.online/tools/color-converter",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Color Space Conversion (HEX, RGB, HSL, HSV, CMYK)",
            "WCAG 2.1 Accessibility Contrast Ratio Calculation",
            "Level AA and AAA Criteria Checking",
            "Live Interactive Typography Preview",
            "Color Swatches & Palette Presets",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/color-converter", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Color Space & Contrast Ratio Checker'
                description='Convert colors between HEX, RGB, HSL, HSV, and CMYK, and verify WCAG 2.1 accessibility contrast compliance.'
            >
                <ColorConverterContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/color-converter' />
            </ToolPageLayout>
        </>
    );
}
