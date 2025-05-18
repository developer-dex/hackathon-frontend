import { adminRepository } from "@/infrastructure/repositories";
import { ApproveUserUseCase } from "./approveUserUseCase";
import { GetUsersUseCase } from "../kudos/getUsersUseCase";
import { ChangeUserRoleUseCase } from "./changeUserRoleUseCase";
import { ChangeUserTeamUseCase } from "./changeUserTeamUseCase";

/**
 * Admin Use Case Factory
 * Responsible for creating and providing singleton instances of admin use cases
 */
export class AdminUseCaseFactory {
  private static _iApproveUserUseCase: ApproveUserUseCase;
  private static _iGetUsersUseCase: GetUsersUseCase;
  private static _iChangeUserRoleUseCase: ChangeUserRoleUseCase;
  private static _iChangeUserTeamUseCase: ChangeUserTeamUseCase;

  /**
   * Get approve user use case singleton instance
   */
  static get approveUser(): ApproveUserUseCase {
    if (!this._iApproveUserUseCase) {
      this._iApproveUserUseCase = new ApproveUserUseCase(adminRepository);
    }
    return this._iApproveUserUseCase;
  }

  /**
   * Get users use case singleton instance
   */
  static get getUsers(): GetUsersUseCase {
    if (!this._iGetUsersUseCase) {
      this._iGetUsersUseCase = new GetUsersUseCase();
    }
    return this._iGetUsersUseCase;
  }

  /**
   * Get change user role use case singleton instance
   */
  static get changeUserRole(): ChangeUserRoleUseCase {
    if (!this._iChangeUserRoleUseCase) {
      this._iChangeUserRoleUseCase = new ChangeUserRoleUseCase(adminRepository);
    }
    return this._iChangeUserRoleUseCase;
  }

  /**
   * Get change user team use case singleton instance
   */
  static get changeUserTeam(): ChangeUserTeamUseCase {
    if (!this._iChangeUserTeamUseCase) {
      this._iChangeUserTeamUseCase = new ChangeUserTeamUseCase(adminRepository);
    }
    return this._iChangeUserTeamUseCase;
  }
}

export const adminUseCase = AdminUseCaseFactory;
