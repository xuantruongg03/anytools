"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import JSZip from "jszip";
import { translations } from "./translations";

type OutputFormat = "original" | "png" | "jpg" | "webp";

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    originalSize: number;
    compressedBlob?: Blob;
    compressedPreview?: string;
    compressedSize?: number;
    status: "pending" | "compressing" | "done" | "error";
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function ImageCompressorClient({ locale }: { locale: "en" | "vi" }) {
    const t = translations[locale];
    const [images, setImages] = useState<ImageFile[]>([]);
    const [quality, setQuality] = useState(0.8);
    const [outputFormat, setOutputFormat] = useState<OutputFormat>("original");
    const [maxWidth, setMaxWidth] = useState<string>("");
    const [maxHeight, setMaxHeight] = useState<string>("");
    const [customWidth, setCustomWidth] = useState<string>("");
    const [customHeight, setCustomHeight] = useState<string>("");
    const [isCompressing, setIsCompressing] = useState(false);
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Listen for keyboard paste
    useEffect(() => {
        const handleKeyboardPaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) {
                        addImage(file);
                        e.preventDefault();
                        return;
                    }
                }
            }
        };

        document.addEventListener("paste", handleKeyboardPaste);
        return () => document.removeEventListener("paste", handleKeyboardPaste);
    }, []);

    // Add image to list
    const addImage = (file: File) => {
        const preview = URL.createObjectURL(file);
        const newImage: ImageFile = {
            id: crypto.randomUUID(),
            file,
            preview,
            originalSize: file.size,
            status: "pending",
        };
        setImages((prev) => [...prev, newImage]);
        setError("");
    };

    // Handle file selection
    const handleFilesSelect = (files: FileList) => {
        const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
        validFiles.forEach(addImage);
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Remove image
    const removeImage = (id: string) => {
        setImages((prev) => {
            const img = prev.find((i) => i.id === id);
            if (img) {
                URL.revokeObjectURL(img.preview);
                if (img.compressedPreview) URL.revokeObjectURL(img.compressedPreview);
            }
            return prev.filter((i) => i.id !== id);
        });
    };

    // Compress single image
    const compressImage = async (image: ImageFile): Promise<ImageFile> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Use custom values if "custom" is selected, otherwise use preset
                const mw = maxWidth === "custom" ? (customWidth ? parseInt(customWidth) : null) : maxWidth ? parseInt(maxWidth) : null;
                const mh = maxHeight === "custom" ? (customHeight ? parseInt(customHeight) : null) : maxHeight ? parseInt(maxHeight) : null;

                if (mw && width > mw) {
                    height = (height * mw) / width;
                    width = mw;
                }
                if (mh && height > mh) {
                    width = (width * mh) / height;
                    height = mh;
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d")!;
                ctx.drawImage(img, 0, 0, width, height);

                let mimeType: string;

                if (outputFormat === "original") {
                    mimeType = image.file.type;
                } else {
                    mimeType = `image/${outputFormat === "jpg" ? "jpeg" : outputFormat}`;
                }

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedPreview = URL.createObjectURL(blob);
                            resolve({
                                ...image,
                                compressedBlob: blob,
                                compressedPreview,
                                compressedSize: blob.size,
                                status: "done",
                            });
                        } else {
                            resolve({ ...image, status: "error" });
                        }
                    },
                    mimeType,
                    quality
                );
            };
            img.onerror = () => resolve({ ...image, status: "error" });
            img.src = image.preview;
        });
    };

    // Compress all images
    const compressAll = async (recompress = false) => {
        if (images.length === 0) return;

        setIsCompressing(true);
        setError("");

        // If recompress, reset all images to pending first
        let updatedImages = [...images];
        if (recompress) {
            updatedImages = updatedImages.map((img) => {
                if (img.compressedPreview) URL.revokeObjectURL(img.compressedPreview);
                return { ...img, status: "pending" as const, compressedBlob: undefined, compressedPreview: undefined, compressedSize: undefined };
            });
            setImages([...updatedImages]);
        }

        for (let i = 0; i < updatedImages.length; i++) {
            if (!recompress && updatedImages[i].status === "done") continue;

            updatedImages[i] = { ...updatedImages[i], status: "compressing" };
            setImages([...updatedImages]);

            const compressed = await compressImage(updatedImages[i]);
            updatedImages[i] = compressed;
            setImages([...updatedImages]);
        }

        setIsCompressing(false);
    };

    // Download single image
    const downloadImage = (image: ImageFile) => {
        if (!image.compressedBlob) return;

        const link = document.createElement("a");
        link.href = image.compressedPreview!;

        let extension: string = outputFormat;
        if (outputFormat === "original") {
            extension = image.file.name.split(".").pop() || "png";
        }

        const baseName = image.file.name.replace(/\.[^/.]+$/, "");
        link.download = `${baseName}-compressed.${extension}`;
        link.click();
    };

    // Download all as ZIP
    const downloadAllAsZip = async () => {
        const compressedImages = images.filter((img) => img.compressedBlob);
        if (compressedImages.length === 0) return;

        const zip = new JSZip();

        for (const image of compressedImages) {
            let ext: string = outputFormat;
            if (outputFormat === "original") {
                ext = image.file.name.split(".").pop() || "png";
            }
            const baseName = image.file.name.replace(/\.[^/.]+$/, "");
            zip.file(`${baseName}-compressed.${ext}`, image.compressedBlob!);
        }

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "compressed-images.zip";
        link.click();
    };

    // Clear all
    const clearAll = () => {
        images.forEach((img) => {
            URL.revokeObjectURL(img.preview);
            if (img.compressedPreview) URL.revokeObjectURL(img.compressedPreview);
        });
        setImages([]);
        setError("");
    };

    // Calculate totals
    const totalOriginal = images.reduce((acc, img) => acc + img.originalSize, 0);
    const totalCompressed = images.reduce((acc, img) => acc + (img.compressedSize || 0), 0);
    const totalSaved = totalOriginal - totalCompressed;
    const savedPercentage = totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : 0;
    const hasCompressedImages = images.some((img) => img.compressedBlob);
    const hasPendingImages = images.some((img) => img.status === "pending");

    return (
        <div className='space-y-6'>
            {/* Main Card */}
            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
                {/* Upload Area - Compact when has images */}
                <div
                    className={`relative transition-all cursor-pointer ${images.length > 0 ? "p-4 border-b border-gray-200 dark:border-gray-700" : "p-8"} ${isDragging ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        handleFilesSelect(e.dataTransfer.files);
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        multiple
                        className='hidden'
                        onChange={(e) => {
                            if (e.target.files) handleFilesSelect(e.target.files);
                        }}
                    />

                    {images.length === 0 ? (
                        <div className='text-center'>
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4'>
                                <svg className='w-8 h-8 text-blue-600 dark:text-blue-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                </svg>
                            </div>
                            <p className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.dragDropImages}</p>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>{t.supportedFormats}</p>
                        </div>
                    ) : (
                        <div className='flex items-center justify-center gap-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                            </svg>
                            <span className='text-sm'>{t.dragDropMore}</span>
                        </div>
                    )}
                </div>

                {/* Images Grid */}
                {images.length > 0 && (
                    <div className='p-4'>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                            {images.map((image) => (
                                <div key={image.id} className='group relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden'>
                                    <img src={image.compressedPreview || image.preview} alt={image.file.name} className='w-full h-full object-cover' />

                                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors'>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(image.id);
                                            }}
                                            className='absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
                                        >
                                            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                            </svg>
                                        </button>

                                        {image.compressedBlob && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    downloadImage(image);
                                                }}
                                                className='absolute top-1 left-1 w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
                                            >
                                                <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    <div className='absolute bottom-0 left-0 right-0 p-1.5 bg-linear-to-t from-black/70 to-transparent'>
                                        {image.status === "compressing" && (
                                            <div className='flex items-center gap-1 text-xs text-blue-300'>
                                                <svg className='w-3 h-3 animate-spin' fill='none' viewBox='0 0 24 24'>
                                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                                                </svg>
                                                <span>{t.compressing}</span>
                                            </div>
                                        )}
                                        {image.status === "pending" && <span className='text-xs text-gray-300'>{formatBytes(image.originalSize)}</span>}
                                        {image.status === "done" && image.compressedSize !== undefined && (
                                            <div className='flex items-center justify-between text-xs'>
                                                <span className='text-white'>{formatBytes(image.compressedSize)}</span>
                                                <span className='text-green-400 font-medium'>-{((1 - image.compressedSize / image.originalSize) * 100).toFixed(0)}%</span>
                                            </div>
                                        )}
                                        {image.status === "error" && <span className='text-xs text-red-400'>{t.errorCompressing}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Settings & Actions Card */}
            {images.length > 0 && (
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 space-y-4'>
                    {/* Settings Row */}
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-3 items-start'>
                        <div>
                            <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                {t.quality}: {Math.round(quality * 100)}%
                            </label>
                            <input type='range' min='0.1' max='1' step='0.05' value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2' />
                        </div>

                        <div>
                            <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>{t.outputFormat}</label>
                            <Select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}>
                                <option value='original'>{t.original}</option>
                                <option value='png'>PNG</option>
                                <option value='jpg'>JPG</option>
                                <option value='webp'>WebP</option>
                            </Select>
                        </div>

                        <div>
                            <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>{t.maxWidth}</label>
                            {maxWidth === "custom" ? (
                                <div className='flex gap-1'>
                                    <input type='number' value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} placeholder={t.enterWidth} className='flex-1 min-w-0 px-2 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white' />
                                    <button
                                        onClick={() => {
                                            setMaxWidth("");
                                            setCustomWidth("");
                                        }}
                                        className='px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        title='Reset'
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <Select value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)}>
                                    <option value=''>{t.noLimit}</option>
                                    <option value='1920'>1920px</option>
                                    <option value='1280'>1280px</option>
                                    <option value='800'>800px</option>
                                    <option value='640'>640px</option>
                                    <option value='custom'>{t.custom}</option>
                                </Select>
                            )}
                        </div>

                        <div>
                            <label className='block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>{t.maxHeight}</label>
                            {maxHeight === "custom" ? (
                                <div className='flex gap-1'>
                                    <input type='number' value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} placeholder={t.enterHeight} className='flex-1 min-w-0 px-2 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white' />
                                    <button
                                        onClick={() => {
                                            setMaxHeight("");
                                            setCustomHeight("");
                                        }}
                                        className='px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        title='Reset'
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <Select value={maxHeight} onChange={(e) => setMaxHeight(e.target.value)}>
                                    <option value=''>{t.noLimit}</option>
                                    <option value='1080'>1080px</option>
                                    <option value='720'>720px</option>
                                    <option value='480'>480px</option>
                                    <option value='custom'>{t.custom}</option>
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* Actions Row */}
                    <div className='flex gap-2 flex-wrap'>
                        {hasPendingImages && (
                            <Button variant='primary' onClick={() => compressAll(false)} disabled={isCompressing}>
                                {isCompressing ? t.compressing : t.compress}
                            </Button>
                        )}
                        {hasCompressedImages && !hasPendingImages && (
                            <Button variant='secondary' onClick={() => compressAll(true)} disabled={isCompressing}>
                                {t.recompress}
                            </Button>
                        )}
                        {hasCompressedImages && (
                            <Button variant='success' onClick={downloadAllAsZip}>
                                {t.downloadAll}
                            </Button>
                        )}
                        <Button variant='gray' onClick={clearAll}>
                            {t.clear}
                        </Button>
                    </div>

                    {hasCompressedImages && (
                        <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                            <div className='flex flex-wrap items-center justify-center gap-6 text-sm'>
                                <div className='text-center'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.originalSize}:</span>
                                    <span className='ml-1 font-medium text-gray-900 dark:text-white'>{formatBytes(totalOriginal)}</span>
                                </div>
                                <svg className='w-4 h-4 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                </svg>
                                <div className='text-center'>
                                    <span className='text-gray-500 dark:text-gray-400'>{t.compressedSize}:</span>
                                    <span className='ml-1 font-medium text-gray-900 dark:text-white'>{formatBytes(totalCompressed)}</span>
                                </div>
                                <div className='px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full'>
                                    <span className='text-green-700 dark:text-green-400 font-semibold'>
                                        {t.saved}: {formatBytes(totalSaved)} ({savedPercentage}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && <div className='p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>{error}</div>}
        </div>
    );
}
