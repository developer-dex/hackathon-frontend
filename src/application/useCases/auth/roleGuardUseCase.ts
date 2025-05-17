import { EUserRole } from "@/domain/models/auth";
import { CheckAuthUseCase } from "./checkAuthUseCase";

export class RoleGuardUseCase {
  constructor(private checkAuthUseCase: CheckAuthUseCase) {}

  /**
   * Check if current user has team lead access
   */
  execute(): boolean {
    try {
      // First check if user is authenticated
      if (!this.checkAuthUseCase.execute()) {
        return false;
      }

      // Then check if user has TEAM_LEAD role
      return this.checkAuthUseCase.hasRole(EUserRole.TEAM_LEAD);
    } catch (error) {
      console.error("Error checking team lead access:", error);
      return false;
    }
  }

  /**
   * Check if current user has admin access
   */
  isAdmin(): boolean {
    try {
      if (!this.checkAuthUseCase.execute()) {
        return false;
      }
      return this.checkAuthUseCase.hasRole(EUserRole.ADMIN);
    } catch (error) {
      console.error("Error checking admin access:", error);
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

      return roles.includes(user.role as EUserRole);
    } catch (error) {
      console.error("Error checking user roles:", error);
      return false;
    }
  }
}
