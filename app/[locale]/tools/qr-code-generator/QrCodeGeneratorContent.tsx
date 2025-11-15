"use client";

import { useState, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import FAQSection from "@/components/ui/FAQSection";

type QrCodeGeneratorContentProps = {
    locale: "en" | "vi";
};

export default function QrCodeGeneratorContent({ locale }: QrCodeGeneratorContentProps) {
    const { setLocale } = useLanguage();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (!hasSynced.current) {
            setLocale(locale);
            hasSynced.current = true;
        }
    }, [locale, setLocale]);

    const t = getTranslation(locale);
    const ui = t.tools.qrCodeGenerator.ui;
    const page = t.tools.qrCodeGenerator.page;

    const [text, setText] = useState("");
    const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
    const [size, setSize] = useState(300);
    const [fgColor, setFgColor] = useState("#000000");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
    const [margin, setMargin] = useState(10);
    const [cornerStyle, setCornerStyle] = useState<"square" | "extra-rounded" | "dot">("square");
    const [logo, setLogo] = useState<string>("");
    const [logoSize, setLogoSize] = useState(0.2);

    const qrRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (text.trim()) {
            const qr = new QRCodeStyling({
                width: size,
                height: size,
                data: text,
                margin: margin,
                qrOptions: {
                    typeNumber: 0,
                    mode: "Byte",
                    errorCorrectionLevel: errorLevel,
                },
                imageOptions: {
                    hideBackgroundDots: true,
                    imageSize: logoSize,
                    margin: 5,
                },
                dotsOptions: {
                    color: fgColor,
                    type: cornerStyle === "dot" ? "dots" : cornerStyle === "extra-rounded" ? "rounded" : "square",
                },
                backgroundOptions: {
                    color: bgColor,
                },
                cornersSquareOptions: {
                    type: cornerStyle,
                    color: fgColor,
                },
                cornersDotOptions: {
                    type: cornerStyle === "dot" ? "dot" : cornerStyle === "extra-rounded" ? "dot" : undefined,
                    color: fgColor,
                },
                image: logo || undefined,
            });

            setQrCode(qr);

            if (qrRef.current) {
                qrRef.current.innerHTML = "";
                qr.append(qrRef.current);
            }
        }
    }, [text, size, fgColor, bgColor, errorLevel, margin, cornerStyle, logo, logoSize]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogo(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadQR = (extension: "png" | "svg") => {
        if (qrCode) {
            qrCode.download({
                name: "qrcode",
                extension: extension,
            });
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='container mx-auto px-4 py-8'>
                {/* Header */}
                <header className='mb-8'>
                    <h1 className='text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100'>{page.title}</h1>
                    <p className='text-lg text-gray-600 dark:text-gray-400'>{page.subtitle}</p>
                </header>

                {/* Tool Section */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
                    {/* Input & Settings */}
                    <div className='space-y-6'>
                        {/* Text Input */}
                        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                            <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{ui.inputLabel}</label>
                            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={ui.inputPlaceholder} rows={4} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent' />
                        </div>

                        {/* Customization */}
                        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{ui.customization}</h3>

                            <div className='space-y-4'>
                                {/* Size */}
                                <div>
                                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                                        {ui.size}: {size}px
                                    </label>
                                    <input type='range' min='200' max='600' step='50' value={size} onChange={(e) => setSize(Number(e.target.value))} className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500' />
                                </div>

                                {/* Colors */}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{ui.foregroundColor}</label>
                                        <div className='flex items-center gap-2'>
                                            <input type='color' value={fgColor} onChange={(e) => setFgColor(e.target.value)} className='w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer' />
                                            <input type='text' value={fgColor} onChange={(e) => setFgColor(e.target.value)} className='flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100' />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{ui.backgroundColor}</label>
                                        <div className='flex items-center gap-2'>
                                            <input type='color' value={bgColor} onChange={(e) => setBgColor(e.target.value)} className='w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer' />
                                            <input type='text' value={bgColor} onChange={(e) => setBgColor(e.target.value)} className='flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100' />
                                        </div>
                                    </div>
                                </div>

                                {/* Error Correction */}
                                <div>
                                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{ui.errorCorrection}</label>
                                    <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value as "L" | "M" | "Q" | "H")} className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100'>
                                        <option value='L'>{ui.errorLow}</option>
                                        <option value='M'>{ui.errorMedium}</option>
                                        <option value='Q'>{ui.errorQuartile}</option>
                                        <option value='H'>{ui.errorHigh}</option>
                                    </select>
                                </div>

                                {/* Margin */}
                                <div>
                                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                                        {ui.margin}: {margin}px
                                    </label>
                                    <input type='range' min='0' max='30' step='5' value={margin} onChange={(e) => setMargin(Number(e.target.value))} className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500' />
                                </div>

                                {/* Corner Style */}
                                <div>
                                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{ui.cornerStyle}</label>
                                    <div className='grid grid-cols-3 gap-2'>
                                        <button onClick={() => setCornerStyle("square")} className={`px-4 py-2 rounded border ${cornerStyle === "square" ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"}`}>
                                            {ui.square}
                                        </button>
                                        <button onClick={() => setCornerStyle("extra-rounded")} className={`px-4 py-2 rounded border ${cornerStyle === "extra-rounded" ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"}`}>
                                            {ui.rounded}
                                        </button>
                                        <button onClick={() => setCornerStyle("dot")} className={`px-4 py-2 rounded border ${cornerStyle === "dot" ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"}`}>
                                            {ui.dots}
                                        </button>
                                    </div>
                                </div>

                                {/* Logo Upload */}
                                <div>
                                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{ui.logo}</label>
                                    <input ref={fileInputRef} type='file' accept='image/*' onChange={handleLogoUpload} className='hidden' />
                                    <div className='flex gap-2'>
                                        <button onClick={() => fileInputRef.current?.click()} className='flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'>
                                            {ui.uploadLogo}
                                        </button>
                                        {logo && (
                                            <button onClick={() => setLogo("")} className='px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30'>
                                                {ui.removeLogo}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Logo Size */}
                                {logo && (
                                    <div>
                                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>{ui.logoSize}</label>
                                        <div className='grid grid-cols-3 gap-2'>
                                            <button onClick={() => setLogoSize(0.15)} className={`px-4 py-2 rounded border ${logoSize === 0.15 ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"}`}>
                                                {ui.small}
                                            </button>
                                            <button onClick={() => setLogoSize(0.2)} className={`px-4 py-2 rounded border ${logoSize === 0.2 ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"}`}>
                                                {ui.medium}
                                            </button>
                                            <button onClick={() => setLogoSize(0.25)} className={`px-4 py-2 rounded border ${logoSize === 0.25 ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"}`}>
                                                {ui.large}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* QR Code Preview */}
                    <div className='space-y-6'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 lg:sticky lg:top-8'>
                            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{ui.preview}</h3>
                            {text.trim() ? (
                                <div className='space-y-4'>
                                    <div ref={qrRef} className='flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg'></div>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <button onClick={() => downloadQR("png")} className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors'>
                                            {ui.downloadPng}
                                        </button>
                                        <button onClick={() => downloadQR("svg")} className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors'>
                                            {ui.downloadSvg}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className='flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900 rounded-lg'>
                                    <p className='text-gray-400 dark:text-gray-600 text-center px-4'>{ui.inputPlaceholder}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* What is QR Code */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.whatIsQr}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{page.whatIsQrDesc}</p>
                </section>

                {/* How QR Works */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.howQrWorks}</h2>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>{page.howQrWorksDesc}</p>
                </section>

                {/* Why Use */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.whyUse}</h2>
                    <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.customColors.split(":")[0]}:</strong> {page.features.customColors.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.addLogo.split(":")[0]}:</strong> {page.features.addLogo.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.multipleStyles.split(":")[0]}:</strong> {page.features.multipleStyles.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.errorCorrection.split(":")[0]}:</strong> {page.features.errorCorrection.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.adjustableSize.split(":")[0]}:</strong> {page.features.adjustableSize.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>✓</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.features.downloadFormats.split(":")[0]}:</strong> {page.features.downloadFormats.split(":").slice(1).join(":")}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* How to Use */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.howToUse}</h2>
                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
                        <ol className='space-y-3 text-gray-700 dark:text-gray-300 list-decimal list-inside'>
                            <li>{page.howToSteps.step1}</li>
                            <li>{page.howToSteps.step2}</li>
                            <li>{page.howToSteps.step3}</li>
                            <li>{page.howToSteps.step4}</li>
                        </ol>
                    </div>
                </section>

                {/* Use Cases */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.useCases}</h2>
                    <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.marketing.split(":")[0]}:</strong> {page.useCasesList.marketing.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.businessCards.split(":")[0]}:</strong> {page.useCasesList.businessCards.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.payments.split(":")[0]}:</strong> {page.useCasesList.payments.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.wifi.split(":")[0]}:</strong> {page.useCasesList.wifi.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.authentication.split(":")[0]}:</strong> {page.useCasesList.authentication.split(":").slice(1).join(":")}
                            </span>
                        </li>
                        <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                                <strong className='text-gray-900 dark:text-gray-100'>{page.useCasesList.inventory.split(":")[0]}:</strong> {page.useCasesList.inventory.split(":").slice(1).join(":")}
                            </span>
                        </li>
                    </ul>
                </section>

                {/* QR Types Grid */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>{page.qrTypes}</h2>
                    <div className='grid md:grid-cols-2 gap-4'>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.qrTypesGrid.url}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.qrTypesGrid.text}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.qrTypesGrid.email}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.qrTypesGrid.phone}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.qrTypesGrid.sms}</p>
                        </div>
                        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                            <p className='text-sm text-gray-700 dark:text-gray-300'>{page.qrTypesGrid.wifi}</p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className='mt-12'>
                    <h2 className='text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100'>{page.faq}</h2>
                    <div className='space-y-6'>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.faqList.q1}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a1}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.faqList.q2}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a2}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.faqList.q3}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a3}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.faqList.q4}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a4}</p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6'>
                            <h3 className='font-semibold mb-2 text-gray-900 dark:text-gray-100'>{page.faqList.q5}</h3>
                            <p className='text-gray-700 dark:text-gray-300'>{page.faqList.a5}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
