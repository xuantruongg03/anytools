import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getMock, isStorageConfigured } from "@/lib/mock-storage";

// Note: This shares data with the main mock-api route
// Supports MongoDB, Upstash Redis, or in-memory storage

// Dynamic data generators (same as in main route)
const dynamicPlaceholders: Record<string, () => string | number> = {
    "{{uuid}}": () => uuidv4(),
    "{{timestamp}}": () => Date.now(),
    "{{datetime}}": () => new Date().toISOString(),
    "{{random.number}}": () => Math.floor(Math.random() * 1000) + 1,
    "{{random.boolean}}": () => (Math.random() > 0.5 ? "true" : "false"),
    "{{faker.name}}": () => {
        const firstNames = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah"];
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    },
    "{{faker.firstName}}": () => {
        const names = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona", "George", "Hannah"];
        return names[Math.floor(Math.random() * names.length)];
    },
    "{{faker.lastName}}": () => {
        const names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
        return names[Math.floor(Math.random() * names.length)];
    },
    "{{faker.email}}": () => {
        const names = ["john", "jane", "alice", "bob", "charlie", "user", "test", "demo", "admin", "dev"];
        const domains = ["gmail.com", "yahoo.com", "hotmail.com", "example.com", "test.com"];
        return `${names[Math.floor(Math.random() * names.length)]}${Math.floor(Math.random() * 1000)}@${domains[Math.floor(Math.random() * domains.length)]}`;
    },
    "{{faker.avatar}}": () => `https://i.pravatar.cc/150?u=${Math.floor(Math.random() * 1000)}`,
    "{{faker.phone}}": () => `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    "{{faker.address}}": () => {
        const streets = ["Main St", "Oak Ave", "Park Blvd", "First St", "Second Ave", "Elm St", "Pine Rd", "Maple Dr"];
        const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"];
        return `${Math.floor(Math.random() * 9999) + 1} ${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}`;
    },
    "{{faker.company}}": () => {
        const prefixes = ["Global", "Tech", "Digital", "Cloud", "Smart", "Future", "Next", "Prime"];
        const suffixes = ["Solutions", "Systems", "Technologies", "Innovations", "Services", "Labs", "Corp", "Inc"];
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
    },
    "{{faker.lorem.sentence}}": () => {
        const sentences = ["The quick brown fox jumps over the lazy dog.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "Technology is the campfire around which we tell our stories.", "Innovation distinguishes between a leader and a follower.", "The only way to do great work is to love what you do."];
        return sentences[Math.floor(Math.random() * sentences.length)];
    },
    "{{faker.lorem.paragraph}}": () => {
        const paragraphs = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."];
        return paragraphs[Math.floor(Math.random() * paragraphs.length)];
    },
    "{{faker.image}}": () => `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/400/300`,
    "{{faker.color}}": () => {
        const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan", "magenta", "teal"];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    "{{faker.hexColor}}": () =>
        `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
    "{{faker.url}}": () => `https://example.com/${Math.random().toString(36).substring(7)}`,
    "{{faker.username}}": () => {
        const adjectives = ["cool", "super", "mega", "ultra", "pro", "elite", "epic", "awesome"];
        const nouns = ["coder", "dev", "hacker", "ninja", "wizard", "master", "guru", "pro"];
        return `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 999)}`;
    },
};

// Replace dynamic placeholders in response body
function replaceDynamicPlaceholders(body: string): string {
    let result = body;
    for (const [placeholder, generator] of Object.entries(dynamicPlaceholders)) {
        while (result.includes(placeholder)) {
            result = result.replace(placeholder, String(generator()));
        }
    }
    return result;
}

// In-memory storage (shared with main route - in production use database)
// This is a simplified version - the actual mock data would be fetched from database
interface MockApiData {
    id: string;
    name: string;
    description: string;
    endpoint: string;
    method: string;
    responseBody: string;
    statusCode: number;
    delay: number;
    headers: Record<string, string>;
    isShared: boolean;
    ownerId: string;
    authType: "none" | "apiKey" | "bearer";
    authValue: string;
    rateLimit: number;
    requestCount: number;
    lastUsed: number;
    createdAt: number;
    expiresAt: number;
}

// Demo mock data store - In production, this would be connected to a database
const demoMockStore = new Map<string, MockApiData>();

