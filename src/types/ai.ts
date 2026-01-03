/**
 * AI API Types
 * Types for the AI proxy API
 */

// ============== Providers ==============

export type AIProvider = "openai" | "gemini" | "claude" | "groq" | "openrouter";

// ============== Models ==============

export type OpenAIModel = "gpt-4o" | "gpt-4o-mini" | "gpt-4-turbo" | "gpt-4" | "gpt-3.5-turbo" | "o1" | "o1-mini" | "o1-preview";

export type GeminiModel = "gemini-2.0-flash-exp" | "gemini-1.5-flash" | "gemini-1.5-flash-8b" | "gemini-1.5-pro" | "gemini-pro";

export type ClaudeModel = "claude-3-5-sonnet-20241022" | "claude-3-5-haiku-20241022" | "claude-3-opus-20240229" | "claude-3-sonnet-20240229" | "claude-3-haiku-20240307";

export type GroqModel = "llama-3.3-70b-versatile" | "llama-3.1-8b-instant" | "llama-3.2-90b-vision-preview" | "mixtral-8x7b-32768" | "gemma2-9b-it";

export type OpenRouterModel = "google/gemini-2.0-flash-exp:free" | "meta-llama/llama-3.2-3b-instruct:free" | "qwen/qwen-2-7b-instruct:free";

export type AIModel = OpenAIModel | GeminiModel | ClaudeModel | GroqModel | OpenRouterModel;

// ============== Messages ==============

export type MessageRole = "system" | "user" | "assistant";

export interface AIMessage {
    role: MessageRole;
    content: string;
}

// ============== Request ==============

export interface AIRequest {
    /** AI provider to use */
    provider: AIProvider;
    /** Model name from the provider */
    model: AIModel;
    /** Conversation messages */
    messages: AIMessage[];
    /** Temperature for response randomness (0.0 - 2.0, default: 0.7) */
    temperature?: number;
    /** Maximum tokens to generate (default: 2048) */
    maxTokens?: number;
    /** Enable streaming response (not yet supported) */
    stream?: boolean;
}

// ============== Response ==============

export interface AIUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface AITiming {
    latencyMs: number;
}

export interface AISuccessResponse {
    success: true;
    provider: AIProvider;
    model: string;
    response: string;
    usage: AIUsage;
    timing: AITiming;
}

export interface AIErrorResponse {
    success: false;
    error: string;
    message: string;
    retryAfter?: number;
}

export type AIResponse = AISuccessResponse | AIErrorResponse;

// ============== Rate Limit ==============

export interface RateLimitHeaders {
    "X-RateLimit-Limit": string;
    "X-RateLimit-Remaining": string;
    "X-RateLimit-Reset": string;
}

// ============== Provider Info ==============

export interface ProviderInfo {
    models: string[];
    available: boolean;
}

export interface RateLimitInfo {
    maxRequestsPerMinute: number;
    maxTokensPerDay: number;
    current: {
        remaining: number;
        resetIn: number;
    };
}

export interface AIAPIInfo {
    name: string;
    version: string;
    description: string;
    providers: Record<AIProvider, ProviderInfo>;
    rateLimit: RateLimitInfo;
    usage: {
        endpoint: string;
        headers: Record<string, string>;
        body: Record<string, unknown>;
        example: AIRequest;
    };
}
