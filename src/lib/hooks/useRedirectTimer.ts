"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook để xử lý logic đếm ngược và redirect tự động
 * 
 * @param delayMs - Thời gian chờ trước khi redirect (milliseconds)
 * @param targetUrl - URL đích để redirect đến
 * @returns Object chứa timeRemaining (giây còn lại) và progress (% tiến trình)
 */
export function useRedirectTimer(delayMs: number, targetUrl: string | null) {
    const [timeRemaining, setTimeRemaining] = useState(Math.ceil(delayMs / 1000));
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Nếu không có URL đích hoặc không hợp lệ, không chạy timer
        if (!targetUrl) {
            return;
        }

        const startTime = Date.now();
        const endTime = startTime + delayMs;

        // Update progress và time remaining mỗi 50ms cho animation mượt mà
        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            const remaining = Math.max(0, endTime - now);

            // Tính progress (0-100%)
            const currentProgress = Math.min(100, (elapsed / delayMs) * 100);
            setProgress(currentProgress);

            // Tính thời gian còn lại (làm tròn lên)
            setTimeRemaining(Math.ceil(remaining / 1000));

            // Nếu hết thời gian, redirect
            if (remaining <= 0) {
                clearInterval(interval);
                // Validate URL trước khi redirect
                try {
                    const url = new URL(targetUrl);
                    // Chỉ cho phép http và https protocols
                    if (url.protocol === "http:" || url.protocol === "https:") {
                        // Xóa URL khỏi sessionStorage trước khi redirect
                        sessionStorage.removeItem("redirectTarget");
                        window.location.href = targetUrl;
                    }
                } catch (error) {
                    console.error("Invalid redirect URL:", error);
                }
            }
        }, 50);

        // Cleanup interval khi component unmount
        return () => clearInterval(interval);
    }, [delayMs, targetUrl]);

    return { timeRemaining, progress };
}
