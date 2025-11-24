"use client";

// Common service provider options for reuse across different tools
export interface ServiceProviderOption<T extends string = string> {
    value: T;
    label: string;
    icon: string;
}

interface ServiceProviderSelectorProps<T extends string = string> {
    value: T;
    onChange: (provider: T) => void;
    options: ServiceProviderOption<T>[];
    label?: string;
    hint?: string;
    disabled?: boolean;
    className?: string;
}

export default function ServiceProviderSelector<T extends string = string>({ value, onChange, options, label, hint, disabled = false, className = "" }: ServiceProviderSelectorProps<T>) {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>{label}</label>}
            <div className='relative'>
                <select value={value} onChange={(e) => onChange(e.target.value as T)} disabled={disabled} className='w-full px-4 py-2.5 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer appearance-none'>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.icon} {option.label}
                        </option>
                    ))}
                </select>
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                </div>
            </div>
            {hint && (
                <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                    </svg>
                    {hint}
                </p>
            )}
        </div>
    );
}
