"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { HTTP_REQUEST_PATTERN, HOST_HEADER_PATTERN, HTTP_HEADER_LINE_PATTERN, CURL_URL_PATTERN, CURL_URL_FALLBACK_PATTERN, CURL_METHOD_PATTERN, CURL_HEADER_PATTERN, CURL_DATA_PATTERN } from "@/constants/regex";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

interface Header {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

interface QueryParam {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
}

interface ApiResponse {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    time: number;
}

export default function ApiTesterClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.apiTester.client;

    const [method, setMethod] = useState<HttpMethod>("GET");
    const [url, setUrl] = useState("");
    const [headers, setHeaders] = useState<Header[]>([{ id: "1", key: "", value: "", enabled: true }]);
    const [queryParams, setQueryParams] = useState<QueryParam[]>([{ id: "1", key: "", value: "", enabled: true }]);
    const [body, setBody] = useState("");
    const [bodyType, setBodyType] = useState<"json" | "text" | "form">("json");
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"params" | "headers" | "body">("params");
    const [showCurl, setShowCurl] = useState(false);
    const [curlInput, setCurlInput] = useState("");
    const [showCurlImport, setShowCurlImport] = useState(false);

    const parseCurl = (input: string) => {
        try {
            const trimmedInput = input.trim();
            const httpRequestMatch = trimmedInput.match(HTTP_REQUEST_PATTERN);

            if (httpRequestMatch) {
                parseHttpRequest(trimmedInput, httpRequestMatch);
            } else {
                parseCurlCommand(trimmedInput);
            }

            setShowCurlImport(false);
            setCurlInput("");
            alert(locale === "vi" ? "Đã import thành công!" : "Imported successfully!");
        } catch (err: any) {
            alert((locale === "vi" ? "Lỗi parse: " : "Error parsing: ") + err.message);
        }
    };

    const parseHttpRequest = (input: string, match: RegExpMatchArray) => {
        const method = match[1].toUpperCase() as HttpMethod;
        const pathAndQuery = match[2];
        setMethod(method);

        const hostMatch = input.match(HOST_HEADER_PATTERN);
        if (!hostMatch) throw new Error("Cannot find Host header");

        const host = hostMatch[1].trim();
        const fullUrl = `https://${host}${pathAndQuery}`;

        extractQueryParamsFromUrl(fullUrl);

        const headerLines = input.split(/\r?\n/).slice(1);
        const extractedHeaders: Header[] = [];

        for (const line of headerLines) {
            if (line.trim() === "") break;
            const headerMatch = line.match(HTTP_HEADER_LINE_PATTERN);
            if (headerMatch && headerMatch[1].toLowerCase() !== "host") {
                extractedHeaders.push({
                    id: Date.now().toString() + Math.random(),
                    key: headerMatch[1].trim(),
                    value: headerMatch[2].trim(),
                    enabled: true,
                });
            }
        }

        if (extractedHeaders.length > 0) {
            setHeaders(extractedHeaders);
        }
    };

