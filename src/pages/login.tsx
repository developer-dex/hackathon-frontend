import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import AuthLayout from "@/components/templates/AuthLayout";
import LoginForm from "@/components/organisms/LoginForm";
import { IAuthCredentials, IUser } from "@/domain/models/auth";
import { authUseCase } from "@/application/useCases";
import { toastSuccess, toastError } from "@/application/utils/toast";

interface ILoginPageProps {
  setUser: (user: IUser) => void;
}

const LoginPage: NextPage<ILoginPageProps> = ({ setUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string>("/");

  // Get redirect path from URL query parameter
  useEffect(() => {
    if (
      router.query.redirectTo &&
      typeof router.query.redirectTo === "string"
    ) {
      setRedirectPath(router.query.redirectTo);
    }
  }, [router.query]);

  const handleLogin = async (credentials: IAuthCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authUseCase.login.execute(credentials);

      // Check if response and user are valid
      if (response && response.user) {
        setUser(response.user);

        // Show success toast notification
        toastSuccess(
          `Welcome, ${response.user.name || "User"}! Login successful.`
        );

        // Redirect to the specified path or home page
        router.push(redirectPath);
      } else {
        // Handle case where response exists but doesn't contain expected data
        console.error("Login response missing user data");
        toastError("Login failed. Please try again later.");

        // Set a generic error message
        setError("Unable to complete login. Please try again.");
      }
    } catch (error) {
      // Log the error but don't throw it
      console.error("Login error:", error);

      // Show error toast notification
      toastError("Login failed. Please check your credentials and try again.");

      // Set error message for form display
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | KUDOS App</title>
        <meta
          name="description"
          content="Login to KUDOS App and start recognizing your team members"
        />
      </Head>

      <AuthLayout title="Member Login">
        <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error} />
      </AuthLayout>
    </>
  );
};

export default LoginPage;
