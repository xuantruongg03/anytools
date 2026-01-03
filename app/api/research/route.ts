import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// ============== Configuration ==============

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const RATE_LIMIT = {
    WINDOW_SIZE: 60,
    MAX_REQUESTS: 20,
    MAX_TOKENS_PER_DAY: 100000,
};

// AI Provider configurations
const AI_PROVIDERS = {
    openai: {
        apiKeyEnv: "OPENAI_API_KEY",
        models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
    },
    gemini: {
        apiKeyEnv: "GEMINI_API_KEY",
        models: ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.5-flash-8b"],
    },
    claude: {
        apiKeyEnv: "ANTHROPIC_API_KEY",
        models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
    },
    groq: {
        apiKeyEnv: "GROQ_API_KEY",
        models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
    },
} as const;

// Web Search Provider configurations
const SEARCH_PROVIDERS = {
    tavily: {
        apiKeyEnv: "TAVILY_API_KEY",
        name: "Tavily",
    },
    serper: {
        apiKeyEnv: "SERPER_API_KEY",
        name: "Serper (Google)",
    },
    bing: {
        apiKeyEnv: "BING_SEARCH_API_KEY",
        name: "Bing Search",
    },
    google: {
        apiKeyEnv: "GOOGLE_SEARCH_API_KEY",
        name: "Google Custom Search",
    },
} as const;

type SearchProvider = keyof typeof SEARCH_PROVIDERS;

// Translation services
const TRANSLATION_SERVICES = {
    google: { name: "Google Translate", apiKeyEnv: "GOOGLE_TRANSLATE_API_KEY" },
    deepl: { name: "DeepL", apiKeyEnv: "DEEPL_API_KEY" },
    microsoft: { name: "Microsoft Translator", apiKeyEnv: "MICROSOFT_TRANSLATOR_KEY" },
    libre: { name: "LibreTranslate", apiKeyEnv: null }, // Free, no key needed
} as const;

type Provider = keyof typeof AI_PROVIDERS;
type TranslationService = keyof typeof TRANSLATION_SERVICES;

// ============== Request Types ==============

interface ResearchRequest {
    type: "research";
    keyword: string;
    provider: Provider;
    model: string;
    language?: string; // Response language (default: auto-detect or English)
    searchProvider?: SearchProvider; // Web search provider (optional)
    maxResults?: number; // Max search results (default: 5)
}

interface SearchResult {
    title: string;
    url: string;
    snippet: string;
    source?: string;
    publishedDate?: string;
}

interface WebSearchResponse {
    results: SearchResult[];
    searchProvider: string;
}

interface TranslateRequest {
    type: "translate";
    text: string;
    from?: string; // Source language (auto-detect if not provided)
    to: string; // Target language
    service?: TranslationService | "all"; // Specific service or "all" for all available
}

type APIRequest = ResearchRequest | TranslateRequest;

interface RateLimitInfo {
    requests: number;
    tokensUsed: number;
    windowStart: number;
    dayStart: number;
}

interface WordTranslation {
    word: string;
    translation: string;
    partOfSpeech?: string;
    phonetic?: string;
}

interface TranslationResult {
    service: string;
    translatedText: string;
    detectedLanguage?: string;
    words?: WordTranslation[];
    confidence?: number;
}

// ============== Helper Functions ==============

function getClientId(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const apiKey = request.headers.get("x-api-key");
    if (apiKey) {
        return `key:${Buffer.from(apiKey).toString("base64").slice(0, 16)}`;
    }
    return `ip:${ip}`;
}

