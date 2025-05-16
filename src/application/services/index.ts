/**
 * Application services go here.
 *
 * Example service:
 *
 * import { User } from '@/domain/entities';
 * import { UserRepository } from '@/domain/interfaces';
 * import { createUserUseCase } from '../useCases/createUserUseCase';
 * import { getUsersUseCase } from '../useCases/getUsersUseCase';
 *
 * export class UserService {
 *   constructor(private userRepository: UserRepository) {}
 *
 *   async getUsers(): Promise<User[]> {
 *     return getUsersUseCase(this.userRepository);
 *   }
 *
 *   async createUser(name: string, email: string): Promise<User> {
 *     return createUserUseCase(this.userRepository, name, email);
 *   }
 * }
 */
