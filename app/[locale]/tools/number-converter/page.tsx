import type { Metadata } from "next";
import NumberConverterContent from "./NumberConverterContent";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Number System Converter & Bitwise Calculator - Binary, Hex, Decimal Online 2025",
        description: "Free number system converter and bitwise calculator. Convert between binary, decimal, hexadecimal, octal. Perform AND, OR, XOR, shift operations. Essential tool for programmers.",
        keywords: ["number converter", "binary to decimal", "hex to decimal", "number system converter", "base converter", "bitwise calculator", "bitwise operations", "binary calculator", "hexadecimal converter", "octal converter", "chuyển đổi hệ số", "nhị phân", "thập lục phân", "bitwise"],
        alternates: {
            canonical: "https://anytools.online/tools/number-converter",
            languages: {
                en: "https://anytools.online/en/tools/number-converter",
                vi: "https://anytools.online/vi/tools/number-converter",
            },
        },
        openGraph: {
            title: "Number System Converter & Bitwise Calculator - Binary, Hex, Decimal 2025",
            description: "Convert between number systems and perform bitwise operations. Free online tool for binary, decimal, hexadecimal, octal conversion with AND, OR, XOR, shift operations.",
            url: "https://anytools.online/tools/number-converter",
            siteName: "AnyTools",
            locale: "en_US",
            type: "website",
            images: [
                {
                    url: "https://anytools.online/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Number System Converter & Bitwise Calculator",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Number System Converter & Bitwise Calculator 2025",
            description: "Convert binary, decimal, hex, octal. Perform bitwise operations: AND, OR, XOR, shifts. Free tool for programmers.",
            images: ["https://anytools.online/og-image.png"],
        },
        robots: { index: true, follow: true },
    };
}

export default function NumberConverterPage() {
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Number System Converter & Bitwise Calculator",
        description: "Free online tool to convert between number systems (binary, decimal, hexadecimal, octal) and perform bitwise operations (AND, OR, XOR, NOT, shifts).",
        url: "https://anytools.online/tools/number-converter",
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

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
                <div className='container mx-auto px-4 py-8'>
                    <NumberConverterContent />
                </div>
            </div>
        </>
    );
}
