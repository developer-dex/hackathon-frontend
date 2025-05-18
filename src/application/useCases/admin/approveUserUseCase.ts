import { IUser, EVerificationStatus } from "@/domain/models/auth";
import { IAdminRepository } from "@/infrastructure/repositories/interfaces/repositories/admin.interface";

/**
 * Use case for approving a user by updating their verification status to Verified
 */
export class ApproveUserUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  /**
   * Approves a user by setting their verification status to "Verified"
   * @param userId ID of the user to approve
   * @returns A promise that resolves to the updated user or null if failed
   * @throws Error if the operation fails
   */
  async execute(userId: string): Promise<IUser | null> {
    try {
      console.log("🔍 UseCase: Approving user with ID:", userId);
      console.log("🔍 UseCase: Using status:", EVerificationStatus.VERIFIED);

      const result = await this.adminRepository.updateUserVerificationStatus(
        userId,
        EVerificationStatus.VERIFIED
      );

      console.log("🔍 UseCase: Repository returned:", result);
      return result;
    } catch (error) {
      console.error(
        `❌ UseCase: Error approving user with ID ${userId}:`,
        error
      );
      throw new Error(
        `Failed to approve user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
