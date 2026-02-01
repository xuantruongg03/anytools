import type { Metadata } from "next";
import { Suspense } from "react";
import RedirectPageContent from "./RedirectPageContent";

/**
 * Metadata cho trang redirect
 * Sử dụng noindex, nofollow vì đây là trang trung gian
 */
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Redirecting... | AnyTools",
        description: "You are being redirected to your destination.",
        robots: {
            index: false,
            follow: false,
        },
    };
}

/**
 * Trang redirect chính
 * Hiển thị progress và tự động chuyển hướng sau thời gian cấu hình
 */
export default function RedirectPage() {
    return (
        <Suspense
            fallback={
                <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                    <div className='text-gray-600 dark:text-gray-400'>
                        Loading...
                    </div>
                </div>
            }
        >
            <RedirectPageContent />
        </Suspense>
    );
}
