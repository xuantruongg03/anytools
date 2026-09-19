"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface DiffLine {
    type: "added" | "removed" | "unchanged";
    value: string;
    lineNum1?: number;
    lineNum2?: number;
}

const SAMPLE_TEXT_1 = `// AnyTools Configuration
export const config = {
  appName: "AnyTools",
  version: "1.0.0",
  mode: "development",
  features: [
    "JSON Formatter",
    "Base64 Converter",
    "Color Picker"
  ],
  timeout: 3000
};`;

const SAMPLE_TEXT_2 = `// AnyTools Configuration v2
export const config = {
  appName: "AnyTools Online",
  version: "2.0.0",
  mode: "production",
  features: [
    "JSON Formatter",
    "Base64 Converter",
    "Color Picker",
    "Scribd Downloader",
    "Diff Checker Pro"
  ],
  timeout: 5000,
  cacheEnabled: true
};`;

// Compute Longest Common Subsequence (LCS) Diff
function computeDiff(text1: string, text2: string): DiffLine[] {
    const lines1 = text1 ? text1.split("\n") : [];
    const lines2 = text2 ? text2.split("\n") : [];

    const n = lines1.length;
    const m = lines2.length;

    // LCS dynamic programming table
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (lines1[i - 1] === lines2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Backtrack to construct diff
    const result: DiffLine[] = [];
    let i = n;
    let j = m;

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
            result.unshift({
                type: "unchanged",
                value: lines1[i - 1],
                lineNum1: i,
                lineNum2: j,
            });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            result.unshift({
                type: "added",
                value: lines2[j - 1],
                lineNum2: j,
            });
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
            result.unshift({
                type: "removed",
                value: lines1[i - 1],
                lineNum1: i,
            });
            i--;
        }
    }

    return result;
}

