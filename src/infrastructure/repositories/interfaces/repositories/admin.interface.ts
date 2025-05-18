import { IUser, EUserRole } from "@/domain/models/auth";

export interface IAdminRepository {
  /**
   * Gets a list of all users
   * @returns A promise that resolves to an array of users
   */
  getUsers(): Promise<IUser[]>;

  /**
   * Updates a user's verification status
   * @param userId The ID of the user to update
   * @param status The new verification status (e.g., "Verified", "Pending")
   * @returns A promise that resolves to the updated user or null if failed
   */
  updateUserVerificationStatus(
    userId: string,
    status: string
  ): Promise<IUser | null>;

  /**
   * Updates a user's role
   * @param userId The ID of the user to update
   * @param role The new role for the user
   * @returns A promise that resolves to the updated user or null if failed
   */
  updateUserRole(userId: string, role: EUserRole): Promise<IUser | null>;

  /**
   * Updates a user's team
   * @param userId The ID of the user to update
   * @param teamId The ID of the new team for the user
   * @returns A promise that resolves to the updated user or null if failed
   */
  updateUserTeam(userId: string, teamId: string): Promise<IUser | null>;
}
