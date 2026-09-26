import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/utils/api-wrapper";

export interface BulkIpItem {
    query: string;
    status: "success" | "fail" | "private";
    type: "IPv4" | "IPv6";
    country?: string;
    countryCode?: string;
    region?: string;
    regionName?: string;
    city?: string;
    zip?: string;
    lat?: number;
    lon?: number;
    timezone?: string;
    isp?: string;
    org?: string;
    as?: string;
    message?: string;
    provider?: "ip-api" | "ipwho.is" | "freeipapi" | "system";
}

const IPV4_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const IPV6_REGEX = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

function isPrivateIp(ip: string): boolean {
    if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") return true;
    if (ip.toLowerCase().startsWith("fe80:") || ip.toLowerCase().startsWith("fc00:") || ip.toLowerCase().startsWith("fd00:")) return true;

    const parts = ip.split(".").map(Number);
    if (parts.length !== 4) return false;

    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 10.0.0.0/8 (Private network)
    if (parts[0] === 10) return true;
    // 172.16.0.0/12 (Private network)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16 (Private network)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0/16 (Link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 0.0.0.0
    if (parts[0] === 0) return true;

    return false;
}

/**
 * Concurrency runner for processing fallback requests in parallel with throttled workers
 */
async function mapConcurrent<T, R>(
    items: T[],
    concurrency: number,
    fn: (item: T) => Promise<R>
): Promise<R[]> {
    if (!items.length) return [];
    const results: R[] = new Array(items.length);
    let index = 0;
    const workerCount = Math.min(concurrency, items.length);

    const workers = new Array(workerCount).fill(0).map(async () => {
        while (index < items.length) {
            const curIdx = index++;
            try {
                results[curIdx] = await fn(items[curIdx]);
            } catch {
                // Return fallback handled inside fn
            }
        }
    });

    await Promise.all(workers);
    return results;
}

/**
 * Fallback Provider 1: ipwho.is (Free, HTTPS, 10k req/mo, fast & rich data)
 */
async function fetchFromIpWhoIs(ip: string): Promise<BulkIpItem | null> {
    try {
        const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.success) {
            return {
                query: ip,
                status: "fail",
                type: ip.includes(":") ? "IPv6" : "IPv4",
                message: data.message || "Không thể tìm thấy thông tin IP",
                provider: "ipwho.is",
            };
        }
        return {
            query: ip,
            status: "success",
            type: (data.type as "IPv4" | "IPv6") || (ip.includes(":") ? "IPv6" : "IPv4"),
            country: data.country,
            countryCode: data.country_code,
            region: data.region_code || data.region,
            regionName: data.region,
            city: data.city,
            zip: data.postal,
            lat: typeof data.latitude === "number" ? data.latitude : undefined,
            lon: typeof data.longitude === "number" ? data.longitude : undefined,
            timezone: data.timezone?.id,
            isp: data.connection?.isp,
            org: data.connection?.org,
            as: data.connection?.asn ? `AS${data.connection.asn} ${data.connection.org || ""}`.trim() : undefined,
            provider: "ipwho.is",
        };
    } catch {
        return null;
    }
}

/**
 * Fallback Provider 2: freeipapi.com (Free, HTTPS, high availability)
 */
