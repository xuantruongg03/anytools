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
