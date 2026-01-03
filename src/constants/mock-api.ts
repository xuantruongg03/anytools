// Mock API Generator Constants

export const MOCK_API_STORAGE_KEY = "anytools_mock_apis";

export const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

export type AuthType = "none" | "apiKey" | "bearer";

export const STATUS_CODES = [
    { code: 200, label: "200 OK" },
    { code: 201, label: "201 Created" },
    { code: 204, label: "204 No Content" },
    { code: 400, label: "400 Bad Request" },
    { code: 401, label: "401 Unauthorized" },
    { code: 403, label: "403 Forbidden" },
    { code: 404, label: "404 Not Found" },
    { code: 500, label: "500 Internal Server Error" },
    { code: 502, label: "502 Bad Gateway" },
    { code: 503, label: "503 Service Unavailable" },
] as const;

export const METHOD_COLORS: Record<HttpMethod, string> = {
    GET: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    POST: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    PATCH: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
};

// Placeholder mappings for dynamic data generation
export const PLACEHOLDER_MAPPINGS: Record<string, () => string> = {
    "{{uuid}}": () => crypto.randomUUID(),
    "{{timestamp}}": () => String(Date.now()),
    "{{datetime}}": () => new Date().toISOString(),
    "{{random.number}}": () => String(Math.floor(Math.random() * 1000) + 1),
    "{{faker.name}}": () => "John Smith",
    "{{faker.email}}": () => "john.smith@example.com",
    "{{faker.avatar}}": () => "https://i.pravatar.cc/150?u=demo",
    "{{faker.phone}}": () => "+1-555-123-4567",
    "{{faker.address}}": () => "123 Main St, New York",
    "{{faker.company}}": () => "Tech Solutions Inc",
    "{{faker.lorem.sentence}}": () => "The quick brown fox jumps over the lazy dog.",
    "{{faker.lorem.paragraph}}": () => "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "{{faker.image}}": () => "https://picsum.photos/400/300",
    "{{faker.username}}": () => "cool_coder123",
};

// Example templates for quick start
export const EXAMPLE_TEMPLATES: Record<string, { name: string; endpoint: string; method: HttpMethod; responseBody: string; statusCode: number }> = {
    users: {
        name: "Users API",
        endpoint: "/users",
        method: "GET",
        responseBody: JSON.stringify(
            {
                "users{{x10}}": [{ id: "{{uuid}}", name: "{{faker.name}}", email: "{{faker.email}}", avatar: "{{faker.avatar}}" }],
                page: 1,
                timestamp: "{{datetime}}",
            },
            null,
            2
        ),
        statusCode: 200,
    },
    products: {
        name: "Products API",
        endpoint: "/products",
        method: "GET",
        responseBody: JSON.stringify(
            {
                "products{{x5}}": [
                    {
                        id: "{{uuid}}",
                        name: "Product {{random.number}}",
                        price: "{{random.number}}",
                        description: "{{faker.lorem.sentence}}",
                        image: "{{faker.image}}",
                    },
                ],
                timestamp: "{{datetime}}",
            },
            null,
            2
        ),
        statusCode: 200,
    },
    error: {
        name: "Error Response",
        endpoint: "/error",
        method: "GET",
        responseBody: JSON.stringify(
            {
                error: true,
                code: "RESOURCE_NOT_FOUND",
                message: "The requested resource was not found",
                timestamp: "{{datetime}}",
            },
            null,
            2
        ),
        statusCode: 404,
    },
    createUser: {
        name: "Create User API",
        endpoint: "/users",
        method: "POST",
        responseBody: JSON.stringify(
            {
                success: true,
                user: {
                    id: "{{uuid}}",
                    name: "{{faker.name}}",
                    email: "{{faker.email}}",
                    createdAt: "{{datetime}}",
                },
                message: "User created successfully",
            },
            null,
            2
        ),
        statusCode: 201,
    },
};

// Demo shared mocks
export const DEMO_SHARED_MOCKS = [
    {
        id: "demo-users",
        name: "Demo Users API",
        description: "Returns a list of demo users with dynamic data",
        endpoint: "/users",
        method: "GET" as HttpMethod,
        responseBody: JSON.stringify(
            {
                users: [{ id: "{{uuid}}", name: "{{faker.name}}", email: "{{faker.email}}" }],
            },
            null,
            2
        ),
        statusCode: 200,
        delay: 100,
        headers: { "Content-Type": "application/json" },
        isShared: true,
        authType: "none" as AuthType,
        authValue: "",
        rateLimit: 0,
        requestCount: 1250,
    },
    {
        id: "demo-products",
        name: "Demo Products API",
        description: "Returns a list of demo products",
        endpoint: "/products",
        method: "GET" as HttpMethod,
        responseBody: JSON.stringify(
            {
                products: [{ id: "{{uuid}}", name: "Product {{random.number}}", price: "{{random.number}}" }],
            },
            null,
            2
        ),
        statusCode: 200,
        delay: 0,
        headers: { "Content-Type": "application/json" },
        isShared: true,
        authType: "none" as AuthType,
        authValue: "",
        rateLimit: 0,
        requestCount: 856,
    },
] as const;

// Default form values (mutable, not const for useState)
export const DEFAULT_FORM_VALUES = {
    name: "" as string,
    description: "" as string,
    endpoint: "/api/example" as string,
    method: "GET" as HttpMethod,
    responseBody: JSON.stringify({ message: "Hello from Anytools, this is Mock API!", timestamp: "{{datetime}}" }, null, 2) as string,
    statusCode: 200 as number,
    delay: 0 as number,
    headers: [{ id: "1", key: "Content-Type", value: "application/json" }],
    authType: "none" as AuthType,
    authValue: "" as string,
    rateLimit: 0 as number,
    isShared: false as boolean,
};

// API endpoints
export const API_ENDPOINTS = {
    MOCK_SYNC: "/api/mock-sync",
    MOCK_API: "/api/mock-api",
    MOCK: "/api/mock",
} as const;
