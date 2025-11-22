import { NextRequest, NextResponse } from "next/server";

interface ProxyRequest {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: string;
}

export async function POST(request: NextRequest) {
    try {
        const { url, method, headers, body }: ProxyRequest = await request.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
        }

        const startTime = Date.now();

        // Make the proxied request
        const options: RequestInit = {
            method: method || "GET",
            headers: headers || {},
        };

        // Add body for POST, PUT, PATCH
        if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
            options.body = body;
        }

        const response = await fetch(url, options);
        const endTime = Date.now();

        // Get response headers
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        // Get response body
        let data;
        const contentType = response.headers.get("content-type");

        try {
            if (contentType?.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }
        } catch {
            data = await response.text();
        }

        // Return proxied response
        return NextResponse.json({
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            data,
            time: endTime - startTime,
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: 0,
                statusText: "Error",
                headers: {},
                data: {
                    error: error instanceof Error ? error.message : "An error occurred",
                    type: error instanceof Error ? error.name : "Unknown",
                },
                time: 0,
            },
            { status: 500 }
        );
    }
}
