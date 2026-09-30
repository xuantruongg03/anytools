import { NextRequest, NextResponse } from "next/server";
import {
    verifyAdminSessionToken,
    verifyTabSessionToken,
    SESSION_COOKIE_NAME,
    isVaultSlugValid,
} from "@/lib/security/vault";
import { StatsFilterOptions } from "@/lib/telemetry/stats";
import { getRealGoogleSheetsStats } from "@/lib/telemetry/google-sheets-loader";

export async function GET(request: NextRequest) {
    const tabToken = request.headers.get("x-vault-tab-token");
    const hasValidTab = verifyTabSessionToken(tabToken);

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const hasValidSession = verifyAdminSessionToken(sessionCookie);

    const slugHeader = request.headers.get("x-vault-slug") || request.nextUrl.searchParams.get("slug");
    const hasValidSlug = slugHeader ? isVaultSlugValid(slugHeader) : false;

    // Cloaking: Disguise as 404 unless request comes from an open authorized tab, valid session, or valid 1-minute slug
    if (!hasValidTab && !hasValidSession && !hasValidSlug) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    if (!hasValidSession && !hasValidTab) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const options: StatsFilterOptions = {
        extensionId: searchParams.get("extensionId") || "all",
        timeframe: (searchParams.get("timeframe") as any) || "24h",
        status: (searchParams.get("status") as any) || "all",
        searchQuery: searchParams.get("q") || undefined,
    };

    try {
        const data = await getRealGoogleSheetsStats(options);
        return NextResponse.json({
            success: true,
            source: "google_sheets",
            ...data,
        });
    } catch (err: any) {
        console.error("❌ [Vault Stats API] Error fetching telemetry from Google Sheets:", err.message);
        return NextResponse.json(
            {
                success: false,
                error: "Stream unavailable",
                stats: {
                    totalDownloads: 0,
                    totalAnomalies: 0,
                    fastBypassCount: 0,
                    multiIpCount: 0,
                    otherAnomaliesCount: 0,
                    averageWaitSeconds: 0,
                    activeUsersCount: 0,
                    flaggedUsersCount: 0,
                    overallHealthScore: 100,
                    timeline: [],
                    countryDistribution: [],
                    browserDistribution: [],
                    recentEvents: [],
                    topAbusers: [],
                },
                filteredEvents: [],
            },
            { status: 500 }
        );
    }
}
