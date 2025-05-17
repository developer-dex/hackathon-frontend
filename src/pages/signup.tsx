import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import AuthLayout from "@/components/templates/AuthLayout";
import SignupForm from "@/components/organisms/SignupForm";
import { ISignupRequest, IUser } from "@/domain/models/auth";
import { authUseCase } from "@/application/useCases";
import { toastSuccess, toastError } from "@/application/utils/toast";

interface ISignupPageProps {
  setUser: (user: IUser) => void;
}

const SignupPage: NextPage<ISignupPageProps> = ({ setUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (signupData: ISignupRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authUseCase.signup.execute(signupData);

      // Check if response and user are valid
      if (response && response.user) {
        setUser(response.user);

        // Show success toast notification
        toastSuccess(
          `Account created successfully. Welcome, ${
            response.user.name || "User"
          }!`
        );
      } else {
        // Handle case where response exists but doesn't contain expected data
        console.error("Signup response missing user data");
        toastError("Registration failed. Please try again later.");

        // Set a generic error message
        setError("Unable to complete registration. Please try again.");
      }

      // Always redirect to home page after attempt, successful or not
      router.push("/");
    } catch (error) {
      // Log the error but don't throw it
      console.error("Signup error:", error);

      // Show error toast notification
      toastError("Signup failed. Please check your information and try again.");

      // Set error message for form display
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during signup. Please try again.");
      }

      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | KUDOS App</title>
        <meta
          name="description"
          content="Create an account on KUDOS App and start recognizing your team members"
        />
      </Head>

      <AuthLayout title="Create Account">
        <SignupForm
          onSignup={handleSignup}
          isLoading={isLoading}
          error={error}
        />
      </AuthLayout>
    </>
  );
};

export default SignupPage;