async function checkRateLimit(clientId: string): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const now = Math.floor(Date.now() / 1000);
    const key = `research:ratelimit:${clientId}`;

    try {
        const data = await redis.get<RateLimitInfo>(key);
        const windowStart = data?.windowStart || now;
        const requests = data?.requests || 0;

        if (now - windowStart >= RATE_LIMIT.WINDOW_SIZE) {
            await redis.set(key, { requests: 1, tokensUsed: data?.tokensUsed || 0, windowStart: now, dayStart: data?.dayStart || now }, { ex: RATE_LIMIT.WINDOW_SIZE * 2 });
            return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - 1, resetIn: RATE_LIMIT.WINDOW_SIZE };
        }

        if (requests >= RATE_LIMIT.MAX_REQUESTS) {
            return { allowed: false, remaining: 0, resetIn: RATE_LIMIT.WINDOW_SIZE - (now - windowStart) };
        }

        await redis.set(key, { ...data, requests: requests + 1, windowStart }, { ex: RATE_LIMIT.WINDOW_SIZE * 2 });
        return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - requests - 1, resetIn: RATE_LIMIT.WINDOW_SIZE - (now - windowStart) };
    } catch (error) {
        console.error("Rate limit check failed:", error);
        return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS, resetIn: RATE_LIMIT.WINDOW_SIZE };
    }
}

function getAvailableProviders(): Record<string, { models: readonly string[]; available: boolean }> {
    const result: Record<string, { models: readonly string[]; available: boolean }> = {};
    for (const [key, config] of Object.entries(AI_PROVIDERS)) {
        const apiKey = process.env[config.apiKeyEnv];
        result[key] = { models: config.models, available: !!apiKey };
    }
    return result;
}

function getAvailableTranslationServices(): Record<string, { name: string; available: boolean }> {
    const result: Record<string, { name: string; available: boolean }> = {};
    for (const [key, config] of Object.entries(TRANSLATION_SERVICES)) {
        const available = config.apiKeyEnv === null || !!process.env[config.apiKeyEnv];
        result[key] = { name: config.name, available };
    }
    return result;
}

function getAvailableSearchProviders(): Record<string, { name: string; available: boolean }> {
    const result: Record<string, { name: string; available: boolean }> = {};
    for (const [key, config] of Object.entries(SEARCH_PROVIDERS)) {
        const available = !!process.env[config.apiKeyEnv];
        result[key] = { name: config.name, available };
    }
    return result;
}

// ============== Web Search Functions ==============

async function searchWithTavily(query: string, maxResults: number = 5): Promise<WebSearchResponse | null> {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) return null;

    try {
        const res = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: apiKey,
                query,
                max_results: maxResults,
                include_answer: false,
                include_raw_content: false,
                search_depth: "advanced",
            }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        return {
            results: (data.results || []).map((r: { title: string; url: string; content: string; published_date?: string }) => ({
                title: r.title,
                url: r.url,
                snippet: r.content,
                publishedDate: r.published_date,
            })),
            searchProvider: "Tavily",
        };
    } catch (error) {
        console.error("Tavily search error:", error);
        return null;
    }
}

async function searchWithSerper(query: string, maxResults: number = 5): Promise<WebSearchResponse | null> {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) return null;

    try {
        const res = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": apiKey,
            },
            body: JSON.stringify({ q: query, num: maxResults }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const results: SearchResult[] = [];

        // Organic results
        for (const r of data.organic || []) {
            results.push({
                title: r.title,
                url: r.link,
                snippet: r.snippet,
                source: r.source,
            });
        }

        // Knowledge graph if available
        if (data.knowledgeGraph) {
            results.unshift({
                title: data.knowledgeGraph.title || query,
                url: data.knowledgeGraph.website || data.knowledgeGraph.descriptionLink || "",
                snippet: data.knowledgeGraph.description || "",
                source: "Knowledge Graph",
            });
        }

        return { results: results.slice(0, maxResults), searchProvider: "Serper (Google)" };
    } catch (error) {
        console.error("Serper search error:", error);
        return null;
    }
}

