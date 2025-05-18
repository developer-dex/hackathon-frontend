import { GetCategoriesUseCase } from "./getCategoriesUseCase";
import { httpClient } from "@/infrastructure/http/httpClient";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

// Mock only the external http client
jest.mock("@/infrastructure/http/httpClient");

describe("GetCategoriesUseCase", () => {
  let getCategoriesUseCase: GetCategoriesUseCase;

  beforeEach(() => {
    getCategoriesUseCase = new GetCategoriesUseCase();
    jest.clearAllMocks();
  });

  it("should successfully fetch categories when API returns array directly", async () => {
    // Mock API response with direct array
    const mockCategories = [
      {
        id: "1",
        name: "Category 1",
        description: "Description 1",
        icon: "icon1",
        iconUrl: "url1",
        color: "#123456",
        isActive: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];

    (httpClient.get as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        data: mockCategories,
        message: "Success",
        statusCode: 200,
      },
    });

    const categories = await getCategoriesUseCase.execute();

    expect(categories).toEqual(mockCategories);
    expect(httpClient.get).toHaveBeenCalledWith("/api/categories", {
      headers: undefined,
    });
  });

  it("should successfully fetch categories when API returns nested categories object", async () => {
    // Mock API response with nested categories
    const mockCategories = [
      {
        id: "1",
        name: "Category 1",
        description: "Description 1",
        icon: "icon1",
        iconUrl: "url1",
        color: "#123456",
        isActive: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];

    (httpClient.get as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        data: {
          categories: mockCategories,
          total: 1,
        },
        message: "Success",
        statusCode: 200,
      },
    });

    const categories = await getCategoriesUseCase.execute();

    expect(categories).toEqual(mockCategories);
    expect(httpClient.get).toHaveBeenCalledWith("/api/categories", {
      headers: undefined,
    });
  });

  it("should handle missing optional fields with default values", async () => {
    // Mock API response with minimal category data
    const mockCategories = [
      {
        id: "1",
        name: "Category 1",
      },
    ];

    (httpClient.get as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        data: mockCategories,
        message: "Success",
        statusCode: 200,
      },
    });

    const categories = await getCategoriesUseCase.execute();

    expect(categories[0]).toEqual({
      id: "1",
      name: "Category 1",
      description: "",
      icon: "",
      iconUrl: "",
      color: "#1976d2",
      isActive: true,
      createdAt: undefined,
      updatedAt: undefined,
    });
  });

  it("should include auth token in headers when available", async () => {
    const mockToken = "test-token";
    jest.spyOn(LocalStorageService, "getAuthToken").mockReturnValue(mockToken);

    (httpClient.get as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        data: [],
        message: "Success",
        statusCode: 200,
      },
    });

    await getCategoriesUseCase.execute();

    expect(httpClient.get).toHaveBeenCalledWith("/api/categories", {
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
  });

  it("should handle API errors gracefully", async () => {
    (httpClient.get as jest.Mock).mockRejectedValue(new Error("API Error"));

    await expect(getCategoriesUseCase.execute()).rejects.toThrow(
      "Failed to fetch categories"
    );
  });

  it("should handle unexpected API response format", async () => {
    // Mock API response with unexpected format
    (httpClient.get as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        data: { unexpected: "format" },
        message: "Success",
        statusCode: 200,
      },
    });

    const categories = await getCategoriesUseCase.execute();
    expect(categories).toEqual([]);
  });
});
