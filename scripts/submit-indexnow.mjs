import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const SITE_HOST = "anytools.online";
const BASE_URL = `https://${SITE_HOST}`;
const INDEXNOW_KEY = "5a2585ce96c14ba49a1b2113563b56cd"
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Read tools from src/config/tools.ts
function getAllToolSlugs() {
    const toolsConfigPath = path.join(projectRoot, "src", "config", "tools.ts");
    if (!fs.existsSync(toolsConfigPath)) {
        console.warn("Could not find src/config/tools.ts, falling back to empty list");
        return [];
    }
    const content = fs.readFileSync(toolsConfigPath, "utf-8");
    const matches = [...content.matchAll(/href:\s*"\/tools\/([^"]+)"/g)];
    return [...new Set(matches.map((m) => m[1]))];
}

// Read tools updated recently (last 14 days)
function getRecentToolSlugs() {
    const toolsConfigPath = path.join(projectRoot, "src", "config", "tools.ts");
    if (!fs.existsSync(toolsConfigPath)) return [];
    const content = fs.readFileSync(toolsConfigPath, "utf-8");
    const regex = /href:\s*"\/tools\/([^"]+)"[\s\S]*?updatedAt:\s*"([^"]+)"/g;
    const slugs = [];
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    for (const match of content.matchAll(regex)) {
        const slug = match[1];
        const updatedAt = new Date(match[2]);
        if (!isNaN(updatedAt.getTime()) && updatedAt >= twoWeeksAgo) {
            slugs.push(slug);
        }
    }
    return [...new Set(slugs)];
}

// Submit a single URL via Streaming HTTP GET request (recommended by Bing / IndexNow)
function submitUrlStream(url) {
    return new Promise((resolve) => {
        const encodedUrl = encodeURIComponent(url);
        const encodedKeyLoc = encodeURIComponent(KEY_LOCATION);
        const endpoint = `https://www.bing.com/indexnow?url=${encodedUrl}&key=${INDEXNOW_KEY}&keyLocation=${encodedKeyLoc}`;

        https
            .get(endpoint, (res) => {
                let body = "";
                res.on("data", (chunk) => (body += chunk));
                res.on("end", () => {
                    resolve({
                        success: res.statusCode === 200 || res.statusCode === 202,
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        body,
                    });
                });
            })
            .on("error", (err) => {
                resolve({
                    success: false,
                    error: err.message,
                });
            });
    });
}

// Submit via Batch POST request
function submitBatch(urls) {
    return new Promise((resolve, reject) => {
        const endpoint = "https://www.bing.com/indexnow";
        const url = new URL(endpoint);
        const payload = {
            host: SITE_HOST,
            key: INDEXNOW_KEY,
            keyLocation: KEY_LOCATION,
            urlList: urls,
        };
        const data = JSON.stringify(payload);

        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": Buffer.byteLength(data),
            },
        };

        const req = https.request(options, (res) => {
            let body = "";
            res.on("data", (chunk) => (body += chunk));
            res.on("end", () => {
                resolve({
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    body,
                });
            });
        });

        req.on("error", (err) => reject(err));
        req.write(data);
        req.end();
    });
}

async function main() {
    const rawArgs = process.argv.slice(2);
    const isBatch = rawArgs.includes("--batch");
    const isAll = rawArgs.includes("--all");
    const isRecent = rawArgs.includes("--recent");
    const filteredArgs = rawArgs.filter((arg) => !arg.startsWith("--"));

    let targetUrls = [];

    if (filteredArgs.length > 0) {
        // Targeted URLs or slugs provided
        for (const arg of filteredArgs) {
            if (arg.startsWith("http://") || arg.startsWith("https://")) {
                targetUrls.push(arg);
            } else {
                const slug = arg.replace(/^\/?(tools\/)?/, "");
                targetUrls.push(`${BASE_URL}/en/tools/${slug}`);
                targetUrls.push(`${BASE_URL}/vi/tools/${slug}`);
            }
        }
    } else if (isRecent) {
        const recentSlugs = getRecentToolSlugs();
        console.log(`ℹ️ Found ${recentSlugs.length} recently updated tools.`);
        for (const slug of recentSlugs) {
            targetUrls.push(`${BASE_URL}/en/tools/${slug}`);
            targetUrls.push(`${BASE_URL}/vi/tools/${slug}`);
        }
    } else if (isAll) {
        const tools = getAllToolSlugs();
        const locales = ["en", "vi"];
        locales.forEach((locale) => {
            targetUrls.push(`${BASE_URL}/${locale}`);
            targetUrls.push(`${BASE_URL}/${locale}/browser-extensions`);
            targetUrls.push(`${BASE_URL}/${locale}/apps`);
            tools.forEach((tool) => {
                targetUrls.push(`${BASE_URL}/${locale}/tools/${tool}`);
            });
        });
    } else {
        // Default when no arguments are provided: submit recent tools in streaming mode
        const recentSlugs = getRecentToolSlugs();
        if (recentSlugs.length > 0) {
            console.log(`💡 No specific URL provided. Submitting ${recentSlugs.length} recently updated tools via Streaming mode.`);
            for (const slug of recentSlugs) {
                targetUrls.push(`${BASE_URL}/en/tools/${slug}`);
                targetUrls.push(`${BASE_URL}/vi/tools/${slug}`);
            }
        } else {
            console.log("\n📖 IndexNow Submission Tool");
            console.log("Usage:");
            console.log("  node scripts/submit-indexnow.mjs keyboard-tester        # Stream specific tool URLs (Recommended)");
            console.log("  node scripts/submit-indexnow.mjs https://...            # Stream specific URL");
            console.log("  node scripts/submit-indexnow.mjs --recent               # Stream recently updated tools");
            console.log("  node scripts/submit-indexnow.mjs --all                  # Stream all site URLs with throttle");
            console.log("  node scripts/submit-indexnow.mjs --all --batch          # Batch POST submit all URLs\n");
            return;
        }
    }

    targetUrls = [...new Set(targetUrls)];
    console.log(`\n🚀 IndexNow Mode: ${isBatch ? "BATCH" : "STREAMING (Recommended)"}`);
    console.log(`🔑 Key: ${INDEXNOW_KEY}`);
    console.log(`📄 Key Location: ${KEY_LOCATION}`);
    console.log(`📦 URLs to submit (${targetUrls.length}):`);
    targetUrls.forEach((u) => console.log(`   - ${u}`));
    console.log("");

    if (isBatch) {
        console.log("Submitting in batch mode...");
        try {
            const res = await submitBatch(targetUrls);
            console.log(`✅ Batch Response: ${res.statusCode} ${res.statusMessage}`);
        } catch (err) {
            console.error("❌ Batch submission failed:", err);
        }
    } else {
        console.log("Streaming URLs individually with throttle (prevents server overload)...");
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < targetUrls.length; i++) {
            const url = targetUrls[i];
            process.stdout.write(`[${i + 1}/${targetUrls.length}] Submitting ${url}... `);
            const res = await submitUrlStream(url);
            if (res.success) {
                console.log(`✅ (${res.statusCode || 200})`);
                successCount++;
            } else {
                console.log(`⚠️ (${res.statusCode || res.error || "Failed"})`);
                failCount++;
            }
            if (i < targetUrls.length - 1) {
                await sleep(250); // 250ms throttle between requests for smooth streaming
            }
        }

        console.log(`\n🎉 Streaming finished! Success: ${successCount}, Failures: ${failCount}\n`);
    }
}

main().catch(console.error);
