import type { Metadata } from "next";
import RegexTesterContent from "./RegexTesterContent";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Regex Tester - Regular Expression Testing Tool Online 2025",
        description: "Test and validate regular expressions online. Free regex tester with pattern matching, flags support, and instant results. Perfect for developers debugging regex patterns. 100% client-side and secure.",
        keywords: ["regex tester", "regular expression", "regex validator", "pattern matching", "regex tool", "regex online", "test regex", "regex debugger", "regex matcher", "regexp tester", "regex checker", "regex builder", "regex generator", "regex pattern", "kiểm tra regex", "test biểu thức chính quy", "công cụ regex"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools Regex Tester",
        openGraph: {
            title: "Regex Tester Online - Free Regular Expression Testing Tool 2025",
            description: "Test and validate regular expressions instantly. Free online regex tester with pattern matching and flags support. 100% client-side.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/regex-tester",
            locale: "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Regex Tester Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Regex Tester - Free Online Tool",
            description: "Test regular expressions instantly. Free and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: "https://anytools.online/tools/regex-tester",
            languages: {
                "en-US": "https://anytools.online/tools/regex-tester",
                "vi-VN": "https://anytools.online/tools/regex-tester",
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

export default function RegexTesterPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Regex Tester Online",
        applicationCategory: "DeveloperApplication",
        description: "Free online regex (regular expression) tester. Test and validate regex patterns with instant matching results. Support all regex flags. 100% client-side processing.",
        url: "https://anytools.online/tools/regex-tester",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Instant Pattern Matching", "All Regex Flags Support (g, i, m, s, u, y)", "Real-time Match Highlighting", "Pattern Validation", "100% Client-side Processing", "No Data Sent to Server", "Free and Unlimited Use"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden'>
                <div className='w-full px-4 py-8'>
                    <RegexTesterContent />
                </div>
            </div>
        </>
    );
}
