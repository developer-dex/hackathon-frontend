/**
 * This file exports repository implementations for the application
 */

import { AuthRepositoryImpl } from "./AuthRepositoryImpl";
import { KudosRepositoryImpl } from "./KudosRepositoryImpl";

// Export types
export { AuthRepositoryImpl };
export { KudosRepositoryImpl };

// Export singleton instances for easy usage throughout the application
export const authRepository = new AuthRepositoryImpl();
