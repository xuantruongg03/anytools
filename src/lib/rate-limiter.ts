/**
 * Rate Limiter sử dụng Upstash Redis
 * Giới hạn số request từ một IP trong khoảng thời gian nhất định
 */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// ============ Types ============

export interface RateLimitConfig {
    /** Số request tối đa trong window */
    maxRequests: number;
    /** Thời gian window (giây) */
    windowSec: number;
    /** Key prefix cho Redis */
    keyPrefix?: string;
}

export interface RateLimitResult {
    /** Có bị rate limit không */
    limited: boolean;
    /** Số request còn lại */
    remaining: number;
    /** Tổng số request đã thực hiện */
    current: number;
    /** Thời gian reset (Unix timestamp) */
    resetAt: number;
    /** Số giây còn lại trước khi reset */
    retryAfter: number;
}

// ============ Default Configs ============

export const RATE_LIMIT_CONFIGS = {
    /** Giới hạn chung cho API */
    api: {
        maxRequests: 100,
        windowSec: 60, // 100 requests / phút
        keyPrefix: "rl:api",
    },
    /** Giới hạn nghiêm ngặt hơn cho các endpoint nhạy cảm */
    strict: {
        maxRequests: 10,
        windowSec: 60, // 10 requests / phút
        keyPrefix: "rl:strict",
    },
    /** Giới hạn cho logging (tránh spam) */
    logging: {
        maxRequests: 300,
        windowSec: 60, // 300 requests / phút (để log không bị miss)
        keyPrefix: "rl:log",
    },
    /** Giới hạn cho contact form */
    contact: {
        maxRequests: 5,
        windowSec: 3600, // 5 requests / giờ
        keyPrefix: "rl:contact",
    },
} as const;

// ============ Rate Limiter Class ============

export class RateLimiter {
    private config: Required<RateLimitConfig>;

    constructor(config: RateLimitConfig) {
        this.config = {
            maxRequests: config.maxRequests,
            windowSec: config.windowSec,
            keyPrefix: config.keyPrefix || "rl",
        };
    }

    /**
     * Kiểm tra và tăng counter cho IP
     */
    async check(identifier: string): Promise<RateLimitResult> {
        // Nếu không có Upstash, cho phép tất cả
        if (!UPSTASH_URL || !UPSTASH_TOKEN) {
            return {
                limited: false,
                remaining: this.config.maxRequests,
                current: 0,
                resetAt: Date.now() + this.config.windowSec * 1000,
                retryAfter: 0,
            };
        }

        const key = `${this.config.keyPrefix}:${identifier}`;
        const now = Math.floor(Date.now() / 1000);
        const windowStart = now - this.config.windowSec;

        try {
            // Sử dụng sliding window với sorted set
            // 1. Xóa các entry cũ hơn window
            // 2. Thêm entry mới
            // 3. Đếm số entry trong window
            // 4. Set TTL

            const pipeline = [
                ["ZREMRANGEBYSCORE", key, "0", windowStart.toString()],
                ["ZADD", key, now.toString(), `${now}:${Math.random()}`],
                ["ZCARD", key],
                ["EXPIRE", key, this.config.windowSec.toString()],
            ];

            const results = await this.executePipeline(pipeline);

            if (!results) {
                // Fallback: cho phép nếu có lỗi
                return {
                    limited: false,
                    remaining: this.config.maxRequests,
                    current: 0,
                    resetAt: now + this.config.windowSec,
                    retryAfter: 0,
                };
            }

            const current = results[2] as number;
            const limited = current > this.config.maxRequests;
            const remaining = Math.max(0, this.config.maxRequests - current);
            const resetAt = now + this.config.windowSec;
            const retryAfter = limited ? this.config.windowSec : 0;

            return {
                limited,
                remaining,
                current,
                resetAt,
                retryAfter,
            };
        } catch (error) {
            console.error("[RateLimiter] Error:", error);
            // Fallback: cho phép nếu có lỗi
            return {
                limited: false,
                remaining: this.config.maxRequests,
                current: 0,
                resetAt: now + this.config.windowSec,
                retryAfter: 0,
            };
        }
    }

    /**
     * Chỉ kiểm tra mà không tăng counter
     */
    async peek(identifier: string): Promise<RateLimitResult> {
        if (!UPSTASH_URL || !UPSTASH_TOKEN) {
            return {
                limited: false,
                remaining: this.config.maxRequests,
                current: 0,
                resetAt: Date.now() + this.config.windowSec * 1000,
                retryAfter: 0,
            };
        }

        const key = `${this.config.keyPrefix}:${identifier}`;
        const now = Math.floor(Date.now() / 1000);
        const windowStart = now - this.config.windowSec;

        try {
            const result = await this.executeCommand<number>(["ZCOUNT", key, windowStart.toString(), "+inf"]);

            const current = result || 0;
            const limited = current >= this.config.maxRequests;
            const remaining = Math.max(0, this.config.maxRequests - current);

            return {
                limited,
                remaining,
                current,
                resetAt: now + this.config.windowSec,
                retryAfter: limited ? this.config.windowSec : 0,
            };
        } catch (error) {
            console.error("[RateLimiter] Peek error:", error);
            return {
                limited: false,
                remaining: this.config.maxRequests,
                current: 0,
                resetAt: now + this.config.windowSec,
                retryAfter: 0,
            };
        }
    }

    /**
     * Reset counter cho IP
     */
    async reset(identifier: string): Promise<boolean> {
        if (!UPSTASH_URL || !UPSTASH_TOKEN) return true;

        const key = `${this.config.keyPrefix}:${identifier}`;

        try {
            await this.executeCommand(["DEL", key]);
            return true;
        } catch (error) {
            console.error("[RateLimiter] Reset error:", error);
            return false;
        }
    }

    // ============ Private Methods ============

    private async executeCommand<T>(command: string[]): Promise<T | null> {
        const response = await fetch(UPSTASH_URL!, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${UPSTASH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(command),
        });

        if (!response.ok) {
            throw new Error(`Upstash error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.result as T;
    }

    private async executePipeline(commands: string[][]): Promise<unknown[] | null> {
        const response = await fetch(`${UPSTASH_URL}/pipeline`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${UPSTASH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(commands),
        });

        if (!response.ok) {
            throw new Error(`Upstash pipeline error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.map((r: { result: unknown }) => r.result);
    }
}

// ============ Singleton Instances ============

export const apiRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.api);
export const strictRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.strict);
export const loggingRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.logging);
export const contactRateLimiter = new RateLimiter(RATE_LIMIT_CONFIGS.contact);

// ============ Utility Functions ============

/**
 * Tạo response headers cho rate limit
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
    return {
        "X-RateLimit-Limit": result.current.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.resetAt.toString(),
        ...(result.limited && { "Retry-After": result.retryAfter.toString() }),
    };
}

/**
 * Kiểm tra xem có phải là spam không dựa trên pattern
 */
export function isSpamPattern(requests: { path: string; timestamp: number }[]): boolean {
    if (requests.length < 10) return false;

    // Kiểm tra nếu có quá nhiều request giống nhau trong thời gian ngắn
    const recentRequests = requests.filter((r) => Date.now() - r.timestamp < 10000); // 10 giây

    if (recentRequests.length > 20) return true;

    // Kiểm tra nếu request cùng path liên tục
    const pathCounts = recentRequests.reduce(
        (acc, r) => {
            acc[r.path] = (acc[r.path] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>,
    );

    return Object.values(pathCounts).some((count) => count > 10);
}
