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
    // Width in flex units or custom class
    widthClass?: string;
    heightClass?: string;
    gridSpan?: string;
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

// ==========================================
// 1. FUNCTION ROW DEFINITIONS
// ==========================================
const F_ROW_ESC: KeyDef = { code: "Escape", label: "Esc" };
const F_ROW_G1: KeyDef[] = [
    { code: "F1", label: "F1" },
    { code: "F2", label: "F2" },
    { code: "F3", label: "F3" },
    { code: "F4", label: "F4" },
];
const F_ROW_G2: KeyDef[] = [
    { code: "F5", label: "F5" },
    { code: "F6", label: "F6" },
    { code: "F7", label: "F7" },
    { code: "F8", label: "F8" },
];
const F_ROW_G3: KeyDef[] = [
    { code: "F9", label: "F9" },
    { code: "F10", label: "F10" },
    { code: "F11", label: "F11" },
    { code: "F12", label: "F12" },
];

// ==========================================
// 2. MAIN ALPHANUMERIC AREA (15u wide per row)
// ==========================================
const NUMBER_ROW: KeyDef[] = [
    { code: "Backquote", label: "`", subLabel: "~", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Digit1", label: "1", subLabel: "!", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Digit2", label: "2", subLabel: "@", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Digit3", label: "3", subLabel: "#", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Digit4", label: "4", subLabel: "$", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Digit5", label: "5", subLabel: "%", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Digit6", label: "6", subLabel: "^", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Digit7", label: "7", subLabel: "&", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Digit8", label: "8", subLabel: "*", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Digit9", label: "9", subLabel: "(", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Digit0", label: "0", subLabel: ")", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Minus", label: "-", subLabel: "_", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Equal", label: "=", subLabel: "+", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Backspace", label: "Backspace", subLabel: "⌫", widthClass: "w-[80px] sm:w-[96px]" },
];

const QWERTY_ROW: KeyDef[] = [
    { code: "Tab", label: "Tab", subLabel: "⇥", widthClass: "w-[58px] sm:w-[70px]" },
    { code: "KeyQ", label: "Q", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyW", label: "W", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyE", label: "E", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyR", label: "R", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyT", label: "T", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyY", label: "Y", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyU", label: "U", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyI", label: "I", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyO", label: "O", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyP", label: "P", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "BracketLeft", label: "[", subLabel: "{", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "BracketRight", label: "]", subLabel: "}", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Backslash", label: "\\", subLabel: "|", widthClass: "w-[58px] sm:w-[70px]" },
];

const HOME_ROW: KeyDef[] = [
    { code: "CapsLock", label: "Caps Lock", widthClass: "w-[68px] sm:w-[82px]" },
    { code: "KeyA", label: "A", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyS", label: "S", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyD", label: "D", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyF", label: "F", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyG", label: "G", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyH", label: "H", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyJ", label: "J", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyK", label: "K", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyL", label: "L", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Semicolon", label: ";", subLabel: ":", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Quote", label: "'", subLabel: '"', widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Enter", label: "Enter", subLabel: "↵", widthClass: "w-[88px] sm:w-[106px]" },
];

const SHIFT_ROW: KeyDef[] = [
    { code: "ShiftLeft", label: "Shift", subLabel: "⇧", widthClass: "w-[88px] sm:w-[106px]" },
    { code: "KeyZ", label: "Z", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyX", label: "X", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyC", label: "C", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyV", label: "V", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyB", label: "B", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyN", label: "N", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "KeyM", label: "M", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Comma", label: ",", subLabel: "<", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Period", label: ".", subLabel: ">", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Slash", label: "/", subLabel: "?", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "ShiftRight", label: "Shift", subLabel: "⇧", widthClass: "w-[108px] sm:w-[130px]" },
];

const BOTTOM_ROW: KeyDef[] = [
    { code: "ControlLeft", label: "Ctrl", macLabel: "Control", macSubLabel: "⌃", widthClass: "w-[48px] sm:w-[58px]" },
    { code: "MetaLeft", label: "Win", macLabel: "Cmd", macSubLabel: "⌘", widthClass: "w-[48px] sm:w-[58px]" },
    { code: "AltLeft", label: "Alt", macLabel: "Opt", macSubLabel: "⌥", widthClass: "w-[48px] sm:w-[58px]" },
    { code: "Space", label: "Space", widthClass: "flex-1 min-w-[220px] sm:min-w-[260px]" },
    { code: "AltRight", label: "Alt", macLabel: "Opt", macSubLabel: "⌥", widthClass: "w-[48px] sm:w-[58px]" },
    { code: "MetaRight", label: "Win", macLabel: "Cmd", macSubLabel: "⌘", widthClass: "w-[48px] sm:w-[58px]" },
    { code: "ContextMenu", label: "Menu", macLabel: "Fn", widthClass: "w-[48px] sm:w-[58px]" },
    { code: "ControlRight", label: "Ctrl", macLabel: "Control", macSubLabel: "⌃", widthClass: "w-[48px] sm:w-[58px]" },
];

// ==========================================
// 3. NAVIGATION CLUSTER (3u wide)
// ==========================================
const NAV_ROW_F: KeyDef[] = [
    { code: "PrintScreen", label: "PrtSc", subLabel: "SysRq", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "ScrollLock", label: "ScrLk", subLabel: "Scroll", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Pause", label: "Pause", subLabel: "Break", widthClass: "w-[38px] sm:w-[46px]" },
];

const NAV_ROW_1: KeyDef[] = [
    { code: "Insert", label: "Ins", subLabel: "Insert", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "Home", label: "Home", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "PageUp", label: "PgUp", subLabel: "Page", widthClass: "w-[38px] sm:w-[46px]" },
];

const NAV_ROW_2: KeyDef[] = [
    { code: "Delete", label: "Del", subLabel: "Delete", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "End", label: "End", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "PageDown", label: "PgDn", subLabel: "Page", widthClass: "w-[38px] sm:w-[46px]" },
];

const NAV_ARROW_UP: KeyDef = { code: "ArrowUp", label: "↑", widthClass: "w-[38px] sm:w-[46px]" };
const NAV_ARROWS_BOTTOM: KeyDef[] = [
    { code: "ArrowLeft", label: "←", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "ArrowDown", label: "↓", widthClass: "w-[38px] sm:w-[46px]" },
    { code: "ArrowRight", label: "→", widthClass: "w-[38px] sm:w-[46px]" },
];

// ==========================================
// 4. NUMPAD CLUSTER (4-column CSS grid)
// ==========================================
const NUMPAD_GRID_KEYS: KeyDef[] = [
    // Row 1
    { code: "NumLock", label: "Num", subLabel: "Lock", gridSpan: "col-start-1 row-start-1" },
    { code: "NumpadDivide", label: "/", gridSpan: "col-start-2 row-start-1" },
    { code: "NumpadMultiply", label: "*", gridSpan: "col-start-3 row-start-1" },
    { code: "NumpadSubtract", label: "-", gridSpan: "col-start-4 row-start-1" },

    // Row 2
    { code: "Numpad7", label: "7", subLabel: "Home", gridSpan: "col-start-1 row-start-2" },
    { code: "Numpad8", label: "8", subLabel: "▲", gridSpan: "col-start-2 row-start-2" },
    { code: "Numpad9", label: "9", subLabel: "PgUp", gridSpan: "col-start-3 row-start-2" },
    { code: "NumpadAdd", label: "+", gridSpan: "col-start-4 row-start-2 row-span-2 h-full min-h-[82px] sm:min-h-[98px]" },

    // Row 3
    { code: "Numpad4", label: "4", subLabel: "◀", gridSpan: "col-start-1 row-start-3" },
    { code: "Numpad5", label: "5", gridSpan: "col-start-2 row-start-3" },
    { code: "Numpad6", label: "6", subLabel: "▶", gridSpan: "col-start-3 row-start-3" },

    // Row 4
    { code: "Numpad1", label: "1", subLabel: "End", gridSpan: "col-start-1 row-start-4" },
    { code: "Numpad2", label: "2", subLabel: "▼", gridSpan: "col-start-2 row-start-4" },
    { code: "Numpad3", label: "3", subLabel: "PgDn", gridSpan: "col-start-3 row-start-4" },
    { code: "NumpadEnter", label: "Enter", subLabel: "↵", gridSpan: "col-start-4 row-start-4 row-span-2 h-full min-h-[82px] sm:min-h-[98px]" },

    // Row 5
    { code: "Numpad0", label: "0", subLabel: "Ins", gridSpan: "col-start-1 col-span-2 row-start-5 w-full" },
    { code: "NumpadDecimal", label: ".", subLabel: "Del", gridSpan: "col-start-3 row-start-5" },
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
    const [theme, setTheme] = useState<"classic" | "dark">("classic");
    const [showZones, setShowZones] = useState<boolean>(true);
    const [fitToScreen, setFitToScreen] = useState<boolean>(false);

    // Dynamic Testing States
    const [keyStates, setKeyStates] = useState<{ [code: string]: KeyState }>({});
    const [currentlyPressedCount, setCurrentlyPressedCount] = useState<number>(0);
    const [maxRollover, setMaxRollover] = useState<number>(0);
    const [chatterCount, setChatterCount] = useState<number>(0);
    const [eventLogs, setEventLogs] = useState<LogEntry[]>([]);

    // LED States
    const [capsLockActive, setCapsLockActive] = useState<boolean>(false);
    const [numLockActive, setNumLockActive] = useState<boolean>(true);
    const [scrollLockActive, setScrollLockActive] = useState<boolean>(false);

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

            // Track lock states
            if (e.getModifierState) {
                setCapsLockActive(e.getModifierState("CapsLock"));
                setNumLockActive(e.getModifierState("NumLock"));
                setScrollLockActive(e.getModifierState("ScrollLock"));
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
    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        // Track lock states
        if (e.getModifierState) {
            setCapsLockActive(e.getModifierState("CapsLock"));
            setNumLockActive(e.getModifierState("NumLock"));
            setScrollLockActive(e.getModifierState("ScrollLock"));
        }

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
                ...logs.slice(0, 49),
            ]);

            const activeCount = Object.values(next).filter((k) => k.isPressed).length;
            setCurrentlyPressedCount(activeCount);

            return next;
        });
    }, []);

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

    // Helper to simulate keydown/keyup from virtual click or tap
    const handleKeyTrigger = useCallback(
        (code: string, isDown: boolean) => {
            if (isDown) {
                const fakeEvent = {
                    code,
                    key: code,
                    preventDefault: () => {},
                    location: code.startsWith("Numpad") ? 3 : 0,
                    keyCode: 0,
                    getModifierState: (k: string) => {
                        if (k === "CapsLock") return !capsLockActive;
                        if (k === "NumLock") return !numLockActive;
                        if (k === "ScrollLock") return !scrollLockActive;
                        return false;
                    },
                } as any;
                handleKeyDown(fakeEvent);
            } else {
                const fakeEvent = {
                    code,
                    key: code,
                    preventDefault: () => {},
                    location: code.startsWith("Numpad") ? 3 : 0,
                    keyCode: 0,
                    getModifierState: () => false,
                } as any;
                handleKeyUp(fakeEvent);
            }
        },
        [capsLockActive, numLockActive, scrollLockActive, handleKeyDown, handleKeyUp]
    );

    // Helper to render individual realistic 3D keycap
    const renderKey = (keyDef: KeyDef) => {
        const state = keyStates[keyDef.code];
        const isPressed = state?.isPressed;
        const isTested = state?.isTested;
        const hasChatter = state?.hasChatter;
        const count = state?.pressCount || 0;

        const mainLabel = osType === "mac" && keyDef.macLabel ? keyDef.macLabel : keyDef.label;
        const subLabel = osType === "mac" && keyDef.macSubLabel ? keyDef.macSubLabel : keyDef.subLabel;

        // Realistic 3D Keycap Styling (Classic vs Dark)
        let keycapStyle = "";
        if (theme === "classic") {
            // Classic white/light-grey keyboard (matching Image 2)
            if (hasChatter) {
                keycapStyle =
                    "bg-gradient-to-b from-red-500 to-red-600 text-white border-red-400 shadow-[0_1px_0_0_#991b1b] translate-y-[2px]";
            } else if (isPressed) {
                keycapStyle =
                    "bg-gradient-to-b from-blue-500 to-blue-600 text-white border-blue-400 shadow-[0_1px_0_0_#1d4ed8] translate-y-[2px]";
            } else if (isTested) {
                keycapStyle =
                    "bg-gradient-to-b from-emerald-100 to-emerald-200 text-emerald-900 border-emerald-400 shadow-[0_3px_0_0_#10b981]";
            } else {
                keycapStyle =
                    "bg-gradient-to-b from-white via-slate-50 to-slate-200 text-slate-800 border border-slate-300 shadow-[0_3px_0_0_#94a3b8]";
            }
        } else {
            // Dark mechanical keyboard
            if (hasChatter) {
                keycapStyle =
                    "bg-gradient-to-b from-red-500 to-red-600 text-white border-red-400 shadow-[0_1px_0_0_#b91c1c] translate-y-[2px]";
            } else if (isPressed) {
                keycapStyle =
                    "bg-gradient-to-b from-blue-500 to-blue-600 text-white border-blue-400 shadow-[0_1px_0_0_#1d4ed8] translate-y-[2px]";
            } else if (isTested) {
                keycapStyle =
                    "bg-gradient-to-b from-emerald-950/90 to-emerald-900/90 text-emerald-300 border-emerald-500/80 shadow-[0_3px_0_0_#064e3b]";
            } else {
                keycapStyle =
                    "bg-gradient-to-b from-gray-800 to-gray-850 text-gray-200 border border-gray-700/80 shadow-[0_3px_0_0_#1e293b]";
            }
        }

        const isNumpad = keyDef.code.startsWith("Numpad") || keyDef.code === "NumLock";
        const widthCls = isNumpad
            ? (keyDef.code === "Numpad0" ? "w-full" : "w-full min-w-[38px] sm:min-w-[46px]")
            : (keyDef.widthClass || "w-[38px] sm:w-[46px]");
        const heightCls = (keyDef.gridSpan && keyDef.gridSpan.includes("row-span-2"))
            ? ""
            : (keyDef.heightClass || "h-[38px] sm:h-[46px]");
        const gridSpan = keyDef.gridSpan || "";

        // Tactile Homing Bump for F, J, and Numpad 5
        const isHomingKey = keyDef.code === "KeyF" || keyDef.code === "KeyJ";
        const isNumpadHoming = keyDef.code === "Numpad5";

        return (
            <div
                key={keyDef.code}
                onPointerDown={(e) => {
                    e.preventDefault();
                    handleKeyTrigger(keyDef.code, true);
                }}
                onPointerUp={(e) => {
                    e.preventDefault();
                    handleKeyTrigger(keyDef.code, false);
                }}
                onPointerLeave={() => {
                    if (isPressed) {
                        handleKeyTrigger(keyDef.code, false);
                    }
                }}
                className={`relative flex flex-col items-center justify-center select-none rounded-lg text-xs font-mono transition-all duration-75 p-0.5 cursor-pointer active:scale-95 ${widthCls} ${heightCls} ${gridSpan} ${keycapStyle}`}
                title={`${keyDef.code}${count > 0 ? ` (Pressed ${count}x)` : ""}`}
            >
                {/* Secondary/Shift label */}
                {subLabel && (
                    <span className='text-[9px] sm:text-[10px] font-semibold opacity-70 leading-none mb-0.5'>
                        {subLabel}
                    </span>
                )}
                {/* Primary label */}
                <span className='font-bold text-xs sm:text-[13px] leading-none truncate max-w-full px-0.5'>
                    {mainLabel}
                </span>

                {/* Tactile Homing Bump */}
                {isHomingKey && (
                    <span className='absolute bottom-1 w-2.5 h-[2px] rounded-full bg-current opacity-40' />
                )}
                {isNumpadHoming && (
                    <span className='absolute bottom-1 w-1.5 h-1.5 rounded-full bg-current opacity-40' />
                )}

                {/* Counter Badge */}
                {count > 1 && (
                    <span className='absolute top-0.5 right-0.5 text-[8px] font-mono px-1 rounded-full bg-blue-500 text-white font-bold leading-tight shadow-xs'>
                        {count}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto space-y-6'>
            {/* Top Controls Toolbar */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center gap-3 text-xs'>
                    {/* Layout Selector */}
                    <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>⌨️ {t.layout}:</span>
                        <select
                            value={layout}
                            onChange={(e) => setLayout(e.target.value as LayoutType)}
                            className='px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer'
                        >
                            <option value='full'>{t.layoutFull}</option>
                            <option value='tkl'>{t.layoutTkl}</option>
                            <option value='60'>{t.layout60}</option>
                        </select>
                    </div>

                    {/* Theme Selector */}
                    <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>🎨 {t.keyboardTheme}:</span>
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value as "classic" | "dark")}
                            className='px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer'
                        >
                            <option value='classic'>{t.themeClassic}</option>
                            <option value='dark'>{t.themeDark}</option>
                        </select>
                    </div>

                    {/* OS Layout Selector */}
                    <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>💻 {t.osLayout}:</span>
                        <select
                            value={osType}
                            onChange={(e) => setOsType(e.target.value as OsType)}
                            className='px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer'
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
                            className='px-2.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer'
                        >
                            <option value='clicky'>{t.soundClicky}</option>
                            <option value='tactile'>{t.soundTactile}</option>
                            <option value='linear'>{t.soundLinear}</option>
                            <option value='mute'>{t.soundMute}</option>
                        </select>
                    </div>
                </div>

                <div className='flex flex-wrap items-center gap-3'>
                    {/* Zone Highlighting Toggle (Image 2) */}
                    <label className='flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 cursor-pointer bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50'>
                        <input
                            type='checkbox'
                            checked={showZones}
                            onChange={(e) => setShowZones(e.target.checked)}
                            className='rounded accent-rose-600'
                        />
                        <span>🏷️ {t.showZones}</span>
                    </label>

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

            {/* Mobile & Responsive Zoom Control Bar */}
            <div className='w-full flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-gray-500 dark:text-gray-400'>
                <div className='flex items-center gap-1.5'>
                    <span>💡 {isVi ? "Chạm hoặc gõ phím để test âm thanh switch & độ nảy." : "Tap or press keys to test switch sound & responsiveness."}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={() => setFitToScreen(!fitToScreen)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                            fitToScreen
                                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <span>{fitToScreen ? "🔍 100% Cuộn Ngang" : "📱 Thu Vừa Màn Hình"}</span>
                    </button>
                </div>
            </div>

            {/* REALISTIC PHYSICAL KEYBOARD CHASSIS (Matches Image 2) */}
            <div
                className={`w-full px-2.5 sm:px-3.5 pt-6 pb-7 sm:pt-7 sm:pb-8 rounded-[28px] sm:rounded-[36px] border-4 shadow-2xl overflow-x-auto select-none transition-colors ${
                    theme === "classic"
                        ? "bg-[#e8eaed] dark:bg-[#20242c] border-[#cbd2db] dark:border-[#333a46] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.22)]"
                        : "bg-gray-950 border-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
                }`}
            >
                <div
                    className={`w-max min-w-full flex items-start gap-2.5 sm:gap-3 mx-auto justify-center pt-2 pb-2 transition-transform origin-top ${
                        fitToScreen
                            ? "scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 -my-24 sm:-my-14 md:-my-6 lg:my-0"
                            : ""
                    }`}
                >
                    {/* ==================================================== */}
                    {/* COLUMN 1: ZONE 1 (F-Row) + ZONE 2 (Main Typing Area) */}
                    {/* ==================================================== */}
                    <div className='flex flex-col gap-3.5 shrink-0'>
                        {/* ZONE 1: Khu vực phím chức năng (Function Row) */}
                        {layout !== "60" && (
                            <div className='relative'>
                                {/* Image 2 Callout Tag for Zone 1 */}
                                {showZones && (
                                    <div className='absolute -top-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none'>
                                        <span className='bg-pink-100 dark:bg-pink-950/90 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800 text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap'>
                                            {t.zoneFunction}
                                        </span>
                                        <span className='w-0.5 h-2 bg-pink-400 dark:bg-pink-600' />
                                    </div>
                                )}

                                <div
                                    className={`flex items-center gap-1.5 p-2 rounded-2xl transition-all ${
                                        showZones
                                            ? "border-2 border-red-500/85 ring-2 ring-red-500/20 bg-red-500/5 dark:bg-red-500/10"
                                            : theme === "classic"
                                            ? "bg-[#dadfe6] dark:bg-[#181c22] border border-[#c4cbd4] dark:border-[#2a303c] shadow-inner"
                                            : "bg-gray-900/80 border border-gray-800 shadow-inner"
                                    }`}
                                >
                                    {renderKey(F_ROW_ESC)}
                                    <div className='w-5 sm:w-7' />
                                    <div className='flex items-center gap-1.5'>{F_ROW_G1.map(renderKey)}</div>
                                    <div className='w-3 sm:w-4' />
                                    <div className='flex items-center gap-1.5'>{F_ROW_G2.map(renderKey)}</div>
                                    <div className='w-3 sm:w-4' />
                                    <div className='flex items-center gap-1.5'>{F_ROW_G3.map(renderKey)}</div>
                                </div>
                            </div>
                        )}

                        {/* ZONE 2: Khu vực chính (Main Alphanumeric 15u Area) */}
                        <div className='relative'>
                            <div
                                className={`flex flex-col gap-1.5 p-2.5 rounded-2xl transition-all ${
                                    showZones
                                        ? "border-2 border-red-500/85 ring-2 ring-red-500/20 bg-red-500/5 dark:bg-red-500/10"
                                        : theme === "classic"
                                        ? "bg-[#dadfe6] dark:bg-[#181c22] border border-[#c4cbd4] dark:border-[#2a303c] shadow-inner"
                                        : "bg-gray-900/80 border border-gray-800 shadow-inner"
                                }`}
                            >
                                {/* Number Row */}
                                <div className='flex items-center gap-1.5'>{NUMBER_ROW.map(renderKey)}</div>

                                {/* QWERTY Row */}
                                <div className='flex items-center gap-1.5'>{QWERTY_ROW.map(renderKey)}</div>

                                {/* Home Row */}
                                <div className='flex items-center gap-1.5'>{HOME_ROW.map(renderKey)}</div>

                                {/* Shift Row */}
                                <div className='flex items-center gap-1.5'>{SHIFT_ROW.map(renderKey)}</div>

                                {/* Bottom Row */}
                                <div className='flex items-center gap-1.5'>{BOTTOM_ROW.map(renderKey)}</div>
                            </div>

                            {/* Image 2 Callout Tag for Zone 2 */}
                            {showZones && (
                                <div className='absolute -bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none'>
                                    <span className='w-0.5 h-2 bg-pink-400 dark:bg-pink-600' />
                                    <span className='bg-pink-100 dark:bg-pink-950/90 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800 text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap'>
                                        {t.zoneMain}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ==================================================== */}
                    {/* COLUMN 2: ZONE 3 (Navigation & Control Area)         */}
                    {/* ==================================================== */}
                    {layout !== "60" && (
                        <div className='relative w-[140px] sm:w-[166px] shrink-0'>
                            <div
                                className={`flex flex-col p-2 rounded-2xl transition-all ${
                                    showZones
                                        ? "border-2 border-red-500/85 ring-2 ring-red-500/20 bg-red-500/5 dark:bg-red-500/10"
                                        : theme === "classic"
                                        ? "bg-[#dadfe6] dark:bg-[#181c22] border border-[#c4cbd4] dark:border-[#2a303c] shadow-inner"
                                        : "bg-gray-900/80 border border-gray-800 shadow-inner"
                                }`}
                            >
                                {/* Top row: PrtSc, ScrLk, Pause (aligned with F-row) */}
                                <div className='flex items-center gap-1.5 justify-center pb-2'>
                                    {NAV_ROW_F.map(renderKey)}
                                </div>

                                {/* Gap matching Zone 1 to Zone 2 separator */}
                                <div className='h-3.5' />

                                {/* 2x3 Nav Block (aligned with Number & QWERTY rows) */}
                                <div className='flex flex-col gap-1.5 items-center'>
                                    <div className='flex items-center gap-1.5'>{NAV_ROW_1.map(renderKey)}</div>
                                    <div className='flex items-center gap-1.5'>{NAV_ROW_2.map(renderKey)}</div>
                                </div>

                                {/* Gap spacer (aligned with Home row) */}
                                <div className='h-[38px] sm:h-[46px]' />

                                {/* Inverted-T Arrows (aligned with Shift & Bottom rows) */}
                                <div className='flex flex-col gap-1.5 items-center'>
                                    <div className='flex items-center justify-center w-full'>{renderKey(NAV_ARROW_UP)}</div>
                                    <div className='flex items-center gap-1.5'>{NAV_ARROWS_BOTTOM.map(renderKey)}</div>
                                </div>
                            </div>

                            {/* Image 2 Callout Tag for Zone 3 */}
                            {showZones && (
                                <div className='absolute -bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none'>
                                    <span className='w-0.5 h-2 bg-pink-400 dark:bg-pink-600' />
                                    <span className='bg-pink-100 dark:bg-pink-950/90 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800 text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap'>
                                        {t.zoneControl}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ==================================================== */}
                    {/* COLUMN 3: ZONE 4 (Numpad Area + LED Indicators)      */}
                    {/* ==================================================== */}
                    {layout === "full" && (
                        <div className='relative w-[184px] sm:w-[218px] shrink-0'>
                            {/* Image 2 Callout Tag for Zone 4 */}
                            {showZones && (
                                <div className='absolute -top-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none'>
                                    <span className='bg-pink-100 dark:bg-pink-950/90 text-pink-700 dark:text-pink-300 border border-pink-300 dark:border-pink-800 text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap'>
                                        {t.zoneNumpad}
                                    </span>
                                    <span className='w-0.5 h-2 bg-pink-400 dark:bg-pink-600' />
                                </div>
                            )}

                            <div
                                className={`flex flex-col p-2 rounded-2xl transition-all ${
                                    showZones
                                        ? "border-2 border-red-500/85 ring-2 ring-red-500/20 bg-red-500/5 dark:bg-red-500/10"
                                        : theme === "classic"
                                        ? "bg-[#dadfe6] dark:bg-[#181c22] border border-[#c4cbd4] dark:border-[#2a303c] shadow-inner"
                                        : "bg-gray-900/80 border border-gray-800 shadow-inner"
                                }`}
                            >
                                {/* LED Indicators Header (aligned with F-row & PrtSc) */}
                                <div className='grid grid-cols-3 gap-1 px-2 pb-2 h-[38px] sm:h-[46px] items-center justify-items-center bg-slate-900/5 dark:bg-black/30 rounded-xl mb-1'>
                                    {/* Num Lock LED */}
                                    <div className='flex flex-col items-center gap-1 min-w-0'>
                                        <span className='text-[9px] font-bold font-mono text-gray-500 dark:text-gray-400 uppercase tracking-tight leading-none'>
                                            NUM
                                        </span>
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                numLockActive
                                                    ? "bg-emerald-500 shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400"
                                                    : "bg-gray-300 dark:bg-gray-700"
                                            }`}
                                        />
                                    </div>

                                    {/* Caps Lock LED */}
                                    <div className='flex flex-col items-center gap-1 min-w-0'>
                                        <span className='text-[9px] font-bold font-mono text-gray-500 dark:text-gray-400 uppercase tracking-tight leading-none'>
                                            CAPS
                                        </span>
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                capsLockActive
                                                    ? "bg-emerald-500 shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400"
                                                    : "bg-gray-300 dark:bg-gray-700"
                                            }`}
                                        />
                                    </div>

                                    {/* Scroll Lock LED */}
                                    <div className='flex flex-col items-center gap-1 min-w-0'>
                                        <span className='text-[9px] font-bold font-mono text-gray-500 dark:text-gray-400 uppercase tracking-tight leading-none'>
                                            SCROLL
                                        </span>
                                        <span
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                                scrollLockActive
                                                    ? "bg-emerald-500 shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400"
                                                    : "bg-gray-300 dark:bg-gray-700"
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Gap matching Zone 1 to Zone 2 separator */}
                                <div className='h-3.5' />

                                {/* 4x5 CSS Grid for Numpad Keys (aligned with Rows 1 to 5) */}
                                <div className='grid grid-cols-4 grid-rows-5 gap-1.5 w-full'>
                                    {NUMPAD_GRID_KEYS.map(renderKey)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Color Legend Bar */}
            <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-600 dark:text-gray-400 py-1'>
                <div className='flex items-center gap-2'>
                    <span className='w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-xs' />
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
