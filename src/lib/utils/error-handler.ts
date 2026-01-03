import { sendErrorEmail } from "./email-service";

export interface ErrorContext {
    endpoint?: string;
    method?: string;
    userId?: string;
    params?: any;
    userAgent?: string;
    ip?: string;
}

/**
 * Centralized error handler
 * Logs errors and sends email notifications
 */
export async function handleError(error: Error, context?: ErrorContext) {
    try {
        await sendErrorEmail({
            error,
            context,
            environment: process.env.NODE_ENV,
        });
    } catch (emailError) {
        console.error("Failed to send error notification:", emailError);
    }
}
