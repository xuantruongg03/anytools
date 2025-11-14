import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
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
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
                <LanguageProvider>
                    <Header />
                    <main className='flex-1'>{children}</main>
                    <Footer />
                    <FloatingButtons />
                </LanguageProvider>
            </body>
        </html>
    );
}