// Initialize with some demo data
function initDemoData() {
    if (demoMockStore.size === 0) {
        const now = Date.now();
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

        // Demo user API
        demoMockStore.set("demo-users", {
            id: "demo-users",
            name: "Demo Users API",
            description: "Returns a list of demo users",
            endpoint: "/users",
            method: "GET",
            responseBody: JSON.stringify(
                {
                    users: [
                        { id: "{{uuid}}", name: "{{faker.name}}", email: "{{faker.email}}", avatar: "{{faker.avatar}}" },
                        { id: "{{uuid}}", name: "{{faker.name}}", email: "{{faker.email}}", avatar: "{{faker.avatar}}" },
                        { id: "{{uuid}}", name: "{{faker.name}}", email: "{{faker.email}}", avatar: "{{faker.avatar}}" },
                    ],
                    total: 3,
                    timestamp: "{{datetime}}",
                },
                null,
                2
            ),
            statusCode: 200,
            delay: 100,
            headers: { "Content-Type": "application/json" },
            isShared: true,
            ownerId: "demo",
            authType: "none",
            authValue: "",
            rateLimit: 0,
            requestCount: 0,
            lastUsed: now,
            createdAt: now,
            expiresAt: now + thirtyDaysMs,
        });

        // Demo products API
        demoMockStore.set("demo-products", {
            id: "demo-products",
            name: "Demo Products API",
            description: "Returns a list of demo products",
            endpoint: "/products",
            method: "GET",
            responseBody: JSON.stringify(
                {
                    products: [
                        { id: "{{uuid}}", name: "Product {{random.number}}", price: "{{random.number}}", image: "{{faker.image}}" },
                        { id: "{{uuid}}", name: "Product {{random.number}}", price: "{{random.number}}", image: "{{faker.image}}" },
                    ],
                    timestamp: "{{datetime}}",
                },
                null,
                2
            ),
            statusCode: 200,
            delay: 0,
            headers: { "Content-Type": "application/json" },
            isShared: true,
            ownerId: "demo",
            authType: "none",
            authValue: "",
            rateLimit: 0,
            requestCount: 0,
            lastUsed: now,
            createdAt: now,
            expiresAt: now + thirtyDaysMs,
        });
    }
}

// Handler for dynamic mock API routes
async function handleMockRequest(request: NextRequest, mockId: string) {
    initDemoData();

    // Try to get mock from storage (MongoDB/Upstash) first, then demo store
    let mock: MockApiData | null = null;

    if (isStorageConfigured()) {
        const storedMock = await getMock(mockId);
        if (storedMock) {
            // Convert StoredMockApi to MockApiData format
            mock = {
                id: storedMock.id,
                name: storedMock.name,
                description: storedMock.description || "",
                endpoint: `/${storedMock.id}`,
                method: storedMock.method,
                responseBody: storedMock.jsonTemplate,
                statusCode: storedMock.statusCode,
                delay: storedMock.delay,
                headers: { "Content-Type": "application/json" },
                isShared: true,
                ownerId: "user",
                authType: "none",
                authValue: "",
                rateLimit: 0,
                requestCount: 0,
                lastUsed: Date.now(),
                createdAt: new Date(storedMock.createdAt).getTime(),
                expiresAt: storedMock.expiresAt ? new Date(storedMock.expiresAt).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000,
            };
        }
    }

    // Fallback to demo store
    if (!mock) {
        mock = demoMockStore.get(mockId) || null;
    }

    if (!mock) {
        return NextResponse.json({ error: "Mock API not found", mockId }, { status: 404 });
    }

    // Check if expired
    if (mock.expiresAt < Date.now()) {
        return NextResponse.json({ error: "Mock API has expired" }, { status: 410 });
    }

    // Check authentication
    if (mock.authType !== "none") {
        const authHeader = request.headers.get("Authorization");
        const apiKeyHeader = request.headers.get("X-API-Key");

        if (mock.authType === "bearer") {
            if (!authHeader || authHeader !== `Bearer ${mock.authValue}`) {
                return NextResponse.json({ error: "Unauthorized - Invalid or missing Bearer token" }, { status: 401 });
            }
        } else if (mock.authType === "apiKey") {
            if (!apiKeyHeader || apiKeyHeader !== mock.authValue) {
                return NextResponse.json({ error: "Unauthorized - Invalid or missing API key" }, { status: 401 });
            }
        }
    }

    // Check method
    if (mock.method !== request.method) {
        return NextResponse.json({ error: `Method ${request.method} not allowed. Expected ${mock.method}` }, { status: 405 });
    }

    // Apply delay
    if (mock.delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, mock.delay));
    }

    // Update stats
    mock.requestCount++;
    mock.lastUsed = Date.now();
    demoMockStore.set(mockId, mock);

    // Process response body with dynamic placeholders
    const processedBody = replaceDynamicPlaceholders(mock.responseBody);

    let responseData;
    try {
        responseData = JSON.parse(processedBody);
    } catch {
        responseData = processedBody;
    }

    // Build response headers
    const responseHeaders = new Headers();
    for (const [key, value] of Object.entries(mock.headers)) {
        responseHeaders.set(key, value);
    }

    // Add CORS headers
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");

    return NextResponse.json(responseData, {
        status: mock.statusCode,
        headers: responseHeaders,
    });
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
            "Access-Control-Max-Age": "86400",
        },
    });
}

// Handle all HTTP methods
export async function GET(request: NextRequest, { params }: { params: Promise<{ mockId: string }> }) {
    const { mockId } = await params;
    return handleMockRequest(request, mockId);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ mockId: string }> }) {
    const { mockId } = await params;
    return handleMockRequest(request, mockId);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ mockId: string }> }) {
    const { mockId } = await params;
    return handleMockRequest(request, mockId);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ mockId: string }> }) {
    const { mockId } = await params;
    return handleMockRequest(request, mockId);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ mockId: string }> }) {
    const { mockId } = await params;
    return handleMockRequest(request, mockId);
}
