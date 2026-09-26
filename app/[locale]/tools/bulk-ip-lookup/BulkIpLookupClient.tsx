"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import WorldChoroplethMap from "@/components/maps/WorldChoroplethMap";
import CountryDistributionList from "@/components/maps/CountryDistributionList";
import IpResultsTable from "@/components/maps/IpResultsTable";
import IpDetailModal from "@/components/maps/IpDetailModal";
import { BulkIpItem } from "@/app/api/bulk-ip-lookup/route";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

const MAX_IPS_LIMIT = 100;

const SAMPLE_IPS = [
    // Philippines
    "112.198.64.1",
    "119.92.1.1",
    // Singapore
    "103.28.248.1",
    "175.45.148.1",
    // China
    "202.108.22.5",
    "114.114.114.114",
    // India
    "103.27.232.1",
    "49.36.0.1",
    // Vietnam
    "113.160.224.1",
    "14.225.254.1",
    "123.30.50.1",
    // Indonesia
    "103.10.60.1",
    "180.252.1.1",
    // United States
    "8.8.8.8",
    "4.4.4.4",
    // Australia
    "1.1.1.1",
    "139.130.4.5",
    // Japan
    "133.242.0.1",
    // Germany
    "194.25.0.1",
    // United Kingdom
    "195.12.0.1",
];

