"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { sqlToTypesTranslations } from "@/lib/i18n/tools/sql-to-types";
import { toast } from "@/components/ui/Toast";

interface ColumnDef {
    name: string;
    sqlType: string;
    isNullable: boolean;
    isPrimary: boolean;
}

interface TableDef {
    tableName: string;
    columns: ColumnDef[];
}

function toCamelCase(str: string): string {
    return str.replace(/_([a-z0-9])/gi, (_, g) => g.toUpperCase());
}

function toPascalCase(str: string): string {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// SQL DDL Parser
function parseSqlCreateTable(sql: string): TableDef | null {
    const clean = sql.trim().replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");

    const tableMatch = clean.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:["'`]?\w+["'`]?\.)?["'`]?(\w+)["'`]?\s*\(([\s\S]*)\)/i);
    if (!tableMatch) return null;

    const tableName = tableMatch[1];
    const body = tableMatch[2];

    // Split by comma outside parentheses
    const lines: string[] = [];
    let cur = "";
    let parenCount = 0;

    for (let i = 0; i < body.length; i++) {
        const char = body[i];
        if (char === "(") parenCount++;
        else if (char === ")") parenCount--;

        if (char === "," && parenCount === 0) {
            lines.push(cur.trim());
            cur = "";
        } else {
            cur += char;
        }
    }
    if (cur.trim()) lines.push(cur.trim());

    const columns: ColumnDef[] = [];

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Skip table-level constraints
        if (/^(PRIMARY\s+KEY|FOREIGN\s+KEY|CONSTRAINT|UNIQUE|CHECK|KEY|INDEX)\b/i.test(trimmed)) {
            return;
        }

        const parts = trimmed.split(/\s+/);
        if (parts.length < 2) return;

        const rawName = parts[0].replace(/["'`]/g, "");
        const rawType = parts[1].toUpperCase();

        const isPrimary = /PRIMARY\s+KEY/i.test(trimmed);
        const hasNotNull = /NOT\s+NULL/i.test(trimmed);
        const isNullable = !isPrimary && !hasNotNull;

        columns.push({
            name: rawName,
            sqlType: rawType,
            isNullable,
            isPrimary,
        });
    });

    return { tableName, columns };
}

// Generators
function generateTypeScript(table: TableDef, camelCase: boolean): string {
    const typeName = toPascalCase(table.tableName);
    const lines = table.columns.map((col) => {
        const fieldName = camelCase ? toCamelCase(col.name) : col.name;
        const opt = col.isNullable ? "?" : "";
        const baseType = getTsType(col.sqlType);
        return `    ${fieldName}${opt}: ${baseType};`;
    });

    return `export interface ${typeName} {\n${lines.join("\n")}\n}\n`;
}

function getTsType(sqlType: string): string {
    const t = sqlType.toUpperCase();
    if (/INT|SERIAL|FLOAT|DOUBLE|DECIMAL|NUMERIC|REAL|YEAR/.test(t)) return "number";
    if (/CHAR|TEXT|UUID|CITEXT|VARCHAR/.test(t)) return "string";
    if (/BOOL|TINYINT\(1\)/.test(t)) return "boolean";
    if (/TIME|DATE/.test(t)) return "Date";
    if (/JSON/.test(t)) return "Record<string, any>";
    if (/BYTEA|BLOB/.test(t)) return "Uint8Array";
    return "any";
}

function generateZod(table: TableDef, camelCase: boolean): string {
    const typeName = toPascalCase(table.tableName);
    const lines = table.columns.map((col) => {
        const fieldName = camelCase ? toCamelCase(col.name) : col.name;
        let zodType = getZodType(col.sqlType, col.name);
        if (col.isNullable) zodType += ".optional()";
        return `    ${fieldName}: ${zodType},`;
    });

    return `import { z } from "zod";\n\nexport const ${typeName}Schema = z.object({\n${lines.join("\n")}\n});\n\nexport type ${typeName} = z.infer<typeof ${typeName}Schema>;\n`;
}

