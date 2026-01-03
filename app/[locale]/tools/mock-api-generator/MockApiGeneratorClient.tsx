"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import { getPersistentOwnerId } from "@/lib/utils/persistent-id";
import { MOCK_API_STORAGE_KEY, HTTP_METHODS, STATUS_CODES, METHOD_COLORS, PLACEHOLDER_MAPPINGS, EXAMPLE_TEMPLATES, DEFAULT_FORM_VALUES, API_ENDPOINTS, type HttpMethod, type AuthType } from "@/constants/mock-api";
import Input from "@/components/ui/input";
import Select from "@/components/ui/Select";

// Types for API response
interface SharedMocksResponse {
    success: boolean;
    data: {
        items: MockApi[];
        pagination: {
            page: number;
            pageSize: number;
            totalItems: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    };
}

interface MockHeader {
    id: string;
    key: string;
    value: string;
}

interface MockApi {
    id: string;
    name: string;
    description: string;
    endpoint: string;
    method: HttpMethod;
    responseBody: string;
    statusCode: number;
    delay: number;
    headers: Record<string, string>;
    isShared: boolean;
    authType: AuthType;
    authValue: string;
    rateLimit: number;
    requestCount: number;
    lastUsed: number;
    createdAt: number;
    ownerId?: string;
    isSample?: boolean; // Mark if this is a sample API
}

interface TestResponse {
    status: number;
    statusText: string;
    data: any;
    time: number;
    headers: Record<string, string>;
}

export default function MockApiGeneratorClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.mockApiGenerator.client;

    // Form state - use default values from constants
    const [name, setName] = useState<string>(DEFAULT_FORM_VALUES.name);
    const [description, setDescription] = useState<string>(DEFAULT_FORM_VALUES.description);
    const [endpoint, setEndpoint] = useState<string>(DEFAULT_FORM_VALUES.endpoint);
    const [method, setMethod] = useState<HttpMethod>(DEFAULT_FORM_VALUES.method);
    const [responseBody, setResponseBody] = useState<string>(DEFAULT_FORM_VALUES.responseBody);
    const [statusCode, setStatusCode] = useState<number>(DEFAULT_FORM_VALUES.statusCode);
    const [delay, setDelay] = useState<number>(DEFAULT_FORM_VALUES.delay);
    const [headers, setHeaders] = useState<MockHeader[]>([...DEFAULT_FORM_VALUES.headers]);
    const [authType, setAuthType] = useState<AuthType>(DEFAULT_FORM_VALUES.authType);
    const [authValue, setAuthValue] = useState<string>(DEFAULT_FORM_VALUES.authValue);
    const [rateLimit, setRateLimit] = useState<number>(DEFAULT_FORM_VALUES.rateLimit);
    const [isShared, setIsShared] = useState<boolean>(DEFAULT_FORM_VALUES.isShared);

