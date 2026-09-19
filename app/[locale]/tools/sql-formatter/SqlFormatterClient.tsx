"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { format as sqlFormat } from "sql-formatter";

type SqlDialect = "sql" | "postgresql" | "mysql" | "sqlite" | "bigquery" | "mariadb" | "transactsql" | "plsql";
type KeywordCase = "upper" | "lower" | "preserve";

const SAMPLE_QUERIES = [
    {
        titleEn: "Complex JOIN & Aggregates",
        titleVi: "JOIN Nhiều Bảng & Gom Nhóm",
        sql: `select u.id, u.name, u.email, count(o.id) as total_orders, sum(o.total_amount) as lifetime_spent, max(o.created_at) as last_order_date from users u inner join orders o on u.id = o.user_id left join user_profiles p on u.id = p.user_id where u.status = 'active' and o.status not in ('cancelled', 'refunded') group by u.id, u.name, u.email having count(o.id) >= 5 and sum(o.total_amount) > 1000 order by lifetime_spent desc, last_order_date desc limit 50;`,
    },
    {
        titleEn: "Common Table Expression (CTE)",
        titleVi: "Biểu Thức Bảng Chung (WITH CTE)",
        sql: `with monthly_revenue as (select date_trunc('month', order_date) as month, sum(revenue) as total_rev, count(distinct customer_id) as active_customers from sales group by 1), ranked_growth as (select month, total_rev, active_customers, lag(total_rev) over (order by month) as prev_rev, round(cast((total_rev - lag(total_rev) over (order by month)) as numeric) / lag(total_rev) over (order by month) * 100, 2) as growth_pct from monthly_revenue) select month, total_rev, prev_rev, growth_pct, case when growth_pct > 15 then 'HIGH GROWTH' when growth_pct > 0 then 'STABLE' else 'DECLINING' end as business_health from ranked_growth order by month desc;`,
    },
    {
        titleEn: "Window Functions & Ranking",
        titleVi: "Hàm Phân Vùng Window Functions",
        sql: `select employee_id, first_name, last_name, department_id, salary, row_number() over (partition by department_id order by salary desc) as dept_rank, dense_rank() over (order by salary desc) as company_rank, avg(salary) over (partition by department_id) as dept_avg_salary, salary - avg(salary) over (partition by department_id) as diff_from_avg from employees where hire_date >= '2022-01-01';`,
    },
];

