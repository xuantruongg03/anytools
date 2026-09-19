"use client";

import { useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { toast } from "@/components/ui/Toast";

const TEAM_COLOR_SCHEMES = [
    {
        badge: "bg-blue-500 text-white",
        header: "from-blue-600 to-indigo-600",
        border: "border-blue-200 dark:border-blue-800",
        bg: "bg-blue-50/50 dark:bg-blue-950/20",
    },
    {
        badge: "bg-emerald-500 text-white",
        header: "from-emerald-600 to-teal-600",
        border: "border-emerald-200 dark:border-emerald-800",
        bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    },
    {
        badge: "bg-purple-500 text-white",
        header: "from-purple-600 to-pink-600",
        border: "border-purple-200 dark:border-purple-800",
        bg: "bg-purple-50/50 dark:bg-purple-950/20",
    },
    {
        badge: "bg-amber-500 text-white",
        header: "from-amber-600 to-orange-600",
        border: "border-amber-200 dark:border-amber-800",
        bg: "bg-amber-50/50 dark:bg-amber-950/20",
    },
    {
        badge: "bg-rose-500 text-white",
        header: "from-rose-600 to-red-600",
        border: "border-rose-200 dark:border-rose-800",
        bg: "bg-rose-50/50 dark:bg-rose-950/20",
    },
    {
        badge: "bg-cyan-500 text-white",
        header: "from-cyan-600 to-blue-600",
        border: "border-cyan-200 dark:border-cyan-800",
        bg: "bg-cyan-50/50 dark:bg-cyan-950/20",
    },
    {
        badge: "bg-fuchsia-500 text-white",
        header: "from-fuchsia-600 to-purple-600",
        border: "border-fuchsia-200 dark:border-fuchsia-800",
        bg: "bg-fuchsia-50/50 dark:bg-fuchsia-950/20",
    },
    {
        badge: "bg-teal-500 text-white",
        header: "from-teal-600 to-emerald-600",
        border: "border-teal-200 dark:border-teal-800",
        bg: "bg-teal-50/50 dark:bg-teal-950/20",
    },
];

interface GeneratedTeam {
    id: number;
    name: string;
    leader: string | null;
    members: string[];
    colorScheme: (typeof TEAM_COLOR_SCHEMES)[0];
}

const SAMPLE_STUDENTS_VI = `Nguyễn Văn An
Trần Thị Bình
Lê Hoàng Cường
Phạm Quốc Dũng
Hoàng Thùy Dương
Vũ Đức Giang
Đặng Thu Hà
Bùi Hải Hùng
Đỗ Mai Linh
Ngô Thành Nam
Lý Thị Oanh
Dương Đình Phúc
Phan Minh Quân
Trịnh Văn Sơn
Bạch Như Thảo
Cao Phương Uyên
Đinh Thế Vinh
Lâm Xuân Vượng
Kiều Ngọc Yến
Mai Trọng Đạt
Tô Bích Hạnh
Chu Tuấn Kiệt
Lương Khánh Ly
Đoàn Nhật Minh
Tạ Khánh Nga
Quách Hồng Phong
Trương Gia Phú
Tăng Hải Quỳnh
Diệp Bảo Trâm
Lưu Minh Trí`;

const SAMPLE_STUDENTS_EN = `Alice Johnson
Bob Smith
Charlie Brown
David Miller
Emma Davis
Frank Wilson
Grace Taylor
Henry Anderson
Ivy Thomas
Jack White
Kelly Harris
Liam Martin
Mia Thompson
Noah Garcia
Olivia Martinez
Paul Robinson
Quinn Clark
Ryan Rodriguez
Sophia Lewis
Tom Lee
Uma Walker
Victor Hall
Wendy Allen
Xavier Young
Yara King
Zachary Wright
Aiden Scott
Chloe Green
Ethan Baker
Zoe Adams`;

export default function TeamGeneratorClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = getTranslation(locale).tools.teamGenerator;

    const [rawInput, setRawInput] = useState<string>(isVi ? SAMPLE_STUDENTS_VI : SAMPLE_STUDENTS_EN);
    const [splitMode, setSplitMode] = useState<"numTeams" | "teamSize">("numTeams");
    const [targetCount, setTargetCount] = useState<number>(4);
    const [assignLeader, setAssignLeader] = useState<boolean>(true);
    const [teams, setTeams] = useState<GeneratedTeam[]>([]);
    const [isShuffling, setIsShuffling] = useState<boolean>(false);

    // Parsed list of valid names
    const parsedNames = useMemo(() => {
        return rawInput
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }, [rawInput]);

    // Split logic
    const handleGenerate = useCallback(() => {
        if (parsedNames.length < 2) {
            toast.error(t.errorEmpty);
            return;
        }

        const count = Math.max(1, targetCount);
        let numTeams = 1;

        if (splitMode === "numTeams") {
            numTeams = Math.min(count, parsedNames.length);
        } else {
            // By member per team
            numTeams = Math.max(1, Math.round(parsedNames.length / count));
        }

        setIsShuffling(true);

        // Fisher-Yates fair shuffle
        const shuffled = [...parsedNames];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Distribute round-robin to ensure balanced teams
        const groupArrays: string[][] = Array.from({ length: numTeams }, () => []);
        shuffled.forEach((name, idx) => {
            groupArrays[idx % numTeams].push(name);
        });

        const newTeams: GeneratedTeam[] = groupArrays.map((members, idx) => {
            const leader = assignLeader && members.length > 0 ? members[0] : null;
            const remainingMembers = assignLeader && members.length > 0 ? members.slice(1) : members;
            return {
                id: idx + 1,
                name: `${t.teamPrefix} ${idx + 1}`,
                leader,
                members: remainingMembers,
                colorScheme: TEAM_COLOR_SCHEMES[idx % TEAM_COLOR_SCHEMES.length],
            };
        });

        setTimeout(() => {
            setTeams(newTeams);
            setIsShuffling(false);
            toast.success(isVi ? `Đã chia thành ${numTeams} nhóm thành công!` : `Created ${numTeams} teams successfully!`);
        }, 150);
    }, [parsedNames, targetCount, splitMode, assignLeader, t.errorEmpty, t.teamPrefix, isVi]);

    // Quick Presets
    const loadSampleClass = () => {
        setRawInput(isVi ? SAMPLE_STUDENTS_VI : SAMPLE_STUDENTS_EN);
        toast.info(isVi ? "Đã nạp 30 học sinh mẫu!" : "Loaded 30 sample students!");
    };

    const loadNumbersSample = () => {
        const numbers = Array.from({ length: 30 }, (_, i) => `${isVi ? "Thành viên" : "Member"} ${i + 1}`).join("\n");
        setRawInput(numbers);
        toast.info(isVi ? "Đã nạp số thứ tự 1-30!" : "Loaded numbers 1-30!");
    };

    const handleClear = () => {
        setRawInput("");
        setTeams([]);
    };

    // Copy formatted text
    const handleCopyAll = async () => {
        if (teams.length === 0) return;
        let text = `=== ${t.resultsTitle.toUpperCase()} (${teams.length} ${t.teamPrefix}) ===\n\n`;
        teams.forEach((team) => {
            const total = (team.leader ? 1 : 0) + team.members.length;
            text += `📁 ${team.name} (${total} ${t.membersCount}):\n`;
            if (team.leader) {
                text += `  👑 [${t.leaderBadge}] ${team.leader}\n`;
            }
            team.members.forEach((m, i) => {
                text += `  ${i + 1}. ${m}\n`;
            });
            text += "\n";
        });

        try {
            await navigator.clipboard.writeText(text);
            toast.success(t.copiedToast);
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    // Download .txt file
    const handleDownloadTxt = () => {
        if (teams.length === 0) return;
        let text = `=== ${t.resultsTitle.toUpperCase()} (${teams.length} ${t.teamPrefix}) ===\n\n`;
        teams.forEach((team) => {
            const total = (team.leader ? 1 : 0) + team.members.length;
            text += `📁 ${team.name} (${total} ${t.membersCount}):\n`;
            if (team.leader) {
                text += `  👑 [${t.leaderBadge}] ${team.leader}\n`;
            }
            team.members.forEach((m, i) => {
                text += `  ${i + 1}. ${m}\n`;
            });
            text += "\n";
        });

        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `teams-list-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(isVi ? "Đã tải file .txt!" : "Downloaded text file!");
    };

    // Print
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className='space-y-6 max-w-6xl mx-auto'>
            {/* Top Config Card */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors print:hidden'>
                {/* Header */}
                <div className='flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700'>
                    <div className='flex items-center gap-3'>
                        <span className='text-3xl'>👥</span>
                        <div>
                            <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                                {t.name}
                            </h2>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {t.description}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            onClick={loadSampleClass}
                            className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 cursor-pointer'
                        >
                            🎓 {t.sampleList}
                        </button>
                        <button
                            type='button'
                            onClick={loadNumbersSample}
                            className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 cursor-pointer'
                        >
                            🔢 {t.numbersSample}
                        </button>
                        <button
                            type='button'
                            onClick={handleClear}
                            className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 cursor-pointer'
                        >
                            🗑️ {t.clear}
                        </button>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                    {/* Left: Raw Names Textarea (7 Cols) */}
                    <div className='lg:col-span-7 flex flex-col'>
                        <div className='flex items-center justify-between mb-2'>
                            <label className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                                <span>📋</span>
                                <span>{t.inputTitle}</span>
                            </label>
                            <span className='px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'>
                                {parsedNames.length} {t.totalCount.toLowerCase()}
                            </span>
                        </div>
                        <textarea
                            value={rawInput}
                            onChange={(e) => setRawInput(e.target.value)}
                            placeholder={t.inputPlaceholder}
                            rows={10}
                            className='w-full p-3.5 text-sm font-sans border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y leading-relaxed'
                        />
                    </div>

                    {/* Right: Settings & Action (5 Cols) */}
                    <div className='lg:col-span-5 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between space-y-4'>
                        <div>
                            <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 mb-3'>
                                ⚙️ {t.modeLabel}
                            </h3>

                            {/* Split Mode Radio Pills */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4'>
                                <button
                                    type='button'
                                    onClick={() => setSplitMode("numTeams")}
                                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                                        splitMode === "numTeams"
                                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <div>📁 {t.byNumTeams}</div>
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setSplitMode("teamSize")}
                                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                                        splitMode === "teamSize"
                                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <div>👤 {t.byTeamSize}</div>
                                </button>
                            </div>

                            {/* Count Slider / Number Input */}
                            <div className='mb-4 bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700'>
                                <div className='flex items-center justify-between mb-2'>
                                    <label className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                                        {splitMode === "numTeams" ? t.numTeamsLabel : t.teamSizeLabel}
                                    </label>
                                    <span className='text-base font-black text-blue-600 dark:text-blue-400'>
                                        {targetCount}
                                    </span>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <input
                                        type='range'
                                        min='2'
                                        max={Math.max(10, Math.min(30, parsedNames.length || 10))}
                                        value={targetCount}
                                        onChange={(e) => setTargetCount(parseInt(e.target.value) || 2)}
                                        className='flex-1 accent-blue-600 cursor-pointer'
                                    />
                                    <input
                                        type='number'
                                        min='1'
                                        max='100'
                                        value={targetCount}
                                        onChange={(e) => setTargetCount(Math.max(1, parseInt(e.target.value) || 1))}
                                        className='w-16 px-2.5 py-1 text-center font-bold text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
                                    />
                                </div>
                            </div>

                            {/* Assign Leader Checkbox */}
                            <label className='flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer select-none'>
                                <input
                                    type='checkbox'
                                    checked={assignLeader}
                                    onChange={(e) => setAssignLeader(e.target.checked)}
                                    className='mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer accent-blue-600'
                                />
                                <div>
                                    <div className='text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5'>
                                        <span>👑</span>
                                        <span>{t.assignLeader}</span>
                                    </div>
                                    <div className='text-[11px] text-gray-500 dark:text-gray-400 mt-0.5'>
                                        {t.assignLeaderDesc}
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Big Generate Button */}
                        <button
                            type='button'
                            onClick={handleGenerate}
                            disabled={parsedNames.length < 2 || isShuffling}
                            className='w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer transition-transform transform active:scale-95 flex items-center justify-center gap-2'
                        >
                            {isShuffling ? (
                                <span>🎲 {isVi ? "Đang xáo trộn..." : "Shuffling..."}</span>
                            ) : (
                                <>
                                    <span>🔀</span>
                                    <span>{teams.length > 0 ? t.shuffleBtn : t.generateBtn}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Output Results Section */}
            {teams.length > 0 ? (
                <div className='space-y-4'>
                    {/* Results Toolbar */}
                    <div className='flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm print:hidden'>
                        <div className='flex items-center gap-2'>
                            <h3 className='text-base font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                <span>🏆</span>
                                <span>{t.resultsTitle}</span>
                                <span className='text-xs font-semibold px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full'>
                                    {teams.length} {t.teamPrefix}
                                </span>
                            </h3>
                        </div>

                        <div className='flex items-center gap-2'>
                            <button
                                type='button'
                                onClick={handleGenerate}
                                className='px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer flex items-center gap-1.5'
                            >
                                <span>🔄</span>
                                <span>{t.shuffleBtn}</span>
                            </button>
                            <button
                                type='button'
                                onClick={handleCopyAll}
                                className='px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 cursor-pointer flex items-center gap-1.5'
                            >
                                <span>📋</span>
                                <span>{t.copyAllBtn}</span>
                            </button>
                            <button
                                type='button'
                                onClick={handleDownloadTxt}
                                className='px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 cursor-pointer flex items-center gap-1.5'
                            >
                                <span>💾</span>
                                <span>{t.downloadTxtBtn}</span>
                            </button>
                            <button
                                type='button'
                                onClick={handlePrint}
                                className='px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer flex items-center gap-1.5 shadow-sm'
                            >
                                <span>🖨️</span>
                                <span>{t.printBtn}</span>
                            </button>
                        </div>
                    </div>

                    {/* Printable Header for print view */}
                    <div className='hidden print:block text-center mb-6'>
                        <h1 className='text-2xl font-black uppercase tracking-wider text-gray-900'>
                            {isVi ? "DANH SÁCH PHÂN CHIA NHÓM" : "CLASSROOM TEAM ASSIGNMENTS"}
                        </h1>
                        <p className='text-sm text-gray-600 mt-1'>
                            {isVi ? "Tổng số" : "Total"}: {parsedNames.length} {t.membersCount} | {teams.length} {t.teamPrefix}
                        </p>
                    </div>

                    {/* Teams Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {teams.map((team) => {
                            const totalMembers = (team.leader ? 1 : 0) + team.members.length;
                            return (
                                <div
                                    key={team.id}
                                    className={`rounded-2xl border ${team.colorScheme.border} ${team.colorScheme.bg} bg-white dark:bg-gray-800/90 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md`}
                                >
                                    {/* Card Header */}
                                    <div
                                        className={`px-4 py-3 bg-gradient-to-r ${team.colorScheme.header} text-white flex items-center justify-between`}
                                    >
                                        <div className='font-black text-sm tracking-wide'>
                                            {team.name}
                                        </div>
                                        <span className='px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-xs'>
                                            {totalMembers} {t.membersCount}
                                        </span>
                                    </div>

                                    {/* Card Body */}
                                    <div className='p-4 space-y-2.5 flex-1 flex flex-col'>
                                        {/* Leader Banner if assigned */}
                                        {team.leader && (
                                            <div className='p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 rounded-xl flex items-center gap-2 shadow-xs'>
                                                <span className='text-lg'>👑</span>
                                                <div className='flex-1 min-w-0'>
                                                    <span className='text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 block'>
                                                        {t.leaderBadge}
                                                    </span>
                                                    <span className='text-xs font-black text-gray-900 dark:text-gray-100 truncate block'>
                                                        {team.leader}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Regular Members */}
                                        <div className='space-y-1.5 flex-1'>
                                            {team.members.map((member, mIdx) => (
                                                <div
                                                    key={mIdx}
                                                    className='flex items-center gap-2 p-1.5 bg-white/70 dark:bg-gray-900/40 rounded-lg text-xs font-medium text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700/60'
                                                >
                                                    <span className='w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center text-[10px] font-bold shrink-0'>
                                                        {team.leader ? mIdx + 2 : mIdx + 1}
                                                    </span>
                                                    <span className='truncate'>{member}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className='text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm print:hidden'>
                    <div className='text-5xl mb-3'>👥</div>
                    <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 mb-1'>
                        {t.resultsTitle}
                    </h3>
                    <p className='text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto'>
                        {t.noTeamsYet}
                    </p>
                </div>
            )}
        </div>
    );
}
