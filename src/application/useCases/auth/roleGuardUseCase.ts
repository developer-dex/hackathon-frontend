import { EUserRole } from "@/domain/models/auth";
import { CheckAuthUseCase } from "./checkAuthUseCase";

export class RoleGuardUseCase {
  constructor(private checkAuthUseCase: CheckAuthUseCase) {}

  /**
   * Check if current user has tech lead access
   */
  execute(): boolean {
    try {
      // First check if user is authenticated
      if (!this.checkAuthUseCase.execute()) {
        return false;
      }

      // Then check if user has TECH_LEAD role
      return this.checkAuthUseCase.hasRole(EUserRole.TECH_LEAD);
    } catch (error) {
      console.error("Error checking tech lead access:", error);
      return false;
    }
  }

  /**
   * Check if current user has a specific role
   */
  hasRole(role: EUserRole): boolean {
    try {
      return this.checkAuthUseCase.hasRole(role);
    } catch (error) {
      console.error(`Error checking role ${role}:`, error);
      return false;
    }
  }

  /**
   * Check if current user has any of the specified roles
   */
  hasAnyRole(roles: EUserRole[]): boolean {
    try {
      const user = this.checkAuthUseCase.getCurrentUser();
      if (!user) return false;

      return roles.includes(user.role);
    } catch (error) {
      console.error("Error checking user roles:", error);
      return false;
    }
  }
}
