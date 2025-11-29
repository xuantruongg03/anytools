"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { useImageToText } from "@/lib/hooks";
import { ServiceProviderSelector, ServiceProviderOption } from "@/components";

export default function ImageToTextClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const tool_t = t.tools.imageToText;

    const [copied, setCopied] = useState(false);
    const [provider, setProvider] = useState("auto");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Custom hooks
    const { file, fileName, fileSize, dimensions, preview, error: uploadError, handleFileSelect, handlePaste, clearFile } = useImageUpload();
    const { extractedText, isProcessing, error: processError, success, usedService, extractText, clearResult } = useImageToText();

    // Provider options
    const providerOptions: ServiceProviderOption[] = useMemo(
        () => [
            { value: "auto", label: tool_t.auto, icon: "🔄" },
            { value: "ocr-space", label: "OCR.space", icon: "📝" },
            { value: "optiic", label: "Optiic", icon: "🔍" },
        ],
        [tool_t.auto]
    );

    // Listen for paste events
    useEffect(() => {
        const handleGlobalPaste = (event: ClipboardEvent) => {
            handlePaste(event);
        };

        document.addEventListener("paste", handleGlobalPaste);
        return () => {
            document.removeEventListener("paste", handleGlobalPaste);
        };
    }, [handlePaste]);

    // Handle extract text
    const handleExtractText = async () => {
        if (file) {
            await extractText(file, locale, provider);
        }
    };

    // Handle copy text
    const handleCopy = async () => {
        if (extractedText) {
            try {
                await navigator.clipboard.writeText(extractedText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    // Handle download text
    const handleDownload = () => {
        if (extractedText) {
            const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${fileName.replace(/\.[^/.]+$/, "")}_text.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    // Handle clear all
    const handleClearAll = () => {
        clearFile();
        clearResult();
        setCopied(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const currentError = uploadError || processError;

    return (
        <div className='space-y-4'>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                    {/* Image Upload / Preview */}
                    <div className='mb-4'>
                        <input ref={fileInputRef} type='file' accept='image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp' onChange={handleFileSelect} className='hidden' id='image-file-input' />
                        {!preview ? (
                            <label htmlFor='image-file-input' className='cursor-pointer block'>
                                <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors'>
                                    <svg className='w-12 h-12 mx-auto mb-3 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                    </svg>
                                    <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{tool_t.uploadButton}</p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>{tool_t.uploadHint}</p>
                                    <p className='text-xs text-blue-500 dark:text-blue-400 mt-2'>📋 {tool_t.pasteHint}</p>
                                </div>
                            </label>
                        ) : (
                            <div className='space-y-3'>
                                {/* Image Preview */}
                                <div className='relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center' style={{ height: "300px" }}>
                                    <img src={preview} alt='Preview' className='max-w-full max-h-full w-auto h-auto object-contain' />
                                </div>
                                <label htmlFor='image-file-input' className='cursor-pointer block'>
                                    <div className='px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors text-center font-medium'>🔄 {tool_t.changeImage}</div>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* File Info */}
                    {file && (
                        <div className='mt-4 space-y-3'>
                            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.fileName}:</span>
                                    <span className='text-sm text-gray-600 dark:text-gray-400 truncate ml-2 max-w-[300px]' title={fileName}>
                                        {fileName}
                                    </span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.fileSize}:</span>
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>{fileSize}</span>
                                </div>
                                {dimensions && (
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.dimensions}:</span>
                                        <span className='text-sm text-gray-600 dark:text-gray-400'>{dimensions}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Service Provider Selector */}
                    <ServiceProviderSelector value={provider} onChange={setProvider} options={providerOptions} label={tool_t.serviceProvider} hint={tool_t.serviceProviderHint} className='mt-4' />

                    {/* Info Note */}
                    <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-3'>
                        <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                        </svg>
                        {tool_t.infoNote}
                    </p>

                    {/* Action Buttons */}
                    <div className='flex gap-2 mt-4'>
                        <button onClick={handleExtractText} disabled={isProcessing || !file} className='flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md'>
                            {isProcessing ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
                                    <span>{tool_t.processing}</span>
                                </div>
                            ) : (
                                <span>🔍 {tool_t.extractText}</span>
                            )}
                        </button>
                        <button onClick={handleClearAll} disabled={isProcessing} className='px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'>
                            {tool_t.clear}
                        </button>
                    </div>

                    {/* Extracted Text Result */}
                    {extractedText && (
                        <div className='mt-4'>
                            <div className='flex items-center justify-between mb-2'>
                                <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.extractedText}:</h3>
                                <div className='flex gap-2'>
                                    <button onClick={handleCopy} className='px-3 py-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-lg transition-colors font-medium'>
                                        {copied ? "✅ Copied!" : "📋 Copy"}
                                    </button>
                                    <button onClick={handleDownload} className='px-3 py-1.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-lg transition-colors font-medium'>
                                        ⬇️ {tool_t.download}
                                    </button>
                                </div>
                            </div>
                            <textarea value={extractedText} readOnly className='w-full h-48 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500' />
                            <div className='flex items-center justify-between mt-1'>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>
                                    {tool_t.characterCount}: {extractedText.length}
                                </p>
                                {usedService && (
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        {tool_t.usedService}: <span className='font-medium text-blue-600 dark:text-blue-400'>{usedService}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {currentError && (
                        <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-3 shadow-sm mt-4'>
                            <div className='flex items-start gap-2'>
                                <svg className='w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                                </svg>
                                <div className='flex-1'>
                                    <p className='text-xs font-medium text-red-800 dark:text-red-300'>{tool_t.error}</p>
                                    <p className='text-xs text-red-700 dark:text-red-400 mt-0.5'>{currentError}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className='bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg p-3 shadow-sm mt-4'>
                            <div className='flex items-start gap-2'>
                                <svg className='w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                </svg>
                                <div className='flex-1'>
                                    <p className='text-xs font-medium text-green-800 dark:text-green-300'>{success}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
        </div>
    );
}
