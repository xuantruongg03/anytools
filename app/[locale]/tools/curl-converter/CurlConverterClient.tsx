"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

interface ParsedCurl {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string | null;
    isJson: boolean;
    cookies?: string;
    auth?: { user: string; pass: string };
}

// Tokenize a command line string respecting single/double quotes and backslash escapes
function tokenizeArgs(cmd: string): string[] {
    const cleaned = cmd.replace(/\\\r?\n/g, " "); // Replace escaped newlines
    const tokens: string[] = [];
    let current = "";
    let inSingle = false;
    let inDouble = false;
    let escaped = false;

    for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];

        if (escaped) {
            current += char;
            escaped = false;
            continue;
        }

        if (char === "\\") {
            escaped = true;
            continue;
        }

        if (char === "'" && !inDouble) {
            inSingle = !inSingle;
            continue;
        }

        if (char === '"' && !inSingle) {
            inDouble = !inDouble;
            continue;
        }

        if (/\s/.test(char) && !inSingle && !inDouble) {
            if (current.length > 0) {
                tokens.push(current);
                current = "";
            }
            continue;
        }

        current += char;
    }

    if (current.length > 0) {
        tokens.push(current);
    }

    return tokens;
}

// Parse cURL command tokens into structured object
function parseCurl(cmd: string): { parsed: ParsedCurl | null; error?: string } {
    const trimmed = cmd.trim();
    if (!trimmed) {
        return { parsed: null };
    }

    const tokens = tokenizeArgs(trimmed);
    if (tokens.length === 0) {
        return { parsed: null };
    }

    let url = "";
    let method = "";
    const headers: Record<string, string> = {};
    let body: string | null = null;
    let cookies = "";
    let auth: { user: string; pass: string } | undefined;

    let i = 0;
    if (tokens[0].toLowerCase() === "curl") {
        i = 1;
    }

    while (i < tokens.length) {
        const token = tokens[i];

        if (token === "-X" || token === "--request") {
            method = (tokens[i + 1] || "").toUpperCase();
            i += 2;
        } else if (token === "-H" || token === "--header") {
            const hVal = tokens[i + 1] || "";
            const colonIdx = hVal.indexOf(":");
            if (colonIdx > 0) {
                const key = hVal.slice(0, colonIdx).trim();
                const val = hVal.slice(colonIdx + 1).trim();
                headers[key] = val;
            }
            i += 2;
        } else if (
            token === "-d" ||
            token === "--data" ||
            token === "--data-raw" ||
            token === "--data-binary" ||
            token === "--data-ascii" ||
            token === "--data-urlencode"
        ) {
            const dataVal = tokens[i + 1] || "";
            body = body ? body + "&" + dataVal : dataVal;
            i += 2;
        } else if (token === "-b" || token === "--cookie") {
            cookies = tokens[i + 1] || "";
            i += 2;
        } else if (token === "-u" || token === "--user") {
            const uVal = tokens[i + 1] || "";
            const [u, p] = uVal.split(":");
            auth = { user: u || "", pass: p || "" };
            i += 2;
        } else if (token === "-A" || token === "--user-agent") {
            headers["User-Agent"] = tokens[i + 1] || "";
            i += 2;
        } else if (token === "--url") {
            url = tokens[i + 1] || "";
            i += 2;
        } else if (token.startsWith("-")) {
            // Unhandled flag (e.g. -s, -L, -k, --compressed)
            if (token === "--compressed" || token === "-s" || token === "-L" || token === "-k" || token === "-v") {
                i += 1;
            } else {
                // If it has argument, advance by 2, otherwise 1
                if (i + 1 < tokens.length && !tokens[i + 1].startsWith("-")) {
                    i += 2;
                } else {
                    i += 1;
                }
            }
        } else {
            // Positional argument -> URL
            if (!url && (token.startsWith("http://") || token.startsWith("https://") || token.includes("."))) {
                url = token;
            }
            i += 1;
        }
    }

    if (!url) {
        return { parsed: null, error: "No URL found in cURL command" };
    }

    // Default method
    if (!method) {
        method = body ? "POST" : "GET";
    }

    // Check if body is JSON
    let isJson = false;
    if (body) {
        try {
            JSON.parse(body);
            isJson = true;
            if (!Object.keys(headers).some((h) => h.toLowerCase() === "content-type")) {
                headers["Content-Type"] = "application/json";
            }
        } catch {
            isJson = false;
        }
    }

    return {
        parsed: {
            url,
            method,
            headers,
            body,
            isJson,
            cookies: cookies || undefined,
            auth,
        },
    };
}

