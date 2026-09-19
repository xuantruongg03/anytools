"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Safe Base64URL decode with full UTF-8 Unicode support
function base64UrlDecode(str: string): string {
    try {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
            base64 += "=";
        }
        const binary = atob(base64);
        const bytes = Uint8Array.from(binary, (m) => m.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    } catch {
        throw new Error("Invalid Base64 string");
    }
}

const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ilh1YW4gVHJ1b25nIiwiZW1haWwiOiJ1c2VyQGFueXRvb2xzLm9ubGluZSIsImFkbWluIjp0cnVlLCJpYXQiOjE3MTYwMDAwMDAsImV4cCI6MTc5MDAwMDAwMH0.dyt0MmD5mOU1VqHKR8m8-U4eR_J5p8v3i2w_SampleSig`;

export default function JwtDecoderClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const [jwt, setJwt] = useState(SAMPLE_JWT);
    const [header, setHeader] = useState("");
    const [payload, setPayload] = useState("");
    const [parsedPayload, setParsedPayload] = useState<any>(null);
    const [signature, setSignature] = useState("");
    const [error, setError] = useState("");

    // Split JWT parts for color coding
    const parts = useMemo(() => {
        const p = jwt.trim().split(".");
        return {
            header: p[0] || "",
            payload: p[1] || "",
            signature: p[2] || "",
            validLength: p.length === 3,
        };
    }, [jwt]);

    // Decode token logic
    const decodeJWT = useCallback(
        (showToast = true) => {
            const trimmed = jwt.trim();
            if (!trimmed) {
                setError(isVi ? "Vui lòng nhập mã JWT token" : "Please enter a JWT token");
                setHeader("");
                setPayload("");
                setParsedPayload(null);
                setSignature("");
                return;
            }

            const segments = trimmed.split(".");
            if (segments.length !== 3) {
                const msg = isVi
                    ? "Định dạng JWT không hợp lệ (JWT phải bao gồm đúng 3 phần ngăn cách bởi dấu chấm .)"
                    : "Invalid JWT format (must consist of exactly 3 parts separated by dots .)";
                setError(msg);
                setHeader("");
                setPayload("");
                setParsedPayload(null);
                setSignature("");
                if (showToast) {
                    toast.error(isVi ? "Định dạng JWT không hợp lệ!" : "Invalid JWT format!");
                }
                return;
            }

            try {
                const rawHeader = base64UrlDecode(segments[0]);
                const rawPayload = base64UrlDecode(segments[1]);

                const parsedHeaderObj = JSON.parse(rawHeader);
                const parsedPayloadObj = JSON.parse(rawPayload);

                setHeader(JSON.stringify(parsedHeaderObj, null, 2));
                setPayload(JSON.stringify(parsedPayloadObj, null, 2));
                setParsedPayload(parsedPayloadObj);
                setSignature(segments[2]);
                setError("");
                if (showToast) {
                    toast.success(isVi ? "Giải mã JWT thành công!" : "JWT decoded successfully!");
                }
            } catch (err: any) {
                const fallback = isVi
                    ? "Không thể giải mã JWT. Kiểm tra lại nội dung Base64."
                    : "Failed to decode JWT. Please check Base64 payload.";
                setError(err instanceof Error ? err.message : fallback);
                setHeader("");
                setPayload("");
                setParsedPayload(null);
                if (showToast) {
                    toast.error(isVi ? "Không thể giải mã token này!" : "Failed to decode this token!");
                }
            }
        },
        [jwt, isVi]
    );

    // Auto decode on mount or sample load
    useEffect(() => {
        if (jwt) {
            decodeJWT(false);
        }
    }, []);

    // Expiration status
    const expirationInfo = useMemo(() => {
        if (!parsedPayload?.exp) return null;
        const expTimestamp = parsedPayload.exp * 1000;
        const now = Date.now();
        const isExpired = now > expTimestamp;
        const expDate = new Date(expTimestamp).toLocaleString(locale === "vi" ? "vi-VN" : "en-US");

        const diffSeconds = Math.abs(Math.floor((expTimestamp - now) / 1000));
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        let unit = "";
        if (diffDays > 0) unit = `${diffDays} ${isVi ? "ngày" : diffDays === 1 ? "day" : "days"}`;
        else if (diffHours > 0) unit = `${diffHours} ${isVi ? "giờ" : diffHours === 1 ? "hour" : "hours"}`;
        else if (diffMinutes > 0) unit = `${diffMinutes} ${isVi ? "phút" : diffMinutes === 1 ? "minute" : "minutes"}`;
        else unit = `${diffSeconds} ${isVi ? "giây" : diffSeconds === 1 ? "second" : "seconds"}`;

        return {
            isExpired,
            expDate,
            relative: isExpired
                ? isVi
                    ? `Đã hết hạn ${unit} trước`
                    : `Expired ${unit} ago`
                : isVi
                ? `Hết hạn sau ${unit} nữa`
                : `Expires in ${unit}`,
        };
    }, [parsedPayload, isVi, locale]);

    const copySection = async (content: string, label: string) => {
        try {
            await navigator.clipboard.writeText(content);
            toast.success(isVi ? `Đã sao chép ${label}! 📋` : `Copied ${label} to clipboard! 📋`);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    const handleClear = () => {
        setJwt("");
        setHeader("");
        setPayload("");
        setParsedPayload(null);
        setSignature("");
        setError("");
        toast.info(isVi ? "Đã làm trống khung nhập" : "Cleared input");
    };

    const handleSample = () => {
        setJwt(SAMPLE_JWT);
        setError("");
        toast.info(isVi ? "Đã nạp JWT token mẫu" : "Loaded sample JWT token");
    };

    return (
        <div className='space-y-6 max-w-6xl mx-auto'>
            {/* Input Card */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xs border border-gray-200 dark:border-gray-700/80'>
                <div className='flex items-center justify-between gap-3 mb-3 flex-wrap'>
                    <label className='block text-sm font-semibold text-gray-800 dark:text-gray-200'>
                        {isVi ? "Chuỗi JWT Token Cần Giải Mã" : "Encoded JWT Token"}
                    </label>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={handleSample}
                            className='text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                        >
                            {isVi ? "Dùng Token mẫu" : "Use Sample Token"}
                        </button>
                        <span className='text-gray-300 dark:text-gray-600'>•</span>
                        <button
                            onClick={handleClear}
                            className='text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer'
                        >
                            {isVi ? "Xóa trắng" : "Clear"}
                        </button>
                    </div>
                </div>

                {/* Textarea */}
                <textarea
                    value={jwt}
                    onChange={(e) => setJwt(e.target.value)}
                    placeholder={
                        isVi
                            ? "Dán chuỗi JWT token vào đây (ví dụ: eyJhbGciOi...)..."
                            : "Paste your JWT token here (e.g. eyJhbGciOi...)..."
                    }
                    rows={5}
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed break-all'
                    spellCheck={false}
                />

                {/* Color preview of segments */}
                {parts.validLength && (
                    <div className='mt-3 p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200/60 dark:border-gray-800 text-[11px] sm:text-xs font-mono break-all leading-relaxed'>
                        <span className='text-rose-600 dark:text-rose-400 font-semibold'>{parts.header}</span>
                        <span className='text-gray-400'>.</span>
                        <span className='text-purple-600 dark:text-purple-400 font-semibold'>{parts.payload}</span>
                        <span className='text-gray-400'>.</span>
                        <span className='text-sky-600 dark:text-sky-400 font-semibold'>{parts.signature}</span>
                    </div>
                )}

                <div className='flex gap-3 mt-4'>
                    <Button onClick={() => decodeJWT(true)} variant='primary' size='md' className='flex-1 justify-center'>
                        {isVi ? "🔓 Giải Mã Token" : "🔓 Decode JWT Token"}
                    </Button>
                </div>

                {error && (
                    <div className='mt-4 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-sm flex items-center gap-2'>
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* Token Status & Claims Helper */}
            {parsedPayload && (
                <div className='p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-xs flex items-center justify-between gap-4 flex-wrap'>
                    <div className='flex items-center gap-3'>
                        <span className='text-xl'>{expirationInfo?.isExpired ? "⏰" : "🟢"}</span>
                        <div>
                            <div className='text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                                {isVi ? "Trạng Thái Hạn Dùng" : "Expiration Status"}
                            </div>
                            <div className='text-sm font-bold text-gray-900 dark:text-white'>
                                {expirationInfo ? (
                                    <span
                                        className={
                                            expirationInfo.isExpired
                                                ? "text-rose-600 dark:text-rose-400"
                                                : "text-emerald-600 dark:text-emerald-400"
                                        }
                                    >
                                        {expirationInfo.relative} ({expirationInfo.expDate})
                                    </span>
                                ) : (
                                    <span className='text-gray-500'>
                                        {isVi
                                            ? "Không cài đặt thời gian hết hạn (`exp`)"
                                            : "No expiration claim set (`exp`)"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                        {parsedPayload.sub && (
                            <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg'>
                                Sub: {parsedPayload.sub}
                            </span>
                        )}
                        {parsedPayload.iss && (
                            <span className='px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg'>
                                Iss: {parsedPayload.iss}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Decoded Output Grid */}
            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Header Pane */}
                <div className='flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-xs overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-3 bg-rose-50/70 dark:bg-rose-950/20 border-b border-rose-100 dark:border-rose-900/40'>
                        <div className='flex items-center gap-2'>
                            <span className='w-2.5 h-2.5 rounded-full bg-rose-500' />
                            <span className='text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300'>
                                {isVi ? "Header (Thuật toán & Loại)" : "Header (Algorithm & Type)"}
                            </span>
                        </div>
                        {header && (
                            <button
                                onClick={() => copySection(header, isVi ? "Header" : "Header")}
                                className='text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer font-medium'
                            >
                                {isVi ? "Sao chép" : "Copy"}
                            </button>
                        )}
                    </div>
                    <pre className='p-4 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 overflow-x-auto min-h-[140px] bg-transparent leading-relaxed'>
                        {header ? <code>{header}</code> : <span className='text-gray-400'>{isVi ? "Chờ giải mã..." : "Waiting for decode..."}</span>}
                    </pre>
                </div>

                {/* Payload Pane */}
                <div className='flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-purple-200 dark:border-purple-900/60 shadow-xs overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-3 bg-purple-50/70 dark:bg-purple-950/20 border-b border-purple-100 dark:border-purple-900/40'>
                        <div className='flex items-center gap-2'>
                            <span className='w-2.5 h-2.5 rounded-full bg-purple-500' />
                            <span className='text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300'>
                                {isVi ? "Payload (Dữ liệu Claims)" : "Payload (Claims Data)"}
                            </span>
                        </div>
                        {payload && (
                            <button
                                onClick={() => copySection(payload, isVi ? "Payload" : "Payload")}
                                className='text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer font-medium'
                            >
                                {isVi ? "Sao chép" : "Copy"}
                            </button>
                        )}
                    </div>
                    <pre className='p-4 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 overflow-x-auto min-h-[140px] bg-transparent leading-relaxed'>
                        {payload ? <code>{payload}</code> : <span className='text-gray-400'>{isVi ? "Chờ giải mã..." : "Waiting for decode..."}</span>}
                    </pre>
                </div>
            </div>

            {/* Signature Info */}
            {signature && (
                <div className='bg-white dark:bg-gray-800 rounded-2xl border border-sky-200 dark:border-sky-900/60 p-4 shadow-xs'>
                    <div className='flex items-center justify-between gap-2 mb-2'>
                        <div className='flex items-center gap-2'>
                            <span className='w-2.5 h-2.5 rounded-full bg-sky-500' />
                            <span className='text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300'>
                                {isVi ? "Signature (Chữ ký số)" : "Signature (Cryptographic)"}
                            </span>
                        </div>
                        <button
                            onClick={() => copySection(signature, isVi ? "Chữ ký số" : "Signature")}
                            className='text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer font-medium'
                        >
                            {isVi ? "Sao chép" : "Copy"}
                        </button>
                    </div>
                    <div className='p-3 bg-sky-50/50 dark:bg-sky-950/20 rounded-xl font-mono text-xs text-sky-900 dark:text-sky-300 break-all'>
                        {signature}
                    </div>
                </div>
            )}
        </div>
    );
}
