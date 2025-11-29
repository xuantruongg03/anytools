import { handleError } from "./utils/error-handler";

interface ServiceResult<T> {
    success: boolean;
    data?: T;
    usedService?: string;
    failedServices: Array<{
        service: string;
        error: string;
        timestamp: string;
    }>;
}

interface ServiceConfig<T> {
    name: string;
    handler: () => Promise<T>;
}

interface FallbackOptions {
    endpoint: string;
    method: string;
    userAgent?: string;
    additionalParams?: Record<string, any>;
}

/**
 * Tries multiple services sequentially until one succeeds.
 * Sends email notification if any service fails.
 *
 * @example
 * ```typescript
 * const result = await tryServicesWithFallback(
 *   [
 *     { name: "removebg", handler: () => callRemoveBg(file) },
 *     { name: "clipdrop", handler: () => callClipdrop(file) }
 *   ],
 *   {
 *     endpoint: "/api/remove-background",
 *     method: "POST",
 *     userAgent: request.headers.get("user-agent"),
 *     additionalParams: { fileName: file.name }
 *   }
 * );
 * ```
 */
export async function tryServicesWithFallback<T>(services: ServiceConfig<T>[], options: FallbackOptions): Promise<ServiceResult<T>> {
    const failures: Array<{ service: string; error: string; timestamp: string }> = [];
    let result: T | null = null;
    let successService: string | null = null;

    // Try all services
    for (const service of services) {
        try {
            console.log(`Trying ${service.name}...`);
            result = await service.handler();
            successService = service.name;
            console.log(`${service.name} succeeded`);
            break;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(` ${service.name} failed: ${errorMessage}`);

            failures.push({
                service: service.name,
                error: errorMessage,
                timestamp: new Date().toISOString(),
            });
        }
    }

    // Send email if any service failed
    if (failures.length > 0) {
        const servicesSummary = services.map((s) => {
            const failed = failures.find((f) => f.service === s.name);
            if (failed) {
                return ` ${s.name}: ${failed.error}`;
            }
            return s.name === successService ? `${s.name}: SUCCESS` : `${s.name}: SKIPPED`;
        });

        const emailParams = {
            ...options.additionalParams,
            servicesStatus: servicesSummary,
            summary: {
                total: services.length,
                failed: failures.length,
                succeeded: successService ? 1 : 0,
                successService: successService,
            },
            failures: failures,
        };

        if (!successService) {
            // All failed - send blocking email and throw
            console.error(` All services failed (${failures.length}/${services.length})`);

            await handleError(new Error(`All services failed at ${options.endpoint}`), {
                endpoint: options.endpoint,
                method: options.method,
                userAgent: options.userAgent,
                params: emailParams,
            });

            throw new Error(`All services failed. Tried: ${services.map((s) => s.name).join(", ")}. ` + `Errors: ${failures.map((f) => `${f.service}: ${f.error}`).join("; ")}`);
        } else {
            // Some failed, some succeeded - send non-blocking email
            console.warn(`${failures.length}/${services.length} services failed, but ${successService} succeeded`);

            handleError(new Error(`Partial service failures at ${options.endpoint}`), {
                endpoint: options.endpoint,
                method: options.method,
                userAgent: options.userAgent,
                params: emailParams,
            }).catch((emailError) => console.error("Failed to send error notification:", emailError));
        }
    }

    return {
        success: !!result,
        data: result || undefined,
        usedService: successService || undefined,
        failedServices: failures,
    };
}
