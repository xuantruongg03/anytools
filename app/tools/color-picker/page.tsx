import type { Metadata } from "next";
import ColorPickerClient from "./ColorPickerClient";

export const metadata: Metadata = {
    title: "Color Picker - HEX, RGB, HSL Color Converter",
    description: "Free online color picker and converter. Pick colors and convert between HEX, RGB, HSL, and RGBA formats. Perfect for web designers and developers.",
    keywords: ["color picker", "hex to rgb", "rgb to hex", "hsl converter", "color converter", "color palette", "web colors"],
    openGraph: {
        title: "Color Picker & Converter - Free Online Tool",
        description: "Pick colors and convert between HEX, RGB, and HSL formats.",
        type: "website",
    },
};

export default function ColorPickerPage() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                <header className='mb-8'>
                    <h1 className='text-4xl font-bold mb-4'>Color Picker & Converter</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>Pick colors and convert between different color formats: HEX, RGB, and HSL.</p>
                </header>

                <ColorPickerClient />

                <section className='mt-12 prose dark:prose-invert max-w-none'>
                    <h2 className='text-2xl font-semibold mb-4'>Color Format Guide</h2>

                    <div className='space-y-4 text-gray-600 dark:text-gray-400'>
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>HEX (Hexadecimal)</h3>
                            <p className='text-sm'>Format: #RRGGBB or #RGB. Example: #FF5733</p>
                            <p className='text-sm'>Most commonly used in web design and CSS.</p>
                        </div>

                        <div>
                            <h3 className='text-lg font-semibold mb-2'>RGB (Red, Green, Blue)</h3>
                            <p className='text-sm'>Format: rgb(red, green, blue). Values: 0-255</p>
                            <p className='text-sm'>Example: rgb(255, 87, 51)</p>
                        </div>

                        <div>
                            <h3 className='text-lg font-semibold mb-2'>HSL (Hue, Saturation, Lightness)</h3>
                            <p className='text-sm'>Format: hsl(hue, saturation%, lightness%)</p>
                            <p className='text-sm'>Example: hsl(9, 100%, 60%)</p>
                            <p className='text-sm'>Easier for humans to understand and adjust colors.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
