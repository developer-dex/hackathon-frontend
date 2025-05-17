import { IAuthCredentials, IAuthResponse } from "@/domain/models/auth";
import { IAuthRepository } from "@/infrastructure/repositories/interfaces/repositories/auth.interface";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: IAuthCredentials): Promise<IAuthResponse> {
    try {
      const response = await this.authRepository.login(credentials);
      // If login failed, return default error response
      if (!response) {
        console.error("Authentication failed");
        return {
          user: {
            id: "",
            email: "",
            name: "",
            role: "",
          },
          token: "",
          message: "Authentication failed",
        };
      }

      // Store auth data using LocalStorageService
      LocalStorageService.setAuthToken(response.token);
      LocalStorageService.setUser(response.user);

      return response;
    } catch (error) {
      // Log the error but return default response instead of propagating
      console.error("Login use case error:", error);
      return {
        user: {
          id: "",
          email: "",
          name: "",
          role: "",
        },
        token: "",
        message: "Login failed",
      };
    }
  }
}
