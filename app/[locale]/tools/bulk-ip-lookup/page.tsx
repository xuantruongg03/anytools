import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import BulkIpLookupClient from "./BulkIpLookupClient";
import BulkIpLookupContent from "./BulkIpLookupContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const metadata = {
        en: {
            title: `Bulk IP Lookup - Batch IP Location & Geolocation Map ${getCurrentYear()}`,
            description: "Lookup multiple IP addresses simultaneously with interactive world map visualization. Detect country, city, ISP, ASN, coordinates and country breakdown.",
        },
        vi: {
            title: `Tra Cứu IP Hàng Loạt - Bản Đồ Vị Trí & Thông Tin Địa Chỉ IP ${getCurrentYear()}`,
            description: "Tra cứu hàng loạt địa chỉ IP cùng lúc với bản đồ trực quan thế giới. Kiểm tra quốc gia, thành phố, nhà mạng ISP, ASN, tọa độ và phân bố địa lý.",
        },
    };

    const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.vi;

    return {
        title: currentMetadata.title,
        description: currentMetadata.description,
        keywords: [
            "bulk ip lookup",
            "batch ip lookup",
            "ip address batch lookup",
            "tra cứu ip hàng loạt",
            "kiểm tra ip hàng loạt",
            "bản đồ vị trí ip",
            "ip geolocation map",
            "ip location finder",
            "ip country breakdown",
            "tra cứu vị trí ip",
            "phân bố ip theo quốc gia",
            "check multiple ips",
            "bulk ip geolocation",
        ],
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/bulk-ip-lookup`,
            languages: {
                en: "https://anytools.online/en/tools/bulk-ip-lookup",
                vi: "https://anytools.online/vi/tools/bulk-ip-lookup",
                "x-default": "https://anytools.online/vi/tools/bulk-ip-lookup",
            },
        },
        robots: { index: true, follow: true },
    };
}

export default async function BulkIpLookupPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: isVi ? "Công cụ Tra Cứu IP Hàng Loạt" : "Bulk IP Lookup Tool",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description: isVi
            ? "Tra cứu hàng loạt địa chỉ IP cùng lúc với bản đồ nhiệt thế giới trực quan, thống kê quốc gia, phát hiện ISP và xuất file CSV/JSON miễn phí."
            : "Lookup multiple IP addresses at once with interactive world map choropleth visualization, country breakdown, ISP detection, and free CSV/JSON export.",
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: isVi ? "Tôi có thể tra cứu tối đa bao nhiêu IP một lần?" : "How many IP addresses can I lookup at once?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: isVi
                        ? "Bạn có thể tra cứu tối đa 100 địa chỉ IP trong một lần gửi hoàn toàn miễn phí."
                        : "You can lookup up to 100 IP addresses per batch completely free.",
                },
            },
            {
                "@type": "Question",
                name: isVi ? "Bản đồ hiển thị vị trí IP hoạt động như thế nào?" : "How does the IP location map work?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: isVi
                        ? "Bản đồ thể hiện mật độ IP theo quốc gia với màu xanh đặc trưng (phong cách Google Analytics) cùng các điểm tọa độ ghim trực tiếp. Khi di chuột vào từng quốc gia hoặc điểm ghim, bạn sẽ thấy thông tin chi tiết của IP đó."
                        : "The world map displays country density with blue choropleth shading along with pulsing coordinate pins. Hovering over countries or pins displays detailed IP geolocation info.",
                },
            },
            {
                "@type": "Question",
                name: isVi ? "Có thể xuất dữ liệu sau khi tra cứu không?" : "Can I export the lookup results?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: isVi
                        ? "Có, bạn có thể xuất dữ liệu ra file CSV hoặc JSON chỉ với một cú nhấp chuột."
                        : "Yes, you can export all enriched records to CSV or JSON with a single click.",
                },
            },
        ],
    };

    const relatedTools = getRelatedTools("/tools/bulk-ip-lookup", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <ToolPageLayout
                title={isVi ? "Tra Cứu IP Hàng Loạt" : "Bulk IP Lookup"}
                description={
                    isVi
                        ? "Nhập danh sách địa chỉ IP để tra cứu vị trí địa lý, nhà mạng ISP, quốc gia và khám phá trực quan trên bản đồ thế giới."
                        : "Input multiple IP addresses to inspect geolocation, ISP, country, city, and explore distribution on an interactive world map."
                }
            >
                <BulkIpLookupClient />
                <BulkIpLookupContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/bulk-ip-lookup' />
            </ToolPageLayout>
        </>
    );
}
