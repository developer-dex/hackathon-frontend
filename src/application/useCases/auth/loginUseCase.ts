import {
  IAuthCredentials,
  IAuthResponse,
  EUserRole,
} from "@/domain/models/auth";
import { IAuthRepository } from "@/infrastructure/repositories/interfaces/repositories/auth.interface";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: IAuthCredentials): Promise<IAuthResponse> {
    try {
      const response = await this.authRepository.login(credentials);

      // Validate response before proceeding
      if (!response || !response.user || !response.token) {
        console.error("Invalid authentication response received");
        return this.getFallbackAuthResponse();
      }

      // Store auth data in localStorage for persistence
      if (typeof window !== "undefined") {
        try {
          if (response.token) {
            localStorage.setItem("authToken", response.token);
          }

          // Store user data for the checkAuthUseCase to access
          localStorage.setItem("user", JSON.stringify(response.user));
        } catch (storageError) {
          // Log but don't throw so authentication can still proceed
          console.error(
            "Failed to store auth data in localStorage:",
            storageError
          );
        }
      }

      return response;
    } catch (error) {
      console.error("Login use case error:", error);
      return this.getFallbackAuthResponse();
    }
  }

  /**
   * Provides a fallback authentication response for error cases
   * @returns A minimal valid IAuthResponse
   */
  private getFallbackAuthResponse(): IAuthResponse {
    return {
      user: {
        id: "guest",
        email: "guest@example.com",
        name: "Guest User",
        role: EUserRole.TEAM_MEMBER,
      },
      token: "invalid-token",
    };
  }
}
