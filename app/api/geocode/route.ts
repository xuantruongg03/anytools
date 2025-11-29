import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/utils/api-wrapper";

async function handleGeocode(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const query = searchParams.get("query");

    // Reverse geocoding (coordinates to address)
    if (lat && lon) {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`, {
            headers: {
                "User-Agent": "AnyTools Weather App",
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch location data");
        }

        const data = await response.json();

        return NextResponse.json({
            display: data.display_name,
            city: data.address?.city || data.address?.town || data.address?.village || data.address?.state || "",
            country: data.address?.country || "",
            lat: parseFloat(data.lat),
            lon: parseFloat(data.lon),
        });
    }

    // Forward geocoding (search query to coordinates)
    if (query) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`, {
            headers: {
                "User-Agent": "AnyTools Weather App",
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to search location");
        }

        const data = await response.json();

        const locations = data.map((item: any) => ({
            display: item.display_name,
            city: item.address?.city || item.address?.town || item.address?.village || item.address?.state || item.name || "",
            country: item.address?.country || "",
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
        }));

        return NextResponse.json(locations);
    }

    return NextResponse.json({ error: "Please provide either lat/lon or query parameter" }, { status: 400 });
}

export const GET = withErrorHandler(handleGeocode, "/api/geocode");
