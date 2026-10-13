/**
 * MongoDB Connection Manager - Vercel Serverless Optimized
 * 
 * Theo hướng dẫn chính thức của Vercel:
 * https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package
 * 
 * Sử dụng `attachDatabasePool` để quản lý connection pool tối ưu cho
 * môi trường serverless, tránh connection leaks khi Functions suspend/resume.
 * 
 * Cách dùng:
 *   import { getDb, getClient } from "@/lib/db/mongodb";
 *   const db = await getDb();
 *   const users = await db.collection("users").find({}).toArray();
 */

import { MongoClient, Db, MongoClientOptions } from "mongodb";

// Conditional import — @vercel/functions chỉ khả dụng trên Vercel
let attachDatabasePool: ((client: MongoClient) => void) | null = null;
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const vercelFunctions = require("@vercel/functions");
    attachDatabasePool = vercelFunctions.attachDatabasePool;
} catch {
    // Không có @vercel/functions (dev local) → bỏ qua
}

// ============ Config ============
const MONGODB_URI =
    process.env.MONGODB_URI ||
    process.env.ATLAS_URL ||
    process.env.STORAGE_URL ||
    process.env.DATABASE_URL ||
    "";

const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "anytools";

const options: MongoClientOptions = {
    // Vercel serverless: giới hạn connection pool nhỏ (mặc định MongoDB driver = 100, quá nhiều cho serverless)
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 30_000,
    serverSelectionTimeoutMS: 5_000,
    connectTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
    retryWrites: true,
    retryReads: true,
};

// ============ Singleton Pattern (Vercel-style) ============
// Trong môi trường dev (hot reload), globalThis giữ lại client giữa các lần reload
// Trong production, mỗi serverless function instance chia sẻ 1 client duy nhất
declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
    // eslint-disable-next-line no-var
    var _mongoClient: MongoClient | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> | null {
    if (!MONGODB_URI) {
        console.warn("⚠️ [MongoDB] No MONGODB_URI configured. MongoDB operations will be skipped.");
        return null;
    }

    // Re-use existing promise from globalThis (survives hot reload in dev)
    if (process.env.NODE_ENV === "development") {
        if (!globalThis._mongoClientPromise) {
            const client = new MongoClient(MONGODB_URI, options);

            // Attach database pool management cho Vercel Functions
            if (attachDatabasePool) {
                attachDatabasePool(client);
            }

            globalThis._mongoClient = client;
            globalThis._mongoClientPromise = client.connect();
        }
        return globalThis._mongoClientPromise;
    }

    // Production: singleton per function instance
    if (!clientPromise) {
        const client = new MongoClient(MONGODB_URI, options);

        // Attach database pool management cho Vercel Functions
        if (attachDatabasePool) {
            attachDatabasePool(client);
        }

        clientPromise = client.connect();
    }

    return clientPromise;
}

/**
 * Lấy MongoDB Db instance. Trả về null nếu chưa cấu hình MONGODB_URI.
 */
export async function getDb(): Promise<Db | null> {
    const promise = getClientPromise();
    if (!promise) return null;

    try {
        const client = await promise;
        return client.db(MONGODB_DATABASE);
    } catch (err) {
        console.error("❌ [MongoDB] Connection failed:", (err as Error).message);

        // Reset promises để retry lần sau
        if (process.env.NODE_ENV === "development") {
            globalThis._mongoClientPromise = undefined;
            globalThis._mongoClient = undefined;
        } else {
            clientPromise = null;
        }

        return null;
    }
}

/**
 * Lấy raw MongoClient instance (cho trường hợp cần thao tác nâng cao).
 */
export async function getClient(): Promise<MongoClient | null> {
    const promise = getClientPromise();
    if (!promise) return null;

    try {
        return await promise;
    } catch (err) {
        console.error("❌ [MongoDB] Client connection failed:", (err as Error).message);
        return null;
    }
}

/**
 * Kiểm tra kết nối MongoDB có hoạt động không.
 */
export async function checkConnection(): Promise<boolean> {
    try {
        const db = await getDb();
        if (!db) return false;
        await db.command({ ping: 1 });
        return true;
    } catch {
        return false;
    }
}

export { MONGODB_URI, MONGODB_DATABASE };
