import { Resend } from "resend";
import type { ErrorContext } from "./error-handler";

// Lazy initialize Resend to avoid startup errors
let resend: Resend | null = null;

function getResend() {
    if (!resend && process.env.RESEND_API_KEY) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
}

interface EmailData {
    error: Error;
    context?: ErrorContext;
    environment?: string;
}

/**
 * Sends error notification email to admin
 */
export async function sendErrorEmail(data: EmailData) {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
        console.warn("ADMIN_EMAIL not configured, skipping error email");
        return;
    }

    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not configured, skipping error email");
        return;
    }

    const { error, context, environment = "development" } = data;
    const ipUser = context?.ip || "Unknown IP";

    const resendClient = getResend();
    if (!resendClient) {
        console.warn("Resend client not initialized, skipping error email");
        return;
    }

    try {
        await resendClient.emails.send({
            from: process.env.ERROR_EMAIL_FROM || "errors@anytools.online",
            to: adminEmail,
            subject: `[${environment.toUpperCase()}] Error: ${error.message.substring(0, 50)}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                        h2 { color: #dc2626; }
                        .section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                        .label { font-weight: bold; color: #555; }
                        pre { background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 5px; overflow-x: auto; }
                        .timestamp { color: #666; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>🚨 Error Notification</h2>
                        <p class="timestamp">${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</p>
                        
                        <div class="section">
                            <p><span class="label">Environment:</span> ${environment}</p>
                            <p><span class="label">Error Message:</span> ${error.message}</p>
                            ${context?.endpoint ? `<p><span class="label">Endpoint:</span> ${context.endpoint}</p>` : ""}
                            ${context?.method ? `<p><span class="label">Method:</span> ${context.method}</p>` : ""}
                            ${context?.userId ? `<p><span class="label">User ID:</span> ${context.userId}</p>` : ""}
                            <p><span class="label">IP Address:</span> ${ipUser}</p>
                            ${context?.userAgent ? `<p><span class="label">User Agent:</span> ${context.userAgent}</p>` : ""}
                        </div>

                        ${
                            context?.params
                                ? `
                        <div class="section">
                            <p class="label">Request Parameters:</p>
                            <pre>${JSON.stringify(context.params, null, 2)}</pre>
                        </div>
                        `
                                : ""
                        }

                        <div class="section">
                            <p class="label">Stack Trace:</p>
                            <pre>${error.stack || "No stack trace available"}</pre>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        console.log("Error notification email sent successfully");
    } catch (emailError) {
        console.error("Failed to send error email:", emailError);
        // Don't throw here to prevent cascading errors
    }
}

export interface PaymentErrorEmailData {
    transId: string;
    amount?: number | string;
    currency?: string;
    content: string;
    bankCode?: string;
    userId?: string | null;
    reason: string;
    gateway?: string;
}

/**
 * Gửi email cảnh báo khi có giao dịch nạp credit bị lỗi
 * (ví dụ: chuyển sai cú pháp, không tìm thấy USER_ID, lỗi ghi Google Sheets, v.v.)
 */
export async function sendPaymentErrorEmail(data: PaymentErrorEmailData) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;

    if (!adminEmail) {
        console.warn("[Payment Email] ADMIN_EMAIL not configured, skipping notification");
        return;
    }

    if (!apiKey) {
        console.warn("[Payment Email] RESEND_API_KEY not configured, skipping notification");
        return;
    }

    const resendClient = getResend();
    if (!resendClient) {
        console.warn("[Payment Email] Resend client not initialized");
        return;
    }

    const formattedAmount = data.amount
        ? typeof data.amount === "number"
            ? data.amount.toLocaleString("vi-VN") + ` ${data.currency || "VND"}`
            : `${data.amount} ${data.currency || "VND"}`
        : "Không xác định";

    const timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    try {
        await resendClient.emails.send({
            from: process.env.ERROR_EMAIL_FROM || "alerts@anytools.online",
            to: adminEmail,
            subject: `🚨 [AnyTools] Cảnh báo nạp credit LỖI: ${data.transId} (${formattedAmount})`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 20px; }
                        .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
                        .header { background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); padding: 24px; text-align: center; color: white; }
                        .header h2 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }
                        .header p { margin: 6px 0 0; opacity: 0.9; font-size: 13px; }
                        .content { padding: 24px; }
                        .alert-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; border-radius: 6px; margin-bottom: 20px; color: #991b1b; font-weight: 600; font-size: 14px; }
                        .grid-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        .grid-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
                        .grid-table td.label { font-weight: 600; color: #64748b; width: 38%; }
                        .grid-table td.value { color: #0f172a; font-family: monospace; }
                        .action-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-top: 15px; }
                        .action-title { font-weight: 700; color: #166534; font-size: 13px; margin-bottom: 6px; }
                        .action-text { color: #15803d; font-size: 13px; line-height: 1.5; margin: 0; }
                        .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="header">
                            <h2>🚨 CẢNH BÁO NẠP CREDIT THẤT BẠI</h2>
                            <p>Hệ thống tự động phát hiện giao dịch chưa được cộng credit thành công</p>
                        </div>
                        <div class="content">
                            <div class="alert-box">
                                ⚠️ Lý do lỗi: ${data.reason}
                            </div>
                            <table class="grid-table">
                                <tr>
                                    <td class="label">Mã Giao Dịch (Trans ID):</td>
                                    <td class="value"><strong>${data.transId}</strong></td>
                                </tr>
                                <tr>
                                    <td class="label">Số Tiền Chuyển:</td>
                                    <td class="value"><span style="color: #059669; font-weight: bold; font-size: 15px;">${formattedAmount}</span></td>
                                </tr>
                                <tr>
                                    <td class="label">Mã User Nhận:</td>
                                    <td class="value">${data.userId ? `<strong>${data.userId}</strong>` : `<span style="color: #dc2626; font-weight: bold;">(Không tìm thấy mã USER trong nội dung)</span>`}</td>
                                </tr>
                                <tr>
                                    <td class="label">Nội Dung Chuyển Khoản:</td>
                                    <td class="value" style="background: #f8fafc; padding: 8px 10px; border-radius: 4px;">${data.content || "(Trống)"}</td>
                                </tr>
                                <tr>
                                    <td class="label">Cổng / Ngân Hàng:</td>
                                    <td class="value">${data.gateway || data.bankCode || "Chuyển khoản"}</td>
                                </tr>
                                <tr>
                                    <td class="label">Thời Gian Ghi Nhận:</td>
                                    <td class="value">${timestamp}</td>
                                </tr>
                            </table>
                            <div class="action-box">
                                <div class="action-title">💡 Hướng dẫn xử lý:</div>
                                <p class="action-text">
                                    Nếu khách hàng đã chuyển tiền nhưng ghi sai cú pháp (thiếu hoặc gõ sai mã USER), bạn có thể tra cứu khách hàng qua nội dung hoặc liên hệ của họ và vào <strong>Darkboard</strong> để cộng credit thủ công cho họ.
                                </p>
                            </div>
                        </div>
                        <div class="footer">
                            AnyTools Automated Telemetry & Payment Guardian System
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        console.log(`[Payment Email] Alert email sent for transaction ${data.transId}`);
    } catch (err) {
        console.error("[Payment Email] Failed to send payment error email:", err);
    }
}

