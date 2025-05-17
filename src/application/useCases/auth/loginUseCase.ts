import { IAuthCredentials, IAuthResponse } from "@/domain/models/auth";
import { IAuthRepository } from "@/infrastructure/repositories/interfaces/repositories/auth.interface";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: IAuthCredentials): Promise<IAuthResponse> {
    try {
      const response = await this.authRepository.login(credentials);
      // If login failed, throw an error
      if (!response) {
        throw new Error("Authentication failed");
      }

      // Store auth data using LocalStorageService
      LocalStorageService.setAuthToken(response.token);
      LocalStorageService.setUser(response.user);

      return response;
    } catch (error) {
      // Propagate the error instead of returning a default response
      throw error;
    }
  }
}
