export class LogoutUseCase {
  execute(): boolean {
    if (typeof window !== "undefined") {
      // Clear all auth-related data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return true;
    }
    return false;
  }
}
