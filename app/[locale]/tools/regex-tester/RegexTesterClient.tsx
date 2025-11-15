"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { regexTesterTranslations } from "@/lib/i18n/tools/regex-tester";
import Button from "@/components/ui/Button";

interface CommonPattern {
    name: string;
    pattern: string;
    example: string;
    description: string;
    category: string;
}

interface RegexFlavor {
    language: string;
    description: string;
    differences: string[];
}

interface MatchResult {
    line: number;
    text: string;
    matched: boolean;
}

const commonPatterns: CommonPattern[] = [
    { name: "Email Address", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", example: "user@example.com", description: "Standard email validation", category: "Validation" },
    { name: "URL/Website", pattern: "https?://([\\w\\-]+\\.)+[\\w\\-]+(/[\\w\\-\\./?%&=]*)?", example: "https://example.com/path", description: "Match HTTP/HTTPS URLs", category: "Web" },
    { name: "Phone (US)", pattern: "^\\+?1?\\s*\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$", example: "(123) 456-7890", description: "US phone number format", category: "Validation" },
    { name: "Phone (International)", pattern: "^\\+?[1-9]\\d{1,14}$", example: "+1234567890", description: "E.164 international format", category: "Validation" },
    { name: "IPv4 Address", pattern: "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$", example: "192.168.1.1", description: "Valid IPv4 address", category: "Network" },
    { name: "IPv6 Address", pattern: "^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$", example: "2001:0db8:85a3:0000:0000:8a2e:0370:7334", description: "Full IPv6 address", category: "Network" },
    { name: "Date (YYYY-MM-DD)", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", example: "2025-11-15", description: "ISO date format", category: "Date/Time" },
    { name: "Date (DD/MM/YYYY)", pattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$", example: "15/11/2025", description: "European date format", category: "Date/Time" },
    { name: "Date (MM/DD/YYYY)", pattern: "^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\\d{4}$", example: "11/15/2025", description: "US date format", category: "Date/Time" },
    { name: "Time (24-hour)", pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$", example: "14:30:00", description: "24-hour time format", category: "Date/Time" },
    { name: "Time (12-hour)", pattern: "^(0?[1-9]|1[0-2]):[0-5][0-9]\\s?(AM|PM|am|pm)$", example: "2:30 PM", description: "12-hour time with AM/PM", category: "Date/Time" },
    { name: "Hex Color", pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$", example: "#FF5733 or #F57", description: "CSS hex color code", category: "Web" },
    { name: "RGB Color", pattern: "^rgb\\(\\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\s*,\\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\s*,\\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\s*\\)$", example: "rgb(255, 87, 51)", description: "CSS RGB color", category: "Web" },
    { name: "Username", pattern: "^[a-zA-Z0-9_-]{3,16}$", example: "user_name-123", description: "Alphanumeric username 3-16 chars", category: "Validation" },
    { name: "Strong Password", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", example: "Pass123!word", description: "Min 8 chars, uppercase, lowercase, digit, special", category: "Security" },
    { name: "Credit Card (Visa)", pattern: "^4[0-9]{12}(?:[0-9]{3})?$", example: "4111111111111111", description: "Visa card number", category: "Finance" },
    { name: "Credit Card (Mastercard)", pattern: "^5[1-5][0-9]{14}$", example: "5500000000000004", description: "Mastercard number", category: "Finance" },
    { name: "SSN (US)", pattern: "^\\d{3}-\\d{2}-\\d{4}$", example: "123-45-6789", description: "US Social Security Number", category: "Validation" },
    { name: "ZIP Code (US)", pattern: "^\\d{5}(-\\d{4})?$", example: "12345 or 12345-6789", description: "US ZIP code", category: "Address" },
    { name: "Postal Code (UK)", pattern: "^[A-Z]{1,2}\\d[A-Z\\d]?\\s?\\d[A-Z]{2}$", example: "SW1A 1AA", description: "UK postcode", category: "Address" },
    { name: "MAC Address", pattern: "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$", example: "00:1B:44:11:3A:B7", description: "Network MAC address", category: "Network" },
    { name: "HTML Tag", pattern: "<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)", example: "<div>content</div>", description: "Match HTML tags", category: "Web" },
    { name: "Slug/URL Path", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", example: "my-awesome-post", description: "URL-friendly slug", category: "Web" },
    { name: "Integer Number", pattern: "^-?\\d+$", example: "-123 or 456", description: "Positive or negative integer", category: "Numbers" },
    { name: "Decimal Number", pattern: "^-?\\d+\\.\\d+$", example: "123.45 or -67.89", description: "Decimal with fraction", category: "Numbers" },
    { name: "Currency (USD)", pattern: "^\\$?[0-9]{1,3}(,[0-9]{3})*\\.?[0-9]{0,2}$", example: "$1,234.56", description: "US dollar amount", category: "Finance" },
    { name: "File Extension", pattern: "\\.[a-zA-Z0-9]+$", example: ".jpg, .pdf, .txt", description: "Extract file extension", category: "Files" },
    { name: "Git Repository", pattern: "((git|ssh|http(s)?)|(git@[\\w\\.]+))(:(//)?)([\\w\\.@\\:/\\-~]+)(\\.git)(/)?", example: "https://github.com/user/repo.git", description: "Git repository URL", category: "Development" },
    { name: "Semantic Version", pattern: "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$", example: "1.2.3 or 1.0.0-alpha+001", description: "Semver format", category: "Development" },
    { name: "UUID v4", pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", example: "123e4567-e89b-42d3-a456-426614174000", description: "UUID version 4", category: "Development" },
    { name: "JWT Token", pattern: "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_.+/]*$", example: "eyJhbGc...eyJzdWI...SflKxwRJ", description: "JSON Web Token", category: "Security" },
];

export default function RegexTesterClient() {
    const { locale } = useLanguage();
    const t = regexTesterTranslations[locale];
    const ui = t.regexTester.ui;

    // Get translated regex flavors
    const getRegexFlavors = (): RegexFlavor[] => {
        return [
            { language: "JavaScript", description: ui.regexFlavors.javascript.description, differences: ui.regexFlavors.javascript.differences },
            { language: "Python", description: ui.regexFlavors.python.description, differences: ui.regexFlavors.python.differences },
            { language: "Java", description: ui.regexFlavors.java.description, differences: ui.regexFlavors.java.differences },
            { language: "PHP (PCRE)", description: ui.regexFlavors.php.description, differences: ui.regexFlavors.php.differences },
            { language: "C# (.NET)", description: ui.regexFlavors.csharp.description, differences: ui.regexFlavors.csharp.differences },
            { language: "Ruby", description: ui.regexFlavors.ruby.description, differences: ui.regexFlavors.ruby.differences },
            { language: "Go", description: ui.regexFlavors.go.description, differences: ui.regexFlavors.go.differences },
            { language: "Perl", description: ui.regexFlavors.perl.description, differences: ui.regexFlavors.perl.differences },
        ];
    };

    const regexFlavors = getRegexFlavors();

    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState("g");
    const [testString, setTestString] = useState("");
    const [results, setResults] = useState<MatchResult[]>([]);
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedFlavor, setSelectedFlavor] = useState<string>("JavaScript");

    // Get translated common patterns
    const getCommonPatterns = (): CommonPattern[] => {
        const patternKeys = [
            { key: "emailAddress", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", example: "user@example.com", category: "Validation" },
            { key: "urlWebsite", pattern: "https?://([\\w\\-]+\\.)+[\\w\\-]+(/[\\w\\-\\./?%&=]*)?", example: "https://example.com/path", category: "Web" },
            { key: "phoneUS", pattern: "^\\+?1?\\s*\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$", example: "(123) 456-7890", category: "Validation" },
            { key: "phoneVN", pattern: "^(\\+84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$", example: "0901234567 or +84901234567", category: "Validation" },
            { key: "phoneInternational", pattern: "^\\+?[1-9]\\d{1,14}$", example: "+1234567890", category: "Validation" },
            { key: "ipv4", pattern: "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$", example: "192.168.1.1", category: "Network" },
            { key: "ipv6", pattern: "^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$", example: "2001:0db8:85a3:0000:0000:8a2e:0370:7334", category: "Network" },
            { key: "dateYMD", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", example: "2025-11-15", category: "Date/Time" },
            { key: "dateDMY", pattern: "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$", example: "15/11/2025", category: "Date/Time" },
            { key: "dateMDY", pattern: "^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\\d{4}$", example: "11/15/2025", category: "Date/Time" },
            { key: "time24", pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$", example: "14:30:00", category: "Date/Time" },
            { key: "time12", pattern: "^(0?[1-9]|1[0-2]):[0-5][0-9]\\s?(AM|PM|am|pm)$", example: "2:30 PM", category: "Date/Time" },
            { key: "hexColor", pattern: "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$", example: "#FF5733 or #F57", category: "Web" },
            { key: "rgbColor", pattern: "^rgb\\(\\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\s*,\\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\s*,\\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\s*\\)$", example: "rgb(255, 87, 51)", category: "Web" },
            { key: "username", pattern: "^[a-zA-Z0-9_-]{3,16}$", example: "user_name-123", category: "Validation" },
            { key: "strongPassword", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", example: "Pass123!word", category: "Security" },
            { key: "creditCardVisa", pattern: "^4[0-9]{12}(?:[0-9]{3})?$", example: "4111111111111111", category: "Finance" },
            { key: "creditCardMastercard", pattern: "^5[1-5][0-9]{14}$", example: "5500000000000004", category: "Finance" },
            { key: "ssnUS", pattern: "^\\d{3}-\\d{2}-\\d{4}$", example: "123-45-6789", category: "Validation" },
            { key: "zipCodeUS", pattern: "^\\d{5}(-\\d{4})?$", example: "12345 or 12345-6789", category: "Address" },
            { key: "postalCodeUK", pattern: "^[A-Z]{1,2}\\d[A-Z\\d]?\\s?\\d[A-Z]{2}$", example: "SW1A 1AA", category: "Address" },
            { key: "macAddress", pattern: "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$", example: "00:1B:44:11:3A:B7", category: "Network" },
            { key: "htmlTag", pattern: "<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)", example: "<div>content</div>", category: "Web" },
            { key: "slug", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", example: "my-awesome-post", category: "Web" },
            { key: "integerNumber", pattern: "^-?\\d+$", example: "-123 or 456", category: "Numbers" },
            { key: "decimalNumber", pattern: "^-?\\d+\\.\\d+$", example: "123.45 or -67.89", category: "Numbers" },
            { key: "currencyUSD", pattern: "^\\$?[0-9]{1,3}(,[0-9]{3})*\\.?[0-9]{0,2}$", example: "$1,234.56", category: "Finance" },
            { key: "fileExtension", pattern: "\\.[a-zA-Z0-9]+$", example: ".jpg, .pdf, .txt", category: "Files" },
            { key: "gitRepository", pattern: "((git|ssh|http(s)?)|(git@[\\w\\.]+))(:(//)?)([\\w\\.@\\:/\\-~]+)(\\.git)(/)?", example: "https://github.com/user/repo.git", category: "Development" },
            { key: "semanticVersion", pattern: "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$", example: "1.2.3 or 1.0.0-alpha+001", category: "Development" },
            { key: "uuidV4", pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", example: "123e4567-e89b-42d3-a456-426614174000", category: "Development" },
            { key: "jwtToken", pattern: "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_.+/]*$", example: "eyJhbGc...eyJzdWI...SflKxwRJ", category: "Security" },
        ];

        return patternKeys.map(({ key, pattern, example, category }) => {
            const translation = ui.patterns[key as keyof typeof ui.patterns];
            return {
                name: translation.name,
                pattern,
                example,
                description: translation.description,
                category,
            };
        });
    };

    const commonPatterns = getCommonPatterns();

    const categories = ["All", ...Array.from(new Set(commonPatterns.map((p) => p.category)))];

    const filteredPatterns = selectedCategory === "All" ? commonPatterns : commonPatterns.filter((p) => p.category === selectedCategory);

    // Map category names to translations
    const getCategoryLabel = (cat: string) => {
        const categoryMap: { [key: string]: string } = {
            All: ui.categories.all,
            Validation: ui.categories.validation,
            Web: ui.categories.web,
            Network: ui.categories.network,
            "Date/Time": ui.categories.dateTime,
            Finance: ui.categories.finance,
            Security: ui.categories.security,
            Address: ui.categories.address,
            Numbers: ui.categories.numbers,
            Development: ui.categories.development,
            Files: ui.categories.files,
        };
        return categoryMap[cat] || cat;
    };

    const testRegex = () => {
        try {
            setError("");
            const regex = new RegExp(pattern, flags);
            const lines = testString.split("\n");

            const matchResults: MatchResult[] = lines.map((line, index) => {
                const matched = regex.test(line);
                // Reset regex lastIndex if using 'g' flag
                regex.lastIndex = 0;
                return {
                    line: index + 1,
                    text: line,
                    matched,
                };
            });

            setResults(matchResults);
        } catch (err) {
            setError("Invalid regular expression: " + (err as Error).message);
            setResults([]);
        }
    };

    const loadPattern = (p: CommonPattern) => {
        setPattern(p.pattern);
        setTestString(p.example);
        setFlags("g");
    };

    const matchedCount = results.filter((r) => r.matched).length;
    const unmatchedCount = results.filter((r) => !r.matched).length;

    // Auto re-test when flags change (if pattern and test string exist)
    useEffect(() => {
        if (pattern && testString && results.length > 0) {
            testRegex();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flags]);

    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Main Testing Area - Left 2 columns */}
            <div className='lg:col-span-2 space-y-6'>
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{ui.patternLabel}</label>
                            <input type='text' value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder={ui.patternPlaceholder} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono' />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{ui.flagsLabel}</label>
                            <div className='flex flex-wrap gap-2 mb-2'>
                                {(["g", "i", "m", "s", "u", "y"] as const).map((flag) => (
                                    <label key={flag} className='flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' title={ui.flagDescriptions[flag]}>
                                        <input
                                            type='checkbox'
                                            checked={flags.includes(flag)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFlags(flags + flag);
                                                } else {
                                                    setFlags(flags.replace(flag, ""));
                                                }
                                            }}
                                            className='rounded'
                                        />
                                        <span className='font-mono text-sm text-gray-900 dark:text-gray-100'>{flag}</span>
                                        <span className='text-xs text-gray-500 dark:text-gray-400'>({ui.flagDescriptions[flag].split(" - ")[0]})</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{ui.testStringsLabel}</label>
                            <textarea value={testString} onChange={(e) => setTestString(e.target.value)} placeholder={ui.testStringsPlaceholder} rows={10} className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm' />
                        </div>

                        <Button onClick={testRegex} variant='primary' size='lg' fullWidth>
                            {ui.testButton}
                        </Button>

                        {error && <div className='p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg'>{error}</div>}
                    </div>
                </div>

                {/* Results Section */}
                {results.length > 0 && (
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>{ui.resultsTitle}</h3>
                            <div className='flex gap-4 text-sm'>
                                <span className='text-green-600 dark:text-green-400 font-medium'>
                                    ✓ {matchedCount} {ui.matched}
                                </span>
                                <span className='text-red-600 dark:text-red-400 font-medium'>
                                    ✗ {unmatchedCount} {ui.notMatched}
                                </span>
                            </div>
                        </div>
                        <div className='space-y-2 max-h-96 overflow-y-auto'>
                            {results.map((result) => (
                                <div key={result.line} className={`p-3 rounded-lg border-l-4 ${result.matched ? "bg-green-50 dark:bg-green-900/20 border-green-500" : "bg-red-50 dark:bg-red-900/20 border-red-500"}`}>
                                    <div className='flex items-start gap-3'>
                                        <span className='text-xs font-bold text-gray-500 dark:text-gray-400 w-8 shrink-0'>L{result.line}</span>
                                        <span className={`flex-1 font-mono text-sm ${result.matched ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"}`}>{result.text || "(empty line)"}</span>
                                        <span className='text-xs font-semibold'>{result.matched ? <span className='text-green-600 dark:text-green-400'>✓ MATCH</span> : <span className='text-red-600 dark:text-red-400'>✗ NO MATCH</span>}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Regex Flavor Selector */}
                <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{ui.flavorTitle}</h3>

                    {/* Warning Note */}
                    <div className='mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded'>
                        <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                            <strong>⚠️ {locale === "vi" ? "Lưu ý" : "Note"}:</strong> {ui.flavorNote}
                        </p>
                    </div>

                    <div className='flex flex-wrap gap-2 mb-4'>
                        {regexFlavors.map((flavor) => (
                            <button key={flavor.language} onClick={() => setSelectedFlavor(flavor.language)} className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${selectedFlavor === flavor.language ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                                {flavor.language}
                            </button>
                        ))}
                    </div>
                    {regexFlavors.find((f) => f.language === selectedFlavor) && (
                        <div className='space-y-3'>
                            <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                                <p className='text-sm font-medium text-blue-900 dark:text-blue-100'>{regexFlavors.find((f) => f.language === selectedFlavor)?.description}</p>
                            </div>
                            <div className='space-y-2'>
                                <p className='text-sm font-semibold text-gray-700 dark:text-gray-300'>{ui.keyDifferences}</p>
                                <ul className='space-y-1.5'>
                                    {regexFlavors
                                        .find((f) => f.language === selectedFlavor)
                                        ?.differences.map((diff, idx) => (
                                            <li key={idx} className='text-sm text-gray-600 dark:text-gray-400 flex gap-2'>
                                                <span className='text-blue-600 dark:text-blue-400'>•</span>
                                                <span>{diff}</span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                            {/* Future Languages Notice */}
                            <div className='mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border-l-4 border-blue-500'>
                                <p className='text-xs text-gray-600 dark:text-gray-400'>💡 {ui.futureLanguages}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Reference Sidebar - Right 1 column */}
            <div className='lg:col-span-1 space-y-4'>
                <div className='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-4'>
                    <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100'>{ui.commonPatternsTitle}</h3>

                    {/* Category Filter */}
                    <div className='mb-4'>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className='w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100 appearance-none cursor-pointer'
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: "right 0.5rem center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "1.5em 1.5em",
                            }}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {getCategoryLabel(cat)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='space-y-2 max-h-[600px] overflow-y-auto' style={{ scrollbarWidth: "thin", scrollbarColor: "rgb(156 163 175) transparent" }}>
                        {filteredPatterns.map((p, idx) => (
                            <div key={idx} onClick={() => loadPattern(p)} className='p-3 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer border border-gray-200 dark:border-gray-700 transition-colors'>
                                <div className='font-medium text-sm text-gray-900 dark:text-gray-100 mb-1'>{p.name}</div>
                                <div className='text-xs text-gray-600 dark:text-gray-400 mb-2'>{p.description}</div>
                                <code className='text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded text-blue-600 dark:text-blue-400 break-all block'>{p.pattern.length > 40 ? p.pattern.substring(0, 40) + "..." : p.pattern}</code>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Reference Guide */}
                <div className='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
                    <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100'>{ui.quickReferenceTitle}</h3>
                    <div className='space-y-2 text-xs'>
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                            <code className='text-blue-600 dark:text-blue-400'>.</code>
                            <span className='ml-2 text-gray-700 dark:text-gray-300'>{ui.quickRef.anyChar}</span>
                        </div>
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                            <code className='text-blue-600 dark:text-blue-400'>\d</code>
                            <span className='ml-2 text-gray-700 dark:text-gray-300'>{ui.quickRef.digit}</span>
                        </div>
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                            <code className='text-blue-600 dark:text-blue-400'>\w</code>
                            <span className='ml-2 text-gray-700 dark:text-gray-300'>{ui.quickRef.wordChar}</span>
                        </div>
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                            <code className='text-blue-600 dark:text-blue-400'>\s</code>
                            <span className='ml-2 text-gray-700 dark:text-gray-300'>{ui.quickRef.whitespace}</span>
                        </div>
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                            <code className='text-blue-600 dark:text-blue-400'>^</code>
                            <span className='ml-2 text-gray-700 dark:text-gray-300'>{ui.quickRef.startLine}</span>
                        </div>
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                            <code className='text-blue-600 dark:text-blue-400'>$</code>
                            <span className='ml-2 text-gray-700 dark:text-gray-300'>{ui.quickRef.endLine}</span>
                        </div>
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                            <code className='text-blue-600 dark:text-blue-400'>*</code>
                            <span className='ml-2 text-gray-700 dark:text-gray-300'>{ui.quickRef.zeroOrMore}</span>
                        </div>
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                            <code className='text-blue-600 dark:text-blue-400'>+</code>
                            <span className='ml-2 text-gray-700 dark:text-gray-300'>{ui.quickRef.oneOrMore}</span>
                        </div>
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                            <code className='text-blue-600 dark:text-blue-400'>?</code>
                            <span className='ml-2 text-gray-700 dark:text-gray-300'>{ui.quickRef.zeroOrOne}</span>
                        </div>
                        <div className='p-2 bg-gray-50 dark:bg-gray-900 rounded'>
                            <code className='text-blue-600 dark:text-blue-400'>
                                {"{"}n,m{"}"}
                            </code>
                            <span className='ml-2 text-gray-700 dark:text-gray-300'>{ui.quickRef.between}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
