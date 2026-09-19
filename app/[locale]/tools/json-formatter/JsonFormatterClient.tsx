"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const SAMPLE_JSON = `{
  "name": "AnyTools",
  "version": "2.0.0",
  "description": "Free, privacy-friendly online utilities",
  "features": [
    "100% Client-side processing",
    "Zero ads & Zero tracking",
    "Dark mode & Mobile friendly",
    "Bilingual: English & Vietnamese"
  ],
  "stats": {
    "totalTools": 58,
    "rating": 5.0,
    "activeUsers": 125000
  },
  "openSource": true
}`;

export default function JsonFormatterClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [indentSize, setIndentSize] = useState<number>(2);
    const [error, setError] = useState<{ message: string; line?: number; column?: number } | null>(null);

    // Compute stats
    const stats = useMemo(() => {
        const text = output || input;
        if (!text) return null;
        const bytes = new Blob([text]).size;
        const lines = text.split("\n").length;
        const chars = text.length;
        return {
            bytes: bytes > 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${bytes} B`,
            lines,
            chars,
        };
    }, [input, output]);

    const formatJson = () => {
        if (!input.trim()) {
            toast.warning(isVi ? "Vui lòng nhập mã JSON cần định dạng" : "Please enter JSON to format");
            return;
        }
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, indentSize);
            setOutput(formatted);
            setError(null);
            toast.success(isVi ? "Định dạng JSON thành công!" : "JSON formatted successfully!");
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : "Invalid JSON";
            const match = msg.match(/line (\d+) column (\d+)/i) || msg.match(/position (\d+)/i);
            setError({
                message: msg,
                line: match ? parseInt(match[1], 10) : undefined,
            });
            setOutput("");
            toast.error(isVi ? "Lỗi cú pháp JSON! Kiểm tra lại mã nguồn." : "JSON syntax error! Check input data.");
        }
    };

    const minifyJson = () => {
        if (!input.trim()) {
            toast.warning(isVi ? "Vui lòng nhập mã JSON cần nén" : "Please enter JSON to minify");
            return;
        }
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setError(null);
            toast.success(isVi ? "Nén JSON thành công!" : "JSON minified successfully!");
        } catch (e: any) {
            setError({ message: e instanceof Error ? e.message : "Invalid JSON" });
            setOutput("");
            toast.error(isVi ? "Lỗi cú pháp JSON khi nén!" : "Syntax error during minification!");
        }
    };

    // Auto-repair common JSON syntax mistakes
    const repairJson = () => {
        if (!input.trim()) {
            toast.warning(isVi ? "Vui lòng nhập mã JSON cần sửa lỗi" : "Please enter JSON to repair");
            return;
        }
        try {
            let fixed = input
                // Replace single quotes around keys or strings with double quotes
                .replace(/'/g, '"')
                // Remove trailing commas before } or ]
                .replace(/,\s*([\]}])/g, "$1")
                // Quote unquoted object keys (e.g. { foo: "bar" } -> { "foo": "bar" })
                .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

            const parsed = JSON.parse(fixed);
            const formatted = JSON.stringify(parsed, null, indentSize);
            setInput(formatted);
            setOutput(formatted);
            setError(null);
            toast.success(isVi ? "Đã tự động sửa các lỗi cú pháp phổ biến!" : "Repaired common JSON syntax mistakes!");
        } catch (e: any) {
            toast.error(
                isVi
                    ? "Không thể tự động sửa lỗi này. Vui lòng kiểm tra thủ công."
                    : "Could not auto-repair this error. Please check manually."
            );
        }
    };

    const copyToClipboard = async () => {
        const textToCopy = output || input;
        if (!textToCopy) {
            toast.warning(isVi ? "Không có nội dung để sao chép!" : "No content to copy!");
            return;
        }
        try {
            await navigator.clipboard.writeText(textToCopy);
            toast.success(isVi ? "Đã sao chép vào bộ nhớ tạm! 📋" : "Copied to clipboard! 📋");
        } catch {
            toast.error(isVi ? "Không thể sao chép vào bộ nhớ tạm" : "Failed to copy to clipboard");
        }
    };

    const handleDownload = () => {
        const content = output || input;
        if (!content) return;
        const blob = new Blob([content], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `formatted_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(isVi ? "Đã tải tệp .json về máy!" : "Downloaded .json file!");
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                setInput(text);
                toast.info(isVi ? "Đã dán dữ liệu từ bộ nhớ tạm" : "Pasted from clipboard");
            }
        } catch {
            toast.error(isVi ? "Trình duyệt không cho phép đọc bộ nhớ tạm" : "Clipboard permission denied");
        }
    };

    const loadSample = () => {
        setInput(SAMPLE_JSON);
        setOutput("");
        setError(null);
        toast.info(isVi ? "Đã nạp dữ liệu mẫu" : "Loaded sample JSON data");
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
        setError(null);
        toast.info(isVi ? "Đã làm trống khung làm việc" : "Cleared workspace");
    };

    return (
        <div className='space-y-6'>
            {/* Top Toolbar */}
            <div className='flex items-center justify-between gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-xs flex-wrap'>
                <div className='flex items-center gap-2 flex-wrap'>
                    <Button onClick={formatJson} variant='primary' size='sm'>
                        <span>✨</span>
                        <span>{isVi ? "Định Dạng" : "Format"}</span>
                    </Button>
                    <Button onClick={minifyJson} variant='success' size='sm'>
                        <span>🗜️</span>
                        <span>{isVi ? "Nén Gọn" : "Minify"}</span>
                    </Button>
                    <Button onClick={repairJson} variant='info' size='sm'>
                        <span>🛠️</span>
                        <span>{isVi ? "Tự Sửa Lỗi" : "Auto-Repair"}</span>
                    </Button>
                    <div className='h-5 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block' />
                    <Button onClick={loadSample} variant='secondary' size='sm'>
                        <span>🎲</span>
                        <span>{isVi ? "Mẫu" : "Sample"}</span>
                    </Button>
                    <Button onClick={handlePaste} variant='secondary' size='sm'>
                        <span>📋</span>
                        <span>{isVi ? "Dán" : "Paste"}</span>
                    </Button>
                    <Button onClick={clearAll} variant='gray' size='sm'>
                        <span>✕</span>
                        <span>{isVi ? "Xóa" : "Clear"}</span>
                    </Button>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400'>
                        <span>{isVi ? "Thụt lề:" : "Indent:"}</span>
                        <select
                            value={indentSize}
                            onChange={(e) => setIndentSize(Number(e.target.value))}
                            className='bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-xs text-gray-800 dark:text-gray-200 cursor-pointer focus:outline-none'
                        >
                            <option value={2}>2 spaces</option>
                            <option value={4}>4 spaces</option>
                        </select>
                    </div>

                    {(output || input) && (
                        <div className='flex items-center gap-1.5'>
                            <Button onClick={copyToClipboard} variant='purple' size='sm'>
                                {isVi ? "Sao Chép" : "Copy"}
                            </Button>
                            <Button onClick={handleDownload} variant='secondary' size='sm'>
                                <span>⬇</span>
                                <span>{isVi ? "Tải Về" : "Download"}</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Workspace */}
            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Input Section */}
                <div className='flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-xs overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/80 text-xs font-semibold text-gray-600 dark:text-gray-300'>
                        <span className='flex items-center gap-1.5'>
                            <span>📥</span>
                            <span>{isVi ? "Dữ Liệu JSON Đầu Vào" : "Input JSON"}</span>
                        </span>
                        <span className='text-[11px] font-mono text-gray-400'>
                            {input
                                ? isVi
                                    ? `${input.length} ký tự • ${input.split("\n").length} dòng`
                                    : `${input.length} chars • ${input.split("\n").length} lines`
                                : isVi
                                ? "Trống"
                                : "Empty"}
                        </span>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            isVi
                                ? 'Dán hoặc nhập mã JSON vào đây... (vd: {"name": "AnyTools", "status": "active"})'
                                : 'Paste or type your JSON here... (e.g. {"name": "AnyTools", "status": "active"})'
                        }
                        className='w-full h-96 p-4 font-mono text-sm bg-transparent text-gray-900 dark:text-gray-100 resize-none placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none border-none leading-relaxed'
                        spellCheck={false}
                    />
                </div>

                {/* Output Section */}
                <div className='flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-xs overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/80 text-xs font-semibold text-gray-600 dark:text-gray-300'>
                        <span className='flex items-center gap-1.5'>
                            <span>📤</span>
                            <span>{isVi ? "Kết Quả JSON Đầu Ra" : "Output JSON"}</span>
                        </span>
                        <span className='text-[11px] font-mono text-gray-400'>
                            {output
                                ? isVi
                                    ? `${output.length} ký tự • ${output.split("\n").length} dòng`
                                    : `${output.length} chars • ${output.split("\n").length} lines`
                                : isVi
                                ? "Chờ dữ liệu"
                                : "Waiting for input"}
                        </span>
                    </div>

                    <textarea
                        value={output}
                        readOnly
                        placeholder={
                            isVi
                                ? "Mã JSON sau khi format hoặc nén sẽ hiển thị ở đây..."
                                : "Formatted or minified JSON will appear here..."
                        }
                        className='w-full h-96 p-4 font-mono text-sm bg-gray-50/50 dark:bg-gray-900/40 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none border-none leading-relaxed'
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className='p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm'>
                    <span className='text-base'>❌</span>
                    <div className='flex-1'>
                        <div className='font-semibold'>
                            {isVi ? "Lỗi Cú Pháp JSON (Syntax Error)" : "JSON Syntax Error"}
                        </div>
                        <div className='font-mono text-xs mt-1'>{error.message}</div>
                        {error.line && (
                            <div className='text-xs mt-0.5 opacity-80'>
                                {isVi ? `Tại dòng: ${error.line}` : `At line: ${error.line}`}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Stats Bar */}
            {stats && (
                <div className='flex items-center gap-6 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700/80 text-xs text-gray-500 dark:text-gray-400 flex-wrap'>
                    <div className='flex items-center gap-1.5'>
                        <span className='font-medium text-gray-800 dark:text-gray-200'>
                            {isVi ? "Dung lượng:" : "Size:"}
                        </span>
                        <span className='font-mono'>{stats.bytes}</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <span className='font-medium text-gray-800 dark:text-gray-200'>
                            {isVi ? "Số dòng:" : "Lines:"}
                        </span>
                        <span className='font-mono'>{stats.lines}</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <span className='font-medium text-gray-800 dark:text-gray-200'>
                            {isVi ? "Ký tự:" : "Chars:"}
                        </span>
                        <span className='font-mono'>{stats.chars}</span>
                    </div>
                    <div className='flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold ml-auto'>
                        <span>✓</span>
                        <span>{isVi ? "Xử lý 100% Client-side" : "Client-side 100% Private"}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
