import {
  IAuthCredentials,
  IAuthResponse,
  ISignupRequest,
  IApiResponse,
  EUserRole,
  EVerificationStatus,
} from "@/domain/models/auth";
import { IAuthRepository } from "@/infrastructure/repositories/interfaces/repositories/auth.interface";
import { LocalStorageService } from "@/infrastructure/storage/LocalStorageService";

interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponseDTO {
  user: UserDTO;
  token: string;
}

/**
 * Implementation of the AuthRepository interface
 */
export class AuthRepositoryImpl implements IAuthRepository {
  private readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  /**
   * Authenticates a user with provided credentials
   * @param credentials User's email and password
   * @returns Authentication response containing user and token or null if authentication fails
   */
  async login(credentials: IAuthCredentials): Promise<IAuthResponse | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const responseData =
        (await response.json()) as IApiResponse<AuthResponseDTO>;

      // Check if the response has the expected structure
      if (!responseData.success) {
        console.error("Invalid response format from login API:", responseData);
        return null;
      }

      const { user, token } = responseData.data;

      console.log("User:", user);

      // Map the user data from API response to our domain model
      const mappedUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as EUserRole,
        department: user.department,
        verificationStatus: user.verificationStatus as EVerificationStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return {
        user: mappedUser,
        token: token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  }

  /**
   * Registers a new user with the provided data
   * @param signupData User registration data
   * @returns Authentication response for the new user or null if registration fails
   */
  async signup(signupData: ISignupRequest): Promise<IAuthResponse | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const responseData =
        (await response.json()) as IApiResponse<AuthResponseDTO>;
      console.log("Signup response data:", responseData);

      // Check if the response has the expected structure
      if (!responseData.success) {
        console.error("Invalid response format from signup API:", responseData);
        return null;
      }

      const { user, token } = responseData.data;

      // Map the user data from API response to our domain model
      const mappedUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as EUserRole,
        department: user.department,
        verificationStatus: user.verificationStatus as EVerificationStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      // Store auth data using LocalStorageService
      LocalStorageService.setAuthToken(token);
      LocalStorageService.setUser(mappedUser);

      return {
        user: mappedUser,
        token: token,
      };
    } catch (error) {
      console.error("Signup error:", error);
      return null;
    }
  }
}
