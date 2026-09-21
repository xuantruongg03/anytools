"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { pdfSplitMergeTranslations } from "@/lib/i18n/tools/pdf-split-merge";
import { toast } from "@/components/ui/Toast";
import { PDFDocument } from "pdf-lib";

type ActiveTab = "merge" | "split";

interface MergeFileItem {
    id: string;
    file: File;
    name: string;
    size: string;
    pageCount?: number;
}

export default function PdfSplitMergeContent() {
    const { locale } = useLanguage();
    const t = pdfSplitMergeTranslations[locale as "en" | "vi"] || pdfSplitMergeTranslations.en;
    const isVi = locale === "vi";

    const [activeTab, setActiveTab] = useState<ActiveTab>("merge");

    // Merge State
    const [mergeFiles, setMergeFiles] = useState<MergeFileItem[]>([]);
    const [isMerging, setIsMerging] = useState<boolean>(false);
    const [mergedUrl, setMergedUrl] = useState<string | null>(null);

    // Split State
    const [splitFile, setSplitFile] = useState<File | null>(null);
    const [splitTotalPages, setSplitTotalPages] = useState<number>(0);
    const [pageRange, setPageRange] = useState<string>("");
    const [isSplitting, setIsSplitting] = useState<boolean>(false);
    const [splitUrl, setSplitUrl] = useState<string | null>(null);

    const mergeInputRef = useRef<HTMLInputElement>(null);
    const splitInputRef = useRef<HTMLInputElement>(null);

    // Format file size
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    // Handle Merge file select
    const handleMergeFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
        if (files.length === 0) return;

        const newItems: MergeFileItem[] = [];
        for (const f of files) {
            let pageCount: number | undefined;
            try {
                const buffer = await f.arrayBuffer();
                const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
                pageCount = doc.getPageCount();
            } catch (err) {
                console.warn("Could not read page count for", f.name, err);
            }

            newItems.push({
                id: Math.random().toString(36).substring(2, 9),
                file: f,
                name: f.name,
                size: formatSize(f.size),
                pageCount,
            });
        }

        setMergeFiles((prev) => [...prev, ...newItems]);
        setMergedUrl(null);
        if (mergeInputRef.current) mergeInputRef.current.value = "";
    };

    // Move file up/down
    const moveItem = (index: number, direction: "up" | "down") => {
        setMergeFiles((prev) => {
            const next = [...prev];
            const target = direction === "up" ? index - 1 : index + 1;
            if (target < 0 || target >= next.length) return prev;
            const temp = next[index];
            next[index] = next[target];
            next[target] = temp;
            return next;
        });
    };

    // Remove file
    const removeItem = (id: string) => {
        setMergeFiles((prev) => prev.filter((item) => item.id !== id));
    };

    // Execute Merge
    const handleMerge = async () => {
        if (mergeFiles.length < 2) {
            toast.error(t.errorNoFiles);
            return;
        }

        setIsMerging(true);
        try {
            const mergedPdf = await PDFDocument.create();

            for (const item of mergeFiles) {
                const arrayBuffer = await item.file.arrayBuffer();
                const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes as unknown as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setMergedUrl(url);
            toast.success(t.mergeSuccess);
        } catch (err) {
            console.error("Merge error:", err);
            toast.error(isVi ? "Có lỗi xảy ra khi ghép PDF!" : "Failed to merge PDF files!");
        } finally {
            setIsMerging(false);
        }
    };

    // Handle Split file select
    const handleSplitFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const buffer = await file.arrayBuffer();
            const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
            const pages = doc.getPageCount();
            setSplitFile(file);
            setSplitTotalPages(pages);
            setPageRange(`1-${pages}`);
            setSplitUrl(null);
        } catch (err) {
            console.error("Split load error:", err);
            toast.error(isVi ? "Không thể đọc file PDF này!" : "Could not load this PDF file!");
        }
    };

    // Parse page ranges (e.g. "1-3, 5, 8-10") into 0-based indices
    const parsePageRange = (rangeText: string, maxPages: number): number[] => {
        const indices = new Set<number>();
        const parts = rangeText.split(",").map((p) => p.trim()).filter(Boolean);

        for (const part of parts) {
            if (part.includes("-")) {
                const [startStr, endStr] = part.split("-").map((s) => parseInt(s.trim(), 10));
                if (isNaN(startStr) || isNaN(endStr)) continue;
                const start = Math.max(1, Math.min(startStr, endStr));
                const end = Math.min(maxPages, Math.max(startStr, endStr));
                for (let i = start; i <= end; i++) {
                    indices.add(i - 1);
                }
            } else {
                const pageNum = parseInt(part, 10);
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
                    indices.add(pageNum - 1);
                }
            }
        }

        return Array.from(indices).sort((a, b) => a - b);
    };

    // Execute Split
    const handleSplit = async () => {
        if (!splitFile || splitTotalPages === 0) return;

        const targetIndices = parsePageRange(pageRange, splitTotalPages);
        if (targetIndices.length === 0) {
            toast.error(t.errorInvalidRange);
            return;
        }

        setIsSplitting(true);
        try {
            const buffer = await splitFile.arrayBuffer();
            const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
            const newDoc = await PDFDocument.create();

            const copiedPages = await newDoc.copyPages(srcDoc, targetIndices);
            copiedPages.forEach((page) => newDoc.addPage(page));

            const newPdfBytes = await newDoc.save();
            const blob = new Blob([newPdfBytes as unknown as BlobPart], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setSplitUrl(url);
            toast.success(t.splitSuccess);
        } catch (err) {
            console.error("Split error:", err);
            toast.error(isVi ? "Có lỗi xảy ra khi tách trang PDF!" : "Failed to extract PDF pages!");
        } finally {
            setIsSplitting(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-6'>
            {/* Tab Navigation */}
            <div className='flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl w-full max-w-md mx-auto'>
                <button
                    type='button'
                    onClick={() => setActiveTab("merge")}
                    className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                        activeTab === "merge"
                            ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    📑 {t.tabMerge}
                </button>
                <button
                    type='button'
                    onClick={() => setActiveTab("split")}
                    className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                        activeTab === "split"
                            ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    ✂️ {t.tabSplit}
                </button>
            </div>

            {/* Merge Tab Content */}
            {activeTab === "merge" && (
                <div className='w-full space-y-6'>
                    {/* Dropzone */}
                    <div
                        onClick={() => mergeInputRef.current?.click()}
                        className='w-full p-8 rounded-3xl border-2 border-dashed border-blue-300 dark:border-blue-700/60 bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-all text-center cursor-pointer space-y-3'
                    >
                        <input
                            ref={mergeInputRef}
                            type='file'
                            multiple
                            accept='.pdf,application/pdf'
                            onChange={handleMergeFilesSelect}
                            className='hidden'
                        />
                        <div className='text-4xl'>📚</div>
                        <div className='font-bold text-base sm:text-lg text-gray-900 dark:text-white'>
                            {t.dropMergeTitle}
                        </div>
                        <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto'>
                            {t.dropMergeSubtitle}
                        </p>
                    </div>

                    {/* Files List */}
                    {mergeFiles.length > 0 && (
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4'>
                            <div className='flex items-center justify-between'>
                                <h3 className='font-bold text-base text-gray-900 dark:text-white flex items-center gap-2'>
                                    <span>{t.filesToMerge}</span>
                                    <span className='px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono'>
                                        {mergeFiles.length}
                                    </span>
                                </h3>
                                <button
                                    type='button'
                                    onClick={() => setMergeFiles([])}
                                    className='text-xs text-red-500 hover:underline cursor-pointer'
                                >
                                    {isVi ? "Xóa tất cả" : "Clear all"}
                                </button>
                            </div>

                            <div className='space-y-2 max-h-80 overflow-y-auto pr-1'>
                                {mergeFiles.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className='flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm'
                                    >
                                        <div className='flex items-center gap-3 truncate'>
                                            <span className='w-6 text-center text-gray-400 font-mono text-xs font-bold'>
                                                {idx + 1}
                                            </span>
                                            <span className='text-red-500 text-base'>📄</span>
                                            <div className='truncate'>
                                                <div className='font-semibold text-gray-900 dark:text-white truncate max-w-xs sm:max-w-md'>
                                                    {item.name}
                                                </div>
                                                <div className='text-[11px] text-gray-500 flex items-center gap-2'>
                                                    <span>{item.size}</span>
                                                    {item.pageCount && (
                                                        <span>• {item.pageCount} {isVi ? "trang" : "pages"}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-1 shrink-0'>
                                            <button
                                                type='button'
                                                disabled={idx === 0}
                                                onClick={() => moveItem(idx, "up")}
                                                className='p-1 text-gray-500 hover:text-blue-600 disabled:opacity-30 cursor-pointer'
                                                title={t.moveUp}
                                            >
                                                ▲
                                            </button>
                                            <button
                                                type='button'
                                                disabled={idx === mergeFiles.length - 1}
                                                onClick={() => moveItem(idx, "down")}
                                                className='p-1 text-gray-500 hover:text-blue-600 disabled:opacity-30 cursor-pointer'
                                                title={t.moveDown}
                                            >
                                                ▼
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => removeItem(item.id)}
                                                className='p-1 text-gray-400 hover:text-red-500 cursor-pointer'
                                                title={t.remove}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='flex items-center gap-3 pt-2 flex-wrap'>
                                <Button
                                    onClick={handleMerge}
                                    disabled={isMerging || mergeFiles.length < 2}
                                    variant='primary'
                                    size='lg'
                                    className='flex-1 py-3 font-bold'
                                >
                                    {isMerging ? t.merging : t.mergeButton}
                                </Button>

                                {mergedUrl && (
                                    <a
                                        href={mergedUrl}
                                        download='merged_document.pdf'
                                        className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all'
                                    >
                                        <span>💾</span>
                                        <span>{t.downloadMerged}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Split Tab Content */}
            {activeTab === "split" && (
                <div className='w-full space-y-6'>
                    {/* Dropzone */}
                    <div
                        onClick={() => splitInputRef.current?.click()}
                        className='w-full p-8 rounded-3xl border-2 border-dashed border-indigo-300 dark:border-indigo-700/60 bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 transition-all text-center cursor-pointer space-y-3'
                    >
                        <input
                            ref={splitInputRef}
                            type='file'
                            accept='.pdf,application/pdf'
                            onChange={handleSplitFileSelect}
                            className='hidden'
                        />
                        <div className='text-4xl'>✂️</div>
                        <div className='font-bold text-base sm:text-lg text-gray-900 dark:text-white'>
                            {splitFile ? splitFile.name : t.dropSplitTitle}
                        </div>
                        <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto'>
                            {splitFile
                                ? `${formatSize(splitFile.size)} • ${splitTotalPages} ${isVi ? "trang" : "pages"}`
                                : t.dropSplitSubtitle}
                        </p>
                    </div>

                    {/* Split Options */}
                    {splitFile && (
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4'>
                            <h3 className='font-bold text-base text-gray-900 dark:text-white'>
                                {t.splitOptions}
                            </h3>

                            <div>
                                <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1'>
                                    {t.pageRangeLabel}
                                </label>
                                <input
                                    type='text'
                                    value={pageRange}
                                    onChange={(e) => setPageRange(e.target.value)}
                                    placeholder={t.pageRangePlaceholder}
                                    className='w-full px-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 font-mono text-gray-900 dark:text-white'
                                />
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                    {t.pageRangeHint} (1 - {splitTotalPages})
                                </p>
                            </div>

                            <div className='flex items-center gap-3 pt-2 flex-wrap'>
                                <Button
                                    onClick={handleSplit}
                                    disabled={isSplitting}
                                    variant='primary'
                                    size='lg'
                                    className='flex-1 py-3 font-bold bg-indigo-600 hover:bg-indigo-700'
                                >
                                    {isSplitting ? t.splitting : t.splitButton}
                                </Button>

                                {splitUrl && (
                                    <a
                                        href={splitUrl}
                                        download={`split_${splitFile.name}`}
                                        className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all'
                                    >
                                        <span>💾</span>
                                        <span>{t.downloadSplit}</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Privacy Guarantee Note */}
            <div className='w-full p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-3'>
                <span className='text-lg'>🔒</span>
                <span>{t.privacyNotice}</span>
            </div>
        </div>
    );
}