async function searchWithBing(query: string, maxResults: number = 5): Promise<WebSearchResponse | null> {
    const apiKey = process.env.BING_SEARCH_API_KEY;
    if (!apiKey) return null;

    try {
        const params = new URLSearchParams({
            q: query,
            count: maxResults.toString(),
            responseFilter: "Webpages",
        });

        const res = await fetch(`https://api.bing.microsoft.com/v7.0/search?${params}`, {
            headers: { "Ocp-Apim-Subscription-Key": apiKey },
        });

        if (!res.ok) return null;

        const data = await res.json();
        return {
            results: (data.webPages?.value || []).map((r: { name: string; url: string; snippet: string; datePublished?: string }) => ({
                title: r.name,
                url: r.url,
                snippet: r.snippet,
                publishedDate: r.datePublished,
            })),
            searchProvider: "Bing Search",
        };
    } catch (error) {
        console.error("Bing search error:", error);
        return null;
    }
}

async function searchWithGoogle(query: string, maxResults: number = 5): Promise<WebSearchResponse | null> {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;
    if (!apiKey || !cx) return null;

    try {
        const params = new URLSearchParams({
            key: apiKey,
            cx,
            q: query,
            num: Math.min(maxResults, 10).toString(),
        });

        const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);

        if (!res.ok) return null;

        const data = await res.json();
        return {
            results: (data.items || []).map((r: { title: string; link: string; snippet: string; pagemap?: { metatags?: { "article:published_time"?: string }[] } }) => ({
                title: r.title,
                url: r.link,
                snippet: r.snippet,
                publishedDate: r.pagemap?.metatags?.[0]?.["article:published_time"],
            })),
            searchProvider: "Google Custom Search",
        };
    } catch (error) {
        console.error("Google search error:", error);
        return null;
    }
}

async function performWebSearch(query: string, preferredProvider?: SearchProvider, maxResults: number = 5): Promise<WebSearchResponse | null> {
    // If preferred provider specified, try it first
    if (preferredProvider) {
        switch (preferredProvider) {
            case "tavily":
                return await searchWithTavily(query, maxResults);
            case "serper":
                return await searchWithSerper(query, maxResults);
            case "bing":
                return await searchWithBing(query, maxResults);
            case "google":
                return await searchWithGoogle(query, maxResults);
        }
    }

    // Try all providers in priority order
    const providers = [
        { fn: searchWithTavily, name: "tavily" },
        { fn: searchWithSerper, name: "serper" },
        { fn: searchWithBing, name: "bing" },
        { fn: searchWithGoogle, name: "google" },
    ];

    for (const provider of providers) {
        const result = await provider.fn(query, maxResults);
        if (result && result.results.length > 0) {
            return result;
        }
    }

    return null;
}

// ============== AI Research Functions ==============

async function callAIForResearch(provider: Provider, model: string, keyword: string, language: string, searchResults?: SearchResult[]): Promise<{ response: string; usage: { promptTokens: number; completionTokens: number } }> {
    // Build context from search results
    let searchContext = "";
    if (searchResults && searchResults.length > 0) {
        searchContext = "\n\nWeb Search Results:\n" + searchResults.map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}${r.publishedDate ? `\nDate: ${r.publishedDate}` : ""}\n`).join("\n");
    }

    const systemPrompt = `You are an expert researcher and knowledge assistant. Your task is to provide comprehensive, accurate, and well-structured information about the given topic based on web search results.

Guidelines:
- Synthesize information from the provided search results
- Provide factual, up-to-date information with source attribution
- Structure the response with clear sections (Definition, Key Information, Related Concepts, etc.)
- Include relevant links/URLs from the search results using markdown format: [text](url)
- Explain terminology clearly and concisely
- Cite sources when making specific claims
- If search results are limited, acknowledge what is known vs uncertain
- Respond in ${language || "the same language as the query"}

IMPORTANT: Always include source links in your response where relevant.`;

    const userPrompt = `Research and provide detailed information about: "${keyword}"${searchContext}

Based on the search results above, please provide:
1. Definition/Overview - What is it? (with source links)
2. Key facts and details - Important information found
3. Terminology explanation - Explain any technical terms
4. Related concepts or topics
5. Practical applications (if applicable)
6. Sources - List the most relevant sources with links

Format links as markdown: [Source Name](URL)`;

    const messages = [
        { role: "system" as const, content: systemPrompt },
        { role: "user" as const, content: userPrompt },
    ];

    switch (provider) {
        case "openai":
            return callOpenAI(model, messages);
        case "gemini":
            return callGemini(model, messages);
        case "claude":
            return callClaude(model, messages);
        case "groq":
            return callGroq(model, messages);
        default:
            throw new Error(`Provider ${provider} not supported`);
    }
}

async function callOpenAI(model: string, messages: { role: string; content: string }[]): Promise<{ response: string; usage: { promptTokens: number; completionTokens: number } }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key not configured");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 2048 }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || `OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    return {
        response: data.choices[0]?.message?.content || "",
        usage: { promptTokens: data.usage?.prompt_tokens || 0, completionTokens: data.usage?.completion_tokens || 0 },
    };
}

