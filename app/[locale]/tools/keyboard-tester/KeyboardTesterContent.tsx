"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { keyboardTesterTranslations } from "@/lib/i18n/tools/keyboard-tester";
import { toast } from "@/components/ui/Toast";

type LayoutType = "full" | "tkl" | "60";
type OsType = "windows" | "mac";
type SoundType = "clicky" | "tactile" | "linear" | "mute";

interface KeyDef {
    code: string;
    label: string;
    subLabel?: string;
    macLabel?: string;
    macSubLabel?: string;
    widthClass?: string; // custom width for special keys
    heightClass?: string;
}

interface KeyState {
    isPressed: boolean;
    isTested: boolean;
    pressCount: number;
    hasChatter: boolean;
    lastDownTime: number;
    totalDuration: number;
}

interface LogEntry {
    id: string;
    key: string;
    code: string;
    keyCode: number;
    location: string;
    durationMs: number;
    hasChatter: boolean;
    timestamp: string;
}

// Full ANSI Keyboard Definition
const F_ROW_MAIN: KeyDef[] = [
    { code: "Escape", label: "Esc", widthClass: "w-10 sm:w-12" },
    { code: "F1", label: "F1" },
    { code: "F2", label: "F2" },
    { code: "F3", label: "F3" },
    { code: "F4", label: "F4" },
    { code: "F5", label: "F5" },
    { code: "F6", label: "F6" },
    { code: "F7", label: "F7" },
    { code: "F8", label: "F8" },
    { code: "F9", label: "F9" },
    { code: "F10", label: "F10" },
    { code: "F11", label: "F11" },
    { code: "F12", label: "F12" },
];

const F_ROW_NAV: KeyDef[] = [
    { code: "PrintScreen", label: "PrtSc" },
    { code: "ScrollLock", label: "ScrLk" },
    { code: "Pause", label: "Pause" },
];

const NUMBER_ROW_MAIN: KeyDef[] = [
    { code: "Backquote", label: "`", subLabel: "~" },
    { code: "Digit1", label: "1", subLabel: "!" },
    { code: "Digit2", label: "2", subLabel: "@" },
    { code: "Digit3", label: "3", subLabel: "#" },
    { code: "Digit4", label: "4", subLabel: "$" },
    { code: "Digit5", label: "5", subLabel: "%" },
    { code: "Digit6", label: "6", subLabel: "^" },
    { code: "Digit7", label: "7", subLabel: "&" },
    { code: "Digit8", label: "8", subLabel: "*" },
    { code: "Digit9", label: "9", subLabel: "(" },
    { code: "Digit0", label: "0", subLabel: ")" },
    { code: "Minus", label: "-", subLabel: "_" },
    { code: "Equal", label: "=", subLabel: "+" },
    { code: "Backspace", label: "⌫", widthClass: "w-16 sm:w-20" },
];

const NUMBER_ROW_NAV: KeyDef[] = [
    { code: "Insert", label: "Ins" },
    { code: "Home", label: "Home" },
    { code: "PageUp", label: "PgUp" },
];

const NUMBER_ROW_NUMPAD: KeyDef[] = [
    { code: "NumLock", label: "Num" },
    { code: "NumpadDivide", label: "/" },
    { code: "NumpadMultiply", label: "*" },
    { code: "NumpadSubtract", label: "-" },
];

const QWERTY_ROW_MAIN: KeyDef[] = [
    { code: "Tab", label: "Tab", widthClass: "w-14 sm:w-16" },
    { code: "KeyQ", label: "Q" },
    { code: "KeyW", label: "W" },
    { code: "KeyE", label: "E" },
    { code: "KeyR", label: "R" },
    { code: "KeyT", label: "T" },
    { code: "KeyY", label: "Y" },
    { code: "KeyU", label: "U" },
    { code: "KeyI", label: "I" },
    { code: "KeyO", label: "O" },
    { code: "KeyP", label: "P" },
    { code: "BracketLeft", label: "[", subLabel: "{" },
    { code: "BracketRight", label: "]", subLabel: "}" },
    { code: "Backslash", label: "\\", subLabel: "|", widthClass: "w-12 sm:w-14" },
];

const QWERTY_ROW_NAV: KeyDef[] = [
    { code: "Delete", label: "Del" },
    { code: "End", label: "End" },
    { code: "PageDown", label: "PgDn" },
];

