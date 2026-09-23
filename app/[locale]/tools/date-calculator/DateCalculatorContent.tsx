"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { dateCalculatorTranslations } from "@/lib/i18n/tools/date-calculator";

// Lightweight Inline Icons
const CalendarIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const ClockIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const PlusIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);
const MinusIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
);
const HeartIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);
const MoonIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
const SparklesIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);
const BriefcaseIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const SunIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const BookOpenIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);
const HelpCircleIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ChevronDownIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
const ChevronUpIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

// Helpers
function getIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

// Astrological Zodiac helper
function getZodiac(month: number, day: number): { en: string; vi: string; icon: string } {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { en: "Aries (Ram)", vi: "Bạch Dương ♈", icon: "♈" };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { en: "Taurus (Bull)", vi: "Kim Ngưu ♉", icon: "♉" };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { en: "Gemini (Twins)", vi: "Song Tử ♊", icon: "♊" };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { en: "Cancer (Crab)", vi: "Cự Giải ♋", icon: "♋" };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { en: "Leo (Lion)", vi: "Sư Tử ♌", icon: "♌" };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { en: "Virgo (Maiden)", vi: "Xử Nữ ♍", icon: "♍" };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { en: "Libra (Scales)", vi: "Thiên Bình ♎", icon: "♎" };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { en: "Scorpio (Scorpion)", vi: "Bọ Cạp ♏", icon: "♏" };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { en: "Sagittarius (Archer)", vi: "Nhân Mã ♐", icon: "♐" };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { en: "Capricorn (Goat)", vi: "Ma Kết ♑", icon: "♑" };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { en: "Aquarius (Water Bearer)", vi: "Bảo Bình ♒", icon: "♒" };
    return { en: "Pisces (Fish)", vi: "Song Ngư ♓", icon: "♓" };
}

// Chinese Zodiac Year
const chineseAnimals = [
    { en: "Rat 🐀", vi: "Tý (Chuột) 🐀" },
    { en: "Ox 🐂", vi: "Sửu (Trâu) 🐂" },
    { en: "Tiger 🐅", vi: "Dần (Hổ) 🐅" },
    { en: "Rabbit / Cat 🐇", vi: "Mão (Mèo) 🐱" },
    { en: "Dragon 🐉", vi: "Thìn (Rồng) 🐉" },
    { en: "Snake 🐍", vi: "Tỵ (Rắn) 🐍" },
    { en: "Horse 🐎", vi: "Ngọ (Ngựa) 🐎" },
    { en: "Goat 🐐", vi: "Mùi (Dê) 🐐" },
    { en: "Monkey 🐒", vi: "Thân (Khỉ) 🐒" },
    { en: "Rooster 🐓", vi: "Dậu (Gà) 🐓" },
    { en: "Dog 🐕", vi: "Tuất (Chó) 🐕" },
    { en: "Pig 🐖", vi: "Hợi (Heo) 🐖" },
];

function getChineseZodiac(year: number) {
    const offset = (year - 4) % 12;
    return chineseAnimals[(offset + 12) % 12];
}

