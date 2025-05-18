import { IUser } from "@/domain/models/auth";
import { IAdminRepository } from "../interfaces/repositories/admin.interface";
import { httpClient } from "@/infrastructure/http/httpClient";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

interface IApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

export class AdminRepositoryImpl implements IAdminRepository {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  /**
   * Gets auth token from local storage and creates headers
   * @returns Headers object with authorization token
   */
  private getAuthHeaders() {
    const token = LocalStorageService.getAuthToken();
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    };
  }

  /**
   * Gets a list of all users
   * @returns A promise that resolves to an array of users
   */
  async getUsers(): Promise<IUser[]> {
    try {
      const response = await httpClient.get<IApiResponse<{ users: IUser[] }>>(
        "/api/admin/users",
        this.getAuthHeaders()
      );

      if (!response.data.success) {
        console.error("Failed to fetch users:", response.data.message);
        return [];
      }

      return response.data.data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  /**
   * Updates a user's verification status
   * @param userId The ID of the user to update
   * @param status The new verification status (e.g., "Verified", "Pending")
   * @returns A promise that resolves to the updated user or null if failed
   */
  async updateUserVerificationStatus(
    userId: string,
    status: string
  ): Promise<IUser | null> {
    try {
      const response = await httpClient.patch<IApiResponse<IUser>>(
        `/api/admin/users/${userId}/verification-status`,
        { status },
        this.getAuthHeaders()
      );

      if (!response.data.success) {
        console.error(
          "❌ Repository: Failed to update user verification status:",
          response.data.message
        );
        return null;
      }

      return response.data.data;
    } catch (error) {
      console.error(
        "❌ Repository: Error updating user verification status:",
        error
      );
      throw new Error("Failed to update user verification status");
    }
  }

  /**
   * Updates a user's role
   * @param userId The ID of the user to update
   * @param role The new role for the user
   * @returns A promise that resolves to the updated user or null if failed
   */
  async updateUserRole(userId: string, role: string): Promise<IUser | null> {
    try {
      const requestBody = {
        userId,
        role,
      };

      const response = await httpClient.patch<IApiResponse<IUser>>(
        `/api/admin/users/change-role`,
        requestBody,
        this.getAuthHeaders()
      );

      if (!response.data.success) {
        console.error(
          "❌ Repository: Failed to update user role:",
          response.data.message
        );
        return null;
      }

      return response.data.data;
    } catch (error) {
      console.error("❌ Repository: Error updating user role:", error);
      throw new Error("Failed to update user role");
    }
  }

  /**
   * Updates a user's team
   * @param userId The ID of the user to update
   * @param teamId The ID of the new team for the user
   * @returns A promise that resolves to the updated user or null if failed
   */
  async updateUserTeam(userId: string, teamId: string): Promise<IUser | null> {
    try {
      const requestBody = {
        userId,
        teamId,
      };

      const response = await httpClient.patch<IApiResponse<IUser>>(
        `/api/admin/users/change-team`,
        requestBody,
        this.getAuthHeaders()
      );

      if (!response.data.success) {
        console.error(
          "❌ Repository: Failed to update user team:",
          response.data.message
        );
        return null;
      }

      return response.data.data;
    } catch (error) {
      console.error("❌ Repository: Error updating user team:", error);
      throw new Error("Failed to update user team");
    }
  }
}
