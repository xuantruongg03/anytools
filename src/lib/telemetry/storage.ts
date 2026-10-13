import fs from "fs";
import path from "path";
import crypto from "crypto";
import { TelemetryEvent, HandshakeSession, ExtensionId } from "./types";
import { getDb } from "@/lib/db/mongodb";

import os from "os";

// Dùng /tmp trên môi trường serverless (Vercel) để tránh lỗi EROFS / ENOENT trên /var/task
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const TELEMETRY_DIR = isServerless
    ? path.join(os.tmpdir(), "anytools_telemetry")
    : path.join(process.cwd(), "data", "telemetry");
const EVENTS_FILE_PATH = path.join(TELEMETRY_DIR, "events.json");

// In-memory cache for fast lookups & handshake sessions
const inMemorySessions = new Map<string, HandshakeSession>();
let inMemoryEvents: TelemetryEvent[] | null = null;

// Telemetry indexes ensured flag
let telemetryIndexesEnsured = false;

/**
 * Lấy MongoDB Db instance từ module trung tâm (@/lib/db/mongodb)
 * và đảm bảo indexes cho telemetry_events collection.
 * Sử dụng Vercel-optimized connection pool (attachDatabasePool).
 */
export async function getMongoDb() {
    try {
        const db = await getDb();
        if (!db) return null;

        // Ensure indexes 1 lần duy nhất per process
        if (!telemetryIndexesEnsured) {
            db.collection("telemetry_events").createIndex({ createdAt: -1 }).catch(() => {});
            db.collection("telemetry_events").createIndex({ clientUserId: 1 }).catch(() => {});
            db.collection("telemetry_events").createIndex({ action: 1 }).catch(() => {});
            telemetryIndexesEnsured = true;
        }
        return db;
    } catch (err) {
        console.warn("⚠️ [Telemetry Storage] MongoDB connect failed, using local file storage:", (err as Error).message);
        return null;
    }
}

/**
 * Ensure storage directory and file exists (safe for serverless)
 */
function ensureStorage(): void {
    try {
        if (!fs.existsSync(TELEMETRY_DIR)) {
            fs.mkdirSync(TELEMETRY_DIR, { recursive: true });
        }
        if (!fs.existsSync(EVENTS_FILE_PATH)) {
            fs.writeFileSync(EVENTS_FILE_PATH, JSON.stringify([], null, 2), "utf8");
            inMemoryEvents = [];
        }
    } catch {
        // Read-only filesystem trên serverless (Vercel) -> an toàn bỏ qua và dùng MongoDB/in-memory
    }
}

/**
 * Load all events from MongoDB first, then fallback to local file
 */
export async function getAllEvents(): Promise<TelemetryEvent[]> {
    if (inMemoryEvents && inMemoryEvents.length > 0) {
        return inMemoryEvents;
    }

    // 1. Thử lấy từ MongoDB (Nguồn chính trên Vercel)
    try {
        const db = await getMongoDb();
        if (db) {
            const docs = await db
                .collection<TelemetryEvent>("telemetry_events")
                .find({})
                .sort({ createdAt: -1 })
                .limit(5000)
                .toArray();
            if (docs.length > 0) {
                inMemoryEvents = docs.map((d) => {
                    const { _id, ...rest } = d as any;
                    return rest as TelemetryEvent;
                });
                return inMemoryEvents;
            }
        }
    } catch (e) {
        console.warn("⚠️ [Telemetry Storage] Mongo query error:", (e as Error).message);
    }

    // 2. Fallback sang file cục bộ nếu có
    try {
        ensureStorage();
        if (fs.existsSync(EVENTS_FILE_PATH)) {
            const content = fs.readFileSync(EVENTS_FILE_PATH, "utf8");
            inMemoryEvents = JSON.parse(content) as TelemetryEvent[];
            return inMemoryEvents;
        }
    } catch {
        // Bỏ qua lỗi đọc file trên môi trường serverless
    }

    return inMemoryEvents || [];
}

/**
 * Save a new telemetry event: MongoDB là chính thức, file cục bộ là cache dự phòng
 */
export async function saveTelemetryEvent(event: TelemetryEvent): Promise<void> {
    // 1. Ghi trực tiếp vào MongoDB (Primary - Await để không bị Vercel kill lambda)
    try {
        const db = await getMongoDb();
        if (db) {
            await db.collection("telemetry_events").insertOne(event as any);
        }
    } catch (dbErr) {
        console.warn("⚠️ [Telemetry Storage] Mongo insert error:", (dbErr as Error).message);
    }

    // 2. Cập nhật In-memory cache
    if (inMemoryEvents) {
        inMemoryEvents.unshift(event);
        if (inMemoryEvents.length > 5000) {
            inMemoryEvents.length = 5000;
        }
    }

    // 3. Dự phòng file cục bộ (bọc try-catch không để crash trên Vercel)
    try {
        ensureStorage();
        if (fs.existsSync(TELEMETRY_DIR) && inMemoryEvents) {
            fs.writeFileSync(EVENTS_FILE_PATH, JSON.stringify(inMemoryEvents.slice(0, 500), null, 2), "utf8");
        }
    } catch {
        // An toàn bỏ qua trên môi trường Vercel read-only
    }
}

/**
 * Handshake Session Management (In-Memory + TTL 15 mins)
 */
export function createHandshakeSession(session: HandshakeSession): void {
    inMemorySessions.set(session.sessionNonce, session);
    // Auto cleanup expired
    if (inMemorySessions.size > 2000) {
        const now = Date.now();
        for (const [nonce, s] of inMemorySessions.entries()) {
            if (s.expiresAt < now) {
                inMemorySessions.delete(nonce);
            }
        }
    }
}

export function getHandshakeSession(sessionNonce: string): HandshakeSession | undefined {
    const session = inMemorySessions.get(sessionNonce);
    if (!session) return undefined;
    if (session.expiresAt < Date.now()) {
        inMemorySessions.delete(sessionNonce);
        return undefined;
    }
    return session;
}

export function consumeHandshakeSession(sessionNonce: string): HandshakeSession | undefined {
    const session = getHandshakeSession(sessionNonce);
    if (session) {
        inMemorySessions.delete(sessionNonce);
    }
    return session;
}
