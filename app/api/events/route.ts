import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

// Initialize Upstash Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.ADMIN_EMAIL || "AnyTools <onboarding@resend.dev>";

// Type for event reminder
export interface ServerEventReminder {
    id: string;
    name: string;
    description: string;
    targetDate: string;
    email: string;
    remindersBefore: number[];
    createdAt: number;
    sentReminders: number[]; // Track which reminder times have been sent
    scheduledEmailIds: string[]; // Store Resend scheduled email IDs for cancellation
    isCompleted: boolean;
    userId?: string; // Optional: for future user authentication
}

// Helper function to format minutes to readable string
function formatMinutes(minutes: number): string {
    if (minutes === 0) return "Bây giờ";
    if (minutes < 60) return `${minutes} phút`;
    if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return `${hours} giờ`;
    }
    if (minutes < 10080) {
        const days = Math.floor(minutes / 1440);
        return `${days} ngày`;
    }
    const weeks = Math.floor(minutes / 10080);
    return `${weeks} tuần`;
}

// Generate email HTML content
function generateEmailHtml(event: ServerEventReminder, timeLeft: string, formattedDate: string, isNow: boolean): string {
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
                    📌 ${event.name}
                </h2>
                ${event.description ? `<p style="color: #6b7280; font-size: 16px; margin: 16px 0;">${event.description}</p>` : ""}
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

// Schedule emails with Resend for an event
async function scheduleEventEmails(event: ServerEventReminder): Promise<string[]> {
    const scheduledEmailIds: string[] = [];
    const targetTime = new Date(event.targetDate).getTime();
    const now = Date.now();

    const formattedDate = new Date(event.targetDate).toLocaleString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    // Schedule reminder emails for each reminder time
    for (const minutesBefore of event.remindersBefore) {
        const reminderTime = targetTime - minutesBefore * 60 * 1000;

        // Only schedule if reminder time is in the future (at least 1 minute from now)
        if (reminderTime > now + 60 * 1000) {
            try {
                const timeLeft = formatMinutes(minutesBefore);
                const isNow = minutesBefore === 0;
                const subject = isNow ? `🎉 ${event.name} - Đến giờ rồi!` : `⏰ Nhắc nhở: ${event.name} - Còn ${timeLeft}`;

                const htmlContent = generateEmailHtml(event, timeLeft, formattedDate, isNow);

                const result = await resend.emails.send({
                    from: fromEmail,
                    to: event.email,
                    subject: subject,
                    html: htmlContent,
                    scheduledAt: new Date(reminderTime).toISOString(),
                });

                if (result.data?.id) {
                    scheduledEmailIds.push(result.data.id);
                    console.log(`📧 Scheduled email for "${event.name}" at ${new Date(reminderTime).toISOString()} (${timeLeft} before)`);
                }
            } catch (error) {
                console.error(`Failed to schedule email for ${minutesBefore} minutes before:`, error);
            }
        }
    }

    // Schedule the "event time" email (0 minutes before)
    if (!event.remindersBefore.includes(0) && targetTime > now + 60 * 1000) {
        try {
            const htmlContent = generateEmailHtml(event, "Bây giờ", formattedDate, true);

            const result = await resend.emails.send({
                from: fromEmail,
                to: event.email,
                subject: `🎉 ${event.name} - Đến giờ rồi!`,
                html: htmlContent,
                scheduledAt: new Date(targetTime).toISOString(),
            });

            if (result.data?.id) {
                scheduledEmailIds.push(result.data.id);
                console.log(`📧 Scheduled final email for "${event.name}" at ${new Date(targetTime).toISOString()}`);
            }
        } catch (error) {
            console.error(`Failed to schedule final email:`, error);
        }
    }

    return scheduledEmailIds;
}

// Cancel scheduled emails when event is deleted
async function cancelScheduledEmails(emailIds: string[]): Promise<void> {
    for (const emailId of emailIds) {
        try {
            await resend.emails.cancel(emailId);
            console.log(`❌ Cancelled scheduled email: ${emailId}`);
        } catch (error) {
            console.error(`Failed to cancel email ${emailId}:`, error);
        }
    }
}

// GET - Retrieve events for a specific email
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Get events for this email from Redis
        const events = (await redis.get<ServerEventReminder[]>(`events:${email}`)) || [];

        return NextResponse.json({ events });
    } catch (error) {
        console.error("Failed to get events:", error);
        return NextResponse.json({ error: "Failed to get events" }, { status: 500 });
    }
}

