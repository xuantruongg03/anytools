"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextValue {
    toasts: ToastItem[];
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Global listener for non-React or imperative toast calls
type ToastListener = (message: string, type: ToastType, duration?: number) => void;
const listeners = new Set<ToastListener>();

export const toast = {
    success: (message: string, duration?: number) => {
        listeners.forEach((listener) => listener(message, "success", duration));
    },
    error: (message: string, duration?: number) => {
        listeners.forEach((listener) => listener(message, "error", duration));
    },
    info: (message: string, duration?: number) => {
        listeners.forEach((listener) => listener(message, "info", duration));
    },
    warning: (message: string, duration?: number) => {
        listeners.forEach((listener) => listener(message, "warning", duration));
    },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = "info", duration: number = 3500) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newToast: ToastItem = { id, message, type, duration };

            setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5 toasts

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    // Subscribe imperative toast calls
    React.useEffect(() => {
        const handleImperativeToast: ToastListener = (message, type, duration) => {
            showToast(message, type, duration);
        };
        listeners.add(handleImperativeToast);
        return () => {
            listeners.delete(handleImperativeToast);
        };
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div
                aria-live='assertive'
                className='fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0'
            >
                {toasts.map((item) => (
                    <div
                        key={item.id}
                        className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-fadeIn ${
                            item.type === "success"
                                ? "bg-white/95 dark:bg-gray-800/95 border-emerald-500/30 text-gray-900 dark:text-white"
                                : item.type === "error"
                                ? "bg-white/95 dark:bg-gray-800/95 border-rose-500/30 text-gray-900 dark:text-white"
                                : item.type === "warning"
                                ? "bg-white/95 dark:bg-gray-800/95 border-amber-500/30 text-gray-900 dark:text-white"
                                : "bg-white/95 dark:bg-gray-800/95 border-blue-500/30 text-gray-900 dark:text-white"
                        }`}
                    >
                        <div className='flex items-center gap-3 min-w-0'>
                            <span className='text-lg shrink-0'>
                                {item.type === "success" && "✅"}
                                {item.type === "error" && "❌"}
                                {item.type === "warning" && "⚠️"}
                                {item.type === "info" && "ℹ️"}
                            </span>
                            <p className='text-xs sm:text-sm font-medium leading-snug break-words'>
                                {item.message}
                            </p>
                        </div>
                        <button
                            onClick={() => removeToast(item.id)}
                            className='shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer'
                            aria-label='Close toast'
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        return {
            showToast: (msg: string, type?: ToastType, dur?: number) => {
                if (type === "success") toast.success(msg, dur);
                else if (type === "error") toast.error(msg, dur);
                else if (type === "warning") toast.warning(msg, dur);
                else toast.info(msg, dur);
            },
            toast,
        };
    }
    return context;
}
export default toast;
