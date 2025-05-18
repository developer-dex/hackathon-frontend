import { IUser } from "@/domain/models/auth";
import { IAdminRepository } from "@/infrastructure/repositories/interfaces/repositories/admin.interface";

export class ChangeUserTeamUseCase {
  private readonly adminRepository: IAdminRepository;
  private readonly apiPath = "/api/admin/users/change-team";

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }

  /**
   * Changes a user's team
   * @param userId The ID of the user to update
   * @param teamId The ID of the new team for the user
   * @returns The updated user object
   */
  async execute(userId: string, teamId: string): Promise<IUser | null> {
    try {
      return await this.adminRepository.updateUserTeam(userId, teamId);
    } catch (error) {
      console.error("Error in ChangeUserTeamUseCase:", error);
      return null;
    }
  }
}
