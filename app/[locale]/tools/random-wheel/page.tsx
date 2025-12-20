import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RandomWheelContent from "./RandomWheelContent";
import { getTranslation } from "@/lib/i18n";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = getTranslation(locale as "en" | "vi");
    const toolData = t.tools.randomWheel;

    const isVi = locale === "vi";
    const title = isVi ? "Vòng Quay May Mắn - Công Cụ Quay Số Ngẫu Nhiên Miễn Phí 2025" : "Random Wheel Spinner - Free Lucky Wheel Generator & Decision Maker Tool 2025";
    const description = isVi
        ? "Vòng quay may mắn miễn phí - Quay vòng để chọn ngẫu nhiên, ra quyết định, chọn người thắng cho cuộc thi & sự kiện. Tùy chỉnh vô hạn tùy chọn, thêm hàng loạt, kết quả tức thì. Hoàn hảo cho lớp học, team building, rút thăm, trò chơi. 100% miễn phí, không cần đăng ký!"
        : "Free random wheel spinner online - Spin the wheel to pick random choices, make decisions, choose winners for giveaways & contests. Customize unlimited options, add bulk items, and get instant random results. Perfect for classroom activities, team building, prize draws, and fun games. 100% free, no registration required!";

    return {
        title,
        description,
        keywords: [
            "random wheel",
            "wheel spinner",
            "lucky wheel",
            "random picker",
            "decision maker",
            "spin wheel online",
            "random generator",
            "wheel of fortune",
            "picker wheel",
            "choice wheel",
            "random name picker",
            "prize wheel",
            "spinning wheel",
            "wheel decide",
            "random selector",
            "vòng quay may mắn",
            "quay số ngẫu nhiên",
            "công cụ chọn ngẫu nhiên",
            "vòng quay quyết định",
            "classroom wheel",
            "giveaway picker",
            "raffle wheel",
            "random team picker",
            "yes or no wheel",
            "decision wheel",
            "game wheel spinner",
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Random Wheel",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/random-wheel`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Random Wheel Spinner Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Random Wheel Spinner - Free Tool",
            description: "Spin the wheel to pick random choices instantly!",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/random-wheel`,
            languages: {
                en: "https://anytools.online/en/tools/random-wheel",
                vi: "https://anytools.online/vi/tools/random-wheel",
                "x-default": "https://anytools.online/en/tools/random-wheel",
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
        classification: "Games & Fun",
    };
}

export default async function RandomWheelPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Vòng Quay May Mắn - Quay Số Ngẫu Nhiên" : "Random Wheel Spinner - Lucky Wheel Generator",
        applicationCategory: "UtilityApplication",
        description: isVi
            ? "Công cụ vòng quay may mắn và ra quyết định miễn phí. Quay vòng để chọn ngẫu nhiên cho tặng quà, cuộc thi, hoạt động lớp học, xây dựng đội nhóm, rút thăm, và trò chơi. Tính năng tùy chỉnh tùy chọn, thêm hàng loạt, hiệu ứng quay mượt mà, kết quả công bằng ngay lập tức. Hoàn hảo cho giáo viên, tổ chức sự kiện, và bất kỳ ai cần chọn ngẫu nhiên. 100% miễn phí, xử lý trên trình duyệt, không cần đăng ký."
            : "Free online random wheel spinner and decision maker tool. Spin the wheel to pick random choices for giveaways, contests, classroom activities, team building, prize draws, and games. Features customizable options, bulk add functionality, smooth spinning animation, and instant fair results. Perfect for teachers, event organizers, and anyone needing random selection. 100% free, client-side processing, no registration required.",
        url: `https://anytools.online/${locale}/tools/random-wheel`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        keywords: "random wheel, wheel spinner, lucky wheel, decision maker, random picker, prize wheel, giveaway tool, classroom spinner, team picker, raffle wheel, choice wheel, spinning wheel generator",
        featureList: ["Random Fair Selection", "Unlimited Customizable Options", "Bulk Add Multiple Items", "Smooth Spin Animation", "Add/Remove Items Easily", "Instant Results Display", "Visual Color-Coded Segments", "100% Client-side Processing", "No Registration Required", "Free and Unlimited Use", "Mobile & Desktop Compatible", "Dark Mode Support"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1250",
        },
    };

    const relatedTools = getRelatedTools("/tools/random-wheel", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title={isVi ? "Vòng Quay May Mắn" : "Random Wheel Spinner"} description={isVi ? "Vòng quay may mắn miễn phí - Quay vòng để chọn ngẫu nhiên, ra quyết định, chọn người thắng." : "Free random wheel spinner - Spin the wheel to pick random choices, make decisions, choose winners."}>
                <RandomWheelContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/random-wheel' />
            </ToolPageLayout>
        </>
    );
}
