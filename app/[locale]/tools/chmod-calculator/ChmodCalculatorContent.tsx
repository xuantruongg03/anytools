"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface RolePerms {
    read: boolean;
    write: boolean;
    execute: boolean;
}

export default function ChmodCalculatorContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const toolT = (t.tools as any).chmodCalculator;
    const ui = toolT?.ui || {};
    const page = toolT?.page || {};

    const [owner, setOwner] = useState<RolePerms>({ read: true, write: true, execute: true });
    const [group, setGroup] = useState<RolePerms>({ read: true, write: false, execute: true });
    const [others, setOthers] = useState<RolePerms>({ read: true, write: false, execute: true });

    const [fileName, setFileName] = useState<string>("script.sh");
    const [isRecursive, setIsRecursive] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    // Calculate Octal number (0-7)
    const calcOctal = (role: RolePerms): number => {
        return (role.read ? 4 : 0) + (role.write ? 2 : 0) + (role.execute ? 1 : 0);
    };

    // Calculate Symbolic string (rwx)
    const calcSymbolic = (role: RolePerms): string => {
        return `${role.read ? "r" : "-"}${role.write ? "w" : "-"}${role.execute ? "x" : "-"}`;
    };

    const ownerNum = useMemo(() => calcOctal(owner), [owner]);
    const groupNum = useMemo(() => calcOctal(group), [group]);
    const othersNum = useMemo(() => calcOctal(others), [others]);

    const octalString = `${ownerNum}${groupNum}${othersNum}`;
    const symbolicString = `-${calcSymbolic(owner)}${calcSymbolic(group)}${calcSymbolic(others)}`;

    const generatedCommand = useMemo(() => {
        const flag = isRecursive ? "-R " : "";
        const target = fileName.trim() || "myfile";
        return `chmod ${flag}${octalString} ${target}`;
    }, [isRecursive, octalString, fileName]);

    const applyPreset = (code: string) => {
        const parseDigit = (d: number): RolePerms => ({
            read: (d & 4) === 4,
            write: (d & 2) === 2,
            execute: (d & 1) === 1,
        });

        if (code.length === 3) {
            setOwner(parseDigit(parseInt(code[0], 10)));
            setGroup(parseDigit(parseInt(code[1], 10)));
            setOthers(parseDigit(parseInt(code[2], 10)));
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className='space-y-8 max-w-5xl mx-auto'>
            {/* Top Display: Octal, Symbolic, Command */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card className='p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-900/30 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/60 rounded-2xl text-center shadow-sm'>
                    <div className='text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                        {ui.octalValue || "Octal Value"}
                    </div>
                    <div className='text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tracking-widest'>
                        {octalString}
                    </div>
                </Card>

                <Card className='p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-900/30 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800/60 rounded-2xl text-center shadow-sm'>
                    <div className='text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                        {ui.symbolicValue || "Symbolic Notation"}
                    </div>
                    <div className='text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 font-mono tracking-wider pt-1'>
                        {symbolicString}
                    </div>
                </Card>

                <Card className='p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/30 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-center shadow-sm flex flex-col justify-between'>
                    <div className='text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                        {ui.commandPreview || "Shell Command"}
                    </div>
                    <div className='font-mono font-bold text-sm text-gray-900 dark:text-white truncate'>
                        {generatedCommand}
                    </div>
                    <button
                        onClick={handleCopy}
                        className='mt-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs'
                    >
                        {copied ? (ui.copied || "Copied!") : (ui.copyCommand || "Copy Command")}
                    </button>
                </Card>
            </div>

            {/* Presets Row */}
            <div className='flex items-center gap-2 flex-wrap text-xs p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                <span className='font-semibold text-gray-500 dark:text-gray-400 mr-2'>
                    {ui.presetsLabel || "Presets"}:
                </span>
                <button onClick={() => applyPreset("644")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium cursor-pointer'>
                    {ui.preset644 || "644 (File)"}
                </button>
                <button onClick={() => applyPreset("755")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium cursor-pointer'>
                    {ui.preset755 || "755 (Directory/Script)"}
                </button>
                <button onClick={() => applyPreset("600")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium cursor-pointer'>
                    {ui.preset600 || "600 (SSH Key)"}
                </button>
                <button onClick={() => applyPreset("400")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium cursor-pointer'>
                    {ui.preset400 || "400 (Read Only)"}
                </button>
                <button onClick={() => applyPreset("700")} className='px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium cursor-pointer'>
                    {ui.preset700 || "700 (Private Dir)"}
                </button>
                <button onClick={() => applyPreset("777")} className='px-3 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-600 dark:text-red-400 font-medium rounded-lg cursor-pointer'>
                    {ui.preset777 || "777 (Full Access - Caution)"}
                </button>
            </div>

            {/* Checkbox Grid: Owner, Group, Others */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Owner */}
                <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4'>
                    <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3'>
                        <h4 className='font-bold text-gray-900 dark:text-white text-base'>
                            👤 {ui.owner || "Owner (User)"}
                        </h4>
                        <span className='px-2.5 py-1 text-xs font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg'>
                            {ownerNum}
                        </span>
                    </div>

                    <div className='space-y-3 text-sm'>
                        <label className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>{ui.read || "Read (r / 4)"}</span>
                            <input
                                type='checkbox'
                                checked={owner.read}
                                onChange={(e) => setOwner({ ...owner, read: e.target.checked })}
                                className='w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer'
                            />
                        </label>

                        <label className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>{ui.write || "Write (w / 2)"}</span>
                            <input
                                type='checkbox'
                                checked={owner.write}
                                onChange={(e) => setOwner({ ...owner, write: e.target.checked })}
                                className='w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer'
                            />
                        </label>

                        <label className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>{ui.execute || "Execute (x / 1)"}</span>
                            <input
                                type='checkbox'
                                checked={owner.execute}
                                onChange={(e) => setOwner({ ...owner, execute: e.target.checked })}
                                className='w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer'
                            />
                        </label>
                    </div>
                </Card>

                {/* Group */}
                <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4'>
                    <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3'>
                        <h4 className='font-bold text-gray-900 dark:text-white text-base'>
                            👥 {ui.group || "Group"}
                        </h4>
                        <span className='px-2.5 py-1 text-xs font-mono font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg'>
                            {groupNum}
                        </span>
                    </div>

                    <div className='space-y-3 text-sm'>
                        <label className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>{ui.read || "Read (r / 4)"}</span>
                            <input
                                type='checkbox'
                                checked={group.read}
                                onChange={(e) => setGroup({ ...group, read: e.target.checked })}
                                className='w-5 h-5 rounded text-purple-600 accent-purple-600 cursor-pointer'
                            />
                        </label>

                        <label className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>{ui.write || "Write (w / 2)"}</span>
                            <input
                                type='checkbox'
                                checked={group.write}
                                onChange={(e) => setGroup({ ...group, write: e.target.checked })}
                                className='w-5 h-5 rounded text-purple-600 accent-purple-600 cursor-pointer'
                            />
                        </label>

                        <label className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>{ui.execute || "Execute (x / 1)"}</span>
                            <input
                                type='checkbox'
                                checked={group.execute}
                                onChange={(e) => setGroup({ ...group, execute: e.target.checked })}
                                className='w-5 h-5 rounded text-purple-600 accent-purple-600 cursor-pointer'
                            />
                        </label>
                    </div>
                </Card>

                {/* Others */}
                <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md space-y-4'>
                    <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3'>
                        <h4 className='font-bold text-gray-900 dark:text-white text-base'>
                            🌐 {ui.others || "Others (Public)"}
                        </h4>
                        <span className='px-2.5 py-1 text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg'>
                            {othersNum}
                        </span>
                    </div>

                    <div className='space-y-3 text-sm'>
                        <label className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>{ui.read || "Read (r / 4)"}</span>
                            <input
                                type='checkbox'
                                checked={others.read}
                                onChange={(e) => setOthers({ ...others, read: e.target.checked })}
                                className='w-5 h-5 rounded text-emerald-600 accent-emerald-600 cursor-pointer'
                            />
                        </label>

                        <label className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>{ui.write || "Write (w / 2)"}</span>
                            <input
                                type='checkbox'
                                checked={others.write}
                                onChange={(e) => setOthers({ ...others, write: e.target.checked })}
                                className='w-5 h-5 rounded text-emerald-600 accent-emerald-600 cursor-pointer'
                            />
                        </label>

                        <label className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>{ui.execute || "Execute (x / 1)"}</span>
                            <input
                                type='checkbox'
                                checked={others.execute}
                                onChange={(e) => setOthers({ ...others, execute: e.target.checked })}
                                className='w-5 h-5 rounded text-emerald-600 accent-emerald-600 cursor-pointer'
                            />
                        </label>
                    </div>
                </Card>
            </div>

            {/* Custom File Name & Recursive Options */}
            <Card className='p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-center'>
                    <div>
                        <label className='block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5'>
                            {ui.fileName || "File / Directory Name"}
                        </label>
                        <input
                            type='text'
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            placeholder='script.sh'
                            className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        />
                    </div>

                    <div className='sm:pt-5'>
                        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={isRecursive}
                                onChange={(e) => setIsRecursive(e.target.checked)}
                                className='w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer'
                            />
                            <span>{ui.recursive || "Recursive (-R for directories)"}</span>
                        </label>
                    </div>
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
