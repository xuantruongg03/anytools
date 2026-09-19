"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

type UuidVersion = "v4" | "v7" | "v1";

// Cryptographically secure UUID v4
function generateUUIDv4(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// RFC 9562 Time-Sortable UUID v7
function generateUUIDv7(): string {
    const now = Date.now();
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // 48-bit unix timestamp in milliseconds
    bytes[0] = Math.floor(now / 0x10000000000) & 0xff;
    bytes[1] = Math.floor(now / 0x100000000) & 0xff;
    bytes[2] = Math.floor(now / 0x1000000) & 0xff;
    bytes[3] = Math.floor(now / 0x10000) & 0xff;
    bytes[4] = Math.floor(now / 0x100) & 0xff;
    bytes[5] = now & 0xff;

    // Version 7: 0111xxxx
    bytes[6] = (bytes[6] & 0x0f) | 0x70;
    // Variant 1: 10xxxxxx
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// UUID v1 (MAC + Timestamp)
function generateUUIDv1(): string {
    const now = new Date().getTime();
    const timestamp = now * 10000 + 122192928000000000;

    const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, "0");
    const timeMid = ((timestamp / 0x100000000) & 0xffff).toString(16).padStart(4, "0");
    const timeHi = (((timestamp / 0x1000000000000) & 0x0fff) | 0x1000).toString(16).padStart(4, "0");

    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const clockSeq = (((bytes[0] << 8) | bytes[1]) & 0x3fff | 0x8000).toString(16).padStart(4, "0");
    const node = Array.from(bytes.slice(2), (b) => b.toString(16).padStart(2, "0")).join("");

    return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`;
}

export default function UuidGeneratorClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const [version, setVersion] = useState<UuidVersion>("v4");
    const [quantity, setQuantity] = useState<number>(5);
    const [singleUuid, setSingleUuid] = useState<string>("");
    const [bulkList, setBulkList] = useState<string[]>([]);

    // Formatting Options
    const [uppercase, setUppercase] = useState<boolean>(false);
    const [includeHyphens, setIncludeHyphens] = useState<boolean>(true);
    const [includeBraces, setIncludeBraces] = useState<boolean>(false);
    const [includeQuotes, setIncludeQuotes] = useState<boolean>(false);

    // Apply formatting to a raw UUID string
    const formatUuid = useCallback(
        (raw: string): string => {
            let res = raw;
            if (!includeHyphens) {
                res = res.replace(/-/g, "");
            }
            if (uppercase) {
                res = res.toUpperCase();
            } else {
                res = res.toLowerCase();
            }
            if (includeBraces) {
                res = `{${res}}`;
            }
            if (includeQuotes) {
                res = `"${res}"`;
            }
            return res;
        },
        [includeHyphens, uppercase, includeBraces, includeQuotes]
    );

    // Generate Single UUID
    const handleGenerateSingle = useCallback(() => {
        let raw = "";
        if (version === "v7") raw = generateUUIDv7();
        else if (version === "v1") raw = generateUUIDv1();
        else raw = generateUUIDv4();

        setSingleUuid(raw);
    }, [version]);

    // Generate Bulk UUIDs
    const handleGenerateBulk = useCallback(() => {
        const count = Math.min(1000, Math.max(1, quantity));
        const list: string[] = [];
        for (let i = 0; i < count; i++) {
            if (version === "v7") list.push(generateUUIDv7());
            else if (version === "v1") list.push(generateUUIDv1());
            else list.push(generateUUIDv4());
        }
        setBulkList(list);
    }, [quantity, version]);

    // Initial generation on mount
    useEffect(() => {
        handleGenerateSingle();
        handleGenerateBulk();
    }, [handleGenerateSingle, handleGenerateBulk]);

    const formattedSingle = singleUuid ? formatUuid(singleUuid) : "";
    const formattedBulk = bulkList.map((id) => formatUuid(id));

    // Copy single UUID
    const handleCopySingle = async () => {
        if (!formattedSingle) return;
        try {
            await navigator.clipboard.writeText(formattedSingle);
            toast.success(isVi ? "Đã sao chép UUID vào clipboard!" : "Copied UUID to clipboard!");
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    // Copy bulk UUIDs
    const handleCopyBulk = async () => {
        if (formattedBulk.length === 0) return;
        try {
            await navigator.clipboard.writeText(formattedBulk.join("\n"));
            toast.success(isVi ? `Đã sao chép ${formattedBulk.length} UUID!` : `Copied ${formattedBulk.length} UUIDs!`);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    // Download formatted list
    const handleDownload = (type: "txt" | "json" | "csv") => {
        if (formattedBulk.length === 0) return;
        let content = "";
        let mime = "text/plain";
        let ext = type;

        if (type === "txt") {
            content = formattedBulk.join("\n");
        } else if (type === "json") {
            content = JSON.stringify(formattedBulk, null, 2);
            mime = "application/json";
        } else if (type === "csv") {
            content = "uuid\n" + formattedBulk.join("\n");
            mime = "text/csv";
        }

        const blob = new Blob([content], { type: `${mime};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `uuids_${version}_${Date.now()}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(isVi ? `Đã tải xuống tệp .${ext}!` : `Downloaded .${ext} file!`);
    };

    return (
        <div className='max-w-4xl mx-auto space-y-6'>
            {/* Top Config Card */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-5'>
                {/* Version Selector */}
                <div className='flex flex-wrap items-center justify-between gap-4'>
                    <div className='space-y-1'>
                        <span className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                            {isVi ? "Phiên Bản UUID" : "UUID Standard Version"}
                        </span>
                        <div className='flex flex-wrap gap-2'>
                            {[
                                { id: "v4", name: "UUID v4", badge: isVi ? "Khuyên dùng (Ngẫu nhiên)" : "Recommended (Random)", desc: "Web Crypto CSPRNG" },
                                { id: "v7", name: "UUID v7", badge: isVi ? "Mới: Sắp xếp theo giờ" : "New: Time-sortable", desc: "Unix timestamp + Random" },
                                { id: "v1", name: "UUID v1", badge: isVi ? "Thời gian truyền thống" : "Traditional Time", desc: "Timestamp + Node ID" },
                            ].map((v) => (
                                <button
                                    key={v.id}
                                    type='button'
                                    onClick={() => setVersion(v.id as UuidVersion)}
                                    className={`px-3.5 py-2 rounded-xl text-left transition-all border cursor-pointer ${
                                        version === v.id
                                            ? "border-blue-500 bg-blue-50/70 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 shadow-sm"
                                            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                                    }`}
                                >
                                    <div className='flex items-center gap-2'>
                                        <span className='font-bold text-xs'>{v.name}</span>
                                        <span className='text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'>
                                            {v.badge}
                                        </span>
                                    </div>
                                    <div className='text-[11px] text-gray-500 dark:text-gray-400 mt-0.5'>{v.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Format Customization Options */}
                <div className='pt-4 border-t border-gray-100 dark:border-gray-700/60'>
                    <span className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2.5'>
                        {isVi ? "Tùy Biến Định Dạng (Formatting):" : "Output Formatting Options:"}
                    </span>
                    <div className='flex flex-wrap gap-4 text-xs font-medium text-gray-700 dark:text-gray-300'>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={includeHyphens}
                                onChange={(e) => setIncludeHyphens(e.target.checked)}
                                className='rounded text-blue-600 focus:ring-blue-500'
                            />
                            <span>{isVi ? "Dấu gạch ngang (-)" : "Hyphens (-)"}</span>
                        </label>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={uppercase}
                                onChange={(e) => setUppercase(e.target.checked)}
                                className='rounded text-blue-600 focus:ring-blue-500'
                            />
                            <span>{isVi ? "Chữ in hoa (UPPERCASE)" : "UPPERCASE"}</span>
                        </label>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={includeBraces}
                                onChange={(e) => setIncludeBraces(e.target.checked)}
                                className='rounded text-blue-600 focus:ring-blue-500'
                            />
                            <span>{isVi ? "Dấu ngoặc nhọn { ... }" : "Braces { ... }"}</span>
                        </label>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={includeQuotes}
                                onChange={(e) => setIncludeQuotes(e.target.checked)}
                                className='rounded text-blue-600 focus:ring-blue-500'
                            />
                            <span>{isVi ? 'Dấu ngoặc kép " ... "' : 'Quotes " ... "'}</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Single UUID Generator Card */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                        <span>🆔</span>
                        <span>{isVi ? `Tạo 1 UUID ${version.toUpperCase()}` : `Single ${version.toUpperCase()} UUID`}</span>
                    </h2>
                    <Button onClick={handleGenerateSingle} variant='primary' size='sm'>
                        🔄 {isVi ? "Tạo mã mới" : "Generate New"}
                    </Button>
                </div>

                <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
                    <div className='flex-1 p-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 select-all break-all'>
                        {formattedSingle}
                    </div>
                    <Button onClick={handleCopySingle} variant='secondary' size='md'>
                        📋 {isVi ? "Sao chép" : "Copy"}
                    </Button>
                </div>
            </div>

            {/* Bulk Generation Card */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <h2 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                        <span>📦</span>
                        <span>{isVi ? "Tạo Hàng Loạt (Lên đến 1.000 UUID)" : "Bulk Generation (Up to 1,000)"}</span>
                    </h2>

                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-gray-500'>{isVi ? "Số lượng:" : "Quantity:"}</span>
                        {[5, 10, 50, 100, 500].map((q) => (
                            <button
                                key={q}
                                type='button'
                                onClick={() => setQuantity(q)}
                                className={`px-2 py-0.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                                    quantity === q
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                                }`}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='flex gap-3'>
                    <input
                        type='number'
                        min={1}
                        max={1000}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
                        className='w-28 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono text-center focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                    <Button onClick={handleGenerateBulk} variant='primary' size='md'>
                        ⚡ {isVi ? `Sinh ${quantity} UUID` : `Generate ${quantity} UUIDs`}
                    </Button>
                </div>

                {formattedBulk.length > 0 && (
                    <div className='space-y-3 pt-2'>
                        <div className='flex flex-wrap items-center justify-between gap-2'>
                            <span className='text-xs text-gray-500 font-mono'>
                                {isVi ? `Đã tạo ${formattedBulk.length} UUID` : `Generated ${formattedBulk.length} UUIDs`}
                            </span>
                            <div className='flex flex-wrap gap-2'>
                                <Button onClick={handleCopyBulk} variant='secondary' size='sm'>
                                    📋 {isVi ? "Sao chép tất cả" : "Copy All"}
                                </Button>
                                <Button onClick={() => handleDownload("txt")} variant='secondary' size='sm'>
                                    📄 .TXT
                                </Button>
                                <Button onClick={() => handleDownload("json")} variant='secondary' size='sm'>
                                    📋 .JSON
                                </Button>
                                <Button onClick={() => handleDownload("csv")} variant='secondary' size='sm'>
                                    📊 .CSV
                                </Button>
                            </div>
                        </div>

                        <textarea
                            value={formattedBulk.join("\n")}
                            readOnly
                            rows={10}
                            className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs focus:outline-none resize-y leading-relaxed select-all'
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
