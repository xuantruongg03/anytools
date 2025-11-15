import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "vi"];
const defaultLocale = "en";

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

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if pathname already has a locale
    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

    if (pathnameHasLocale) {
        return NextResponse.next();
    }

    // Get user's preferred locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|robots.txt|sitemap.xml).*)"],
};
