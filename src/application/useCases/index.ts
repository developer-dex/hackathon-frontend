/**
 * Application use cases go here.
 *
 * Example use case:
 *
 * import { User } from '@/domain/entities';
 * import { UserRepository } from '@/domain/interfaces';
 * import { ValidationError } from '@/domain/errors';
 *
 * export const createUserUseCase = async (
 *   userRepository: UserRepository,
 *   name: string,
 *   email: string
 * ): Promise<User> => {
 *   // Validate input
 *   if (!name || name.trim() === '') {
 *     throw new ValidationError('Name cannot be empty');
 *   }
 *
 *   if (!email || !email.includes('@')) {
 *     throw new ValidationError('Email is invalid');
 *   }
 *
 *   // Create user
 *   return userRepository.create({
 *     name,
 *     email
 *   });
 * };
 */

// Export all auth use cases
export * from "./auth";
