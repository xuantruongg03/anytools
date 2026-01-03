import { NextRequest } from "next/server";

/**
 * Get client IP address from request headers
 * Works with Vercel, Cloudflare, Nginx, and other reverse proxies
 */
export function getClientIp(request: NextRequest | Request): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        request.headers.get("cf-connecting-ip") || // Cloudflare
        request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || // Vercel
        "Unknown IP"
    );
}

/**
 * Get client IP from Headers object directly
 */
export function getClientIpFromHeaders(reqHeaders: Headers): string {
    return reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || reqHeaders.get("x-real-ip") || reqHeaders.get("cf-connecting-ip") || reqHeaders.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "Unknown IP";
}
