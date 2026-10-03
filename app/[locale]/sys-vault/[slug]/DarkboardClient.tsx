"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
    TelemetryEvent,
    TelemetrySummaryStats,
    CreditTransaction,
    CreditTransactionSummary,
    UserDirectoryItem,
    UserSummaryStats,
    HourlyActivityBucket,
    DayOfWeekActivity,
    TopDocumentItem,
} from "@/lib/telemetry/types";

interface DarkboardClientProps {
    locale: string;
    secretSlug: string;
    tabToken?: string;
    initialAuthenticated: boolean;
}

function generateSmoothPath(points: Array<{ x: number; y: number }>): string {
    if (!points || points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

    return points.reduce((acc, point, i, arr) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        const prev = arr[i - 1];
        const cp1x = prev.x + (point.x - prev.x) / 2.5;
        const cp1y = prev.y;
        const cp2x = point.x - (point.x - prev.x) / 2.5;
        const cp2y = point.y;
        return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
    }, "");
}

export default function DarkboardClient({
    locale,
    secretSlug,
    tabToken,
    initialAuthenticated,
}: DarkboardClientProps) {
    const isVi = locale === "vi";

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Active Module Tab: Overview vs Users vs Telemetry vs Transactions
    const [activeTab, setActiveTab] = useState<"overview" | "users" | "telemetry" | "transactions">("overview");

    // Responsive Chart Containers
    const userChartContainerRef = useRef<HTMLDivElement>(null);
    const [userChartWidth, setUserChartWidth] = useState(1000);

    const overviewChartContainerRef = useRef<HTMLDivElement>(null);
    const [overviewChartWidth, setOverviewChartWidth] = useState(1000);

    useEffect(() => {
        const updateWidths = () => {
            if (userChartContainerRef.current) {
                const w = userChartContainerRef.current.clientWidth;
                if (w > 0) setUserChartWidth(w);
            }
            if (overviewChartContainerRef.current) {
                const w = overviewChartContainerRef.current.clientWidth;
                if (w > 0) setOverviewChartWidth(w);
            }
        };

        updateWidths();

        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === userChartContainerRef.current && entry.contentRect.width > 0) {
                    setUserChartWidth(Math.floor(entry.contentRect.width));
                } else if (entry.target === overviewChartContainerRef.current && entry.contentRect.width > 0) {
                    setOverviewChartWidth(Math.floor(entry.contentRect.width));
                }
            }
        });

        if (userChartContainerRef.current) ro.observe(userChartContainerRef.current);
        if (overviewChartContainerRef.current) ro.observe(overviewChartContainerRef.current);
        window.addEventListener("resize", updateWidths);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", updateWidths);
        };
    }, [activeTab]);

    // Chart Presentation States
    const [overviewChartType, setOverviewChartType] = useState<"line" | "bar">("line");
    const [userChartMetric, setUserChartMetric] = useState<"new_users" | "cumulative" | "both">("both");
    const [hoveredUserChartIndex, setHoveredUserChartIndex] = useState<number | null>(null);
    const [hoveredOverviewIndex, setHoveredOverviewIndex] = useState<number | null>(null);

    // Dashboard Filter & Data State
    const [extensionId, setExtensionId] = useState<string>("scribd-downloader");
    const [timeframe, setTimeframe] = useState<"1h" | "24h" | "7d" | "30d" | "all">("24h");
    const [statusFilter, setStatusFilter] = useState<"all" | "credit_only" | "free_only" | "anomalies_only" | "fast_bypass" | "multi_ip">("all");
    const [userFilter, setUserFilter] = useState<"all" | "paying" | "new" | "high_credits" | "risk">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [stats, setStats] = useState<TelemetrySummaryStats | null>(null);
    const [events, setEvents] = useState<TelemetryEvent[]>([]);
    const [transactionStats, setTransactionStats] = useState<CreditTransactionSummary | null>(null);
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    const [userStats, setUserStats] = useState<UserSummaryStats | null>(null);
    const [users, setUsers] = useState<UserDirectoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");

    // Modal & Interactive State
    const [selectedEvent, setSelectedEvent] = useState<TelemetryEvent | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<CreditTransaction | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserDirectoryItem | null>(null);

    // Load Telemetry Data (Pure Real Google Sheets)
    const fetchTelemetry = useCallback(async () => {
        if (!isAuthenticated) return;
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                extensionId,
                timeframe,
                status: statusFilter,
                q: searchQuery,
            });
            const authHeaders: Record<string, string> = { "x-vault-slug": secretSlug };
            if (tabToken) {
                authHeaders["x-vault-tab-token"] = tabToken;
            }
            const res = await fetch(`/api/admin-vault/stats?${params.toString()}`, {
                headers: authHeaders,
            });
            if (res.status === 401 || res.status === 404) {
                setIsAuthenticated(false);
                return;
            }
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
                setEvents(data.filteredEvents || []);
                if (data.transactionStats) {
                    setTransactionStats(data.transactionStats);
                }
                if (data.transactions) {
                    setTransactions(data.transactions);
                }
                if (data.userStats) {
                    setUserStats(data.userStats);
                }
                if (data.users) {
                    setUsers(data.users);
                }
                setLastUpdated(new Date().toLocaleTimeString(isVi ? "vi-VN" : "en-US"));
            }
        } catch (err) {
            console.error("Failed to load telemetry:", err);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, extensionId, timeframe, statusFilter, searchQuery, isVi, secretSlug, tabToken]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTelemetry();
        }
    }, [isAuthenticated, fetchTelemetry]);

    // Auto-refresh interval (every 12 seconds)
    useEffect(() => {
        if (!isAuthenticated || !autoRefresh) return;
        const interval = setInterval(() => {
            fetchTelemetry();
        }, 12000);
        return () => clearInterval(interval);
    }, [isAuthenticated, autoRefresh, fetchTelemetry]);

    // Handle Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setIsLoggingIn(true);

        try {
            const loginHeaders: Record<string, string> = {
                "Content-Type": "application/json",
                "x-vault-slug": secretSlug,
            };
            if (tabToken) {
                loginHeaders["x-vault-tab-token"] = tabToken;
            }
            const res = await fetch("/api/admin-vault/auth", {
                method: "POST",
                headers: loginHeaders,
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setIsAuthenticated(true);
                setPassword("");
            } else {
                setLoginError(data.error || (isVi ? "Đăng nhập thất bại. Kiểm tra thông tin mã hóa." : "Login failed. Check your encrypted vault credentials."));
            }
        } catch {
            setLoginError(isVi ? "Lỗi kết nối tới Cổng Bảo Mật Vault." : "Connection failed to Admin Vault Gate.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    // Handle Logout
    const handleLogout = async () => {
        const logoutHeaders: Record<string, string> = { "x-vault-slug": secretSlug };
        if (tabToken) {
            logoutHeaders["x-vault-tab-token"] = tabToken;
        }
        await fetch("/api/admin-vault/auth", {
            method: "DELETE",
            headers: logoutHeaders,
        });
        setIsAuthenticated(false);
    };

    // Filtered Users List based on userFilter
    const filteredUsers = useMemo(() => {
        if (!users.length) return [];
        return users.filter((u) => {
            if (userFilter === "paying") return u.isPaying;
            if (userFilter === "new") return u.isNewInTimeframe;
            if (userFilter === "high_credits") return u.credits >= 10;
            if (userFilter === "risk") return u.riskFlags.length > 0;
            return true;
        });
    }, [users, userFilter]);

    // Export CSV Report
    const handleExportCsv = () => {
        if (activeTab === "users") {
            if (!filteredUsers.length) return;
            const headers = isVi
                ? ["Ma_User_ID", "So_Du_Credits", "Tong_Da_Tai", "IP_Dang_Ky", "Khu_Vuc", "Quoc_Gia", "Da_Tung_Nap", "Tong_Chi_Tieu_VND", "So_Giao_Dich", "Ngay_Tham_Gia", "Hoat_Dong_Cuoi"]
                : ["User_ID", "Credits", "Total_Downloaded", "Created_IP", "City", "Country", "Is_Paying", "Total_Spent_VND", "Transactions_Count", "Created_At", "Updated_At"];

            const rows = filteredUsers.map((u) => [
                u.userId,
                u.credits,
                u.totalDownloaded,
                u.createdIp,
                u.city || "Unknown",
                u.country || "Unknown",
                u.isPaying ? "YES" : "NO",
                u.totalSpentVnd,
                u.transactionCount,
                u.createdAt,
                u.updatedAt,
            ]);
            const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `users-directory-${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        if (activeTab === "transactions") {
            if (!transactions.length) return;
            const headers = isVi
                ? ["Thoi_Gian", "Ma_Giao_Dich", "Ma_User", "So_Tien_VND", "Credits_Cong", "Ngan_Hang", "Noi_Dung"]
                : ["Timestamp", "Trans_ID", "User_ID", "Amount_VND", "Credits_Added", "Bank_Code", "Content"];

            const rows = transactions.map((t) => [
                t.createdAt,
                t.id,
                t.userId,
                t.amount,
                t.creditsAdded,
                t.bankCode,
                `"${(t.content || "").replace(/"/g, '""')}"`,
            ]);
            const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `credits-transactions-audit-${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        if (!events.length) return;
        const headers = isVi
            ? ["Thoi_Gian", "Tien_Ich", "Ma_User", "Dia_Chi_IP", "Quoc_Gia", "So_Trang", "Thoi_Gian_Cho_s", "Nguong_Uoc_Tinh_s", "Bat_Thuong", "Diem_Rui_Ro"]
            : ["Timestamp", "Extension", "User_ID", "IP", "Country", "Pages", "Elapsed_s", "Est_Min_s", "Anomalies", "Risk_Score"];

        const rows = events.map((e) => [
            e.createdAt,
            e.extensionId,
            e.clientUserId,
            e.ip,
            e.country || "Unknown",
            e.pages || 1,
            e.elapsedSeconds,
            e.estimatedMinSeconds || 30,
            e.anomalies.join(" | ") || (isVi ? "Hop_Le" : "None"),
            e.riskScore,
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `telemetry-audit-${extensionId}-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Anomaly translation helper
    const translateAnomaly = (type: string) => {
        if (!isVi) return type;
        switch (type) {
            case "FAST_BYPASS":
                return "Vượt tốc độ động (< T_min)";
            case "MULTI_IP":
                return "Đổi nhiều IP";
            case "RATE_BURST":
                return "Tải dồn dập (Spam)";
            case "IP_FARM":
                return "Cày user ảo (1 IP)";
            case "DOC_SPAM":
                return "Tải lặp 1 tài liệu";
            case "MISSING_INIT":
                return "Không qua bước Init";
            case "TAMPERED_NONCE":
                return "Mã Nonce giả mạo";
            default:
                return type;
        }
    };

    // ==========================================
    // RENDER: LOGIN FORM (If not authenticated)
    // ==========================================
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#07090e] text-gray-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
                {/* Cyberpunk Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

                <div className="w-full max-w-md bg-[#0f1422]/90 border border-gray-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase flex items-center justify-center gap-2">
                            <span>{isVi ? "Cổng Xác Thực Quản Trị" : "Admin Vault Gate"}</span>
                        </h1>
                        <p className="text-xs text-gray-400 mt-2 tracking-wide font-mono">
                            {isVi ? "TRUNG TÂM GIÁM SÁT TELEMETRY & BẤT THƯỜNG" : "SECURE TELEMETRY & ANOMALY VAULT"}
                        </p>
                        <div className="inline-block mt-3 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                            {isVi ? "Mã hóa File Server AES-256-GCM" : "AES-256-GCM Encrypted Server File Storage"}
                        </div>
                    </div>

                    {loginError && (
                        <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-mono">
                            <span>⚠️</span>
                            <span>{loginError}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5">
                                {isVi ? "Tên Đăng Nhập Quản Trị" : "Master Admin ID"}
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="anytools_admin"
                                required
                                className="w-full px-4 py-3 bg-[#090d16] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5">
                                {isVi ? "Mật Khẩu Quản Trị" : "Master Password"}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••••••"
                                required
                                className="w-full px-4 py-3 bg-[#090d16] border border-gray-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isLoggingIn ? (
                                <span>{isVi ? "Đang xác thực chữ ký Master..." : "Verifying Master Signature..."}</span>
                            ) : (
                                <>
                                    <span>{isVi ? "Giải Mã & Truy Cập Darkboard" : "Decrypt & Access Darkboard"}</span>
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-800/80 text-center">
                        <div className="text-[11px] text-gray-500 font-mono">
                            {isVi ? "Bảo vệ bởi Giới Hạn Tần Suất IP & Tuyến Đường Mã Hóa Ẩn Danh" : "Protected by IP Rate Limiting & Dynamic Route Cloaking"}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // RENDER: DARKBOARD MAIN DASHBOARD
    // ==========================================
    return (
        <div className="min-h-screen bg-[#07090e] text-gray-100 font-sans pb-16">
            {/* Top Security Status Bar */}
            <header className="sticky top-0 z-40 bg-[#0c101d]/90 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-8 py-3.5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Brand & Security Badges */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                            <span className="text-lg">🛡️</span>
                        </div>
                        <div>
                            <h1 className="text-base font-black text-white uppercase tracking-wide">
                                {isVi ? "ANYTOOLS // BẢNG ĐIỀU KHIỂN" : "ANYTOOLS // DASHBOARD"}
                            </h1>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono mt-0.5">
                                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>{isVi ? "Trực tiếp" : "Live"}</span>
                                </span>
                                <span>•</span>
                                <span>{isVi ? "Cập nhật:" : "Updated:"} {lastUpdated || (isVi ? "Thời gian thực" : "Live")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls & Actions */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                        {/* Extension Selector */}
                        <select
                            value={extensionId}
                            onChange={(e) => setExtensionId(e.target.value)}
                            className="bg-[#121829] border border-gray-700/80 text-gray-200 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-cyan-500"
                        >
                            <option value="scribd-downloader">📑 Scribd Downloader</option>
                            <option value="studocu-downloader">🎓 Studocu Downloader</option>
                            <option value="all">{isVi ? "🌐 Tất cả tiện ích" : "🌐 All Extensions"}</option>
                        </select>

                        {/* Timeframe Selector */}
                        <div className="flex bg-[#121829] border border-gray-700/80 rounded-xl p-0.5 text-xs font-mono">
                            {[
                                { key: "1h", label: "1h" },
                                { key: "24h", label: isVi ? "Theo ngày" : "Today" },
                                { key: "7d", label: isVi ? "7 ngày" : "7d" },
                                { key: "30d", label: isVi ? "30 ngày" : "30d" },
                                { key: "all", label: isVi ? "Toàn bộ" : "All" },
                            ].map((tf) => (
                                <button
                                    key={tf.key}
                                    onClick={() => setTimeframe(tf.key as any)}
                                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                                        timeframe === tf.key
                                            ? "bg-cyan-500 text-white font-bold shadow-sm"
                                            : "text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {tf.label}
                                </button>
                            ))}
                        </div>

                        {/* Auto Refresh Toggle */}
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            title={isVi ? "Tự động làm mới mỗi 12 giây" : "Auto-refresh every 12s"}
                            className={`p-2 rounded-xl border text-xs transition-all ${
                                autoRefresh
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                    : "bg-gray-800/40 border-gray-700 text-gray-400"
                            }`}
                        >
                            <svg className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        {/* Export CSV */}
                        <button
                            onClick={handleExportCsv}
                            className="px-3 py-2 bg-[#121829] hover:bg-gray-800 border border-gray-700/80 text-gray-300 text-xs rounded-xl font-mono flex items-center gap-1.5 transition-all"
                        >
                            <span>📥</span>
                            <span>{isVi ? "Xuất Báo Cáo CSV" : "Audit CSV"}</span>
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs rounded-xl font-mono transition-all"
                        >
                            {isVi ? "Khóa Vault" : "Lock Vault"}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 space-y-6">

                {/* TOP MODULE SWITCHER: OVERVIEW, USERS, TELEMETRY DOWNLOADS, CREDIT TRANSACTIONS */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
                    <div className="flex flex-wrap items-center gap-2 bg-[#0e1322] border border-gray-800/80 rounded-2xl p-1.5 font-mono text-xs shadow-inner">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                                activeTab === "overview"
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <span>📈</span>
                            <span>{isVi ? "Tổng Quan & Tăng Trưởng" : "Overview & Growth"}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                                activeTab === "users"
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/20"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <span>👥</span>
                            <span>{isVi ? "Quản Lý Người Dùng (CRM)" : "Users Directory"}</span>
                            <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
                                {userStats?.totalUsers || 0}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab("telemetry")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                                activeTab === "telemetry"
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <span>⚡</span>
                            <span>{isVi ? "Lượt Tải & Bất Thường" : "Downloads & Security"}</span>
                            <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
                                {stats?.totalDownloads || 0}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab("transactions")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                                activeTab === "transactions"
                                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <span>💳</span>
                            <span>{isVi ? "Giao Dịch Nạp Credit" : "Transactions"}</span>
                            <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
                                {transactionStats?.totalTransactions || 0}
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                        <div className="flex items-center gap-1.5 text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl">
                            <span>User mới:</span>
                            <strong className="text-white font-bold">+{stats?.newUsersCount || 0}</strong>
                            <span className={`text-[10px] ${stats && stats.userGrowthPercentage >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                ({stats && stats.userGrowthPercentage >= 0 ? "+" : ""}{stats?.userGrowthPercentage || 0}%)
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                            <span>Doanh thu:</span>
                            <strong className="text-white font-bold">{(transactionStats?.totalRevenue || 0).toLocaleString()} đ</strong>
                        </div>
                    </div>
                </div>

                {/* OVERVIEW & EXECUTIVE GROWTH TAB */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        {/* 4 EXECUTIVE KPI CARDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Card 1: New Users & Growth */}
                            <div className="bg-[#0f1422] border border-purple-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-purple-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Người Dùng Mới" : "New Users"}</span>
                                    <span className="text-base">👥</span>
                                </div>
                                <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
                                    <span>+{stats?.newUsersCount || 0}</span>
                                    <span className={`text-xs font-mono font-bold ${
                                        (stats?.userGrowthPercentage ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                                    }`}>
                                        {(stats?.userGrowthPercentage ?? 0) >= 0 ? "↑ +" : "↓ "}
                                        {stats?.userGrowthPercentage || 0}%
                                    </span>
                                </div>
                                <div className="text-[11px] text-gray-400 font-mono mt-1 flex items-center justify-between">
                                    <span>{isVi ? "Lũy kế toàn bộ:" : "Total registered:"}</span>
                                    <strong className="text-purple-300 font-bold">{(userStats?.totalUsers || 0).toLocaleString()} users</strong>
                                </div>
                            </div>

                            {/* Card 2: Total Downloads & Free vs Instant */}
                            <div className="bg-[#0f1422] border border-cyan-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-cyan-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Tổng Lượt Tải" : "Total Downloads"}</span>
                                    <span className="text-base">⚡</span>
                                </div>
                                <div className="text-3xl font-black text-white mt-2">
                                    {(stats?.totalDownloads || 0).toLocaleString()}
                                </div>
                                <div className="text-[11px] text-gray-400 font-mono mt-1 flex items-center justify-between">
                                    <span className="text-blue-400">{stats?.freeDownloadsCount || 0} Free (30s)</span>
                                    <span>•</span>
                                    <span className="text-emerald-400">{stats?.creditDownloadsCount || 0} Credit</span>
                                </div>
                            </div>

                            {/* Card 3: Total Revenue & Conversion Rate */}
                            <div className="bg-[#0f1422] border border-emerald-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Doanh Thu Nạp Credit" : "Revenue"}</span>
                                    <span className="text-base">💰</span>
                                </div>
                                <div className="text-3xl font-black text-white mt-2">
                                    {(transactionStats?.totalRevenue || 0).toLocaleString()} <span className="text-base text-emerald-400">đ</span>
                                </div>
                                <div className="text-[11px] text-gray-400 font-mono mt-1 flex items-center justify-between">
                                    <span>CR: <strong className="text-emerald-300">{userStats?.conversionRate || 0}%</strong></span>
                                    <span>•</span>
                                    <span>{transactionStats?.totalTransactions || 0} GD ({userStats?.payingUsersCount || 0} khách)</span>
                                </div>
                            </div>

                            {/* Card 4: Anomalies & Fast Bypass */}
                            <div className="bg-[#0f1422] border border-rose-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-rose-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Cảnh Báo Bất Thường" : "Anomalies"}</span>
                                    <span className="text-base">🛡️</span>
                                </div>
                                <div className="text-3xl font-black text-rose-400 mt-2">
                                    {stats?.totalAnomalies || 0}{" "}
                                    <span className="text-xs font-mono text-gray-400">({stats?.anomalyPercentage || 0}%)</span>
                                </div>
                                <div className="text-[11px] text-gray-400 font-mono mt-1 flex items-center justify-between">
                                    <span className="text-orange-400">{stats?.fastBypassCount || 0} Bypass &lt;30s</span>
                                    <span>•</span>
                                    <span className="text-yellow-400">{stats?.multiIpCount || 0} Đa IP</span>
                                </div>
                            </div>
                        </div>

                        {/* ROW 1: COMBINED TIMELINE & 24H PEAK HEATMAP */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Combined Activity & User Timeline (2 cols) */}
                            <div className="lg:col-span-2 bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                            <span>{overviewChartType === "line" ? "📈" : "📊"}</span>
                                            <span>{isVi ? "Biểu Đồ Lượt Tải & Người Dùng Mới Theo Thời Gian" : "Downloads & New Users Timeline"}</span>
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {isVi ? "Tương quan trực quan giữa tải Free (30s), tải Credit và số lượng User mới" : "Free vs Credit downloads and new user registration trends"}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Chart Type Toggle */}
                                        <div className="flex bg-[#141b2d] p-0.5 rounded-xl border border-gray-800 text-[11px] font-mono">
                                            <button
                                                type="button"
                                                onClick={() => setOverviewChartType("line")}
                                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                                                    overviewChartType === "line"
                                                        ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30"
                                                        : "text-gray-400 hover:text-white"
                                                }`}
                                            >
                                                <span>📈</span>
                                                <span>{isVi ? "Đường Kẻ" : "Line"}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setOverviewChartType("bar")}
                                                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                                                    overviewChartType === "bar"
                                                        ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30"
                                                        : "text-gray-400 hover:text-white"
                                                }`}
                                            >
                                                <span>📊</span>
                                                <span>{isVi ? "Cột" : "Bars"}</span>
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                                            <span className="flex items-center gap-1.5 text-blue-400">
                                                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> {isVi ? "Tải Free" : "Free"}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-emerald-400">
                                                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> {isVi ? "Tải Credit" : "Credit"}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-purple-400">
                                                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> {isVi ? "User Mới" : "New User"}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-rose-400">
                                                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> {isVi ? "Bất thường" : "Anomaly"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {overviewChartType === "line" ? (
                                    /* DẠNG ĐƯỜNG KẺ (SVG LINE CHART) */
                                    <div ref={overviewChartContainerRef} className="h-56 w-full relative pt-2 pb-2 border-b border-gray-800">
                                        {stats?.timeline && stats.timeline.length > 0 ? (() => {
                                            const tl = stats.timeline;
                                            const N = tl.length;
                                            const maxVal = Math.max(
                                                ...tl.map((t) => Math.max(t.freeDownloads, t.creditDownloads, t.newUsers, t.anomalousDownloads)),
                                                5
                                            );
                                            const w = Math.max(300, overviewChartWidth);
                                            const h = 160;
                                            const paddingLeft = 38;
                                            const paddingRight = 16;
                                            const paddingTop = 15;
                                            const availableW = Math.max(100, w - paddingLeft - paddingRight);

                                            const freePts = tl.map((d, i) => ({
                                                x: paddingLeft + (i / Math.max(1, N - 1)) * availableW,
                                                y: paddingTop + h - (d.freeDownloads / maxVal) * h,
                                                val: d.freeDownloads,
                                                time: d.time,
                                            }));
                                            const creditPts = tl.map((d, i) => ({
                                                x: paddingLeft + (i / Math.max(1, N - 1)) * availableW,
                                                y: paddingTop + h - (d.creditDownloads / maxVal) * h,
                                                val: d.creditDownloads,
                                                time: d.time,
                                            }));
                                            const userPts = tl.map((d, i) => ({
                                                x: paddingLeft + (i / Math.max(1, N - 1)) * availableW,
                                                y: paddingTop + h - (d.newUsers / maxVal) * h,
                                                val: d.newUsers,
                                                time: d.time,
                                            }));
                                            const anomalyPts = tl.map((d, i) => ({
                                                x: paddingLeft + (i / Math.max(1, N - 1)) * availableW,
                                                y: paddingTop + h - (d.anomalousDownloads / maxVal) * h,
                                                val: d.anomalousDownloads,
                                                time: d.time,
                                            }));

                                            const pathFree = generateSmoothPath(freePts);
                                            const pathCredit = generateSmoothPath(creditPts);
                                            const pathUser = generateSmoothPath(userPts);
                                            const pathAnomaly = generateSmoothPath(anomalyPts);

                                            const areaUser = userPts.length > 0
                                                ? `${pathUser} L ${userPts[userPts.length - 1].x} ${paddingTop + h} L ${userPts[0].x} ${paddingTop + h} Z`
                                                : "";

                                            const activePt = hoveredOverviewIndex !== null && hoveredOverviewIndex < N ? tl[hoveredOverviewIndex] : null;
                                            const activeX = hoveredOverviewIndex !== null ? paddingLeft + (hoveredOverviewIndex / Math.max(1, N - 1)) * availableW : null;

                                            return (
                                                <div className="relative w-full h-full">
                                                    <svg viewBox={`0 0 ${w} ${h + 40}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                                        <defs>
                                                            <linearGradient id="userOverviewGrad" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                                                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                                                            </linearGradient>
                                                        </defs>

                                                        {/* Horizontal Grid lines */}
                                                        {[0, 0.25, 0.5, 0.75, 1].map((p, gIdx) => {
                                                            const y = paddingTop + h * (1 - p);
                                                            const valLabel = Math.round(maxVal * p);
                                                            return (
                                                                <g key={gIdx}>
                                                                    <line
                                                                        x1={paddingLeft}
                                                                        y1={y}
                                                                        x2={w - paddingRight}
                                                                        y2={y}
                                                                        stroke="#1f293d"
                                                                        strokeDasharray="4 4"
                                                                    />
                                                                    <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                                                                        {valLabel}
                                                                    </text>
                                                                </g>
                                                            );
                                                        })}

                                                        {/* Area glow under user growth line */}
                                                        {areaUser && <path d={areaUser} fill="url(#userOverviewGrad)" />}

                                                        {/* Dynamic Lines */}
                                                        <path d={pathFree} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                                                        <path d={pathCredit} fill="none" stroke="#10b981" strokeWidth="2.5" />
                                                        <path d={pathUser} fill="none" stroke="#c084fc" strokeWidth="3" style={{ filter: "drop-shadow(0 0 5px rgba(192, 132, 252, 0.6))" }} />
                                                        <path d={pathAnomaly} fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />

                                                        {/* Active vertical cursor line */}
                                                        {activeX !== null && (
                                                            <line
                                                                x1={activeX}
                                                                y1={paddingTop}
                                                                x2={activeX}
                                                                y2={paddingTop + h}
                                                                stroke="rgba(255,255,255,0.25)"
                                                                strokeDasharray="3 3"
                                                            />
                                                        )}

                                                        {/* Data dots for users */}
                                                        {userPts.map((p, i) => (
                                                            <circle
                                                                key={i}
                                                                cx={p.x}
                                                                cy={p.y}
                                                                r={hoveredOverviewIndex === i ? 5.5 : 2.5}
                                                                fill="#c084fc"
                                                                stroke="#0f1422"
                                                                strokeWidth="2"
                                                                className="transition-all"
                                                            />
                                                        ))}

                                                        {/* X-axis time marks */}
                                                        {tl.map((d, i) => {
                                                            if (N > 12 && i % 2 !== 0 && i !== N - 1) return null;
                                                            const x = paddingLeft + (i / Math.max(1, N - 1)) * availableW;
                                                            return (
                                                                <text
                                                                    key={i}
                                                                    x={x}
                                                                    y={paddingTop + h + 18}
                                                                    textAnchor="middle"
                                                                    fill="#64748b"
                                                                    fontSize="9"
                                                                    fontFamily="monospace"
                                                                >
                                                                    {d.time}
                                                                </text>
                                                            );
                                                        })}

                                                        {/* Invisible hover triggers per slice */}
                                                        {tl.map((_, i) => {
                                                            const sliceW = availableW / Math.max(1, N - 1);
                                                            const x1 = paddingLeft + (i - 0.5) * sliceW;
                                                            return (
                                                                <rect
                                                                    key={i}
                                                                    x={Math.max(paddingLeft, x1)}
                                                                    y={0}
                                                                    width={sliceW}
                                                                    height={h + paddingTop + 25}
                                                                    fill="transparent"
                                                                    className="cursor-pointer"
                                                                    onMouseEnter={() => setHoveredOverviewIndex(i)}
                                                                    onMouseLeave={() => setHoveredOverviewIndex(null)}
                                                                />
                                                            );
                                                        })}
                                                    </svg>

                                                    {/* Hover Floating Tooltip */}
                                                    {hoveredOverviewIndex !== null && activePt && activeX !== null && (
                                                        <div
                                                            style={{
                                                                left: `${(activeX / w) * 100}%`,
                                                                transform: "translateX(-50%)",
                                                            }}
                                                            className="absolute -top-16 bg-[#090d16] border border-gray-700 rounded-xl p-2 text-[10px] font-mono text-white pointer-events-none z-30 whitespace-nowrap shadow-2xl"
                                                        >
                                                            <div className="font-bold text-cyan-300 border-b border-gray-800 pb-1 mb-1">{activePt.time}</div>
                                                            <div className="text-purple-300">👥 User Mới: +{activePt.newUsers}</div>
                                                            <div className="text-blue-300">⚡ Free: {activePt.freeDownloads}</div>
                                                            <div className="text-emerald-300">💎 Credit: {activePt.creditDownloads}</div>
                                                            {activePt.anomalousDownloads > 0 && <div className="text-rose-400">🚨 Lỗi/Bypass: {activePt.anomalousDownloads}</div>}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })() : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
                                                {isVi ? "Chưa có dữ liệu lượt tải theo thời gian." : "No download timeline data."}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* DẠNG CỘT (STACKED MULTI-BAR CHART) */
                                    <div className="h-56 w-full flex items-end gap-2 pt-6 pb-2 border-b border-gray-800">
                                        {stats?.timeline && stats.timeline.length > 0 ? (
                                            stats.timeline.map((item, idx) => {
                                                const maxVal = Math.max(...stats.timeline.map((t) => (t.freeDownloads + t.creditDownloads + t.anomalousDownloads + t.newUsers)), 10);
                                                const freeH = (item.freeDownloads / maxVal) * 100;
                                                const creditH = (item.creditDownloads / maxVal) * 100;
                                                const anomalyH = (item.anomalousDownloads / maxVal) * 100;
                                                const userH = (item.newUsers / maxVal) * 100;

                                                return (
                                                    <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 group relative h-full justify-end">
                                                        {/* Hover Tooltip */}
                                                        <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-[#090d16] border border-gray-700 rounded-xl p-2 text-[10px] font-mono text-white pointer-events-none z-30 whitespace-nowrap shadow-xl">
                                                            <div className="font-bold text-cyan-300 border-b border-gray-800 pb-1 mb-1">{item.time}</div>
                                                            <div className="text-blue-300">⚡ Free: {item.freeDownloads}</div>
                                                            <div className="text-emerald-300">💎 Credit: {item.creditDownloads}</div>
                                                            <div className="text-purple-300">👥 User Mới: +{item.newUsers}</div>
                                                            {item.anomalousDownloads > 0 && <div className="text-rose-400">🚨 Lỗi/Bypass: {item.anomalousDownloads}</div>}
                                                        </div>

                                                        {/* User Indicator Pin */}
                                                        {item.newUsers > 0 && (
                                                            <div
                                                                style={{ height: `${Math.min(userH, 20)}%` }}
                                                                className="w-full bg-purple-500 rounded-t-sm opacity-90 group-hover:opacity-100 transition-all"
                                                                title={`+${item.newUsers} Users`}
                                                            ></div>
                                                        )}

                                                        {/* Anomaly Bar segment */}
                                                        {item.anomalousDownloads > 0 && (
                                                            <div
                                                                style={{ height: `${Math.min(anomalyH, 30)}%` }}
                                                                className="w-full bg-rose-500 transition-all group-hover:bg-rose-400"
                                                            ></div>
                                                        )}

                                                        {/* Credit Bar segment */}
                                                        {item.creditDownloads > 0 && (
                                                            <div
                                                                style={{ height: `${Math.min(creditH, 50)}%` }}
                                                                className="w-full bg-emerald-500 transition-all group-hover:bg-emerald-400"
                                                            ></div>
                                                        )}

                                                        {/* Free Bar segment */}
                                                        <div
                                                            style={{ height: `${Math.max(4, Math.min(freeH, 60))}%` }}
                                                            className="w-full bg-blue-500/80 rounded-b-sm transition-all group-hover:bg-blue-400"
                                                        ></div>

                                                        <span className="text-[9px] font-mono text-gray-500 truncate w-full text-center mt-1">
                                                            {item.time}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
                                                {isVi ? "Chưa có dữ liệu lượt tải theo thời gian." : "No download timeline data."}
                                            </div>
                                        )}
                                    </div>
                                )}


                                <div className="mt-3 flex flex-wrap items-center justify-between text-xs font-mono text-gray-400">
                                    <span>{isVi ? "Tỷ lệ Free / Credit:" : "Free / Credit Ratio:"} <strong className="text-white">{stats?.totalDownloads ? Math.round(((stats.freeDownloadsCount || 0) / stats.totalDownloads) * 100) : 100}% Free / {stats?.totalDownloads ? Math.round(((stats.creditDownloadsCount || 0) / stats.totalDownloads) * 100) : 0}% Credit</strong></span>
                                    <span className="text-cyan-400 font-bold">{isVi ? "Thời gian chờ TB:" : "Avg Wait:"} {stats?.averageWaitSeconds || 32}s</span>
                                </div>
                            </div>

                            {/* Right: 24-Hour Peak Activity Heatmap (1 col) */}
                            <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                            <span>⏰</span>
                                            <span>{isVi ? "Khung Giờ Cao Điểm (24h)" : "Hourly Peak Heatmap"}</span>
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {isVi ? "Lưu lượng tải phân bổ từ 00h đến 23h" : "Distribution across 24 hours of the day"}
                                        </p>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono">
                                        24h
                                    </span>
                                </div>

                                {/* 24 Vertical / Horizontal Heatmap Bars */}
                                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 pt-2">
                                    {stats?.hourlyDistribution && stats.hourlyDistribution.length > 0 ? (
                                        stats.hourlyDistribution.map((bucket) => {
                                            const maxH = Math.max(...stats.hourlyDistribution.map(b => b.totalDownloads), 1);
                                            const intensity = bucket.totalDownloads / maxH;
                                            const isPeak = intensity >= 0.75;
                                            const isMedium = intensity >= 0.4;

                                            return (
                                                <div
                                                    key={bucket.hour}
                                                    title={`${bucket.label}: ${bucket.totalDownloads} lượt tải (${bucket.percentage}%)`}
                                                    className={`p-2 rounded-xl border flex flex-col items-center justify-between transition-all hover:scale-105 cursor-pointer ${
                                                        isPeak
                                                            ? "bg-cyan-500/25 border-cyan-500/60 shadow-lg shadow-cyan-500/10 text-cyan-200"
                                                            : isMedium
                                                            ? "bg-blue-500/15 border-blue-500/30 text-blue-200"
                                                            : bucket.totalDownloads > 0
                                                            ? "bg-[#141b2d] border-gray-800 text-gray-300"
                                                            : "bg-[#0b0e17] border-gray-900 text-gray-600"
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-mono font-bold">{bucket.hour}h</span>
                                                    <span className={`text-xs font-mono font-black mt-1 ${isPeak ? "text-cyan-300" : ""}`}>
                                                        {bucket.totalDownloads}
                                                    </span>
                                                    <span className="text-[8px] font-mono text-gray-400 mt-0.5">
                                                        {bucket.percentage}%
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-8 text-center py-6 text-xs text-gray-500 font-mono">
                                            {isVi ? "Chưa có dữ liệu phân bổ theo giờ." : "No hourly distribution data."}
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 rounded-xl bg-[#141b2d] border border-cyan-500/20 text-xs font-mono text-gray-300">
                                    <span className="text-cyan-400 font-bold block mb-1">
                                        💡 {isVi ? "Nhận định cao điểm:" : "Peak Traffic Insight:"}
                                    </span>
                                    <span>
                                        {isVi
                                            ? "Lưu lượng tải thường tăng mạnh vào khung 14:00 - 16:30 và 20:00 - 23:00. Bạn có thể kích hoạt thông báo nạp credit hoặc kiểm tra server vào các khung giờ này."
                                            : "Traffic surges typically between 14:00 - 16:30 and 20:00 - 23:00. Optimal for promotional notifications."}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ROW 2: TOP DOWNLOADED DOCUMENTS & DAY OF WEEK ACTIVITY */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Top 10 Most Downloaded Documents (2 cols) */}
                            <div className="lg:col-span-2 bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                            <span>📑</span>
                                            <span>{isVi ? "Top 10 Tài Liệu Được Tải Nhiều Nhất" : "Top 10 Downloaded Documents"}</span>
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {isVi ? "Xếp hạng tài liệu theo mức độ quan tâm của người dùng" : "Ranked by download frequency and channel"}
                                        </p>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">
                                        {stats?.topDocuments?.length || 0} {isVi ? "tài liệu" : "docs"}
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs font-mono">
                                        <thead>
                                            <tr className="border-b border-gray-800 text-gray-400">
                                                <th className="pb-3 font-semibold">#</th>
                                                <th className="pb-3 font-semibold">{isVi ? "Tiêu Đề / Hash Tài Liệu" : "Document Title / Hash"}</th>
                                                <th className="pb-3 font-semibold text-center">{isVi ? "Lượt Tải" : "Downloads"}</th>
                                                <th className="pb-3 font-semibold">{isVi ? "Kênh Tải (Free vs Credit)" : "Download Channels"}</th>
                                                <th className="pb-3 font-semibold text-center">{isVi ? "Số Trang TB" : "Avg Pages"}</th>
                                                <th className="pb-3 font-semibold text-right">{isVi ? "Hành Động" : "Action"}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800/60">
                                            {stats?.topDocuments && stats.topDocuments.length > 0 ? (
                                                stats.topDocuments.map((doc, idx) => {
                                                    const freePct = Math.round((doc.freeCount / doc.totalDownloads) * 100);
                                                    const creditPct = 100 - freePct;
                                                    return (
                                                        <tr key={idx} className="hover:bg-gray-800/40 transition-colors">
                                                            <td className="py-3 text-gray-500 font-bold">{idx + 1}</td>
                                                            <td className="py-3 max-w-xs truncate text-white font-medium" title={doc.docTitle}>
                                                                <div className="flex flex-col">
                                                                    <span className="truncate">{doc.docTitle}</span>
                                                                    <span className="text-[10px] text-gray-500 truncate">{doc.docIdHash}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 text-center font-bold text-cyan-300">
                                                                {doc.totalDownloads}
                                                            </td>
                                                            <td className="py-3">
                                                                <div className="w-36 space-y-1">
                                                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden flex">
                                                                        <div style={{ width: `${freePct}%` }} className="bg-blue-500 h-full"></div>
                                                                        <div style={{ width: `${creditPct}%` }} className="bg-emerald-500 h-full"></div>
                                                                    </div>
                                                                    <div className="flex justify-between text-[9px] text-gray-400">
                                                                        <span>⚡ {doc.freeCount}</span>
                                                                        <span>💎 {doc.creditCount}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 text-center text-amber-300 font-bold">
                                                                {doc.avgPages} {isVi ? "trang" : "pgs"}
                                                            </td>
                                                            <td className="py-3 text-right">
                                                                <button
                                                                    onClick={() => {
                                                                        setSearchQuery(doc.docIdHash);
                                                                        setActiveTab("telemetry");
                                                                    }}
                                                                    className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-[10px] transition-all cursor-pointer"
                                                                >
                                                                    {isVi ? "Xem Log" : "View Logs"}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                                        {isVi ? "Chưa có dữ liệu tài liệu được tải." : "No document downloads recorded."}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Right: Day of Week & Device Breakdown (1 col) */}
                            <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm space-y-5">
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                        <span>📅</span>
                                        <span>{isVi ? "Phân Bổ Theo Ngày Trong Tuần" : "Day of Week Activity"}</span>
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {isVi ? "Lượt tải và doanh thu phát sinh theo từng ngày" : "Weekly downloads and revenue trends"}
                                    </p>

                                    <div className="mt-3 space-y-2 font-mono text-xs">
                                        {stats?.dayOfWeekDistribution && stats.dayOfWeekDistribution.length > 0 ? (
                                            stats.dayOfWeekDistribution.map((d, i) => (
                                                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-[#141b2d] border border-gray-800">
                                                    <span className="text-gray-300">{d.dayName}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-cyan-400 font-bold">{d.downloads} {isVi ? "tải" : "DL"}</span>
                                                        <span className="text-emerald-400 font-bold">{d.revenue.toLocaleString()} đ</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-xs text-gray-500 p-2">{isVi ? "Chưa có dữ liệu" : "No data"}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Top Countries */}
                                <div className="pt-3 border-t border-gray-800">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                                        <span>{isVi ? "Top Quốc Gia & Khu Vực" : "Top Geolocation"}</span>
                                        <span>🌍</span>
                                    </h4>
                                    <div className="space-y-1.5 text-xs">
                                        {stats?.topCountries && stats.topCountries.length > 0 ? (
                                            stats.topCountries.slice(0, 4).map((c, i) => (
                                                <div key={i} className="flex items-center justify-between text-gray-300 font-mono">
                                                    <span>{c.country}</span>
                                                    <span className="text-gray-400">{c.count} {isVi ? "lượt" : "hits"}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-500 text-xs">{isVi ? "Chưa có dữ liệu" : "No geo data"}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* USERS CRM & DIRECTORY TAB */}
                {activeTab === "users" && (
                    <div className="space-y-6">
                        {/* USER KPI CARDS (4 CARDS) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Card 1: Total Users */}
                            <div className="bg-[#0f1422] border border-purple-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-purple-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Tổng Người Dùng" : "Total Users"}</span>
                                    <span className="text-base">👥</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                                    {(userStats?.totalUsers || 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-1">
                                    {isVi ? "Tài khoản từ Sheet Credits_Users" : "All registered accounts"}
                                </div>
                            </div>

                            {/* Card 2: New Users in Window */}
                            <div className="bg-[#0f1422] border border-cyan-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-cyan-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "User Mới Trong Khung" : "New Registrations"}</span>
                                    <span className="text-base">✨</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-cyan-300 mt-2">
                                    +{userStats?.newUsersCount || 0}
                                </div>
                                <div className="text-[10px] text-emerald-400 font-mono mt-1">
                                    {(userStats?.newUsersGrowthPercentage ?? 0) >= 0 ? "+" : ""}
                                    {userStats?.newUsersGrowthPercentage || 0}% {isVi ? "so với kỳ trước" : "vs previous"}
                                </div>
                            </div>

                            {/* Card 3: Paying Customers */}
                            <div className="bg-[#0f1422] border border-emerald-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Khách Hàng Đã Nạp" : "Paying Users"}</span>
                                    <span className="text-base">💎</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-2">
                                    {(userStats?.payingUsersCount || 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-1">
                                    {isVi ? `Tỷ lệ chuyển đổi CR: ${userStats?.conversionRate || 0}%` : `Conversion: ${userStats?.conversionRate || 0}%`}
                                </div>
                            </div>

                            {/* Card 4: Credits in Circulation */}
                            <div className="bg-[#0f1422] border border-amber-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Credits Đang Lưu Hành" : "Circulating Credits"}</span>
                                    <span className="text-base">🪙</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-2">
                                    {(userStats?.totalCreditsInCirculation || 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-1">
                                    {isVi ? "Tổng số dư khả dụng của user" : "Remaining user credit balance"}
                                </div>
                            </div>
                        </div>

                        {/* USER GROWTH DEDICATED LINE CHART */}
                        <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                        <span className="text-purple-400">📈</span>
                                        <span>{isVi ? "Biểu Đồ Tăng Trưởng Người Dùng Mới (Line Chart)" : "New User Growth Trajectory"}</span>
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {isVi
                                            ? "Đường cong trực quan phân tích số lượng user mới đăng ký và tốc độ tăng trưởng tích lũy"
                                            : "Trajectory of new user registrations and cumulative base over time"}
                                    </p>
                                </div>

                                {/* Metric Mode Switch */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex bg-[#141b2d] p-0.5 rounded-xl border border-gray-800 text-[11px] font-mono">
                                        <button
                                            type="button"
                                            onClick={() => setUserChartMetric("both")}
                                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                                                userChartMetric === "both"
                                                    ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30"
                                                    : "text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            {isVi ? "🔀 Cả Hai Đường" : "Dual Axis"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUserChartMetric("new_users")}
                                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                                                userChartMetric === "new_users"
                                                    ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30"
                                                    : "text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            {isVi ? "🟣 User Mới" : "New Users"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUserChartMetric("cumulative")}
                                            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                                                userChartMetric === "cumulative"
                                                    ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30"
                                                    : "text-gray-400 hover:text-white"
                                            }`}
                                        >
                                            {isVi ? "📈 Lũy Kế" : "Cumulative"}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3 text-[11px] font-mono ml-1">
                                        {(userChartMetric === "new_users" || userChartMetric === "both") && (
                                            <span className="flex items-center gap-1.5 text-purple-400">
                                                <span className="w-2.5 h-0.5 bg-purple-400"></span> {isVi ? "User Mới (+N)" : "New Users"}
                                            </span>
                                        )}
                                        {(userChartMetric === "cumulative" || userChartMetric === "both") && (
                                            <span className="flex items-center gap-1.5 text-cyan-400">
                                                <span className="w-2.5 h-0.5 bg-cyan-400"></span> {isVi ? "Tổng Lũy Kế" : "Cumulative Total"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Metric Quick Stats Bar */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#121829] p-3 rounded-xl border border-gray-800/80 text-xs font-mono">
                                <div>
                                    <span className="text-gray-500 block text-[10px] uppercase">{isVi ? "User Mới Trong Kỳ" : "New In Period"}</span>
                                    <strong className="text-purple-300 font-bold text-sm">+{userStats?.newUsersCount || 0} users</strong>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-[10px] uppercase">{isVi ? "Tỷ Lệ Tăng Trưởng" : "Growth Rate"}</span>
                                    <strong className={`font-bold text-sm ${((userStats?.newUsersGrowthPercentage ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400")}`}>
                                        {(userStats?.newUsersGrowthPercentage ?? 0) >= 0 ? "+" : ""}{userStats?.newUsersGrowthPercentage || 0}%
                                    </strong>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-[10px] uppercase">{isVi ? "Tỷ Lệ Nạp Tiền (CR)" : "Conversion Rate"}</span>
                                    <strong className="text-emerald-400 font-bold text-sm">{userStats?.conversionRate || 0}%</strong>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-[10px] uppercase">{isVi ? "Tổng Khách Toàn Hệ Thống" : "Total Database"}</span>
                                    <strong className="text-cyan-300 font-bold text-sm">{(userStats?.totalUsers || 0).toLocaleString()} users</strong>
                                </div>
                            </div>

                            {/* SVG Line Chart Canvas */}
                            <div ref={userChartContainerRef} className="h-64 w-full relative pt-2 pb-2">
                                {(() => {
                                    const uTimeline = (userStats?.timeline && userStats.timeline.length > 0)
                                        ? userStats.timeline
                                        : (stats?.timeline?.map(t => ({
                                            time: t.time,
                                            newUsers: t.newUsers,
                                            activeUsers: 1,
                                            cumulativeUsers: t.newUsers
                                        })) || []);

                                    if (uTimeline.length === 0) {
                                        return (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
                                                {isVi ? "Chưa có dữ liệu tăng trưởng người dùng trong khung thời gian này." : "No user growth data in timeframe."}
                                            </div>
                                        );
                                    }

                                    const N = uTimeline.length;
                                    const maxNew = Math.max(...uTimeline.map(d => d.newUsers), 4);
                                    const maxCum = Math.max(...uTimeline.map(d => d.cumulativeUsers ?? d.newUsers), 10);
                                    const w = Math.max(300, userChartWidth);
                                    const h = 180;
                                    const paddingLeft = 42;
                                    const paddingRight = 16;
                                    const paddingTop = 20;
                                    const availableW = Math.max(100, w - paddingLeft - paddingRight);

                                    const userPts = uTimeline.map((d, i) => ({
                                        x: paddingLeft + (i / Math.max(1, N - 1)) * availableW,
                                        y: paddingTop + h - (d.newUsers / maxNew) * h,
                                        val: d.newUsers,
                                        time: d.time,
                                    }));

                                    const cumPts = uTimeline.map((d, i) => ({
                                        x: paddingLeft + (i / Math.max(1, N - 1)) * availableW,
                                        y: paddingTop + h - ((d.cumulativeUsers ?? d.newUsers) / maxCum) * h,
                                        val: d.cumulativeUsers ?? d.newUsers,
                                        time: d.time,
                                    }));

                                    const pathUser = generateSmoothPath(userPts);
                                    const pathCum = generateSmoothPath(cumPts);

                                    const areaUser = userPts.length > 0
                                        ? `${pathUser} L ${userPts[userPts.length - 1].x} ${paddingTop + h} L ${userPts[0].x} ${paddingTop + h} Z`
                                        : "";
                                    const areaCum = cumPts.length > 0
                                        ? `${pathCum} L ${cumPts[cumPts.length - 1].x} ${paddingTop + h} L ${cumPts[0].x} ${paddingTop + h} Z`
                                        : "";

                                    const activePt = hoveredUserChartIndex !== null && hoveredUserChartIndex < N ? uTimeline[hoveredUserChartIndex] : null;
                                    const activeX = hoveredUserChartIndex !== null ? paddingLeft + (hoveredUserChartIndex / Math.max(1, N - 1)) * availableW : null;

                                    return (
                                        <div className="relative w-full h-full">
                                            <svg viewBox={`0 0 ${w} ${h + 45}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="userGrowthAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                                                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                                                    </linearGradient>
                                                    <linearGradient id="userCumAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                                                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                                                    </linearGradient>
                                                </defs>

                                                {/* Horizontal Grid lines */}
                                                {[0, 0.25, 0.5, 0.75, 1].map((p, gIdx) => {
                                                    const y = paddingTop + h * (1 - p);
                                                    const valLabel = userChartMetric === "cumulative" ? Math.round(maxCum * p) : Math.round(maxNew * p);
                                                    return (
                                                        <g key={gIdx}>
                                                            <line
                                                                x1={paddingLeft}
                                                                y1={y}
                                                                x2={w - paddingRight}
                                                                y2={y}
                                                                stroke="#1f293d"
                                                                strokeDasharray="4 4"
                                                            />
                                                            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                                                                {valLabel}
                                                            </text>
                                                        </g>
                                                    );
                                                })}

                                                {/* Area glow under curve */}
                                                {(userChartMetric === "cumulative" || userChartMetric === "both") && areaCum && (
                                                    <path d={areaCum} fill="url(#userCumAreaGrad)" />
                                                )}
                                                {(userChartMetric === "new_users" || userChartMetric === "both") && areaUser && (
                                                    <path d={areaUser} fill="url(#userGrowthAreaGrad)" />
                                                )}

                                                {/* Glowing Curves */}
                                                {(userChartMetric === "cumulative" || userChartMetric === "both") && (
                                                    <path
                                                        d={pathCum}
                                                        fill="none"
                                                        stroke="#38bdf8"
                                                        strokeWidth="2.5"
                                                        style={{ filter: "drop-shadow(0 0 6px rgba(56, 189, 248, 0.5))" }}
                                                    />
                                                )}
                                                {(userChartMetric === "new_users" || userChartMetric === "both") && (
                                                    <path
                                                        d={pathUser}
                                                        fill="none"
                                                        stroke="#c084fc"
                                                        strokeWidth="3.2"
                                                        style={{ filter: "drop-shadow(0 0 8px rgba(192, 132, 252, 0.7))" }}
                                                    />
                                                )}

                                                {/* Hover Vertical Cursor Line */}
                                                {activeX !== null && (
                                                    <line
                                                        x1={activeX}
                                                        y1={paddingTop}
                                                        x2={activeX}
                                                        y2={paddingTop + h}
                                                        stroke="rgba(255,255,255,0.3)"
                                                        strokeDasharray="3 3"
                                                    />
                                                )}

                                                {/* Interactive Data Dots (New Users) */}
                                                {(userChartMetric === "new_users" || userChartMetric === "both") &&
                                                    userPts.map((p, i) => (
                                                        <circle
                                                            key={`u-${i}`}
                                                            cx={p.x}
                                                            cy={p.y}
                                                            r={hoveredUserChartIndex === i ? 6 : 3}
                                                            fill="#c084fc"
                                                            stroke="#0f1422"
                                                            strokeWidth="2.5"
                                                            className="transition-all"
                                                        />
                                                    ))}

                                                {/* Interactive Data Dots (Cumulative) */}
                                                {(userChartMetric === "cumulative" || userChartMetric === "both") &&
                                                    cumPts.map((p, i) => (
                                                        <circle
                                                            key={`c-${i}`}
                                                            cx={p.x}
                                                            cy={p.y}
                                                            r={hoveredUserChartIndex === i ? 5.5 : 2.5}
                                                            fill="#38bdf8"
                                                            stroke="#0f1422"
                                                            strokeWidth="2"
                                                            className="transition-all"
                                                        />
                                                    ))}

                                                {/* X-axis time marks */}
                                                {uTimeline.map((d, i) => {
                                                    if (N > 12 && i % 2 !== 0 && i !== N - 1) return null;
                                                    const x = paddingLeft + (i / Math.max(1, N - 1)) * availableW;
                                                    return (
                                                        <text
                                                            key={i}
                                                            x={x}
                                                            y={paddingTop + h + 18}
                                                            textAnchor="middle"
                                                            fill="#64748b"
                                                            fontSize="9"
                                                            fontFamily="monospace"
                                                        >
                                                            {d.time}
                                                        </text>
                                                    );
                                                })}

                                                {/* Invisible slice triggers for mouse interaction */}
                                                {uTimeline.map((_, i) => {
                                                    const sliceW = availableW / Math.max(1, N - 1);
                                                    const x1 = paddingLeft + (i - 0.5) * sliceW;
                                                    return (
                                                        <rect
                                                            key={i}
                                                            x={Math.max(paddingLeft, x1)}
                                                            y={0}
                                                            width={sliceW}
                                                            height={h + paddingTop + 25}
                                                            fill="transparent"
                                                            className="cursor-pointer"
                                                            onMouseEnter={() => setHoveredUserChartIndex(i)}
                                                            onMouseLeave={() => setHoveredUserChartIndex(null)}
                                                        />
                                                    );
                                                })}
                                            </svg>

                                            {/* Hover Floating Tooltip */}
                                            {hoveredUserChartIndex !== null && activePt && activeX !== null && (
                                                <div
                                                    style={{
                                                        left: `${(activeX / w) * 100}%`,
                                                        transform: "translateX(-50%)",
                                                    }}
                                                    className="absolute -top-16 bg-[#090d16] border border-purple-500/50 rounded-xl p-2.5 text-[11px] font-mono text-white pointer-events-none z-30 whitespace-nowrap shadow-2xl"
                                                >
                                                    <div className="font-bold text-cyan-300 border-b border-gray-800 pb-1 mb-1">
                                                        🕒 {activePt.time}
                                                    </div>
                                                    <div className="text-purple-300 font-bold">
                                                        🟣 User Mới: +{activePt.newUsers}
                                                    </div>
                                                    {activePt.cumulativeUsers !== undefined && (
                                                        <div className="text-cyan-300 text-[10px]">
                                                            📈 Lũy kế: {activePt.cumulativeUsers.toLocaleString()} users
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* USER SEGMENTATION PILLS */}
                        <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                            <span className="text-gray-400 font-bold uppercase">{isVi ? "Phân khúc người dùng:" : "User Segments:"}</span>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => setUserFilter("all")}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                        userFilter === "all" ? "bg-purple-600 text-white font-bold" : "bg-[#141b2d] text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {isVi ? "Tất cả" : "All"} ({userStats?.totalUsers || 0})
                                </button>
                                <button
                                    onClick={() => setUserFilter("paying")}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                        userFilter === "paying" ? "bg-emerald-600 text-white font-bold" : "bg-[#141b2d] text-gray-400 hover:text-white"
                                    }`}
                                >
                                    💎 {isVi ? "Đã Nạp Tiền" : "Paying"} ({userStats?.segmentation?.paying || 0})
                                </button>
                                <button
                                    onClick={() => setUserFilter("new")}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                        userFilter === "new" ? "bg-cyan-600 text-white font-bold" : "bg-[#141b2d] text-gray-400 hover:text-white"
                                    }`}
                                >
                                    ✨ {isVi ? "Tân Thủ Mới" : "New In Timeframe"} ({userStats?.newUsersCount || 0})
                                </button>
                                <button
                                    onClick={() => setUserFilter("high_credits")}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                        userFilter === "high_credits" ? "bg-amber-600 text-white font-bold" : "bg-[#141b2d] text-gray-400 hover:text-white"
                                    }`}
                                >
                                    ⚡ {isVi ? "Nhiều Credit (≥10)" : "High Credits"}
                                </button>
                                <button
                                    onClick={() => setUserFilter("risk")}
                                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                        userFilter === "risk" ? "bg-rose-600 text-white font-bold" : "bg-[#141b2d] text-gray-400 hover:text-white"
                                    }`}
                                >
                                    🚨 {isVi ? "Đáng Ngờ (Risk)" : "Risk Flags"}
                                </button>
                            </div>
                        </div>

                        {/* USER DIRECTORY TABLE */}
                        <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                        <span>👥</span>
                                        <span>{isVi ? "Danh Sách Người Dùng & Sổ Cái CRM (Credits_Users)" : "Users Directory & CRM"}</span>
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        {isVi ? "Dữ liệu người dùng được đồng bộ tự động từ Google Sheets" : "Synced directly from Google Sheets"}
                                    </p>
                                </div>

                                {/* Search in Users */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={isVi ? "Tìm User ID, IP, Thành phố..." : "Search User ID, IP, City..."}
                                        className="w-full sm:w-64 px-3 py-1.5 bg-[#121829] border border-gray-700/80 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-2.5 top-1.5 text-gray-500 hover:text-white text-xs cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead>
                                        <tr className="border-b border-gray-800 text-gray-400">
                                            <th className="pb-3 font-semibold">{isVi ? "Mã User ID" : "User ID"}</th>
                                            <th className="pb-3 font-semibold text-center">{isVi ? "Số Dư Credit" : "Credits"}</th>
                                            <th className="pb-3 font-semibold text-center">{isVi ? "Tổng Đã Tải" : "Total Downloads"}</th>
                                            <th className="pb-3 font-semibold">{isVi ? "Tổng Chi Tiêu" : "Total Spent"}</th>
                                            <th className="pb-3 font-semibold">{isVi ? "IP Đăng Ký & Địa Điểm" : "Created IP & Geo"}</th>
                                            <th className="pb-3 font-semibold">{isVi ? "Ngày Tham Gia" : "Joined At"}</th>
                                            <th className="pb-3 font-semibold">{isVi ? "Phân Loại" : "Status"}</th>
                                            <th className="pb-3 font-semibold text-right">{isVi ? "Hồ Sơ" : "Profile"}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/60">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user, idx) => (
                                                <tr key={`${user.userId}-${user.createdIp}-${idx}`} className="hover:bg-gray-800/40 transition-colors">
                                                    <td className="py-3 font-bold text-white whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                                            <span>{user.userId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-center whitespace-nowrap">
                                                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                                            user.credits >= 10
                                                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                                                : user.credits > 0
                                                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                                                : "bg-gray-800 text-gray-400"
                                                        }`}>
                                                            {user.credits} cr
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-center text-gray-300 font-bold whitespace-nowrap">
                                                        {user.totalDownloaded}
                                                    </td>
                                                    <td className="py-3 whitespace-nowrap">
                                                        {user.isPaying ? (
                                                            <span className="text-emerald-400 font-bold">
                                                                {user.totalSpentVnd.toLocaleString()} đ ({user.transactionCount} GD)
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500">0 đ (Free)</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 text-gray-300 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-cyan-300">{user.createdIp}</span>
                                                            <span className="text-[10px] text-gray-500">
                                                                {user.city ? `${user.city}, ` : ""}{user.country || "Chưa xác định"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-gray-400 whitespace-nowrap">
                                                        {new Date(user.createdAt).toLocaleDateString(isVi ? "vi-VN" : "en-US")}
                                                    </td>
                                                    <td className="py-3 whitespace-nowrap">
                                                        <div className="flex flex-wrap gap-1">
                                                            {user.isPaying && (
                                                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                                                                    VIP
                                                                </span>
                                                            )}
                                                            {user.isNewInTimeframe && (
                                                                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-bold">
                                                                    MỚI
                                                                </span>
                                                            )}
                                                            {user.riskFlags.length > 0 && (
                                                                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold">
                                                                    CẢNH BÁO
                                                                </span>
                                                            )}
                                                            {!user.isPaying && !user.isNewInTimeframe && user.riskFlags.length === 0 && (
                                                                <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 text-[9px]">
                                                                    FREE
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <button
                                                            onClick={() => setSelectedUser(user)}
                                                            className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-[10px] transition-all cursor-pointer font-bold"
                                                        >
                                                            {isVi ? "Hồ Sơ" : "Profile"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="py-8 text-center text-gray-500">
                                                    {isVi ? "Không tìm thấy người dùng nào phù hợp." : "No users match criteria."}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TELEMETRY VIEW */}
                {activeTab === "telemetry" && (
                    <div className="space-y-6">
                        {/* 🚨 CRITICAL ANOMALY ALERT TICKER */}
                {stats && stats.totalAnomalies > 0 && (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/70 via-rose-950/50 to-orange-950/60 border border-red-500/40 p-4 sm:p-5 shadow-xl shadow-red-950/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3.5 w-3.5 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                                </span>
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-red-200 flex items-center gap-2">
                                        <span>{isVi ? "CẢNH BÁO BẤT THƯỜNG:" : "ANOMALY WARNING:"}</span>
                                        <span>
                                            {isVi
                                                ? `Phát hiện ${stats.totalAnomalies} hành vi đáng ngờ trong khung ${timeframe}`
                                                : `${stats.totalAnomalies} suspicious actions detected in ${timeframe}`}
                                        </span>
                                    </h3>
                                    <p className="text-xs text-red-300/80 mt-0.5">
                                        {isVi
                                            ? `Ghi nhận ${stats.fastBypassCount} lượt tải Free bỏ qua 30s đếm ngược & ${stats.multiIpCount} người dùng nhảy qua nhiều địa chỉ IP.`
                                            : `Detected ${stats.fastBypassCount} free downloads bypassing mandatory 30s countdown & ${stats.multiIpCount} users jumping across multiple IPs.`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => setStatusFilter("fast_bypass")}
                                    className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-mono font-bold transition-all"
                                >
                                    {isVi ? `Lọc Tải Free < 30s (${stats.fastBypassCount})` : `Filter Fast Bypass (${stats.fastBypassCount})`}
                                </button>
                                <button
                                    onClick={() => setStatusFilter("multi_ip")}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold transition-all"
                                >
                                    {isVi ? `Lọc User Đổi IP (${stats.multiIpCount})` : `Filter Multi-IP (${stats.multiIpCount})`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* KPI METRIC CARDS (6 CARDS) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {/* Card 1: Total Downloads */}
                    <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-4 shadow-sm">
                        <div className="text-[11px] font-mono uppercase text-gray-400">
                            {isVi ? "Tổng Lượt Tải" : "Total Downloads"}
                        </div>
                        <div className="text-2xl font-black text-white mt-1">
                            {stats?.totalDownloads.toLocaleString() || 0}
                        </div>
                        <div className="text-[10px] font-mono mt-1 flex items-center justify-between">
                            <span className="text-blue-400 font-bold">⚡ {stats?.freeDownloadsCount || 0} Free</span>
                            <span className="text-emerald-400 font-bold">💎 {stats?.creditDownloadsCount || 0} Cr</span>
                        </div>
                    </div>

                    {/* Card 2: Total Anomalies */}
                    <div className="bg-[#0f1422] border border-red-900/40 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/10 rounded-bl-full"></div>
                        <div className="text-[11px] font-mono uppercase text-red-300">
                            {isVi ? "Phát Hiện Bất Thường" : "Anomalies Detected"}
                        </div>
                        <div className="text-2xl font-black text-red-400 mt-1">
                            {stats?.totalAnomalies.toLocaleString() || 0}
                        </div>
                        <div className="text-[10px] text-red-400/80 font-mono mt-1">
                            {isVi ? `${stats?.anomalyPercentage || 0}% trên tổng lưu lượng` : `${stats?.anomalyPercentage || 0}% of all traffic`}
                        </div>
                    </div>

                    {/* Card 3: 30s Fast Bypass Violations */}
                    <div className="bg-[#0f1422] border border-orange-900/40 rounded-2xl p-4 shadow-sm">
                        <div className="text-[11px] font-mono uppercase text-orange-300">
                            {isVi ? "Gian Lận < 30s (Free)" : "< 30s Fast Bypass (Free)"}
                        </div>
                        <div className="text-2xl font-black text-orange-400 mt-1">
                            {stats?.fastBypassCount.toLocaleString() || 0}
                        </div>
                        <div className="text-[10px] text-orange-400/80 font-mono mt-1">
                            {isVi ? "Bỏ qua đếm ngược tải Free" : "Free 30s timer bypassed"}
                        </div>
                    </div>

                    {/* Card 4: Multi-IP Users */}
                    <div className="bg-[#0f1422] border border-yellow-900/40 rounded-2xl p-4 shadow-sm">
                        <div className="text-[11px] font-mono uppercase text-yellow-300">
                            {isVi ? "User Đổi Nhiều IP" : "Multi-IP Abusers"}
                        </div>
                        <div className="text-2xl font-black text-yellow-400 mt-1">
                            {stats?.multiIpCount.toLocaleString() || 0}
                        </div>
                        <div className="text-[10px] text-yellow-400/80 font-mono mt-1">
                            {isVi ? "≥ 3 IP mỗi tài khoản" : "≥ 3 IPs per User"}
                        </div>
                    </div>

                    {/* Card 5: Active Unique Users */}
                    <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-4 shadow-sm">
                        <div className="text-[11px] font-mono uppercase text-gray-400">
                            {isVi ? "User Hoạt Động" : "Unique Users"}
                        </div>
                        <div className="text-2xl font-black text-white mt-1">
                            {stats?.activeUsersCount.toLocaleString() || 0}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-1">
                            {isVi ? `${stats?.flaggedUsersCount || 0} user bị gắn cờ` : `${stats?.flaggedUsersCount || 0} flagged users`}
                        </div>
                    </div>

                    {/* Card 6: Average Wait Time */}
                    <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-4 shadow-sm">
                        <div className="text-[11px] font-mono uppercase text-gray-400">
                            {isVi ? "Thời Gian Chờ TB" : "Avg Wait Time"}
                        </div>
                        <div className="text-2xl font-black text-cyan-400 mt-1">
                            {stats?.averageWaitSeconds || 32.5}s
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-1">
                            {isVi ? "Free: 30s + init | Credit: Init only" : "Free: 30s + init | Credit: Init only"}
                        </div>
                    </div>
                </div>



                {/* CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Activity Timeline (2 cols) */}
                    <div className="lg:col-span-2 bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-white tracking-wide">
                                    {isVi ? "Dòng Thời Gian Hoạt Động & Đột Biến Bất Thường" : "Activity & Anomaly Spikes Timeline"}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {isVi ? "Tương quan giữa lượt tải bình thường và các yêu cầu đáng ngờ theo thời gian" : "Normal downloads vs anomalous requests over time"}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-[11px] font-mono">
                                <span className="flex items-center gap-1.5 text-emerald-400">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> {isVi ? "Bình thường" : "Normal"}
                                </span>
                                <span className="flex items-center gap-1.5 text-red-400">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span> {isVi ? "Bất thường" : "Anomalies"}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Bar Timeline */}
                        <div className="h-48 w-full flex items-end gap-2 pt-6 pb-2 border-b border-gray-800">
                            {stats?.timeline && stats.timeline.length > 0 ? (
                                stats.timeline.map((item, idx) => {
                                    const total = item.normalDownloads + item.anomalousDownloads;
                                    const normalH = total > 0 ? Math.max(8, (item.normalDownloads / 20) * 100) : 4;
                                    const anomalyH = total > 0 ? Math.max(8, (item.anomalousDownloads / 20) * 100) : 0;
                                    return (
                                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                                             {/* Tooltip */}
                                            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-[10px] font-mono text-white pointer-events-none z-20 whitespace-nowrap shadow-lg">
                                                {isVi ? "Thời gian:" : "Time:"} {item.time} | {isVi ? "Chuẩn:" : "Normal:"} {item.normalDownloads} | {isVi ? "Lỗi:" : "Anomaly:"} {item.anomalousDownloads}
                                            </div>

                                            {/* Anomaly Bar segment */}
                                            {item.anomalousDownloads > 0 && (
                                                <div
                                                    style={{ height: `${Math.min(anomalyH, 60)}%` }}
                                                    className="w-full bg-red-500 rounded-t-sm transition-all group-hover:bg-red-400"
                                                ></div>
                                            )}
                                            {/* Normal Bar segment */}
                                            <div
                                                style={{ height: `${Math.min(normalH, 80)}%` }}
                                                className="w-full bg-emerald-500/80 rounded-t-sm transition-all group-hover:bg-emerald-400"
                                            ></div>
                                            <span className="text-[9px] font-mono text-gray-500 truncate w-full text-center mt-1">
                                                {item.time}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
                                    {isVi ? "Đang thu thập dữ liệu thời gian thực..." : "Collecting telemetry timeline data..."}
                                </div>
                            )}
                        </div>

                        {/* Dynamic Safety Threshold Gauge */}
                        <div className="mt-4 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-orange-400 font-mono font-bold">
                                    {isVi ? "Quy định an toàn:" : "Rule Boundary:"}
                                </span>
                                <span className="text-gray-300 text-[11px]">
                                    {isVi
                                        ? "Mô hình ước tính động: T_min = 30.0s đếm ngược + thời gian init data (tỷ lệ thuận theo số trang tài liệu và tài liệu tiếp theo). Vi phạm khi Δt < T_min."
                                        : "Dynamic estimation model: T_min = 30.0s countdown + data init latency (scaled by current & next doc pages). Flagged when Δt < T_min."}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-mono">
                                <span className="text-red-400 font-bold">
                                    {stats?.fastBypassCount || 0} {isVi ? "vụ vi phạm" : "violations"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Anomaly Type & Geo Distribution (1 col) */}
                    <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm space-y-5">
                        <div>
                            <h3 className="text-sm font-bold text-white tracking-wide">
                                {isVi ? "Phân Loại Bất Thường" : "Anomaly Breakdown"}
                            </h3>
                            <p className="text-xs text-gray-400">
                                {isVi ? "Phân tích bởi Anomaly Engine" : "Classified by Anomaly Engine"}
                            </p>

                            <div className="mt-3 space-y-2 font-mono text-xs">
                                <div className="flex items-center justify-between p-2 rounded-xl bg-[#141b2d] border border-red-500/20">
                                    <span className="text-red-300">{isVi ? "Vượt tốc độ động (< T_min)" : "FAST_BYPASS (< T_min)"}</span>
                                    <span className="font-bold text-red-400">{stats?.anomalyBreakdown?.FAST_BYPASS || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-xl bg-[#141b2d] border border-yellow-500/20">
                                    <span className="text-yellow-300">{isVi ? "Đổi nhiều IP (Proxy)" : "MULTI_IP (Hopping)"}</span>
                                    <span className="font-bold text-yellow-400">{stats?.anomalyBreakdown?.MULTI_IP || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-xl bg-[#141b2d] border border-orange-500/20">
                                    <span className="text-orange-300">{isVi ? "Tải dồn dập (Spam/Cào)" : "RATE_BURST (Spam)"}</span>
                                    <span className="font-bold text-orange-400">{stats?.anomalyBreakdown?.RATE_BURST || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded-xl bg-[#141b2d] border border-purple-500/20">
                                    <span className="text-purple-300">{isVi ? "Cày user ảo trên 1 IP" : "IP_FARM (Botnet)"}</span>
                                    <span className="font-bold text-purple-400">{stats?.anomalyBreakdown?.IP_FARM || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Countries */}
                        <div className="pt-3 border-t border-gray-800">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                                {isVi ? "Top Quốc Gia & Khu Vực" : "Top Geolocation"}
                            </h4>
                            <div className="space-y-1.5 text-xs">
                                {stats?.topCountries && stats.topCountries.length > 0 ? (
                                    stats.topCountries.slice(0, 4).map((c, i) => (
                                        <div key={i} className="flex items-center justify-between text-gray-300">
                                            <span>{c.country}</span>
                                            <span className="font-mono text-gray-400">{c.count} {isVi ? "lượt tải" : "downloads"}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-xs">{isVi ? "Chưa có dữ liệu" : "No geo data"}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TOP ABUSERS & SUSPICIOUS ENTITIES RADAR */}
                {stats?.topAbusers && stats.topAbusers.length > 0 && (
                    <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                    <span>🎯 {isVi ? "Đối tượng Nghi vấn & Tải nhiều nhất" : "Top Flagged Entities & Heavy Downloaders"}</span>
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {isVi
                                        ? "Người dùng có điểm rủi ro cao nhất, xoay proxy hoặc cố tình bypass tốc độ"
                                        : "Users exhibiting highest risk scores, proxy usage, or speed bypasses"}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead>
                                    <tr className="border-b border-gray-800 text-gray-400">
                                        <th className="pb-3 font-semibold">{isVi ? "Mã Client User ID" : "Client User ID"}</th>
                                        <th className="pb-3 font-semibold">{isVi ? "Điểm Rủi Ro" : "Risk Score"}</th>
                                        <th className="pb-3 font-semibold">{isVi ? "Cờ Vi Phạm" : "Flagged Anomalies"}</th>
                                        <th className="pb-3 font-semibold">{isVi ? "IP Ghi Nhận" : "Recorded IPs"}</th>
                                        <th className="pb-3 font-semibold">{isVi ? "Lượt Tải" : "Downloads"}</th>
                                        <th className="pb-3 font-semibold">{isVi ? "Hoạt Động Gần Nhất" : "Last Active"}</th>
                                        <th className="pb-3 font-semibold text-right">{isVi ? "Hành Động" : "Inspect"}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/60">
                                    {stats.topAbusers.map((abuser, idx) => (
                                        <tr key={idx} className="hover:bg-gray-800/40 transition-colors">
                                            <td className="py-3 font-bold text-white">{abuser.clientUserId}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    abuser.riskScore >= 75
                                                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                                                        : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                                                }`}>
                                                    {abuser.riskScore}/100
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {abuser.anomalies.map((an, i) => (
                                                        <span key={i} className="px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded text-[9px]">
                                                            {translateAnomaly(an)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 text-cyan-300">
                                                {abuser.ips.length} IPs ({abuser.ips.slice(0, 2).join(", ")}{abuser.ips.length > 2 ? "..." : ""})
                                            </td>
                                            <td className="py-3 text-gray-300">{abuser.totalDownloads}</td>
                                            <td className="py-3 text-gray-400">
                                                {new Date(abuser.lastSeen).toLocaleTimeString(isVi ? "vi-VN" : "en-US")}
                                            </td>
                                            <td className="py-3 text-right">
                                                <button
                                                    onClick={() => setSearchQuery(abuser.clientUserId)}
                                                    className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-[10px] transition-all"
                                                >
                                                    {isVi ? "Xem Nhật Ký" : "View Logs"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* LIVE TELEMETRY LOG EXPLORER TABLE */}
                <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-bold text-white tracking-wide">
                                {isVi ? "Nhật Ký Sự Kiện Telemetry & Kiểm Toán Thời Gian Thực" : "Live Telemetry Event Logs & Audit Trail"}
                            </h3>
                            <p className="text-xs text-gray-400">
                                {isVi
                                    ? "Kiểm tra chi tiết từng phiên handshake, thời gian chờ thực tế và dấu vết client"
                                    : "Full inspection of handshake sessions, exact elapsed times, and client footprints"}
                            </p>
                        </div>

                        {/* Search & Status Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={isVi ? "Tìm User ID, IP, tài liệu..." : "Search User ID, IP, Doc..."}
                                    className="bg-[#121829] border border-gray-700/80 rounded-xl px-3 py-1.5 pl-8 text-xs text-gray-200 placeholder-gray-500 font-mono focus:outline-none focus:border-cyan-500 w-52 sm:w-64"
                                />
                                <span className="absolute left-2.5 top-2 text-gray-500 text-xs">🔍</span>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-2.5 top-1.5 text-gray-500 hover:text-white text-xs"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Status Filter Buttons */}
                            <div className="flex flex-wrap bg-[#121829] border border-gray-700/80 rounded-xl p-0.5 text-xs font-mono">
                                {[
                                    { key: "all", label: isVi ? "Tất cả" : "All" },
                                    { key: "credit_only", label: isVi ? "💎 Credit" : "Credit" },
                                    { key: "free_only", label: isVi ? "⚡ Free" : "Free" },
                                    { key: "anomalies_only", label: isVi ? "Bất thường" : "Anomalies" },
                                    { key: "fast_bypass", label: isVi ? "Vượt Tốc Độ" : "Fast Bypass" },
                                    { key: "multi_ip", label: isVi ? "Nhiều IP" : "Multi-IP" },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setStatusFilter(tab.key as any)}
                                        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                            statusFilter === tab.key
                                                ? "bg-cyan-500 text-white font-bold"
                                                : "text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400">
                                    <th className="pb-3 font-semibold">{isVi ? "Thời Gian" : "Timestamp"}</th>
                                    <th className="pb-3 font-semibold">{isVi ? "Tiện Ích" : "Extension"}</th>
                                    <th className="pb-3 font-semibold">{isVi ? "Mã User ID" : "Client User ID"}</th>
                                    <th className="pb-3 font-semibold">{isVi ? "Địa Chỉ IP" : "IP Address"}</th>
                                    <th className="pb-3 font-semibold">{isVi ? "Khu Vực / Trình Duyệt" : "Geo / Browser"}</th>
                                    <th className="pb-3 font-semibold">{isVi ? "Số Trang & Thời Gian (Δt)" : "Pages & Elapsed (Δt)"}</th>
                                    <th className="pb-3 font-semibold">{isVi ? "Cờ Bất Thường" : "Anomaly Flags"}</th>
                                    <th className="pb-3 font-semibold">{isVi ? "Rủi Ro" : "Risk"}</th>
                                    <th className="pb-3 font-semibold text-right">{isVi ? "Chi Tiết" : "Details"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {events.length > 0 ? (
                                    events.map((event, idx) => {
                                        const isFastBypass = event.anomalies.includes("FAST_BYPASS");
                                        const isAnomalous = event.anomalies.length > 0;
                                        const requiredMin = event.estimatedMinSeconds || 30;
                                        return (
                                            <tr
                                                key={`${event.id}-${idx}`}
                                                className={`hover:bg-gray-800/40 transition-colors ${
                                                    isFastBypass
                                                        ? "bg-red-950/20"
                                                        : isAnomalous
                                                        ? "bg-amber-950/10"
                                                        : ""
                                                }`}
                                            >
                                                <td className="py-3 text-gray-400 whitespace-nowrap">
                                                    {new Date(event.createdAt).toLocaleTimeString(isVi ? "vi-VN" : "en-US")}
                                                </td>
                                                <td className="py-3 text-gray-300 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <span>{event.extensionId}</span>
                                                        {event.downloadType === "credit" ? (
                                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                                💎 Credit
                                                            </span>
                                                        ) : (
                                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                                ⚡ Free (30s)
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 font-bold text-white whitespace-nowrap">
                                                    {event.clientUserId.slice(0, 14)}...
                                                </td>
                                                <td className="py-3 text-cyan-300 whitespace-nowrap">
                                                    {event.ip}
                                                </td>
                                                <td className="py-3 text-gray-300 whitespace-nowrap">
                                                    {event.country || "Unknown"} ({event.browser})
                                                </td>
                                                <td className="py-3 whitespace-nowrap">
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                                                isFastBypass
                                                                    ? "bg-red-500/20 text-red-300 border border-red-500/40"
                                                                    : event.elapsedSeconds >= requiredMin
                                                                    ? "bg-emerald-500/20 text-emerald-300"
                                                                    : "bg-gray-800 text-gray-300"
                                                            }`}>
                                                                {event.elapsedSeconds > 0 ? `${event.elapsedSeconds}s` : "Init"}
                                                            </span>
                                                            <span className="text-[10px] text-amber-300/80 font-mono">
                                                                {event.pages || 1} {isVi ? "trang" : "pgs"}
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] text-gray-500 font-mono">
                                                            {event.downloadType === "credit"
                                                                ? (isVi ? `Init: ≥ ${requiredMin}s (Bỏ qua 30s)` : `Init only: ≥ ${requiredMin}s`)
                                                                : (isVi ? `Yêu cầu: ≥ ${requiredMin}s (30s + init)` : `Min req: ≥ ${requiredMin}s`)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    {event.anomalies.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {event.anomalies.map((a, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                                                        a === "FAST_BYPASS"
                                                                            ? "bg-red-600 text-white"
                                                                            : "bg-amber-500/30 text-amber-200 border border-amber-500/40"
                                                                    }`}
                                                                >
                                                                    {translateAnomaly(a)}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-emerald-400/80 text-[11px]">
                                                            {isVi ? "✅ Đạt chuẩn" : "✅ Compliant"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3">
                                                    <span className={`font-bold ${
                                                        event.riskScore >= 75
                                                            ? "text-red-400"
                                                            : event.riskScore >= 40
                                                            ? "text-yellow-400"
                                                            : "text-gray-500"
                                                    }`}>
                                                        {event.riskScore}/100
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right">
                                                    <button
                                                        onClick={() => setSelectedEvent(event)}
                                                        className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-[10px] transition-all"
                                                    >
                                                        {isVi ? "Xem" : "Inspect"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="py-8 text-center text-gray-500">
                                            {isVi ? "Không có sự kiện nào khớp với tiêu chí đã chọn." : "No events match the selected criteria."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            )}

                {/* CREDIT TRANSACTIONS VIEW */}
                {activeTab === "transactions" && (
                    <div className="space-y-6">
                        {/* FINANCIAL KPI CARDS (4 CARDS) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Card 1: Total Revenue */}
                            <div className="bg-[#0f1422] border border-emerald-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Tổng Doanh Thu" : "Total Revenue"}</span>
                                    <span className="text-base">💰</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                                    {(transactionStats?.totalRevenue || 0).toLocaleString()} <span className="text-base text-emerald-400 font-bold">đ</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-1">
                                    {isVi ? `Ghi nhận trong khung: ${timeframe}` : `Logged in timeframe: ${timeframe}`}
                                </div>
                            </div>

                            {/* Card 2: Total Transactions */}
                            <div className="bg-[#0f1422] border border-cyan-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-cyan-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Số Giao Dịch Nạp" : "Total Transactions"}</span>
                                    <span className="text-base">🧾</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-cyan-300 mt-2">
                                    {(transactionStats?.totalTransactions || 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-1">
                                    {isVi ? "Giao dịch thành công" : "Successful payments"}
                                </div>
                            </div>

                            {/* Card 3: Total Credits Added */}
                            <div className="bg-[#0f1422] border border-amber-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Credits Đã Bán" : "Credits Purchased"}</span>
                                    <span className="text-base">⚡</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-2">
                                    {(transactionStats?.totalCreditsAdded || 0).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-1">
                                    {isVi ? "Lượt tải nhanh đã cấp" : "Fast download credits"}
                                </div>
                            </div>

                            {/* Card 4: Average Order Value */}
                            <div className="bg-[#0f1422] border border-purple-500/30 rounded-2xl p-5 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full"></div>
                                <div className="text-[11px] font-mono uppercase text-purple-400 font-bold flex items-center justify-between">
                                    <span>{isVi ? "Giá Trị Đơn TB (AOV)" : "Average Order (AOV)"}</span>
                                    <span className="text-base">📈</span>
                                </div>
                                <div className="text-2xl sm:text-3xl font-black text-purple-300 mt-2">
                                    {(transactionStats?.averageTransactionValue || 0).toLocaleString()} <span className="text-base text-purple-400 font-bold">đ</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-1">
                                    {isVi ? "Trung bình / lượt nạp" : "Per transaction average"}
                                </div>
                            </div>
                        </div>

                        {/* CHARTS: REVENUE TIMELINE & BANK DISTRIBUTION */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Revenue Timeline (2 cols) */}
                            <div className="lg:col-span-2 bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                            <span>📊</span>
                                            <span>{isVi ? "Dòng Doanh Thu Nạp Credit Theo Thời Gian" : "Revenue Timeline & Volume"}</span>
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {isVi ? "Doanh số và khối lượng giao dịch mua credits theo từng mốc thời gian" : "Revenue and purchase volume over time"}
                                        </p>
                                    </div>
                                    <div className="text-xs font-mono text-emerald-400 font-bold">
                                        {(transactionStats?.totalRevenue || 0).toLocaleString()} đ
                                    </div>
                                </div>

                                {/* Timeline Bar Chart */}
                                <div className="h-48 w-full flex items-end gap-2 pt-6 pb-2 border-b border-gray-800">
                                    {transactionStats?.timeline && transactionStats.timeline.length > 0 ? (
                                        transactionStats.timeline.map((item, idx) => {
                                            const maxRev = Math.max(...transactionStats.timeline.map((t) => t.revenue), 1);
                                            const h = Math.max(8, (item.revenue / maxRev) * 100);
                                            return (
                                                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-[10px] font-mono text-white pointer-events-none z-20 whitespace-nowrap shadow-lg">
                                                        {item.time} | {item.revenue.toLocaleString()} đ ({item.transactionsCount} GD / {item.creditsCount} cr)
                                                    </div>
                                                    <div
                                                        style={{ height: `${Math.min(h, 85)}%` }}
                                                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-sm transition-all group-hover:from-emerald-500 group-hover:to-teal-300"
                                                    ></div>
                                                    <span className="text-[9px] font-mono text-gray-500 truncate w-full text-center mt-1">
                                                        {item.time}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-mono">
                                            {isVi ? "Chưa có dữ liệu dòng doanh thu trong khoảng thời gian này." : "No transaction timeline data for this timeframe."}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs text-gray-400 font-mono">
                                    <span>{isVi ? "Kênh tích hợp: SePay, Casso, Buy Me a Coffee" : "Payment Gateways: SePay, Casso, Buy Me a Coffee"}</span>
                                    <span className="text-emerald-400 font-bold">{transactionStats?.totalCreditsAdded || 0} credits</span>
                                </div>
                            </div>

                            {/* Bank Breakdown & Top Spenders (1 col) */}
                            <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm space-y-5">
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                        <span>🏦</span>
                                        <span>{isVi ? "Kênh & Ngân Hàng Thanh Toán" : "Payment Gateways"}</span>
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {isVi ? "Phân bổ phương thức thanh toán" : "Gateway distribution"}
                                    </p>

                                    <div className="mt-3 space-y-2 font-mono text-xs">
                                        {transactionStats && Object.keys(transactionStats.bankBreakdown).length > 0 ? (
                                            Object.entries(transactionStats.bankBreakdown).map(([bank, data]) => (
                                                <div key={bank} className="flex items-center justify-between p-2 rounded-xl bg-[#141b2d] border border-gray-800">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                                                        <span className="text-white font-bold">{bank}</span>
                                                        <span className="text-gray-400 text-[10px]">({data.count} GD)</span>
                                                    </div>
                                                    <span className="font-bold text-emerald-400">{data.totalAmount.toLocaleString()} đ</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-xs text-gray-500 p-2">
                                                {isVi ? "Chưa có giao dịch" : "No gateway data"}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Top Spenders */}
                                <div className="pt-2 border-t border-gray-800">
                                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                                        <span>{isVi ? "Top Khách Hàng Nạp Nhiều" : "Top Purchasers"}</span>
                                        <span>💎</span>
                                    </h4>
                                    <div className="space-y-1.5 font-mono text-xs">
                                        {transactionStats && transactionStats.topSpenders.length > 0 ? (
                                            transactionStats.topSpenders.slice(0, 5).map((s, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-[#141b2d]/60 text-[11px]">
                                                    <span className="text-cyan-300 truncate max-w-[120px]">{s.userId}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-amber-400">+{s.totalCredits} cr</span>
                                                        <span className="font-bold text-white">{s.totalSpent.toLocaleString()} đ</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-xs text-gray-500 py-1">
                                                {isVi ? "Chưa có dữ liệu người nạp" : "No purchaser data"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TRANSACTIONS LEDGER TABLE */}
                        <div className="bg-[#0f1422] border border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                                        <span>🧾</span>
                                        <span>{isVi ? "Sổ Cái Giao Dịch Mua Credit (Credits_Transactions)" : "Credit Transactions Ledger"}</span>
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        {isVi ? "Dữ liệu thời gian thực được đồng bộ từ Google Sheets" : "Real-time ledger synced from Google Sheets"}
                                    </p>
                                </div>

                                {/* Search in Transactions */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={isVi ? "Tìm mã GD, User ID, Bank..." : "Search Trans ID, User, Bank..."}
                                        className="w-full sm:w-64 px-3 py-1.5 bg-[#121829] border border-gray-700/80 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-2.5 top-1.5 text-gray-500 hover:text-white text-xs cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono">
                                    <thead>
                                        <tr className="border-b border-gray-800 text-gray-400">
                                            <th className="pb-3 font-semibold">{isVi ? "Thời Gian" : "Timestamp"}</th>
                                            <th className="pb-3 font-semibold">{isVi ? "Mã Giao Dịch" : "Trans ID"}</th>
                                            <th className="pb-3 font-semibold">{isVi ? "Mã User ID" : "User ID"}</th>
                                            <th className="pb-3 font-semibold">{isVi ? "Số Tiền (VND)" : "Amount (VND)"}</th>
                                            <th className="pb-3 font-semibold">{isVi ? "Credits Nhận" : "Credits Added"}</th>
                                            <th className="pb-3 font-semibold">{isVi ? "Kênh / Ngân Hàng" : "Gateway / Bank"}</th>
                                            <th className="pb-3 font-semibold">{isVi ? "Nội Dung Chuyển Khoản" : "Content / Memo"}</th>
                                            <th className="pb-3 font-semibold text-right">{isVi ? "Chi Tiết" : "Action"}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800/60">
                                        {transactions.length > 0 ? (
                                            transactions.map((tx, idx) => (
                                                <tr key={`${tx.id}-${idx}`} className="hover:bg-gray-800/40 transition-colors">
                                                    <td className="py-3 text-gray-400 whitespace-nowrap">
                                                        {new Date(tx.createdAt).toLocaleString(isVi ? "vi-VN" : "en-US")}
                                                    </td>
                                                    <td className="py-3 font-bold text-white whitespace-nowrap">
                                                        {tx.id}
                                                    </td>
                                                    <td className="py-3 text-cyan-300 font-bold whitespace-nowrap">
                                                        {tx.userId}
                                                    </td>
                                                    <td className="py-3 text-emerald-400 font-bold whitespace-nowrap">
                                                        +{tx.amount.toLocaleString()} đ
                                                    </td>
                                                    <td className="py-3 whitespace-nowrap">
                                                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30">
                                                            +{tx.creditsAdded} cr
                                                        </span>
                                                    </td>
                                                    <td className="py-3 whitespace-nowrap">
                                                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30">
                                                            {tx.bankCode}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-gray-300 max-w-xs truncate" title={tx.content}>
                                                        {tx.content || "—"}
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <button
                                                            onClick={() => setSelectedTransaction(tx)}
                                                            className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-[10px] transition-all cursor-pointer"
                                                        >
                                                            {isVi ? "Xem" : "Inspect"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="py-12 text-center text-gray-500">
                                                    <div className="flex flex-col items-center justify-center gap-2">
                                                        <span className="text-3xl">💳</span>
                                                        <span className="text-sm font-bold text-gray-400">
                                                            {isVi ? "Chưa có giao dịch nạp tiền nào được ghi nhận" : "No credit purchase transactions recorded"}
                                                        </span>
                                                        <span className="text-xs text-gray-500 max-w-md">
                                                            {isVi
                                                                ? "Dữ liệu từ Google Sheet 'Credits_Transactions' sẽ tự động hiển thị tại đây khi người dùng nạp tiền qua cổng thanh toán."
                                                                : "Transactions logged in Google Sheet 'Credits_Transactions' will automatically appear here."}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* EVENT DETAIL FORENSIC MODAL */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-[#0f1422] border border-gray-700 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span>🔬 {isVi ? "Phân Tích Pháp Y Sự Kiện Telemetry" : "Event Forensic Breakdown"}</span>
                                    {selectedEvent.anomalies.length > 0 && (
                                        <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono">
                                            {isVi ? "Rủi ro:" : "Risk:"} {selectedEvent.riskScore}/100
                                        </span>
                                    )}
                                </h3>
                                <p className="text-xs text-gray-400 font-mono">ID: {selectedEvent.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Tiện ích & Loại yêu cầu" : "Extension & Type"}</div>
                                <div className="text-white font-bold mt-0.5 flex items-center gap-2">
                                    <span>{selectedEvent.extensionId}</span>
                                    {selectedEvent.downloadType === "credit" || selectedEvent.meta?.downloadType === "credit" ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                            💎 {isVi ? "Tải Credit (Bỏ qua 30s)" : "Credit Download (Skip 30s)"}
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            ⚡ {isVi ? "Tải Free (Chờ 30s)" : "Free Download (30s Wait)"}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Mã Client User ID" : "Client User ID"}</div>
                                <div className="text-cyan-300 font-bold mt-0.5 truncate">{selectedEvent.clientUserId}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Địa chỉ IP & Khu vực" : "Client IP & Geolocation"}</div>
                                <div className="text-white mt-0.5 truncate">{selectedEvent.ip} ({selectedEvent.city ? `${selectedEvent.city}, ` : ""}{selectedEvent.country})</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Thời gian chờ thực tế (Δt)" : "Waiting Elapsed Time (Δt)"}</div>
                                <div className={`font-bold mt-0.5 ${
                                    selectedEvent.elapsedSeconds < (selectedEvent.estimatedMinSeconds || (selectedEvent.downloadType === "credit" ? 3 : 30))
                                        ? "text-red-400"
                                        : "text-emerald-400"
                                }`}>
                                    {selectedEvent.elapsedSeconds}s (
                                        {isVi
                                            ? (selectedEvent.downloadType === "credit"
                                                ? `T_min khởi tạo: ≥ ${selectedEvent.estimatedMinSeconds || 3}s (Không chờ 30s)`
                                                : `T_min ước tính: ≥ ${selectedEvent.estimatedMinSeconds || 33}s (30s đếm ngược + init)`)
                                            : (selectedEvent.downloadType === "credit"
                                                ? `Est init min: ≥ ${selectedEvent.estimatedMinSeconds || 3}s (0s countdown)`
                                                : `Est min: ≥ ${selectedEvent.estimatedMinSeconds || 33}s (30s + init)`)
                                        }
                                    )
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Số trang tài liệu (Hiện tại / Trước)" : "Document Pages (Current / Prev)"}</div>
                                <div className="text-amber-300 font-bold mt-0.5">
                                    {selectedEvent.pages || 1} {isVi ? "trang" : "pgs"}
                                    {selectedEvent.meta?.prevDocPages ? (
                                        <span className="text-gray-400 font-normal ml-1">
                                            ({isVi ? "Trước:" : "Prev:"} {selectedEvent.meta.prevDocPages} {isVi ? "trang" : "pgs"})
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 font-normal ml-1">
                                            ({isVi ? "Lượt đầu tiên" : "First download"})
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Tỷ lệ tốc độ hoàn thành" : "Completion Speed Ratio"}</div>
                                <div className={`font-bold mt-0.5 ${(selectedEvent.meta?.speedRatioPercentage ?? 100) < 100 ? "text-red-400" : "text-emerald-400"}`}>
                                    {selectedEvent.meta?.speedRatioPercentage ?? 100}%
                                    <span className="text-[10px] text-gray-400 font-normal ml-1.5">
                                        ({selectedEvent.elapsedSeconds}s / {selectedEvent.estimatedMinSeconds || 30}s)
                                    </span>
                                </div>
                            </div>

                            {/* Consecutive download timestamps */}
                            <div className="p-3 rounded-xl bg-[#141b2d] sm:col-span-2">
                                <div className="text-gray-400">{isVi ? "Mốc thời gian bắt đầu liên tiếp (t_prev → t_curr)" : "Consecutive Start Timestamps (t_prev → t_curr)"}</div>
                                <div className="text-gray-300 text-[11px] mt-1 flex flex-wrap items-center gap-2">
                                    <span>
                                        {isVi ? "Bắt đầu tài liệu trước:" : "Prev start:"}{" "}
                                        <strong className="text-white">
                                            {selectedEvent.meta?.prevDownloadAt
                                                ? new Date(selectedEvent.meta.prevDownloadAt).toLocaleTimeString(isVi ? "vi-VN" : "en-US")
                                                : (isVi ? "Chưa có lượt trước" : "None")}
                                        </strong>
                                    </span>
                                    <span className="text-gray-500">→</span>
                                    <span>
                                        {isVi ? "Bắt đầu tài liệu này:" : "Current start:"}{" "}
                                        <strong className="text-white">
                                            {new Date(selectedEvent.createdAt).toLocaleTimeString(isVi ? "vi-VN" : "en-US")}
                                        </strong>
                                    </span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-cyan-300">
                                        Δt = {selectedEvent.elapsedSeconds}s
                                    </span>
                                </div>
                            </div>

                            {/* Dynamic Physical Principle Note */}
                            <div className="p-3 rounded-xl bg-[#161c2e] border border-cyan-500/20 sm:col-span-2 text-[11px] text-gray-300 leading-relaxed">
                                <span className="text-cyan-400 font-bold block mb-1">
                                    💡 {isVi ? "Mô hình ước tính vật lý động (Dynamic Physical Model):" : "Dynamic Physical Model:"}
                                </span>
                                {isVi ? (
                                    <div className="space-y-1 text-gray-300">
                                        <p>
                                            • <strong className="text-blue-300">Tải Miễn Phí (Free):</strong> Ngưỡng tối thiểu <code>T_min = 30s (đếm ngược bắt buộc) + thời gian init data</code> (tỷ lệ thuận theo số trang tài liệu). Hoàn thành &lt; 30s bị cắm cờ Fast Bypass.
                                        </p>
                                        <p>
                                            • <strong className="text-emerald-300">Tải bằng Credit (Premium):</strong> Bỏ qua hoàn toàn bộ đếm 30s (<code>countdown = 0s</code>), người dùng chỉ cần chờ thời gian init data thực tế để chuẩn bị dữ liệu (khoảng 2-5s tùy số trang).
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1 text-gray-300">
                                        <p>
                                            • <strong className="text-blue-300">Free Download:</strong> Minimum threshold <code>T_min = 30s (mandatory countdown) + page init latency</code> (canvas & manifest caching). Downloads under 30s are flagged as Fast Bypass.
                                        </p>
                                        <p>
                                            • <strong className="text-emerald-300">Credit Download:</strong> Completely bypasses the 30s timer (<code>countdown = 0s</code>), only requiring physical document init data latency (~2-5s depending on pages).
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="p-3 rounded-xl bg-[#141b2d] sm:col-span-2">
                                <div className="text-gray-400">{isVi ? "Mã Nonce Handshake" : "Handshake Session Nonce"}</div>
                                <div className="text-gray-300 text-[11px] mt-0.5 truncate">
                                    {selectedEvent.sessionNonce || (isVi ? "KHÔNG CÓ NONCE (Yêu cầu trực tiếp chưa qua xác thực)" : "MISSING_NONCE (Unverified direct request)")}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d] sm:col-span-2">
                                <div className="text-gray-400">{isVi ? "Hash / Tiêu đề tài liệu" : "Document Hash / Title"}</div>
                                <div className="text-gray-200 mt-0.5 break-all">{selectedEvent.docTitle || selectedEvent.docIdHash}</div>
                            </div>
                        </div>

                        {/* Raw JSON inspection */}
                        <div>
                            <div className="text-xs font-mono text-gray-400 mb-1">
                                {isVi ? "Dữ liệu Payload Gốc (JSON Telemetry):" : "Raw Telemetry Payload:"}
                            </div>
                            <pre className="p-3 rounded-xl bg-[#090d16] border border-gray-800 text-[11px] font-mono text-gray-300 overflow-x-auto max-h-48">
                                {JSON.stringify(selectedEvent, null, 2)}
                            </pre>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-mono cursor-pointer"
                            >
                                {isVi ? "Đóng" : "Close"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TRANSACTION DETAIL FORENSIC MODAL */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-xl bg-[#0f1422] border border-gray-700 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-mono">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <span>💳 {isVi ? "Chi Tiết Giao Dịch Mua Credit" : "Credit Purchase Audit"}</span>
                                </h3>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {selectedTransaction.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTransaction(null)}
                                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Mã Khách Hàng (User ID)" : "User ID"}</div>
                                <div className="text-cyan-300 font-bold mt-1 text-sm">{selectedTransaction.userId}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Số Tiền Thanh Toán" : "Payment Amount"}</div>
                                <div className="text-emerald-400 font-bold mt-1 text-sm">
                                    {selectedTransaction.amount.toLocaleString()} đ
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Credits Được Cộng" : "Credits Added"}</div>
                                <div className="text-amber-400 font-bold mt-1 text-sm">+{selectedTransaction.creditsAdded} credits</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Ngân Hàng / Kênh" : "Bank / Gateway"}</div>
                                <div className="text-white font-bold mt-1">{selectedTransaction.bankCode}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d] col-span-2">
                                <div className="text-gray-400">{isVi ? "Thời Gian Ghi Nhận" : "Timestamp"}</div>
                                <div className="text-gray-200 mt-1">
                                    {new Date(selectedTransaction.createdAt).toLocaleString(isVi ? "vi-VN" : "en-US")}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d] col-span-2">
                                <div className="text-gray-400">{isVi ? "Nội Dung Chuyển Khoản" : "Transfer Memo"}</div>
                                <div className="text-gray-200 mt-1 break-all bg-[#090d16] p-2.5 rounded-lg border border-gray-800">
                                    {selectedTransaction.content || (isVi ? "Không có nội dung" : "No memo")}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-mono text-gray-400 mb-1">
                                {isVi ? "Dữ liệu Payload Gốc (JSON):" : "Raw JSON Data:"}
                            </div>
                            <pre className="p-3 rounded-xl bg-[#090d16] border border-gray-800 text-[11px] font-mono text-gray-300 overflow-x-auto max-h-36">
                                {JSON.stringify(selectedTransaction, null, 2)}
                            </pre>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedTransaction(null)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-mono cursor-pointer"
                            >
                                {isVi ? "Đóng" : "Close"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* USER PROFILE FORENSIC MODAL */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-[#0f1422] border border-gray-700 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-mono">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-lg font-bold">
                                    👤
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        <span>{isVi ? "Hồ Sơ & Kiểm Toán Người Dùng" : "User Profile & Forensic Audit"}</span>
                                        {selectedUser.isPaying && (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                                                💎 VIP
                                            </span>
                                        )}
                                        {selectedUser.riskFlags.length > 0 && (
                                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px]">
                                                ⚠️ Risk
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-mono mt-0.5">UID: {selectedUser.userId}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* User Summary Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-[#141b2d] border border-cyan-500/20">
                                <div className="text-gray-400 text-[10px] uppercase">{isVi ? "Số Dư Credit" : "Credits Balance"}</div>
                                <div className="text-cyan-300 font-black text-lg mt-1">{selectedUser.credits} cr</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d] border border-blue-500/20">
                                <div className="text-gray-400 text-[10px] uppercase">{isVi ? "Tổng Đã Tải" : "Total Downloaded"}</div>
                                <div className="text-blue-300 font-black text-lg mt-1">{selectedUser.totalDownloaded}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d] border border-emerald-500/20">
                                <div className="text-gray-400 text-[10px] uppercase">{isVi ? "Tổng Tiền Đã Nạp" : "Total Spent"}</div>
                                <div className="text-emerald-400 font-black text-lg mt-1">{selectedUser.totalSpentVnd.toLocaleString()} đ</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d] border border-purple-500/20">
                                <div className="text-gray-400 text-[10px] uppercase">{isVi ? "Số Lần Nạp" : "Transactions"}</div>
                                <div className="text-purple-300 font-black text-lg mt-1">{selectedUser.transactionCount} GD</div>
                            </div>
                        </div>

                        {/* User Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "IP Đăng Ký Ban Đầu" : "Registration IP"}</div>
                                <div className="text-white mt-1 font-bold">{selectedUser.createdIp}</div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Vị Trí Địa Lý" : "Location"}</div>
                                <div className="text-white mt-1 font-bold">
                                    {selectedUser.city ? `${selectedUser.city}, ` : ""}{selectedUser.country || "Chưa xác định"}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Ngày Tham Gia Hệ Thống" : "Registered At"}</div>
                                <div className="text-gray-200 mt-1">
                                    {new Date(selectedUser.createdAt).toLocaleString(isVi ? "vi-VN" : "en-US")}
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#141b2d]">
                                <div className="text-gray-400">{isVi ? "Lần Hoạt Động Gần Nhất" : "Last Activity"}</div>
                                <div className="text-gray-200 mt-1">
                                    {new Date(selectedUser.updatedAt).toLocaleString(isVi ? "vi-VN" : "en-US")}
                                </div>
                            </div>
                        </div>

                        {/* Recent Downloads from this User */}
                        <div>
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                <span className="font-bold uppercase text-white flex items-center gap-1.5">
                                    <span>⚡</span>
                                    <span>{isVi ? "Lượt Tải Gần Đây Của User" : "Recent User Downloads"}</span>
                                </span>
                                <button
                                    onClick={() => {
                                        setSearchQuery(selectedUser.userId);
                                        setActiveTab("telemetry");
                                        setSelectedUser(null);
                                    }}
                                    className="text-cyan-400 hover:underline text-[11px] cursor-pointer"
                                >
                                    {isVi ? "Xem tất cả trong Telemetry →" : "View all in Telemetry →"}
                                </button>
                            </div>
                            <div className="space-y-1.5 max-h-36 overflow-y-auto">
                                {events.filter((e) => e.clientUserId === selectedUser.userId).slice(0, 5).length > 0 ? (
                                    events
                                        .filter((e) => e.clientUserId === selectedUser.userId)
                                        .slice(0, 5)
                                        .map((dl, i) => (
                                            <div key={`${dl.id}-${i}`} className="p-2 rounded-xl bg-[#141b2d] text-xs flex items-center justify-between">
                                                <div className="flex flex-col truncate max-w-xs">
                                                    <span className="text-white truncate">{dl.docTitle || dl.docIdHash}</span>
                                                    <span className="text-[10px] text-gray-500">
                                                        {new Date(dl.createdAt).toLocaleTimeString(isVi ? "vi-VN" : "en-US")} • {dl.pages || 1} trang • {dl.elapsedSeconds}s
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                    dl.downloadType === "credit" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-300"
                                                }`}>
                                                    {dl.downloadType === "credit" ? "💎 Credit" : "⚡ Free"}
                                                </span>
                                            </div>
                                        ))
                                ) : (
                                    <div className="p-3 rounded-xl bg-[#141b2d] text-gray-500 text-xs text-center">
                                        {isVi ? "Chưa có lượt tải nào trong khung thời gian hiện tại." : "No downloads logged in active timeframe."}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Transactions from this User */}
                        <div>
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                <span className="font-bold uppercase text-white flex items-center gap-1.5">
                                    <span>💳</span>
                                    <span>{isVi ? "Lịch Sử Nạp Tiền Của User" : "Payment History"}</span>
                                </span>
                                <button
                                    onClick={() => {
                                        setSearchQuery(selectedUser.userId);
                                        setActiveTab("transactions");
                                        setSelectedUser(null);
                                    }}
                                    className="text-emerald-400 hover:underline text-[11px] cursor-pointer"
                                >
                                    {isVi ? "Xem tất cả trong Giao Dịch →" : "View all in Transactions →"}
                                </button>
                            </div>
                            <div className="space-y-1.5 max-h-36 overflow-y-auto">
                                {transactions.filter((t) => t.userId.trim().toUpperCase() === selectedUser.userId.trim().toUpperCase()).slice(0, 5).length > 0 ? (
                                    transactions
                                        .filter((t) => t.userId.trim().toUpperCase() === selectedUser.userId.trim().toUpperCase())
                                        .slice(0, 5)
                                        .map((tx, i) => (
                                            <div key={`${tx.id}-${i}`} className="p-2 rounded-xl bg-[#141b2d] text-xs flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">{tx.id} ({tx.bankCode})</span>
                                                    <span className="text-[10px] text-gray-500">
                                                        {new Date(tx.createdAt).toLocaleDateString(isVi ? "vi-VN" : "en-US")}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-amber-400 font-bold">+{tx.creditsAdded} cr</span>
                                                    <span className="text-emerald-400 font-bold">+{tx.amount.toLocaleString()} đ</span>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="p-3 rounded-xl bg-[#141b2d] text-gray-500 text-xs text-center">
                                        {isVi ? "User chưa từng có giao dịch nạp tiền." : "No payment transactions recorded for this user."}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-mono cursor-pointer"
                            >
                                {isVi ? "Đóng" : "Close"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
