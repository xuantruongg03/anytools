"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import Button from "@/components/ui/Button";

export default function QrCodeGeneratorClient() {
    const [text, setText] = useState("");
    const [qrCode, setQrCode] = useState("");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateQRCode = async () => {
        if (!text.trim()) return;

        try {
            const url = await QRCode.toDataURL(text, {
                width: 300,
                margin: 2,
                color: {
                    dark: "#000000",
                    light: "#FFFFFF",
                },
            });
            setQrCode(url);
        } catch (err) {
            console.error(err);
        }
    };

    const downloadQRCode = () => {
        if (!qrCode) return;
        const link = document.createElement("a");
        link.download = "qrcode.png";
        link.href = qrCode;
        link.click();
    };

    return (
        <div className='space-y-6'>
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder='Enter text or URL to generate QR code...' rows={4} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100' />

                <Button onClick={generateQRCode} variant='primary' size='lg' fullWidth className='mt-4'>
                    Generate QR Code
                </Button>
            </div>

            {qrCode && (
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center'>
                    <img src={qrCode} alt='QR Code' className='mx-auto mb-4' />
                    <Button onClick={downloadQRCode} variant='success'>
                        Download QR Code
                    </Button>
                </div>
            )}
        </div>
    );
}