async function callGemini(model: string, messages: { role: string; content: string }[]): Promise<{ response: string; usage: { promptTokens: number; completionTokens: number } }> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key not configured");

    const systemMessage = messages.find((m) => m.role === "system");
    const contents = messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents,
            systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || `Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    return {
        response: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
        usage: { promptTokens: data.usageMetadata?.promptTokenCount || 0, completionTokens: data.usageMetadata?.candidatesTokenCount || 0 },
    };
}

async function callClaude(model: string, messages: { role: string; content: string }[]): Promise<{ response: string; usage: { promptTokens: number; completionTokens: number } }> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("Anthropic API key not configured");

    const systemMessage = messages.find((m) => m.role === "system");
    const chatMessages = messages.filter((m) => m.role !== "system");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
            model,
            system: systemMessage?.content,
            messages: chatMessages.map((m) => ({ role: m.role, content: m.content })),
            max_tokens: 2048,
            temperature: 0.7,
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || `Claude API error: ${res.status}`);
    }

    const data = await res.json();
    return {
        response: data.content?.[0]?.text || "",
        usage: { promptTokens: data.usage?.input_tokens || 0, completionTokens: data.usage?.output_tokens || 0 },
    };
}

async function callGroq(model: string, messages: { role: string; content: string }[]): Promise<{ response: string; usage: { promptTokens: number; completionTokens: number } }> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API key not configured");

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 2048 }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || `Groq API error: ${res.status}`);
    }

    const data = await res.json();
    return {
        response: data.choices[0]?.message?.content || "",
        usage: { promptTokens: data.usage?.prompt_tokens || 0, completionTokens: data.usage?.completion_tokens || 0 },
    };
}

// ============== Translation Functions ==============

function tokenizeText(text: string): string[] {
    // Simple tokenizer - split by spaces and punctuation
    return text
        .split(/[\s,.!?;:'"()\[\]{}]+/)
        .filter((word) => word.length > 0)
        .map((word) => word.toLowerCase());
}

async function translateWithGoogle(text: string, from: string | undefined, to: string): Promise<TranslationResult | null> {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) return null;

    try {
        const params = new URLSearchParams({
            key: apiKey,
            q: text,
            target: to,
            format: "text",
        });
        if (from) params.append("source", from);

        const res = await fetch(`https://translation.googleapis.com/language/translate/v2?${params}`);
        if (!res.ok) return null;

        const data = await res.json();
        const translation = data.data?.translations?.[0];

        // Get word-by-word translations
        const words = tokenizeText(text);
        const wordTranslations: WordTranslation[] = [];

        for (const word of words.slice(0, 20)) {
            // Limit to 20 words
            const wordParams = new URLSearchParams({ key: apiKey, q: word, target: to, format: "text" });
            if (from) wordParams.append("source", from);

            const wordRes = await fetch(`https://translation.googleapis.com/language/translate/v2?${wordParams}`);
            if (wordRes.ok) {
                const wordData = await wordRes.json();
                const wordTrans = wordData.data?.translations?.[0]?.translatedText;
                if (wordTrans && wordTrans.toLowerCase() !== word) {
                    wordTranslations.push({ word, translation: wordTrans });
                }
            }
        }

        return {
            service: "Google Translate",
            translatedText: translation?.translatedText || "",
            detectedLanguage: translation?.detectedSourceLanguage,
            words: wordTranslations,
        };
    } catch (error) {
        console.error("Google Translate error:", error);
        return null;
    }
}

