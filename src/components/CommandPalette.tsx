"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { allTools, toolsConfig } from "@/config/tools";

interface CommandPaletteProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function CommandPalette({ isOpen: controlledOpen, onClose }: CommandPaletteProps) {
    const [internalOpen, setInternalOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    const isControlled = typeof controlledOpen === "boolean";
    const isOpen = isControlled ? controlledOpen : internalOpen;

    const router = useRouter();
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const inputRef = useRef<HTMLInputElement>(null);

    // Global keyboard listener for Ctrl+K / Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (isControlled && onClose) {
                    // Trigger parent toggle
                    window.dispatchEvent(new CustomEvent("toggle-command-palette"));
                } else {
                    setInternalOpen((prev) => !prev);
                }
            } else if (e.key === "Escape" && isOpen) {
                e.preventDefault();
                handleClose();
            }
        };

        const handleCustomToggle = () => {
            setInternalOpen((prev) => !prev);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("toggle-command-palette", handleCustomToggle);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("toggle-command-palette", handleCustomToggle);
        };
    }, [isControlled, onClose, isOpen]);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const handleClose = () => {
        if (onClose) onClose();
        setInternalOpen(false);
    };

    // Filter tools
    const filteredTools = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) {
            // Return top 8 featured/popular tools when empty
            return allTools.slice(0, 8);
        }

        return allTools
            .filter((tool) => {
                const toolData = t.tools[tool.key as keyof typeof t.tools] as {
                    name?: string;
                    description?: string;
                    category?: string;
                };
                const name = toolData?.name?.toLowerCase() || "";
                const desc = toolData?.description?.toLowerCase() || "";
                const cat = toolData?.category?.toLowerCase() || "";
                const key = tool.key.toLowerCase();

                return name.includes(q) || desc.includes(q) || cat.includes(q) || key.includes(q);
            })
            .slice(0, 10);
    }, [query, t]);

    // Handle keyboard navigation inside the list
    const handleListKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % (filteredTools.length || 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filteredTools[selectedIndex]) {
                selectTool(filteredTools[selectedIndex].href);
            }
        }
    };

    const selectTool = (href: string) => {
        handleClose();
        router.push(`/${locale}${href}`);
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-fadeIn'>
            {/* Backdrop click to close */}
            <div className='fixed inset-0' onClick={handleClose} />

            <div
                className='relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10 flex flex-col max-h-[80vh]'
                onKeyDown={handleListKeyDown}
            >
                {/* Search Bar Header */}
                <div className='flex items-center px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 gap-3'>
                    <svg className='w-5 h-5 text-gray-400 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                    <input
                        ref={inputRef}
                        type='text'
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        placeholder={locale === "vi" ? "Tìm kiếm công cụ (vd: json, qr, đếm từ, css...)" : "Search tools (e.g. json, qr, word counter, css...)"}
                        className='w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-base'
                    />
                    <kbd className='px-2 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 rounded border border-gray-200 dark:border-gray-700 shrink-0'>
                        ESC
                    </kbd>
                </div>

                {/* Results List */}
                <div className='overflow-y-auto p-2 space-y-1 flex-1'>
                    <div className='px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                        {query ? (locale === "vi" ? "Kết quả tìm kiếm" : "Search Results") : (locale === "vi" ? "Công cụ gợi ý" : "Suggested Tools")}
                    </div>

                    {filteredTools.length > 0 ? (
                        filteredTools.map((tool, idx) => {
                            const toolData = t.tools[tool.key as keyof typeof t.tools] as {
                                name?: string;
                                description?: string;
                                category?: string;
                            };
                            const isSelected = selectedIndex === idx;

                            return (
                                <div
                                    key={tool.href}
                                    onClick={() => selectTool(tool.href)}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                                        isSelected
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
                                    }`}
                                >
                                    <div className='flex items-center gap-3 min-w-0'>
                                        <span className={`text-2xl shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold font-mono ${isSelected ? "bg-white/20 text-white" : "bg-black/5 dark:bg-white/10 text-blue-600 dark:text-blue-400"}`}>
                                            {tool.icon}
                                        </span>
                                        <div className='min-w-0'>
                                            <div className='text-sm font-semibold truncate'>
                                                {toolData?.name || tool.key}
                                            </div>
                                            <div
                                                className={`text-xs truncate ${
                                                    isSelected ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                                                }`}
                                            >
                                                {toolData?.description}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2 shrink-0 ml-3'>
                                        {toolData?.category && (
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${
                                                    isSelected
                                                        ? "bg-blue-700 text-blue-100"
                                                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                }`}
                                            >
                                                {toolData.category}
                                            </span>
                                        )}
                                        {isSelected && (
                                            <span className='text-xs font-mono opacity-80'>↵</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className='text-center py-8 text-sm text-gray-500 dark:text-gray-400'>
                            {locale === "vi" ? "Không tìm thấy công cụ phù hợp" : "No tools found matching your search"}
                        </div>
                    )}
                </div>

                {/* Footer bar */}
                <div className='px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <span><kbd className='font-mono'>↑↓</kbd> {locale === "vi" ? "chọn" : "navigate"}</span>
                        <span><kbd className='font-mono'>↵</kbd> {locale === "vi" ? "mở" : "open"}</span>
                    </div>
                    <span>{allTools.length} {locale === "vi" ? "công cụ sẵn có" : "total tools"}</span>
                </div>
            </div>
        </div>
    );
}
