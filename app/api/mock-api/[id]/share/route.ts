import { NextRequest, NextResponse } from "next/server";
import { updateMockSharedStatus } from "@/lib/mock-storage";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { isShared } = body;

        if (typeof isShared !== "boolean") {
            return NextResponse.json({ success: false, error: "isShared must be a boolean" }, { status: 400 });
        }

        const success = await updateMockSharedStatus(id, isShared);

        if (!success) {
            return NextResponse.json({ success: false, error: "Mock API not found or update failed" }, { status: 404 });
        }

        return NextResponse.json({ success: true, isShared });
    } catch (error) {
        console.error("Error updating mock share status:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
