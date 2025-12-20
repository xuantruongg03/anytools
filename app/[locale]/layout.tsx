import type { Metadata } from "next";

type Props = {
    params: Promise<{ locale: string }>;
    children: React.ReactNode;
};

// Generate static params for all locales - important for SEO
export async function generateStaticParams() {
    return [{ locale: "en" }, { locale: "vi" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    return {
        alternates: {
            canonical: `https://anytools.online/${locale}`,
            languages: {
                en: "https://anytools.online/en",
                vi: "https://anytools.online/vi",
                "x-default": "https://anytools.online/en",
            },
        },
    };
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
