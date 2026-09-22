"use client";

import { useState, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { exifViewerTranslations } from "@/lib/i18n/tools/exif-viewer";
import { toast } from "@/components/ui/Toast";

interface ExifData {
    make?: string;
    model?: string;
    lens?: string;
    software?: string;
    dateTime?: string;
    focalLength?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    exposureBias?: string;
    flash?: string;
    width?: number;
    height?: number;
    fileSize?: string;
    fileName?: string;
    gps?: {
        latitude: number;
        longitude: number;
        altitude?: number;
        mapsUrl: string;
    };
}

// Client-side Binary EXIF Parser
function parseExifFromArrayBuffer(buffer: ArrayBuffer): ExifData | null {
    const dataView = new DataView(buffer);

    // Check for JPEG SOI (0xFFD8)
    if (dataView.getUint16(0, false) !== 0xffd8) {
        return null;
    }

    let offset = 2;
    const length = buffer.byteLength;
    let app1Offset = -1;

    // Scan for APP1 marker (0xFFE1)
    while (offset < length - 1) {
        const marker = dataView.getUint16(offset, false);
        offset += 2;

        if (marker === 0xffe1) {
            app1Offset = offset;
            break;
        } else if ((marker & 0xff00) === 0xff00) {
            const segLength = dataView.getUint16(offset, false);
            offset += segLength;
        } else {
            break;
        }
    }

    if (app1Offset === -1) return null;

    // Read segment length and Exif header "Exif\0\0" (0x457869660000)
    offset = app1Offset + 2;
    const header = String.fromCharCode(
        dataView.getUint8(offset),
        dataView.getUint8(offset + 1),
        dataView.getUint8(offset + 2),
        dataView.getUint8(offset + 3)
    );

    if (header !== "Exif") return null;

    // TIFF Header starts at offset + 6
    const tiffOffset = offset + 6;
    const isLittleEndian = dataView.getUint16(tiffOffset, false) === 0x4949;

    const readU16 = (o: number) => dataView.getUint16(tiffOffset + o, isLittleEndian);
    const readU32 = (o: number) => dataView.getUint32(tiffOffset + o, isLittleEndian);

    const firstIfdOffset = readU32(4);
    if (firstIfdOffset < 8) return null;

    const exif: ExifData = {};
    let subIfdOffset = -1;
    let gpsIfdOffset = -1;

    // Helper: read string from offset
    const readString = (valOffset: number, count: number) => {
        let str = "";
        for (let i = 0; i < count; i++) {
            const charCode = dataView.getUint8(tiffOffset + valOffset + i);
            if (charCode === 0) break;
            str += String.fromCharCode(charCode);
        }
        return str.trim();
    };

    // Helper: read rational
    const readRational = (valOffset: number) => {
        const num = readU32(valOffset);
        const den = readU32(valOffset + 4);
        return den === 0 ? 0 : num / den;
    };

    // Parse IFD0
    const parseIfd = (ifdStart: number) => {
        const numEntries = readU16(ifdStart);
        let cur = ifdStart + 2;

        for (let i = 0; i < numEntries; i++) {
            const tag = readU16(cur);
            const count = readU32(cur + 4);
            const valOffset = readU32(cur + 8);

            switch (tag) {
                case 0x010f: // Make
                    exif.make = readString(valOffset, count);
                    break;
                case 0x0110: // Model
                    exif.model = readString(valOffset, count);
                    break;
                case 0x0131: // Software
                    exif.software = readString(valOffset, count);
                    break;
                case 0x0132: // DateTime
                    exif.dateTime = readString(valOffset, count);
                    break;
                case 0x8769: // Exif SubIFD Pointer
                    subIfdOffset = valOffset;
                    break;
                case 0x8825: // GPS Info IFD Pointer
                    gpsIfdOffset = valOffset;
                    break;
            }
            cur += 12;
        }
    };

    parseIfd(firstIfdOffset);

    // Parse SubIFD (Exposure & Lens)
    if (subIfdOffset > 0) {
        const numEntries = readU16(subIfdOffset);
        let cur = subIfdOffset + 2;

        for (let i = 0; i < numEntries; i++) {
            const tag = readU16(cur);
            const count = readU32(cur + 4);
            const valOffset = readU32(cur + 8);

            switch (tag) {
                case 0x829a: { // ExposureTime (Shutter Speed)
                    const num = readU32(valOffset);
                    const den = readU32(valOffset + 4);
                    if (num && den) {
                        exif.shutterSpeed = num >= den ? `${num / den}s` : `1/${Math.round(den / num)}s`;
                    }
                    break;
                }
                case 0x829d: { // FNumber (Aperture)
                    const fNum = readRational(valOffset);
                    if (fNum) exif.aperture = `f/${fNum.toFixed(1)}`;
                    break;
                }
                case 0x8827: { // ISO
                    const iso = readU16(cur + 8);
                    if (iso) exif.iso = `ISO ${iso}`;
                    break;
                }
                case 0x9204: { // ExposureBiasValue
                    const num = dataView.getInt32(tiffOffset + valOffset, isLittleEndian);
                    const den = dataView.getInt32(tiffOffset + valOffset + 4, isLittleEndian);
                    if (den) exif.exposureBias = `${(num / den).toFixed(1)} EV`;
                    break;
                }
                case 0x9209: { // Flash
                    const flashVal = readU16(cur + 8);
                    exif.flash = (flashVal & 1) ? "Fired" : "Did not fire";
                    break;
                }
                case 0x920a: { // FocalLength
                    const fl = readRational(valOffset);
                    if (fl) exif.focalLength = `${fl.toFixed(1)} mm`;
                    break;
                }
                case 0xa434: // LensModel
                    exif.lens = readString(valOffset, count);
                    break;
            }
            cur += 12;
        }
    }

    // Parse GPS IFD
    if (gpsIfdOffset > 0) {
        const numEntries = readU16(gpsIfdOffset);
        let cur = gpsIfdOffset + 2;

        let latRef = "N";
        let lonRef = "E";
        let latDeg: number[] = [];
        let lonDeg: number[] = [];
        let altitude: number | undefined;

        for (let i = 0; i < numEntries; i++) {
            const tag = readU16(cur);
            const valOffset = readU32(cur + 8);

            switch (tag) {
                case 0x0001: // GPSLatitudeRef
                    latRef = String.fromCharCode(dataView.getUint8(cur + 8));
                    break;
                case 0x0002: // GPSLatitude
                    latDeg = [readRational(valOffset), readRational(valOffset + 8), readRational(valOffset + 16)];
                    break;
                case 0x0003: // GPSLongitudeRef
                    lonRef = String.fromCharCode(dataView.getUint8(cur + 8));
                    break;
                case 0x0004: // GPSLongitude
                    lonDeg = [readRational(valOffset), readRational(valOffset + 8), readRational(valOffset + 16)];
                    break;
                case 0x0006: // GPSAltitude
                    altitude = readRational(valOffset);
                    break;
            }
            cur += 12;
        }

        if (latDeg.length === 3 && lonDeg.length === 3) {
            let lat = latDeg[0] + latDeg[1] / 60 + latDeg[2] / 3600;
            if (latRef === "S") lat = -lat;

            let lng = lonDeg[0] + lonDeg[1] / 60 + lonDeg[2] / 3600;
            if (lonRef === "W") lng = -lng;

            exif.gps = {
                latitude: parseFloat(lat.toFixed(6)),
                longitude: parseFloat(lng.toFixed(6)),
                altitude: altitude ? Math.round(altitude) : undefined,
                mapsUrl: `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`,
            };
        }
    }

    return exif;
}

export default function ExifViewerContent() {
    const { locale } = useLanguage();
    const t = exifViewerTranslations[locale as "en" | "vi"] || exifViewerTranslations.en;

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [fileSize, setFileSize] = useState<string>("");
    const [exifData, setExifData] = useState<ExifData | null>(null);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileSelect = (file: File) => {
        setFileName(file.name);
        setFileSize((file.size / (1024 * 1024)).toFixed(2) + " MB");

        const reader = new FileReader();
        reader.onload = (e) => {
            const buffer = e.target?.result as ArrayBuffer;
            const parsed = parseExifFromArrayBuffer(buffer);

            // Load image for display & dimensions
            const dataUrl = URL.createObjectURL(file);
            setImageSrc(dataUrl);

            const img = new Image();
            img.onload = () => {
                const enriched: ExifData = {
                    ...parsed,
                    fileName: file.name,
                    fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
                    width: img.width,
                    height: img.height,
                };
                setExifData(enriched);
                setHasLoaded(true);
            };
            img.src = dataUrl;
        };
        reader.readAsArrayBuffer(file);
    };

    // Clean / Strip EXIF metadata
    const handleCleanExif = useCallback(() => {
        if (!imageSrc) return;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (!blob) return;
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    const cleanName = fileName.replace(/\.[^/.]+$/, "") + "_cleaned.jpg";
                    link.download = cleanName;
                    link.click();
                    toast.success(t.cleanedSuccess);
                },
                "image/jpeg",
                0.95
            );
        };
        img.src = imageSrc;
    }, [imageSrc, fileName, t]);

    // Export JSON
    const handleExportJson = () => {
        if (!exifData) return;
        const jsonStr = JSON.stringify(exifData, null, 2);
        navigator.clipboard.writeText(jsonStr);
        toast.success(t.copiedJson);
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto space-y-6'>
            {/* Upload Area */}
            <input
                type='file'
                ref={fileInputRef}
                accept='image/jpeg, image/png, image/webp, image/tiff'
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                }}
                className='hidden'
            />

            {!imageSrc ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className='w-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 text-center cursor-pointer transition-colors bg-white dark:bg-gray-900 shadow-sm space-y-3'
                >
                    <div className='w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-3xl mx-auto'>
                        📸
                    </div>
                    <h3 className='text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200'>
                        {t.dropImage}
                    </h3>
                    <p className='text-xs text-gray-400 max-w-md mx-auto'>{t.uploadHint}</p>
                </div>
            ) : (
                <div className='w-full space-y-6'>
                    {/* Top Action Bar */}
                    <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                            <img src={imageSrc} alt='Preview' className='w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-gray-700' />
                            <div>
                                <div className='text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs'>
                                    {fileName}
                                </div>
                                <div className='text-[10px] text-gray-400 font-mono'>{fileSize}</div>
                            </div>
                        </div>

                        <div className='flex flex-wrap items-center gap-2'>
                            <Button
                                onClick={handleCleanExif}
                                variant='primary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                🛡️ {t.cleanExif}
                            </Button>

                            <Button
                                onClick={handleExportJson}
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                📋 {t.exportJson}
                            </Button>

                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                🔄 {t.changeImage}
                            </Button>
                        </div>
                    </div>

                    {/* GPS Location Warning & Map Preview if present */}
                    {exifData?.gps && (
                        <div className='w-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                            <div className='flex items-start gap-3'>
                                <span className='text-2xl'>📍</span>
                                <div>
                                    <h4 className='text-sm font-bold text-amber-900 dark:text-amber-200'>
                                        {t.gpsWarning}
                                    </h4>
                                    <p className='text-xs text-amber-700 dark:text-amber-300 font-mono mt-0.5'>
                                        {exifData.gps.latitude}°, {exifData.gps.longitude}° {exifData.gps.altitude ? `(${exifData.gps.altitude}m)` : ""}
                                    </p>
                                </div>
                            </div>

                            <a
                                href={exifData.gps.mapsUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-xs'
                            >
                                🗺️ {t.viewOnMap}
                            </a>
                        </div>
                    )}

                    {/* EXIF Metadata Cards Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        {/* Camera & Lens */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-xs'>
                            <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                <span>📷</span> {t.sectionCamera}
                            </h4>
                            <div className='space-y-2.5 text-xs'>
                                <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-800'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.make}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>{exifData?.make || "—"}</span>
                                </div>
                                <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-800'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.model}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>{exifData?.model || "—"}</span>
                                </div>
                                <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-800'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.lens}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>{exifData?.lens || "—"}</span>
                                </div>
                                <div className='flex justify-between py-1'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.software}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>{exifData?.software || "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Exposure & Settings */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-xs'>
                            <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                <span>⚡</span> {t.sectionExposure}
                            </h4>
                            <div className='space-y-2.5 text-xs'>
                                <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-800'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.shutterSpeed}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>{exifData?.shutterSpeed || "—"}</span>
                                </div>
                                <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-800'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.aperture}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>{exifData?.aperture || "—"}</span>
                                </div>
                                <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-800'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.iso}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>{exifData?.iso || "—"}</span>
                                </div>
                                <div className='flex justify-between py-1'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.focalLength}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>{exifData?.focalLength || "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Image & File Info */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-xs'>
                            <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                <span>🖼️</span> {t.sectionImage}
                            </h4>
                            <div className='space-y-2.5 text-xs'>
                                <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-800'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.resolution}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>
                                        {exifData?.width && exifData?.height ? `${exifData.width} × ${exifData.height} px` : "—"}
                                    </span>
                                </div>
                                <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-800'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.dateTime}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>{exifData?.dateTime || "—"}</span>
                                </div>
                                <div className='flex justify-between py-1'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.fileSize}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>{exifData?.fileSize || "—"}</span>
                                </div>
                            </div>
                        </div>

                        {/* GPS Privacy Info */}
                        <div className='bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4 shadow-xs'>
                            <h4 className='text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                <span>🧭</span> {t.sectionGps}
                            </h4>
                            <div className='space-y-2.5 text-xs'>
                                <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-800'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.gpsLatitude}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>
                                        {exifData?.gps?.latitude ? `${exifData.gps.latitude}°` : "—"}
                                    </span>
                                </div>
                                <div className='flex justify-between py-1 border-b border-gray-100 dark:border-gray-800'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.gpsLongitude}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>
                                        {exifData?.gps?.longitude ? `${exifData.gps.longitude}°` : "—"}
                                    </span>
                                </div>
                                <div className='flex justify-between py-1'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.gpsAltitude}:</span>
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>
                                        {exifData?.gps?.altitude ? `${exifData.gps.altitude} m` : "—"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SEO & Privacy Guide */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
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
