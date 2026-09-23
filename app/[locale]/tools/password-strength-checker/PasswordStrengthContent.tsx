"use client";

import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { passwordStrengthTranslations } from "@/lib/i18n/tools/password-strength-checker";
import { toast } from "@/components/ui/Toast";

// Format seconds into human readable duration
function formatDuration(seconds: number, isVi: boolean): string {
    if (seconds < 1) return isVi ? "Tức thì (< 1 giây)" : "Instantly (< 1 sec)";
    if (seconds < 60) return isVi ? `${Math.round(seconds)} giây` : `${Math.round(seconds)} seconds`;
    const minutes = seconds / 60;
    if (minutes < 60) return isVi ? `${Math.round(minutes)} phút` : `${Math.round(minutes)} minutes`;
    const hours = minutes / 60;
    if (hours < 24) return isVi ? `${Math.round(hours)} giờ` : `${Math.round(hours)} hours`;
    const days = hours / 24;
    if (days < 30) return isVi ? `${Math.round(days)} ngày` : `${Math.round(days)} days`;
    const months = days / 30.44;
    if (months < 12) return isVi ? `${Math.round(months)} tháng` : `${Math.round(months)} months`;
    const years = days / 365.25;
    if (years < 100) return isVi ? `${Math.round(years)} năm` : `${Math.round(years)} years`;
    if (years < 10000) return isVi ? `${Math.round(years).toLocaleString()} năm` : `${Math.round(years).toLocaleString()} years`;
    if (years < 1e6) return isVi ? `${(years / 1000).toFixed(1)} nghìn năm` : `${(years / 1000).toFixed(1)}k years`;
    if (years < 1e9) return isVi ? `${(years / 1e6).toFixed(1)} triệu năm` : `${(years / 1e6).toFixed(1)} million years`;
    if (years < 1e12) return isVi ? `${(years / 1e9).toFixed(1)} tỷ năm` : `${(years / 1e9).toFixed(1)} billion years`;
    return isVi ? "Vô hạn (> Tuổi vũ trụ)" : "Infinity (> Age of Universe)";
}

