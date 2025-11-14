"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { useState } from "react";
import { StructuredData } from "./components/StructuredData";

const toolsList = [
    { href: "/tools/json-formatter", icon: "{ }", key: "jsonFormatter", category: "developer" },
    { href: "/tools/base64", icon: "64", key: "base64", category: "developer" },
    { href: "/tools/url-encoder", icon: "🔗", key: "urlEncoder", category: "developer" },
    { href: "/tools/text-case", icon: "Aa", key: "textCase", category: "text" },
    { href: "/tools/color-picker", icon: "🎨", key: "colorPicker", category: "developer" },
    { href: "/tools/hash-generator", icon: "#", key: "hashGenerator", category: "developer" },
    { href: "/tools/stun-turn-test", icon: "🧪", key: "stunTurnTest", category: "developer" },
    { href: "/tools/tailwind-css", icon: "⚡", key: "tailwindCss", category: "developer" },
];

export default function Home() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredTools = toolsList.filter((tool) => {
        const toolData = t.tools[tool.key as keyof typeof t.tools];
        const matchesSearch = !searchQuery || toolData.name.toLowerCase().includes(searchQuery.toLowerCase()) || toolData.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || tool.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        { key: "developer", label: t.home.categories.developer },
        { key: "text", label: t.home.categories.text },
        { key: "image", label: t.home.categories.image },
        { key: "pdf", label: t.home.categories.pdf },
        { key: "audio", label: t.home.categories.audio },
        { key: "ai", label: t.home.categories.ai },
    ];

    return (
        <div className='bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black'>
            <StructuredData type='WebApplication' name='AnyTools - Free Online Tools' description='Free online tools for developers, designers, and content creators. Text formatters, JSON validators, color pickers, and more.' url='https://anytools.online' keywords={["online tools", "developer tools", "free tools", "text formatter", "JSON validator", "color picker", "công cụ trực tuyến", "công cụ lập trình viên"]} inLanguage={["en", "vi"]} />
            <section className='container mx-auto px-4 py-16 text-center'>
                <h1 className='text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100 max-w-4xl mx-auto leading-tight'>{t.home.title}</h1>
                <p className='text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto'>{t.home.subtitle}</p>

                {/* Search Input */}
                <div className='max-w-2xl mx-auto mb-8'>
                    <div className='relative'>
                        <svg className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                        <input type='text' placeholder={t.home.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='w-full pl-12 pr-4 py-4 text-lg border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm' />
                    </div>
                </div>

                {/* Category Pills */}
                <div className='flex items-center justify-center gap-3 flex-wrap mb-6'>
                    <span className='text-sm text-gray-600 dark:text-gray-400 font-medium'>{t.home.popularCategories}</span>
                    {categories.map((category) => (
                        <button key={category.key} onClick={() => setSelectedCategory(selectedCategory === category.key ? null : category.key)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === category.key ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                            {category.label}
                        </button>
                    ))}
                </div>
            </section>

            <main id='tools' className='container mx-auto px-4 py-12'>
                <div className='flex items-center justify-between mb-8 max-w-6xl mx-auto'>
                    <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>{searchQuery || selectedCategory ? `${filteredTools.length} ${t.home.availableTools}` : t.home.availableTools}</h2>
                    {(searchQuery || selectedCategory) && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory(null);
                            }}
                            className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {filteredTools.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto'>
                        {filteredTools.map((tool) => {
                            const toolData = t.tools[tool.key as keyof typeof t.tools];
                            return (
                                <Link key={tool.href} href={tool.href} className='block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all hover:scale-105'>
                                    <div className='flex items-start gap-4'>
                                        <div className='text-3xl shrink-0 w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 rounded-lg text-gray-900 dark:text-gray-100'>{tool.icon}</div>
                                        <div className='flex-1'>
                                            <div className='text-xs text-blue-600 dark:text-blue-400 font-medium mb-1'>{toolData.category}</div>
                                            <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100'>{toolData.name}</h3>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>{toolData.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className='text-center py-16'>
                        <p className='text-xl text-gray-500 dark:text-gray-400'>No tools found matching your search.</p>
                    </div>
                )}
            </main>

            <section className='container mx-auto px-4 py-16'>
                <div className='max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center'>
                    <div>
                        <div className='text-4xl mb-3'>⚡</div>
                        <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.home.features.fast.title}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.home.features.fast.description}</p>
                    </div>
                    <div>
                        <div className='text-4xl mb-3'>🔒</div>
                        <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.home.features.secure.title}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.home.features.secure.description}</p>
                    </div>
                    <div>
                        <div className='text-4xl mb-3'>✨</div>
                        <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.home.features.free.title}</h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{t.home.features.free.description}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
