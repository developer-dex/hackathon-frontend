export class LogoutUseCase {
  execute(): boolean {
    if (typeof window !== "undefined") {
      try {
        // Clear all auth-related data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        return true;
      } catch (error) {
        // Log the error but don't throw
        console.error("Error during logout:", error);
        return false;
      }
    }
    return false;
  }
}
