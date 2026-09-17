"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function JsonToTypesContent() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const toolT = (t.tools as any).jsonToTypes;
    const ui = toolT?.ui || {};
    const page = toolT?.page || {};

    const [inputJson, setInputJson] = useState<string>(
        JSON.stringify(
            {
                id: 101,
                name: "Alex Mercer",
                email: "alex@example.com",
                isActive: true,
                roles: ["admin", "developer"],
                profile: {
                    age: 28,
                    location: "San Francisco, CA",
                    bio: null,
                },
                tags: [
                    { id: 1, label: "React" },
                    { id: 2, label: "Next.js" },
                ],
            },
            null,
            2
        )
    );

    const [outputFormat, setOutputFormat] = useState<"interface" | "type" | "yaml">("interface");
    const [rootName, setRootName] = useState<string>("RootObject");
    const [isOptional, setIsOptional] = useState<boolean>(false);
    const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Capitalize helper
    const toPascalCase = (str: string) => {
        return str
            .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
            .replace(/^\w/, (c) => c.toUpperCase());
    };

    // JSON to YAML generator
    const jsonToYaml = (obj: any, indent = 0): string => {
        const spacing = "  ".repeat(indent);
        if (obj === null) return "null";
        if (typeof obj !== "object") return String(obj);

        if (Array.isArray(obj)) {
            if (obj.length === 0) return "[]";
            return obj
                .map((item) => `${spacing}- ${typeof item === "object" && item !== null ? "\n" + jsonToYaml(item, indent + 1) : jsonToYaml(item, 0)}`)
                .join("\n");
        }

        const entries = Object.entries(obj);
        if (entries.length === 0) return "{}";

        return entries
            .map(([key, val]) => {
                if (val !== null && typeof val === "object") {
                    return `${spacing}${key}:\n${jsonToYaml(val, indent + 1)}`;
                }
                return `${spacing}${key}: ${val === null ? "null" : typeof val === "string" ? `"${val}"` : val}`;
            })
            .join("\n");
    };

    // Recursive TypeScript Generator
    const { generatedOutput, conversionError } = useMemo(() => {
        if (!inputJson.trim()) {
            return { generatedOutput: "", conversionError: null };
        }

        let parsed: any;
        try {
            parsed = JSON.parse(inputJson);
        } catch (e: any) {
            return { generatedOutput: "", conversionError: ui.errorInvalidJson || "Invalid JSON syntax." };
        }

        if (outputFormat === "yaml") {
            try {
                return { generatedOutput: jsonToYaml(parsed), conversionError: null };
            } catch (err: any) {
                return { generatedOutput: "", conversionError: "Could not convert to YAML." };
            }
        }

        // TS Interface / Type builder
        const interfaces: Record<string, string> = {};
        const prefix = isReadOnly ? "readonly " : "";
        const optMark = isOptional ? "?" : "";

        const resolveType = (val: any, propKey: string): string => {
            if (val === null) return "null";
            if (val === undefined) return "undefined";

            const typeOfVal = typeof val;
            if (typeOfVal === "string" || typeOfVal === "number" || typeOfVal === "boolean") {
                return typeOfVal;
            }

            if (Array.isArray(val)) {
                if (val.length === 0) return "any[]";
                const firstElem = val[0];
                const elemType = resolveType(firstElem, `${propKey}Item`);
                return `${elemType}[]`;
            }

            if (typeOfVal === "object") {
                const subInterfaceName = toPascalCase(propKey);
                buildInterface(val, subInterfaceName);
                return subInterfaceName;
            }

            return "any";
        };

        const buildInterface = (obj: any, name: string) => {
            if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return;

            const lines = Object.entries(obj).map(([k, v]) => {
                const t = resolveType(v, k);
                return `    ${prefix}${k}${optMark}: ${t};`;
            });

            if (outputFormat === "interface") {
                interfaces[name] = `export interface ${name} {\n${lines.join("\n")}\n}`;
            } else {
                interfaces[name] = `export type ${name} = {\n${lines.join("\n")}\n};`;
            }
        };

        const rootNameClean = toPascalCase(rootName.trim()) || "RootObject";
        buildInterface(parsed, rootNameClean);

        // Put Root at the bottom or top
        const output = Object.values(interfaces).join("\n\n");
        return { generatedOutput: output, conversionError: null };
    }, [inputJson, outputFormat, rootName, isOptional, isReadOnly, ui.errorInvalidJson]);

    const handleCopy = () => {
        if (!generatedOutput) return;
        navigator.clipboard.writeText(generatedOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className='space-y-8 max-w-6xl mx-auto'>
            {/* Top Toolbar */}
            <Card className='p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-wrap items-center justify-between gap-4'>
                <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mr-2'>
                        {ui.outputFormat || "Format"}:
                    </span>
                    <button
                        onClick={() => setOutputFormat("interface")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            outputFormat === "interface"
                                ? "bg-blue-600 text-white shadow-xs"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                        {ui.formatTsInterface || "TS Interface"}
                    </button>
                    <button
                        onClick={() => setOutputFormat("type")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            outputFormat === "type"
                                ? "bg-blue-600 text-white shadow-xs"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                        {ui.formatTsType || "TS Type"}
                    </button>
                    <button
                        onClick={() => setOutputFormat("yaml")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            outputFormat === "yaml"
                                ? "bg-blue-600 text-white shadow-xs"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                        {ui.formatYaml || "YAML"}
                    </button>
                </div>

                {outputFormat !== "yaml" && (
                    <div className='flex items-center gap-4 flex-wrap text-xs'>
                        <div className='flex items-center gap-1.5'>
                            <span className='font-semibold text-gray-600 dark:text-gray-300'>{ui.rootName || "Root"}:</span>
                            <input
                                type='text'
                                value={rootName}
                                onChange={(e) => setRootName(e.target.value)}
                                className='px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md font-mono text-xs w-28'
                            />
                        </div>

                        <label className='flex items-center gap-1.5 font-medium cursor-pointer text-gray-700 dark:text-gray-300'>
                            <input
                                type='checkbox'
                                checked={isOptional}
                                onChange={(e) => setIsOptional(e.target.checked)}
                                className='rounded text-blue-600 accent-blue-600 cursor-pointer'
                            />
                            {ui.optionalFields || "Optional (?)"}
                        </label>

                        <label className='flex items-center gap-1.5 font-medium cursor-pointer text-gray-700 dark:text-gray-300'>
                            <input
                                type='checkbox'
                                checked={isReadOnly}
                                onChange={(e) => setIsReadOnly(e.target.checked)}
                                className='rounded text-blue-600 accent-blue-600 cursor-pointer'
                            />
                            {ui.readOnlyFields || "Readonly"}
                        </label>
                    </div>
                )}
            </Card>

            {/* Side-by-side Editor: JSON In -> Types Out */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Input Column */}
                <Card className='p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md flex flex-col'>
                    <div className='flex items-center justify-between mb-3'>
                        <span className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                            {ui.inputLabel || "Input JSON"}
                        </span>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setInputJson("")}
                                className='text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer'
                            >
                                {ui.clear || "Clear"}
                            </button>
                        </div>
                    </div>
                    <textarea
                        rows={16}
                        value={inputJson}
                        onChange={(e) => setInputJson(e.target.value)}
                        placeholder='{"name": "John"}'
                        className='w-full p-4 font-mono text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white leading-relaxed resize-y flex-1'
                    />
                </Card>

                {/* Output Column */}
                <Card className='p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md flex flex-col'>
                    <div className='flex items-center justify-between mb-3'>
                        <span className='text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                            {ui.outputLabel || "Generated Output"}
                        </span>
                        <button
                            onClick={handleCopy}
                            disabled={!generatedOutput}
                            className='px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-xs'
                        >
                            {copied ? (ui.copied || "Copied!") : (ui.copy || "Copy Output")}
                        </button>
                    </div>

                    {conversionError ? (
                        <div className='p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs font-mono flex-1'>
                            ⚠️ {conversionError}
                        </div>
                    ) : (
                        <pre className='w-full p-4 font-mono text-xs bg-gray-900 text-emerald-400 border border-gray-800 rounded-xl overflow-x-auto whitespace-pre leading-relaxed flex-1'>
                            <code>{generatedOutput || "// Converted definitions will appear here"}</code>
                        </pre>
                    )}
                </Card>
            </div>

            {/* Rich SEO Content */}
            {page.whatIs && (
                <div className='mt-12 space-y-8 text-gray-700 dark:text-gray-300'>
                    <section className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>{page.whatIs}</h2>
                        <p className='leading-relaxed mb-6'>{page.whatIsDesc}</p>

                        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                            {locale === "vi" ? "Tính Năng Nổi Bật" : "Key Features"}
                        </h3>
                        <ul className='list-disc pl-5 space-y-2 text-sm leading-relaxed'>
                            {Object.values(page.features || {}).map((feat: any, idx: number) => (
                                <li key={idx}>{feat}</li>
                            ))}
                        </ul>
                    </section>

                    {/* FAQ */}
                    {page.faq && (
                        <section className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm'>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                                {locale === "vi" ? "Câu Hỏi Thường Gặp" : "Frequently Asked Questions"}
                            </h2>
                            <div className='space-y-4'>
                                {[1, 2, 3].map((i) => {
                                    const q = page.faq[`q${i}`];
                                    const a = page.faq[`a${i}`];
                                    if (!q) return null;
                                    return (
                                        <details key={i} className='group border border-gray-200 dark:border-gray-700 rounded-xl p-4 open:bg-gray-50 dark:open:bg-gray-900/50 transition-colors'>
                                            <summary className='font-semibold text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between'>
                                                <span>{q}</span>
                                                <span className='transition group-open:rotate-180 text-gray-400'>▼</span>
                                            </summary>
                                            <p className='mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>{a}</p>
                                        </details>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
