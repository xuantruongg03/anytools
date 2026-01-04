import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import IpLookupClient from "./IpLookupClient";
import IpLookupContent from "./IpLookupContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const metadata = {
        en: {
            title: "What Is My IP Address - IP Lookup Tool 2026",
            description: "Find your public IP address, local IP, IPv4, IPv6, and detailed geolocation information. Free online IP checker with ISP, country, city detection.",
        },
        vi: {
            title: "Tra Cứu Địa Chỉ IP - Kiểm Tra IP Của Bạn 2026",
            description: "Tìm địa chỉ IP công cộng, IP local, IPv4, IPv6 và thông tin vị trí chi tiết. Công cụ kiểm tra IP miễn phí với phát hiện ISP, quốc gia, thành phố.",
        },
    };

    const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.en;

    return {
        title: currentMetadata.title,
        description: currentMetadata.description,
        keywords: ["what is my ip", "ip address lookup", "my ip address", "ip checker", "ip locator", "find my ip", "public ip", "ipv4 address", "ipv6 address", "ip geolocation", "ip location", "isp lookup", "tra cứu ip", "địa chỉ ip của tôi", "kiểm tra ip", "tìm ip"],
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/ip-lookup`,
            languages: {
                en: "https://anytools.online/en/tools/ip-lookup",
                vi: "https://anytools.online/vi/tools/ip-lookup",
                "x-default": "https://anytools.online/en/tools/ip-lookup",
            },
        },
        robots: { index: true, follow: true },
    };
}

function IpLookupPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "IP Address Lookup Tool",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description: "Find your public IP address, local IP, IPv4, IPv6, and detailed geolocation information including ISP, country, city, timezone, and more.",
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is an IP address?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "An IP (Internet Protocol) address is a unique numerical identifier assigned to every device connected to a network. It enables devices to communicate with each other over the internet or local networks.",
                },
            },
            {
                "@type": "Question",
                name: "What is the difference between IPv4 and IPv6?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "IPv4 uses 32-bit addresses (e.g., 192.168.1.1) allowing about 4.3 billion unique addresses. IPv6 uses 128-bit addresses (e.g., 2001:0db8:85a3::8a2e:0370:7334) providing virtually unlimited addresses. IPv6 was created to address IPv4 exhaustion.",
                },
            },
            {
                "@type": "Question",
                name: "What is a public vs private IP address?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "A public IP address is assigned by your ISP and is visible on the internet, allowing websites to identify your connection. A private IP is used within your local network (home/office) and is not directly accessible from the internet. Common private IP ranges include 192.168.x.x and 10.x.x.x.",
                },
            },
            {
                "@type": "Question",
                name: "Can someone find my location from my IP address?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "IP geolocation can reveal your approximate location (city/region level), ISP, and sometimes organization. However, it cannot pinpoint your exact street address. For privacy, you can use VPNs or proxy servers to mask your real IP address.",
                },
            },
        ],
    };

    const relatedTools = getRelatedTools("/tools/ip-lookup", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <ToolPageLayout title='IP Address Lookup' description='Discover your public IP address, local IP, and detailed geolocation information. Free tool to check IPv4, IPv6, ISP, location, and more.'>
                <IpLookupClient />
                <IpLookupContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/ip-lookup' />
            </ToolPageLayout>
        </>
    );
}

export default IpLookupPage;
