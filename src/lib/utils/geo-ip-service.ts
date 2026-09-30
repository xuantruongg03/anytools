import fs from "fs";
import path from "path";

export interface GeoLocation {
    ip: string;
    country: string;
    countryCode?: string;
    city?: string;
    region?: string;
    isp?: string;
    provider?: string;
    cachedAt: number;
}

const CACHE_DIR = path.join(process.cwd(), "data", "telemetry");
const CACHE_FILE = path.join(CACHE_DIR, "ip-geo-cache.json");

// In-memory cache
const memoryCache = new Map<string, GeoLocation>();
let isCacheLoaded = false;

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

/**
 * Standardize country naming across heterogeneous external APIs
 */
export function normalizeCountryName(country?: string, countryCode?: string): string {
    if (!country && !countryCode) return "Chưa xác định";

    let c = country ? country.trim() : "";
    if (countryCode && (!c || c.toLowerCase() === "unknown")) {
        try {
            c = regionNames.of(countryCode.toUpperCase()) || countryCode;
        } catch {
            c = countryCode;
        }
    }

    if (c.toLowerCase() === "viet nam") return "Vietnam";
    if (c.toLowerCase() === "usa") return "United States";
    if (c.toLowerCase() === "uk") return "United Kingdom";
    if (c.toLowerCase() === "korea, republic of") return "South Korea";
    if (c.toLowerCase() === "russian federation") return "Russia";

    return c || "Chưa xác định";
}

/**
 * Load persistent disk cache into memory
 */
function loadDiskCache() {
    if (isCacheLoaded) return;
    try {
        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true });
        }
        if (fs.existsSync(CACHE_FILE)) {
            const data = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
            if (Array.isArray(data)) {
                for (const item of data) {
                    if (item && item.ip) {
                        item.country = normalizeCountryName(item.country, item.countryCode);
                        memoryCache.set(item.ip, item);
                    }
                }
            }
        }
    } catch (err) {
        console.warn("⚠️ [GeoIP] Error loading persistent cache:", (err as Error).message);
    }
    isCacheLoaded = true;
}

/**
 * Persist in-memory cache to disk
 */
let saveDebounceTimer: NodeJS.Timeout | null = null;
function persistCacheDebounced() {
    if (saveDebounceTimer) return;
    saveDebounceTimer = setTimeout(() => {
        saveDebounceTimer = null;
        try {
            if (!fs.existsSync(CACHE_DIR)) {
                fs.mkdirSync(CACHE_DIR, { recursive: true });
            }
            const arr = Array.from(memoryCache.values());
            fs.writeFileSync(CACHE_FILE, JSON.stringify(arr, null, 2), "utf8");
        } catch (err) {
            console.warn("⚠️ [GeoIP] Error saving persistent cache:", (err as Error).message);
        }
    }, 2000);
}

function isPrivateIp(ip: string): boolean {
    if (!ip || ip === "unknown" || ip === "::1" || ip === "127.0.0.1") return true;
    if (ip.startsWith("10.") || ip.startsWith("192.168.")) return true;
    if (ip.startsWith("172.") && Number(ip.split(".")[1]) >= 16 && Number(ip.split(".")[1]) <= 31) return true;
    return false;
}

// ========================================================
// MULTI-PROVIDER CASCADING FALLBACK ENGINE (6 EXTERNAL APIS)
// ========================================================

/**
 * Provider 1: ipwho.is (HTTPS, Free 10k/mo, fast & reliable)
 */
async function fetchFromIpWhoIs(ip: string): Promise<GeoLocation | null> {
    try {
        const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.success) {
            return {
                ip,
                country: normalizeCountryName(data.country, data.country_code),
                countryCode: data.country_code || "",
                city: data.city || "",
                region: data.region || "",
                isp: data.connection?.isp || "",
                provider: "ipwho.is",
                cachedAt: Date.now(),
            };
        }
    } catch {
        // Fallback to next provider
    }
    return null;
}

/**
 * Provider 2: ip-api.com (Fast HTTP/JSON endpoint)
 */
async function fetchFromIpApi(ip: string): Promise<GeoLocation | null> {
    try {
        const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,regionName,city,isp`, {
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.status === "success") {
            return {
                ip,
                country: normalizeCountryName(data.country, data.countryCode),
                countryCode: data.countryCode || "",
                city: data.city || "",
                region: data.regionName || "",
                isp: data.isp || "",
                provider: "ip-api.com",
                cachedAt: Date.now(),
            };
        }
    } catch {
        // Fallback to next provider
    }
    return null;
}

/**
 * Provider 3: freeipapi.com (HTTPS, high rate limit)
 */
async function fetchFromFreeIpApi(ip: string): Promise<GeoLocation | null> {
    try {
        const res = await fetch(`https://freeipapi.com/api/json/${encodeURIComponent(ip)}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.countryName || data.countryCode) {
            return {
                ip,
                country: normalizeCountryName(data.countryName, data.countryCode),
                countryCode: data.countryCode || "",
                city: data.cityName || "",
                region: data.regionName || "",
                isp: data.asnOrganization || "",
                provider: "freeipapi.com",
                cachedAt: Date.now(),
            };
        }
    } catch {
        // Fallback to next provider
    }
    return null;
}