export default function SqlFormatterClient() {
    const { locale } = useLanguage();
    const isVi = locale === "vi";

    const defaultSql = `select u.id, u.name, u.email, count(o.id) as total_orders from users u left join orders o on u.id = o.user_id where u.status = 'active' group by u.id, u.name, u.email order by total_orders desc limit 10;`;

    const [inputSql, setInputSql] = useState(defaultSql);
    const [dialect, setDialect] = useState<SqlDialect>("sql");
    const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");
    const [indentSize, setIndentSize] = useState<number>(2);
    const [useTabs, setUseTabs] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Formatted SQL memo
    const formattedSql = useMemo(() => {
        if (!inputSql.trim()) {
            setError("");
            return "";
        }
        try {
            setError("");
            const res = sqlFormat(inputSql, {
                language: dialect,
                tabWidth: indentSize,
                useTabs,
                keywordCase,
                dataTypeCase: keywordCase,
                functionCase: keywordCase,
                linesBetweenQueries: 2,
            });
            return res;
        } catch (err: any) {
            setError(err?.message || (isVi ? "Lỗi phân tích cú pháp SQL" : "SQL parsing error"));
            return inputSql;
        }
    }, [inputSql, dialect, keywordCase, indentSize, useTabs, isVi]);

    // Handle minifying SQL into a compact single-line string
    const handleMinify = () => {
        try {
            const minified = inputSql
                .replace(/--.*$/gm, "") // Remove single-line comments
                .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
                .replace(/\s+/g, " ") // Collapse whitespace
                .replace(/\s*([,;()=><+])\s*/g, "$1") // Trim around operators
                .trim();

            setInputSql(minified);
            toast.success(isVi ? "Đã nén câu lệnh SQL thành 1 dòng!" : "Minified SQL query!");
        } catch {
            toast.error(isVi ? "Không thể nén SQL" : "Failed to minify SQL");
        }
    };

    // Copy formatted SQL
    const handleCopy = async () => {
        if (!formattedSql) return;
        try {
            await navigator.clipboard.writeText(formattedSql);
            toast.success(isVi ? "Đã sao chép câu lệnh SQL đã định dạng!" : "Copied formatted SQL to clipboard!");
        } catch {
            toast.error(isVi ? "Không thể sao chép" : "Failed to copy");
        }
    };

    // Download .sql file
    const handleDownload = () => {
        if (!formattedSql) return;
        const blob = new Blob([formattedSql], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `query_${Date.now()}.sql`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(isVi ? "Đã tải xuống tệp .sql!" : "Downloaded .sql file!");
    };

    // Quick sample loader
    const handleLoadSample = (sample: (typeof SAMPLE_QUERIES)[0]) => {
        setInputSql(sample.sql);
        toast.info(isVi ? `Đã nạp mẫu: ${sample.titleVi}` : `Loaded: ${sample.titleEn}`);
    };

    return (
        <div className='max-w-6xl mx-auto space-y-6'>
            {/* Control & Configuration Bar */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4'>
                <div className='flex flex-wrap items-center justify-between gap-4'>
                    {/* Dialect Selector */}
                    <div className='flex items-center gap-2'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                            {isVi ? "Hệ Quản Trị / Dialect:" : "SQL Dialect:"}
                        </label>
                        <select
                            value={dialect}
                            onChange={(e) => setDialect(e.target.value as SqlDialect)}
                            className='px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value='sql'>Standard SQL (ANSI)</option>
                            <option value='postgresql'>PostgreSQL</option>
                            <option value='mysql'>MySQL</option>
                            <option value='sqlite'>SQLite</option>
                            <option value='bigquery'>Google BigQuery</option>
                            <option value='mariadb'>MariaDB</option>
                            <option value='transactsql'>SQL Server (T-SQL)</option>
                            <option value='plsql'>Oracle PL/SQL</option>
                        </select>
                    </div>

                    {/* Keyword Casing Selector */}
                    <div className='flex items-center gap-2'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                            {isVi ? "Từ Khóa (Keywords):" : "Keywords:"}
                        </label>
                        <div className='flex bg-gray-100 dark:bg-gray-700/60 p-0.5 rounded-lg text-xs font-semibold'>
                            <button
                                type='button'
                                onClick={() => setKeywordCase("upper")}
                                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                    keywordCase === "upper" ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                UPPERCASE
                            </button>
                            <button
                                type='button'
                                onClick={() => setKeywordCase("lower")}
                                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                    keywordCase === "lower" ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                lowercase
                            </button>
                            <button
                                type='button'
                                onClick={() => setKeywordCase("preserve")}
                                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                    keywordCase === "preserve" ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-600 dark:text-gray-400"
                                }`}
                            >
                                {isVi ? "Giữ nguyên" : "Preserve"}
                            </button>
                        </div>
                    </div>

                    {/* Indentation */}
                    <div className='flex items-center gap-2'>
                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                            {isVi ? "Thụt Dòng (Indent):" : "Indent:"}
                        </label>
                        <select
                            value={useTabs ? "tab" : String(indentSize)}
                            onChange={(e) => {
                                if (e.target.value === "tab") {
                                    setUseTabs(true);
                                } else {
                                    setUseTabs(false);
                                    setIndentSize(Number(e.target.value));
                                }
                            }}
                            className='px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value='2'>2 Spaces</option>
                            <option value='4'>4 Spaces</option>
                            <option value='tab'>Tab</option>
                        </select>
                    </div>
                </div>

                {/* Sample Queries Bar */}
                <div className='pt-2 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-2'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <span className='text-xs font-semibold text-gray-500 dark:text-gray-400'>
                            💡 {isVi ? "Nạp SQL mẫu:" : "Sample Queries:"}
                        </span>
                        {SAMPLE_QUERIES.map((sq, i) => (
                            <button
                                key={i}
                                type='button'
                                onClick={() => handleLoadSample(sq)}
                                className='px-2.5 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700/70 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700'
                            >
                                {isVi ? sq.titleVi : sq.titleEn}
                            </button>
                        ))}
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            onClick={handleMinify}
                            className='px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors cursor-pointer'
                        >
                            🗜️ {isVi ? "Nén 1 dòng (Minify)" : "Minify SQL"}
                        </button>
                        <button
                            type='button'
                            onClick={() => setInputSql("")}
                            className='px-3 py-1 text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer'
                        >
                            {isVi ? "Xóa hết" : "Clear"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Split Editor Pane: Input SQL vs Formatted Output */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Left: Input Editor */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400'>
                        <span className='flex items-center gap-1.5'>
                            <span>📝</span>
                            <span>{isVi ? "Câu Lệnh SQL Gốc (Nhập hoặc dán tại đây)" : "Raw SQL Input"}</span>
                        </span>
                        <span className='font-mono'>{inputSql.length} chars</span>
                    </div>

                    <textarea
                        value={inputSql}
                        onChange={(e) => setInputSql(e.target.value)}
                        placeholder='SELECT * FROM users WHERE status = 1;'
                        rows={16}
                        className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y leading-relaxed flex-1'
                    />

                    {error && (
                        <div className='p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2'>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Right: Formatted SQL Preview */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col space-y-3'>
                    <div className='flex items-center justify-between'>
                        <span className='text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5'>
                            <span>✨</span>
                            <span>{isVi ? "Kết Quả Định Dạng Chuẩn" : "Formatted SQL Output"}</span>
                        </span>

                        <div className='flex gap-2'>
                            <Button onClick={handleCopy} variant='secondary' size='sm'>
                                📋 {isVi ? "Sao chép" : "Copy"}
                            </Button>
                            <Button onClick={handleDownload} variant='secondary' size='sm'>
                                💾 {isVi ? "Tải file .sql" : "Download .sql"}
                            </Button>
                        </div>
                    </div>

                    {/* Output Viewer */}
                    <div className='flex-1 relative min-h-[350px]'>
                        <pre className='h-full p-4 bg-gray-900 text-emerald-300 rounded-xl font-mono text-xs overflow-x-auto border border-gray-800 leading-relaxed max-h-[500px] overflow-y-auto select-all'>
                            <code>
                                {formattedSql || (
                                    <span className='text-gray-500 italic'>
                                        {isVi ? "-- Nhập câu lệnh SQL ở khung bên trái để xem kết quả format..." : "-- Enter SQL query on the left to see formatted output..."}
                                    </span>
                                )}
                            </code>
                        </pre>
                    </div>

                    {/* Stats */}
                    <div className='p-3 bg-gray-50 dark:bg-gray-900/60 rounded-xl border border-gray-200 dark:border-gray-700 text-xs flex items-center justify-between text-gray-500 font-mono'>
                        <span>{isVi ? "Hệ quản trị:" : "Dialect:"} {dialect.toUpperCase()}</span>
                        <span>{formattedSql ? formattedSql.split("\n").length : 0} {isVi ? "dòng" : "lines"}</span>
                        <span>{formattedSql.length} chars</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
