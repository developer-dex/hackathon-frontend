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
 * ): Promise<User | { error: string }> {
 *   // Validate input
 *   if (!name || name.trim() === '') {
 *     console.error('Name cannot be empty');
 *     return { error: 'Name cannot be empty' };
 *   }
 *
 *   if (!email || !email.includes('@')) {
 *     console.error('Email is invalid');
 *     return { error: 'Email is invalid' };
 *   }
 *
 *   // Create user
 *   return userRepository.create({
 *     name,
 *     email
 *   });
 * };
 */

// Export all use cases
export * from "./auth";
export * from "./team";

// Export auth use cases
export { authUseCase } from "./auth";

// Export kudos use cases
export { kudosUseCases } from "./kudos";

// Export admin use cases
export { adminUseCase } from "./admin";
