import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const SITE_HOST = "anytools.online";
const BASE_URL = `https://${SITE_HOST}`;
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "6d3e12248a4740dfab15f1fe5a51241a";
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

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

// Build URL list based on CLI arguments
function getUrlsToSubmit() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        // Submit all tools and main pages
        const tools = getAllToolSlugs();
        const locales = ["en", "vi"];
        const urls = [];

        locales.forEach((locale) => {
            urls.push(`${BASE_URL}/${locale}`);
            urls.push(`${BASE_URL}/${locale}/tools`);
            tools.forEach((tool) => {
                urls.push(`${BASE_URL}/${locale}/tools/${tool}`);
            });
        });

        // Add root pages & tools
        urls.push(`${BASE_URL}`);
        urls.push(`${BASE_URL}/tools`);
        tools.forEach((tool) => {
            urls.push(`${BASE_URL}/tools/${tool}`);
        });

        return urls;
    }

    const urls = [];
    for (const arg of args) {
        if (arg.startsWith("http://") || arg.startsWith("https://")) {
            urls.push(arg);
        } else {
            // Treat as tool slug
            const slug = arg.replace(/^\/?(tools\/)?/, "");
            urls.push(`${BASE_URL}/en/tools/${slug}`);
            urls.push(`${BASE_URL}/vi/tools/${slug}`);
            urls.push(`${BASE_URL}/tools/${slug}`);
        }
    }
    return urls;
}

function submitToEndpoint(endpoint, payload) {
    return new Promise((resolve, reject) => {
        const url = new URL(endpoint);
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
                    endpoint,
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    body,
                });
            });
        });

        req.on("error", (err) => reject({ endpoint, error: err }));
        req.write(data);
        req.end();
    });
}

async function main() {
    const urls = getUrlsToSubmit();
    console.log(`\n🚀 Submitting ${urls.length} URL(s) to IndexNow (Bing & Search Engines)...`);
    console.log(`🔑 Key: ${INDEXNOW_KEY}`);
    console.log(`📄 Key Location: ${KEY_LOCATION}\n`);

    if (urls.length <= 10) {
        console.log("URLs to submit:");
        urls.forEach((u) => console.log(`  - ${u}`));
        console.log("");
    } else {
        console.log(`Sample URLs (first 5 of ${urls.length}):`);
        urls.slice(0, 5).forEach((u) => console.log(`  - ${u}`));
        console.log("  ...\n");
    }

    const payload = {
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls,
    };

    const endpoints = [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow",
    ];

    for (const endpoint of endpoints) {
        try {
            const res = await submitToEndpoint(endpoint, payload);
            if (res.statusCode === 200 || res.statusCode === 202) {
                console.log(`✅ [${new URL(endpoint).hostname}] Success: ${res.statusCode} ${res.statusMessage}`);
            } else {
                console.warn(`⚠️ [${new URL(endpoint).hostname}] Response: ${res.statusCode} ${res.statusMessage} - ${res.body}`);
            }
        } catch (err) {
            console.error(`❌ [${new URL(endpoint).hostname}] Error:`, err.error?.message || err);
        }
    }

    console.log("\n🎉 IndexNow submission completed!\n");
}

main().catch(console.error);