// Code generators
function generateFetchCode(p: ParsedCurl): string {
    const hasHeaders = Object.keys(p.headers).length > 0 || p.cookies || p.auth;
    const allHeaders: Record<string, string> = { ...p.headers };

    if (p.cookies) {
        allHeaders["Cookie"] = p.cookies;
    }
    if (p.auth) {
        allHeaders["Authorization"] = `Basic btoa("${p.auth.user}:${p.auth.pass}")`;
    }

    let optionsStr = `{\n  method: "${p.method}",\n`;
    if (Object.keys(allHeaders).length > 0) {
        optionsStr += `  headers: ${JSON.stringify(allHeaders, null, 4).replace(/\n/g, "\n  ")},\n`;
    }
    if (p.body) {
        if (p.isJson) {
            optionsStr += `  body: JSON.stringify(${p.body}),\n`;
        } else {
            optionsStr += `  body: ${JSON.stringify(p.body)},\n`;
        }
    }
    optionsStr += `}`;

    return `// JavaScript / TypeScript (fetch API)\nconst response = await fetch("${p.url}", ${optionsStr});\n\nconst data = await response.json();\nconsole.log(data);`;
}

function generateAxiosCode(p: ParsedCurl): string {
    const allHeaders: Record<string, string> = { ...p.headers };
    if (p.cookies) allHeaders["Cookie"] = p.cookies;

    let configStr = `{\n  method: "${p.method.toLowerCase()}",\n  url: "${p.url}",\n`;
    if (Object.keys(allHeaders).length > 0) {
        configStr += `  headers: ${JSON.stringify(allHeaders, null, 4).replace(/\n/g, "\n  ")},\n`;
    }
    if (p.body) {
        if (p.isJson) {
            configStr += `  data: ${p.body},\n`;
        } else {
            configStr += `  data: ${JSON.stringify(p.body)},\n`;
        }
    }
    if (p.auth) {
        configStr += `  auth: {\n    username: "${p.auth.user}",\n    password: "${p.auth.pass}"\n  },\n`;
    }
    configStr += `}`;

    return `import axios from "axios";\n\nconst response = await axios(${configStr});\nconsole.log(response.data);`;
}

function generatePythonCode(p: ParsedCurl): string {
    const headerLines = Object.entries(p.headers)
        .map(([k, v]) => `    "${k}": "${v}",`)
        .join("\n");

    let code = `import requests\n\nurl = "${p.url}"\n`;
    if (Object.keys(p.headers).length > 0) {
        code += `headers = {\n${headerLines}\n}\n`;
    } else {
        code += `headers = {}\n`;
    }

    if (p.cookies) {
        code += `cookies = {"cookie": "${p.cookies}"}\n`;
    }

    let authStr = "";
    if (p.auth) {
        authStr = `, auth=("${p.auth.user}", "${p.auth.pass}")`;
    }

    if (p.body) {
        if (p.isJson) {
            code += `payload = ${p.body}\n\n`;
            code += `response = requests.${p.method.toLowerCase()}(url, headers=headers, json=payload${authStr})\n`;
        } else {
            code += `payload = ${JSON.stringify(p.body)}\n\n`;
            code += `response = requests.${p.method.toLowerCase()}(url, headers=headers, data=payload${authStr})\n`;
        }
    } else {
        code += `\nresponse = requests.${p.method.toLowerCase()}(url, headers=headers${authStr})\n`;
    }

    code += `print(response.status_code)\nprint(response.text)`;
    return code;
}

