import { IUser } from "@/domain/models/auth";

export interface ILocalStorageService {
  setAuthToken(token: string): void;
  getAuthToken(): string | null;
  removeAuthToken(): void;
  setUser(user: IUser): void;
  getUser(): IUser | null;
  removeUser(): void;
  clearAuth(): void;
}
