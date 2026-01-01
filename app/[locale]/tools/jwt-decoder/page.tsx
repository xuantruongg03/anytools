import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import JwtDecoderContent from "./JwtDecoderContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Giải Mã JWT Online - Decode JSON Web Token Miễn Phí 2026" : "JWT Decoder Online - Decode JSON Web Tokens Free 2026";
    const description = isVi ? "Giải mã và kiểm tra JWT (JSON Web Token) trực tuyến. Xem header, payload và signature. 100% client-side, bảo mật." : "Decode and inspect JWT online instantly. View header, payload, and signature. Free JWT decoder for developers. 100% secure.";

    return {
        title,
        description,
        keywords: ["jwt decoder", "decode jwt", "json web token", "jwt parser", "jwt inspector", "jwt online", "jwt debugger", "jwt validator", "giải mã jwt", "jwt trực tuyến", "công cụ jwt"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/jwt-decoder`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/jwt-decoder`,
            languages: {
                en: "https://anytools.online/en/tools/jwt-decoder",
                vi: "https://anytools.online/vi/tools/jwt-decoder",
                "x-default": "https://anytools.online/en/tools/jwt-decoder",
            },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}

export default async function JwtDecoderPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
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

    const relatedTools = getRelatedTools("/tools/jwt-decoder", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout title='JWT Decoder' description='Decode and inspect JWT (JSON Web Token) online instantly. View header, payload, and signature.'>
                <JwtDecoderContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/jwt-decoder' />
            </ToolPageLayout>
        </>
    );
}