// POST - Save a new event
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { event } = body as { event: ServerEventReminder };

        if (!event || !event.email || !event.name || !event.targetDate) {
            return NextResponse.json({ error: "Invalid event data" }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(event.email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        // Get existing events for this email
        const existingEvents = (await redis.get<ServerEventReminder[]>(`events:${event.email}`)) || [];

        // Check if event already exists (update) or is new (add)
        const eventIndex = existingEvents.findIndex((e: ServerEventReminder) => e.id === event.id);
        const isUpdate = eventIndex >= 0;

        // If updating, cancel old scheduled emails first
        if (isUpdate && existingEvents[eventIndex].scheduledEmailIds?.length) {
            await cancelScheduledEmails(existingEvents[eventIndex].scheduledEmailIds);
        }

        // Schedule emails with Resend
        const scheduledEmailIds = await scheduleEventEmails({
            ...event,
            sentReminders: event.sentReminders || [],
            scheduledEmailIds: [],
            createdAt: event.createdAt || Date.now(),
        });

        // Add new event with initialized fields
        const newEvent: ServerEventReminder = {
            ...event,
            sentReminders: event.sentReminders || [],
            scheduledEmailIds: scheduledEmailIds,
            createdAt: event.createdAt || Date.now(),
        };

        if (isUpdate) {
            existingEvents[eventIndex] = newEvent;
        } else {
            existingEvents.push(newEvent);
        }

        // Save to Redis
        await redis.set(`events:${event.email}`, existingEvents);

        // Also add to global list for tracking
        const allEmails = (await redis.get<string[]>("all_reminder_emails")) || [];
        if (!allEmails.includes(event.email)) {
            allEmails.push(event.email);
            await redis.set("all_reminder_emails", allEmails);
        }

        return NextResponse.json({
            success: true,
            event: newEvent,
            scheduledEmails: scheduledEmailIds.length,
        });
    } catch (error) {
        console.error("Failed to save event:", error);
        return NextResponse.json({ error: "Failed to save event" }, { status: 500 });
    }
}

// DELETE - Remove an event
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");
        const eventId = searchParams.get("id");

        if (!email || !eventId) {
            return NextResponse.json({ error: "Email and event ID are required" }, { status: 400 });
        }

        // Get existing events
        const existingEvents = (await redis.get<ServerEventReminder[]>(`events:${email}`)) || [];

        // Find the event to delete and cancel its scheduled emails
        const eventToDelete = existingEvents.find((e: ServerEventReminder) => e.id === eventId);
        if (eventToDelete?.scheduledEmailIds?.length) {
            await cancelScheduledEmails(eventToDelete.scheduledEmailIds);
        }

        // Filter out the event to delete
        const updatedEvents = existingEvents.filter((e: ServerEventReminder) => e.id !== eventId);

        // Save updated list
        await redis.set(`events:${email}`, updatedEvents);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete event:", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}

// PATCH - Update an event (mark complete, update sent reminders, etc.)
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, eventId, updates } = body as {
            email: string;
            eventId: string;
            updates: Partial<ServerEventReminder>;
        };

        if (!email || !eventId) {
            return NextResponse.json({ error: "Email and event ID are required" }, { status: 400 });
        }

        // Get existing events
        const existingEvents = (await redis.get<ServerEventReminder[]>(`events:${email}`)) || [];

        // Find and update the event
        const eventIndex = existingEvents.findIndex((e: ServerEventReminder) => e.id === eventId);
        if (eventIndex < 0) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        existingEvents[eventIndex] = { ...existingEvents[eventIndex], ...updates };

        // Save updated list
        await redis.set(`events:${email}`, existingEvents);

        return NextResponse.json({ success: true, event: existingEvents[eventIndex] });
    } catch (error) {
        console.error("Failed to update event:", error);
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}
