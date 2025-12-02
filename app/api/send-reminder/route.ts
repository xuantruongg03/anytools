import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, eventName, eventDescription, targetDate, isTest } = body;

        if (!email || !eventName) {
            return NextResponse.json({ error: "Email and event name are required" }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        // Format the target date for display
        const formattedDate = new Date(targetDate).toLocaleString();

        // Email content
        const subject = isTest ? `[TEST] Reminder: ${eventName}` : `Reminder: ${eventName}`;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${subject}</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Event Reminder</h1>
                </div>
                <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
                    <h2 style="color: #333; margin-top: 0;">${eventName}</h2>
                    ${eventDescription ? `<p style="color: #666;">${eventDescription}</p>` : ""}
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                        <p style="margin: 0; color: #666;">
                            <strong>📅 Date & Time:</strong><br>
                            ${formattedDate}
                        </p>
                    </div>
                    ${isTest ? '<p style="color: #f59e0b; font-style: italic;">This is a test email to verify your reminder settings.</p>' : ""}
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        This reminder was sent from <a href="https://www.anytools.online" style="color: #667eea;">AnyTools</a>
                    </p>
                </div>
            </body>
            </html>
        `;

        // Using Resend to send email
        const resend = new Resend(process.env.RESEND_API_KEY);

        // For free tier, use onboarding@resend.dev or your verified domain
        const fromEmail = process.env.ERROR_EMAIL_FROM || "AnyTools <onboarding@resend.dev>";

        const result = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: subject,
            html: htmlContent,
        });

        // In demo mode, simulate success
        // In production, remove this and use actual email service
        return NextResponse.json({
            success: true,
            message: isTest ? "Test email sent successfully (demo mode - configure email service for production)" : "Reminder email sent successfully",
            demo: true, // Remove this flag when email service is configured
        });
    } catch (error) {
        console.error("Failed to send reminder email:", error);
        return NextResponse.json({ error: "Failed to send email", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