export default function DiffCheckerClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const [text1, setText1] = useState(SAMPLE_TEXT_1);
    const [text2, setText2] = useState(SAMPLE_TEXT_2);
    const [viewMode, setViewMode] = useState<"split" | "unified">("unified");
    const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

    // Compute diff results
    const diffResults = useMemo(() => {
        if (!text1 && !text2) return [];
        const t1 = ignoreWhitespace ? text1.split("\n").map((l) => l.trim()).join("\n") : text1;
        const t2 = ignoreWhitespace ? text2.split("\n").map((l) => l.trim()).join("\n") : text2;
        return computeDiff(t1, t2);
    }, [text1, text2, ignoreWhitespace]);

    const stats = useMemo(() => {
        const added = diffResults.filter((d) => d.type === "added").length;
        const removed = diffResults.filter((d) => d.type === "removed").length;
        const unchanged = diffResults.filter((d) => d.type === "unchanged").length;
        return { added, removed, unchanged };
    }, [diffResults]);

    const handleSwap = () => {
        const temp = text1;
        setText1(text2);
        setText2(temp);
        toast.info(isVi ? "Đã hoán đổi vị trí 2 văn bản" : "Swapped input texts");
    };

    const handleClear = () => {
        setText1("");
        setText2("");
        toast.info(isVi ? "Đã xóa nội dung so sánh" : "Cleared texts");
    };

    const handleLoadSample = () => {
        setText1(SAMPLE_TEXT_1);
        setText2(SAMPLE_TEXT_2);
        toast.info(isVi ? "Đã nạp văn bản mẫu" : "Loaded sample texts");
    };

    const handleCopyDiff = async () => {
        const text = diffResults
            .map((line) => {
                const prefix = line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  ";
                return prefix + line.value;
            })
            .join("\n");

        try {
            await navigator.clipboard.writeText(text);
            toast.success(isVi ? "Đã sao chép kết quả so sánh vào bộ nhớ tạm! 📋" : "Copied diff output to clipboard! 📋");
        } catch {
            toast.error(isVi ? "Không thể sao chép kết quả" : "Failed to copy diff output");
        }
    };

    return (
        <div className='space-y-6 max-w-6xl mx-auto'>
            {/* Action Bar */}
            <div className='flex items-center justify-between gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-xs flex-wrap'>
                <div className='flex items-center gap-2 flex-wrap'>
                    <Button onClick={handleSwap} variant='secondary' size='sm'>
                        <span>⇄</span>
                        <span>{isVi ? "Đổi Vị Trí" : "Swap Texts"}</span>
                    </Button>
                    <Button onClick={handleLoadSample} variant='secondary' size='sm'>
                        <span>🎲</span>
                        <span>{isVi ? "Mẫu" : "Sample"}</span>
                    </Button>
                    <Button onClick={handleClear} variant='gray' size='sm'>
                        <span>✕</span>
                        <span>{isVi ? "Xóa" : "Clear"}</span>
                    </Button>
                    <div className='h-5 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block' />
                    <label className='flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none'>
                        <input
                            type='checkbox'
                            checked={ignoreWhitespace}
                            onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                            className='rounded text-blue-600 focus:ring-blue-500'
                        />
                        <span>{isVi ? "Bỏ qua khoảng trắng" : "Ignore Whitespace"}</span>
                    </label>
                </div>

                <div className='flex items-center gap-2'>
                    {/* View Mode Toggle */}
                    <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl text-xs font-semibold'>
                        <button
                            type='button'
                            onClick={() => setViewMode("unified")}
                            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                viewMode === "unified"
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            {isVi ? "Dạng Hợp Nhất" : "Unified View"}
                        </button>
                        <button
                            type='button'
                            onClick={() => setViewMode("split")}
                            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                viewMode === "split"
                                    ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            {isVi ? "Dạng Song Song" : "Split View"}
                        </button>
                    </div>

                    <Button onClick={handleCopyDiff} variant='purple' size='sm'>
                        {isVi ? "Sao Chép" : "Copy Diff"}
                    </Button>
                </div>
            </div>

            {/* Input Editors */}
            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Text 1: Original */}
                <div className='flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-xs overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/80 text-xs font-semibold text-gray-600 dark:text-gray-300'>
                        <span>{isVi ? "Văn Bản Gốc (Trước)" : "Original Text (Before)"}</span>
                        <span className='font-mono text-gray-400'>
                            {isVi ? `${text1.split("\n").length} dòng` : `${text1.split("\n").length} lines`}
                        </span>
                    </div>
                    <textarea
                        value={text1}
                        onChange={(e) => setText1(e.target.value)}
                        placeholder={isVi ? "Dán văn bản gốc vào đây..." : "Paste original text here..."}
                        rows={10}
                        className='w-full p-4 font-mono text-xs sm:text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-y focus:outline-none leading-relaxed'
                        spellCheck={false}
                    />
                </div>

                {/* Text 2: Modified */}
                <div className='flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-xs overflow-hidden'>
                    <div className='flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700/80 text-xs font-semibold text-gray-600 dark:text-gray-300'>
                        <span>{isVi ? "Văn Bản Mới (Sau)" : "Modified Text (After)"}</span>
                        <span className='font-mono text-gray-400'>
                            {isVi ? `${text2.split("\n").length} dòng` : `${text2.split("\n").length} lines`}
                        </span>
                    </div>
                    <textarea
                        value={text2}
                        onChange={(e) => setText2(e.target.value)}
                        placeholder={isVi ? "Dán văn bản đã sửa đổi vào đây..." : "Paste modified text here..."}
                        rows={10}
                        className='w-full p-4 font-mono text-xs sm:text-sm bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-y focus:outline-none leading-relaxed'
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Differences Summary Card */}
            <div className='flex items-center gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700/80 text-xs font-medium flex-wrap'>
                <span className='text-gray-700 dark:text-gray-300 font-bold'>
                    {isVi ? "Kết Quả So Sánh:" : "Comparison Result:"}
                </span>
                <span className='inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400'>
                    <span>+ {stats.added}</span> {isVi ? "dòng thêm mới" : "lines added"}
                </span>
                <span className='inline-flex items-center gap-1 text-rose-600 dark:text-rose-400'>
                    <span>- {stats.removed}</span> {isVi ? "dòng bị xóa" : "lines removed"}
                </span>
                <span className='inline-flex items-center gap-1 text-gray-500 dark:text-gray-400'>
                    <span>= {stats.unchanged}</span> {isVi ? "dòng giống nhau" : "lines unchanged"}
                </span>
            </div>

            {/* Diff Viewer */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-xs overflow-hidden font-mono text-xs sm:text-sm'>
                <div className='px-4 py-3 bg-gray-50 dark:bg-gray-800/90 border-b border-gray-200 dark:border-gray-700/80 flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-300'>
                    <span>{isVi ? "Nội Dung Khác Biệt" : "Diff Output"}</span>
                    <span>{viewMode === "unified" ? (isVi ? "Hợp nhất (Từng dòng)" : "Unified") : (isVi ? "Song song (2 cột)" : "Side-by-Side")}</span>
                </div>

                {diffResults.length > 0 ? (
                    <div className='divide-y divide-gray-100 dark:divide-gray-800/60 overflow-x-auto max-h-[600px] overflow-y-auto'>
                        {diffResults.map((line, idx) => {
                            const isAdded = line.type === "added";
                            const isRemoved = line.type === "removed";

                            return (
                                <div
                                    key={idx}
                                    className={`flex items-start px-4 py-1.5 leading-relaxed font-mono ${
                                        isAdded
                                            ? "bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200"
                                            : isRemoved
                                            ? "bg-rose-50/80 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 line-through opacity-80"
                                            : "text-gray-800 dark:text-gray-300"
                                    }`}
                                >
                                    {/* Line numbers */}
                                    <div className='w-14 shrink-0 flex items-center gap-2 select-none text-[11px] text-gray-400 font-mono'>
                                        <span className='w-6 text-right'>{line.lineNum1 || ""}</span>
                                        <span className='w-6 text-right'>{line.lineNum2 || ""}</span>
                                    </div>

                                    {/* Prefix marker (+ / - / space) */}
                                    <span className='w-5 shrink-0 select-none font-bold text-center'>
                                        {isAdded ? "+" : isRemoved ? "-" : " "}
                                    </span>

                                    {/* Line content */}
                                    <span className='flex-1 whitespace-pre-wrap break-all'>{line.value}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className='p-8 text-center text-gray-500 dark:text-gray-400 text-sm'>
                        {isVi
                            ? "Chưa có dữ liệu để so sánh. Nhập văn bản hoặc bấm 'Mẫu' để thử nghiệm!"
                            : "No data to compare. Enter text or click 'Sample' to test!"}
                    </div>
                )}
            </div>
        </div>
    );
}
