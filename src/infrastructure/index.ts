/**
 * This file serves as the main entry point for the infrastructure layer.
 * It re-exports all repository implementations and API-related modules.
 *
 * Usage:
 * ```
 * import { authRepository, apiClient } from '@/infrastructure';
 * ```
 */

export * from "./repositories";
export * from "./api";
