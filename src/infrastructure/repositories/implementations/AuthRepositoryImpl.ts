import {
  IAuthCredentials,
  IAuthResponse,
  ISignupRequest,
  EUserRole,
} from "@/domain/models/auth";
import { IAuthRepository } from "@/infrastructure/repositories/interfaces/repositories/auth.interface";

// For now, we'll use dummy data since we don't have a real API
const CMOCK_USERS = [
  {
    id: "1",
    email: "techlead@example.com",
    name: "Tech Lead",
    role: EUserRole.TECH_LEAD,
  },
  {
    id: "2",
    email: "member@example.com",
    name: "Team Member",
    role: EUserRole.TEAM_MEMBER,
  },
];

/**
 * Implementation of the AuthRepository interface
 * Currently uses mock data, but can be updated to use a real API
 */
export class AuthRepositoryImpl implements IAuthRepository {
  private apiUrl = "/api/auth"; // This would be your actual API endpoint

  /**
   * Authenticates a user with provided credentials
   * @param credentials User's email and password
   * @returns Authentication response containing user and token
   */
  login(credentials: IAuthCredentials): Promise<IAuthResponse> {
    try {
      // In a real implementation, this would be an actual API call
      // const response = await axios.post(`${this.apiUrl}/login`, credentials);
      // return response.data;

      // Mock implementation for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = CMOCK_USERS.find((u) => u.email === credentials.email);
          if (user && credentials.password === "password") {
            // Simple mock check
            resolve({
              user,
              token: "mock-jwt-token",
            });
          } else {
            reject(new Error("Invalid credentials"));
          }
        }, 500); // Simulate network delay
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Registers a new user with the provided data
   * @param signupData User registration data
   * @returns Authentication response for the new user
   */
  signup(signupData: ISignupRequest): Promise<IAuthResponse> {
    try {
      // In a real implementation, this would be an actual API call
      // const response = await axios.post(`${this.apiUrl}/signup`, signupData);
      // return response.data;

      // Mock implementation for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = {
            id: Math.random().toString(36).substring(7), // Generate random ID
            email: signupData.email,
            name: signupData.name,
            role: signupData.role,
          };

          resolve({
            user: newUser,
            token: "mock-jwt-token",
          });
        }, 500); // Simulate network delay
      });
    } catch (error) {
      throw error;
    }
  }
}
