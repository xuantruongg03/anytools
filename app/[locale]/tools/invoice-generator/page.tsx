import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";
import InvoiceGeneratorContent from "./InvoiceGeneratorContent";
import { invoiceGeneratorTranslations } from "@/lib/i18n/tools/invoice-generator";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    return {
        title: isVi
            ? `Tạo Hóa Đơn Bán Hàng & Xuất PDF Online Miễn Phí ${getCurrentYear()}`
            : `Free Online Invoice Generator & PDF Exporter ${getCurrentYear()}`,
        description: isVi
            ? "Tạo hóa đơn bán hàng, hóa đơn dịch vụ chuyên nghiệp chuẩn quốc tế. Tùy biến logo, tính thuế VAT, chiết khấu và in/tải file PDF khổ A4 tức thì."
            : "Generate professional business invoices in seconds. Customize company logo, itemized tables, VAT tax calculations, currencies, and download print-ready PDFs.",
        keywords: [
            "invoice generator", "tao hoa don", "xuat hoa don pdf", "in hoa don ban hang",
            "free invoice maker", "tao hoa don online", "invoice template a4"
        ],
        authors: [{ name: "AnyTools" }],
        creator: "AnyTools",
        publisher: "AnyTools",
        openGraph: {
            title: isVi
                ? `Tạo Hóa Đơn Bán Hàng Online Chuẩn A4 ${getCurrentYear()}`
                : `Professional Invoice Generator & PDF Exporter ${getCurrentYear()}`,
            description: isVi
                ? "Tạo và in hóa đơn bán hàng, dịch vụ chuyên nghiệp miễn phí 100%."
                : "Create itemized business invoices with branding, taxes, and instant PDF download.",
            type: "website",
            siteName: "AnyTools",
            url: "https://anytools.online/tools/invoice-generator",
            locale: isVi ? "vi_VN" : "en_US",
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/invoice-generator`,
            languages: {
                en: "https://anytools.online/en/tools/invoice-generator",
                vi: "https://anytools.online/vi/tools/invoice-generator",
                "x-default": "https://anytools.online/en/tools/invoice-generator",
            },
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function InvoiceGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const t = invoiceGeneratorTranslations[locale as "en" | "vi"] || invoiceGeneratorTranslations.en;
    const relatedTools = getRelatedTools("/tools/invoice-generator", 6);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: t.name,
        applicationCategory: "BusinessApplication",
        description: t.description,
        url: `https://anytools.online/${locale}/tools/invoice-generator`,
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: [
            "Custom company logo and client information management",
            "Itemized pricing table with automatic subtotal and tax calculation",
            "Multi-currency support (VND, USD, EUR, GBP, JPY)",
            "Direct printable A4 document view and PDF export",
            "100% Client-side privacy and secure data processing"
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ToolPageLayout
                title={t.name}
                description={t.description}
                maxWidth='max-w-[1440px]'
            >
                <InvoiceGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/invoice-generator' />
            </ToolPageLayout>
        </>
    );
}
