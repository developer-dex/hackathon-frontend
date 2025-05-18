import { LoginUseCase } from "./loginUseCase";
import { IAuthRepository } from "@/infrastructure/repositories/interfaces/repositories/auth.interface";
import { IAuthCredentials, IAuthResponse } from "@/domain/models/auth";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

// Mock only the external LocalStorageService
jest.mock("@/infrastructure/storage/LocalStorageService", () => ({
  LocalStorageService: {
    setAuthToken: jest.fn(),
    setUser: jest.fn(),
  },
}));

// Create a spy for the auth repository
class AuthRepositorySpy implements IAuthRepository {
  login = jest.fn();
  signup = jest.fn();
  logout = jest.fn();
  getUsers = jest.fn();
  updateUserRole = jest.fn();
  updateUserTeam = jest.fn();
  updateUserVerificationStatus = jest.fn();
}

describe("LoginUseCase", () => {
  let authRepository: AuthRepositorySpy;
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    authRepository = new AuthRepositorySpy();
    loginUseCase = new LoginUseCase(authRepository);
    jest.clearAllMocks();
  });

  it("should successfully login and store auth data", async () => {
    // Arrange
    const credentials: IAuthCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    const mockResponse: IAuthResponse = {
      token: "mock-token",
      user: {
        id: "123",
        email: "test@example.com",
        name: "Test User",
        role: "user",
        verificationStatus: "VERIFIED",
      },
    };

    authRepository.login.mockResolvedValue(mockResponse);

    // Act
    const result = await loginUseCase.execute(credentials);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockResponse);
    expect(authRepository.login).toHaveBeenCalledWith(credentials);
    expect(authRepository.login).toHaveBeenCalledTimes(1);
    expect(LocalStorageService.setAuthToken).toHaveBeenCalledWith(
      mockResponse.token
    );
    expect(LocalStorageService.setUser).toHaveBeenCalledWith(mockResponse.user);
  });

  it("should throw an error when login fails", async () => {
    // Arrange
    const credentials: IAuthCredentials = {
      email: "test@example.com",
      password: "wrong-password",
    };

    authRepository.login.mockResolvedValue(null);

    // Act & Assert
    await expect(loginUseCase.execute(credentials)).rejects.toThrow(
      "Authentication failed"
    );
    expect(authRepository.login).toHaveBeenCalledWith(credentials);
    expect(authRepository.login).toHaveBeenCalledTimes(1);
    expect(LocalStorageService.setAuthToken).not.toHaveBeenCalled();
    expect(LocalStorageService.setUser).not.toHaveBeenCalled();
  });

  it("should throw an error when repository throws an error", async () => {
    // Arrange
    const credentials: IAuthCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    const errorMessage = "Network error";
    authRepository.login.mockRejectedValue(new Error(errorMessage));

    // Act & Assert
    await expect(loginUseCase.execute(credentials)).rejects.toThrow(
      errorMessage
    );
    expect(authRepository.login).toHaveBeenCalledWith(credentials);
    expect(authRepository.login).toHaveBeenCalledTimes(1);
    expect(LocalStorageService.setAuthToken).not.toHaveBeenCalled();
    expect(LocalStorageService.setUser).not.toHaveBeenCalled();
  });
});
