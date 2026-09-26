"use client";

import React, { useMemo, useState } from "react";
import { getCountryFlag, getCountryName } from "@/lib/constants/isoCountries";
import { BulkIpItem } from "@/app/api/bulk-ip-lookup/route";

interface CountryDistributionListProps {
    ipResults: BulkIpItem[];
    selectedCountry: string | null;
    onSelectCountry: (countryCode: string | null) => void;
    locale?: string;
}

export default function CountryDistributionList({
    ipResults,
    selectedCountry,
    onSelectCountry,
    locale = "vi",
}: CountryDistributionListProps) {
    const isVi = locale === "vi";
    const [search, setSearch] = useState("");

    // Aggregate counts by country
    const { countryList, totalValidIps, maxCount } = useMemo(() => {
        const counts: Record<string, { count: number; name: string; code: string }> = {};
        let valid = 0;

        for (const item of ipResults) {
            if (item.status === "success" && item.countryCode) {
                valid++;
                const code = item.countryCode.toUpperCase();
                if (!counts[code]) {
                    counts[code] = {
                        count: 0,
                        code,
                        name: getCountryName(code, locale) || item.country || code,
                    };
                }
                counts[code].count++;
            }
        }

        const list = Object.values(counts).sort((a, b) => b.count - a.count);
        const max = list.length > 0 ? list[0].count : 1;

        return { countryList: list, totalValidIps: valid, maxCount: max };
    }, [ipResults, locale]);

    // Filter by search query
    const filteredList = useMemo(() => {
        if (!search.trim()) return countryList;
        const q = search.toLowerCase().trim();
        return countryList.filter(
            (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
        );
    }, [countryList, search]);

    return (
        <div className='flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden'>
            {/* Header: Title and Search */}
            <div className='p-4 border-b border-gray-100 dark:border-gray-800'>
                <div className='flex items-center justify-between mb-2'>
                    <h3 className='font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5'>
                        <span>🌐</span>
                        <span>{isVi ? "Thống Kê Theo Quốc Gia" : "Countries Breakdown"}</span>
                    </h3>
                    <span className='text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'>
                        {countryList.length} {isVi ? "quốc gia" : "countries"}
                    </span>
                </div>

                {countryList.length > 6 && (
                    <input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={isVi ? "Tìm quốc gia..." : "Search country..."}
                        className='w-full text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500'
                    />
                )}
            </div>

            {/* Column Headers (Google Analytics Style) */}
            <div className='flex items-center justify-between px-4 py-2 bg-gray-50/70 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                <span>{isVi ? "QUỐC GIA" : "COUNTRY"}</span>
                <span>{isVi ? "SỐ LƯỢNG IP" : "IP COUNT"}</span>
            </div>

            {/* Country List */}
            <div className='flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60 max-h-[420px]'>
                {filteredList.length === 0 ? (
                    <div className='p-6 text-center text-xs text-gray-400'>
                        {ipResults.length === 0
                            ? isVi
                                ? "Chưa có dữ liệu tra cứu"
                                : "No IP data yet"
                            : isVi
                            ? "Không tìm thấy quốc gia phù hợp"
                            : "No matching countries"}
                    </div>
                ) : (
                    filteredList.map((c) => {
                        const isSelected = selectedCountry === c.code;
                        const flag = getCountryFlag(c.code);
                        const percent = totalValidIps > 0 ? (c.count / totalValidIps) * 100 : 0;
                        const barWidthPercent = Math.max((c.count / maxCount) * 100, 4);

                        return (
                            <div
                                key={c.code}
                                onClick={() => onSelectCountry(isSelected ? null : c.code)}
                                className={`group px-4 py-2.5 transition-colors cursor-pointer relative ${
                                    isSelected
                                        ? "bg-blue-50 dark:bg-blue-900/30"
                                        : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                                }`}
                            >
                                <div className='flex items-center justify-between mb-1.5'>
                                    {/* Country Flag & Name */}
                                    <div className='flex items-center gap-2 min-w-0 pr-2'>
                                        <span className='text-base shrink-0'>{flag}</span>
                                        <span
                                            className={`text-xs truncate font-medium ${
                                                isSelected
                                                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                                                    : "text-gray-900 dark:text-gray-200"
                                            }`}
                                        >
                                            {c.name}
                                        </span>
                                    </div>

                                    {/* Metrics: Count & % */}
                                    <div className='flex items-center gap-3 shrink-0 text-right'>
                                        <span className='font-mono font-bold text-xs text-gray-900 dark:text-gray-100'>
                                            {c.count}
                                        </span>
                                        <span className='text-[11px] font-mono text-emerald-600 dark:text-emerald-400 w-12 text-right'>
                                            ↑ {percent.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Visual Progress Bar (GA4 Style) */}
                                <div className='w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden'>
                                    <div
                                        className={`h-full transition-all duration-300 rounded-full ${
                                            isSelected
                                                ? "bg-blue-600 dark:bg-blue-400"
                                                : "bg-blue-500/70 group-hover:bg-blue-600"
                                        }`}
                                        style={{ width: `${barWidthPercent}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer Summary */}
            {countryList.length > 0 && (
                <div className='p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between'>
                    <span>
                        {isVi ? "Tổng số IP định vị:" : "Total mapped IPs:"}
                    </span>
                    <span className='font-mono font-bold text-blue-600 dark:text-blue-400'>
                        {totalValidIps}
                    </span>
                </div>
            )}
        </div>
    );
}
