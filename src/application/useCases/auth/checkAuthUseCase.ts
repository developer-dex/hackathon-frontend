import { IUser } from "@/domain/models/auth";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

export class CheckAuthUseCase {
  /**
   * Checks if user is authenticated based on token existence
   */
  execute(): boolean {
    try {
      const token = LocalStorageService.getAuthToken();
      return !!token && this.validateTokenFormat(token);
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  /**
   * Validates a JWT token format (does not verify signature)
   * @param token The token to validate
   */
  validateTokenFormat(token: string): boolean {
    if (!token) return false;

    try {
      // Basic JWT format validation (header.payload.signature)
      const tokenParts = token.split(".");
      return tokenParts.length === 3;
    } catch (error) {
      console.error("Error validating token format:", error);
      return false;
    }
  }

  /**
   * Gets user information from localStorage if available
   */
  getCurrentUser(): IUser | null {
    try {
      return LocalStorageService.getUser();
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  /**
   * Check if the user has the required role
   * @param requiredRole The role to check for
   */
  hasRole(requiredRole: string): boolean {
    try {
      const user = this.getCurrentUser();
      return !!user && user.role === requiredRole;
    } catch (error) {
      console.error("Error checking user role:", error);
      return false;
    }
  }
}
