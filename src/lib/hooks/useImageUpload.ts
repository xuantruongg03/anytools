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
    handlePaste: (event: ClipboardEvent) => void;
    setFileFromBlob: (blob: Blob, name?: string) => void;
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

    const processFile = useCallback((selectedFile: File) => {
        setError(null);

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

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const selectedFile = event.target.files?.[0];
            if (!selectedFile) return;
            processFile(selectedFile);
        },
        [processFile]
    );

    const setFileFromBlob = useCallback(
        (blob: Blob, name: string = `pasted_image_${Date.now()}.png`) => {
            const file = new File([blob], name, { type: blob.type || "image/png" });
            processFile(file);
        },
        [processFile]
    );

    const handlePaste = useCallback(
        (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                // Check for image data
                if (item.type.startsWith("image/")) {
                    const blob = item.getAsFile();
                    if (blob) {
                        setFileFromBlob(blob, `pasted_image_${Date.now()}.png`);
                        event.preventDefault();
                        return;
                    }
                }

                // Check for base64 string in text
                if (item.type === "text/plain") {
                    item.getAsString((text) => {
                        // Check if it's a base64 data URL
                        if (text.startsWith("data:image/")) {
                            try {
                                const [header, base64Data] = text.split(",");
                                const mimeMatch = header.match(/data:(image\/[^;]+)/);
                                const mimeType = mimeMatch ? mimeMatch[1] : "image/png";

                                // Convert base64 to blob
                                const byteCharacters = atob(base64Data);
                                const byteNumbers = new Array(byteCharacters.length);
                                for (let j = 0; j < byteCharacters.length; j++) {
                                    byteNumbers[j] = byteCharacters.charCodeAt(j);
                                }
                                const byteArray = new Uint8Array(byteNumbers);
                                const blob = new Blob([byteArray], { type: mimeType });

                                const extension = mimeType.split("/")[1] || "png";
                                setFileFromBlob(blob, `pasted_image_${Date.now()}.${extension}`);
                            } catch (err) {
                                console.error("Failed to parse base64 image:", err);
                                setError("Failed to parse pasted image data.");
                            }
                        }
                    });
                }
            }
        },
        [setFileFromBlob]
    );

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
        handlePaste,
        setFileFromBlob,
        clearFile,
    };
};
