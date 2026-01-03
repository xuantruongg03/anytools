// Mock API Storage - Supports multiple backends
// Priority: MongoDB > Upstash (with fallback and email notification)

import { MongoClient, ServerApiVersion } from "mongodb";
import { handleError } from "./utils/error-handler";
import { MOCK_PREFIX, MOCK_TTL_SECONDS, MONGODB_COLLECTION_NAME, DEFAULT_DATABASE_NAME } from "@/constants/mock-storage";

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
    ownerId?: string; // Owner identification for filtering
    isShared?: boolean; // Whether this mock is shared publicly
    requestCount?: number; // Number of requests to this mock
}

// ============ Environment Detection ============

// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || DEFAULT_DATABASE_NAME;

// Upstash Redis
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export type StorageProvider = "mongodb" | "upstash" | "memory";

export function getActiveProvider(): StorageProvider {
    const mongoUri = process.env.MONGODB_URI;
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (mongoUri) return "mongodb";
    if (upstashUrl && upstashToken) return "upstash";
    return "memory";
}

export function isStorageConfigured(): boolean {
    return getActiveProvider() !== "memory";
}

// ============ In-Memory Fallback ============

const memoryStore = new Map<string, StoredMockApi>();

// ============ Upstash Functions ============

async function upstashCommand<T>(command: string[]): Promise<T | null> {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;

    try {
        const response = await fetch(UPSTASH_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${UPSTASH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(command),
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.result as T;
    } catch {
        return null;
    }
}

async function upstashSave(mock: StoredMockApi): Promise<boolean> {
    const result = await upstashCommand<string>(["SETEX", `${MOCK_PREFIX}${mock.id}`, String(MOCK_TTL_SECONDS), JSON.stringify(mock)]);
    return result === "OK";
}

async function upstashGet(id: string): Promise<StoredMockApi | null> {
    const result = await upstashCommand<string>(["GET", `${MOCK_PREFIX}${id}`]);
    if (!result) return null;
    try {
        return JSON.parse(result);
    } catch {
        return null;
    }
}

async function upstashDelete(id: string): Promise<boolean> {
    const result = await upstashCommand<number>(["DEL", `${MOCK_PREFIX}${id}`]);
    return result === 1;
}

async function upstashRefreshTTL(id: string): Promise<boolean> {
    const result = await upstashCommand<number>(["EXPIRE", `${MOCK_PREFIX}${id}`, String(MOCK_TTL_SECONDS)]);
    return result === 1;
}

// ============ MongoDB Functions ============

// MongoDB client singleton for connection pooling
let mongoClient: MongoClient | null = null;

async function getMongoClient(): Promise<MongoClient | null> {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) return null;

    if (!mongoClient) {
        mongoClient = new MongoClient(mongoUri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
    }

    try {
        await mongoClient.connect();
        return mongoClient;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return null;
    }
}

async function getMongoCollection() {
    const client = await getMongoClient();
    if (!client) return null;
    const dbName = process.env.MONGODB_DATABASE || DEFAULT_DATABASE_NAME;
    return client.db(dbName).collection<StoredMockApi>(MONGODB_COLLECTION_NAME);
}

async function mongoSave(mock: StoredMockApi): Promise<boolean> {
    try {
        const collection = await getMongoCollection();
        if (!collection) return false;

        const result = await collection.updateOne({ id: mock.id }, { $set: mock }, { upsert: true });
        return result?.acknowledged === true || (result?.matchedCount || 0) > 0 || (result?.upsertedCount || 0) > 0;
    } catch (error) {
        console.error("MongoDB save error:", error);
        return false;
    }
}

async function mongoGet(id: string): Promise<StoredMockApi | null> {
    try {
        const collection = await getMongoCollection();
        if (!collection) return null;

        const doc = await collection.findOne({ id });
        return doc || null;
    } catch (error) {
        console.error("MongoDB get error:", error);
        return null;
    }
}

async function mongoDelete(id: string): Promise<boolean> {
    try {
        const collection = await getMongoCollection();
        if (!collection) return false;

        const result = await collection.deleteOne({ id });
        return result.deletedCount > 0;
    } catch (error) {
        console.error("MongoDB delete error:", error);
        return false;
    }
}

async function mongoCheckMultiple(ids: string[]): Promise<string[]> {
    try {
        const collection = await getMongoCollection();
        if (!collection) return [];

        const docs = await collection.find({ id: { $in: ids } }, { projection: { id: 1 } }).toArray();
        return docs.map((d) => d.id);
    } catch (error) {
        console.error("MongoDB checkMultiple error:", error);
        return [];
    }
}

async function mongoGetByOwner(ownerId: string): Promise<StoredMockApi[]> {
    try {
        const collection = await getMongoCollection();
        if (!collection) return [];

        const docs = await collection.find({ ownerId }).sort({ createdAt: -1 }).toArray();
        return docs;
    } catch (error) {
        console.error("MongoDB getByOwner error:", error);
        return [];
    }
}

interface GetSharedMocksOptions {
    page?: number;
    pageSize?: number;
    search?: string;
    method?: string;
}

interface GetSharedMocksResult {
    items: StoredMockApi[];
    totalItems: number;
}

async function mongoGetSharedMocks(options: GetSharedMocksOptions): Promise<GetSharedMocksResult> {
    try {
        const collection = await getMongoCollection();
        if (!collection) return { items: [], totalItems: 0 };

        const { page = 1, pageSize = 7, search = "", method = "ALL" } = options;

        // Build filter query
        const filter: Record<string, unknown> = { isShared: true };

        // Add search filter
        if (search) {
            filter.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
        }

        // Add method filter
        if (method !== "ALL") {
            filter.method = method;
        }

        // Get total count
        const totalItems = await collection.countDocuments(filter);

        // Get paginated items
        const skip = (page - 1) * pageSize;
        const docs = await collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).toArray();

        return { items: docs, totalItems };
    } catch (error) {
        console.error("MongoDB getSharedMocks error:", error);
        return { items: [], totalItems: 0 };
    }
}

// Upstash check multiple
async function upstashCheckMultiple(ids: string[]): Promise<string[]> {
    const existingIds: string[] = [];
    // Use MGET for batch check
    const keys = ids.map((id) => `${MOCK_PREFIX}${id}`);
    const results = await upstashCommand<(string | null)[]>(["MGET", ...keys]);
    if (results) {
        results.forEach((result, index) => {
            if (result) existingIds.push(ids[index]);
        });
    }
    return existingIds;
}

// ============ Unified Storage Interface with Fallback ============

interface StorageResult<T> {
    success: boolean;
    data?: T;
    provider?: StorageProvider;
    error?: string;
}

/**
 * Save a mock API with fallback (MongoDB -> Upstash)
 * Sends email notification if primary fails
 */
export async function saveMock(mock: StoredMockApi): Promise<boolean> {
    const failures: { provider: string; error: string }[] = [];
    const mongoUri = process.env.MONGODB_URI;
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    // Try MongoDB first
    if (mongoUri) {
        try {
            const result = await mongoSave(mock);
            if (result) return true;
            failures.push({ provider: "mongodb", error: "Save returned false" });
        } catch (error) {
            failures.push({ provider: "mongodb", error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Fallback to Upstash
    if (upstashUrl && upstashToken) {
        try {
            const result = await upstashSave(mock);
            if (result) {
                // Send non-blocking email if MongoDB failed
                if (failures.length > 0) {
                    sendStorageErrorEmail("saveMock", mock.id, failures, "upstash");
                }
                return true;
            }
            failures.push({ provider: "upstash", error: "Save returned false" });
        } catch (error) {
            failures.push({ provider: "upstash", error: error instanceof Error ? error.message : String(error) });
        }
    }

    // All cloud storage failed - use memory and send email
    memoryStore.set(mock.id, mock);
    if (failures.length > 0) {
        sendStorageErrorEmail("saveMock", mock.id, failures, "memory");
    }
    return true;
}

/**
 * Get a mock API by ID with fallback
 */
export async function getMock(id: string): Promise<StoredMockApi | null> {
    // Try MongoDB first
    if (MONGODB_URI) {
        try {
            const result = await mongoGet(id);
            if (result) return result;
        } catch (error) {
            console.error("MongoDB getMock error:", error);
        }
    }

    // Fallback to Upstash
    if (UPSTASH_URL && UPSTASH_TOKEN) {
        try {
            const result = await upstashGet(id);
            if (result) {
                await upstashRefreshTTL(id);
                return result;
            }
        } catch (error) {
            console.error("Upstash getMock error:", error);
        }
    }

    // Fallback to memory
    return memoryStore.get(id) || null;
}

/**
 * Delete a mock API by ID with fallback
 */
export async function deleteMock(id: string): Promise<boolean> {
    const failures: { provider: string; error: string }[] = [];
    let deleted = false;

    // Try MongoDB
    if (MONGODB_URI) {
        try {
            const result = await mongoDelete(id);
            if (result) deleted = true;
        } catch (error) {
            failures.push({ provider: "mongodb", error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Try Upstash (also delete to ensure consistency)
    if (UPSTASH_URL && UPSTASH_TOKEN) {
        try {
            const result = await upstashDelete(id);
            if (result) deleted = true;
        } catch (error) {
            failures.push({ provider: "upstash", error: error instanceof Error ? error.message : String(error) });
        }
    }

    // Also delete from memory
    memoryStore.delete(id);

    // Send email if all cloud deletions failed
    if (failures.length > 0 && !deleted) {
        sendStorageErrorEmail("deleteMock", id, failures, "none");
    }

    return deleted || memoryStore.has(id) === false;
}

/**
 * Check if mock exists
 */
export async function mockExists(id: string): Promise<boolean> {
    const mock = await getMock(id);
    return mock !== null;
}

/**
 * Check multiple mocks exist (for sync)
 * Returns array of IDs that exist in cloud
 */
export async function checkMocksExist(ids: string[]): Promise<string[]> {
    if (ids.length === 0) return [];

    // Try MongoDB first
    if (MONGODB_URI) {
        try {
            const result = await mongoCheckMultiple(ids);
            if (result.length > 0 || ids.length > 0) return result;
        } catch (error) {
            console.error("MongoDB checkMocksExist error:", error);
        }
    }

    // Fallback to Upstash
    if (UPSTASH_URL && UPSTASH_TOKEN) {
        try {
            return await upstashCheckMultiple(ids);
        } catch (error) {
            console.error("Upstash checkMocksExist error:", error);
        }
    }

    // Memory fallback
    return ids.filter((id) => memoryStore.has(id));
}

/**
 * Bulk save mocks (for sync)
 */
export async function saveMocksBulk(mocks: StoredMockApi[]): Promise<{ saved: string[]; failed: string[] }> {
    const saved: string[] = [];
    const failed: string[] = [];

    for (const mock of mocks) {
        try {
            const result = await saveMock(mock);
            if (result) {
                saved.push(mock.id);
            } else {
                failed.push(mock.id);
            }
        } catch {
            failed.push(mock.id);
        }
    }

    return { saved, failed };
}

/**
 * Get all mocks by owner ID (for fetching user's mocks from cloud)
 */
export async function getMocksByOwner(ownerId: string): Promise<StoredMockApi[]> {
    if (!ownerId) return [];

    // Try MongoDB first
    if (MONGODB_URI) {
        try {
            return await mongoGetByOwner(ownerId);
        } catch (error) {
            console.error("MongoDB getMocksByOwner error:", error);
        }
    }

    // Upstash doesn't support efficient owner-based queries
    // Would need to scan all keys, not recommended
    // Return empty for Upstash - client should use local storage as source of truth

    // Memory fallback
    return Array.from(memoryStore.values()).filter((m) => m.ownerId === ownerId);
}

/**
 * Get shared mocks with pagination and filtering
 */
export async function getSharedMocks(options: { page?: number; pageSize?: number; search?: string; method?: string }): Promise<{ items: StoredMockApi[]; totalItems: number }> {
    const { page = 1, pageSize = 7, search = "", method = "ALL" } = options;

    // Try MongoDB first (best for queries)
    if (MONGODB_URI) {
        try {
            return await mongoGetSharedMocks({ page, pageSize, search, method });
        } catch (error) {
            console.error("MongoDB getSharedMocks error:", error);
        }
    }

    // Memory fallback with manual filtering and pagination
    let items = Array.from(memoryStore.values()).filter((m) => m.isShared === true);

    // Apply search filter
    if (search) {
        const searchLower = search.toLowerCase();
        items = items.filter((m) => m.name.toLowerCase().includes(searchLower) || (m.description && m.description.toLowerCase().includes(searchLower)));
    }

    // Apply method filter
    if (method !== "ALL") {
        items = items.filter((m) => m.method === method);
    }

    // Sort by createdAt descending
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totalItems = items.length;
    const start = (page - 1) * pageSize;
    const paginatedItems = items.slice(start, start + pageSize);

    return { items: paginatedItems, totalItems };
}

/**
 * Update mock's shared status
 */
export async function updateMockSharedStatus(id: string, isShared: boolean): Promise<boolean> {
    // Try MongoDB first
    if (MONGODB_URI) {
        try {
            const collection = await getMongoCollection();
            if (collection) {
                const result = await collection.updateOne({ id }, { $set: { isShared } });
                if (result.matchedCount > 0) return true;
            }
        } catch (error) {
            console.error("MongoDB updateMockSharedStatus error:", error);
        }
    }

    // Try Upstash
    if (UPSTASH_URL && UPSTASH_TOKEN) {
        try {
            const mock = await upstashGet(id);
            if (mock) {
                mock.isShared = isShared;
                return await upstashSave(mock);
            }
        } catch (error) {
            console.error("Upstash updateMockSharedStatus error:", error);
        }
    }

    // Memory fallback
    const mock = memoryStore.get(id);
    if (mock) {
        mock.isShared = isShared;
        memoryStore.set(id, mock);
        return true;
    }

    return false;
}

// ============ Error Notification ============

function sendStorageErrorEmail(operation: string, mockId: string, failures: { provider: string; error: string }[], fallbackUsed: string) {
    // Non-blocking email
    handleError(new Error(`Mock storage ${operation} failed`), {
        endpoint: "/api/mock-api",
        method: "POST",
        params: {
            operation,
            mockId,
            failures,
            fallbackUsed,
            timestamp: new Date().toISOString(),
        },
    }).catch((err) => console.error("Failed to send storage error email:", err));
}
