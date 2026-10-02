import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
    isVaultSlugValid,
    verifyAdminSessionToken,
    createTabSessionToken,
    SESSION_COOKIE_NAME,
} from "@/lib/security/vault";
import DarkboardClient from "./DarkboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "System Telemetry Vault // AnyTools",
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
};

interface PageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export default async function SysVaultPage({ params }: PageProps) {
    const { locale, slug } = await params;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const isAuthenticated = verifyAdminSessionToken(sessionCookie);

    // STRICT TIME-WINDOW CHECK:
    // If not authenticated and the URL was generated outside the valid window, return 404 immediately.
    // If already authenticated via secure admin session, allow access so page refresh doesn't fail.
    if (!isAuthenticated && !isVaultSlugValid(slug)) {
        notFound();
    }

    // Generate ephemeral in-tab session token to keep the tab functional while open
    const tabToken = createTabSessionToken();

    return (
        <DarkboardClient
            locale={locale}
            secretSlug={slug}
            tabToken={tabToken}
            initialAuthenticated={isAuthenticated}
        />
    );
}
