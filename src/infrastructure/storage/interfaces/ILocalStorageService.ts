import { IUser } from "@/domain/models/auth";

/**
 * Interface defining the contract for local storage operations
 * This interface provides methods for managing authentication and user data in localStorage
 */
export interface ILocalStorageService {
  /**
   * Store authentication token in localStorage
   * @param token - The authentication token to store
   */
  setAuthToken(token: string): void;

  /**
   * Get authentication token from localStorage
   * @returns The stored authentication token or null if not found
   */
  getAuthToken(): string | null;

  /**
   * Remove authentication token from localStorage
   */
  removeAuthToken(): void;

  /**
   * Store user data in localStorage
   * @param user - The user object to store
   */
  setUser(user: IUser): void;

  /**
   * Get user data from localStorage
   * @returns The stored user object or null if not found
   */
  getUser(): IUser | null;

  /**
   * Remove user data from localStorage
   */
  removeUser(): void;

  /**
   * Clear all authentication-related data from localStorage
   * This includes both the auth token and user data
   */
  clearAuth(): void;
}

/**
 * Type for the static LocalStorageService
 */
export type LocalStorageServiceStatic = {
  setAuthToken(token: string): void;
  getAuthToken(): string | null;
  removeAuthToken(): void;
  setUser(user: IUser): void;
  getUser(): IUser | null;
  removeUser(): void;
  clearAuth(): void;
};
