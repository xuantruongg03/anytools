"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { unitConverterTranslations } from "@/lib/i18n/tools/unit-converter";
import { toast } from "@/components/ui/Toast";

interface UnitDef {
    id: string;
    symbol: string;
    nameEn: string;
    nameVi: string;
    toBase: (v: number) => number;
    fromBase: (v: number) => number;
}

interface CategoryDef {
    id: string;
    icon: string;
    nameKey: keyof typeof unitConverterTranslations.en.categories;
    baseUnitSymbol: string;
    units: UnitDef[];
}

const CATEGORIES: CategoryDef[] = [
    {
        id: "length",
        icon: "📏",
        nameKey: "length",
        baseUnitSymbol: "m",
        units: [
            { id: "mm", symbol: "mm", nameEn: "Millimeter", nameVi: "Milimét", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
            { id: "cm", symbol: "cm", nameEn: "Centimeter", nameVi: "Centimét", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
            { id: "m", symbol: "m", nameEn: "Meter", nameVi: "Mét", toBase: (v) => v, fromBase: (v) => v },
            { id: "km", symbol: "km", nameEn: "Kilometer", nameVi: "Kilômét", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            { id: "in", symbol: "in", nameEn: "Inch", nameVi: "Inch", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
            { id: "ft", symbol: "ft", nameEn: "Foot", nameVi: "Foot", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
            { id: "yd", symbol: "yd", nameEn: "Yard", nameVi: "Yard", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
            { id: "mi", symbol: "mi", nameEn: "Mile", nameVi: "Dặm (Mile)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
            { id: "nmi", symbol: "nmi", nameEn: "Nautical Mile", nameVi: "Hải lý", toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
            { id: "um", symbol: "µm", nameEn: "Micrometer", nameVi: "Micrômét", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
            { id: "nm", symbol: "nm", nameEn: "Nanometer", nameVi: "Nanômét", toBase: (v) => v / 1e9, fromBase: (v) => v * 1e9 },
        ],
    },
    {
        id: "mass",
        icon: "⚖️",
        nameKey: "mass",
        baseUnitSymbol: "kg",
        units: [
            { id: "mg", symbol: "mg", nameEn: "Milligram", nameVi: "Miligram", toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
            { id: "g", symbol: "g", nameEn: "Gram", nameVi: "Gram", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
            { id: "kg", symbol: "kg", nameEn: "Kilogram", nameVi: "Kilôgam", toBase: (v) => v, fromBase: (v) => v },
            { id: "t", symbol: "t", nameEn: "Metric Ton", nameVi: "Tấn", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            { id: "oz", symbol: "oz", nameEn: "Ounce", nameVi: "Ounce", toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
            { id: "lb", symbol: "lb", nameEn: "Pound", nameVi: "Pound (Cân Anh)", toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
            { id: "st", symbol: "st", nameEn: "Stone", nameVi: "Stone", toBase: (v) => v * 6.35029318, fromBase: (v) => v / 6.35029318 },
        ],
    },
    {
        id: "temperature",
        icon: "🌡️",
        nameKey: "temperature",
        baseUnitSymbol: "°C",
        units: [
            { id: "c", symbol: "°C", nameEn: "Celsius", nameVi: "Độ Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
            { id: "f", symbol: "°F", nameEn: "Fahrenheit", nameVi: "Độ Fahrenheit (°F)", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
            { id: "k", symbol: "K", nameEn: "Kelvin", nameVi: "Độ Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
            { id: "r", symbol: "°R", nameEn: "Rankine", nameVi: "Độ Rankine (°R)", toBase: (v) => ((v - 491.67) * 5) / 9, fromBase: (v) => ((v + 273.15) * 9) / 5 },
        ],
    },
    {
        id: "area",
        icon: "📐",
        nameKey: "area",
        baseUnitSymbol: "m²",
        units: [
            { id: "sqcm", symbol: "cm²", nameEn: "Square Centimeter", nameVi: "Centimét vuông", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
            { id: "sqm", symbol: "m²", nameEn: "Square Meter", nameVi: "Mét vuông", toBase: (v) => v, fromBase: (v) => v },
            { id: "sqkm", symbol: "km²", nameEn: "Square Kilometer", nameVi: "Kilômét vuông", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
            { id: "ha", symbol: "ha", nameEn: "Hectare", nameVi: "Hécta", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
            { id: "ac", symbol: "ac", nameEn: "Acre", nameVi: "Mẫu Anh (Acre)", toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 },
            { id: "sqft", symbol: "ft²", nameEn: "Square Foot", nameVi: "Foot vuông", toBase: (v) => v * 0.09290304, fromBase: (v) => v / 0.09290304 },
            { id: "sqin", symbol: "in²", nameEn: "Square Inch", nameVi: "Inch vuông", toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
            { id: "sqmi", symbol: "mi²", nameEn: "Square Mile", nameVi: "Dặm vuông", toBase: (v) => v * 2589988.110336, fromBase: (v) => v / 2589988.110336 },
        ],
    },
    {
        id: "volume",
        icon: "🧪",
        nameKey: "volume",
        baseUnitSymbol: "L",
        units: [
            { id: "ml", symbol: "mL", nameEn: "Milliliter", nameVi: "Mililít", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
            { id: "l", symbol: "L", nameEn: "Liter", nameVi: "Lít", toBase: (v) => v, fromBase: (v) => v },
            { id: "m3", symbol: "m³", nameEn: "Cubic Meter", nameVi: "Mét khối", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            { id: "gal", symbol: "gal (US)", nameEn: "US Gallon", nameVi: "Gallon Mỹ", toBase: (v) => v * 3.785411784, fromBase: (v) => v / 3.785411784 },
            { id: "qt", symbol: "qt (US)", nameEn: "US Quart", nameVi: "Quart Mỹ", toBase: (v) => v * 0.946352946, fromBase: (v) => v / 0.946352946 },
            { id: "pt", symbol: "pt (US)", nameEn: "US Pint", nameVi: "Pint Mỹ", toBase: (v) => v * 0.473176473, fromBase: (v) => v / 0.473176473 },
            { id: "cup", symbol: "cup (US)", nameEn: "US Cup", nameVi: "Cốc Mỹ (Cup)", toBase: (v) => v * 0.2365882365, fromBase: (v) => v / 0.2365882365 },
            { id: "floz", symbol: "fl oz (US)", nameEn: "US Fluid Ounce", nameVi: "Ounce chất lỏng", toBase: (v) => v * 0.0295735295625, fromBase: (v) => v / 0.0295735295625 },
            { id: "tbsp", symbol: "tbsp", nameEn: "Tablespoon", nameVi: "Muỗng canh", toBase: (v) => v * 0.01478676478125, fromBase: (v) => v / 0.01478676478125 },
            { id: "tsp", symbol: "tsp", nameEn: "Teaspoon", nameVi: "Muỗng cà phê", toBase: (v) => v * 0.00492892159375, fromBase: (v) => v / 0.00492892159375 },
        ],
    },
    {
        id: "speed",
        icon: "🚀",
        nameKey: "speed",
        baseUnitSymbol: "m/s",
        units: [
            { id: "ms", symbol: "m/s", nameEn: "Meter per second", nameVi: "Mét trên giây", toBase: (v) => v, fromBase: (v) => v },
            { id: "kmh", symbol: "km/h", nameEn: "Kilometer per hour", nameVi: "Kilômét trên giờ", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
            { id: "mph", symbol: "mph", nameEn: "Mile per hour", nameVi: "Dặm trên giờ", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
            { id: "kn", symbol: "kn", nameEn: "Knot", nameVi: "Hải lý/giờ (Knot)", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
            { id: "mach", symbol: "Mach", nameEn: "Mach (Speed of Sound)", nameVi: "Tốc độ âm thanh (Mach)", toBase: (v) => v * 340.29, fromBase: (v) => v / 340.29 },
        ],
    },
    {
        id: "time",
        icon: "⏱️",
        nameKey: "time",
        baseUnitSymbol: "s",
        units: [
            { id: "ms", symbol: "ms", nameEn: "Millisecond", nameVi: "Mili giây", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
            { id: "s", symbol: "s", nameEn: "Second", nameVi: "Giây", toBase: (v) => v, fromBase: (v) => v },
            { id: "min", symbol: "min", nameEn: "Minute", nameVi: "Phút", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
            { id: "h", symbol: "h", nameEn: "Hour", nameVi: "Giờ", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
            { id: "d", symbol: "d", nameEn: "Day", nameVi: "Ngày", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
            { id: "wk", symbol: "wk", nameEn: "Week", nameVi: "Tuần", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
            { id: "mo", symbol: "mo", nameEn: "Month (avg 30.44d)", nameVi: "Tháng (trung bình)", toBase: (v) => v * 2629800, fromBase: (v) => v / 2629800 },
            { id: "yr", symbol: "yr", nameEn: "Year (365.25d)", nameVi: "Năm", toBase: (v) => v * 31557600, fromBase: (v) => v / 31557600 },
        ],
    },
    {
        id: "digital",
        icon: "💾",
        nameKey: "digital",
        baseUnitSymbol: "B",
        units: [
            { id: "b", symbol: "b", nameEn: "Bit", nameVi: "Bit", toBase: (v) => v / 8, fromBase: (v) => v * 8 },
            { id: "B", symbol: "B", nameEn: "Byte", nameVi: "Byte", toBase: (v) => v, fromBase: (v) => v },
            { id: "KB", symbol: "KB", nameEn: "Kilobyte (1,000 B)", nameVi: "Kilobyte (1.000 B)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            { id: "MB", symbol: "MB", nameEn: "Megabyte (10^6 B)", nameVi: "Megabyte (10^6 B)", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
            { id: "GB", symbol: "GB", nameEn: "Gigabyte (10^9 B)", nameVi: "Gigabyte (10^9 B)", toBase: (v) => v * 1e9, fromBase: (v) => v / 1e9 },
            { id: "TB", symbol: "TB", nameEn: "Terabyte (10^12 B)", nameVi: "Terabyte (10^12 B)", toBase: (v) => v * 1e12, fromBase: (v) => v / 1e12 },
            { id: "PB", symbol: "PB", nameEn: "Petabyte (10^15 B)", nameVi: "Petabyte (10^15 B)", toBase: (v) => v * 1e15, fromBase: (v) => v / 1e15 },
            { id: "KiB", symbol: "KiB", nameEn: "Kibibyte (1,024 B)", nameVi: "Kibibyte (1.024 B)", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
            { id: "MiB", symbol: "MiB", nameEn: "Mebibyte (1,024² B)", nameVi: "Mebibyte (1.024² B)", toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
            { id: "GiB", symbol: "GiB", nameEn: "Gibibyte (1,024³ B)", nameVi: "Gibibyte (1.024³ B)", toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
            { id: "TiB", symbol: "TiB", nameEn: "Tebibyte (1,024⁴ B)", nameVi: "Tebibyte (1.024⁴ B)", toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
        ],
    },
    {
        id: "energy",
        icon: "⚡",
        nameKey: "energy",
        baseUnitSymbol: "J",
        units: [
            { id: "j", symbol: "J", nameEn: "Joule", nameVi: "Jun (Joule)", toBase: (v) => v, fromBase: (v) => v },
            { id: "kj", symbol: "kJ", nameEn: "Kilojoule", nameVi: "Kilôjun (kJ)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            { id: "cal", symbol: "cal", nameEn: "Calorie", nameVi: "Calo", toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
            { id: "kcal", symbol: "kcal", nameEn: "Kilocalorie (Food cal)", nameVi: "Kilôcalo (Calo thực phẩm)", toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
            { id: "wh", symbol: "Wh", nameEn: "Watt-hour", nameVi: "Oát-giờ (Wh)", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
            { id: "kwh", symbol: "kWh", nameEn: "Kilowatt-hour", nameVi: "Kilôoát-giờ (Số điện kWh)", toBase: (v) => v * 3.6e6, fromBase: (v) => v / 3.6e6 },
            { id: "btu", symbol: "BTU", nameEn: "British Thermal Unit", nameVi: "BTU (Nhiệt Anh)", toBase: (v) => v * 1055.06, fromBase: (v) => v / 1055.06 },
            { id: "ev", symbol: "eV", nameEn: "Electronvolt", nameVi: "Electronvôn", toBase: (v) => v * 1.602176634e-19, fromBase: (v) => v / 1.602176634e-19 },
        ],
    },
    {
        id: "pressure",
        icon: "🧭",
        nameKey: "pressure",
        baseUnitSymbol: "Pa",
        units: [
            { id: "pa", symbol: "Pa", nameEn: "Pascal", nameVi: "Pascal", toBase: (v) => v, fromBase: (v) => v },
            { id: "kpa", symbol: "kPa", nameEn: "Kilopascal", nameVi: "Kilôpascal", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
            { id: "bar", symbol: "bar", nameEn: "Bar", nameVi: "Bar", toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
            { id: "atm", symbol: "atm", nameEn: "Standard Atmosphere", nameVi: "Khí quyển tiêu chuẩn (Atm)", toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
            { id: "psi", symbol: "psi", nameEn: "Pounds per sq inch", nameVi: "PSI (Pound/inch vuông)", toBase: (v) => v * 6894.757, fromBase: (v) => v / 6894.757 },
            { id: "torr", symbol: "mmHg / Torr", nameEn: "Torr (mmHg)", nameVi: "Milimét thủy ngân (Torr)", toBase: (v) => v * 133.322, fromBase: (v) => v / 133.322 },
        ],
    },
];

export default function UnitConverterContent() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";
    const t = unitConverterTranslations[locale];

    const [selectedCatId, setSelectedCatId] = useState<string>("length");
    const [inputValue, setInputValue] = useState<string>("1");
    const [fromUnitId, setFromUnitId] = useState<string>("m");
    const [toUnitId, setToUnitId] = useState<string>("ft");
    const [precision, setPrecision] = useState<number>(4);
    const [useScientific, setUseScientific] = useState<boolean>(false);

    const currentCat = useMemo(() => {
        return CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];
    }, [selectedCatId]);

    const handleCategoryChange = (catId: string) => {
        setSelectedCatId(catId);
        const cat = CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0];
        setFromUnitId(cat.units[0].id);
        setToUnitId(cat.units.length > 1 ? cat.units[1].id : cat.units[0].id);
    };

    const fromUnit = useMemo(() => {
        return currentCat.units.find((u) => u.id === fromUnitId) || currentCat.units[0];
    }, [currentCat, fromUnitId]);

    const toUnit = useMemo(() => {
        return currentCat.units.find((u) => u.id === toUnitId) || currentCat.units[1] || currentCat.units[0];
    }, [currentCat, toUnitId]);

    // Perform conversion
    const numVal = parseFloat(inputValue);
    const isValid = !isNaN(numVal);

    const formatValue = (val: number, prec: number, scientific: boolean): string => {
        if (isNaN(val)) return "0";
        if (scientific || (Math.abs(val) > 0 && (Math.abs(val) < 1e-4 || Math.abs(val) >= 1e9))) {
            return val.toExponential(prec);
        }
        return Number(val.toFixed(prec)).toLocaleString(isVi ? "vi-VN" : "en-US", {
            maximumFractionDigits: prec,
        });
    };

    const convertedValue = useMemo(() => {
        if (!isValid) return "—";
        const inBase = fromUnit.toBase(numVal);
        const targetVal = toUnit.fromBase(inBase);
        return formatValue(targetVal, precision, useScientific);
    }, [numVal, isValid, fromUnit, toUnit, precision, useScientific, isVi]);

    // Matrix calculation for all units in current category
    const matrixResults = useMemo(() => {
        if (!isValid) return [];
        const inBase = fromUnit.toBase(numVal);
        return currentCat.units.map((unit) => {
            const rawVal = unit.fromBase(inBase);
            return {
                unit,
                formatted: formatValue(rawVal, precision, useScientific),
                raw: rawVal,
            };
        });
    }, [numVal, isValid, fromUnit, currentCat, precision, useScientific, isVi]);

    // Conversion formula text
    const formulaText = useMemo(() => {
        if (currentCat.id === "temperature") {
            if (fromUnit.id === "c" && toUnit.id === "f") return "°F = (°C × 9/5) + 32";
            if (fromUnit.id === "f" && toUnit.id === "c") return "°C = (°F − 32) × 5/9";
            if (fromUnit.id === "c" && toUnit.id === "k") return "K = °C + 273.15";
            if (fromUnit.id === "k" && toUnit.id === "c") return "°C = K − 273.15";
            return `${fromUnit.symbol} ➔ Base (${currentCat.baseUnitSymbol}) ➔ ${toUnit.symbol}`;
        }
        const oneFromInTo = toUnit.fromBase(fromUnit.toBase(1));
        const oneToInFrom = fromUnit.fromBase(toUnit.toBase(1));
        return `1 ${fromUnit.symbol} = ${formatValue(oneFromInTo, 6, false)} ${toUnit.symbol}   |   1 ${toUnit.symbol} = ${formatValue(oneToInFrom, 6, false)} ${fromUnit.symbol}`;
    }, [currentCat, fromUnit, toUnit]);

    const handleSwap = () => {
        const temp = fromUnitId;
        setFromUnitId(toUnitId);
        setToUnitId(temp);
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(t.copied);
        } catch {
            toast.error(isVi ? "Lỗi sao chép" : "Failed to copy");
        }
    };

    // Presets
    const presets = [
        { label: "1 mi ➔ km", cat: "length", from: "mi", to: "km", val: "1" },
        { label: "100 km/h ➔ mph", cat: "speed", from: "kmh", to: "mph", val: "100" },
        { label: "37 °C ➔ °F", cat: "temperature", from: "c", to: "f", val: "37" },
        { label: "1 kg ➔ lb", cat: "mass", from: "kg", to: "lb", val: "1" },
        { label: "1 GB ➔ MB", cat: "digital", from: "GB", to: "MB", val: "1" },
        { label: "1 gal ➔ L", cat: "volume", from: "gal", to: "l", val: "1" },
        { label: "1 kWh ➔ kJ", cat: "energy", from: "kwh", to: "kj", val: "1" },
        { label: "1 bar ➔ psi", cat: "pressure", from: "bar", to: "psi", val: "1" },
    ];

    const loadPreset = (p: typeof presets[0]) => {
        setSelectedCatId(p.cat);
        setFromUnitId(p.from);
        setToUnitId(p.to);
        setInputValue(p.val);
        toast.info(isVi ? `Đã chọn mẫu: ${p.label}` : `Selected preset: ${p.label}`);
    };

    return (
        <div className='max-w-6xl mx-auto space-y-8'>
            {/* Header info */}
            <div className='text-center space-y-2'>
                <h1 className='text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3'>
                    <span>🔄</span> {t.name}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
                    {t.description}
                </p>
            </div>

            {/* Category Selector Pills */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto'>
                <div className='flex items-center gap-1.5 min-w-max'>
                    {CATEGORIES.map((cat) => {
                        const active = cat.id === selectedCatId;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                    active
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                                        : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750"
                                }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{t.categories[cat.nameKey]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Popular Presets */}
            <div className='flex items-center gap-2 flex-wrap'>
                <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>
                    ⚡ {t.popularPresets}:
                </span>
                {presets.map((p, idx) => (
                    <button
                        key={idx}
                        onClick={() => loadPreset(p)}
                        className='px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer'
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Main Interactive Conversion Studio */}
            <div className='bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4 items-center'>
                    {/* FROM BOX */}
                    <div className='md:col-span-2 space-y-2'>
                        <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                            {t.fromLabel}
                        </label>
                        <select
                            value={fromUnitId}
                            onChange={(e) => setFromUnitId(e.target.value)}
                            className='w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                        >
                            {currentCat.units.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {isVi ? u.nameVi : u.nameEn} ({u.symbol})
                                </option>
                            ))}
                        </select>
                        <div className='relative'>
                            <input
                                type='number'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder='0'
                                className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xl font-bold font-mono text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <span className='absolute right-4 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-gray-400'>
                                {fromUnit.symbol}
                            </span>
                        </div>
                    </div>

                    {/* SWAP BUTTON */}
                    <div className='flex justify-center md:col-span-1 pt-4 md:pt-0'>
                        <button
                            type='button'
                            onClick={handleSwap}
                            title={t.swapUnits}
                            className='p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 shadow-sm transition-all hover:scale-110 active:scale-95 cursor-pointer'
                        >
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
                            </svg>
                        </button>
                    </div>

                    {/* TO BOX */}
                    <div className='md:col-span-2 space-y-2'>
                        <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                            {t.toLabel}
                        </label>
                        <select
                            value={toUnitId}
                            onChange={(e) => setToUnitId(e.target.value)}
                            className='w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                        >
                            {currentCat.units.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {isVi ? u.nameVi : u.nameEn} ({u.symbol})
                                </option>
                            ))}
                        </select>
                        <div className='relative flex items-center justify-between px-4 py-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl'>
                            <span className='text-xl font-bold font-mono text-blue-700 dark:text-blue-300 break-all select-all'>
                                {convertedValue}
                            </span>
                            <div className='flex items-center gap-2 shrink-0 ml-2'>
                                <span className='font-mono text-sm font-bold text-blue-500'>
                                    {toUnit.symbol}
                                </span>
                                <button
                                    type='button'
                                    onClick={() => handleCopy(`${convertedValue} ${toUnit.symbol}`)}
                                    className='px-2 py-1 rounded bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-xs cursor-pointer'
                                >
                                    📋 {t.copyVal}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Precision & Controls Bar */}
                <div className='flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center gap-3'>
                        <span className='text-xs font-semibold text-gray-600 dark:text-gray-400'>
                            {t.precisionLabel}: <span className='font-mono font-bold text-blue-600'>{precision}</span>
                        </span>
                        <input
                            type='range'
                            min='0'
                            max='8'
                            value={precision}
                            onChange={(e) => setPrecision(parseInt(e.target.value, 10))}
                            className='w-28 sm:w-36 accent-blue-600 cursor-pointer'
                        />
                    </div>

                    <label className='flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer'>
                        <input
                            type='checkbox'
                            checked={useScientific}
                            onChange={(e) => setUseScientific(e.target.checked)}
                            className='rounded accent-blue-600'
                        />
                        <span>{t.scientificNotation}</span>
                    </label>
                </div>

                {/* Formula Box */}
                <div className='p-3.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-xs flex flex-wrap items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                        <span>💡</span>
                        <span className='font-semibold text-gray-700 dark:text-gray-300'>{t.formulaTitle}:</span>
                        <code className='font-mono font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700'>
                            {formulaText}
                        </code>
                    </div>
                </div>
            </div>

            {/* Category Comparison Matrix */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <div className='flex items-center justify-between'>
                    <h3 className='text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                        <span>📊</span> {t.allUnitsInCat} ({t.categories[currentCat.nameKey]})
                    </h3>
                    <span className='text-xs text-gray-500 font-mono'>
                        {currentCat.units.length} units
                    </span>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {matrixResults.map(({ unit, formatted }) => {
                        const isCurrentFrom = unit.id === fromUnit.id;
                        const isCurrentTo = unit.id === toUnit.id;
                        return (
                            <div
                                key={unit.id}
                                className={`p-3.5 rounded-xl border transition-all ${
                                    isCurrentTo
                                        ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-xs"
                                        : isCurrentFrom
                                        ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600"
                                        : "bg-gray-50/60 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700/80 hover:border-gray-300"
                                } flex flex-col justify-between`}
                            >
                                <div className='flex items-center justify-between mb-1'>
                                    <span className='text-xs font-semibold text-gray-800 dark:text-gray-200'>
                                        {isVi ? unit.nameVi : unit.nameEn}
                                    </span>
                                    <span className='text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'>
                                        {unit.symbol}
                                    </span>
                                </div>
                                <div className='flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800'>
                                    <span className='font-mono font-bold text-sm text-gray-900 dark:text-gray-100 break-all'>
                                        {formatted}
                                    </span>
                                    <button
                                        type='button'
                                        onClick={() => handleCopy(`${formatted} ${unit.symbol}`)}
                                        className='text-[10px] px-2 py-0.5 rounded bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 cursor-pointer ml-2 shrink-0'
                                    >
                                        {t.copyVal}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
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
