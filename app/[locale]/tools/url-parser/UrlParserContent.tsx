"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { urlParserTranslations } from "@/lib/i18n/tools/url-parser";

// Lightweight Inline Icons
const GlobeIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
);
const RotateCcwIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);
const SparklesIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);
const LayersIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);
const TargetIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8 4c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8 8 3.58 8 8z" />
    </svg>
);
const LockIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);
const UnlockIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
);
const PlusIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);
const TrashIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const LinkIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);
const CopyIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
);
const CheckIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);
const ExternalLinkIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);
const BookOpenIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);
const HelpCircleIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ChevronDownIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
const ChevronUpIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

interface QueryParam {
    id: string;
    key: string;
    value: string;
}

export default function UrlParserContent() {
    const { locale } = useLanguage();
    const t = urlParserTranslations[locale as "en" | "vi"] || urlParserTranslations.en;

    const [activeTab, setActiveTab] = useState<"parser" | "utm">("parser");
    const [rawUrlInput, setRawUrlInput] = useState(
        "https://anytools.online/shop/tech?category=keyboards&brand=keychron&sort=price_asc#reviews"
    );
    const [decodeSpecialChars, setDecodeSpecialChars] = useState(true);
    const [copied, setCopied] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Parsed components state
    const [protocol, setProtocol] = useState("https:");
    const [hostname, setHostname] = useState("anytools.online");
    const [port, setPort] = useState("");
    const [pathname, setPathname] = useState("/shop/tech");
    const [hash, setHash] = useState("#reviews");
    const [queryParams, setQueryParams] = useState<QueryParam[]>([
        { id: "1", key: "category", value: "keyboards" },
        { id: "2", key: "brand", value: "keychron" },
        { id: "3", key: "sort", value: "price_asc" },
    ]);

    // Parse URL whenever raw input changes
    const parseUrl = (input: string) => {
        try {
            let normalized = input.trim();
            if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
                normalized = "https://" + normalized;
            }
            const parsed = new URL(normalized);
            setProtocol(parsed.protocol);
            setHostname(parsed.hostname);
            setPort(parsed.port);
            setPathname(parsed.pathname);
            setHash(parsed.hash);

            const paramsList: QueryParam[] = [];
            parsed.searchParams.forEach((val, key) => {
                paramsList.push({
                    id: Math.random().toString(36).substring(2, 9),
                    key,
                    value: decodeSpecialChars ? decodeURIComponent(val) : val,
                });
            });
            setQueryParams(paramsList);
        } catch {
            // Invalid URL handling
        }
    };

    // Reconstruct full URL from state
    const reconstructedUrl = useMemo(() => {
        try {
            const proto = protocol.endsWith(":") ? protocol : `${protocol}:`;
            const hostWithPort = port ? `${hostname}:${port}` : hostname;
            const path = pathname.startsWith("/") ? pathname : `/${pathname}`;

            let url = `${proto}//${hostWithPort}${path}`;

            const searchParams = new URLSearchParams();
            queryParams.forEach(p => {
                if (p.key.trim()) {
                    searchParams.append(p.key.trim(), p.value);
                }
            });

            const searchStr = searchParams.toString();
            if (searchStr) {
                url += `?${searchStr}`;
            }

            if (hash) {
                url += hash.startsWith("#") ? hash : `#${hash}`;
            }

            return url;
        } catch {
            return rawUrlInput;
        }
    }, [protocol, hostname, port, pathname, hash, queryParams, rawUrlInput]);

    // Update query params helper
    const handleAddParam = () => {
        setQueryParams(prev => [
            ...prev,
            { id: Math.random().toString(36).substring(2, 9), key: "", value: "" }
        ]);
    };

    const handleUpdateParam = (id: string, field: "key" | "value", val: string) => {
        setQueryParams(prev =>
            prev.map(p => (p.id === id ? { ...p, [field]: val } : p))
        );
    };

    const handleDeleteParam = (id: string) => {
        setQueryParams(prev => prev.filter(p => p.id !== id));
    };

    // UTM Helper: get or set specific query param
    const getUtmValue = (key: string) => {
        const item = queryParams.find(p => p.key === key);
        return item ? item.value : "";
    };

    const setUtmValue = (key: string, val: string) => {
        setQueryParams(prev => {
            const exists = prev.some(p => p.key === key);
            if (exists) {
                if (!val.trim()) {
                    return prev.filter(p => p.key !== key);
                }
                return prev.map(p => (p.key === key ? { ...p, value: val } : p));
            } else if (val.trim()) {
                return [...prev, { id: Math.random().toString(36).substring(2, 9), key, value: val }];
            }
            return prev;
        });
    };

    // Copy to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(reconstructedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Reset
    const handleReset = () => {
        const defaultUrl = "https://anytools.online";
        setRawUrlInput(defaultUrl);
        parseUrl(defaultUrl);
    };

    return (
        <div className='space-y-8'>
            {/* Input URL Bar */}
            <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-none sm:p-7'>
                <div className='flex items-center justify-between mb-3'>
                    <label className='text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2'>
                        <GlobeIcon className='h-4 w-4 text-indigo-500' />
                        {t.inputUrl}
                    </label>
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={handleReset}
                            className='flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        >
                            <RotateCcwIcon className='h-3.5 w-3.5' />
                            <span>{t.reset}</span>
                        </button>
                    </div>
                </div>

                <div className='relative'>
                    <input
                        type='text'
                        value={rawUrlInput}
                        onChange={(e) => {
                            setRawUrlInput(e.target.value);
                            parseUrl(e.target.value);
                        }}
                        placeholder={t.inputPlaceholder}
                        className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder-slate-600 dark:focus:border-indigo-400'
                    />
                </div>

                {/* Quick Presets */}
                <div className='mt-3 flex flex-wrap items-center gap-2'>
                    <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1'>
                        <SparklesIcon className='h-3 w-3' /> Presets:
                    </span>
                    {[
                        { label: "Google Search", url: "https://www.google.com/search?q=anytools+online+utilities&hl=en&gl=us" },
                        { label: "E-Commerce Filter", url: "https://store.example.com/products/shoes?category=sneakers&brand=nike&sort=price_desc#filters" },
                        { label: "Campaign Link", url: "https://mywebsite.com/landing?utm_source=facebook&utm_medium=cpc&utm_campaign=summer_sale_2026&utm_content=banner_top" }
                    ].map(p => (
                        <button
                            key={p.label}
                            onClick={() => {
                                setRawUrlInput(p.url);
                                parseUrl(p.url);
                            }}
                            className='rounded-xl border border-slate-200/90 bg-slate-100/70 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400'
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mode Tabs */}
            <div className='flex gap-2 p-1.5 rounded-2xl border border-slate-200/80 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900/60 w-fit'>
                <button
                    onClick={() => setActiveTab("parser")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                        activeTab === "parser"
                            ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                >
                    <LayersIcon className='h-4 w-4' />
                    <span>{t.tabParser}</span>
                </button>
                <button
                    onClick={() => setActiveTab("utm")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                        activeTab === "utm"
                            ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                >
                    <TargetIcon className='h-4 w-4' />
                    <span>{t.tabUtm}</span>
                </button>
            </div>

            {/* PARSER TAB */}
            {activeTab === "parser" && (
                <div className='space-y-6'>
                    {/* Component breakdown cards */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {/* Protocol */}
                        <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70'>
                            <div className='flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 mb-2'>
                                <span>{t.protocol}</span>
                                {protocol === "https:" ? (
                                    <LockIcon className='h-3.5 w-3.5 text-emerald-500' />
                                ) : (
                                    <UnlockIcon className='h-3.5 w-3.5 text-amber-500' />
                                )}
                            </div>
                            <input
                                type='text'
                                value={protocol}
                                onChange={(e) => setProtocol(e.target.value)}
                                className='w-full font-mono text-sm font-semibold text-slate-800 bg-transparent outline-none focus:text-indigo-600 dark:text-slate-200 dark:focus:text-indigo-400'
                            />
                        </div>

                        {/* Hostname */}
                        <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70'>
                            <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-2'>
                                {t.hostname}
                            </div>
                            <input
                                type='text'
                                value={hostname}
                                onChange={(e) => setHostname(e.target.value)}
                                className='w-full font-mono text-sm font-semibold text-slate-800 bg-transparent outline-none focus:text-indigo-600 dark:text-slate-200 dark:focus:text-indigo-400'
                            />
                        </div>

                        {/* Pathname */}
                        <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70'>
                            <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-2'>
                                {t.pathname}
                            </div>
                            <input
                                type='text'
                                value={pathname}
                                onChange={(e) => setPathname(e.target.value)}
                                className='w-full font-mono text-sm font-semibold text-slate-800 bg-transparent outline-none focus:text-indigo-600 dark:text-slate-200 dark:focus:text-indigo-400'
                            />
                        </div>

                        {/* Hash / Anchor */}
                        <div className='rounded-2xl border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800/80 dark:bg-slate-900/70'>
                            <div className='text-xs font-bold text-slate-400 dark:text-slate-500 mb-2'>
                                {t.hash}
                            </div>
                            <input
                                type='text'
                                value={hash}
                                onChange={(e) => setHash(e.target.value)}
                                placeholder='#section'
                                className='w-full font-mono text-sm font-semibold text-slate-800 bg-transparent outline-none focus:text-indigo-600 dark:text-slate-200 dark:focus:text-indigo-400'
                            />
                        </div>
                    </div>

                    {/* Query Parameters Table */}
                    <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 sm:p-7'>
                        <div className='flex flex-wrap items-center justify-between gap-3 mb-5'>
                            <div>
                                <h3 className='text-base font-bold text-slate-900 dark:text-white flex items-center gap-2'>
                                    <span>{t.queryParams}</span>
                                    <span className='rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'>
                                        {queryParams.length}
                                    </span>
                                </h3>
                            </div>

                            <button
                                onClick={handleAddParam}
                                className='flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95'
                            >
                                <PlusIcon className='h-4 w-4' />
                                <span>{t.addParam}</span>
                            </button>
                        </div>

                        {queryParams.length === 0 ? (
                            <div className='py-8 text-center text-sm text-slate-500 dark:text-slate-400'>
                                {t.noParams}
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                {queryParams.map((param) => (
                                    <div
                                        key={param.id}
                                        className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-2.5 dark:border-slate-800/70 dark:bg-slate-800/40'
                                    >
                                        <div className='w-full sm:w-1/3'>
                                            <input
                                                type='text'
                                                value={param.key}
                                                onChange={(e) => handleUpdateParam(param.id, "key", e.target.value)}
                                                placeholder={t.paramKey}
                                                className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <input
                                                type='text'
                                                value={param.value}
                                                onChange={(e) => handleUpdateParam(param.id, "value", e.target.value)}
                                                placeholder={t.paramValue}
                                                className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleDeleteParam(param.id)}
                                            className='self-end sm:self-auto p-2 text-slate-400 transition hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400'
                                            title={t.deleteParam}
                                        >
                                            <TrashIcon className='h-4 w-4' />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* UTM BUILDER TAB */}
            {activeTab === "utm" && (
                <div className='rounded-3xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 sm:p-7 space-y-6'>
                    <div>
                        <h3 className='text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1'>
                            <TargetIcon className='h-5 w-5 text-indigo-500' />
                            <span>{t.utmBuilderTitle}</span>
                        </h3>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>
                            Fill in your campaign tracking parameters to generate an industry-standard trackable URL.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        {/* utm_source */}
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                {t.utmSource}
                            </label>
                            <input
                                type='text'
                                value={getUtmValue("utm_source")}
                                onChange={(e) => setUtmValue("utm_source", e.target.value)}
                                placeholder={t.utmSourcePlaceholder}
                                className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                            />
                            {/* Quick presets */}
                            <div className='flex flex-wrap gap-1 mt-1'>
                                {["google", "facebook", "newsletter", "tiktok", "youtube"].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setUtmValue("utm_source", val)}
                                        className='rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400'
                                    >
                                        +{val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* utm_medium */}
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                {t.utmMedium}
                            </label>
                            <input
                                type='text'
                                value={getUtmValue("utm_medium")}
                                onChange={(e) => setUtmValue("utm_medium", e.target.value)}
                                placeholder={t.utmMediumPlaceholder}
                                className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                            />
                            <div className='flex flex-wrap gap-1 mt-1'>
                                {["cpc", "email", "banner", "organic_social", "post"].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setUtmValue("utm_medium", val)}
                                        className='rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400'
                                    >
                                        +{val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* utm_campaign */}
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                {t.utmCampaign}
                            </label>
                            <input
                                type='text'
                                value={getUtmValue("utm_campaign")}
                                onChange={(e) => setUtmValue("utm_campaign", e.target.value)}
                                placeholder={t.utmCampaignPlaceholder}
                                className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                            />
                        </div>

                        {/* utm_term */}
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                {t.utmTerm}
                            </label>
                            <input
                                type='text'
                                value={getUtmValue("utm_term")}
                                onChange={(e) => setUtmValue("utm_term", e.target.value)}
                                placeholder={t.utmTermPlaceholder}
                                className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                            />
                        </div>

                        {/* utm_content */}
                        <div className='space-y-1.5 md:col-span-2'>
                            <label className='text-xs font-bold text-slate-700 dark:text-slate-300'>
                                {t.utmContent}
                            </label>
                            <input
                                type='text'
                                value={getUtmValue("utm_content")}
                                onChange={(e) => setUtmValue("utm_content", e.target.value)}
                                placeholder={t.utmContentPlaceholder}
                                className='w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100'
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Generated / Reconstructed Output Banner */}
            <div className='rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 p-5 backdrop-blur-xl dark:border-indigo-900/40 dark:from-indigo-950/30 dark:to-purple-950/30 sm:p-7'>
                <div className='flex flex-wrap items-center justify-between gap-3 mb-3'>
                    <div className='text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5'>
                        <LinkIcon className='h-4 w-4' />
                        <span>{t.reconstructedUrl}</span>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm ${
                                copied
                                    ? "bg-emerald-500 text-white"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                        >
                            {copied ? (
                                <>
                                    <CheckIcon className='h-3.5 w-3.5' />
                                    <span>{t.copied}</span>
                                </>
                            ) : (
                                <>
                                    <CopyIcon className='h-3.5 w-3.5' />
                                    <span>{t.copyUrl}</span>
                                </>
                            )}
                        </button>

                        <a
                            href={reconstructedUrl}
                            target='_blank'
                            rel='noreferrer noopener'
                            className='flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800'
                        >
                            <ExternalLinkIcon className='h-3.5 w-3.5' />
                            <span>{t.openLink}</span>
                        </a>
                    </div>
                </div>

                <div className='overflow-x-auto rounded-2xl border border-indigo-100 bg-white/90 p-4 font-mono text-xs text-indigo-900 break-all select-all dark:border-indigo-900/60 dark:bg-slate-950/80 dark:text-indigo-200'>
                    {reconstructedUrl}
                </div>
            </div>

            {/* Educational Guide */}
            <div className='rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-8'>
                <div className='flex items-center gap-3 mb-6'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'>
                        <BookOpenIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                        {t.guideTitle}
                    </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm'>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide1Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide2Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40'>
                        <h4 className='font-bold text-slate-900 dark:text-white mb-1.5'>{t.guide3Title}</h4>
                        <p className='text-slate-600 dark:text-slate-400 text-xs leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>

            {/* FAQs Accordion */}
            <div className='rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-8'>
                <div className='flex items-center gap-3 mb-6'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'>
                        <HelpCircleIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-lg font-bold text-slate-900 dark:text-white'>
                        {t.faqTitle}
                    </h3>
                </div>

                <div className='space-y-3'>
                    {[
                        { q: t.faq1Q, a: t.faq1A },
                        { q: t.faq2Q, a: t.faq2A },
                        { q: t.faq3Q, a: t.faq3A },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className='overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/60 transition-all dark:border-slate-800/70 dark:bg-slate-800/30'
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className='flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 dark:text-white'
                            >
                                <span>{item.q}</span>
                                {openFaq === idx ? (
                                    <ChevronUpIcon className='h-4 w-4 shrink-0 text-indigo-500' />
                                ) : (
                                    <ChevronDownIcon className='h-4 w-4 shrink-0 text-slate-400' />
                                )}
                            </button>
                            {openFaq === idx && (
                                <div className='px-4 pb-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400'>
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
