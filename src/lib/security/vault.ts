import crypto from "crypto";
import fs from "fs";
import path from "path";

/**
 * Vault File Location on Server
 * Stored inside data/vault/ which is strictly listed in .gitignore
 * and never tracked or exposed publicly on GitHub.
 */
const VAULT_DIR = path.join(process.cwd(), "data", "vault");
const VAULT_FILE_PATH = path.join(VAULT_DIR, "admin-credentials.enc");

// Global transient key in case ADMIN_VAULT_SECRET is not configured in .env
declare global {
    var _transientVaultSecret: string | undefined;
}

/**
 * Master Secret Key used for AES-256-GCM encryption.
 * Retrieved strictly from private server environment (process.env.ADMIN_VAULT_SECRET).
 * ZERO secrets or default passwords exist in public source code.
 */
function getMasterSecret(): string {
    const envSecret = process.env.ADMIN_VAULT_SECRET;
    if (envSecret && envSecret.trim().length >= 16) {
        return envSecret.trim();
    }

    // Ephemeral random secret if not set in server environment
    if (!global._transientVaultSecret) {
        global._transientVaultSecret = crypto.randomBytes(32).toString("hex");
    }
    return global._transientVaultSecret;
}

export interface EncryptedBlob {
    version: number;
    algorithm: "aes-256-gcm";
    iv: string; // hex
    authTag: string; // hex
    salt: string; // hex
    ciphertext: string; // hex
}

export interface AdminCredentials {
    username: string;
    passwordHash: string; // PBKDF2 hash (hex)
    salt: string; // hex
    createdAt: string;
    lastLoginAt?: string;
    role: "super_admin";
    allowedIps?: string[];
}

/**
 * Derive 256-bit key using PBKDF2
 */
function deriveKey(secret: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(secret, salt, 100000, 32, "sha256");
}

/**
 * Encrypt arbitrary string data with AES-256-GCM
 */
export function encryptData(plainText: string, masterKeyString?: string): EncryptedBlob {
    const secret = masterKeyString || getMasterSecret();
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
    const key = deriveKey(secret, salt);

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    let ciphertext = cipher.update(plainText, "utf8", "hex");
    ciphertext += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    return {
        version: 1,
        algorithm: "aes-256-gcm",
        iv: iv.toString("hex"),
        authTag: authTag,
        salt: salt.toString("hex"),
        ciphertext: ciphertext,
    };
}

/**
 * Decrypt AES-256-GCM encrypted blob
 */
