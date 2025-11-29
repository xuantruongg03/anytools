"use client";

import { useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { passwordGeneratorTranslations } from "@/lib/i18n/tools/password-generator";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

// Word list for memorable passwords
const wordList = ["correct", "horse", "battery", "staple", "dragon", "phoenix", "tiger", "elephant", "mountain", "river", "ocean", "forest", "sunshine", "rainbow", "thunder", "crystal", "diamond", "emerald", "sapphire", "ruby", "planet", "galaxy", "comet", "meteor", "adventure", "journey", "treasure", "magic", "wisdom", "courage", "freedom", "harmony", "mystery", "wonder", "dream", "vision", "spirit", "legend", "hero", "champion"];

export default function PasswordGeneratorClient() {
    const { locale } = useLanguage();
    const t = passwordGeneratorTranslations[locale].passwordGenerator.ui;

    // Random password state
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [excludeSimilar, setExcludeSimilar] = useState(false);
    const [randomCopied, setRandomCopied] = useState(false);
    const [randomEntropy, setRandomEntropy] = useState(0);
    const [randomStrength, setRandomStrength] = useState("");
    const [randomTimeToCrack, setRandomTimeToCrack] = useState("");

    // Memorable password state
    const [memorablePassword, setMemorablePassword] = useState("");
    const [wordCount, setWordCount] = useState(4);
    const [separator, setSeparator] = useState("-");
    const [capitalizeWords, setCapitalizeWords] = useState(true);
    const [addNumbers, setAddNumbers] = useState(true);
    const [addSymbolsEnd, setAddSymbolsEnd] = useState(false);
    const [memorableCopied, setMemorableCopied] = useState(false);
    const [memorableEntropy, setMemorableEntropy] = useState(0);
    const [memorableStrength, setMemorableStrength] = useState("");
    const [memorableTimeToCrack, setMemorableTimeToCrack] = useState("");

    // Strengthen state
    const [inputPassword, setInputPassword] = useState("");
    const [strengthenedPassword, setStrengthenedPassword] = useState("");
    const [capitalizeFirst, setCapitalizeFirst] = useState(true);
    const [capitalizeEachWord, setCapitalizeEachWord] = useState(false);
    const [addNumberEnd, setAddNumberEnd] = useState(true);
    const [addSymbolEnd, setAddSymbolEnd] = useState(true);
    const [replaceLetters, setReplaceLetters] = useState(true);
    const [insertSymbols, setInsertSymbols] = useState(false);
    const [doubleVowels, setDoubleVowels] = useState(false);
    const [reverseWords, setReverseWords] = useState(false);
    const [strengthenedCopied, setStrengthenedCopied] = useState(false);
    const [strengthenedEntropy, setStrengthenedEntropy] = useState(0);
    const [strengthenedStrength, setStrengthenedStrength] = useState("");
    const [strengthenedTimeToCrack, setStrengthenedTimeToCrack] = useState("");

    const generatePassword = () => {
        let charset = "";
        if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
        if (includeNumbers) charset += "0123456789";
        if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

        if (excludeSimilar) {
            charset = charset.replace(/[il1Lo0O]/g, "");
        }

        if (charset === "") {
            charset = "abcdefghijklmnopqrstuvwxyz";
        }

        let result = "";
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            result += charset[array[i] % charset.length];
        }

        setPassword(result);
        calculateStats(result, setRandomEntropy, setRandomStrength, setRandomTimeToCrack);
    };

    const generateMemorable = () => {
        const array = new Uint32Array(wordCount + 2);
        crypto.getRandomValues(array);

        let words: string[] = [];
        for (let i = 0; i < wordCount; i++) {
            let word = wordList[array[i] % wordList.length];
            if (capitalizeWords) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            words.push(word);
        }

        let result = words.join(separator);

        if (addNumbers) {
            result += array[wordCount] % 100;
        }

        if (addSymbolsEnd) {
            const symbols = "!@#$%^&*";
            result += symbols[array[wordCount + 1] % symbols.length];
        }

        setMemorablePassword(result);
        calculateStats(result, setMemorableEntropy, setMemorableStrength, setMemorableTimeToCrack);
    };

    const strengthenPassword = () => {
        if (!inputPassword) return;

        let result = inputPassword;

        // Capitalize first letter
        if (capitalizeFirst && result.length > 0) {
            result = result.charAt(0).toUpperCase() + result.slice(1);
        }

        // Capitalize each word
        if (capitalizeEachWord) {
            result = result
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        }

        // Replace letters with similar characters
        if (replaceLetters) {
            result = result.replace(/a/gi, (match) => (match === "a" ? "@" : "@"));
            result = result.replace(/e/gi, (match) => (match === "e" ? "3" : "3"));
            result = result.replace(/i/gi, (match) => (match === "i" ? "!" : "!"));
            result = result.replace(/o/gi, (match) => (match === "o" ? "0" : "0"));
            result = result.replace(/s/gi, (match) => (match === "s" ? "$" : "$"));
        }

        // Double vowels
        if (doubleVowels) {
            result = result.replace(/[aeiou]/gi, (match) => match + match);
        }

        // Insert random symbols
        if (insertSymbols && result.length > 2) {
            const symbols = "!@#$%^&*";
            const pos = Math.floor(Math.random() * (result.length - 1)) + 1;
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            result = result.slice(0, pos) + symbol + result.slice(pos);
        }

        // Reverse word order
        if (reverseWords) {
            result = result.split(" ").reverse().join(" ");
        }

        // Add number at end
        if (addNumberEnd) {
            result += Math.floor(Math.random() * 100);
        }

        // Add symbol at end
        if (addSymbolEnd) {
            const symbols = "!@#$%^&*";
            result += symbols[Math.floor(Math.random() * symbols.length)];
        }

        setStrengthenedPassword(result);
        calculateStats(result, setStrengthenedEntropy, setStrengthenedStrength, setStrengthenedTimeToCrack);
    };

    const calculateStats = useCallback(
        (pwd: string, setEntropy: (v: number) => void, setStrength: (v: string) => void, setTimeToCrack: (v: string) => void) => {
            if (!pwd) return;

            // Calculate character set size
            let charsetSize = 0;
            if (/[a-z]/.test(pwd)) charsetSize += 26;
            if (/[A-Z]/.test(pwd)) charsetSize += 26;
            if (/[0-9]/.test(pwd)) charsetSize += 10;
            if (/[^a-zA-Z0-9]/.test(pwd)) charsetSize += 32;

            // Calculate entropy
            const entropyValue = pwd.length * Math.log2(charsetSize || 26);
            setEntropy(Math.round(entropyValue));

            // Calculate strength
            let score = 0;
            if (pwd.length >= 8) score++;
            if (pwd.length >= 12) score++;
            if (pwd.length >= 16) score++;
            if (/[a-z]/.test(pwd)) score++;
            if (/[A-Z]/.test(pwd)) score++;
            if (/[0-9]/.test(pwd)) score++;
            if (/[^a-zA-Z0-9]/.test(pwd)) score++;

            if (score <= 3) setStrength("weak");
            else if (score <= 5) setStrength("medium");
            else if (score <= 6) setStrength("strong");
            else setStrength("veryStrong");

            // Calculate time to crack (assuming 1 billion attempts per second)
            const combinations = Math.pow(charsetSize || 26, pwd.length);
            const seconds = combinations / 1000000000;

            if (seconds < 1) setTimeToCrack(t.instant);
            else if (seconds < 60) setTimeToCrack(`${Math.round(seconds)} ${t.seconds}`);
            else if (seconds < 3600) setTimeToCrack(`${Math.round(seconds / 60)} ${t.minutes}`);
            else if (seconds < 86400) setTimeToCrack(`${Math.round(seconds / 3600)} ${t.hours}`);
            else if (seconds < 2592000) setTimeToCrack(`${Math.round(seconds / 86400)} ${t.days}`);
            else if (seconds < 31536000) setTimeToCrack(`${Math.round(seconds / 2592000)} ${t.months}`);
            else if (seconds < 3153600000) setTimeToCrack(`${Math.round(seconds / 31536000)} ${t.years}`);
            else setTimeToCrack(`${Math.round(seconds / 3153600000)} ${t.centuries}`);
        },
        [t.instant, t.seconds, t.minutes, t.hours, t.days, t.months, t.years, t.centuries]
    );

    const copyToClipboard = useCallback(async (text: string, setCopiedState: (v: boolean) => void) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedState(true);
            setTimeout(() => setCopiedState(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }, []);

    const pageT = useMemo(() => passwordGeneratorTranslations[locale].passwordGenerator.page, [locale]);

    const renderStatsDisplay = useCallback(
        (pwd: string, entropy: number, strength: string, timeToCrack: string, copiedState: boolean, setCopiedState: (v: boolean) => void) => {
            if (!pwd) return null;

            return (
                <div className='mb-4'>
                    <div className='relative mb-3'>
                        <input type='text' value={pwd} readOnly className='w-full px-4 py-3 pr-24 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-lg' />
                        <Button onClick={() => copyToClipboard(pwd, setCopiedState)} variant='secondary' size='sm' className='absolute right-2 top-1/2 -translate-y-1/2'>
                            {copiedState ? t.copied : t.copy}
                        </Button>
                    </div>

                    <div className='p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                        <div className='grid grid-cols-3 gap-3 text-sm'>
                            <div>
                                <div className='text-xs text-gray-600 dark:text-gray-400 mb-1'>{t.strength}</div>
                                <div className={`font-semibold ${strength === "weak" ? "text-red-600 dark:text-red-400" : strength === "medium" ? "text-yellow-600 dark:text-yellow-400" : strength === "strong" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}>{t[strength as keyof typeof t] || strength}</div>
                            </div>
                            <div>
                                <div className='text-xs text-gray-600 dark:text-gray-400 mb-1'>{t.entropy}</div>
                                <div className='font-semibold text-gray-900 dark:text-gray-100'>{entropy} bits</div>
                            </div>
                            <div>
                                <div className='text-xs text-gray-600 dark:text-gray-400 mb-1'>{t.timeToCrack}</div>
                                <div className='font-semibold text-gray-900 dark:text-gray-100'>{timeToCrack}</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        },
        [t.copy, t.copied, t.strength, t.weak, t.medium, t.strong, t.veryStrong, t.entropy, t.timeToCrack, copyToClipboard]
    );

    return (
        <div className='max-w-4xl mx-auto'>

            <div className='space-y-8'>
                {/* Password Strengthener */}
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-4'>{t.strengthen}</h2>

                    {renderStatsDisplay(strengthenedPassword, strengthenedEntropy, strengthenedStrength, strengthenedTimeToCrack, strengthenedCopied, setStrengthenedCopied)}

                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t.yourPasswordLabel}</label>
                        <input type='text' value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} placeholder={t.enterPassword} className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100' />
                    </div>

                    <div className='space-y-2'>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={capitalizeFirst} onChange={(e) => setCapitalizeFirst(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.capitalizeFirst}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={capitalizeEachWord} onChange={(e) => setCapitalizeEachWord(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.capitalizeWords}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={replaceLetters} onChange={(e) => setReplaceLetters(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.replaceLetters}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={doubleVowels} onChange={(e) => setDoubleVowels(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.doubleVowels}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={insertSymbols} onChange={(e) => setInsertSymbols(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.insertSymbols}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={reverseWords} onChange={(e) => setReverseWords(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.reverseWords}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={addNumberEnd} onChange={(e) => setAddNumberEnd(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.addNumberEnd}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={addSymbolEnd} onChange={(e) => setAddSymbolEnd(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.addSymbolEnd}</span>
                        </label>
                    </div>

                    <Button onClick={strengthenPassword} variant='purple' size='lg' fullWidth>
                        {t.strengthen}
                    </Button>
                </div>

                {/* Random Password Generator */}
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-4'>{t.generate}</h2>

                    {renderStatsDisplay(password, randomEntropy, randomStrength, randomTimeToCrack, randomCopied, setRandomCopied)}

                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            {t.length}: {length}
                        </label>
                        <input type='range' min='8' max='64' value={length} onChange={(e) => setLength(Number(e.target.value))} className='w-full' />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={includeUppercase} onChange={(e) => setIncludeUppercase(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.uppercase}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={includeLowercase} onChange={(e) => setIncludeLowercase(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.lowercase}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.numbers}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.symbols}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={excludeSimilar} onChange={(e) => setExcludeSimilar(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.excludeSimilar}</span>
                        </label>
                    </div>

                    <Button onClick={generatePassword} variant='primary' size='lg' fullWidth>
                        {t.generate}
                    </Button>
                </div>

                {/* Memorable Password Generator */}
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-4'>{t.memorablePassword}</h2>

                    {renderStatsDisplay(memorablePassword, memorableEntropy, memorableStrength, memorableTimeToCrack, memorableCopied, setMemorableCopied)}

                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            {t.wordCount}: {wordCount}
                        </label>
                        <input type='range' min='2' max='6' value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} className='w-full' />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t.separator}</label>
                        <Select value={separator} onChange={(e) => setSeparator(e.target.value)} className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
                            <option value=''>{t.separatorNone}</option>
                            <option value='-'>{t.separatorHyphen}</option>
                            <option value='_'>{t.separatorUnderscore}</option>
                            <option value='.'>{t.separatorDot}</option>
                            <option value=' '>{t.separatorSpace}</option>
                        </Select>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={capitalizeWords} onChange={(e) => setCapitalizeWords(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.capitalizeWords}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={addNumbers} onChange={(e) => setAddNumbers(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.addNumbers}</span>
                        </label>

                        <label className='flex items-center gap-2 cursor-pointer'>
                            <input type='checkbox' checked={addSymbolsEnd} onChange={(e) => setAddSymbolsEnd(e.target.checked)} className='w-4 h-4' />
                            <span className='text-gray-700 dark:text-gray-300'>{t.addSymbols}</span>
                        </label>
                    </div>

                    <Button onClick={generateMemorable} variant='success' size='lg' fullWidth>
                        {t.generateMemor}
                    </Button>
                </div>
            </div>
        </div>
    );
}
