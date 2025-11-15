import type { Metadata } from "next";
import JwtDecoderContent from "./JwtDecoderContent";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "JWT Decoder Online - Decode JSON Web Tokens Free Tool 2025",
        description: "Decode and inspect JWT (JSON Web Token) online instantly. View header, payload, and signature. Free JWT decoder and parser for developers. 100% client-side, secure, and private. No data sent to server.",
        keywords: ["jwt decoder", "decode jwt", "json web token", "jwt parser", "jwt inspector", "jwt online", "jwt debugger", "jwt validator", "decode json web token", "jwt token decoder", "jwt authentication", "oauth token", "jwt payload", "jwt header", "giải mã jwt", "jwt trực tuyến", "công cụ jwt"],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        applicationName: "AnyTools JWT Decoder",
        openGraph: {
            title: "JWT Decoder Online - Free JSON Web Token Decoder Tool 2025",
            description: "Decode JWT tokens instantly. View header and payload. Free online JWT decoder for developers.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/jwt-decoder",
            locale: "en_US",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "JWT Decoder Online Tool",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "JWT Decoder - Free Online Tool",
            description: "Decode and inspect JWT tokens instantly. 100% client-side and secure.",
            creator: "@anytools",
            images: ["https://anytools.online/og-image.png"],
        },
        alternates: {
            canonical: "https://anytools.online/tools/jwt-decoder",
            languages: {
                "en-US": "https://anytools.online/tools/jwt-decoder",
                "vi-VN": "https://anytools.online/tools/jwt-decoder",
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

export default function JwtDecoderPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "JWT Decoder Online",
        applicationCategory: "DeveloperApplication",
        description: "Free online JWT (JSON Web Token) decoder. Decode and inspect JWT header, payload, and signature instantly. 100% client-side processing.",
        url: "https://anytools.online/tools/jwt-decoder",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Instant JWT Decoding", "View Header and Payload", "Support All JWT Algorithms", "100% Client-side Processing", "No Data Sent to Server", "Free and Unlimited Use"],
        browserRequirements: "Requires JavaScript. Requires HTML5.",
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden'>
                <div className='w-full px-4 py-8'>
                    <JwtDecoderContent />
                </div>
            </div>
        </>
    );
}
