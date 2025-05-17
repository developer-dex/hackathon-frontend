/**
 * This file re-exports the API client and other API-related modules.
 *
 * This pattern:
 * 1. Provides a cleaner import path for consumers
 * 2. Maintains a single entry point to API-related functionality
 * 3. Allows for swapping implementations without changing consuming code
 */

export * from "./client";
