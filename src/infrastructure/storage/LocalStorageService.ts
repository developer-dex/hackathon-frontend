import { LocalStorageServiceStatic } from "./interfaces/ILocalStorageService";
import { IUser } from "@/domain/models/auth";

/**
 * Minimal user data interface for localStorage
 */
interface IMinimalUserData {
  name: string;
  role: string;
  id: string;
}

const AUTH_TOKEN_KEY = "auth_token";
const USER_KEY = "user";

/**
 * LocalStorageService provides methods for managing authentication and user data in localStorage
 */
export const LocalStorageService: LocalStorageServiceStatic = {
  /**
   * Store authentication token in localStorage
   */
  setAuthToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  /**
   * Get authentication token from localStorage
   */
  getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Remove authentication token from localStorage
   */
  removeAuthToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  /**
   * Store minimal user data in localStorage (only name and role)
   */
  setUser(user: IUser): void {
    if (typeof window === "undefined") return;

    // Only store minimal user data (name, role, and id)
    const minimalUserData: IMinimalUserData = {
      name: user.name,
      role: user.role as string,
      id: user.id, // including id for proper identification
    };

    localStorage.setItem(USER_KEY, JSON.stringify(minimalUserData));
  },

  /**
   * Get user data from localStorage
   * Returns a partial user object with only the stored fields
   */
  getUser(): IUser | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      // Parse the minimal user data
      const minimalUserData = JSON.parse(userStr) as IMinimalUserData;

      // Construct a partial user object
      // Other fields will be undefined, which is expected
      const user: IUser = {
        id: minimalUserData.id,
        name: minimalUserData.name,
        role: minimalUserData.role,
        email: "", // Required by the IUser interface but not stored in localStorage
      };

      return user;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  },

  /**
   * Remove user data from localStorage
   */
  removeUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Clear all auth-related data from localStorage
   */
  clearAuth(): void {
    if (typeof window === "undefined") return;
    this.removeAuthToken();
    this.removeUser();
  },
};
