import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { privacyTranslations, getExtensionPrivacyPolicy } from "@/lib/i18n/pages/privacy";
import { extensions } from "@/constants/extensions";
import PrivacyContent from "./PrivacyContent";

interface Props {
    params: Promise<{ extensionId: string }>;
}

export async function generateStaticParams() {
    // Generate static paths for all extensions that have privacy policies
    return extensions.map((ext) => ({
        extensionId: ext.id,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { extensionId } = await params;
    const privacyData = getExtensionPrivacyPolicy(extensionId);

    if (!privacyData) {
        return {
            title: "Privacy Policy Not Found",
        };
    }

    const t = privacyTranslations.en.privacy.meta;
    const tVi = privacyTranslations.vi.privacy.meta;

    const title = t.title.replace("{extensionName}", privacyData.extensionName);
    const description = t.description.replace("{extensionName}", privacyData.extensionName);
    const titleVi = tVi.title.replace("{extensionName}", privacyData.extensionName);
    const descriptionVi = tVi.description.replace("{extensionName}", privacyData.extensionName);

    return {
        title,
        description,
        keywords: [...t.keywords, ...tVi.keywords, privacyData.extensionName.toLowerCase()],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
        alternates: {
            canonical: `/privacy/${extensionId}`,
            languages: {
                en: `/privacy/${extensionId}?lang=en`,
                vi: `/privacy/${extensionId}?lang=vi`,
            },
        },
    };
}

// Structured data for SEO
function generateStructuredData(extensionName: string, extensionId: string) {
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Privacy Policy - ${extensionName}`,
        description: `Privacy policy for ${extensionName} browser extension`,
        url: `https://anytools.online/privacy/${extensionId}`,
        isPartOf: {
            "@type": "WebSite",
            name: "AnyTools",
            url: "https://anytools.online",
        },
        about: {
            "@type": "SoftwareApplication",
            name: extensionName,
            applicationCategory: "BrowserApplication",
        },
    };
}

export default async function PrivacyPage({ params }: Props) {
    const { extensionId } = await params;
    const privacyData = getExtensionPrivacyPolicy(extensionId);

    if (!privacyData) {
        notFound();
    }

    const extension = extensions.find((ext) => ext.id === extensionId);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateStructuredData(privacyData.extensionName, extensionId)),
                }}
            />
            <div className='container mx-auto px-4 py-12'>
                <PrivacyContent
                    privacyData={privacyData}
                    chromeUrl={extension?.chromeUrl}
                    githubUrl={extension?.githubUrl}
                />
            </div>
        </div>
    );
}
