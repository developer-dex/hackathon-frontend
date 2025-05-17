import { ICategory } from "@/domain/models/kudos";
import { httpClient } from "@/infrastructure/http/httpClient";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

/**
 * API response for categories
 */
interface ICategoriesResponse {
  success: boolean;
  data:
    | {
        categories?: ICategory[];
        total?: number;
      }
    | ICategory[];
  message: string;
  statusCode: number;
}

/**
 * Raw category data that might be missing some fields
 */
interface ICategoryRaw {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  iconUrl?: string;
  color?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Use case for getting all categories
 */
export class GetCategoriesUseCase {
  async execute(): Promise<ICategory[]> {
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

      const response = await httpClient.get<ICategoriesResponse>(
        "/api/categories",
        config
      );

      // Handle different possible API response structures
      let categoriesData: ICategoryRaw[] = [];

      if (Array.isArray(response.data.data)) {
        // If data is directly an array of categories
        categoriesData = response.data.data;
      } else if (
        response.data.data &&
        "categories" in response.data.data &&
        Array.isArray(response.data.data.categories)
      ) {
        // If data contains a categories property
        categoriesData = response.data.data.categories;
      } else {
        // Log error but continue with empty array
        console.error("Unexpected API response format:", response.data);
      }

      // Ensure each category has the required fields with defaults
      return categoriesData.map((category: ICategoryRaw) => ({
        id: category.id,
        name: category.name,
        description: category.description || "",
        icon: category.icon || "",
        iconUrl: category.iconUrl || "",
        color: category.color || "#1976d2", // Default primary color
        isActive: category.isActive !== undefined ? category.isActive : true,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }
}
