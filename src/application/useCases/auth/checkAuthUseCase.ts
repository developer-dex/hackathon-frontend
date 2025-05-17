import { IUser } from "@/domain/models/auth";

export class CheckAuthUseCase {
  /**
   * Checks if user is authenticated based on token existence
   */
  execute(): boolean {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("authToken");
    }
    return false;
  }

  /**
   * Validates a JWT token format (does not verify signature)
   * @param token The token to validate
   */
  validateTokenFormat(token: string): boolean {
    if (!token) return false;

    // Basic JWT format validation (header.payload.signature)
    const tokenParts = token.split(".");
    return tokenParts.length === 3;
  }

  /**
   * Gets user information from localStorage if available
   * In a real implementation, this would decode the JWT token
   */
  getCurrentUser(): IUser | null {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          return JSON.parse(userString);
        } catch (error) {
          console.error("Error parsing user data:", error);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Check if the user has the required role
   * @param requiredRole The role to check for
   */
  hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === requiredRole;
  }
}