const QWERTY_ROW_NUMPAD: KeyDef[] = [
    { code: "Numpad7", label: "7" },
    { code: "Numpad8", label: "8" },
    { code: "Numpad9", label: "9" },
    { code: "NumpadAdd", label: "+", heightClass: "h-22 sm:h-26" },
];

const HOME_ROW_MAIN: KeyDef[] = [
    { code: "CapsLock", label: "Caps", widthClass: "w-16 sm:w-20" },
    { code: "KeyA", label: "A" },
    { code: "KeyS", label: "S" },
    { code: "KeyD", label: "D" },
    { code: "KeyF", label: "F" },
    { code: "KeyG", label: "G" },
    { code: "KeyH", label: "H" },
    { code: "KeyJ", label: "J" },
    { code: "KeyK", label: "K" },
    { code: "KeyL", label: "L" },
    { code: "Semicolon", label: ";", subLabel: ":" },
    { code: "Quote", label: "'", subLabel: '"' },
    { code: "Enter", label: "Enter", widthClass: "w-18 sm:w-22" },
];

const HOME_ROW_NUMPAD: KeyDef[] = [
    { code: "Numpad4", label: "4" },
    { code: "Numpad5", label: "5" },
    { code: "Numpad6", label: "6" },
];

const SHIFT_ROW_MAIN: KeyDef[] = [
    { code: "ShiftLeft", label: "Shift", widthClass: "w-20 sm:w-24" },
    { code: "KeyZ", label: "Z" },
    { code: "KeyX", label: "X" },
    { code: "KeyC", label: "C" },
    { code: "KeyV", label: "V" },
    { code: "KeyB", label: "B" },
    { code: "KeyN", label: "N" },
    { code: "KeyM", label: "M" },
    { code: "Comma", label: ",", subLabel: "<" },
    { code: "Period", label: ".", subLabel: ">" },
    { code: "Slash", label: "/", subLabel: "?" },
    { code: "ShiftRight", label: "Shift", widthClass: "w-22 sm:w-28" },
];

const SHIFT_ROW_NAV: KeyDef[] = [
    { code: "ArrowUp", label: "▲" },
];

const SHIFT_ROW_NUMPAD: KeyDef[] = [
    { code: "Numpad1", label: "1" },
    { code: "Numpad2", label: "2" },
    { code: "Numpad3", label: "3" },
    { code: "NumpadEnter", label: "↵", heightClass: "h-22 sm:h-26" },
];

const BOTTOM_ROW_MAIN: KeyDef[] = [
    { code: "ControlLeft", label: "Ctrl", macLabel: "Control", widthClass: "w-12 sm:w-14" },
    { code: "MetaLeft", label: "Win", macLabel: "⌘ Cmd", widthClass: "w-12 sm:w-14" },
    { code: "AltLeft", label: "Alt", macLabel: "⌥ Opt", widthClass: "w-12 sm:w-14" },
    { code: "Space", label: "Space", widthClass: "flex-1 min-w-32 max-w-72" },
    { code: "AltRight", label: "Alt", macLabel: "⌥ Opt", widthClass: "w-12 sm:w-14" },
    { code: "MetaRight", label: "Win", macLabel: "⌘ Cmd", widthClass: "w-12 sm:w-14" },
    { code: "ContextMenu", label: "Menu", macLabel: "Fn", widthClass: "w-10 sm:w-12" },
    { code: "ControlRight", label: "Ctrl", macLabel: "Control", widthClass: "w-12 sm:w-14" },
];

const BOTTOM_ROW_NAV: KeyDef[] = [
    { code: "ArrowLeft", label: "◀" },
    { code: "ArrowDown", label: "▼" },
    { code: "ArrowRight", label: "▶" },
];

const BOTTOM_ROW_NUMPAD: KeyDef[] = [
    { code: "Numpad0", label: "0", widthClass: "w-22 sm:w-26" },
    { code: "NumpadDecimal", label: "." },
];

