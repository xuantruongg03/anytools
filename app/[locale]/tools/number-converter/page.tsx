import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import NumberConverterContent from "./NumberConverterContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";
    const title = isVi ? "Chuyển Đổi Hệ Số & Máy Tính Bitwise - Nhị Phân, Hex, Decimal 2025" : "Number System Converter & Bitwise Calculator - Binary, Hex, Decimal Online 2025";
    const description = isVi ? "Công cụ chuyển đổi hệ số và máy tính bitwise miễn phí. Chuyển đổi giữa nhị phân, thập phân, thập lục phân, bát phân. Thực hiện AND, OR, XOR." : "Free number system converter and bitwise calculator. Convert between binary, decimal, hexadecimal, octal. Perform AND, OR, XOR, shift operations.";

    return {
        title,
        description,
        keywords: ["number converter", "binary to decimal", "hex to decimal", "number system converter", "base converter", "bitwise calculator", "chuyển đổi hệ số", "nhị phân", "thập lục phân", "bitwise"],
        alternates: {
            canonical: `https://www.anytools.online/${locale}/tools/number-converter`,
            languages: {
                en: "https://www.anytools.online/en/tools/number-converter",
                vi: "https://www.anytools.online/vi/tools/number-converter",
                "x-default": "https://www.anytools.online/en/tools/number-converter",
            },
        },
        openGraph: {
            title,
            description,
            url: `https://www.anytools.online/${locale}/tools/number-converter`,
            siteName: "AnyTools",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        robots: { index: true, follow: true },
    };
}

export default async function NumberConverterPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Number System Converter & Bitwise Calculator",
        description: "Free online tool to convert between number systems (binary, decimal, hexadecimal, octal) and perform bitwise operations (AND, OR, XOR, NOT, shifts).",
        url: "https://www.anytools.online/tools/number-converter",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        featureList: ["Binary to Decimal conversion", "Decimal to Hexadecimal conversion", "Hexadecimal to Binary conversion", "Octal conversion", "Bitwise AND operation", "Bitwise OR operation", "Bitwise XOR operation", "Bitwise NOT operation", "Left shift operation", "Right shift operation", "Unsigned right shift", "Binary arithmetic", "Real-time conversion", "Free to use"],
        browserRequirements: "Requires JavaScript",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "Why do programmers use hexadecimal?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Hexadecimal provides a compact way to represent binary data. Each hex digit represents exactly 4 binary bits, making it easier to read and write than long binary strings. It's widely used in memory addresses, color codes, and debugging.",
                },
            },
            {
                "@type": "Question",
                name: "How do bitwise operations work?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Bitwise operations work on individual bits of numbers. AND (&) outputs 1 only if both bits are 1. OR (|) outputs 1 if at least one bit is 1. XOR (^) outputs 1 if bits are different. NOT (~) inverts all bits. Shift operations move bits left or right.",
                },
            },
            {
                "@type": "Question",
                name: "How to convert between binary and hexadecimal quickly?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Group binary digits in sets of 4 from right to left. Each group of 4 bits equals one hexadecimal digit. Example: 11010110₂ = 1101 0110 = D6₁₆. This works because 16 = 2⁴.",
                },
            },
            {
                "@type": "Question",
                name: "What are practical uses of XOR?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "XOR is used for: toggling bits, swapping variables without temp storage, simple encryption, checksum calculations, finding unique elements, and detecting bit differences. It's a key operation in many algorithms.",
                },
            },
        ],
    };

    const relatedTools = getRelatedTools("/tools/number-converter", 6);

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <ToolPageLayout title='Number System Converter & Bitwise Calculator' description='Convert between binary, decimal, hexadecimal, octal. Perform bitwise operations: AND, OR, XOR, shifts.'>
                <NumberConverterContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/number-converter' />
            </ToolPageLayout>
        </>
    );
}
