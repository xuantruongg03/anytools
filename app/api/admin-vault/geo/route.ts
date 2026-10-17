import { NextRequest, NextResponse } from "next/server";
import { batchResolveIpLocations } from "@/lib/utils/geo-ip-service";
import { verifyAdminSessionToken, verifyTabSessionToken, SESSION_COOKIE_NAME } from "@/lib/security/vault";

export async function GET(request: NextRequest) {
    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!verifyAdminSessionToken(cookie) && !verifyTabSessionToken(request.headers.get("x-vault-tab-token"))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const ips = request.nextUrl.searchParams.getAll("ip").slice(0, 100);
    const locations = await batchResolveIpLocations(ips);
    return NextResponse.json({ locations: Object.fromEntries(locations) }, {
        headers: { "Cache-Control": "private, max-age=60" },
    });
}
