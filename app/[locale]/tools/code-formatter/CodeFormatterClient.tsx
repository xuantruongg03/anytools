"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import * as prettier from "prettier/standalone";
import * as parserBabel from "prettier/plugins/babel";
import * as parserHtml from "prettier/plugins/html";
import * as parserCss from "prettier/plugins/postcss";
import * as parserMarkdown from "prettier/plugins/markdown";
import * as parserYaml from "prettier/plugins/yaml";
import * as parserGraphql from "prettier/plugins/graphql";
import * as parserTypescript from "prettier/plugins/typescript";
import * as estreePlugin from "prettier/plugins/estree";
import { format as sqlFormat } from "sql-formatter";
import { translations } from "./translations";

type Language = "javascript" | "typescript" | "html" | "css" | "json" | "sql" | "python" | "xml" | "markdown" | "yaml" | "graphql";

interface LanguageOption {
    value: Language;
    label: string;
    icon: string;
}

const languages: LanguageOption[] = [
    { value: "javascript", label: "JavaScript", icon: "🟨" },
    { value: "typescript", label: "TypeScript", icon: "🔷" },
    { value: "html", label: "HTML", icon: "🟧" },
    { value: "css", label: "CSS", icon: "🟦" },
    { value: "json", label: "JSON", icon: "📋" },
    { value: "sql", label: "SQL", icon: "🗃️" },
    { value: "python", label: "Python", icon: "🐍" },
    { value: "xml", label: "XML", icon: "📄" },
    { value: "markdown", label: "Markdown", icon: "📝" },
    { value: "yaml", label: "YAML", icon: "⚙️" },
    { value: "graphql", label: "GraphQL", icon: "◈" },
];

function detectLanguage(code: string): Language {
    const trimmed = code.trim();

    // JSON detection
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
        try {
            JSON.parse(trimmed);
            return "json";
        } catch {
            // Not valid JSON
        }
    }

    // HTML detection
    if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || /<[a-z][\s\S]*>/i.test(trimmed)) {
        if (trimmed.includes("<?xml")) return "xml";
        return "html";
    }

    // XML detection
    if (trimmed.startsWith("<?xml")) return "xml";

    // SQL detection
    if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\s/i.test(trimmed)) {
        return "sql";
    }

    // Python detection
    if (/^(def |class |import |from |if __name__|print\()/m.test(trimmed) || trimmed.includes(":\n")) {
        return "python";
    }

    // YAML detection
    if (/^[a-z_]+:\s/im.test(trimmed) && !trimmed.includes("{")) {
        return "yaml";
    }

    // GraphQL detection
    if (/^(query|mutation|subscription|type|schema|fragment)\s/m.test(trimmed)) {
        return "graphql";
    }

    // CSS detection
    if (/^[.#@a-z][^{]*\{[^}]*\}/im.test(trimmed) && !trimmed.includes("function") && !trimmed.includes("=>")) {
        return "css";
    }

    // TypeScript detection
    if (trimmed.includes(": string") || trimmed.includes(": number") || trimmed.includes("interface ") || trimmed.includes(": boolean") || /:\s*(string|number|boolean|any)\b/.test(trimmed)) {
        return "typescript";
    }

    // Markdown detection
    if (/^#{1,6}\s/.test(trimmed) || trimmed.includes("```")) {
        return "markdown";
    }

    // Default to JavaScript
    return "javascript";
}

// Simple Python formatter
function formatPython(code: string, indentSize: number): string {
    const lines = code.split("\n");
    const result: string[] = [];
    let indentLevel = 0;
    const indent = " ".repeat(indentSize);

    for (let line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            result.push("");
            continue;
        }

        // Decrease indent for these keywords
        if (/^(elif|else|except|finally)\b/.test(trimmed) || /^(case|default)\b/.test(trimmed)) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        // Check for dedent patterns
        if (trimmed === "}" || trimmed === "]" || trimmed === ")") {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        result.push(indent.repeat(indentLevel) + trimmed);

        // Increase indent after these patterns
        if (trimmed.endsWith(":") || trimmed.endsWith("{") || trimmed.endsWith("[") || trimmed.endsWith("(") || /^(if|elif|else|for|while|def|class|try|except|finally|with)\b/.test(trimmed)) {
            if (trimmed.endsWith(":")) {
                indentLevel++;
            }
        }
    }

    return result.join("\n");
}

// Simple XML formatter
function formatXml(code: string, indentSize: number): string {
    const indent = " ".repeat(indentSize);
    let formatted = "";
    let indentLevel = 0;

    // Remove existing whitespace between tags
    code = code.replace(/>\s+</g, "><");

    const tokens = code.split(/(<[^>]+>)/);

    for (const token of tokens) {
        if (!token.trim()) continue;

        if (token.startsWith("</")) {
            // Closing tag
            indentLevel = Math.max(0, indentLevel - 1);
            formatted += indent.repeat(indentLevel) + token + "\n";
        } else if (token.startsWith("<?") || token.startsWith("<!")) {
            // Declaration or comment
            formatted += indent.repeat(indentLevel) + token + "\n";
        } else if (token.startsWith("<") && token.endsWith("/>")) {
            // Self-closing tag
            formatted += indent.repeat(indentLevel) + token + "\n";
        } else if (token.startsWith("<")) {
            // Opening tag
            formatted += indent.repeat(indentLevel) + token + "\n";
            indentLevel++;
        } else {
            // Text content
            formatted += indent.repeat(indentLevel) + token.trim() + "\n";
        }
    }

    return formatted.trim();
}

// Minify functions
function minifyJs(code: string): string {
    return code
        .replace(/\/\/.*$/gm, "") // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
        .replace(/\s+/g, " ") // Collapse whitespace
        .replace(/\s*([{};,:])\s*/g, "$1") // Remove spaces around punctuation
        .replace(/;\}/g, "}") // Remove semicolon before closing brace
        .trim();
}

