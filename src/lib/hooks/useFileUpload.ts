import { useState, useCallback } from "react";

interface UseFileUploadReturn {
    file: File | null;
    fileUrl: string | null;
    fileName: string | null;
    fileSize: string | null;
    duration: string | null;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearFile: () => void;
    error: string | null;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const SUPPORTED_FORMATS = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/m4a", "audio/ogg", "audio/webm"];

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const useFileUpload = (): UseFileUploadReturn => {
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<string | null>(null);
    const [duration, setDuration] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files?.[0];
            setError(null);

            if (!selectedFile) {
                return;
            }

            // Validate file type
            if (!SUPPORTED_FORMATS.includes(selectedFile.type) && !selectedFile.name.match(/\.(mp3|wav|m4a|ogg|webm)$/i)) {
                setError("Invalid file format. Please upload an audio file (MP3, WAV, M4A, OGG).");
                return;
            }

            // Validate file size
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError("File is too large. Maximum size is 25MB.");
                return;
            }

            // Create object URL
            const url = URL.createObjectURL(selectedFile);
            setFile(selectedFile);
            setFileUrl(url);
            setFileName(selectedFile.name);
            setFileSize(formatFileSize(selectedFile.size));

            // Get audio duration
            const audio = new Audio(url);
            audio.addEventListener("loadedmetadata", () => {
                setDuration(formatDuration(audio.duration));
            });

            // Clean up previous URL
            return () => {
                if (fileUrl) {
                    URL.revokeObjectURL(fileUrl);
                }
            };
        },
        [fileUrl]
    );

    const clearFile = useCallback(() => {
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
        }
        setFile(null);
        setFileUrl(null);
        setFileName(null);
        setFileSize(null);
        setDuration(null);
        setError(null);
    }, [fileUrl]);

    return {
        file,
        fileUrl,
        fileName,
        fileSize,
        duration,
        handleFileSelect,
        clearFile,
        error,
    };
};
