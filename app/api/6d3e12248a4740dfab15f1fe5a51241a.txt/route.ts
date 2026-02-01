import { NextResponse } from "next/server";

// IndexNow verification key
const INDEXNOW_KEY = "6d3e12248a4740dfab15f1fe5a51241a";

export async function GET() {
    return new NextResponse(INDEXNOW_KEY, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
