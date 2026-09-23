"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { invoiceGeneratorTranslations } from "@/lib/i18n/tools/invoice-generator";
import { toast } from "@/components/ui/Toast";

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

export default function InvoiceGeneratorContent() {
    const { locale } = useLanguage();
    const t = invoiceGeneratorTranslations[locale as "en" | "vi"] || invoiceGeneratorTranslations.en;

    // Sender Info
    const [companyName, setCompanyName] = useState<string>("AnyTools Media Ltd.");
    const [companyEmail, setCompanyEmail] = useState<string>("billing@anytools.online");
    const [companyPhone, setCompanyPhone] = useState<string>("+84 901 234 567");
    const [companyAddress, setCompanyAddress] = useState<string>("123 Tech Park, Hanoi, Vietnam");
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    // Client Info
    const [clientName, setClientName] = useState<string>("Acme Corporation");
    const [clientEmail, setClientEmail] = useState<string>("contact@acme.corp");
    const [clientAddress, setClientAddress] = useState<string>("456 Market St, Suite 100, San Francisco, CA");

    // Invoice Meta
    const [invoiceNumber, setInvoiceNumber] = useState<string>("INV-2026-0042");
    const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [dueDate, setDueDate] = useState<string>(
        new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
    );
    const [currency, setCurrency] = useState<string>("USD");

    // Items
    const [items, setItems] = useState<InvoiceItem[]>([
        { id: "1", description: "UI/UX Website Redesign & Frontend Development", quantity: 1, price: 1200 },
        { id: "2", description: "Cloud Infrastructure Setup & Optimization", quantity: 10, price: 50 },
        { id: "3", description: "SEO & Performance Speed Audit", quantity: 1, price: 300 },
    ]);

    // Financials
    const [taxRate, setTaxRate] = useState<number>(8); // 8% VAT
    const [discount, setDiscount] = useState<number>(0);
    const [notes, setNotes] = useState<string>(t.notesPlaceholder);

    const printAreaRef = useRef<HTMLDivElement | null>(null);

    // Currency Formatter
    const formatCurrency = useCallback((amount: number) => {
        if (currency === "VND") {
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
        }
        if (currency === "EUR") {
            return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
        }
        if (currency === "GBP") {
            return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount);
        }
        if (currency === "JPY") {
            return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(amount);
        }
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    }, [currency]);

    // Item Actions
    const addItem = () => {
        setItems([
            ...items,
            { id: Date.now().toString(), description: "", quantity: 1, price: 0 },
        ]);
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
        setItems(
            items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const deleteItem = (id: string) => {
        if (items.length <= 1) return;
        setItems(items.filter((item) => item.id !== id));
    };

    // Calculate Totals
    const { subtotal, taxAmount, grandTotal } = useMemo(() => {
        const sub = items.reduce((acc, it) => acc + (it.quantity || 0) * (it.price || 0), 0);
        const tax = sub * (Math.max(0, taxRate) / 100);
        const total = Math.max(0, sub + tax - Math.max(0, discount));
        return { subtotal: sub, taxAmount: tax, grandTotal: total };
    }, [items, taxRate, discount]);

    // Handle Logo Upload
    const handleLogoUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setLogoUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Print & Download PDF
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-6xl mx-auto space-y-6'>
            {/* Action Bar */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-wrap items-center justify-between gap-4'>
                <div className='flex items-center gap-2'>
                    <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                        🧾 {t.name}
                    </span>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className='px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer'
                    >
                        <option value='USD'>USD ($)</option>
                        <option value='VND'>VND (₫)</option>
                        <option value='EUR'>EUR (€)</option>
                        <option value='GBP'>GBP (£)</option>
                        <option value='JPY'>JPY (¥)</option>
                    </select>
                </div>

                <div className='flex items-center gap-3'>
                    <Button
                        onClick={handlePrint}
                        variant='primary'
                        size='sm'
                        className='h-10 px-5 rounded-xl text-xs font-bold cursor-pointer shadow-md'
                    >
                        🖨️ {t.printInvoice} / PDF
                    </Button>
                </div>
            </div>

            {/* Two-Column Editor & Live Invoice Preview */}
            <div className='w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start'>
                {/* Editor Column (Left) */}
                <div className='xl:col-span-5 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-5'>
                    {/* Sender Form */}
                    <div className='space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800'>
                        <h4 className='text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center justify-between'>
                            <span>🏢 {t.senderTitle}</span>
                            <label className='text-blue-600 hover:text-blue-700 text-xs cursor-pointer font-semibold'>
                                {t.uploadLogo}
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                                    className='hidden'
                                />
                            </label>
                        </h4>
                        <input
                            type='text'
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder={t.companyName}
                            className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-900 dark:text-white'
                        />
                        <div className='grid grid-cols-2 gap-2'>
                            <input
                                type='email'
                                value={companyEmail}
                                onChange={(e) => setCompanyEmail(e.target.value)}
                                placeholder={t.companyEmail}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs'
                            />
                            <input
                                type='text'
                                value={companyPhone}
                                onChange={(e) => setCompanyPhone(e.target.value)}
                                placeholder={t.companyPhone}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs'
                            />
                        </div>
                        <input
                            type='text'
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                            placeholder={t.companyAddress}
                            className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs'
                        />
                    </div>

                    {/* Recipient Form */}
                    <div className='space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800'>
                        <h4 className='text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider'>
                            👤 {t.recipientTitle}
                        </h4>
                        <input
                            type='text'
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder={t.clientName}
                            className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-900 dark:text-white'
                        />
                        <input
                            type='email'
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder={t.clientEmail}
                            className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs'
                        />
                        <input
                            type='text'
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                            placeholder={t.clientAddress}
                            className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs'
                        />
                    </div>

                    {/* Invoice Meta Dates */}
                    <div className='space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800'>
                        <h4 className='text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider'>
                            🗓️ {t.invoiceDetails}
                        </h4>
                        <div className='grid grid-cols-3 gap-2'>
                            <div>
                                <label className='block text-[11px] font-semibold text-gray-500 mb-1'>{t.invoiceNumber}</label>
                                <input
                                    type='text'
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                    className='w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-mono font-bold'
                                />
                            </div>
                            <div>
                                <label className='block text-[11px] font-semibold text-gray-500 mb-1'>{t.issueDate}</label>
                                <input
                                    type='date'
                                    value={issueDate}
                                    onChange={(e) => setIssueDate(e.target.value)}
                                    className='w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium'
                                />
                            </div>
                            <div>
                                <label className='block text-[11px] font-semibold text-gray-500 mb-1'>{t.dueDate}</label>
                                <input
                                    type='date'
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className='w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tax & Discount */}
                    <div className='grid grid-cols-2 gap-3 pb-4 border-b border-gray-100 dark:border-gray-800'>
                        <div>
                            <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1'>
                                {t.taxRate}
                            </label>
                            <input
                                type='number'
                                min='0'
                                max='100'
                                value={taxRate}
                                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold'
                            />
                        </div>
                        <div>
                            <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1'>
                                {t.discount} ({currency})
                            </label>
                            <input
                                type='number'
                                min='0'
                                value={discount}
                                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-semibold'
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className='block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1'>
                            📝 {t.notesTitle}
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className='w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs leading-relaxed'
                        />
                    </div>
                </div>

                {/* Printable A4 Paper Invoice Sheet (Right Column) */}
                <div
                    ref={printAreaRef}
                    className='xl:col-span-7 bg-white text-gray-900 p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl space-y-8 select-none print:m-0 print:p-0 print:border-none print:shadow-none print:w-full'
                >
                    {/* Header: Company & Invoice Label */}
                    <div className='flex items-start justify-between gap-6 border-b border-gray-200 pb-6'>
                        <div className='flex items-start gap-4'>
                            {logoUrl && (
                                <img
                                    src={logoUrl}
                                    alt='Logo'
                                    className='w-16 h-16 object-contain rounded-xl border border-gray-100 p-1'
                                />
                            )}
                            <div>
                                <h2 className='text-xl sm:text-2xl font-black text-gray-900 tracking-tight'>
                                    {companyName || "Company Name"}
                                </h2>
                                <p className='text-xs text-gray-500 mt-1'>{companyAddress}</p>
                                <p className='text-xs text-gray-500'>
                                    {companyEmail} {companyPhone && `• ${companyPhone}`}
                                </p>
                            </div>
                        </div>

                        <div className='text-right'>
                            <h1 className='text-2xl sm:text-3xl font-black tracking-widest text-blue-600 uppercase font-mono'>
                                INVOICE
                            </h1>
                            <div className='text-xs font-mono font-bold text-gray-700 mt-1'>
                                #{invoiceNumber}
                            </div>
                        </div>
                    </div>

                    {/* Meta: Billed To & Dates */}
                    <div className='grid grid-cols-2 gap-6 text-xs'>
                        <div>
                            <span className='font-bold uppercase tracking-wider text-gray-400 block mb-1'>
                                {t.recipientTitle}:
                            </span>
                            <div className='font-bold text-sm text-gray-900'>{clientName || "Client Name"}</div>
                            <div className='text-gray-500'>{clientAddress}</div>
                            <div className='text-gray-500'>{clientEmail}</div>
                        </div>

                        <div className='text-right space-y-1'>
                            <div>
                                <span className='text-gray-400 font-medium'>{t.issueDate}: </span>
                                <span className='font-bold text-gray-800 font-mono'>{issueDate}</span>
                            </div>
                            <div>
                                <span className='text-gray-400 font-medium'>{t.dueDate}: </span>
                                <span className='font-bold text-gray-800 font-mono'>{dueDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Table of Items */}
                    <div className='space-y-2'>
                        <table className='w-full text-xs text-left'>
                            <thead>
                                <tr className='border-b-2 border-gray-900 text-gray-900 font-black uppercase tracking-wider'>
                                    <th className='py-2.5 flex-1'>{t.itemDesc}</th>
                                    <th className='py-2.5 w-16 text-center'>{t.itemQty}</th>
                                    <th className='py-2.5 w-24 text-right'>{t.itemPrice}</th>
                                    <th className='py-2.5 w-28 text-right'>{t.itemTotal}</th>
                                    <th className='py-2.5 w-8 print:hidden'></th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {items.map((item) => (
                                    <tr key={item.id} className='group hover:bg-gray-50/50'>
                                        <td className='py-2.5 pr-2'>
                                            <input
                                                type='text'
                                                value={item.description}
                                                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                                placeholder='Service or product item...'
                                                className='w-full font-medium text-gray-900 bg-transparent focus:outline-hidden'
                                            />
                                        </td>
                                        <td className='py-2.5 text-center'>
                                            <input
                                                type='number'
                                                min='1'
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                                                className='w-14 text-center font-mono font-semibold bg-transparent focus:outline-hidden'
                                            />
                                        </td>
                                        <td className='py-2.5 text-right'>
                                            <input
                                                type='number'
                                                min='0'
                                                value={item.price}
                                                onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                                                className='w-20 text-right font-mono font-semibold bg-transparent focus:outline-hidden'
                                            />
                                        </td>
                                        <td className='py-2.5 text-right font-mono font-bold text-gray-900'>
                                            {formatCurrency(item.quantity * item.price)}
                                        </td>
                                        <td className='py-2.5 text-right print:hidden'>
                                            {items.length > 1 && (
                                                <button
                                                    onClick={() => deleteItem(item.id)}
                                                    className='text-gray-300 hover:text-red-500 font-bold px-1 cursor-pointer'
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button
                            onClick={addItem}
                            className='text-xs font-bold text-blue-600 hover:text-blue-700 py-1.5 cursor-pointer print:hidden flex items-center gap-1'
                        >
                            {t.addItem}
                        </button>
                    </div>

                    {/* Summary Totals */}
                    <div className='flex justify-end pt-4 border-t border-gray-200'>
                        <div className='w-64 space-y-2 text-xs'>
                            <div className='flex justify-between text-gray-600'>
                                <span>{t.subtotal}:</span>
                                <span className='font-mono font-semibold'>{formatCurrency(subtotal)}</span>
                            </div>
                            {taxRate > 0 && (
                                <div className='flex justify-between text-gray-600'>
                                    <span>{t.taxRate} ({taxRate}%):</span>
                                    <span className='font-mono font-semibold'>{formatCurrency(taxAmount)}</span>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className='flex justify-between text-red-600'>
                                    <span>{t.discount}:</span>
                                    <span className='font-mono font-semibold'>-{formatCurrency(discount)}</span>
                                </div>
                            )}
                            <div className='flex justify-between text-base font-black text-gray-900 pt-2 border-t-2 border-gray-900'>
                                <span>{t.grandTotal}:</span>
                                <span className='font-mono text-blue-600'>{formatCurrency(grandTotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes Footer */}
                    {notes && (
                        <div className='pt-6 border-t border-gray-100 text-xs text-gray-500 whitespace-pre-wrap leading-relaxed'>
                            <span className='font-bold text-gray-700 block mb-1'>{t.notesTitle}:</span>
                            {notes}
                        </div>
                    )}
                </div>
            </div>

            {/* Guide & Knowledge */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300 print:hidden'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                    <span>💡</span> {t.guideTitle}
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm'>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>1. {t.guide1Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide1Desc}</p>
                    </div>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>2. {t.guide2Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide2Desc}</p>
                    </div>
                    <div className='p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800'>
                        <h4 className='font-bold text-gray-900 dark:text-white mb-1.5'>3. {t.guide3Title}</h4>
                        <p className='text-gray-500 dark:text-gray-400 leading-relaxed'>{t.guide3Desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
