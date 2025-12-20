import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Client } from "@upstash/qstash";

// Initialize Upstash Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Initialize QStash client
const qstash = new Client({
    token: process.env.QSTASH_TOKEN!,
    baseUrl: process.env.QSTASH_URL,
});

// Base URL for the app (needed for QStash to call our endpoints)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://anytools.online";

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
    qstashMessageIds: string[]; // Store QStash message IDs for cancellation
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

// Schedule emails with QStash for an event
async function scheduleEventReminders(event: ServerEventReminder): Promise<string[]> {
    const qstashMessageIds: string[] = [];
    const targetTime = new Date(event.targetDate).getTime();
    const now = Date.now();

    // Schedule reminder emails for each reminder time
    for (const minutesBefore of event.remindersBefore) {
        const reminderTime = targetTime - minutesBefore * 60 * 1000;
        const delaySeconds = Math.floor((reminderTime - now) / 1000);

        // Only schedule if reminder time is in the future (at least 60 seconds from now)
        if (delaySeconds > 60) {
            try {
                const result = (await qstash.publishJSON({
                    url: `${BASE_URL}/api/send-reminder`,
                    body: {
                        email: event.email,
                        eventName: event.name,
                        eventDescription: event.description,
                        targetDate: event.targetDate,
                        minutesBefore: minutesBefore,
                        eventId: event.id,
                    },
                    delay: delaySeconds,
                    retries: 3,
                })) as { messageId: string };

                if (result.messageId) {
                    qstashMessageIds.push(result.messageId);
                    console.log(`📧 Scheduled QStash reminder for "${event.name}" in ${delaySeconds}s (${formatMinutes(minutesBefore)} before)`);
                }
            } catch (error) {
                console.error(`Failed to schedule QStash message for ${minutesBefore} minutes before:`, error);
            }
        }
    }

    // Schedule the "event time" email (0 minutes before) if not already included
    if (!event.remindersBefore.includes(0)) {
        const delaySeconds = Math.floor((targetTime - now) / 1000);

        if (delaySeconds > 60) {
            try {
                const result = (await qstash.publishJSON({
                    url: `${BASE_URL}/api/send-reminder`,
                    body: {
                        email: event.email,
                        eventName: event.name,
                        eventDescription: event.description,
                        targetDate: event.targetDate,
                        minutesBefore: 0,
                        eventId: event.id,
                    },
                    delay: delaySeconds,
                    retries: 3,
                })) as { messageId: string };

                if (result.messageId) {
                    qstashMessageIds.push(result.messageId);
                    console.log(`Scheduled QStash final reminder for "${event.name}" at event time`);
                }
            } catch (error) {
                console.error(`Failed to schedule final QStash message:`, error);
            }
        }
    }

    return qstashMessageIds;
}

// Cancel scheduled QStash messages when event is deleted
async function cancelScheduledMessages(messageIds: string[]): Promise<void> {
    for (const messageId of messageIds) {
        try {
            await qstash.messages.delete(messageId);
            console.log(`❌ Cancelled QStash message: ${messageId}`);
        } catch (error) {
            // Message might have already been delivered or expired
            console.error(`Failed to cancel QStash message ${messageId}:`, error);
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

        // If updating, cancel old scheduled messages first
        if (isUpdate && existingEvents[eventIndex].qstashMessageIds?.length) {
            await cancelScheduledMessages(existingEvents[eventIndex].qstashMessageIds);
        }

        // Schedule reminders with QStash
        const qstashMessageIds = await scheduleEventReminders({
            ...event,
            sentReminders: event.sentReminders || [],
            qstashMessageIds: [],
            createdAt: event.createdAt || Date.now(),
        });

        // Add new event with initialized fields
        const newEvent: ServerEventReminder = {
            ...event,
            sentReminders: event.sentReminders || [],
            qstashMessageIds: qstashMessageIds,
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
            scheduledReminders: qstashMessageIds.length,
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

        // Find the event to delete and cancel its scheduled QStash messages
        const eventToDelete = existingEvents.find((e: ServerEventReminder) => e.id === eventId);
        if (eventToDelete?.qstashMessageIds?.length) {
            await cancelScheduledMessages(eventToDelete.qstashMessageIds);
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