async function translateWithDeepL(text: string, from: string | undefined, to: string): Promise<TranslationResult | null> {
    const apiKey = process.env.DEEPL_API_KEY;
    if (!apiKey) return null;

    try {
        const baseUrl = apiKey.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";

        const body: Record<string, string | string[]> = {
            text: [text],
            target_lang: to.toUpperCase(),
        };
        if (from) body.source_lang = from.toUpperCase();

        const res = await fetch(`${baseUrl}/v2/translate`, {
            method: "POST",
            headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const translation = data.translations?.[0];

        // DeepL word translations (simplified)
        const words = tokenizeText(text);
        const wordTranslations: WordTranslation[] = [];

        for (const word of words.slice(0, 10)) {
            const wordBody: Record<string, string | string[]> = { text: [word], target_lang: to.toUpperCase() };
            if (from) wordBody.source_lang = from.toUpperCase();

            const wordRes = await fetch(`${baseUrl}/v2/translate`, {
                method: "POST",
                headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify(wordBody),
            });

            if (wordRes.ok) {
                const wordData = await wordRes.json();
                const wordTrans = wordData.translations?.[0]?.text;
                if (wordTrans && wordTrans.toLowerCase() !== word) {
                    wordTranslations.push({ word, translation: wordTrans });
                }
            }
        }

        return {
            service: "DeepL",
            translatedText: translation?.text || "",
            detectedLanguage: translation?.detected_source_language?.toLowerCase(),
            words: wordTranslations,
        };
    } catch (error) {
        console.error("DeepL error:", error);
        return null;
    }
}

async function translateWithMicrosoft(text: string, from: string | undefined, to: string): Promise<TranslationResult | null> {
    const apiKey = process.env.MICROSOFT_TRANSLATOR_KEY;
    const region = process.env.MICROSOFT_TRANSLATOR_REGION || "global";
    if (!apiKey) return null;

    try {
        const params = new URLSearchParams({ "api-version": "3.0", to });
        if (from) params.append("from", from);

        const res = await fetch(`https://api.cognitive.microsofttranslator.com/translate?${params}`, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey,
                "Ocp-Apim-Subscription-Region": region,
                "Content-Type": "application/json",
            },
            body: JSON.stringify([{ text }]),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const translation = data[0];

        // Word translations
        const words = tokenizeText(text);
        const wordTranslations: WordTranslation[] = [];

        for (const word of words.slice(0, 10)) {
            const wordParams = new URLSearchParams({ "api-version": "3.0", to });
            if (from) wordParams.append("from", from);

            const wordRes = await fetch(`https://api.cognitive.microsofttranslator.com/translate?${wordParams}`, {
                method: "POST",
                headers: {
                    "Ocp-Apim-Subscription-Key": apiKey,
                    "Ocp-Apim-Subscription-Region": region,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([{ text: word }]),
            });

            if (wordRes.ok) {
                const wordData = await wordRes.json();
                const wordTrans = wordData[0]?.translations?.[0]?.text;
                if (wordTrans && wordTrans.toLowerCase() !== word) {
                    wordTranslations.push({ word, translation: wordTrans });
                }
            }
        }

        return {
            service: "Microsoft Translator",
            translatedText: translation?.translations?.[0]?.text || "",
            detectedLanguage: translation?.detectedLanguage?.language,
            words: wordTranslations,
            confidence: translation?.detectedLanguage?.score,
        };
    } catch (error) {
        console.error("Microsoft Translator error:", error);
        return null;
    }
}

async function translateWithLibre(text: string, from: string | undefined, to: string): Promise<TranslationResult | null> {
    const libreUrl = process.env.LIBRETRANSLATE_URL || "https://libretranslate.com";

    try {
        const body: Record<string, string> = { q: text, target: to, format: "text" };
        if (from) body.source = from;
        else body.source = "auto";

        const res = await fetch(`${libreUrl}/translate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) return null;

        const data = await res.json();

        // Word translations
        const words = tokenizeText(text);
        const wordTranslations: WordTranslation[] = [];

        for (const word of words.slice(0, 10)) {
            const wordBody: Record<string, string> = { q: word, target: to, format: "text" };
            if (from) wordBody.source = from;
            else wordBody.source = "auto";

            const wordRes = await fetch(`${libreUrl}/translate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(wordBody),
            });

            if (wordRes.ok) {
                const wordData = await wordRes.json();
                if (wordData.translatedText && wordData.translatedText.toLowerCase() !== word) {
                    wordTranslations.push({ word, translation: wordData.translatedText });
                }
            }
        }

        return {
            service: "LibreTranslate",
            translatedText: data.translatedText || "",
            detectedLanguage: data.detectedLanguage?.language,
            words: wordTranslations,
        };
    } catch (error) {
        console.error("LibreTranslate error:", error);
        return null;
    }
}

async function translateWithAI(text: string, from: string | undefined, to: string): Promise<TranslationResult | null> {
    // Use available AI model for translation as fallback
    const providers = getAvailableProviders();
    let selectedProvider: Provider | null = null;
    let selectedModel: string | null = null;

    // Priority: groq (free) > gemini > openai > claude
    const priority: Provider[] = ["groq", "gemini", "openai", "claude"];
    for (const p of priority) {
        if (providers[p]?.available) {
            selectedProvider = p;
            selectedModel = providers[p].models[0] as string;
            break;
        }
    }

    if (!selectedProvider || !selectedModel) return null;

    try {
        const systemPrompt = `You are a professional translator. Translate text accurately. Respond ONLY with valid JSON, no markdown, no explanation.`;

        const userPrompt = `Translate "${text}" ${from ? `from ${from}` : ""} to ${to}.

Return ONLY this JSON format (no markdown code blocks):
{"translatedText": "translation here", "words": [{"word": "original", "translation": "translated", "partOfSpeech": "type"}]}`;

        const messages = [
            { role: "system" as const, content: systemPrompt },
            { role: "user" as const, content: userPrompt },
        ];

        let result;
        switch (selectedProvider) {
            case "openai":
                result = await callOpenAI(selectedModel, messages);
                break;
            case "gemini":
                result = await callGemini(selectedModel, messages);
                break;
            case "claude":
                result = await callClaude(selectedModel, messages);
                break;
            case "groq":
                result = await callGroq(selectedModel, messages);
                break;
        }

        // Clean response - remove markdown code blocks if present
        let cleanResponse = result.response
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .trim();

        // Try to parse JSON
        try {
            // Try direct parse first
            const parsed = JSON.parse(cleanResponse);
            return {
                service: `AI (${selectedProvider}/${selectedModel})`,
                translatedText: parsed.translatedText || "",
                words: Array.isArray(parsed.words) ? parsed.words : [],
            };
        } catch {
            // Try to find JSON in response
            try {
                const jsonStart = cleanResponse.indexOf("{");
                const jsonEnd = cleanResponse.lastIndexOf("}");
                if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                    const jsonStr = cleanResponse.substring(jsonStart, jsonEnd + 1);
                    const parsed = JSON.parse(jsonStr);
                    return {
                        service: `AI (${selectedProvider}/${selectedModel})`,
                        translatedText: parsed.translatedText || "",
                        words: Array.isArray(parsed.words) ? parsed.words : [],
                    };
                }
            } catch {
                // JSON parse failed completely
            }
        }

        // Fallback: just return the response as translation
        return {
            service: `AI (${selectedProvider}/${selectedModel})`,
            translatedText: cleanResponse,
            words: [],
        };
    } catch (error) {
        console.error("AI Translation error:", error);
        return null;
    }
}

