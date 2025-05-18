import { ApproveUserUseCase } from "./approveUserUseCase";
import { IAdminRepository } from "@/infrastructure/repositories/interfaces/repositories/admin.interface";
import { IUser, EVerificationStatus } from "@/domain/models/auth";

// Create a spy for the admin repository
class AdminRepositorySpy implements IAdminRepository {
  updateUserVerificationStatus = jest.fn();
  getUsers = jest.fn();
  updateUserRole = jest.fn();
  updateUserTeam = jest.fn();
}

describe("ApproveUserUseCase", () => {
  let adminRepository: AdminRepositorySpy;
  let approveUserUseCase: ApproveUserUseCase;

  beforeEach(() => {
    adminRepository = new AdminRepositorySpy();
    approveUserUseCase = new ApproveUserUseCase(adminRepository);
    jest.clearAllMocks();
  });

  it("should successfully approve a user", async () => {
    // Arrange
    const userId = "test-user-id";
    const mockUser: IUser = {
      id: userId,
      email: "test@example.com",
      name: "Test User",
      role: "user",
      verificationStatus: EVerificationStatus.VERIFIED,
    };
    adminRepository.updateUserVerificationStatus.mockResolvedValue(mockUser);

    // Act
    const result = await approveUserUseCase.execute(userId);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(mockUser);
    expect(adminRepository.updateUserVerificationStatus).toHaveBeenCalledWith(
      userId,
      EVerificationStatus.VERIFIED
    );
    expect(adminRepository.updateUserVerificationStatus).toHaveBeenCalledTimes(
      1
    );
  });

  it("should handle repository errors gracefully", async () => {
    // Arrange
    const userId = "test-user-id";
    const errorMessage = "Repository error";
    adminRepository.updateUserVerificationStatus.mockRejectedValue(
      new Error(errorMessage)
    );

    // Act & Assert
    await expect(approveUserUseCase.execute(userId)).rejects.toThrow(
      `Failed to approve user: ${errorMessage}`
    );
    expect(adminRepository.updateUserVerificationStatus).toHaveBeenCalledWith(
      userId,
      EVerificationStatus.VERIFIED
    );
    expect(adminRepository.updateUserVerificationStatus).toHaveBeenCalledTimes(
      1
    );
  });

  it("should handle null response from repository", async () => {
    // Arrange
    const userId = "test-user-id";
    adminRepository.updateUserVerificationStatus.mockResolvedValue(null);

    // Act
    const result = await approveUserUseCase.execute(userId);

    // Assert
    expect(result).toBeNull();
    expect(adminRepository.updateUserVerificationStatus).toHaveBeenCalledWith(
      userId,
      EVerificationStatus.VERIFIED
    );
    expect(adminRepository.updateUserVerificationStatus).toHaveBeenCalledTimes(
      1
    );
  });
});
