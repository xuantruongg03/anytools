import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.ERROR_EMAIL_FROM || "AnyTools <onboarding@resend.dev>";

// Type for reminder payload from QStash
interface ReminderPayload {
    email: string;
    eventName: string;
    eventDescription?: string;
    targetDate: string;
    minutesBefore: number;
    eventId: string;
    isTest?: boolean;
}

// Helper function to format minutes to readable string
function formatMinutes(minutes: number, locale: string = "vi"): string {
    if (minutes === 0) return locale === "vi" ? "Bây giờ" : "Now";
    if (minutes < 60) return locale === "vi" ? `${minutes} phút` : `${minutes} minutes`;
    if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return locale === "vi" ? `${hours} giờ` : `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (minutes < 10080) {
        const days = Math.floor(minutes / 1440);
        return locale === "vi" ? `${days} ngày` : `${days} day${days > 1 ? "s" : ""}`;
    }
    const weeks = Math.floor(minutes / 10080);
    return locale === "vi" ? `${weeks} tuần` : `${weeks} week${weeks > 1 ? "s" : ""}`;
}

// Generate email HTML content
function generateEmailHtml(eventName: string, eventDescription: string | undefined, targetDate: string, timeLeft: string, isNow: boolean): string {
    const formattedDate = new Date(targetDate).toLocaleString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, ${isNow ? "#10b981" : "#667eea"} 0%, ${isNow ? "#059669" : "#764ba2"} 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 16px;">${isNow ? "🎉" : "⏰"}</div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
                    ${isNow ? "Đến giờ rồi!" : `Còn ${timeLeft}`}
                </h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">
                    📌 ${eventName}
                </h2>
                ${eventDescription ? `<p style="color: #6b7280; font-size: 16px; margin: 16px 0;">${eventDescription}</p>` : ""}
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 12px; margin: 24px 0; border-left: 4px solid #0ea5e9;">
                    <p style="margin: 0; color: #0369a1; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                        📅 Thời gian sự kiện
                    </p>
                    <p style="margin: 8px 0 0 0; color: #1e40af; font-size: 18px; font-weight: 500;">
                        ${formattedDate}
                    </p>
                </div>
                ${
                    isNow
                        ? `
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); padding: 16px; border-radius: 12px; text-align: center; margin: 24px 0;">
                        <p style="margin: 0; color: #059669; font-size: 18px; font-weight: 600;">
                            ✨ Chúc bạn có một sự kiện thành công!
                        </p>
                    </div>
                `
                        : ""
                }
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                    Nhắc nhở này được gửi từ <a href="https://anytools.online/tools/event-reminder" style="color: #667eea; text-decoration: none;">AnyTools Event Reminder</a>
                </p>
            </div>
        </body>
        </html>
    `;
}

// Main handler - will be called by QStash
async function handler(request: NextRequest) {
    try {
        const payload: ReminderPayload = await request.json();
        const { email, eventName, eventDescription, targetDate, minutesBefore, isTest } = payload;

        if (!email || !eventName || !targetDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const timeLeft = formatMinutes(minutesBefore);
        const isNow = minutesBefore === 0;
        const subject = isTest ? `🧪 [TEST] ${eventName}` : isNow ? `🎉 ${eventName} - Đến giờ rồi!` : `⏰ Nhắc nhở: ${eventName} - Còn ${timeLeft}`;

        const htmlContent = generateEmailHtml(eventName, eventDescription, targetDate, timeLeft, isNow);

        // Send email via Resend
        const result = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: subject,
            html: htmlContent,
        });

        if (result.error) {
            console.error("Resend error:", result.error);
            return NextResponse.json({ error: result.error.message }, { status: 500 });
        }

        console.log(`📧 Email sent to ${email} for event "${eventName}" (${timeLeft} before)`);

        return NextResponse.json({
            success: true,
            emailId: result.data?.id,
            message: `Reminder email sent for ${eventName}`,
        });
    } catch (error) {
        console.error("Failed to send reminder:", error);
        return NextResponse.json({ error: "Failed to send reminder" }, { status: 500 });
    }
}

// Wrap handler with QStash signature verification for security
// This ensures only QStash can call this endpoint
export const POST = verifySignatureAppRouter(handler);

// Also allow direct calls for testing (without verification)
// Remove this in production if you only want QStash to call this endpoint
export async function PUT(request: NextRequest) {
    // For test emails sent directly from the UI
    return handler(request);
}
