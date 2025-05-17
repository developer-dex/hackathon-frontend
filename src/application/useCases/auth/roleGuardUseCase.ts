import { EUserRole } from "@/domain/models/auth";
import { CheckAuthUseCase } from "./checkAuthUseCase";

export class RoleGuardUseCase {
  constructor(private checkAuthUseCase: CheckAuthUseCase) {}

  /**
   * Check if current user has tech lead access
   */
  execute(): boolean {
    // First check if user is authenticated
    if (!this.checkAuthUseCase.execute()) {
      return false;
    }

    // Then check if user has TECH_LEAD role
    return this.checkAuthUseCase.hasRole(EUserRole.TECH_LEAD);
  }

  /**
   * Check if current user has a specific role
   */
  hasRole(role: EUserRole): boolean {
    return this.checkAuthUseCase.hasRole(role);
  }

  /**
   * Check if current user has any of the specified roles
   */
  hasAnyRole(roles: EUserRole[]): boolean {
    const user = this.checkAuthUseCase.getCurrentUser();
    if (!user) return false;

    return roles.includes(user.role);
  }
}
