import { CheckAuthUseCase } from "./checkAuthUseCase";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";
import { EUserRole } from "@/domain/models/auth";

// Mock only the external LocalStorageService
jest.mock("@/infrastructure/storage/LocalStorageService", () => ({
  LocalStorageService: {
    getAuthToken: jest.fn(),
    getUser: jest.fn(),
  },
}));

describe("CheckAuthUseCase", () => {
  let checkAuthUseCase: CheckAuthUseCase;

  beforeEach(() => {
    checkAuthUseCase = new CheckAuthUseCase();
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should return true when valid token exists", () => {
      // Arrange
      const mockToken = "header.payload.signature";
      (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(
        mockToken
      );

      // Act
      const result = checkAuthUseCase.execute();

      // Assert
      expect(result).toBe(true);
      expect(LocalStorageService.getAuthToken).toHaveBeenCalled();
    });

    it("should return false when token is null", () => {
      // Arrange
      (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(null);

      // Act
      const result = checkAuthUseCase.execute();

      // Assert
      expect(result).toBe(false);
      expect(LocalStorageService.getAuthToken).toHaveBeenCalled();
    });

    it("should return false when token has invalid format", () => {
      // Arrange
      const mockInvalidToken = "invalid-token-format";
      (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(
        mockInvalidToken
      );

      // Act
      const result = checkAuthUseCase.execute();

      // Assert
      expect(result).toBe(false);
      expect(LocalStorageService.getAuthToken).toHaveBeenCalled();
    });
  });

  describe("validateTokenFormat", () => {
    it("should return true for valid JWT format", () => {
      // Arrange
      const validToken = "header.payload.signature";

      // Act
      const result = checkAuthUseCase.validateTokenFormat(validToken);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for invalid JWT format", () => {
      // Arrange
      const invalidTokens = [
        "header.payload", // missing signature
        "header", // only header
        "", // empty string
        "header.payload.signature.extra", // extra part
      ];

      // Act & Assert
      invalidTokens.forEach((token) => {
        expect(checkAuthUseCase.validateTokenFormat(token)).toBe(false);
      });
    });
  });

  describe("getCurrentUser", () => {
    it("should return user when available in localStorage", () => {
      // Arrange
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.TEAM_MEMBER,
        name: "Test User",
      };
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = checkAuthUseCase.getCurrentUser();

      // Assert
      expect(result).toEqual(mockUser);
      expect(LocalStorageService.getUser).toHaveBeenCalled();
    });

    it("should return null when user not found in localStorage", () => {
      // Arrange
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(null);

      // Act
      const result = checkAuthUseCase.getCurrentUser();

      // Assert
      expect(result).toBeNull();
      expect(LocalStorageService.getUser).toHaveBeenCalled();
    });
  });

  describe("hasRole", () => {
    it("should return true when user has required role", () => {
      // Arrange
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.ADMIN,
        name: "Test User",
      };
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = checkAuthUseCase.hasRole(EUserRole.ADMIN);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when user has different role", () => {
      // Arrange
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.TEAM_MEMBER,
        name: "Test User",
      };
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = checkAuthUseCase.hasRole(EUserRole.ADMIN);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when user is not found", () => {
      // Arrange
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(null);

      // Act
      const result = checkAuthUseCase.hasRole(EUserRole.ADMIN);

      // Assert
      expect(result).toBe(false);
    });
  });
});
