import { IKudos, IKudosApiResponse } from "@/domain/entities/Kudos.types";
import { IKudosRepository } from "@/infrastructure/repositories/interfaces/repositories/kudos.interface";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

/**
 * Implementation of the KudosRepository interface
 */
export class KudosRepositoryImpl implements IKudosRepository {
  private readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  /**
   * Gets auth headers with Bearer token if available
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = LocalStorageService.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Fetches a list of kudos
   * @param offset Page number (0-based) for pagination
   * @param limit Number of items per page
   * @returns A promise that resolves to an array of kudos or null if the request fails
   */
  async getKudosList(
    offset: number = 0,
    limit: number = 9
  ): Promise<IKudosApiResponse | null> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/api/kudos?offset=${offset}&limit=${limit}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch kudos list:", response.statusText);
        return null;
      }

      const responseData = (await response.json()) as IKudosApiResponse;

      // Check if the response has the expected structure
      if (!responseData.success) {
        console.error("Invalid response format from kudos API:", responseData);
        return null;
      }

      return responseData;
    } catch (error) {
      console.error("Error fetching kudos list:", error);
      return null;
    }
  }

  /**
   * Fetches a single kudos by its ID
   * @param id The ID of the kudos to fetch
   * @returns A promise that resolves to a kudos object or null if not found
   */
  async getKudosById(id: string): Promise<IKudos | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/kudos/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch kudos with ID ${id}:`,
          response.statusText
        );
        return null;
      }

      const responseData = await response.json();

      // Check if the response has the expected structure
      if (!responseData.success) {
        console.error("Invalid response format from kudos API:", responseData);
        return null;
      }

      return responseData.data;
    } catch (error) {
      console.error(`Error fetching kudos with ID ${id}:`, error);
      return null;
    }
  }
}
