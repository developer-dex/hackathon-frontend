import { ChangeUserTeamUseCase } from "./changeUserTeamUseCase";
import { AdminRepositoryImpl } from "@/infrastructure/repositories/implementations/AdminRepositoryImpl";
import { EUserRole, IUser } from "@/domain/models/auth";
import { httpClient } from "@/infrastructure/http/httpClient";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

// Mock only the external httpClient
jest.mock("@/infrastructure/http/httpClient", () => ({
  httpClient: {
    patch: jest.fn(),
  },
}));

// Mock the LocalStorageService as it's an external dependency
jest.mock("@/infrastructure/storage/LocalStorageService", () => ({
  LocalStorageService: {
    getAuthToken: jest.fn().mockReturnValue("mock-token"),
  },
}));

describe("ChangeUserTeamUseCase", () => {
  // Use real implementation of AdminRepositoryImpl
  const adminRepository = new AdminRepositoryImpl();
  const changeUserTeamUseCase = new ChangeUserTeamUseCase(adminRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be able to change user team successfully", async () => {
    // Arrange
    const mockUser: IUser = {
      id: "123",
      email: "test@example.com",
      role: EUserRole.ADMIN,
      name: "Test User",
      team: {
        id: "team-456",
        name: "Test Team",
      },
    };

    const mockResponse = {
      data: {
        success: true,
        data: mockUser,
        message: "User team updated successfully",
        statusCode: 200,
      },
    };

    (httpClient.patch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Act
    const result = await changeUserTeamUseCase.execute("123", "team-456");

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockUser);
    expect(httpClient.patch).toHaveBeenCalledWith(
      "/api/admin/users/change-team",
      { userId: "123", teamId: "team-456" },
      {
        headers: {
          Authorization: "Bearer mock-token",
        },
      }
    );
  });

  it("should return null when API returns unsuccessful response", async () => {
    // Arrange
    const mockResponse = {
      data: {
        success: false,
        data: null,
        message: "Failed to update user team",
        statusCode: 400,
      },
    };

    (httpClient.patch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Act
    const result = await changeUserTeamUseCase.execute("123", "team-456");

    // Assert
    expect(result).toBeNull();
    expect(httpClient.patch).toHaveBeenCalledWith(
      "/api/admin/users/change-team",
      { userId: "123", teamId: "team-456" },
      {
        headers: {
          Authorization: "Bearer mock-token",
        },
      }
    );
  });

  it("should return null when HTTP client throws an error", async () => {
    // Arrange
    (httpClient.patch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    // Act
    const result = await changeUserTeamUseCase.execute("123", "team-456");

    // Assert
    expect(result).toBeNull();
    expect(httpClient.patch).toHaveBeenCalledWith(
      "/api/admin/users/change-team",
      { userId: "123", teamId: "team-456" },
      {
        headers: {
          Authorization: "Bearer mock-token",
        },
      }
    );
  });

  it("should return error when token not found", async () => {
    // Arrange
    (LocalStorageService.getAuthToken as jest.Mock).mockReturnValueOnce(null);

    // Act
    const result = await changeUserTeamUseCase.execute("123", "team-456");

    // Assert
    expect(result).toBeNull();
    expect(LocalStorageService.getAuthToken).toHaveBeenCalled();
  });
});
