import fs from "fs";
import path from "path";
import crypto from "crypto";
import { TelemetryEvent, HandshakeSession, ExtensionId } from "./types";
import { MongoClient } from "mongodb";

const TELEMETRY_DIR = path.join(process.cwd(), "data", "telemetry");
const EVENTS_FILE_PATH = path.join(TELEMETRY_DIR, "events.json");

// In-memory cache for fast lookups & handshake sessions
const inMemorySessions = new Map<string, HandshakeSession>();
let inMemoryEvents: TelemetryEvent[] | null = null;

// MongoDB client instance
let mongoClient: MongoClient | null = null;
let mongoClientPromise: Promise<MongoClient> | null = null;

async function getMongoDb() {
    const uri = process.env.MONGODB_URI;
    if (!uri) return null;
    try {
        if (!mongoClientPromise) {
            mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
            mongoClientPromise = mongoClient.connect();
        }
        const client = await mongoClientPromise;
        const dbName = process.env.MONGODB_DATABASE || "anytools";
        return client.db(dbName);
    } catch (err) {
        console.warn("⚠️ [Telemetry Storage] MongoDB connect failed, using local file storage:", (err as Error).message);
        mongoClientPromise = null;
        return null;
    }
}

/**
 * Ensure storage directory and file exists
 */
function ensureStorage(): void {
    if (!fs.existsSync(TELEMETRY_DIR)) {
        fs.mkdirSync(TELEMETRY_DIR, { recursive: true });
    }
    if (!fs.existsSync(EVENTS_FILE_PATH)) {
        fs.writeFileSync(EVENTS_FILE_PATH, JSON.stringify([], null, 2), "utf8");
        inMemoryEvents = [];
    }
}

/**
 * Load all events from local file or MongoDB
 */
export async function getAllEvents(): Promise<TelemetryEvent[]> {
    if (inMemoryEvents && inMemoryEvents.length > 0) {
        return inMemoryEvents;
    }

    ensureStorage();

    // Try MongoDB first if configured
    try {
        const db = await getMongoDb();
        if (db) {
            const docs = await db
                .collection<TelemetryEvent>("telemetry_events")
                .find({})
                .sort({ createdAt: -1 })
                .limit(2000)
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

    // Fallback to local file
    try {
        const content = fs.readFileSync(EVENTS_FILE_PATH, "utf8");
        inMemoryEvents = JSON.parse(content) as TelemetryEvent[];
        return inMemoryEvents;
    } catch {
        return [];
    }
}

/**
 * Save a new telemetry event
 */
export async function saveTelemetryEvent(event: TelemetryEvent): Promise<void> {
    ensureStorage();

    const events = await getAllEvents();
    events.unshift(event);

    // Keep max 5000 in local file to avoid bloat
    if (events.length > 5000) {
        events.length = 5000;
    }
    inMemoryEvents = events;

    // Persist to local file
    try {
        fs.writeFileSync(EVENTS_FILE_PATH, JSON.stringify(events, null, 2), "utf8");
    } catch (err) {
        console.error("❌ [Telemetry Storage] Failed to write event to file:", err);
    }

    // Async write to MongoDB in background
    (async () => {
        try {
            const db = await getMongoDb();
            if (db) {
                await db.collection("telemetry_events").insertOne(event as any);
            }
        } catch (dbErr) {
            console.warn("⚠️ [Telemetry Storage] Mongo insert error:", (dbErr as Error).message);
        }
    })();
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
