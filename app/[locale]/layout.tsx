import type { Metadata } from "next";

type Props = {
    params: Promise<{ locale: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    return {
        alternates: {
            canonical: `https://www.anytools.online/${locale}`,
            languages: {
                en: "https://www.anytools.online/en",
                vi: "https://www.anytools.online/vi",
                "x-default": "https://www.anytools.online/vi",
            },
        },
    };
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
