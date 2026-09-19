"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

// Helper to check if a value matches a single cron field pattern
function matchCronField(val: number, pattern: string, minLimit: number, maxLimit: number): boolean {
    if (pattern === "*") return true;

    // Handle step values like */5 or 10-30/5
    if (pattern.includes("/")) {
        const [rangePart, stepPart] = pattern.split("/");
        const step = parseInt(stepPart, 10);
        if (isNaN(step) || step <= 0) return false;

        if (rangePart === "*") {
            return (val - minLimit) % step === 0;
        }
        if (rangePart.includes("-")) {
            const [rStart, rEnd] = rangePart.split("-").map((n) => parseInt(n, 10));
            if (val >= rStart && val <= rEnd) {
                return (val - rStart) % step === 0;
            }
            return false;
        }
        const startVal = parseInt(rangePart, 10);
        return val >= startVal && (val - startVal) % step === 0;
    }

    // Handle comma-separated lists like 1,2,5
    if (pattern.includes(",")) {
        const parts = pattern.split(",");
        return parts.some((p) => matchCronField(val, p.trim(), minLimit, maxLimit));
    }

    // Handle ranges like 1-5
    if (pattern.includes("-")) {
        const [start, end] = pattern.split("-").map((n) => parseInt(n, 10));
        return val >= start && val <= end;
    }

    // Exact number
    const num = parseInt(pattern, 10);
    return !isNaN(num) && val === num;
}

// Check if a Date matches a 5-part cron expression
function matchCronDate(d: Date, cronParts: string[]): boolean {
    if (cronParts.length !== 5) return false;
    const [minP, hourP, domP, monthP, dowP] = cronParts;

    const min = d.getMinutes();
    const hour = d.getHours();
    const dom = d.getDate();
    const mon = d.getMonth() + 1; // 1-12
    const dow = d.getDay(); // 0-6 (0=Sun)

    if (!matchCronField(min, minP, 0, 59)) return false;
    if (!matchCronField(hour, hourP, 0, 23)) return false;
    if (!matchCronField(dom, domP, 1, 31)) return false;
    if (!matchCronField(mon, monthP, 1, 12)) return false;
    if (!matchCronField(dow, dowP, 0, 6)) return false;

    return true;
}

// Describe a 5-part cron expression in human language
function explainCron(cronStr: string, isVi: boolean): string {
    const parts = cronStr.trim().split(/\s+/);
    if (parts.length !== 5) {
        return isVi ? "Biểu thức Cron không hợp lệ (cần đúng 5 trường cách nhau bằng khoảng trắng)" : "Invalid Cron expression (must have 5 fields separated by spaces)";
    }

    const [min, hour, dom, mon, dow] = parts;

    const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayNamesVi = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

    if (cronStr === "* * * * *") return isVi ? "Chạy liên tục mỗi phút" : "Runs continuously every minute";
    if (cronStr === "*/5 * * * *") return isVi ? "Chạy mỗi 5 phút một lần" : "Runs every 5 minutes";
    if (cronStr === "0 * * * *") return isVi ? "Chạy vào đầu mỗi giờ (phút 00)" : "Runs at minute 0 of every hour";
    if (cronStr === "0 0 * * *") return isVi ? "Chạy hàng ngày vào lúc 00:00 (nửa đêm)" : "Runs daily at midnight (00:00)";
    if (cronStr === "0 9 * * 1-5") return isVi ? "Chạy lúc 09:00 sáng từ Thứ 2 đến Thứ 6 hàng tuần" : "Runs at 09:00 AM, Monday through Friday";
    if (cronStr === "0 0 1 * *") return isVi ? "Chạy vào lúc 00:00 ngày đầu tiên của mỗi tháng" : "Runs at midnight on the 1st of every month";
    if (cronStr === "0 0 * * 0") return isVi ? "Chạy lúc nửa đêm Chủ Nhật hàng tuần" : "Runs at midnight every Sunday";

    // General description
    let minText = min === "*" ? (isVi ? "mỗi phút" : "every minute") : min.startsWith("*/") ? (isVi ? `mỗi ${min.slice(2)} phút` : `every ${min.slice(2)} mins`) : (isVi ? `ở phút ${min}` : `at minute ${min}`);
    let hourText = hour === "*" ? (isVi ? "mỗi giờ" : "every hour") : hour.startsWith("*/") ? (isVi ? `mỗi ${hour.slice(2)} giờ` : `every ${hour.slice(2)} hours`) : (isVi ? `lúc ${hour.padStart(2, "0")}:00` : `at ${hour}:00`);
    let domText = dom === "*" ? "" : (isVi ? ` vào ngày ${dom}` : ` on day ${dom}`);
    let monText = mon === "*" ? "" : (isVi ? ` trong tháng ${mon}` : ` in month ${mon}`);
    let dowText = dow === "*" ? "" : (isVi ? ` vào ${dow}` : ` on weekday ${dow}`);

    return isVi
        ? `Lập lịch: Chạy ${minText}, ${hourText}${domText}${monText}${dowText}.`
        : `Scheduled: Runs ${minText}, ${hourText}${domText}${monText}${dowText}.`;
}

