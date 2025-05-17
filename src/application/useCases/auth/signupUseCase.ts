import { ISignupRequest, ISignupResponse } from "@/domain/models/auth";
import { IAuthRepository } from "@/infrastructure/repositories/interfaces/repositories/auth.interface";

export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(signupData: ISignupRequest): Promise<ISignupResponse | null> {
    try {
      const response = await this.authRepository.signup(signupData);

      // If signup failed, return null
      if (!response) {
        console.error("Signup failed");
        return null;
      }

      return response;
    } catch (error) {
      console.error("Signup use case error:", error);
      return null;
    }
  }
}
