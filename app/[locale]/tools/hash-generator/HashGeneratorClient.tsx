"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import CryptoJS from "crypto-js";

interface HashItem {
    name: string;
    description: string;
    value: string;
    bits: number;
}

export default function HashGeneratorClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const [activeTab, setActiveTab] = useState<"text" | "file" | "hmac" | "encrypt">("text");

    // Text Hashing State
    const [textInput, setTextInput] = useState<string>("Hello, AnyTools!");
    const [uppercaseHash, setUppercaseHash] = useState<boolean>(false);

    // HMAC State
    const [hmacInput, setHmacInput] = useState<string>("The quick brown fox jumps over the lazy dog");
    const [hmacSecret, setHmacSecret] = useState<string>("my_super_secret_key");

    // File Hashing State
    const [fileName, setFileName] = useState<string>("");
    const [fileSize, setFileSize] = useState<string>("");
    const [fileHashes, setFileHashes] = useState<{ md5: string; sha1: string; sha256: string }>({ md5: "", sha1: "", sha256: "" });
    const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);

    // AES Encrypt/Decrypt State
    const [aesInput, setAesInput] = useState<string>("");
    const [aesKey, setAesKey] = useState<string>("");
    const [aesOutput, setAesOutput] = useState<string>("");

    // Calculate all text hashes in real-time
    const textHashes: HashItem[] = useMemo(() => {
        if (!textInput) {
            return [
                { name: "MD5", description: "128-bit hash (Legacy / Checksum)", value: "", bits: 128 },
                { name: "SHA-1", description: "160-bit hash (Git commit IDs)", value: "", bits: 160 },
                { name: "SHA-256", description: "256-bit secure hash (Standard / Bitcoin)", value: "", bits: 256 },
                { name: "SHA-384", description: "384-bit high security hash", value: "", bits: 384 },
                { name: "SHA-512", description: "512-bit military grade hash", value: "", bits: 512 },
            ];
        }

        try {
            const md5 = CryptoJS.MD5(textInput).toString();
            const sha1 = CryptoJS.SHA1(textInput).toString();
            const sha256 = CryptoJS.SHA256(textInput).toString();
            const sha384 = CryptoJS.SHA384(textInput).toString();
            const sha512 = CryptoJS.SHA512(textInput).toString();

            const format = (h: string) => (uppercaseHash ? h.toUpperCase() : h.toLowerCase());

            return [
                { name: "MD5", description: "128-bit hash (Legacy / Checksum)", value: format(md5), bits: 128 },
                { name: "SHA-1", description: "160-bit hash (Git commit IDs)", value: format(sha1), bits: 160 },
                { name: "SHA-256", description: "256-bit secure hash (Standard / Bitcoin)", value: format(sha256), bits: 256 },
                { name: "SHA-384", description: "384-bit high security hash", value: format(sha384), bits: 384 },
                { name: "SHA-512", description: "512-bit military grade hash", value: format(sha512), bits: 512 },
            ];
        } catch {
            return [];
        }
    }, [textInput, uppercaseHash]);

    // Calculate HMAC
    const hmacResult = useMemo(() => {
        if (!hmacInput || !hmacSecret) return "";
        try {
            const hash = CryptoJS.HmacSHA256(hmacInput, hmacSecret).toString();
            return uppercaseHash ? hash.toUpperCase() : hash.toLowerCase();
        } catch {
            return "";
        }
    }, [hmacInput, hmacSecret, uppercaseHash]);

    // Copy helper
    const handleCopy = async (val: string, name: string) => {
        if (!val) return;
        try {
            await navigator.clipboard.writeText(val);
            toast.success(isVi ? `Đã sao chép mã ${name}!` : `Copied ${name} to clipboard!`);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    // File checksum handler via Web Crypto API (fast & in-memory)
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setFileSize((file.size / 1024).toFixed(2) + " KB");
        setIsProcessingFile(true);

        try {
            const buffer = await file.arrayBuffer();

            // Calculate SHA-256
            const sha256Buffer = await crypto.subtle.digest("SHA-256", buffer);
            const sha256Hex = Array.from(new Uint8Array(sha256Buffer))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

            // Calculate SHA-1
            const sha1Buffer = await crypto.subtle.digest("SHA-1", buffer);
            const sha1Hex = Array.from(new Uint8Array(sha1Buffer))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");

            // Calculate MD5 via CryptoJS
            const wordArray = CryptoJS.lib.WordArray.create(buffer as any);
            const md5Hex = CryptoJS.MD5(wordArray).toString();

            setFileHashes({
                md5: uppercaseHash ? md5Hex.toUpperCase() : md5Hex.toLowerCase(),
                sha1: uppercaseHash ? sha1Hex.toUpperCase() : sha1Hex.toLowerCase(),
                sha256: uppercaseHash ? sha256Hex.toUpperCase() : sha256Hex.toLowerCase(),
            });

            toast.success(isVi ? "Đã tính toán xong Checksum của tệp!" : "File checksum calculated successfully!");
        } catch {
            toast.error(isVi ? "Lỗi khi xử lý tệp" : "Error processing file");
        } finally {
            setIsProcessingFile(false);
        }
    };

    // AES Encrypt
    const handleAesEncrypt = () => {
        if (!aesInput || !aesKey) {
            toast.error(isVi ? "Vui lòng nhập cả văn bản và khóa bí mật" : "Please provide text and secret key");
            return;
        }
        try {
            const encrypted = CryptoJS.AES.encrypt(aesInput, aesKey).toString();
            setAesOutput(encrypted);
            toast.success(isVi ? "Đã mã hóa AES thành công!" : "AES encrypted successfully!");
        } catch {
            toast.error(isVi ? "Mã hóa thất bại" : "Encryption failed");
        }
    };

    // AES Decrypt
    const handleAesDecrypt = () => {
        if (!aesInput || !aesKey) {
            toast.error(isVi ? "Vui lòng nhập bản mã và khóa bí mật" : "Please provide ciphertext and secret key");
            return;
        }
        try {
            const bytes = CryptoJS.AES.decrypt(aesInput, aesKey);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (!decrypted) {
                toast.error(isVi ? "Khóa giải mã không đúng!" : "Incorrect secret key or corrupted data!");
                return;
            }
            setAesOutput(decrypted);
            toast.success(isVi ? "Giải mã AES thành công!" : "AES decrypted successfully!");
        } catch {
            toast.error(isVi ? "Giải mã thất bại" : "Decryption failed");
        }
    };

    return (
        <div className='max-w-5xl mx-auto space-y-6'>
            {/* Top Navigation Tabs */}
            <div className='flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <div className='flex flex-wrap gap-1.5'>
                    {[
                        { id: "text", labelEn: "Text Hash (Live)", labelVi: "Băm Chuỗi Văn Bản (Live)", icon: "#" },
                        { id: "file", labelEn: "File Checksum", labelVi: "Tính Checksum Tệp Tin", icon: "📁" },
                        { id: "hmac", labelEn: "HMAC Generator", labelVi: "Tạo Mã HMAC", icon: "🔐" },
                        { id: "encrypt", labelEn: "AES Encrypt / Decrypt", labelVi: "Mã Hóa AES", icon: "🛡️" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{isVi ? tab.labelVi : tab.labelEn}</span>
                        </button>
                    ))}
                </div>

                {/* Uppercase toggle */}
                <label className='flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 cursor-pointer pr-2'>
                    <input
                        type='checkbox'
                        checked={uppercaseHash}
                        onChange={(e) => setUppercaseHash(e.target.checked)}
                        className='rounded text-blue-600'
                    />
                    <span>UPPERCASE</span>
                </label>
            </div>

            {/* Tab 1: Live Text Hashing */}
            {activeTab === "text" && (
                <div className='space-y-6'>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3'>
                        <div className='flex items-center justify-between'>
                            <label className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                                {isVi ? "Văn bản đầu vào (Tự động băm tức thì):" : "Input Text (Auto-hashed in real-time):"}
                            </label>
                            <button
                                type='button'
                                onClick={() => setTextInput("")}
                                className='text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer'
                            >
                                {isVi ? "Xóa hết" : "Clear"}
                            </button>
                        </div>
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder={isVi ? "Nhập văn bản cần tạo mã hash..." : "Enter text to generate hash..."}
                            rows={4}
                            className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        />
                    </div>

                    {/* Hashes List */}
                    <div className='space-y-3'>
                        {textHashes.map((h) => (
                            <div
                                key={h.name}
                                className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4'
                            >
                                <div className='min-w-0 flex-1 space-y-1'>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-bold text-sm text-gray-900 dark:text-gray-100 font-mono'>
                                            {h.name}
                                        </span>
                                        <span className='text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold'>
                                            {h.bits} bits
                                        </span>
                                        <span className='text-xs text-gray-400 hidden sm:inline'>{h.description}</span>
                                    </div>
                                    <div className='font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 break-all select-all bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-100 dark:border-gray-800'>
                                        {h.value || <em className='text-gray-400 font-normal'>{isVi ? "(đang chờ văn bản)" : "(awaiting input)"}</em>}
                                    </div>
                                </div>

                                <Button onClick={() => handleCopy(h.value, h.name)} variant='secondary' size='sm' className='shrink-0 self-end sm:self-center'>
                                    📋 {isVi ? "Sao chép" : "Copy"}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab 2: File Checksum */}
            {activeTab === "file" && (
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6'>
                    <div className='text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 hover:border-blue-500 transition-colors'>
                        <span className='text-4xl block mb-2'>📁</span>
                        <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-1'>
                            {isVi ? "Kéo & thả tệp vào đây hoặc bấm để chọn tệp" : "Drag and drop a file here or click to browse"}
                        </h3>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-4'>
                            🔒 {isVi ? "Tệp được xử lý hoàn toàn trên thiết bị của bạn. Không gửi bất kỳ byte nào lên mạng." : "Processed 100% client-side. Zero bytes uploaded to any server."}
                        </p>
                        <label className='inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors'>
                            {isVi ? "Chọn Tệp Từ Máy Tính" : "Choose File"}
                            <input type='file' onChange={handleFileUpload} className='hidden' />
                        </label>
                    </div>

                    {isProcessingFile && (
                        <div className='text-center py-4 text-xs font-semibold text-blue-600 dark:text-blue-400 animate-pulse'>
                            ⏳ {isVi ? "Đang tính toán mã băm cho tệp..." : "Calculating file checksums..."}
                        </div>
                    )}

                    {fileName && !isProcessingFile && (
                        <div className='space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700'>
                            <div className='flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400'>
                                <span>📄 {fileName}</span>
                                <span>{fileSize}</span>
                            </div>

                            {[
                                { name: "SHA-256", val: fileHashes.sha256 },
                                { name: "SHA-1", val: fileHashes.sha1 },
                                { name: "MD5", val: fileHashes.md5 },
                            ].map((f) => (
                                <div key={f.name} className='space-y-1'>
                                    <div className='flex items-center justify-between text-xs'>
                                        <span className='font-bold text-gray-800 dark:text-gray-200'>{f.name} Checksum</span>
                                        <button
                                            type='button'
                                            onClick={() => handleCopy(f.val, f.name)}
                                            className='text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-semibold'
                                        >
                                            {isVi ? "Sao chép" : "Copy"}
                                        </button>
                                    </div>
                                    <div className='font-mono text-xs p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 break-all select-all text-emerald-600 dark:text-emerald-400'>
                                        {f.val}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tab 3: HMAC Generator */}
            {activeTab === "hmac" && (
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-5'>
                    <div className='space-y-2'>
                        <label className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                            {isVi ? "Chuỗi thông điệp (Message):" : "Message text:"}
                        </label>
                        <textarea
                            value={hmacInput}
                            onChange={(e) => setHmacInput(e.target.value)}
                            rows={3}
                            className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                            {isVi ? "Khóa bí mật (Secret Key):" : "HMAC Secret Key:"}
                        </label>
                        <input
                            type='text'
                            value={hmacSecret}
                            onChange={(e) => setHmacSecret(e.target.value)}
                            placeholder='secret key'
                            className='w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        />
                    </div>

                    <div className='pt-2 space-y-2'>
                        <div className='flex items-center justify-between'>
                            <span className='text-xs font-bold text-gray-800 dark:text-gray-200'>
                                HMAC-SHA256 Result:
                            </span>
                            <Button onClick={() => handleCopy(hmacResult, "HMAC-SHA256")} variant='secondary' size='sm'>
                                📋 {isVi ? "Sao chép" : "Copy"}
                            </Button>
                        </div>
                        <div className='p-3.5 bg-gray-900 text-emerald-400 rounded-xl font-mono text-xs break-all select-all border border-gray-800'>
                            {hmacResult || <span className='text-gray-500'>{isVi ? "(Chưa có kết quả)" : "(No result)"}</span>}
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 4: AES Encrypt/Decrypt */}
            {activeTab === "encrypt" && (
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-5'>
                    <div className='space-y-2'>
                        <label className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                            {isVi ? "Nội dung cần mã hóa hoặc chuỗi bản mã cần giải mã:" : "Text to encrypt or ciphertext to decrypt:"}
                        </label>
                        <textarea
                            value={aesInput}
                            onChange={(e) => setAesInput(e.target.value)}
                            placeholder={isVi ? "Nhập văn bản..." : "Enter text..."}
                            rows={3}
                            className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                            {isVi ? "Mật khẩu mã hóa (Passphrase / Secret Key):" : "Passphrase / Secret Key:"}
                        </label>
                        <input
                            type='password'
                            value={aesKey}
                            onChange={(e) => setAesKey(e.target.value)}
                            placeholder='••••••••••••'
                            className='w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        />
                    </div>

                    <div className='flex gap-3'>
                        <Button onClick={handleAesEncrypt} variant='primary' size='md'>
                            🔒 {isVi ? "Mã Hóa AES" : "Encrypt AES"}
                        </Button>
                        <Button onClick={handleAesDecrypt} variant='secondary' size='md'>
                            🔓 {isVi ? "Giải Mã AES" : "Decrypt AES"}
                        </Button>
                    </div>

                    {aesOutput && (
                        <div className='pt-2 space-y-2'>
                            <div className='flex items-center justify-between'>
                                <span className='text-xs font-bold text-gray-800 dark:text-gray-200'>
                                    {isVi ? "Kết Quả:" : "Result:"}
                                </span>
                                <Button onClick={() => handleCopy(aesOutput, "AES Result")} variant='secondary' size='sm'>
                                    📋 {isVi ? "Sao chép" : "Copy"}
                                </Button>
                            </div>
                            <textarea
                                value={aesOutput}
                                readOnly
                                rows={3}
                                className='w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl font-mono text-xs text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700 select-all'
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
