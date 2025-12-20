import type { Metadata } from "next";
import ExtensionsContent from "./ExtensionsContent";
import { browserExtensionsTranslations } from "@/lib/i18n/pages/browser-extensions";

export async function generateMetadata(): Promise<Metadata> {
    const t = browserExtensionsTranslations.en.browserExtensions.meta;
    const tVi = browserExtensionsTranslations.vi.browserExtensions.meta;

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
            canonical: "/browser-extensions",
            languages: {
                en: "/browser-extensions?lang=en",
                vi: "/browser-extensions?lang=vi",
            },
        },
    };
}

// Structured data for SEO
function generateStructuredData() {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Browser Extensions Collection",
        description: "A curated collection of useful browser extensions for Chrome, Firefox, and Edge.",
        url: "https://anytools.online/browser-extensions",
        mainEntity: {
            "@type": "ItemList",
            name: "Browser Extensions",
            description: "Curated list of browser extensions",
        },
    };
}

export default function BrowserExtensionsPage() {
    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className='container mx-auto px-4 py-12'>
                    <ExtensionsContent />
                </div>
            </div>
        </>
    );
}
