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
 *       throw error;
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
