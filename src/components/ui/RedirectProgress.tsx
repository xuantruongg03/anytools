"use client";

interface RedirectProgressProps {
    /** Thời gian còn lại (giây) */
    timeRemaining: number;
    /** Tiến trình (0-100%) */
    progress: number;
    /** URL đích */
    targetUrl: string;
}

/**
 * Component hiển thị progress bar và countdown cho trang redirect
 * Sử dụng native HTML/CSS với Tailwind cho animation mượt mà
 */
export function RedirectProgress({
    timeRemaining,
    progress,
    targetUrl,
}: RedirectProgressProps) {
    return (
        <div className='flex flex-col items-center justify-center gap-6 w-full max-w-2xl mx-auto'>
            {/* Icon và tiêu đề */}
            <div className='flex flex-col items-center gap-3'>
                <div className='w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
                    {/* External link icon */}
                    <svg
                        className='w-8 h-8 text-blue-600 dark:text-blue-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                        />
                    </svg>
                </div>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center'>
                    Đang chuyển hướng...
                </h2>
            </div>

            {/* Progress bar */}
            <div className='w-full'>
                <div className='w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                    <div
                        className='h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-100 ease-linear'
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Countdown */}
            <div className='text-center'>
                <div className='text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2 tabular-nums'>
                    {timeRemaining}
                </div>
                <p className='text-gray-600 dark:text-gray-400'>giây</p>
            </div>

            {/* Thông báo hướng dẫn */}
            <p className='text-sm text-gray-500 dark:text-gray-400 text-center max-w-md'>
                Trang sẽ tự động chuyển hướng. Vui lòng đợi trong giây lát.
            </p>
        </div>
    );
}