function generateGoCode(p: ParsedCurl): string {
    const hasBody = !!p.body;
    let code = `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n`;
    if (hasBody) code += `\t"strings"\n`;
    code += `)\n\nfunc main() {\n\tclient := &http.Client{}\n`;

    if (hasBody) {
        code += `\tpayload := strings.NewReader(${JSON.stringify(p.body)})\n`;
        code += `\treq, err := http.NewRequest("${p.method}", "${p.url}", payload)\n`;
    } else {
        code += `\treq, err := http.NewRequest("${p.method}", "${p.url}", nil)\n`;
    }

    code += `\tif err != nil {\n\t\tpanic(err)\n\t}\n\n`;

    for (const [k, v] of Object.entries(p.headers)) {
        code += `\treq.Header.Set("${k}", "${v}")\n`;
    }
    if (p.auth) {
        code += `\treq.SetBasicAuth("${p.auth.user}", "${p.auth.pass}")\n`;
    }

    code += `\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, _ := io.ReadAll(resp.Body)\n\tfmt.Println(string(body))\n}`;
    return code;
}

function generatePhpCode(p: ParsedCurl): string {
    let code = `<?php\n\n$curl = curl_init();\n\ncurl_setopt_array($curl, array(\n`;
    code += `  CURLOPT_URL => '${p.url}',\n`;
    code += `  CURLOPT_RETURNTRANSFER => true,\n`;
    code += `  CURLOPT_CUSTOMREQUEST => '${p.method}',\n`;

    if (p.body) {
        code += `  CURLOPT_POSTFIELDS => ${JSON.stringify(p.body)},\n`;
    }

    if (Object.keys(p.headers).length > 0) {
        const headerItems = Object.entries(p.headers).map(([k, v]) => `    '${k}: ${v}',`).join("\n");
        code += `  CURLOPT_HTTPHEADER => array(\n${headerItems}\n  ),\n`;
    }

    if (p.auth) {
        code += `  CURLOPT_USERPWD => '${p.auth.user}:${p.auth.pass}',\n`;
    }

    code += `));\n\n$response = curl_exec($curl);\ncurl_close($curl);\necho $response;\n`;
    return code;
}

type TargetLang = "fetch" | "axios" | "python" | "go" | "php";

