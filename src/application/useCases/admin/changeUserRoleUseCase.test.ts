import { ChangeUserRoleUseCase } from "./changeUserRoleUseCase";
import { AdminRepositoryImpl } from "@/infrastructure/repositories/implementations/AdminRepositoryImpl";
import { EUserRole, IUser } from "@/domain/models/auth";
import { httpClient } from "@/infrastructure/http/httpClient";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

// Mock the httpClient
jest.mock("@/infrastructure/http/httpClient", () => ({
  httpClient: {
    patch: jest.fn(),
  },
}));

// Mock the LocalStorageService
jest.mock("@/infrastructure/storage/LocalStorageService", () => ({
  LocalStorageService: {
    getAuthToken: jest.fn().mockReturnValue("mock-token"),
  },
}));

describe.only("ChangeUserRoleUseCase", () => {
  const adminRepository = new AdminRepositoryImpl();
  const changeUserRoleUseCase = new ChangeUserRoleUseCase(adminRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be able to change user role successfully", async () => {
    // Arrange
    const mockUser: IUser = {
      id: "123",
      email: "test@example.com",
      role: EUserRole.ADMIN,
      name: "Test User",
      // Add other required IUser properties here
    };

    const mockResponse = {
      data: {
        success: true,
        data: mockUser,
        message: "User role updated successfully",
        statusCode: 200,
      },
    };

    (httpClient.patch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Act
    const result = await changeUserRoleUseCase.execute("123", EUserRole.ADMIN);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockUser);
    expect(httpClient.patch).toHaveBeenCalledWith(
      "/api/admin/users/change-role",
      { userId: "123", role: EUserRole.ADMIN },
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
        message: "Failed to update user role",
        statusCode: 400,
      },
    };

    (httpClient.patch as jest.Mock).mockResolvedValueOnce(mockResponse);

    // Act
    const result = await changeUserRoleUseCase.execute("123", EUserRole.ADMIN);

    // Assert
    expect(result).toBeNull();
    expect(httpClient.patch).toHaveBeenCalledWith(
      "/api/admin/users/change-role",
      { userId: "123", role: EUserRole.ADMIN },
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
    const result = await changeUserRoleUseCase.execute("123", EUserRole.ADMIN);

    // Assert
    expect(result).toBeNull();
    expect(httpClient.patch).toHaveBeenCalledWith(
      "/api/admin/users/change-role",
      { userId: "123", role: EUserRole.ADMIN },
      {
        headers: {
          Authorization: "Bearer mock-token",
        },
      }
    );
  });
});
