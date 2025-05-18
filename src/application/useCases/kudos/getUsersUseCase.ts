import { httpClient } from "@/infrastructure/http/httpClient";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

/**
 * User interface representing user data
 */
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified?: boolean;
  verificationStatus?: string;
  createdAt?: string;
  team?: {
    id: string;
    name: string;
  };
  teamId?: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

/**
 * Raw user data from API that might have inconsistent structure
 */
interface IUserRaw {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified?: boolean;
  verificationStatus?: string;
  createdAt?: string;
  team?: {
    id: string;
    name: string;
  };
  teamId?: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

// Type for data object that can have various properties
interface IDataObject {
  users?: IUserRaw[];
  total?: number;
  [key: string]: unknown;
}

/**
 * API response for users - handles multiple possible API response formats
 */
interface IUsersResponse {
  success: boolean;
  data: IDataObject | IUserRaw[];
  message: string;
  statusCode: number;
  pagination?: {
    total: number;
    offset: number;
    limit: number;
  };
}

/**
 * Pagination params for fetching users
 */
export interface IPaginationParams {
  offset?: number;
  limit?: number;
}

/**
 * Result of fetching users with pagination
 */
export interface IPaginatedUsers {
  users: IUser[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * Use case for getting all users
 */
export class GetUsersUseCase {
  async execute(
    paginationParams?: IPaginationParams
  ): Promise<IPaginatedUsers> {
    try {
      // Get auth token from local storage
      const token = LocalStorageService.getAuthToken();

      // Create config for request with headers
      const config: {
        headers?: { Authorization: string };
        params?: {
          offset?: number;
          limit?: number;
        };
      } = {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      };

      //   Add query parameters for pagination ONLY if explicitly provided
      if (paginationParams) {
        // Initialize params object only if we have pagination parameters
        config.params = {};

        // Only add offset if it's defined
        if (paginationParams.offset !== undefined) {
          config.params.offset = paginationParams.offset;
        }

        // Only add limit if it's defined
        if (paginationParams.limit !== undefined) {
          config.params.limit = paginationParams.limit;
        }

        if (paginationParams.offset === 0 && paginationParams.limit === 10) {
          config.params = undefined;
        }

        // If both parameters are undefined, don't send params at all
        if (
          paginationParams.offset === undefined &&
          paginationParams.limit === undefined
        ) {
          config.params = undefined;
        }
      }

      const response = await httpClient.get<IUsersResponse>(
        "/api/admin/users",
        config
      );

      // Process the response to ensure it matches the expected format
      let usersData: IUserRaw[] = [];
      let total = 0;

      // Default values for when pagination info isn't available - use 0 and total users if not specified
      let offset = paginationParams?.offset ?? 0;
      let limit = paginationParams?.limit ?? 0; // Will be updated to array length if not provided

      // Extract pagination info if available in the response
      if (response.data.pagination) {
        total = response.data.pagination.total;
        offset = response.data.pagination.offset;
        limit = response.data.pagination.limit;
      }

      if (Array.isArray(response.data.data)) {
        // If data is directly an array of users
        usersData = response.data.data;
      } else if (response.data.data && typeof response.data.data === "object") {
        const dataObj = response.data.data as IDataObject;

        // Get total count if available
        if (dataObj.total !== undefined) {
          total = dataObj.total;
        }

        // Check if data.users exists and is an array
        if ("users" in dataObj && Array.isArray(dataObj.users)) {
          usersData = dataObj.users;
        } else {
          // Last resort - try to find any array property in the data object
          const arrayProps = Object.keys(dataObj).filter((key) => {
            const value = dataObj[key];
            return (
              Array.isArray(value) &&
              value.length > 0 &&
              typeof value[0] === "object" &&
              value[0] !== null &&
              "id" in value[0]
            );
          });

          if (arrayProps.length > 0) {
            const firstKey = arrayProps[0];
            const arrayData = dataObj[firstKey];
            if (Array.isArray(arrayData)) {
              usersData = arrayData as IUserRaw[];
            }
          } else {
            console.error(
              "Could not find users array in API response:",
              response.data
            );
            throw new Error("Could not find users array in API response");
          }
        }
      }

      // Map the users to ensure they have the correct structure
      const mappedUsers = usersData.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        // Set the verification status based on isVerified if not explicitly provided
        verificationStatus:
          user.verificationStatus || (user.isVerified ? "Verified" : "Pending"),
        team:
          user.team ||
          (user.teamId
            ? {
                id: user.teamId._id,
                name: user.teamId.name,
              }
            : undefined),
        teamId: user.teamId,
      }));

      // If total wasn't set by pagination, use the length of the mappedUsers array
      if (total === 0) {
        total = mappedUsers.length;
      }

      // If limit wasn't provided in pagination params, set it to match the total users
      if (!paginationParams?.limit) {
        limit = mappedUsers.length;
      }

      return {
        users: mappedUsers,
        total,
        offset,
        limit,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }
}
