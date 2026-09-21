"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { autoBingSearchTranslations } from "@/lib/i18n/tools/auto-bing-search";
import { generateInstantSearchTopics } from "@/lib/constants/bing-search-topics";

type SearchMode = "singleWindow" | "sequentialTabs" | "semiAuto";
type TopicSource = "instant" | "custom" | "gemini";
type SearchStatus = "idle" | "searching" | "paused" | "completed";

export default function AutoSearchContent() {
    const { locale } = useLanguage();
    const t = autoBingSearchTranslations[locale as "en" | "vi"] || autoBingSearchTranslations.en;
    const isVi = locale === "vi";

    // Configuration states
    const [searchCount, setSearchCount] = useState<number>(30);
    const [delayTime, setDelayTime] = useState<number>(9);
    const [useRandomJitter, setUseRandomJitter] = useState<boolean>(true);
    const [searchMode, setSearchMode] = useState<SearchMode>("singleWindow");
    const [topicSource, setTopicSource] = useState<TopicSource>("instant");
    const [customKeywordsText, setCustomKeywordsText] = useState<string>("");

    // Execution & Queue states
    const [queue, setQueue] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [status, setStatus] = useState<SearchStatus>("idle");
    const [countdown, setCountdown] = useState<number>(0);
    const [maxCountdownForStep, setMaxCountdownForStep] = useState<number>(9);
    const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    // Refs for window and timer management
    const searchWindowRef = useRef<Window | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const statusRef = useRef<SearchStatus>("idle");
    const currentIndexRef = useRef<number>(0);
    const queueRef = useRef<string[]>([]);
    const delayTimeRef = useRef<number>(delayTime);
    const useRandomJitterRef = useRef<boolean>(useRandomJitter);
    const searchModeRef = useRef<SearchMode>(searchMode);

    // Keep refs in sync with state
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    useEffect(() => {
        queueRef.current = queue;
    }, [queue]);

    useEffect(() => {
        delayTimeRef.current = delayTime;
    }, [delayTime]);

    useEffect(() => {
        useRandomJitterRef.current = useRandomJitter;
    }, [useRandomJitter]);

    useEffect(() => {
        searchModeRef.current = searchMode;
    }, [searchMode]);

    // Load persisted settings & history on mount
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem("autoSearchHistory");
            if (savedHistory) {
                setSearchHistory(JSON.parse(savedHistory));
            }
            const savedCount = localStorage.getItem("anytools_bing_count");
            if (savedCount) setSearchCount(parseInt(savedCount, 10));

            const savedDelay = localStorage.getItem("anytools_bing_delay");
            if (savedDelay) setDelayTime(parseInt(savedDelay, 10));

            const savedJitter = localStorage.getItem("anytools_bing_jitter");
            if (savedJitter !== null) setUseRandomJitter(savedJitter === "true");

            const savedMode = localStorage.getItem("anytools_bing_mode");
            if (savedMode) setSearchMode(savedMode as SearchMode);

            const savedSource = localStorage.getItem("anytools_bing_source");
            if (savedSource) setTopicSource(savedSource as TopicSource);
        } catch (e) {
            console.error("Error reading localStorage:", e);
        }
    }, []);

    // Generate initial queue when count or source changes (if idle)
    const refreshQueue = useCallback(
        (targetCount: number = searchCount, source: TopicSource = topicSource) => {
            if (statusRef.current !== "idle" && statusRef.current !== "completed") return;

            if (source === "instant") {
                const topics = generateInstantSearchTopics(targetCount, searchHistory, locale);
                setQueue(topics);
                setCurrentIndex(0);
            } else if (source === "custom") {
                const lines = customKeywordsText
                    .split("\n")
                    .map((l) => l.trim())
                    .filter((l) => l.length > 0);
                setQueue(lines.slice(0, targetCount));
                setCurrentIndex(0);
            }
        },
        [searchCount, topicSource, searchHistory, locale, customKeywordsText]
    );

    // Update queue when switching to instant or changing count
    useEffect(() => {
        if (topicSource === "instant" && (status === "idle" || status === "completed")) {
            const topics = generateInstantSearchTopics(searchCount, searchHistory, locale);
            setQueue(topics);
            setCurrentIndex(0);
        }
    }, [searchCount, topicSource, locale]);

    // Update queue when custom keywords text changes
    useEffect(() => {
        if (topicSource === "custom" && (status === "idle" || status === "completed")) {
            const lines = customKeywordsText
                .split("\n")
                .map((l) => l.trim())
                .filter((l) => l.length > 0);
            setQueue(lines);
            setCurrentIndex(0);
        }
    }, [customKeywordsText, topicSource]);

    // Construct realistic Bing search URL
    const getBingSearchUrl = (query: string): string => {
        const encoded = encodeURIComponent(query);
        // Using form=QBLH and pq parameters mimics natural Edge / Bing address bar searches
        return `https://www.bing.com/search?q=${encoded}&form=QBLH&pq=${encoded}`;
    };

    // Calculate next delay with optional random jitter (±2-3 seconds)
    const getNextDelay = (): number => {
        const base = delayTimeRef.current;
        if (!useRandomJitterRef.current) return base;
        // Jitter between -2.5s and +3.5s, minimum 6s
        const jitter = (Math.random() * 6 - 2.5);
        const actual = Math.round(base + jitter);
        return Math.max(6, actual);
    };

    // Clean up timer
    const clearTicker = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // Save executed query to history
    const addToHistory = (query: string) => {
        setSearchHistory((prev) => {
            const lower = query.toLowerCase();
            const updated = prev.filter((item) => item.toLowerCase() !== lower);
            updated.push(query);
            const trimmed = updated.slice(-100);
            try {
                localStorage.setItem("autoSearchHistory", JSON.stringify(trimmed));
            } catch {}
            return trimmed;
        });
    };

    // Open or navigate Bing search window
    const executeSearchAt = (index: number) => {
        const currentQueue = queueRef.current;
        if (index >= currentQueue.length) {
            handleComplete();
            return;
        }

        const query = currentQueue[index];
        const targetUrl = getBingSearchUrl(query);
        const mode = searchModeRef.current;

        if (mode === "singleWindow") {
            try {
                if (!searchWindowRef.current || searchWindowRef.current.closed) {
                    searchWindowRef.current = window.open(
                        targetUrl,
                        "anytools_bing_window",
                        "width=1100,height=800,menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes"
                    );
                } else {
                    searchWindowRef.current.location.href = targetUrl;
                    try {
                        searchWindowRef.current.focus();
                    } catch {}
                }
            } catch (err) {
                console.warn("Could not focus or update window:", err);
                searchWindowRef.current = window.open(targetUrl, "anytools_bing_window");
            }
        } else {
            // sequentialTabs or semiAuto
            window.open(targetUrl, "_blank");
        }

        addToHistory(query);
        setCurrentIndex(index);
    };

    // Advance to next search step
    const advanceNext = () => {
        clearTicker();
        const nextIndex = currentIndexRef.current + 1;
        const currentQueue = queueRef.current;

        if (nextIndex >= currentQueue.length) {
            handleComplete();
            return;
        }

        executeSearchAt(nextIndex);

        if (searchModeRef.current === "semiAuto") {
            // Semi-auto waits for user interaction
            return;
        }

        // Schedule next search with countdown
        const waitSec = getNextDelay();
        setMaxCountdownForStep(waitSec);
        setCountdown(waitSec);

        let remaining = waitSec;
        timerRef.current = setInterval(() => {
            if (statusRef.current === "paused") return;

            remaining -= 1;
            setCountdown(remaining);

            if (remaining <= 0) {
                clearTicker();
                advanceNext();
            }
        }, 1000);
    };

    // Handle session completion
    const handleComplete = () => {
        clearTicker();
        setStatus("completed");
        setCountdown(0);
    };

    // Start auto search
    const handleStart = () => {
        let activeQueue = [...queue];

        // If queue is empty, regenerate immediately
        if (activeQueue.length === 0) {
            activeQueue = generateInstantSearchTopics(searchCount, searchHistory, locale);
            setQueue(activeQueue);
        }

        if (activeQueue.length === 0) {
            alert(isVi ? "Hàng đợi từ khóa đang trống!" : "Search queue is empty!");
            return;
        }

        // Fix Popup Blocker: Open window synchronously in click handler
        const firstUrl = getBingSearchUrl(activeQueue[0]);
        if (searchMode === "singleWindow") {
            const win = window.open(
                firstUrl,
                "anytools_bing_window",
                "width=1100,height=800,menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes"
            );
            if (!win) {
                alert(t.popupWarning);
                return;
            }
            searchWindowRef.current = win;
        } else {
            const win = window.open(firstUrl, "_blank");
            if (!win) {
                alert(t.popupWarning);
                return;
            }
        }

        addToHistory(activeQueue[0]);
        setCurrentIndex(0);
        setStatus("searching");

        if (searchMode === "semiAuto") {
            return;
        }

        // Setup countdown for next search
        const waitSec = getNextDelay();
        setMaxCountdownForStep(waitSec);
        setCountdown(waitSec);

        clearTicker();
        let remaining = waitSec;
        timerRef.current = setInterval(() => {
            if (statusRef.current === "paused") return;

            remaining -= 1;
            setCountdown(remaining);

            if (remaining <= 0) {
                clearTicker();
                advanceNext();
            }
        }, 1000);
    };

    // Pause auto search
    const handlePause = () => {
        setStatus("paused");
    };

    // Resume auto search
    const handleResume = () => {
        setStatus("searching");
    };

    // Stop auto search
    const handleStop = () => {
        clearTicker();
        setStatus("idle");
        setCountdown(0);
        setCurrentIndex(0);
    };

    // Manual next (for semiAuto or skipping wait)
    const handleManualNext = () => {
        advanceNext();
    };

    // Keyboard shortcut for Semi-Auto: Spacebar or Enter
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeTag = (document.activeElement?.tagName || "").toUpperCase();
            if (["INPUT", "TEXTAREA", "SELECT"].includes(activeTag)) return;

            if (e.code === "Space" || e.code === "Enter") {
                if (status === "searching" || (status === "idle" && searchMode === "semiAuto")) {
                    e.preventDefault();
                    if (status === "idle") {
                        handleStart();
                    } else {
                        handleManualNext();
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [status, searchMode, queue]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTicker();
        };
    }, []);

    // Generate with Gemini AI
    const handleGenerateGemini = async () => {
        setIsGeneratingAI(true);
        try {
            const res = await fetch("/api/generate-topics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    existingTopics: searchHistory,
                    count: searchCount,
                    locale,
                }),
            });

            if (!res.ok) throw new Error("API failed");
            const data = await res.json();
            if (Array.isArray(data.topics) && data.topics.length > 0) {
                setQueue(data.topics);
                setCurrentIndex(0);
            } else {
                throw new Error("Empty topics returned");
            }
        } catch (error) {
            console.warn("AI generation failed, fallback to instant:", error);
            const fallback = generateInstantSearchTopics(searchCount, searchHistory, locale);
            setQueue(fallback);
            setCurrentIndex(0);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    // Shuffle current queue
    const handleShuffle = () => {
        setQueue((prev) => [...prev].sort(() => 0.5 - Math.random()));
        setCurrentIndex(0);
    };

    // Remove single item from queue
    const handleRemoveQueueItem = (idx: number) => {
        setQueue((prev) => prev.filter((_, i) => i !== idx));
        if (currentIndex >= idx && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Load sample keywords into custom list
    const handleLoadSampleCustom = () => {
        const sample = isVi
            ? `cách làm sữa chua tại nhà\nthời tiết đà lạt 3 ngày tới\nđánh giá tai nghe không dây giá rẻ\nhướng dẫn gõ 10 ngón nhanh\ntop phim chiếu rạp hay nhất\ncách bảo quản hoa tươi lâu\nlợi ích của việc uống nước ấm mỗi sáng\nkinh nghiệm du lịch phú quốc tự túc\nmẹo sắp xếp bàn làm việc gọn gàng\ncách học từ vựng tiếng anh nhớ lâu`
            : `how to speed up windows 11\nhealthy 15 minute dinner recipes\nweather forecast for tokyo\nbest budget mechanical keyboards\nproductivity tips for remote workers\nbenefits of daily morning stretching\nhow to practice conversational spanish\nsimple minimalist home decor ideas\nhistory of artificial intelligence\neasy indoor house plants for beginners`;
        setCustomKeywordsText(sample);
    };

    // Calculate progress percentage
    const progressPercent = queue.length > 0 ? Math.min(100, Math.round(((currentIndex + (status === "completed" ? 1 : 0)) / queue.length) * 100)) : 0;

    // Estimated points: 3 points per search on Bing
    const estimatedPoints = Math.min(queue.length, currentIndex + (status === "completed" ? 1 : 0)) * 3;

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-6'>
            {/* Main Configuration Card */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all'>
                {/* Section Title & Badges */}
                <div className='flex items-center justify-between flex-wrap gap-2 pb-4 mb-6 border-b border-gray-100 dark:border-gray-800'>
                    <div className='flex items-center gap-2'>
                        <span className='text-2xl'>🔍</span>
                        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                            {isVi ? "Bảng Điều Khiển Tìm Kiếm" : "Search Control Center"}
                        </h2>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60'>
                            Bing Rewards 2026
                        </span>
                        <span className='px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'>
                            Anti-Cooldown
                        </span>
                    </div>
                </div>

                {/* Grid Options: Topic Source & Search Mode */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                    {/* Topic Source Selector */}
                    <div>
                        <label className='block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100'>
                            {t.topicSource}
                        </label>
                        <div className='grid grid-cols-3 gap-2'>
                            <button
                                type='button'
                                disabled={status !== "idle" && status !== "completed"}
                                onClick={() => {
                                    setTopicSource("instant");
                                    localStorage.setItem("anytools_bing_source", "instant");
                                }}
                                className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                                    topicSource === "instant"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                                }`}
                            >
                                <div className='font-bold text-sm mb-0.5'>⚡ 0ms</div>
                                <div>{isVi ? "Tức thì" : "Instant"}</div>
                            </button>

                            <button
                                type='button'
                                disabled={status !== "idle" && status !== "completed"}
                                onClick={() => {
                                    setTopicSource("custom");
                                    localStorage.setItem("anytools_bing_source", "custom");
                                }}
                                className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                                    topicSource === "custom"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                                }`}
                            >
                                <div className='font-bold text-sm mb-0.5'>✏️ Tùy chọn</div>
                                <div>{isVi ? "Tự nhập" : "Custom"}</div>
                            </button>

                            <button
                                type='button'
                                disabled={status !== "idle" && status !== "completed"}
                                onClick={() => {
                                    setTopicSource("gemini");
                                    localStorage.setItem("anytools_bing_source", "gemini");
                                }}
                                className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                                    topicSource === "gemini"
                                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                                }`}
                            >
                                <div className='font-bold text-sm mb-0.5'>🤖 AI</div>
                                <div>Gemini</div>
                            </button>
                        </div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                            {topicSource === "instant" && t.sourceInstantDesc}
                            {topicSource === "custom" && t.sourceCustomDesc}
                            {topicSource === "gemini" && t.sourceGeminiDesc}
                        </p>
                    </div>

                    {/* Search Mode Selector */}
                    <div>
                        <label className='block text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100'>
                            {t.searchMode}
                        </label>
                        <div className='grid grid-cols-3 gap-2'>
                            <button
                                type='button'
                                disabled={status !== "idle" && status !== "completed"}
                                onClick={() => {
                                    setSearchMode("singleWindow");
                                    localStorage.setItem("anytools_bing_mode", "singleWindow");
                                }}
                                className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                                    searchMode === "singleWindow"
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                                }`}
                            >
                                <div className='font-bold text-sm mb-0.5'>🪟 1 Cửa sổ</div>
                                <div>{isVi ? "Tự động" : "Auto Window"}</div>
                            </button>

                            <button
                                type='button'
                                disabled={status !== "idle" && status !== "completed"}
                                onClick={() => {
                                    setSearchMode("sequentialTabs");
                                    localStorage.setItem("anytools_bing_mode", "sequentialTabs");
                                }}
                                className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                                    searchMode === "sequentialTabs"
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                                }`}
                            >
                                <div className='font-bold text-sm mb-0.5'>📑 Mở Tab</div>
                                <div>{isVi ? "Từng Tab mới" : "New Tabs"}</div>
                            </button>

                            <button
                                type='button'
                                disabled={status !== "idle" && status !== "completed"}
                                onClick={() => {
                                    setSearchMode("semiAuto");
                                    localStorage.setItem("anytools_bing_mode", "semiAuto");
                                }}
                                className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                                    searchMode === "semiAuto"
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                        : "bg-gray-50 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750"
                                }`}
                            >
                                <div className='font-bold text-sm mb-0.5'>⌨️ Spacebar</div>
                                <div>{isVi ? "Bán tự động" : "Semi-Auto"}</div>
                            </button>
                        </div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                            {searchMode === "singleWindow" && t.modeSingleWindowDesc}
                            {searchMode === "sequentialTabs" && t.modeSequentialTabsDesc}
                            {searchMode === "semiAuto" && t.modeSemiAutoDesc}
                        </p>
                    </div>
                </div>

                {/* Custom Keywords Textarea (when custom mode selected) */}
                {topicSource === "custom" && (
                    <div className='mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'>
                        <div className='flex items-center justify-between mb-2 flex-wrap gap-2'>
                            <label className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
                                {isVi ? "Nhập danh sách từ khóa (mỗi dòng một từ):" : "Custom Keywords (one per line):"}
                            </label>
                            <button
                                type='button'
                                onClick={handleLoadSampleCustom}
                                className='text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                            >
                                {isVi ? "📋 Tải từ khóa mẫu" : "📋 Load Sample Keywords"}
                            </button>
                        </div>
                        <textarea
                            rows={5}
                            disabled={status !== "idle" && status !== "completed"}
                            value={customKeywordsText}
                            onChange={(e) => setCustomKeywordsText(e.target.value)}
                            placeholder={t.customKeywordsPlaceholder}
                            className='w-full p-3 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono'
                        />
                        <div className='flex justify-between items-center text-xs text-gray-500 mt-2'>
                            <span>
                                {isVi ? "Số từ khóa hợp lệ: " : "Valid keywords: "}
                                <strong>{queue.length}</strong>
                            </span>
                        </div>
                    </div>
                )}

                {/* Gemini AI Action (when gemini mode selected) */}
                {topicSource === "gemini" && (
                    <div className='mb-6 p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 flex items-center justify-between flex-wrap gap-3'>
                        <div>
                            <div className='text-sm font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5'>
                                <span>✨</span>
                                <span>{isVi ? "Tạo chủ đề thông minh bằng Gemini" : "Generate Topics with Gemini AI"}</span>
                            </div>
                            <p className='text-xs text-purple-700 dark:text-purple-300 mt-0.5'>
                                {isVi
                                    ? "Tạo trước danh sách để xem và chỉnh sửa trước khi bắt đầu."
                                    : "Pre-generate topics so you can inspect or modify before searching."}
                            </p>
                        </div>
                        <Button
                            variant='purple'
                            size='sm'
                            disabled={isGeneratingAI || (status !== "idle" && status !== "completed")}
                            onClick={handleGenerateGemini}
                        >
                            {isGeneratingAI ? t.generatingAI : t.generateAITopics}
                        </Button>
                    </div>
                )}

                {/* Number of Searches, Delay, and Jitter Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
                    {/* Number of Searches */}
                    <div>
                        <label htmlFor='searchCount' className='block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100'>
                            {t.searchCount}
                        </label>
                        <input
                            type='number'
                            id='searchCount'
                            min='1'
                            max='100'
                            disabled={status !== "idle" && status !== "completed"}
                            value={searchCount}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 1;
                                setSearchCount(val);
                                localStorage.setItem("anytools_bing_count", val.toString());
                            }}
                            className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl shadow-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                        />
                        <p className='text-[11px] text-gray-500 dark:text-gray-400 mt-1'>
                            {isVi ? "PC: 30 lượt (90đ) | Mobile: 20 lượt (60đ)" : "PC: 30 searches | Mobile: 20 searches"}
                        </p>
                    </div>

                    {/* Delay Time */}
                    <div>
                        <label htmlFor='delayTime' className='block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100'>
                            {t.delayTime}
                        </label>
                        <input
                            type='number'
                            id='delayTime'
                            min='6'
                            max='60'
                            disabled={status !== "idle" && status !== "completed"}
                            value={delayTime}
                            onChange={(e) => {
                                const val = Math.max(6, parseInt(e.target.value, 10) || 6);
                                setDelayTime(val);
                                localStorage.setItem("anytools_bing_delay", val.toString());
                            }}
                            className='block w-full px-3 py-2 bg-white border border-gray-300 rounded-xl shadow-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white'
                        />
                        <p className='text-[11px] text-gray-500 dark:text-gray-400 mt-1'>
                            {isVi ? "Tối thiểu 6s (Khuyên dùng: 8-14s)" : "Min 6s (Recommended: 8-14s)"}
                        </p>
                    </div>

                    {/* Random Jitter Toggle */}
                    <div className='flex flex-col justify-between'>
                        <label className='block text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100'>
                            {t.randomJitter}
                        </label>
                        <label className='flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300 select-none'>
                            <input
                                type='checkbox'
                                checked={useRandomJitter}
                                disabled={status !== "idle" && status !== "completed"}
                                onChange={(e) => {
                                    setUseRandomJitter(e.target.checked);
                                    localStorage.setItem("anytools_bing_jitter", e.target.checked.toString());
                                }}
                                className='w-4 h-4 text-blue-600 rounded-md focus:ring-blue-500'
                            />
                            <span>{isVi ? "Bật ngẫu nhiên (±2-3s)" : "Enable Jitter (±2-3s)"}</span>
                        </label>
                        <p className='text-[11px] text-gray-500 dark:text-gray-400 mt-1'>
                            {isVi ? "Giúp mô phỏng người thật tìm kiếm" : "Simulates natural human search"}
                        </p>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className='flex items-center gap-3 flex-wrap'>
                    {status === "idle" || status === "completed" ? (
                        <Button
                            onClick={handleStart}
                            variant='primary'
                            size='lg'
                            className='flex-1 py-3 text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2'
                        >
                            <span>🚀</span>
                            <span>{t.startSearch}</span>
                        </Button>
                    ) : (
                        <>
                            {status === "searching" ? (
                                <Button
                                    onClick={handlePause}
                                    variant='warning'
                                    size='lg'
                                    className='flex-1 py-3 font-bold flex items-center justify-center gap-2'
                                >
                                    <span>⏸️</span>
                                    <span>{t.pauseSearch}</span>
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleResume}
                                    variant='success'
                                    size='lg'
                                    className='flex-1 py-3 font-bold flex items-center justify-center gap-2'
                                >
                                    <span>▶️</span>
                                    <span>{t.resumeSearch}</span>
                                </Button>
                            )}

                            <Button
                                onClick={handleStop}
                                variant='danger'
                                size='lg'
                                className='py-3 font-bold px-6 flex items-center justify-center gap-2'
                            >
                                <span>⏹️</span>
                                <span>{t.stopSearch}</span>
                            </Button>
                        </>
                    )}

                    {/* Manual Next button (Available when searching or semi-auto) */}
                    {(status === "searching" || status === "paused" || searchMode === "semiAuto") && (
                        <Button
                            onClick={handleManualNext}
                            variant='info'
                            size='lg'
                            className='py-3 font-bold px-6 flex items-center justify-center gap-2'
                            title={isVi ? "Nhấn phím Spacebar để kích hoạt nhanh" : "Press Spacebar to advance"}
                        >
                            <span>⏭️</span>
                            <span>{t.nextSearch}</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Live Progress & Status Card */}
            {(status === "searching" || status === "paused" || status === "completed") && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all'>
                    <div className='flex items-center justify-between flex-wrap gap-2 mb-4'>
                        <div className='flex items-center gap-2'>
                            <span
                                className={`inline-block w-3 h-3 rounded-full ${
                                    status === "searching"
                                        ? "bg-emerald-500 animate-pulse"
                                        : status === "paused"
                                        ? "bg-amber-500"
                                        : "bg-blue-500"
                                }`}
                            />
                            <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                                {status === "searching" && t.statusSearching}
                                {status === "paused" && t.statusPaused}
                                {status === "completed" && t.statusComplete}
                            </h3>
                        </div>

                        {/* Search Counter & Rewards Points */}
                        <div className='flex items-center gap-3 text-xs font-semibold'>
                            <span className='px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'>
                                {t.searchesDone}:{" "}
                                <strong className='text-blue-600 dark:text-blue-400'>
                                    {Math.min(queue.length, currentIndex + (status === "completed" ? 1 : 0))} / {queue.length}
                                </strong>
                            </span>
                            <span className='px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'>
                                ⭐ +{estimatedPoints} pts
                            </span>
                        </div>
                    </div>

                    {/* Current Query Display */}
                    <div className='p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200/80 dark:border-gray-700/80 mb-4'>
                        <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                            {t.currentTopic}:
                        </div>
                        <div className='text-base md:text-lg font-bold text-gray-900 dark:text-white flex items-center justify-between gap-2'>
                            <span className='truncate'>&ldquo;{queue[currentIndex] || "..."}&rdquo;</span>
                            <a
                                href={getBingSearchUrl(queue[currentIndex] || "")}
                                target='_blank'
                                rel='noreferrer'
                                className='text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0'
                            >
                                {isVi ? "Mở trực tiếp ↗" : "Open link ↗"}
                            </a>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className='space-y-1.5 mb-4'>
                        <div className='flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400'>
                            <span>{isVi ? "Tiến độ hoàn thành" : "Completion Progress"}</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 overflow-hidden'>
                            <div
                                className='bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300'
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Countdown Timer (if searching and not semi-auto) */}
                    {status === "searching" && searchMode !== "semiAuto" && countdown > 0 && (
                        <div className='flex items-center justify-between p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-700 dark:text-blue-300'>
                            <div className='flex items-center gap-2 font-medium'>
                                <span className='animate-spin'>⏳</span>
                                <span>
                                    {t.countdownNext} <strong>{countdown}</strong> {t.seconds}
                                </span>
                            </div>
                            <div className='text-[11px] text-blue-600 dark:text-blue-400'>
                                {isVi ? "Bấm 'Lượt tiếp theo' hoặc phím Space để bỏ qua chờ" : "Press Spacebar to skip wait"}
                            </div>
                        </div>
                    )}

                    {/* Semi-Auto prompt */}
                    {searchMode === "semiAuto" && status === "searching" && (
                        <div className='p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between flex-wrap gap-2'>
                            <span>
                                👉 {isVi ? "Nhấn phím " : "Press "}
                                <kbd className='px-2 py-0.5 rounded-md bg-white dark:bg-gray-800 border border-emerald-300 dark:border-emerald-700 font-bold'>
                                    Spacebar
                                </kbd>
                                {isVi ? " hoặc nút 'Lượt tiếp theo' để tìm kiếm tiếp." : " or 'Next Search' to continue."}
                            </span>
                            <span className='font-semibold'>
                                {currentIndex + 1 < queue.length
                                    ? `${t.nextTopic}: "${queue[currentIndex + 1]}"`
                                    : t.statusComplete}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Search Queue Card */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all'>
                <div className='flex items-center justify-between flex-wrap gap-2 mb-4'>
                    <div className='flex items-center gap-2'>
                        <span className='text-lg'>📋</span>
                        <h3 className='text-base font-bold text-gray-900 dark:text-white'>
                            {isVi ? "Hàng Đợi Tìm Kiếm" : "Search Queue"} ({queue.length})
                        </h3>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            disabled={status !== "idle" && status !== "completed"}
                            onClick={handleShuffle}
                            className='px-3 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50'
                        >
                            🔀 {t.shuffleQueue}
                        </button>
                        <button
                            type='button'
                            disabled={status !== "idle" && status !== "completed"}
                            onClick={() => refreshQueue(searchCount, "instant")}
                            className='px-3 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer disabled:opacity-50'
                        >
                            🔄 {isVi ? "Làm mới" : "Refresh"}
                        </button>
                    </div>
                </div>

                {/* Queue items list */}
                {queue.length === 0 ? (
                    <div className='text-center py-6 text-sm text-gray-500 dark:text-gray-400'>
                        {isVi ? "Chưa có từ khóa nào trong hàng đợi." : "No keywords in queue."}
                    </div>
                ) : (
                    <div className='max-h-60 overflow-y-auto space-y-1.5 pr-1 text-sm'>
                        {queue.map((item, idx) => {
                            const isDone = (status === "searching" || status === "paused" || status === "completed") && idx < currentIndex;
                            const isCurrent = (status === "searching" || status === "paused") && idx === currentIndex;

                            return (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs md:text-sm transition-all ${
                                        isCurrent
                                            ? "bg-blue-50/80 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200 font-semibold"
                                            : isDone
                                            ? "bg-gray-50/60 dark:bg-gray-800/40 border-gray-200/60 dark:border-gray-800 text-gray-400 dark:text-gray-500 line-through"
                                            : "bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/80 text-gray-800 dark:text-gray-200"
                                    }`}
                                >
                                    <div className='flex items-center gap-2.5 truncate'>
                                        <span className='w-5 text-center text-xs text-gray-400 font-mono'>
                                            {idx + 1}
                                        </span>
                                        {isDone && <span className='text-emerald-500'>✓</span>}
                                        {isCurrent && <span className='text-blue-500 animate-pulse'>▶</span>}
                                        <span className='truncate'>{item}</span>
                                    </div>

                                    {status === "idle" && (
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveQueueItem(idx)}
                                            className='text-gray-400 hover:text-red-500 px-1 text-xs cursor-pointer'
                                            title={isVi ? "Xóa khỏi hàng đợi" : "Remove"}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Microsoft Rewards Guidance & Tips Card */}
            <div className='w-full bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-transparent dark:from-amber-500/10 dark:via-amber-500/5 dark:to-transparent p-6 rounded-2xl border border-amber-200 dark:border-amber-800/60'>
                <div className='flex items-center gap-2 mb-3'>
                    <span className='text-xl'>💡</span>
                    <h3 className='text-base font-bold text-amber-900 dark:text-amber-200'>
                        {t.importantNotice}
                    </h3>
                </div>
                <ul className='space-y-2 text-xs md:text-sm text-amber-900/80 dark:text-amber-300/80 leading-relaxed list-disc pl-5'>
                    <li>{t.tip1}</li>
                    <li>{t.tip2}</li>
                    <li>{t.tip3}</li>
                    <li>{t.tip4}</li>
                </ul>
            </div>

            {/* Recent Search History Card */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-2'>
                        <span className='text-lg'>🕒</span>
                        <h3 className='text-base font-bold text-gray-900 dark:text-white'>
                            {t.searchHistory} ({searchHistory.length})
                        </h3>
                    </div>
                    {searchHistory.length > 0 && (
                        <button
                            type='button'
                            onClick={() => {
                                setSearchHistory([]);
                                localStorage.removeItem("autoSearchHistory");
                            }}
                            className='text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer'
                        >
                            {t.clearHistory}
                        </button>
                    )}
                </div>

                {searchHistory.length === 0 ? (
                    <p className='text-sm text-gray-500 dark:text-gray-400 text-center py-4'>
                        {t.noHistory}
                    </p>
                ) : (
                    <div className='flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1'>
                        {searchHistory
                            .slice(-20)
                            .reverse()
                            .map((item, index) => (
                                <span
                                    key={index}
                                    className='inline-flex items-center px-2.5 py-1 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 truncate max-w-xs'
                                >
                                    {item}
                                </span>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