    // UI state
    const [mockApis, setMockApis] = useState<MockApi[]>([]);
    const [loading, setLoading] = useState(false);
    const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
    const [testingMockId, setTestingMockId] = useState<string | null>(null); // Track which mock is being tested
    const [activeTab, setActiveTab] = useState<"create" | "myMocks" | "shared">("create");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedCurlId, setCopiedCurlId] = useState<string | null>(null);
    const [ownerId, setOwnerId] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMethod, setFilterMethod] = useState<HttpMethod | "ALL">("ALL");
    const [isInitialized, setIsInitialized] = useState(false);
    const [sharedPage, setSharedPage] = useState(1); // Pagination for shared mocks

    // Initialize persistent owner ID (survives browser history clear)
    useEffect(() => {
        const initOwnerId = async () => {
            const id = await getPersistentOwnerId();
            setOwnerId(id);
            setIsInitialized(true);
        };
        initOwnerId();
    }, []);

    // Load mock APIs from localStorage only (cloud sync disabled)
    useEffect(() => {
        if (!isInitialized) return;

        try {
            const saved = localStorage.getItem(MOCK_API_STORAGE_KEY);
            if (saved) {
                const loadedApis = JSON.parse(saved);
                setMockApis(loadedApis);
            }
        } catch {
            console.error("Failed to load mock APIs from localStorage");
        }
    }, [isInitialized]);

    // Query client for cache invalidation
    const queryClient = useQueryClient();

    // Fetch shared mock APIs with React Query and pagination
    const {
        data: sharedMocksData,
        isLoading: isLoadingShared,
        isFetching: isFetchingShared,
    } = useQuery<SharedMocksResponse>({
        queryKey: ["sharedMocks", sharedPage, activeTab === "shared" ? searchQuery : "", activeTab === "shared" ? filterMethod : "ALL"],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: sharedPage.toString(),
                search: searchQuery,
                method: filterMethod,
            });
            const response = await fetch(`/api/mock-shared?${params}`);
            if (!response.ok) {
                throw new Error("Failed to fetch shared mocks");
            }
            return response.json();
        },
        enabled: activeTab === "shared", // Only fetch when on shared tab
        staleTime: 30000, // Cache for 30 seconds
        placeholderData: (previousData) => previousData, // Keep previous data while fetching
    });

    // Reset page when search or filter changes
    useEffect(() => {
        setSharedPage(1);
    }, [searchQuery, filterMethod]);

    // Pagination helpers
    const sharedMocksPagination = sharedMocksData?.data?.pagination;
    const sharedMocks = sharedMocksData?.data?.items || [];

    // Save to localStorage - useCallback for stable reference
    const saveToStorage = useCallback(
        (apis: MockApi[]) => {
            try {
                localStorage.setItem(MOCK_API_STORAGE_KEY, JSON.stringify(apis));
                setMockApis(apis);
            } catch {
                alert(locale === "vi" ? "Không thể lưu mock API" : "Failed to save mock API");
            }
        },
        [locale]
    );

    // Process {{xN}} syntax in JSON keys to multiply arrays - useMemo for pure function
    const processObjectMultiply = useCallback((obj: any): any => {
        if (typeof obj !== "object" || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map((item) => processObjectMultiply(item));

        const result: any = {};
        for (const key in obj) {
            const value = obj[key];
            const match = key.match(/^(.+)\{\{x(\d+)\}\}$/);
            if (match && Array.isArray(value) && value.length > 0) {
                const cleanKey = match[1];
                const count = parseInt(match[2], 10);
                const template = value[0];
                const multiplied = Array.from({ length: count }, () => processObjectMultiply(JSON.parse(JSON.stringify(template))));
                result[cleanKey] = multiplied;
            } else {
                result[key] = processObjectMultiply(value);
            }
        }
        return result;
    }, []);

    // Process multiply syntax to response body
    const processMultiplySyntax = useCallback(
        (jsonStr: string): string => {
            try {
                const obj = JSON.parse(jsonStr);
                const processed = processObjectMultiply(obj);
                return JSON.stringify(processed, null, 2);
            } catch {
                return jsonStr;
            }
        },
        [processObjectMultiply]
    );

    // Memoized processed response body
    const processedResponseBody = useMemo(() => processMultiplySyntax(responseBody), [responseBody, processMultiplySyntax]);

    // Memoized preview body with placeholders replaced
    const previewBody = useMemo(() => {
        let preview = responseBody;
        for (const [placeholder, getValue] of Object.entries(PLACEHOLDER_MAPPINGS)) {
            preview = preview.split(placeholder).join(getValue());
        }
        return preview;
    }, [responseBody]);

    // Get method color - useCallback for stable reference
    const getMethodColor = useCallback((m: HttpMethod) => METHOD_COLORS[m], []);

    // Filter mocks - useMemo for computed values
    const filteredMocks = useMemo(() => {
        return mockApis.filter((mock) => {
            const matchesSearch = mock.name.toLowerCase().includes(searchQuery.toLowerCase()) || mock.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesMethod = filterMethod === "ALL" || mock.method === filterMethod;
            return matchesSearch && matchesMethod;
        });
    }, [mockApis, searchQuery, filterMethod]);

    // Note: Shared mocks filtering is now done server-side via React Query

    // Reset form - useCallback for stable reference
    const resetForm = useCallback(() => {
        setName(DEFAULT_FORM_VALUES.name);
        setDescription(DEFAULT_FORM_VALUES.description);
        setEndpoint(DEFAULT_FORM_VALUES.endpoint);
        setMethod(DEFAULT_FORM_VALUES.method);
        setResponseBody(DEFAULT_FORM_VALUES.responseBody);
        setStatusCode(DEFAULT_FORM_VALUES.statusCode);
        setDelay(DEFAULT_FORM_VALUES.delay);
        setHeaders([...DEFAULT_FORM_VALUES.headers]);
        setAuthType(DEFAULT_FORM_VALUES.authType);
        setAuthValue(DEFAULT_FORM_VALUES.authValue);
        setRateLimit(DEFAULT_FORM_VALUES.rateLimit);
        setIsShared(DEFAULT_FORM_VALUES.isShared);
        setEditingId(null);
    }, []);

    // Create or update mock API - useCallback for stable reference
    const handleSubmit = useCallback(async () => {
        if (!name.trim()) {
            alert(t.enterName);
            return;
        }
        if (!endpoint.trim()) {
            alert(t.enterEndpoint);
            return;
        }

        try {
            JSON.parse(responseBody);
        } catch {
            alert(t.invalidJson);
            return;
        }

        setLoading(true);

        try {
            const headersObj: Record<string, string> = {};
            headers.forEach((h) => {
                if (h.key.trim()) {
                    headersObj[h.key.trim()] = h.value.trim();
                }
            });

            const mockData: Partial<MockApi> = {
                name: name.trim(),
                description: description.trim(),
                endpoint: endpoint.startsWith("/") ? endpoint : `/${endpoint}`,
                method,
                responseBody: processedResponseBody,
                statusCode,
                delay,
                headers: headersObj,
                isShared,
                authType,
                authValue,
                rateLimit,
            };

            if (editingId) {
                const updated = mockApis.map((m) => (m.id === editingId ? { ...m, ...mockData } : m));
                saveToStorage(updated);

                try {
                    await fetch(API_ENDPOINTS.MOCK_API, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...mockData, id: editingId, ownerId }),
                    });
                } catch (e) {
                    console.warn("Failed to sync to server:", e);
                }

                alert(t.updated);
                setEditingId(null);
            } else {
                const newId = crypto.randomUUID();
                const newMock: MockApi = {
                    ...(mockData as MockApi),
                    id: newId,
                    requestCount: 0,
                    lastUsed: Date.now(),
                    createdAt: Date.now(),
                    ownerId,
                };
                saveToStorage([newMock, ...mockApis]);

                try {
                    await fetch(API_ENDPOINTS.MOCK_API, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...mockData, id: newId, ownerId }),
                    });
                } catch (e) {
                    console.warn("Failed to sync to server:", e);
                }

                alert(t.created);
            }

            resetForm();
            setActiveTab("myMocks");
        } catch (error) {
            console.error("Failed to create mock API:", error);
            alert(locale === "vi" ? "Không thể tạo mock API" : "Failed to create mock API");
        } finally {
            setLoading(false);
        }
    }, [name, endpoint, responseBody, t, headers, description, method, processedResponseBody, statusCode, delay, isShared, authType, authValue, rateLimit, editingId, mockApis, saveToStorage, ownerId, resetForm, locale]);

    // Edit mock API - useCallback for stable reference
    const handleEdit = useCallback((mock: MockApi) => {
        setName(mock.name);
        setDescription(mock.description);
        setEndpoint(mock.endpoint);
        setMethod(mock.method);
        setResponseBody(mock.responseBody);
        setStatusCode(mock.statusCode);
        setDelay(mock.delay);
        setHeaders(
            Object.entries(mock.headers).map(([key, value], idx) => ({
                id: String(idx),
                key,
                value,
            }))
        );
        setAuthType(mock.authType);
        setAuthValue(mock.authValue);
        setRateLimit(mock.rateLimit);
        setIsShared(mock.isShared);
        setEditingId(mock.id);
        setActiveTab("create");
    }, []);

    // Delete mock API - useCallback for stable reference
    const handleDelete = useCallback(
        async (id: string) => {
            if (confirm(locale === "vi" ? "Xóa mock API này?" : "Delete this mock API?")) {
                saveToStorage(mockApis.filter((m) => m.id !== id));

                try {
                    await fetch(API_ENDPOINTS.MOCK_SYNC, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "delete", id }),
                    });
                } catch (e) {
                    console.warn("Failed to delete from cloud:", e);
                }

                alert(t.deleted);
            }
        },
        [locale, mockApis, saveToStorage, t.deleted]
    );

    // Copy API URL - useCallback for stable reference
    const handleCopy = useCallback(async (id: string) => {
        const url = `${window.location.origin}${API_ENDPOINTS.MOCK}/${id}`;
        await navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    }, []);

    // Copy cURL command to clipboard - useCallback for stable reference
    const handleCopyCurl = useCallback(async (mock: MockApi) => {
        const url = `${window.location.origin}${API_ENDPOINTS.MOCK}/${mock.id}`;
        const curlParts = [`curl -X ${mock.method}`];

        // Add authorization headers
        if (mock.authType === "bearer" && mock.authValue) {
            curlParts.push(`-H "Authorization: Bearer ${mock.authValue}"`);
        } else if (mock.authType === "apiKey" && mock.authValue) {
            curlParts.push(`-H "X-API-Key: ${mock.authValue}"`);
        }

        // Add custom headers
        Object.entries(mock.headers).forEach(([key, value]) => {
            if (key && value) {
                curlParts.push(`-H "${key}: ${value}"`);
            }
        });

        curlParts.push(`"${url}"`);

        const curlCommand = curlParts.join(" \\\n  ");
        await navigator.clipboard.writeText(curlCommand);
        setCopiedCurlId(mock.id);
        setTimeout(() => setCopiedCurlId(null), 2000);
    }, []);

    // Toggle share - useCallback for stable reference
    const handleToggleShare = useCallback(
        async (id: string) => {
            const mock = mockApis.find((m) => m.id === id);
            if (!mock) return;

            const newIsShared = !mock.isShared;

            // Update local state immediately for responsive UI
            const updated = mockApis.map((m) => (m.id === id ? { ...m, isShared: newIsShared } : m));
            saveToStorage(updated);

            // Sync with database
            try {
                const response = await fetch(`/api/mock-api/${id}/share`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isShared: newIsShared }),
                });

                if (response.status === 404) {
                    // Mock doesn't exist in DB, create it first
                    const headersObj: Record<string, string> = mock.headers || {};
                    await fetch(API_ENDPOINTS.MOCK_API, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: mock.id,
                            name: mock.name,
                            description: mock.description,
                            endpoint: mock.endpoint,
                            method: mock.method,
                            responseBody: mock.responseBody,
                            statusCode: mock.statusCode,
                            delay: mock.delay,
                            headers: headersObj,
                            isShared: newIsShared,
                            authType: mock.authType,
                            authValue: mock.authValue,
                            rateLimit: mock.rateLimit,
                            ownerId: mock.ownerId || ownerId,
                        }),
                    });
                }

                // Invalidate shared mocks cache to refresh the list
                queryClient.invalidateQueries({ queryKey: ["sharedMocks"] });
            } catch (error) {
                console.warn("Failed to sync share status:", error);
            }
        },
        [mockApis, saveToStorage, queryClient, ownerId]
    );

    // Test API - useCallback for stable reference
    const handleTest = useCallback(async (mock: MockApi) => {
        setTestingMockId(mock.id);
        setTestResponse(null);

        const startTime = Date.now();
        try {
            const url = `${window.location.origin}${API_ENDPOINTS.MOCK}/${mock.id}`;
            const reqHeaders: HeadersInit = {};

            if (mock.authType === "bearer" && mock.authValue) {
                reqHeaders["Authorization"] = `Bearer ${mock.authValue}`;
            } else if (mock.authType === "apiKey" && mock.authValue) {
                reqHeaders["X-API-Key"] = mock.authValue;
            }

            const response = await fetch(url, {
                method: mock.method,
                headers: reqHeaders,
            });

            const responseHeaders: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            const data = await response.json();
            const time = Date.now() - startTime;

            setTestResponse({
                status: response.status,
                statusText: response.statusText,
                data,
                time,
                headers: responseHeaders,
            });
        } catch (error: any) {
            setTestResponse({
                status: 0,
                statusText: "Error",
                data: { error: error.message },
                time: Date.now() - startTime,
                headers: {},
            });
        } finally {
            setTestingMockId(null);
        }
    }, []);

    // Load example template - useCallback for stable reference
    const loadExample = useCallback((key: keyof typeof EXAMPLE_TEMPLATES) => {
        const template = EXAMPLE_TEMPLATES[key];
        setName(template.name);
        setEndpoint(template.endpoint);
        setMethod(template.method);
        setResponseBody(template.responseBody);
        setStatusCode(template.statusCode);
    }, []);

    // Add header - useCallback for stable reference
    const addHeader = useCallback(() => {
        setHeaders((prev) => [...prev, { id: crypto.randomUUID(), key: "", value: "" }]);
    }, []);

    // Remove header - useCallback for stable reference
    const removeHeader = useCallback((id: string) => {
        setHeaders((prev) => (prev.length > 1 ? prev.filter((h) => h.id !== id) : prev));
    }, []);

    // Update header - useCallback for stable reference
    const updateHeader = useCallback((idx: number, field: "key" | "value", value: string) => {
        setHeaders((prev) => {
            const updated = [...prev];
            updated[idx][field] = value;
            return updated;
        });
    }, []);

    // Format JSON - useCallback for stable reference
    const formatJson = useCallback(() => {
        try {
            const formatted = JSON.stringify(JSON.parse(responseBody), null, 2);
            setResponseBody(formatted);
        } catch {
            // Invalid JSON, ignore
        }
    }, [responseBody]);

    // JSON validation result - useMemo for computed value
    const jsonValidation = useMemo(() => {
        try {
            JSON.parse(responseBody);
            return { valid: true, error: null };
        } catch (err: any) {
            return { valid: false, error: err.message?.split(" at ")[0] || "Syntax error" };
        }
    }, [responseBody]);

    // JSON editor keydown handler - useCallback for stable reference
    const handleTextareaKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            const target = e.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            const value = responseBody;

            if (e.key === "Tab") {
                e.preventDefault();
                const newValue = value.substring(0, start) + "  " + value.substring(end);
                setResponseBody(newValue);
                setTimeout(() => {
                    target.selectionStart = target.selectionEnd = start + 2;
                }, 0);
                return;
            }

            if (e.key === "Enter") {
                e.preventDefault();
                const lineStart = value.lastIndexOf("\n", start - 1) + 1;
                const currentLine = value.substring(lineStart, start);
                const indentMatch = currentLine.match(/^(\s*)/);
                const currentIndent = indentMatch ? indentMatch[1] : "";
                const charBefore = value[start - 1];
                const charAfter = value[start];
                const needExtraIndent = charBefore === "{" || charBefore === "[";
                const needClosingLine = (charBefore === "{" && charAfter === "}") || (charBefore === "[" && charAfter === "]");

                let insertion = "\n" + currentIndent;
                if (needExtraIndent) {
                    insertion += "  ";
                }
                if (needClosingLine) {
                    insertion += "\n" + currentIndent;
                }

                const newValue = value.substring(0, start) + insertion + value.substring(end);
                setResponseBody(newValue);

                const newCursorPos = start + 1 + currentIndent.length + (needExtraIndent ? 2 : 0);
                setTimeout(() => {
                    target.selectionStart = target.selectionEnd = newCursorPos;
                }, 0);
                return;
            }
        },
        [responseBody]
    );

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8'>
            {/* Tabs */}
            <div className='flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700'>
                <button onClick={() => setActiveTab("create")} className={`px-4 py-2 font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === "create" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                    {editingId ? t.update : t.createNew}
                </button>
                <button onClick={() => setActiveTab("myMocks")} className={`px-4 py-2 font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === "myMocks" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                    {t.myMocks} ({mockApis.length})
                </button>
                <button onClick={() => setActiveTab("shared")} className={`px-4 py-2 font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === "shared" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                    {t.sharedMocks}
                </button>
            </div>

            {/* Create/Edit Form */}
            {activeTab === "create" && (
                <div className='space-y-6'>
                    {/* Examples */}
                    <div className='flex flex-wrap gap-2 items-center'>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>{t.examples}:</span>
                        <button onClick={() => loadExample("users")} className='text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                            👤 {t.userExample}
                        </button>
                        <button onClick={() => loadExample("products")} className='text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                            📦 {t.productExample}
                        </button>
                        <button onClick={() => loadExample("error")} className='text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                            ❌ {t.errorExample}
                        </button>
                    </div>

                    {/* Name & Description */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.mockName} *</label>
                            <Input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='My API' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.mockDescription}</label>
                            <Input type='text' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Optional description' />
                        </div>
                    </div>

                    {/* Method & Endpoint */}
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='w-full md:w-32'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.method}</label>
                            <Select value={method} onChange={(e) => setMethod(e.target.value as HttpMethod)}>
                                {HTTP_METHODS.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className='flex-1'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.endpoint} *</label>
                            <Input type='text' value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder='/api/users' className='font-mono' />
                        </div>
                    </div>

                    {/* Status Code & Delay */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.statusCode}</label>
                            <Select value={statusCode} onChange={(e) => setStatusCode(Number(e.target.value))}>
                                {STATUS_CODES.map((sc) => (
                                    <option key={sc.code} value={sc.code}>
                                        {sc.label}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.delay}</label>
                            <Input type='number' value={delay} onChange={(e) => setDelay(Math.max(0, Math.min(30000, Number(e.target.value))))} min={0} max={30000} />
                        </div>
                    </div>

                    {/* Response Body */}
                    <div>
                        <div className='flex justify-between items-center mb-1'>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>{t.responseBody} (JSON)</label>
                            <div className='flex items-center gap-2'>
                                <button onClick={formatJson} className='text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500' title={t.formatJson || "Format JSON"}>
                                    ✨ {t.formatJson || "Format"}
                                </button>
                                <span className='text-xs text-gray-500 dark:text-gray-400'>{t.editorTip || "Tab, Enter = indent"}</span>
                            </div>
                        </div>
                        <div className='relative'>
                            <textarea
                                value={responseBody}
                                onChange={(e) => setResponseBody(e.target.value)}
                                onKeyDown={handleTextareaKeyDown}
                                rows={10}
                                className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm placeholder-gray-500 dark:placeholder-gray-400 ${jsonValidation.valid ? "border-gray-300 dark:border-gray-600" : "border-red-400 dark:border-red-500"}`}
                                placeholder='{"message": "Hello World!"}'
                            />
                            {!jsonValidation.valid && (
                                <div className='absolute bottom-2 left-2 right-2 px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs rounded'>
                                    ⚠️ {t.jsonError || "Invalid JSON"}: {jsonValidation.error}
                                </div>
                            )}
                        </div>
                        {/* Syntax Help */}
                        <div className='mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs text-gray-600 dark:text-gray-400'>
                            <p className='font-medium mb-2'>💡 {t.syntaxHelp || "Syntax Help"}:</p>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {/* Placeholders */}
                                <div>
                                    <p className='font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.placeholders || "Placeholders"}:</p>
                                    <ul className='space-y-1 ml-2'>
                                        <li>
                                            <code className='bg-gray-200 dark:bg-gray-600 px-1 rounded'>{"{{uuid}}"}</code> - UUID
                                        </li>
                                        <li>
                                            <code className='bg-gray-200 dark:bg-gray-600 px-1 rounded'>{"{{faker.name}}"}</code> - {t.fakeName || "Random name"}
                                        </li>
                                        <li>
                                            <code className='bg-gray-200 dark:bg-gray-600 px-1 rounded'>{"{{faker.email}}"}</code> - {t.fakeEmail || "Random email"}
                                        </li>
                                        <li>
                                            <code className='bg-gray-200 dark:bg-gray-600 px-1 rounded'>{"{{datetime}}"}</code> - ISO datetime
                                        </li>
                                        <li>
                                            <code className='bg-gray-200 dark:bg-gray-600 px-1 rounded'>{"{{random.number}}"}</code> - {t.randomNumber || "Random number"}
                                        </li>
                                    </ul>
                                </div>
                                {/* Multiply Example */}
                                <div>
                                    <p className='font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.multiplyExample || "Multiply Array"}:</p>
                                    <div className='bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600'>
                                        <p className='text-[10px] text-gray-500 mb-1'>{t.input || "Input"}:</p>
                                        <pre className='text-[10px] text-purple-600 dark:text-purple-400 mb-2'>{`{
  "users{{x3}}": [
    { "id": "{{uuid}}" }
  ]
}`}</pre>
                                        <p className='text-[10px] text-gray-500 mb-1'>{t.output || "Output"}:</p>
                                        <pre className='text-[10px] text-green-600 dark:text-green-400'>{`{
  "users": [
    { "id": "a1b2..." },
    { "id": "c3d4..." },
    { "id": "e5f6..." }
  ]
}`}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.preview}</label>
                        <pre className='bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200 max-h-64'>{processedResponseBody}</pre>
                    </div>

                    {/* Headers */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{t.headers}</label>
                        <div className='space-y-2'>
                            {headers.map((header, idx) => (
                                <div key={header.id} className='flex gap-2'>
                                    <Input type='text' value={header.key} onChange={(e) => updateHeader(idx, "key", e.target.value)} placeholder='Header name' className='flex-1 text-sm' />
                                    <Input type='text' value={header.value} onChange={(e) => updateHeader(idx, "value", e.target.value)} placeholder='Header value' className='flex-1 text-sm' />
                                    <button onClick={() => removeHeader(header.id)} className='px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button onClick={addHeader} className='mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'>
                            + {t.addHeader}
                        </button>
                    </div>

                    {/* Advanced Options */}
                    <div>
                        <button onClick={() => setShowAdvanced(!showAdvanced)} className='text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1'>
                            {showAdvanced ? "▼" : "▶"} {t.advancedOptions}
                        </button>

                        {showAdvanced && (
                            <div className='mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                                {/* Share toggle */}
                                <div>
                                    <label className='flex items-center gap-2 cursor-pointer'>
                                        <input type='checkbox' checked={isShared} onChange={(e) => setIsShared(e.target.checked)} className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500' />
                                        <span className='text-sm text-gray-700 dark:text-gray-300'>
                                            {t.share} - {isShared ? t.shared : t.private}
                                        </span>
                                    </label>
                                    <p className='mt-1 ml-6 text-xs text-gray-500 dark:text-gray-400'>{t.shareHelp}</p>
                                </div>

                                {/* Authentication */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.authentication}</label>
                                    <div className='w-full md:w-48'>
                                        <Select value={authType} onChange={(e) => setAuthType(e.target.value as AuthType)} className='text-sm'>
                                            <option value='none'>{t.authNone}</option>
                                            <option value='apiKey'>{t.authApiKey}</option>
                                            <option value='bearer'>{t.authBearer}</option>
                                        </Select>
                                    </div>

                                    {authType !== "none" && <Input type='text' value={authValue} onChange={(e) => setAuthValue(e.target.value)} placeholder={authType === "apiKey" ? t.apiKeyValue : t.bearerToken} className='mt-2 text-sm' />}
                                </div>

                                {/* Rate Limit */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.rateLimitLabel}</label>
                                    <div className='w-full md:w-32'>
                                        <Input type='number' value={rateLimit} onChange={(e) => setRateLimit(Math.max(0, Number(e.target.value)))} min={0} className='text-sm' />
                                    </div>
                                    <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>{t.rateLimitHelp}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className='flex gap-4'>
                        <button onClick={handleSubmit} disabled={loading} className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'>
                            {loading ? t.creating : editingId ? t.update : t.create}
                        </button>
                        {editingId && (
                            <button onClick={resetForm} className='px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* My Mock APIs List */}
            {activeTab === "myMocks" && (
                <div className='space-y-4'>
                    {/* Search & Filter */}
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex-1'>
                            <Input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchMocks} />
                        </div>
                        <div className='w-full md:w-40'>
                            <Select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value as HttpMethod | "ALL")}>
                                <option value='ALL'>{t.allMethods}</option>
                                {HTTP_METHODS.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {filteredMocks.length === 0 ? (
                        <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
                            <p className='text-4xl mb-4'>📡</p>
                            <p>{t.noMocks}</p>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            {filteredMocks.map((mock) => (
                                <div key={mock.id} className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors'>
                                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-2 mb-1'>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getMethodColor(mock.method)}`}>{mock.method}</span>
                                                <h3 className='font-medium text-gray-900 dark:text-gray-100'>{mock.name}</h3>
                                                {mock.isShared && <span className='text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded'>{t.shared}</span>}
                                            </div>
                                            <p className='text-sm text-gray-600 dark:text-gray-400 font-mono'>{mock.endpoint}</p>
                                            {mock.description && <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>{mock.description}</p>}
                                            <div className='flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400'>
                                                <span>
                                                    {mock.requestCount} {t.requests}
                                                </span>
                                                <span>
                                                    {t.createdAt}: {new Date(mock.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex gap-2 flex-wrap'>
                                            <button onClick={() => handleCopy(mock.id)} className='px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                                {copiedId === mock.id ? t.copied : t.copy}
                                            </button>
                                            <button onClick={() => handleCopyCurl(mock)} className='px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                                {copiedCurlId === mock.id ? t.copied : "cURL"}
                                            </button>
                                            <button onClick={() => handleTest(mock)} disabled={testingMockId === mock.id} className='px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                                {testingMockId === mock.id ? t.testing : t.testApi}
                                            </button>
                                            <button onClick={() => handleToggleShare(mock.id)} title={t.shareHelp} className='px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                                {mock.isShared ? t.unshare : t.share}
                                            </button>
                                            <button onClick={() => handleEdit(mock)} className='px-3 py-1.5 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(mock.id)} className='px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Shared Mock APIs */}
            {activeTab === "shared" && (
                <div className='space-y-4'>
                    {/* Search & Filter */}
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex-1'>
                            <Input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchMocks} />
                        </div>
                        <div className='w-full md:w-40'>
                            <Select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value as HttpMethod | "ALL")}>
                                <option value='ALL'>{t.allMethods}</option>
                                {HTTP_METHODS.map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* Loading state */}
                    {isLoadingShared ? (
                        <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
                            <div className='animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4'></div>
                            <p>{locale === "vi" ? "Đang tải..." : "Loading..."}</p>
                        </div>
                    ) : sharedMocks.length === 0 ? (
                        <div className='text-center py-12 text-gray-500 dark:text-gray-400'>
                            <p className='text-4xl mb-4'>🌐</p>
                            <p>{t.noSharedMocks}</p>
                        </div>
                    ) : (
                        <>
                            <div className='space-y-4'>
                                {sharedMocks.map((mock) => (
                                    <div key={mock.id} className='border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors'>
                                        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2 mb-1'>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getMethodColor(mock.method)}`}>{mock.method}</span>
                                                    <h3 className='font-medium text-gray-900 dark:text-gray-100'>{mock.name}</h3>
                                                </div>
                                                <p className='text-sm text-gray-600 dark:text-gray-400 font-mono'>{mock.endpoint}</p>
                                                {mock.description && <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>{mock.description}</p>}
                                                <div className='flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400'>
                                                    <span>
                                                        {mock.requestCount} {t.requests}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex gap-2'>
                                                <button onClick={() => handleCopy(mock.id)} className='px-3 py-1.5 text-sm dark:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                                    {copiedId === mock.id ? t.copied : t.copy}
                                                </button>
                                                <button onClick={() => handleCopyCurl(mock)} className='px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                                    {copiedCurlId === mock.id ? t.copied : "cURL"}
                                                </button>
                                                <button onClick={() => handleTest(mock)} disabled={testingMockId === mock.id} className='px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                                    {testingMockId === mock.id ? t.testing : t.testApi}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {sharedMocksPagination && sharedMocksPagination.totalPages > 1 && (
                                <div className='flex items-center justify-center gap-2 mt-6'>
                                    <button onClick={() => setSharedPage((p) => Math.max(1, p - 1))} disabled={!sharedMocksPagination.hasPrevPage || isFetchingShared} className='px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                        ← {locale === "vi" ? "Trước" : "Prev"}
                                    </button>

                                    <div className='flex items-center gap-1'>
                                        {Array.from({ length: sharedMocksPagination.totalPages }, (_, i) => i + 1).map((page) => (
                                            <button key={page} onClick={() => setSharedPage(page)} disabled={isFetchingShared} className={`w-9 h-9 text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${page === sharedMocksPagination.page ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"} ${isFetchingShared ? "opacity-50" : ""}`}>
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button onClick={() => setSharedPage((p) => Math.min(sharedMocksPagination.totalPages, p + 1))} disabled={!sharedMocksPagination.hasNextPage || isFetchingShared} className='px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500'>
                                        {locale === "vi" ? "Sau" : "Next"} →
                                    </button>
                                </div>
                            )}

                            {/* Pagination info */}
                            {sharedMocksPagination && (
                                <div className='text-center text-sm text-gray-500 dark:text-gray-400'>
                                    {locale === "vi"
                                        ? `Hiển thị ${(sharedMocksPagination.page - 1) * sharedMocksPagination.pageSize + 1}-${Math.min(sharedMocksPagination.page * sharedMocksPagination.pageSize, sharedMocksPagination.totalItems)} / ${sharedMocksPagination.totalItems} mục`
                                        : `Showing ${(sharedMocksPagination.page - 1) * sharedMocksPagination.pageSize + 1}-${Math.min(sharedMocksPagination.page * sharedMocksPagination.pageSize, sharedMocksPagination.totalItems)} of ${sharedMocksPagination.totalItems} items`}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Test Response */}
            {testResponse && (
                <div className='mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                    <h3 className='font-medium text-gray-900 dark:text-gray-100 mb-3'>Test Response</h3>
                    <div className='flex items-center gap-4 mb-3 text-sm'>
                        <span className={`px-2 py-1 rounded ${testResponse.status >= 200 && testResponse.status < 300 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}>
                            {testResponse.status} {testResponse.statusText}
                        </span>
                        <span className='text-gray-600 dark:text-gray-400'>{testResponse.time}ms</span>
                    </div>
                    <pre className='bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200 max-h-64'>{JSON.stringify(testResponse.data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
