"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Button from "@/components/ui/Button";

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="#4F46E5" />
  <text x="100" y="110" text-anchor="middle" fill="white" font-size="24" font-family="Arial">SVG</text>
</svg>`;

export default function SvgPreviewClient() {
    const [svgInput, setSvgInput] = useState(DEFAULT_SVG);
    const [error, setError] = useState("");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [showGrid, setShowGrid] = useState(false);
    const [zoom, setZoom] = useState(100);
    const [copied, setCopied] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [renderMode, setRenderMode] = useState<"img" | "inline">("img");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Prepare SVG for rendering - add xmlns if missing, ensure proper structure
    const prepareSvgForRender = useCallback((svg: string): string => {
        if (!svg.trim()) return "";

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svg, "image/svg+xml");
            const svgElement = doc.querySelector("svg");

            if (!svgElement) return svg;

            // Add xmlns if missing
            if (!svgElement.getAttribute("xmlns")) {
                svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            }

            // Add default dimensions if missing both width/height and no viewBox
            const hasWidth = svgElement.hasAttribute("width");
            const hasHeight = svgElement.hasAttribute("height");
            const hasViewBox = svgElement.hasAttribute("viewBox");

            if (!hasWidth && !hasHeight && !hasViewBox) {
                svgElement.setAttribute("width", "200");
                svgElement.setAttribute("height", "200");
            } else if (hasViewBox && !hasWidth && !hasHeight) {
                // If only viewBox exists, add width/height based on viewBox
                const viewBox = svgElement.getAttribute("viewBox");
                if (viewBox) {
                    const parts = viewBox.split(/\s+/);
                    if (parts.length >= 4) {
                        svgElement.setAttribute("width", parts[2]);
                        svgElement.setAttribute("height", parts[3]);
                    }
                }
            }

            const serializer = new XMLSerializer();
            return serializer.serializeToString(svgElement);
        } catch {
            return svg;
        }
    }, []);

    // Generate data URL for img tag rendering
    const svgDataUrl = useMemo(() => {
        if (!svgInput.trim() || error) return "";
        const preparedSvg = prepareSvgForRender(svgInput);
        const encoded = encodeURIComponent(preparedSvg);
        return `data:image/svg+xml,${encoded}`;
    }, [svgInput, error, prepareSvgForRender]);

    const validateSvg = useCallback((svg: string): boolean => {
        if (!svg.trim()) {
            setError("");
            return false;
        }

        // Check if it starts with <svg
        if (!svg.trim().toLowerCase().includes("<svg")) {
            setError("Invalid SVG: Must contain <svg> tag");
            return false;
        }

        // Try parsing as XML
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svg, "image/svg+xml");
            const parseError = doc.querySelector("parsererror");
            if (parseError) {
                setError("Invalid SVG: " + parseError.textContent?.split("\n")[0]);
                return false;
            }
            setError("");
            return true;
        } catch {
            setError("Invalid SVG format");
            return false;
        }
    }, []);

    useEffect(() => {
        validateSvg(svgInput);
    }, [svgInput, validateSvg]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(svgInput);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setError("Failed to copy to clipboard");
        }
    };

    const downloadSvg = () => {
        const blob = new Blob([svgInput], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "image.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadPng = async () => {
        if (!svgInput.trim()) return;

        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const img = new Image();
            const svgBlob = new Blob([svgInput], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                canvas.width = img.width || 400;
                canvas.height = img.height || 400;
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                const pngUrl = canvas.toDataURL("image/png");
                const a = document.createElement("a");
                a.href = pngUrl;
                a.download = "image.png";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };

            img.src = url;
        } catch {
            setError("Failed to convert to PNG");
        }
    };

    const clearAll = () => {
        setSvgInput("");
        setError("");
        setFileName(null);
    };

    const loadExample = () => {
        setSvgInput(DEFAULT_SVG);
        setFileName(null);
    };

    // Handle file reading
    const handleFile = useCallback((file: File) => {
        if (!file.type.includes("svg") && !file.name.endsWith(".svg")) {
            setError("Please select a valid SVG file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setSvgInput(content);
            setFileName(file.name);
            setError("");
        };
        reader.onerror = () => {
            setError("Failed to read file");
        };
        reader.readAsText(file);
    }, []);

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
        // Reset input so same file can be selected again
        e.target.value = "";
    };

    // Handle drag and drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const file = e.dataTransfer.files?.[0];
            if (file) {
                handleFile(file);
            }
        },
        [handleFile]
    );

    // Trigger file input click
    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const formatSvg = () => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgInput, "image/svg+xml");
            const parseError = doc.querySelector("parsererror");
            if (parseError) {
                setError("Cannot format invalid SVG");
                return;
            }

            const serializer = new XMLSerializer();
            let formatted = serializer.serializeToString(doc.documentElement);

            // Basic formatting
            formatted = formatted
                .replace(/></g, ">\n<")
                .replace(/(\s+)/g, " ")
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line)
                .join("\n");

            setSvgInput(formatted);
            setError("");
        } catch {
            setError("Failed to format SVG");
        }
    };

    const minifySvg = () => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgInput, "image/svg+xml");
            const parseError = doc.querySelector("parsererror");
            if (parseError) {
                setError("Cannot minify invalid SVG");
                return;
            }

            const serializer = new XMLSerializer();
            let minified = serializer.serializeToString(doc.documentElement);
            minified = minified.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();

            setSvgInput(minified);
            setError("");
        } catch {
            setError("Failed to minify SVG");
        }
    };

    return (
        <div className='space-y-6'>
            {/* Controls */}
            <div className='flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Background:</label>
                    <input type='color' value={bgColor} onChange={(e) => setBgColor(e.target.value)} className='w-8 h-8 rounded cursor-pointer border border-gray-300 dark:border-gray-600' />
                </div>
                <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                        <input type='checkbox' checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className='mr-2' />
                        Show Grid
                    </label>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Zoom:</label>
                    <input type='range' min='25' max='200' value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className='w-24' />
                    <span className='text-sm text-gray-600 dark:text-gray-400 w-12'>{zoom}%</span>
                </div>
                <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Render:</label>
                    <select value={renderMode} onChange={(e) => setRenderMode(e.target.value as "img" | "inline")} className='text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'>
                        <option value='img'>Image (Compatible)</option>
                        <option value='inline'>Inline (Interactive)</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className='grid lg:grid-cols-2 gap-6'>
                {/* Input Section */}
                <div>
                    <div className='flex items-center justify-between mb-2'>
                        <label className='block text-sm font-medium text-gray-900 dark:text-gray-100'>SVG Code</label>
                        {fileName && <span className='text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]'>📄 {fileName}</span>}
                    </div>

                    {/* Hidden file input */}
                    <input ref={fileInputRef} type='file' accept='.svg,image/svg+xml' onChange={handleFileInputChange} className='hidden' />

                    {/* Drag and Drop Zone / Textarea */}
                    <div className={`relative transition-all ${isDragging ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <textarea value={svgInput} onChange={(e) => setSvgInput(e.target.value)} placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>' className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 resize-none placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500' spellCheck={false} />

                        {/* Drag overlay */}
                        {isDragging && (
                            <div className='absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center'>
                                <div className='text-center'>
                                    <svg className='w-12 h-12 mx-auto mb-2 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                                    </svg>
                                    <p className='text-blue-600 dark:text-blue-400 font-medium'>Drop SVG file here</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && <div className='mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>{error}</div>}
                    <div className='flex flex-wrap gap-2 mt-3'>
                        <Button onClick={openFileDialog} variant='dark'>
                            Import SVG
                        </Button>
                        <Button onClick={formatSvg} variant='primary'>
                            Format
                        </Button>
                        <Button onClick={minifySvg} variant='success'>
                            Minify
                        </Button>
                        <Button onClick={loadExample} variant='info'>
                            Example
                        </Button>
                        <Button onClick={clearAll} variant='gray'>
                            Clear
                        </Button>
                    </div>
                    <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>💡 Tip: You can also drag and drop SVG files directly into the editor</p>
                </div>

                {/* Preview Section */}
                <div>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>Preview</label>
                    <div
                        className='w-full h-96 border rounded-lg overflow-hidden relative'
                        style={{
                            backgroundColor: bgColor,
                            backgroundImage: showGrid ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)" : "none",
                            backgroundSize: showGrid ? "20px 20px" : "auto",
                            backgroundPosition: showGrid ? "0 0, 0 10px, 10px -10px, -10px 0px" : "auto",
                        }}
                    >
                        <div className='w-full h-full flex items-center justify-center overflow-auto p-4'>
                            {svgInput.trim() && !error ? (
                                renderMode === "img" ? (
                                    <img src={svgDataUrl} alt='SVG Preview' style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center" }} className='max-w-full max-h-full object-contain' onError={() => setRenderMode("inline")} />
                                ) : (
                                    <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center" }} dangerouslySetInnerHTML={{ __html: prepareSvgForRender(svgInput) }} className='max-w-full max-h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block' />
                                )
                            ) : (
                                <div className='text-gray-400 dark:text-gray-500 text-center'>
                                    <svg className='w-16 h-16 mx-auto mb-2 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                    </svg>
                                    <p>Enter SVG code to preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-2 mt-4'>
                        <Button onClick={copyToClipboard} variant='purple' disabled={!svgInput.trim()}>
                            {copied ? "Copied!" : "Copy SVG"}
                        </Button>
                        <Button onClick={downloadSvg} variant='primary' disabled={!svgInput.trim() || !!error}>
                            Download SVG
                        </Button>
                        <Button onClick={downloadPng} variant='success' disabled={!svgInput.trim() || !!error}>
                            Download PNG
                        </Button>
                    </div>
                    <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>💡 Tip: If SVG doesn&apos;t display correctly, try switching render mode. &quot;Image&quot; mode is more compatible, &quot;Inline&quot; mode supports interactivity.</p>
                </div>
            </div>

            {/* SVG Info */}
            {svgInput.trim() && !error && (
                <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-2'>SVG Information</h3>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                        <div>
                            <span className='text-gray-500 dark:text-gray-400'>Size: </span>
                            <span className='text-gray-900 dark:text-gray-100'>{new Blob([svgInput]).size} bytes</span>
                        </div>
                        <div>
                            <span className='text-gray-500 dark:text-gray-400'>Lines: </span>
                            <span className='text-gray-900 dark:text-gray-100'>{svgInput.split("\n").length}</span>
                        </div>
                        <div>
                            <span className='text-gray-500 dark:text-gray-400'>Elements: </span>
                            <span className='text-gray-900 dark:text-gray-100'>{(svgInput.match(/<[a-z]/gi) || []).length}</span>
                        </div>
                        <div>
                            <span className='text-gray-500 dark:text-gray-400'>Characters: </span>
                            <span className='text-gray-900 dark:text-gray-100'>{svgInput.length}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
