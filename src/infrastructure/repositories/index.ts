/**
 * This file re-exports all repository implementations and interfaces.
 *
 * This pattern:
 * 1. Provides a cleaner import path for consumers
 * 2. Maintains a single entry point to repository implementations
 * 3. Allows for swapping or changing implementations without changing consuming code
 */

// Export interfaces
export * from "./interfaces";

// Export implementations
export * from "./implementations";

// Export AuthRepositoryImpl
export * from "./implementations/AuthRepositoryImpl";

// Export TeamRepositoryImpl
export * from "./implementations/TeamRepositoryImpl";

// Export KudosRepositoryImpl
export * from "./implementations/KudosRepositoryImpl";

// Export AdminRepositoryImpl
export * from "./implementations/AdminRepositoryImpl";

// Initialize and export repository instances
import { AuthRepositoryImpl } from "./implementations/AuthRepositoryImpl";
import { KudosRepositoryImpl } from "./implementations/KudosRepositoryImpl";
import { AdminRepositoryImpl } from "./implementations/AdminRepositoryImpl";

// Create and export repository instances
export const authRepository = new AuthRepositoryImpl();
export const kudosRepository = new KudosRepositoryImpl();
export const adminRepository = new AdminRepositoryImpl();

/**
 * Repository implementations go here.
 *
 * Example repository:
 *
 * import { User } from '@/domain/entities';
 * import { UserRepository } from '@/domain/interfaces';
 * import { apiClient } from '../api/apiClient';
 *
 * export class ApiUserRepository implements UserRepository {
 *   async getAll(): Promise<User[]> {
 *     const response = await apiClient.get('/users');
 *     return response.data;
 *   }
 *
 *   async getById(id: string): Promise<User | null> {
 *     try {
 *       const response = await apiClient.get(`/users/${id}`);
 *       return response.data;
 *     } catch (error) {
 *       if (error.response?.status === 404) {
 *         return null;
 *       }
 *       console.error('Error fetching user by ID:', error);
 *       return null;
 *     }
 *   }
 *
 *   async create(user: Omit<User, 'id'>): Promise<User> {
 *     const response = await apiClient.post('/users', user);
 *     return response.data;
 *   }
 *
 *   async update(id: string, user: Partial<User>): Promise<User> {
 *     const response = await apiClient.patch(`/users/${id}`, user);
 *     return response.data;
 *   }
 *
 *   async delete(id: string): Promise<boolean> {
 *     await apiClient.delete(`/users/${id}`);
 *     return true;
 *   }
 * }
 *
 * // Export a singleton instance
 * export const userRepository = new ApiUserRepository();
 */
