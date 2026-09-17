"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CronGeneratorContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const toolT = (t.tools as any).cronGenerator;
    const ui = toolT?.ui || {};
    const page = toolT?.page || {};

    const [activeTab, setActiveTab] = useState<"minute" | "hour" | "dom" | "month" | "dow">("minute");
    const [copied, setCopied] = useState<boolean>(false);

    // Cron field states
    const [minuteMode, setMinuteMode] = useState<"every" | "step" | "specific">("every");
    const [minuteStep, setMinuteStep] = useState<number>(5);
    const [minuteSpecific, setMinuteSpecific] = useState<number>(0);

    const [hourMode, setHourMode] = useState<"every" | "step" | "specific">("every");
    const [hourStep, setHourStep] = useState<number>(2);
    const [hourSpecific, setHourSpecific] = useState<number>(0);

    const [domMode, setDomMode] = useState<"every" | "specific">("every");
    const [domSpecific, setDomSpecific] = useState<number>(1);

    const [monthMode, setMonthMode] = useState<"every" | "specific">("every");
    const [monthSpecific, setMonthSpecific] = useState<number>(1);

    const [dowMode, setDowMode] = useState<"every" | "specific">("every");
    const [dowSpecific, setDowSpecific] = useState<number>(1);

    // Compute 5 cron parts
    const minuteStr = useMemo(() => {
        if (minuteMode === "every") return "*";
        if (minuteMode === "step") return `*/${minuteStep}`;
        return String(minuteSpecific);
    }, [minuteMode, minuteStep, minuteSpecific]);

    const hourStr = useMemo(() => {
        if (hourMode === "every") return "*";
        if (hourMode === "step") return `*/${hourStep}`;
        return String(hourSpecific);
    }, [hourMode, hourStep, hourSpecific]);

    const domStr = useMemo(() => {
        if (domMode === "every") return "*";
        return String(domSpecific);
    }, [domMode, domSpecific]);

    const monthStr = useMemo(() => {
        if (monthMode === "every") return "*";
        return String(monthSpecific);
    }, [monthMode, monthSpecific]);

    const dowStr = useMemo(() => {
        if (dowMode === "every") return "*";
        return String(dowSpecific);
    }, [dowMode, dowSpecific]);

    const fullCronExpression = `${minuteStr} ${hourStr} ${domStr} ${monthStr} ${dowStr}`;

    // Natural language explanation
    const humanExplanation = useMemo(() => {
        const isVi = locale === "vi";

        const dayNamesEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayNamesVi = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
        const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthNamesVi = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

        if (fullCronExpression === "* * * * *") {
            return isVi ? "Chạy mỗi phút một lần" : "Runs every minute";
        }
        if (fullCronExpression === "*/5 * * * *") {
            return isVi ? "Chạy mỗi 5 phút một lần" : "Runs every 5 minutes";
        }
        if (fullCronExpression === "0 * * * *") {
            return isVi ? "Chạy vào đầu mỗi giờ (phút thứ 0)" : "Runs at minute 0 of every hour";
        }
        if (fullCronExpression === "0 0 * * *") {
            return isVi ? "Chạy mỗi ngày vào lúc 00:00 (nửa đêm)" : "Runs every day at midnight (00:00)";
        }
        if (fullCronExpression === "0 9 * * 1") {
            return isVi ? "Chạy vào lúc 09:00 Thứ Hai hàng tuần" : "Runs at 09:00 AM every Monday";
        }
        if (fullCronExpression === "0 8 * * 1-5") {
            return isVi ? "Chạy vào lúc 08:00 các ngày từ Thứ 2 đến Thứ 6" : "Runs at 08:00 AM on every weekday (Mon-Fri)";
        }

        // Dynamic builder description
        let minPart = minuteMode === "every" ? (isVi ? "mỗi phút" : "every minute") : minuteMode === "step" ? (isVi ? `mỗi ${minuteStep} phút` : `every ${minuteStep} minutes`) : (isVi ? `ở phút ${minuteSpecific}` : `at minute ${minuteSpecific}`);
        let hourPart = hourMode === "every" ? (isVi ? "mỗi giờ" : "every hour") : hourMode === "step" ? (isVi ? `mỗi ${hourStep} giờ` : `every ${hourStep} hours`) : (isVi ? `lúc ${hourSpecific}:00` : `at ${hourSpecific}:00`);
        let dowPart = dowMode === "every" ? "" : (isVi ? ` vào ${dayNamesVi[dowSpecific]}` : ` on ${dayNamesEn[dowSpecific]}`);
        let domPart = domMode === "every" ? "" : (isVi ? ` ngày ${domSpecific}` : ` on day ${domSpecific}`);
        let monthPart = monthMode === "every" ? "" : (isVi ? ` trong ${monthNamesVi[monthSpecific - 1]}` : ` in ${monthNamesEn[monthSpecific - 1]}`);

        if (isVi) {
            return `Kích hoạt ${minPart}, ${hourPart}${dowPart}${domPart}${monthPart}.`;
        }
        return `Triggers ${minPart}, ${hourPart}${dowPart}${domPart}${monthPart}.`;
    }, [fullCronExpression, locale, minuteMode, minuteStep, minuteSpecific, hourMode, hourStep, hourSpecific, domMode, domSpecific, monthMode, monthSpecific, dowMode, dowSpecific]);

    // Calculate approximate next 5 runs
    const nextFiveRuns = useMemo(() => {
        const dates: string[] = [];
        let cur = new Date();
        cur.setSeconds(0, 0);

        for (let i = 0; i < 2000 && dates.length < 5; i++) {
            cur = new Date(cur.getTime() + 60000); // add 1 minute

            const m = cur.getMinutes();
            const h = cur.getHours();
            const dom = cur.getDate();
            const mon = cur.getMonth() + 1;
            const dow = cur.getDay();

            const matchMin = minuteMode === "every" || (minuteMode === "step" && m % minuteStep === 0) || (minuteMode === "specific" && m === minuteSpecific);
            const matchHour = hourMode === "every" || (hourMode === "step" && h % hourStep === 0) || (hourMode === "specific" && h === hourSpecific);
            const matchDom = domMode === "every" || (domMode === "specific" && dom === domSpecific);
            const matchMon = monthMode === "every" || (monthMode === "specific" && mon === monthSpecific);
            const matchDow = dowMode === "every" || (dowMode === "specific" && dow === dowSpecific);

            if (matchMin && matchHour && matchDom && matchMon && matchDow) {
                dates.push(
                    cur.toLocaleString(locale === "vi" ? "vi-VN" : "en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                );
            }
        }

        return dates;
    }, [minuteMode, minuteStep, minuteSpecific, hourMode, hourStep, hourSpecific, domMode, domSpecific, monthMode, monthSpecific, dowMode, dowSpecific, locale]);

    const handleCopy = () => {
        navigator.clipboard.writeText(fullCronExpression);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const applyPreset = (type: string) => {
        switch (type) {
            case "everyMinute":
                setMinuteMode("every");
                setHourMode("every");
                setDomMode("every");
                setMonthMode("every");
                setDowMode("every");
                break;
            case "every5Min":
                setMinuteMode("step");
                setMinuteStep(5);
                setHourMode("every");
                setDomMode("every");
                setMonthMode("every");
                setDowMode("every");
                break;
            case "hourly":
                setMinuteMode("specific");
                setMinuteSpecific(0);
                setHourMode("every");
                setDomMode("every");
                setMonthMode("every");
                setDowMode("every");
                break;
            case "dailyMidnight":
                setMinuteMode("specific");
                setMinuteSpecific(0);
                setHourMode("specific");
                setHourSpecific(0);
                setDomMode("every");
                setMonthMode("every");
                setDowMode("every");
                break;
            case "weeklyMonday":
                setMinuteMode("specific");
                setMinuteSpecific(0);
                setHourMode("specific");
                setHourSpecific(9);
                setDomMode("every");
                setMonthMode("every");
                setDowMode("specific");
                setDowSpecific(1); // Monday
                break;
            case "monthlyFirst":
                setMinuteMode("specific");
                setMinuteSpecific(0);
                setHourMode("specific");
                setHourSpecific(0);
                setDomMode("specific");
                setDomSpecific(1);
                setMonthMode("every");
                setDowMode("every");
                break;
        }
    };

    return (
        <div className='space-y-8 max-w-5xl mx-auto'>
            {/* Top Display: Large Expression + Explanation Card */}
            <Card className='p-6 md:p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg text-center'>
                <div className='text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-2'>
                    {ui.expressionLabel || "Cron Expression"}
                </div>
                <div className='flex items-center justify-center gap-3 my-3 flex-wrap'>
                    <span className='px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-black text-white font-mono text-2xl md:text-3xl font-bold tracking-widest shadow-inner border border-gray-700'>
                        {fullCronExpression}
                    </span>
                    <button
                        onClick={handleCopy}
                        className='px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm cursor-pointer'
                    >
                        {copied ? (ui.copied || "Copied!") : (ui.copyExpression || "Copy")}
                    </button>
                </div>

                <div className='mt-4 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 max-w-2xl mx-auto'>
                    <div className='text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1'>
                        {ui.humanReadable || "Human-readable schedule:"}
                    </div>
                    <div className='text-base font-medium text-gray-800 dark:text-gray-200'>
                        {humanExplanation}
                    </div>
                </div>

                {/* Presets Chips */}
                <div className='mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-2 flex-wrap text-xs'>
                    <span className='font-semibold text-gray-500 dark:text-gray-400 mr-1'>{ui.presetsLabel || "Presets"}:</span>
                    <button onClick={() => applyPreset("everyMinute")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer font-medium'>
                        {ui.presetEveryMinute || "Every minute"}
                    </button>
                    <button onClick={() => applyPreset("every5Min")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer font-medium'>
                        {ui.presetEvery5Minutes || "Every 5 mins"}
                    </button>
                    <button onClick={() => applyPreset("hourly")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer font-medium'>
                        {ui.presetHourly || "Hourly"}
                    </button>
                    <button onClick={() => applyPreset("dailyMidnight")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer font-medium'>
                        {ui.presetDailyMidnight || "Midnight"}
                    </button>
                    <button onClick={() => applyPreset("weeklyMonday")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer font-medium'>
                        {ui.presetWeeklyMonday || "Monday 9AM"}
                    </button>
                    <button onClick={() => applyPreset("monthlyFirst")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 cursor-pointer font-medium'>
                        {ui.presetMonthlyFirst || "1st of Month"}
                    </button>
                </div>
            </Card>

            {/* Field Configuration Tabs */}
            <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md'>
                <div className='flex border-b border-gray-200 dark:border-gray-700 gap-2 mb-6 overflow-x-auto'>
                    {[
                        { id: "minute", label: ui.tabMinutes || "Minutes", val: minuteStr },
                        { id: "hour", label: ui.tabHours || "Hours", val: hourStr },
                        { id: "dom", label: ui.tabDayOfMonth || "Day of Month", val: domStr },
                        { id: "month", label: ui.tabMonth || "Month", val: monthStr },
                        { id: "dow", label: ui.tabDayOfWeek || "Day of Week", val: dowStr },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 cursor-pointer shrink-0 flex items-center gap-2 ${
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                    : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                            }`}
                        >
                            <span>{tab.label}</span>
                            <span className='px-1.5 py-0.5 rounded text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'>
                                {tab.val}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Tab: Minutes */}
                {activeTab === "minute" && (
                    <div className='space-y-4'>
                        <div className='flex items-center gap-4 flex-wrap'>
                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={minuteMode === "every"}
                                    onChange={() => setMinuteMode("every")}
                                    className='accent-blue-600'
                                />
                                {ui.all || "Every minute (*)"}
                            </label>

                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={minuteMode === "step"}
                                    onChange={() => setMinuteMode("step")}
                                    className='accent-blue-600'
                                />
                                {ui.step || "Every (step)"}
                            </label>

                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={minuteMode === "specific"}
                                    onChange={() => setMinuteMode("specific")}
                                    className='accent-blue-600'
                                />
                                {ui.atSpecific || "Specific minute"}
                            </label>
                        </div>

                        {minuteMode === "step" && (
                            <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                                <span className='text-sm'>Every</span>
                                <input
                                    type='number'
                                    min='1'
                                    max='59'
                                    value={minuteStep}
                                    onChange={(e) => setMinuteStep(Math.max(1, Math.min(59, Number(e.target.value))))}
                                    className='w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-mono font-bold'
                                />
                                <span className='text-sm'>minute(s) (*/{minuteStep})</span>
                            </div>
                        )}

                        {minuteMode === "specific" && (
                            <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                                <span className='text-xs font-semibold text-gray-500 block mb-2'>Select minute (0 - 59):</span>
                                <div className='grid grid-cols-6 sm:grid-cols-12 gap-1.5'>
                                    {Array.from({ length: 60 }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setMinuteSpecific(i)}
                                            className={`p-1.5 text-xs font-mono rounded cursor-pointer ${
                                                minuteSpecific === i
                                                    ? "bg-blue-600 text-white font-bold"
                                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                                            }`}
                                        >
                                            {i}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Hours */}
                {activeTab === "hour" && (
                    <div className='space-y-4'>
                        <div className='flex items-center gap-4 flex-wrap'>
                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={hourMode === "every"}
                                    onChange={() => setHourMode("every")}
                                    className='accent-blue-600'
                                />
                                {ui.all || "Every hour (*)"}
                            </label>

                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={hourMode === "step"}
                                    onChange={() => setHourMode("step")}
                                    className='accent-blue-600'
                                />
                                {ui.step || "Every (step)"}
                            </label>

                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={hourMode === "specific"}
                                    onChange={() => setHourMode("specific")}
                                    className='accent-blue-600'
                                />
                                {ui.atSpecific || "Specific hour"}
                            </label>
                        </div>

                        {hourMode === "step" && (
                            <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                                <span className='text-sm'>Every</span>
                                <input
                                    type='number'
                                    min='1'
                                    max='23'
                                    value={hourStep}
                                    onChange={(e) => setHourStep(Math.max(1, Math.min(23, Number(e.target.value))))}
                                    className='w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-mono font-bold'
                                />
                                <span className='text-sm'>hour(s) (*/{hourStep})</span>
                            </div>
                        )}

                        {hourMode === "specific" && (
                            <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                                <span className='text-xs font-semibold text-gray-500 block mb-2'>Select hour (0 - 23):</span>
                                <div className='grid grid-cols-4 sm:grid-cols-8 gap-2'>
                                    {Array.from({ length: 24 }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setHourSpecific(i)}
                                            className={`p-2 text-xs font-mono rounded-lg cursor-pointer ${
                                                hourSpecific === i
                                                    ? "bg-blue-600 text-white font-bold"
                                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                                            }`}
                                        >
                                            {String(i).padStart(2, "0")}:00
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Day of Month */}
                {activeTab === "dom" && (
                    <div className='space-y-4'>
                        <div className='flex items-center gap-4'>
                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={domMode === "every"}
                                    onChange={() => setDomMode("every")}
                                    className='accent-blue-600'
                                />
                                {ui.all || "Every day (*)"}
                            </label>

                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={domMode === "specific"}
                                    onChange={() => setDomMode("specific")}
                                    className='accent-blue-600'
                                />
                                {ui.atSpecific || "Specific day of month"}
                            </label>
                        </div>

                        {domMode === "specific" && (
                            <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                                <div className='grid grid-cols-7 sm:grid-cols-10 gap-2'>
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setDomSpecific(i + 1)}
                                            className={`p-2 text-xs font-mono rounded-lg cursor-pointer ${
                                                domSpecific === i + 1
                                                    ? "bg-blue-600 text-white font-bold"
                                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                                            }`}
                                        >
                                            Day {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Month */}
                {activeTab === "month" && (
                    <div className='space-y-4'>
                        <div className='flex items-center gap-4'>
                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={monthMode === "every"}
                                    onChange={() => setMonthMode("every")}
                                    className='accent-blue-600'
                                />
                                {ui.all || "Every month (*)"}
                            </label>

                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={monthMode === "specific"}
                                    onChange={() => setMonthMode("specific")}
                                    className='accent-blue-600'
                                />
                                {ui.atSpecific || "Specific month"}
                            </label>
                        </div>

                        {monthMode === "specific" && (
                            <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                                <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                                        (m, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setMonthSpecific(i + 1)}
                                                className={`p-2.5 text-xs font-semibold rounded-lg cursor-pointer ${
                                                    monthSpecific === i + 1
                                                        ? "bg-blue-600 text-white font-bold"
                                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                                                }`}
                                            >
                                                {m} ({i + 1})
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Day of Week */}
                {activeTab === "dow" && (
                    <div className='space-y-4'>
                        <div className='flex items-center gap-4'>
                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={dowMode === "every"}
                                    onChange={() => setDowMode("every")}
                                    className='accent-blue-600'
                                />
                                {ui.all || "Every day of week (*)"}
                            </label>

                            <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                                <input
                                    type='radio'
                                    checked={dowMode === "specific"}
                                    onChange={() => setDowMode("specific")}
                                    className='accent-blue-600'
                                />
                                {ui.atSpecific || "Specific weekday"}
                            </label>
                        </div>

                        {dowMode === "specific" && (
                            <div className='p-4 bg-gray-50 dark:bg-gray-900 rounded-xl'>
                                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                                    {[
                                        { id: 0, label: "Sunday (0)" },
                                        { id: 1, label: "Monday (1)" },
                                        { id: 2, label: "Tuesday (2)" },
                                        { id: 3, label: "Wednesday (3)" },
                                        { id: 4, label: "Thursday (4)" },
                                        { id: 5, label: "Friday (5)" },
                                        { id: 6, label: "Saturday (6)" },
                                    ].map((d) => (
                                        <button
                                            key={d.id}
                                            onClick={() => setDowSpecific(d.id)}
                                            className={`p-2.5 text-xs font-semibold rounded-lg cursor-pointer ${
                                                dowSpecific === d.id
                                                    ? "bg-blue-600 text-white font-bold"
                                                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                                            }`}
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Next 5 Execution Times */}
            <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md'>
                <h3 className='text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2'>
                    <span>📅</span> {ui.nextRuns || "Next 5 scheduled runs:"}
                </h3>
                <div className='divide-y divide-gray-100 dark:divide-gray-700/60'>
                    {nextFiveRuns.map((timeStr, idx) => (
                        <div key={idx} className='py-2.5 flex items-center justify-between text-sm'>
                            <span className='text-gray-500 dark:text-gray-400 font-mono text-xs'>#{idx + 1}</span>
                            <span className='font-mono font-medium text-gray-900 dark:text-white'>{timeStr}</span>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Rich SEO Content */}
            {page.whatIs && (
                <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                    <section className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.whatIs}</h2>
                        <p className='leading-relaxed mb-6'>{page.whatIsDesc}</p>

                        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                            {locale === "vi" ? "Tính Năng Nổi Bật" : "Key Features"}
                        </h3>
                        <ul className='list-disc pl-5 space-y-2 text-sm leading-relaxed'>
                            {Object.values(page.features || {}).map((feat: any, idx: number) => (
                                <li key={idx}>{feat}</li>
                            ))}
                        </ul>
                    </section>

                    {/* FAQ */}
                    {page.faq && (
                        <section className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                                {locale === "vi" ? "Câu Hỏi Thường Gặp" : "Frequently Asked Questions"}
                            </h2>
                            <div className='space-y-4'>
                                {[1, 2, 3].map((i) => {
                                    const q = page.faq[`q${i}`];
                                    const a = page.faq[`a${i}`];
                                    if (!q) return null;
                                    return (
                                        <details key={i} className='group border border-gray-200 dark:border-gray-700 rounded-xl p-4 open:bg-gray-50 dark:open:bg-gray-900/50 transition-colors'>
                                            <summary className='font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between'>
                                                <span>{q}</span>
                                                <span className='transition group-open:rotate-180 text-gray-400'>▼</span>
                                            </summary>
                                            <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>{a}</p>
                                        </details>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
