"use client";

import { useState, useRef, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n/translations";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import { useSpeechToText } from "@/lib/hooks/useSpeechToText";
import { ServiceProviderSelector, ServiceProviderOption } from "@/components";

type ServiceProvider = "auto" | "fpt-ai" | "azure";

export default function SpeechToTextClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const tool_t = t.tools.speechToText;

    const [provider, setProvider] = useState<ServiceProvider>("auto");
    const [copyButtonText, setCopyButtonText] = useState(tool_t.copy);

    // Service provider options
    const providerOptions: ServiceProviderOption<ServiceProvider>[] = useMemo(
        () => [
            { value: "auto", label: tool_t.auto, icon: "🤖" },
            { value: "fpt-ai", label: tool_t.fptAI, icon: "🇻🇳" },
            { value: "azure", label: tool_t.microsoftAzure, icon: "☁️" },
        ],
        [tool_t]
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Custom hooks
    const { file, fileName, fileSize, duration, handleFileSelect, clearFile, error: fileError } = useFileUpload();
    const { transcription, isLoading, error: apiError, convertFileToText, clearTranscription } = useSpeechToText();

    // Handle convert button
    const handleConvert = async () => {
        if (file) {
            await convertFileToText(file, provider);
        }
    };

    // Handle copy text
    const handleCopy = async () => {
        if (transcription) {
            try {
                await navigator.clipboard.writeText(transcription);
                setCopyButtonText(tool_t.copied);
                setTimeout(() => setCopyButtonText(tool_t.copy), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    // Handle download text
    const handleDownload = () => {
        if (transcription) {
            const blob = new Blob([transcription], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `transcription_${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    // Handle clear all
    const handleClearAll = () => {
        clearFile();
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        clearTranscription();
    };

    const currentError = fileError || apiError;

    return (
        <div className='space-y-4'>
            {/* Header */}
            <div className='text-center'>
                <h1 className='text-2xl font-bold mb-2 text-gray-900 dark:text-white flex items-center justify-center gap-2'>
                    <span className='text-3xl'>🎤</span>
                    {tool_t.name}
                </h1>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{tool_t.description}</p>
            </div>

            {/* Input Card */}
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                <div className='space-y-4'>
                    {/* File Upload */}
                    <div>
                        <input ref={fileInputRef} type='file' accept='audio/*,.mp3,.wav,.m4a,.ogg' onChange={handleFileSelect} className='hidden' id='audio-file-input' />
                        <label htmlFor='audio-file-input' className='cursor-pointer block'>
                            <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors'>
                                <svg className='w-12 h-12 mx-auto mb-3 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                                </svg>
                                <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{tool_t.uploadButton}</p>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>{tool_t.uploadHint}</p>
                            </div>
                        </label>
                    </div>

                    {/* File Info */}
                    {file && (
                        <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2'>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.fileName}:</span>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>{fileName}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.fileSize}:</span>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>{fileSize}</span>
                            </div>
                            {duration && (
                                <div className='flex items-center justify-between'>
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{tool_t.duration}:</span>
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>{duration}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Service Provider Selector */}
                <div className='mt-4'>
                    <ServiceProviderSelector value={provider} onChange={setProvider} options={providerOptions} label={tool_t.serviceProvider} hint={tool_t.serviceProviderHint} disabled={isLoading} />
                </div>

                {/* Info Note */}
                <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-4'>
                    <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                    </svg>
                    {tool_t.infoNote}
                </p>

                {/* Action Buttons */}
                <div className='flex gap-3 mt-4'>
                    <button onClick={handleConvert} disabled={isLoading || !file} className='flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md cursor-pointer'>
                        {isLoading ? (
                            <div className='flex items-center justify-center gap-2'>
                                <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
                                <span>{tool_t.converting}</span>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center gap-2'>
                                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                    <path d='M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z' />
                                    <path d='M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z' />
                                </svg>
                                <span>{tool_t.convert}</span>
                            </div>
                        )}
                    </button>
                    <button onClick={handleClearAll} disabled={isLoading} className='px-5 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer'>
                        {tool_t.clear}
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {currentError && (
                <div className='bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4 shadow-sm'>
                    <div className='flex items-start gap-3'>
                        <svg className='w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                        </svg>
                        <div className='flex-1'>
                            <p className='text-sm font-medium text-red-800 dark:text-red-300'>Error</p>
                            <p className='text-sm text-red-700 dark:text-red-400 mt-1'>{currentError}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Transcription Result */}
            {transcription && (
                <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                            <svg className='w-5 h-5 text-blue-600 dark:text-blue-400' fill='currentColor' viewBox='0 0 20 20'>
                                <path d='M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z' />
                                <path d='M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z' />
                            </svg>
                            {tool_t.transcription}
                        </h2>
                        <div className='flex gap-2'>
                            <button onClick={handleCopy} className='px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm rounded-lg transition-colors cursor-pointer'>
                                {copyButtonText}
                            </button>
                            <button onClick={handleDownload} className='px-3 py-1.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 text-sm rounded-lg transition-colors cursor-pointer'>
                                {tool_t.download}
                            </button>
                        </div>
                    </div>
                    <div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto'>
                        <p className='text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed'>{transcription}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
