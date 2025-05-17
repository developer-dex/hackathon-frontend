import { httpClient } from "@/infrastructure/http/httpClient";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

/**
 * Interface for creating kudos request
 */
export interface ICreateKudosRequest {
  receiverId: string;
  categoryId: string;
  message: string;
}

/**
 * Interface for kudos response
 */
interface ICreateKudosResponse {
  success: boolean;
  data: {
    id: string;
    senderId: string;
    receiverId: string;
    categoryId: string;
    message: string;
    teamId?: string;
    createdAt: string;
  };
  message: string;
  statusCode: number;
}

/**
 * Use case for creating a new kudos
 */
export class CreateKudosUseCase {
  /**
   * Execute the create kudos use case
   * @param kudosData The kudos data to submit
   * @returns Promise with the response data
   */
  async execute(kudosData: ICreateKudosRequest): Promise<{
    success: boolean;
    data?: ICreateKudosResponse["data"];
    message: string;
  }> {
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

      console.log("Submitting kudos data:", kudosData);

      const response = await httpClient.post<ICreateKudosResponse>(
        "/api/kudos",
        kudosData,
        config
      );

      console.log("Kudos API response:", response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Kudos created successfully!",
      };
    } catch (error: unknown) {
      console.error("Error creating kudos:", error);

      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        (error as Error).message ||
        "Failed to create kudos";

      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}
