import { RoleGuardUseCase } from "./roleGuardUseCase";
import { CheckAuthUseCase } from "./checkAuthUseCase";
import { EUserRole } from "@/domain/models/auth";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

// Mock only the external LocalStorageService
jest.mock("@/infrastructure/storage/LocalStorageService", () => ({
  LocalStorageService: {
    getAuthToken: jest.fn(),
    getUser: jest.fn(),
  },
}));

describe("RoleGuardUseCase", () => {
  let roleGuardUseCase: RoleGuardUseCase;
  let checkAuthUseCase: CheckAuthUseCase;

  beforeEach(() => {
    checkAuthUseCase = new CheckAuthUseCase();
    roleGuardUseCase = new RoleGuardUseCase(checkAuthUseCase);
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should return true when user is authenticated and has TEAM_LEAD role", () => {
      // Arrange
      const mockToken = "valid.token.here";
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.TEAM_LEAD,
        name: "Test User",
      };
      (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(
        mockToken
      );
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = roleGuardUseCase.execute();

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when user is not authenticated", () => {
      // Arrange
      (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(null);

      // Act
      const result = roleGuardUseCase.execute();

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when user is authenticated but not a TEAM_LEAD", () => {
      // Arrange
      const mockToken = "valid.token.here";
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.TEAM_MEMBER,
        name: "Test User",
      };
      (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(
        mockToken
      );
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = roleGuardUseCase.execute();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("isAdmin", () => {
    it("should return true when user is authenticated and has ADMIN role", () => {
      // Arrange
      const mockToken = "valid.token.here";
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.ADMIN,
        name: "Test User",
      };
      (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(
        mockToken
      );
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = roleGuardUseCase.isAdmin();

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when user is not authenticated", () => {
      // Arrange
      (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(null);

      // Act
      const result = roleGuardUseCase.isAdmin();

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when user is authenticated but not an ADMIN", () => {
      // Arrange
      const mockToken = "valid.token.here";
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.TEAM_MEMBER,
        name: "Test User",
      };
      (LocalStorageService.getAuthToken as jest.Mock).mockReturnValue(
        mockToken
      );
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = roleGuardUseCase.isAdmin();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("hasRole", () => {
    it("should return true when user has the specified role", () => {
      // Arrange
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.TEAM_LEAD,
        name: "Test User",
      };
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = roleGuardUseCase.hasRole(EUserRole.TEAM_LEAD);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when user has a different role", () => {
      // Arrange
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.TEAM_MEMBER,
        name: "Test User",
      };
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = roleGuardUseCase.hasRole(EUserRole.TEAM_LEAD);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when user is not found", () => {
      // Arrange
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(null);

      // Act
      const result = roleGuardUseCase.hasRole(EUserRole.TEAM_LEAD);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("hasAnyRole", () => {
    it("should return true when user has one of the specified roles", () => {
      // Arrange
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.TEAM_LEAD,
        name: "Test User",
      };
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = roleGuardUseCase.hasAnyRole([
        EUserRole.TEAM_MEMBER,
        EUserRole.TEAM_LEAD,
      ]);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false when user has none of the specified roles", () => {
      // Arrange
      const mockUser = {
        id: "123",
        email: "test@example.com",
        role: EUserRole.TEAM_MEMBER,
        name: "Test User",
      };
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(mockUser);

      // Act
      const result = roleGuardUseCase.hasAnyRole([
        EUserRole.ADMIN,
        EUserRole.TEAM_LEAD,
      ]);

      // Assert
      expect(result).toBe(false);
    });

    it("should return false when user is not found", () => {
      // Arrange
      (LocalStorageService.getUser as jest.Mock).mockReturnValue(null);

      // Act
      const result = roleGuardUseCase.hasAnyRole([
        EUserRole.ADMIN,
        EUserRole.TEAM_LEAD,
      ]);

      // Assert
      expect(result).toBe(false);
    });
  });
});
