import { getCurrentYear } from "@/lib/utils/date";
import type { Metadata } from "next";
import { ToolPageLayout } from "@/components/layout";
import TeamGeneratorClient from "./TeamGeneratorClient";
import TeamGeneratorContent from "./TeamGeneratorContent";
import RelatedTools from "@/components/RelatedTools";
import { getRelatedTools } from "@/lib/utils/relatedTools";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const metadata = {
        en: {
            title: `Random Team Generator - Split Students & Groups Online ${getCurrentYear()}`,
            description: "Free online random team generator. Quickly divide classroom students, project members, or sports players into fair, balanced groups with leader assignment.",
            keywords: "random team generator, team generator, group generator, split students, random groups, classroom team maker, group picker, chia nhóm ngẫu nhiên, chia tổ lớp học, bốc thăm chia đội",
        },
        vi: {
            title: `Bộ Chia Nhóm Ngẫu Nhiên - Chia Đội, Lớp Học Công Bằng ${getCurrentYear()}`,
            description: "Công cụ chia nhóm ngẫu nhiên miễn phí. Tự động chia học sinh, thành viên dự án hoặc đội thi đấu thành các nhóm đều nhau, hỗ trợ chỉ định nhóm trưởng.",
            keywords: "chia nhóm ngẫu nhiên, tạo nhóm ngẫu nhiên, bộ chia nhóm, chia tổ học sinh, bốc thăm chia đội, team generator, random team maker, chia đội bóng đá, phân chia nhóm học tập",
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
            url: `https://anytools.online/${locale}/tools/team-generator`,
        },
        twitter: {
            card: "summary_large_image",
            title: currentMetadata.title,
            description: currentMetadata.description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}/tools/team-generator`,
            languages: {
                en: "https://anytools.online/en/tools/team-generator",
                vi: "https://anytools.online/vi/tools/team-generator",
                "x-default": "https://anytools.online/en/tools/team-generator",
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

export default async function TeamGeneratorPage({ params }: Props) {
    const { locale } = await params;
    const isVi = locale === "vi";
    const relatedTools = getRelatedTools("/tools/team-generator");

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: isVi ? "Bộ Chia Nhóm Ngẫu Nhiên" : "Random Team Generator",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        description: isVi
            ? "Công cụ chia nhóm ngẫu nhiên công bằng, tự động cân bằng số dư và chỉ định nhóm trưởng."
            : "Free online random team generator to split students or participants into balanced groups.",
        url: `https://anytools.online/${locale}/tools/team-generator`,
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
                name: isVi ? "Bộ Chia Nhóm Ngẫu Nhiên" : "Random Team Generator",
                item: `https://anytools.online/${locale}/tools/team-generator`,
            },
        ],
    };

    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            <ToolPageLayout
                title={isVi ? "Bộ Chia Nhóm Ngẫu Nhiên" : "Random Team Generator"}
                description={
                    isVi
                        ? "Chia danh sách học sinh, người tham gia thành các nhóm ngẫu nhiên công bằng và cân đối."
                        : "Split participants or students into balanced random teams or groups instantly."
                }
            >
                <TeamGeneratorClient />
                <TeamGeneratorContent />
                <RelatedTools tools={relatedTools} currentPath='/tools/team-generator' />
            </ToolPageLayout>
        </>
    );
}
