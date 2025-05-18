import { ILocalStorageService } from "../interfaces/ILocalStorageService";
import { IUser } from "@/domain/models/auth";

/**
 * Spy for LocalStorageService that tracks method calls and their arguments
 */
export class LocalStorageServiceSpy implements ILocalStorageService {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItemAsync(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getItemAsync(): Promise<string | null> {
    throw new Error("Method not implemented.");
  }

  removeItemAsync(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  setAuthToken(token: string): void {
    this.store["auth_token"] = token;
  }

  getAuthToken(): string | null {
    return this.store["auth_token"] || null;
  }

  removeAuthToken(): void {
    delete this.store["auth_token"];
  }

  setUser(user: IUser): void {
    this.store["user"] = JSON.stringify(user);
  }

  getUser(): IUser | null {
    const userStr = this.store["user"];
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as IUser;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  removeUser(): void {
    delete this.store["user"];
  }

  clearAuth(): void {
    this.removeAuthToken();
    this.removeUser();
  }
}
