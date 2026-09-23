"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { barcodeGeneratorTranslations } from "@/lib/i18n/tools/barcode-generator";
import { toast } from "@/components/ui/Toast";

type BarcodeFormat = "CODE128" | "EAN13" | "UPC" | "CODE39" | "ITF14" | "MSI" | "pharmacode" | "codabar";

export default function BarcodeGeneratorContent() {
    const { locale } = useLanguage();
    const t = barcodeGeneratorTranslations[locale as "en" | "vi"] || barcodeGeneratorTranslations.en;

    const [activeTab, setActiveTab] = useState<"generate" | "scan">("generate");

    // Generator States
    const [text, setText] = useState<string>("893500180012");
    const [format, setFormat] = useState<BarcodeFormat>("CODE128");
    const [lineColor, setLineColor] = useState<string>("#000000");
    const [bgColor, setBgColor] = useState<string>("#ffffff");
    const [width, setWidth] = useState<number>(2);
    const [height, setHeight] = useState<number>(80);
    const [displayValue, setDisplayValue] = useState<boolean>(true);
    const [fontSize, setFontSize] = useState<number>(16);
    const [margin, setMargin] = useState<number>(10);
    const [textPosition, setTextPosition] = useState<"bottom" | "top">("bottom");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Scanner States
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [scanFormat, setScanFormat] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

    const svgRef = useRef<SVGSVGElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Render Barcode via JsBarcode
    const renderBarcode = useCallback(async () => {
        if (!svgRef.current || !text.trim()) return;

        try {
            setErrorMsg(null);
            const JsBarcode = (await import("jsbarcode")).default;

            JsBarcode(svgRef.current, text.trim(), {
                format: format,
                lineColor: lineColor,
                background: bgColor,
                width: width,
                height: height,
                displayValue: displayValue,
                fontSize: fontSize,
                margin: margin,
                textPosition: textPosition,
                font: "monospace",
                valid: (valid: boolean) => {
                    if (!valid) {
                        setErrorMsg(locale === "vi" ? "Định dạng mã vạch không hợp lệ với nội dung này." : "Invalid barcode format for this input.");
                    }
                },
            });
        } catch (err: any) {
            setErrorMsg(err?.message || (locale === "vi" ? "Lỗi tạo mã vạch. Vui lòng kiểm tra lại độ dài/ký tự." : "Error generating barcode. Check character format/length."));
        }
    }, [text, format, lineColor, bgColor, width, height, displayValue, fontSize, margin, textPosition, locale]);

    useEffect(() => {
        if (activeTab === "generate") {
            renderBarcode();
        }
    }, [activeTab, renderBarcode]);

    // Presets
    const applyPreset = (presetText: string, presetFormat: BarcodeFormat) => {
        setText(presetText);
        setFormat(presetFormat);
    };

    // Download PNG
    const handleDownloadPng = () => {
        if (!svgRef.current) return;
        try {
            const svgElement = svgRef.current;
            const svgString = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            const URL = window.URL || window.webkitURL || window;
            const blobURL = URL.createObjectURL(svgBlob);
            const image = new Image();

            image.onload = () => {
                const canvas = document.createElement("canvas");
                // 2x resolution for high sharpness
                const scale = 2;
                canvas.width = svgElement.clientWidth * scale || 600;
                canvas.height = svgElement.clientHeight * scale || 240;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.scale(scale, scale);
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(image, 0, 0);
                    const pngUrl = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.href = pngUrl;
                    downloadLink.download = `barcode_${format.toLowerCase()}_${Date.now()}.png`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    toast.success(locale === "vi" ? "Đã tải xuống ảnh PNG!" : "Downloaded PNG image!");
                }
            };
            image.src = blobURL;
        } catch (e) {
            toast.error("Error exporting PNG");
        }
    };

    // Download SVG
    const handleDownloadSvg = () => {
        if (!svgRef.current) return;
        try {
            const svgString = new XMLSerializer().serializeToString(svgRef.current);
            const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `barcode_${format.toLowerCase()}_${Date.now()}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success(locale === "vi" ? "Đã tải xuống file SVG Vector!" : "Downloaded vector SVG!");
        } catch (e) {
            toast.error("Error exporting SVG");
        }
    };

    // Print Barcode
    const handlePrint = () => {
        if (!svgRef.current) return;
        const svgHtml = svgRef.current.outerHTML;
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Print Barcode - AnyTools</title>
                    <style>
                        body {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            margin: 0;
                            background: #fff;
                        }
                        @media print {
                            body { margin: 0; padding: 20px; }
                        }
                    </style>
                </head>
                <body>
                    ${svgHtml}
                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() { window.close(); };
                        };
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    // Scan Barcode from Image File
    const handleImageUpload = async (file: File) => {
        setIsScanning(true);
        setScanResult(null);
        setScanFormat(null);

        try {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = async () => {
                if ("BarcodeDetector" in window) {
                    try {
                        const detector = new (window as any).BarcodeDetector();
                        const barcodes = await detector.detect(img);
                        if (barcodes && barcodes.length > 0) {
                            setScanResult(barcodes[0].rawValue);
                            setScanFormat(barcodes[0].format);
                            toast.success(locale === "vi" ? "Đã quét thành công mã vạch!" : "Barcode decoded successfully!");
                            setIsScanning(false);
                            return;
                        }
                    } catch (err) {}
                }

                // Fallback check
                toast.warning(t.noBarcodeFound);
                setIsScanning(false);
            };
        } catch (e) {
            toast.error(t.noBarcodeFound);
            setIsScanning(false);
        }
    };

    // Camera Barcode Scanning
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsCameraActive(true);

                if ("BarcodeDetector" in window) {
                    const detector = new (window as any).BarcodeDetector();
                    scanIntervalRef.current = setInterval(async () => {
                        if (videoRef.current && videoRef.current.readyState === 4) {
                            try {
                                const codes = await detector.detect(videoRef.current);
                                if (codes && codes.length > 0) {
                                    setScanResult(codes[0].rawValue);
                                    setScanFormat(codes[0].format);
                                    toast.success(locale === "vi" ? "Đã phát hiện mã vạch!" : "Barcode detected!");
                                    stopCamera();
                                }
                            } catch (e) {}
                        }
                    }, 500);
                }
            }
        } catch (e) {
            toast.error(t.cameraNotFound);
        }
    };

    const stopCamera = useCallback(() => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    }, []);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Mode Tabs */}
            <div className='flex items-center p-1.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full'>
                <button
                    onClick={() => {
                        stopCamera();
                        setActiveTab("generate");
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "generate"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    🏷️ {t.tabGenerate}
                </button>
                <button
                    onClick={() => setActiveTab("scan")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "scan"
                            ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                >
                    📷 {t.tabScan}
                </button>
            </div>

            {/* GENERATE TAB */}
            {activeTab === "generate" && (
                <div className='w-full grid grid-cols-1 lg:grid-cols-12 gap-6'>
                    {/* Controls Column */}
                    <div className='lg:col-span-5 bg-white dark:bg-gray-900 p-6 sm:p-7 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4'>
                        <h3 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                            <span>⚙️</span> {t.name}
                        </h3>

                        {/* Presets */}
                        <div>
                            <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5'>
                                ⚡ {t.presets}:
                            </label>
                            <div className='flex flex-wrap gap-1.5'>
                                <button
                                    onClick={() => applyPreset("893500180012", "EAN13")}
                                    className='px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all cursor-pointer'
                                >
                                    {t.presetProduct}
                                </button>
                                <button
                                    onClick={() => applyPreset("012345678905", "UPC")}
                                    className='px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all cursor-pointer'
                                >
                                    {t.presetUpc}
                                </button>
                                <button
                                    onClick={() => applyPreset("SHP-2026-9988", "CODE128")}
                                    className='px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all cursor-pointer'
                                >
                                    {t.presetShipping}
                                </button>
                                <button
                                    onClick={() => applyPreset("ASSET-0921", "CODE39")}
                                    className='px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all cursor-pointer'
                                >
                                    {t.presetInventory}
                                </button>
                            </div>
                        </div>

                        {/* Input Value */}
                        <div>
                            <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                {t.barcodeText}
                            </label>
                            <input
                                type='text'
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={t.barcodeTextPlaceholder}
                                className='w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500'
                            />
                        </div>

                        {/* Format Symbology */}
                        <div>
                            <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5'>
                                {t.format}
                            </label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value as BarcodeFormat)}
                                className='w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white font-semibold cursor-pointer'
                            >
                                <option value='CODE128'>Code 128 (Standard Logistics & General)</option>
                                <option value='EAN13'>EAN-13 (Supermarket & Retail Global)</option>
                                <option value='UPC'>UPC-A (North American Retail)</option>
                                <option value='CODE39'>Code 39 (Alphanumeric Inventory)</option>
                                <option value='ITF14'>ITF-14 (Cardboard Shipping Box)</option>
                                <option value='MSI'>MSI / Plessey (Storage & Warehouse)</option>
                                <option value='codabar'>Codabar (Libraries & Blood Banks)</option>
                                <option value='pharmacode'>Pharmacode (Pharmaceutical)</option>
                            </select>
                        </div>

                        {/* Colors */}
                        <div className='grid grid-cols-2 gap-3'>
                            <div>
                                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                                    {t.lineColor}
                                </label>
                                <div className='flex items-center gap-2'>
                                    <input
                                        type='color'
                                        value={lineColor}
                                        onChange={(e) => setLineColor(e.target.value)}
                                        className='w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 p-0.5 cursor-pointer bg-transparent'
                                    />
                                    <span className='text-xs font-mono text-gray-500 uppercase'>{lineColor}</span>
                                </div>
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                                    {t.bgColor}
                                </label>
                                <div className='flex items-center gap-2'>
                                    <input
                                        type='color'
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className='w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 p-0.5 cursor-pointer bg-transparent'
                                    />
                                    <span className='text-xs font-mono text-gray-500 uppercase'>{bgColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sizing: Width & Height */}
                        <div className='grid grid-cols-2 gap-3 pt-1'>
                            <div>
                                <div className='flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                                    <span>{t.widthScale}</span>
                                    <span className='font-mono'>{width}px</span>
                                </div>
                                <input
                                    type='range'
                                    min='1'
                                    max='4'
                                    step='0.5'
                                    value={width}
                                    onChange={(e) => setWidth(parseFloat(e.target.value))}
                                    className='w-full accent-blue-600 cursor-pointer'
                                />
                            </div>

                            <div>
                                <div className='flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1'>
                                    <span>{t.heightScale}</span>
                                    <span className='font-mono'>{height}px</span>
                                </div>
                                <input
                                    type='range'
                                    min='30'
                                    max='140'
                                    step='5'
                                    value={height}
                                    onChange={(e) => setHeight(parseInt(e.target.value, 10))}
                                    className='w-full accent-blue-600 cursor-pointer'
                                />
                            </div>
                        </div>

                        {/* Typography & Margins */}
                        <div className='pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3'>
                            <label className='flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={displayValue}
                                    onChange={(e) => setDisplayValue(e.target.checked)}
                                    className='rounded accent-blue-600 w-4 h-4'
                                />
                                <span>{t.displayText}</span>
                            </label>

                            {displayValue && (
                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <label className='block text-[11px] font-semibold text-gray-500 mb-1'>
                                            {t.fontSize}: {fontSize}px
                                        </label>
                                        <input
                                            type='range'
                                            min='10'
                                            max='26'
                                            value={fontSize}
                                            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                                            className='w-full accent-blue-600 cursor-pointer'
                                        />
                                    </div>

                                    <div>
                                        <label className='block text-[11px] font-semibold text-gray-500 mb-1'>
                                            {t.textPosition}
                                        </label>
                                        <select
                                            value={textPosition}
                                            onChange={(e) => setTextPosition(e.target.value as "bottom" | "top")}
                                            className='w-full px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold'
                                        >
                                            <option value='bottom'>{t.posBottom}</option>
                                            <option value='top'>{t.posTop}</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview & Download Column */}
                    <div className='lg:col-span-7 flex flex-col justify-between bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6'>
                        <div className='space-y-4'>
                            <div className='flex items-center justify-between'>
                                <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5'>
                                    <span>👁️</span> Preview
                                </h4>
                                <span className='text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md'>
                                    {format}
                                </span>
                            </div>

                            {/* Barcode SVG Container */}
                            <div
                                className='w-full min-h-[260px] flex items-center justify-center p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 overflow-x-auto shadow-inner transition-all'
                                style={{ backgroundColor: bgColor }}
                            >
                                <svg ref={svgRef} className='max-w-full' />
                            </div>

                            {errorMsg && (
                                <div className='p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2'>
                                    <span>⚠️</span> {errorMsg}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
                            <Button
                                onClick={handleDownloadPng}
                                variant='primary'
                                size='md'
                                className='h-12 flex items-center justify-center rounded-2xl text-xs sm:text-sm font-bold cursor-pointer shadow-md'
                            >
                                🖼️ {t.downloadPng}
                            </Button>

                            <Button
                                onClick={handleDownloadSvg}
                                variant='secondary'
                                size='md'
                                className='h-12 flex items-center justify-center rounded-2xl text-xs sm:text-sm font-bold cursor-pointer border border-gray-200 dark:border-gray-700'
                            >
                                📐 {t.downloadSvg}
                            </Button>

                            <Button
                                onClick={handlePrint}
                                variant='secondary'
                                size='md'
                                className='h-12 flex items-center justify-center rounded-2xl text-xs sm:text-sm font-bold cursor-pointer border border-gray-200 dark:border-gray-700'
                            >
                                🖨️ {t.printBarcode}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* SCAN TAB */}
            {activeTab === "scan" && (
                <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6 text-center max-w-2xl'>
                    <div className='space-y-1'>
                        <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2'>
                            <span>📷</span> {t.scannerTitle}
                        </h3>
                        <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
                            {t.scannerDesc}
                        </p>
                    </div>

                    {/* Camera Viewport */}
                    {isCameraActive ? (
                        <div className='relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-700 shadow-inner flex items-center justify-center'>
                            <video ref={videoRef} playsInline muted className='w-full h-full object-cover' />
                            <div className='absolute inset-x-12 inset-y-16 border-2 border-red-500/80 rounded-xl pointer-events-none animate-pulse' />
                            <button
                                onClick={stopCamera}
                                className='absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer shadow-md'
                            >
                                ✕ {t.stopCamera}
                            </button>
                        </div>
                    ) : (
                        /* Upload Drag Drop Area */
                        <label className='flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-all p-6'>
                            <span className='text-4xl mb-3'>📥</span>
                            <span className='text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 mb-1'>
                                {t.dragDrop}
                            </span>
                            <span className='text-[11px] text-gray-400 font-mono'>PNG, JPG, WEBP</span>
                            <input
                                type='file'
                                accept='image/*'
                                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                className='hidden'
                            />
                        </label>
                    )}

                    {/* Camera Control Action */}
                    <div className='flex justify-center gap-3'>
                        {!isCameraActive && (
                            <Button
                                onClick={startCamera}
                                variant='primary'
                                size='md'
                                className='h-11 px-6 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer shadow-sm'
                            >
                                📹 {t.startCamera}
                            </Button>
                        )}
                    </div>

                    {/* Scan Result */}
                    {scanResult && (
                        <div className='p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-left space-y-2'>
                            <div className='flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 font-bold'>
                                <span>✅ {t.scanResult}</span>
                                {scanFormat && <span className='font-mono uppercase'>{scanFormat}</span>}
                            </div>
                            <div className='p-3 bg-white dark:bg-gray-900 rounded-xl font-mono text-sm sm:text-base font-extrabold text-gray-900 dark:text-white break-all border border-emerald-100 dark:border-emerald-900'>
                                {scanResult}
                            </div>
                            <div className='flex justify-end gap-2 pt-1'>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(scanResult);
                                        toast.success(t.copied);
                                    }}
                                    className='px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs'
                                >
                                    📋 {t.copyResult}
                                </button>
                                <button
                                    onClick={() => {
                                        setText(scanResult);
                                        setActiveTab("generate");
                                    }}
                                    className='px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs'
                                >
                                    🔄 Load in Generator
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Guide & Knowledge */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>💡</span> {t.guideTitle}
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>1. {t.guide1Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>2. {t.guide2Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>3. {t.guide3Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
