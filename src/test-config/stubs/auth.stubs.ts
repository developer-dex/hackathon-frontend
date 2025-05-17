import {
  IAuthCredentials,
  IAuthResponse,
  IUser,
  EUserRole,
} from "@/domain/models/auth";

export class AuthTestStubs {
  // Mock user data
  static readonly mockUser: IUser = {
    id: "1",
    email: "test@example.com",
    name: "Test User",
    role: EUserRole.TEAM_MEMBER,
  };

  // Mock credentials
  static readonly validCredentials: IAuthCredentials = {
    email: "test@example.com",
    password: "password123",
  };

  static readonly invalidCredentials: IAuthCredentials = {
    email: "test@example.com",
    password: "wrongpassword",
  };

  // Mock responses
  static readonly successfulLoginResponse: IAuthResponse = {
    user: this.mockUser,
    token: "mock-token",
  };

  // Mock errors
  static readonly networkError = new Error("Network error");
  static readonly invalidCredentialsError = new Error(
    "Invalid email or password"
  );
  static readonly serverError = new Error("Server error occurred");

  // Helper methods to get mock data
  static getMockUser(overrides?: Partial<IUser>): IUser {
    return { ...this.mockUser, ...overrides };
  }

  static getValidCredentials(
    overrides?: Partial<IAuthCredentials>
  ): IAuthCredentials {
    return { ...this.validCredentials, ...overrides };
  }

  static getInvalidCredentials(
    overrides?: Partial<IAuthCredentials>
  ): IAuthCredentials {
    return { ...this.invalidCredentials, ...overrides };
  }

  static getSuccessfulLoginResponse(
    overrides?: Partial<IAuthResponse>
  ): IAuthResponse {
    return { ...this.successfulLoginResponse, ...overrides };
  }
}
