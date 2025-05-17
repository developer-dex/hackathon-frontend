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
  team?: {
    id: string;
    name: string;
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
  team?: {
    id: string;
    name: string;
  }; // Allow additional properties
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
}

/**
 * Use case for getting all users
 */
export class GetUsersUseCase {
  async execute(): Promise<IUser[]> {
    try {
      // Get auth token from local storage
      const token = LocalStorageService.getAuthToken();

      // Create config for request with headers
      const config = {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      };

      console.log("Sending request to fetch users...");
      const response = await httpClient.get<IUsersResponse>(
        "/api/admin/users",
        config
      );
      console.log(
        "Users API response:",
        JSON.stringify(response.data, null, 2)
      );

      // Process the response to ensure it matches the expected format
      let usersData: IUserRaw[] = [];

      if (Array.isArray(response.data.data)) {
        // If data is directly an array of users
        usersData = response.data.data;
      } else if (response.data.data && typeof response.data.data === "object") {
        const dataObj = response.data.data as IDataObject;
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
          }
        }
      }

      console.log("Extracted users data:", usersData);

      // Map the users to ensure they have the correct structure
      return usersData.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        // Set the verification status based on isVerified if not explicitly provided
        verificationStatus:
          user.verificationStatus || (user.isVerified ? "Verified" : "Pending"),
        team: user.team,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users");
    }
  }
}
