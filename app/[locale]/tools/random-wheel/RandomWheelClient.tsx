"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#F8B739", "#52B788"];

export default function RandomWheelClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale).tools.randomWheel;
    const [options, setOptions] = useState<string[]>(["Option 1", "Option 2"]);
    const [newOption, setNewOption] = useState("");
    const [bulkOptions, setBulkOptions] = useState("");
    const [showBulkInput, setShowBulkInput] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sliceAngle = (2 * Math.PI) / options.length;

        options.forEach((option, index) => {
            const startAngle = index * sliceAngle - Math.PI / 2 + (rotation * Math.PI) / 180;
            const endAngle = (index + 1) * sliceAngle - Math.PI / 2 + (rotation * Math.PI) / 180;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = COLORS[index % COLORS.length];
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.textAlign = "center";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 14px Arial";
            ctx.fillText(option, radius / 2, 0);
            ctx.restore();
        });

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw pointer (triangle pointing LEFT into the wheel from the RIGHT side)
        ctx.beginPath();
        ctx.moveTo(centerX + radius - 5, centerY); // Sharp tip pointing INTO wheel (left)
        ctx.lineTo(centerX + radius + 25, centerY - 15); // Top of base (right, outside)
        ctx.lineTo(centerX + radius + 25, centerY + 15); // Bottom of base (right, outside)
        ctx.closePath();
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.strokeStyle = "#8B0000";
        ctx.lineWidth = 2;
        ctx.stroke();
    }, [options, rotation]);

    const addOption = useCallback(() => {
        if (newOption.trim() && !spinning) {
            setOptions((prev) => [...prev, newOption.trim()]);
            setNewOption("");
        }
    }, [newOption, spinning]);

    const addBulkOptions = useCallback(() => {
        if (bulkOptions.trim() && !spinning) {
            const newOpts = bulkOptions
                .split("\n")
                .map((opt) => opt.trim())
                .filter((opt) => opt.length > 0);
            if (newOpts.length > 0) {
                setOptions((prev) => [...prev, ...newOpts]);
                setBulkOptions("");
                setShowBulkInput(false);
            }
        }
    }, [bulkOptions, spinning]);

    const removeOption = useCallback(
        (index: number) => {
            if (options.length > 2 && !spinning) {
                setOptions((prev) => prev.filter((_, i) => i !== index));
            }
        },
        [options.length, spinning]
    );

    const spinWheel = useCallback(() => {
        if (spinning || options.length < 2) return;

        setSpinning(true);
        setWinner(null);

        const spins = 5 + Math.random() * 5;
        const extraDegrees = Math.random() * 360;
        const totalRotation = spins * 360 + extraDegrees;

        let currentRotation = rotation;
        const duration = 4000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            currentRotation = rotation + totalRotation * easeOut;

            setRotation(currentRotation % 360);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setSpinning(false);
                const normalizedRotation = (360 - (currentRotation % 360)) % 360;
                const sliceAngle = 360 / options.length;
                const winnerIndex = Math.floor(normalizedRotation / sliceAngle);
                setWinner(options[winnerIndex]);
            }
        };

        animate();
    }, [spinning, options, rotation]);

    // Draw wheel on mount and when dependencies change
    useEffect(() => {
        drawWheel();
    }, [drawWheel]);

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
            <div className='grid md:grid-cols-2 gap-8'>
                {/* Wheel */}
                <div className='flex flex-col items-center'>
                    <canvas ref={canvasRef} width={400} height={400} className='max-w-full' />
                    <button onClick={spinWheel} disabled={spinning || options.length < 2} className='mt-6 px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all transform hover:scale-105 flex items-center gap-2 justify-center'>
                        {spinning && (
                            <svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                            </svg>
                        )}
                        {spinning ? t.spinning : t.spin}
                    </button>
                    {winner && (
                        <div className='mt-4 p-4 bg-green-100 dark:bg-green-900 rounded-lg border-2 border-green-500'>
                            <p className='text-lg font-bold text-green-800 dark:text-green-200'>
                                {t.winner}: {winner}
                            </p>
                        </div>
                    )}
                </div>

                {/* Options */}
                <div className='flex flex-col'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>{t.options}</h3>
                        <button onClick={() => setShowBulkInput(!showBulkInput)} disabled={spinning} className='px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'>
                            {showBulkInput ? "Single" : "Bulk Add"}
                        </button>
                    </div>

                    {!showBulkInput ? (
                        <div className='flex gap-2 mb-4'>
                            <input type='text' value={newOption} onChange={(e) => setNewOption(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addOption()} placeholder={t.addPlaceholder} className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent' disabled={spinning} />
                            <button onClick={addOption} disabled={spinning || !newOption.trim()} className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'>
                                {t.add}
                            </button>
                        </div>
                    ) : (
                        <div className='mb-4'>
                            <textarea value={bulkOptions} onChange={(e) => setBulkOptions(e.target.value)} placeholder='Enter options (one per line)...' rows={5} className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none' disabled={spinning} />
                            <button onClick={addBulkOptions} disabled={spinning || !bulkOptions.trim()} className='mt-2 w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors'>
                                Add All Options
                            </button>
                        </div>
                    )}

                    <div className='space-y-2 max-h-96 overflow-y-auto'>
                        {options.map((option, index) => (
                            <div key={index} className='flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group'>
                                <div className='w-6 h-6 rounded-full' style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className='flex-1 text-gray-900 dark:text-gray-100'>{option}</span>
                                <button onClick={() => removeOption(index)} disabled={spinning || options.length <= 2} className='px-3 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors opacity-0 group-hover:opacity-100'>
                                    {t.remove}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
