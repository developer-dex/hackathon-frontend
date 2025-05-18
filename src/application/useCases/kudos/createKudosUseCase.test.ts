import { httpClient } from "@/infrastructure/http/httpClient";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";
import { CreateKudosUseCase } from "./createKudosUseCase";

// Mock external dependencies
jest.mock("@/infrastructure/http/httpClient");
jest.mock("@/infrastructure/storage/LocalStorageService");

describe("CreateKudosUseCase", () => {
  let createKudosUseCase: CreateKudosUseCase;
  const mockToken = "mock-token";
  const mockKudosData = {
    receiverId: "receiver-123",
    categoryId: "category-123",
    message: "Great work on the project!",
  };

  const mockSuccessResponse = {
    success: true,
    data: {
      id: "kudos-123",
      senderId: "sender-123",
      receiverId: "receiver-123",
      categoryId: "category-123",
      message: "Great work on the project!",
      createdAt: "2024-03-20T10:00:00Z",
    },
    message: "Kudos created successfully",
    statusCode: 201,
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(mockToken);
    (httpClient.post as jest.Mock).mockResolvedValue({
      data: mockSuccessResponse,
    });

    createKudosUseCase = new CreateKudosUseCase();
  });

  describe("execute", () => {
    it("should successfully create kudos with valid data", async () => {
      // Act
      const result = await createKudosUseCase.execute(mockKudosData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSuccessResponse.data);
      expect(result.message).toBe(mockSuccessResponse.message);

      // Verify HTTP call
      expect(httpClient.post).toHaveBeenCalledWith(
        "/api/kudos",
        mockKudosData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      );
    });

    it("should handle API error response", async () => {
      // Arrange
      const errorMessage = "Invalid kudos data";
      (httpClient.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
          },
        },
      });

      // Act
      const result = await createKudosUseCase.execute(mockKudosData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(errorMessage);
      expect(result.data).toBeUndefined();
    });

    it("should handle network error", async () => {
      // Arrange
      const errorMessage = "Network error";
      (httpClient.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await createKudosUseCase.execute(mockKudosData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(errorMessage);
      expect(result.data).toBeUndefined();
    });

    it("should handle missing auth token", async () => {
      // Arrange
      (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(null);

      // Act
      const result = await createKudosUseCase.execute(mockKudosData);

      // Assert
      expect(result.success).toBe(true);
      expect(httpClient.post).toHaveBeenCalledWith(
        "/api/kudos",
        mockKudosData,
        { headers: undefined }
      );
    });

    it("should handle empty response message", async () => {
      // Arrange
      (httpClient.post as jest.Mock).mockResolvedValue({
        data: {
          ...mockSuccessResponse,
          message: "",
        },
      });

      // Act
      const result = await createKudosUseCase.execute(mockKudosData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toBe("Kudos created successfully!");
    });

    it("should handle error response", async () => {
      // Arrange
      const errorMessage = "Error creating kudos";
      (httpClient.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await createKudosUseCase.execute(mockKudosData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe(errorMessage);
      expect(result.data).toBeUndefined();
    });
  });
});
