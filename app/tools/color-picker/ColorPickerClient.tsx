"use client";

import { useState, useEffect } from "react";

export default function ColorPickerClient() {
    const [color, setColor] = useState("#3b82f6");
    const [hex, setHex] = useState("#3b82f6");
    const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
    const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });

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

    const copyToClipboard = async (text: string, format: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert(`Copied ${format} to clipboard!`);
        } catch (e) {
            alert("Failed to copy");
        }
    };

    return (
        <div className='max-w-4xl mx-auto'>
            <div className='grid md:grid-cols-2 gap-8'>
                {/* Color Preview */}
                <div>
                    <label className='block text-sm font-medium mb-2'>Pick a Color</label>
                    <div className='w-full h-64 rounded-lg border-4 border-gray-300 dark:border-gray-700 mb-4' style={{ backgroundColor: color }} />
                    <input type='color' value={color} onChange={(e) => setColor(e.target.value)} className='w-full h-12 rounded-lg cursor-pointer' />
                </div>

                {/* Color Formats */}
                <div className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium mb-2'>HEX</label>
                        <div className='flex gap-2'>
                            <input type='text' value={hex} readOnly className='flex-1 p-3 border rounded-lg font-mono dark:bg-gray-800 dark:border-gray-700' />
                            <button onClick={() => copyToClipboard(hex, "HEX")} className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                                Copy
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>RGB</label>
                        <div className='flex gap-2'>
                            <input type='text' value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly className='flex-1 p-3 border rounded-lg font-mono dark:bg-gray-800 dark:border-gray-700' />
                            <button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")} className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
                                Copy
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>HSL</label>
                        <div className='flex gap-2'>
                            <input type='text' value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} readOnly className='flex-1 p-3 border rounded-lg font-mono dark:bg-gray-800 dark:border-gray-700' />
                            <button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")} className='px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'>
                                Copy
                            </button>
                        </div>
                    </div>

                    <div className='grid grid-cols-3 gap-2 mt-6'>
                        <div className='text-center'>
                            <div className='text-xs text-gray-500 mb-1'>R</div>
                            <div className='text-2xl font-bold'>{rgb.r}</div>
                        </div>
                        <div className='text-center'>
                            <div className='text-xs text-gray-500 mb-1'>G</div>
                            <div className='text-2xl font-bold'>{rgb.g}</div>
                        </div>
                        <div className='text-center'>
                            <div className='text-xs text-gray-500 mb-1'>B</div>
                            <div className='text-2xl font-bold'>{rgb.b}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
