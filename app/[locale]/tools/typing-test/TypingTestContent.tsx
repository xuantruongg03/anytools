"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { typingTestTranslations } from "@/lib/i18n/tools/typing-test";
import { toast } from "@/components/ui/Toast";

const VI_WORDS = [
    "thời", "tiết", "hôm", "nay", "rất", "đẹp", "chúng", "ta", "cùng", "nhau",
    "học", "tập", "làm", "việc", "chăm", "chỉ", "để", "đạt", "kết", "quả",
    "tốt", "nhất", "trong", "cuộc", "sống", "mỗi", "ngày", "đều", "là", "cơ",
    "hội", "mới", "hãy", "luôn", "giữ", "vững", "niềm", "tin", "và", "ước",
    "mơ", "công", "nghệ", "thông", "tin", "đang", "phát", "triển", "nhanh", "chóng",
    "trên", "toàn", "thế", "giới", "máy", "tính", "và", "điện", "thoại", "thông",
    "minh", "giúp", "con", "người", "kết", "nối", "dễ", "dàng", "hơn", "bao",
    "giờ", "hết", "đọc", "sách", "là", "thói", "quen", "tốt", "giúp", "mở",
    "rộng", "kiến", "thức", "và", "tư", "duy", "sáng", "tạo", "hãy", "dành",
    "thời", "gian", "mỗi", "ngày", "để", "rèn", "luyện", "sức", "khỏe", "thể",
    "dục", "thể", "thao", "uống", "nhiều", "nước", "và", "ngủ", "đủ", "giấc",
    "gia", "đình", "là", "nơi", "bình", "yên", "nhất", "chia", "sẻ", "yêu",
    "thương", "với", "những", "người", "thân", "yêu", "thành", "công", "đến", "từ",
    "sự", "kiên", "trì", "và", "nỗ", "lực", "không", "ngừng", "nghỉ", "hãy",
    "bắt", "đầu", "ngay", "hôm", "nay", "với", "tất", "cả", "đam", "mê"
];

const EN_WORDS = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "technology",
    "advances", "rapidly", "changing", "how", "people", "live", "work", "and",
    "communicate", "across", "world", "every", "single", "day", "brings", "new",
    "opportunities", "to", "learn", "grow", "and", "achieve", "meaningful", "goals",
    "reading", "books", "expands", "knowledge", "and", "inspires", "creative", "thinking",
    "practice", "typing", "regularly", "improves", "speed", "and", "accuracy", "significantly",
    "consistency", "is", "key", "to", "mastering", "any", "valuable", "skill", "in",
    "life", "stay", "focused", "healthy", "and", "keep", "pushing", "forward", "with",
    "passion", "software", "development", "builds", "modern", "digital", "solutions",
    "internet", "connects", "communities", "worldwide", "sharing", "information", "freely",
    "time", "management", "helps", "maintain", "healthy", "work", "life", "balance",
    "explore", "nature", "enjoy", "simple", "moments", "and", "cherish", "friendships"
];

function getRandomWords(list: string[], count: number = 100): string[] {
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * list.length);
        result.push(list[randomIndex]);
    }
    return result;
}

