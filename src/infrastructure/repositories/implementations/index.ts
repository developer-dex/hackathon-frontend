/**
 * This file exports repository implementations for the application
 */

import { AuthRepositoryImpl } from "./AuthRepositoryImpl";

// Export types
export { AuthRepositoryImpl };

// Export singleton instances for easy usage throughout the application
export const authRepository = new AuthRepositoryImpl();
