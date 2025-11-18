import type { Metadata } from "next";
import RandomRaceContent from "./RandomRaceContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Đua Thú Ngẫu Nhiên - Trò Chơi Đua Thú Vui Nhộn 2025" : "Random Race Game - Animal Racing Simulator Online 2025";
    const description = isVi ? "Trò chơi đua thú ngẫu nhiên miễn phí với hoạt hình sinh động! Xem các con vật dễ thương đua đến đích. Hoàn hảo cho giải trí, trò chơi và chọn ngẫu nhiên với hoạt hình hồi hộp!" : "Free random race game with animated animals! Watch cute animals race to the finish line. Perfect for fun, games, and random selection with exciting animation!";

    return {
        title,
        description,
        keywords: ["random race", "animal race", "racing game", "random simulator", "race picker", "đua thú ngẫu nhiên", "trò chơi đua"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Random Race",
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://www.anytools.online/${locale}/tools/random-race`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://www.anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Random Race Game Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Random Race Game - Free Tool",
            description: "Watch animated animals race to the finish!",
            creator: "@anytools",
            images: ["https://www.anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/random-race`,
            languages: {
                "en-US": "https://www.anytools.online/en/tools/random-race",
                "vi-VN": "https://www.anytools.online/vi/tools/random-race",
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

export default async function RandomRacePage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Trò Chơi Đua Thú Ngẫu Nhiên" : "Random Race Game Online",
        applicationCategory: "GameApplication",
        description: isVi ? "Trò chơi đua thú ngẫu nhiên miễn phí. Xem các con vật hoạt hình đua đến đích. Hoàn hảo cho giải trí, cuộc thi và lựa chọn ngẫu nhiên với hoạt hình hồi hộp. 100% xử lý trên trình duyệt." : "Free online random race game. Watch animated animals race to the finish line. Perfect for fun selections, contests, and random choices with exciting animation. 100% client-side processing.",
        url: `https://www.anytools.online/${locale}/tools/random-race`,
        inLanguage: locale,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Animated Racing", "Random Winner", "Multiple Racers", "Fun Animations", "Instant Results", "100% Client-side", "Free and Unlimited"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    const relatedTools = getRelatedTools("/tools/random-race", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden'>
                <div className='container mx-auto px-4 py-8'>
                    <RandomRaceContent />
                    <RelatedTools tools={relatedTools} currentPath='/tools/random-race' />
                </div>
            </div>
        </>
    );
}
