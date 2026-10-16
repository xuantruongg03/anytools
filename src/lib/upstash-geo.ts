import type { GeoLocation } from "@/lib/utils/geo-ip-service";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
const prefix = "geo:ip:";

async function command<T>(body: string[]): Promise<T | null> {
    if (!url || !token) return null;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok) return null;
        return (await response.json()).result as T;
    } catch {
        return null;
    }
}

export async function upstashMGetGeoCache(ips: string[]): Promise<Map<string, GeoLocation>> {
    const result = new Map<string, GeoLocation>();
    if (ips.length === 0) return result;
    const values = await command<Array<string | null>>(["MGET", ...ips.map((ip) => `${prefix}${ip}`)]);
    values?.forEach((value, index) => {
        if (!value) return;
        try { result.set(ips[index], JSON.parse(value) as GeoLocation); } catch { /* ignore malformed cache entries */ }
    });
    return result;
}

export async function upstashMSetGeoCache(entries: Array<[string, GeoLocation]>, ttlSeconds: number): Promise<void> {
    await Promise.all(entries.map(([ip, value]) => command(["SETEX", `${prefix}${ip}`, String(ttlSeconds), JSON.stringify(value)])));
}
