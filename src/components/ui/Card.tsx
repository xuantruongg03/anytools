import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xs ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export default Card;
