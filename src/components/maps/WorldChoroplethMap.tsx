"use client";

import React, { useMemo, useState, useRef, useCallback } from "react";
import * as topojson from "topojson-client";
import * as d3 from "d3-geo";
import atlasData from "world-atlas/countries-110m.json";
import { getAlpha2FromNumeric, getCountryFlag, getCountryName } from "@/lib/constants/isoCountries";
import { BulkIpItem } from "@/app/api/bulk-ip-lookup/route";

interface WorldChoroplethMapProps {
    ipResults: BulkIpItem[];
    selectedCountry: string | null;
    onSelectCountry: (countryCode: string | null) => void;
    locale?: string;
    onHoverIp?: (ip: BulkIpItem | null) => void;
    onSelectIp?: (ip: BulkIpItem) => void;
}

interface HoveredLocation {
    type: "country" | "ip";
    title: string;
    subtitle?: string;
    flag?: string;
    count?: number;
    percent?: number;
    ips?: BulkIpItem[];
    ipData?: BulkIpItem;
    x: number;
    y: number;
}

const WIDTH = 960;
const HEIGHT = 500;

export default function WorldChoroplethMap({
    ipResults,
    selectedCountry,
    onSelectCountry,
    locale = "vi",
    onSelectIp,
}: WorldChoroplethMapProps) {
    const isVi = locale === "vi";
    const containerRef = useRef<HTMLDivElement>(null);

    // Zoom & Pan state
    const [zoom, setZoom] = useState<number>(1);
    const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);

    // Tooltip state
    const [hoverInfo, setHoverInfo] = useState<HoveredLocation | null>(null);

    // View mode toggle
    const [showMarkers, setShowMarkers] = useState<boolean>(true);

    // 1. Calculate IP stats per country
    const { countryIpMap, countryCounts, maxCountryCount, totalValidIps } = useMemo(() => {
        const map: Record<string, BulkIpItem[]> = {};
        const counts: Record<string, number> = {};
        let validCount = 0;

        for (const item of ipResults) {
            if (item.status === "success" && item.countryCode) {
                validCount++;
                const code = item.countryCode.toUpperCase();
                if (!map[code]) {
                    map[code] = [];
                    counts[code] = 0;
                }
                map[code].push(item);
                counts[code]++;
            }
        }

        const max = Math.max(...Object.values(counts), 1);
        return { countryIpMap: map, countryCounts: counts, maxCountryCount: max, totalValidIps: validCount };
    }, [ipResults]);

    // 2. Generate Map Projection and Country Paths
    const { paths, projection } = useMemo(() => {
        const atlas = atlasData as any;
        const geojson: any = topojson.feature(atlas, atlas.objects.countries);
        // Exclude Antarctica ('010') to replicate Google Analytics styling
        const filteredFeatures = geojson.features.filter((f: any) => f.id !== "010");

        const proj = d3
            .geoMercator()
            .fitSize([WIDTH, HEIGHT], { type: "FeatureCollection", features: filteredFeatures });

        const pathGen = d3.geoPath(proj);

        const countryPaths = filteredFeatures.map((feature: any) => {
            const numericId = feature.id;
            const alpha2 = getAlpha2FromNumeric(numericId);
            const d = pathGen(feature) || "";
            return {
                id: numericId,
                alpha2,
                name: feature.properties?.name || "",
                d,
            };
        });

        return { paths: countryPaths, projection: proj };
    }, []);

    // 3. Project IP Markers (lat, lon -> x, y)
    const ipMarkers = useMemo(() => {
        if (!projection) return [];

        const markers: Array<{
            x: number;
            y: number;
            ip: BulkIpItem;
            key: string;
        }> = [];

        // Deduplicate or cluster markers by proximity (or exact coordinates)
        const coordGroups = new Map<string, BulkIpItem[]>();

        for (const item of ipResults) {
            if (
                item.status === "success" &&
                typeof item.lat === "number" &&
                typeof item.lon === "number" &&
                !isNaN(item.lat) &&
                !isNaN(item.lon)
            ) {
                const key = `${item.lat.toFixed(2)},${item.lon.toFixed(2)}`;
                const group = coordGroups.get(key) || [];
                group.push(item);
                coordGroups.set(key, group);
            }
        }

        coordGroups.forEach((items) => {
            const first = items[0];
            const coords = projection([first.lon!, first.lat!]);
            if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
                markers.push({
                    x: coords[0],
                    y: coords[1],
                    ip: first,
                    key: `${first.lat}-${first.lon}`,
                });
            }
        });

        return markers;
    }, [ipResults, projection]);

    // Zoom Handlers
    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev * 1.5, 8));
    };

    const handleZoomOut = () => {
        setZoom((prev) => {
            const next = Math.max(prev / 1.5, 1);
            if (next === 1) setPan({ x: 0, y: 0 });
            return next;
        });
    };

    const handleResetZoom = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
        onSelectCountry(null);
    };

    // Pan Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom <= 1) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || zoom <= 1) return;
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Color interpolation matching Google Analytics blue shades
    const getCountryFill = (alpha2?: string) => {
        if (!alpha2) return "var(--map-country-base, #e2e8f0)";

        const count = countryCounts[alpha2] || 0;
        const isSelected = selectedCountry === alpha2;
        const isHovered = hoveredCountryCode === alpha2;

        if (count === 0) {
            return isHovered ? "#cbd5e1" : "var(--map-country-base, #e2e8f0)";
        }

        // Shading intensity based on proportion (0.35 to 1.0)
        const ratio = Math.min(count / maxCountryCount, 1);
        const opacity = 0.45 + 0.55 * Math.pow(ratio, 0.6);

        if (isSelected) {
            return "#1d4ed8"; // Deep blue for active selected
        }
        if (isHovered) {
            return "#2563eb"; // Highlight blue on hover
        }

        // Palette similar to GA4: blue shades
        return `rgba(37, 99, 235, ${opacity.toFixed(2)})`;
    };

    // Country Tooltip Trigger
    const handleCountryMouseEnter = (
        e: React.MouseEvent<SVGPathElement>,
        alpha2?: string,
        name?: string
    ) => {
        if (!alpha2) return;
        setHoveredCountryCode(alpha2);

        const count = countryCounts[alpha2] || 0;
        const percent = totalValidIps > 0 ? (count / totalValidIps) * 100 : 0;
        const flag = getCountryFlag(alpha2);
        const localizedName = getCountryName(alpha2, locale) || name || alpha2;
        const ips = countryIpMap[alpha2] || [];

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        setHoverInfo({
            type: "country",
            title: localizedName,
            flag,
            count,
            percent: Math.round(percent * 10) / 10,
            ips,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleCountryMouseMove = (e: React.MouseEvent<SVGPathElement>) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setHoverInfo((prev) => (prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null));
    };

    const handleCountryMouseLeave = () => {
        setHoveredCountryCode(null);
        setHoverInfo(null);
    };

    // IP Marker Tooltip Trigger
    const handleMarkerMouseEnter = (e: React.MouseEvent, ip: BulkIpItem) => {
        e.stopPropagation();
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        setHoverInfo({
            type: "ip",
            title: ip.query,
            flag: getCountryFlag(ip.countryCode),
            subtitle: `${ip.city ? ip.city + ", " : ""}${ip.regionName || ip.region || ""}${ip.country ? " - " + ip.country : ""}`,
            ipData: ip,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleMarkerMouseLeave = () => {
        setHoverInfo(null);
    };

    return (
        <div
            ref={containerRef}
            className='relative w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 select-none shadow-xs'
            style={
                {
                    "--map-country-base": "#e5e7eb",
                } as React.CSSProperties
            }
        >
            {/* Top Toolbar: View Toggles & Active Filter Badge */}
            <div className='absolute top-3 left-3 z-10 flex items-center gap-2 flex-wrap'>
                {selectedCountry && (
                    <div className='flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 rounded-lg text-xs font-medium text-blue-700 dark:text-blue-300 shadow-xs'>
                        <span>{getCountryFlag(selectedCountry)}</span>
                        <span>{getCountryName(selectedCountry, locale)}</span>
                        <button
                            onClick={() => onSelectCountry(null)}
                            className='hover:text-blue-900 dark:hover:text-white ml-1 font-bold'
                            title={isVi ? "Bỏ chọn quốc gia" : "Clear country filter"}
                        >
                            ×
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setShowMarkers((prev) => !prev)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors shadow-2xs cursor-pointer ${
                        showMarkers
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                    }`}
                    title={isVi ? "Bật/Tắt điểm tọa độ IP" : "Toggle IP coordinate pins"}
                >
                    📍 {isVi ? "Điểm tọa độ" : "IP Pins"}
                </button>
            </div>

            {/* Floating Zoom & Pan Controls (Google Analytics Style) */}
            <div className='absolute right-4 bottom-8 z-10 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden'>
                <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 8}
                    className='w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold border-b border-gray-200 dark:border-gray-700 transition-colors disabled:opacity-40 cursor-pointer text-lg'
                    title={isVi ? "Phóng to" : "Zoom in"}
                    aria-label='Zoom in'
                >
                    +
                </button>
                <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 1}
                    className='w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold transition-colors disabled:opacity-40 cursor-pointer text-lg'
                    title={isVi ? "Thu nhỏ" : "Zoom out"}
                    aria-label='Zoom out'
                >
                    −
                </button>
                {zoom > 1 && (
                    <button
                        onClick={handleResetZoom}
                        className='w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 transition-colors cursor-pointer text-xs'
                        title={isVi ? "Đặt lại bản đồ" : "Reset map"}
                        aria-label='Reset map'
                    >
                        ⟲
                    </button>
                )}
            </div>

            {/* Bottom Right Map Attribution */}
            <div className='absolute right-3 bottom-2 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none'>
                {isVi ? "Dữ liệu bản đồ © AnyTools" : "Map data © AnyTools"}
            </div>

            {/* SVG Map Canvas */}
            <div
                className={`w-full overflow-hidden ${zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <svg
                    viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                    className='w-full h-auto block'
                    style={{
                        minHeight: "360px",
                        maxHeight: "580px",
                    }}
                >
                    {/* Oceans / Background */}
                    <rect width={WIDTH} height={HEIGHT} fill='transparent' />

                    {/* Transform Group for Zoom & Pan */}
                    <g
                        transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
                        style={{
                            transition: isDragging ? "none" : "transform 0.2s ease-out",
                            transformOrigin: "center center",
                        }}
                    >
                        {/* 1. Country Polygons */}
                        {paths.map((p: any, idx: number) => {
                            const isSelected = selectedCountry === p.alpha2;
                            const hasIps = p.alpha2 && (countryCounts[p.alpha2] || 0) > 0;
                            const fill = getCountryFill(p.alpha2);

                            return (
                                <path
                                    key={`${p.id}-${p.alpha2 || "na"}-${idx}`}
                                    d={p.d}
                                    fill={fill}
                                    stroke={isSelected ? "#1e40af" : "#ffffff"}
                                    strokeWidth={isSelected ? 1.5 / zoom : 0.6 / zoom}
                                    strokeLinejoin='round'
                                    strokeLinecap='round'
                                    className={`transition-colors duration-150 ${hasIps ? "cursor-pointer" : "cursor-default"}`}
                                    onMouseEnter={(e) => handleCountryMouseEnter(e, p.alpha2, p.name)}
                                    onMouseMove={handleCountryMouseMove}
                                    onMouseLeave={handleCountryMouseLeave}
                                    onClick={() => {
                                        if (p.alpha2 && hasIps) {
                                            onSelectCountry(selectedCountry === p.alpha2 ? null : p.alpha2);
                                        }
                                    }}
                                />
                            );
                        })}

                        {/* 2. IP Pin Markers (exact lat/lon) */}
                        {showMarkers &&
                            ipMarkers.map((marker, idx) => {
                                const isCountryMatch =
                                    !selectedCountry || marker.ip.countryCode?.toUpperCase() === selectedCountry;
                                if (!isCountryMatch) return null;

                                return (
                                    <g
                                        key={`${marker.ip.query}-${marker.key}-${idx}`}
                                        transform={`translate(${marker.x}, ${marker.y})`}
                                        className='cursor-pointer group'
                                        onMouseEnter={(e) => handleMarkerMouseEnter(e, marker.ip)}
                                        onMouseLeave={handleMarkerMouseLeave}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onSelectIp) onSelectIp(marker.ip);
                                        }}
                                    >
                                        {/* Pulsing ring animation */}
                                        <circle
                                            r={7 / Math.sqrt(zoom)}
                                            className='fill-blue-500/40 animate-ping pointer-events-none'
                                        />
                                        {/* Outer glow ring */}
                                        <circle
                                            r={5 / Math.sqrt(zoom)}
                                            fill='#2563eb'
                                            opacity={0.3}
                                            className='pointer-events-none'
                                        />
                                        {/* Center dot pin */}
                                        <circle
                                            r={3.2 / Math.sqrt(zoom)}
                                            fill='#1d4ed8'
                                            stroke='#ffffff'
                                            strokeWidth={1 / Math.sqrt(zoom)}
                                            className='transition-transform hover:scale-150'
                                        />
                                    </g>
                                );
                            })}
                    </g>
                </svg>
            </div>

            {/* Interactive Floating Tooltip (Google Analytics style) */}
            {hoverInfo && (
                <div
                    className='absolute z-30 pointer-events-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-3 text-xs min-w-[190px] max-w-[280px] backdrop-blur-md transition-all'
                    style={{
                        left: Math.min(hoverInfo.x + 12, (containerRef.current?.clientWidth || 300) - 260),
                        top: Math.max(hoverInfo.y - 75, 10),
                    }}
                >
                    {hoverInfo.type === "country" ? (
                        <div>
                            {/* Country Header */}
                            <div className='flex items-center gap-1.5 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700 font-semibold text-gray-900 dark:text-gray-100 text-sm'>
                                <span className='text-base'>{hoverInfo.flag}</span>
                                <span className='truncate'>{hoverInfo.title}</span>
                            </div>

                            {/* Count info */}
                            <div className='flex items-center justify-between gap-2 mb-2'>
                                <span className='text-gray-500 dark:text-gray-400'>
                                    {isVi ? "Số lượng IP:" : "IP Count:"}
                                </span>
                                <div className='font-mono font-bold text-blue-600 dark:text-blue-400 text-sm'>
                                    {hoverInfo.count || 0}{" "}
                                    {hoverInfo.percent !== undefined && (
                                        <span className='text-[10px] text-gray-400 font-normal'>
                                            ({hoverInfo.percent}%)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Sample IPs in country */}
                            {hoverInfo.ips && hoverInfo.ips.length > 0 && (
                                <div className='mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/60'>
                                    <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1'>
                                        {isVi ? "Địa chỉ IP gần đây:" : "Recent IPs:"}
                                    </p>
                                    <div className='space-y-0.5 max-h-24 overflow-y-auto'>
                                        {hoverInfo.ips.slice(0, 3).map((item, idx) => (
                                            <div
                                                key={idx}
                                                className='font-mono text-[11px] text-gray-700 dark:text-gray-300 flex items-center justify-between'
                                            >
                                                <span className='truncate'>{item.query}</span>
                                                <span className='text-[10px] text-gray-400 truncate max-w-[80px]'>
                                                    {item.city || item.region || ""}
                                                </span>
                                            </div>
                                        ))}
                                        {hoverInfo.ips.length > 3 && (
                                            <p className='text-[10px] text-blue-500 dark:text-blue-400 italic pt-0.5'>
                                                +{hoverInfo.ips.length - 3} {isVi ? "IP khác" : "more IPs"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {hoverInfo.count && hoverInfo.count > 0 ? (
                                <p className='text-[10px] text-gray-400 italic mt-2 text-center'>
                                    {isVi ? "💡 Nhấp để lọc danh sách" : "💡 Click to filter list"}
                                </p>
                            ) : null}
                        </div>
                    ) : (
                        <div>
                            {/* Single IP Marker Tooltip */}
                            <div className='flex items-center gap-1.5 pb-2 mb-2 border-b border-gray-100 dark:border-gray-700 font-bold font-mono text-gray-900 dark:text-gray-100 text-sm'>
                                <span>{hoverInfo.flag}</span>
                                <span className='truncate text-blue-600 dark:text-blue-400'>{hoverInfo.title}</span>
                            </div>

                            {hoverInfo.subtitle && (
                                <p className='text-gray-700 dark:text-gray-300 font-medium mb-1.5 leading-snug'>
                                    {hoverInfo.subtitle}
                                </p>
                            )}

                            {hoverInfo.ipData && (
                                <div className='space-y-1 text-[11px] text-gray-500 dark:text-gray-400'>
                                    {hoverInfo.ipData.isp && (
                                        <div className='flex items-start gap-1'>
                                            <span className='font-semibold text-gray-700 dark:text-gray-300'>ISP:</span>
                                            <span className='truncate'>{hoverInfo.ipData.isp}</span>
                                        </div>
                                    )}
                                    {hoverInfo.ipData.timezone && (
                                        <div className='flex items-center gap-1'>
                                            <span className='font-semibold text-gray-700 dark:text-gray-300'>
                                                {isVi ? "Múi giờ:" : "TZ:"}
                                            </span>
                                            <span>{hoverInfo.ipData.timezone}</span>
                                        </div>
                                    )}
                                    {hoverInfo.ipData.lat !== undefined && hoverInfo.ipData.lon !== undefined && (
                                        <div className='flex items-center gap-1 font-mono text-[10px] text-gray-400'>
                                            <span>📍</span>
                                            <span>
                                                {hoverInfo.ipData.lat.toFixed(3)}, {hoverInfo.ipData.lon.toFixed(3)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <p className='text-[10px] text-blue-500 dark:text-blue-400 font-semibold italic mt-2 text-center'>
                                {isVi ? "💡 Nhấp vào ghim để xem chi tiết IP" : "💡 Click pin to view IP details"}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
