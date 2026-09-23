"use client";

import { useState, useMemo, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { chartGeneratorTranslations } from "@/lib/i18n/tools/chart-generator";
import { toast } from "@/components/ui/Toast";

type ChartType = "bar" | "barHorizontal" | "line" | "area" | "pie" | "donut";

interface DataRow {
    id: string;
    label: string;
    value: number;
    color: string;
}

const PALETTES = {
    modern: ["#4f46e5", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"],
    neon: ["#06b6d4", "#ec4899", "#8b5cf6", "#10b981", "#facc15", "#f97316", "#3b82f6"],
    emerald: ["#059669", "#10b981", "#34d399", "#14b8a6", "#0d9488", "#047857", "#6ee7b7"],
    sunset: ["#e11d48", "#f43f5e", "#fb7185", "#ea580c", "#f97316", "#f59e0b", "#fbbf24"],
    pastel: ["#818cf8", "#f472b6", "#fb923c", "#34d399", "#38bdf8", "#a78bfa", "#fde047"],
};

export default function ChartGeneratorContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = chartGeneratorTranslations[locale];

    const [chartType, setChartType] = useState<ChartType>("bar");
    const [title, setTitle] = useState<string>("Quarterly Revenue Growth");
    const [subtitle, setSubtitle] = useState<string>("In Thousands USD ($K)");
    const [paletteKey, setPaletteKey] = useState<keyof typeof PALETTES>("modern");
    const [showValues, setShowValues] = useState<boolean>(true);
    const [showGrid, setShowGrid] = useState<boolean>(true);
    const [donutHoleRadius, setDonutHoleRadius] = useState<number>(55);

    const [dataRows, setDataRows] = useState<DataRow[]>([
        { id: "1", label: "Q1 2026", value: 45, color: PALETTES.modern[0] },
        { id: "2", label: "Q2 2026", value: 72, color: PALETTES.modern[1] },
        { id: "3", label: "Q3 2026", value: 98, color: PALETTES.modern[2] },
        { id: "4", label: "Q4 2026", value: 125, color: PALETTES.modern[3] },
    ]);

    const svgRef = useRef<SVGSVGElement>(null);

    // Apply color palette
    const handleApplyPalette = (key: keyof typeof PALETTES) => {
        setPaletteKey(key);
        const colors = PALETTES[key];
        setDataRows((prev) =>
            prev.map((row, idx) => ({
                ...row,
                color: colors[idx % colors.length],
            }))
        );
        toast.info(isVi ? "Đã đổi bảng màu" : "Palette updated");
    };

    // Row management
    const handleAddRow = () => {
        const colors = PALETTES[paletteKey];
        const newRow: DataRow = {
            id: Date.now().toString(),
            label: `Item ${dataRows.length + 1}`,
            value: Math.round(Math.random() * 80 + 20),
            color: colors[dataRows.length % colors.length],
        };
        setDataRows([...dataRows, newRow]);
    };

    const handleUpdateRow = (id: string, field: "label" | "value" | "color", val: any) => {
        setDataRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: field === "value" ? parseFloat(val) || 0 : val } : r))
        );
    };

    const handleRemoveRow = (id: string) => {
        if (dataRows.length <= 2) {
            toast.error(isVi ? "Biểu đồ cần tối thiểu 2 điểm dữ liệu" : "Min 2 data points required");
            return;
        }
        setDataRows(dataRows.filter((r) => r.id !== id));
    };

    // Presets
    const loadPreset = (presetKey: string) => {
        const colors = PALETTES[paletteKey];
        if (presetKey === "revenue") {
            setTitle(isVi ? "Doanh Thu Theo Quý" : "Quarterly Revenue Growth");
            setSubtitle(isVi ? "Đơn vị: Triệu VNĐ" : "In Thousands USD ($K)");
            setDataRows([
                { id: "1", label: "Q1", value: 45, color: colors[0] },
                { id: "2", label: "Q2", value: 72, color: colors[1] },
                { id: "3", label: "Q3", value: 98, color: colors[2] },
                { id: "4", label: "Q4", value: 125, color: colors[3] },
            ]);
            setChartType("bar");
        } else if (presetKey === "traffic") {
            setTitle(isVi ? "Nguồn Lưu Lượng Truy Cập" : "Website Traffic by Channel");
            setSubtitle(isVi ? "Lượt truy cập hàng tháng" : "Monthly Unique Visitors (%)");
            setDataRows([
                { id: "1", label: "Organic Search", value: 42, color: colors[0] },
                { id: "2", label: "Direct", value: 28, color: colors[1] },
                { id: "3", label: "Social Media", value: 18, color: colors[2] },
                { id: "4", label: "Referral", value: 12, color: colors[3] },
            ]);
            setChartType("pie");
        } else if (presetKey === "market") {
            setTitle(isVi ? "Thị Phần Trình Duyệt Web" : "Browser Market Share");
            setSubtitle(isVi ? "Tỷ lệ phần trăm tổng" : "Global User Share (%)");
            setDataRows([
                { id: "1", label: "Chrome", value: 65, color: colors[0] },
                { id: "2", label: "Safari", value: 19, color: colors[1] },
                { id: "3", label: "Edge", value: 8, color: colors[2] },
                { id: "4", label: "Firefox", value: 5, color: colors[3] },
                { id: "5", label: "Other", value: 3, color: colors[4] },
            ]);
            setChartType("donut");
        }
        toast.info(isVi ? "Đã nạp bộ dữ liệu mẫu" : "Sample dataset loaded");
    };

    // Math metrics
    const totalValue = useMemo(() => {
        return dataRows.reduce((sum, r) => sum + (r.value > 0 ? r.value : 0), 0) || 1;
    }, [dataRows]);

    const maxValue = useMemo(() => {
        return Math.max(...dataRows.map((r) => r.value), 10);
    }, [dataRows]);

    // Export SVG
    const handleDownloadSvg = () => {
        if (!svgRef.current) return;
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `chart-${chartType}-${Date.now()}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(t.downloaded);
    };

    // Export PNG
    const handleDownloadPng = () => {
        if (!svgRef.current) return;
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const scale = 2; // Retina 2x
            canvas.width = 680 * scale;
            canvas.height = 460 * scale;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.scale(scale, scale);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, 680, 460);
            ctx.drawImage(image, 0, 0, 680, 460);

            const pngUrl = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = `chart-${chartType}-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(blobURL);
            toast.success(t.downloaded);
        };
        image.src = blobURL;
    };

    // Dimensions
    const svgW = 680;
    const svgH = 460;
    const padX = 65;
    const padTop = 90;
    const padBottom = 60;
    const chartW = svgW - padX * 2;
    const chartH = svgH - padTop - padBottom;

    return (
        <div className='max-w-6xl mx-auto space-y-8'>
            {/* Header info */}
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3'>
                    <span>📊</span> {t.name}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                    {t.description}
                </p>
            </div>

            {/* Chart Type Selector */}
            <div className='flex justify-center'>
                <div className='inline-flex flex-wrap justify-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm'>
                    {[
                        { id: "bar", label: t.typeBar, icon: "📊" },
                        { id: "barHorizontal", label: t.typeBarHorizontal, icon: "📶" },
                        { id: "line", label: t.typeLine, icon: "📈" },
                        { id: "area", label: t.typeArea, icon: "🏔️" },
                        { id: "pie", label: t.typePie, icon: "🥧" },
                        { id: "donut", label: t.typeDonut, icon: "🍩" },
                    ].map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setChartType(type.id as ChartType)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                chartType === type.id
                                    ? "bg-blue-600 text-white shadow-xs"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                        >
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Presets Bar */}
            <div className='flex items-center justify-center gap-2 flex-wrap'>
                <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>
                    ✨ {t.presetsTitle}:
                </span>
                <button
                    onClick={() => loadPreset("revenue")}
                    className='px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer'
                >
                    {t.presetRevenue}
                </button>
                <button
                    onClick={() => loadPreset("traffic")}
                    className='px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer'
                >
                    {t.presetTraffic}
                </button>
                <button
                    onClick={() => loadPreset("market")}
                    className='px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors cursor-pointer'
                >
                    {t.presetMarket}
                </button>
            </div>

            {/* Main Interactive Grid */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
                {/* Left: Configuration & Data Table */}
                <div className='lg:col-span-5 space-y-6'>
                    {/* Titles & Palettes Card */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                        <h2 className='text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2'>
                            {t.configTitle}
                        </h2>

                        <div className='space-y-1.5'>
                            <label className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
                                {t.chartTitleLabel}
                            </label>
                            <input
                                type='text'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold'
                            />
                        </div>

                        <div className='space-y-1.5'>
                            <label className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
                                {t.chartSubtitleLabel}
                            </label>
                            <input
                                type='text'
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className='w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs'
                            />
                        </div>

                        {/* Palette Selector */}
                        <div className='space-y-2 pt-1'>
                            <label className='text-xs font-semibold text-gray-700 dark:text-gray-300'>
                                {t.paletteLabel}
                            </label>
                            <div className='grid grid-cols-3 gap-2'>
                                {Object.keys(PALETTES).map((pk) => (
                                    <button
                                        key={pk}
                                        onClick={() => handleApplyPalette(pk as any)}
                                        className={`p-2 rounded-xl border text-xs font-semibold capitalize flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                                            paletteKey === pk
                                                ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400"
                                                : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                                        }`}
                                    >
                                        <div className='flex gap-1'>
                                            {PALETTES[pk as keyof typeof PALETTES].slice(0, 4).map((c, i) => (
                                                <span key={i} className='w-2.5 h-2.5 rounded-full' style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                        <span>{pk}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className='flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-700'>
                            <label className='flex items-center gap-2 text-xs font-medium cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={showValues}
                                    onChange={(e) => setShowValues(e.target.checked)}
                                    className='rounded accent-blue-600'
                                />
                                <span>{t.showValues}</span>
                            </label>

                            <label className='flex items-center gap-2 text-xs font-medium cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={showGrid}
                                    onChange={(e) => setShowGrid(e.target.checked)}
                                    className='rounded accent-blue-600'
                                />
                                <span>{t.showGrid}</span>
                            </label>
                        </div>
                    </div>

                    {/* Data Rows Table */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                        <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3'>
                            <h3 className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                                {t.dataTitle}
                            </h3>
                            <button
                                onClick={handleAddRow}
                                className='px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer'
                            >
                                ➕ {t.addRow}
                            </button>
                        </div>

                        <div className='space-y-2 max-h-[280px] overflow-y-auto pr-1'>
                            {dataRows.map((row) => (
                                <div key={row.id} className='flex items-center gap-2 bg-gray-50/70 dark:bg-gray-900/60 p-2 rounded-xl border border-gray-200 dark:border-gray-700'>
                                    <input
                                        type='color'
                                        value={row.color}
                                        onChange={(e) => handleUpdateRow(row.id, "color", e.target.value)}
                                        className='w-7 h-7 rounded-lg cursor-pointer bg-transparent shrink-0'
                                    />
                                    <input
                                        type='text'
                                        value={row.label}
                                        onChange={(e) => handleUpdateRow(row.id, "label", e.target.value)}
                                        className='w-full px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold'
                                        placeholder='Label'
                                    />
                                    <input
                                        type='number'
                                        value={row.value}
                                        onChange={(e) => handleUpdateRow(row.id, "value", e.target.value)}
                                        className='w-20 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-mono font-bold text-right'
                                        placeholder='Value'
                                    />
                                    {dataRows.length > 2 && (
                                        <button
                                            onClick={() => handleRemoveRow(row.id)}
                                            className='text-gray-400 hover:text-red-500 text-xs px-1.5 py-0.5 rounded cursor-pointer shrink-0'
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Live SVG Render Canvas & Download */}
                <div className='lg:col-span-7 space-y-4'>
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4 flex flex-col items-center'>
                        {/* THE SVG CANVAS */}
                        <div className='w-full overflow-x-auto flex justify-center bg-gray-50 dark:bg-gray-900 rounded-2xl p-2 border border-gray-100 dark:border-gray-800'>
                            <svg
                                ref={svgRef}
                                viewBox={`0 0 ${svgW} ${svgH}`}
                                className='w-full max-w-[680px] h-auto rounded-xl shadow-xs select-none'
                                style={{ backgroundColor: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
                            >
                                {/* Background */}
                                <rect width={svgW} height={svgH} fill='#ffffff' />

                                {/* Header text */}
                                <text x={padX} y={40} fontSize='20' fontWeight='bold' fill='#0f172a'>
                                    {title}
                                </text>
                                <text x={padX} y={62} fontSize='12' fill='#64748b'>
                                    {subtitle}
                                </text>

                                {/* 1. BAR CHART */}
                                {chartType === "bar" && (
                                    <g>
                                        {/* Grid lines */}
                                        {showGrid &&
                                            [0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                                                const y = padTop + chartH - ratio * chartH;
                                                const val = Math.round(ratio * maxValue);
                                                return (
                                                    <g key={idx}>
                                                        <line x1={padX} y1={y} x2={svgW - padX} y2={y} stroke='#f1f5f9' strokeWidth='1.5' />
                                                        <text x={padX - 8} y={y + 4} fontSize='10' fill='#94a3b8' textAnchor='end' fontFamily='monospace'>
                                                            {val}
                                                        </text>
                                                    </g>
                                                );
                                            })}

                                        {/* Bars */}
                                        {dataRows.map((row, idx) => {
                                            const barGroupW = chartW / dataRows.length;
                                            const barW = Math.min(barGroupW * 0.65, 56);
                                            const barH = (row.value / maxValue) * chartH;
                                            const x = padX + idx * barGroupW + (barGroupW - barW) / 2;
                                            const y = padTop + chartH - barH;

                                            return (
                                                <g key={row.id}>
                                                    <rect x={x} y={y} width={barW} height={barH} rx='6' fill={row.color} />
                                                    {showValues && (
                                                        <text x={x + barW / 2} y={y - 8} fontSize='11' fontWeight='bold' fill='#1e293b' textAnchor='middle'>
                                                            {row.value}
                                                        </text>
                                                    )}
                                                    <text x={x + barW / 2} y={padTop + chartH + 20} fontSize='11' fill='#475569' textAnchor='middle'>
                                                        {row.label}
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </g>
                                )}

                                {/* 2. HORIZONTAL BAR CHART */}
                                {chartType === "barHorizontal" && (
                                    <g>
                                        {dataRows.map((row, idx) => {
                                            const rowH = chartH / dataRows.length;
                                            const barH = Math.min(rowH * 0.55, 36);
                                            const barW = (row.value / maxValue) * (chartW - 70);
                                            const x = padX + 80;
                                            const y = padTop + idx * rowH + (rowH - barH) / 2;

                                            return (
                                                <g key={row.id}>
                                                    <text x={padX + 70} y={y + barH / 2 + 4} fontSize='11' fill='#475569' textAnchor='end'>
                                                        {row.label}
                                                    </text>
                                                    <rect x={x} y={y} width={barW} height={barH} rx='6' fill={row.color} />
                                                    {showValues && (
                                                        <text x={x + barW + 8} y={y + barH / 2 + 4} fontSize='11' fontWeight='bold' fill='#1e293b'>
                                                            {row.value}
                                                        </text>
                                                    )}
                                                </g>
                                            );
                                        })}
                                    </g>
                                )}

                                {/* 3. LINE & AREA CHARTS */}
                                {(chartType === "line" || chartType === "area") && (
                                    <g>
                                        {/* Grid lines */}
                                        {showGrid &&
                                            [0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                                                const y = padTop + chartH - ratio * chartH;
                                                return (
                                                    <line key={idx} x1={padX} y1={y} x2={svgW - padX} y2={y} stroke='#f1f5f9' strokeWidth='1.5' />
                                                );
                                            })}

                                        {/* Compute polyline points */}
                                        {(() => {
                                            const step = chartW / (dataRows.length - 1 || 1);
                                            const pts = dataRows.map((r, i) => {
                                                const x = padX + i * step;
                                                const y = padTop + chartH - (r.value / maxValue) * chartH;
                                                return { x, y, ...r };
                                            });

                                            const ptsStr = pts.map((p) => `${p.x},${p.y}`).join(" ");
                                            const areaStr = `${padX},${padTop + chartH} ${ptsStr} ${padX + chartW},${padTop + chartH}`;

                                            return (
                                                <>
                                                    {chartType === "area" && (
                                                        <polygon points={areaStr} fill={dataRows[0].color} fillOpacity='0.25' />
                                                    )}
                                                    <polyline points={ptsStr} fill='none' stroke={dataRows[0].color} strokeWidth='3.5' strokeLinecap='round' strokeLinejoin='round' />
                                                    {pts.map((p) => (
                                                        <g key={p.id}>
                                                            <circle cx={p.x} cy={p.y} r='5' fill='#ffffff' stroke={p.color} strokeWidth='3' />
                                                            {showValues && (
                                                                <text x={p.x} y={p.y - 12} fontSize='11' fontWeight='bold' fill='#0f172a' textAnchor='middle'>
                                                                    {p.value}
                                                                </text>
                                                            )}
                                                            <text x={p.x} y={padTop + chartH + 20} fontSize='11' fill='#475569' textAnchor='middle'>
                                                                {p.label}
                                                            </text>
                                                        </g>
                                                    ))}
                                                </>
                                            );
                                        })()}
                                    </g>
                                )}

                                {/* 5. PIE & DONUT CHARTS */}
                                {(chartType === "pie" || chartType === "donut") && (
                                    <g transform={`translate(${svgW / 2 - 80}, ${svgH / 2 + 20})`}>
                                        {(() => {
                                            const radius = 120;
                                            const innerRadius = chartType === "donut" ? (radius * donutHoleRadius) / 100 : 0;
                                            let currentAngle = -Math.PI / 2;

                                            return dataRows.map((row) => {
                                                const sliceAngle = (row.value / totalValue) * Math.PI * 2;
                                                const endAngle = currentAngle + sliceAngle;

                                                const x1 = Math.cos(currentAngle) * radius;
                                                const y1 = Math.sin(currentAngle) * radius;
                                                const x2 = Math.cos(endAngle) * radius;
                                                const y2 = Math.sin(endAngle) * radius;

                                                const ix1 = Math.cos(endAngle) * innerRadius;
                                                const iy1 = Math.sin(endAngle) * innerRadius;
                                                const ix2 = Math.cos(currentAngle) * innerRadius;
                                                const iy2 = Math.sin(currentAngle) * innerRadius;

                                                const largeArc = sliceAngle > Math.PI ? 1 : 0;

                                                const pathData =
                                                    innerRadius > 0
                                                        ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`
                                                        : `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                                                currentAngle = endAngle;

                                                return (
                                                    <path
                                                        key={row.id}
                                                        d={pathData}
                                                        fill={row.color}
                                                        stroke='#ffffff'
                                                        strokeWidth='2'
                                                    />
                                                );
                                            });
                                        })()}

                                        {/* Donut Center Summary */}
                                        {chartType === "donut" && (
                                            <g>
                                                <text x='0' y='-4' fontSize='18' fontWeight='bold' fill='#0f172a' textAnchor='middle'>
                                                    {totalValue}
                                                </text>
                                                <text x='0' y='14' fontSize='10' fill='#64748b' textAnchor='middle'>
                                                    TOTAL
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                )}

                                {/* Legend Sidebar (for Pie/Donut) */}
                                {(chartType === "pie" || chartType === "donut") && (
                                    <g transform={`translate(${svgW - 200}, ${padTop + 20})`}>
                                        {dataRows.map((row, idx) => {
                                            const pct = Math.round((row.value / totalValue) * 100);
                                            return (
                                                <g key={row.id} transform={`translate(0, ${idx * 24})`}>
                                                    <rect width='12' height='12' rx='3' fill={row.color} />
                                                    <text x='20' y='10' fontSize='11' fill='#334155' fontWeight='500'>
                                                        {row.label}
                                                    </text>
                                                    <text x='150' y='10' fontSize='11' fill='#64748b' fontWeight='bold' textAnchor='end'>
                                                        {pct}%
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </g>
                                )}
                            </svg>
                        </div>

                        {/* Export Action Buttons */}
                        <div className='flex items-center gap-3 pt-2'>
                            <button
                                onClick={handleDownloadPng}
                                className='flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer'
                            >
                                <span>📥</span> {t.exportPng}
                            </button>
                            <button
                                onClick={handleDownloadSvg}
                                className='flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold text-xs transition-all cursor-pointer'
                            >
                                <span>📐</span> {t.exportSvg}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guide Section */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <h2 className='text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <span>📖</span> {t.guideTitle}
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs'>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-blue-600 dark:text-blue-400'>{t.guide1Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-indigo-600 dark:text-indigo-400'>{t.guide2Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1.5'>
                        <h4 className='font-bold text-emerald-600 dark:text-emerald-400'>{t.guide3Title}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <h3 className='text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                    <span>❓</span> {t.faqTitle}
                </h3>
                <div className='space-y-3 text-xs'>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq1Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq1A}</p>
                    </div>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq2Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq2A}</p>
                    </div>
                    <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 space-y-1'>
                        <h4 className='font-bold text-gray-900 dark:text-gray-100'>{t.faq3Q}</h4>
                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>{t.faq3A}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