    const parseCurlCommand = (input: string) => {
        const cmd = input.replace(/\\\s*\n\s*/g, " ").replace(/\s+/g, " ");

        const urlMatch = cmd.match(CURL_URL_PATTERN) || cmd.match(CURL_URL_FALLBACK_PATTERN);
        if (!urlMatch) throw new Error("Cannot find URL in command");

        const extractedUrl = urlMatch[1];

        const methodMatch = cmd.match(CURL_METHOD_PATTERN);
        setMethod(methodMatch ? (methodMatch[1].toUpperCase() as HttpMethod) : "GET");

        const extractedHeaders: Header[] = [];
        let headerMatch;
        while ((headerMatch = CURL_HEADER_PATTERN.exec(cmd)) !== null) {
            extractedHeaders.push({
                id: Date.now().toString() + Math.random(),
                key: headerMatch[1].trim(),
                value: headerMatch[2].trim(),
                enabled: true,
            });
        }
        if (extractedHeaders.length > 0) {
            setHeaders(extractedHeaders);
        }

        const dataMatch = cmd.match(CURL_DATA_PATTERN);
        if (dataMatch) {
            const bodyData = dataMatch[1].replace(/\\'/g, "'");
            setBody(bodyData);
            try {
                JSON.parse(bodyData);
                setBodyType("json");
            } catch {
                setBodyType("text");
            }
        }

        extractQueryParamsFromUrl(extractedUrl);
    };

    const extractQueryParamsFromUrl = (urlString: string) => {
        try {
            const urlObj = new URL(urlString);
            const params: QueryParam[] = [];
            urlObj.searchParams.forEach((value, key) => {
                params.push({
                    id: Date.now().toString() + Math.random(),
                    key,
                    value,
                    enabled: true,
                });
            });
            if (params.length > 0) {
                setQueryParams(params);
            }
            setUrl(urlObj.origin + urlObj.pathname);
        } catch (e) {
            setUrl(urlString);
        }
    };

    const addPresetHeader = (type: "bearer" | "apikey" | "cookie" | "requestid" | "correlationid") => {
        const presets: Record<string, { key: string; value: string }> = {
            bearer: { key: "Authorization", value: "Bearer YOUR_TOKEN_HERE" },
            apikey: { key: "X-API-Key", value: "YOUR_API_KEY_HERE" },
            cookie: { key: "Cookie", value: "session=YOUR_SESSION_ID" },
            requestid: { key: "X-Request-ID", value: crypto.randomUUID() },
            correlationid: { key: "X-Correlation-ID", value: crypto.randomUUID() },
        };
        const preset = presets[type];
        setHeaders([...headers, { id: Date.now().toString(), key: preset.key, value: preset.value, enabled: true }]);
    };

    const generateCurl = () => {
        const finalUrl = buildUrl() || url;
        let curlCmd = `curl -X ${method} '${finalUrl}'`;

        // Add headers
        const enabledHeaders = headers.filter((h) => h.enabled && h.key);
        enabledHeaders.forEach((h) => {
            curlCmd += ` \\\n  -H '${h.key}: ${h.value}'`;
        });

        // Add body
        if (["POST", "PUT", "PATCH"].includes(method) && body) {
            if (bodyType === "json") {
                curlCmd += ` \\\n  -H 'Content-Type: application/json'`;
                curlCmd += ` \\\n  -d '${body.replace(/'/g, "'\\''")}'`;
            } else {
                curlCmd += ` \\\n  -d '${body.replace(/'/g, "'\\''")}'`;
            }
        }

        return curlCmd;
    };

    const copyCurl = async () => {
        try {
            await navigator.clipboard.writeText(generateCurl());
            alert(locale === "vi" ? "Đã sao chép lệnh cURL!" : "cURL command copied!");
        } catch (err) {
            alert(locale === "vi" ? "Không thể sao chép" : "Failed to copy");
        }
    };

    const addHeader = () => {
        setHeaders([...headers, { id: Date.now().toString(), key: "", value: "", enabled: true }]);
    };

    const removeHeader = (id: string) => {
        setHeaders(headers.filter((h) => h.id !== id));
    };

    const updateHeader = (id: string, field: keyof Header, value: string | boolean) => {
        setHeaders(headers.map((h) => (h.id === id ? { ...h, [field]: value } : h)));
    };

    const addQueryParam = () => {
        setQueryParams([...queryParams, { id: Date.now().toString(), key: "", value: "", enabled: true }]);
    };

    const removeQueryParam = (id: string) => {
        setQueryParams(queryParams.filter((p) => p.id !== id));
    };

    const updateQueryParam = (id: string, field: keyof QueryParam, value: string | boolean) => {
        setQueryParams(queryParams.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const buildUrl = () => {
        if (!url) return "";
        const enabledParams = queryParams.filter((p) => p.enabled && p.key);
        if (enabledParams.length === 0) return url;

        const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
        enabledParams.forEach((p) => {
            urlObj.searchParams.set(p.key, p.value);
        });
        return urlObj.toString();
    };

    const sendRequest = async () => {
        if (!url) {
            setError(t.enterUrl || "Please enter a URL");
            return;
        }

        setLoading(true);
        setError("");
        setResponse(null);

        const startTime = performance.now();

        try {
            const finalUrl = buildUrl();
            const enabledHeaders = headers.filter((h) => h.enabled && h.key);
            const headerObj: Record<string, string> = {};
            enabledHeaders.forEach((h) => {
                headerObj[h.key] = h.value;
            });

            const options: RequestInit = {
                method,
                headers: headerObj,
            };

            if (["POST", "PUT", "PATCH"].includes(method) && body) {
                if (bodyType === "json") {
                    options.headers = { ...options.headers, "Content-Type": "application/json" };
                    options.body = body;
                } else {
                    options.body = body;
                }
            }

            const res = await fetch(finalUrl, options);
            const endTime = performance.now();

            const responseHeaders: Record<string, string> = {};
            res.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            let data;
            const contentType = res.headers.get("content-type");

            try {
                if (contentType?.includes("application/json")) {
                    data = await res.json();
                } else {
                    data = await res.text();
                }
            } catch (parseError) {
                // If parsing fails, try to get raw text
                data = await res.text();
            }

            setResponse({
                status: res.status,
                statusText: res.statusText,
                headers: responseHeaders,
                data,
                time: Math.round(endTime - startTime),
            });

            // Show error message for failed requests (4xx, 5xx)
            if (!res.ok) {
                const errorMsg = locale === "vi" ? `Yêu cầu thất bại với status ${res.status} ${res.statusText}` : `Request failed with status ${res.status} ${res.statusText}`;
                setError(errorMsg);
            }
        } catch (err: any) {
            const endTime = performance.now();

            // Detailed error information
            let errorMessage = "";

            if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
                errorMessage = locale === "vi" ? "❌ Lỗi kết nối: Không thể kết nối đến server. Kiểm tra URL, CORS policy, hoặc kết nối mạng." : "❌ Network Error: Failed to connect to server. Check URL, CORS policy, or network connection.";
            } else if (err.name === "AbortError") {
                errorMessage = locale === "vi" ? "⏱️ Lỗi timeout: Request bị hủy do timeout." : "⏱️ Timeout Error: Request was aborted.";
            } else if (err.name === "SyntaxError") {
                errorMessage = locale === "vi" ? `📝 Lỗi cú pháp: ${err.message}. Kiểm tra định dạng request body.` : `📝 Syntax Error: ${err.message}. Check request body format.`;
            } else {
                errorMessage = locale === "vi" ? `⚠️ Lỗi: ${err.name || "Unknown"} - ${err.message || "Có lỗi xảy ra"}` : `⚠️ Error: ${err.name || "Unknown"} - ${err.message || "An error occurred"}`;
            }

            setError(errorMessage);

            // Set a basic error response for display
            setResponse({
                status: 0,
                statusText: err.name || "Error",
                headers: {},
                data: {
                    error: err.message,
                    type: err.name,
                    details: err.stack || "No stack trace available",
                },
                time: Math.round(endTime - startTime),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8'>
            <div className='text-center mb-6'>
                <h1 className='text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.title}</h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>{t.subtitle}</p>
            </div>

            {/* Method and URL */}
            <div className='mb-6'>
                <div className='flex gap-2 flex-col sm:flex-row'>
                    <select value={method} onChange={(e) => setMethod(e.target.value as HttpMethod)} className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:w-32'>
                        <option value='GET'>GET</option>
                        <option value='POST'>POST</option>
                        <option value='PUT'>PUT</option>
                        <option value='DELETE'>DELETE</option>
                        <option value='PATCH'>PATCH</option>
                        <option value='HEAD'>HEAD</option>
                        <option value='OPTIONS'>OPTIONS</option>
                    </select>
                    <input type='text' value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t.urlPlaceholder || "https://api.example.com/endpoint"} className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                    <button onClick={sendRequest} disabled={loading} className='px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2'>
                        {loading && (
                            <svg className='animate-spin h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                            </svg>
                        )}
                        {loading ? t.sending || "Sending..." : t.send || "Send"}
                    </button>
                </div>

                {/* cURL Buttons */}
                <div className='mt-2 flex gap-2 flex-wrap'>
                    <button onClick={() => setShowCurlImport(!showCurlImport)} className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer'>
                        📥 {locale === "vi" ? "Import cURL" : "Import cURL"}
                    </button>
                    <button onClick={() => setShowCurl(!showCurl)} className='px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-semibold transition-colors cursor-pointer'>
                        {showCurl ? "🔽" : "▶️"} {locale === "vi" ? "Xem cURL" : "View cURL"}
                    </button>
                    {showCurl && (
                        <button onClick={copyCurl} className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer'>
                            📋 {locale === "vi" ? "Sao chép cURL" : "Copy cURL"}
                        </button>
                    )}
                </div>

                {/* cURL Import */}
                {showCurlImport && (
                    <div className='mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800'>
                        <h3 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2'>{locale === "vi" ? "Dán cURL hoặc HTTP Request:" : "Paste cURL or HTTP Request:"}</h3>
                        <textarea value={curlInput} onChange={(e) => setCurlInput(e.target.value)} placeholder={`curl -X POST "https://api.example.com" -H "Authorization: Bearer token"\n\nOR\n\nGET /api/endpoint HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer token`} rows={8} className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm mb-2' />
                        <div className='flex gap-2'>
                            <button onClick={() => parseCurl(curlInput)} disabled={!curlInput.trim()} className='px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer'>
                                {locale === "vi" ? "Parse & Load" : "Parse & Load"}
                            </button>
                            <button
                                onClick={() => {
                                    setShowCurlImport(false);
                                    setCurlInput("");
                                }}
                                className='px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-semibold transition-colors cursor-pointer'
                            >
                                {locale === "vi" ? "Hủy" : "Cancel"}
                            </button>
                        </div>
                    </div>
                )}

                {/* cURL Display */}
                {showCurl && (
                    <div className='mt-2 bg-gray-900 dark:bg-black rounded-lg p-4'>
                        <pre className='text-sm text-green-400 overflow-x-auto'>{generateCurl()}</pre>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className='mb-4 border-b border-gray-200 dark:border-gray-700'>
                <div className='flex gap-4'>
                    <button onClick={() => setActiveTab("params")} className={`px-4 py-2 font-semibold transition-colors cursor-pointer ${activeTab === "params" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}>
                        {t.params || "Params"}
                    </button>
                    <button onClick={() => setActiveTab("headers")} className={`px-4 py-2 font-semibold transition-colors cursor-pointer ${activeTab === "headers" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}>
                        {t.headers || "Headers"}
                    </button>
                    <button onClick={() => setActiveTab("body")} className={`px-4 py-2 font-semibold transition-colors cursor-pointer ${activeTab === "body" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}>
                        {t.body || "Body"}
                    </button>
                </div>
            </div>

            {/* Query Params Tab */}
            {activeTab === "params" && (
                <div className='mb-6'>
                    <div className='space-y-2'>
                        {queryParams.map((param) => (
                            <div key={param.id} className='flex gap-2 items-center'>
                                <input type='checkbox' checked={param.enabled} onChange={(e) => updateQueryParam(param.id, "enabled", e.target.checked)} className='w-4 h-4' />
                                <input type='text' value={param.key} onChange={(e) => updateQueryParam(param.id, "key", e.target.value)} placeholder='Key' className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100' />
                                <input type='text' value={param.value} onChange={(e) => updateQueryParam(param.id, "value", e.target.value)} placeholder='Value' className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100' />
                                <button onClick={() => removeQueryParam(param.id)} className='px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer'>
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={addQueryParam} className='mt-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'>
                        + {t.addParam || "Add Parameter"}
                    </button>
                </div>
            )}

            {/* Headers Tab */}
            {activeTab === "headers" && (
                <div className='mb-6'>
                    {/* Quick Add Buttons */}
                    <div className='mb-4 flex flex-wrap gap-2'>
                        <button onClick={() => addPresetHeader("bearer")} className='px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer'>
                            + Bearer Token
                        </button>
                        <button onClick={() => addPresetHeader("apikey")} className='px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer'>
                            + API Key
                        </button>
                        <button onClick={() => addPresetHeader("cookie")} className='px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors cursor-pointer'>
                            + Cookie
                        </button>
                        <button onClick={() => addPresetHeader("requestid")} className='px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer'>
                            + Request ID
                        </button>
                        <button onClick={() => addPresetHeader("correlationid")} className='px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-sm hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors cursor-pointer'>
                            + Correlation ID
                        </button>
                    </div>

                    <div className='space-y-2'>
                        {headers.map((header) => (
                            <div key={header.id} className='flex gap-2 items-center'>
                                <input type='checkbox' checked={header.enabled} onChange={(e) => updateHeader(header.id, "enabled", e.target.checked)} className='w-4 h-4' />
                                <input type='text' value={header.key} onChange={(e) => updateHeader(header.id, "key", e.target.value)} placeholder='Header Name' className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100' />
                                <input type='text' value={header.value} onChange={(e) => updateHeader(header.id, "value", e.target.value)} placeholder='Header Value' className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100' />
                                <button onClick={() => removeHeader(header.id)} className='px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer'>
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={addHeader} className='mt-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'>
                        + {t.addHeader || "Add Header"}
                    </button>
                </div>
            )}

            {/* Body Tab */}
            {activeTab === "body" && (
                <div className='mb-6'>
                    <div className='mb-2'>
                        <select value={bodyType} onChange={(e) => setBodyType(e.target.value as any)} className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'>
                            <option value='json'>JSON</option>
                            <option value='text'>Text</option>
                            <option value='form'>Form Data</option>
                        </select>
                    </div>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={bodyType === "json" ? '{\n  "key": "value"\n}' : "Request body"} rows={10} className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm' />
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                    <p className='text-red-600 dark:text-red-400'>{error}</p>
                </div>
            )}

            {/* Response */}
            {response && (
                <div className='mt-6 border-t border-gray-200 dark:border-gray-700 pt-6'>
                    <h3 className='text-xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{t.response || "Response"}</h3>

                    {/* Status */}
                    <div className='mb-4 flex gap-4 items-center'>
                        <span className={`px-3 py-1 rounded-lg font-semibold ${response.status >= 200 && response.status < 300 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : response.status >= 400 ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"}`}>
                            {response.status} {response.statusText}
                        </span>
                        <span className='text-gray-600 dark:text-gray-400'>⏱️ {response.time}ms</span>
                    </div>

                    {/* Response Headers */}
                    <div className='mb-4'>
                        <h4 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.responseHeaders || "Response Headers"}</h4>
                        <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-40 overflow-y-auto'>
                            <pre className='text-sm text-gray-700 dark:text-gray-300'>{JSON.stringify(response.headers, null, 2)}</pre>
                        </div>
                    </div>

                    {/* Response Body */}
                    <div>
                        <h4 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{t.responseBody || "Response Body"}</h4>
                        <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto'>
                            <pre className='text-sm text-gray-700 dark:text-gray-300'>{typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