export default function KeyboardTesterContent() {
    const { locale } = useLanguage();
    const t = keyboardTesterTranslations[locale as "en" | "vi"] || keyboardTesterTranslations.en;
    const isVi = locale === "vi";

    // Config States
    const [layout, setLayout] = useState<LayoutType>("full");
    const [osType, setOsType] = useState<OsType>("windows");
    const [soundType, setSoundType] = useState<SoundType>("clicky");
    const [preventDefaults, setPreventDefaults] = useState<boolean>(true);

    // Dynamic Testing States
    const [keyStates, setKeyStates] = useState<{ [code: string]: KeyState }>({});
    const [currentlyPressedCount, setCurrentlyPressedCount] = useState<number>(0);
    const [maxRollover, setMaxRollover] = useState<number>(0);
    const [chatterCount, setChatterCount] = useState<number>(0);
    const [eventLogs, setEventLogs] = useState<LogEntry[]>([]);

    // Audio Context Ref
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Synthesize Mechanical Switch Audio
    const playSwitchSound = useCallback((type: SoundType) => {
        if (type === "mute") return;

        try {
            const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
            audioCtxRef.current = ctx;

            if (ctx.state === "suspended") {
                ctx.resume();
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const now = ctx.currentTime;

            if (type === "clicky") {
                // High frequency sharp click (Blue Switch)
                osc.type = "sine";
                osc.frequency.setValueAtTime(2200, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.025);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.025);
            } else if (type === "tactile") {
                // Medium thock (Brown Switch)
                osc.type = "triangle";
                osc.frequency.setValueAtTime(550, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.04);
            } else if (type === "linear") {
                // Soft deep thump (Red Switch)
                osc.type = "sine";
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.035);
            }
        } catch (err) {
            console.warn("Audio synthesis error:", err);
        }
    }, []);

    // Handle Keydown
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (preventDefaults) {
                // Prevent browser standard hotkeys like F1, F3, F5, F12, Tab, Alt, Space scroll
                if (
                    e.key.startsWith("F") ||
                    ["Tab", "Alt", "ContextMenu", " "].includes(e.key) ||
                    (e.ctrlKey && ["r", "w", "t", "s", "p", "f"].includes(e.key.toLowerCase()))
                ) {
                    e.preventDefault();
                }
            }

            const code = e.code || e.key;
            const now = performance.now();

            setKeyStates((prev) => {
                const existing = prev[code] || {
                    isPressed: false,
                    isTested: false,
                    pressCount: 0,
                    hasChatter: false,
                    lastDownTime: 0,
                    totalDuration: 0,
                };

                // Check for Chatter / Double Click (<35ms between keydowns)
                const isChatter = existing.lastDownTime > 0 && now - existing.lastDownTime < 35 && !existing.isPressed;
                if (isChatter) {
                    setChatterCount((c) => c + 1);
                }

                if (!existing.isPressed) {
                    playSwitchSound(soundType);
                }

                const updatedState: KeyState = {
                    ...existing,
                    isPressed: true,
                    isTested: true,
                    pressCount: existing.isPressed ? existing.pressCount : existing.pressCount + 1,
                    hasChatter: existing.hasChatter || isChatter,
                    lastDownTime: now,
                };

                const next = { ...prev, [code]: updatedState };

                // Calculate current and max rollover
                const activeCount = Object.values(next).filter((k) => k.isPressed).length;
                setCurrentlyPressedCount(activeCount);
                setMaxRollover((m) => Math.max(m, activeCount));

                return next;
            });
        },
        [preventDefaults, soundType, playSwitchSound]
    );

    // Handle Keyup
    const handleKeyUp = useCallback(
        (e: KeyboardEvent) => {
            const code = e.code || e.key;
            const now = performance.now();

            setKeyStates((prev) => {
                const existing = prev[code];
                if (!existing) return prev;

                const duration = Math.round(now - existing.lastDownTime);

                const next = {
                    ...prev,
                    [code]: {
                        ...existing,
                        isPressed: false,
                        totalDuration: existing.totalDuration + duration,
                    },
                };

                // Add to event log
                const locationName =
                    e.location === 1 ? "Left" : e.location === 2 ? "Right" : e.location === 3 ? "Numpad" : "Standard";

                setEventLogs((logs) => [
                    {
                        id: Math.random().toString(36).substring(2, 9),
                        key: e.key === " " ? "Space" : e.key,
                        code: e.code,
                        keyCode: e.keyCode,
                        location: locationName,
                        durationMs: duration,
                        hasChatter: existing.hasChatter,
                        timestamp: new Date().toLocaleTimeString(),
                    },
                    ...logs.slice(0, 49), // Keep latest 50 entries
                ]);

                const activeCount = Object.values(next).filter((k) => k.isPressed).length;
                setCurrentlyPressedCount(activeCount);

                return next;
            });
        },
        []
    );

    // Register global event listeners
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            if (audioCtxRef.current) {
                audioCtxRef.current.close().catch(() => {});
            }
        };
    }, [handleKeyDown, handleKeyUp]);

    // Reset Tester
    const handleReset = () => {
        setKeyStates({});
        setCurrentlyPressedCount(0);
        setMaxRollover(0);
        setChatterCount(0);
        setEventLogs([]);
        toast.success(t.resetConfirm);
    };

    // Calculate total tested keys count
    const totalTestedCount = Object.values(keyStates).filter((k) => k.isTested).length;

    // Helper to render individual key
    const renderKey = (keyDef: KeyDef) => {
        const state = keyStates[keyDef.code];
        const isPressed = state?.isPressed;
        const isTested = state?.isTested;
        const hasChatter = state?.hasChatter;
        const count = state?.pressCount || 0;

        const mainLabel = osType === "mac" && keyDef.macLabel ? keyDef.macLabel : keyDef.label;
        const subLabel = osType === "mac" && keyDef.macSubLabel ? keyDef.macSubLabel : keyDef.subLabel;

        let bgClass = "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 shadow-xs";
        if (hasChatter) {
            bgClass = "bg-red-500 text-white border-red-600 shadow-red-500/50";
        } else if (isPressed) {
            bgClass = "bg-blue-500 text-white border-blue-600 shadow-md shadow-blue-500/50 translate-y-0.5 scale-95";
        } else if (isTested) {
            bgClass = "bg-emerald-500/15 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/60 font-semibold";
        }

        return (
            <div
                key={keyDef.code}
                className={`relative flex flex-col items-center justify-center select-none rounded-lg border text-xs sm:text-sm transition-all duration-75 min-w-8 sm:min-w-10 h-10 sm:h-12 px-1 ${
                    keyDef.widthClass || "w-8 sm:w-11"
                } ${keyDef.heightClass || ""} ${bgClass}`}
                title={`${keyDef.code}${count > 0 ? ` (Pressed ${count}x)` : ""}`}
            >
                {subLabel && <span className='text-[9px] opacity-60 leading-none'>{subLabel}</span>}
                <span className='font-bold leading-tight truncate max-w-full'>{mainLabel}</span>

                {/* Counter Badge if pressed multiple times */}
                {count > 1 && (
                    <span className='absolute top-0.5 right-0.5 text-[8px] font-mono px-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold'>
                        {count}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-6xl mx-auto space-y-6'>
            {/* Top Controls Toolbar */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center gap-3 text-xs'>
                    {/* Layout Selector */}
                    <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>⌨️ {t.layout}:</span>
                        <select
                            value={layout}
                            onChange={(e) => setLayout(e.target.value as LayoutType)}
                            className='px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium cursor-pointer'
                        >
                            <option value='full'>{t.layoutFull}</option>
                            <option value='tkl'>{t.layoutTkl}</option>
                            <option value='60'>{t.layout60}</option>
                        </select>
                    </div>

                    {/* OS Layout Selector */}
                    <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>💻 {t.osLayout}:</span>
                        <select
                            value={osType}
                            onChange={(e) => setOsType(e.target.value as OsType)}
                            className='px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium cursor-pointer'
                        >
                            <option value='windows'>{t.osWindows}</option>
                            <option value='mac'>{t.osMac}</option>
                        </select>
                    </div>

                    {/* Switch Sound Simulator */}
                    <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>🔊 {t.switchSound}:</span>
                        <select
                            value={soundType}
                            onChange={(e) => setSoundType(e.target.value as SoundType)}
                            className='px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium cursor-pointer'
                        >
                            <option value='clicky'>{t.soundClicky}</option>
                            <option value='tactile'>{t.soundTactile}</option>
                            <option value='linear'>{t.soundLinear}</option>
                            <option value='mute'>{t.soundMute}</option>
                        </select>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    {/* Prevent Browser Defaults Toggle */}
                    <label className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer'>
                        <input
                            type='checkbox'
                            checked={preventDefaults}
                            onChange={(e) => setPreventDefaults(e.target.checked)}
                            className='rounded accent-blue-600'
                        />
                        <span>{t.preventDefaults}</span>
                    </label>

                    {/* Reset Button */}
                    <Button onClick={handleReset} variant='secondary' size='sm' className='cursor-pointer text-xs font-bold'>
                        🔄 {t.reset}
                    </Button>
                </div>
            </div>

            {/* Real-time HUD Metrics */}
            <div className='w-full grid grid-cols-2 sm:grid-cols-4 gap-3'>
                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                        ⚡ {t.currentlyPressed}
                    </div>
                    <div className='text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono'>
                        {currentlyPressedCount}
                    </div>
                    <div className='text-[10px] text-gray-400'>{t.keys}</div>
                </div>

                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                        🚀 {t.maxSimultaneous}
                    </div>
                    <div className='text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono'>
                        {maxRollover}
                    </div>
                    <div className='text-[10px] text-gray-400'>{maxRollover >= 6 ? "NKRO Active" : t.keys}</div>
                </div>

                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1'>
                        ✅ {t.totalTested}
                    </div>
                    <div className='text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono'>
                        {totalTestedCount}
                    </div>
                    <div className='text-[10px] text-gray-400'>{t.keys}</div>
                </div>

                <div className='bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-xs'>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1' title={t.chatterTooltip}>
                        ⚠️ {t.chatterDetected}
                    </div>
                    <div
                        className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                            chatterCount > 0 ? "text-red-500 animate-pulse" : "text-gray-400"
                        }`}
                    >
                        {chatterCount}
                    </div>
                    <div className='text-[10px] text-gray-400'>{chatterCount > 0 ? "Potential Chatter!" : "Clean"}</div>
                </div>
            </div>

            {/* Virtual Keyboard Graphic Container */}
            <div className='w-full bg-slate-100 dark:bg-gray-950 p-4 sm:p-6 rounded-3xl border border-gray-300 dark:border-gray-800 shadow-lg overflow-x-auto'>
                <div className='min-w-[760px] sm:min-w-[940px] space-y-2 select-none'>
                    {/* F-Row (Hidden in 60%) */}
                    {layout !== "60" && (
                        <div className='flex items-center gap-4 mb-2'>
                            <div className='flex items-center gap-1.5'>{F_ROW_MAIN.map(renderKey)}</div>
                            <div className='w-4' />
                            <div className='flex items-center gap-1.5'>{F_ROW_NAV.map(renderKey)}</div>
                        </div>
                    )}

                    {/* Number Row */}
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-1.5'>{NUMBER_ROW_MAIN.map(renderKey)}</div>
                        {layout !== "60" && (
                            <>
                                <div className='w-4' />
                                <div className='flex items-center gap-1.5'>{NUMBER_ROW_NAV.map(renderKey)}</div>
                            </>
                        )}
                        {layout === "full" && (
                            <>
                                <div className='w-4' />
                                <div className='flex items-center gap-1.5'>{NUMBER_ROW_NUMPAD.map(renderKey)}</div>
                            </>
                        )}
                    </div>

                    {/* QWERTY Row */}
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-1.5'>{QWERTY_ROW_MAIN.map(renderKey)}</div>
                        {layout !== "60" && (
                            <>
                                <div className='w-4' />
                                <div className='flex items-center gap-1.5'>{QWERTY_ROW_NAV.map(renderKey)}</div>
                            </>
                        )}
                        {layout === "full" && (
                            <>
                                <div className='w-4' />
                                <div className='flex items-center gap-1.5'>{QWERTY_ROW_NUMPAD.map(renderKey)}</div>
                            </>
                        )}
                    </div>

                    {/* Home Row */}
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-1.5'>{HOME_ROW_MAIN.map(renderKey)}</div>
                        {layout !== "60" && (
                            <>
                                <div className='w-4' />
                                <div className='w-[114px] sm:w-[138px]' />
                            </>
                        )}
                        {layout === "full" && (
                            <>
                                <div className='w-4' />
                                <div className='flex items-center gap-1.5'>{HOME_ROW_NUMPAD.map(renderKey)}</div>
                            </>
                        )}
                    </div>

                    {/* Shift Row */}
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-1.5'>{SHIFT_ROW_MAIN.map(renderKey)}</div>
                        {layout !== "60" && (
                            <>
                                <div className='w-4' />
                                <div className='flex items-center justify-center w-[114px] sm:w-[138px]'>
                                    {SHIFT_ROW_NAV.map(renderKey)}
                                </div>
                            </>
                        )}
                        {layout === "full" && (
                            <>
                                <div className='w-4' />
                                <div className='flex items-center gap-1.5'>{SHIFT_ROW_NUMPAD.map(renderKey)}</div>
                            </>
                        )}
                    </div>

                    {/* Bottom Row */}
                    <div className='flex items-center gap-4'>
                        <div className='flex items-center gap-1.5'>{BOTTOM_ROW_MAIN.map(renderKey)}</div>
                        {layout !== "60" && (
                            <>
                                <div className='w-4' />
                                <div className='flex items-center gap-1.5'>{BOTTOM_ROW_NAV.map(renderKey)}</div>
                            </>
                        )}
                        {layout === "full" && (
                            <>
                                <div className='w-4' />
                                <div className='flex items-center gap-1.5'>{BOTTOM_ROW_NUMPAD.map(renderKey)}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Color Legend Bar */}
            <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-600 dark:text-gray-400 py-1'>
                <div className='flex items-center gap-2'>
                    <span className='w-4 h-4 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700' />
                    <span>{t.legendUntested}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='w-4 h-4 rounded bg-blue-500 border border-blue-600 shadow-xs' />
                    <span className='font-bold text-blue-600 dark:text-blue-400'>{t.legendActive}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='w-4 h-4 rounded bg-emerald-500/30 border border-emerald-500' />
                    <span className='font-bold text-emerald-600 dark:text-emerald-400'>{t.legendTested}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='w-4 h-4 rounded bg-red-500 border border-red-600' />
                    <span className='font-bold text-red-500'>{t.legendChatter}</span>
                </div>
            </div>

            {/* Key Event Inspector Log */}
            <div className='w-full bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4'>
                <div className='flex items-center justify-between'>
                    <h3 className='font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2'>
                        <span>📋</span> {t.eventLog} ({eventLogs.length})
                    </h3>
                    {eventLogs.length > 0 && (
                        <button
                            type='button'
                            onClick={() => setEventLogs([])}
                            className='text-xs font-semibold text-red-500 hover:underline cursor-pointer'
                        >
                            {t.clearLog}
                        </button>
                    )}
                </div>

                {eventLogs.length === 0 ? (
                    <div className='py-8 text-center text-xs text-gray-400 font-mono'>
                        {isVi ? "Chưa có sự kiện nào. Hãy gõ bất kỳ phím nào trên bàn phím của bạn!" : "No key events captured yet. Press any key on your keyboard to begin testing!"}
                    </div>
                ) : (
                    <div className='overflow-x-auto max-h-64 border border-gray-100 dark:border-gray-800 rounded-xl'>
                        <table className='w-full text-left text-xs font-mono'>
                            <thead className='bg-gray-50 dark:bg-gray-800/80 sticky top-0 text-gray-500 dark:text-gray-400'>
                                <tr>
                                    <th className='p-2.5'>{t.tableKey}</th>
                                    <th className='p-2.5'>{t.tableCode}</th>
                                    <th className='p-2.5'>{t.tableKeyCode}</th>
                                    <th className='p-2.5'>{t.tableLocation}</th>
                                    <th className='p-2.5'>{t.tableDuration}</th>
                                    <th className='p-2.5'>{t.tableStatus}</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                                {eventLogs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                                            log.hasChatter ? "bg-red-50 dark:bg-red-950/20 text-red-600" : ""
                                        }`}
                                    >
                                        <td className='p-2.5 font-bold text-gray-900 dark:text-white'>{log.key}</td>
                                        <td className='p-2.5 text-blue-600 dark:text-blue-400'>{log.code}</td>
                                        <td className='p-2.5'>{log.keyCode}</td>
                                        <td className='p-2.5 text-gray-500'>{log.location}</td>
                                        <td className='p-2.5'>{log.durationMs}ms</td>
                                        <td className='p-2.5'>
                                            {log.hasChatter ? (
                                                <span className='px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-bold text-[10px]'>
                                                    Chatter!
                                                </span>
                                            ) : (
                                                <span className='px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px]'>
                                                    OK
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