/**
 * Provider 4: ipapi.co (HTTPS fallback)
 */
async function fetchFromIpApiCo(ip: string): Promise<GeoLocation | null> {
    try {
        const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
            headers: { "User-Agent": "AnyTools-GeoService/1.0" },
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.country_name || data.country) {
            return {
                ip,
                country: normalizeCountryName(data.country_name || data.country, data.country_code),
                countryCode: data.country_code || "",
                city: data.city || "",
                region: data.region || "",
                isp: data.org || "",
                provider: "ipapi.co",
                cachedAt: Date.now(),
            };
        }
    } catch {
        // Fallback to next provider
    }
    return null;
}

/**
 * Provider 5: api.country.is (Ultra-fast lightweight HTTPS country lookup)
 */
async function fetchFromCountryIs(ip: string): Promise<GeoLocation | null> {
    try {
        const res = await fetch(`https://api.country.is/${encodeURIComponent(ip)}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(2500),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.country) {
            return {
                ip,
                country: normalizeCountryName(undefined, data.country),
                countryCode: data.country,
                city: "",
                region: "",
                provider: "api.country.is",
                cachedAt: Date.now(),
            };
        }
    } catch {
        // Fallback to next provider
    }
    return null;
}

/**
 * Provider 6: geoplugin.net (Global geo registry)
 */
async function fetchFromGeoPlugin(ip: string): Promise<GeoLocation | null> {
    try {
        const res = await fetch(`http://www.geoplugin.net/json.gp?ip=${encodeURIComponent(ip)}`, {
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.geoplugin_countryName || data.geoplugin_countryCode) {
            return {
                ip,
                country: normalizeCountryName(data.geoplugin_countryName, data.geoplugin_countryCode),
                countryCode: data.geoplugin_countryCode || "",
                city: data.geoplugin_city || "",
                region: data.geoplugin_region || "",
                provider: "geoplugin.net",
                cachedAt: Date.now(),
            };
        }
    } catch {
        // Fallback
    }
    return null;
}

/**
 * Resolve Single IP with 6 Cascading Fallback APIs & Disk Cache
 */
export async function resolveIpLocation(ip: string): Promise<GeoLocation> {
    loadDiskCache();

    if (!ip || isPrivateIp(ip)) {
        return {
            ip: ip || "127.0.0.1",
            country: "Localhost",
            city: "Internal",
            provider: "system",
            cachedAt: Date.now(),
        };
    }

    // Check memory / disk cache first (Zero network call, 0ms latency)
    if (memoryCache.has(ip)) {
        return memoryCache.get(ip)!;
    }

    // Provider 1: ipwho.is (Primary HTTPS)
    let geo = await fetchFromIpWhoIs(ip);

    // Provider 2: ip-api.com
    if (!geo) {
        geo = await fetchFromIpApi(ip);
    }

    // Provider 3: freeipapi.com
    if (!geo) {
        geo = await fetchFromFreeIpApi(ip);
    }

    // Provider 4: ipapi.co
    if (!geo) {
        geo = await fetchFromIpApiCo(ip);
    }

    // Provider 5: api.country.is
    if (!geo) {
        geo = await fetchFromCountryIs(ip);
    }

    // Provider 6: geoplugin.net
    if (!geo) {
        geo = await fetchFromGeoPlugin(ip);
    }

    // If all external APIs are temporarily unavailable, return clean unknown (no guessing)
    if (!geo) {
        geo = {
            ip,
            country: "Chưa xác định",
            city: "",
            provider: "external_unavailable",
            cachedAt: Date.now(),
        };
    }

    // Save to cache and schedule disk persist
    memoryCache.set(ip, geo);
    persistCacheDebounced();

    return geo;
}

/**
 * Batch Resolve multiple IPs with concurrency throttling
 */
export async function batchResolveIpLocations(ips: string[], concurrency: number = 8): Promise<Map<string, GeoLocation>> {
    loadDiskCache();
    const uniqueIps = Array.from(new Set(ips.filter(Boolean)));
    const resultMap = new Map<string, GeoLocation>();

    // 1. Separate cached vs uncached
    const uncachedIps: string[] = [];
    for (const ip of uniqueIps) {
        if (isPrivateIp(ip)) {
            resultMap.set(ip, { ip, country: "Localhost", city: "Internal", cachedAt: Date.now() });
        } else if (memoryCache.has(ip)) {
            resultMap.set(ip, memoryCache.get(ip)!);
        } else {
            uncachedIps.push(ip);
        }
    }

    // If all are already cached, return immediately
    if (uncachedIps.length === 0) {
        return resultMap;
    }

    // 2. Resolve uncached IPs with throttled concurrency pool
    let currentIndex = 0;
    const workerCount = Math.min(concurrency, uncachedIps.length);

    const workers = new Array(workerCount).fill(0).map(async () => {
        while (currentIndex < uncachedIps.length) {
            const ip = uncachedIps[currentIndex++];
            if (!ip) break;
            try {
                const geo = await resolveIpLocation(ip);
                resultMap.set(ip, geo);
                await new Promise((r) => setTimeout(r, 60));
            } catch {
                resultMap.set(ip, { ip, country: "Chưa xác định", cachedAt: Date.now() });
            }
        }
    });

    await Promise.all(workers);
    return resultMap;
}
