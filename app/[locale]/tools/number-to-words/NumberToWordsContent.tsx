"use client";

import { useState, useMemo, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { numberToWordsTranslations } from "@/lib/i18n/tools/number-to-words";
import { toast } from "@/components/ui/Toast";

// --- VIETNAMESE CONVERTER ALGORITHM ---
const VI_DIGITS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

function convertThreeDigitsVi(
    c: number,
    t: number,
    u: number,
    isHighest: boolean,
    useLinh: boolean
): string {
    let result = "";

    if (c !== 0 || !isHighest) {
        result += `${VI_DIGITS[c]} trăm `;
    }

    if (t === 0 && u !== 0) {
        if (!isHighest || c !== 0) {
            result += useLinh ? "linh " : "lẻ ";
        }
        result += VI_DIGITS[u];
    } else if (t === 1) {
        result += "mười ";
        if (u === 5) {
            result += "lăm";
        } else if (u !== 0) {
            result += VI_DIGITS[u];
        }
    } else if (t > 1) {
        result += `${VI_DIGITS[t]} mươi `;
        if (u === 1) {
            result += "mốt";
        } else if (u === 4) {
            result += "tư";
        } else if (u === 5) {
            result += "lăm";
        } else if (u !== 0) {
            result += VI_DIGITS[u];
        }
    }

    return result.trim();
}

function convertNumberToWordsVi(
    inputStr: string,
    useLinh: boolean,
    currency: "none" | "vnd" | "usd"
): string {
    const cleanStr = inputStr.trim().replace(/,/g, "");
    if (!cleanStr || isNaN(Number(cleanStr))) return "";

    const isNegative = cleanStr.startsWith("-");
    const rawVal = isNegative ? cleanStr.slice(1) : cleanStr;

    const parts = rawVal.split(".");
    const integerPart = parts[0] || "0";
    const decimalPart = parts[1] || "";

    if (integerPart === "0" && !decimalPart) {
        return (isNegative ? "âm " : "") + "không" + (currency === "vnd" ? " đồng" : "");
    }

    // Split into 3-digit groups from right
    const groups: string[] = [];
    let tempInt = integerPart;
    while (tempInt.length > 0) {
        const chunk = tempInt.slice(-3);
        groups.unshift(chunk);
        tempInt = tempInt.slice(0, -3);
    }

    const scales = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ", "tỷ tỷ"];
    let wordsArr: string[] = [];

    const totalGroups = groups.length;
    for (let i = 0; i < totalGroups; i++) {
        const groupVal = parseInt(groups[i], 10);
        if (groupVal === 0 && totalGroups > 1) continue;

        const padded = groups[i].padStart(3, "0");
        const c = parseInt(padded[0], 10);
        const t = parseInt(padded[1], 10);
        const u = parseInt(padded[2], 10);

        const groupWords = convertThreeDigitsVi(c, t, u, i === 0, useLinh);
        const scaleIdx = totalGroups - 1 - i;
        const scale = scales[scaleIdx] || "";

        if (groupWords) {
            wordsArr.push(groupWords + (scale ? ` ${scale}` : ""));
        }
    }

    let result = wordsArr.join(" ");

    // Handle decimals
    if (decimalPart) {
        result += " phẩy";
        for (let i = 0; i < decimalPart.length; i++) {
            const digit = parseInt(decimalPart[i], 10);
            result += ` ${VI_DIGITS[digit]}`;
        }
    }

    if (isNegative) {
        result = "âm " + result;
    }

    if (currency === "vnd") {
        result += decimalPart ? " đồng" : " đồng chẵn";
    } else if (currency === "usd") {
        result += " đô la Mỹ";
    }

    return result.replace(/\s+/g, " ").trim();
}

// --- ENGLISH CONVERTER ALGORITHM ---
const EN_ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const EN_TEENS = [
    "ten", "eleven", "twelve", "thirteen", "fourteen",
    "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
];
const EN_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const EN_SCALES = ["", "thousand", "million", "billion", "trillion", "quadrillion"];

function convertThreeDigitsEn(c: number, t: number, u: number): string {
    let res = "";
    if (c > 0) {
        res += `${EN_ONES[c]} hundred `;
    }
    if (t === 1) {
        res += EN_TEENS[u];
    } else if (t > 1) {
        res += EN_TENS[t];
        if (u > 0) {
            res += `-${EN_ONES[u]}`;
        }
    } else if (u > 0) {
        res += EN_ONES[u];
    }
    return res.trim();
}

function convertNumberToWordsEn(
    inputStr: string,
    currency: "none" | "vnd" | "usd"
): string {
    const cleanStr = inputStr.trim().replace(/,/g, "");
    if (!cleanStr || isNaN(Number(cleanStr))) return "";

    const isNegative = cleanStr.startsWith("-");
    const rawVal = isNegative ? cleanStr.slice(1) : cleanStr;

    const parts = rawVal.split(".");
    const integerPart = parts[0] || "0";
    const decimalPart = parts[1] || "";

    if (integerPart === "0" && !decimalPart) {
        return (isNegative ? "negative " : "") + "zero" + (currency === "usd" ? " dollars" : "");
    }

    const groups: string[] = [];
    let tempInt = integerPart;
    while (tempInt.length > 0) {
        const chunk = tempInt.slice(-3);
        groups.unshift(chunk);
        tempInt = tempInt.slice(0, -3);
    }

    let wordsArr: string[] = [];
    const totalGroups = groups.length;

    for (let i = 0; i < totalGroups; i++) {
        const groupVal = parseInt(groups[i], 10);
        if (groupVal === 0) continue;

        const padded = groups[i].padStart(3, "0");
        const c = parseInt(padded[0], 10);
        const t = parseInt(padded[1], 10);
        const u = parseInt(padded[2], 10);

        const groupWords = convertThreeDigitsEn(c, t, u);
        const scaleIdx = totalGroups - 1 - i;
        const scale = EN_SCALES[scaleIdx] || "";

        if (groupWords) {
            wordsArr.push(groupWords + (scale ? ` ${scale}` : ""));
        }
    }

    let result = wordsArr.join(" ");

    // Handle currency and decimals
    if (currency === "usd") {
        result += result === "one" ? " dollar" : " dollars";
        if (decimalPart) {
            const cents = parseInt(decimalPart.slice(0, 2).padEnd(2, "0"), 10);
            if (cents > 0) {
                const cTens = Math.floor(cents / 10);
                const cOnes = cents % 10;
                result += ` and ${convertThreeDigitsEn(0, cTens, cOnes)} ${cents === 1 ? "cent" : "cents"}`;
            }
        }
    } else {
        if (decimalPart) {
            result += " point";
            for (let i = 0; i < decimalPart.length; i++) {
                const d = parseInt(decimalPart[i], 10);
                result += ` ${EN_ONES[d] || "zero"}`;
            }
        }
        if (currency === "vnd") {
            result += " Vietnam Dong";
        }
    }

    if (isNegative) {
        result = "negative " + result;
    }

    return result.replace(/\s+/g, " ").trim();
}

// Format Casing
function applyCase(text: string, style: "sentence" | "title" | "upper" | "lower"): string {
    if (!text) return "";
    switch (style) {
        case "sentence":
            return text.charAt(0).toUpperCase() + text.slice(1);
        case "title":
            return text.replace(/\b\w/g, (char) => char.toUpperCase());
        case "upper":
            return text.toUpperCase();
        case "lower":
            return text.toLowerCase();
    }
}

export default function NumberToWordsContent() {
    const { locale } = useLanguage();
    const t = numberToWordsTranslations[locale as "en" | "vi"] || numberToWordsTranslations.en;
    const isVi = locale === "vi";

    const [inputValue, setInputValue] = useState<string>("1250000");
    const [targetLang, setTargetLang] = useState<"vi" | "en">(isVi ? "vi" : "en");
    const [currency, setCurrency] = useState<"none" | "vnd" | "usd">("vnd");
    const [useLinh, setUseLinh] = useState<boolean>(true);
    const [caseStyle, setCaseStyle] = useState<"sentence" | "title" | "upper" | "lower">("sentence");
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    // Compute converted words
    const convertedWords = useMemo(() => {
        if (!inputValue) return "";
        let rawWords = "";
        if (targetLang === "vi") {
            rawWords = convertNumberToWordsVi(inputValue, useLinh, currency);
        } else {
            rawWords = convertNumberToWordsEn(inputValue, currency);
        }
        return applyCase(rawWords, caseStyle);
    }, [inputValue, targetLang, useLinh, currency, caseStyle]);

    // Copy to clipboard
    const handleCopy = () => {
        if (!convertedWords) return;
        navigator.clipboard.writeText(convertedWords);
        toast.success(t.copied);
    };

    // Text-to-Speech Pronunciation
    const handleSpeak = useCallback(() => {
        if (!convertedWords || typeof window === "undefined" || !("speechSynthesis" in window)) {
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(convertedWords);
        utterance.lang = targetLang === "vi" ? "vi-VN" : "en-US";
        utterance.rate = 0.95;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [convertedWords, targetLang]);

    // Presets
    const presets = ["500000", "1250000", "15000000", "500000000", "1000000000", "99.99"];

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-6'>
            {/* Input & Settings Card */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-gray-200 dark:border-gray-800 space-y-6'>
                {/* Main Number Input */}
                <div>
                    <div className='flex items-center justify-between mb-2'>
                        <label className='text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300'>
                            🔢 {t.inputLabel}
                        </label>
                        {inputValue && (
                            <button
                                onClick={() => setInputValue("")}
                                className='text-xs font-semibold text-gray-400 hover:text-red-500 cursor-pointer transition-colors'
                            >
                                ✕ {t.clear}
                            </button>
                        )}
                    </div>
                    <div className='relative'>
                        <input
                            type='text'
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value.replace(/[^0-9.-]/g, ""))}
                            placeholder={t.inputPlaceholder}
                            className='w-full px-5 py-4 text-xl sm:text-2xl font-black font-mono rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all'
                        />
                    </div>
                </div>

                {/* Quick Presets */}
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='text-xs font-semibold text-gray-400 mr-1'>⚡ {t.presets}:</span>
                    {presets.map((p) => (
                        <button
                            key={p}
                            onClick={() => setInputValue(p)}
                            className='px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700'
                        >
                            {parseInt(p, 10).toLocaleString()}
                        </button>
                    ))}
                </div>

                {/* Options Toolbar */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800'>
                    {/* Language Selector */}
                    <div>
                        <label className='block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5'>
                            🌐 {t.language}
                        </label>
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value as "vi" | "en")}
                            className='w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs font-semibold cursor-pointer'
                        >
                            <option value='vi'>{t.langVietnamese}</option>
                            <option value='en'>{t.langEnglish}</option>
                        </select>
                    </div>

                    {/* Currency Selector */}
                    <div>
                        <label className='block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5'>
                            💰 {t.currencyOption}
                        </label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as "none" | "vnd" | "usd")}
                            className='w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs font-semibold cursor-pointer'
                        >
                            <option value='none'>{t.currencyNone}</option>
                            <option value='vnd'>{t.currencyVnd}</option>
                            <option value='usd'>{t.currencyUsd}</option>
                        </select>
                    </div>

                    {/* Case Styling */}
                    <div>
                        <label className='block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5'>
                            🔤 {t.caseOption}
                        </label>
                        <select
                            value={caseStyle}
                            onChange={(e) => setCaseStyle(e.target.value as any)}
                            className='w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs font-semibold cursor-pointer'
                        >
                            <option value='sentence'>{t.caseSentence}</option>
                            <option value='title'>{t.caseTitle}</option>
                            <option value='upper'>{t.caseUpper}</option>
                            <option value='lower'>{t.caseLower}</option>
                        </select>
                    </div>
                </div>

                {/* Dialect Switcher (for Vietnamese) */}
                {targetLang === "vi" && (
                    <div className='flex items-center gap-4 text-xs pt-1'>
                        <span className='font-bold text-gray-600 dark:text-gray-400'>
                            🗣️ {t.vietnameseStyle}:
                        </span>
                        <label className='flex items-center gap-1.5 cursor-pointer text-gray-700 dark:text-gray-300'>
                            <input
                                type='radio'
                                name='viStyle'
                                checked={useLinh}
                                onChange={() => setUseLinh(true)}
                                className='accent-blue-600'
                            />
                            <span>{t.styleLinh}</span>
                        </label>
                        <label className='flex items-center gap-1.5 cursor-pointer text-gray-700 dark:text-gray-300'>
                            <input
                                type='radio'
                                name='viStyle'
                                checked={!useLinh}
                                onChange={() => setUseLinh(false)}
                                className='accent-blue-600'
                            />
                            <span>{t.styleLe}</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Converted Words Result Card */}
            <div className='w-full bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-800/80 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] shadow-sm border border-blue-100 dark:border-gray-700 space-y-5'>
                <div className='flex items-center justify-between'>
                    <span className='text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2'>
                        <span>✨</span> {t.resultLabel}
                    </span>
                    <span className='text-xs font-mono text-gray-400'>
                        {convertedWords.split(/\s+/).filter(Boolean).length} words
                    </span>
                </div>

                <div className='min-h-[90px] p-5 rounded-2xl bg-white dark:bg-gray-800/90 border border-blue-200/60 dark:border-gray-700 shadow-inner flex items-center justify-start'>
                    <p className='text-base sm:text-xl font-bold text-gray-900 dark:text-white leading-relaxed select-all break-words'>
                        {convertedWords || (
                            <span className='text-gray-400 font-normal italic'>
                                {isVi ? "Nhập số ở trên để xem kết quả đọc chữ..." : "Enter a number above to see words..."}
                            </span>
                        )}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap items-center gap-3'>
                    <Button
                        onClick={handleCopy}
                        disabled={!convertedWords}
                        variant='primary'
                        size='md'
                        className='cursor-pointer text-xs font-bold'
                    >
                        📋 {t.copyResult}
                    </Button>

                    <Button
                        onClick={handleSpeak}
                        disabled={!convertedWords || isSpeaking}
                        variant='secondary'
                        size='md'
                        className='cursor-pointer text-xs font-bold'
                    >
                        {isSpeaking ? "🔊 " + t.speaking : "🗣️ " + t.speakResult}
                    </Button>
                </div>
            </div>

            {/* SEO & Financial Invoicing Guide */}
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
