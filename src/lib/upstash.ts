// Upstash Redis client for mock API storage
// Simple REST-based client (no SDK needed)

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Check if Upstash is configured
export function isUpstashConfigured(): boolean {
    return !!(UPSTASH_URL && UPSTASH_TOKEN);
}

// Generic Upstash REST command
async function upstashCommand<T>(command: string[]): Promise<T | null> {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
        console.warn("Upstash not configured");
        return null;
    }

    try {
        const response = await fetch(UPSTASH_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${UPSTASH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(command),
        });

        if (!response.ok) {
            console.error("Upstash error:", response.statusText);
            return null;
        }

        const data = await response.json();
        return data.result as T;
    } catch (error) {
        console.error("Upstash request failed:", error);
        return null;
    }
}

// ============ Mock API Storage Functions ============

export interface StoredMockApi {
    id: string;
    name: string;
    description?: string;
    method: string;
    responseType: string;
    jsonTemplate: string;
    statusCode: number;
    delay: number;
    createdAt: string;
    expiresAt?: string;
}

const MOCK_PREFIX = "mock:";
const MOCK_TTL = 60 * 60 * 24 * 30; // 30 days in seconds

/**
 * Save a mock API to Upstash
 */
export async function saveMockApi(mock: StoredMockApi): Promise<boolean> {
    const key = `${MOCK_PREFIX}${mock.id}`;
    const value = JSON.stringify(mock);

    // SETEX: Set with expiration
    const result = await upstashCommand<string>(["SETEX", key, String(MOCK_TTL), value]);
    return result === "OK";
}

/**
 * Get a mock API from Upstash
 */
export async function getMockApi(mockId: string): Promise<StoredMockApi | null> {
    const key = `${MOCK_PREFIX}${mockId}`;
    const result = await upstashCommand<string>(["GET", key]);

    if (!result) return null;

    try {
        return JSON.parse(result) as StoredMockApi;
    } catch {
        return null;
    }
}

/**
 * Delete a mock API from Upstash
 */
export async function deleteMockApi(mockId: string): Promise<boolean> {
    const key = `${MOCK_PREFIX}${mockId}`;
    const result = await upstashCommand<number>(["DEL", key]);
    return result === 1;
}

/**
 * Check if a mock API exists
 */
export async function mockApiExists(mockId: string): Promise<boolean> {
    const key = `${MOCK_PREFIX}${mockId}`;
    const result = await upstashCommand<number>(["EXISTS", key]);
    return result === 1;
}

/**
 * Refresh TTL for a mock API (extend expiration)
 */
export async function refreshMockApiTTL(mockId: string): Promise<boolean> {
    const key = `${MOCK_PREFIX}${mockId}`;
    const result = await upstashCommand<number>(["EXPIRE", key, String(MOCK_TTL)]);
    return result === 1;
}

/**
 * Get remaining TTL for a mock API (in seconds)
 */
export async function getMockApiTTL(mockId: string): Promise<number> {
    const key = `${MOCK_PREFIX}${mockId}`;
    const result = await upstashCommand<number>(["TTL", key]);
    return result ?? -1;
}
