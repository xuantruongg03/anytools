import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Header } from "@/components/Header";
import { FloatingButtons } from "@/components/FloatingButtons";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin", "vietnamese"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://anytools.online"),
    title: {
        default: "AnyTools - Free Online Tools for Developers & Creators",
        template: "%s | AnyTools",
    },
    description: "Free online tools for developers, designers, and content creators. Text formatters, JSON validators, color pickers, image converters, and more.",
    keywords: ["online tools", "developer tools", "free tools", "text formatter", "JSON validator", "color picker", "base64 encoder", "URL encoder"],
    authors: [{ name: "AnyTools" }],
    creator: "AnyTools",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://anytools.online",
        title: "AnyTools - Free Online Tools",
        description: "Free online tools for developers, designers, and content creators",
        siteName: "AnyTools",
    },
    twitter: {
        card: "summary_large_image",
        title: "AnyTools - Free Online Tools",
        description: "Free online tools for developers, designers, and content creators",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6F8BFBEBKF"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-6F8BFBEBKF');
</script>
                <meta name='google-adsense-account' content='ca-pub-1892668821213380' />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                const theme = localStorage.getItem('theme');
                                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                const initialTheme = theme || systemTheme;
                                if (initialTheme === 'dark') {
                                    document.documentElement.classList.add('dark');
                                }
                            } catch (e) {}
                        `,
                    }}
                />
            </head>
            <body className={`${inter.variable} antialiased flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`} suppressHydrationWarning>
                <QueryProvider>
                    <LanguageProvider>
                        <Header />
                        <main className='flex-1'>{children}</main>
                        {/* <Footer /> */}
                        <FloatingButtons />
                    </LanguageProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