interface ConvertedCronResult {
    localCron: string;
    utcCron: string;
    offsetHours: number;
    offsetMinutesTotal: number;
    explanationVi: string;
    explanationEn: string;
}

function calculateTimezoneCrons(cronStr: string, inputIsLocal: boolean): ConvertedCronResult {
    const parts = cronStr.trim().split(/\s+/);
    if (parts.length !== 5) {
        return {
            localCron: cronStr,
            utcCron: cronStr,
            offsetHours: 0,
            offsetMinutesTotal: 0,
            explanationVi: "",
            explanationEn: "",
        };
    }

    const [minP, hourP, domP, monthP, dowP] = parts;
    const offsetMin = -new Date().getTimezoneOffset(); // e.g. +420 for Vietnam (UTC+7), -240 for EDT (UTC-4)
    const offsetHours = Math.round((offsetMin / 60) * 10) / 10;

    // If schedule is minute-interval without specific hour, UTC and Local are identical
    if (hourP === "*") {
        return {
            localCron: cronStr,
            utcCron: cronStr,
            offsetHours,
            offsetMinutesTotal: offsetMin,
            explanationVi: "Lịch chạy chu kỳ phút hoặc đầu mỗi giờ có tần suất giống hệt nhau trên mọi múi giờ.",
            explanationEn: "Minute-interval and top-of-hour schedules run at the identical frequency in all timezones.",
        };
    }

    const parseNumberList = (str: string): number[] | null => {
        if (/^\d+$/.test(str)) return [parseInt(str, 10)];
        if (/^(\d+,)+\d+$/.test(str)) return str.split(",").map((n) => parseInt(n, 10));
        return null;
    };

    const hours = parseNumberList(hourP);
    const mins = parseNumberList(minP);

    const shiftMin = (baseH: number[], baseM: number, deltaM: number) => {
        let dayShift = 0;
        const newHours = baseH.map((h) => {
            let total = h * 60 + baseM + deltaM;
            let dS = 0;
            while (total < 0) {
                total += 1440;
                dS -= 1;
            }
            while (total >= 1440) {
                total -= 1440;
                dS += 1;
            }
            dayShift = dS;
            return Math.floor(total / 60);
        });

        let newMin = (baseM + deltaM) % 60;
        if (newMin < 0) newMin += 60;

        let newDow = dowP;
        if (dayShift !== 0 && dowP !== "*") {
            if (/^\d+$/.test(dowP)) {
                newDow = String((parseInt(dowP, 10) + dayShift + 7) % 7);
            } else if (dowP === "1-5") {
                newDow = dayShift === -1 ? "0-4" : "2-6";
            }
        }

        let newDom = domP;
        if (dayShift !== 0 && /^\d+$/.test(domP)) {
            const parsedDom = parseInt(domP, 10) + dayShift;
            if (parsedDom >= 1 && parsedDom <= 28) {
                newDom = String(parsedDom);
            }
        }

        const newMinStr = mins && mins.length > 1 ? minP : String(newMin);
        const newHourStr = newHours.join(",");
        return `${newMinStr} ${newHourStr} ${newDom} ${monthP} ${newDow}`;
    };

    if (hours) {
        const baseM = mins ? mins[0] : 0;
        const sign = offsetMin >= 0 ? "+" : "-";
        const absH = Math.abs(offsetHours);
        if (inputIsLocal) {
            const utcCron = shiftMin(hours, baseM, -offsetMin);
            return {
                localCron: cronStr,
                utcCron,
                offsetHours,
                offsetMinutesTotal: offsetMin,
                explanationVi: `Giờ máy bạn (UTC${sign}${absH}) sớm hơn máy chủ UTC ${absH} giờ. Đã tính toán biểu thức UTC tương ứng để lập lịch chạy chính xác trên Cloud.`,
                explanationEn: `Your device (UTC${sign}${absH}) is ${absH}h ahead of UTC servers. Calculated exact UTC expression for accurate cloud scheduling.`,
            };
        } else {
            const localCron = shiftMin(hours, baseM, offsetMin);
            return {
                localCron,
                utcCron: cronStr,
                offsetHours,
                offsetMinutesTotal: offsetMin,
                explanationVi: `Đang cấu hình theo giờ UTC. Biểu thức tương ứng theo giờ thiết bị của bạn (UTC${sign}${absH}) được hiển thị bên dưới.`,
                explanationEn: `Configured in UTC. Equivalent expression in your local device timezone (UTC${sign}${absH}) is shown below.`,
            };
        }
    }

    return {
        localCron: cronStr,
        utcCron: cronStr,
        offsetHours,
        offsetMinutesTotal: offsetMin,
        explanationVi: "",
        explanationEn: "",
    };
}

