import { SignupUseCase } from "./signupUseCase";
import { AuthRepositoryImpl } from "@/infrastructure/repositories/implementations/AuthRepositoryImpl";
import {
  ISignupRequest,
  EUserRole,
  EVerificationStatus,
} from "@/domain/models/auth";

// Mock only the fetch API since it's external
global.fetch = jest.fn();

describe("SignupUseCase", () => {
  let signupUseCase: SignupUseCase;
  let authRepository: AuthRepositoryImpl;

  beforeEach(() => {
    authRepository = new AuthRepositoryImpl();
    signupUseCase = new SignupUseCase(authRepository);
    jest.clearAllMocks();
  });

  const mockSignupData: ISignupRequest = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
    role: EUserRole.TEAM_MEMBER,
  };

  const mockSignupResponse = {
    id: "123",
    name: "Test User",
    email: "test@example.com",
    role: EUserRole.TEAM_MEMBER,
    verificationStatus: EVerificationStatus.PENDING,
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-20T10:00:00Z",
    team: undefined,
    message: "User registered successfully",
  };

  it("should successfully sign up a user", async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: mockSignupResponse,
          message: "User registered successfully",
        }),
    });

    // Act
    const result = await signupUseCase.execute(mockSignupData);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockSignupResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/auth/signup"),
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockSignupData),
      })
    );
  });

  it("should return null when signup fails", async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: false,
          message: "Signup failed",
        }),
    });

    // Act
    const result = await signupUseCase.execute(mockSignupData);

    // Assert
    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalled();
  });

  it("should return null when API request fails", async () => {
    // Arrange
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    // Act
    const result = await signupUseCase.execute(mockSignupData);

    // Assert
    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalled();
  });

  it("should handle invalid response format", async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          // Missing required fields
          success: true,
          message: "Invalid response",
        }),
    });

    // Act
    const result = await signupUseCase.execute(mockSignupData);

    // Assert
    expect(result).toBeNull();
    expect(global.fetch).toHaveBeenCalled();
  });
});
