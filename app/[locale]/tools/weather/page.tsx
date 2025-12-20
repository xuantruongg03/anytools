import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import WeatherClient from "./WeatherClient";
import WeatherContent from "./WeatherContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import { getTranslation } from "@/lib/i18n/translations";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = getTranslation(locale as "en" | "vi");
    const weather_t = t.tools.weather;

    const title = weather_t.page.title;
    const description = weather_t.page.subtitle;

    return {
        title,
        description,
        keywords:
            locale === "vi"
                ? "thời tiết, dự báo thời tiết, thời tiết hôm nay, thời tiết theo giờ, thời tiết 5 ngày, thời tiết việt nam, nhiệt độ, độ ẩm, tốc độ gió, áp suất, bình minh, hoàng hôn, thời tiết chính xác, openweather, weatherapi, dự báo thời tiết theo địa chỉ, GPS"
                : "weather, weather forecast, today weather, hourly weather, 12-hour forecast, 5-day forecast, vietnam weather, temperature, humidity, wind speed, pressure, sunrise, sunset, accurate weather, openweather, weatherapi, accuweather, weather by address, gps weather, location weather",
        openGraph: {
            title,
            description,
            type: "website",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/weather`,
            languages: {
                en: "https://anytools.online/en/tools/weather",
                vi: "https://anytools.online/vi/tools/weather",
                "x-default": "https://anytools.online/en/tools/weather",
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

export default async function WeatherPage({ params }: Props) {
    const { locale } = await params;
    const relatedTools = getRelatedTools("/tools/weather", 6);
    const t = getTranslation(locale as "en" | "vi");
    const weather_t = t.tools.weather;

    // Structured Data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: weather_t.name,
        description: weather_t.page.subtitle,
        url: `https://anytools.online/${locale}/tools/weather`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web Browser",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Real-time weather data", "12-hour hourly forecast", "5-day weather forecast", "GPS location detection", "Address search with autocomplete", "Multiple weather data providers", "Celsius and Fahrenheit units"],
        inLanguage: [locale],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <ToolPageLayout title={weather_t.name} description={weather_t.page.subtitle}>
                <WeatherClient />
                <WeatherContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/weather' />
            </ToolPageLayout>
        </>
    );
}
