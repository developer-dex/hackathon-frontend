import { IAuthResponse, ISignupRequest } from "@/domain/models/auth";
import { IAuthRepository } from "@/infrastructure/repositories/interfaces/repositories/auth.interface";

export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(signupData: ISignupRequest): Promise<IAuthResponse> {
    try {
      const response = await this.authRepository.signup(signupData);

      // Store auth data in localStorage for persistence
      if (typeof window !== "undefined") {
        if (response.token) {
          localStorage.setItem("authToken", response.token);
        }

        // Store user data for the checkAuthUseCase to access
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}
