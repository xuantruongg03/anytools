import { NextRequest, NextResponse } from "next/server";
import { getSharedMocks, StoredMockApi } from "@/lib/mock-storage";

// Shared mock type for API response
interface SharedMock {
    id: string;
    name: string;
    description: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    responseBody: string;
    statusCode: number;
    delay: number;
    headers: Record<string, string>;
    isShared: boolean;
    authType: "none" | "apiKey" | "bearer";
    authValue: string;
    rateLimit: number;
    requestCount: number;
    lastUsed: number;
    createdAt: number;
    ownerId?: string;
    isSample: boolean;
}

const ITEMS_PER_PAGE = 7;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const search = searchParams.get("search") || "";
        const method = searchParams.get("method") || "ALL";

        // Fetch shared mocks from database with pagination
        const dbResult = await getSharedMocks({
            page,
            pageSize: ITEMS_PER_PAGE,
            search,
            method,
        });

        // Transform DB mocks to API response format
        const items: SharedMock[] = dbResult.items.map((dbMock: StoredMockApi) => ({
            id: dbMock.id,
            name: dbMock.name,
            description: dbMock.description || "",
            endpoint: `/api/mock/${dbMock.id}`,
            method: dbMock.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
            responseBody: dbMock.jsonTemplate,
            statusCode: dbMock.statusCode,
            delay: dbMock.delay,
            headers: { "Content-Type": "application/json" },
            isShared: true,
            authType: "none" as const,
            authValue: "",
            rateLimit: 0,
            requestCount: dbMock.requestCount || 0,
            lastUsed: Date.now(),
            createdAt: new Date(dbMock.createdAt).getTime(),
            ownerId: dbMock.ownerId,
            isSample: dbMock.ownerId === "system",
        }));

        // Calculate pagination
        const totalItems = dbResult.totalItems;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const validPage = Math.max(1, Math.min(page, totalPages || 1));

        return NextResponse.json({
            success: true,
            data: {
                items,
                pagination: {
                    page: validPage,
                    pageSize: ITEMS_PER_PAGE,
                    totalItems,
                    totalPages,
                    hasNextPage: validPage < totalPages,
                    hasPrevPage: validPage > 1,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching shared mocks:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch shared mocks",
                data: {
                    items: [],
                    pagination: {
                        page: 1,
                        pageSize: ITEMS_PER_PAGE,
                        totalItems: 0,
                        totalPages: 0,
                        hasNextPage: false,
                        hasPrevPage: false,
                    },
                },
            },
            { status: 500 }
        );
    }
}
