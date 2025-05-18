import { LogoutUseCase } from "./logoutUseCase";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";
import { IUser } from "@/domain/models/auth";

describe("LogoutUseCase", () => {
  let logoutUseCase: LogoutUseCase;

  beforeEach(() => {
    logoutUseCase = new LogoutUseCase();
    // Clear any existing data before each test
    LocalStorageService.clearAuth();
  });

  describe("execute", () => {
    it("should successfully clear auth data and return true", () => {
      // Arrange
      const mockUser: IUser = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
        role: "user",
      };
      LocalStorageService.setAuthToken("test-token");
      LocalStorageService.setUser(mockUser);

      // Act
      const result = logoutUseCase.execute();

      // Assert
      expect(result).toBe(true);
      expect(LocalStorageService.getAuthToken()).toBeNull();
      expect(LocalStorageService.getUser()).toBeNull();
    });

    it("should return true even when no auth data exists", () => {
      // Act
      const result = logoutUseCase.execute();

      // Assert
      expect(result).toBe(true);
      expect(LocalStorageService.getAuthToken()).toBeNull();
      expect(LocalStorageService.getUser()).toBeNull();
    });

    it("should handle errors gracefully and return false", () => {
      // Arrange
      // Mock localStorage to throw an error
      const originalLocalStorage = window.localStorage;
      const mockLocalStorage = {
        ...originalLocalStorage,
        removeItem: jest.fn().mockImplementation(() => {
          throw new Error("Storage error");
        }),
      };
      Object.defineProperty(window, "localStorage", {
        value: mockLocalStorage,
      });

      // Act
      const result = logoutUseCase.execute();

      // Assert
      expect(result).toBe(false);

      // Cleanup
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
      });
    });
  });
});
