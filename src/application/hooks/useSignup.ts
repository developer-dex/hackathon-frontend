import { useState } from "react";
import { useRouter } from "next/router";
import { ISignupRequest } from "@/domain/models/auth";
import { authUseCase } from "@/application/useCases";
import { toastInfo, toastError } from "@/application/utils/toast";

/**
 * Hook for handling user signup
 * @returns Object containing signup handler, loading state, and error state
 */
export const useSignup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (signupData: ISignupRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authUseCase.signup.execute(signupData);

      if (response) {
        // Show toast notification with the verification message
        toastInfo(
          response.message ||
            "User registered successfully. Please wait for admin approval before logging in."
        );

        // Redirect to login page after successful signup
        router.push("/login");
      } else {
        console.error("Signup response missing data");
        toastError("Registration failed. Please try again later.");
        setError("Unable to complete registration. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);

      toastError("Signup failed. Please check your information and try again.");

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSignup,
    isLoading,
    error,
  };
};
