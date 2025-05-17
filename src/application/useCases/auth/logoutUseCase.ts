import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

export class LogoutUseCase {
  execute(): boolean {
    try {
      // Use LocalStorageService for consistent behavior
      LocalStorageService.clearAuth();
      return true;
    } catch (error) {
      // Log the error but don't throw
      console.error("Error during logout:", error);
      return false;
    }
  }
}
