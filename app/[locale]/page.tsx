import type { Metadata } from "next";
import { StructuredData } from "../components/StructuredData";
import HomeContent from "./HomeContent";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isVi = locale === "vi";

    const title = isVi ? "AnyTools - Công Cụ Online Miễn Phí Cho Lập Trình Viên 2025" : "AnyTools - Free Online Tools for Developers & Creators 2025";

    const description = isVi ? "Công cụ online miễn phí cho lập trình viên và designer. JSON formatter, Base64 encoder, Color picker, Hash generator và nhiều hơn nữa." : "Free online tools for developers and designers. JSON formatter, Base64 encoder, Color picker, Hash generator, and more.";

    return {
        title,
        description,
        keywords: ["online tools", "developer tools", "free tools", "JSON formatter", "Base64 encoder", "color picker", "hash generator", "URL encoder", "password generator", "công cụ trực tuyến", "công cụ lập trình viên", "công cụ miễn phí"],
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "AnyTools",
            url: `https://anytools.online/${locale}`,
            locale: locale === "vi" ? "vi_VN" : "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: `https://anytools.online/${locale}`,
            languages: {
                en: "https://anytools.online/en",
                vi: "https://anytools.online/vi",
                "x-default": "https://anytools.online/en",
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

export default async function Home({ params }: Props) {
    const { locale: urlLocale } = await params;
    const locale = (urlLocale === "en" || urlLocale === "vi" ? urlLocale : "en") as "en" | "vi";

    return (
        <div className='bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black'>
            <StructuredData type='WebApplication' name='AnyTools - Free Online Tools' description='Free online tools for developers, designers, and content creators. Text formatters, JSON validators, color pickers, and more.' url='https://anytools.online' keywords={["online tools", "developer tools", "free tools", "text formatter", "JSON validator", "color picker", "công cụ trực tuyến", "công cụ lập trình viên"]} inLanguage={["en", "vi"]} />
            <HomeContent locale={locale} />
        </div>
    );
}
