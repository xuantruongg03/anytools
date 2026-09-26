"use client";

import React, { useEffect, useState } from "react";
import { BulkIpItem } from "@/app/api/bulk-ip-lookup/route";
import { getCountryFlag, getCountryName } from "@/lib/constants/isoCountries";
import { toast } from "@/components/ui/Toast";

interface IpDetailModalProps {
    item: BulkIpItem | null;
    isOpen: boolean;
    onClose: () => void;
    locale?: string;
    onPrev?: () => void;
    onNext?: () => void;
    currentIndex?: number;
    totalCount?: number;
}

export default function IpDetailModal({
    item,
    isOpen,
    onClose,
    locale = "vi",
    onPrev,
    onNext,
    currentIndex,
    totalCount,
}: IpDetailModalProps) {
    const isVi = locale === "vi";
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [showJson, setShowJson] = useState(false);

    // Keyboard navigation: Escape to close, ArrowLeft / ArrowRight to cycle
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowLeft" && onPrev) {
                onPrev();
            } else if (e.key === "ArrowRight" && onNext) {
                onNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, onPrev, onNext]);

    if (!isOpen || !item) return null;

    const flag = getCountryFlag(item.countryCode);
    const countryName = item.countryCode
        ? getCountryName(item.countryCode, locale) || item.country
        : item.country || (isVi ? "Không xác định" : "Unknown");

    const isPrivate = item.status === "private";
    const isFail = item.status === "fail";
    const isSuccess = item.status === "success";

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(label);
            toast.success(isVi ? `Đã sao chép ${label}!` : `Copied ${label}!`);
            setTimeout(() => setCopiedField(null), 1800);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Copy failed");
        }
    };

    const copyFullSummary = () => {
        const lines = [
            `IP: ${item.query} (${item.type || "IPv4"})`,
            `Status: ${item.status}`,
            item.country ? `Country: ${countryName} (${item.countryCode || ""})` : null,
            item.city ? `City: ${item.city}` : null,
            item.regionName || item.region ? `Region: ${item.regionName || item.region}` : null,
            item.zip ? `ZIP/Postal: ${item.zip}` : null,
            item.isp ? `ISP: ${item.isp}` : null,
            item.org ? `Organization: ${item.org}` : null,
            item.as ? `ASN: ${item.as}` : null,
            item.lat !== undefined && item.lon !== undefined ? `Coordinates: ${item.lat}, ${item.lon}` : null,
            item.timezone ? `Timezone: ${item.timezone}` : null,
        ].filter(Boolean);

        copyToClipboard(lines.join("\n"), isVi ? "toàn bộ thông tin IP" : "IP summary");
    };

    // Calculate local time string from timezone if available
    let localTimeFormatted = "—";
    if (item.timezone) {
        try {
            localTimeFormatted = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
                timeZone: item.timezone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            }).format(new Date());
        } catch {
            localTimeFormatted = item.timezone;
        }
    }

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn'
            onClick={onClose}
            role='dialog'
            aria-modal='true'
            aria-labelledby='ip-detail-modal-title'
        >
            <div
                className='relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh] animate-scaleIn'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Bar */}
                <div className='relative px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-transparent dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-transparent shrink-0'>
                    <div className='flex items-start justify-between gap-3'>
                        <div className='flex items-center gap-3'>
                            <span className='text-3xl sm:text-4xl select-none'>{flag}</span>
                            <div>
                                <div className='flex items-center gap-2 flex-wrap'>
                                    <h3
                                        id='ip-detail-modal-title'
                                        className='text-lg sm:text-2xl font-bold font-mono text-gray-900 dark:text-white tracking-tight'
                                    >
                                        {item.query}
                                    </h3>

                                    {/* Copy IP button */}
                                    <button
                                        type='button'
                                        onClick={() => copyToClipboard(item.query, "IP")}
                                        className='inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer shadow-2xs'
                                        title={isVi ? "Sao chép IP" : "Copy IP"}
                                    >
                                        <span>{copiedField === "IP" ? "✓" : "📋"}</span>
                                        <span className='font-sans'>{copiedField === "IP" ? (isVi ? "Đã chép" : "Copied") : (isVi ? "Sao chép" : "Copy")}</span>
                                    </button>
                                </div>

                                <div className='flex items-center gap-2 mt-1.5 flex-wrap'>
                                    {/* Protocol badge */}
                                    <span className='text-[11px] font-mono px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium'>
                                        {item.type || "IPv4"}
                                    </span>

                                    {/* Status Badge */}
                                    {isSuccess && (
                                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'>
                                            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse'></span>
                                            <span>{isVi ? "Định vị thành công" : "Located Successfully"}</span>
                                        </span>
                                    )}
                                    {isPrivate && (
                                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'>
                                            <span>🔒</span>
                                            <span>{isVi ? "IP Mạng Nội Bộ" : "Private Subnet / LAN"}</span>
                                        </span>
                                    )}
                                    {isFail && (
                                        <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60'>
                                            <span>⚠️</span>
                                            <span>{isVi ? "Lỗi tra cứu" : "Lookup Failed"}</span>
                                        </span>
                                    )}

                                    {/* Data Provider badge */}
                                    {item.provider && (
                                        <span className='text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40'>
                                            {isVi ? "Nguồn:" : "Src:"} {item.provider}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            type='button'
                            onClick={onClose}
                            className='p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer'
                            aria-label='Close modal'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Scrollable Body */}
                <div className='p-5 space-y-4 overflow-y-auto max-h-[calc(92vh-150px)] text-sm'>
                    {/* Failure or Warning Message */}
                    {item.message && (
                        <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${isFail ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800" : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"}`}>
                            <span className='text-base shrink-0'>ℹ️</span>
                            <span>{item.message}</span>
                        </div>
                    )}

                    {/* Section 1: Geographic Information */}
                    <div className='bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800'>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5'>
                            <span>📍</span>
                            <span>{isVi ? "Thông tin vị trí địa lý" : "Geographic Location"}</span>
                        </h4>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs'>
                            <div>
                                <span className='text-gray-500 dark:text-gray-400 block mb-0.5'>
                                    {isVi ? "Quốc gia" : "Country"}:
                                </span>
                                <span className='font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                                    <span>{flag}</span>
                                    <span>{countryName}</span>
                                    {item.countryCode && (
                                        <span className='text-gray-400 uppercase text-[10px]'>({item.countryCode})</span>
                                    )}
                                </span>
                            </div>

                            <div>
                                <span className='text-gray-500 dark:text-gray-400 block mb-0.5'>
                                    {isVi ? "Thành phố / Tỉnh" : "City / Region"}:
                                </span>
                                <span className='font-semibold text-gray-900 dark:text-gray-100'>
                                    {item.city || item.regionName || item.region || "—"}
                                </span>
                            </div>

                            <div>
                                <span className='text-gray-500 dark:text-gray-400 block mb-0.5'>
                                    {isVi ? "Bang / Vùng lãnh thổ" : "State / Region"}:
                                </span>
                                <span className='font-medium text-gray-800 dark:text-gray-200'>
                                    {item.regionName ? `${item.regionName} (${item.region || ""})` : item.region || "—"}
                                </span>
                            </div>

                            <div>
                                <span className='text-gray-500 dark:text-gray-400 block mb-0.5'>
                                    {isVi ? "Mã bưu chính (ZIP)" : "Postal / ZIP Code"}:
                                </span>
                                <span className='font-mono font-medium text-gray-800 dark:text-gray-200'>
                                    {item.zip || "—"}
                                </span>
                            </div>

                            <div>
                                <span className='text-gray-500 dark:text-gray-400 block mb-0.5'>
                                    {isVi ? "Tọa độ địa lý (Lat, Lon)" : "Coordinates"}:
                                </span>
                                {item.lat !== undefined && item.lon !== undefined ? (
                                    <div className='flex items-center gap-1.5'>
                                        <span className='font-mono text-blue-600 dark:text-blue-400 font-medium'>
                                            {item.lat.toFixed(4)}, {item.lon.toFixed(4)}
                                        </span>
                                        <button
                                            type='button'
                                            onClick={() => copyToClipboard(`${item.lat}, ${item.lon}`, "tọa độ")}
                                            className='text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-xs p-0.5'
                                            title={isVi ? "Sao chép tọa độ" : "Copy coordinates"}
                                        >
                                            📋
                                        </button>
                                    </div>
                                ) : (
                                    <span className='text-gray-400'>—</span>
                                )}
                            </div>

                            <div>
                                <span className='text-gray-500 dark:text-gray-400 block mb-0.5'>
                                    {isVi ? "Múi giờ & Giờ địa phương" : "Timezone & Local Time"}:
                                </span>
                                <span className='font-medium text-gray-800 dark:text-gray-200 block'>
                                    {item.timezone || "—"}
                                </span>
                                {item.timezone && (
                                    <span className='text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5'>
                                        🕒 {localTimeFormatted}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Network & ISP Information */}
                    <div className='bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800'>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5'>
                            <span>🌐</span>
                            <span>{isVi ? "Hạ tầng mạng & Nhà cung cấp" : "Network & Provider"}</span>
                        </h4>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs'>
                            <div>
                                <span className='text-gray-500 dark:text-gray-400 block mb-0.5'>
                                    {isVi ? "Nhà cung cấp dịch vụ (ISP)" : "Internet Service Provider"}:
                                </span>
                                <span className='font-semibold text-gray-900 dark:text-gray-100 break-words'>
                                    {item.isp || "—"}
                                </span>
                            </div>

                            <div>
                                <span className='text-gray-500 dark:text-gray-400 block mb-0.5'>
                                    {isVi ? "Tổ chức sở hữu (Organization)" : "Organization"}:
                                </span>
                                <span className='font-semibold text-gray-900 dark:text-gray-100 break-words'>
                                    {item.org || "—"}
                                </span>
                            </div>

                            <div className='sm:col-span-2'>
                                <span className='text-gray-500 dark:text-gray-400 block mb-0.5'>
                                    {isVi ? "Hệ thống tự trị (ASN / AS Number)" : "Autonomous System (ASN)"}:
                                </span>
                                <span className='font-mono font-medium text-gray-800 dark:text-gray-200 break-words'>
                                    {item.as || "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Quick Investigation & Map Links */}
                    <div className='bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800'>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5'>
                            <span>🔗</span>
                            <span>{isVi ? "Liên kết tra cứu chuyên sâu & Bản đồ" : "Quick Map & Lookup Tools"}</span>
                        </h4>

                        <div className='flex items-center gap-2 flex-wrap text-xs'>
                            {item.lat !== undefined && item.lon !== undefined && (
                                <>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800/50 font-medium'
                                    >
                                        <span>🗺️</span>
                                        <span>Google Maps</span>
                                        <span className='text-[10px]'>↗</span>
                                    </a>

                                    <a
                                        href={`https://www.openstreetmap.org/?mlat=${item.lat}&mlon=${item.lon}#map=12/${item.lat}/${item.lon}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors border border-emerald-200 dark:border-emerald-800/50 font-medium'
                                    >
                                        <span>🌍</span>
                                        <span>OpenStreetMap</span>
                                        <span className='text-[10px]'>↗</span>
                                    </a>
                                </>
                            )}

                            {!isPrivate && (
                                <>
                                    <a
                                        href={`https://whois.domaintools.com/${encodeURIComponent(item.query)}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium'
                                    >
                                        <span>🔍</span>
                                        <span>WHOIS</span>
                                        <span className='text-[10px]'>↗</span>
                                    </a>

                                    <a
                                        href={`https://ipinfo.io/${encodeURIComponent(item.query)}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium'
                                    >
                                        <span>ℹ️</span>
                                        <span>IPInfo</span>
                                        <span className='text-[10px]'>↗</span>
                                    </a>

                                    <a
                                        href={`https://www.virustotal.com/gui/ip-address/${encodeURIComponent(item.query)}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors border border-purple-200 dark:border-purple-800/50 font-medium'
                                    >
                                        <span>🛡️</span>
                                        <span>VirusTotal</span>
                                        <span className='text-[10px]'>↗</span>
                                    </a>

                                    <a
                                        href={`https://www.shodan.io/host/${encodeURIComponent(item.query)}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors border border-red-200 dark:border-red-800/50 font-medium'
                                    >
                                        <span>⚡</span>
                                        <span>Shodan</span>
                                        <span className='text-[10px]'>↗</span>
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Section 4: Raw JSON Accordion */}
                    <div className='border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden'>
                        <button
                            type='button'
                            onClick={() => setShowJson(!showJson)}
                            className='w-full px-4 py-2.5 bg-gray-50/60 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer'
                        >
                            <span className='flex items-center gap-2'>
                                <span>{showJson ? "▼" : "▶"}</span>
                                <span>{isVi ? "Dữ liệu JSON gốc (Raw Data)" : "Raw JSON Data"}</span>
                            </span>
                            <span className='text-gray-400 font-mono text-[11px]'>{showJson ? (isVi ? "Ẩn" : "Hide") : (isVi ? "Xem" : "View")}</span>
                        </button>

                        {showJson && (
                            <div className='p-3 bg-gray-950 text-gray-100 font-mono text-xs overflow-x-auto relative'>
                                <button
                                    type='button'
                                    onClick={() => copyToClipboard(JSON.stringify(item, null, 2), "JSON")}
                                    className='absolute top-2 right-2 px-2 py-1 text-[11px] rounded bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors cursor-pointer flex items-center gap-1'
                                >
                                    <span>{copiedField === "JSON" ? "✓" : "📋"}</span>
                                    <span>{copiedField === "JSON" ? (isVi ? "Đã sao chép" : "Copied") : (isVi ? "Sao chép JSON" : "Copy JSON")}</span>
                                </button>
                                <pre className='pt-6'>{JSON.stringify(item, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer with Cycle Buttons & Actions */}
                <div className='px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 flex items-center justify-between gap-3 shrink-0 flex-wrap'>
                    {/* Previous / Next navigation */}
                    <div className='flex items-center gap-2 text-xs'>
                        {onPrev && (
                            <button
                                type='button'
                                onClick={onPrev}
                                className='px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer font-medium'
                                title={isVi ? "Phím mũi tên trái ←" : "Left arrow key ←"}
                            >
                                ← {isVi ? "Trước" : "Prev"}
                            </button>
                        )}

                        {currentIndex !== undefined && totalCount !== undefined && (
                            <span className='text-gray-500 dark:text-gray-400 font-mono text-xs px-1'>
                                {currentIndex + 1} / {totalCount}
                            </span>
                        )}

                        {onNext && (
                            <button
                                type='button'
                                onClick={onNext}
                                className='px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer font-medium'
                                title={isVi ? "Phím mũi tên phải →" : "Right arrow key →"}
                            >
                                {isVi ? "Tiếp" : "Next"} →
                            </button>
                        )}
                    </div>

                    {/* Right action buttons */}
                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            onClick={copyFullSummary}
                            className='px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs'
                        >
                            <span>📋</span>
                            <span>{isVi ? "Sao chép tóm tắt" : "Copy Summary"}</span>
                        </button>

                        <button
                            type='button'
                            onClick={onClose}
                            className='px-4 py-1.5 text-xs font-semibold rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-white transition-colors cursor-pointer'
                        >
                            {isVi ? "Đóng" : "Close"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
