import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
    extensionName?: string;
    extensionUrl?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactFormData = await request.json();
        const { name, email, subject, message, extensionName, extensionUrl } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        // Check if API key is configured
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY not configured");
            return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
        }

        const adminEmail = process.env.ADMIN_EMAIL || "your-email@example.com";

        // Build email content
        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
                    .container { padding: 20px; background: #f9fafb; border-radius: 8px; }
                    .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px; }
                    .field { margin-bottom: 15px; padding: 12px; background: white; border-radius: 6px; border-left: 3px solid #3b82f6; }
                    .label { font-weight: bold; color: #4b5563; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
                    .value { color: #1f2937; }
                    .message-box { background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap; }
                    .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2 style="margin: 0;">📧 New Contact Message</h2>
                        <p style="margin: 5px 0 0 0; opacity: 0.9;">From AnyTools - Browser Extensions</p>
                    </div>
                    
                    <div class="field">
                        <div class="label">From</div>
                        <div class="value">${name} &lt;${email}&gt;</div>
                    </div>
                    
                    <div class="field">
                        <div class="label">Subject</div>
                        <div class="value">${subject}</div>
                    </div>
        `;

        // Add extension info if provided
        if (extensionName || extensionUrl) {
            htmlContent += `
                    <div class="field">
                        <div class="label">Extension Suggestion</div>
                        <div class="value">
                            ${extensionName ? `<strong>Name:</strong> ${extensionName}<br>` : ""}
                            ${extensionUrl ? `<strong>URL:</strong> <a href="${extensionUrl}">${extensionUrl}</a>` : ""}
                        </div>
                    </div>
            `;
        }

        htmlContent += `
                    <div class="field">
                        <div class="label">Message</div>
                        <div class="message-box">${message.replace(/\n/g, "<br>")}</div>
                    </div>
                    
                    <div class="footer">
                        <p>This message was sent from the Browser Extensions page on AnyTools.</p>
                        <p>Reply directly to this email to respond to ${name}.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send email
        const { data, error } = await resend.emails.send({
            from: process.env.ERROR_EMAIL_FROM || "",
            to: adminEmail,
            replyTo: email,
            subject: `[AnyTools Contact] ${subject}`,
            html: htmlContent,
        });

        if (error) {
            console.error("Failed to send email:", error);
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true, messageId: data?.id });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