const IP_EXTRACT_REGEX = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|(?:[0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|::1|fe80:[0-9a-fA-F:]+/g;

export default function BulkIpLookupClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const [ipInput, setIpInput] = useState<string>(SAMPLE_IPS.slice(0, 10).join("\n"));
    const [results, setResults] = useState<BulkIpItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [detectingMyIp, setDetectingMyIp] = useState<boolean>(false);
    const [modalIp, setModalIp] = useState<BulkIpItem | null>(null);

    // Extract unique IPs count preview (supports IPv4 & IPv6)
    const parsedIps = useMemo(() => {
        const matches = ipInput.match(IP_EXTRACT_REGEX) || [];
        return Array.from(new Set(matches.map((ip) => ip.trim())));
    }, [ipInput]);

    const isOverLimit = parsedIps.length > MAX_IPS_LIMIT;

    // Perform bulk lookup strictly capped to MAX_IPS_LIMIT (100 IPs)
    const handleLookup = useCallback(async (ipsToQuery?: string[]) => {
        const rawTargetIps = ipsToQuery || parsedIps;

        if (rawTargetIps.length === 0) {
            toast.warning(isVi ? "Vui lòng nhập ít nhất một địa chỉ IP hợp lệ!" : "Please enter at least one valid IP address!");
            return;
        }

        // Cap to exactly 100 IPs
        const targetIps = rawTargetIps.slice(0, MAX_IPS_LIMIT);

        if (rawTargetIps.length > MAX_IPS_LIMIT) {
            toast.info(
                isVi
                    ? `Hệ thống tự động tra cứu 100 IP đầu tiên (từ ${rawTargetIps.length} IP đã nhập).`
                    : `Querying first 100 IPs according to batch limit (out of ${rawTargetIps.length} entered).`
            );
        }

        setLoading(true);
        setSelectedCountry(null);

        try {
            const response = await fetch("/api/bulk-ip-lookup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ips: targetIps }),
            });

            if (!response.ok) {
                throw new Error("Không thể hoàn tất yêu cầu tra cứu");
            }

            const data = await response.json();
            const items: BulkIpItem[] = data.results || [];
            setResults(items);

            const successCount = items.filter((i) => i.status === "success").length;
            toast.success(
                isVi
                    ? `Đã tra cứu thành công ${successCount}/${items.length} địa chỉ IP!`
                    : `Successfully looked up ${successCount}/${items.length} IP addresses!`
            );
        } catch {
            toast.error(
                isVi
                    ? "Đã xảy ra lỗi khi tra cứu địa chỉ IP. Vui lòng thử lại!"
                    : "Failed to lookup IP addresses. Please try again!"
            );
        } finally {
            setLoading(false);
        }
    }, [parsedIps, isVi]);

    // Initial lookup on mount with sample IPs
    useEffect(() => {
        handleLookup(SAMPLE_IPS.slice(0, 10));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Load rich sample IPs
    const loadSampleIps = () => {
        setIpInput(SAMPLE_IPS.join("\n"));
        handleLookup(SAMPLE_IPS);
    };

    // Trim input to top 100 IPs
    const handleTrimTo100 = () => {
        const top100 = parsedIps.slice(0, MAX_IPS_LIMIT);
        setIpInput(top100.join("\n"));
        toast.success(
            isVi
                ? `Đã cắt gọn danh sách về đúng 100 IP đầu tiên!`
                : `Trimmed list to exactly 100 IPs!`
        );
    };

    // Extract IPs from arbitrary text
    const handleExtractIps = () => {
        const matches = ipInput.match(IP_EXTRACT_REGEX);
        if (!matches || matches.length === 0) {
            toast.info(isVi ? "Không tìm thấy địa chỉ IP hợp lệ nào trong văn bản" : "No valid IP addresses found in the text");
            return;
        }
        const unique = Array.from(new Set(matches));
        setIpInput(unique.join("\n"));
        toast.success(isVi ? `Đã trích xuất ${unique.length} địa chỉ IP duy nhất!` : `Extracted ${unique.length} unique IPs!`);
    };

    // Add user's own current IP
    const handleAddMyIp = async () => {
        setDetectingMyIp(true);
        try {
            const res = await fetch("https://api.ipify.org?format=json");
            if (res.ok) {
                const data = await res.json();
                if (data.ip) {
                    setIpInput((prev) => {
                        const list = prev.trim() ? prev.trim().split("\n") : [];
                        if (!list.includes(data.ip)) {
                            list.unshift(data.ip);
                        }
                        return list.join("\n");
                    });
                    toast.success(isVi ? `Đã thêm IP của bạn: ${data.ip}` : `Added your IP: ${data.ip}`);
                }
            }
        } catch {
            toast.error(isVi ? "Không thể phát hiện IP hiện tại" : "Failed to detect current IP");
        } finally {
            setDetectingMyIp(false);
        }
    };

    // Metric summaries
    const metrics = useMemo(() => {
        const total = results.length;
        const success = results.filter((r) => r.status === "success").length;
        const uniqueCountries = new Set(results.filter((r) => r.countryCode).map((r) => r.countryCode)).size;
        const uniqueCities = new Set(results.filter((r) => r.city).map((r) => r.city)).size;
        return { total, success, uniqueCountries, uniqueCities };
    }, [results]);

    // Modal navigation through current results
    const modalIndex = modalIp ? results.findIndex((r) => r.query === modalIp.query) : -1;
    const handleModalPrev = () => {
        if (modalIndex > 0) {
            setModalIp(results[modalIndex - 1]);
        } else if (modalIndex === 0 && results.length > 0) {
            setModalIp(results[results.length - 1]);
        }
    };
    const handleModalNext = () => {
        if (modalIndex >= 0 && modalIndex < results.length - 1) {
            setModalIp(results[modalIndex + 1]);
        } else if (modalIndex === results.length - 1 && results.length > 0) {
            setModalIp(results[0]);
        }
    };

    return (
        <div className='space-y-6'>
            {/* 1. IP Input & Batch Action Card */}
            <div className='bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-xs'>
                <div className='flex items-center justify-between gap-2 mb-3 flex-wrap'>
                    <div className='flex items-center gap-2'>
                        <span className='text-lg'>📝</span>
                        <h2 className='font-bold text-gray-900 dark:text-gray-100 text-base'>
                            {isVi ? "Nhập danh sách địa chỉ IP" : "Input IP Addresses"}
                        </h2>
                        <span className='text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800'>
                            {isVi ? "Tối đa 100 IP" : "Max 100 IPs"}
                        </span>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className='flex items-center gap-1.5 flex-wrap'>
                        <button
                            type='button'
                            onClick={loadSampleIps}
                            className='inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer border border-blue-200 dark:border-blue-800/60'
                            title={isVi ? "Tải danh sách IP mẫu toàn cầu" : "Load global sample IPs"}
                        >
                            <span>🎲</span>
                            <span>{isVi ? "IP Mẫu" : "Sample IPs"}</span>
                        </button>

                        <button
                            type='button'
                            onClick={handleExtractIps}
                            className='inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer'
                            title={isVi ? "Tự động trích xuất IP từ văn bản hoặc file log" : "Extract IPs from log or raw text"}
                        >
                            <span>🔍</span>
                            <span>{isVi ? "Trích xuất IP" : "Extract IPs"}</span>
                        </button>

                        <button
                            type='button'
                            onClick={handleAddMyIp}
                            disabled={detectingMyIp}
                            className='inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50'
                            title={isVi ? "Thêm địa chỉ IP của bạn vào danh sách" : "Add your public IP to the list"}
                        >
                            <span>📍</span>
                            <span>{detectingMyIp ? (isVi ? "Đang lấy..." : "Detecting...") : (isVi ? "IP của tôi" : "My IP")}</span>
                        </button>

                        <button
                            type='button'
                            onClick={() => setIpInput("")}
                            className='inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer'
                            title={isVi ? "Xóa danh sách" : "Clear input"}
                        >
                            <span>🗑️</span>
                            <span>{isVi ? "Xóa" : "Clear"}</span>
                        </button>
                    </div>
                </div>

                {/* Textarea */}
                <div className='relative mb-2'>
                    <textarea
                        value={ipInput}
                        onChange={(e) => setIpInput(e.target.value)}
                        rows={4}
                        placeholder={
                            isVi
                                ? "Dán danh sách IP vào đây (tối đa 100 IP, mỗi dòng một IP, hoặc phân cách bằng dấu phẩy, dấu cách). Hỗ trợ cả IPv4, IPv6..."
                                : "Paste IP addresses here (max 100 IPs, one per line, comma or space separated). Supports IPv4, IPv6..."
                        }
                        className='w-full font-mono text-xs sm:text-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all resize-y'
                    />
                </div>

                {/* Overlimit Warning Banner */}
                {isOverLimit && (
                    <div className='p-3 mb-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between gap-3 flex-wrap'>
                        <div className='flex items-center gap-2'>
                            <span className='text-base'>⚠️</span>
                            <span>
                                {isVi
                                    ? `Đã phát hiện ${parsedIps.length} IP (vượt mức tối đa 100 IP/lượt). Hệ thống sẽ tự động tra cứu 100 IP đầu tiên.`
                                    : `Detected ${parsedIps.length} IPs (exceeds max 100 IPs/batch). The first 100 IPs will be looked up.`}
                            </span>
                        </div>
                        <button
                            type='button'
                            onClick={handleTrimTo100}
                            className='px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors cursor-pointer text-xs shrink-0 shadow-2xs'
                        >
                            {isVi ? "Cắt lấy đúng 100 IP" : "Trim to 100 IPs"}
                        </button>
                    </div>
                )}

                {/* Submit & Counter */}
                <div className='flex items-center justify-between gap-3 flex-wrap'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap'>
                        <span className={`inline-block w-2 h-2 rounded-full ${isOverLimit ? "bg-amber-500" : "bg-blue-500"}`}></span>
                        <span>
                            {isVi ? "Đã phát hiện:" : "Detected:"}{" "}
                            <strong className='text-gray-900 dark:text-gray-100 font-mono'>
                                {isOverLimit ? 100 : parsedIps.length}
                            </strong>
                            {isOverLimit && (
                                <span className='text-amber-600 dark:text-amber-400 font-medium'>
                                    {" "}
                                    (từ {parsedIps.length} IP)
                                </span>
                            )}{" "}
                            {isVi ? "địa chỉ IP hợp lệ" : "valid IP addresses"}
                        </span>
                        <span className='text-gray-400 font-sans'>
                            • {isVi ? "Giới hạn 100 IP / lần gửi" : "Max 100 IPs per batch"}
                        </span>
                    </div>

                    <Button
                        variant='primary'
                        size='md'
                        onClick={() => handleLookup()}
                        disabled={loading || parsedIps.length === 0}
                        className='px-6 shadow-sm font-semibold flex items-center gap-2'
                    >
                        {loading ? (
                            <>
                                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                <span>{isVi ? "Đang định vị..." : "Locating..."}</span>
                            </>
                        ) : (
                            <>
                                <span>🚀</span>
                                <span>{isVi ? "Tra cứu vị trí hàng loạt" : "Lookup Bulk IPs"}</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* 2. Visual Analytics Header & Quick Metric Cards */}
            {results.length > 0 && (
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                    <div className='p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs'>
                        <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mb-1'>
                            {isVi ? "Tổng số IP tra cứu" : "Total IPs"}
                        </p>
                        <p className='text-2xl font-bold font-mono text-gray-900 dark:text-white'>
                            {metrics.total}
                        </p>
                    </div>

                    <div className='p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs'>
                        <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mb-1'>
                            {isVi ? "Định vị thành công" : "Successful"}
                        </p>
                        <p className='text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400'>
                            {metrics.success}
                        </p>
                    </div>

                    <div className='p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs'>
                        <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mb-1'>
                            {isVi ? "Quốc gia phân bố" : "Countries"}
                        </p>
                        <p className='text-2xl font-bold font-mono text-blue-600 dark:text-blue-400'>
                            {metrics.uniqueCountries}
                        </p>
                    </div>

                    <div className='p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xs'>
                        <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mb-1'>
                            {isVi ? "Thành phố / Khu vực" : "Cities / Regions"}
                        </p>
                        <p className='text-2xl font-bold font-mono text-purple-600 dark:text-purple-400'>
                            {metrics.uniqueCities}
                        </p>
                    </div>
                </div>
            )}

            {/* 3. GA4-Style Geographic Map & Country Ranking Panel */}
            <div className='space-y-2'>
                <div className='flex items-center justify-between gap-2 px-1'>
                    <div>
                        <h2 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>🗺️</span>
                            <span>
                                {isVi
                                    ? "Số địa chỉ IP đang hoạt động theo Mã quốc gia"
                                    : "Active IP addresses by Country code"}
                            </span>
                        </h2>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {isVi
                                ? "Di chuột vào quốc gia hoặc nhấp vào điểm ghim IP trên bản đồ để xem chi tiết đầy đủ."
                                : "Hover over countries or click IP pins on map to view complete details."}
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-4'>
                    {/* World Map */}
                    <div className='lg:col-span-8 flex flex-col'>
                        <WorldChoroplethMap
                            ipResults={results}
                            selectedCountry={selectedCountry}
                            onSelectCountry={setSelectedCountry}
                            locale={locale}
                            onSelectIp={(ip) => setModalIp(ip)}
                        />
                    </div>

                    {/* Country List Ranking Panel */}
                    <div className='lg:col-span-4 flex flex-col'>
                        <CountryDistributionList
                            ipResults={results}
                            selectedCountry={selectedCountry}
                            onSelectCountry={setSelectedCountry}
                            locale={locale}
                        />
                    </div>
                </div>
            </div>

            {/* 4. Detailed IP Table with Search, Status Tabs & Export */}
            <div className='space-y-2'>
                <h2 className='text-base font-bold text-gray-900 dark:text-white px-1 flex items-center gap-2'>
                    <span>📋</span>
                    <span>{isVi ? "Bảng chi tiết địa chỉ IP" : "Detailed IP Address Data"}</span>
                </h2>
                <IpResultsTable
                    results={results}
                    selectedCountry={selectedCountry}
                    onSelectCountry={setSelectedCountry}
                    locale={locale}
                    onViewDetail={(ip) => setModalIp(ip)}
                />
            </div>

            {/* Global Modal View for IP Details (Accessible from Map Pins or Table) */}
            <IpDetailModal
                item={modalIp}
                isOpen={!!modalIp}
                onClose={() => setModalIp(null)}
                locale={locale}
                currentIndex={modalIndex >= 0 ? modalIndex : undefined}
                totalCount={results.length}
                onPrev={results.length > 1 ? handleModalPrev : undefined}
                onNext={results.length > 1 ? handleModalNext : undefined}
            />
        </div>
    );
}
