/**
 * API Logger Wrapper
 * Tự động log tất cả API requests vào Google Sheets
 * Kèm rate limiting để chống spam
 */

import { NextRequest, NextResponse } from "next/server";
import { logger, RequestLog, isGoogleSheetsConfigured } from "./google-sheets";
import { RateLimiter, RateLimitConfig, getRateLimitHeaders, RATE_LIMIT_CONFIGS } from "./rate-limiter";

// ============ Types ============

export interface ApiHandlerContext {
    params: Promise<Record<string, string>>;
}

export type ApiHandler = (request: NextRequest, context?: ApiHandlerContext) => Promise<Response>;

export interface WithLoggingOptions {
    /** Có enable rate limiting không */
    rateLimit?: boolean | RateLimitConfig;
    /** Có log request không */
    logging?: boolean;
    /** Custom rate limiter */
    rateLimiter?: RateLimiter;
    /** Các status code không cần log */
    excludeStatusCodes?: number[];
}

// ============ Helper Functions ============

function getClientIp(request: NextRequest): string {
    // Priority: x-real-ip > x-forwarded-for > x-vercel-forwarded-for
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp;

    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0].trim();

    const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
    if (vercelForwardedFor) return vercelForwardedFor.split(",")[0].trim();

    return "unknown";
}

function getGeoInfo(request: NextRequest): { country?: string; city?: string } {
    // Vercel Edge provides geo info via headers
    const country = request.headers.get("x-vercel-ip-country");
    const city = request.headers.get("x-vercel-ip-city");

    return { country: country || undefined, city: city || undefined };
}

// ============ Main Wrapper ============

/**
 * Wrapper để tự động log và rate limit API handlers
 *
 * @example
 * ```ts
 * // Với logging và rate limit mặc định
 * export const GET = withLogging(async (request) => {
 *   return Response.json({ data: "hello" });
 * });
 *
 * // Với custom rate limit
 * export const POST = withLogging(async (request) => {
 *   return Response.json({ success: true });
 * }, {
 *   rateLimit: { maxRequests: 10, windowSec: 60 }
 * });
 *
 * // Chỉ logging, không rate limit
 * export const GET = withLogging(handler, { rateLimit: false });
 * ```
 */
export function withLogging(handler: ApiHandler, options: WithLoggingOptions = {}): ApiHandler {
    const { rateLimit = true, logging = true, excludeStatusCodes = [] } = options;

    // Tạo rate limiter
    let rateLimiter: RateLimiter | null = null;
    if (rateLimit) {
        if (typeof rateLimit === "object") {
            rateLimiter = new RateLimiter(rateLimit);
        } else if (options.rateLimiter) {
            rateLimiter = options.rateLimiter;
        } else {
            rateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.api);
        }
    }

    return async (request: NextRequest, context?: ApiHandlerContext): Promise<Response> => {
        const ip = getClientIp(request);
        const url = new URL(request.url);
        const geo = getGeoInfo(request);

        // ===== Rate Limiting =====
        if (rateLimiter) {
            const rateLimitResult = await rateLimiter.check(ip);

            if (rateLimitResult.limited) {
                // Log rate limit event
                if (logging && isGoogleSheetsConfigured()) {
                    const log = logger.createLog({
                        method: request.method,
                        path: url.pathname,
                        query: url.search || undefined,
                        ip,
                        userAgent: request.headers.get("user-agent") || undefined,
                        referer: request.headers.get("referer") || undefined,
                        ...geo,
                    });

                    const completedLog = logger.completeLog(log, {
                        statusCode: 429,
                        error: new Error("Rate limit exceeded"),
                    });

                    // Fire and forget
                    logger.writeLog(completedLog).catch(console.error);
                }

                return new NextResponse(
                    JSON.stringify({
                        error: "Too Many Requests",
                        message: "Bạn đã gửi quá nhiều request. Vui lòng thử lại sau.",
                        retryAfter: rateLimitResult.retryAfter,
                    }),
                    {
                        status: 429,
                        headers: {
                            "Content-Type": "application/json",
                            ...getRateLimitHeaders(rateLimitResult),
                        },
                    },
                );
            }
        }

        // ===== Create Log Entry =====
        let log: RequestLog | null = null;
        if (logging && isGoogleSheetsConfigured()) {
            log = logger.createLog({
                method: request.method,
                path: url.pathname,
                query: url.search || undefined,
                ip,
                userAgent: request.headers.get("user-agent") || undefined,
                referer: request.headers.get("referer") || undefined,
                locale: request.cookies.get("locale")?.value || undefined,
                ...geo,
            });
        }

        // ===== Execute Handler =====
        let response: Response;
        let error: Error | null = null;

        try {
            response = await handler(request, context);
        } catch (err) {
            error = err instanceof Error ? err : new Error(String(err));

            // Return 500 error response
            response = new NextResponse(
                JSON.stringify({
                    error: "Internal Server Error",
                    message: process.env.NODE_ENV === "development" ? error.message : "Đã xảy ra lỗi",
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                },
            );
        }

        // ===== Complete Log =====
        if (log && !excludeStatusCodes.includes(response.status)) {
            const completedLog = logger.completeLog(log, {
                statusCode: response.status,
                error,
            });

            // Fire and forget - không block response
            logger.writeLog(completedLog).catch(console.error);
        }

        return response;
    };
}

// ============ Specialized Wrappers ============

/**
 * Wrapper với rate limit nghiêm ngặt (cho form submissions, etc.)
 */
export function withStrictRateLimit(handler: ApiHandler): ApiHandler {
    return withLogging(handler, {
        rateLimit: RATE_LIMIT_CONFIGS.strict,
    });
}

/**
 * Wrapper chỉ logging, không rate limit
 */
export function withLoggingOnly(handler: ApiHandler): ApiHandler {
    return withLogging(handler, {
        rateLimit: false,
    });
}

/**
 * Wrapper với rate limit cho contact form
 */
export function withContactRateLimit(handler: ApiHandler): ApiHandler {
    return withLogging(handler, {
        rateLimit: RATE_LIMIT_CONFIGS.contact,
    });
}

// ============ Manual Logging for Middleware ============

/**
 * Log request từ middleware (không có response status)
 */
export async function logMiddlewareRequest(request: NextRequest): Promise<void> {
    if (!isGoogleSheetsConfigured()) return;

    const ip = getClientIp(request);
    const url = new URL(request.url);
    const geo = getGeoInfo(request);

    const log = logger.createLog({
        method: request.method,
        path: url.pathname,
        query: url.search || undefined,
        ip,
        userAgent: request.headers.get("user-agent") || undefined,
        referer: request.headers.get("referer") || undefined,
        locale: request.cookies.get("locale")?.value || undefined,
        ...geo,
    });

    // Mark as success since middleware passed
    const completedLog = logger.completeLog(log, { statusCode: 200 });

    await logger.writeLog(completedLog);
}
