"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { jsonDiffTranslations } from "@/lib/i18n/tools/json-diff";

type DiffType = "added" | "removed" | "modified" | "unchanged";

interface DiffLine {
    path: string;
    type: DiffType;
    leftValue?: string;
    rightValue?: string;
}

const SAMPLE_LEFT = `{
  "id": 101,
  "name": "AnyTools Studio",
  "version": "1.0.0",
  "active": true,
  "features": ["speed-test", "pdf-tools", "json-formatter"],
  "config": {
    "theme": "dark",
    "timeout": 3000
  },
  "deprecatedField": "legacy"
}`;

const SAMPLE_RIGHT = `{
  "id": 101,
  "name": "AnyTools Studio Pro",
  "version": "2.0.0",
  "active": true,
  "features": ["speed-test", "pdf-tools", "typing-test", "audio-trimmer"],
  "config": {
    "theme": "dark",
    "timeout": 5000,
    "retries": 3
  },
  "newFeatureFlag": true
}`;

export default function JsonDiffContent() {
    const { locale } = useLanguage();
    const t = jsonDiffTranslations[locale as "en" | "vi"] || jsonDiffTranslations.en;
    const isVi = locale === "vi";

    const [leftJson, setLeftJson] = useState<string>(SAMPLE_LEFT);
    const [rightJson, setRightJson] = useState<string>(SAMPLE_RIGHT);

    // Format both JSONs
    const handleFormat = () => {
        try {
            if (leftJson.trim()) {
                const parsedLeft = JSON.parse(leftJson);
                setLeftJson(JSON.stringify(parsedLeft, null, 2));
            }
        } catch (e) {}

        try {
            if (rightJson.trim()) {
                const parsedRight = JSON.parse(rightJson);
                setRightJson(JSON.stringify(parsedRight, null, 2));
            }
        } catch (e) {}
    };

    const handleClear = () => {
        setLeftJson("");
        setRightJson("");
    };

    const handleLoadSample = () => {
        setLeftJson(SAMPLE_LEFT);
        setRightJson(SAMPLE_RIGHT);
    };

    // Calculate diff
    const diffResult = useMemo(() => {
        let parsedLeft: any = null;
        let parsedRight: any = null;
        let leftError = false;
        let rightError = false;

        try {
            if (leftJson.trim()) parsedLeft = JSON.parse(leftJson);
        } catch {
            leftError = true;
        }

        try {
            if (rightJson.trim()) parsedRight = JSON.parse(rightJson);
        } catch {
            rightError = true;
        }

        if (leftError || rightError) {
            return {
                hasError: true,
                leftError,
                rightError,
                diffs: [],
                stats: { added: 0, removed: 0, modified: 0 },
            };
        }

        if (!parsedLeft && !parsedRight) {
            return { hasError: false, diffs: [], stats: { added: 0, removed: 0, modified: 0 } };
        }

        const diffs: DiffLine[] = [];
        const stats = { added: 0, removed: 0, modified: 0 };

        const compare = (left: any, right: any, currentPath: string) => {
            if (left === right) return;

            const isLeftObj = left !== null && typeof left === "object";
            const isRightObj = right !== null && typeof right === "object";

            if (isLeftObj && isRightObj) {
                const allKeys = Array.from(new Set([...Object.keys(left), ...Object.keys(right)]));
                for (const k of allKeys) {
                    const subPath = currentPath ? `${currentPath}.${k}` : k;
                    if (!(k in left)) {
                        diffs.push({
                            path: subPath,
                            type: "added",
                            rightValue: JSON.stringify(right[k], null, 2),
                        });
                        stats.added++;
                    } else if (!(k in right)) {
                        diffs.push({
                            path: subPath,
                            type: "removed",
                            leftValue: JSON.stringify(left[k], null, 2),
                        });
                        stats.removed++;
                    } else {
                        compare(left[k], right[k], subPath);
                    }
                }
            } else {
                diffs.push({
                    path: currentPath || "root",
                    type: "modified",
                    leftValue: JSON.stringify(left),
                    rightValue: JSON.stringify(right),
                });
                stats.modified++;
            }
        };

        compare(parsedLeft || {}, parsedRight || {}, "");

        return {
            hasError: false,
            diffs,
            stats,
        };
    }, [leftJson, rightJson]);

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Top Toolbar */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3'>
                <div className='flex items-center gap-2'>
                    <Button onClick={handleFormat} variant='primary' size='sm' className='font-bold cursor-pointer'>
                        ✨ {t.formatJson}
                    </Button>
                    <button
                        type='button'
                        onClick={handleLoadSample}
                        className='px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer'
                    >
                        📋 {t.loadSample}
                    </button>
                    <button
                        type='button'
                        onClick={handleClear}
                        className='px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:underline cursor-pointer'
                    >
                        ✕ {t.clearBoth}
                    </button>
                </div>

                {/* Diff Stats Badges */}
                {!diffResult.hasError && (
                    <div className='flex items-center gap-2 text-xs font-mono font-bold'>
                        <span className='px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'>
                            +{diffResult.stats.added} {t.added}
                        </span>
                        <span className='px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60'>
                            -{diffResult.stats.removed} {t.removed}
                        </span>
                        <span className='px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'>
                            ~{diffResult.stats.modified} {t.modified}
                        </span>
                    </div>
                )}
            </div>

            {/* JSON Input Textareas (Side-by-Side) */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                {/* Left JSON */}
                <div className='bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-2'>
                    <div className='flex items-center justify-between'>
                        <label className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                            {t.originalJson}
                        </label>
                        {diffResult.leftError && (
                            <span className='text-xs font-semibold text-red-500'>
                                ⚠️ {t.invalidJsonLeft}
                            </span>
                        )}
                    </div>
                    <textarea
                        rows={12}
                        value={leftJson}
                        onChange={(e) => setLeftJson(e.target.value)}
                        placeholder={t.pasteLeft}
                        className={`w-full p-3 font-mono text-xs sm:text-sm bg-gray-50 dark:bg-gray-800/80 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white ${
                            diffResult.leftError
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-700"
                        }`}
                    />
                </div>

                {/* Right JSON */}
                <div className='bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-2'>
                    <div className='flex items-center justify-between'>
                        <label className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                            {t.modifiedJson}
                        </label>
                        {diffResult.rightError && (
                            <span className='text-xs font-semibold text-red-500'>
                                ⚠️ {t.invalidJsonRight}
                            </span>
                        )}
                    </div>
                    <textarea
                        rows={12}
                        value={rightJson}
                        onChange={(e) => setRightJson(e.target.value)}
                        placeholder={t.pasteRight}
                        className={`w-full p-3 font-mono text-xs sm:text-sm bg-gray-50 dark:bg-gray-800/80 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white ${
                            diffResult.rightError
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 dark:border-gray-700"
                        }`}
                    />
                </div>
            </div>

            {/* Visual Diff Results Box */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3'>
                    <h3 className='font-bold text-base text-gray-900 dark:text-white flex items-center gap-2'>
                        <span>🔍</span>
                        <span>{t.diffTitle}</span>
                    </h3>
                    <span className='text-xs text-gray-500'>
                        {diffResult.diffs.length} {t.changesDetected}
                    </span>
                </div>

                {diffResult.diffs.length === 0 && !diffResult.hasError && (
                    <div className='text-center py-8 text-emerald-600 dark:text-emerald-400 font-semibold text-sm'>
                        ✓ {t.noChanges}
                    </div>
                )}

                {diffResult.diffs.length > 0 && (
                    <div className='space-y-2.5 max-h-96 overflow-y-auto pr-1'>
                        {diffResult.diffs.map((diff, idx) => (
                            <div
                                key={idx}
                                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-mono transition-all ${
                                    diff.type === "added"
                                        ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300"
                                        : diff.type === "removed"
                                        ? "bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-300"
                                        : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300"
                                }`}
                            >
                                <div className='flex items-center justify-between mb-1.5'>
                                    <span className='font-bold flex items-center gap-1.5'>
                                        <span>
                                            {diff.type === "added" && "➕"}
                                            {diff.type === "removed" && "➖"}
                                            {diff.type === "modified" && "🔄"}
                                        </span>
                                        <span>{diff.path}</span>
                                    </span>
                                    <span className='uppercase font-extrabold text-[10px] tracking-wider px-2 py-0.5 rounded-md bg-white/70 dark:bg-gray-800/80'>
                                        {diff.type}
                                    </span>
                                </div>

                                {diff.type === "modified" && (
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-amber-200/60 dark:border-amber-800/40 text-xs'>
                                        <div>
                                            <span className='text-red-500 font-bold mr-1'>-</span>
                                            <span className='line-through opacity-75'>{diff.leftValue}</span>
                                        </div>
                                        <div>
                                            <span className='text-emerald-500 font-bold mr-1'>+</span>
                                            <span className='font-semibold'>{diff.rightValue}</span>
                                        </div>
                                    </div>
                                )}

                                {diff.type === "added" && (
                                    <div className='text-xs opacity-90 break-all'>
                                        <span className='font-bold text-emerald-600 mr-1'>+</span>
                                        {diff.rightValue}
                                    </div>
                                )}

                                {diff.type === "removed" && (
                                    <div className='text-xs opacity-75 line-through break-all'>
                                        <span className='font-bold text-red-500 mr-1'>-</span>
                                        {diff.leftValue}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
