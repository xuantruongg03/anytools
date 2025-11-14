/**
 * API Configuration
 */
export const API_CONFIG = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    timeout: 10000,
} as const;

/**
 * Application Routes
 */
export const ROUTES = {
    HOME: "/",
    ABOUT: "/about",
    CONTACT: "/contact",
    // Add more routes as needed
} as const;