function minifyCss(code: string): string {
    return code
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
        .replace(/\s+/g, " ") // Collapse whitespace
        .replace(/\s*([{};:,>+~])\s*/g, "$1") // Remove spaces around punctuation
        .replace(/;}/g, "}") // Remove last semicolon
        .trim();
}

function minifyHtml(code: string): string {
    return code
        .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
        .replace(/\s+/g, " ") // Collapse whitespace
        .replace(/>\s+</g, "><") // Remove whitespace between tags
        .trim();
}

function minifyJson(code: string): string {
    try {
        return JSON.stringify(JSON.parse(code));
    } catch {
        return code;
    }
}

function minifySql(code: string): string {
    return code
        .replace(/--.*$/gm, "") // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
        .replace(/\s+/g, " ") // Collapse whitespace
        .trim();
}

export default function CodeFormatterClient({ locale }: { locale: "en" | "vi" }) {
    const t = translations[locale];

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState<Language>("javascript");
    const [indentType, setIndentType] = useState<"spaces" | "tabs">("spaces");
    const [indentSize, setIndentSize] = useState(2);
    const [quoteStyle, setQuoteStyle] = useState<"single" | "double">("double");
    const [semicolons, setSemicolons] = useState(true);
    const [isFormatting, setIsFormatting] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [detectedLang, setDetectedLang] = useState<Language | null>(null);

    // Auto-detect language when input changes
    const handleInputChange = (value: string) => {
        setInput(value);
        if (value.trim()) {
            const detected = detectLanguage(value);
            setDetectedLang(detected);
        } else {
            setDetectedLang(null);
        }
    };

    // Use detected language
    const useDetectedLanguage = () => {
        if (detectedLang) {
            setLanguage(detectedLang);
        }
    };

    // Format code
    const formatCode = async () => {
        if (!input.trim()) return;

        setIsFormatting(true);
        setError("");

        try {
            let formatted = "";
            const useTabs = indentType === "tabs";
            const tabWidth = indentSize;

            switch (language) {
                case "javascript":
                case "typescript": {
                    formatted = await prettier.format(input, {
                        parser: language === "typescript" ? "typescript" : "babel",
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        plugins: [parserBabel, parserTypescript, estreePlugin] as any,
                        useTabs,
                        tabWidth,
                        singleQuote: quoteStyle === "single",
                        semi: semicolons,
                        printWidth: 80,
                    });
                    break;
                }
                case "html": {
                    formatted = await prettier.format(input, {
                        parser: "html",
                        plugins: [parserHtml],
                        useTabs,
                        tabWidth,
                        printWidth: 120,
                    });
                    break;
                }
                case "css": {
                    formatted = await prettier.format(input, {
                        parser: "css",
                        plugins: [parserCss],
                        useTabs,
                        tabWidth,
                    });
                    break;
                }
                case "json": {
                    const parsed = JSON.parse(input);
                    const indent = useTabs ? "\t" : " ".repeat(tabWidth);
                    formatted = JSON.stringify(parsed, null, indent);
                    break;
                }
                case "sql": {
                    formatted = sqlFormat(input, {
                        language: "sql",
                        tabWidth,
                        useTabs,
                        keywordCase: "upper",
                        linesBetweenQueries: 2,
                    });
                    break;
                }
                case "python": {
                    formatted = formatPython(input, tabWidth);
                    break;
                }
                case "xml": {
                    formatted = formatXml(input, tabWidth);
                    break;
                }
                case "markdown": {
                    formatted = await prettier.format(input, {
                        parser: "markdown",
                        plugins: [parserMarkdown],
                        useTabs,
                        tabWidth,
                        proseWrap: "always",
                    });
                    break;
                }
                case "yaml": {
                    formatted = await prettier.format(input, {
                        parser: "yaml",
                        plugins: [parserYaml],
                        useTabs,
                        tabWidth,
                    });
                    break;
                }
                case "graphql": {
                    formatted = await prettier.format(input, {
                        parser: "graphql",
                        plugins: [parserGraphql],
                        useTabs,
                        tabWidth,
                    });
                    break;
                }
            }

            setOutput(formatted);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setIsFormatting(false);
        }
    };

    // Minify code
    const minifyCode = () => {
        if (!input.trim()) return;

        setError("");

        try {
            let minified = "";

            switch (language) {
                case "javascript":
                case "typescript":
                    minified = minifyJs(input);
                    break;
                case "css":
                    minified = minifyCss(input);
                    break;
                case "html":
                case "xml":
                    minified = minifyHtml(input);
                    break;
                case "json":
                    minified = minifyJson(input);
                    break;
                case "sql":
                    minified = minifySql(input);
                    break;
                default:
                    minified = input.replace(/\s+/g, " ").trim();
            }

            setOutput(minified);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Unknown error");
        }
    };

    // Copy to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setError("Failed to copy");
        }
    };

    // Download file
    const downloadFile = () => {
        const extensions: Record<Language, string> = {
            javascript: "js",
            typescript: "ts",
            html: "html",
            css: "css",
            json: "json",
            sql: "sql",
            python: "py",
            xml: "xml",
            markdown: "md",
            yaml: "yaml",
            graphql: "graphql",
        };

        const blob = new Blob([output], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `formatted.${extensions[language]}`;
        link.click();
    };

    // Clear all
    const clearAll = () => {
        setInput("");
        setOutput("");
        setError("");
        setDetectedLang(null);
    };

    const selectedLang = useMemo(() => languages.find((l) => l.value === language), [language]);

    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
            {/* Settings */}
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-6'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.language}</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'>
                        {languages.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.icon} {lang.label}
                            </option>
                        ))}
                    </select>
                    {detectedLang && detectedLang !== language && (
                        <button onClick={useDetectedLanguage} className='text-xs text-blue-600 dark:text-blue-400 mt-1 hover:underline'>
                            {t.detected}: {languages.find((l) => l.value === detectedLang)?.label}
                        </button>
                    )}
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.indentType}</label>
                    <select value={indentType} onChange={(e) => setIndentType(e.target.value as "spaces" | "tabs")} className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'>
                        <option value='spaces'>{t.spaces}</option>
                        <option value='tabs'>{t.tabs}</option>
                    </select>
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.indentSize}</label>
                    <select value={indentSize} onChange={(e) => setIndentSize(parseInt(e.target.value))} className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'>
                        <option value='2'>2</option>
                        <option value='4'>4</option>
                    </select>
                </div>
                {(language === "javascript" || language === "typescript") && (
                    <>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.quoteStyle}</label>
                            <select value={quoteStyle} onChange={(e) => setQuoteStyle(e.target.value as "single" | "double")} className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'>
                                <option value='single'>{t.single} (&apos;)</option>
                                <option value='double'>{t.double} (&quot;)</option>
                            </select>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.semicolons}</label>
                            <select value={semicolons ? "yes" : "no"} onChange={(e) => setSemicolons(e.target.value === "yes")} className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'>
                                <option value='yes'>{t.yes}</option>
                                <option value='no'>{t.no}</option>
                            </select>
                        </div>
                    </>
                )}
            </div>

            {/* Code Areas */}
            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Input */}
                <div>
                    <div className='flex justify-between items-center mb-2'>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                            {selectedLang?.icon} {t.inputCode}
                        </label>
                    </div>
                    <textarea value={input} onChange={(e) => handleInputChange(e.target.value)} placeholder={t.inputPlaceholder} className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 resize-none placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' spellCheck={false} />
                    <div className='flex flex-wrap gap-2 mt-4'>
                        <Button variant='primary' onClick={formatCode} disabled={isFormatting || !input.trim()}>
                            {isFormatting ? t.formatting : `✨ ${t.format}`}
                        </Button>
                        <Button variant='warning' onClick={minifyCode} disabled={!input.trim()}>
                            📦 {t.minify}
                        </Button>
                        <Button variant='gray' onClick={clearAll}>
                            {t.clear}
                        </Button>
                    </div>
                </div>

                {/* Output */}
                <div>
                    <div className='flex justify-between items-center mb-2'>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>{t.outputCode}</label>
                        {output && (
                            <div className='flex gap-2'>
                                <Button variant='secondary' size='sm' onClick={copyToClipboard}>
                                    {copied ? `✓ ${t.copied}` : `📋 ${t.copy}`}
                                </Button>
                                <Button variant='secondary' size='sm' onClick={downloadFile}>
                                    💾 {t.download}
                                </Button>
                            </div>
                        )}
                    </div>
                    <textarea value={output} readOnly placeholder={t.outputPlaceholder} className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 resize-none placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none' spellCheck={false} />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className='mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>
                    <strong>{t.error}:</strong> {error}
                </div>
            )}
        </div>
    );
}
