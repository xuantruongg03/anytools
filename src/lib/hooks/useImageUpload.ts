import { useState, useCallback } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface UseImageUploadReturn {
    file: File | null;
    fileName: string;
    fileSize: string;
    dimensions: string;
    preview: string | null;
    error: string | null;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clearFile: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        setError(null);

        if (!selectedFile) return;

        // Validate file type
        if (!SUPPORTED_FORMATS.includes(selectedFile.type)) {
            setError("Invalid file format. Please upload a JPG, PNG, or WEBP image.");
            return;
        }

        // Validate file size
        if (selectedFile.size > MAX_FILE_SIZE) {
            setError("File is too large. Maximum size is 10MB.");
            return;
        }

        setFile(selectedFile);
        setFileName(selectedFile.name);
        setFileSize(formatFileSize(selectedFile.size));

        // Create preview URL
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
            setDimensions(`${img.width} × ${img.height}`);
        };
        img.src = objectUrl;
    }, []);

    const clearFile = useCallback(() => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setFile(null);
        setFileName("");
        setFileSize("");
        setDimensions("");
        setPreview(null);
        setError(null);
    }, [preview]);

    return {
        file,
        fileName,
        fileSize,
        dimensions,
        preview,
        error,
        handleFileSelect,
        clearFile,
    };
};
