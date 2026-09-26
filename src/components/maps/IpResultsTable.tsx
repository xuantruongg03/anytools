"use client";

import React, { useState, useMemo } from "react";
import { BulkIpItem } from "@/app/api/bulk-ip-lookup/route";
import { getCountryFlag, getCountryName } from "@/lib/constants/isoCountries";
import { toast } from "@/components/ui/Toast";
import IpDetailModal from "./IpDetailModal";

interface IpResultsTableProps {
    results: BulkIpItem[];
    selectedCountry: string | null;
    onSelectCountry: (countryCode: string | null) => void;
    locale?: string;
    onViewDetail?: (item: BulkIpItem) => void;
}

export default function IpResultsTable({
    results,
    selectedCountry,
    onSelectCountry,
    locale = "vi",
    onViewDetail,
}: IpResultsTableProps) {
    const isVi = locale === "vi";

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "success" | "private" | "fail">("all");
    const [copiedIp, setCopiedIp] = useState<string | null>(null);
    const [selectedIpDetail, setSelectedIpDetail] = useState<BulkIpItem | null>(null);

    // Filter results
    const filteredResults = useMemo(() => {
        return results.filter((item) => {
            // Country filter from map/sidebar
            if (selectedCountry && item.countryCode?.toUpperCase() !== selectedCountry.toUpperCase()) {
                return false;
            }

            // Status filter
            if (statusFilter !== "all" && item.status !== statusFilter) {
                return false;
            }

            // Search query filter
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase().trim();
                const matchIp = item.query.toLowerCase().includes(term);
                const matchCountry = item.country?.toLowerCase().includes(term);
                const matchCity = item.city?.toLowerCase().includes(term);
                const matchIsp = item.isp?.toLowerCase().includes(term);
                const matchOrg = item.org?.toLowerCase().includes(term);
                const matchRegion = item.regionName?.toLowerCase().includes(term);
                if (!matchIp && !matchCountry && !matchCity && !matchIsp && !matchOrg && !matchRegion) {
                    return false;
                }
            }

            return true;
        });
    }, [results, selectedCountry, statusFilter, searchTerm]);

    const handleCopy = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIp(type);
            toast.success(isVi ? `Đã sao chép: ${text}` : `Copied: ${text}`);
            setTimeout(() => setCopiedIp(null), 2000);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Copy failed");
        }
    };

    const handleOpenDetail = (item: BulkIpItem) => {
        if (onViewDetail) {
            onViewDetail(item);
        } else {
            setSelectedIpDetail(item);
        }
    };

    // Cycle through filtered items in modal
    const selectedIndex = selectedIpDetail
        ? filteredResults.findIndex((r) => r.query === selectedIpDetail.query)
        : -1;

    const handlePrev = () => {
        if (selectedIndex > 0) {
            setSelectedIpDetail(filteredResults[selectedIndex - 1]);
        } else if (selectedIndex === 0 && filteredResults.length > 0) {
            setSelectedIpDetail(filteredResults[filteredResults.length - 1]);
        }
    };

    const handleNext = () => {
        if (selectedIndex >= 0 && selectedIndex < filteredResults.length - 1) {
            setSelectedIpDetail(filteredResults[selectedIndex + 1]);
        } else if (selectedIndex === filteredResults.length - 1 && filteredResults.length > 0) {
            setSelectedIpDetail(filteredResults[0]);
        }
    };

    const exportCsv = () => {
        if (!results.length) return;
        const headers = ["IP", "Type", "Status", "Country", "CountryCode", "Region", "City", "ISP", "Org", "Latitude", "Longitude", "Timezone"];
        const rows = results.map((r) => [
            `"${r.query}"`,
            `"${r.type || ""}"`,
            `"${r.status}"`,
            `"${r.country || ""}"`,
            `"${r.countryCode || ""}"`,
            `"${r.regionName || r.region || ""}"`,
            `"${r.city || ""}"`,
            `"${r.isp || ""}"`,
            `"${r.org || ""}"`,
            r.lat ?? "",
            r.lon ?? "",
            `"${r.timezone || ""}"`,
        ]);
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `anytools_ip_lookup_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(isVi ? "Đã xuất file CSV thành công!" : "CSV exported successfully!");
    };

    const exportJson = () => {
        if (!results.length) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", `anytools_ip_lookup_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(isVi ? "Đã xuất file JSON thành công!" : "JSON exported successfully!");
    };

    if (results.length === 0) return null;

    return (
        <div className='bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden'>
            {/* Action Bar: Search, Status Filter & Export */}
            <div className='p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-3'>
                {/* Search & Filters */}
                <div className='flex items-center gap-2 flex-1 flex-wrap'>
                    <div className='relative flex-1 min-w-[200px] max-w-sm'>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={isVi ? "Tìm theo IP, quốc gia, ISP, thành phố..." : "Search IP, country, ISP, city..."}
                            className='w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500'
                        />
                        <span className='absolute left-2.5 top-2.5 text-xs text-gray-400'>🔍</span>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className='absolute right-2.5 top-2.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Status Tabs */}
                    <div className='flex items-center bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg text-xs'>
                        {(["all", "success", "private", "fail"] as const).map((st) => (
                            <button
                                key={st}
                                onClick={() => setStatusFilter(st)}
                                className={`px-2.5 py-1 rounded-md transition-colors font-medium cursor-pointer ${
                                    statusFilter === st
                                        ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-2xs"
                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                                }`}
                            >
                                {st === "all" && (isVi ? "Tất cả" : "All")}
                                {st === "success" && (isVi ? "Thành công" : "Success")}
                                {st === "private" && (isVi ? "Nội bộ" : "Private")}
                                {st === "fail" && (isVi ? "Lỗi" : "Failed")}
                            </button>
                        ))}
                    </div>

                    {selectedCountry && (
                        <div className='flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-xs'>
                            <span>{getCountryFlag(selectedCountry)}</span>
                            <span>{getCountryName(selectedCountry, locale)}</span>
                            <button
                                onClick={() => onSelectCountry(null)}
                                className='hover:text-blue-900 dark:hover:text-white font-bold ml-1'
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>

                {/* Export Buttons */}
                <div className='flex items-center gap-2 shrink-0'>
                    <button
                        onClick={exportCsv}
                        className='px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-2xs flex items-center gap-1'
                        title={isVi ? "Xuất dữ liệu định dạng CSV" : "Export as CSV"}
                    >
                        <span>📊</span>
                        <span>CSV</span>
                    </button>
                    <button
                        onClick={exportJson}
                        className='px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-2xs flex items-center gap-1'
                        title={isVi ? "Xuất dữ liệu định dạng JSON" : "Export as JSON"}
                    >
                        <span>📋</span>
                        <span>JSON</span>
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className='overflow-x-auto max-h-[460px] overflow-y-auto'>
                <table className='w-full text-left text-xs'>
                    <thead className='bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 backdrop-blur-xs'>
                        <tr>
                            <th className='py-3 px-4'>IP Address</th>
                            <th className='py-3 px-4'>{isVi ? "Quốc gia" : "Country"}</th>
                            <th className='py-3 px-4'>{isVi ? "Thành phố / Vùng" : "City / Region"}</th>
                            <th className='py-3 px-4'>{isVi ? "Nhà mạng / ISP" : "ISP / Org"}</th>
                            <th className='py-3 px-4'>{isVi ? "Tọa độ" : "Coordinates"}</th>
                            <th className='py-3 px-4'>{isVi ? "Múi giờ" : "Timezone"}</th>
                            <th className='py-3 px-4 text-center'>{isVi ? "Trạng thái" : "Status"}</th>
                            <th className='py-3 px-4 text-center'>{isVi ? "Xem chi tiết" : "Action"}</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100 dark:divide-gray-800 font-mono'>
                        {filteredResults.length === 0 ? (
                            <tr>
                                <td colSpan={8} className='py-8 text-center text-gray-400 font-sans'>
                                    {isVi ? "Không có địa chỉ IP nào phù hợp với bộ lọc" : "No IP addresses matched the current filters"}
                                </td>
                            </tr>
                        ) : (
                            filteredResults.map((item, idx) => {
                                const flag = getCountryFlag(item.countryCode);
                                const countryName = item.countryCode
                                    ? getCountryName(item.countryCode, locale) || item.country
                                    : item.country || "—";
                                const isPrivate = item.status === "private";
                                const isFail = item.status === "fail";

                                return (
                                    <tr
                                        key={idx}
                                        className='hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors group cursor-pointer'
                                        onClick={() => handleOpenDetail(item)}
                                    >
                                        {/* IP Column with Copy */}
                                        <td className='py-2.5 px-4 font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap'>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    type='button'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenDetail(item);
                                                    }}
                                                    className='text-blue-600 dark:text-blue-400 hover:underline font-mono font-bold text-left'
                                                    title={isVi ? "Nhấp để xem chi tiết IP" : "Click to view IP details"}
                                                >
                                                    {item.query}
                                                </button>
                                                <button
                                                    type='button'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCopy(item.query, `ip-${idx}`);
                                                    }}
                                                    className='text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer p-0.5'
                                                    title={isVi ? "Sao chép IP" : "Copy IP"}
                                                >
                                                    {copiedIp === `ip-${idx}` ? "✓" : "📋"}
                                                </button>
                                                {item.type && (
                                                    <span className='text-[10px] px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-sans'>
                                                        {item.type}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Country */}
                                        <td className='py-2.5 px-4 font-sans whitespace-nowrap'>
                                            {isPrivate ? (
                                                <span className='text-amber-600 dark:text-amber-400 text-xs font-medium'>
                                                    🔒 Private Network
                                                </span>
                                            ) : isFail ? (
                                                <span className='text-gray-400'>—</span>
                                            ) : (
                                                <div className='flex items-center gap-1.5'>
                                                    <span className='text-base'>{flag}</span>
                                                    <span className='font-medium text-gray-900 dark:text-gray-200'>
                                                        {countryName}
                                                    </span>
                                                    {item.countryCode && (
                                                        <span className='text-[10px] text-gray-400 uppercase'>
                                                            ({item.countryCode})
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        {/* City & Region */}
                                        <td className='py-2.5 px-4 font-sans text-gray-700 dark:text-gray-300 max-w-[180px] truncate'>
                                            {item.city || item.regionName || item.region || "—"}
                                        </td>

                                        {/* ISP & Org */}
                                        <td className='py-2.5 px-4 font-sans text-gray-600 dark:text-gray-400 max-w-[200px] truncate' title={item.isp || item.org}>
                                            {item.isp || item.org || "—"}
                                        </td>

                                        {/* Coordinates with Google Maps link */}
                                        <td className='py-2.5 px-4 whitespace-nowrap' onClick={(e) => e.stopPropagation()}>
                                            {item.lat !== undefined && item.lon !== undefined ? (
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1'
                                                    title={isVi ? "Xem vị trí trên Google Maps" : "View on Google Maps"}
                                                >
                                                    <span>
                                                        {item.lat.toFixed(2)}, {item.lon.toFixed(2)}
                                                    </span>
                                                    <span className='text-[10px]'>↗</span>
                                                </a>
                                            ) : (
                                                <span className='text-gray-400'>—</span>
                                            )}
                                        </td>

                                        {/* Timezone */}
                                        <td className='py-2.5 px-4 text-gray-500 dark:text-gray-400 whitespace-nowrap'>
                                            {item.timezone || "—"}
                                        </td>

                                        {/* Status */}
                                        <td className='py-2.5 px-4 text-center font-sans whitespace-nowrap'>
                                            {item.status === "success" && (
                                                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'>
                                                    <span className='w-1.5 h-1.5 rounded-full bg-emerald-500'></span>
                                                    <span>OK</span>
                                                </span>
                                            )}
                                            {item.status === "private" && (
                                                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'>
                                                    <span className='w-1.5 h-1.5 rounded-full bg-amber-500'></span>
                                                    <span>LAN</span>
                                                </span>
                                            )}
                                            {item.status === "fail" && (
                                                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60' title={item.message}>
                                                    <span className='w-1.5 h-1.5 rounded-full bg-red-500'></span>
                                                    <span>{isVi ? "Lỗi" : "Error"}</span>
                                                </span>
                                            )}
                                        </td>

                                        {/* Action: View Detail Button */}
                                        <td className='py-2.5 px-4 text-center whitespace-nowrap font-sans' onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type='button'
                                                onClick={() => handleOpenDetail(item)}
                                                className='inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800/50 cursor-pointer shadow-2xs'
                                                title={isVi ? "Xem toàn bộ chi tiết địa chỉ IP này" : "View complete IP details"}
                                            >
                                                <span>👁️</span>
                                                <span>{isVi ? "Chi tiết" : "Details"}</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className='p-3 bg-gray-50/70 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <span>
                        {isVi ? "Hiển thị" : "Showing"}{" "}
                        <strong className='text-gray-900 dark:text-gray-100'>{filteredResults.length}</strong> / {results.length} IP
                    </span>
                    <span className='text-gray-400 hidden sm:inline'>•</span>
                    <span className='text-gray-400 text-[11px] hidden sm:inline'>
                        {isVi ? "Mẹo: Nhấp vào dòng hoặc nút Chi tiết để xem chi tiết đầy đủ của IP" : "Tip: Click any row or the Details button to view complete details"}
                    </span>
                </div>
                {filteredResults.length < results.length && (
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            onSelectCountry(null);
                        }}
                        className='text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                    >
                        {isVi ? "Xóa tất cả bộ lọc" : "Clear all filters"}
                    </button>
                )}
            </div>

            {/* IP Detail Modal Dialog */}
            {!onViewDetail && (
                <IpDetailModal
                    item={selectedIpDetail}
                    isOpen={!!selectedIpDetail}
                    onClose={() => setSelectedIpDetail(null)}
                    locale={locale}
                    currentIndex={selectedIndex >= 0 ? selectedIndex : undefined}
                    totalCount={filteredResults.length}
                    onPrev={filteredResults.length > 1 ? handlePrev : undefined}
                    onNext={filteredResults.length > 1 ? handleNext : undefined}
                />
            )}
        </div>
    );
}
