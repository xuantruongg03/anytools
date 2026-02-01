import { apps, getAppById } from "@/constants/apps";
import { appsTranslations } from "@/lib/i18n/pages/apps";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppDetailContent from "./AppDetailContent";

interface Props {
    params: Promise<{ appId: string }>;
}

export async function generateStaticParams() {
    // Generate static paths for all apps
    return apps.map((app) => ({
        appId: app.id,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { appId } = await params;
    const app = getAppById(appId);

    if (!app) {
        return {
            title: "App Not Found",
        };
    }

    const t = appsTranslations.en.apps;
    const tVi = appsTranslations.vi.apps;

    // Use SEO data if available, otherwise use default description
    const title = app.seo?.en.title || `${app.name} - Download & Review`;
    const description = app.seo?.en.description || app.description.en;
    const titleVi = app.seo?.vi.title || `${app.name} - Tải Xuống & Đánh Giá`;
    const descriptionVi = app.seo?.vi.description || app.description.vi;

    const keywords = [app.name.toLowerCase(), `${app.name} download`, `${app.name} windows`, `${app.name} ios`, `${app.name} free`, ...(app.tags || []), ...t.meta.keywords, ...tVi.meta.keywords];

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `/apps/${appId}`,
            languages: {
                en: `/apps/${appId}?lang=en`,
                vi: `/apps/${appId}?lang=vi`,
            },
        },
    };
}

// Structured data for SEO
function generateStructuredData(app: NonNullable<ReturnType<typeof getAppById>>) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: app.name,
        description: app.seo?.en.description || app.description.en,
        applicationCategory: app.category === "developer" ? "DeveloperApplication" : app.category === "productivity" ? "ProductivityApplication" : app.category === "design" ? "DesignApplication" : app.category === "communication" ? "CommunicationApplication" : "Application",
        operatingSystem: [app.windowsUrl ? "Windows" : null, app.iosUrl ? "iOS" : null].filter(Boolean).join(", "),
        offers: {
            "@type": "Offer",
            price: app.isFree ? "0" : undefined,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
        },
        author: {
            "@type": "Organization",
            name: app.author,
        },
        url: `https://anytools.online/apps/${app.id}`,
    };
}

export default async function AppDetailPage({ params }: Props) {
    const { appId } = await params;
    const app = getAppById(appId);

    if (!app) {
        notFound();
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData(app)) }} />
            <div className='container mx-auto px-4 py-12'>
                <AppDetailContent app={app} />
            </div>
        </div>
    );
}
