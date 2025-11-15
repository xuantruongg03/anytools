import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

export default function Select({ children, className = "", ...props }: SelectProps) {
    return (
        <div className='relative'>
            <select className={`w-full px-4 py-2 pr-10 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 cursor-pointer transition-colors appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props}>
                {children}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                <svg className='h-5 w-5 text-gray-400 dark:text-gray-500' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                    <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clipRule='evenodd' />
                </svg>
            </div>
        </div>
    );
}
