import { NextResponse } from "next/server";
import { handleError, type ErrorContext } from "./error-handler";

type ApiHandler = (req: Request | any, context?: any) => Promise<Response>;

/**
 * Higher-order function that wraps API handlers with error handling
 * Automatically catches errors and sends email notifications
 *
 * @param handler - The API route handler function
 * @param endpoint - The endpoint path for logging purposes
 * @returns Wrapped handler with error handling
 *
 * @example
 * ```typescript
 * async function handler(request: Request) {
 *   // your logic here
 *   return NextResponse.json({ success: true });
 * }
 *
 * export const POST = withErrorHandler(handler, '/api/remove-background');
 * ```
 */
export function withErrorHandler(handler: ApiHandler, endpoint: string) {
    return async (req: Request, context?: any) => {
        try {
            return await handler(req, context);
        } catch (error) {
            const err = error as Error;

            // Gather error context
            const errorContext: ErrorContext = {
                endpoint,
                method: req.method,
                userAgent: req.headers.get("user-agent") || undefined,
            };

            // Try to parse request body for additional context
            try {
                const clonedRequest = req.clone();
                const contentType = req.headers.get("content-type");

                if (contentType?.includes("application/json")) {
                    errorContext.params = await clonedRequest.json();
                } else if (contentType?.includes("multipart/form-data")) {
                    const formData = await clonedRequest.formData();
                    const formDataInfo: Record<string, any> = {
                        formDataKeys: Array.from(formData.keys()),
                    };

                    // Add details about each field
                    formData.forEach((value, key) => {
                        if (value instanceof File) {
                            formDataInfo[key] = {
                                type: "File",
                                name: value.name,
                                size: value.size,
                                mimeType: value.type,
                            };
                        } else {
                            formDataInfo[key] = value;
                        }
                    });

                    errorContext.params = formDataInfo;
                } else if (contentType?.includes("application/x-www-form-urlencoded")) {
                    const formData = await clonedRequest.formData();
                    errorContext.params = Object.fromEntries(formData.entries());
                } else {
                    errorContext.params = {
                        contentType: contentType || "unknown",
                        note: "Body parsing not attempted for this content type",
                    };
                }
            } catch (parseError) {
                // If body parsing fails, provide detailed error info
                errorContext.params = {
                    contentType: req.headers.get("content-type") || "unknown",
                    note: "Could not parse request body",
                    parseError: parseError instanceof Error ? parseError.message : String(parseError),
                };
            }

            // Handle the error (log and send email)
            await handleError(err, errorContext);

            // Detect language from URL path
            const url = new URL(req.url);
            const isVietnamese = url.pathname.includes("/vi/");

            // Return localized error response
            const errorMessage = isVietnamese ? "Đã xảy ra lỗi. Đội ngũ phát triển đã nhận được thông báo và sẽ khắc phục sớm." : "An unexpected error occurred. Our team has been notified and will fix it soon.";

            return NextResponse.json(
                {
                    error: process.env.NODE_ENV === "development" ? err.message : errorMessage,
                    message: process.env.NODE_ENV === "development" ? err.message : errorMessage,
                },
                { status: 500 }
            );
        }
    };
}

/**
 * Utility function to manually report errors from client-side or server components
 *
 * @example
 * ```typescript
 * try {
 *   // some risky operation
 * } catch (error) {
 *   await reportError(error, { userId: user.id, action: 'upload' });
 * }
 * ```
 */
export async function reportError(error: Error, context?: Partial<ErrorContext>) {
    await handleError(error, context as ErrorContext);
}
