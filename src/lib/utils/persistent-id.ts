/**
 * Persistent Owner ID Storage
 *
 * Stores owner ID in multiple locations for maximum persistence:
 * - localStorage
 * - IndexedDB
 * - Cookie (HttpOnly không khả thi ở client, dùng regular cookie với long expiry)
 *
 * If any storage is cleared, it will be restored from others.
 */

import { OWNER_ID_KEY, COOKIE_EXPIRY_DAYS, DB_NAME, STORE_NAME } from "@/constants/persistent-id";

// ============ Cookie Functions ============

function setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    // SameSite=Lax for security, long expiry for persistence
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let c of ca) {
        c = c.trim();
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length);
        }
    }
    return null;
}

// ============ IndexedDB Functions ============

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "key" });
            }
        };
    });
}

async function setIndexedDB(key: string, value: string): Promise<void> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put({ key, value });

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.warn("IndexedDB write failed:", error);
    }
}

async function getIndexedDB(key: string): Promise<string | null> {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                resolve(request.result?.value || null);
            };

            transaction.oncomplete = () => db.close();
        });
    } catch (error) {
        console.warn("IndexedDB read failed:", error);
        return null;
    }
}

// ============ Multi-Storage Owner ID ============

/**
 * Get or create persistent owner ID
 * Checks all storage locations and syncs them
 */
export async function getPersistentOwnerId(): Promise<string> {
    // Try to get from all sources
    const fromLocalStorage = localStorage.getItem(OWNER_ID_KEY);
    const fromCookie = getCookie(OWNER_ID_KEY);
    const fromIndexedDB = await getIndexedDB(OWNER_ID_KEY);

    // Find the first available ID
    const existingId = fromLocalStorage || fromCookie || fromIndexedDB;

    if (existingId) {
        // Sync to all storage locations
        await syncOwnerIdToAll(existingId);
        return existingId;
    }

    // Generate new ID and save everywhere
    const newId = crypto.randomUUID();
    await syncOwnerIdToAll(newId);
    return newId;
}

/**
 * Sync owner ID to all storage locations
 */
async function syncOwnerIdToAll(id: string): Promise<void> {
    // Save to localStorage
    try {
        localStorage.setItem(OWNER_ID_KEY, id);
    } catch (e) {
        console.warn("localStorage save failed:", e);
    }

    // Save to cookie
    try {
        setCookie(OWNER_ID_KEY, id, COOKIE_EXPIRY_DAYS);
    } catch (e) {
        console.warn("Cookie save failed:", e);
    }

    // Save to IndexedDB
    try {
        await setIndexedDB(OWNER_ID_KEY, id);
    } catch (e) {
        console.warn("IndexedDB save failed:", e);
    }
}

/**
 * Check if owner ID exists in any storage
 */
export function hasOwnerId(): boolean {
    return !!(localStorage.getItem(OWNER_ID_KEY) || getCookie(OWNER_ID_KEY));
}
