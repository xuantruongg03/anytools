"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { useBackgroundRemover } from "@/lib/hooks/useBackgroundRemover";

export default function RemoveBackgroundClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const tool_t = t.tools.removeBackground;

    const [comparing, setComparing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Custom hooks
    const { file, fileName, fileSize, dimensions, preview, error: uploadError, handleFileSelect, clearFile } = useImageUpload();
    const { resultImage, isProcessing, error: processError, success, removeBackground, clearResult } = useBackgroundRemover();

    // Handle remove background
    const handleRemoveBackground = async () => {
        if (file) {
            await removeBackground(file, "auto");
        }
    };

    // Handle download result
    const handleDownload = () => {
        if (resultImage) {
            const link = document.createElement("a");
            link.href = resultImage;
            link.download = `${fileName.replace(/\.[^/.]+$/, "")}_no_bg.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Handle clear all
    const handleClearAll = () => {
        clearFile();
        clearResult();
        setComparing(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const currentError = uploadError || processError;

    return (
        <div className='space-y-4'>
            {/* Single Column Layout */}
            <div className='max-w-5xl mx-auto'>
                {/* Input Card */}
                <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                    {/* Image Upload / Preview */}
                    <div className='mb-4'>
                        <input ref={fileInputRef} type='file' accept='image/jpeg,image/jpg,image/png,image/webp' onChange={handleFileSelect} className='hidden' id='image-file-input' />
                        {!preview ? (
                            <label htmlFor='image-file-input' className='cursor-pointer block'>
                                <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors flex flex-col items-center justify-center'>
                                    <svg className='w-16 h-16 mb-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                                    </svg>
                                    <p className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool_t.uploadButton}</p>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>{tool_t.uploadHint}</p>
                                </div>
                            </label>
                        ) : (
                            <div className='space-y-3'>
                                {/* Image Preview with Compare */}
                                <div className={`grid ${comparing && resultImage ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                                    {/* Original Image */}
                                    {preview && comparing && resultImage && (
                                        <div className='flex flex-col'>
                                            <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool_t.originalImage}</p>
                                            <div className='relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center' style={{ height: "400px", backgroundImage: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}>
                                                <img src={preview} alt='Original' className='max-w-full max-h-full w-auto h-auto object-contain' />
                                            </div>
                                        </div>
                                    )}

                                    {/* Result or Preview Image */}
                                    {resultImage ? (
                                        <div className='flex flex-col'>
                                            {comparing && <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{tool_t.resultImage}</p>}
                                            <div className='relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center' style={{ height: "400px", backgroundImage: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}>
                                                <img src={resultImage} alt='Result' className='max-w-full max-h-full w-auto h-auto object-contain' />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center' style={{ height: "400px", backgroundImage: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}>
                                            <img src={preview} alt='Preview' className='max-w-full max-h-full w-auto h-auto object-contain' />
                                        </div>
                                    )}
                                </div>
                                <label htmlFor='image-file-input' className='cursor-pointer block'>
                                    <div className='px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors text-center font-medium'>🔄 Change Image</div>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* File Info & Actions */}
                    {file && (
                        <div className='mt-4 space-y-3'>
                            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-xs space-y-1'>
                                <div className='flex items-center justify-between'>
                                    <span className='font-medium text-gray-700 dark:text-gray-300'>{tool_t.fileName}:</span>
                                    <span className='text-gray-600 dark:text-gray-400 truncate ml-2 max-w-[300px]' title={fileName}>
                                        {fileName}
                                    </span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='font-medium text-gray-700 dark:text-gray-300'>{tool_t.fileSize}:</span>
                                    <span className='text-gray-600 dark:text-gray-400'>{fileSize}</span>
                                </div>
                                {dimensions && (
                                    <div className='flex items-center justify-between'>
                                        <span className='font-medium text-gray-700 dark:text-gray-300'>{tool_t.dimensions}:</span>
                                        <span className='text-gray-600 dark:text-gray-400'>{dimensions}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Info Note */}
                    <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-3'>
                        <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                        </svg>
                        {tool_t.infoNote}
                    </p>

                    {/* Action Buttons */}
                    <div className='flex gap-2 mt-4'>
                        <button onClick={handleRemoveBackground} disabled={isProcessing || !file} className='flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md cursor-pointer'>
                            {isProcessing ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
                                    <span>{tool_t.processing}</span>
                                </div>
                            ) : (
                                <span>{tool_t.removeBackground}</span>
                            )}
                        </button>
                        {resultImage && (
                            <button onClick={() => setComparing(!comparing)} className='px-6 py-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm rounded-lg transition-colors cursor-pointer font-medium'>
                                {comparing ? "👁️ Single" : "🔀 Compare"}
                            </button>
                        )}
                        {resultImage && (
                            <button onClick={handleDownload} className='px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors cursor-pointer font-medium shadow-sm hover:shadow-md'>
                                ⬇️ {tool_t.download}
                            </button>
                        )}
                        <button onClick={handleClearAll} disabled={isProcessing} className='px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer'>
                            {tool_t.clear}
                        </button>
                    </div>

                    {/* Error Display */}
                    {currentError && (
                        <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-3 shadow-sm mt-4'>
                            <div className='flex items-start gap-2'>
                                <svg className='w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                                </svg>
                                <div className='flex-1'>
                                    <p className='text-xs font-medium text-red-800 dark:text-red-300'>Error</p>
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
        </div>
    );
}
