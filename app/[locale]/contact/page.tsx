import type { Metadata } from "next";
import ContactContent from "./ContactContent";
import { contactTranslations } from "@/lib/i18n/pages/contact";

export async function generateMetadata(): Promise<Metadata> {
    const t = contactTranslations.en.contact.meta;
    const tVi = contactTranslations.vi.contact.meta;

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
            canonical: "/contact",
            languages: {
                en: "/contact?lang=en",
                vi: "/contact?lang=vi",
            },
        },
    };
}

// Structured data for SEO
function generateStructuredData() {
    return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact AnyTools",
        description: "Get in touch with AnyTools team for suggestions, feedback, or support.",
        url: "https://anytools.online/contact",
        mainEntity: {
            "@type": "Organization",
            name: "AnyTools",
            url: "https://anytools.online",
        },
    };
}

export default function ContactPage() {
    return (
        <>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }} />
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                <div className='container mx-auto px-4 py-12'>
                    <ContactContent />
                </div>
            </div>
        </>
    );
}
