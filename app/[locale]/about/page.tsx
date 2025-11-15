import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "About AnyTools - Free Online Developer Tools & Open Source Project",
        description: "Learn about AnyTools - a 100% free and open-source collection of online tools for developers, designers, and creators. Contribute new tools, fix bugs, or support the project.",
        keywords: [
            // English keywords
            "about anytools",
            "developer tools",
            "online tools",
            "free utilities",
            "open source tools",
            "contribute to open source",
            "free developer tools",
            "browser-based tools",
            // Vietnamese keywords
            "về anytools",
            "công cụ lập trình",
            "công cụ trực tuyến",
            "tiện ích miễn phí",
            "mã nguồn mở",
            "đóng góp mã nguồn mở",
        ],
        openGraph: {
            title: "About AnyTools - Free Online Developer Tools",
            description: "100% free and open-source collection of online tools. Contribute on GitHub!",
            type: "website",
            siteName: "AnyTools",
        },
        twitter: {
            card: "summary_large_image",
            title: "About AnyTools - Free Online Tools",
            description: "Free, open-source developer tools running in your browser.",
        },
        alternates: {
            canonical: "/about",
            languages: {
                en: "/about?lang=en",
                vi: "/about?lang=vi",
            },
        },
    };
}

export default function AboutPage() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-12'>
                <AboutContent />
            </div>
        </div>
    );
}
