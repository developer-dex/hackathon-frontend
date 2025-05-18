import { IUser } from "@/domain/models/auth";
import { IAdminRepository } from "@/infrastructure/repositories/interfaces/repositories/admin.interface";

export class ChangeUserRoleUseCase {
  private readonly adminRepository: IAdminRepository;
  private readonly apiPath = "/api/admin/users/change-role";

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Changes a user's role
   * @param userId The ID of the user to update
   * @param role The new role to assign to the user
   * @returns The updated user object
   */
  async execute(userId: string, role: string): Promise<IUser | null> {
    try {
      return await this.adminRepository.updateUserRole(userId, role);
    } catch (error) {
      console.error("Error in ChangeUserRoleUseCase:", error);
      return null;
    }
  }
}
