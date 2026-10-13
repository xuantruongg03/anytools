import { NextRequest, NextResponse } from "next/server";
import { migrateAllSheetsDataToMongo } from "@/lib/credits-sheets";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    return handleMigration(request);
}

export async function POST(request: NextRequest) {
    return handleMigration(request);
}

async function handleMigration(request: NextRequest) {
    try {
        console.log("🔄 [Migration] Starting migration from Google Sheets to MongoDB...");
        const result = await migrateAllSheetsDataToMongo();
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("❌ [Migration] Error during migration:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Lỗi trong quá trình di chuyển dữ liệu",
            },
            { status: 500 }
        );
    }
}
