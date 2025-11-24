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
            {/* Header */}
            <div className='text-center'>
                <h1 className='text-2xl font-bold mb-2 text-gray-900 dark:text-white flex items-center justify-center gap-2'>
                    <span className='text-3xl'>✂️</span>
                    {tool_t.name}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.description}</p>
            </div>
            {/* Main Grid Layout */}
            <div className='grid lg:grid-cols-2 gap-4'>
                {/* Left Column - Input Card */}
                <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col' style={{ height: "600px" }}>
                    <div className='space-y-3'>
                        {/* Image Upload */}
                        <div>
                            <input ref={fileInputRef} type='file' accept='image/jpeg,image/jpg,image/png,image/webp' onChange={handleFileSelect} className='hidden' id='image-file-input' />
                            <label htmlFor='image-file-input' className='cursor-pointer block'>
                                <div className='border-2 border-dashed border-gray-300 md:h-52 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors flex flex-col items-center justify-center'>
                                    <svg className='w-8 h-8 mb-2 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                                    </svg>
                                    <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{tool_t.uploadButton}</p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>{tool_t.uploadHint}</p>
                                </div>
                            </label>
                        </div>

                        {/* File Info */}
                        {file && (
                            <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-xs space-y-1'>
                                <div className='flex items-center justify-between'>
                                    <span className='font-medium text-gray-700 dark:text-gray-300'>{tool_t.fileName}:</span>
                                    <span className='text-gray-600 dark:text-gray-400 truncate ml-2 max-w-[200px]' title={fileName}>
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
                        )}
                    </div>

                    {/* Info Note */}
                    <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-3'>
                        <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                        </svg>
                        {tool_t.infoNote}
                    </p>

                    {/* Action Buttons */}
                    <div className='flex gap-2 mt-3'>
                        <button onClick={handleRemoveBackground} disabled={isProcessing || !file} className='flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md cursor-pointer'>
                            {isProcessing ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
                                    <span>{tool_t.processing}</span>
                                </div>
                            ) : (
                                <span>{tool_t.removeBackground}</span>
                            )}
                        </button>
                        <button onClick={handleClearAll} disabled={isProcessing} className='px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer'>
                            {tool_t.clear}
                        </button>
                    </div>

                    {/* Error Display */}
                    {currentError && (
                        <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-3 shadow-sm mt-3'>
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
                        <div className='bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg p-3 shadow-sm mt-3'>
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

                    {/* Tips & Use Cases - Compact */}
                    <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 flex-1 overflow-y-auto min-h-0'>
                        <div>
                            <h3 className='text-xs font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5'>
                                <svg className='w-3.5 h-3.5 text-blue-600 dark:text-blue-400' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                                </svg>
                                Tips for Best Results
                            </h3>
                            <div className='space-y-1.5'>
                                <p className='text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5'>
                                    <span className='text-blue-600 dark:text-blue-400 mt-0.5'>•</span>
                                    Use high-quality images with clear subject
                                </p>
                                <p className='text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5'>
                                    <span className='text-blue-600 dark:text-blue-400 mt-0.5'>•</span>
                                    Good lighting improves accuracy
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className='text-xs font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5'>
                                <svg className='w-3.5 h-3.5 text-purple-600 dark:text-purple-400' fill='currentColor' viewBox='0 0 20 20'>
                                    <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
                                </svg>
                                Common Use Cases
                            </h3>
                            <div className='grid grid-cols-2 gap-x-3 gap-y-1.5'>
                                <p className='flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400'>
                                    <span className='w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full'></span>
                                    Product photos
                                </p>
                                <p className='flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400'>
                                    <span className='w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full'></span>
                                    Profile pictures
                                </p>
                                <p className='flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400'>
                                    <span className='w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full'></span>
                                    Marketing
                                </p>
                                <p className='flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400'>
                                    <span className='w-1 h-1 bg-purple-600 dark:bg-purple-400 rounded-full'></span>
                                    Social media
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Image Preview */}
                <div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 lg:sticky lg:top-4 flex flex-col' style={{ height: "600px" }}>
                    <div className='flex items-center justify-between mb-3 shrink-0'>
                        <h2 className='text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                            <svg className='w-4 h-4 text-blue-600 dark:text-blue-400' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' />
                            </svg>
                            {tool_t.preview}
                        </h2>
                        {resultImage && (
                            <div className='flex gap-2'>
                                <button onClick={() => setComparing(!comparing)} className='px-3 py-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-lg transition-colors cursor-pointer font-medium'>
                                    {comparing ? "👁️ Single" : "🔀 Compare"}
                                </button>
                                <button onClick={handleDownload} className='px-3 py-1.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-lg transition-colors cursor-pointer font-medium'>
                                    ⬇️ {tool_t.download}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className='flex-1 min-h-0'>
                        {preview || resultImage ? (
                            <div className={`grid ${comparing && resultImage ? "grid-cols-2" : "grid-cols-1"} gap-3 h-full`}>
                                {/* Original Image */}
                                {preview && comparing && resultImage && (
                                    <div className='flex flex-col h-full'>
                                        <p className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 shrink-0'>{tool_t.originalImage}</p>
                                        <div className='relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center flex-1' style={{ backgroundImage: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}>
                                            <img src={preview} alt='Original' className='max-w-full max-h-full w-auto h-auto object-contain' />
                                        </div>
                                    </div>
                                )}

                                {/* Result Image */}
                                {resultImage ? (
                                    <div className='flex flex-col h-full'>
                                        {comparing && <p className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 shrink-0'>{tool_t.resultImage}</p>}
                                        <div className='relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center flex-1' style={{ backgroundImage: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}>
                                            <img src={resultImage} alt='Result' className='max-w-full max-h-full w-auto h-auto object-contain' />
                                        </div>
                                    </div>
                                ) : preview ? (
                                    <div className='relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center h-full'>
                                        <img src={preview} alt='Preview' className='max-w-full max-h-full w-auto h-auto object-contain' />
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className='flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg h-full'>
                                <div className='text-center'>
                                    <svg className='w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                    </svg>
                                    <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>No image selected</p>
                                    <p className='text-xs text-gray-400 dark:text-gray-500'>Upload an image to preview</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>{" "}
            {/* End Main Grid */}
        </div>
    );
}