export default function DateCalculatorContent() {
    const { locale } = useLanguage();
    const t = dateCalculatorTranslations[locale as "en" | "vi"] || dateCalculatorTranslations.en;
    const isVi = locale === "vi";

    const [activeTab, setActiveTab] = useState<"between" | "addsub" | "age">("between");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Tab 1: Days Between
    const todayStr = useMemo(() => getIsoDate(new Date()), []);
    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return getIsoDate(d);
    });
    const [includeEnd, setIncludeEnd] = useState(false);
    const [businessOnly, setBusinessOnly] = useState(false);

    // Tab 2: Add / Subtract
    const [baseDate, setBaseDate] = useState(todayStr);
    const [operation, setOperation] = useState<"add" | "sub">("add");
    const [addYears, setAddYears] = useState(0);
    const [addMonths, setAddMonths] = useState(1);
    const [addWeeks, setAddWeeks] = useState(0);
    const [addDays, setAddDays] = useState(15);

    // Tab 3: Age
    const [birthDate, setBirthDate] = useState("2000-01-01");
    const [asOfDate, setAsOfDate] = useState(todayStr);

    // --- Tab 1 Calculations: Days Between ---
    const betweenResult = useMemo(() => {
        const d1 = new Date(startDate);
        const d2 = new Date(endDate);

        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
            return null;
        }

        const isReversed = d2 < d1;
        const [earlier, later] = isReversed ? [d2, d1] : [d1, d2];

        // Day diff
        const oneDayMs = 24 * 60 * 60 * 1000;
        let diffDays = Math.round((later.getTime() - earlier.getTime()) / oneDayMs);
        if (includeEnd) {
            diffDays += 1;
        }

        // Count business & weekend days
        let workingCount = 0;
        let weekendCount = 0;
        const cur = new Date(earlier);
        const endLoop = new Date(later);
        if (!includeEnd) {
            endLoop.setDate(endLoop.getDate() - 1);
        }

        while (cur <= endLoop) {
            const day = cur.getDay(); // 0 is Sun, 6 is Sat
            if (day === 0 || day === 6) {
                weekendCount++;
            } else {
                workingCount++;
            }
            cur.setDate(cur.getDate() + 1);
        }

        const weeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;
        const monthsApprox = (diffDays / 30.4375).toFixed(1);

        return {
            totalDays: diffDays,
            workingCount,
            weekendCount,
            weeks,
            remainingDays,
            monthsApprox,
            hours: diffDays * 24,
            minutes: diffDays * 24 * 60,
            seconds: diffDays * 24 * 60 * 60,
        };
    }, [startDate, endDate, includeEnd]);

    // --- Tab 2 Calculations: Add / Subtract ---
    const addSubResult = useMemo(() => {
        const d = new Date(baseDate);
        if (isNaN(d.getTime())) return null;

        const factor = operation === "add" ? 1 : -1;
        if (addYears) d.setFullYear(d.getFullYear() + factor * addYears);
        if (addMonths) d.setMonth(d.getMonth() + factor * addMonths);
        const totalDayShift = (addWeeks * 7 + addDays) * factor;
        if (totalDayShift) d.setDate(d.getDate() + totalDayShift);

        const formatted = d.toLocaleDateString(isVi ? "vi-VN" : "en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        return {
            iso: getIsoDate(d),
            formatted,
        };
    }, [baseDate, operation, addYears, addMonths, addWeeks, addDays, isVi]);

    // --- Tab 3 Calculations: Exact Age ---
    const ageResult = useMemo(() => {
        const b = new Date(birthDate);
        const a = new Date(asOfDate);
        if (isNaN(b.getTime()) || isNaN(a.getTime()) || b > a) return null;

        let years = a.getFullYear() - b.getFullYear();
        let months = a.getMonth() - b.getMonth();
        let days = a.getDate() - b.getDate();

        if (days < 0) {
            months -= 1;
            const prevMonthDate = new Date(a.getFullYear(), a.getMonth(), 0);
            days += prevMonthDate.getDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }

        const totalDaysLived = Math.floor((a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000));

        const nextBday = new Date(a.getFullYear(), b.getMonth(), b.getDate());
        if (nextBday < a) {
            nextBday.setFullYear(a.getFullYear() + 1);
        }
        const daysToNext = Math.ceil((nextBday.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));

        const zodiac = getZodiac(b.getMonth() + 1, b.getDate());
        const chinese = getChineseZodiac(b.getFullYear());

        return {
            years,
            months,
            days,
            totalDaysLived,
            daysToNext,
            zodiac: isVi ? zodiac.vi : zodiac.en,
            chinese: isVi ? chinese.vi : chinese.en,
            hoursSlept: Math.round(totalDaysLived * 8),
            heartbeats: Math.round(totalDaysLived * 108000),
        };
    }, [birthDate, asOfDate, isVi]);

    return (
        <div className='space-y-8'>
            {/* Tabs */}
            <div className='flex flex-wrap gap-2 p-1.5 rounded-2xl border border-slate-200/80 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900/60 w-fit'>
                {[
                    { key: "between", label: t.tabBetween, icon: CalendarIcon },
                    { key: "addsub", label: t.tabAddSub, icon: PlusIcon },
                    { key: "age", label: t.tabAge, icon: HeartIcon },
                ].map(tab => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`flex items-center gap-2 rounded-xl px-4 sm:px-5 py-2.5 text-xs font-bold transition ${
                                active
                                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                        >
                            <Icon className='h-4 w-4' />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: DAYS BETWEEN DATES */}
            {activeTab === "between" && (
                <div className='space-y-6'>
                    <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none sm:p-7'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                            {/* Start Date */}
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                        {t.startDate}
                                    </label>
                                    <button
                                        onClick={() => setStartDate(todayStr)}
                                        className='text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline'
                                    >
                                        {t.today}
                                    </button>
                                </div>
                                <input
                                    type='date'
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>

                            {/* End Date */}
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                        {t.endDate}
                                    </label>
                                    <button
                                        onClick={() => setEndDate(todayStr)}
                                        className='text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline'
                                    >
                                        {t.today}
                                    </button>
                                </div>
                                <input
                                    type='date'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>
                        </div>

                        {/* Options checkboxes */}
                        <div className='mt-5 flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs'>
                            <label className='flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium'>
                                <input
                                    type='checkbox'
                                    checked={includeEnd}
                                    onChange={(e) => setIncludeEnd(e.target.checked)}
                                    className='rounded text-indigo-600 focus:ring-indigo-500'
                                />
                                <span>{t.includeEndDate}</span>
                            </label>
                            <label className='flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium'>
                                <input
                                    type='checkbox'
                                    checked={businessOnly}
                                    onChange={(e) => setBusinessOnly(e.target.checked)}
                                    className='rounded text-indigo-600 focus:ring-indigo-500'
                                />
                                <span className='flex items-center gap-1'>
                                    <BriefcaseIcon className='h-3.5 w-3.5 text-indigo-500' />
                                    {t.excludeWeekends}
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Results Overview */}
                    {betweenResult && (
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                            {/* Main Stat Card */}
                            <div className='md:col-span-1 rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-between'>
                                <div>
                                    <div className='text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2'>
                                        {businessOnly ? t.workingDays : t.totalDays}
                                    </div>
                                    <div className='text-5xl font-black tracking-tight'>
                                        {(businessOnly ? betweenResult.workingCount : betweenResult.totalDays).toLocaleString()}
                                    </div>
                                    <p className='text-xs text-indigo-100 mt-2'>
                                        {businessOnly
                                            ? `${betweenResult.weekendCount} weekend days excluded`
                                            : `${betweenResult.weeks} weeks and ${betweenResult.remainingDays} days`}
                                    </p>
                                </div>

                                <div className='mt-6 pt-4 border-t border-indigo-400/40 text-xs flex justify-between'>
                                    <span>~{betweenResult.monthsApprox} months</span>
                                    <span>{betweenResult.weeks} weeks</span>
                                </div>
                            </div>

                            {/* Secondary Metrics & Time Units */}
                            <div className='md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4'>
                                <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70'>
                                    <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5'>
                                        <BriefcaseIcon className='h-3.5 w-3.5 text-emerald-500' />
                                        <span>{t.workingDays}</span>
                                    </div>
                                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                                        {betweenResult.workingCount.toLocaleString()}
                                    </div>
                                </div>

                                <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70'>
                                    <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5'>
                                        <SunIcon className='h-3.5 w-3.5 text-amber-500' />
                                        <span>{t.weekendDays}</span>
                                    </div>
                                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                                        {betweenResult.weekendCount.toLocaleString()}
                                    </div>
                                </div>

                                <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70'>
                                    <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5'>
                                        <ClockIcon className='h-3.5 w-3.5 text-indigo-500' />
                                        <span>{t.hours}</span>
                                    </div>
                                    <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                                        {betweenResult.hours.toLocaleString()}
                                    </div>
                                </div>

                                <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70'>
                                    <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-1'>
                                        {t.minutes}
                                    </div>
                                    <div className='text-lg font-bold text-slate-800 dark:text-slate-200'>
                                        {betweenResult.minutes.toLocaleString()}
                                    </div>
                                </div>

                                <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70 col-span-2 sm:col-span-2'>
                                    <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-1'>
                                        {t.seconds}
                                    </div>
                                    <div className='text-lg font-bold text-slate-800 dark:text-slate-200'>
                                        {betweenResult.seconds.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: ADD / SUBTRACT DAYS */}
            {activeTab === "addsub" && (
                <div className='space-y-6'>
                    <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none sm:p-7 space-y-6'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                            {/* Base Date */}
                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                    {t.baseDate}
                                </label>
                                <input
                                    type='date'
                                    value={baseDate}
                                    onChange={(e) => setBaseDate(e.target.value)}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>

                            {/* Operation Toggle */}
                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                    {t.operation}
                                </label>
                                <div className='flex gap-2'>
                                    <button
                                        onClick={() => setOperation("add")}
                                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-2xl py-3 text-xs font-bold transition ${
                                            operation === "add"
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                                : "border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                                        }`}
                                    >
                                        <PlusIcon className='h-4 w-4' />
                                        <span>{t.opAdd}</span>
                                    </button>
                                    <button
                                        onClick={() => setOperation("sub")}
                                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-2xl py-3 text-xs font-bold transition ${
                                            operation === "sub"
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                                                : "border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                                        }`}
                                    >
                                        <MinusIcon className='h-4 w-4' />
                                        <span>{t.opSub}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Units Grid */}
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800'>
                            <div className='space-y-1'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.years}</label>
                                <input
                                    type='number'
                                    min='0'
                                    value={addYears}
                                    onChange={(e) => setAddYears(Math.max(0, parseInt(e.target.value) || 0))}
                                    className='w-full rounded-xl border border-slate-200 bg-white p-2.5 text-center font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                                />
                            </div>
                            <div className='space-y-1'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.months}</label>
                                <input
                                    type='number'
                                    min='0'
                                    value={addMonths}
                                    onChange={(e) => setAddMonths(Math.max(0, parseInt(e.target.value) || 0))}
                                    className='w-full rounded-xl border border-slate-200 bg-white p-2.5 text-center font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                                />
                            </div>
                            <div className='space-y-1'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.weeks}</label>
                                <input
                                    type='number'
                                    min='0'
                                    value={addWeeks}
                                    onChange={(e) => setAddWeeks(Math.max(0, parseInt(e.target.value) || 0))}
                                    className='w-full rounded-xl border border-slate-200 bg-white p-2.5 text-center font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                                />
                            </div>
                            <div className='space-y-1'>
                                <label className='text-xs font-bold text-slate-600 dark:text-slate-400'>{t.days}</label>
                                <input
                                    type='number'
                                    min='0'
                                    value={addDays}
                                    onChange={(e) => setAddDays(Math.max(0, parseInt(e.target.value) || 0))}
                                    className='w-full rounded-xl border border-slate-200 bg-white p-2.5 text-center font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Result Card */}
                    {addSubResult && (
                        <div className='rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 p-6 backdrop-blur-xl dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-purple-950/40'>
                            <div className='text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2'>
                                {t.resultingDate}
                            </div>
                            <div className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white capitalize'>
                                {addSubResult.formatted}
                            </div>
                            <div className='mt-2 font-mono text-xs text-indigo-700 dark:text-indigo-300'>
                                ISO Date: {addSubResult.iso}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: EXACT AGE CALCULATOR */}
            {activeTab === "age" && (
                <div className='space-y-6'>
                    <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none sm:p-7'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                    {t.birthDate}
                                </label>
                                <input
                                    type='date'
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                    {t.asOfDate}
                                </label>
                                <input
                                    type='date'
                                    value={asOfDate}
                                    onChange={(e) => setAsOfDate(e.target.value)}
                                    className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                                />
                            </div>
                        </div>
                    </div>

                    {ageResult && (
                        <div className='space-y-5'>
                            {/* Primary Age Badge */}
                            <div className='rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-600 to-purple-700 p-7 text-white shadow-xl shadow-indigo-500/20'>
                                <div className='text-xs font-bold uppercase tracking-wider text-indigo-200 mb-2'>
                                    {t.currentAge}
                                </div>
                                <div className='flex flex-wrap items-baseline gap-3'>
                                    <span className='text-4xl sm:text-5xl font-black'>{ageResult.years}</span>
                                    <span className='text-lg font-medium text-indigo-200'>{t.years}</span>
                                    <span className='text-3xl sm:text-4xl font-bold ml-2'>{ageResult.months}</span>
                                    <span className='text-lg font-medium text-indigo-200'>{t.months}</span>
                                    <span className='text-3xl sm:text-4xl font-bold ml-2'>{ageResult.days}</span>
                                    <span className='text-lg font-medium text-indigo-200'>{t.days}</span>
                                </div>
                                <div className='mt-4 flex items-center gap-2 text-xs text-indigo-100'>
                                    <SparklesIcon className='h-4 w-4 text-amber-300' />
                                    <span>{t.nextBirthday}: <strong>{ageResult.daysToNext} {t.days}</strong></span>
                                </div>
                            </div>

                            {/* Zodiac & Astrology */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70 flex items-center justify-between'>
                                    <div>
                                        <div className='text-xs font-bold text-slate-400 dark:text-slate-500'>{t.zodiacSign}</div>
                                        <div className='text-base font-bold text-slate-900 dark:text-white mt-1'>{ageResult.zodiac}</div>
                                    </div>
                                    <div className='text-2xl'>✨</div>
                                </div>

                                <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70 flex items-center justify-between'>
                                    <div>
                                        <div className='text-xs font-bold text-slate-400 dark:text-slate-500'>{t.chineseZodiac}</div>
                                        <div className='text-base font-bold text-slate-900 dark:text-white mt-1'>{ageResult.chinese}</div>
                                    </div>
                                    <div className='text-2xl'>🏮</div>
                                </div>
                            </div>

                            {/* Lifetime Milestones */}
                            <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 dark:border-slate-800/80 dark:bg-slate-900/80'>
                                <div className='text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4'>
                                    {t.lifeStats}
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                                        <div className='text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5'>
                                            <CalendarIcon className='h-3.5 w-3.5 text-indigo-500' />
                                            {t.totalDaysLived}
                                        </div>
                                        <div className='text-xl font-black text-slate-900 dark:text-white'>
                                            {ageResult.totalDaysLived.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                                        <div className='text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5'>
                                            <MoonIcon className='h-3.5 w-3.5 text-purple-500' />
                                            {t.totalHoursSlept}
                                        </div>
                                        <div className='text-xl font-black text-slate-900 dark:text-white'>
                                            {ageResult.hoursSlept.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                                        <div className='text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5'>
                                            <HeartIcon className='h-3.5 w-3.5 text-rose-500' />
                                            {t.totalHeartbeats}
                                        </div>
                                        <div className='text-xl font-black text-slate-900 dark:text-white'>
                                            {ageResult.heartbeats.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Guide & Tips */}
            <div className='rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-8'>
                <div className='flex items-center gap-3 mb-6'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'>
                        <BookOpenIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                        {t.guideTitle}
                    </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm'>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide1Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide2Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide3Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>

            {/* FAQs Accordion */}
            <div className='rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-8'>
                <div className='flex items-center gap-3 mb-6'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'>
                        <HelpCircleIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                        {t.faqTitle}
                    </h3>
                </div>

                <div className='space-y-3'>
                    {[
                        { q: t.faq1Q, a: t.faq1A },
                        { q: t.faq2Q, a: t.faq2A },
                        { q: t.faq3Q, a: t.faq3A },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className='overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/60 transition-all dark:border-slate-800/70 dark:bg-slate-800/30'
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className='flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 dark:text-white'
                            >
                                <span>{item.q}</span>
                                {openFaq === idx ? (
                                    <ChevronUpIcon className='h-4 w-4 shrink-0 text-indigo-500' />
                                ) : (
                                    <ChevronDownIcon className='h-4 w-4 shrink-0 text-slate-400' />
                                )}
                            </button>
                            {openFaq === idx && (
                                <div className='px-4 pb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
