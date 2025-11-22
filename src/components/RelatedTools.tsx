"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface RelatedTool {
    href: string;
    icon: string;
    nameVi: string;
    nameEn: string;
    descriptionVi: string;
    descriptionEn: string;
}

interface RelatedToolsProps {
    tools: RelatedTool[];
    currentPath?: string;
}

export default function RelatedTools({ tools, currentPath }: RelatedToolsProps) {
    const { locale } = useLanguage();

    // Filter out current tool if currentPath is provided
    const filteredTools = currentPath ? tools.filter((tool) => tool.href !== currentPath) : tools;

    if (filteredTools.length === 0) return null;

    return (
        <section className='bg-white dark:bg-gray-800 dark:text-gray-100 rounded-xl shadow-lg p-6 md:p-8 mb-8 mt-8'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>{locale === "vi" ? "Công cụ liên quan" : "Related Tools"}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {filteredTools.map((tool) => (
                    <Link key={tool.href} href={`/${locale}${tool.href}`} className='group block p-5 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:shadow-md border border-transparent hover:border-blue-300 dark:hover:border-blue-700'>
                        <div className='flex items-start gap-4'>
                            <div className='shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform'>{tool.icon}</div>
                            <div className='flex-1 min-w-0'>
                                <h3 className='font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>{locale === "vi" ? tool.nameVi : tool.nameEn}</h3>
                                <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-2'>{locale === "vi" ? tool.descriptionVi : tool.descriptionEn}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
