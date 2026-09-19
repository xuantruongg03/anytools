"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

// UTF-8 safe base64 encoding
function utf8ToBase64(str: string, urlSafe = false): string {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    let base64 = btoa(binary);
    if (urlSafe) {
        base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    return base64;
}

// UTF-8 safe base64 decoding
function base64ToUtf8(str: string): string {
    let normalized = str.trim();
    // Re-pad if urlSafe
    if (normalized.includes("-") || normalized.includes("_")) {
        normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");
        while (normalized.length % 4 !== 0) {
            normalized += "=";
        }
    }
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

export default function Base64Client() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const [activeTab, setActiveTab] = useState<"text" | "file">("text");

    // Text Tab States
    const [textInput, setTextInput] = useState<string>("Xin chào, AnyTools! Chúc bạn một ngày tốt lành.");
    const [urlSafe, setUrlSafe] = useState<boolean>(false);
    const [textMode, setTextMode] = useState<"encode" | "decode">("encode");

    // File / Image Tab States
    const [fileDataUrl, setFileDataUrl] = useState<string>("");
    const [fileInfo, setFileInfo] = useState<{ name: string; size: string; type: string } | null>(null);

    // Live Text Output
    const { textOutput, textError } = useMemo(() => {
        if (!textInput) return { textOutput: "", textError: "" };
        try {
            if (textMode === "encode") {
                const encoded = utf8ToBase64(textInput, urlSafe);
                return { textOutput: encoded, textError: "" };
            } else {
                const decoded = base64ToUtf8(textInput);
                return { textOutput: decoded, textError: "" };
            }
        } catch (err: any) {
            return {
                textOutput: "",
                textError: isVi ? "Chuỗi Base64 không hợp lệ" : "Invalid Base64 string",
            };
        }
    }, [textInput, textMode, urlSafe, isVi]);

    // Handle File Drop / Selection
    const handleFile = (file: File) => {
        setFileInfo({
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            type: file.type || "application/octet-stream",
        });

        const reader = new FileReader();
        reader.onload = (e) => {
            const res = e.target?.result as string;
            setFileDataUrl(res);
            toast.success(isVi ? "Đã chuyển đổi tệp sang Base64!" : "Converted file to Base64!");
        };
        reader.onerror = () => {
            toast.error(isVi ? "Không thể đọc tệp" : "Failed to read file");
        };
        reader.readAsDataURL(file);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleCopy = async (val: string, label: string) => {
        if (!val) return;
        try {
            await navigator.clipboard.writeText(val);
            toast.success(isVi ? `Đã sao chép ${label}!` : `Copied ${label} to clipboard!`);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    // Extract raw base64 without data prefix
    const rawFileBase64 = useMemo(() => {
        if (!fileDataUrl) return "";
        const commaIdx = fileDataUrl.indexOf(",");
        return commaIdx > -1 ? fileDataUrl.slice(commaIdx + 1) : fileDataUrl;
    }, [fileDataUrl]);

    return (
        <div className='max-w-5xl mx-auto space-y-6'>
            {/* Top Navigation Tabs */}
            <div className='flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <div className='flex gap-2'>
                    <button
                        onClick={() => setActiveTab("text")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "text"
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                        }`}
                    >
                        <span>📝</span>
                        <span>{isVi ? "Văn Bản (Text Base64)" : "Text Base64"}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("file")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "file"
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                        }`}
                    >
                        <span>🖼️</span>
                        <span>{isVi ? "Hình Ảnh & Tệp Tin (File / Image)" : "File & Image to Base64"}</span>
                    </button>
                </div>
            </div>

            {/* TAB 1: Text Base64 */}
            {activeTab === "text" && (
                <div className='space-y-6'>
                    {/* Mode & Options Bar */}
                    <div className='flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                        <div className='flex items-center gap-2'>
                            <div className='flex bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl text-xs font-semibold'>
                                <button
                                    onClick={() => setTextMode("encode")}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                        textMode === "encode"
                                            ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                                            : "text-gray-600 dark:text-gray-400"
                                    }`}
                                >
                                    🔒 {isVi ? "Mã Hóa (Encode)" : "Encode"}
                                </button>
                                <button
                                    onClick={() => setTextMode("decode")}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                        textMode === "decode"
                                            ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                                            : "text-gray-600 dark:text-gray-400"
                                    }`}
                                >
                                    🔓 {isVi ? "Giải Mã (Decode)" : "Decode"}
                                </button>
                            </div>

                            {textMode === "encode" && (
                                <label className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer ml-2'>
                                    <input
                                        type='checkbox'
                                        checked={urlSafe}
                                        onChange={(e) => setUrlSafe(e.target.checked)}
                                        className='rounded text-blue-600'
                                    />
                                    <span>URL-Safe (RFC 4648)</span>
                                </label>
                            )}
                        </div>

                        <button
                            type='button'
                            onClick={() => setTextInput("")}
                            className='text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer'
                        >
                            {isVi ? "Xóa hết" : "Clear"}
                        </button>
                    </div>

                    {/* Split View */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {/* Input Box */}
                        <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-3'>
                            <div className='flex items-center justify-between text-xs font-semibold text-gray-500'>
                                <span>{textMode === "encode" ? (isVi ? "Văn Bản Gốc (UTF-8):" : "Plain Text (UTF-8):") : (isVi ? "Chuỗi Base64 Cần Giải Mã:" : "Base64 String to Decode:")}</span>
                                <span>{textInput.length} chars</span>
                            </div>
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                placeholder={isVi ? "Nhập văn bản..." : "Enter text..."}
                                rows={10}
                                className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y leading-relaxed flex-1'
                            />
                        </div>

                        {/* Output Box */}
                        <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-3'>
                            <div className='flex items-center justify-between text-xs font-semibold text-gray-500'>
                                <span>{textMode === "encode" ? "Base64 Output:" : (isVi ? "Văn Bản Đã Giải Mã:" : "Decoded Text:")}</span>
                                <Button onClick={() => handleCopy(textOutput, "Output")} variant='secondary' size='sm'>
                                    📋 {isVi ? "Sao chép" : "Copy"}
                                </Button>
                            </div>

                            <textarea
                                value={textOutput}
                                readOnly
                                rows={10}
                                placeholder={isVi ? "Kết quả sẽ hiển thị tại đây..." : "Result will appear here..."}
                                className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-blue-600 dark:text-blue-400 font-mono text-xs focus:outline-none resize-y leading-relaxed flex-1 select-all'
                            />

                            {textError && (
                                <div className='p-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2'>
                                    <span>⚠️</span>
                                    <span>{textError}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: File & Image Base64 */}
            {activeTab === "file" && (
                <div className='space-y-6'>
                    {/* Drag and drop upload zone */}
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className='bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors text-center shadow-sm space-y-3'
                    >
                        <span className='text-4xl block'>🖼️</span>
                        <h3 className='font-bold text-gray-900 dark:text-gray-100 text-sm'>
                            {isVi ? "Kéo & thả ảnh hoặc tệp bất kỳ vào đây" : "Drag and drop any image or file here"}
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {isVi ? "Hỗ trợ PNG, JPG, WebP, SVG, GIF, PDF, TXT... Chuyển đổi tức thì sang Data URL." : "Supports PNG, JPG, WebP, SVG, GIF, PDF, TXT... Instant Data URL conversion."}
                        </p>
                        <label className='inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors'>
                            {isVi ? "Chọn Tệp Từ Máy Tính" : "Browse File"}
                            <input type='file' onChange={handleFileInput} className='hidden' />
                        </label>
                    </div>

                    {fileDataUrl && fileInfo && (
                        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6'>
                            <div className='flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-700'>
                                <div className='flex items-center gap-3'>
                                    <span className='text-2xl'>📄</span>
                                    <div>
                                        <div className='font-bold text-sm text-gray-900 dark:text-gray-100'>{fileInfo.name}</div>
                                        <div className='text-xs text-gray-500 font-mono'>{fileInfo.size} • {fileInfo.type}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Image Preview if it's an image */}
                            {fileInfo.type.startsWith("image/") && (
                                <div className='space-y-2'>
                                    <span className='text-xs font-bold uppercase tracking-wider text-gray-500'>
                                        {isVi ? "Xem trước ảnh:" : "Image Preview:"}
                                    </span>
                                    <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center max-h-72 overflow-hidden'>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={fileDataUrl} alt={fileInfo.name} className='max-h-64 object-contain rounded-lg shadow-sm' />
                                    </div>
                                </div>
                            )}

                            {/* Snippets Generators */}
                            <div className='space-y-4'>
                                {/* 1. Data URL */}
                                <div className='space-y-1.5'>
                                    <div className='flex items-center justify-between text-xs font-semibold'>
                                        <span className='text-gray-800 dark:text-gray-200'>Data URL (data:{fileInfo.type};base64,...):</span>
                                        <button
                                            type='button'
                                            onClick={() => handleCopy(fileDataUrl, "Data URL")}
                                            className='text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                                        >
                                            {isVi ? "Sao chép Data URL" : "Copy Data URL"}
                                        </button>
                                    </div>
                                    <input
                                        type='text'
                                        readOnly
                                        value={fileDataUrl}
                                        className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-700 dark:text-gray-300'
                                    />
                                </div>

                                {/* 2. HTML <img> Tag */}
                                {fileInfo.type.startsWith("image/") && (
                                    <div className='space-y-1.5'>
                                        <div className='flex items-center justify-between text-xs font-semibold'>
                                            <span className='text-gray-800 dark:text-gray-200'>HTML &lt;img&gt; Tag:</span>
                                            <button
                                                type='button'
                                                onClick={() => handleCopy(`<img src="${fileDataUrl}" alt="${fileInfo.name}" />`, "HTML tag")}
                                                className='text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                                            >
                                                {isVi ? "Sao chép HTML tag" : "Copy HTML tag"}
                                            </button>
                                        </div>
                                        <input
                                            type='text'
                                            readOnly
                                            value={`<img src="${fileDataUrl}" alt="${fileInfo.name}" />`}
                                            className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-700 dark:text-gray-300'
                                        />
                                    </div>
                                )}

                                {/* 3. Raw Base64 string */}
                                <div className='space-y-1.5'>
                                    <div className='flex items-center justify-between text-xs font-semibold'>
                                        <span className='text-gray-800 dark:text-gray-200'>{isVi ? "Chuỗi Base64 Thuần (Raw Base64):" : "Raw Base64 String:"}</span>
                                        <button
                                            type='button'
                                            onClick={() => handleCopy(rawFileBase64, "Raw Base64")}
                                            className='text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                                        >
                                            {isVi ? "Sao chép chuỗi thô" : "Copy raw base64"}
                                        </button>
                                    </div>
                                    <textarea
                                        readOnly
                                        value={rawFileBase64}
                                        rows={4}
                                        className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-700 dark:text-gray-300 select-all'
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
