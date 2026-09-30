import { NextRequest, NextResponse } from "next/server";
import {
    validateAdminLogin,
    createAdminSessionToken,
    verifyAdminSessionToken,
    verifyTabSessionToken,
    SESSION_COOKIE_NAME,
    getVaultSecretSlug,
    isVaultSlugValid,
} from "@/lib/security/vault";
import { getClientIp } from "@/lib/utils/get-client-ip";

// In-memory rate limiter for failed login attempts
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

export async function POST(request: NextRequest) {
    const tabToken = request.headers.get("x-vault-tab-token");
    const hasValidTab = verifyTabSessionToken(tabToken);

    const slugHeader = request.headers.get("x-vault-slug") || request.nextUrl.searchParams.get("slug");
    const hasValidSlug = slugHeader ? isVaultSlugValid(slugHeader) : false;

    // Cloaking: Require valid open tab token OR valid 1-minute slug
    if (!hasValidTab && !hasValidSlug) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const clientIp = getClientIp(request);
    const now = Date.now();

    // Check brute-force lockout
    const lockInfo = failedAttempts.get(clientIp);
    if (lockInfo && lockInfo.lockedUntil > now) {
        const remainingSec = Math.ceil((lockInfo.lockedUntil - now) / 1000);
        return NextResponse.json(
            { error: `Too many failed attempts. Locked out for ${remainingSec} seconds.` },
            { status: 429 }
        );
    }

    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: "Credentials required" }, { status: 400 });
        }

        const isValid = await validateAdminLogin(username, password);

        if (!isValid) {
            const current = failedAttempts.get(clientIp) || { count: 0, lockedUntil: 0 };
            current.count += 1;
            if (current.count >= 5) {
                current.lockedUntil = now + 10 * 60 * 1000; // 10 minutes lockout
            }
            failedAttempts.set(clientIp, current);

            return NextResponse.json(
                {
                    error: "Invalid credentials.",
                    remainingAttempts: Math.max(0, 5 - current.count),
                },
                { status: 401 }
            );
        }

        // Reset failed attempts on success
        failedAttempts.delete(clientIp);

        // Create signed JWT-like session token
        const token = createAdminSessionToken(12); // 12 hours session
        const secretSlug = getVaultSecretSlug();

        const response = NextResponse.json({
            success: true,
            vaultSlug: secretSlug,
        });

        // Set secure HTTP-only cookie
        response.cookies.set({
            name: SESSION_COOKIE_NAME,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 12 * 3600,
        });

        return response;
    } catch (err: any) {
        console.error("❌ [Admin Auth API] Error:", err);
        return NextResponse.json({ error: "Authentication failure" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const tabToken = request.headers.get("x-vault-tab-token");
    const hasValidTab = verifyTabSessionToken(tabToken);

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValid = verifyAdminSessionToken(sessionCookie);

    const slugHeader = request.headers.get("x-vault-slug") || request.nextUrl.searchParams.get("slug");
    const hasValidSlug = slugHeader ? isVaultSlugValid(slugHeader) : false;

    if (!isValid && !hasValidTab && !hasValidSlug) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json({
        authenticated: isValid,
        vaultSlug: isValid ? getVaultSecretSlug() : null,
    });
}

export async function DELETE(request: NextRequest) {
    const tabToken = request.headers.get("x-vault-tab-token");
    const hasValidTab = verifyTabSessionToken(tabToken);

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValid = verifyAdminSessionToken(sessionCookie);

    const slugHeader = request.headers.get("x-vault-slug") || request.nextUrl.searchParams.get("slug");
    const hasValidSlug = slugHeader ? isVaultSlugValid(slugHeader) : false;

    if (!isValid && !hasValidTab && !hasValidSlug) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const response = NextResponse.json({ success: true, message: "Logged out from admin vault." });
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
}