export default function PasswordStrengthContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = passwordStrengthTranslations[locale];

    const [password, setPassword] = useState<string>("Correct-Horse-Battery-2026!");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Generator states
    const [genLength, setGenLength] = useState<number>(18);
    const [includeUpper, setIncludeUpper] = useState<boolean>(true);
    const [includeLower, setIncludeLower] = useState<boolean>(true);
    const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
    const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
    const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);

    // Cryptographically secure password generator
    const generatePassword = () => {
        let chars = "";
        const lowerChars = "abcdefghijklmnopqrstuvwxyz";
        const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numChars = "0123456789";
        const symChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

        if (includeLower) chars += lowerChars;
        if (includeUpper) chars += upperChars;
        if (includeNumbers) chars += numChars;
        if (includeSymbols) chars += symChars;

        if (excludeAmbiguous) {
            chars = chars.replace(/[0O1lI|`'"]/g, "");
        }

        if (!chars) chars = lowerChars;

        const randomValues = new Uint32Array(genLength);
        window.crypto.getRandomValues(randomValues);

        let result = "";
        for (let i = 0; i < genLength; i++) {
            result += chars[randomValues[i] % chars.length];
        }

        setPassword(result);
        toast.success(isVi ? "Đã sinh mật khẩu an toàn mới!" : "Generated new secure password!");
    };

    // Shannon Entropy & Strength Calculation
    const analysis = useMemo(() => {
        const len = password.length;
        if (len === 0) {
            return {
                entropy: 0,
                poolSize: 0,
                score: 0,
                label: t.scoreVeryWeak,
                color: "text-red-500",
                bgBar: "bg-red-500",
                widthPct: 0,
                hasLower: false,
                hasUpper: false,
                hasDigits: false,
                hasSymbols: false,
                hasRepeats: false,
                hasSequential: false,
                isDictionary: false,
                crackOnlineSlow: "0 sec",
                crackOnlineFast: "0 sec",
                crackGpu: "0 sec",
                crackArgon2: "0 sec",
            };
        }

        let pool = 0;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasDigits = /[0-9]/.test(password);
        const hasSymbols = /[^a-zA-Z0-9]/.test(password);

        if (hasLower) pool += 26;
        if (hasUpper) pool += 26;
        if (hasDigits) pool += 10;
        if (hasSymbols) pool += 33;

        // Base entropy
        let rawEntropy = pool > 0 ? len * (Math.log(pool) / Math.log(2)) : 0;

        // Deductions & Pattern detection
        const hasRepeats = /(.)\1{2,}/.test(password);
        if (hasRepeats) rawEntropy = Math.max(0, rawEntropy - 10);

        const lowerPw = password.toLowerCase();
        const commonSequences = ["12345", "23456", "qwerty", "asdfgh", "zxcvbn", "abcdef", "password", "admin", "iloveyou"];
        const hasSequential = commonSequences.some((seq) => lowerPw.includes(seq));
        if (hasSequential) rawEntropy = Math.max(0, rawEntropy - 15);

        const commonDict = ["password", "123456", "12345678", "qwerty", "admin", "welcome", "football", "master", "dragon", "monkey"];
        const isDictionary = commonDict.includes(lowerPw);
        if (isDictionary) rawEntropy = Math.min(rawEntropy, 12);

        const finalEntropy = Math.round(rawEntropy);

        // Security rating
        let score = 1;
        let label = t.scoreVeryWeak;
        let color = "text-red-500";
        let bgBar = "bg-red-500";
        let widthPct = 15;

        if (finalEntropy >= 80 && len >= 14) {
            score = 5;
            label = t.scoreVeryStrong;
            color = "text-emerald-500";
            bgBar = "bg-emerald-500";
            widthPct = 100;
        } else if (finalEntropy >= 60 && len >= 10) {
            score = 4;
            label = t.scoreStrong;
            color = "text-green-500";
            bgBar = "bg-green-500";
            widthPct = 80;
        } else if (finalEntropy >= 45 && len >= 8) {
            score = 3;
            label = t.scoreFair;
            color = "text-yellow-500";
            bgBar = "bg-yellow-500";
            widthPct = 55;
        } else if (finalEntropy >= 28) {
            score = 2;
            label = t.scoreWeak;
            color = "text-orange-500";
            bgBar = "bg-orange-500";
            widthPct = 35;
        }

        // Crack speed calculations
        // Possibilities: 2^finalEntropy
        // Note: For very high entropy, Math.pow(2, finalEntropy) can be infinity in JS if > 1024, but safe up to 1000
        const totalGuesses = Math.pow(2, Math.min(finalEntropy, 128));

        const crackOnlineSlow = formatDuration(totalGuesses / 100, isVi);
        const crackOnlineFast = formatDuration(totalGuesses / 10000, isVi);
        const crackGpu = formatDuration(totalGuesses / 1e11, isVi);
        const crackArgon2 = formatDuration(totalGuesses / 10000, isVi);

        return {
            entropy: finalEntropy,
            poolSize: pool,
            score,
            label,
            color,
            bgBar,
            widthPct,
            hasLower,
            hasUpper,
            hasDigits,
            hasSymbols,
            hasRepeats,
            hasSequential,
            isDictionary,
            crackOnlineSlow,
            crackOnlineFast,
            crackGpu,
            crackArgon2,
        };
    }, [password, t, isVi]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(password);
            toast.success(t.copied);
        } catch {
            toast.error(isVi ? "Lỗi sao chép" : "Failed to copy");
        }
    };

    return (
        <div className='max-w-6xl mx-auto space-y-8'>
            {/* Header info */}
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3'>
                    <span>🛡️</span> {t.name}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                    {t.description}
                </p>
            </div>

            {/* Privacy notice banner */}
            <div className='p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2'>
                <span>{t.privacyNotice}</span>
            </div>

            {/* Main Interactive Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
                {/* Left: Input & Entropy Meter */}
                <div className='lg:col-span-7 space-y-6'>
                    {/* Password Input Studio Card */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 space-y-5'>
                        <div className='flex items-center justify-between'>
                            <label className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                                {t.inputLabel}
                            </label>
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                            >
                                {showPassword ? `🙈 ${t.hidePassword}` : `👁️ ${t.showPassword}`}
                            </button>
                        </div>

                        {/* Input with Action Buttons */}
                        <div className='relative flex items-center'>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t.inputPlaceholder}
                                className='w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-lg font-mono font-bold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-24'
                            />
                            <button
                                type='button'
                                onClick={handleCopy}
                                className='absolute right-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 font-semibold text-xs border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer shadow-xs'
                            >
                                📋 {t.copyBtn}
                            </button>
                        </div>

                        {/* Dynamic Strength Meter Progress Bar */}
                        <div className='space-y-2 pt-1'>
                            <div className='flex items-center justify-between'>
                                <span className={`text-sm font-bold ${analysis.color}`}>
                                    {analysis.label}
                                </span>
                                <span className='text-xs font-mono font-bold text-gray-500'>
                                    {analysis.entropy} bits / 128
                                </span>
                            </div>
                            <div className='w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden p-0.5'>
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${analysis.bgBar}`}
                                    style={{ width: `${analysis.widthPct}%` }}
                                />
                            </div>
                        </div>

                        {/* Metrics Stat Cards */}
                        <div className='grid grid-cols-3 gap-3 pt-2'>
                            <div className='p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 text-center space-y-1'>
                                <span className='text-[10px] uppercase font-bold text-gray-500 block'>{t.entropyBits}</span>
                                <span className='text-base font-extrabold font-mono text-gray-900 dark:text-gray-100'>{analysis.entropy} bits</span>
                            </div>
                            <div className='p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 text-center space-y-1'>
                                <span className='text-[10px] uppercase font-bold text-gray-500 block'>{t.lengthLabel}</span>
                                <span className='text-base font-extrabold font-mono text-gray-900 dark:text-gray-100'>{password.length} chars</span>
                            </div>
                            <div className='p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 text-center space-y-1'>
                                <span className='text-[10px] uppercase font-bold text-gray-500 block'>{t.poolSize}</span>
                                <span className='text-base font-extrabold font-mono text-gray-900 dark:text-gray-100'>{analysis.poolSize} symbols</span>
                            </div>
                        </div>
                    </div>

                    {/* Crack Time Estimations Card */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                        <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                            <span>⏱️</span> {t.crackTitle}
                        </h3>

                        <div className='space-y-2.5 text-xs'>
                            <div className='p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <span className='font-semibold text-gray-800 dark:text-gray-200 block'>
                                        🌐 {t.crackOnlineSlow}
                                    </span>
                                </div>
                                <span className='font-mono font-bold text-blue-600 dark:text-blue-400'>
                                    {analysis.crackOnlineSlow}
                                </span>
                            </div>

                            <div className='p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <span className='font-semibold text-gray-800 dark:text-gray-200 block'>
                                        ⚡ {t.crackOnlineFast}
                                    </span>
                                </div>
                                <span className='font-mono font-bold text-indigo-600 dark:text-indigo-400'>
                                    {analysis.crackOnlineFast}
                                </span>
                            </div>

                            <div className='p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <span className='font-semibold text-gray-800 dark:text-gray-200 block'>
                                        🖥️ {t.crackGpuCluster}
                                    </span>
                                </div>
                                <span className='font-mono font-bold text-emerald-600 dark:text-emerald-400'>
                                    {analysis.crackGpu}
                                </span>
                            </div>

                            <div className='p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                    <span className='font-semibold text-gray-800 dark:text-gray-200 block'>
                                        🔒 {t.crackArgon2}
                                    </span>
                                </div>
                                <span className='font-mono font-bold text-purple-600 dark:text-purple-400'>
                                    {analysis.crackArgon2}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Security Checklist & Generator */}
                <div className='lg:col-span-5 space-y-6'>
                    {/* Security Checklist */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                        <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                            <span>📋</span> {t.checklistTitle}
                        </h3>

                        <div className='space-y-2 text-xs'>
                            {[
                                { ok: password.length >= 12, label: t.checkLength },
                                { ok: analysis.hasLower, label: t.checkLower },
                                { ok: analysis.hasUpper, label: t.checkUpper },
                                { ok: analysis.hasDigits, label: t.checkDigits },
                                { ok: analysis.hasSymbols, label: t.checkSymbols },
                                { ok: !analysis.hasRepeats, label: t.checkNoRepeats },
                                { ok: !analysis.hasSequential, label: t.checkNoSequential },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                                        item.ok
                                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300"
                                            : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-500"
                                    }`}
                                >
                                    <span className='font-bold text-sm'>{item.ok ? "✓" : "○"}</span>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Built-in CSPRNG Generator */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-5'>
                        <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                            <span>🎲</span> {t.genTitle}
                        </h3>

                        {/* Length Slider */}
                        <div className='space-y-1.5'>
                            <div className='flex justify-between text-xs font-semibold'>
                                <span className='text-gray-700 dark:text-gray-300'>{t.genLength}</span>
                                <span className='font-mono font-bold text-blue-600'>{genLength}</span>
                            </div>
                            <input
                                type='range'
                                min='8'
                                max='64'
                                value={genLength}
                                onChange={(e) => setGenLength(parseInt(e.target.value, 10))}
                                className='w-full accent-blue-600 cursor-pointer'
                            />
                        </div>

                        {/* Toggles */}
                        <div className='grid grid-cols-2 gap-2 text-xs'>
                            <label className='flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'>
                                <input
                                    type='checkbox'
                                    checked={includeUpper}
                                    onChange={(e) => setIncludeUpper(e.target.checked)}
                                    className='rounded accent-blue-600'
                                />
                                <span>{t.genIncludeUpper}</span>
                            </label>

                            <label className='flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'>
                                <input
                                    type='checkbox'
                                    checked={includeLower}
                                    onChange={(e) => setIncludeLower(e.target.checked)}
                                    className='rounded accent-blue-600'
                                />
                                <span>{t.genIncludeLower}</span>
                            </label>

                            <label className='flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'>
                                <input
                                    type='checkbox'
                                    checked={includeNumbers}
                                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                                    className='rounded accent-blue-600'
                                />
                                <span>{t.genIncludeNumbers}</span>
                            </label>

                            <label className='flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'>
                                <input
                                    type='checkbox'
                                    checked={includeSymbols}
                                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                                    className='rounded accent-blue-600'
                                />
                                <span>{t.genIncludeSymbols}</span>
                            </label>
                        </div>

                        <label className='flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer pt-1'>
                            <input
                                type='checkbox'
                                checked={excludeAmbiguous}
                                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                                className='rounded accent-blue-600'
                            />
                            <span>{t.genExcludeAmbiguous}</span>
                        </label>

                        {/* Generate Action Button */}
                        <button
                            type='button'
                            onClick={generatePassword}
                            className='w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer'
                        >
                            ⚡ {t.generateBtn}
                        </button>
                    </div>
                </div>
            </div>

            {/* Guide Section */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <h2 className='text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <span>📖</span> {t.guideTitle}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-blue-600 dark:text-blue-400'>{t.guide1Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-indigo-600 dark:text-indigo-400'>{t.guide2Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-emerald-600 dark:text-emerald-400'>{t.guide3Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <span>❓</span> {t.faqTitle}
                </h3>
                <div className='space-y-3 text-xs'>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq1Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq1A}</p>
                    </div>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq2Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq2A}</p>
                    </div>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq3Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq3A}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