export default function CurlConverterClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const defaultCurl = `curl -X POST https://api.example.com/v1/users \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer my_secret_token_123" \\\n  -d '{"name": "Xuan Truong", "email": "dev@anytools.online", "role": "Developer"}'`;

    const [curlInput, setCurlInput] = useState(defaultCurl);
    const [selectedLang, setSelectedLang] = useState<TargetLang>("fetch");

    // Sample curls
    const sampleCurls = [
        {
            titleEn: "POST JSON with Bearer Auth",
            titleVi: "POST JSON kèm Auth Bearer",
            cmd: `curl -X POST https://api.example.com/v1/users \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer secret_token_123" \\\n  -d '{"username": "anytools", "active": true}'`,
        },
        {
            titleEn: "GET with Query & Headers",
            titleVi: "GET có Query Params & Headers",
            cmd: `curl -X GET "https://api.github.com/repos/xuantruongg03/anytools" \\\n  -H "Accept: application/vnd.github.v3+json" \\\n  -H "User-Agent: AnyTools-App"`,
        },
        {
            titleEn: "PUT Update Form Data",
            titleVi: "PUT Cập nhật Form Data",
            cmd: `curl -X PUT https://httpbin.org/put \\\n  -H "Content-Type: application/x-www-form-urlencoded" \\\n  -d "status=active&priority=high"`,
        },
        {
            titleEn: "DELETE with Basic Auth",
            titleVi: "DELETE kèm Basic Auth",
            cmd: `curl -X DELETE https://api.example.com/v1/items/42 \\\n  -u "admin:secretpassword"`,
        },
    ];

    const { parsed, error } = useMemo(() => {
        return parseCurl(curlInput);
    }, [curlInput]);

    const generatedCode = useMemo(() => {
        if (!parsed) return "";
        switch (selectedLang) {
            case "fetch":
                return generateFetchCode(parsed);
            case "axios":
                return generateAxiosCode(parsed);
            case "python":
                return generatePythonCode(parsed);
            case "go":
                return generateGoCode(parsed);
            case "php":
                return generatePhpCode(parsed);
            default:
                return "";
        }
    }, [parsed, selectedLang]);

    const handleCopy = async () => {
        if (!generatedCode) return;
        try {
            await navigator.clipboard.writeText(generatedCode);
            toast.success(isVi ? "Đã sao chép mã code vào bộ nhớ tạm!" : "Copied code snippet to clipboard!");
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    return (
        <div className='max-w-6xl mx-auto space-y-6'>
            {/* Main Conversion Studio Card */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Left Pane: cURL Input */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-4'>
                    <div className='flex items-center justify-between'>
                        <label className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                            <span className='text-blue-600 dark:text-blue-400 font-mono'>$</span>
                            <span>{isVi ? "Câu Lệnh cURL Đầu Vào" : "cURL Command Input"}</span>
                        </label>
                        <button
                            type='button'
                            onClick={() => setCurlInput("")}
                            className='text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer'
                        >
                            {isVi ? "Xóa hết" : "Clear"}
                        </button>
                    </div>

                    <textarea
                        value={curlInput}
                        onChange={(e) => setCurlInput(e.target.value)}
                        placeholder='curl -X POST https://api.example.com ...'
                        rows={11}
                        className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y leading-relaxed'
                    />

                    {error && (
                        <div className='p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2'>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Quick Sample Selector */}
                    <div className='pt-2 border-t border-gray-100 dark:border-gray-700/60'>
                        <span className='text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2'>
                            💡 {isVi ? "Tải câu lệnh cURL mẫu:" : "Load sample cURL requests:"}
                        </span>
                        <div className='flex flex-wrap gap-2'>
                            {sampleCurls.map((s, idx) => (
                                <button
                                    key={idx}
                                    type='button'
                                    onClick={() => {
                                        setCurlInput(s.cmd);
                                        toast.info(isVi ? `Đã nạp: ${s.titleVi}` : `Loaded: ${s.titleEn}`);
                                    }}
                                    className='px-2.5 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700'
                                >
                                    {isVi ? s.titleVi : s.titleEn}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Pane: Generated Code Output */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-4'>
                    <div className='flex items-center justify-between'>
                        {/* Language Selector */}
                        <div className='flex flex-wrap gap-1.5'>
                            {[
                                { id: "fetch", label: "Fetch (JS)", icon: "🌐" },
                                { id: "axios", label: "Axios", icon: "⚡" },
                                { id: "python", label: "Python", icon: "🐍" },
                                { id: "go", label: "Go", icon: "🔷" },
                                { id: "php", label: "PHP", icon: "🐘" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type='button'
                                    onClick={() => setSelectedLang(tab.id as TargetLang)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                        selectedLang === tab.id
                                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <Button onClick={handleCopy} variant='secondary' size='sm'>
                            📋 {isVi ? "Sao chép" : "Copy"}
                        </Button>
                    </div>

                    {/* Code Display Area */}
                    <div className='flex-1 relative min-h-[300px]'>
                        <pre className='h-full p-4 bg-gray-900 text-gray-100 rounded-xl font-mono text-xs overflow-x-auto border border-gray-800 leading-relaxed max-h-[460px] overflow-y-auto'>
                            <code>
                                {generatedCode || (
                                    <span className='text-gray-500 italic'>
                                        {isVi
                                            ? "// Nhập hoặc dán câu lệnh cURL ở khung bên trái để sinh mã..."
                                            : "// Enter or paste a cURL command on the left to generate code..."}
                                    </span>
                                )}
                            </code>
                        </pre>
                    </div>

                    {/* Extracted Request Summary */}
                    {parsed && (
                        <div className='p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 text-xs space-y-1'>
                            <div className='flex items-center gap-2'>
                                <span className='font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-mono'>
                                    {parsed.method}
                                </span>
                                <span className='font-mono text-gray-700 dark:text-gray-300 truncate'>
                                    {parsed.url}
                                </span>
                            </div>
                            <div className='text-gray-500 flex gap-3 text-[11px] pt-1'>
                                <span>Headers: {Object.keys(parsed.headers).length}</span>
                                <span>Body: {parsed.body ? (parsed.isJson ? "JSON" : "Raw string") : "None"}</span>
                                {parsed.auth && <span>Auth: Basic</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
