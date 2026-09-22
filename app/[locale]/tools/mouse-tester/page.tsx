import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import MouseTesterContent from "./MouseTesterContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Test Chuột & CPS Test Online - Kiểm Tra Phím Chuột, Double Click ${getCurrentYear()}` 
            : `Mouse Tester & CPS Test Online - Check Mouse Buttons & Double Click ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Công cụ test chuột online và đo tốc độ CPS miễn phí. Kiểm tra chuột trái, phải, con lăn, nút phụ Back/Forward, phát hiện lỗi double-click chattering và test CPS 5s/10s." 
            : "Free online mouse tester and CPS speed test tool. Test Left, Right, Middle wheel, Side buttons (Mouse 4 & 5), detect double-click switch chattering, and measure CPS speed.",
        keywords: [
            "mouse tester", "test chuột", "cps test", "kiểm tra chuột", "double click test", "test nút chuột",
            "mouse speed test", "chatter detector", "test con lăn chuột", "click per second"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Mouse Tester",
        openGraph: {
            title: locale === "vi" 
                ? `Test Chuột & Đo CPS Online - Kiểm Tra Double Click ${getCurrentYear()}` 
                : `Mouse Tester & CPS Test - Free Online Tool ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Kiểm tra tất cả các nút chuột, phát hiện lỗi click đúp switch cơ học, đo tốc độ click chuột CPS trực quan." 
                : "Test all mouse buttons, detect mechanical switch double click issues, and challenge your CPS speed.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/mouse-tester",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Mouse Tester Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Mouse Tester & CPS Test Online",
            description: "Test mouse buttons, detect switch chattering, and measure your CPS score.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/mouse-tester`,
            languages: {
                en: "https://anytools.online/en/tools/mouse-tester",
                vi: "https://anytools.online/vi/tools/mouse-tester",
                "x-default": "https://anytools.online/en/tools/mouse-tester",
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
        classification: "Utility Tools",
    };
}

export default function MouseTesterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Mouse Tester & CPS Test Online",
        applicationCategory: "UtilityApplication",
        description: "Free online mouse tester and CPS click speed test tool. Test buttons 1-5, scroll wheel, detect mechanical switch chatter, and measure clicks per second.",
        url: "https://anytools.online/tools/mouse-tester",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Left, Right, Middle Button Testing",
            "Back & Forward (Mouse 4 & 5) Testing",
            "Scroll Wheel Direction & Delta Distance Tracking",
            "Mechanical Switch Double-Click / Chatter Detection (<80ms)",
            "Clicks Per Second (CPS) Challenge (5s, 10s, Free)",
            "Real-time Click Logs & Analytics",
            "100% Client-side Processing"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/mouse-tester", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Mouse Tester & CPS Test'
                description='Test mouse buttons, scroll wheel, detect faulty switch double-clicks, and measure your CPS speed.'
            >
                <MouseTesterContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/mouse-tester' />
            </ToolPageLayout>
        </>
    );
}