function getZodType(sqlType: string, name: string): string {
    const t = sqlType.toUpperCase();
    const n = name.toLowerCase();

    if (/INT|SERIAL|FLOAT|DOUBLE|DECIMAL|NUMERIC|REAL/.test(t)) return "z.number()";
    if (/CHAR|TEXT|VARCHAR|CITEXT/.test(t)) {
        if (n.includes("email")) return "z.string().email()";
        if (n.includes("uuid")) return "z.string().uuid()";
        if (n.includes("url")) return "z.string().url()";
        return "z.string()";
    }
    if (/UUID/.test(t)) return "z.string().uuid()";
    if (/BOOL/.test(t)) return "z.boolean()";
    if (/TIME|DATE/.test(t)) return "z.date()";
    if (/JSON/.test(t)) return "z.record(z.any())";
    return "z.any()";
}

function generateGo(table: TableDef): string {
    const structName = toPascalCase(table.tableName);
    const lines = table.columns.map((col) => {
        const fieldName = toPascalCase(col.name);
        const goType = getGoType(col.sqlType, col.isNullable);
        const tag = `\`json:"${col.name}${col.isNullable ? ",omitempty" : ""}" db:"${col.name}"\``;
        return `    ${fieldName.padEnd(16)} ${goType.padEnd(12)} ${tag}`;
    });

    return `package models\n\nimport (\n    "time"\n)\n\ntype ${structName} struct {\n${lines.join("\n")}\n}\n`;
}

function getGoType(sqlType: string, isNullable: boolean): string {
    const t = sqlType.toUpperCase();
    let base = "string";

    if (/BIGINT/.test(t)) base = "int64";
    else if (/INT|SERIAL|YEAR/.test(t)) base = "int";
    else if (/FLOAT|DOUBLE|DECIMAL|NUMERIC|REAL/.test(t)) base = "float64";
    else if (/CHAR|TEXT|VARCHAR|UUID|CITEXT/.test(t)) base = "string";
    else if (/BOOL/.test(t)) base = "bool";
    else if (/TIME|DATE/.test(t)) base = "time.Time";
    else if (/JSON/.test(t)) base = "map[string]interface{}";
    else if (/BYTEA|BLOB/.test(t)) base = "[]byte";

    return isNullable ? `*${base}` : base;
}

function generateCSharp(table: TableDef, camelCase: boolean): string {
    const className = toPascalCase(table.tableName);
    const lines = table.columns.map((col) => {
        const propName = toPascalCase(col.name);
        const csType = getCsType(col.sqlType, col.isNullable);
        return `    public ${csType} ${propName} { get; set; }`;
    });

    return `public class ${className}\n{\n${lines.join("\n")}\n}\n`;
}

function getCsType(sqlType: string, isNullable: boolean): string {
    const t = sqlType.toUpperCase();
    let base = "string";

    if (/BIGINT/.test(t)) base = "long";
    else if (/INT|SERIAL|YEAR/.test(t)) base = "int";
    else if (/FLOAT|REAL/.test(t)) base = "float";
    else if (/DOUBLE/.test(t)) base = "double";
    else if (/DECIMAL|NUMERIC/.test(t)) base = "decimal";
    else if (/CHAR|TEXT|VARCHAR|UUID|CITEXT/.test(t)) base = "string";
    else if (/BOOL/.test(t)) base = "bool";
    else if (/TIME|DATE/.test(t)) base = "DateTime";
    else if (/JSON/.test(t)) base = "object";

    return isNullable && base !== "string" && base !== "object" ? `${base}?` : base;
}

