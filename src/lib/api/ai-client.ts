/**
 * AI API Client
 * Client-side helper for interacting with the AI proxy API
 */

import type { AIProvider, AIModel, AIMessage, AIRequest, AIResponse, AISuccessResponse, AIAPIInfo } from "@/types/ai";

const API_ENDPOINT = "/api/ai";

export interface AIClientOptions {
    /** Optional API key for higher rate limits */
    apiKey?: string;
    /** Base URL override (for external usage) */
    baseUrl?: string;
}

export class AIClient {
    private apiKey?: string;
    private baseUrl: string;

    constructor(options: AIClientOptions = {}) {
        this.apiKey = options.apiKey;
        this.baseUrl = options.baseUrl || "";
    }

    /**
     * Get API information including available providers and rate limits
     */
    async getInfo(): Promise<AIAPIInfo> {
        const response = await fetch(`${this.baseUrl}${API_ENDPOINT}`, {
            method: "GET",
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Failed to get API info: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Send a chat completion request
     */
    async chat(request: AIRequest): Promise<AISuccessResponse> {
        const response = await fetch(`${this.baseUrl}${API_ENDPOINT}`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(request),
        });

        const data: AIResponse = await response.json();

        if (!data.success) {
            throw new AIError(data.error, data.message, data.retryAfter);
        }

        return data;
    }

    /**
     * Simple helper for quick single-message requests
     */
    async ask(
        provider: AIProvider,
        model: AIModel,
        prompt: string,
        options?: {
            systemPrompt?: string;
            temperature?: number;
            maxTokens?: number;
        }
    ): Promise<string> {
        const messages: AIMessage[] = [];

        if (options?.systemPrompt) {
            messages.push({ role: "system", content: options.systemPrompt });
        }

        messages.push({ role: "user", content: prompt });

        const result = await this.chat({
            provider,
            model,
            messages,
            temperature: options?.temperature,
            maxTokens: options?.maxTokens,
        });

        return result.response;
    }

    /**
     * Quick helper methods for each provider
     */
    async askGemini(prompt: string, model: AIModel = "gemini-1.5-flash", systemPrompt?: string): Promise<string> {
        return this.ask("gemini", model, prompt, { systemPrompt });
    }

    async askGPT(prompt: string, model: AIModel = "gpt-4o-mini", systemPrompt?: string): Promise<string> {
        return this.ask("openai", model, prompt, { systemPrompt });
    }

    async askClaude(prompt: string, model: AIModel = "claude-3-5-haiku-20241022", systemPrompt?: string): Promise<string> {
        return this.ask("claude", model, prompt, { systemPrompt });
    }

    async askGroq(prompt: string, model: AIModel = "llama-3.1-8b-instant", systemPrompt?: string): Promise<string> {
        return this.ask("groq", model, prompt, { systemPrompt });
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (this.apiKey) {
            headers["X-API-Key"] = this.apiKey;
        }

        return headers;
    }
}

/**
 * Custom error class for AI API errors
 */
export class AIError extends Error {
    public readonly errorType: string;
    public readonly retryAfter?: number;

    constructor(errorType: string, message: string, retryAfter?: number) {
        super(message);
        this.name = "AIError";
        this.errorType = errorType;
        this.retryAfter = retryAfter;
    }

    isRateLimited(): boolean {
        return this.errorType === "Rate limit exceeded";
    }
}

// Default client instance
export const aiClient = new AIClient();

// Export types
export type { AIProvider, AIModel, AIMessage, AIRequest, AIResponse, AISuccessResponse, AIAPIInfo };
