"use client";

import { ReactNode } from "react";

interface ToolCardProps {
    children: ReactNode;
    className?: string;
}

/**
 * Standard card wrapper for tool sections
 * Provides consistent styling with border, shadow, and rounded corners
 * Usage:
 * <ToolCard>
 *   <div>Your content here</div>
 * </ToolCard>
 */
export default function ToolCard({ children, className = "" }: ToolCardProps) {
    return <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>;
}
