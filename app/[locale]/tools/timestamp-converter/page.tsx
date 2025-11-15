import type { Metadata } from "next";
import TimestampConverterContent from "./TimestampConverterContent";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Timestamp Converter - Unix Timestamp to Date Converter Online 2025",
        description: "Convert Unix timestamps to human-readable dates and vice versa. Free online timestamp converter tool for developers. Support epoch time conversion, milliseconds, and timezone handling. 100% client-side and secure.",
        keywords: ["timestamp converter", "unix timestamp", "epoch converter", "timestamp to date", "date to timestamp", "unix time converter", "epoch time", "timestamp online", "unix epoch", "timestamp generator", "current timestamp", "milliseconds converter", "utc timestamp", "datetime converter", "chuyển đổi timestamp", "unix timestamp trực tuyến", "epoch time converter"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Timestamp Converter",
        openGraph: {
            title: "Timestamp Converter Online - Unix Timestamp to Date Converter 2025",
            description: "Convert Unix timestamps to dates and vice versa. Free online tool for epoch time conversion. 100% client-side.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/timestamp-converter",
            locale: "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Timestamp Converter Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Timestamp Converter - Free Online Tool",
            description: "Convert Unix timestamps to dates instantly. Free and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: "https://anytools.online/tools/timestamp-converter",
            languages: {
                "en-US": "https://anytools.online/tools/timestamp-converter",
                "vi-VN": "https://anytools.online/tools/timestamp-converter",
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
        classification: "Developer Tools",
    };
}

export default function TimestampConverterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Timestamp Converter Online",
        applicationCategory: "DeveloperApplication",
        description: "Free online Unix timestamp converter. Convert between Unix epoch timestamps and human-readable dates instantly. Support milliseconds and timezone handling. 100% client-side processing.",
        url: "https://anytools.online/tools/timestamp-converter",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Unix Timestamp to Date Conversion", "Date to Unix Timestamp Conversion", "Current Timestamp Display", "Milliseconds Support", "100% Client-side Processing", "No Data Sent to Server", "Free and Unlimited Use"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden'>
                <div className='w-full px-4 py-8'>
                    <TimestampConverterContent />
                </div>
            </div>
        </>
    );
}
