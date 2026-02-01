import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "vi"];
const defaultLocale = "en";

// ============ Page View Logging ============
// Có thể bật/tắt logging cho page views
const ENABLE_PAGE_VIEW_LOGGING = process.env.ENABLE_PAGE_VIEW_LOGGING === "true";

// Paths không cần log
const EXCLUDE_LOG_PATHS = [
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/api", // API có logging riêng
];

function shouldLogPageView(pathname: string): boolean {
    if (!ENABLE_PAGE_VIEW_LOGGING) return false;
    return !EXCLUDE_LOG_PATHS.some((path) => pathname.startsWith(path));
}

function getLocale(request: NextRequest): string {
    // 1. Check cookie first
    const cookieLocale = request.cookies.get("locale")?.value;
    if (cookieLocale && locales.includes(cookieLocale)) {
        return cookieLocale;
    }

    // 2. Check Accept-Language header
    const acceptLanguage = request.headers.get("accept-language");
    if (acceptLanguage) {
        const languages = acceptLanguage.split(",").map((lang) => lang.split(";")[0].trim());
        for (const lang of languages) {
            if (lang.startsWith("vi")) return "vi";
            if (lang.startsWith("en")) return "en";
        }
    }

    // 3. Default locale
    return defaultLocale;
}

export async function middleware(request: NextRequest) {
    const { pathname, hostname } = request.nextUrl;

    // Redirect www to non-www for SEO consistency
    if (hostname === "www.anytools.online") {
        const url = request.nextUrl.clone();
        url.hostname = "anytools.online";
        return NextResponse.redirect(url, 301);
    }

    // Check if pathname already has a locale
    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

    // ===== Page View Logging (gửi đến internal API) =====
    if (shouldLogPageView(pathname)) {
        const logData = {
            method: request.method,
            path: pathname,
            query: request.nextUrl.search || undefined,
            ip: request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
            userAgent: request.headers.get("user-agent") || undefined,
            referer: request.headers.get("referer") || undefined,
            locale: request.cookies.get("locale")?.value || undefined,
            country: request.headers.get("x-vercel-ip-country") || undefined,
            city: request.headers.get("x-vercel-ip-city") || undefined,
            statusCode: 200,
        };

        // Fire and forget - gửi đến internal API
        const baseUrl = request.nextUrl.origin;
        fetch(`${baseUrl}/api/internal/log`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-internal-secret": process.env.INTERNAL_LOG_SECRET || "",
            },
            body: JSON.stringify(logData),
        }).catch(() => {
            // Ignore errors - không block request
        });
    }

    if (pathnameHasLocale) {
        return NextResponse.next();
    }

    // Get user's preferred locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|robots.txt|sitemap.xml|[a-f0-9]{32}\\.txt).*)"],
};