export default function CronGeneratorContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = getTranslation(locale);
    const toolT = (t.tools as any).cronGenerator;
    const ui = toolT?.ui || {};

    const [activeTab, setActiveTab] = useState<"minute" | "hour" | "dom" | "month" | "dow">("minute");
    const [editorMode, setEditorMode] = useState<"builder" | "parser">("builder");

    // System Timezone Detection & Scheduling Mode
    const [userTz] = useState<string>(() => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh";
        } catch {
            return "Asia/Ho_Chi_Minh";
        }
    });

    const userOffsetStr = useMemo(() => {
        try {
            const offsetMin = -new Date().getTimezoneOffset();
            const sign = offsetMin >= 0 ? "+" : "-";
            const abs = Math.abs(offsetMin);
            const hours = String(Math.floor(abs / 60)).padStart(2, "0");
            const mins = String(abs % 60).padStart(2, "0");
            return `UTC${sign}${hours}:${mins}`;
        } catch {
            return "UTC+00:00";
        }
    }, []);

    // 'local': user inputs time according to local device clock (e.g. 09:00 AM VN)
    // 'utc': user inputs time in UTC directly
    const [scheduleTimezoneMode, setScheduleTimezoneMode] = useState<"local" | "utc">("local");

    // Cron field states for Visual Builder
    const [minuteMode, setMinuteMode] = useState<"every" | "step" | "specific">("every");
    const [minuteStep, setMinuteStep] = useState<number>(5);
    const [minuteSpecific, setMinuteSpecific] = useState<number>(0);

    const [hourMode, setHourMode] = useState<"every" | "step" | "specific">("every");
    const [hourStep, setHourStep] = useState<number>(2);
    const [hourSpecific, setHourSpecific] = useState<number>(9);

    const [domMode, setDomMode] = useState<"every" | "specific">("every");
    const [domSpecific, setDomSpecific] = useState<number>(1);

    const [monthMode, setMonthMode] = useState<"every" | "specific">("every");
    const [monthSpecific, setMonthSpecific] = useState<number>(1);

    const [dowMode, setDowMode] = useState<"every" | "specific">("every");
    const [dowSpecific, setDowSpecific] = useState<number>(1);

    // Custom Raw Expression for Parser Mode
    const [rawCronInput, setRawCronInput] = useState<string>("0 9 * * 1-5");

    // Compute 5 cron parts for Builder
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

    const builderCron = `${minuteStr} ${hourStr} ${domStr} ${monthStr} ${dowStr}`;
    const activeCronExpression = editorMode === "builder" ? builderCron : rawCronInput.trim();

    // Timezone Dual-Cron Calculations
    const timezoneCalculations = useMemo(() => {
        return calculateTimezoneCrons(activeCronExpression, scheduleTimezoneMode === "local");
    }, [activeCronExpression, scheduleTimezoneMode]);

    // Natural language explanation
    const humanExplanation = useMemo(() => {
        return explainCron(activeCronExpression, isVi);
    }, [activeCronExpression, isVi]);

    // Calculate next 10 runs
    const nextTenRuns = useMemo(() => {
        const simCron = scheduleTimezoneMode === "local" ? timezoneCalculations.localCron : activeCronExpression;
        const parts = simCron.split(/\s+/);
        if (parts.length !== 5) return [];

        const dates: { localFormatted: string; utcFormatted: string; relative: string }[] = [];
        let cur = new Date();
        cur.setSeconds(0, 0);

        const nowTime = cur.getTime();
        // Look ahead up to 60 days (approx 86,400 minutes)
        for (let i = 1; i <= 86400 && dates.length < 10; i++) {
            cur = new Date(cur.getTime() + 60000); // advance 1 min
            if (matchCronDate(cur, parts)) {
                const diffMs = cur.getTime() - nowTime;
                const diffMins = Math.round(diffMs / 60000);
                const diffHours = Math.round(diffMs / 3600000);
                const diffDays = Math.round(diffMs / 86400000);

                let rel = "";
                if (diffMins < 60) {
                    rel = isVi ? `Sau ${diffMins} phút` : `in ${diffMins} mins`;
                } else if (diffHours < 24) {
                    rel = isVi ? `Sau ${diffHours} giờ` : `in ${diffHours} hrs`;
                } else {
                    rel = isVi ? `Sau ${diffDays} ngày` : `in ${diffDays} days`;
                }

                dates.push({
                    localFormatted: cur.toLocaleString(isVi ? "vi-VN" : "en-US", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    utcFormatted:
                        cur.toLocaleString(isVi ? "vi-VN" : "en-US", {
                            timeZone: "UTC",
                            hour: "2-digit",
                            minute: "2-digit",
                        }) + " UTC",
                    relative: rel,
                });
            }
        }
        return dates;
    }, [activeCronExpression, scheduleTimezoneMode, timezoneCalculations.localCron, isVi]);

    const handleCopyCustom = async (cronText: string, label: string) => {
        try {
            await navigator.clipboard.writeText(cronText);
            toast.success(isVi ? `Đã sao chép: ${label}!` : `Copied ${label} to clipboard!`);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    // Quick Presets
    const presets = [
        { labelEn: "Every minute", labelVi: "Mỗi phút", cron: "* * * * *" },
        { labelEn: "Every 5 mins", labelVi: "Mỗi 5 phút", cron: "*/5 * * * *" },
        { labelEn: "Every hour", labelVi: "Mỗi giờ", cron: "0 * * * *" },
        { labelEn: "Daily at midnight", labelVi: "Hàng ngày lúc 00:00", cron: "0 0 * * *" },
        { labelEn: "Weekdays 09:00", labelVi: "T2 - T6 lúc 09:00", cron: "0 9 * * 1-5" },
        { labelEn: "Weekly Sunday", labelVi: "Chủ Nhật hàng tuần", cron: "0 0 * * 0" },
        { labelEn: "Monthly 1st", labelVi: "Ngày 1 mỗi tháng", cron: "0 0 1 * *" },
    ];

    const applyPreset = (cron: string) => {
        setRawCronInput(cron);
        setEditorMode("parser");
        toast.info(isVi ? `Đã áp dụng mẫu: ${cron}` : `Applied preset: ${cron}`);
    };

    return (
        <div className='max-w-5xl mx-auto space-y-6'>
            {/* Top Display Card */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                        <span className='text-xl'>⏰</span>
                        <h2 className='text-base font-bold text-gray-900 dark:text-gray-100'>
                            {isVi ? "Bộ Tạo & Chuyển Đổi Múi Giờ Cron" : "Cron Generator & Timezone Converter"}
                        </h2>
                    </div>

                    {/* Mode Toggle */}
                    <div className='flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-xl text-xs font-semibold'>
                        <button
                            onClick={() => setEditorMode("builder")}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                editorMode === "builder"
                                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            🛠️ {isVi ? "Trình Tạo (Visual Builder)" : "Visual Builder"}
                        </button>
                        <button
                            onClick={() => setEditorMode("parser")}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                editorMode === "parser"
                                    ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-600 dark:text-gray-300"
                            }`}
                        >
                            🔄 {isVi ? "Dịch Ngược / Nhập Trực Tiếp" : "Direct Input / Parser"}
                        </button>
                    </div>
                </div>

                {/* System Timezone Detection Banner & Target Selector */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs'>
                    <div className='flex items-center gap-2 text-indigo-950 dark:text-indigo-200 flex-wrap'>
                        <span className='text-base'>🌐</span>
                        <span className='font-semibold'>{isVi ? "Múi giờ máy của bạn:" : "Detected System Timezone:"}</span>
                        <code className='font-mono font-bold bg-white dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-sm'>
                            {userTz} ({userOffsetStr})
                        </code>
                    </div>

                    <div className='flex items-center gap-1.5 bg-white dark:bg-gray-800 p-1 rounded-xl border border-indigo-200 dark:border-indigo-800 self-start sm:self-auto shrink-0'>
                        <button
                            type='button'
                            onClick={() => setScheduleTimezoneMode("local")}
                            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                                scheduleTimezoneMode === "local"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            }`}
                        >
                            🕒 {isVi ? "Giờ máy bạn (Local)" : "Local Device Time"}
                        </button>
                        <button
                            type='button'
                            onClick={() => setScheduleTimezoneMode("utc")}
                            className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                                scheduleTimezoneMode === "utc"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                            }`}
                        >
                            ☁️ {isVi ? "Giờ máy chủ (UTC)" : "UTC Server Time"}
                        </button>
                    </div>
                </div>

                {/* Input box for Parser mode */}
                {editorMode === "parser" && (
                    <div>
                        <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5'>
                            {isVi ? "Nhập biểu thức Cron 5 trường cần phân tích hoặc chuyển múi giờ:" : "Enter 5-field cron expression to parse or convert:"}
                        </label>
                        <input
                            type='text'
                            value={rawCronInput}
                            onChange={(e) => setRawCronInput(e.target.value)}
                            placeholder='0 9 * * 1-5'
                            className='w-full px-4 py-2.5 text-xl font-bold tracking-widest text-emerald-400 bg-gray-900 rounded-xl border border-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                    </div>
                )}

                {/* Dual-Cron Presentation Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Card 1: Local Cron */}
                    <div className='p-4 bg-gray-900 text-gray-100 rounded-2xl border border-blue-900/40 space-y-2.5 shadow-sm'>
                        <div className='flex items-center justify-between'>
                            <span className='text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider'>
                                <span>🕒</span> {isVi ? "Biểu Thức Giờ Thiết Bị (Local):" : "Local Time Expression:"}
                            </span>
                            <span className='text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-mono border border-blue-800'>
                                {userOffsetStr}
                            </span>
                        </div>
                        <div className='flex items-center justify-between gap-3 font-mono'>
                            <span className='text-2xl font-bold tracking-widest text-emerald-400 select-all break-all'>
                                {timezoneCalculations.localCron}
                            </span>
                            <button
                                type='button'
                                onClick={() => handleCopyCustom(timezoneCalculations.localCron, isVi ? "Cron Giờ Địa Phương" : "Local Cron")}
                                className='px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-sans font-semibold transition-all cursor-pointer shrink-0 shadow-sm'
                            >
                                📋 {isVi ? "Sao chép" : "Copy"}
                            </button>
                        </div>
                        <div className='text-[11px] text-gray-400 leading-relaxed'>
                            💡 {isVi ? "Dùng cho máy tính cá nhân hoặc Linux VPS đã cài đặt múi giờ địa phương." : "For local machines or Linux VPS configured with your local timezone."}
                        </div>
                    </div>

                    {/* Card 2: UTC Converted Cron */}
                    <div className='p-4 bg-gray-900 text-gray-100 rounded-2xl border border-amber-900/40 space-y-2.5 shadow-sm relative overflow-hidden'>
                        <div className='flex items-center justify-between'>
                            <span className='text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider'>
                                <span>☁️</span> {isVi ? "Biểu Thức Máy Chủ Chuẩn (UTC):" : "UTC Cloud Expression:"}
                            </span>
                            <span className='text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-800'>
                                GitHub Actions / AWS
                            </span>
                        </div>
                        <div className='flex items-center justify-between gap-3 font-mono'>
                            <span className='text-2xl font-bold tracking-widest text-amber-300 select-all break-all'>
                                {timezoneCalculations.utcCron}
                            </span>
                            <button
                                type='button'
                                onClick={() => handleCopyCustom(timezoneCalculations.utcCron, isVi ? "Cron Chuẩn UTC" : "UTC Cron")}
                                className='px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-sans font-semibold transition-all cursor-pointer shrink-0 shadow-sm'
                            >
                                ☁️ {isVi ? "Copy UTC" : "Copy UTC"}
                            </button>
                        </div>
                        <div className='text-[11px] text-gray-400 leading-relaxed'>
                            ⭐ {isVi ? "Khuyên dùng cho GitHub Actions, AWS EventBridge, Kubernetes, Vercel, Supabase." : "Recommended for GitHub Actions, AWS EventBridge, Kubernetes, Vercel."}
                        </div>
                    </div>
                </div>

                {/* Timezone Explanation & Offset Note */}
                {timezoneCalculations.explanationVi && (
                    <div className='p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs text-indigo-900 dark:text-indigo-300 flex items-start gap-2'>
                        <span className='text-base shrink-0'>💡</span>
                        <span>{isVi ? timezoneCalculations.explanationVi : timezoneCalculations.explanationEn}</span>
                    </div>
                )}

                {/* Natural Language Meaning */}
                <div className='p-3.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm flex items-start gap-2.5'>
                    <span className='text-blue-600 dark:text-blue-400 text-base'>📖</span>
                    <div>
                        <span className='font-semibold text-blue-900 dark:text-blue-200'>
                            {isVi ? "Ý nghĩa hoạt động:" : "Plain Text Meaning:"}
                        </span>{" "}
                        <span className='text-blue-800 dark:text-blue-300'>{humanExplanation}</span>
                    </div>
                </div>

                {/* 1-Click Presets */}
                <div className='pt-2'>
                    <span className='text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2'>
                        ⚡ {isVi ? "Mẫu cron phổ biến (bấm để dùng ngay):" : "Popular Presets (1-click apply):"}
                    </span>
                    <div className='flex flex-wrap gap-2'>
                        {presets.map((p, idx) => (
                            <button
                                key={idx}
                                onClick={() => applyPreset(p.cron)}
                                className='px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs transition-colors border border-gray-200 dark:border-gray-700 cursor-pointer flex items-center gap-1.5'
                            >
                                <span className='font-mono font-bold text-[11px]'>{p.cron}</span>
                                <span className='text-gray-400 text-[10px]'>({isVi ? p.labelVi : p.labelEn})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Tabs: Builder vs Schedule Inspector */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Left 2 Cols: Interactive Configuration */}
                <div className='lg:col-span-2 space-y-6'>
                    {editorMode === "builder" ? (
                        <Card className='p-6 text-gray-900 dark:text-gray-100'>
                            <div className='flex border-b border-gray-200 dark:border-gray-700 mb-6 gap-2 overflow-x-auto'>
                                {[
                                    { id: "minute", labelEn: "Minute", labelVi: "Phút (0-59)" },
                                    { id: "hour", labelEn: "Hour", labelVi: "Giờ (0-23)" },
                                    { id: "dom", labelEn: "Day of Month", labelVi: "Ngày Trong Tháng" },
                                    { id: "month", labelEn: "Month", labelVi: "Tháng (1-12)" },
                                    { id: "dow", labelEn: "Day of Week", labelVi: "Thứ Trong Tuần" },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                                            activeTab === tab.id
                                                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        }`}
                                    >
                                        {isVi ? tab.labelVi : tab.labelEn}
                                    </button>
                                ))}
                            </div>

                            {/* Minute Settings */}
                            {activeTab === "minute" && (
                                <div className='space-y-4'>
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='minuteMode' checked={minuteMode === "every"} onChange={() => setMinuteMode("every")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Mỗi phút (*)" : "Every minute (*)"}</span>
                                    </label>
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='minuteMode' checked={minuteMode === "step"} onChange={() => setMinuteMode("step")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Mỗi chu kỳ (*/step)" : "Every step interval (*/step)"}</span>
                                    </label>
                                    {minuteMode === "step" && (
                                        <div className='pl-7 flex items-center gap-2'>
                                            <span className='text-xs text-gray-600 dark:text-gray-400'>{isVi ? "Mỗi:" : "Every:"}</span>
                                            <input
                                                type='number'
                                                min={1}
                                                max={59}
                                                value={minuteStep}
                                                onChange={(e) => setMinuteStep(Math.max(1, Math.min(59, Number(e.target.value))))}
                                                className='w-24 px-3 py-1.5 text-sm font-mono font-semibold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                            />
                                            <span className='text-xs text-gray-600 dark:text-gray-400'>{isVi ? "phút (*/" + minuteStep + ")" : "minutes (*/" + minuteStep + ")"}</span>
                                        </div>
                                    )}
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='minuteMode' checked={minuteMode === "specific"} onChange={() => setMinuteMode("specific")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Vào một phút cụ thể" : "At a specific minute"}</span>
                                    </label>
                                    {minuteMode === "specific" && (
                                        <div className='pl-7 flex items-center gap-2'>
                                            <input
                                                type='number'
                                                min={0}
                                                max={59}
                                                value={minuteSpecific}
                                                onChange={(e) => setMinuteSpecific(Math.max(0, Math.min(59, Number(e.target.value))))}
                                                className='w-24 px-3 py-1.5 text-sm font-mono font-semibold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                            />
                                            <span className='text-xs text-gray-600 dark:text-gray-400'>{isVi ? "phút trong giờ" : "minute of the hour"}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Hour Settings */}
                            {activeTab === "hour" && (
                                <div className='space-y-4'>
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='hourMode' checked={hourMode === "every"} onChange={() => setHourMode("every")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Mỗi giờ (*)" : "Every hour (*)"}</span>
                                    </label>
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='hourMode' checked={hourMode === "step"} onChange={() => setHourMode("step")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Mỗi chu kỳ giờ (*/step)" : "Every hour interval (*/step)"}</span>
                                    </label>
                                    {hourMode === "step" && (
                                        <div className='pl-7 flex items-center gap-2'>
                                            <span className='text-xs text-gray-600 dark:text-gray-400'>{isVi ? "Mỗi:" : "Every:"}</span>
                                            <input
                                                type='number'
                                                min={1}
                                                max={23}
                                                value={hourStep}
                                                onChange={(e) => setHourStep(Math.max(1, Math.min(23, Number(e.target.value))))}
                                                className='w-24 px-3 py-1.5 text-sm font-mono font-semibold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                            />
                                            <span className='text-xs text-gray-600 dark:text-gray-400'>{isVi ? "tiếng" : "hours"}</span>
                                        </div>
                                    )}
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='hourMode' checked={hourMode === "specific"} onChange={() => setHourMode("specific")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Vào một giờ cụ thể" : "At a specific hour"}</span>
                                    </label>
                                    {hourMode === "specific" && (
                                        <div className='pl-7 flex items-center gap-2'>
                                            <input
                                                type='number'
                                                min={0}
                                                max={23}
                                                value={hourSpecific}
                                                onChange={(e) => setHourSpecific(Math.max(0, Math.min(23, Number(e.target.value))))}
                                                className='w-24 px-3 py-1.5 text-sm font-mono font-semibold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                            />
                                            <span className='text-xs text-gray-600 dark:text-gray-400'>{isVi ? "giờ (0-23)" : "hour (0-23)"}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Day of Month Settings */}
                            {activeTab === "dom" && (
                                <div className='space-y-4'>
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='domMode' checked={domMode === "every"} onChange={() => setDomMode("every")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Mỗi ngày trong tháng (*)" : "Every day of month (*)"}</span>
                                    </label>
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='domMode' checked={domMode === "specific"} onChange={() => setDomMode("specific")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Vào ngày cụ thể trong tháng" : "On specific day of month"}</span>
                                    </label>
                                    {domMode === "specific" && (
                                        <div className='pl-7 flex items-center gap-2'>
                                            <input
                                                type='number'
                                                min={1}
                                                max={31}
                                                value={domSpecific}
                                                onChange={(e) => setDomSpecific(Math.max(1, Math.min(31, Number(e.target.value))))}
                                                className='w-24 px-3 py-1.5 text-sm font-mono font-semibold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                            />
                                            <span className='text-xs text-gray-600 dark:text-gray-400'>{isVi ? "ngày trong tháng (1-31)" : "day (1-31)"}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Month Settings */}
                            {activeTab === "month" && (
                                <div className='space-y-4'>
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='monthMode' checked={monthMode === "every"} onChange={() => setMonthMode("every")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Mỗi tháng (*)" : "Every month (*)"}</span>
                                    </label>
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='monthMode' checked={monthMode === "specific"} onChange={() => setMonthMode("specific")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Vào tháng cụ thể" : "In a specific month"}</span>
                                    </label>
                                    {monthMode === "specific" && (
                                        <div className='pl-7 flex items-center gap-2'>
                                            <input
                                                type='number'
                                                min={1}
                                                max={12}
                                                value={monthSpecific}
                                                onChange={(e) => setMonthSpecific(Math.max(1, Math.min(12, Number(e.target.value))))}
                                                className='w-24 px-3 py-1.5 text-sm font-mono font-semibold rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                            />
                                            <span className='text-xs text-gray-600 dark:text-gray-400'>{isVi ? "tháng (1-12)" : "month (1-12)"}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Day of Week Settings */}
                            {activeTab === "dow" && (
                                <div className='space-y-4'>
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='dowMode' checked={dowMode === "every"} onChange={() => setDowMode("every")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Mỗi ngày trong tuần (*)" : "Every day of week (*)"}</span>
                                    </label>
                                    <label className='flex items-center gap-3 text-sm cursor-pointer text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                                        <input type='radio' name='dowMode' checked={dowMode === "specific"} onChange={() => setDowMode("specific")} className='accent-blue-600 w-4 h-4 cursor-pointer' />
                                        <span className='font-medium'>{isVi ? "Vào thứ cụ thể" : "On a specific weekday"}</span>
                                    </label>
                                    {dowMode === "specific" && (
                                        <div className='pl-7 flex items-center gap-2'>
                                            <select
                                                value={dowSpecific}
                                                onChange={(e) => setDowSpecific(Number(e.target.value))}
                                                className='px-3.5 py-1.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer'
                                            >
                                                <option value={0}>{isVi ? "Chủ Nhật (0)" : "Sunday (0)"}</option>
                                                <option value={1}>{isVi ? "Thứ Hai (1)" : "Monday (1)"}</option>
                                                <option value={2}>{isVi ? "Thứ Ba (2)" : "Tuesday (2)"}</option>
                                                <option value={3}>{isVi ? "Thứ Tư (3)" : "Wednesday (3)"}</option>
                                                <option value={4}>{isVi ? "Thứ Năm (4)" : "Thursday (4)"}</option>
                                                <option value={5}>{isVi ? "Thứ Sáu (5)" : "Friday (5)"}</option>
                                                <option value={6}>{isVi ? "Thứ Bảy (6)" : "Saturday (6)"}</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    ) : (
                        /* Parser explanation card */
                        <Card className='p-6 space-y-4 text-gray-900 dark:text-gray-100'>
                            <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                                <span>📖</span> {isVi ? "Cú Pháp 5 Trường Chuẩn Cron" : "Standard 5-Field Cron Syntax"}
                            </h3>
                            <div className='grid grid-cols-5 gap-2 text-center text-xs font-mono'>
                                <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700'>
                                    <div className='font-bold text-blue-600 dark:text-blue-400'>*</div>
                                    <div className='mt-1 text-gray-700 dark:text-gray-300'>{isVi ? "Phút" : "Minute"}</div>
                                    <div className='text-[10px] text-gray-500 dark:text-gray-400'>0 - 59</div>
                                </div>
                                <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700'>
                                    <div className='font-bold text-purple-600 dark:text-purple-400'>*</div>
                                    <div className='mt-1 text-gray-700 dark:text-gray-300'>{isVi ? "Giờ" : "Hour"}</div>
                                    <div className='text-[10px] text-gray-500 dark:text-gray-400'>0 - 23</div>
                                </div>
                                <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700'>
                                    <div className='font-bold text-emerald-600 dark:text-emerald-400'>*</div>
                                    <div className='mt-1 text-gray-700 dark:text-gray-300'>{isVi ? "Ngày" : "DOM"}</div>
                                    <div className='text-[10px] text-gray-500 dark:text-gray-400'>1 - 31</div>
                                </div>
                                <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700'>
                                    <div className='font-bold text-amber-600 dark:text-amber-400'>*</div>
                                    <div className='mt-1 text-gray-700 dark:text-gray-300'>{isVi ? "Tháng" : "Month"}</div>
                                    <div className='text-[10px] text-gray-500 dark:text-gray-400'>1 - 12</div>
                                </div>
                                <div className='p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700'>
                                    <div className='font-bold text-rose-600 dark:text-rose-400'>*</div>
                                    <div className='mt-1 text-gray-700 dark:text-gray-300'>{isVi ? "Thứ" : "DOW"}</div>
                                    <div className='text-[10px] text-gray-500 dark:text-gray-400'>0 - 6</div>
                                </div>
                            </div>

                            <div className='p-4 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1.5 text-xs text-gray-700 dark:text-gray-300'>
                                <p>• <code className='font-bold text-blue-600 dark:text-blue-400'>*</code> : {isVi ? "Khớp mọi giá trị" : "Match any value"}</p>
                                <p>• <code className='font-bold text-blue-600 dark:text-blue-400'>,</code> : {isVi ? "Danh sách phân tách (ví dụ: 1,3,5)" : "Value list separator (e.g. 1,3,5)"}</p>
                                <p>• <code className='font-bold text-blue-600 dark:text-blue-400'>-</code> : {isVi ? "Khoảng giá trị (ví dụ: 1-5 từ Thứ 2 đến Thứ 6)" : "Range of values (e.g. 1-5 for Mon-Fri)"}</p>
                                <p>• <code className='font-bold text-blue-600 dark:text-blue-400'>/</code> : {isVi ? "Bước nhảy chu kỳ (ví dụ: */15 mỗi 15 phút)" : "Step values (e.g. */15 for every 15 mins)"}</p>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Col: Next 10 Executions Preview */}
                <div className='lg:col-span-1 space-y-4'>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3 sticky top-20'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                                <span>📅</span> {isVi ? "10 Lần Chạy Kế Tiếp" : "Next 10 Executions"}
                            </h3>
                            <span className='text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium'>
                                {isVi ? "So sánh 2 múi giờ" : "Dual Timezone"}
                            </span>
                        </div>

                        {nextTenRuns.length === 0 ? (
                            <div className='text-center py-8 text-gray-400 text-xs'>
                                {isVi ? "Biểu thức không tạo ra lịch chạy trong 60 ngày tới" : "No executions found in next 60 days"}
                            </div>
                        ) : (
                            <div className='space-y-2.5 max-h-[460px] overflow-y-auto pr-1'>
                                {nextTenRuns.map((run, i) => (
                                    <div
                                        key={i}
                                        className='p-3 rounded-xl bg-gray-50/70 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-xs space-y-1.5'
                                    >
                                        <div className='flex items-center justify-between'>
                                            <span className='font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                                                <span>🕒</span> {run.localFormatted}
                                            </span>
                                            <span className='text-[11px] text-emerald-600 dark:text-emerald-400 font-medium shrink-0'>
                                                {run.relative}
                                            </span>
                                        </div>
                                        <div className='text-[11px] text-gray-500 dark:text-gray-400 font-mono flex items-center gap-1.5 pl-4 border-t border-gray-200/50 dark:border-gray-800/50 pt-1'>
                                            <span>☁️</span>
                                            <span className='font-bold text-amber-600 dark:text-amber-400'>{run.utcFormatted}</span>
                                            <span className='text-[10px] text-gray-400'>({isVi ? "Giờ máy chủ" : "Server time"})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cloud Platforms Timezone Guide */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <span>🌐</span> {isVi ? "Múi Giờ Mặc Định Của Các Nền Tảng Đám Mây & Server" : "Default Timezones on Cloud Platforms & Servers"}
                </h3>
                <p className='text-xs text-gray-600 dark:text-gray-400 leading-relaxed'>
                    {isVi
                        ? "Khi cấu hình Cron Job trên các nền tảng đám mây, hầu hết các hệ thống đều chạy mặc định ở múi giờ UTC (GMT+0). Nếu bạn muốn cron chạy đúng giờ làm việc tại Việt Nam (UTC+7), hãy sao chép biểu thức 'Biểu Thức Máy Chủ Chuẩn (UTC)' ở trên để tránh bị chạy chậm hoặc lệch 7 tiếng:"
                        : "When scheduling cron jobs in cloud environments, almost all platforms default to UTC (GMT+0). If you want your cron to run during local business hours, always copy the converted 'UTC Cloud Expression' above to prevent schedule mismatches:"}
                </p>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs'>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-1'>
                        <div className='font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                            <span>🐙</span> GitHub Actions
                        </div>
                        <div className='text-amber-600 dark:text-amber-400 font-semibold'>Mặc định: UTC (GMT+0)</div>
                        <div className='text-gray-500 text-[11px]'>Dùng cấu hình <code>schedule: - cron: &apos;...&apos;</code></div>
                    </div>

                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-1'>
                        <div className='font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                            <span>☁️</span> AWS EventBridge / Lambda
                        </div>
                        <div className='text-amber-600 dark:text-amber-400 font-semibold'>Mặc định: UTC (GMT+0)</div>
                        <div className='text-gray-500 text-[11px]'>Hỗ trợ biểu thức cron hoặc rate</div>
                    </div>

                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-1'>
                        <div className='font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                            <span>☸️</span> Kubernetes CronJob
                        </div>
                        <div className='text-emerald-600 dark:text-emerald-400 font-semibold'>Node TZ / spec.timeZone</div>
                        <div className='text-gray-500 text-[11px]'>K8s v1.27+ hỗ trợ trường <code>spec.timeZone</code></div>
                    </div>

                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-1'>
                        <div className='font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                            <span>▲</span> Vercel Cron Jobs
                        </div>
                        <div className='text-amber-600 dark:text-amber-400 font-semibold'>Mặc định: UTC (GMT+0)</div>
                        <div className='text-gray-500 text-[11px]'>Cấu hình trong file <code>vercel.json</code></div>
                    </div>

                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-1'>
                        <div className='font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                            <span>⚡</span> Cloudflare Workers
                        </div>
                        <div className='text-amber-600 dark:text-amber-400 font-semibold'>Mặc định: UTC (GMT+0)</div>
                        <div className='text-gray-500 text-[11px]'>Cron Triggers trong <code>wrangler.toml</code></div>
                    </div>

                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 space-y-1'>
                        <div className='font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                            <span>🐧</span> Linux Crontab (VPS)
                        </div>
                        <div className='text-blue-600 dark:text-blue-400 font-semibold'>Theo giờ hệ điều hành VPS</div>
                        <div className='text-gray-500 text-[11px]'>Kiểm tra bằng lệnh <code>timedatectl</code></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
