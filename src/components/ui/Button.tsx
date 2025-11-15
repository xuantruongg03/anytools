import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "purple" | "gray" | "dark";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "primary", size = "md", fullWidth = false, className = "", children, disabled, ...props }, ref) => {
    const baseClasses = "font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300",
        success: "bg-green-600 hover:bg-green-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        warning: "bg-orange-600 hover:bg-orange-700 text-white",
        info: "bg-teal-600 hover:bg-teal-700 text-white",
        purple: "bg-purple-600 hover:bg-purple-700 text-white",
        gray: "bg-gray-600 hover:bg-gray-700 text-white",
        dark: "bg-indigo-600 hover:bg-indigo-700 text-white",
    };

    const sizeClasses = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`.trim();

    return (
        <button ref={ref} className={combinedClasses} disabled={disabled} {...props}>
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;
