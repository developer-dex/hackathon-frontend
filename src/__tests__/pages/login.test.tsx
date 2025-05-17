import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import LoginPage from "@/pages/login";
import { authRepository } from "@/infrastructure/repositories";
import { AuthTestStubs } from "@/test-config/stubs/auth.stubs";
import { IAuthResponse } from "@/domain/models/auth";
import "@testing-library/jest-dom";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

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
    query: {},
  };
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  const renderLoginPage = () => {
    return render(<LoginPage setUser={mockSetUser} />);
  };

  describe("Successful Login Flow", () => {
    it("should successfully login and redirect to home page", async () => {
      // Mock the repository's login method to return our test response
      mockedAuthRepository.login.mockResolvedValueOnce(
        AuthTestStubs.successfulLoginResponse
      );

      renderLoginPage();

      // Fill in login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: AuthTestStubs.validCredentials.email },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: AuthTestStubs.validCredentials.password },
      });

      // Submit form
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      // Verify Loading State
      const submitButton = screen
        .getAllByRole("button")
        .find(
          (btn) => btn.getAttribute("type") === "submit"
        ) as HTMLButtonElement;
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();

      // Verify Repository Call
      await waitFor(() => {
        expect(mockedAuthRepository.login).toHaveBeenCalledWith(
          AuthTestStubs.validCredentials
        );
      });

      // Verify Storage
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "auth_token",
          AuthTestStubs.successfulLoginResponse.token
        );
      });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "user",
          JSON.stringify(AuthTestStubs.mockUser)
        );
      });

      // Verify State Update
      await waitFor(() => {
        expect(mockSetUser).toHaveBeenCalledWith(AuthTestStubs.mockUser);
      });

      // Verify Navigation
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("Error Handling", () => {
    it("should display error message on invalid credentials", async () => {
      // Mock the repository to throw an error for invalid credentials
      mockedAuthRepository.login.mockRejectedValueOnce(
        AuthTestStubs.invalidCredentialsError
      );

      renderLoginPage();

      // Fill in login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: AuthTestStubs.invalidCredentials.email },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: AuthTestStubs.invalidCredentials.password },
      });

      // Submit form
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      // Wait for error message
      await waitFor(() => {
        expect(
          screen.getByText(AuthTestStubs.invalidCredentialsError.message)
        ).toBeInTheDocument();
      });

      // Verify no redirect occurred
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("should handle network errors gracefully", async () => {
      // Mock the repository to throw a network error
      mockedAuthRepository.login.mockRejectedValueOnce(
        AuthTestStubs.networkError
      );

      renderLoginPage();

      // Fill in login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: AuthTestStubs.validCredentials.email },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: AuthTestStubs.validCredentials.password },
      });

      // Submit form
      fireEvent.click(screen.getByRole("button", { name: /login/i }));

      // Wait for error message
      await waitFor(() => {
        expect(
          screen.getByText(AuthTestStubs.networkError.message)
        ).toBeInTheDocument();
      });

      // Verify no redirect occurred
      expect(mockRouter.push).not.toHaveBeenCalled();
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
      // Create a promise that we can resolve later
      let resolveLogin: (value: IAuthResponse) => void;
      const loginPromise = new Promise<IAuthResponse>((resolve) => {
        resolveLogin = resolve;
      });

      mockedAuthRepository.login.mockReturnValueOnce(loginPromise);

      renderLoginPage();

      // Fill in login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: AuthTestStubs.validCredentials.email },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: AuthTestStubs.validCredentials.password },
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
      resolveLogin!(AuthTestStubs.successfulLoginResponse);

      // Wait for loading state to clear
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /login/i })
        ).not.toBeDisabled();
      });
    });
  });
});