// SQL Presets
const SQL_PRESETS = {
    users: `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);`,
    orders: `CREATE TABLE orders (
    order_id UUID PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    order_status VARCHAR(30) NOT NULL,
    shipping_address TEXT,
    ordered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
    products: `CREATE TABLE products (
    product_id BIGINT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    metadata JSONB,
    is_published BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMP
);`,
};

export default function SqlToTypesContent() {
    const { locale } = useLanguage();
    const t = sqlToTypesTranslations[locale as "en" | "vi"] || sqlToTypesTranslations.en;

    const [inputSql, setInputSql] = useState<string>(SQL_PRESETS.users);
    const [targetLang, setTargetLang] = useState<"ts" | "zod" | "go" | "cs">("ts");
    const [camelCase, setCamelCase] = useState<boolean>(true);

    const generatedCode = useMemo(() => {
        const table = parseSqlCreateTable(inputSql);
        if (!table) return "// Could not parse valid CREATE TABLE statement. Please check your SQL syntax.";

        switch (targetLang) {
            case "ts":
                return generateTypeScript(table, camelCase);
            case "zod":
                return generateZod(table, camelCase);
            case "go":
                return generateGo(table);
            case "cs":
                return generateCSharp(table, camelCase);
        }
    }, [inputSql, targetLang, camelCase]);

    const handleCopy = () => {
        if (!generatedCode) return;
        navigator.clipboard.writeText(generatedCode);
        toast.success(t.copied);
    };

    const handleDownload = () => {
        if (!generatedCode) return;
        const extMap = { ts: "ts", zod: "ts", go: "go", cs: "cs" };
        const blob = new Blob([generatedCode], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `schema.${extMap[targetLang]}`;
        link.click();
    };

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-6xl mx-auto space-y-6'>
            {/* Top Toolbar: Presets & Target Format */}
            <div className='w-full bg-white dark:bg-gray-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4'>
                {/* Presets */}
                <div className='flex flex-wrap items-center gap-2'>
                    <span className='text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1'>
                        ⚡ {t.presets}:
                    </span>
                    <button
                        onClick={() => setInputSql(SQL_PRESETS.users)}
                        className='px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer border border-gray-200 dark:border-gray-700 transition-colors'
                    >
                        {t.presetUsers}
                    </button>
                    <button
                        onClick={() => setInputSql(SQL_PRESETS.orders)}
                        className='px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer border border-gray-200 dark:border-gray-700 transition-colors'
                    >
                        {t.presetOrders}
                    </button>
                    <button
                        onClick={() => setInputSql(SQL_PRESETS.products)}
                        className='px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer border border-gray-200 dark:border-gray-700 transition-colors'
                    >
                        {t.presetProducts}
                    </button>
                </div>

                {/* Target Format & CamelCase */}
                <div className='flex flex-wrap items-center gap-3 text-xs'>
                    <div className='flex items-center gap-2'>
                        <span className='font-bold text-gray-700 dark:text-gray-300'>🛠️ {t.targetLanguage}:</span>
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value as any)}
                            className='px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold cursor-pointer'
                        >
                            <option value='ts'>{t.optTypeScript}</option>
                            <option value='zod'>{t.optZod}</option>
                            <option value='go'>{t.optGo}</option>
                            <option value='cs'>{t.optCSharp}</option>
                        </select>
                    </div>

                    {targetLang !== "go" && (
                        <label className='flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={camelCase}
                                onChange={(e) => setCamelCase(e.target.checked)}
                                className='rounded accent-blue-600'
                            />
                            <span>{t.camelCaseOption}</span>
                        </label>
                    )}
                </div>
            </div>

            {/* Dual Split Editor */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {/* Left: Input SQL */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                            <span>🗄️</span> {t.inputLabel}
                        </span>
                        {inputSql && (
                            <button
                                onClick={() => setInputSql("")}
                                className='text-xs font-semibold text-gray-400 hover:text-red-500 cursor-pointer'
                            >
                                ✕ {t.clear}
                            </button>
                        )}
                    </div>
                    <textarea
                        value={inputSql}
                        onChange={(e) => setInputSql(e.target.value)}
                        placeholder={t.inputPlaceholder}
                        rows={18}
                        className='w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed'
                    />
                </div>

                {/* Right: Output Generated Code */}
                <div className='bg-white dark:bg-gray-900 p-5 rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2'>
                            <span>✨</span> {t.outputLabel}
                        </span>
                        <div className='flex items-center gap-2'>
                            <Button
                                onClick={handleCopy}
                                disabled={!generatedCode}
                                variant='primary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                📋 {t.copyCode}
                            </Button>
                            <Button
                                onClick={handleDownload}
                                disabled={!generatedCode}
                                variant='secondary'
                                size='sm'
                                className='cursor-pointer text-xs font-bold'
                            >
                                💾 {t.downloadFile}
                            </Button>
                        </div>
                    </div>
                    <textarea
                        readOnly
                        value={generatedCode}
                        rows={18}
                        className='w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-900 text-emerald-400 font-mono text-xs sm:text-sm focus:outline-hidden resize-none leading-relaxed'
                    />
                </div>
            </div>

            {/* SEO & Technical Guide */}
            <div className='w-full bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
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