// ============== Main Handler ==============

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const clientId = getClientId(request);
        const rateLimit = await checkRateLimit(clientId);

        if (!rateLimit.allowed) {
            return NextResponse.json({ error: "Rate limit exceeded", message: `Too many requests. Try again in ${rateLimit.resetIn}s.`, retryAfter: rateLimit.resetIn }, { status: 429, headers: { "Retry-After": rateLimit.resetIn.toString() } });
        }

        const body: APIRequest = await request.json();

        if (!body.type || !["research", "translate"].includes(body.type)) {
            return NextResponse.json({ error: "Invalid type", message: "Type must be 'research' or 'translate'" }, { status: 400 });
        }

        // ============ RESEARCH ============
        if (body.type === "research") {
            const { keyword, provider, model, language, searchProvider, maxResults = 5 } = body as ResearchRequest;

            if (!keyword || !keyword.trim()) {
                return NextResponse.json({ error: "Invalid keyword", message: "Keyword is required" }, { status: 400 });
            }

            if (!provider || !AI_PROVIDERS[provider]) {
                return NextResponse.json({ error: "Invalid provider", message: `Provider must be one of: ${Object.keys(AI_PROVIDERS).join(", ")}`, availableProviders: getAvailableProviders() }, { status: 400 });
            }

            const providerConfig = AI_PROVIDERS[provider];
            if (!model || !providerConfig.models.includes(model as never)) {
                return NextResponse.json({ error: "Invalid model", message: `Model must be one of: ${providerConfig.models.join(", ")}`, availableModels: providerConfig.models }, { status: 400 });
            }

            // Check if provider is available
            const apiKey = process.env[providerConfig.apiKeyEnv];
            if (!apiKey) {
                return NextResponse.json({ error: "Service unavailable", message: `${provider} is not configured` }, { status: 503 });
            }

            // Step 1: Perform web search to get real-time information
            const searchResponse = await performWebSearch(keyword.trim(), searchProvider, maxResults);
            const searchResults = searchResponse?.results || [];

            // Step 2: Use AI to synthesize and explain the search results
            const result = await callAIForResearch(provider, model, keyword.trim(), language || "auto", searchResults);

            return NextResponse.json({
                success: true,
                type: "research",
                keyword: keyword.trim(),
                provider,
                model,
                searchProvider: searchResponse?.searchProvider || null,
                searchResults: searchResults.map((r) => ({
                    title: r.title,
                    url: r.url,
                    snippet: r.snippet,
                    source: r.source,
                    publishedDate: r.publishedDate,
                })),
                result: result.response,
                usage: {
                    promptTokens: result.usage.promptTokens,
                    completionTokens: result.usage.completionTokens,
                    totalTokens: result.usage.promptTokens + result.usage.completionTokens,
                },
                timing: { latencyMs: Date.now() - startTime },
            });
        }

        // ============ TRANSLATE ============
        if (body.type === "translate") {
            const { text, from, to, service } = body as TranslateRequest;

            if (!text || !text.trim()) {
                return NextResponse.json({ error: "Invalid text", message: "Text is required" }, { status: 400 });
            }

            if (!to) {
                return NextResponse.json({ error: "Invalid target language", message: "Target language (to) is required" }, { status: 400 });
            }

            const results: TranslationResult[] = [];

            if (service && service !== "all") {
                // Use specific service
                let result: TranslationResult | null = null;
                switch (service) {
                    case "google":
                        result = await translateWithGoogle(text, from, to);
                        break;
                    case "deepl":
                        result = await translateWithDeepL(text, from, to);
                        break;
                    case "microsoft":
                        result = await translateWithMicrosoft(text, from, to);
                        break;
                    case "libre":
                        result = await translateWithLibre(text, from, to);
                        break;
                }
                if (result) results.push(result);
            } else {
                // Try all available services in parallel
                const promises = [translateWithGoogle(text, from, to), translateWithDeepL(text, from, to), translateWithMicrosoft(text, from, to), translateWithLibre(text, from, to)];

                const allResults = await Promise.all(promises);
                for (const r of allResults) {
                    if (r) results.push(r);
                }
            }

            // If no translation services available, try AI
            if (results.length === 0) {
                const aiResult = await translateWithAI(text, from, to);
                if (aiResult) results.push(aiResult);
            }

            if (results.length === 0) {
                return NextResponse.json({ error: "No translation available", message: "No translation services are configured or available" }, { status: 503 });
            }

            // Combine word translations from all services (deduplicate)
            const allWords = new Map<string, WordTranslation>();
            for (const r of results) {
                for (const w of r.words || []) {
                    if (!allWords.has(w.word)) {
                        allWords.set(w.word, w);
                    }
                }
            }

            return NextResponse.json({
                success: true,
                type: "translate",
                originalText: text,
                from: from || results[0]?.detectedLanguage || "auto",
                to,
                translations: results,
                combinedWords: Array.from(allWords.values()),
                timing: { latencyMs: Date.now() - startTime },
            });
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    } catch (error) {
        console.error("Research API Error:", error);
        return NextResponse.json({ success: false, error: "Request failed", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}

// GET endpoint - API info and available services
export async function GET() {
    return NextResponse.json({
        name: "AnyTools Research & Translation API",
        version: "2.0.0",
        description: "Unified API for web-powered research with AI synthesis and multi-service translation",
        endpoints: {
            research: {
                description: "Search the internet for information, explain terminology, and provide sources with links",
                method: "POST",
                body: {
                    type: "research",
                    keyword: "Topic or keyword to research (required)",
                    provider: "AI provider: openai, gemini, claude, groq (required)",
                    model: "Model name from provider (required)",
                    language: "Response language (optional, default: auto)",
                    searchProvider: "Search provider: tavily, serper, bing, google (optional, auto-select if not specified)",
                    maxResults: "Maximum search results to fetch (optional, default: 5)",
                },
                example: {
                    type: "research",
                    keyword: "quantum computing",
                    provider: "gemini",
                    model: "gemini-1.5-flash",
                    language: "English",
                    searchProvider: "tavily",
                    maxResults: 5,
                },
                response: {
                    searchResults: "Array of web search results with title, url, snippet",
                    result: "AI-synthesized explanation with source links",
                    searchProvider: "The search provider used",
                },
            },
            translate: {
                description: "Translate text using multiple translation services",
                method: "POST",
                body: {
                    type: "translate",
                    text: "Text to translate (required)",
                    from: "Source language code (optional, auto-detect)",
                    to: "Target language code (required)",
                    service: "Specific service: google, deepl, microsoft, libre, or omit for all (optional)",
                },
                example: {
                    type: "translate",
                    text: "Hello, how are you today?",
                    to: "vi",
                },
            },
        },
        availableProviders: getAvailableProviders(),
        availableSearchProviders: getAvailableSearchProviders(),
        availableTranslationServices: getAvailableTranslationServices(),
        rateLimit: {
            maxRequestsPerMinute: RATE_LIMIT.MAX_REQUESTS,
            maxTokensPerDay: RATE_LIMIT.MAX_TOKENS_PER_DAY,
        },
        languageCodes: {
            examples: {
                en: "English",
                vi: "Vietnamese",
                zh: "Chinese",
                ja: "Japanese",
                ko: "Korean",
                fr: "French",
                de: "German",
                es: "Spanish",
                pt: "Portuguese",
                ru: "Russian",
                ar: "Arabic",
                th: "Thai",
            },
        },
    });
}
