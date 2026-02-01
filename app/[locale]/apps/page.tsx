import type { Metadata } from "next";
import { appsTranslations } from "@/lib/i18n/pages/apps";
import AppsContent from "./AppsContent";

export async function generateMetadata(): Promise<Metadata> {
    const t = appsTranslations.en.apps.meta;
    const tVi = appsTranslations.vi.apps.meta;

    return {
        title: t.title,
        description: t.description,
        keywords: [...t.keywords, ...tVi.keywords],
        openGraph: {
            title: t.title,
            description: t.description,
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title: t.title,
            description: t.description,
        },
        alternates: {
            canonical: "/apps",
            languages: {
                en: "/apps?lang=en",
                vi: "/apps?lang=vi",
            },
        },
    };
}

// Structured data for SEO
function generateStructuredData() {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Apps & Tools Collection",
        description: "A curated collection of the best apps and tools for productivity, development, design, and more.",
        url: "https://anytools.online/apps",
        mainEntity: {
            "@type": "ItemList",
            name: "Apps & Tools",
            description: "Curated list of recommended apps and tools",
        },
    };
}

export default function AppsPage() {
    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className='container mx-auto px-4 py-12'>
                    <AppsContent />
                </div>
            </div>
        </>
    );
}
