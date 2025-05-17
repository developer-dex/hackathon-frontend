import { IUser } from "@/domain/models/auth";
import { httpClient } from "@/infrastructure/http/httpClient";

/**
 * Pagination information in API response
 */
interface IPagination {
  total: number;
  offset: number;
  limit: number;
}

/**
 * API response for users
 */
interface IUsersResponse {
  success: boolean;
  data: {
    users: IUser[];
  };
  message: string;
  statusCode: number;
  pagination: IPagination;
}

/**
 * Use case for getting all users
 */
class GetUsersUseCase {
  async execute(): Promise<IUser[]> {
    try {
      const response = await httpClient.get<IUsersResponse>("/api/admin/users");
      return response.data.data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }
}

export const adminUseCase = {
  getUsers: new GetUsersUseCase(),
};
