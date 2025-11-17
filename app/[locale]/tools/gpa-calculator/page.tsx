import type { Metadata } from "next";
import GpaCalculatorClient from "./GpaCalculatorClient";
import GpaCalculatorContent from "./GpaCalculatorContent";
import { RelatedTools } from "@/components";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const metadata = {
        en: {
            title: "GPA Calculator - Calculate Grade Point Average & Credit System 2025 | AnyTools",
            description: "Free online GPA calculator for Vietnamese universities. Calculate current GPA, predict target grades, simulate scenarios. Support multiple grading systems (4.0, 10-point scale, 100-point scale). Understand credit system, grade conversion, and graduation classification.",
            keywords: "GPA calculator, grade point average, calculate GPA, GPA conversion, credit system, university GPA, academic grade calculator, grade calculator Vietnam, cumulative GPA, semester GPA, graduation classification, tính GPA, điểm trung bình tích lũy, hệ thống tín chỉ",
        },
        vi: {
            title: "Máy tính GPA - Tính điểm trung bình tích lũy & Hệ thống tín chỉ 2025 | AnyTools",
            description: "Công cụ tính GPA miễn phí cho sinh viên Việt Nam. Tính GPA hiện tại, dự đoán điểm cần thiết, mô phỏng kết quả. Hỗ trợ nhiều khung tính điểm (thang 4.0, thang 10, thang 100). Giải thích hệ thống tín chỉ, quy đổi điểm, phân loại tốt nghiệp chi tiết.",
            keywords: "tính GPA, máy tính GPA, điểm trung bình tích lũy, GPA trung bình, hệ thống tín chỉ, tín chỉ đại học, quy đổi điểm, GPA calculator, tính điểm TB, phân loại tốt nghiệp, GPA 4.0, thang điểm 10, cách tính GPA",
        },
    };

    const currentMetadata = metadata[locale as keyof typeof metadata] || metadata.en;

    return {
        title: currentMetadata.title,
        description: currentMetadata.description,
        keywords: currentMetadata.keywords,
        openGraph: {
            title: currentMetadata.title,
            description: currentMetadata.description,
            type: "website",
            locale: locale === "vi" ? "vi_VN" : "en_US",
            url: `https://anytools.online/${locale}/tools/gpa-calculator`,
        },
        twitter: {
            card: "summary_large_image",
            title: currentMetadata.title,
            description: currentMetadata.description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/gpa-calculator`,
            languages: {
                en: "https://anytools.online/en/tools/gpa-calculator",
                vi: "https://anytools.online/vi/tools/gpa-calculator",
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

function GpaCalculatorPage() {
    const relatedTools = [
        {
            href: "/tools/number-converter",
            icon: "🔢",
            nameEn: "Number Converter",
            nameVi: "Chuyển đổi số",
            descriptionEn: "Convert numbers between binary, octal, decimal, and hexadecimal systems",
            descriptionVi: "Chuyển đổi số giữa các hệ nhị phân, bát phân, thập phân và thập lục phân",
        },
        {
            href: "/tools/base64",
            icon: "64",
            nameEn: "Base64 Encoder/Decoder",
            nameVi: "Mã hóa/Giải mã Base64",
            descriptionEn: "Encode and decode Base64 strings easily for data transmission",
            descriptionVi: "Mã hóa và giải mã chuỗi Base64 dễ dàng để truyền dữ liệu",
        },
        {
            href: "/tools/qr-code-generator",
            icon: "📱",
            nameEn: "QR Code Generator",
            nameVi: "Tạo mã QR",
            descriptionEn: "Generate QR codes for text, URLs, contact information and more",
            descriptionVi: "Tạo mã QR cho văn bản, URL, thông tin liên hệ và nhiều hơn nữa",
        },
        {
            href: "/tools/timestamp-converter",
            icon: "⏰",
            nameEn: "Timestamp Converter",
            nameVi: "Chuyển đổi Timestamp",
            descriptionEn: "Convert between Unix timestamp and human-readable date/time formats",
            descriptionVi: "Chuyển đổi giữa Unix timestamp và định dạng ngày giờ dễ đọc",
        },
        {
            href: "/tools/json-formatter",
            icon: "{ }",
            nameEn: "JSON Formatter",
            nameVi: "Định dạng JSON",
            descriptionEn: "Format, validate and beautify JSON data with syntax highlighting",
            descriptionVi: "Định dạng, xác thực và làm đẹp dữ liệu JSON với tô màu cú pháp",
        },
        {
            href: "/tools/password-generator",
            icon: "🔑",
            nameEn: "Password Generator",
            nameVi: "Tạo mật khẩu",
            descriptionEn: "Generate strong, secure passwords with customizable options",
            descriptionVi: "Tạo mật khẩu mạnh, bảo mật với các tùy chọn tùy chỉnh",
        },
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "GPA Calculator - Grade Point Average Calculator",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description: "Free online GPA calculator supporting multiple grading systems used in Vietnamese universities. Calculate current GPA, predict required grades for target GPA, and simulate academic scenarios. Features include 4.0 scale, 10-point scale, and 100-point scale conversions with detailed explanations of the credit system.",
        featureList: ["Calculate current GPA", "Predict target GPA", "Simulate grade scenarios", "Multiple grading systems", "Grade conversion tables", "Credit system explanation", "Graduation classification"],
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is GPA and how is it calculated?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "GPA (Grade Point Average) is a cumulative grade point calculated on a 4.0 scale. Formula: GPA = Σ(Course Grade × Credits) / Σ(Credits). It reflects your overall academic performance throughout your university program.",
                },
            },
            {
                "@type": "Question",
                name: "What is the credit system in Vietnamese universities?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "The credit system is an educational method where each course is assigned credits based on learning hours. 1 credit = 15 theory hours or 30-45 practice hours. Bachelor programs typically require 120-140 credits, college programs 90-110 credits, engineering 150-180 credits, and medical programs 180-220 credits.",
                },
            },
            {
                "@type": "Question",
                name: "How do I convert from 10-point scale to 4.0 GPA scale?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Common conversion: A (8.5-10) = 4.0, B+ (8.0-8.4) = 3.5, B (7.0-7.9) = 3.0, C+ (6.5-6.9) = 2.5, C (5.5-6.4) = 2.0, D+ (5.0-5.4) = 1.5, D (4.0-4.9) = 1.0, F (<4.0) = 0.0. However, conversion tables may vary by university.",
                },
            },
            {
                "@type": "Question",
                name: "What GPA classification is good for graduation?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Graduation classifications: Excellent (≥3.60 GPA / ≥9.0), Good (3.20-3.59 / 8.0-8.9), Fair (2.50-3.19 / 7.0-7.9), Average (2.00-2.49 / 5.0-6.9). Most universities require minimum 2.0 GPA to graduate.",
                },
            },
            {
                "@type": "Question",
                name: "Which grading system should I choose for my university?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "System A (7 levels) is used by most Vietnamese universities including VNU, HUST, FPT. System B (11 levels) offers more detailed classification used by some international universities like RMIT. System C (100-point scale) is for international programs. Check your university's academic regulations or student portal for the exact system.",
                },
            },
            {
                "@type": "Question",
                name: "What GPA do I need for scholarships?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Scholarship requirements vary: Academic encouragement scholarships typically require GPA ≥3.2, full scholarships need GPA ≥3.6-3.8, and corporate scholarships usually require GPA ≥3.0 plus soft skills. Check specific requirements with your university's scholarship office.",
                },
            },
            {
                "@type": "Question",
                name: "How can I improve my GPA?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Focus on high-credit courses as they impact GPA more. Maintain consistent performance above 3.2 from freshman year. Consider retaking courses with low grades if your university counts the highest score. Balance difficult courses across semesters instead of taking them all at once.",
                },
            },
            {
                "@type": "Question",
                name: "What is the difference between semester GPA and cumulative GPA?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Semester GPA calculates only courses taken in that specific semester. Cumulative GPA (CGPA) is the overall average of all courses from the beginning of your program to the current point, weighted by credits.",
                },
            },
        ],
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://anytools.online",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Tools",
                item: "https://anytools.online/#tools",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: "GPA Calculator",
                item: "https://anytools.online/en/tools/gpa-calculator",
            },
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className='container mx-auto px-4 py-8 max-w-6xl'>
                    <GpaCalculatorClient />
                    <GpaCalculatorContent />
                    <RelatedTools tools={relatedTools} currentPath='/tools/gpa-calculator' />
                </div>
            </div>
        </>
    );
}

export default GpaCalculatorPage;
