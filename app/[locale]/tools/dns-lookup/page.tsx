import type { Metadata } from "next";
import DnsLookupContent from "./DnsLookupContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import { ToolPageLayout } from "@/components/layout";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi 
        ? "DNS Lookup - Tra Cứu DNS Records & WHOIS Online Miễn Phí 2026" 
        : "DNS Lookup - Check DNS Records & WHOIS Information Online 2026";
    const description = isVi 
        ? "Công cụ tra cứu DNS miễn phí. Kiểm tra DNS records (A, AAAA, MX, TXT, NS), WHOIS domain, SSL certificate. Nhanh, chính xác, không giới hạn." 
        : "Free online DNS lookup tool. Check DNS records (A, AAAA, MX, TXT, NS), WHOIS domain information, SSL certificates. Fast, accurate, unlimited queries.";

    return {
        title,
        description,
        keywords: [
            // English keywords
            "dns lookup",
            "dns check",
            "whois lookup",
            "domain lookup",
            "dns records",
            "mx record check",
            "dns resolver",
            "domain information",
            "nameserver lookup",
            "dns query tool",
            // Vietnamese keywords
            "tra cứu dns",
            "kiểm tra dns",
            "whois domain",
            "thông tin domain",
            "dns records",
        ],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}/tools/dns-lookup`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/dns-lookup`,
            languages: {
                en: "https://anytools.online/en/tools/dns-lookup",
                vi: "https://anytools.online/vi/tools/dns-lookup",
                "x-default": "https://anytools.online/en/tools/dns-lookup",
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

export default async function DnsLookupPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/dns-lookup", 6);

    return (
        <ToolPageLayout 
            title={isVi ? "Tra Cứu DNS" : "DNS Lookup"} 
            description={isVi 
                ? "Kiểm tra DNS records, WHOIS thông tin domain và SSL certificate. Công cụ miễn phí, nhanh chóng cho developers và system admins." 
                : "Check DNS records, WHOIS domain information, and SSL certificates. Free and fast tool for developers and system administrators."
            }
        >
            <DnsLookupContent />
            <RelatedTools tools={relatedTools} currentPath='/tools/dns-lookup' />
        </ToolPageLayout>
    );
}
