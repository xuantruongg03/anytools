"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { quizletExporterTranslations } from "@/lib/i18n/tools/quizlet-exporter";
import { toast } from "@/components/ui/Toast";

interface Flashcard {
    term: string;
    definition: string;
}

const SAMPLE_INPUT = `algorithm\ta step-by-step procedure for solving a problem or performing a task
binary search\tan efficient algorithm for finding an item from a sorted list of items with O(log n) time complexity
cache\ta high-speed data storage layer which stores a subset of data for fast retrieval
polymorphism\tthe ability of an object to take on many forms in object-oriented programming
recursion\ta process in which a function calls itself directly or indirectly
closure\ta combination of a function bundled together with references to its surrounding state`;

export default function QuizletExporterContent() {
    const { locale } = useLanguage();
    const t = quizletExporterTranslations[locale as "en" | "vi"] || quizletExporterTranslations.en;

    const [inputText, setInputText] = useState<string>(SAMPLE_INPUT);
    const [termSep, setTermSep] = useState<"tab" | "comma" | "dash">("tab");
    const [rowSep, setRowSep] = useState<"newline" | "semicolon">("newline");
    const [exportFormat, setExportFormat] = useState<"anki" | "csv" | "notion" | "json">("anki");
    const [swap, setSwap] = useState<boolean>(false);
    const [dedupe, setDedupe] = useState<boolean>(true);

    // Parse Cards
    const parsedCards = useMemo<Flashcard[]>(() => {
        if (!inputText.trim()) return [];

        const rSepChar = rowSep === "newline" ? "\n" : ";";
        const rows = inputText.split(rSepChar).map((r) => r.trim()).filter(Boolean);

        const cards: Flashcard[] = [];
        const seenTerms = new Set<string>();

        rows.forEach((row) => {
            let parts: string[] = [];
            if (termSep === "tab") {
                parts = row.split("\t");
            } else if (termSep === "comma") {
                parts = row.split(",");
            } else if (termSep === "dash") {
                parts = row.split(/\s+-\s+/);
            }

            if (parts.length >= 2) {
                let term = parts[0].trim();
                let definition = parts.slice(1).join(" ").trim();

                if (swap) {
                    const temp = term;
                    term = definition;
                    definition = temp;
                }

                if (dedupe) {
                    const key = term.toLowerCase();
                    if (seenTerms.has(key)) return;
                    seenTerms.add(key);
                }

                cards.push({ term, definition });
            }
        });

        return cards;
    }, [inputText, termSep, rowSep, swap, dedupe]);

    // Format output string
    const formattedOutput = useMemo(() => {
        if (parsedCards.length === 0) return "";

        switch (exportFormat) {
            case "anki":
                return parsedCards.map((c) => `${c.term}\t${c.definition}`).join("\n");

            case "csv":
                const csvRows = parsedCards.map(
                    (c) => `"${c.term.replace(/"/g, '""')}","${c.definition.replace(/"/g, '""')}"`
                );
                return `Term,Definition\n${csvRows.join("\n")}`;

            case "notion":
                const mdRows = parsedCards.map(
                    (c) => `| ${c.term.replace(/\|/g, "\\|")} | ${c.definition.replace(/\|/g, "\\|")} |`
                );
                return `| Term | Definition |\n| --- | --- |\n${mdRows.join("\n")}`;

            case "json":
                return JSON.stringify(parsedCards, null, 2);
        }
    }, [parsedCards, exportFormat]);

    const handleCopy = () => {
        if (!formattedOutput) return;
        navigator.clipboard.writeText(formattedOutput);
        toast.success(t.copied);
    };

    const handleDownload = () => {
        if (!formattedOutput) return;
        const extMap = { anki: "txt", csv: "csv", notion: "md", json: "json" };
        const blob = new Blob([formattedOutput], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `quizlet_deck.${extMap[exportFormat]}`;
        link.click();
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-6xl mx-auto space-y-6'>
            {/* Top Toolbar: Options */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center gap-3 text-xs'>
                    {/* Term Separator */}
                    <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>✂️ {t.termSeparator}:</span>
                        <select
                            value={termSep}
                            onChange={(e) => setTermSep(e.target.value as any)}
                            className='px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer'
                        >
                            <option value='tab'>{t.sepTab}</option>
                            <option value='comma'>{t.sepComma}</option>
                            <option value='dash'>{t.sepDash}</option>
                        </select>
                    </div>

                    {/* Export Format */}
                    <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>📦 {t.exportFormat}:</span>
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value as any)}
                            className='px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer'
                        >
                            <option value='anki'>{t.formatAnki}</option>
                            <option value='csv'>{t.formatCsv}</option>
                            <option value='notion'>{t.formatNotion}</option>
                            <option value='json'>{t.formatJson}</option>
                        </select>
                    </div>

                    {/* Toggles */}
                    <label className='flex items-center gap-1.5 font-semibold text-gray-600 dark:text-gray-400 cursor-pointer'>
                        <input
                            type='checkbox'
                            checked={swap}
                            onChange={(e) => setSwap(e.target.checked)}
                            className='rounded accent-blue-600'
                        />
                        <span>🔄 {t.swapCards}</span>
                    </label>

                    <label className='flex items-center gap-1.5 font-semibold text-gray-600 dark:text-gray-400 cursor-pointer'>
                        <input
                            type='checkbox'
                            checked={dedupe}
                            onChange={(e) => setDedupe(e.target.checked)}
                            className='rounded accent-blue-600'
                        />
                        <span>🧹 {t.dedupeCards}</span>
                    </label>
                </div>

                <div className='flex items-center gap-2'>
                    <span className='px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'>
                        {parsedCards.length} {t.cardCount}
                    </span>
                </div>
            </div>

            {/* Dual Split Editor */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {/* Left: Input Text */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                            <span>📝</span> {t.inputLabel}
                        </span>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setInputText(SAMPLE_INPUT)}
                                className='text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                            >
                                ⚡ {t.presets}
                            </button>
                            {inputText && (
                                <button
                                    onClick={() => setInputText("")}
                                    className='text-xs font-semibold text-gray-400 hover:text-red-500 cursor-pointer'
                                >
                                    ✕ {t.clear}
                                </button>
                            )}
                        </div>
                    </div>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t.inputPlaceholder}
                        rows={16}
                        className='w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed'
                    />
                </div>

                {/* Right: Formatted Output */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2'>
                            <span>✨</span> {t.outputLabel}
                        </span>
                        <div className='flex items-center gap-2'>
                            <Button
                                onClick={handleCopy}
                                disabled={!formattedOutput}
                                variant='primary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                📋 {t.copyOutput}
                            </Button>
                            <Button
                                onClick={handleDownload}
                                disabled={!formattedOutput}
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                💾 {t.downloadDeck}
                            </Button>
                        </div>
                    </div>
                    <textarea
                        readOnly
                        value={formattedOutput}
                        rows={16}
                        className='w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-900 text-emerald-400 font-mono text-xs sm:text-sm focus:outline-hidden resize-none leading-relaxed'
                    />
                </div>
            </div>

            {/* Visual Card Preview Grid */}
            {parsedCards.length > 0 && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                    <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between'>
                        <span className='flex items-center gap-2'>
                            <span>🎴</span> Live Flashcard Deck Preview
                        </span>
                        <span className='text-xs text-gray-400 font-normal'>
                            {parsedCards.length} cards
                        </span>
                    </h4>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1'>
                        {parsedCards.map((card, idx) => (
                            <div
                                key={idx}
                                className='p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-1.5'
                            >
                                <div className='text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between'>
                                    <span>{card.term}</span>
                                    <span className='text-[10px] text-gray-400'>#{idx + 1}</span>
                                </div>
                                <div className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {card.definition}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SEO & Guide */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>💡</span> {t.guideTitle}
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>1. {t.guide1Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide1Desc}</p>
                    </div>

                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>2. {t.guide2Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide2Desc}</p>
                    </div>

                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>3. {t.guide3Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
