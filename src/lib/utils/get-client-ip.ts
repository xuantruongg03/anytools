import { NextRequest } from "next/server";

/**
 * List of headers to check for client IP (in order of priority)
 * - Vercel uses x-forwarded-for and x-real-ip
 * - Cloudflare uses cf-connecting-ip and true-client-ip
 * - Standard proxies use x-forwarded-for and x-real-ip
 */
const IP_HEADERS = [
    "x-real-ip", // Most reliable - single IP
    "x-vercel-forwarded-for", // Vercel specific
    "cf-connecting-ip", // Cloudflare
    "true-client-ip", // Cloudflare Enterprise
    "x-client-ip", // Apache
    "x-forwarded-for", // Standard proxy header (can contain multiple IPs)
    "x-cluster-client-ip", // Cluster environments
    "forwarded-for",
    "forwarded",
] as const;

/**
 * Extract IP from a header value
 * Handles comma-separated lists (takes first IP)
 */
function extractIp(headerValue: string | null): string | null {
    if (!headerValue) return null;

    // Handle "for=" prefix in Forwarded header (RFC 7239)
    if (headerValue.toLowerCase().startsWith("for=")) {
        headerValue = headerValue.slice(4);
    }

    // Get first IP from comma-separated list
    const ip = headerValue.split(",")[0]?.trim();

    // Remove port if present (e.g., "192.168.1.1:8080" -> "192.168.1.1")
    // Also handle IPv6 with brackets (e.g., "[::1]:8080" -> "::1")
    if (ip) {
        // IPv6 with brackets
        if (ip.startsWith("[")) {
            const bracketEnd = ip.indexOf("]");
            if (bracketEnd !== -1) {
                return ip.slice(1, bracketEnd);
            }
        }
        // IPv4 or IPv6 without brackets - remove port
        const lastColon = ip.lastIndexOf(":");
        if (lastColon !== -1 && ip.indexOf(":") === lastColon) {
            // Only one colon means IPv4:port
            return ip.slice(0, lastColon);
        }
        return ip;
    }

    return null;
}

/**
 * Validate if string looks like a valid IP address
 */
function isValidIp(ip: string, allowLocalhost: boolean = false): boolean {
    if (!ip || ip === "unknown") {
        return false;
    }
    // Allow localhost IPs if specified
    if (!allowLocalhost && (ip === "::1" || ip === "127.0.0.1")) {
        return false;
    }
    // Basic validation - contains dots (IPv4) or colons (IPv6)
    return ip.includes(".") || ip.includes(":");
}

/**
 * Get client IP address from request headers
 * Works with Vercel, Cloudflare, Nginx, and other reverse proxies
 */
export function getClientIp(request: NextRequest | Request): string {
    // Try each header in order of priority
    for (const header of IP_HEADERS) {
        const value = request.headers.get(header);
        const ip = extractIp(value);
        if (ip && isValidIp(ip)) {
            return ip;
        }
    }

    // Second pass: allow localhost IPs (for local development)
    for (const header of IP_HEADERS) {
        const value = request.headers.get(header);
        const ip = extractIp(value);
        if (ip && isValidIp(ip, true)) {
            return ip === "::1" ? "127.0.0.1" : ip;
        }
    }

    // Check NextRequest's ip property (Vercel)
    if ("ip" in request && (request as NextRequest).ip) {
        return (request as NextRequest).ip!;
    }

    // Fallback: try to get from request URL for local development
    if (request instanceof Request) {
        try {
            const url = new URL(request.url);
            if (url.hostname && url.hostname !== "localhost") {
                return url.hostname;
            }
        } catch {
            // Ignore URL parsing errors
        }
    }

    return "Unknown IP";
}

/**
 * Get client IP from Headers object directly
 */
export function getClientIpFromHeaders(reqHeaders: Headers): string {
    // Try each header in order of priority
    for (const header of IP_HEADERS) {
        const value = reqHeaders.get(header);
        const ip = extractIp(value);
        if (ip && isValidIp(ip)) {
            return ip;
        }
    }

    return "Unknown IP";
}

/**
 * Debug function to log all IP-related headers (useful for troubleshooting)
 */
export function debugIpHeaders(request: NextRequest | Request): Record<string, string | null> {
    const debug: Record<string, string | null> = {};
    for (const header of IP_HEADERS) {
        debug[header] = request.headers.get(header);
    }
    return debug;
}
