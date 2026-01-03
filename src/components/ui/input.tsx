import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

export default function Input({ className = "", error = false, ...props }: InputProps) {
    return <input className={`w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? "border-red-400 dark:border-red-500" : "border-gray-300 dark:border-gray-600"} ${className}`} {...props} />;
}
