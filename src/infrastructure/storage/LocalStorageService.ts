import { IUser } from "@/domain/models/auth";

export class LocalStorageService {
  private static readonly AUTH_TOKEN_KEY = "auth_token";
  private static readonly USER_KEY = "user";

  /**
   * Store authentication token in localStorage
   */
  static setAuthToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
  }

  /**
   * Get authentication token from localStorage
   */
  static getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  /**
   * Remove authentication token from localStorage
   */
  static removeAuthToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

  /**
   * Store user data in localStorage
   */
  static setUser(user: IUser): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user data from localStorage
   */
  static getUser(): IUser | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as IUser;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  }

  /**
   * Remove user data from localStorage
   */
  static removeUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Clear all auth-related data from localStorage
   */
  static clearAuth(): void {
    if (typeof window === "undefined") return;
    this.removeAuthToken();
    this.removeUser();
  }
}
