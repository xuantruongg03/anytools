import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import PomodoroTimerContent from "./PomodoroTimerContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "vi" 
            ? `Đồng Hồ Pomodoro Online - Quản Lý Thời Gian & Tập Trung ${getCurrentYear()}` 
            : `Pomodoro Timer Online - Focus & Productivity Timer ${getCurrentYear()}`,
        description: locale === "vi" 
            ? "Đồng hồ bấm giờ Pomodoro online miễn phí với âm thanh thư giãn (tiếng mưa, sóng biển, gió rít), chuông báo và danh sách công việc giúp bạn tập trung làm việc tối đa." 
            : "Free online Pomodoro focus timer with ambient soundscapes (rain, ocean waves, wind), audio alerts, and integrated task checklist for maximum productivity.",
        keywords: [
            "pomodoro timer", "đồng hồ pomodoro", "pomodoro online", "focus timer", 
            "pomodoro clock", "ambient sounds for study", "tiếng mưa học bài", "kỹ thuật pomodoro"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Pomodoro Timer",
        openGraph: {
            title: locale === "vi" 
                ? `Đồng Hồ Pomodoro & Âm Thanh Tập Trung Online ${getCurrentYear()}` 
                : `Pomodoro Focus Timer & Ambient Sounds ${getCurrentYear()}`,
            description: locale === "vi" 
                ? "Tập trung học tập và làm việc hiệu quả theo kỹ thuật Pomodoro cùng âm thanh nền thư giãn." 
                : "Boost your productivity with custom interval Pomodoro timer and relaxing synthesized white noise.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/pomodoro-timer",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Pomodoro Focus Timer Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Pomodoro Timer & Focus Sounds - Free Online Tool",
            description: "Customizable Pomodoro timer with ambient sounds and task checklist.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/pomodoro-timer`,
            languages: {
                en: "https://anytools.online/en/tools/pomodoro-timer",
                vi: "https://anytools.online/vi/tools/pomodoro-timer",
                "x-default": "https://anytools.online/en/tools/pomodoro-timer",
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
        category: "Productivity Tools",
        classification: "Time Management",
    };
}

export default function PomodoroTimerPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Pomodoro Focus Timer Online",
        applicationCategory: "ProductivityApplication",
        description: "Free online Pomodoro timer with relaxing ambient sounds (rain, ocean, wind), audio alerts, and task tracking for productivity.",
        url: "https://anytools.online/tools/pomodoro-timer",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Configurable Work, Short Break, and Long Break Intervals",
            "Synthesized Web Audio Ambient Soundscapes (Rain, Ocean, Forest Wind)",
            "Audible Chime Alerts at Session Completion",
            "Local Storage Persistent Task Checklist",
            "Visual SVG Circular Progress Ring & Title Live Countdown"
        ],
        browserRequirements: "Requires JavaScript. Requires HTML5 Audio.",
    };

    const relatedTools = getRelatedTools("/tools/pomodoro-timer", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title='Pomodoro Timer'
                description='Boost your productivity with custom work intervals, relaxing synthesized soundscapes, and task management.'
            >
                <PomodoroTimerContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/pomodoro-timer' />
            </ToolPageLayout>
        </>
    );
}
