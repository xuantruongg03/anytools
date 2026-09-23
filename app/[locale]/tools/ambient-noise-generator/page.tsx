import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import AmbientNoiseContent from "./AmbientNoiseContent";
import { ambientNoiseTranslations } from "@/lib/i18n/tools/ambient-noise-generator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tạo Tiếng Ồn Trắng & Âm Thanh Tập Trung Sâu Online ${getCurrentYear()} | AnyTools`
            : `Ambient Noise & Focus Sound Generator Online ${getCurrentYear()} | AnyTools`,
        description: isVi
            ? "Tạo tiếng ồn trắng (White noise), tiếng ồn nâu (Brown noise), tiếng mưa rơi, lửa trại và sóng não Binaural Beats giúp tăng tập trung học tập, làm việc và dễ ngủ. Bộ trộn âm thanh đa kênh 100% trong trình duyệt."
            : "Generate soothing ambient sounds for focus, study, sleep, and tinnitus relief: White, Pink, and Brown Noise, Rain, Campfire, and Binaural Beats with an interactive multi-track mixer and timer.",
        keywords: [
            "white noise generator", "ambient sound generator", "brown noise for adhd", "tieng on trang",
            "tieng on nau tap trung", "am thanh mua roi thu gian", "binaural beats online"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tạo Tiếng Ồn Trắng & Âm Thanh Tập Trung ${getCurrentYear()}`
                : `Ambient Noise & Focus Sound Generator ${getCurrentYear()}`,
            description: isVi
                ? "Bộ trộn âm thanh tiếng ồn màu, mưa rơi và sóng não giúp tập trung làm việc và dễ ngủ."
                : "Generate soothing White, Pink, and Brown noise with real-time multi-track audio mixing.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/ambient-noise-generator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/ambient-noise-generator`,
            languages: {
                en: "https://anytools.online/en/tools/ambient-noise-generator",
                vi: "https://anytools.online/vi/tools/ambient-noise-generator",
                "x-default": "https://anytools.online/en/tools/ambient-noise-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function AmbientNoisePage({ params }: Props) {
    const { locale } = await params;
    const t = ambientNoiseTranslations[locale as "en" | "vi"] || ambientNoiseTranslations.en;
    const relatedTools = getRelatedTools("/tools/ambient-noise-generator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "MultimediaApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/ambient-noise-generator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Real-time procedural Web Audio API synthesis without repeating audio loops",
            "Multi-track sound mixer (White, Pink, Brown noise, Rain, Campfire, Binaural Beats)",
            "Integrated sleep and focus countdown timer with auto-stop",
            "Real-time canvas audio visualizer frequency spectrum",
            "100% Client-side local processing with zero external audio downloads"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
            >
                <AmbientNoiseContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/ambient-noise-generator' />
            </ToolPageLayout>
        </>
    );
}
