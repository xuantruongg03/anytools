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
        <div className={`${className}`}>
            {label && <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{label}</label>}
            <div className='flex flex-wrap gap-2'>
                {options.map((option) => (
                    <button key={option.value} onClick={() => onChange(option.value)} disabled={disabled} className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${value === option.value ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"}`}>
                        {option.icon} {option.label}
                    </button>
                ))}
            </div>
            {hint && <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{hint}</p>}
        </div>
    );
}
