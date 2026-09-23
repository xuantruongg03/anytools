"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { yamlJsonConverterTranslations } from "@/lib/i18n/tools/yaml-json-converter";
import { toast } from "@/components/ui/Toast";

const SAMPLE_YAML = `version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    environment:
      NODE_ENV: production
    restart: always
  db:
    image: postgres:15
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secretpassword

volumes:
  db-data:`;

const SAMPLE_JSON = `{
  "apiVersion": "v1",
  "kind": "Pod",
  "metadata": {
    "name": "nginx-ingress-pod",
    "labels": {
      "app": "web",
      "env": "production"
    }
  },
  "spec": {
    "containers": [
      {
        "name": "nginx",
        "image": "nginx:1.25",
        "ports": [
          { "containerPort": 80 }
        ]
      }
    ]
  }
}`;

export default function YamlJsonConverterContent() {
    const { locale } = useLanguage();
    const t = yamlJsonConverterTranslations[locale as "en" | "vi"] || yamlJsonConverterTranslations.en;

    const [mode, setMode] = useState<"yaml2json" | "json2yaml">("yaml2json");
    const [input, setInput] = useState<string>(SAMPLE_YAML);
    const [output, setOutput] = useState<string>("");
    const [indent, setIndent] = useState<number>(2);
    const [minify, setMinify] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Perform conversion
    const convertData = useCallback(async () => {
        if (!input.trim()) {
            setOutput("");
            setErrorMsg(null);
            return;
        }

        try {
            setErrorMsg(null);
            const yaml = (await import("js-yaml")).default;

            if (mode === "yaml2json") {
                // Parse YAML to JS Object, then stringify to JSON
                const parsed = yaml.load(input);
                if (parsed === undefined) {
                    setOutput("");
                    return;
                }
                const jsonStr = minify
                    ? JSON.stringify(parsed)
                    : JSON.stringify(parsed, null, indent);
                setOutput(jsonStr);
            } else {
                // Parse JSON to JS Object, then dump to YAML
                const parsed = JSON.parse(input);
                const yamlStr = yaml.dump(parsed, {
                    indent: indent,
                    lineWidth: -1, // no wrap
                    noRefs: true,
                });
                setOutput(yamlStr);
            }
        } catch (err: any) {
            setErrorMsg(err?.message || "Invalid syntax");
        }
    }, [input, mode, indent, minify]);

    useEffect(() => {
        convertData();
    }, [convertData]);

    // Swap Conversion Mode
    const handleSwap = () => {
        if (output && !errorMsg) {
            setInput(output);
        }
        setMode((prev) => (prev === "yaml2json" ? "json2yaml" : "yaml2json"));
    };

    // Copy Output
    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success(t.copied);
    };

    // Download File
    const handleDownload = () => {
        if (!output) return;
        const extension = mode === "yaml2json" ? "json" : "yaml";
        const mimeType = mode === "yaml2json" ? "application/json" : "text/yaml";
        const blob = new Blob([output], { type: `${mimeType};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `converted_${Date.now()}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(locale === "vi" ? `Đã tải file .${extension}!` : `Downloaded .${extension} file!`);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-6xl mx-auto space-y-6'>
            {/* Top Toolbar Controls */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-wrap items-center justify-between gap-4'>
                <div className='flex flex-wrap items-center gap-3'>
                    {/* Direction Toggle */}
                    <div className='flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold'>
                        <button
                            onClick={() => {
                                setMode("yaml2json");
                                setInput(SAMPLE_YAML);
                            }}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                mode === "yaml2json"
                                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            YAML ➔ JSON
                        </button>
                        <button
                            onClick={() => {
                                setMode("json2yaml");
                                setInput(SAMPLE_JSON);
                            }}
                            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                mode === "json2yaml"
                                    ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            JSON ➔ YAML
                        </button>
                    </div>

                    <button
                        onClick={handleSwap}
                        className='px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer'
                        title='Swap Input & Output'
                    >
                        🔄 Swap
                    </button>

                    {/* Indent Setting */}
                    <div className='flex items-center gap-1.5 text-xs'>
                        <span className='font-bold text-gray-600 dark:text-gray-400'>{t.indent}:</span>
                        <select
                            value={indent}
                            onChange={(e) => setIndent(parseInt(e.target.value, 10))}
                            className='px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold cursor-pointer'
                        >
                            <option value={2}>{t.indent2}</option>
                            <option value={4}>{t.indent4}</option>
                        </select>
                    </div>

                    {/* Minify JSON Checkbox */}
                    {mode === "yaml2json" && (
                        <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={minify}
                                onChange={(e) => setMinify(e.target.checked)}
                                className='rounded accent-blue-600 w-3.5 h-3.5'
                            />
                            <span>{t.minifyJson}</span>
                        </label>
                    )}
                </div>

                {/* Samples & Clear */}
                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => setInput(mode === "yaml2json" ? SAMPLE_YAML : SAMPLE_JSON)}
                        className='px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer'
                    >
                        📋 {t.loadSample}
                    </button>
                    <button
                        onClick={() => {
                            setInput("");
                            setOutput("");
                        }}
                        className='px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/60 transition-all cursor-pointer'
                    >
                        🗑️ {t.clearAll}
                    </button>
                </div>
            </div>

            {/* Error Notification Banner */}
            {errorMsg && (
                <div className='w-full p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-mono flex items-start gap-2.5'>
                    <span className='text-base leading-none'>⚠️</span>
                    <div className='flex-1 break-all whitespace-pre-wrap leading-relaxed'>{errorMsg}</div>
                </div>
            )}

            {/* Two-Pane Editor Layout */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Source Input Pane */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col space-y-3'>
                    <div className='flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300'>
                        <span className='flex items-center gap-1.5'>
                            <span>📥</span> {t.inputLabel} ({mode === "yaml2json" ? "YAML" : "JSON"})
                        </span>
                        <span className='text-[11px] font-mono text-gray-400'>
                            {input.length} chars
                        </span>
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            mode === "yaml2json"
                                ? "Paste or type YAML here..."
                                : "Paste or type JSON here..."
                        }
                        rows={18}
                        className='w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-y leading-relaxed'
                        spellCheck={false}
                    />
                </div>

                {/* Converted Output Pane */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col space-y-3'>
                    <div className='flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300'>
                        <span className='flex items-center gap-1.5'>
                            <span>📤</span> {t.outputLabel} ({mode === "yaml2json" ? "JSON" : "YAML"})
                        </span>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={handleCopy}
                                disabled={!output}
                                className='px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs'
                            >
                                📋 {t.copyOutput}
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={!output}
                                className='px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-800 dark:text-gray-200 text-xs font-bold transition-all cursor-pointer border border-gray-200 dark:border-gray-700'
                            >
                                💾 {t.downloadFile}
                            </button>
                        </div>
                    </div>

                    <textarea
                        readOnly
                        value={output}
                        placeholder='Converted result will appear here in real-time...'
                        rows={18}
                        className='w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:outline-hidden resize-y leading-relaxed'
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Guide & Knowledge */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>💡</span> {t.guideTitle}
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>1. {t.guide1Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>2. {t.guide2Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>3. {t.guide3Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
