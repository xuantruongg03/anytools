"use client";

import { ReactNode } from "react";

interface ToolPageLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

/**
 * Standard layout for tool pages
 * Provides consistent heading style with centered title and description
 * Usage:
 * <ToolPageLayout title="Tool Name" description="Tool description">
 *   <YourToolClient />
 *   <YourToolContent />
 * </ToolPageLayout>
 */
export default function ToolPageLayout({ title, description, children }: ToolPageLayoutProps) {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden'>
            <div className='container mx-auto px-4 py-8'>
                {/* Centered Heading Section */}
                <div className='text-center mb-8'>
                    <h1 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{title}</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>{description}</p>
                </div>

                {/* Tool Content */}
                {children}
            </div>
        </div>
    );
}
