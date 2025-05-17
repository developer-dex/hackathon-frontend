import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import LoginPage from "../login";
import { authRepository } from "@/infrastructure/repositories";
import {
  IAuthCredentials,
  IUser,
  IAuthResponse,
  EUserRole,
} from "@/domain/models/auth";
import "@testing-library/jest-dom";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock auth repository
jest.mock(
  "@/infrastructure/repositories/implementations/AuthRepositoryImpl",
  () => {
    return {
      AuthRepositoryImpl: jest.fn().mockImplementation(() => ({
        login: jest.fn(),
      })),
    };
  }
);

// Type the mocked repository
const mockedAuthRepository = authRepository as jest.Mocked<
  typeof authRepository
>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("LoginPage Integration Tests", () => {
  const mockRouter = {
    push: jest.fn(),
  };
  const mockSetUser = jest.fn();
  const mockUser: IUser = {
    id: "1",
    email: "test@example.com",
    name: "Test User",
    role: EUserRole.TEAM_MEMBER,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const renderLoginPage = () => {
    return render(<LoginPage setUser={mockSetUser} />);
  };

  describe("Successful Login Flow", () => {
    it("should successfully login and redirect to home page", async () => {
      // ===== ARRANGE =====
      // Set up test data and mocks
      const mockCredentials: IAuthCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResponse: IAuthResponse = {
        user: mockUser,
        token: "mock-token",
      };

      // Mock the repository's login method to return our test response
      mockedAuthRepository.login.mockResolvedValueOnce(mockResponse);

      // Render the login page component
      renderLoginPage();

      // ===== ACT =====
      // Simulate user interactions
      // 1. Fill in the email field
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockCredentials.email },
      });

      // 2. Fill in the password field
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: mockCredentials.password },
      });

      // 3. Submit the form
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      // ===== ASSERT =====
      // 1. Verify Loading State
      // Check that the submit button is disabled during the login process
      const submitButton = screen
        .getAllByRole("button")
        .find(
          (btn) => btn.getAttribute("type") === "submit"
        ) as HTMLButtonElement;
      expect(submitButton).toBeDisabled();

      // Verify that the loading spinner is shown
      expect(screen.getByRole("progressbar")).toBeInTheDocument();

      // 2. Verify Repository Call
      // Ensure the repository's login method was called with the correct credentials
      await waitFor(() => {
        expect(mockedAuthRepository.login).toHaveBeenCalledWith(
          mockCredentials
        );
      });

      // 3. Verify Storage
      // Check that the auth token was stored in localStorage
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "auth_token",
          "mock-token"
        );
      });

      // Check that the user data was stored in localStorage
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "user",
          JSON.stringify(mockUser)
        );
      });

      // 4. Verify State Update
      // Ensure the user state was updated with the correct user data
      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      });

      // 5. Verify Navigation
      // Check that the user was redirected to the home page
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("Error Handling", () => {
    it("should display error message on invalid credentials", async () => {
      // Arrange
      const mockCredentials: IAuthCredentials = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      // Mock the repository to throw an error for invalid credentials
      mockedAuthRepository.login.mockRejectedValueOnce(
        new Error("Invalid email or password")
      );

      renderLoginPage();

      // Act
      // Fill in login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockCredentials.email },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: mockCredentials.password },
      });

      // Submit form
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      // Assert
      // Wait for error message
      await waitFor(() => {
        expect(
          screen.getByText("Invalid email or password")
        ).toBeInTheDocument();
      });

      // Verify no redirect occurred
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("should handle network errors gracefully", async () => {
      const mockCredentials: IAuthCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      // Mock the repository to throw an error
      mockedAuthRepository.login.mockRejectedValueOnce(
        new Error("Network error")
      );

      renderLoginPage();

      // Fill in login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockCredentials.email },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: mockCredentials.password },
      });

      // Submit form
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });

      // Verify no redirect occurred
      // expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("Form Validation", () => {
    it("should validate required fields", async () => {
      renderLoginPage();

      // Submit form without filling fields
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      // Verify validation messages
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();

      // Verify no API call was made
      expect(mockedAuthRepository.login).not.toHaveBeenCalled();
    });

    it("should validate email format", async () => {
      renderLoginPage();

      // Enter invalid email
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "invalid-email" },
      });

      // Submit form
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      // Verify validation message
      expect(screen.getByText("Email address is invalid")).toBeInTheDocument();

      // Verify no API call was made
      expect(mockedAuthRepository.login).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should show loading state during login attempt", async () => {
      const mockCredentials: IAuthCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      // Create a promise that we can resolve later
      let resolveLogin: (value: IAuthResponse) => void;
      const loginPromise = new Promise<IAuthResponse>((resolve) => {
        resolveLogin = resolve;
      });

      mockedAuthRepository.login.mockReturnValueOnce(loginPromise);

      renderLoginPage();

      // Fill in login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: mockCredentials.email },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: mockCredentials.password },
      });

      // Submit form
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      // Verify loading state
      const submitButton = screen
        .getAllByRole("button")
        .find(
          (btn) => btn.getAttribute("type") === "submit"
        ) as HTMLButtonElement;
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();

      // Resolve the login promise
      resolveLogin!({ user: mockUser, token: "mock-token" });

      // Wait for loading state to clear
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /login/i })
        ).not.toBeDisabled();
      });
    });
  });
});