export function decryptData(blob: EncryptedBlob, masterKeyString?: string): string {
    const secret = masterKeyString || getMasterSecret();
    const salt = Buffer.from(blob.salt, "hex");
    const iv = Buffer.from(blob.iv, "hex");
    const authTag = Buffer.from(blob.authTag, "hex");
    const key = deriveKey(secret, salt);

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(blob.ciphertext, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

/**
 * Hash a password using PBKDF2 with a random salt
 */
export function hashPassword(password: string, providedSalt?: string): { hash: string; salt: string } {
    const salt = providedSalt ? Buffer.from(providedSalt, "hex") : crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
    return {
        hash,
        salt: salt.toString("hex"),
    };
}

/**
 * Verify a password using timing-safe comparison to prevent side-channel timing attacks
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
    const { hash } = hashPassword(password, salt);
    const hashBuf = Buffer.from(hash, "hex");
    const storedBuf = Buffer.from(storedHash, "hex");
    if (hashBuf.length !== storedBuf.length) {
        return false;
    }
    return crypto.timingSafeEqual(hashBuf, storedBuf);
}

/**
 * Timing-safe string comparison using SHA-256 digests.
 * Digests are always 32 bytes, preventing timing side-channel attacks and length leakage.
 */
function safeStringCompare(a: string, b: string): boolean {
    const hashA = crypto.createHash("sha256").update(a).digest();
    const hashB = crypto.createHash("sha256").update(b).digest();
    return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Initialize or retrieve the single Admin Credentials.
 * Credentials are read dynamically from server environment variables:
 * - VERCEL_ADMIN_VAULT_USERNAME / ADMIN_VAULT_USERNAME
 * - VERCEL_ADMIN_VAULT_PASSWORD / ADMIN_VAULT_PASSWORD
 * On serverless platforms (e.g. Vercel), disk writes are read-only (EROFS), so in-memory fallback is strictly handled.
 */
export async function getOrInitAdminCredentials(): Promise<AdminCredentials> {
    const envUser = process.env.ADMIN_VAULT_USERNAME?.trim() || "vault_admin";
    const envPass = process.env.ADMIN_VAULT_PASSWORD?.trim() || crypto.randomBytes(16).toString("hex");

    if (!fs.existsSync(VAULT_FILE_PATH)) {
        const { hash, salt } = hashPassword(envPass);
        const initialCreds: AdminCredentials = {
            username: envUser,
            passwordHash: hash,
            salt: salt,
            createdAt: new Date().toISOString(),
            role: "super_admin",
            allowedIps: ["*"],
        };

        try {
            if (!fs.existsSync(VAULT_DIR)) {
                fs.mkdirSync(VAULT_DIR, { recursive: true });
            }
            const encrypted = encryptData(JSON.stringify(initialCreds));
            fs.writeFileSync(VAULT_FILE_PATH, JSON.stringify(encrypted, null, 2), "utf8");
        } catch {
            // Read-only filesystem in serverless environments (e.g. Vercel)
            // Silently continue with in-memory credentials derived from env
        }

        return initialCreds;
    }

    // Read and decrypt existing credentials from local file
    try {
        const fileContent = fs.readFileSync(VAULT_FILE_PATH, "utf8");
        const blob: EncryptedBlob = JSON.parse(fileContent);
        const decryptedJson = decryptData(blob);
        return JSON.parse(decryptedJson) as AdminCredentials;
    } catch (error) {
        console.error("⚠️ [Admin Vault] Could not read vault file, falling back to environment credentials:", error);
        const { hash, salt } = hashPassword(envPass);
        return {
            username: envUser,
            passwordHash: hash,
            salt: salt,
            createdAt: new Date().toISOString(),
            role: "super_admin",
            allowedIps: ["*"],
        };
    }
}

/**
 * Update Admin Credentials (e.g. record last login timestamp).
 * Safely ignores file write failures on serverless read-only platforms.
 */
export async function saveAdminCredentials(creds: AdminCredentials): Promise<void> {
    try {
        if (!fs.existsSync(VAULT_DIR)) {
            fs.mkdirSync(VAULT_DIR, { recursive: true });
        }
        const encrypted = encryptData(JSON.stringify(creds));
        fs.writeFileSync(VAULT_FILE_PATH, JSON.stringify(encrypted, null, 2), "utf8");
    } catch {
        // Read-only filesystem on serverless platforms (e.g. Vercel), safely ignore
    }
}

/**
 * Check if the given login attempt matches the single master admin.
 * First checks directly against environment variables (fast, resilient, serverless-friendly),
 * then falls back to encrypted vault storage.
 */
export async function validateAdminLogin(username: string, password: string): Promise<boolean> {
    try {
        const envUser = process.env.ADMIN_VAULT_USERNAME?.trim();
        const envPass = process.env.ADMIN_VAULT_PASSWORD?.trim();

        // 1. Direct environment variable validation (Ideal for Serverless / Vercel)
        if (envUser && envPass) {
            const isUserValid = safeStringCompare(username.trim(), envUser);
            const isPassValid = safeStringCompare(password, envPass);

            if (isUserValid && isPassValid) {
                // Update credentials timestamp in background if filesystem is writable
                try {
                    const creds = await getOrInitAdminCredentials();
                    creds.lastLoginAt = new Date().toISOString();
                    await saveAdminCredentials(creds);
                } catch {
                    // Ignore on read-only environments
                }
                return true;
            }
            return false;
        }

        // 2. Fallback to encrypted file vault (for local development or file-based deployments)
        const creds = await getOrInitAdminCredentials();
        if (!safeStringCompare(username.trim(), creds.username.trim())) {
            return false;
        }
        const isValid = verifyPassword(password, creds.passwordHash, creds.salt);
        if (isValid) {
            try {
                creds.lastLoginAt = new Date().toISOString();
                await saveAdminCredentials(creds);
            } catch {
                // Ignore read-only write failures
            }
        }
        return isValid;
    } catch (err) {
        console.error("❌ [Admin Vault] Login validation error:", err);
        return false;
    }
}

/**
 * Vault Rotation Interval: 60 seconds (1 minute)
 * Each 1-minute window generates a completely unique cryptographically secure slug.
 * Any URL visited 1 minute later will immediately return 404 Not Found.
 */
export const VAULT_ROTATION_INTERVAL_SECONDS = 60;

/**
 * Derives a dynamic vault slug for a given discrete 60-second time step.
 * Uses HMAC-SHA256 with the master private secret.
 * Output is 24 hex characters (96 bits of entropy) with "vlt-" prefix.
 */
export function calculateVaultSlug(secret: string, step: number): string {
    const hash = crypto
        .createHmac("sha256", secret)
        .update(`vault_1m_step_${step}`)
        .digest("hex");
    return `vlt-${hash.slice(0, 24)}`;
}

/**
 * Generates the current valid dynamic route slug for this 60-second window.
 * Mathematically derived from UTC Epoch time (timezone-invariant worldwide).
 */
export function getVaultSecretSlug(timestampMs: number = Date.now()): string {
    const secret = getMasterSecret();
    const currentStep = Math.floor(timestampMs / 1000 / VAULT_ROTATION_INTERVAL_SECONDS);
    return calculateVaultSlug(secret, currentStep);
}

/**
 * Validates if the requested route slug matches the current 60-second time window.
 * - Accepts current 60s step (t)
 * - Accepts immediate previous 60s step (t - 1) as brief grace period for click transmission
 * - Any slug older than ~60 seconds is strictly rejected with 404.
 * - Uses constant-time comparison (crypto.timingSafeEqual) to prevent timing side-channel attacks.
 */
export function isVaultSlugValid(slug: string): boolean {
    if (!slug || typeof slug !== "string" || slug.length < 8) {
        return false;
    }

    const secret = getMasterSecret();
    // UTC Epoch seconds is globally identical regardless of server or client timezone
    const nowSec = Math.floor(Date.now() / 1000);
    const currentStep = Math.floor(nowSec / VAULT_ROTATION_INTERVAL_SECONDS);

    const inputBuf = Buffer.from(slug);

    // Strictly check current (t) and previous (t-1) 60-second windows only
    const validSteps = [currentStep, currentStep - 1];
    for (const step of validSteps) {
        const expected = calculateVaultSlug(secret, step);
        const expBuf = Buffer.from(expected);
        if (inputBuf.length === expBuf.length && crypto.timingSafeEqual(inputBuf, expBuf)) {
            return true;
        }
    }

    // Optional legacy fallback if ADMIN_VAULT_SLUG is explicitly set and not 'dynamic'
    const customSlug = process.env.ADMIN_VAULT_SLUG;
    if (customSlug && customSlug.trim().length >= 8 && customSlug.trim().toLowerCase() !== "dynamic") {
        const staticBuf = Buffer.from(customSlug.trim());
        if (inputBuf.length === staticBuf.length && crypto.timingSafeEqual(inputBuf, staticBuf)) {
            return true;
        }
    }

    return false;
}

/**
 * Ephemeral In-Tab Session Token
 * Bound to the specific browser tab where the valid 1-minute URL was unlocked.
 * Stored in memory / component state so the tab continues to operate uninterrupted
 * even though the original entrance URL has already expired.
 */
interface TabSessionPayload {
    jti: string;
    iat: number;
    exp: number;
}

export function createTabSessionToken(): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: TabSessionPayload = {
        jti: crypto.randomBytes(16).toString("hex"),
        iat: now,
        exp: now + 12 * 3600, // Valid for active working session in the opened tab
    };
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const sig = crypto
        .createHmac("sha256", getMasterSecret())
        .update(`tab_sess_${payloadB64}`)
        .digest("base64url");
    return `${payloadB64}.${sig}`;
}

export function verifyTabSessionToken(token: string | undefined | null): boolean {
    if (!token || typeof token !== "string" || !token.includes(".")) {
        return false;
    }
    try {
        const [payloadB64, sig] = token.split(".");
        if (!payloadB64 || !sig) return false;

        const expectedSig = crypto
            .createHmac("sha256", getMasterSecret())
            .update(`tab_sess_${payloadB64}`)
            .digest("base64url");

        const sigBuf = Buffer.from(sig);
        const expBuf = Buffer.from(expectedSig);
        if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
            return false;
        }

        const payload: TabSessionPayload = JSON.parse(
            Buffer.from(payloadB64, "base64url").toString("utf8")
        );
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

/**
 * Returns dynamic vault rotation metadata:
 * - Current slug
 * - Remaining seconds in the current 60s window
 * - Next rotation ISO timestamp
 */
export function getVaultRotationInfo(timestampMs: number = Date.now()) {
    const nowSec = Math.floor(timestampMs / 1000);
    const currentStep = Math.floor(nowSec / VAULT_ROTATION_INTERVAL_SECONDS);
    const nextRotationTimestamp = (currentStep + 1) * VAULT_ROTATION_INTERVAL_SECONDS * 1000;
    const remainingSeconds = Math.max(0, Math.floor((nextRotationTimestamp - timestampMs) / 1000));
    const secret = getMasterSecret();

    return {
        currentStep,
        currentSlug: calculateVaultSlug(secret, currentStep),
        previousSlug: calculateVaultSlug(secret, currentStep - 1),
        remainingSeconds,
        nextRotationAt: new Date(nextRotationTimestamp).toISOString(),
    };
}

/**
 * Session Token Management (HMAC signed session payload)
 */
const SESSION_COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE || "__vlt_sess_token";
export { SESSION_COOKIE_NAME };

interface SessionPayload {
    sub: string;
    iat: number;
    exp: number;
    jti: string;
}

export function createAdminSessionToken(durationHours: number = 8): string {
    const now = Math.floor(Date.now() / 1000);
    const payload: SessionPayload = {
        sub: process.env.ADMIN_VAULT_USERNAME || "master_admin",
        iat: now,
        exp: now + durationHours * 3600,
        jti: crypto.randomBytes(16).toString("hex"),
    };
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto
        .createHmac("sha256", getMasterSecret())
        .update(payloadB64)
        .digest("base64url");

    return `${payloadB64}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
    if (!token || typeof token !== "string" || !token.includes(".")) {
        return false;
    }
    try {
        const [payloadB64, signature] = token.split(".");
        if (!payloadB64 || !signature) return false;

        const expectedSig = crypto
            .createHmac("sha256", getMasterSecret())
            .update(payloadB64)
            .digest("base64url");

        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expectedSig);
        if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
            return false;
        }

        const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}