export default function TypingTestContent() {
    const { locale } = useLanguage();
    const t = typingTestTranslations[locale as "en" | "vi"] || typingTestTranslations.en;
    const isVi = locale === "vi";

    // Test Config
    const [testLang, setTestLang] = useState<"vi" | "en">(isVi ? "vi" : "en");
    const [duration, setDuration] = useState<number>(60);

    // State
    const [words, setWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [currentInput, setCurrentInput] = useState<string>("");
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(60);

    // Metrics
    const [correctChars, setCorrectChars] = useState<number>(0);
    const [wrongChars, setWrongChars] = useState<number>(0);
    const [correctWordsCount, setCorrectWordsCount] = useState<number>(0);
    const [wrongWordsCount, setWrongWordsCount] = useState<number>(0);
    const [wordResults, setWordResults] = useState<{ [index: number]: boolean }>({});

    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Init word list
    const resetTest = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        const pool = testLang === "vi" ? VI_WORDS : EN_WORDS;
        setWords(getRandomWords(pool, 120));
        setCurrentWordIndex(0);
        setCurrentInput("");
        setIsStarted(false);
        setIsFinished(false);
        setTimeLeft(duration);
        setCorrectChars(0);
        setWrongChars(0);
        setCorrectWordsCount(0);
        setWrongWordsCount(0);
        setWordResults({});
        setTimeout(() => inputRef.current?.focus(), 50);
    }, [testLang, duration]);

    useEffect(() => {
        resetTest();
    }, [resetTest]);

    // Timer countdown
    useEffect(() => {
        if (isStarted && !isFinished && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        setIsFinished(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isStarted, isFinished, timeLeft]);

    // Handle typing input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        if (!isStarted && !isFinished) {
            setIsStarted(true);
        }

        if (isFinished) return;

        // When space is pressed, validate the word
        if (val.endsWith(" ")) {
            const typedWord = val.trim();
            const targetWord = words[currentWordIndex] || "";

            const isCorrect = typedWord === targetWord;
            setWordResults((prev) => ({ ...prev, [currentWordIndex]: isCorrect }));

            if (isCorrect) {
                setCorrectWordsCount((prev) => prev + 1);
                setCorrectChars((prev) => prev + targetWord.length + 1);
            } else {
                setWrongWordsCount((prev) => prev + 1);
                setWrongChars((prev) => prev + Math.max(typedWord.length, targetWord.length));
            }

            setCurrentWordIndex((prev) => prev + 1);
            setCurrentInput("");

            // Add more words if nearing end
            if (currentWordIndex + 20 >= words.length) {
                const pool = testLang === "vi" ? VI_WORDS : EN_WORDS;
                setWords((prev) => [...prev, ...getRandomWords(pool, 50)]);
            }
        } else {
            setCurrentInput(val);
        }
    };

    // Calculate final metrics
    const timeSpent = Math.max(1, duration - timeLeft);
    const minutes = timeSpent / 60;
    // Standard WPM = (correct characters / 5) / minutes
    const wpm = Math.round((correctChars / 5) / minutes) || 0;
    const cpm = Math.round(correctChars / minutes) || 0;
    const totalKeystrokes = correctChars + wrongChars;
    const accuracy = totalKeystrokes > 0 ? Math.round((correctChars / totalKeystrokes) * 100) : 100;

    // Determine ranking
    const getRank = () => {
        if (wpm >= 80) return { title: t.rankPro, color: "text-purple-600 dark:text-purple-400" };
        if (wpm >= 55) return { title: t.rankFast, color: "text-blue-600 dark:text-blue-400" };
        if (wpm >= 35) return { title: t.rankAverage, color: "text-emerald-600 dark:text-emerald-400" };
        return { title: t.rankBeginner, color: "text-amber-600 dark:text-amber-400" };
    };

    const handleShare = () => {
        const text = isVi
            ? `⚡ Tôi vừa đạt ${wpm} WPM (Độ chính xác ${accuracy}%) trong bài kiểm tra tốc độ gõ trên AnyTools! Kiểm tra tốc độ của bạn tại: https://anytools.online/vi/tools/typing-test`
            : `⚡ I just scored ${wpm} WPM (Accuracy ${accuracy}%) on AnyTools Typing Speed Test! Test your speed at: https://anytools.online/en/tools/typing-test`;
        navigator.clipboard.writeText(text);
        toast.success(t.copiedResult);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-6'>
            {/* Top Controls Bar */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-4'>
                {/* Language Switcher */}
                <div className='flex items-center gap-2'>
                    <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>{t.language}:</span>
                    <div className='flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold'>
                        <button
                            type='button'
                            onClick={() => setTestLang("vi")}
                            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                testLang === "vi" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-2xs" : "text-gray-600 dark:text-gray-400"
                            }`}
                        >
                            Tiếng Việt 🇻🇳
                        </button>
                        <button
                            type='button'
                            onClick={() => setTestLang("en")}
                            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                testLang === "en" ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-2xs" : "text-gray-600 dark:text-gray-400"
                            }`}
                        >
                            English 🇺🇸
                        </button>
                    </div>
                </div>

                {/* Duration Switcher */}
                <div className='flex items-center gap-2'>
                    <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>{t.duration}:</span>
                    <div className='flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs font-semibold'>
                        {[15, 30, 60, 120].map((sec) => (
                            <button
                                key={sec}
                                type='button'
                                onClick={() => setDuration(sec)}
                                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                    duration === sec ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-2xs" : "text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                {sec}s
                            </button>
                        ))}
                    </div>
                </div>

                {/* Restart Button */}
                <button
                    type='button'
                    onClick={resetTest}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer'
                >
                    <span>🔄</span>
                    <span>{t.restart}</span>
                </button>
            </div>

            {/* Live Metrics HUD */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full'>
                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1'>{t.wpm}</div>
                    <div className='text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono'>
                        {wpm}
                    </div>
                </div>

                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1'>{t.accuracy}</div>
                    <div className='text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono'>
                        {accuracy}%
                    </div>
                </div>

                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1'>{t.cpm}</div>
                    <div className='text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400 font-mono'>
                        {cpm}
                    </div>
                </div>

                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center'>
                    <div className='text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1'>{t.timeRemaining}</div>
                    <div className={`text-3xl sm:text-4xl font-extrabold font-mono ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-gray-900 dark:text-white"}`}>
                        {timeLeft}s
                    </div>
                </div>
            </div>

            {/* Word Display Box */}
            <div
                onClick={() => inputRef.current?.focus()}
                className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 cursor-text select-none min-h-[160px] flex flex-wrap content-start gap-x-2.5 gap-y-3 leading-relaxed font-mono text-lg sm:text-2xl relative overflow-hidden transition-all'
            >
                {words.slice(Math.max(0, currentWordIndex - 15), currentWordIndex + 25).map((word, idx) => {
                    const actualIndex = Math.max(0, currentWordIndex - 15) + idx;
                    const isCurrent = actualIndex === currentWordIndex;
                    const result = wordResults[actualIndex];

                    let colorClass = "text-gray-400 dark:text-gray-500";
                    if (result === true) {
                        colorClass = "text-emerald-600 dark:text-emerald-400 font-bold";
                    } else if (result === false) {
                        colorClass = "text-red-500 line-through font-bold";
                    } else if (isCurrent) {
                        colorClass = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg font-bold";
                    }

                    return (
                        <span key={actualIndex} className={`${colorClass} transition-colors`}>
                            {word}
                        </span>
                    );
                })}
            </div>

            {/* Hidden / Focused Input */}
            <div className='w-full'>
                <input
                    ref={inputRef}
                    type='text'
                    disabled={isFinished}
                    value={currentInput}
                    onChange={handleInputChange}
                    placeholder={t.startTyping}
                    className='w-full px-5 py-4 text-lg font-mono rounded-2xl bg-white dark:bg-gray-900 border-2 border-blue-500/50 dark:border-blue-500/40 focus:border-blue-600 dark:focus:border-blue-400 focus:outline-none shadow-md text-gray-900 dark:text-white placeholder-gray-400 text-center'
                    autoFocus
                />
            </div>

            {/* Results Modal / Card */}
            {isFinished && (
                <div className='w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 p-8 rounded-3xl border border-blue-200 dark:border-blue-800/80 shadow-lg text-center space-y-6 animate-fadeIn'>
                    <div>
                        <span className='text-4xl mb-2 inline-block'>🏆</span>
                        <h3 className='text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white'>
                            {t.resultsTitle}
                        </h3>
                        <p className={`text-lg font-bold mt-1 ${getRank().color}`}>
                            {getRank().title}
                        </p>
                    </div>

                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto'>
                        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-gray-700'>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>{t.wpm}</div>
                            <div className='text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono'>{wpm}</div>
                        </div>

                        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-gray-700'>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>{t.accuracy}</div>
                            <div className='text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono'>{accuracy}%</div>
                        </div>

                        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-gray-700'>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>{t.correctWords}</div>
                            <div className='text-3xl font-extrabold text-emerald-600 font-mono'>{correctWordsCount}</div>
                        </div>

                        <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-gray-700'>
                            <div className='text-xs text-gray-500 dark:text-gray-400'>{t.wrongWords}</div>
                            <div className='text-3xl font-extrabold text-red-500 font-mono'>{wrongWordsCount}</div>
                        </div>
                    </div>

                    <div className='flex items-center justify-center gap-3 flex-wrap'>
                        <Button onClick={resetTest} variant='primary' size='lg' className='px-8 py-3 font-bold'>
                            🔄 {t.tryAgain}
                        </Button>
                        <Button onClick={handleShare} variant='secondary' size='lg' className='px-8 py-3 font-bold'>
                            🔗 {t.shareResult}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
