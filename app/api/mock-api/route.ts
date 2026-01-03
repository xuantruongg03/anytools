import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { saveMock, getMock, deleteMock, isStorageConfigured, StoredMockApi } from "@/lib/mock-storage";

// Fallback in-memory storage (used when no storage configured)
const mockApisStore = new Map<string, MockApiData>();

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

// Dynamic data generators
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
        const paragraphs = [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
        ];
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
        const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
        // Replace each occurrence individually to get different values
        while (result.includes(placeholder)) {
            result = result.replace(placeholder, String(generator()));
        }
    }
    return result;
}

// Validate mock API data
function validateMockData(data: Partial<MockApiData>): string | null {
    if (!data.name || data.name.trim().length === 0) {
        return "Name is required";
    }
    if (!data.endpoint || data.endpoint.trim().length === 0) {
        return "Endpoint is required";
    }
    if (!data.endpoint.startsWith("/")) {
        return "Endpoint must start with /";
    }
    if (!data.method || !["GET", "POST", "PUT", "DELETE", "PATCH"].includes(data.method)) {
        return "Invalid HTTP method";
    }
    if (data.responseBody) {
        try {
            JSON.parse(data.responseBody);
        } catch {
            return "Invalid JSON in response body";
        }
    }
    if (data.statusCode && (data.statusCode < 100 || data.statusCode > 599)) {
        return "Invalid status code";
    }
    if (data.delay && (data.delay < 0 || data.delay > 30000)) {
        return "Delay must be between 0 and 30000 ms";
    }
    return null;
}

// GET - List all mock APIs or get a specific one
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const ownerId = searchParams.get("ownerId");
        const shared = searchParams.get("shared");

        if (id) {
            const mock = mockApisStore.get(id);
            if (!mock) {
                return NextResponse.json({ error: "Mock API not found" }, { status: 404 });
            }
            return NextResponse.json(mock);
        }

        let mocks = Array.from(mockApisStore.values());

        if (ownerId) {
            mocks = mocks.filter((m) => m.ownerId === ownerId);
        }

        if (shared === "true") {
            mocks = mocks.filter((m) => m.isShared);
        }

        // Sort by created date descending
        mocks.sort((a, b) => b.createdAt - a.createdAt);

        return NextResponse.json({ mocks, total: mocks.length });
    } catch (error) {
        console.error("GET /api/mock-api error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Create a new mock API
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        const validationError = validateMockData(data);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        // Use provided ID or generate new one
        const id = data.id || uuidv4();
        const now = Date.now();
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

        const mockApi: MockApiData = {
            id,
            name: data.name.trim(),
            description: data.description?.trim() || "",
            endpoint: data.endpoint.trim(),
            method: data.method.toUpperCase(),
            responseBody: data.responseBody || '{"message": "Hello from Anytools, this is Mock API!"}',
            statusCode: data.statusCode || 200,
            delay: data.delay || 0,
            headers: data.headers || { "Content-Type": "application/json" },
            isShared: data.isShared || false,
            ownerId: data.ownerId || uuidv4(),
            authType: data.authType || "none",
            authValue: data.authValue || "",
            rateLimit: data.rateLimit || 0,
            requestCount: 0,
            lastUsed: now,
            createdAt: now,
            expiresAt: now + thirtyDaysMs,
        };

        // Save to storage (MongoDB/Upstash) if configured, otherwise use in-memory
        if (isStorageConfigured()) {
            const storedMock: StoredMockApi = {
                id: mockApi.id,
                name: mockApi.name,
                description: mockApi.description,
                method: mockApi.method,
                responseType: "json",
                jsonTemplate: mockApi.responseBody,
                statusCode: mockApi.statusCode,
                delay: mockApi.delay,
                createdAt: new Date(mockApi.createdAt).toISOString(),
                expiresAt: new Date(mockApi.expiresAt).toISOString(),
                ownerId: mockApi.ownerId,
                isShared: mockApi.isShared,
                requestCount: mockApi.requestCount,
            };
            const saved = await saveMock(storedMock);
            if (!saved) {
                // Fallback to in-memory if storage fails
                mockApisStore.set(id, mockApi);
            }
        } else {
            mockApisStore.set(id, mockApi);
        }

        return NextResponse.json({
            success: true,
            mock: mockApi,
            apiUrl: `/api/mock/${id}`,
        });
    } catch (error) {
        console.error("POST /api/mock-api error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT - Update an existing mock API
export async function PUT(request: NextRequest) {
    try {
        const data = await request.json();

        if (!data.id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const existing = mockApisStore.get(data.id);
        if (!existing) {
            return NextResponse.json({ error: "Mock API not found" }, { status: 404 });
        }

        // Verify ownership
        if (data.ownerId && existing.ownerId !== data.ownerId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const validationError = validateMockData({ ...existing, ...data });
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        const updated: MockApiData = {
            ...existing,
            name: data.name?.trim() || existing.name,
            description: data.description?.trim() ?? existing.description,
            endpoint: data.endpoint?.trim() || existing.endpoint,
            method: data.method?.toUpperCase() || existing.method,
            responseBody: data.responseBody ?? existing.responseBody,
            statusCode: data.statusCode ?? existing.statusCode,
            delay: data.delay ?? existing.delay,
            headers: data.headers ?? existing.headers,
            isShared: data.isShared ?? existing.isShared,
            authType: data.authType ?? existing.authType,
            authValue: data.authValue ?? existing.authValue,
            rateLimit: data.rateLimit ?? existing.rateLimit,
        };

        mockApisStore.set(data.id, updated);

        return NextResponse.json({
            success: true,
            mock: updated,
        });
    } catch (error) {
        console.error("PUT /api/mock-api error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE - Delete a mock API
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const ownerId = searchParams.get("ownerId");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const existing = mockApisStore.get(id);
        if (!existing) {
            return NextResponse.json({ error: "Mock API not found" }, { status: 404 });
        }

        // Verify ownership
        if (ownerId && existing.ownerId !== ownerId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        mockApisStore.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/mock-api error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
