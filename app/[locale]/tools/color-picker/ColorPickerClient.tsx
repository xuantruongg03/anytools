"use client";

import { getTranslation } from "@/lib/i18n";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

export default function ColorPickerClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);

    const [color, setColor] = useState("#3b82f6");
    const [hex, setHex] = useState("#3b82f6");
    const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
    const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        updateFromHex(color);
    }, [color]);

    const updateFromHex = (hexValue: string) => {
        setHex(hexValue);
        const r = parseInt(hexValue.slice(1, 3), 16);
        const g = parseInt(hexValue.slice(3, 5), 16);
        const b = parseInt(hexValue.slice(5, 7), 16);
        setRgb({ r, g, b });

        const hslValue = rgbToHsl(r, g, b);
        setHsl(hslValue);
    };

    const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0,
            s = 0,
            l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
        };
    };

    const rgbToHex = (r: number, g: number, b: number) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canvasRef.current || !imageRef.current) return;

        const canvas = canvasRef.current;
        const img = imageRef.current;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set canvas size to match image
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Calculate actual pixel coordinates
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        const pixelX = Math.floor(x * scaleX);
        const pixelY = Math.floor(y * scaleY);

        // Get pixel color
        const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
        const r = pixelData[0];
        const g = pixelData[1];
        const b = pixelData[2];

        // Update color
        const hexColor = rgbToHex(r, g, b);
        setColor(hexColor);
        updateFromHex(hexColor);
    };

    const copyToClipboard = async (text: string, format: string) => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                alert(locale === "en" ? `Copied ${format} to clipboard!` : `Đã sao chép ${format} vào clipboard!`);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                alert(locale === "en" ? `Copied ${format} to clipboard!` : `Đã sao chép ${format} vào clipboard!`);
            }
        } catch (e) {
            alert(locale === "en" ? "Failed to copy" : "Sao chép thất bại");
        }
    };

    return (
        <div className='max-w-6xl mx-auto'>
            <div className='grid lg:grid-cols-2 gap-8'>
                {/* Color Picker & Image Upload */}
                <div className='space-y-6'>
                    {/* Color Wheel Picker */}
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.pickColor}</label>
                        <div className='w-full h-64 rounded-lg border-4 border-gray-300 dark:border-gray-700 mb-4' style={{ backgroundColor: color }} />
                        <input type='color' value={color} onChange={(e) => setColor(e.target.value)} className='w-full h-12 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-700' />
                    </div>

                    {/* Image Color Picker */}
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.imageColorPicker}</label>
                        <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' id='image-upload' />
                        <label htmlFor='image-upload' className='block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium'>
                            {t.tools.colorPicker.uploadImage}
                        </label>

                        {uploadedImage && (
                            <div className='mt-4'>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mb-2'>{t.tools.colorPicker.clickToPickColor}</p>
                                <div onClick={handleImageClick} className='relative cursor-crosshair border-2 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden'>
                                    <img ref={imageRef} src={uploadedImage} alt='Uploaded' className='w-full h-auto max-h-96 object-contain' />
                                </div>
                                <canvas ref={canvasRef} className='hidden' />
                            </div>
                        )}
                    </div>
                </div>

                {/* Color Formats */}
                <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.colorFormats}</h3>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>HEX</label>
                        <div className='flex gap-2'>
                            <input type='text' value={hex} readOnly className='flex-1 p-3 border rounded-lg font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100' />
                            <Button onClick={() => copyToClipboard(hex, "HEX")} variant='primary'>
                                {t.common.copy}
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>RGB</label>
                        <div className='flex gap-2'>
                            <input type='text' value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly className='flex-1 p-3 border rounded-lg font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100' />
                            <Button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")} variant='success'>
                                {t.common.copy}
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>HSL</label>
                        <div className='flex gap-2'>
                            <input type='text' value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} readOnly className='flex-1 p-3 border rounded-lg font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100' />
                            <Button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")} variant='purple'>
                                {t.common.copy}
                            </Button>
                        </div>
                    </div>

                    <div className='pt-4'>
                        <label className='block text-sm font-medium mb-3 text-gray-900 dark:text-gray-100'>{t.tools.colorPicker.rgbValues}</label>
                        <div className='grid grid-cols-3 gap-4'>
                            <div className='text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                                <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>R</div>
                                <div className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{rgb.r}</div>
                            </div>
                            <div className='text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                                <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>G</div>
                                <div className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{rgb.g}</div>
                            </div>
                            <div className='text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                                <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>B</div>
                                <div className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{rgb.b}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