async function fetchFromFreeIpApi(ip: string): Promise<BulkIpItem | null> {
    try {
        const res = await fetch(`https://freeipapi.com/api/json/${encodeURIComponent(ip)}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(4000),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (!data.countryCode && !data.cityName) {
            return null;
        }
        return {
            query: ip,
            status: "success",
            type: data.ipVersion === 6 || ip.includes(":") ? "IPv6" : "IPv4",
            country: data.countryName,
            countryCode: data.countryCode,
            region: data.regionCode || data.regionName,
            regionName: data.regionName,
            city: data.cityName,
            zip: data.zipCode || undefined,
            lat: typeof data.latitude === "number" ? data.latitude : undefined,
            lon: typeof data.longitude === "number" ? data.longitude : undefined,
            timezone:
                Array.isArray(data.timeZones) && data.timeZones.length > 0
                    ? data.timeZones[0]
                    : typeof data.timeZone === "string"
                    ? data.timeZone
                    : undefined,
            isp: data.asnOrganization || undefined,
            org: data.asnOrganization || undefined,
            as: data.asn ? `AS${data.asn} ${data.asnOrganization || ""}`.trim() : undefined,
            provider: "freeipapi",
        };
    } catch {
        return null;
    }
}

/**
 * Cascade fallback resolution for individual IPs
 */
async function fetchIpWithFallbacks(ip: string): Promise<BulkIpItem> {
    // 1. Try ipwho.is
    const fromWhois = await fetchFromIpWhoIs(ip);
    if (fromWhois && fromWhois.status === "success") {
        return fromWhois;
    }

    // 2. Try freeipapi.com
    const fromFreeIp = await fetchFromFreeIpApi(ip);
    if (fromFreeIp && fromFreeIp.status === "success") {
        return fromFreeIp;
    }

    // Return the initial failure message if available or fallback
    return (
        fromWhois || {
            query: ip,
            status: "fail",
            type: ip.includes(":") ? "IPv6" : "IPv4",
            message: "Không tìm thấy thông tin vị trí từ các dịch vụ định vị dự phòng",
            provider: "system",
        }
    );
}

async function handleBulkIpLookup(request: NextRequest) {
    if (request.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await request.json();
    const rawIps = Array.isArray(body?.ips) ? body.ips : [];

    if (!rawIps.length) {
        return NextResponse.json({ error: "Vui lòng cung cấp danh sách địa chỉ IP" }, { status: 400 });
    }

    // Strict sanitation and cap to exactly 100 IPs
    const cleanIps: string[] = [];
    const seen = new Set<string>();

    for (const item of rawIps) {
        if (typeof item !== "string") continue;
        const trimmed = item.trim();
        if (!trimmed || seen.has(trimmed)) continue;
        seen.add(trimmed);
        cleanIps.push(trimmed);
        if (cleanIps.length >= 100) break;
    }

    const results: BulkIpItem[] = [];
    const publicIpsToLookup: string[] = [];

    // Separate valid/invalid/private IPs
    for (const ip of cleanIps) {
        const isV4 = IPV4_REGEX.test(ip);
        const isV6 = IPV6_REGEX.test(ip);

        if (!isV4 && !isV6) {
            results.push({
                query: ip,
                status: "fail",
                type: "IPv4",
                message: "Định dạng địa chỉ IP không hợp lệ",
                provider: "system",
            });
            continue;
        }

        if (isPrivateIp(ip)) {
            results.push({
                query: ip,
                status: "private",
                type: isV6 ? "IPv6" : "IPv4",
                country: "Private Network",
                countryCode: "PRIVATE",
                city: "Localhost / LAN",
                regionName: "Private Subnet",
                message: "IP mạng nội bộ / Private Network (Không có dữ liệu vị trí công cộng)",
                provider: "system",
            });
            continue;
        }

        publicIpsToLookup.push(ip);
    }

    // Lookup public IPs using ip-api.com batch (Primary)
    if (publicIpsToLookup.length > 0) {
        let isBatchSuccess = false;

        try {
            const batchPayload = publicIpsToLookup.map((ip) => ({
                query: ip,
                fields: "status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query",
            }));

            const response = await fetch("http://ip-api.com/batch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(batchPayload),
                signal: AbortSignal.timeout(6000),
            });

            if (response.ok) {
                const batchResults = await response.json();
                if (Array.isArray(batchResults) && batchResults.length > 0) {
                    isBatchSuccess = true;
                    const failedIps: string[] = [];

                    for (let i = 0; i < batchResults.length; i++) {
                        const item = batchResults[i];
                        const ip = publicIpsToLookup[i] || item.query;

                        if (item && item.status === "success") {
                            results.push({
                                query: item.query || ip,
                                status: "success",
                                type: (item.query || ip).includes(":") ? "IPv6" : "IPv4",
                                country: item.country,
                                countryCode: item.countryCode,
                                region: item.region,
                                regionName: item.regionName,
                                city: item.city,
                                zip: item.zip,
                                lat: item.lat,
                                lon: item.lon,
                                timezone: item.timezone,
                                isp: item.isp,
                                org: item.org,
                                as: item.as,
                                provider: "ip-api",
                            });
                        } else {
                            failedIps.push(ip);
                        }
                    }

                    // For any individual IP that failed inside the batch, call fallback providers
                    if (failedIps.length > 0) {
                        const fallbackResults = await mapConcurrent(failedIps, 6, fetchIpWithFallbacks);
                        fallbackResults.forEach((res) => {
                            if (res) results.push(res);
                        });
                    }
                }
            }
        } catch (fetchErr) {
            console.warn("ip-api.com batch request failed, switching to backup providers:", fetchErr);
            isBatchSuccess = false;
        }

        // If ip-api.com/batch completely failed (HTTP 429 rate limit, 500 error, or timeout)
        if (!isBatchSuccess) {
            const fallbackResults = await mapConcurrent(publicIpsToLookup, 6, fetchIpWithFallbacks);
            fallbackResults.forEach((res) => {
                if (res) results.push(res);
            });
        }
    }

    // Preserve original input order as closely as possible
    const resultMap = new Map<string, BulkIpItem>();
    results.forEach((r) => resultMap.set(r.query, r));
    const sortedResults = cleanIps.map(
        (ip) =>
            resultMap.get(ip) || {
                query: ip,
                status: "fail",
                type: "IPv4",
                message: "Không thể xác định vị trí",
                provider: "system",
            }
    );

    return NextResponse.json({
        total: sortedResults.length,
        results: sortedResults,
        cappedTo100: rawIps.length > 100,
    });
}

export const POST = withErrorHandler(handleBulkIpLookup, "/api/bulk-ip-lookup");
