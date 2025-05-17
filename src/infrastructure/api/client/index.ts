import { ApiClient } from "./ApiClient";
import type { ApiClientConfig } from "./ApiClient";

// Export types
export { ApiClient };
export type { ApiClientConfig };

// Create and export a singleton instance of the API client
// for easy use throughout the application
export const apiClient = new ApiClient();
