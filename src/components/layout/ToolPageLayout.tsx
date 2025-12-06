"use client";

import { ReactNode, useState } from "react";
import ToolsSidebar from "./ToolsSidebar";

interface ToolPageLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

/**
 * Standard layout for tool pages
 * Provides consistent heading style with centered title and description
 * Includes sidebar with all tools categorized
 * Usage:
 * <ToolPageLayout title="Tool Name" description="Tool description">
 *   <YourToolClient />
 *   <YourToolContent />
 * </ToolPageLayout>
 */
export default function ToolPageLayout({ title, description, children }: ToolPageLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden'>
            {/* Sidebar */}
            <ToolsSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className='lg:pl-64 transition-all duration-300'>
                {/* Mobile Menu Button */}
                <div className='lg:hidden fixed top-4 left-4 z-30'>
                    <button onClick={() => setSidebarOpen(true)} className='p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer' aria-label='Open menu'>
                        <svg className='w-6 h-6 text-gray-700 dark:text-gray-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                        </svg>
                    </button>
                </div>

                <div className='container max-w-6xl mx-auto px-4 py-8 pt-20 lg:pt-8'>
                    {/* Centered Heading Section */}
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{title}</h1>
                        <p className='text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>{description}</p>
                    </div>

                    {/* Tool Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}
