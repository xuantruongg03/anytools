"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";
import { RedirectProgress } from "@/components/ui/RedirectProgress";
import { useRedirectTimer } from "@/lib/hooks";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";

/**
 * Trang redirect trung gian
 * Hiển thị quảng cáo và thông tin trước khi chuyển hướng đến URL đích
 */
export default function RedirectPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [targetUrl, setTargetUrl] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const page = t.redirect.page;

    // Xử lý URL: lưu vào sessionStorage và xóa khỏi address bar
    useEffect(() => {
        const urlFromParams = searchParams.get("url");

        if (urlFromParams) {
            // Lưu vào sessionStorage
            sessionStorage.setItem("redirectTarget", urlFromParams);
            setTargetUrl(urlFromParams);
            setIsReady(true);

            // Xóa query params khỏi URL trong address bar
            const locale = window.location.pathname.split("/")[1];
            router.replace(`/${locale}/redirect`);
        } else {
            // Nếu không có params, đọc từ sessionStorage
            const savedUrl = sessionStorage.getItem("redirectTarget");
            if (savedUrl) {
                setTargetUrl(savedUrl);
                setIsReady(true);
            } else {
                // Không có URL → User back lại hoặc access trực tiếp
                // → Redirect về home
                const locale = window.location.pathname.split("/")[1];
                router.replace(`/${locale}`);
                return;
            }
        }
    }, [searchParams, router]);

    // Lấy thời gian chờ từ env (mặc định 5000ms)
    const delayMs = Number(process.env.NEXT_PUBLIC_REDIRECT_DELAY_MS) || 5000;

    // Validate URL
    const isValidUrl = (url: string | null): boolean => {
        if (!url) return false;
        try {
            const urlObj = new URL(url);
            // Chỉ cho phép http và https
            return urlObj.protocol === "http:" || urlObj.protocol === "https:";
        } catch {
            return false;
        }
    };

    // Sử dụng hook để xử lý đếm ngược và redirect
    const { timeRemaining, progress } = useRedirectTimer(delayMs, isValidUrl(targetUrl) ? targetUrl : null);

    // Hiển thị lỗi nếu URL không hợp lệ
    if (!isValidUrl(targetUrl)) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4'>
                <div className='max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6'>
                    <div className='flex items-start gap-3'>
                        {/* Alert icon */}
                        <svg className='w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <div>
                            <h3 className='font-semibold text-red-800 dark:text-red-200 mb-1'>{page.invalidUrl.title}</h3>
                            <p className='text-sm text-red-700 dark:text-red-300'>{page.invalidUrl.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4'>
            <div className='w-full max-w-4xl'>
                {/* Progress và countdown */}
                <RedirectProgress
                    timeRemaining={timeRemaining}
                    progress={progress}
                    targetUrl={targetUrl!}
                    translations={{
                        redirecting: page.redirecting,
                        seconds: page.seconds,
                        waitMessage: page.waitMessage,
                    }}
                />

                {/* Khu vực quảng cáo */}
                <div className='mt-12'>
                    <div className='text-center'>
                        {/* Ad Script - Sử dụng Next.js Script component */}
                        <Script src='https://pl28622513.effectivegatecpm.com/f8/d1/4d/f8d14d55048b451393a51e5e5a0f3743.js' />
                        {/* Container cho quảng cáo */}
                        <div id='ad-container' className='min-h-[250px]'>
                            <Script src='https://pl28622555.effectivegatecpm.com/5f7b64e63267398ca630c4710af5ad5b/invoke.js'></Script>
                            <div id='container-5f7b64e63267398ca630c4710af5ad5b' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
