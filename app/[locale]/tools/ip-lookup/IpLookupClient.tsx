"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ipLookupTranslations } from "@/lib/i18n/tools/ip-lookup";
import Button from "@/components/ui/Button";

interface IpInfo {
    ip: string;
    type: "IPv4" | "IPv6";
    city?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    loc?: string;
    org?: string;
    postal?: string;
    timezone?: string;
    isp?: string;
    asn?: string;
}

interface WebRTCIp {
    local: string[];
    public: string[];
}

export default function IpLookupClient() {
    const { locale } = useLanguage();
    const t = ipLookupTranslations[locale].ipLookup.ui;

    const [loading, setLoading] = useState(true);
    const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
    const [webRtcIps, setWebRtcIps] = useState<WebRTCIp>({ local: [], public: [] });
    const [ipv4, setIpv4] = useState<string>("");
    const [ipv6, setIpv6] = useState<string>("");
    const [copied, setCopied] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch public IP using multiple services
    const fetchPublicIp = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Try ipinfo.io first (provides most info)
            const response = await fetch("https://ipinfo.io/json");
            if (response.ok) {
                const data = await response.json();
                const isIPv6 = data.ip?.includes(":");
                setIpInfo({
                    ip: data.ip,
                    type: isIPv6 ? "IPv6" : "IPv4",
                    city: data.city,
                    region: data.region,
                    country: data.country,
                    countryCode: data.country,
                    loc: data.loc,
                    org: data.org,
                    postal: data.postal,
                    timezone: data.timezone,
                    isp: data.org?.split(" ").slice(1).join(" ") || data.org,
                    asn: data.org?.split(" ")[0],
                });

                if (isIPv6) {
                    setIpv6(data.ip);
                } else {
                    setIpv4(data.ip);
                }
            }
        } catch (err) {
            console.error("ipinfo.io error:", err);
        }

        // Try to get IPv4 specifically
        try {
            const ipv4Response = await fetch("https://api.ipify.org?format=json");
            if (ipv4Response.ok) {
                const data = await ipv4Response.json();
                setIpv4(data.ip);
            }
        } catch (err) {
            console.error("ipify error:", err);
        }

        // Try to get IPv6 specifically
        try {
            const ipv6Response = await fetch("https://api64.ipify.org?format=json");
            if (ipv6Response.ok) {
                const data = await ipv6Response.json();
                if (data.ip?.includes(":")) {
                    setIpv6(data.ip);
                }
            }
        } catch (err) {
            console.error("ipify v6 error:", err);
        }

        setLoading(false);
    }, []);

    // Get local IPs using WebRTC
    const getWebRTCIps = useCallback(async () => {
        const ips: WebRTCIp = { local: [], public: [] };

        try {
            const pc = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            });

            pc.createDataChannel("");

            pc.onicecandidate = (event) => {
                if (!event.candidate) return;

                const candidate = event.candidate.candidate;
                const ipMatch = candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}|([a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/i);

                if (ipMatch) {
                    const ip = ipMatch[0];
                    // Check if it's a private IP
                    const isPrivate = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|::1|fe80:)/i.test(ip);

                    if (isPrivate) {
                        if (!ips.local.includes(ip)) {
                            ips.local.push(ip);
                            setWebRtcIps((prev) => ({
                                ...prev,
                                local: [...new Set([...prev.local, ip])],
                            }));
                        }
                    } else {
                        if (!ips.public.includes(ip)) {
                            ips.public.push(ip);
                            setWebRtcIps((prev) => ({
                                ...prev,
                                public: [...new Set([...prev.public, ip])],
                            }));
                        }
                    }
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Wait for ICE gathering to complete
            await new Promise<void>((resolve) => {
                if (pc.iceGatheringState === "complete") {
                    resolve();
                } else {
                    pc.onicegatheringstatechange = () => {
                        if (pc.iceGatheringState === "complete") {
                            resolve();
                        }
                    };
                    // Timeout after 3 seconds
                    setTimeout(resolve, 3000);
                }
            });

            pc.close();
        } catch (err) {
            console.error("WebRTC error:", err);
        }
    }, []);

    useEffect(() => {
        fetchPublicIp();
        getWebRTCIps();
    }, [fetchPublicIp, getWebRTCIps]);

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    const refreshAll = () => {
        setWebRtcIps({ local: [], public: [] });
        fetchPublicIp();
        getWebRTCIps();
    };

    const getCountryFlag = (countryCode: string) => {
        if (!countryCode || countryCode.length !== 2) return "";
        const codePoints = countryCode
            .toUpperCase()
            .split("")
            .map((char) => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    // Get country name from country code
    const getCountryName = (countryCode: string) => {
        if (!countryCode) return "";
        try {
            const regionNames = new Intl.DisplayNames([locale], { type: "region" });
            return regionNames.of(countryCode.toUpperCase()) || countryCode;
        } catch {
            return countryCode;
        }
    };

    return (
        <div className='space-y-6'>
            {/* Main IP Display */}
            <div className='bg-linear-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white'>
                <div className='text-center'>
                    <p className='text-blue-100 mb-2'>{t.yourPublicIp}</p>
                    {loading ? (
                        <div className='flex items-center justify-center gap-2'>
                            <div className='animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full'></div>
                            <span>{t.detecting}</span>
                        </div>
                    ) : (
                        <>
                            <h2 className='text-3xl md:text-4xl font-mono font-bold break-all'>{ipInfo?.ip || "Unable to detect"}</h2>
                            {ipInfo?.type && <span className='inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm'>{ipInfo.type}</span>}
                        </>
                    )}
                </div>
                <div className='flex justify-center mt-4 gap-2'>
                    <Button variant='secondary' size='sm' onClick={() => ipInfo?.ip && copyToClipboard(ipInfo.ip, "main")} disabled={!ipInfo?.ip}>
                        {copied === "main" ? t.copied : t.copy}
                    </Button>
                    <Button variant='secondary' size='sm' onClick={refreshAll}>
                        🔄 {t.refresh}
                    </Button>
                </div>
            </div>

            {/* IP Versions */}
            <div className='grid md:grid-cols-2 gap-4'>
                {/* IPv4 */}
                <div className='bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>IPv4 {t.address}</h3>
                        <span className='px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded'>IPv4</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <code className='flex-1 font-mono text-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded break-all'>{ipv4 || t.notDetected}</code>
                        <button className='px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed' onClick={() => copyToClipboard(ipv4, "ipv4")} disabled={!ipv4}>
                            {copied === "ipv4" ? "✓" : "📋"}
                        </button>
                    </div>
                </div>

                {/* IPv6 */}
                <div className='bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between mb-3'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>IPv6 {t.address}</h3>
                        <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded'>IPv6</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <code className='flex-1 font-mono text-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded break-all'>{ipv6 || t.notDetected}</code>
                        <button className='px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed' onClick={() => copyToClipboard(ipv6, "ipv6")} disabled={!ipv6}>
                            {copied === "ipv6" ? "✓" : "📋"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Local IPs from WebRTC */}
            <div className='bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>🌐 {t.localIps}</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-3'>{t.localIpsDesc}</p>
                <div className='space-y-2'>
                    {webRtcIps.local.length > 0 ? (
                        webRtcIps.local.map((ip, idx) => (
                            <div key={idx} className='flex items-center gap-2'>
                                <code className='flex-1 font-mono bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded text-sm'>{ip}</code>
                                <button className='px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors' onClick={() => copyToClipboard(ip, `local-${idx}`)}>
                                    {copied === `local-${idx}` ? "✓" : "📋"}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className='text-gray-500 dark:text-gray-400 text-sm italic'>{loading ? t.detecting : t.noLocalIps}</p>
                    )}
                </div>
            </div>

            {/* Geolocation Info */}
            {ipInfo && (
                <div className='bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>📍 {t.geolocation}</h3>
                    <div className='grid md:grid-cols-2 gap-4'>
                        <InfoRow icon='🌍' label={t.country} value={ipInfo.countryCode ? `${getCountryFlag(ipInfo.countryCode)} ${getCountryName(ipInfo.countryCode)}` : undefined} />
                        <InfoRow icon='🏙️' label={t.city} value={ipInfo.city} />
                        <InfoRow icon='📍' label={t.region} value={ipInfo.region} />
                        <InfoRow icon='📮' label={t.postalCode} value={ipInfo.postal} />
                        <InfoRow icon='🕐' label={t.timezone} value={ipInfo.timezone} />
                        <InfoRow icon='📌' label={t.coordinates} value={ipInfo.loc} />
                        <InfoRow icon='🏢' label={t.isp} value={ipInfo.isp} />
                        <InfoRow icon='🔢' label={t.asn} value={ipInfo.asn} />
                    </div>
                </div>
            )}

            {/* Additional Info */}
            <div className='bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-5 border border-yellow-200 dark:border-yellow-800'>
                <h3 className='text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2'>⚠️ {t.privacyNote}</h3>
                <p className='text-yellow-700 dark:text-yellow-300 text-sm'>{t.privacyNoteDesc}</p>
            </div>

            {error && (
                <div className='bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800'>
                    <p className='text-red-600 dark:text-red-400'>{error}</p>
                </div>
            )}
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value?: string }) {
    if (!value) return null;
    return (
        <div className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
            <span className='text-xl'>{icon}</span>
            <div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>{label}</p>
                <p className='font-medium text-gray-900 dark:text-gray-100'>{value}</p>
            </div>
        </div>
    );
}
