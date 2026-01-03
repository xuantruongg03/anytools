// Mock Storage Constants

// Redis/Upstash settings
export const MOCK_PREFIX = "mock:";
export const MOCK_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

// MongoDB settings
export const MONGODB_COLLECTION_NAME = "mocks";
export const DEFAULT_DATABASE_NAME = "anytools";

// Storage provider types
export const STORAGE_PROVIDERS = {
    MONGODB: "mongodb",
    UPSTASH: "upstash",
    MEMORY: "memory",
} as const;
