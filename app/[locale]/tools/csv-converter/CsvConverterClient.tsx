"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Button from "@/components/ui/Button";
import Papa from "papaparse";

interface CsvData {
    headers: string[];
    rows: string[][];
}

export default function CsvConverterClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [csvData, setCsvData] = useState<CsvData | null>(null);
    const [rawInput, setRawInput] = useState("");
    const [error, setError] = useState("");
    const [format, setFormat] = useState<"csv" | "json">("csv");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            parseCSV(text);
        };
        reader.onerror = () => {
            setError("Error reading file");
        };
        reader.readAsText(file);
    };

    const parseCSV = (text: string) => {
        try {
            const result = Papa.parse(text, {
                skipEmptyLines: true,
            });

            if (result.errors.length > 0) {
                setError(`CSV parse error: ${result.errors[0].message}`);
                setCsvData(null);
                return;
            }

            const data = result.data as string[][];
            if (data.length === 0) {
                setError("CSV file is empty");
                setCsvData(null);
                return;
            }

            const headers = data[0];
            const rows = data.slice(1);

            setCsvData({ headers, rows });
            setError("");
        } catch (e) {
            setError("Invalid CSV format");
            setCsvData(null);
        }
    };

    const handlePaste = () => {
        if (!rawInput.trim()) {
            setError("Please enter CSV data");
            return;
        }
        parseCSV(rawInput);
    };

    const convertToJSON = () => {
        if (!csvData) return "";

        const jsonData = csvData.rows.map((row) => {
            const obj: Record<string, string> = {};
            csvData.headers.forEach((header, index) => {
                obj[header] = row[index] || "";
            });
            return obj;
        });

        return JSON.stringify(jsonData, null, 2);
    };

    const convertToCSV = () => {
        if (!csvData) return "";

        const csv = Papa.unparse({
            fields: csvData.headers,
            data: csvData.rows,
        });

        return csv;
    };

    const handleDownload = () => {
        if (!csvData) return;

        let content = "";
        let filename = "";
        let mimeType = "";

        if (format === "json") {
            content = convertToJSON();
            filename = "data.json";
            mimeType = "application/json";
        } else {
            content = convertToCSV();
            filename = "data.csv";
            mimeType = "text/csv";
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        if (!csvData) return;

        const content = format === "json" ? convertToJSON() : convertToCSV();

        navigator.clipboard.writeText(content).then(
            () => alert(t.common.copied),
            () => alert(t.common.failedToCopy)
        );
    };

    const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
        if (!csvData) return;

        const newRows = [...csvData.rows];
        newRows[rowIndex] = [...newRows[rowIndex]];
        newRows[rowIndex][colIndex] = value;

        setCsvData({ ...csvData, rows: newRows });
    };

    const handleHeaderEdit = (index: number, value: string) => {
        if (!csvData) return;

        const newHeaders = [...csvData.headers];
        newHeaders[index] = value;

        setCsvData({ ...csvData, headers: newHeaders });
    };

    const clearAll = () => {
        setCsvData(null);
        setRawInput("");
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className='space-y-6'>
            {/* Input Section */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
                    {t.tools.csvConverter.input}
                </h2>

                {/* File Upload */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                        {t.tools.csvConverter.uploadFile}
                    </label>
                    <input
                        type='file'
                        accept='.csv,.txt'
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                        className='block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none'
                    />
                </div>

                {/* Paste Area */}
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                        {t.tools.csvConverter.orPaste}
                    </label>
                    <textarea
                        value={rawInput}
                        onChange={(e) => setRawInput(e.target.value)}
                        placeholder={t.tools.csvConverter.pasteHere}
                        className='w-full h-32 p-4 border rounded-lg font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    />
                </div>

                <div className='flex flex-wrap gap-2'>
                    <Button onClick={handlePaste} variant='primary'>
                        {t.tools.csvConverter.parseCSV}
                    </Button>
                    <Button onClick={clearAll} variant='gray'>
                        {t.common.clear}
                    </Button>
                </div>

                {error && (
                    <div className='mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm'>
                        {error}
                    </div>
                )}
            </div>

            {/* Table View */}
            {csvData && (
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                    <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
                        {t.tools.csvConverter.tableView}
                    </h2>

                    <div className='overflow-x-auto mb-4'>
                        <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-600'>
                            <thead>
                                <tr className='bg-gray-100 dark:bg-gray-700'>
                                    {csvData.headers.map((header, index) => (
                                        <th key={index} className='border border-gray-300 dark:border-gray-600 p-2'>
                                            <input
                                                type='text'
                                                value={header}
                                                onChange={(e) => handleHeaderEdit(index, e.target.value)}
                                                className='w-full px-2 py-1 bg-transparent font-semibold text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded'
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {csvData.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <td key={colIndex} className='border border-gray-300 dark:border-gray-600 p-2'>
                                                <input
                                                    type='text'
                                                    value={cell}
                                                    onChange={(e) => handleCellEdit(rowIndex, colIndex, e.target.value)}
                                                    className='w-full px-2 py-1 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded'
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                        {t.tools.csvConverter.rowCount}: {csvData.rows.length} | {t.tools.csvConverter.columnCount}: {csvData.headers.length}
                    </div>

                    {/* Export Options */}
                    <div>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                            {t.tools.csvConverter.exportFormat}
                        </label>
                        <div className='flex flex-wrap gap-4 mb-4'>
                            <label className='flex items-center cursor-pointer'>
                                <input
                                    type='radio'
                                    name='format'
                                    value='csv'
                                    checked={format === "csv"}
                                    onChange={() => setFormat("csv")}
                                    className='mr-2'
                                />
                                <span className='text-gray-900 dark:text-gray-100'>CSV</span>
                            </label>
                            <label className='flex items-center cursor-pointer'>
                                <input
                                    type='radio'
                                    name='format'
                                    value='json'
                                    checked={format === "json"}
                                    onChange={() => setFormat("json")}
                                    className='mr-2'
                                />
                                <span className='text-gray-900 dark:text-gray-100'>JSON</span>
                            </label>
                        </div>

                        <div className='flex flex-wrap gap-2'>
                            <Button onClick={handleDownload} variant='success'>
                                {t.tools.csvConverter.download} ({format.toUpperCase()})
                            </Button>
                            <Button onClick={handleCopy} variant='dark'>
                                {t.common.copy}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
