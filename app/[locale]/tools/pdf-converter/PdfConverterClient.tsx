"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { translations } from "./translations";

type ConversionMode = "pdf-to-image" | "image-to-pdf";
type ImageFormat = "png" | "jpg";

interface ConvertedImage {
    pageNumber: number;
    dataUrl: string;
    blob: Blob;
}

interface ImageFile {
    id: string;
    file: File;
    preview: string;
}

export default function PdfConverterClient({ locale }: { locale: "en" | "vi" }) {
    const t = translations[locale];
    const [mode, setMode] = useState<ConversionMode>("pdf-to-image");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
    const [format, setFormat] = useState<ImageFormat>("png");
    const [quality, setQuality] = useState(0.92);
    const [scale, setScale] = useState(2);
    const [pageRangeType, setPageRangeType] = useState<"all" | "custom">("all");
    const [customRange, setCustomRange] = useState("");
    const [isConverting, setIsConverting] = useState(false);
    const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState("");
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pdfjsLib, setPdfjsLib] = useState<any>(null);

    const pdfInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load PDF.js dynamically on client side
    useEffect(() => {
        const loadPdfjs = async () => {
            const pdfjs = await import("pdfjs-dist");
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
            setPdfjsLib(pdfjs);
        };
        loadPdfjs();
    }, []);

    // Handle paste from clipboard
    const handlePaste = useCallback(async () => {
        if (mode !== "image-to-pdf") return;

        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type.startsWith("image/")) {
                        const blob = await clipboardItem.getType(type);
                        const file = new File([blob], `pasted-image-${Date.now()}.png`, { type: "image/png" });
                        const preview = URL.createObjectURL(file);
                        const newImage: ImageFile = {
                            id: crypto.randomUUID(),
                            file,
                            preview,
                        };
                        setImageFiles((prev) => [...prev, newImage]);
                        setError("");
                        return;
                    }
                }
            }
            setError(locale === "vi" ? "Không tìm thấy ảnh trong bộ nhớ tạm" : "No image found in clipboard");
        } catch {
            setError(locale === "vi" ? "Không thể đọc bộ nhớ tạm" : "Cannot read clipboard");
        }
    }, [mode, locale]);

    // Listen for keyboard paste
    const handleKeyboardPaste = useCallback(
        (e: React.ClipboardEvent) => {
            if (mode !== "image-to-pdf") return;

            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) {
                        const preview = URL.createObjectURL(file);
                        const newImage: ImageFile = {
                            id: crypto.randomUUID(),
                            file,
                            preview,
                        };
                        setImageFiles((prev) => [...prev, newImage]);
                        setError("");
                        e.preventDefault();
                        return;
                    }
                }
            }
        },
        [mode]
    );

    // Parse page range
    const parsePageRange = (range: string, maxPages: number): number[] => {
        const pages: Set<number> = new Set();
        const parts = range.split(",").map((p) => p.trim());

        for (const part of parts) {
            if (part.includes("-")) {
                const [start, end] = part.split("-").map((n) => parseInt(n.trim()));
                if (!isNaN(start) && !isNaN(end)) {
                    for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
                        pages.add(i);
                    }
                }
            } else {
                const page = parseInt(part);
                if (!isNaN(page) && page >= 1 && page <= maxPages) {
                    pages.add(page);
                }
            }
        }

        return Array.from(pages).sort((a, b) => a - b);
    };

    // Handle PDF file selection
    const handlePdfSelect = async (file: File) => {
        if (file.type !== "application/pdf") {
            setError(locale === "vi" ? "Vui lòng chọn file PDF" : "Please select a PDF file");
            return;
        }

        setPdfFile(file);
        setConvertedImages([]);
        setError("");

        if (!pdfjsLib) {
            setError(locale === "vi" ? "PDF.js đang tải..." : "PDF.js is loading...");
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            setTotalPages(pdf.numPages);
        } catch {
            setError(locale === "vi" ? "Không thể đọc file PDF" : "Cannot read PDF file");
        }
    };

    // Handle image files selection
    const handleImagesSelect = (files: FileList) => {
        const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));

        const newImages: ImageFile[] = validFiles.map((file) => ({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
        }));

        setImageFiles((prev) => [...prev, ...newImages]);
        setError("");
    };

    // Remove image
    const removeImage = (id: string) => {
        setImageFiles((prev) => {
            const img = prev.find((i) => i.id === id);
            if (img) URL.revokeObjectURL(img.preview);
            return prev.filter((i) => i.id !== id);
        });
    };

    // Drag and drop for reordering
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...imageFiles];
        const [dragged] = newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, dragged);
        setImageFiles(newImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    // Convert PDF to images
    const convertPdfToImages = async () => {
        if (!pdfFile || !pdfjsLib) return;

        setIsConverting(true);
        setError("");
        setConvertedImages([]);

        try {
            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const pagesToConvert = pageRangeType === "all" ? Array.from({ length: pdf.numPages }, (_, i) => i + 1) : parsePageRange(customRange, pdf.numPages);

            if (pagesToConvert.length === 0) {
                setError(t.invalidRange);
                setIsConverting(false);
                return;
            }

            const images: ConvertedImage[] = [];

            for (const pageNum of pagesToConvert) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d")!;
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport,
                    canvas,
                }).promise;

                const mimeType = format === "png" ? "image/png" : "image/jpeg";
                const dataUrl = canvas.toDataURL(mimeType, quality);

                const response = await fetch(dataUrl);
                const blob = await response.blob();

                images.push({
                    pageNumber: pageNum,
                    dataUrl,
                    blob,
                });
            }

            setConvertedImages(images);
        } catch (err) {
            console.error(err);
            setError(t.error);
        } finally {
            setIsConverting(false);
        }
    };

    // Download single image
    const downloadImage = (image: ConvertedImage) => {
        const link = document.createElement("a");
        link.href = image.dataUrl;
        link.download = `page-${image.pageNumber}.${format}`;
        link.click();
    };

    // Download all images as ZIP
    const downloadAllAsZip = async () => {
        const zip = new JSZip();

        for (const image of convertedImages) {
            zip.file(`page-${image.pageNumber}.${format}`, image.blob);
        }

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = `${pdfFile?.name.replace(".pdf", "")}-images.zip`;
        link.click();
    };

    // Create PDF from images
    const createPdfFromImages = async () => {
        if (imageFiles.length === 0) return;

        setIsConverting(true);
        setError("");

        try {
            const pdf = new jsPDF();
            let isFirst = true;

            for (const imageFile of imageFiles) {
                const img = new Image();
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = imageFile.preview;
                });

                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (img.height * imgWidth) / img.width;

                if (!isFirst) {
                    pdf.addPage();
                }
                isFirst = false;

                pdf.addImage(img.src, "JPEG", 0, 0, imgWidth, imgHeight);
            }

            pdf.save("combined.pdf");
        } catch (err) {
            console.error(err);
            setError(t.error);
        } finally {
            setIsConverting(false);
        }
    };

    // Clear all
    const clearAll = () => {
        setPdfFile(null);
        setConvertedImages([]);
        imageFiles.forEach((img) => URL.revokeObjectURL(img.preview));
        setImageFiles([]);
        setTotalPages(0);
        setError("");
        setCustomRange("");
    };

    return (
        <div ref={containerRef} className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6' onPaste={handleKeyboardPaste} tabIndex={0}>
            {/* Mode Toggle */}
            <div className='flex gap-2 mb-6'>
                <Button
                    variant={mode === "pdf-to-image" ? "primary" : "secondary"}
                    onClick={() => {
                        setMode("pdf-to-image");
                        clearAll();
                    }}
                >
                    📄 {t.pdfToImage}
                </Button>
                <Button
                    variant={mode === "image-to-pdf" ? "primary" : "secondary"}
                    onClick={() => {
                        setMode("image-to-pdf");
                        clearAll();
                    }}
                >
                    🖼️ {t.imageToPdf}
                </Button>
            </div>

            {mode === "pdf-to-image" ? (
                <>
                    {/* PDF Upload */}
                    <div
                        className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors'
                        onClick={() => pdfInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) handlePdfSelect(file);
                        }}
                    >
                        <input
                            ref={pdfInputRef}
                            type='file'
                            accept='.pdf'
                            className='hidden'
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePdfSelect(file);
                            }}
                        />
                        <div className='text-4xl mb-2'>📄</div>
                        <p className='text-gray-600 dark:text-gray-400 mb-1'>{pdfFile ? pdfFile.name : t.dragDropPdf}</p>
                        <p className='text-sm text-gray-500 dark:text-gray-500'>{t.supportedFormats}</p>
                        {totalPages > 0 && (
                            <p className='text-sm text-blue-600 dark:text-blue-400 mt-2'>
                                {totalPages} {locale === "vi" ? "trang" : "pages"}
                            </p>
                        )}
                    </div>

                    {/* Settings */}
                    {pdfFile && (
                        <div className='grid md:grid-cols-4 gap-4 mt-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.format}</label>
                                <select value={format} onChange={(e) => setFormat(e.target.value as ImageFormat)} className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'>
                                    <option value='png'>PNG</option>
                                    <option value='jpg'>JPG</option>
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    {t.quality}: {Math.round(quality * 100)}%
                                </label>
                                <input type='range' min='0.1' max='1' step='0.1' value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className='w-full' />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                    {t.scale}: {scale * 72} DPI
                                </label>
                                <input type='range' min='1' max='4' step='0.5' value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className='w-full' />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{t.pageRange}</label>
                                <select value={pageRangeType} onChange={(e) => setPageRangeType(e.target.value as "all" | "custom")} className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'>
                                    <option value='all'>{t.allPages}</option>
                                    <option value='custom'>{t.customRange}</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {pageRangeType === "custom" && pdfFile && (
                        <div className='mt-4'>
                            <input type='text' placeholder={t.rangePlaceholder} value={customRange} onChange={(e) => setCustomRange(e.target.value)} className='w-full p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white' />
                        </div>
                    )}

                    {/* Actions */}
                    {pdfFile && (
                        <div className='flex gap-2 mt-4'>
                            <Button variant='primary' onClick={convertPdfToImages} disabled={isConverting}>
                                {isConverting ? t.converting : t.convert}
                            </Button>
                            <Button variant='gray' onClick={clearAll}>
                                {t.clear}
                            </Button>
                        </div>
                    )}

                    {/* Converted Images */}
                    {convertedImages.length > 0 && (
                        <div className='mt-6'>
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className='font-semibold text-gray-900 dark:text-white'>
                                    {convertedImages.length} {t.images}
                                </h3>
                                <Button variant='success' onClick={downloadAllAsZip}>
                                    {t.downloadAll}
                                </Button>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                {convertedImages.map((img) => (
                                    <div key={img.pageNumber} className='border rounded-lg p-2 dark:border-gray-700'>
                                        <img src={img.dataUrl} alt={`${t.page} ${img.pageNumber}`} className='w-full h-32 object-contain bg-gray-100 dark:bg-gray-900 rounded' />
                                        <div className='flex justify-between items-center mt-2'>
                                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                                                {t.page} {img.pageNumber}
                                            </span>
                                            <Button variant='primary' size='sm' onClick={() => downloadImage(img)}>
                                                {t.download}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Image Upload */}
                    <div
                        className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors'
                        onClick={() => imageInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleImagesSelect(e.dataTransfer.files);
                        }}
                    >
                        <input
                            ref={imageInputRef}
                            type='file'
                            accept='image/*'
                            multiple
                            className='hidden'
                            onChange={(e) => {
                                if (e.target.files) handleImagesSelect(e.target.files);
                            }}
                        />
                        <div className='text-4xl mb-2'>🖼️</div>
                        <p className='text-gray-600 dark:text-gray-400 mb-1'>{t.dragDropImages}</p>
                        <p className='text-sm text-gray-500 dark:text-gray-500'>{t.supportedImageFormats}</p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-2'>{t.pasteHint}</p>
                    </div>

                    {/* Paste Button */}
                    <div className='mt-4'>
                        <Button variant='secondary' onClick={handlePaste}>
                            📋 {t.pasteFromClipboard}
                        </Button>
                    </div>

                    {/* Image List */}
                    {imageFiles.length > 0 && (
                        <div className='mt-6'>
                            <div className='flex justify-between items-center mb-4'>
                                <h3 className='font-semibold text-gray-900 dark:text-white'>
                                    {imageFiles.length} {t.images}
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>{t.reorderHint}</p>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                {imageFiles.map((img, index) => (
                                    <div key={img.id} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={`border rounded-lg p-2 cursor-move dark:border-gray-700 ${draggedIndex === index ? "opacity-50" : ""}`}>
                                        <img src={img.preview} alt={`Image ${index + 1}`} className='w-full h-32 object-contain bg-gray-100 dark:bg-gray-900 rounded' />
                                        <div className='flex justify-between items-center mt-2'>
                                            <span className='text-sm text-gray-600 dark:text-gray-400'>#{index + 1}</span>
                                            <Button variant='danger' size='sm' onClick={() => removeImage(img.id)}>
                                                {t.removeImage}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className='flex gap-2 mt-4'>
                                <Button variant='primary' onClick={createPdfFromImages} disabled={isConverting}>
                                    {isConverting ? t.creating : t.createPdf}
                                </Button>
                                <Button variant='gray' onClick={clearAll}>
                                    {t.clear}
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Error Message */}
            {error && <div className='mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>{error}</div>}
        </div>
    );
}
