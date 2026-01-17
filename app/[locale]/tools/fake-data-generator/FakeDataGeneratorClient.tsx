"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getTranslation } from "@/lib/i18n";
import Button from "@/components/ui/Button";
import { faker } from "@faker-js/faker";

type DataType = "lorem" | "users" | "addresses" | "contacts" | "dates" | "uuids" | "numbers" | "companies";

export default function FakeDataGeneratorClient() {
    const { locale } = useLanguage();
    const t = getTranslation(locale);
    
    const [dataType, setDataType] = useState<DataType>("lorem");
    const [count, setCount] = useState(5);
    const [output, setOutput] = useState("");
    const [exportFormat, setExportFormat] = useState<"text" | "json" | "csv">("text");

    const generateLoremIpsum = () => {
        const paragraphs = faker.lorem.paragraphs(count);
        return paragraphs;
    };

    const generateUsers = () => {
        const users = Array.from({ length: count }, () => ({
            id: faker.string.uuid(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            username: faker.internet.username(),
            avatar: faker.image.avatar(),
            birthDate: faker.date.birthdate().toISOString().split('T')[0],
        }));
        return users;
    };

    const generateAddresses = () => {
        const addresses = Array.from({ length: count }, () => ({
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country(),
        }));
        return addresses;
    };

    const generateContacts = () => {
        const contacts = Array.from({ length: count }, () => ({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            company: faker.company.name(),
        }));
        return contacts;
    };

    const generateDates = () => {
        const dates = Array.from({ length: count }, () => ({
            past: faker.date.past().toISOString(),
            future: faker.date.future().toISOString(),
            recent: faker.date.recent().toISOString(),
        }));
        return dates;
    };

    const generateUUIDs = () => {
        return Array.from({ length: count }, () => faker.string.uuid());
    };

    const generateNumbers = () => {
        return Array.from({ length: count }, () => ({
            integer: faker.number.int({ min: 1, max: 1000 }),
            float: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
            bigInt: faker.number.int({ min: 100000, max: 999999 }),
        }));
    };

    const generateCompanies = () => {
        return Array.from({ length: count }, () => ({
            name: faker.company.name(),
            catchPhrase: faker.company.catchPhrase(),
            bs: faker.company.buzzPhrase(),
            industry: faker.company.buzzNoun(),
        }));
    };

    const handleGenerate = () => {
        let data: any;

        switch (dataType) {
            case "lorem":
                data = generateLoremIpsum();
                break;
            case "users":
                data = generateUsers();
                break;
            case "addresses":
                data = generateAddresses();
                break;
            case "contacts":
                data = generateContacts();
                break;
            case "dates":
                data = generateDates();
                break;
            case "uuids":
                data = generateUUIDs();
                break;
            case "numbers":
                data = generateNumbers();
                break;
            case "companies":
                data = generateCompanies();
                break;
        }

        // Format output based on export format
        let formattedOutput = "";

        if (exportFormat === "json") {
            formattedOutput = JSON.stringify(data, null, 2);
        } else if (exportFormat === "csv" && typeof data !== "string") {
            // Convert to CSV
            if (Array.isArray(data)) {
                if (data.length > 0 && typeof data[0] === "object") {
                    const headers = Object.keys(data[0]);
                    const csvRows = [headers.join(",")];
                    data.forEach((item) => {
                        const values = headers.map(header => {
                            const value = item[header];
                            return typeof value === "string" && value.includes(",") 
                                ? `"${value}"` 
                                : value;
                        });
                        csvRows.push(values.join(","));
                    });
                    formattedOutput = csvRows.join("\n");
                } else {
                    formattedOutput = data.join("\n");
                }
            }
        } else {
            // Text format
            if (typeof data === "string") {
                formattedOutput = data;
            } else if (Array.isArray(data)) {
                if (typeof data[0] === "object") {
                    formattedOutput = data.map(item => JSON.stringify(item, null, 2)).join("\n\n");
                } else {
                    formattedOutput = data.join("\n");
                }
            }
        }

        setOutput(formattedOutput);
    };

    const handleDownload = () => {
        if (!output) return;

        let filename = "";
        let mimeType = "";

        switch (exportFormat) {
            case "json":
                filename = `fake-data-${dataType}.json`;
                mimeType = "application/json";
                break;
            case "csv":
                filename = `fake-data-${dataType}.csv`;
                mimeType = "text/csv";
                break;
            default:
                filename = `fake-data-${dataType}.txt`;
                mimeType = "text/plain";
        }

        const blob = new Blob([output], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output).then(
            () => alert(t.common.copied),
            () => alert(t.common.failedToCopy)
        );
    };

    const clearAll = () => {
        setOutput("");
    };

    return (
        <div className='space-y-6'>
            {/* Data Type Selection */}
            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
                    {t.tools.fakeDataGenerator.selectDataType}
                </h2>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'>
                    {(['lorem', 'users', 'addresses', 'contacts', 'dates', 'uuids', 'numbers', 'companies'] as DataType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setDataType(type)}
                            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                dataType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {t.tools.fakeDataGenerator.dataTypes[type]}
                        </button>
                    ))}
                </div>

                {/* Count Slider */}
                {dataType !== "lorem" && (
                    <div className='mb-6'>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                            {t.tools.fakeDataGenerator.count}: {count}
                        </label>
                        <input
                            type='range'
                            min='1'
                            max='50'
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value))}
                            className='w-full'
                        />
                    </div>
                )}

                {dataType === "lorem" && (
                    <div className='mb-6'>
                        <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                            {t.tools.fakeDataGenerator.paragraphs}: {count}
                        </label>
                        <input
                            type='range'
                            min='1'
                            max='20'
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value))}
                            className='w-full'
                        />
                    </div>
                )}

                {/* Export Format */}
                <div className='mb-6'>
                    <label className='block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100'>
                        {t.tools.fakeDataGenerator.exportFormat}
                    </label>
                    <div className='flex gap-4'>
                        {(['text', 'json', 'csv'] as const).map((format) => (
                            <label key={format} className='flex items-center cursor-pointer'>
                                <input
                                    type='radio'
                                    name='format'
                                    value={format}
                                    checked={exportFormat === format}
                                    onChange={() => setExportFormat(format)}
                                    className='mr-2'
                                />
                                <span className='text-gray-900 dark:text-gray-100'>{format.toUpperCase()}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                    <Button onClick={handleGenerate} variant='primary'>
                        {t.tools.fakeDataGenerator.generate}
                    </Button>
                    <Button onClick={clearAll} variant='gray'>
                        {t.common.clear}
                    </Button>
                </div>
            </div>

            {/* Output Section */}
            {output && (
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700'>
                    <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100'>
                        {t.tools.fakeDataGenerator.output}
                    </h2>

                    <textarea
                        value={output}
                        readOnly
                        className='w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                    />

                    <div className='flex flex-wrap gap-2 mt-4'>
                        <Button onClick={copyToClipboard} variant='dark'>
                            {t.common.copy}
                        </Button>
                        <Button onClick={handleDownload} variant='success'>
                            {t.tools.fakeDataGenerator.download}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
